# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-09\fr-09.spec.js >> FR-09 - Discount coupons >> FR09-TC-012 coupon application without valid JWT is rejected
- Location: tests\fr-09\fr-09.spec.js:196:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('main').getByText('/^Tiết kiệm:/u')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('main').getByText('/^Tiết kiệm:/u')
    14 × locator resolved to 1 element
       - unexpected value "1"

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
        - list [ref=e15]:
          - listitem [ref=e16]: Bàn phím cơ Keychron Q1 x 1 — 4,000,000 ₫
      - generic [ref=e17]:
        - generic [ref=e18]: "Tổng tiền thanh toán (VND):"
        - spinbutton [ref=e19]: "4000000"
      - generic [ref=e20]:
        - generic [ref=e21]: Mã Giảm Giá
        - generic [ref=e22]:
          - textbox "Nhập mã giảm giá..." [ref=e23]: SAVE10
          - button "Áp dụng" [ref=e24] [cursor=pointer]
        - generic [ref=e25]:
          - paragraph [ref=e26]: ✅ Áp dụng thành công! Giảm 10%
          - paragraph [ref=e27]:
            - text: "Tiết kiệm:"
            - strong [ref=e28]: "-36,000,000 ₫"
          - paragraph [ref=e29]:
            - text: "Thành tiền:"
            - strong [ref=e30]: 40,000,000 ₫
      - generic [ref=e31]: "Tổng thanh toán: 40,000,000 ₫"
      - button "Xác Nhận Thanh Toán" [ref=e33] [cursor=pointer]
  - contentinfo [ref=e34]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  146 |   const routePattern = '**/api/products?*';
  147 |   const handler = async (route) => {
  148 |     const request = route.request();
  149 |     const url = new URL(request.url());
  150 |     const isInitialCatalogRequest =
  151 |       request.method() === 'GET' &&
  152 |       url.pathname === '/api/products' &&
  153 |       (url.searchParams.get('search') || '') === '';
  154 | 
  155 |     if (!isInitialCatalogRequest) {
  156 |       await route.continue();
  157 |       return;
  158 |     }
  159 | 
  160 |     await route.fulfill({
  161 |       status: 200,
  162 |       contentType: 'application/json',
  163 |       body: JSON.stringify([cartDataset.controlledProduct]),
  164 |     });
  165 |   };
  166 | 
  167 |   await page.route(routePattern, handler);
  168 |   return async () => page.unroute(routePattern, handler);
  169 | }
  170 | 
  171 | async function openAuthenticatedCheckoutWithControlledTotal(
  172 |   page,
  173 |   cartDataset,
  174 | ) {
  175 |   const disposeRoute = await installControlledProductRoute(page, cartDataset);
  176 |   try {
  177 |     await openHome(page, { expectAuthenticated: true });
  178 |     await addProductFromHome(page, cartDataset.controlledProduct.name);
  179 |     await continueFromCartToCheckout(page);
  180 |     await expect(getCheckoutTotalInput(page)).toHaveValue(
  181 |       String(cartDataset.expectedTotal),
  182 |     );
  183 |   } catch (error) {
  184 |     await disposeRoute();
  185 |     throw error;
  186 |   }
  187 | 
  188 |   return disposeRoute;
  189 | }
  190 | 
  191 | async function openUnauthenticatedCheckoutWithSeedProduct(page, cartDataset) {
  192 |   await openHome(page);
  193 |   await addProductFromHome(page, cartDataset.product.name);
  194 |   await page.evaluate(() => {
  195 |     window.history.pushState({}, '', '/checkout');
  196 |     window.dispatchEvent(new PopStateEvent('popstate'));
  197 |   });
  198 |   await expect(getCouponInput(page)).toBeVisible();
  199 |   await expect(getCheckoutTotalInput(page)).toHaveValue(
  200 |     String(cartDataset.expectedTotal),
  201 |   );
  202 | }
  203 | 
  204 | async function applyCoupon(page, couponCode) {
  205 |   const input = getCouponInput(page);
  206 |   const button = getApplyButton(page);
  207 |   await expect(input).toBeVisible();
  208 |   await input.fill(couponCode);
  209 |   await expect(button).toBeEnabled();
  210 | 
  211 |   const responsePromise = page.waitForResponse((response) => {
  212 |     const url = new URL(response.url());
  213 |     return (
  214 |       response.request().method() === 'POST' &&
  215 |       url.pathname === '/api/apply-coupon'
  216 |     );
  217 |   });
  218 | 
  219 |   await button.click();
  220 |   return responsePromise;
  221 | }
  222 | 
  223 | async function expectAppliedAmounts(
  224 |   page,
  225 |   { expectedDiscountAmount, expectedFinalAmount },
  226 | ) {
  227 |   if (expectedDiscountAmount !== undefined) {
  228 |     await expectDisplayedAmount(
  229 |       getDiscountLine(page),
  230 |       expectedDiscountAmount,
  231 |     );
  232 |   }
  233 |   if (expectedFinalAmount !== undefined) {
  234 |     await expectDisplayedAmount(
  235 |       getFinalAmountLine(page),
  236 |       expectedFinalAmount,
  237 |     );
  238 |     await expectDisplayedAmount(
  239 |       getPayableTotalLine(page),
  240 |       expectedFinalAmount,
  241 |     );
  242 |   }
  243 | }
  244 | 
  245 | async function expectRejectedCoupon(page, expectedOriginalTotal) {
> 246 |   await expect(getDiscountLine(page)).toHaveCount(0);
      |                                       ^ Error: expect(locator).toHaveCount(expected) failed
  247 |   await expect(getFinalAmountLine(page)).toHaveCount(0);
  248 |   await expectDisplayedAmount(
  249 |     getPayableTotalLine(page),
  250 |     expectedOriginalTotal,
  251 |   );
  252 | }
  253 | 
  254 | module.exports = {
  255 |   applyCoupon,
  256 |   expectAppliedAmounts,
  257 |   expectDisplayedAmount,
  258 |   expectRejectedCoupon,
  259 |   getApplyButton,
  260 |   getCheckoutTotalInput,
  261 |   getCouponInput,
  262 |   getDataset,
  263 |   getDiscountLine,
  264 |   getFinalAmountLine,
  265 |   getPayableTotalLine,
  266 |   loadFr09Data,
  267 |   openAuthenticatedCheckoutWithControlledTotal,
  268 |   openAuthenticatedCheckoutWithSeedProduct,
  269 |   openUnauthenticatedCheckoutWithSeedProduct,
  270 |   parseDisplayedAmount,
  271 | };
  272 | 
```