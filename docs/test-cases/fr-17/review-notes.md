# FR-17 Static Design Review Notes

## Review Result

`FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`

Design đạt minimum gates nhưng chưa được human approve.

## Static Review Checklist

| Review Area | Result | Notes |
| --- | --- | --- |
| Authoritative source use | `PASS` | FR-17/FR-12/FR-22 từ README là requirement basis; API spec support contract; source/seed only implementation reference. |
| Detailed operation scope | `PASS` | Chỉ `VIEW`, `CREATE`, `DELETE`; `UPDATE` là `NOT_IN_DETAILED_REQUIREMENT_SCOPE`. |
| Atomic objectives | `PASS` | View, markers, type domain, create, each omission/boundary, delete và two auth boundaries đều independent. |
| Duplicate objectives | `PASS` | Requiredness và numeric boundary tách riêng; create và delete không share primary objective. |
| Invented rules | `PASS` | Không có percent max, code format, normalization, filter, pagination, exact message, future-expiry hoặc delete-dialog assumption. |
| Boundary validity | `PASS` | Chỉ dùng explicit lower bounds: discount 1/0, minimum 0/-1, max uses 1/0. |
| Frontend scope | `PASS` | Cases assert Web Admin form/list/access behavior; API/DB chỉ dùng cho setup, evidence và isolation. |
| State isolation | `PASS_WITH_REQUIRED_SETUP` | 11 stateful cases bắt buộc isolated DB copy; 5 read-only cases dùng fresh contexts. |
| Test-order dependency | `PASS` | Mỗi stateful case restore independently; delete uses its own setup record. |
| External data strategy | `PASS` | Future `test-data/fr-17.json`; no inline arrays planned; file chưa được tạo trong phase này. |
| Requirement traceability | `PASS` | 16 atomic requirements mapped; 16 `FULLY_COVERED`. |
| Test count | `PASS` | 16 >= 12. |
| Automation candidate count | `PASS` | 16 >= 12. |
| Demo selection | `PASS` | Primary create/list transition, strong view/delete candidates và negative fallbacks documented. |
| Prohibited execution | `PASS` | Không run SUT/browser/Playwright, không mutate DB, không generate runtime evidence. |

## Design Decisions

| Review ID | Observation | Decision | Applied Result |
| --- | --- | --- | --- |
| FR17-REV-001 | Title says CRUD but detailed clause omits update. | `REMOVE_FROM_SCOPE` | `UPDATE` explicitly marked `NOT_IN_DETAILED_REQUIREMENT_SCOPE`; no test invented. |
| FR17-REV-002 | A single generic invalid-form case would hide six different field rules. | `SPLIT` | Required omissions and explicit numeric boundaries have atomic cases. |
| FR17-REV-003 | `type` is a constrained selector, so an artificial third value would not be a normal UI path. | `REWRITE` | Verify exactly `{percent, fixed}`, no empty option, plus valid fixed creation. |
| FR17-REV-004 | Create and delete both mutate state and could become order-dependent. | `SPLIT_AND_ISOLATE` | Create cleans its own record; delete receives its own controlled setup record. |
| FR17-REV-005 | Exact alert copy exists in source but is not authoritative. | `REMOVE_FROM_ORACLE` | Rejection uses controlled-code absence/count; message remains optional evidence. |
| FR17-REV-006 | Existing seeds can satisfy list/duplicate objectives. | `REUSE_SEED` | Use four verified coupons and `SAVE10`; no artificial shared DB records. |
| FR17-REV-007 | Valid create can simultaneously exercise explicit lower valid values without adding arbitrary boundaries. | `MERGE_DATA_CONTROLS` | TC-004 uses 1/0/1 as valid controls while primary objective remains successful create/list transition. |
| FR17-REV-008 | Missing/invalid submits may mutate under a nonconforming implementation. | `ISOLATE` | All such cases use isolated DB snapshot and unconditional restore. |
| FR17-REV-009 | JWT absence and wrong role can fail independently. | `SPLIT` | TC-015 and TC-016 are separate authorization cases. |

## AI-Fix Policy for Demo

- Không manufacture AI error cho demo.
- Chỉ một automation issue thực sự phát sinh trong later Automation Build / Review mới được dùng làm FR-17 AI-fix story.
- `AI Fix Candidate`: `PENDING_REAL_HUMAN_REVIEW`.
- Nếu FR-17 không có correction thực sự và hữu ích, fallback genuine correction là FR-05 TC-006 automation-helper correction đã có trong workflow history.

## Stateful Case Inventory

| Test Case ID | Isolation Classification | Required Setup | Cleanup |
| --- | --- | --- | --- |
| FR17-TC-004 | `STATEFUL_CREATE_CLEANUP` | Isolated DB baseline; unique absent code. | Assert create/list first, then delete owned record or restore snapshot. |
| FR17-TC-005 | `STATEFUL_SETUP_REQUIRED` | Seed `SAVE10` exists exactly once. | Restore snapshot after duplicate attempt. |
| FR17-TC-006–013 | `STATEFUL_SETUP_REQUIRED` | Isolated baseline; unique absent code per case. | Restore snapshot even if nonconforming SUT creates invalid record. |
| FR17-TC-014 | `STATEFUL_SETUP_REQUIRED` | Create one owned controlled coupon before test. | Verify deletion, then restore snapshot/residue if needed. |

No stateful case may use the shared workspace or production-like database. Setup must be deterministic, per test and independent of execution order.

## Read-Only Case Inventory

| Test Case ID | Read-Only Boundary |
| --- | --- |
| FR17-TC-001 | Observe verified list only. |
| FR17-TC-002 | Observe required indicators only. |
| FR17-TC-003 | Inspect/select type options without submit. |
| FR17-TC-015 | Fresh unauthenticated context, no data operation. |
| FR17-TC-016 | Controlled non-admin context, no data operation. |

## Existing Data Reuse

- Complete list oracle: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`.
- Duplicate oracle: `SAVE10`.
- Existing admin and user roles support future auth setup; credentials/token must not be embedded in specs.
- Existing seed records are never deletion targets.

## Future Controlled Setup Needed

1. Isolated backend/database copy with baseline hash/snapshot and restore.
2. Valid admin session fixture.
3. Valid non-admin session fixture whose token role is verified.
4. External unique coupon datasets and omission/boundary datasets in `test-data/fr-17.json` after approval.
5. Stable form/list scoping strategy that avoids generated class names and broad repeated-text selectors.
6. Owned coupon setup for delete and owned-code cleanup for create.

## Implementation Discrepancies Preserved

- Coupon APIs authenticate JWT but do not enforce admin role server-side.
- Backend lacks explicit validation for missing/empty code and type domain.
- Backend/DB do not enforce positive discount or non-negative minimum.
- Missing/zero max uses is silently defaulted to 1.
- Required coupon labels/`*` indicators are absent.

These are static implementation observations. No runtime `PASS`, `FAIL`, `PRODUCT_DEFECT` or defect report was produced.

## Open Requirement Gaps Preserved

- Update semantics.
- Activation/deactivation.
- Percent upper bound.
- Code length/charset.
- Trimming/case normalization.
- Filter/search/sort/pagination.
- Exact success/error copy.
- Expiry timezone/future-date rule.
- Fixed discount relative to order total.
- Stacking/application behavior.
- Delete confirmation semantics.

None of these gaps was converted into an Expected Result.

## Quality Gate Summary

| Gate | Result |
| --- | --- |
| Total Test Cases >= 12 | `PASS` — 16 |
| Automation Candidate Count >= 12 | `PASS` — 16 |
| Target 14–16 legitimate cases | `PASS` — 16 |
| No invented update behavior | `PASS` |
| Every stateful case isolated | `PASS` |
| Demo plan exists | `PASS` |
| Human approval | `PENDING` |

## Current Checkpoint

`CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`
