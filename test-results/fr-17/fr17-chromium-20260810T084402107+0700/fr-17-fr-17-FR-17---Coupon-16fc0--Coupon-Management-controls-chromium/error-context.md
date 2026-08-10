# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-17\fr-17.spec.js >> FR-17 - Coupon management >> FR17-TC-016 non-admin actor has no usable Coupon Management controls
- Location: tests\fr-17\fr-17.spec.js:233:3

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
  137 |   });
  138 | 
  139 |   test('FR17-TC-008 discount_value zero is rejected', async ({ adminSession, isolatedDb }) => {
  140 |     const { page } = adminSession;
  141 |     const coupon = buildOwnedCoupon(zeroDiscount, 'FR17-TC-008');
  142 |     await isolatedDb.assertReady(seedOracle);
  143 |     try {
  144 |       await openAdminCoupons(page);
  145 |       const baselineCount = await getCouponRows(page).count();
  146 |       await fillCouponForm(page, coupon);
  147 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  148 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  149 |   });
  150 | 
  151 |   test('FR17-TC-009 missing expired_at does not create a coupon', async ({ adminSession, isolatedDb }) => {
  152 |     const { page } = adminSession;
  153 |     const coupon = buildOwnedCoupon(missingExpiry, 'FR17-TC-009');
  154 |     await isolatedDb.assertReady(seedOracle);
  155 |     try {
  156 |       await openAdminCoupons(page);
  157 |       const baselineCount = await getCouponRows(page).count();
  158 |       await fillCouponForm(page, coupon);
  159 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  160 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  161 |   });
  162 | 
  163 |   test('FR17-TC-010 missing min_order_amount does not create a coupon', async ({ adminSession, isolatedDb }) => {
  164 |     const { page } = adminSession;
  165 |     const coupon = buildOwnedCoupon(missingMinimum, 'FR17-TC-010');
  166 |     await isolatedDb.assertReady(seedOracle);
  167 |     try {
  168 |       await openAdminCoupons(page);
  169 |       const baselineCount = await getCouponRows(page).count();
  170 |       await fillCouponForm(page, coupon);
  171 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  172 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  173 |   });
  174 | 
  175 |   test('FR17-TC-011 min_order_amount negative one is rejected', async ({ adminSession, isolatedDb }) => {
  176 |     const { page } = adminSession;
  177 |     const coupon = buildOwnedCoupon(negativeMinimum, 'FR17-TC-011');
  178 |     await isolatedDb.assertReady(seedOracle);
  179 |     try {
  180 |       await openAdminCoupons(page);
  181 |       const baselineCount = await getCouponRows(page).count();
  182 |       await fillCouponForm(page, coupon);
  183 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  184 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  185 |   });
  186 | 
  187 |   test('FR17-TC-012 missing max_uses_per_user does not create a coupon', async ({ adminSession, isolatedDb }) => {
  188 |     const { page } = adminSession;
  189 |     const coupon = buildOwnedCoupon(missingMaxUses, 'FR17-TC-012');
  190 |     await isolatedDb.assertReady(seedOracle);
  191 |     try {
  192 |       await openAdminCoupons(page);
  193 |       const baselineCount = await getCouponRows(page).count();
  194 |       await fillCouponForm(page, coupon);
  195 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  196 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  197 |   });
  198 | 
  199 |   test('FR17-TC-013 max_uses_per_user zero is rejected', async ({ adminSession, isolatedDb }) => {
  200 |     const { page } = adminSession;
  201 |     const coupon = buildOwnedCoupon(zeroMaxUses, 'FR17-TC-013');
  202 |     await isolatedDb.assertReady(seedOracle);
  203 |     try {
  204 |       await openAdminCoupons(page);
  205 |       const baselineCount = await getCouponRows(page).count();
  206 |       await fillCouponForm(page, coupon);
  207 |       await submitInvalidAndAssertAbsent(page, coupon, baselineCount);
  208 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  209 |   });
  210 | 
  211 |   test('FR17-TC-014 admin deletes exactly one owned coupon', async ({ adminSession, isolatedDb }) => {
  212 |     const { page } = adminSession;
  213 |     const coupon = buildOwnedCoupon(deleteSetup, 'FR17-TC-014');
  214 |     await isolatedDb.assertReady(seedOracle);
  215 |     await isolatedDb.insertOwnedCoupon(coupon);
  216 |     try {
  217 |       await openAdminCoupons(page);
  218 |       const row = getCouponRow(page, coupon.code);
  219 |       await expect(row).toHaveCount(1);
  220 |       await row.getByRole('button', { name: 'Xóa', exact: true }).click();
  221 |       await expect(row).toHaveCount(0);
  222 |       for (const code of seedOracle.expectedCodes) await expect(getCouponRow(page, code)).toHaveCount(1);
  223 |     } finally { await isolatedDb.removeOwnedCoupon(coupon.code); }
  224 |   });
  225 | 
  226 |   test('FR17-TC-015 unauthenticated actor has no usable Coupon Management controls', async ({ page }) => {
  227 |     await page.goto(getAdminBaseUrl());
  228 |     await expect(page.getByRole('heading', { name: 'Admin Login', exact: true })).toBeVisible();
  229 |     await expect(getCouponTab(page)).toHaveCount(0);
  230 |     await expect(getCouponSection(page)).toHaveCount(0);
  231 |   });
  232 | 
  233 |   test('FR17-TC-016 non-admin actor has no usable Coupon Management controls', async ({ page, request }) => {
  234 |     await installNonAdminSession(page, request);
  235 |     await page.goto(getAdminBaseUrl());
  236 |     await expect(page.getByRole('heading', { name: 'EShop Admin', exact: true })).toBeVisible();
> 237 |     await expect(getCouponTab(page)).toHaveCount(0);
      |                                      ^ Error: expect(locator).toHaveCount(expected) failed
  238 |     await expect(getCouponSection(page)).toHaveCount(0);
  239 |   });
  240 | });
  241 | 
```