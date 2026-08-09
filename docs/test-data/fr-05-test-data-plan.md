# FR-05 — Test Data Plan

## Status

`TEST_DATA_REVIEW_REQUIRED`

Feature: `FR-05 — Product listing and search`

Approved Test Cases: **17**

Automation Candidates: **13**

Test Data Format: `JSON`

Test Data File: `test-data/fr-05.json`

Logical Datasets: **9** — 7 data datasets and 2 setup datasets.

## Preparation Boundary

Data plan này chỉ chuẩn bị external JSON và setup metadata cho các approved Test Cases. Không tạo product/database record, không sửa database, không thay đổi Expected Result, không chạy SUT/browser/Playwright và không tạo execution evidence.

## Source Validation

| Source | Authority / Use | Validation Result |
| --- | --- | --- |
| `backend/database.js` | `IMPLEMENTATION_ONLY`; nguồn hiện tại của năm seed products | `VERIFIED` — names, raw prices, descriptions và image URLs được sao chép nguyên giá trị nguồn. |
| `docs/test-cases/fr-05/test-cases.md` | Approved objectives, input values và Expected Results | `VERIFIED` — 17 unique Test Case IDs. |
| `docs/automation-plans/fr-05-automation-plan.md` | Approved automation status, setup và data boundary | `VERIFIED` — 13 candidates, 4 `BLOCKED_BY_IMPLEMENTATION`. |
| `README.md` FR-05, FR-21, FR-24, SEC-04 | Confirmed requirement sources | `VERIFIED`. |
| `api_specification.md` section 3.1 | Product list/search API contract | `VERIFIED` — optional `search` query targets product name. |

Seed inspection confirms:

- `xuất sắc` appears in descriptions of `Samsung Galaxy S24 Ultra` and `Tai nghe AirPods Pro 2`.
- `xuất sắc` appears in none of the five verified product names.
- No seed record was added, changed or removed.

## Dataset Traceability

| Dataset ID | Test Case IDs | Purpose | Source | Isolation Strategy |
| --- | --- | --- | --- | --- |
| `FR05-DATA-001` | FR05-TC-001, FR05-TC-002, FR05-TC-003, FR05-TC-004, FR05-TC-005, FR05-TC-006, FR05-TC-017 | Reusable five-product manifest; count, names, image mapping, alt structure, prices, grouping configuration và two-card grid anchors. | `backend/database.js` | Read-only mirror of the verified seed state; no database write/reset. |
| `FR05-DATA-002` | FR05-TC-007 | Exact known-name search input and expected product. | Existing seed name in `backend/database.js` | Fresh page; form-submit search against verified seed catalog. |
| `FR05-DATA-003` | FR05-TC-008 | Description-only keyword, deterministic result count `0`, and excluded product names. | Existing seed names/descriptions in `backend/database.js` | Fresh page; result oracle uses names only and does not require empty-state UI. |
| `FR05-DATA-004` | FR05-TC-010 | Plain reflected keyword. | Approved FR05-TC-010 input | Controlled empty search response isolates keyword rendering; input remains external. |
| `FR05-DATA-005` | FR05-TC-011 | Formatting-markup keyword. | Approved FR05-TC-011 input | Controlled empty search response and scoped keyword region; value is stored only, not executed in this phase. |
| `FR05-DATA-006` | FR05-TC-012 | Event-handler markup keyword. | Approved FR05-TC-012 input | Controlled empty search response plus future dialog observation; value is stored only, not executed in this phase. |
| `FR05-DATA-007` | FR05-TC-009, FR05-TC-015, FR05-TC-016 | Reserved reusable no-result input for future empty-state execution. | Approved blocked test-case input | Input-only; does not change any `BLOCKED_BY_IMPLEMENTATION` status. |
| `FR05-SETUP-001` | FR05-TC-014 | Records non-empty seeded home page as environment setup; no business test data. | Approved FR05-TC-014 precondition | Fresh public page using verified seed state. |
| `FR05-SETUP-002` | FR05-TC-010, FR05-TC-011, FR05-TC-012 | Reusable controlled empty `GET /api/products` search response; explicitly not business test data. | Approved automation-plan isolation strategy | Match only product-search requests with a search query and fulfill with an empty product array; no host/base URL or database dependency. |

## Dataset Controls

| Dataset ID | Setup Requirement | Cleanup Requirement | Data Sensitivity | Deterministic Status | Source / Generation Rule |
| --- | --- | --- | --- | --- | --- |
| `FR05-DATA-001` | Repository database must expose exactly the verified five-product seed manifest for catalog-completeness assertions. | None; read-only usage. | `PUBLIC_CATALOG_DATA`, no secret/PII | `DETERMINISTIC_IF_SEED_STATE_CONFIRMED` | Copy exact current values from `backend/database.js`; do not synthesize products. |
| `FR05-DATA-002` | Verified seed catalog and observed form-submit search control. | Fresh page; no business-state cleanup. | `PUBLIC_CATALOG_DATA` | `DETERMINISTIC` | Reuse exact seed name `iPhone 15 Pro Max`. |
| `FR05-DATA-003` | Verified seed names/descriptions; search targets product name. | Fresh page. | `PUBLIC_CATALOG_DATA` | `DETERMINISTIC_IF_SEED_STATE_CONFIRMED` | Reuse `xuất sắc`; expect zero product results because it appears only in descriptions. |
| `FR05-DATA-004` | Future automation requires controlled empty search response and scoped keyword-display region. | Remove route handler; fresh page/context. | `SYNTHETIC_NON_SENSITIVE` | `DETERMINISTIC` | Preserve approved plain-text input exactly. |
| `FR05-DATA-005` | Same controlled rendering setup as TC-010. | Remove route handler; fresh page/context. | `SYNTHETIC_SECURITY_TEST_INPUT` | `DETERMINISTIC` | Preserve approved formatting-markup input exactly; do not execute during preparation. |
| `FR05-DATA-006` | Controlled rendering setup and future dialog/page event observation. | Remove listener and route handler; dismiss unexpected dialog only during future execution. | `SYNTHETIC_SECURITY_TEST_INPUT` | `DETERMINISTIC` | Preserve approved event-handler input exactly; do not execute during preparation. |
| `FR05-DATA-007` | Future observable empty-state implementation is still required. | Fresh page; no database cleanup. | `SYNTHETIC_NON_SENSITIVE` | `DETERMINISTIC_AGAINST_VERIFIED_SEED_NAMES` | Reuse approved reserved keyword; storing it does not unblock TC-009/015/016. |
| `FR05-SETUP-001` | Public home route with a verified non-empty catalog. | Fresh page/context. | `ENVIRONMENT_METADATA` | `DETERMINISTIC_IF_SEED_STATE_CONFIRMED` | Record setup only; do not invent business data for TC-014. |
| `FR05-SETUP-002` | Future route interception must narrowly match `GET /api/products` requests carrying a search query and respond with `[]`. | Remove route handler after each test; fresh page/context. | `TEST_SETUP_METADATA`, no business data | `DETERMINISTIC` | Externalize the approved controlled-response strategy; do not hardcode host/base URL or create database records. |

## Candidate Coverage

| Automation Candidate | Data / Setup Coverage |
| --- | --- |
| `FR05-TC-001` | `FR05-DATA-001`: expected count `5` and complete manifest. |
| `FR05-TC-002` | `FR05-DATA-001`: known product name. |
| `FR05-TC-003` | `FR05-DATA-001`: product/image mapping. |
| `FR05-TC-004` | `FR05-DATA-001`: product/image mapping and `PRESENT_AND_NON_EMPTY`; no semantic alt text invented. |
| `FR05-TC-005` | `FR05-DATA-001`: names, raw prices and currency symbol `₫`. |
| `FR05-TC-006` | `FR05-DATA-001`: existing raw prices and locale-neutral grouping configuration. |
| `FR05-TC-007` | `FR05-DATA-002`: exact known name. |
| `FR05-TC-008` | `FR05-DATA-003`: `xuất sắc`, expected result count `0`, excluded names. |
| `FR05-TC-010` | `FR05-DATA-004`: plain reflected keyword; `FR05-SETUP-002`: controlled empty product-search response. |
| `FR05-TC-011` | `FR05-DATA-005`: formatting-markup input; `FR05-SETUP-002`: controlled empty product-search response. |
| `FR05-TC-012` | `FR05-DATA-006`: event-handler input; `FR05-SETUP-002`: controlled empty product-search response. |
| `FR05-TC-014` | `FR05-SETUP-001`: environment/setup only; no business data. |
| `FR05-TC-017` | `FR05-DATA-001`: two existing product names used as independent card anchors. |

Coverage result: **13 / 13 automation candidates** have required data or setup information.

## Thousand-Grouping Configuration

Only the five existing raw prices are used: `30000000`, `28000000`, `45000000`, `6000000`, `4000000`.

The JSON permits only conventional grouping separators:

- period `.`
- comma `,`
- regular space
- `U+00A0`
- `U+202F`

The future assertion must reuse one separator consistently between groups. `mandatoryLocaleSeparator` is `null`; no locale is invented. Raw digits, letters, hyphens and mixed separators remain invalid. No price-boundary fixture is created.

## Blocked Cases Preserved

| Test Case ID | Automation Status | Data Decision | Remaining Blocker |
| --- | --- | --- | --- |
| `FR05-TC-009` | `BLOCKED_BY_IMPLEMENTATION` | May reuse `FR05-DATA-007`; status unchanged. | Missing observable empty-state region/locator. |
| `FR05-TC-013` | `BLOCKED_BY_IMPLEMENTATION` | No artificial delay dataset created. | Missing observable loading-state UI/locator. |
| `FR05-TC-015` | `BLOCKED_BY_IMPLEMENTATION` | May reuse `FR05-DATA-007`; status unchanged. | Missing empty-state icon/illustration implementation and locator. |
| `FR05-TC-016` | `BLOCKED_BY_IMPLEMENTATION` | May reuse `FR05-DATA-007`; status unchanged. | Missing empty-state message implementation and locator. |

## Data Quality Check

| Check | Result | Evidence |
| --- | --- | --- |
| All 13 candidates have data/setup coverage | `PASS` | Candidate Coverage table. |
| Existing seed values match repository | `PASS` | Exact values copied from `backend/database.js`. |
| Description-only keyword oracle is valid | `PASS` | `xuất sắc` occurs in two descriptions and no verified product name. |
| External data avoids future inline arrays/response fixtures | `PASS` | Manifest, input sets and shared controlled empty response are stored in `test-data/fr-05.json`. |
| No unused artificial product/price dataset | `PASS` | Only verified seed products/prices are present. |
| No credential, secret or personal data | `PASS` | Only public seed fields and synthetic input strings are stored. |
| No database record added or mutated | `PASS` | Preparation is read-only with respect to SUT/database. |
| Blocked implementation cases remain blocked | `PASS` | Four statuses preserved above. |
| Approved Expected Results remain unchanged | `PASS` | Data mirrors approved cases and plan; no requirement/test-case file modified. |

## Data Risks and Open Questions

- Catalog-completeness assertions require runtime confirmation that the database is still in the exact five-product seed state; the data file does not reset or mutate it.
- External placeholder image availability is not a data oracle for image-element existence.
- No approved semantic-alt convention exists; automation data supports only present/non-empty `alt` checks.
- No exact locale separator is confirmed; the approved conventional separator set remains the oracle.
- Base URL and route-interception wiring are generation/execution inputs, not unresolved business test data.

No unresolved data question blocks review of this dataset. Runtime seed-state validation remains a precondition for later script execution.

## Current Checkpoint

`CHECKPOINT: TEST_DATA_REVIEW_REQUIRED`

Wait for: `APPROVE TEST DATA`
