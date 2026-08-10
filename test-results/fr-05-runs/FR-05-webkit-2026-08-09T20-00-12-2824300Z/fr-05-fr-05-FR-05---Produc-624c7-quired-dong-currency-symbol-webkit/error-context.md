# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-05\fr-05.spec.js >> FR-05 - Product listing and search >> FR05-TC-005 - Display the required dong currency symbol
- Location: tests\fr-05\fr-05.spec.js:92:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('main').getByRole('heading', { name: 'iPhone 15 Pro Max', exact: true, level: 2 }).locator('..').locator('p').filter({ hasText: /\d/ })
Expected substring: "₫"
Received string:    "30,000,000 VND"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('main').getByRole('heading', { name: 'iPhone 15 Pro Max', exact: true, level: 2 }).locator('..').locator('p').filter({ hasText: /\d/ })
    13 × locator resolved to <p class="text-red-500 font-bold mb-2">30,000,000 VND</p>
       - unexpected value "30,000,000 VND"

```

```yaml
- paragraph: 30,000,000 VND
```

# Test source

```ts
  2   | const {
  3   |   assertThousandsGrouped,
  4   |   controlledProductSearchResponse,
  5   |   getDataset,
  6   |   getKeywordRegion,
  7   |   getProductCardByName,
  8   |   getProductHeading,
  9   |   getProductHeadings,
  10  |   getProductListing,
  11  |   getProductPrice,
  12  |   loadFr05Data,
  13  |   observeDialogs,
  14  |   openHome,
  15  |   submitSearch,
  16  | } = require('./helpers/fr-05-helpers');
  17  | 
  18  | const fr05Data = loadFr05Data();
  19  | const seedCatalog = fr05Data.seedCatalog;
  20  | const knownVisibilityProduct = seedCatalog.products[0];
  21  | const exactNameSearch = getDataset(fr05Data.searchInputs, 'FR05-DATA-002');
  22  | const descriptionOnlySearch = getDataset(
  23  |   fr05Data.searchInputs,
  24  |   'FR05-DATA-003',
  25  | );
  26  | const plainTextInput = getDataset(
  27  |   fr05Data.safeRenderingInputs,
  28  |   'FR05-DATA-004',
  29  | );
  30  | const formattingMarkupInput = getDataset(
  31  |   fr05Data.safeRenderingInputs,
  32  |   'FR05-DATA-005',
  33  | );
  34  | const eventHandlerInput = getDataset(
  35  |   fr05Data.safeRenderingInputs,
  36  |   'FR05-DATA-006',
  37  | );
  38  | const controlledSearchSetup = getDataset(
  39  |   fr05Data.environmentSetups,
  40  |   'FR05-SETUP-002',
  41  | );
  42  | 
  43  | test.describe('FR-05 - Product listing and search', () => {
  44  |   test('FR05-TC-001 - Display the complete controlled catalog', async ({
  45  |     page,
  46  |   }) => {
  47  |     await openHome(page);
  48  | 
  49  |     await expect(getProductHeadings(page)).toHaveCount(
  50  |       seedCatalog.expectedCount,
  51  |     );
  52  | 
  53  |     for (const product of seedCatalog.products) {
  54  |       const heading = getProductHeading(page, product.name);
  55  |       await expect(heading).toHaveCount(1);
  56  |       await expect(heading).toBeVisible();
  57  |     }
  58  |   });
  59  | 
  60  |   test('FR05-TC-002 - Display a known product name', async ({ page }) => {
  61  |     await openHome(page);
  62  | 
  63  |     await expect(
  64  |       getProductHeading(page, knownVisibilityProduct.name),
  65  |     ).toBeVisible();
  66  |   });
  67  | 
  68  |   test('FR05-TC-003 - Associate an image element with each product', async ({
  69  |     page,
  70  |   }) => {
  71  |     await openHome(page);
  72  | 
  73  |     for (const product of seedCatalog.products) {
  74  |       const image = getProductCardByName(page, product.name).locator('img');
  75  |       await expect(image).toHaveCount(1);
  76  |       await expect(image).toHaveAttribute('src', product.imageUrl);
  77  |     }
  78  |   });
  79  | 
  80  |   test('FR05-TC-004 - Provide a present non-empty alt attribute', async ({
  81  |     page,
  82  |   }) => {
  83  |     await openHome(page);
  84  | 
  85  |     for (const product of seedCatalog.products) {
  86  |       const image = getProductCardByName(page, product.name).locator('img');
  87  |       await expect(image).toHaveCount(1);
  88  |       await expect(image).toHaveAttribute('alt', /\S/u);
  89  |     }
  90  |   });
  91  | 
  92  |   test('FR05-TC-005 - Display the required dong currency symbol', async ({
  93  |     page,
  94  |   }) => {
  95  |     await openHome(page);
  96  | 
  97  |     for (const product of seedCatalog.products) {
  98  |       const price = getProductPrice(
  99  |         getProductCardByName(page, product.name),
  100 |       );
  101 |       await expect(price).toHaveCount(1);
> 102 |       await expect(price).toContainText(
      |                           ^ Error: expect(locator).toContainText(expected) failed
  103 |         seedCatalog.priceExpectation.currencySymbol,
  104 |       );
  105 |     }
  106 |   });
  107 | 
  108 |   test('FR05-TC-006 - Use consistent conventional thousand grouping', async ({
  109 |     page,
  110 |   }) => {
  111 |     await openHome(page);
  112 | 
  113 |     for (const product of seedCatalog.products) {
  114 |       const price = getProductPrice(
  115 |         getProductCardByName(page, product.name),
  116 |       );
  117 |       await expect(price).toHaveCount(1);
  118 |       assertThousandsGrouped(
  119 |         await price.innerText(),
  120 |         product.rawPrice,
  121 |         seedCatalog.priceExpectation.thousandGrouping,
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
```