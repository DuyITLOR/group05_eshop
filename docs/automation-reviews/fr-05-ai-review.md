# FR-05 — AI-Generated Automation Code Review

## Status

`AUTOMATION_REVIEW_REQUIRED`

Feature: `FR-05 — Product listing and search`

Reviewed files:

- `playwright.config.js`
- `tests/fr-05/fr-05.spec.js`
- `tests/fr-05/helpers/fr-05-helpers.js`
- `test-data/fr-05.json`
- `docs/gaps/fr-05-automation-gaps.md`

Review method: `STATIC_REVIEW`

Execution verification: `NOT_EXECUTED`

## Review Findings

| Review ID      | Test Case ID                          | File / Section                                                     | Problem                                                                                                                                                                      | Risk                                                                                                           | Recommended Correction                                                                                                                                                                                      | Why AI Missed It                                                                                                                         | Human Decision        | Verification                                       |
| -------------- | ------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------- |
| `FR05-REV-001` | FR05-TC-010, FR05-TC-011, FR05-TC-012 | `tests/fr-05/helpers/fr-05-helpers.js`; controlled route lifecycle | Initial generated draft relied on page teardown instead of explicitly removing the controlled route handler.                                                                 | Route state could leak if fixture lifecycle changes or a page is reused.                                       | Return an explicit disposer from `controlledProductSearchResponse()` and invoke it in `finally`.                                                                                                            | The first draft treated fresh-page teardown as sufficient cleanup and did not fully mirror the approved cleanup plan.                    | `MODIFIED`            | `NOT_EXECUTED`                                     |
| `FR05-REV-002` | All generated cases                   | Playwright dependency / repository root                            | `@playwright/test` is not installed and no root package manifest currently declares it.                                                                                      | Future execution cannot start until the dependency and browser binaries are approved and installed.            | Defer dependency and browser-binary installation to the approved Execution Readiness phase and use the repository's selected package-manager workflow.                                                      | `GENERATE_ONLY` explicitly prohibits package installation; source generation can be completed but execution readiness cannot be claimed. | `DEFERRED`            | `NOT_EXECUTED`                                     |
| `FR05-REV-003` | FR05-TC-003–FR05-TC-006, FR05-TC-017  | `getProductCardByName()` / `getProductListing()`                   | Card and listing discovery uses parent/common-parent traversal from product headings because the SUT provides no semantic card/listing locator.                              | A DOM wrapper change can break otherwise valid tests.                                                          | Retain this narrow ancestor coupling as an accepted, documented risk; prefer a future approved semantic region/article or stable test ID.                                                                   | The approved plan permits current ancestor/common-parent scoping but the implementation lacks a stronger locator contract.               | `APPROVED`            | `NOT_EXECUTED`                                     |
| `FR05-REV-004` | FR05-TC-005, FR05-TC-006              | `getProductPrice()`                                                | Price discovery uses a card-scoped paragraph containing a digit.                                                                                                             | A future numeric description paragraph could produce multiple matches or bind to the wrong text.               | Retain the current card-scoped numeric paragraph locator as an accepted fragility; introduce price semantics only through a separately approved SUT change.                                                 | The current markup has one numeric paragraph per card and no dedicated price semantics.                                                  | `APPROVED`            | `NOT_EXECUTED`                                     |
| `FR05-REV-005` | FR05-TC-010–FR05-TC-012               | `getKeywordRegion()`                                               | Keyword-region discovery depends on the visible prefix `Kết quả tìm kiếm cho:` and current descendant `span`.                                                                | Copy or wrapper changes can break the locator; broad scope could create false positives.                       | Retain the prefix-scoped keyword locator as the strongest available locator; add stable semantics only through a separately approved SUT change.                                                            | The SUT has no label, role, or test ID for this region, so the approved plan uses the current prefix as the best available anchor.       | `APPROVED`            | `NOT_EXECUTED`                                     |
| `FR05-REV-006` | FR05-TC-012                           | Dialog observation                                                 | Absence of an input-triggered dialog is observed after the controlled response and visible keyword region, but event timing has not been validated across engines.           | A browser-specific event-ordering difference could create a false negative if observation completes too early. | During approved multi-browser execution, collect the evidence needed to verify dialog capture on Chromium, Firefox and WebKit together with the independent `img[onerror]` and literal-text assertions.     | Static review cannot prove cross-browser dialog scheduling.                                                                              | `NEEDS_MORE_EVIDENCE` | `NOT_EXECUTED`                                     |
| `FR05-REV-007` | All generated cases                   | `playwright.config.js` HTML reporter                               | Reporter metadata alone did not guarantee that the required run identity would be visible in the HTML report title; the rendered report remains unverified.                  | The final HTML might omit visibly identifiable student/run information even though metadata exists.            | Configure a visible HTML reporter title containing Feature ID, `Run by: <StudentID>`, ISO timestamp and Run ID from existing runtime-derived values; inspect the rendered report during approved execution. | The initial draft assumed reporter metadata alone was sufficient for visible identity.                                                   | `MODIFIED`            | `STATIC_REVIEW_PASSED_RUNTIME_REPORT_NOT_VERIFIED` |
| `FR05-REV-008` | FR05-TC-002                           | `tests/fr-05/fr-05.spec.js`; dataset traceability                  | TC-002 selected its known visible product through `FR05-DATA-002`, although the approved mapping reserves that search dataset for TC-007 and maps TC-002 to `FR05-DATA-001`. | Cross-case dataset coupling breaks approved traceability and could make TC-002 depend on search-specific data. | Select a deterministic known product from `seedCatalog.products` (`FR05-DATA-001`) for TC-002 and retain `FR05-DATA-002` exclusively for TC-007.                                                            | The initial implementation reused the convenient exact-search product without cross-checking the per-case dataset mapping.               | `MODIFIED`            | `STATIC_REVIEW_PASSED`                             |

`FR05-REV-001` was corrected during generation because it was a direct cleanup consistency defect. Human review subsequently resolved or classified `FR05-REV-002`–`FR05-REV-008` as recorded above. Runtime verification remains `NOT_EXECUTED`.

## Static Review Checklist

| Check                                        | Result                                    | Notes                                                                                                                                                                 |
| -------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fragile selectors                            | `RISK_RECORDED`                           | Parent/common-parent, price paragraph and keyword-prefix risks are documented above.                                                                                  |
| Absolute XPath                               | `PASS`                                    | None.                                                                                                                                                                 |
| Weak or missing assertions                   | `PASS_WITH_BOUNDARY`                      | Approved primary objectives are asserted; semantic alt quality remains outside the automated objective.                                                               |
| Partial Expected Result coverage             | `PASS_WITH_BOUNDARY`                      | TC-004 automates present/non-empty alt only; blocked empty/loading objectives remain gaps.                                                                            |
| Inline/hardcoded datasets                    | `PASS`                                    | Seed manifest, search inputs and controlled response body come from `test-data/fr-05.json`.                                                                           |
| Shared mutable state / test-order dependency | `PASS`                                    | Tests use fresh Playwright pages and do not mutate business data.                                                                                                     |
| Missing cleanup                              | `CORRECTED_IN_DRAFT`                      | Controlled routes now use explicit disposers in `finally`; dialog listener is removed.                                                                                |
| `waitForTimeout()`                           | `PASS`                                    | None.                                                                                                                                                                 |
| `force: true`                                | `PASS`                                    | None.                                                                                                                                                                 |
| Retries                                      | `PASS`                                    | Configured as `0`; no retry masks failures.                                                                                                                           |
| Swallowed errors                             | `PASS`                                    | No `catch` block suppresses failures.                                                                                                                                 |
| `nth()` / unstable index                     | `PASS`                                    | None.                                                                                                                                                                 |
| Over-abstraction                             | `PASS`                                    | Helpers cover repeated data, navigation, locators, route control and dialog observation only.                                                                         |
| Browser mapping                              | `PASS_STATIC`                             | Projects explicitly select `chromium`, `firefox`, and `webkit` through `browserName`.                                                                                 |
| HTML reporter                                | `PASS_STATIC`                             | HTML reporter has a visible runtime-derived title containing Feature ID, literal `Run by:`, Student ID, ISO timestamp and Run ID; rendered report remains unverified. |
| Metadata strategy                            | `PASS_WITH_RUNTIME_VERIFICATION_REQUIRED` | Student ID, ISO timestamp, Feature ID and Run ID remain in metadata and the visible title; browser is represented by project.                                         |
| Automation script count                      | `PASS_STATIC`                             | 13 unique approved candidate IDs; minimum is 12.                                                                                                                      |
| Blocked-case handling                        | `PASS`                                    | Four blocked IDs are absent from the spec and present in the gap report.                                                                                              |

## Static Validation Evidence

| Validation                         | Result                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript syntax (`node --check`) | `PASS` for config, helper and spec.                                                                                                                     |
| Generated test count               | `PASS` — 13 tests.                                                                                                                                      |
| Unique/approved Test Case ID set   | `PASS` — exactly the 13 approved automation candidates.                                                                                                 |
| Minimum automation count           | `PASS` — 13 ≥ 12.                                                                                                                                       |
| TC-002 dataset traceability        | `PASS_STATIC` — deterministic known product is selected from `FR05-DATA-001`; no inline product constant.                                               |
| TC-007 dataset traceability        | `PASS_STATIC` — exact-name search continues to consume `FR05-DATA-002`.                                                                                 |
| Blocked IDs absent from spec       | `PASS`.                                                                                                                                                 |
| External JSON parse and path       | `PASS`.                                                                                                                                                 |
| `FR05-SETUP-002` integration       | `PASS_STATIC`; response body is not duplicated inline.                                                                                                  |
| Prohibited-pattern scan            | `PASS` — no `waitForTimeout()`, `force: true`, `test.skip()`, `test.fail()`, swallowed `catch`, or `nth()`.                                             |
| Thousand-grouping examples         | `PASS_STATIC` — approved five separator types accepted consistently; raw digits, hyphens, letters and mixed separators rejected.                        |
| HTML report identity               | `PASS_STATIC` — visible title contains Feature ID, literal `Run by:`, runtime Student ID, ISO timestamp and Run ID; rendered output remains unverified. |
| Playwright/browser execution       | `NOT_EXECUTED`.                                                                                                                                         |

## Expected Product-Defect Exposure

Static implementation inspection indicates that future execution may expose requirement violations; no runtime result is claimed:

- `FR05-TC-004`: current product images use `alt=""`.
- `FR05-TC-005`: current prices use `VND` instead of required `₫`.
- `FR05-TC-011` and `FR05-TC-012`: reflected search input uses `dangerouslySetInnerHTML`.
- `FR05-TC-014`: current non-empty home page renders two `<h1>` elements.

## Current Checkpoint

`CHECKPOINT: AUTOMATION_REVIEW_REQUIRED`

## TC-006 Correction Review Update

Phần này ghi nhận riêng sự cố runtime đã được Chromium phát hiện sau khi các review trước đã được review. Không thay đổi verdict hay evidence lịch sử của các review trước.

| Review ID | Test Case ID | File / Section | Problem | Risk | Recommended Correction | Why AI Missed It | Human Decision | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR05-REV-009 | FR05-TC-006 | tests/fr-05/helpers/fr-05-helpers.js; assertThousandsGrouped() | Candidate extraction dùng character class bao gồm regular space nên đã thu cả khoảng trắng ngoài ngay trước hậu tố VND trong 30,000,000 VND; pattern grouping sau đó coi khoảng trắng này là separator và báo lỗi sai. | Valid price display bị false failure, khiến lỗi automation bị nhầm là product defect và chặn cross-browser execution. | Chỉ trích xuất số có các group hoàn chỉnh gồm 1-3 digits, separator, rồi 3 digits; kiểm tra từng separator được approved và giữ cùng separator xuyên suốt. Không diễn giải hoặc special-case hậu tố VND. | Initial helper kiểm tra digit-normalization trước, nhưng không buộc separator trong candidate phải đứng giữa hai digit groups. | MODIFIED | STATIC_REVIEW_PASSED — 5 accepted, 5 rejected; then RUNTIME_VERIFIED_CHROMIUM — rerun Chromium FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z passed FR05-TC-006. |

### TC-006 Correction Validation

| Validation | Result | Evidence |
| --- | --- | --- |
| Helper syntax | PASS | node --check tests/fr-05/helpers/fr-05-helpers.js |
| Grouping regression set | PASS | Accepted: comma, period, regular space, NBSP and narrow NBSP. Rejected: raw digits, hyphen, letter and mixed-separator forms. |
| Approved test inventory | PASS | 13 unique approved candidate IDs unchanged. |
| Chromium rerun | PASS_WITH_KNOWN_PRODUCT_DEFECTS | FR05-TC-006 passed; the only failures are FR05-TC-004, FR05-TC-005, FR05-TC-011, FR05-TC-012, and FR05-TC-014. |
| Product assertions | UNCHANGED | No Expected Result or product-defect assertion was weakened. |

## Current Checkpoint After TC-006 Correction

CHECKPOINT: TC006_CORRECTION_REVIEW_REQUIRED

## FR05-REV-006 Multi-Browser Runtime Evidence

`FR05-REV-006` originally remained `NEEDS_MORE_EVIDENCE` because static review could not prove dialog timing across engines. The historical review row is preserved. The following runtime evidence resolves that evidence gap without changing the test or its assertions.

| Engine | Dialog observer active | Dialog count | Dialog messages | Literal-text result | img[onerror] result | Evidence source |
| --- | --- | ---: | --- | --- | --- | --- |
| Chromium | Yes | 2 | FR05-XSS; FR05-XSS | FAILED — reflected markup was not literal text | FAILED — count 1 | FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z |
| Firefox | Yes | 2 | FR05-XSS; FR05-XSS | FAILED — reflected markup was not literal text | FAILED — count 1 | FR-05-firefox-2026-08-09T19-58-55-6329954Z |
| WebKit | Yes | 1 | FR05-XSS | FAILED — reflected markup was not literal text | FAILED — count 1 | FR-05-webkit-2026-08-09T20-00-12-2824300Z |

Final Verification: `RUNTIME_VERIFIED_MULTI_BROWSER`.

The dialog-count difference (2 / 2 / 1) is browser-specific evidence that the unsafe markup executed in all engines. It is classified as `PRODUCT_DEFECT`; the observer captured real dialogs in every engine, so no timing-based `AUTOMATION_DEFECT` or `ENVIRONMENT_FAILURE` was found.

## Current Checkpoint After Cross-Browser Execution

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
