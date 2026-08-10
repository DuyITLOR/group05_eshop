# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-05\fr-05.spec.js >> FR-05 - Product listing and search >> FR05-TC-006 - Use consistent conventional thousand grouping
- Location: tests\fr-05\fr-05.spec.js:108:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /^\d{1,3}([.,   ])\d{3}(?:\1\d{3})*$/u
Received string:  "30,000,000 "
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
      - generic [ref=e12]:
        - heading "Danh sách sản phẩm" [level=1] [ref=e13]
        - generic [ref=e14]:
          - textbox "Tìm kiếm..." [ref=e15]
          - button "Tìm" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "iPhone 15 Pro Max" [level=2] [ref=e19]
          - paragraph [ref=e20]: 30,000,000 VND
          - generic [ref=e21]:
            - link "Xem chi tiết" [ref=e22] [cursor=pointer]:
              - /url: /product/1
            - button "Thêm vào giỏ" [ref=e23] [cursor=pointer]
        - generic [ref=e24]:
          - heading "Samsung Galaxy S24 Ultra" [level=2] [ref=e25]
          - paragraph [ref=e26]: 28,000,000 VND
          - generic [ref=e27]:
            - link "Xem chi tiết" [ref=e28] [cursor=pointer]:
              - /url: /product/2
            - button "Thêm vào giỏ" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - heading "MacBook Pro M3" [level=2] [ref=e31]
          - paragraph [ref=e32]: 45,000,000 VND
          - generic [ref=e33]:
            - link "Xem chi tiết" [ref=e34] [cursor=pointer]:
              - /url: /product/3
            - button "Thêm vào giỏ" [ref=e35] [cursor=pointer]
        - generic [ref=e36]:
          - heading "Tai nghe AirPods Pro 2" [level=2] [ref=e37]
          - paragraph [ref=e38]: 6,000,000 VND
          - generic [ref=e39]:
            - link "Xem chi tiết" [ref=e40] [cursor=pointer]:
              - /url: /product/4
            - button "Thêm vào giỏ" [ref=e41] [cursor=pointer]
        - generic [ref=e42]:
          - heading "Bàn phím cơ Keychron Q1" [level=2] [ref=e43]
          - paragraph [ref=e44]: 4,000,000 VND
          - generic [ref=e45]:
            - link "Xem chi tiết" [ref=e46] [cursor=pointer]:
              - /url: /product/5
            - button "Thêm vào giỏ" [ref=e47] [cursor=pointer]
      - heading "Hiển thị 5 sản phẩm" [level=1] [ref=e48]
  - contentinfo [ref=e49]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  24  | }
  25  | 
  26  | async function openHome(page) {
  27  |   const initialResponse = page.waitForResponse((response) => {
  28  |     const url = new URL(response.url());
  29  |     return (
  30  |       response.request().method() === 'GET' &&
  31  |       url.pathname === '/api/products' &&
  32  |       (url.searchParams.get('search') || '') === ''
  33  |     );
  34  |   });
  35  | 
  36  |   await page.goto('/');
  37  |   await initialResponse;
  38  | }
  39  | 
  40  | async function submitSearch(page, keyword) {
  41  |   const searchResponse = page.waitForResponse((response) => {
  42  |     const url = new URL(response.url());
  43  |     return (
  44  |       response.request().method() === 'GET' &&
  45  |       url.pathname === '/api/products' &&
  46  |       url.searchParams.get('search') === keyword
  47  |     );
  48  |   });
  49  | 
  50  |   await page.getByPlaceholder('Tìm kiếm...').fill(keyword);
  51  |   await page.getByRole('button', { name: 'Tìm', exact: true }).click();
  52  |   await searchResponse;
  53  | }
  54  | 
  55  | function getProductHeading(page, productName) {
  56  |   return page
  57  |     .getByRole('main')
  58  |     .getByRole('heading', { level: 2, name: productName, exact: true });
  59  | }
  60  | 
  61  | function getProductCardByName(page, productName) {
  62  |   return getProductHeading(page, productName).locator('..');
  63  | }
  64  | 
  65  | function getProductPrice(card) {
  66  |   return card.locator('p').filter({ hasText: /\d/ });
  67  | }
  68  | 
  69  | function getProductHeadings(page) {
  70  |   return page.getByRole('main').getByRole('heading', { level: 2 });
  71  | }
  72  | 
  73  | async function getProductListing(page, anchorProductNames) {
  74  |   const [firstName, secondName] = anchorProductNames;
  75  |   const firstCard = getProductCardByName(page, firstName);
  76  |   const secondCard = getProductCardByName(page, secondName);
  77  | 
  78  |   await expect(firstCard).toHaveCount(1);
  79  |   await expect(secondCard).toHaveCount(1);
  80  | 
  81  |   const listing = firstCard.locator('..');
  82  |   await expect(
  83  |     listing.getByRole('heading', {
  84  |       level: 2,
  85  |       name: secondName,
  86  |       exact: true,
  87  |     }),
  88  |   ).toHaveCount(1);
  89  | 
  90  |   return listing;
  91  | }
  92  | 
  93  | function getKeywordRegion(page) {
  94  |   return page
  95  |     .getByRole('main')
  96  |     .locator('div')
  97  |     .filter({ hasText: /^\s*Kết quả tìm kiếm cho:/ })
  98  |     .filter({ has: page.locator('span') });
  99  | }
  100 | 
  101 | function escapeForCharacterClass(value) {
  102 |   return value.replace(/[\\\]\-^]/g, '\\$&');
  103 | }
  104 | 
  105 | function assertThousandsGrouped(displayedText, rawPrice, groupingConfig) {
  106 |   const rawDigits = String(rawPrice);
  107 |   const separators = groupingConfig.allowedSeparators
  108 |     .map(escapeForCharacterClass)
  109 |     .join('');
  110 |   const numericTokenPattern = new RegExp(`\\d[\\d${separators}]*`, 'gu');
  111 |   const candidates = displayedText.match(numericTokenPattern) || [];
  112 |   const displayedPrice = candidates.find(
  113 |     (candidate) => candidate.replace(/\D/gu, '') === rawDigits,
  114 |   );
  115 | 
  116 |   expect(displayedPrice).toBeDefined();
  117 |   expect(displayedPrice).not.toBe(rawDigits);
  118 | 
  119 |   const groupedPattern = new RegExp(
  120 |     `^\\d{1,3}([${separators}])\\d{3}(?:\\1\\d{3})*$`,
  121 |     'u',
  122 |   );
  123 | 
> 124 |   expect(displayedPrice).toMatch(groupedPattern);
      |                          ^ Error: expect(received).toMatch(expected)
  125 |   expect(displayedPrice.replace(/\D/gu, '')).toBe(rawDigits);
  126 | }
  127 | 
  128 | async function controlledProductSearchResponse(page, setup) {
  129 |   const routePattern = '**/api/products?*';
  130 |   const handler = async (route) => {
  131 |     const request = route.request();
  132 |     const url = new URL(request.url());
  133 |     const isControlledSearch =
  134 |       request.method() === setup.requestMethod &&
  135 |       url.pathname === setup.requestPath &&
  136 |       (!setup.requestMatch.requiresSearchQuery ||
  137 |         (url.searchParams.has('search') &&
  138 |           url.searchParams.get('search') !== ''));
  139 | 
  140 |     if (!isControlledSearch) {
  141 |       await route.continue();
  142 |       return;
  143 |     }
  144 | 
  145 |     await route.fulfill({
  146 |       status: 200,
  147 |       contentType: 'application/json',
  148 |       body: JSON.stringify(setup.responseBody),
  149 |     });
  150 |   };
  151 | 
  152 |   await page.route(routePattern, handler);
  153 |   return async () => page.unroute(routePattern, handler);
  154 | }
  155 | 
  156 | function observeDialogs(page) {
  157 |   const messages = [];
  158 |   const listener = async (dialog) => {
  159 |     messages.push(dialog.message());
  160 |     await dialog.dismiss();
  161 |   };
  162 | 
  163 |   page.on('dialog', listener);
  164 | 
  165 |   return {
  166 |     messages,
  167 |     dispose: () => page.off('dialog', listener),
  168 |   };
  169 | }
  170 | 
  171 | module.exports = {
  172 |   assertThousandsGrouped,
  173 |   controlledProductSearchResponse,
  174 |   getDataset,
  175 |   getKeywordRegion,
  176 |   getProductCardByName,
  177 |   getProductHeading,
  178 |   getProductHeadings,
  179 |   getProductListing,
  180 |   getProductPrice,
  181 |   loadFr05Data,
  182 |   observeDialogs,
  183 |   openHome,
  184 |   submitSearch,
  185 | };
  186 | 
```