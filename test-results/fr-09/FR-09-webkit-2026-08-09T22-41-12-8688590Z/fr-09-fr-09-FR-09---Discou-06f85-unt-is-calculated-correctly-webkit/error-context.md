# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-09\fr-09.spec.js >> FR-09 - Discount coupons >> FR09-TC-003 percent final_amount is calculated correctly
- Location: tests\fr-09\fr-09.spec.js:63:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 3600000
Received: 40000000
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7]:
        - /url: /cart
      - generic [ref=e8]:
        - link "Chào, Test User" [ref=e9]:
          - /url: /profile
        - button "Thoát" [ref=e10] [cursor=pointer]
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "Xác Nhận Đơn Hàng" [level=2] [ref=e13]
      - generic [ref=e14]:
        - heading "Sản phẩm:" [level=3] [ref=e15]
        - list [ref=e16]:
          - listitem [ref=e17]: Bàn phím cơ Keychron Q1 x 1 — 4,000,000 ₫
      - generic [ref=e18]:
        - generic [ref=e19]: "Tổng tiền thanh toán (VND):"
        - spinbutton [ref=e20]: "4000000"
      - generic [ref=e21]:
        - generic [ref=e22]: Mã Giảm Giá
        - generic [ref=e23]:
          - textbox "Nhập mã giảm giá..." [ref=e24]: SAVE10
          - button "Áp dụng" [ref=e25] [cursor=pointer]
        - generic [ref=e26]:
          - paragraph [ref=e27]: ✅ Áp dụng thành công! Giảm 10%
          - paragraph [ref=e28]:
            - text: "Tiết kiệm:"
            - strong [ref=e29]: "-36,000,000 ₫"
          - paragraph [ref=e30]:
            - text: "Thành tiền:"
            - strong [ref=e31]: 40,000,000 ₫
      - generic [ref=e32]: "Tổng thanh toán: 40,000,000 ₫"
      - button "Xác Nhận Thanh Toán" [ref=e34] [cursor=pointer]
  - contentinfo [ref=e35]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  1   | const fs = require('node:fs');
  2   | const path = require('node:path');
  3   | const { expect } = require('@playwright/test');
  4   | 
  5   | const DATA_PATH = path.resolve(
  6   |   __dirname,
  7   |   '..',
  8   |   '..',
  9   |   '..',
  10  |   'test-data',
  11  |   'fr-09.json',
  12  | );
  13  | 
  14  | function loadFr09Data() {
  15  |   return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  16  | }
  17  | 
  18  | function getDataset(data, dataId) {
  19  |   const dataset = data.datasets.find((item) => item.dataId === dataId);
  20  |   if (!dataset) {
  21  |     throw new Error(`Missing external dataset: ${dataId}`);
  22  |   }
  23  |   return dataset;
  24  | }
  25  | 
  26  | function getCouponInput(page) {
  27  |   return page.getByPlaceholder('Nhập mã giảm giá...');
  28  | }
  29  | 
  30  | function getApplyButton(page) {
  31  |   return page.getByRole('button', { name: 'Áp dụng', exact: true });
  32  | }
  33  | 
  34  | function getDiscountLine(page) {
  35  |   return page.getByRole('main').getByText(/^Tiết kiệm:/u);
  36  | }
  37  | 
  38  | function getFinalAmountLine(page) {
  39  |   return page.getByRole('main').getByText(/^Thành tiền:/u);
  40  | }
  41  | 
  42  | function getPayableTotalLine(page) {
  43  |   return page
  44  |     .getByRole('main')
  45  |     .locator('span')
  46  |     .filter({ hasText: /^\s*Tổng thanh toán:/u });
  47  | }
  48  | 
  49  | function getCheckoutTotalInput(page) {
  50  |   return page.getByRole('main').getByRole('spinbutton');
  51  | }
  52  | 
  53  | function parseDisplayedAmount(displayedText) {
  54  |   const normalized = displayedText
  55  |     .normalize('NFKC')
  56  |     .replace(/[\u00a0\u202f]/gu, ' ');
  57  |   const candidates = normalized.match(/\d[\d., ]*/gu) || [];
  58  |   const values = candidates
  59  |     .map((candidate) => candidate.replace(/\D/gu, ''))
  60  |     .filter(Boolean);
  61  | 
  62  |   if (values.length !== 1) {
  63  |     throw new Error(
  64  |       `Expected exactly one monetary value in ${JSON.stringify(displayedText)}, found ${values.length}.`,
  65  |     );
  66  |   }
  67  | 
  68  |   const amount = Number(values[0]);
  69  |   if (!Number.isSafeInteger(amount)) {
  70  |     throw new Error(`Displayed amount is not a safe integer: ${values[0]}`);
  71  |   }
  72  | 
  73  |   return amount;
  74  | }
  75  | 
  76  | async function expectDisplayedAmount(locator, expectedAmount) {
  77  |   await expect(locator).toHaveCount(1);
  78  |   await expect(locator).toBeVisible();
> 79  |   expect(parseDisplayedAmount(await locator.innerText())).toBe(expectedAmount);
      |                                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  80  | }
  81  | 
  82  | async function waitForInitialProducts(page) {
  83  |   return page.waitForResponse((response) => {
  84  |     const url = new URL(response.url());
  85  |     return (
  86  |       response.request().method() === 'GET' &&
  87  |       url.pathname === '/api/products' &&
  88  |       (url.searchParams.get('search') || '') === ''
  89  |     );
  90  |   });
  91  | }
  92  | 
  93  | async function openHome(page, { expectAuthenticated = false } = {}) {
  94  |   const productsResponse = waitForInitialProducts(page);
  95  |   const userResponse = expectAuthenticated
  96  |     ? page.waitForResponse((response) => {
  97  |         const url = new URL(response.url());
  98  |         return (
  99  |           response.request().method() === 'GET' &&
  100 |           url.pathname === '/api/users/me'
  101 |         );
  102 |       })
  103 |     : null;
  104 | 
  105 |   await page.goto('/');
  106 |   const productResult = await productsResponse;
  107 |   expect(productResult.ok()).toBe(true);
  108 | 
  109 |   if (userResponse) {
  110 |     const authResult = await userResponse;
  111 |     expect(authResult.ok()).toBe(true);
  112 |     await expect(page.locator('a[href="/profile"]')).toBeVisible();
  113 |   }
  114 | }
  115 | 
  116 | function getProductCard(page, productName) {
  117 |   return page
  118 |     .getByRole('main')
  119 |     .getByRole('heading', { level: 2, name: productName, exact: true })
  120 |     .locator('..');
  121 | }
  122 | 
  123 | async function addProductFromHome(page, productName) {
  124 |   const card = getProductCard(page, productName);
  125 |   await expect(card).toHaveCount(1);
  126 |   await card.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click();
  127 | }
  128 | 
  129 | async function continueFromCartToCheckout(page) {
  130 |   await page.getByRole('link', { name: 'Giỏ hàng', exact: true }).click();
  131 |   await expect(page.getByRole('button', { name: 'Tiến hành thanh toán' })).toBeVisible();
  132 |   await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
  133 |   await expect(getCouponInput(page)).toBeVisible();
  134 | }
  135 | 
  136 | async function openAuthenticatedCheckoutWithSeedProduct(page, cartDataset) {
  137 |   await openHome(page, { expectAuthenticated: true });
  138 |   await addProductFromHome(page, cartDataset.product.name);
  139 |   await continueFromCartToCheckout(page);
  140 |   await expect(getCheckoutTotalInput(page)).toHaveValue(
  141 |     String(cartDataset.expectedTotal),
  142 |   );
  143 | }
  144 | 
  145 | async function installControlledProductRoute(page, cartDataset) {
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
```