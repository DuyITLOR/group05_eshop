# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-17\fr-17.spec.js >> FR-17 - Coupon management >> FR17-TC-016 non-admin actor has no usable Coupon Management controls
- Location: tests\fr-17\fr-17.spec.js:235:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('Mã Giảm Giá', { exact: true })
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByText('Mã Giảm Giá', { exact: true })
    14 × locator resolved to 1 element
       - unexpected value "1"

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
    - heading "Dashboard" [level=2] [ref=e16]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Tổng doanh thu (Delivered)" [level=3] [ref=e19]
        - paragraph [ref=e20]: 0 ₫
      - generic [ref=e21]:
        - heading "Tổng số đơn hàng" [level=3] [ref=e22]
        - paragraph [ref=e23]: "0"
```

# Test source

```ts
  139 |   });
  140 | 
  141 |   test('FR17-TC-008 discount_value zero is rejected', async ({ adminSession, isolatedDb }) => {
  142 |     const { page } = adminSession;
  143 |     const coupon = buildOwnedCoupon(zeroDiscount, 'FR17-TC-008');
  144 |     await isolatedDb.assertReady(seedOracle);
  145 |     try {
  146 |       await openAdminCoupons(page);
  147 |       const baselineCount = await getCouponRows(page).count();
  148 |       await fillCouponForm(page, coupon);
  149 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  150 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  151 |   });
  152 | 
  153 |   test('FR17-TC-009 missing expired_at does not create a coupon', async ({ adminSession, isolatedDb }) => {
  154 |     const { page } = adminSession;
  155 |     const coupon = buildOwnedCoupon(missingExpiry, 'FR17-TC-009');
  156 |     await isolatedDb.assertReady(seedOracle);
  157 |     try {
  158 |       await openAdminCoupons(page);
  159 |       const baselineCount = await getCouponRows(page).count();
  160 |       await fillCouponForm(page, coupon);
  161 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  162 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  163 |   });
  164 | 
  165 |   test('FR17-TC-010 missing min_order_amount does not create a coupon', async ({ adminSession, isolatedDb }) => {
  166 |     const { page } = adminSession;
  167 |     const coupon = buildOwnedCoupon(missingMinimum, 'FR17-TC-010');
  168 |     await isolatedDb.assertReady(seedOracle);
  169 |     try {
  170 |       await openAdminCoupons(page);
  171 |       const baselineCount = await getCouponRows(page).count();
  172 |       await fillCouponForm(page, coupon);
  173 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  174 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  175 |   });
  176 | 
  177 |   test('FR17-TC-011 min_order_amount negative one is rejected', async ({ adminSession, isolatedDb }) => {
  178 |     const { page } = adminSession;
  179 |     const coupon = buildOwnedCoupon(negativeMinimum, 'FR17-TC-011');
  180 |     await isolatedDb.assertReady(seedOracle);
  181 |     try {
  182 |       await openAdminCoupons(page);
  183 |       const baselineCount = await getCouponRows(page).count();
  184 |       await fillCouponForm(page, coupon);
  185 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  186 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  187 |   });
  188 | 
  189 |   test('FR17-TC-012 missing max_uses_per_user does not create a coupon', async ({ adminSession, isolatedDb }) => {
  190 |     const { page } = adminSession;
  191 |     const coupon = buildOwnedCoupon(missingMaxUses, 'FR17-TC-012');
  192 |     await isolatedDb.assertReady(seedOracle);
  193 |     try {
  194 |       await openAdminCoupons(page);
  195 |       const baselineCount = await getCouponRows(page).count();
  196 |       await fillCouponForm(page, coupon);
  197 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  198 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  199 |   });
  200 | 
  201 |   test('FR17-TC-013 max_uses_per_user zero is rejected', async ({ adminSession, isolatedDb }) => {
  202 |     const { page } = adminSession;
  203 |     const coupon = buildOwnedCoupon(zeroMaxUses, 'FR17-TC-013');
  204 |     await isolatedDb.assertReady(seedOracle);
  205 |     try {
  206 |       await openAdminCoupons(page);
  207 |       const baselineCount = await getCouponRows(page).count();
  208 |       await fillCouponForm(page, coupon);
  209 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  210 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  211 |   });
  212 | 
  213 |   test('FR17-TC-014 admin deletes exactly one owned coupon', async ({ adminSession, isolatedDb }) => {
  214 |     const { page } = adminSession;
  215 |     const coupon = buildOwnedCoupon(deleteSetup, 'FR17-TC-014');
  216 |     await isolatedDb.assertReady(seedOracle);
  217 |     await isolatedDb.insertOwnedCoupon(coupon);
  218 |     try {
  219 |       await openAdminCoupons(page);
  220 |       const row = getCouponRow(page, coupon.code);
  221 |       await expect(row).toHaveCount(1);
  222 |       await row.getByRole('button', { name: 'Xóa', exact: true }).click();
  223 |       await expect(row).toHaveCount(0);
  224 |       for (const code of seedOracle.expectedCodes) await expect(getCouponRow(page, code)).toHaveCount(1);
  225 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  226 |   });
  227 | 
  228 |   test('FR17-TC-015 unauthenticated actor has no usable Coupon Management controls', async ({ page }) => {
  229 |     await page.goto(getAdminBaseUrl());
  230 |     await expect(page.getByRole('heading', { name: 'Admin Login', exact: true })).toBeVisible();
  231 |     await expect(getCouponTab(page)).toHaveCount(0);
  232 |     await expect(getCouponSection(page)).toHaveCount(0);
  233 |   });
  234 | 
  235 |   test('FR17-TC-016 non-admin actor has no usable Coupon Management controls', async ({ page, request }) => {
  236 |     await installNonAdminSession(page, request);
  237 |     await page.goto(getAdminBaseUrl());
  238 |     await expect(page.getByRole('heading', { name: 'EShop Admin', exact: true })).toBeVisible();
> 239 |     await expect(getCouponTab(page)).toHaveCount(0);
      |                                      ^ Error: expect(locator).toHaveCount(expected) failed
  240 |     await expect(getCouponSection(page)).toHaveCount(0);
  241 |   });
  242 | });
  243 | 
```