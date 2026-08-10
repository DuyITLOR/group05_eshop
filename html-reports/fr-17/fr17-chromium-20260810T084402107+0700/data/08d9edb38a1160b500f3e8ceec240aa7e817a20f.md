# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-17\fr-17.spec.js >> FR-17 - Coupon management >> FR17-TC-003 admin creates a valid percent coupon
- Location: tests\fr-17\fr-17.spec.js:66:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Quản lý Mã Giảm Giá', exact: true }).locator('..').locator('table').locator('tbody > tr').filter({ has: getByText('FR17-PERCENT-TC003-FR17CHROMIUM20260810T0844021070700', { exact: true }) }).getByText('100.000 ₫', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Quản lý Mã Giảm Giá', exact: true }).locator('..').locator('table').locator('tbody > tr').filter({ has: getByText('FR17-PERCENT-TC003-FR17CHROMIUM20260810T0844021070700', { exact: true }) }).getByText('100.000 ₫', { exact: true })

```

```yaml
- heading "EShop Admin" [level=1]
- list:
  - listitem: Dashboard
  - listitem: Danh mục
  - listitem: Sản phẩm
  - listitem: Mã Giảm Giá
  - listitem: Đơn hàng
  - listitem: Người dùng
  - listitem: Đăng xuất
- heading "Quản lý Mã Giảm Giá" [level=2]
- heading "Tạo mã giảm giá mới" [level=3]
- 'textbox "Mã coupon (VD: SAVE10)"'
- combobox:
  - option "Phần trăm (%)" [selected]
  - option "Số tiền cố định (₫)"
- 'spinbutton "Giá trị % (VD: 10)"'
- spinbutton "Đơn tối thiểu (₫)": "0"
- textbox:
  - /placeholder: Ngày hết hạn
- spinbutton "Số lần dùng tối đa/người": "1"
- button "Tạo mã"
- table:
  - rowgroup:
    - row "Mã Loại Giá trị Đơn tối thiểu Hết hạn Giới hạn/người Hành động":
      - columnheader "Mã"
      - columnheader "Loại"
      - columnheader "Giá trị"
      - columnheader "Đơn tối thiểu"
      - columnheader "Hết hạn"
      - columnheader "Giới hạn/người"
      - columnheader "Hành động"
  - rowgroup:
    - row "SAVE10 Phần trăm 10% 300,000 ₫ 2099-12-31 1 lần Xóa":
      - cell "SAVE10"
      - cell "Phần trăm"
      - cell "10%"
      - cell "300,000 ₫"
      - cell "2099-12-31"
      - cell "1 lần"
      - cell "Xóa":
        - button "Xóa"
    - row "BIGBUY Cố định 50,000 ₫ 500,000 ₫ 2099-12-31 1 lần Xóa":
      - cell "BIGBUY"
      - cell "Cố định"
      - cell "50,000 ₫"
      - cell "500,000 ₫"
      - cell "2099-12-31"
      - cell "1 lần"
      - cell "Xóa":
        - button "Xóa"
    - row "VIP100 Cố định 100,000 ₫ 300,000 ₫ 2099-12-31 2 lần Xóa":
      - cell "VIP100"
      - cell "Cố định"
      - cell "100,000 ₫"
      - cell "300,000 ₫"
      - cell "2099-12-31"
      - cell "2 lần"
      - cell "Xóa":
        - button "Xóa"
    - row "EXPIRED Phần trăm 20% 100,000 ₫ Hết hạn 1 lần Xóa":
      - cell "EXPIRED"
      - cell "Phần trăm"
      - cell "20%"
      - cell "100,000 ₫"
      - cell "Hết hạn"
      - cell "1 lần"
      - cell "Xóa":
        - button "Xóa"
    - row "FR17-PERCENT-TC003-FR17CHROMIUM20260810T0844021070700 Phần trăm 10% 100,000 ₫ 2099-12-31 1 lần Xóa":
      - cell "FR17-PERCENT-TC003-FR17CHROMIUM20260810T0844021070700"
      - cell "Phần trăm"
      - cell "10%"
      - cell "100,000 ₫"
      - cell "2099-12-31"
      - cell "1 lần"
      - cell "Xóa":
        - button "Xóa"
```

# Test source

```ts
  1   | const { expect } = require('@playwright/test');
  2   | 
  3   | function getCouponTab(page) {
  4   |   return page.getByText('Mã Giảm Giá', { exact: true });
  5   | }
  6   | 
  7   | function getCouponSection(page) {
  8   |   return page.getByRole('heading', { name: 'Quản lý Mã Giảm Giá', exact: true }).locator('..');
  9   | }
  10  | 
  11  | function getCouponForm(page) {
  12  |   return getCouponSection(page).getByRole('heading', { name: 'Tạo mã giảm giá mới', exact: true }).locator('..');
  13  | }
  14  | 
  15  | function getCouponTable(page) {
  16  |   return getCouponSection(page).locator('table');
  17  | }
  18  | 
  19  | function getCouponRows(page) {
  20  |   return getCouponTable(page).locator('tbody > tr');
  21  | }
  22  | 
  23  | function getCouponRow(page, code) {
  24  |   return getCouponRows(page).filter({
  25  |     has: page.getByText(code, { exact: true }),
  26  |   });
  27  | }
  28  | 
  29  | function getField(page, field) {
  30  |   const form = getCouponForm(page);
  31  |   const placeholders = {
  32  |     code: 'Mã coupon (VD: SAVE10)',
  33  |     expiredAt: 'Ngày hết hạn',
  34  |     minOrderAmount: 'Đơn tối thiểu (₫)',
  35  |     maxUsesPerUser: 'Số lần dùng tối đa/người',
  36  |   };
  37  |   if (field === 'type') return form.locator('select');
  38  |   if (field === 'discountValue') return form.getByPlaceholder(/Giá trị % \(VD: 10\)|Số tiền \(VD: 50000\)/u);
  39  |   return form.getByPlaceholder(placeholders[field], { exact: true });
  40  | }
  41  | 
  42  | async function openCouponManagement(page) {
  43  |   const tab = getCouponTab(page);
  44  |   await expect(tab).toHaveCount(1);
  45  |   await tab.click();
  46  |   await expect(getCouponSection(page)).toBeVisible();
  47  |   await expect(getCouponTable(page)).toHaveCount(1);
  48  | }
  49  | 
  50  | async function fillCouponForm(page, coupon) {
  51  |   await getField(page, 'code').fill(String(coupon.code));
  52  |   await getField(page, 'type').selectOption(coupon.type);
  53  |   await getField(page, 'discountValue').fill(String(coupon.discountValue));
  54  |   await getField(page, 'minOrderAmount').fill(String(coupon.minOrderAmount));
  55  |   await getField(page, 'expiredAt').fill(String(coupon.expiredAt));
  56  |   await getField(page, 'maxUsesPerUser').fill(String(coupon.maxUsesPerUser));
  57  | }
  58  | 
  59  | async function submitCoupon(page) {
  60  |   const form = getCouponForm(page);
  61  |   const submit = form.getByRole('button', { name: 'Tạo mã', exact: true });
  62  |   const nativeValid = await form.evaluate((element) => element.checkValidity());
  63  |   const response = nativeValid
  64  |     ? page.waitForResponse((candidate) => {
  65  |         const url = new URL(candidate.url());
  66  |         return candidate.request().method() === 'POST' && url.pathname === '/api/admin/coupons';
  67  |       })
  68  |     : null;
  69  |   await submit.click();
  70  |   return response ? response : null;
  71  | }
  72  | 
  73  | async function expectOwnedCouponRow(page, coupon) {
  74  |   const row = getCouponRow(page, coupon.code);
  75  |   await expect(row).toHaveCount(1);
  76  |   await expect(row).toBeVisible();
  77  |   await expect(row.getByText(coupon.type === 'percent' ? 'Phần trăm' : 'Cố định', { exact: true })).toBeVisible();
  78  |   const displayedValue = coupon.type === 'percent' ? `${coupon.discountValue}%` : `${Number(coupon.discountValue).toLocaleString()} ₫`;
  79  |   await expect(row.getByText(displayedValue, { exact: true })).toBeVisible();
> 80  |   await expect(row.getByText(`${Number(coupon.minOrderAmount).toLocaleString()} ₫`, { exact: true })).toBeVisible();
      |                                                                                                       ^ Error: expect(locator).toBeVisible() failed
  81  |   await expect(row.getByText(`${coupon.maxUsesPerUser} lần`, { exact: true })).toBeVisible();
  82  | }
  83  | 
  84  | async function expectRejectedCreate(page, baselineCount, code) {
  85  |   await expect(getCouponRows(page)).toHaveCount(baselineCount);
  86  |   if (code) await expect(getCouponRow(page, code)).toHaveCount(0);
  87  | }
  88  | 
  89  | async function expectDuplicateCodeRejected(page, baselineCount, code) {
  90  |   await expect(getCouponRows(page)).toHaveCount(baselineCount);
  91  |   await expect(getCouponRow(page, code)).toHaveCount(1);
  92  | }
  93  | 
  94  | async function expectVisibleRequiredFieldIndicators(page, fields) {
  95  |   for (const fieldName of fields) {
  96  |     const field = getField(page, fieldName === 'discount_value' ? 'discountValue' : fieldName === 'expired_at' ? 'expiredAt' : fieldName === 'min_order_amount' ? 'minOrderAmount' : fieldName === 'max_uses_per_user' ? 'maxUsesPerUser' : fieldName);
  97  |     const hasVisibleIndicator = await field.evaluate((element) => {
  98  |       const associated = new Set([...(element.labels || [])]);
  99  |       const wrappingLabel = element.closest('label');
  100 |       if (wrappingLabel) associated.add(wrappingLabel);
  101 |       for (const id of (element.getAttribute('aria-labelledby') || '').split(/\s+/u).filter(Boolean)) {
  102 |         const labelledElement = document.getElementById(id);
  103 |         if (labelledElement) associated.add(labelledElement);
  104 |       }
  105 | 
  106 |       return [...associated].some((labelledElement) => {
  107 |         const style = window.getComputedStyle(labelledElement);
  108 |         const rect = labelledElement.getBoundingClientRect();
  109 |         const visiblyRendered = !labelledElement.hidden &&
  110 |           style.display !== 'none' &&
  111 |           style.visibility !== 'hidden' &&
  112 |           style.visibility !== 'collapse' &&
  113 |           Number(style.opacity) > 0 &&
  114 |           rect.width > 0 &&
  115 |           rect.height > 0;
  116 |         return visiblyRendered && (labelledElement.innerText || '').includes('*');
  117 |       });
  118 |     });
  119 |     expect(hasVisibleIndicator, `Required field ${fieldName} must have a visible associated label or labelled element containing *.`).toBe(true);
  120 |   }
  121 | }
  122 | 
  123 | module.exports = {
  124 |   expectDuplicateCodeRejected,
  125 |   expectOwnedCouponRow,
  126 |   expectRejectedCreate,
  127 |   expectVisibleRequiredFieldIndicators,
  128 |   fillCouponForm,
  129 |   getCouponForm,
  130 |   getCouponRow,
  131 |   getCouponRows,
  132 |   getCouponSection,
  133 |   getCouponTable,
  134 |   getCouponTab,
  135 |   openCouponManagement,
  136 |   submitCoupon,
  137 | };
  138 | 
```