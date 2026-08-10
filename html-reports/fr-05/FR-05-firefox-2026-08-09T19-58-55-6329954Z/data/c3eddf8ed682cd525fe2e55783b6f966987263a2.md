# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-05\fr-05.spec.js >> FR-05 - Product listing and search >> FR05-TC-014 - Provide exactly one semantic h1
- Location: tests\fr-05\fr-05.spec.js:219:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('heading', { level: 1 })
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })
    14 × locator resolved to 2 elements
       - unexpected value "2"

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
  122 |       );
  123 |     }
  124 |   });
  125 | 
  126 |   test('FR05-TC-007 - Search by an exact known product name', async ({
  127 |     page,
  128 |   }) => {
  129 |     await openHome(page);
  130 |     await submitSearch(page, exactNameSearch.keyword);
  131 | 
  132 |     await expect(
  133 |       getProductHeading(page, exactNameSearch.expectedProductName),
  134 |     ).toBeVisible();
  135 |   });
  136 | 
  137 |   test('FR05-TC-008 - Exclude description-only keyword matches', async ({
  138 |     page,
  139 |   }) => {
  140 |     await openHome(page);
  141 |     await submitSearch(page, descriptionOnlySearch.keyword);
  142 | 
  143 |     await expect(getProductHeadings(page)).toHaveCount(
  144 |       descriptionOnlySearch.expectedProductResultCount,
  145 |     );
  146 | 
  147 |     for (const excludedName of descriptionOnlySearch.excludedProductNames) {
  148 |       await expect(getProductHeading(page, excludedName)).toHaveCount(0);
  149 |     }
  150 |   });
  151 | 
  152 |   test('FR05-TC-010 - Reflect a plain keyword as safe text', async ({
  153 |     page,
  154 |   }) => {
  155 |     const disposeRoute = await controlledProductSearchResponse(
  156 |       page,
  157 |       controlledSearchSetup,
  158 |     );
  159 | 
  160 |     try {
  161 |       await openHome(page);
  162 |       await submitSearch(page, plainTextInput.input);
  163 | 
  164 |       const keywordRegion = getKeywordRegion(page);
  165 |       await expect(keywordRegion).toHaveCount(1);
  166 |       await expect(keywordRegion).toBeVisible();
  167 |       await expect(keywordRegion).toContainText(plainTextInput.input);
  168 |     } finally {
  169 |       await disposeRoute();
  170 |     }
  171 |   });
  172 | 
  173 |   test('FR05-TC-011 - Keep formatting markup as literal safe text', async ({
  174 |     page,
  175 |   }) => {
  176 |     const disposeRoute = await controlledProductSearchResponse(
  177 |       page,
  178 |       controlledSearchSetup,
  179 |     );
  180 | 
  181 |     try {
  182 |       await openHome(page);
  183 |       await submitSearch(page, formattingMarkupInput.input);
  184 | 
  185 |       const keywordRegion = getKeywordRegion(page);
  186 |       await expect(keywordRegion).toHaveCount(1);
  187 |       await expect(keywordRegion).toContainText(formattingMarkupInput.input);
  188 |       await expect(keywordRegion.locator('b')).toHaveCount(0);
  189 |     } finally {
  190 |       await disposeRoute();
  191 |     }
  192 |   });
  193 | 
  194 |   test('FR05-TC-012 - Prevent event-handler markup execution', async ({
  195 |     page,
  196 |   }) => {
  197 |     const dialogObserver = observeDialogs(page);
  198 |     const disposeRoute = await controlledProductSearchResponse(
  199 |       page,
  200 |       controlledSearchSetup,
  201 |     );
  202 | 
  203 |     try {
  204 |       await openHome(page);
  205 |       await submitSearch(page, eventHandlerInput.input);
  206 | 
  207 |       const keywordRegion = getKeywordRegion(page);
  208 |       await expect(keywordRegion).toHaveCount(1);
  209 |       await expect(keywordRegion).toBeVisible();
  210 |       expect.soft(dialogObserver.messages).toHaveLength(0);
  211 |       await expect.soft(keywordRegion).toContainText(eventHandlerInput.input);
  212 |       await expect(keywordRegion.locator('img[onerror]')).toHaveCount(0);
  213 |     } finally {
  214 |       dialogObserver.dispose();
  215 |       await disposeRoute();
  216 |     }
  217 |   });
  218 | 
  219 |   test('FR05-TC-014 - Provide exactly one semantic h1', async ({ page }) => {
  220 |     await openHome(page);
  221 | 
> 222 |     await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      |                                                           ^ Error: expect(locator).toHaveCount(expected) failed
  223 |   });
  224 | 
  225 |   test('FR05-TC-017 - Present the product listing as a CSS grid', async ({
  226 |     page,
  227 |   }) => {
  228 |     await openHome(page);
  229 | 
  230 |     const listing = await getProductListing(
  231 |       page,
  232 |       seedCatalog.gridLocatorAnchorProductNames,
  233 |     );
  234 |     await expect(listing).toHaveCSS('display', 'grid');
  235 |   });
  236 | });
  237 | 
```