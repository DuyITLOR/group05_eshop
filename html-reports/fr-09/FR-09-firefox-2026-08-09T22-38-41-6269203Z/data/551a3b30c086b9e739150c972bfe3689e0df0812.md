# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-09\fr-09.spec.js >> FR-09 - Discount coupons >> FR09-TC-016 checkout total is cart-derived and not directly editable
- Location: tests\fr-09\fr-09.spec.js:265:3

# Error details

```
Error: expect(locator).not.toBeEditable() failed

Locator:  getByRole('main').getByRole('spinbutton')
Expected: not editable
Received: editable
Timeout:  5000ms

Call log:
  - Expect "not toBeEditable" with timeout 5000ms
  - waiting for getByRole('main').getByRole('spinbutton')
    14 × locator resolved to <input type="number" value="4000000" class="border p-2 rounded text-red-600 font-bold"/>
       - unexpected value "editable"

```

```yaml
- spinbutton: "4000000"
```

# Test source

```ts
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
  223 |     expect(functionalCouponFlow).toBe(false);
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
> 277 |     await expect(totalInput).not.toBeEditable();
      |                                  ^ Error: expect(locator).not.toBeEditable() failed
  278 |   });
  279 | });
  280 | 
```