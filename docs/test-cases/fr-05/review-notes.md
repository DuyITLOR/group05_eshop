# FR-05 — Test Design Review Notes

## Status

`TEST_CASE_DESIGN_APPROVED`

## Quality Gate

| Metric | Result |
| --- | ---: |
| Minimum Test Case Count | 12 |
| Target Test Case Count | 14–16 |
| Total Test Conditions | 18 |
| Total Test Cases | 17 |
| Minimum Automation Candidate Count | 12 |
| Automation Candidate Count | 13 |
| Duplicate Cases | 0 |
| Out-of-Scope Cases | 0 |

Both minimum gates pass. Total `17` exceeds the original target range only because the explicit human review required the additional atomic FR05-R01 grid-layout case.

## Split / Merge / Rewrite Decisions

| Decision ID | Recommendation | Decision | Reason |
| --- | --- | --- | --- |
| DR-01 | `SPLIT` | Image existence, alt, and ratio are separate objectives. | Different oracle and feasibility; ratio remains a requirement gap. |
| DR-02 | `SPLIT` | Product name, currency symbol, and grouping are separate cases. | Each can fail independently and uses different assertions. |
| DR-03 | `SPLIT` | Search target exclusion is separate from empty-state presentation. | Backend/result semantics and UI state have different blockers. |
| DR-04 | `SPLIT` | Plain text, formatting markup, and event-handler markup are separate safe-rendering cases. | Different risk and assertion patterns. |
| DR-05 | `SPLIT` | Empty-state visibility, illustration, and friendly message are separate cases. | FR-05 and FR-24 contain independently verifiable clauses. |
| DR-06 | `KEEP` | Existing seed data replaces invented product fixtures. | Stable seeds satisfy listing/name/image/price/exact-search objectives. |
| DR-07 | `REMOVE` | Arbitrary price boundary values. | No confirmed numeric boundary exists. Existing prices support grouping checks. |
| DR-08 | `REMOVE` | Partial/case-insensitive/trim/prefix/debounce/pagination/filter/sort cases. | No confirmed requirement source. |
| DR-09 | `SPLIT` | Complete controlled catalog visibility/count and grid layout are separate FR05-R01 cases. | Hai behavior có thể fail độc lập; TC-017 uses computed layout assertion without viewport/column/class assumptions. |

## Automation Suitability Summary

| Classification | Count |
| --- | ---: |
| `AUTOMATION_SUITABLE` | 2 |
| `AUTOMATION_POSSIBLE_WITH_SETUP` | 11 |
| `MANUAL_RECOMMENDED` | 0 |
| `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` | 4 |
| `NEEDS_CLARIFICATION` | 0 |

Automation Candidate Count = `AUTOMATION_SUITABLE` + `AUTOMATION_POSSIBLE_WITH_SETUP` = **13**.

Cases FR05-TC-009, FR05-TC-013, FR05-TC-015, and FR05-TC-016 are not counted because the primary observable empty/loading-state contract or stable region locator is not available. FR05-TC-004 automates only the source-supported non-empty alt objective; semantic “descriptive” quality remains a requirement gap and future human/convention review.

## Human Review

### Review History

| Review Round | Verdict | Corrections |
| --- | --- | --- |
| 1 | `INCOMPLETE` | Split FR05-TC-001 catalog completeness from grid layout; reclassify FR05-TC-006 as `POSITIVE`; recalculate all counts. |
| 2 | `APPROVED` | Không yêu cầu chỉnh sửa bổ sung; human reviewer chấp thuận corrected test-case design. |

| Field | Value |
| --- | --- |
| Review Status | `APPROVED` |
| Human Decision | `APPROVE TEST CASE DESIGN` |
| Review Notes | Corrected FR-05 test-case design được phê duyệt. Approval này không tự động phê duyệt automation plan, test data, Playwright scripts hoặc execution. |

CHECKPOINT: TEST_CASE_DESIGN_APPROVED
