# FR-05 — Automation Gaps

## Status

`AUTOMATION_REVIEW_REQUIRED`

Feature: `FR-05 — Product listing and search`

Generated automation candidates: **13 / 13**

Blocked approved test cases: **4**

Execution status: `NOT_EXECUTED`

## Gap Inventory

| Test Case ID | Status | Requirement Status | Implementation Status | Reason | Attempted Approach | Remaining Blocker | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `FR05-TC-009` | `BLOCKED_BY_IMPLEMENTATION` | `CONFIRMED` | `MISSING_OR_NONCONFORMING` | Approved primary objective requires an observable empty state after a completed no-result search, but the current UI renders no empty-state region. | The approved reserved no-result input can produce zero product results, and result count is observable. That does not verify the independent empty-state presentation objective. | No empty-state container, semantic role, stable locator, or approved observable copy exists. | Implement an observable empty-state region in the SUT and expose it through semantic markup or another stable locator; retain the approved Expected Result. |
| `FR05-TC-013` | `BLOCKED_BY_IMPLEMENTATION` | `CONFIRMED` | `MISSING_OR_NONCONFORMING` | The response can be held/released, but the current UI has no loading-state element while product data is pending. | Static planning confirmed that a narrow product-response hold/release is feasible without a fixed delay. | No loading UI or stable loading-state locator exists, so the required pending-to-complete transition cannot be asserted. | Implement an observable loading state with stable semantics, then automate the hold/release transition without `waitForTimeout()`. |
| `FR05-TC-015` | `BLOCKED_BY_IMPLEMENTATION` | `CONFIRMED` | `MISSING_OR_NONCONFORMING` | The approved empty-state icon/illustration objective has no corresponding current UI. | The reusable no-result input is available, but data cannot create the missing presentation behavior. | No empty-state container and no icon/illustration element or stable locator exists. | Implement the empty-state visual within an observable region and provide stable semantics suitable for a scoped assertion. |
| `FR05-TC-016` | `BLOCKED_BY_IMPLEMENTATION` | `CONFIRMED` | `MISSING_OR_NONCONFORMING` | The approved objective requires a visible non-empty human-facing empty-state message, which the current UI does not render. | The reusable no-result input is available; exact copy was deliberately not invented. | No empty-state message element, region, or stable locator exists; semantic tone still requires human judgement. | Implement a visible non-empty message inside an observable empty-state region; automate presence/non-empty text and retain human judgement for tone if needed. |

## Preserved Boundaries

- No blocked case is represented by `test.skip()`, an empty test, or a fake automated case.
- `FR05-TC-008` uses product result `COUNT = 0` and does not depend on empty-state UI.
- Test data availability does not change an implementation blocker into automation readiness.
- No requirement or Expected Result was weakened to match the current SUT.
- No runtime `PASS` or `FAIL` is claimed.

## Current Checkpoint

`CHECKPOINT: AUTOMATION_REVIEW_REQUIRED`
