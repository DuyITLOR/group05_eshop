# FR-17 Automation Plan — Coupon management

## Approved Scope

Nguồn scope đã được human-approved là bundle tại `docs/test-cases/fr-17/`. Suite implements đúng `FR17-TC-001` đến `FR17-TC-016`: `VIEW`, `CREATE`, `DELETE`, required/boundary validation và two authorization boundaries. `UPDATE`, activation, percent maximum, exact message và delete-confirmation semantics không thuộc detailed requirement scope.

## Runtime Architecture and Safety

Stateful cases (`FR17-TC-003`–`FR17-TC-014`) require a copied, run-specific backend directory. The backend's relative `database.sqlite` resolution means the launched backend must reside beside its copied database; `FR17_TEST_DB_PATH` is a fixture verification input only, not proof that the backend honors that variable.

Before a direct fixture operation, `FR17_ISOLATED_DB=true` and `FR17_TEST_DB_PATH` are required. The helper resolves both the candidate and workspace `backend/database.sqlite`, rejects equality, and verifies the isolated file exists. When baseline verification is requested, it queries the full coupon set and requires exactly four records matching `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; unexpected stale rows fail closed. Any failed setup/cleanup surfaces `AUTOMATION_SETUP_OR_CLEANUP_RISK`. No stateful test may target seed `SAVE10`, `BIGBUY`, `VIP100` or `EXPIRED` for deletion.

## Authentication Strategy

Credentials remain runtime-only: `SUT_API_BASE_URL`, `FR17_ADMIN_BASE_URL`, `FR17_TEST_ADMIN_EMAIL`, `FR17_TEST_ADMIN_PASSWORD`, `FR17_TEST_USER_EMAIL`, and `FR17_TEST_USER_PASSWORD`. Login uses the approved API only to establish browser state. The returned identity is checked as `admin` for positive paths and explicitly `!== admin` for TC-016 before its token is inserted in fresh page storage under the implementation's `adminToken` key. JWTs are never written to source, reports, or audit artifacts.

## Test Case Mapping

| Test Case ID | Automation Status | External Data | Primary Assertion | Isolation / Cleanup |
| --- | --- | --- | --- | --- |
| FR17-TC-001 | `READY_WITH_SETUP` | FR17-DATA-001 | Exact seed count and set | Read-only admin session |
| FR17-TC-002 | `READY_WITH_SETUP` | FR17-DATA-002 | Six visible associated labels/labelled elements contain `*` | Read-only admin session |
| FR17-TC-003 | `READY_WITH_SETUP` | FR17-DATA-003 | Percent owned row count/type/value | Delete exact owned code in `finally` |
| FR17-TC-004 | `READY_WITH_SETUP` | FR17-DATA-004 | Fixed owned row count/type/lower values | Delete exact owned code in `finally` |
| FR17-TC-005 | `READY_WITH_SETUP` | FR17-DATA-005 | `SAVE10` remains exactly once and total count is unchanged | Isolated seed baseline; never delete seed |
| FR17-TC-006 | `READY_WITH_SETUP` | FR17-DATA-006 | Total count unchanged | Isolated DB; remove unexpected empty-code residue |
| FR17-TC-007 | `READY_WITH_SETUP` | FR17-DATA-007 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-008 | `READY_WITH_SETUP` | FR17-DATA-008 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-009 | `READY_WITH_SETUP` | FR17-DATA-009 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-010 | `READY_WITH_SETUP` | FR17-DATA-010 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-011 | `READY_WITH_SETUP` | FR17-DATA-011 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-012 | `READY_WITH_SETUP` | FR17-DATA-012 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-013 | `READY_WITH_SETUP` | FR17-DATA-013 | Owned invalid code absent | Cleanup exact owned code |
| FR17-TC-014 | `READY_WITH_SETUP` | FR17-SETUP-001 | Owned row count `1 → 0` | DB inserts/deletes exact owned code |
| FR17-TC-015 | `READY_FOR_AUTOMATION` | None | No usable coupon controls | Fresh unauthenticated page |
| FR17-TC-016 | `READY_WITH_SETUP` | FR17-SETUP-002 | No usable coupon controls | Fresh verified non-admin page |

## Locators and Assertions

Locator priority is role, exact text, placeholder, then table-row scoping. Current implementation has no stable IDs or labels: form fields use placeholders, and rows are located by an exact-code `getByText()` locator evaluated relative to each coupon-table row. Delete is scoped within that row, never positionally. No absolute XPath, generated class, global `nth()` or fixed wait is used. This relative `filter({ has })` composition was corrected after human review to prevent false failures after a successful create.

Assertion inventory: `COUNT` (seed, duplicate, absence), `TEXT_OR_VALUE` (type/value and case-specific boundaries), `VISIBILITY_OR_HIDDEN_STATE` (sections and controls), `STATE_TRANSITION` (create/delete), and `ATTRIBUTE_OR_SEMANTIC_STATE` (a visible associated required label indicator). TC-003 uses `expectOwnedCouponCore()` for exact owned-row count, visibility, percent type and submitted discount value only. TC-004 reuses that core and then calls `expectOwnedCouponBoundaryValues()` for its approved lower-bound values. TC-005 has its own duplicate oracle: `SAVE10` remains exactly once and total count is unchanged. TC-006–013 retain absent-owned-code oracles. Negative create accepts native form or server rejection; no error element or message is required.

## Runtime-Discovered TC-003 Automation Correction

Chromium A-018 showed the valid percent coupon was created and its owned row was found, but the original generic helper then asserted a locale-dependent min-order display outside TC-003's primary Expected Result. The human-directed correction removes min-order/max-use/expiry display from TC-003's PASS/FAIL oracle and retains those external values only as valid setup inputs. TC-004 is not weakened: fixed `discount_value=1`, `min_order_amount=0` and `max_uses_per_user=1` remain explicitly asserted. These single-digit boundary values are unambiguous without inventing a currency-formatting rule or using Node-side `toLocaleString()`.

## Browser, Reporting and Demo Strategy

The shared config retains `chromium`, `firefox`, `webkit`, screenshot `only-on-failure`, trace `retain-on-failure`, video `off`, retries `0`, and HTML report metadata. For `FEATURE_ID=FR-17`, workers is `1` to prevent stateful collisions. Runtime evidence is not created in this build phase.

`FR17-TC-004 @demo` is the sole primary demo tag. It uses fixed lower valid controls, shows an owned code transitioning absent to visible, asserts values, then cleans up. The human-reviewed `getCouponRow()` relative-locator correction remains the primary `TEST_SCRIPT_CORRECTION` story with Chromium runtime verification and overall status `PARTIALLY_VERIFIED`. The TC-003 assertion-scope/locale-independence change is a separate secondary runtime automation correction pending human review; it does not replace the primary demo story. Fallback candidates are TC-003 and TC-014. PowerShell draft command: `$env:FEATURE_ID = 'FR-17'` then `npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo"`; the separate recording command remains unexecuted.

## Known Risks

- The Admin UI lacks labels/required indicators, so TC-002 is designed to reveal the implementation discrepancy rather than weaken the requirement.
- The APIs only authenticate JWT and presently lack server-side role enforcement; TC-016 may reveal that discrepancy.
- Backend validation gaps can make negative cases create records. Isolation and exact owned-code cleanup are mandatory.
- Missing `code` has no unique code by definition. TC-006 uses the approved total-count oracle and cleans any empty-code residue only within the isolated DB.
