const fs = require('node:fs');
const path = require('node:path');
const { expect } = require('@playwright/test');

const DATA_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'test-data',
  'fr-05.json',
);

function loadFr05Data() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function getDataset(collection, datasetId) {
  const dataset = collection.find((item) => item.datasetId === datasetId);
  if (!dataset) {
    throw new Error(`Missing external dataset: ${datasetId}`);
  }
  return dataset;
}

async function openHome(page) {
  const initialResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      url.pathname === '/api/products' &&
      (url.searchParams.get('search') || '') === ''
    );
  });

  await page.goto('/');
  await initialResponse;
}

async function submitSearch(page, keyword) {
  const searchResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      response.request().method() === 'GET' &&
      url.pathname === '/api/products' &&
      url.searchParams.get('search') === keyword
    );
  });

  await page.getByPlaceholder('Tìm kiếm...').fill(keyword);
  await page.getByRole('button', { name: 'Tìm', exact: true }).click();
  await searchResponse;
}

function getProductHeading(page, productName) {
  return page
    .getByRole('main')
    .getByRole('heading', { level: 2, name: productName, exact: true });
}

function getProductCardByName(page, productName) {
  return getProductHeading(page, productName).locator('..');
}

function getProductPrice(card) {
  return card.locator('p').filter({ hasText: /\d/ });
}

function getProductHeadings(page) {
  return page.getByRole('main').getByRole('heading', { level: 2 });
}

async function getProductListing(page, anchorProductNames) {
  const [firstName, secondName] = anchorProductNames;
  const firstCard = getProductCardByName(page, firstName);
  const secondCard = getProductCardByName(page, secondName);

  await expect(firstCard).toHaveCount(1);
  await expect(secondCard).toHaveCount(1);

  const listing = firstCard.locator('..');
  await expect(
    listing.getByRole('heading', {
      level: 2,
      name: secondName,
      exact: true,
    }),
  ).toHaveCount(1);

  return listing;
}

function getKeywordRegion(page) {
  return page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: /^\s*Kết quả tìm kiếm cho:/ })
    .filter({ has: page.locator('span') });
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertThousandsGrouped(displayedText, rawPrice, groupingConfig) {
  const rawDigits = String(rawPrice);
  const candidates = groupingConfig.allowedSeparators.flatMap((separator) => {
    const escapedSeparator = escapeForRegex(separator);
    const groupedPricePattern = new RegExp(
      `\\d{1,3}${escapedSeparator}\\d{3}(?:${escapedSeparator}\\d{3})*`,
      'gu',
    );

    return displayedText.match(groupedPricePattern) || [];
  });
  const displayedPrice = candidates.find((candidate) => {
    const separator = groupingConfig.allowedSeparators.find((value) =>
      candidate.includes(value),
    );

    return separator && candidate.split(separator).join('') === rawDigits;
  });

  expect(displayedPrice).toBeDefined();
  expect(displayedPrice).not.toBe(rawDigits);

  const separator = groupingConfig.allowedSeparators.find((value) =>
    displayedPrice.includes(value),
  );
  expect(separator).toBeDefined();

  const groupedPattern = new RegExp(
    `^\\d{1,3}${escapeForRegex(separator)}\\d{3}(?:${escapeForRegex(separator)}\\d{3})*$`,
    'u',
  );

  expect(displayedPrice).toMatch(groupedPattern);
  expect(displayedPrice.replace(/\D/gu, '')).toBe(rawDigits);
}

async function controlledProductSearchResponse(page, setup) {
  const routePattern = '**/api/products?*';
  const handler = async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isControlledSearch =
      request.method() === setup.requestMethod &&
      url.pathname === setup.requestPath &&
      (!setup.requestMatch.requiresSearchQuery ||
        (url.searchParams.has('search') &&
          url.searchParams.get('search') !== ''));

    if (!isControlledSearch) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(setup.responseBody),
    });
  };

  await page.route(routePattern, handler);
  return async () => page.unroute(routePattern, handler);
}

function observeDialogs(page) {
  const messages = [];
  const listener = async (dialog) => {
    messages.push(dialog.message());
    await dialog.dismiss();
  };

  page.on('dialog', listener);

  return {
    messages,
    dispose: () => page.off('dialog', listener),
  };
}

module.exports = {
  assertThousandsGrouped,
  controlledProductSearchResponse,
  getDataset,
  getKeywordRegion,
  getProductCardByName,
  getProductHeading,
  getProductHeadings,
  getProductListing,
  getProductPrice,
  loadFr05Data,
  observeDialogs,
  openHome,
  submitSearch,
};
