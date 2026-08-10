const { expect } = require('@playwright/test');

function getCouponTab(page) {
  return page.getByText('Mã Giảm Giá', { exact: true });
}

function getCouponSection(page) {
  return page.getByRole('heading', { name: 'Quản lý Mã Giảm Giá', exact: true }).locator('..');
}

function getCouponForm(page) {
  return getCouponSection(page).getByRole('heading', { name: 'Tạo mã giảm giá mới', exact: true }).locator('..');
}

function getCouponTable(page) {
  return getCouponSection(page).locator('table');
}

function getCouponRows(page) {
  return getCouponTable(page).locator('tbody > tr');
}

function getCouponRow(page, code) {
  return getCouponRows(page).filter({
    has: page.getByText(code, { exact: true }),
  });
}

function getField(page, field) {
  const form = getCouponForm(page);
  const placeholders = {
    code: 'Mã coupon (VD: SAVE10)',
    expiredAt: 'Ngày hết hạn',
    minOrderAmount: 'Đơn tối thiểu (₫)',
    maxUsesPerUser: 'Số lần dùng tối đa/người',
  };
  if (field === 'type') return form.locator('select');
  if (field === 'discountValue') return form.getByPlaceholder(/Giá trị % \(VD: 10\)|Số tiền \(VD: 50000\)/u);
  return form.getByPlaceholder(placeholders[field], { exact: true });
}

async function openCouponManagement(page) {
  const tab = getCouponTab(page);
  await expect(tab).toHaveCount(1);
  await tab.click();
  await expect(getCouponSection(page)).toBeVisible();
  await expect(getCouponTable(page)).toHaveCount(1);
}

async function fillCouponForm(page, coupon) {
  await getField(page, 'code').fill(String(coupon.code));
  await getField(page, 'type').selectOption(coupon.type);
  await getField(page, 'discountValue').fill(String(coupon.discountValue));
  await getField(page, 'minOrderAmount').fill(String(coupon.minOrderAmount));
  await getField(page, 'expiredAt').fill(String(coupon.expiredAt));
  await getField(page, 'maxUsesPerUser').fill(String(coupon.maxUsesPerUser));
}

async function submitCoupon(page) {
  const form = getCouponForm(page);
  const submit = form.getByRole('button', { name: 'Tạo mã', exact: true });
  const nativeValid = await form.evaluate((element) => element.checkValidity());
  const response = nativeValid
    ? page.waitForResponse((candidate) => {
        const url = new URL(candidate.url());
        return candidate.request().method() === 'POST' && url.pathname === '/api/admin/coupons';
      })
    : null;
  await submit.click();
  return response ? response : null;
}

async function expectOwnedCouponCore(page, coupon) {
  const row = getCouponRow(page, coupon.code);
  await expect(row).toHaveCount(1);
  await expect(row).toBeVisible();
  await expect(row.getByText(coupon.type === 'percent' ? 'Phần trăm' : 'Cố định', { exact: true })).toBeVisible();
  const displayedValue = coupon.type === 'percent' ? `${coupon.discountValue}%` : `${coupon.discountValue} ₫`;
  await expect(row.getByText(displayedValue, { exact: true })).toBeVisible();
  return row;
}

async function expectOwnedCouponBoundaryValues(row, coupon) {
  expect(coupon.discountValue, 'TC-004 fixed lower-bound discount_value must remain 1.').toBe(1);
  expect(coupon.minOrderAmount, 'TC-004 lower-bound min_order_amount must remain 0.').toBe(0);
  expect(coupon.maxUsesPerUser, 'TC-004 lower-bound max_uses_per_user must remain 1.').toBe(1);
  await expect(row.getByText(`${coupon.minOrderAmount} ₫`, { exact: true })).toBeVisible();
  await expect(row.getByText(`${coupon.maxUsesPerUser} lần`, { exact: true })).toBeVisible();
}

async function expectRejectedCreate(page, baselineCount, code) {
  await expect(getCouponRows(page)).toHaveCount(baselineCount);
  if (code) await expect(getCouponRow(page, code)).toHaveCount(0);
}

async function expectDuplicateCodeRejected(page, baselineCount, code) {
  await expect(getCouponRows(page)).toHaveCount(baselineCount);
  await expect(getCouponRow(page, code)).toHaveCount(1);
}

async function expectVisibleRequiredFieldIndicators(page, fields) {
  for (const fieldName of fields) {
    const field = getField(page, fieldName === 'discount_value' ? 'discountValue' : fieldName === 'expired_at' ? 'expiredAt' : fieldName === 'min_order_amount' ? 'minOrderAmount' : fieldName === 'max_uses_per_user' ? 'maxUsesPerUser' : fieldName);
    const hasVisibleIndicator = await field.evaluate((element) => {
      const associated = new Set([...(element.labels || [])]);
      const wrappingLabel = element.closest('label');
      if (wrappingLabel) associated.add(wrappingLabel);
      for (const id of (element.getAttribute('aria-labelledby') || '').split(/\s+/u).filter(Boolean)) {
        const labelledElement = document.getElementById(id);
        if (labelledElement) associated.add(labelledElement);
      }

      return [...associated].some((labelledElement) => {
        const style = window.getComputedStyle(labelledElement);
        const rect = labelledElement.getBoundingClientRect();
        const visiblyRendered = !labelledElement.hidden &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.visibility !== 'collapse' &&
          Number(style.opacity) > 0 &&
          rect.width > 0 &&
          rect.height > 0;
        return visiblyRendered && (labelledElement.innerText || '').includes('*');
      });
    });
    expect(hasVisibleIndicator, `Required field ${fieldName} must have a visible associated label or labelled element containing *.`).toBe(true);
  }
}

module.exports = {
  expectDuplicateCodeRejected,
  expectOwnedCouponBoundaryValues,
  expectOwnedCouponCore,
  expectRejectedCreate,
  expectVisibleRequiredFieldIndicators,
  fillCouponForm,
  getCouponForm,
  getCouponRow,
  getCouponRows,
  getCouponSection,
  getCouponTable,
  getCouponTab,
  openCouponManagement,
  submitCoupon,
};
