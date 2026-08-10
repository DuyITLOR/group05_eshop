const { test, expect } = require('./fixtures/fr-09-fixtures');
const {
  applyCoupon,
  expectAppliedAmounts,
  expectDisplayedAmount,
  expectRejectedCoupon,
  getApplyButton,
  getCheckoutTotalInput,
  getCouponInput,
  getDataset,
  getPayableTotalLine,
  loadFr09Data,
  openAuthenticatedCheckoutWithControlledTotal,
  openAuthenticatedCheckoutWithSeedProduct,
  openUnauthenticatedCheckoutWithSeedProduct,
} = require('./helpers/fr-09-helpers');

const data = loadFr09Data();
const save10 = getDataset(data, 'FR09-DATA-001');
const bigbuy = getDataset(data, 'FR09-DATA-002');
const vip100 = getDataset(data, 'FR09-DATA-003');
const expired = getDataset(data, 'FR09-DATA-004');
const normalCart = getDataset(data, 'FR09-DATA-005');
const belowMinimumCart = getDataset(data, 'FR09-DATA-006');
const exactMinimumCart = getDataset(data, 'FR09-DATA-007');
const aboveMinimumCart = getDataset(data, 'FR09-DATA-008');
const expirationCart = getDataset(data, 'FR09-DATA-009');
const absentCoupon = getDataset(data, 'FR09-DATA-010');
const inactiveSetup = getDataset(data, 'FR09-SETUP-001');
const usageAtMaxSetup = getDataset(data, 'FR09-SETUP-002');
const usageBelowMaxSetup = getDataset(data, 'FR09-SETUP-003');

test.describe('FR-09 - Discount coupons', () => {
  test('FR09-TC-001 coupon controls support input and apply action', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);

    const input = getCouponInput(page);
    const button = getApplyButton(page);
    await expect(input).toBeVisible();
    await input.fill(save10.code);
    await expect(input).toHaveValue(save10.code);
    await expect(button).toBeEnabled();
    await applyCoupon(page, save10.code);
    await expect(input).toHaveValue(save10.code);
    await expect(button).toBeEnabled();
  });

  test('FR09-TC-002 percent discount_amount is calculated correctly', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, save10.code);
    await expectAppliedAmounts(page, {
      expectedDiscountAmount:
        (normalCart.expectedTotal * save10.discountValue) / 100,
    });
  });

  test('FR09-TC-003 percent final_amount is calculated correctly', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    const expectedDiscount =
      (normalCart.expectedTotal * save10.discountValue) / 100;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, save10.code);
    await expectAppliedAmounts(page, {
      expectedFinalAmount: normalCart.expectedTotal - expectedDiscount,
    });
  });

  test('FR09-TC-004 fixed discount_amount is calculated correctly', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, bigbuy.code);
    await expectAppliedAmounts(page, {
      expectedDiscountAmount: bigbuy.discountValue,
    });
  });

  test('FR09-TC-005 fixed final_amount is calculated correctly', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, bigbuy.code);
    await expectAppliedAmounts(page, {
      expectedFinalAmount: normalCart.expectedTotal - bigbuy.discountValue,
    });
  });

  test('FR09-TC-006 exact minimum total is accepted', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
      page,
      exactMinimumCart,
    );
    try {
      await applyCoupon(page, save10.code);
      const expectedDiscount =
        (exactMinimumCart.expectedTotal * save10.discountValue) / 100;
      await expectAppliedAmounts(page, {
        expectedDiscountAmount: expectedDiscount,
        expectedFinalAmount:
          exactMinimumCart.expectedTotal - expectedDiscount,
      });
    } finally {
      await disposeRoute();
    }
  });

  test('FR09-TC-007 one unit below minimum is rejected', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
      page,
      belowMinimumCart,
    );
    try {
      await applyCoupon(page, save10.code);
      await expectRejectedCoupon(page, belowMinimumCart.expectedTotal);
    } finally {
      await disposeRoute();
    }
  });

  test('FR09-TC-008 above-minimum total is accepted', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
      page,
      aboveMinimumCart,
    );
    try {
      await applyCoupon(page, bigbuy.code);
      await expectAppliedAmounts(page, {
        expectedDiscountAmount: bigbuy.discountValue,
        expectedFinalAmount:
          aboveMinimumCart.expectedTotal - bigbuy.discountValue,
      });
    } finally {
      await disposeRoute();
    }
  });

  test('FR09-TC-009 absent coupon is rejected', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, absentCoupon.code);
    await expectRejectedCoupon(page, normalCart.expectedTotal);
  });

  test('FR09-TC-010 inactive coupon is rejected', async ({
    authenticatedSession,
    isolatedDb,
  }) => {
    const { page } = authenticatedSession;
    const cleanup = await isolatedDb.installInactiveCoupon(inactiveSetup);
    try {
      await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
      await applyCoupon(page, inactiveSetup.coupon.code);
      await expectRejectedCoupon(page, normalCart.expectedTotal);
    } finally {
      await cleanup();
    }
  });

  test('FR09-TC-011 expired coupon is rejected', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
      page,
      expirationCart,
    );
    try {
      await applyCoupon(page, expired.code);
      await expectRejectedCoupon(page, expirationCart.expectedTotal);
    } finally {
      await disposeRoute();
    }
  });

  test('FR09-TC-012 coupon application without valid JWT is rejected', async ({
    page,
  }) => {
    await openUnauthenticatedCheckoutWithSeedProduct(page, normalCart);
    await applyCoupon(page, save10.code);
    await expectRejectedCoupon(page, normalCart.expectedTotal);
  });

  test('FR09-TC-013 unauthenticated user cannot use Checkout coupon flow', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('link', { name: 'EShop', exact: true })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();

    const input = getCouponInput(page);
    const button = getApplyButton(page);
    const inputVisible = await input.isVisible();
    if (inputVisible) {
      await input.fill(save10.code);
    }
    const functionalCouponFlow =
      new URL(page.url()).pathname === '/checkout' &&
      inputVisible &&
      (await button.isVisible()) &&
      (await button.isEnabled());

    expect(functionalCouponFlow).toBe(false);
  });

  test('FR09-TC-014 usage count at maximum is rejected', async ({
    authenticatedSession,
    isolatedDb,
  }) => {
    const { page, user } = authenticatedSession;
    const cleanup = await isolatedDb.setExactUsageCount(
      usageAtMaxSetup,
      user.id,
    );
    try {
      await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
      await applyCoupon(page, save10.code);
      await expectRejectedCoupon(page, usageAtMaxSetup.expectedTotal);
    } finally {
      await cleanup();
    }
  });

  test('FR09-TC-015 usage count below maximum is accepted', async ({
    authenticatedSession,
    isolatedDb,
  }) => {
    const { page, user } = authenticatedSession;
    const cleanup = await isolatedDb.setExactUsageCount(
      usageBelowMaxSetup,
      user.id,
    );
    try {
      await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
      await applyCoupon(page, vip100.code);
      await expectAppliedAmounts(page, {
        expectedDiscountAmount: usageBelowMaxSetup.expectedDiscountAmount,
        expectedFinalAmount: usageBelowMaxSetup.expectedFinalAmount,
      });
    } finally {
      await cleanup();
    }
  });

  test('FR09-TC-016 checkout total is cart-derived and not directly editable', async ({
    authenticatedSession,
  }) => {
    const { page } = authenticatedSession;
    await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);

    const totalInput = getCheckoutTotalInput(page);
    await expect(totalInput).toHaveValue(String(normalCart.expectedTotal));
    await expectDisplayedAmount(
      getPayableTotalLine(page),
      normalCart.expectedTotal,
    );
    await expect(totalInput).not.toBeEditable();
  });
});
