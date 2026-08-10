# FR-17 Automation Gaps and Boundaries

## REQUIREMENT_GAP

The approved design preserves 11 requirement gaps: `UPDATE`; activation/deactivation; percent upper bound; code length/charset; trimming/case normalization; filter/search/sort/pagination; exact success/error copy; expiry timezone/future-date rule; fixed discount relation to order total; stacking/application; delete-confirmation semantics. They are not converted into tests or implementation assumptions.

## IMPLEMENTATION_ONLY

| ID | Observation | Affected Cases | Build Decision |
| --- | --- | --- | --- |
| FR17-IMP-001 | Coupon APIs authenticate but do not enforce `role=admin` server-side. | TC-016 | Preserve requirement assertion; no static defect verdict. |
| FR17-IMP-002 | Labels and `*` markers are absent from the coupon form. | TC-002 | Preserve semantic assertion. |
| FR17-IMP-003 | Create validation does not fully enforce required/domain/numeric rules. | TC-005–013 | Preserve rejection oracles and isolated cleanup. |

## AUTOMATION_RISK

| Test Case ID | Reason | Mitigation / Next Step |
| --- | --- | --- |
| TC-001–014 | Current Admin UI has no stable test IDs and uses placeholder-only fields. | Exact text/placeholder/table-row scoping; `getCouponRow` now uses a human-reviewed relative row filter; verify at runtime. |
| TC-006 | Missing code cannot identify a unique code-specific row. | Assert unchanged total and remove empty-code residue only in isolated DB. |
| TC-003–014 | Stateful UI requests must reach a copied backend/database. | Execution readiness must verify launched backend directory and DB path. |

## RUNTIME_VERIFICATION_REQUIRED

- A-018 proved the run-specific isolated backend, exact four-seed cleanup, Chromium HTML identity/evidence policy and corrected `getCouponRow` path.
- Firefox/WebKit execution remains blocked until the TC-003 automation correction receives human approval.
- TC-002 and TC-016 remain Chromium `PRODUCT_DEFECT_CANDIDATE`; their assertions/evidence are unchanged.

## RESOLVED_AUTOMATION_DEFECT_PENDING_HUMAN_REVIEW

| Test Case ID | Runtime Finding | Correction | Remaining Gate |
| --- | --- | --- | --- |
| TC-003 | Generic created-row helper added a locale-dependent min-order display assertion after required percent-create behavior had succeeded. | TC-003 now uses core code/count/visibility/type/discount assertions only; TC-004 retains explicit lower-bound assertions in a separate helper. | Static correction review at `CHECKPOINT: FR17_TC003_AUTOMATION_CORRECTION_REVIEW_REQUIRED`; no browser rerun yet. |

No approved FR-17 Test Case is omitted from the generated automation bundle.
