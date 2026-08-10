# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-09\fr-09.spec.js >> FR-09 - Discount coupons >> FR09-TC-013 unauthenticated user cannot use Checkout coupon flow
- Location: tests\fr-09\fr-09.spec.js:204:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=e9] [cursor=pointer]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "Xác Nhận Đơn Hàng" [level=2] [ref=e12]
      - generic [ref=e13]:
        - heading "Sản phẩm:" [level=3] [ref=e14]
        - list
      - generic [ref=e15]:
        - generic [ref=e16]: "Tổng tiền thanh toán (VND):"
        - spinbutton [ref=e17]: "0"
      - generic [ref=e18]:
        - generic [ref=e19]: Mã Giảm Giá
        - generic [ref=e20]:
          - textbox "Nhập mã giảm giá..." [active] [ref=e21]: SAVE10
          - button "Áp dụng" [ref=e22] [cursor=pointer]
      - generic [ref=e23]: "Tổng thanh toán: 0 ₫"
      - button "Xác Nhận Thanh Toán" [ref=e25] [cursor=pointer]
  - contentinfo [ref=e26]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  123 |     const { page } = authenticatedSession;
  124 |     const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
  125 |       page,
  126 |       belowMinimumCart,
  127 |     );
  128 |     try {
  129 |       await applyCoupon(page, save10.code);
  130 |       await expectRejectedCoupon(page, belowMinimumCart.expectedTotal);
  131 |     } finally {
  132 |       await disposeRoute();
  133 |     }
  134 |   });
  135 | 
  136 |   test('FR09-TC-008 above-minimum total is accepted', async ({
  137 |     authenticatedSession,
  138 |   }) => {
  139 |     const { page } = authenticatedSession;
  140 |     const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
  141 |       page,
  142 |       aboveMinimumCart,
  143 |     );
  144 |     try {
  145 |       await applyCoupon(page, bigbuy.code);
  146 |       await expectAppliedAmounts(page, {
  147 |         expectedDiscountAmount: bigbuy.discountValue,
  148 |         expectedFinalAmount:
  149 |           aboveMinimumCart.expectedTotal - bigbuy.discountValue,
  150 |       });
  151 |     } finally {
  152 |       await disposeRoute();
  153 |     }
  154 |   });
  155 | 
  156 |   test('FR09-TC-009 absent coupon is rejected', async ({
  157 |     authenticatedSession,
  158 |   }) => {
  159 |     const { page } = authenticatedSession;
  160 |     await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
  161 |     await applyCoupon(page, absentCoupon.code);
  162 |     await expectRejectedCoupon(page, normalCart.expectedTotal);
  163 |   });
  164 | 
  165 |   test('FR09-TC-010 inactive coupon is rejected', async ({
  166 |     authenticatedSession,
  167 |     isolatedDb,
  168 |   }) => {
  169 |     const { page } = authenticatedSession;
  170 |     const cleanup = await isolatedDb.installInactiveCoupon(inactiveSetup);
  171 |     try {
  172 |       await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
  173 |       await applyCoupon(page, inactiveSetup.coupon.code);
  174 |       await expectRejectedCoupon(page, normalCart.expectedTotal);
  175 |     } finally {
  176 |       await cleanup();
  177 |     }
  178 |   });
  179 | 
  180 |   test('FR09-TC-011 expired coupon is rejected', async ({
  181 |     authenticatedSession,
  182 |   }) => {
  183 |     const { page } = authenticatedSession;
  184 |     const disposeRoute = await openAuthenticatedCheckoutWithControlledTotal(
  185 |       page,
  186 |       expirationCart,
  187 |     );
  188 |     try {
  189 |       await applyCoupon(page, expired.code);
  190 |       await expectRejectedCoupon(page, expirationCart.expectedTotal);
  191 |     } finally {
  192 |       await disposeRoute();
  193 |     }
  194 |   });
  195 | 
  196 |   test('FR09-TC-012 coupon application without valid JWT is rejected', async ({
  197 |     page,
  198 |   }) => {
  199 |     await openUnauthenticatedCheckoutWithSeedProduct(page, normalCart);
  200 |     await applyCoupon(page, save10.code);
  201 |     await expectRejectedCoupon(page, normalCart.expectedTotal);
  202 |   });
  203 | 
  204 |   test('FR09-TC-013 unauthenticated user cannot use Checkout coupon flow', async ({
  205 |     page,
  206 |   }) => {
  207 |     await page.goto('/checkout');
  208 |     await expect(page.getByRole('link', { name: 'EShop', exact: true })).toBeVisible();
  209 |     await expect(page.getByRole('main')).toBeVisible();
  210 | 
  211 |     const input = getCouponInput(page);
  212 |     const button = getApplyButton(page);
  213 |     const inputVisible = await input.isVisible();
  214 |     if (inputVisible) {
  215 |       await input.fill(save10.code);
  216 |     }
  217 |     const functionalCouponFlow =
  218 |       new URL(page.url()).pathname === '/checkout' &&
  219 |       inputVisible &&
  220 |       (await button.isVisible()) &&
  221 |       (await button.isEnabled());
  222 | 
> 223 |     expect(functionalCouponFlow).toBe(false);
      |                                  ^ Error: expect(received).toBe(expected) // Object.is equality
  224 |   });
  225 | 
  226 |   test('FR09-TC-014 usage count at maximum is rejected', async ({
  227 |     authenticatedSession,
  228 |     isolatedDb,
  229 |   }) => {
  230 |     const { page, user } = authenticatedSession;
  231 |     const cleanup = await isolatedDb.setExactUsageCount(
  232 |       usageAtMaxSetup,
  233 |       user.id,
  234 |     );
  235 |     try {
  236 |       await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
  237 |       await applyCoupon(page, save10.code);
  238 |       await expectRejectedCoupon(page, usageAtMaxSetup.expectedTotal);
  239 |     } finally {
  240 |       await cleanup();
  241 |     }
  242 |   });
  243 | 
  244 |   test('FR09-TC-015 usage count below maximum is accepted', async ({
  245 |     authenticatedSession,
  246 |     isolatedDb,
  247 |   }) => {
  248 |     const { page, user } = authenticatedSession;
  249 |     const cleanup = await isolatedDb.setExactUsageCount(
  250 |       usageBelowMaxSetup,
  251 |       user.id,
  252 |     );
  253 |     try {
  254 |       await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
  255 |       await applyCoupon(page, vip100.code);
  256 |       await expectAppliedAmounts(page, {
  257 |         expectedDiscountAmount: usageBelowMaxSetup.expectedDiscountAmount,
  258 |         expectedFinalAmount: usageBelowMaxSetup.expectedFinalAmount,
  259 |       });
  260 |     } finally {
  261 |       await cleanup();
  262 |     }
  263 |   });
  264 | 
  265 |   test('FR09-TC-016 checkout total is cart-derived and not directly editable', async ({
  266 |     authenticatedSession,
  267 |   }) => {
  268 |     const { page } = authenticatedSession;
  269 |     await openAuthenticatedCheckoutWithSeedProduct(page, normalCart);
  270 | 
  271 |     const totalInput = getCheckoutTotalInput(page);
  272 |     await expect(totalInput).toHaveValue(String(normalCart.expectedTotal));
  273 |     await expectDisplayedAmount(
  274 |       getPayableTotalLine(page),
  275 |       normalCart.expectedTotal,
  276 |     );
  277 |     await expect(totalInput).not.toBeEditable();
  278 |   });
  279 | });
  280 | 
```