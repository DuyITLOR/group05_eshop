# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-17\fr-17.spec.js >> FR-17 - Coupon management >> FR17-TC-002 all required coupon fields display an associated visible indicator
- Location: tests\fr-17\fr-17.spec.js:60:3

# Error details

```
Error: Required field code must have a visible associated label or labelled element containing *.

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "EShop Admin" [level=1] [ref=e5]
    - list [ref=e6]:
      - listitem [ref=e7] [cursor=pointer]: Dashboard
      - listitem [ref=e8] [cursor=pointer]: Danh mục
      - listitem [ref=e9] [cursor=pointer]: Sản phẩm
      - listitem [ref=e10] [cursor=pointer]: Mã Giảm Giá
      - listitem [ref=e11] [cursor=pointer]: Đơn hàng
      - listitem [ref=e12] [cursor=pointer]: Người dùng
      - listitem [ref=e13] [cursor=pointer]: Đăng xuất
  - generic [ref=e15]:
    - heading "Quản lý Mã Giảm Giá" [level=2] [ref=e16]
    - generic [ref=e17]:
      - heading "Tạo mã giảm giá mới" [level=3] [ref=e18]
      - generic [ref=e19]:
        - 'textbox "Mã coupon (VD: SAVE10)" [ref=e20]'
        - combobox [ref=e21]:
          - option "Phần trăm (%)" [selected]
          - option "Số tiền cố định (₫)"
        - 'spinbutton "Giá trị % (VD: 10)" [ref=e22]'
        - spinbutton "Đơn tối thiểu (₫)" [ref=e23]: "0"
        - textbox [ref=e24]:
          - /placeholder: Ngày hết hạn
        - spinbutton "Số lần dùng tối đa/người" [ref=e25]: "1"
      - button "Tạo mã" [ref=e26] [cursor=pointer]
    - table [ref=e27]:
      - rowgroup [ref=e28]:
        - row [ref=e29]:
          - columnheader "Mã" [ref=e30]
          - columnheader "Loại" [ref=e31]
          - columnheader "Giá trị" [ref=e32]
          - columnheader "Đơn tối thiểu" [ref=e33]
          - columnheader "Hết hạn" [ref=e34]
          - columnheader "Giới hạn/người" [ref=e35]
          - columnheader "Hành động" [ref=e36]
      - rowgroup [ref=e37]:
        - row [ref=e38]:
          - cell "SAVE10" [ref=e39]
          - cell "Phần trăm" [ref=e40]
          - cell "10%" [ref=e41]
          - cell "300,000 ₫" [ref=e42]
          - cell "2099-12-31" [ref=e43]
          - cell "1 lần" [ref=e44]
          - cell [ref=e45]:
            - button "Xóa" [ref=e46] [cursor=pointer]
        - row [ref=e47]:
          - cell "BIGBUY" [ref=e48]
          - cell "Cố định" [ref=e49]
          - cell "50,000 ₫" [ref=e50]
          - cell "500,000 ₫" [ref=e51]
          - cell "2099-12-31" [ref=e52]
          - cell "1 lần" [ref=e53]
          - cell [ref=e54]:
            - button "Xóa" [ref=e55] [cursor=pointer]
        - row [ref=e56]:
          - cell "VIP100" [ref=e57]
          - cell "Cố định" [ref=e58]
          - cell "100,000 ₫" [ref=e59]
          - cell "300,000 ₫" [ref=e60]
          - cell "2099-12-31" [ref=e61]
          - cell "2 lần" [ref=e62]
          - cell [ref=e63]:
            - button "Xóa" [ref=e64] [cursor=pointer]
        - row [ref=e65]:
          - cell "EXPIRED" [ref=e66]
          - cell "Phần trăm" [ref=e67]
          - cell "20%" [ref=e68]
          - cell "100,000 ₫" [ref=e69]
          - cell "Hết hạn" [ref=e70]
          - cell "1 lần" [ref=e71]
          - cell [ref=e72]:
            - button "Xóa" [ref=e73] [cursor=pointer]
```

# Test source

```ts
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
  80  |   await expect(row.getByText(`${Number(coupon.minOrderAmount).toLocaleString()} ₫`, { exact: true })).toBeVisible();
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
> 119 |     expect(hasVisibleIndicator, `Required field ${fieldName} must have a visible associated label or labelled element containing *.`).toBe(true);
      |                                                                                                                                       ^ Error: Required field code must have a visible associated label or labelled element containing *.
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