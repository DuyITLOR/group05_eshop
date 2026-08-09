const { test, expect } = require('@playwright/test');
const {
  assertThousandsGrouped,
  controlledProductSearchResponse,
  getDataset,
  getKeywordRegion,
  getProductCardByName,
  getProductHeading,
  getProductHeadings,
  getProductListing,
  getProductPrice,
  loadFr05Data,
  observeDialogs,
  openHome,
  submitSearch,
} = require('./helpers/fr-05-helpers');

const fr05Data = loadFr05Data();
const seedCatalog = fr05Data.seedCatalog;
const knownVisibilityProduct = seedCatalog.products[0];
const exactNameSearch = getDataset(fr05Data.searchInputs, 'FR05-DATA-002');
const descriptionOnlySearch = getDataset(
  fr05Data.searchInputs,
  'FR05-DATA-003',
);
const plainTextInput = getDataset(
  fr05Data.safeRenderingInputs,
  'FR05-DATA-004',
);
const formattingMarkupInput = getDataset(
  fr05Data.safeRenderingInputs,
  'FR05-DATA-005',
);
const eventHandlerInput = getDataset(
  fr05Data.safeRenderingInputs,
  'FR05-DATA-006',
);
const controlledSearchSetup = getDataset(
  fr05Data.environmentSetups,
  'FR05-SETUP-002',
);

test.describe('FR-05 - Product listing and search', () => {
  test('FR05-TC-001 - Display the complete controlled catalog', async ({
    page,
  }) => {
    await openHome(page);

    await expect(getProductHeadings(page)).toHaveCount(
      seedCatalog.expectedCount,
    );

    for (const product of seedCatalog.products) {
      const heading = getProductHeading(page, product.name);
      await expect(heading).toHaveCount(1);
      await expect(heading).toBeVisible();
    }
  });

  test('FR05-TC-002 - Display a known product name', async ({ page }) => {
    await openHome(page);

    await expect(
      getProductHeading(page, knownVisibilityProduct.name),
    ).toBeVisible();
  });

  test('FR05-TC-003 - Associate an image element with each product', async ({
    page,
  }) => {
    await openHome(page);

    for (const product of seedCatalog.products) {
      const image = getProductCardByName(page, product.name).locator('img');
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute('src', product.imageUrl);
    }
  });

  test('FR05-TC-004 - Provide a present non-empty alt attribute', async ({
    page,
  }) => {
    await openHome(page);

    for (const product of seedCatalog.products) {
      const image = getProductCardByName(page, product.name).locator('img');
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute('alt', /\S/u);
    }
  });

  test('FR05-TC-005 - Display the required dong currency symbol', async ({
    page,
  }) => {
    await openHome(page);

    for (const product of seedCatalog.products) {
      const price = getProductPrice(
        getProductCardByName(page, product.name),
      );
      await expect(price).toHaveCount(1);
      await expect(price).toContainText(
        seedCatalog.priceExpectation.currencySymbol,
      );
    }
  });

  test('FR05-TC-006 - Use consistent conventional thousand grouping', async ({
    page,
  }) => {
    await openHome(page);

    for (const product of seedCatalog.products) {
      const price = getProductPrice(
        getProductCardByName(page, product.name),
      );
      await expect(price).toHaveCount(1);
      assertThousandsGrouped(
        await price.innerText(),
        product.rawPrice,
        seedCatalog.priceExpectation.thousandGrouping,
      );
    }
  });

  test('FR05-TC-007 - Search by an exact known product name', async ({
    page,
  }) => {
    await openHome(page);
    await submitSearch(page, exactNameSearch.keyword);

    await expect(
      getProductHeading(page, exactNameSearch.expectedProductName),
    ).toBeVisible();
  });

  test('FR05-TC-008 - Exclude description-only keyword matches', async ({
    page,
  }) => {
    await openHome(page);
    await submitSearch(page, descriptionOnlySearch.keyword);

    await expect(getProductHeadings(page)).toHaveCount(
      descriptionOnlySearch.expectedProductResultCount,
    );

    for (const excludedName of descriptionOnlySearch.excludedProductNames) {
      await expect(getProductHeading(page, excludedName)).toHaveCount(0);
    }
  });

  test('FR05-TC-010 - Reflect a plain keyword as safe text', async ({
    page,
  }) => {
    const disposeRoute = await controlledProductSearchResponse(
      page,
      controlledSearchSetup,
    );

    try {
      await openHome(page);
      await submitSearch(page, plainTextInput.input);

      const keywordRegion = getKeywordRegion(page);
      await expect(keywordRegion).toHaveCount(1);
      await expect(keywordRegion).toBeVisible();
      await expect(keywordRegion).toContainText(plainTextInput.input);
    } finally {
      await disposeRoute();
    }
  });

  test('FR05-TC-011 - Keep formatting markup as literal safe text', async ({
    page,
  }) => {
    const disposeRoute = await controlledProductSearchResponse(
      page,
      controlledSearchSetup,
    );

    try {
      await openHome(page);
      await submitSearch(page, formattingMarkupInput.input);

      const keywordRegion = getKeywordRegion(page);
      await expect(keywordRegion).toHaveCount(1);
      await expect(keywordRegion).toContainText(formattingMarkupInput.input);
      await expect(keywordRegion.locator('b')).toHaveCount(0);
    } finally {
      await disposeRoute();
    }
  });

  test('FR05-TC-012 - Prevent event-handler markup execution', async ({
    page,
  }) => {
    const dialogObserver = observeDialogs(page);
    const disposeRoute = await controlledProductSearchResponse(
      page,
      controlledSearchSetup,
    );

    try {
      await openHome(page);
      await submitSearch(page, eventHandlerInput.input);

      const keywordRegion = getKeywordRegion(page);
      await expect(keywordRegion).toHaveCount(1);
      await expect(keywordRegion).toBeVisible();
      expect.soft(dialogObserver.messages).toHaveLength(0);
      await expect.soft(keywordRegion).toContainText(eventHandlerInput.input);
      await expect(keywordRegion.locator('img[onerror]')).toHaveCount(0);
    } finally {
      dialogObserver.dispose();
      await disposeRoute();
    }
  });

  test('FR05-TC-014 - Provide exactly one semantic h1', async ({ page }) => {
    await openHome(page);

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('FR05-TC-017 - Present the product listing as a CSS grid', async ({
    page,
  }) => {
    await openHome(page);

    const listing = await getProductListing(
      page,
      seedCatalog.gridLocatorAnchorProductNames,
    );
    await expect(listing).toHaveCSS('display', 'grid');
  });
});
