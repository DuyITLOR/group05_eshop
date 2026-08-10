const fs = require('node:fs');
const path = require('node:path');
const { expect } = require('@playwright/test');

const DATA_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'test-data',
  'fr-09.json',
);

function loadFr09Data() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function getDataset(data, dataId) {
  const dataset = data.datasets.find((item) => item.dataId === dataId);
  if (!dataset) {
    throw new Error(`Missing external dataset: ${dataId}`);
  }
  return dataset;
}

function getCouponInput(page) {
  return page.getByPlaceholder('Nhập mã giảm giá...');
}

function getApplyButton(page) {
  return page.getByRole('button', { name: 'Áp dụng', exact: true });
}

function getDiscountLine(page) {
  return page.getByRole('main').getByText(/^Tiết kiệm:/u);
}

function getFinalAmountLine(page) {
  return page.getByRole('main').getByText(/^Thành tiền:/u);
}

function getPayableTotalLine(page) {
  return page
    .getByRole('main')
    .locator('span')
    .filter({ hasText: /^\s*Tổng thanh toán:/u });
}

function getCheckoutTotalInput(page) {
  return page.getByRole('main').getByRole('spinbutton');
}

function parseDisplayedAmount(displayedText) {
  const normalized = displayedText
    .normalize('NFKC')
    .replace(/[\u00a0\u202f]/gu, ' ');
  const candidates = normalized.match(/\d[\d., ]*/gu) || [];
  const values = candidates
    .map((candidate) => candidate.replace(/\D/gu, ''))
    .filter(Boolean);

  if (values.length !== 1) {
    throw new Error(
      `Expected exactly one monetary value in ${JSON.stringify(displayedText)}, found ${values.length}.`,
    );
  }

  const amount = Number(values[0]);
  if (!Number.isSafeInteger(amount)) {
    throw new Error(`Displayed amount is not a safe integer: ${values[0]}`);
  }

  return amount;
}

async function expectDisplayedAmount(locator, expectedAmount) {
  await expect(locator).toHaveCount(1);
  await expect(locator).toBeVisible();
  expect(parseDisplayedAmount(await locator.innerText())).toBe(expectedAmount);
}

async function waitForInitialProducts(page) {
  return page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      url.pathname === '/api/products' &&
      (url.searchParams.get('search') || '') === ''
    );
  });
}

async function openHome(page, { expectAuthenticated = false } = {}) {
  const productsResponse = waitForInitialProducts(page);
  const userResponse = expectAuthenticated
    ? page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          response.request().method() === 'GET' &&
          url.pathname === '/api/users/me'
        );
      })
    : null;

  await page.goto('/');
  const productResult = await productsResponse;
  expect(productResult.ok()).toBe(true);

  if (userResponse) {
    const authResult = await userResponse;
    expect(authResult.ok()).toBe(true);
    await expect(page.locator('a[href="/profile"]')).toBeVisible();
  }
}

function getProductCard(page, productName) {
  return page
    .getByRole('main')
    .getByRole('heading', { level: 2, name: productName, exact: true })
    .locator('..');
}

async function addProductFromHome(page, productName) {
  const card = getProductCard(page, productName);
  await expect(card).toHaveCount(1);
  await card.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click();
}

async function continueFromCartToCheckout(page) {
  await page.getByRole('link', { name: 'Giỏ hàng', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tiến hành thanh toán' })).toBeVisible();
  await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
  await expect(getCouponInput(page)).toBeVisible();
}

async function openAuthenticatedCheckoutWithSeedProduct(page, cartDataset) {
  await openHome(page, { expectAuthenticated: true });
  await addProductFromHome(page, cartDataset.product.name);
  await continueFromCartToCheckout(page);
  await expect(getCheckoutTotalInput(page)).toHaveValue(
    String(cartDataset.expectedTotal),
  );
}

async function installControlledProductRoute(page, cartDataset) {
  const routePattern = '**/api/products?*';
  const handler = async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isInitialCatalogRequest =
      request.method() === 'GET' &&
      url.pathname === '/api/products' &&
      (url.searchParams.get('search') || '') === '';

    if (!isInitialCatalogRequest) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([cartDataset.controlledProduct]),
    });
  };

  await page.route(routePattern, handler);
  return async () => page.unroute(routePattern, handler);
}

async function openAuthenticatedCheckoutWithControlledTotal(
  page,
  cartDataset,
) {
  const disposeRoute = await installControlledProductRoute(page, cartDataset);
  try {
    await openHome(page, { expectAuthenticated: true });
    await addProductFromHome(page, cartDataset.controlledProduct.name);
    await continueFromCartToCheckout(page);
    await expect(getCheckoutTotalInput(page)).toHaveValue(
      String(cartDataset.expectedTotal),
    );
  } catch (error) {
    await disposeRoute();
    throw error;
  }

  return disposeRoute;
}

async function openUnauthenticatedCheckoutWithSeedProduct(page, cartDataset) {
  await openHome(page);
  await addProductFromHome(page, cartDataset.product.name);
  await page.evaluate(() => {
    window.history.pushState({}, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(getCouponInput(page)).toBeVisible();
  await expect(getCheckoutTotalInput(page)).toHaveValue(
    String(cartDataset.expectedTotal),
  );
}

async function applyCoupon(page, couponCode) {
  const input = getCouponInput(page);
  const button = getApplyButton(page);
  await expect(input).toBeVisible();
  await input.fill(couponCode);
  await expect(button).toBeEnabled();

  const responsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'POST' &&
      url.pathname === '/api/apply-coupon'
    );
  });

  await button.click();
  return responsePromise;
}

async function expectAppliedAmounts(
  page,
  { expectedDiscountAmount, expectedFinalAmount },
) {
  if (expectedDiscountAmount !== undefined) {
    await expectDisplayedAmount(
      getDiscountLine(page),
      expectedDiscountAmount,
    );
  }
  if (expectedFinalAmount !== undefined) {
    await expectDisplayedAmount(
      getFinalAmountLine(page),
      expectedFinalAmount,
    );
    await expectDisplayedAmount(
      getPayableTotalLine(page),
      expectedFinalAmount,
    );
  }
}

async function expectRejectedCoupon(page, expectedOriginalTotal) {
  await expect(getDiscountLine(page)).toHaveCount(0);
  await expect(getFinalAmountLine(page)).toHaveCount(0);
  await expectDisplayedAmount(
    getPayableTotalLine(page),
    expectedOriginalTotal,
  );
}

module.exports = {
  applyCoupon,
  expectAppliedAmounts,
  expectDisplayedAmount,
  expectRejectedCoupon,
  getApplyButton,
  getCheckoutTotalInput,
  getCouponInput,
  getDataset,
  getDiscountLine,
  getFinalAmountLine,
  getPayableTotalLine,
  loadFr09Data,
  openAuthenticatedCheckoutWithControlledTotal,
  openAuthenticatedCheckoutWithSeedProduct,
  openUnauthenticatedCheckoutWithSeedProduct,
  parseDisplayedAmount,
};
