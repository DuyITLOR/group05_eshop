const { test, expect } = require('./fixtures/fr-17-fixtures');
const { installNonAdminSession, openAdmin } = require('./helpers/auth');
const { buildOwnedCoupon, getDataset, loadFr17Data } = require('./helpers/coupon-data');
const {
  expectDuplicateCodeRejected,
  expectOwnedCouponBoundaryValues,
  expectOwnedCouponCore,
  expectRejectedCreate,
  expectVisibleRequiredFieldIndicators,
  fillCouponForm,
  getCouponRow,
  getCouponRows,
  getCouponSection,
  getCouponTab,
  openCouponManagement,
  submitCoupon,
} = require('./helpers/coupon-ui');
const { getAdminBaseUrl } = require('./helpers/runtime-guard');

const data = loadFr17Data();
const seedOracle = getDataset(data, 'FR17-DATA-001');
const requiredFieldOracle = getDataset(data, 'FR17-DATA-002');
const validPercent = getDataset(data, 'FR17-DATA-003');
const validFixed = getDataset(data, 'FR17-DATA-004');
const duplicateCode = getDataset(data, 'FR17-DATA-005');
const missingCode = getDataset(data, 'FR17-DATA-006');
const missingDiscount = getDataset(data, 'FR17-DATA-007');
const zeroDiscount = getDataset(data, 'FR17-DATA-008');
const missingExpiry = getDataset(data, 'FR17-DATA-009');
const missingMinimum = getDataset(data, 'FR17-DATA-010');
const negativeMinimum = getDataset(data, 'FR17-DATA-011');
const missingMaxUses = getDataset(data, 'FR17-DATA-012');
const zeroMaxUses = getDataset(data, 'FR17-DATA-013');
const deleteSetup = getDataset(data, 'FR17-SETUP-001');

async function openAdminCoupons(page) {
  await openAdmin(page);
  await openCouponManagement(page);
}

async function submitInvalidAndAssertAbsent(page, coupon, baselineCount) {
  const response = await submitCoupon(page);
  if (response) await response;
  await expectRejectedCreate(page, baselineCount, coupon.code);
}

async function submitDuplicateAndAssertUnchanged(page, coupon, baselineCount) {
  const response = await submitCoupon(page);
  if (response) await response;
  await expectDuplicateCodeRejected(page, baselineCount, coupon.code);
}

test.describe('FR-17 - Coupon management', () => {
  test('FR17-TC-001 admin sees the complete controlled coupon list', async ({ adminSession }) => {
    const { page } = adminSession;
    await openAdminCoupons(page);
    await expect(getCouponRows(page)).toHaveCount(seedOracle.expectedCount);
    for (const code of seedOracle.expectedCodes) await expect(getCouponRow(page, code)).toHaveCount(1);
  });

  test('FR17-TC-002 all required coupon fields display an associated visible indicator', async ({ adminSession }) => {
    const { page } = adminSession;
    await openAdminCoupons(page);
    await expectVisibleRequiredFieldIndicators(page, requiredFieldOracle.fields);
  });

  test('FR17-TC-003 admin creates a valid percent coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(validPercent, 'FR17-TC-003');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      await expect(getCouponRow(page, coupon.code)).toHaveCount(0);
      await fillCouponForm(page, coupon);
      const response = await submitCoupon(page);
      expect(response, 'A valid percent create must reach the approved create endpoint.').not.toBeNull();
      expect((await response).ok()).toBe(true);
      await expectOwnedCouponCore(page, coupon);
    } finally {
      await isolatedDb.removeOwnedCoupon(coupon.code);
    }
  });

  test('FR17-TC-004 @demo admin creates a valid fixed coupon at lower valid boundaries', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(validFixed, 'FR17-TC-004');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      await expect(getCouponRow(page, coupon.code)).toHaveCount(0);
      await fillCouponForm(page, coupon);
      const response = await submitCoupon(page);
      expect(response, 'A valid fixed create must reach the approved create endpoint.').not.toBeNull();
      expect((await response).ok()).toBe(true);
      const row = await expectOwnedCouponCore(page, coupon);
      await expectOwnedCouponBoundaryValues(row, coupon);
    } finally {
      await isolatedDb.removeOwnedCoupon(coupon.code);
    }
  });

  test('FR17-TC-005 duplicate SAVE10 is rejected without a second record', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      await expect(getCouponRow(page, duplicateCode.code)).toHaveCount(1);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, duplicateCode);
      await submitDuplicateAndAssertUnchanged(page, duplicateCode, baselineCount);
    } finally {
      await isolatedDb.assertReady(seedOracle);
    }
  });

  test('FR17-TC-006 missing code does not create a coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, missingCode);
      await submitInvalidAndAssertAbsent(page, missingCode, baselineCount);
    } finally {
      await isolatedDb.removeOwnedCoupon(missingCode.code);
    }
  });

  test('FR17-TC-007 missing discount_value does not create a coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(missingDiscount, 'FR17-TC-007');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-008 discount_value zero is rejected', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(zeroDiscount, 'FR17-TC-008');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-009 missing expired_at does not create a coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(missingExpiry, 'FR17-TC-009');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-010 missing min_order_amount does not create a coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(missingMinimum, 'FR17-TC-010');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-011 min_order_amount negative one is rejected', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(negativeMinimum, 'FR17-TC-011');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-012 missing max_uses_per_user does not create a coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(missingMaxUses, 'FR17-TC-012');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-013 max_uses_per_user zero is rejected', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(zeroMaxUses, 'FR17-TC-013');
    await isolatedDb.assertReady(seedOracle);
    try {
      await openAdminCoupons(page);
      const baselineCount = await getCouponRows(page).count();
      await fillCouponForm(page, coupon);
      await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

  test('FR17-TC-014 admin deletes exactly one owned coupon', async ({ adminSession, isolatedDb }) => {
    const { page } = adminSession;
    const coupon = buildOwnedCoupon(deleteSetup, 'FR17-TC-014');
    await isolatedDb.assertReady(seedOracle);
    await isolatedDb.insertOwnedCoupon(coupon);
    try {
      await openAdminCoupons(page);
      const row = getCouponRow(page, coupon.code);
      await expect(row).toHaveCount(1);
      await row.getByRole('button', { name: 'X?a', exact: true }).click();
      await expect(row).toHaveCount(0);
      for (const code of seedOracle.expectedCodes) await expect(getCouponRow(page, code)).toHaveCount(1);
    } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  });

});
