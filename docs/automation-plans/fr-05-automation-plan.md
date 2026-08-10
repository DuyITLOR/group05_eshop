# FR-05 — Playwright Automation Plan

## Status

`AUTOMATION_PLAN_APPROVED`

Workflow Mode: `PLAN_ONLY`

Feature: `FR-05 — Product listing and search`

Actor: Public user

Approved Test Case File: `docs/test-cases/fr-05/test-cases.md`

Test Data Format: `JSON`

Target Browsers: `chromium`, `firefox`, `webkit`

## Planning Boundary

Plan này chỉ xác định automation readiness, setup, data, locator và assertion strategy. Không tạo JSON, Playwright scripts/config, không chạy SUT/browser/Playwright và không sửa SUT hoặc database. Approved Expected Results được giữ nguyên; implementation chỉ được dùng để đánh giá feasibility và discrepancies.

## Approved Inputs Validation

| Check                               | Result | Evidence                                                                                                                  |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Approved test-case design exists    | `PASS` | `docs/test-cases/fr-05/test-cases.md` có 17 unique Test Case IDs.                                                         |
| Human approval exists               | `PASS` | `docs/test-cases/fr-05/review-notes.md`: `APPROVED`, `APPROVE TEST CASE DESIGN`, `CHECKPOINT: TEST_CASE_DESIGN_APPROVED`. |
| Authoritative requirements readable | `PASS` | `README.md`: FR-05, FR-21, FR-24, SEC-04.                                                                                 |
| Supporting API contract readable    | `PASS` | `api_specification.md` section 3.1: `GET /api/products?search=keyword`, search theo product name.                         |
| Existing seed source readable       | `PASS` | `backend/database.js` defines five verified seed products.                                                                |
| Frontend implementation inspectable | `PASS` | `frontend-web/src/pages/Home.jsx` and `frontend-web/src/App.jsx`.                                                         |
| PLAN_ONLY output path               | `PASS` | `docs/automation-plans/`.                                                                                                 |

Missing runtime-only inputs such as SUT Base URL confirmation, Student ID, Playwright installation, browser binaries and report paths do not block `PLAN_ONLY`; they must be validated before generation/execution. No runtime readiness is claimed here.

## Automation Minimum Pre-check

The upstream count was not accepted without review. Each approved case was checked against its primary objective, Expected Result, setup path, duplication risk and unresolved-requirement dependency.

| Test Case ID | Primary Objective Independently Automatable | Objective Assertable | Realistic Setup Path                                                            | Duplicate | Primary Objective Depends on Unresolved Requirement           | Pre-check Result                  |
| ------------ | ------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------- | --------------------------------- |
| FR05-TC-001  | Yes                                         | Yes                  | Verified five-product seed catalog                                              | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-002  | Yes                                         | Yes                  | Public home route and verified seed name                                        | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-003  | Yes                                         | Yes                  | Seed manifest plus image element locator                                        | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-004  | Yes                                         | Yes                  | Seed manifest plus `alt` attribute inspection                                   | No        | No; semantic descriptiveness is outside the primary objective | `CANDIDATE`                       |
| FR05-TC-005  | Yes                                         | Yes                  | Seed manifest plus card-scoped price locator                                    | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-006  | Yes                                         | Yes                  | Existing seed prices plus conventional-separator, locale-neutral grouping check | No        | No; exact separator is not required by the objective          | `CANDIDATE`                       |
| FR05-TC-007  | Yes                                         | Yes                  | Observed form-submit controls plus exact seed name                              | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-008  | Yes                                         | Yes                  | Verified description-only keyword oracle with expected product result count `0` | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-009  | No, with current SUT                        | Yes                  | No stable empty-state implementation/region exists                              | No        | No                                                            | `EXCLUDED_IMPLEMENTATION_BLOCKER` |
| FR05-TC-010  | Yes                                         | Yes                  | Scoped reflected-keyword region plus controlled response                        | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-011  | Yes                                         | Yes                  | Scoped region plus controlled empty response                                    | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-012  | Yes                                         | Yes                  | Dialog observation plus controlled empty response                               | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-013  | No, with current SUT                        | Yes                  | Response hold/release is feasible, but loading UI is absent                     | No        | No                                                            | `EXCLUDED_IMPLEMENTATION_BLOCKER` |
| FR05-TC-014  | Yes                                         | Yes                  | Semantic level-one heading count                                                | No        | No                                                            | `CANDIDATE`                       |
| FR05-TC-015  | No, with current SUT                        | Yes                  | No empty-state container/icon implementation exists                             | No        | No                                                            | `EXCLUDED_IMPLEMENTATION_BLOCKER` |
| FR05-TC-016  | No, with current SUT                        | Yes                  | No empty-state container/message implementation exists                          | No        | No                                                            | `EXCLUDED_IMPLEMENTATION_BLOCKER` |
| FR05-TC-017  | Yes                                         | Yes                  | Common parent of controlled product cards plus computed style                   | No        | No                                                            | `CANDIDATE`                       |

Result: `PASS` — **13** legitimate automation candidates remain, meeting Minimum Automation Script Count **12**. The four excluded cases remain in the plan inventory.

## Existing Seed Data Reuse

| Seed Product               |    Price | Existing Fact Reused                               | Test Case IDs                      |
| -------------------------- | -------: | -------------------------------------------------- | ---------------------------------- |
| `iPhone 15 Pro Max`        | 30000000 | Exact unique name, image URL, catalog member       | TC-001–007, TC-017                 |
| `Samsung Galaxy S24 Ultra` | 28000000 | Description contains `xuất sắc`; name does not     | TC-001, TC-003–006, TC-008, TC-017 |
| `MacBook Pro M3`           | 45000000 | Catalog member, image URL and grouped price oracle | TC-001, TC-003–006, TC-017         |
| `Tai nghe AirPods Pro 2`   |  6000000 | Description contains `xuất sắc`; name does not     | TC-001, TC-003–006, TC-008, TC-017 |
| `Bàn phím cơ Keychron Q1`  |  4000000 | Catalog member, image URL and grouped price oracle | TC-001, TC-003–006, TC-017         |

No new database product is required. Future external JSON should mirror the verified seed manifest and hold input-only search datasets; it must not duplicate data as inline arrays in specs.

## Shared Setup, Helpers and Cleanup

| Item                                     | Planned Responsibility                                                                                                                                                                                                                                           | Boundary                                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `fr05Data` loader                        | Read future `test-data/fr-05.json` and expose datasets by Test Case ID.                                                                                                                                                                                          | File is not created in `PLAN_ONLY`.                                                                |
| Seed-state precondition                  | Confirm the backend is in the repository's five-product seeded state before relevant tests.                                                                                                                                                                      | No database mutation/reset is performed in this phase.                                             |
| `openHome()`                             | Navigate to public home route and wait on the relevant `/api/products` response rather than a fixed timeout.                                                                                                                                                     | Base URL must be confirmed later.                                                                  |
| `submitSearch(keyword)`                  | Fill `getByPlaceholder('Tìm kiếm...')` and submit with `getByRole('button', { name: 'Tìm' })`.                                                                                                                                                                   | Uses observed form-submit behavior only; no debounce/trim/partial assumption.                      |
| `getProductCardByName(name)`             | Anchor on `getByRole('heading', { level: 2, name })`, then resolve the nearest current card container.                                                                                                                                                           | Ancestor scoping requires code-review scrutiny because no semantic card/test ID exists.            |
| `getKeywordRegion()`                     | Anchor on current visible label `Kết quả tìm kiếm cho:` and scope reflected-input assertions to that container.                                                                                                                                                  | Copy-dependent locator risk; no test ID may be invented.                                           |
| `assertThousandsGrouped(text, rawPrice)` | Isolate the displayed numeric token and require `^\d{1,3}([., \u00A0\u202F])\d{3}(?:\1\d{3})*$`: only period, comma, regular space, non-breaking space or narrow non-breaking space may separate groups, and the captured separator must be reused consistently. | Locale-neutral but deliberately rejects raw digits, hyphen, letters and mixed grouping separators. |
| Dialog observer                          | Record and dismiss any unexpected dialog so execution cannot hang; assert recorded dialog count is zero.                                                                                                                                                         | Required only for TC-012.                                                                          |
| Controlled search response               | Fulfill only the product-search request with an empty JSON array for reflected-input isolation in TC-010–012.                                                                                                                                                    | No artificial product records and no database writes.                                              |
| Per-test cleanup                         | Remove route handlers/listeners and use a fresh page/context per test.                                                                                                                                                                                           | Listing/search tests do not mutate business data.                                                  |

TC-006 grouping oracle examples: accept `30.000.000`, `30,000,000`, `30 000 000` and equivalent consistent `U+00A0`/`U+202F` forms; reject `30000000`, `30-000-000`, `30x000x000` and mixed separators such as `30.000,000`.

## Locator Strategy Registry

| Target                    | Preferred Locator Strategy                                                                | Risk                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Search textbox            | `getByPlaceholder('Tìm kiếm...')`                                                         | Placeholder copy may change; current implementation provides no label.                                    |
| Search submit             | `getByRole('button', { name: 'Tìm' })`                                                    | Low; current form has a named submit button.                                                              |
| Product name              | `main.getByRole('heading', { level: 2, name })`                                           | Same name elsewhere could require main/card scoping.                                                      |
| Product images            | `main.locator('img')`, correlated with JSON `src` values or scoped card                   | `alt=""` prevents reliable accessible-name targeting; card semantics are absent.                          |
| Product card              | Heading anchor followed by nearest current card ancestor                                  | DOM-ancestor coupling; review before generation.                                                          |
| Product price             | Product-card scope, then current price paragraph/text                                     | No semantic price locator or test ID.                                                                     |
| Keyword-display region    | Current visible prefix `Kết quả tìm kiếm cho:` then scoped container                      | Copy/DOM scoping risk.                                                                                    |
| Home headings             | `main.getByRole('heading', { level: 1 })`                                                 | Count must remain exact and not be weakened.                                                              |
| Product-listing container | Resolve the common parent of two independently located controlled product-card containers | Does not use Tailwind class, viewport or column count; depends on current shallow card/list relationship. |
| Empty/loading state       | None currently available                                                                  | Do not invent locators; affected cases are `BLOCKED_BY_IMPLEMENTATION`.                                   |

## Automation Plan Per Test Case

### FR05-TC-001

| Field                 | Plan                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-001`                                                                                        |
| Automation Status     | `READY_WITH_SETUP`                                                                                   |
| Requirement Status    | `CONFIRMED`                                                                                          |
| Implementation Status | `PRESENT_WITH_LOCATOR_RISK`                                                                          |
| Setup                 | Start from verified five-product seed state; open home and synchronize on initial products response. |
| Test Data             | Expected count `5` and all five names.                                                               |
| Data Source           | Existing seed manifest mirrored in future external JSON.                                             |
| Locator Strategy      | Count level-two product headings in `main`; assert each expected name exactly once.                  |
| Assertion Strategy    | `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`.                                              |
| Cleanup               | Fresh page; no data mutation.                                                                        |
| Risks                 | Uncontrolled database additions would invalidate the controlled-catalog oracle.                      |
| Dependencies          | Seed-state confirmation and JSON loader.                                                             |
| Automation Boundary   | Catalog completeness/count only; no grid assertion.                                                  |

### FR05-TC-002

| Field                 | Plan                                                               |
| --------------------- | ------------------------------------------------------------------ |
| Test Case ID          | `FR05-TC-002`                                                      |
| Automation Status     | `READY_FOR_AUTOMATION`                                             |
| Requirement Status    | `CONFIRMED`                                                        |
| Implementation Status | `PRESENT`                                                          |
| Setup                 | Open seeded home page.                                             |
| Test Data             | `iPhone 15 Pro Max`.                                               |
| Data Source           | Existing seed data via future JSON.                                |
| Locator Strategy      | `main.getByRole('heading', { level: 2, name: productName })`.      |
| Assertion Strategy    | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`.                     |
| Cleanup               | None beyond fresh page.                                            |
| Risks                 | Duplicate product names would require card identity strengthening. |
| Dependencies          | Public home route and seed product.                                |
| Automation Boundary   | Product name visibility only.                                      |

### FR05-TC-003

| Field                 | Plan                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-003`                                                                                                         |
| Automation Status     | `READY_WITH_SETUP`                                                                                                    |
| Requirement Status    | `CONFIRMED`                                                                                                           |
| Implementation Status | `PRESENT_WITH_LOCATOR_RISK`                                                                                           |
| Setup                 | Open seeded catalog and load expected image URLs.                                                                     |
| Test Data             | Five names and image URLs.                                                                                            |
| Data Source           | Existing seed manifest via future JSON.                                                                               |
| Locator Strategy      | Scope each current card by product heading; locate descendant `img`, or correlate `main.locator('img')` `src` values. |
| Assertion Strategy    | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `ATTRIBUTE_OR_CLASS`.                                                          |
| Cleanup               | None beyond fresh page.                                                                                               |
| Risks                 | External image availability must not be confused with image-element existence; card scope is not semantic.            |
| Dependencies          | Card helper and seed manifest.                                                                                        |
| Automation Boundary   | Image element and product association only; no alt or ratio judgement.                                                |

### FR05-TC-004

| Field                 | Plan                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-004`                                                                                                                           |
| Automation Status     | `READY_WITH_SETUP`                                                                                                                      |
| Requirement Status    | `CONFIRMED` for present/non-empty alt; semantic convention remains open.                                                                |
| Implementation Status | `NONCONFORMING_EXPECTED_DEFECT` (`alt=""`).                                                                                             |
| Setup                 | Open seeded catalog; locate all controlled product images.                                                                              |
| Test Data             | Five products; structural expectation `PRESENT_AND_NON_EMPTY`.                                                                          |
| Data Source           | Approved test case plus existing seed manifest.                                                                                         |
| Locator Strategy      | Product-card-scoped `img`, with `src` correlation if needed.                                                                            |
| Assertion Strategy    | `ATTRIBUTE_OR_CLASS`, `COUNT`; assert `alt` exists and trimmed value is non-empty.                                                      |
| Cleanup               | None beyond fresh page.                                                                                                                 |
| Risks                 | A non-empty value does not prove semantic descriptiveness.                                                                              |
| Dependencies          | Image/card helper.                                                                                                                      |
| Automation Boundary   | Objective checks are automated; semantic descriptive quality remains human/convention-dependent and does not make the case manual-only. |

### FR05-TC-005

| Field                 | Plan                                                       |
| --------------------- | ---------------------------------------------------------- |
| Test Case ID          | `FR05-TC-005`                                              |
| Automation Status     | `READY_WITH_SETUP`                                         |
| Requirement Status    | `CONFIRMED`                                                |
| Implementation Status | `NONCONFORMING_EXPECTED_DEFECT` (current UI uses `VND`).   |
| Setup                 | Open seeded catalog and scope each price to its product.   |
| Test Data             | Five names and prices.                                     |
| Data Source           | Existing seed manifest via future JSON.                    |
| Locator Strategy      | Product-card helper followed by scoped price text locator. |
| Assertion Strategy    | `TEXT_OR_VALUE`, `COUNT`; preserve required `₫`.           |
| Cleanup               | None beyond fresh page.                                    |
| Risks                 | Price has no semantic/test-id locator.                     |
| Dependencies          | Card helper and seed manifest.                             |
| Automation Boundary   | Currency symbol only; grouping is TC-006.                  |

### FR05-TC-006

| Field                 | Plan                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Test Case ID          | `FR05-TC-006`                                                                                                                                                                                                                  |
| Automation Status     | `READY_WITH_SETUP`                                                                                                                                                                                                             |
| Requirement Status    | `CONFIRMED`; exact separator/locale is unspecified but not needed for the approved objective.                                                                                                                                  |
| Implementation Status | `PRESENT_WITH_LOCATOR_RISK`                                                                                                                                                                                                    |
| Setup                 | Open seeded catalog; load existing raw prices.                                                                                                                                                                                 |
| Test Data             | `30000000`, `28000000`, `45000000`, `6000000`, `4000000` from seeds.                                                                                                                                                           |
| Data Source           | Existing seed manifest via future JSON.                                                                                                                                                                                        |
| Locator Strategy      | Product-card-scoped price text.                                                                                                                                                                                                |
| Assertion Strategy    | `TEXT_OR_VALUE`; require groups of three separated consistently by one captured conventional separator from `.`, `,`, regular space, `U+00A0` or `U+202F`. Reject raw uninterrupted digits, `-`, letters and mixed separators. |
| Cleanup               | None beyond fresh page.                                                                                                                                                                                                        |
| Risks                 | Locale varies by browser/host; accept the constrained conventional separator set without selecting one locale.                                                                                                                 |
| Dependencies          | Price helper and grouping assertion helper.                                                                                                                                                                                    |
| Automation Boundary   | No arbitrary numeric boundaries and no single locale assumption; non-conventional or inconsistent separators are invalid.                                                                                                      |

### FR05-TC-007

| Field                 | Plan                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-007`                                                                                                    |
| Automation Status     | `READY_WITH_SETUP`                                                                                               |
| Requirement Status    | `CONFIRMED`                                                                                                      |
| Implementation Status | `PRESENT`                                                                                                        |
| Setup                 | Open seeded home; submit through the observed form-submit button.                                                |
| Test Data             | Exact seed name `iPhone 15 Pro Max`.                                                                             |
| Data Source           | Existing seed data via future JSON.                                                                              |
| Locator Strategy      | `getByPlaceholder('Tìm kiếm...')`, `getByRole('button', { name: 'Tìm' })`, then level-two heading by exact name. |
| Assertion Strategy    | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`, `COUNT`.                                                          |
| Cleanup               | Fresh page; search does not mutate data.                                                                         |
| Risks                 | Matching semantics beyond exact known name remain out of scope.                                                  |
| Dependencies          | Search helper and seeded API.                                                                                    |
| Automation Boundary   | Form-submit exact-name search only; no partial/case/trim/debounce assumption.                                    |

### FR05-TC-008

| Field                 | Plan                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-008`                                                                                                                                            |
| Automation Status     | `READY_WITH_SETUP`                                                                                                                                       |
| Requirement Status    | `CONFIRMED`                                                                                                                                              |
| Implementation Status | `PRESENT`                                                                                                                                                |
| Setup                 | Open verified seed catalog and submit description-only keyword.                                                                                          |
| Test Data             | `xuất sắc`; expected product result count `0`; supporting excluded names Samsung and AirPods.                                                            |
| Data Source           | Existing seed names/descriptions via future JSON.                                                                                                        |
| Locator Strategy      | Search controls; count `main.getByRole('heading', { level: 2 })` as product results; optionally locate the two excluded names exactly.                   |
| Assertion Strategy    | Primary `COUNT`: product result headings equal `0`. Supporting `COUNT`/`VISIBILITY_OR_HIDDEN_STATE`: Samsung and AirPods headings are absent.            |
| Cleanup               | Fresh page.                                                                                                                                              |
| Risks                 | Must not depend on missing empty-state presentation.                                                                                                     |
| Dependencies          | Search helper and verified seed oracle.                                                                                                                  |
| Automation Boundary   | Assert deterministic product result count `0`; do not require empty-state UI. Empty-state presentation remains independent in TC-009, TC-015 and TC-016. |

### FR05-TC-009

| Field                 | Plan                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-009`                                                                                           |
| Automation Status     | `BLOCKED_BY_IMPLEMENTATION`                                                                             |
| Requirement Status    | `CONFIRMED`                                                                                             |
| Implementation Status | `MISSING_OR_NONCONFORMING`                                                                              |
| Setup                 | A no-result keyword and completed search are feasible.                                                  |
| Test Data             | `FR05-No-Result-7F3C`.                                                                                  |
| Data Source           | Future external JSON input-only dataset.                                                                |
| Locator Strategy      | No reliable observable empty-state region/locator exists; none will be invented.                        |
| Assertion Strategy    | Planned `VISIBILITY_OR_HIDDEN_STATE` plus result-card `COUNT` after a real empty-state contract exists. |
| Cleanup               | Fresh page.                                                                                             |
| Risks                 | Asserting only zero product cards would omit the primary empty-state objective.                         |
| Dependencies          | SUT empty-state implementation and stable region locator.                                               |
| Automation Boundary   | Requirement remains unchanged; automation is blocked until observable empty-state behavior exists.      |

### FR05-TC-010

| Field                 | Plan                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-010`                                                                                     |
| Automation Status     | `READY_WITH_SETUP`                                                                                |
| Requirement Status    | `CONFIRMED`                                                                                       |
| Implementation Status | `PRESENT_WITH_SECURITY_RISK`                                                                      |
| Setup                 | Use controlled empty search response to isolate reflected keyword rendering.                      |
| Test Data             | `FR05 Plain Keyword`.                                                                             |
| Data Source           | Future external JSON input-only dataset.                                                          |
| Locator Strategy      | Search controls; current keyword prefix to scope keyword-display region.                          |
| Assertion Strategy    | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`.                                                    |
| Cleanup               | Remove route handler; fresh page.                                                                 |
| Risks                 | Region has no semantic/test-id locator and current implementation uses `dangerouslySetInnerHTML`. |
| Dependencies          | Search helper, keyword-region helper and route setup.                                             |
| Automation Boundary   | Reflected plain text only; no product-result expectation.                                         |

### FR05-TC-011

| Field                 | Plan                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Test Case ID          | `FR05-TC-011`                                                                                          |
| Automation Status     | `READY_WITH_SETUP`                                                                                     |
| Requirement Status    | `CONFIRMED`                                                                                            |
| Implementation Status | `NONCONFORMING_EXPECTED_DEFECT` (`dangerouslySetInnerHTML`).                                           |
| Setup                 | Fulfill matching products request with controlled empty JSON response to isolate frontend rendering.   |
| Test Data             | `<b>FR05 HTML Keyword</b>`.                                                                            |
| Data Source           | Future external JSON input-only dataset.                                                               |
| Locator Strategy      | Scoped keyword-display region; descendant `b` restricted to that region.                               |
| Assertion Strategy    | `TEXT_OR_VALUE`, `COUNT`, `ATTRIBUTE_OR_CLASS`; literal text visible and input-derived `b` count zero. |
| Cleanup               | Remove route handler; fresh page.                                                                      |
| Risks                 | Global `b` assertions would create false positives; locator must remain scoped.                        |
| Dependencies          | Search helper, keyword-region helper and controlled response.                                          |
| Automation Boundary   | Preserve safe-text Expected Result even though execution is expected to reveal a product defect.       |

### FR05-TC-012

| Field                 | Plan                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-012`                                                                                                       |
| Automation Status     | `READY_WITH_SETUP`                                                                                                  |
| Requirement Status    | `CONFIRMED`                                                                                                         |
| Implementation Status | `NONCONFORMING_EXPECTED_DEFECT` (`dangerouslySetInnerHTML`).                                                        |
| Setup                 | Attach dialog observer before submit; fulfill search request with controlled empty JSON response.                   |
| Test Data             | `<img src=x onerror=alert('FR05-XSS')>`.                                                                            |
| Data Source           | Future external JSON input-only dataset.                                                                            |
| Locator Strategy      | Scoped keyword region plus document/region `img[onerror]`; dialog event listener.                                   |
| Assertion Strategy    | `DIALOG`, `COUNT`, `ATTRIBUTE_OR_CLASS`, `TEXT_OR_VALUE`; no dialog, no executable element, safe text if reflected. |
| Cleanup               | Dismiss unexpected dialog, remove listener/route and use fresh page.                                                |
| Risks                 | Real backend string-interpolated SQL can obscure the frontend objective; controlled response is required.           |
| Dependencies          | Dialog observer, search helper, keyword-region helper and route setup.                                              |
| Automation Boundary   | No failure swallowing or `test.fail()`; product defect remains visible.                                             |

### FR05-TC-013

| Field                 | Plan                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-013`                                                                                                   |
| Automation Status     | `BLOCKED_BY_IMPLEMENTATION`                                                                                     |
| Requirement Status    | `CONFIRMED`                                                                                                     |
| Implementation Status | `MISSING_OR_NONCONFORMING`                                                                                      |
| Setup                 | Future route handler can hold and release `GET /api/products` without fixed delay.                              |
| Test Data             | Controlled delayed product-list response.                                                                       |
| Data Source           | Future setup derived from verified seed response; no database writes.                                           |
| Locator Strategy      | No observable loading locator exists; none will be invented.                                                    |
| Assertion Strategy    | Planned `STATE_TRANSITION` and `VISIBILITY_OR_HIDDEN_STATE` once loading UI exists.                             |
| Cleanup               | Release pending route and remove handler.                                                                       |
| Risks                 | Network delay alone cannot prove a loading UI requirement.                                                      |
| Dependencies          | SUT loading implementation and stable observable locator.                                                       |
| Automation Boundary   | Requirement is confirmed; automation readiness is blocked by missing implementation, not requirement ambiguity. |

### FR05-TC-014

| Field                 | Plan                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-014`                                                                           |
| Automation Status     | `READY_FOR_AUTOMATION`                                                                  |
| Requirement Status    | `CONFIRMED`                                                                             |
| Implementation Status | `NONCONFORMING_EXPECTED_DEFECT` (non-empty home currently renders two `<h1>` elements). |
| Setup                 | Open normal non-empty home state.                                                       |
| Test Data             | None; seeded catalog is environment setup.                                              |
| Data Source           | Public home route and existing seed state.                                              |
| Locator Strategy      | `main.getByRole('heading', { level: 1 })`.                                              |
| Assertion Strategy    | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`; exact count `1`.                                 |
| Cleanup               | None beyond fresh page.                                                                 |
| Risks                 | Do not filter out the second heading or weaken count.                                   |
| Dependencies          | Public home route.                                                                      |
| Automation Boundary   | Exactly one semantic home-page `<h1>`; implementation discrepancy remains test-visible. |

### FR05-TC-015

| Field                 | Plan                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-015`                                                                                                 |
| Automation Status     | `BLOCKED_BY_IMPLEMENTATION`                                                                                   |
| Requirement Status    | `CONFIRMED`                                                                                                   |
| Implementation Status | `MISSING_OR_NONCONFORMING`                                                                                    |
| Setup                 | No-result search can be produced.                                                                             |
| Test Data             | `FR05-No-Result-7F3C`.                                                                                        |
| Data Source           | Future external JSON input-only dataset.                                                                      |
| Locator Strategy      | No empty-state container or icon/illustration locator exists.                                                 |
| Assertion Strategy    | Planned scoped `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `ATTRIBUTE_OR_CLASS`.                                   |
| Cleanup               | Fresh page.                                                                                                   |
| Risks                 | A global image/icon count would not prove empty-state illustration.                                           |
| Dependencies          | Implemented empty-state region and scoped visual locator.                                                     |
| Automation Boundary   | Exact artwork is not asserted; implementation must first provide an observable visual within the empty state. |

### FR05-TC-016

| Field                 | Plan                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-016`                                                                                                        |
| Automation Status     | `BLOCKED_BY_IMPLEMENTATION`                                                                                          |
| Requirement Status    | `CONFIRMED`                                                                                                          |
| Implementation Status | `MISSING_OR_NONCONFORMING`                                                                                           |
| Setup                 | No-result search can be produced.                                                                                    |
| Test Data             | `FR05-No-Result-7F3C`.                                                                                               |
| Data Source           | Future external JSON input-only dataset.                                                                             |
| Locator Strategy      | No empty-state region/message locator exists.                                                                        |
| Assertion Strategy    | Planned scoped `VISIBILITY_OR_HIDDEN_STATE` and non-empty `TEXT_OR_VALUE`.                                           |
| Cleanup               | Fresh page.                                                                                                          |
| Risks                 | Exact copy and semantic friendliness lack an oracle; visible non-empty message is the objective automation boundary. |
| Dependencies          | Implemented empty-state region and message locator.                                                                  |
| Automation Boundary   | Automation can verify visible non-empty human-facing text; semantic tone may still need human judgement.             |

### FR05-TC-017

| Field                 | Plan                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Test Case ID          | `FR05-TC-017`                                                                                                                                   |
| Automation Status     | `READY_WITH_SETUP`                                                                                                                              |
| Requirement Status    | `CONFIRMED`                                                                                                                                     |
| Implementation Status | `PRESENT_WITH_LOCATOR_RISK`                                                                                                                     |
| Setup                 | Open non-empty verified seed catalog and locate at least two distinct product cards.                                                            |
| Test Data             | Two or more verified seed product names.                                                                                                        |
| Data Source           | Existing seed manifest via future JSON.                                                                                                         |
| Locator Strategy      | Locate controlled level-two headings, resolve their current card containers, then their common listing parent; do not select by Tailwind class. |
| Assertion Strategy    | `ATTRIBUTE_OR_CLASS` via computed CSS `display === 'grid'`, plus supporting card `COUNT`/visibility.                                            |
| Cleanup               | None beyond fresh page.                                                                                                                         |
| Risks                 | Shallow ancestor/common-parent relation can change and requires AI/human code review.                                                           |
| Dependencies          | Card helper and stable common-parent resolution.                                                                                                |
| Automation Boundary   | No viewport, responsive column count, exact columns or class-name assertion.                                                                    |

## Assertion Matrix

| Assertion Pattern            | Planned Test Case IDs                                          | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| `TEXT_OR_VALUE`              | TC-001, TC-002, TC-005–012, TC-016                             | Product/search/price/message content.                                |
| `VISIBILITY_OR_HIDDEN_STATE` | TC-001–003, TC-007–010, TC-013–016                             | Visible product/search/state behavior.                               |
| `COUNT`                      | TC-001, TC-003–005, TC-007–009, TC-011–012, TC-014–015, TC-017 | Exact catalog/elements/headings and forbidden-element absence.       |
| `ATTRIBUTE_OR_CLASS`         | TC-003–004, TC-011–012, TC-015, TC-017                         | Image attributes, forbidden markup, computed grid display.           |
| `STATE_TRANSITION`           | TC-013                                                         | Pending-to-completed loading transition after implementation exists. |
| `DIALOG`                     | TC-012                                                         | Detect input-triggered execution.                                    |

At least six distinct patterns are planned; the future suite therefore exceeds the minimum of three without adding unsupported assertions.

## Implementation Discrepancies Observed

These are static implementation observations, not execution results and not automation defects.

| ID     | Area                | Current Implementation Observation                                                                                                  | Requirement / Plan Boundary                                                             | Affected Test Cases                    |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------- |
| IMP-01 | Product alt         | Product images use `alt=""`.                                                                                                        | Preserve present/non-empty alt assertion.                                               | TC-004                                 |
| IMP-02 | Price unit          | Prices render localized digits followed by `VND`.                                                                                   | Preserve required `₫`; grouping remains independently asserted.                         | TC-005, TC-006                         |
| IMP-03 | Loading state       | No loading-state UI is rendered while request is pending.                                                                           | Requirement is `CONFIRMED`; classify implementation blocker.                            | TC-013                                 |
| IMP-04 | Empty state         | Empty results render an empty grid with no dedicated empty-state UI, icon or message.                                               | Requirements remain `CONFIRMED`; classify implementation blockers.                      | TC-009, TC-015, TC-016                 |
| IMP-05 | Keyword rendering   | Reflected keyword uses `dangerouslySetInnerHTML`.                                                                                   | Preserve safe-text/no-execution Expected Results; tests may reveal defects.             | TC-010–012                             |
| IMP-06 | Semantic heading    | Non-empty home renders the page title and product-count text as two `<h1>` elements.                                                | Preserve exact count `1`.                                                               | TC-014                                 |
| IMP-07 | Locator support     | Product grid/cards/prices and keyword region lack stable semantic/test-id contracts.                                                | Use scoped current locators and record fragility; do not modify SUT or invent test IDs. | TC-001, TC-003–006, TC-010–012, TC-017 |
| IMP-08 | Search backend risk | Current search SQL interpolates `search` directly; quote-bearing payloads can cause an API error that obscures frontend reflection. | Isolate TC-010–012 with a controlled empty response; do not change Expected Results.    | TC-010–012                             |

## Required Future Test Data

Future `test-data/fr-05.json` should contain traceable datasets, without creating database records:

| Dataset                                                                                       | Intended Test Case IDs | Source                                                             |
| --------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------ |
| Five-product seed manifest: names, raw prices, image URLs, expected count                     | TC-001–006, TC-017     | `backend/database.js` verified seeds                               |
| Exact-name search keyword and expected product                                                | TC-007                 | Existing seed data                                                 |
| Description-only keyword, expected product result count `0`, and supporting excluded products | TC-008                 | Existing seed names/descriptions; no new dataset or product record |
| Reserved no-result keyword                                                                    | TC-009, TC-015, TC-016 | External input-only data                                           |
| Plain reflected keyword                                                                       | TC-010                 | External input-only data                                           |
| Formatting-markup keyword                                                                     | TC-011                 | External input-only data                                           |
| Event-handler markup keyword                                                                  | TC-012                 | External input-only data                                           |

## Open Questions

| ID    | Question                                                                                                                | Impact                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| OQ-01 | Stable product-card/listing/price/keyword-region semantic locators có được bổ sung bởi SUT owner trong tương lai không? | Locator fragility; current plan remains feasible for 13 candidates without inventing test IDs.                   |
| OQ-02 | Observable loading-state element/role nào sẽ được implemented?                                                          | Blocks TC-013.                                                                                                   |
| OQ-03 | Empty-state region, icon/illustration and message sẽ có observable contract nào?                                        | Blocks TC-009, TC-015, TC-016.                                                                                   |
| OQ-04 | Approved convention để đánh giá semantic descriptiveness của alt là gì?                                                 | Human component of TC-004 only; objective automation remains ready.                                              |
| OQ-05 | Standard image ratio/tolerance là gì?                                                                                   | Open requirement gap, but no approved test case in this 17-case inventory targets ratio.                         |
| OQ-06 | Locale/thousand separator chuẩn là gì?                                                                                  | TC-006 remains locale-neutral but accepts only `.`, `,`, regular space, `U+00A0` or `U+202F`, used consistently. |
| OQ-07 | SUT Base URL, Playwright/test/report directories, Student ID and browser-runtime availability sẽ được xác nhận khi nào? | Required before generation/execution, not for `PLAN_ONLY`.                                                       |

## Readiness Summary

| Metric                              | Result                                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Approved Test Cases Received        | **17**                                                                                                                                           |
| Automation Minimum Pre-check Result | `PASS` — 13 candidates ≥ minimum 12                                                                                                              |
| Automation Candidate Count          | **13**                                                                                                                                           |
| `READY_FOR_AUTOMATION`              | **2** — TC-002, TC-014                                                                                                                           |
| `READY_WITH_SETUP`                  | **11** — TC-001, TC-003–008, TC-010–012, TC-017                                                                                                  |
| `BLOCKED_BY_DATA`                   | **0**                                                                                                                                            |
| `BLOCKED_BY_REQUIREMENT`            | **0**                                                                                                                                            |
| `BLOCKED_BY_IMPLEMENTATION`         | **4** — TC-009, TC-013, TC-015, TC-016                                                                                                           |
| `BLOCKED_BY_ENVIRONMENT`            | **0**                                                                                                                                            |
| `MANUAL_ONLY`                       | **0**                                                                                                                                            |
| `OUT_OF_SCOPE`                      | **0**                                                                                                                                            |
| Existing Seed Data Reuse            | Five verified products support TC-001–008 and TC-017 as applicable.                                                                              |
| Required Future Test Data           | External JSON seed manifest and input-only search datasets; no new product records.                                                              |
| Required Helpers                    | Data loader, home/search helpers, card/grid/keyword scoping, constrained locale-neutral grouping assertion, route isolation and dialog observer. |
| Locator Risks                       | No stable semantics/test IDs for cards, listing, prices or keyword region; empty/loading locators do not exist.                                  |
| Assertion Patterns Planned          | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`, `COUNT`, `ATTRIBUTE_OR_CLASS`, `STATE_TRANSITION`, `DIALOG`.                                      |
| Implementation Discrepancies        | 8 static observations recorded separately; no PASS/FAIL claimed.                                                                                 |
| Open Questions                      | 7; four affect blocked-case readiness or locator quality, none reduce the 13-candidate pre-check below minimum.                                  |
| Files Created                       | `docs/automation-plans/fr-05-automation-plan.md`                                                                                                 |
| Files Modified                      | `docs/automation-plans/fr-05-automation-plan.md` during human-review correction and approval.                                                    |
| Current Checkpoint                  | `CHECKPOINT: AUTOMATION_PLAN_APPROVED`                                                                                                           |

## Human Review

### Review History

| Review Round | Verdict      | Corrections                                                                                                                         |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1            | `INCOMPLETE` | Make TC-008 product-result count `0` the primary oracle; constrain TC-006 to conventional, consistent thousand-grouping separators. |
| 2            | `APPROVED`   | Không yêu cầu chỉnh sửa bổ sung; human reviewer chấp thuận corrected automation plan.                                               |

| Field          | Value                                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review Status  | `APPROVED`                                                                                                                                                                                                |
| Human Decision | `APPROVE AUTOMATION PLAN`                                                                                                                                                                                 |
| Review Notes   | Corrected FR-05 automation plan được phê duyệt. Approval này cho phép bước Test Data Preparation bắt đầu khi được yêu cầu riêng; không tự động tạo test data, Playwright scripts hoặc execution evidence. |

CHECKPOINT: AUTOMATION_PLAN_APPROVED
