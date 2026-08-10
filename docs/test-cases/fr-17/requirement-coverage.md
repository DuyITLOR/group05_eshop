# FR-17 Requirement Coverage

## Detailed Operation Scope

| CRUD Label Element | Detailed Requirement Evidence | Scope Status | Covered By |
| --- | --- | --- | --- |
| `CREATE` | “Admin có thể Thêm” | `IN_DETAILED_REQUIREMENT_SCOPE` | FR17-TC-003–013 |
| `READ / VIEW` | “Admin có thể Xem” | `IN_DETAILED_REQUIREMENT_SCOPE` | FR17-TC-001 |
| `UPDATE` | Không có update behavior, fields, route hoặc Expected Result trong FR-17 detail. | `NOT_IN_DETAILED_REQUIREMENT_SCOPE` | None |
| `DELETE` | “Admin có thể Xóa” | `IN_DETAILED_REQUIREMENT_SCOPE` | FR17-TC-014 |

`CRUD` trong title không được dùng để invent `UPDATE` coverage.

## Coverage Matrix

| Requirement ID | Atomic Requirement | Covered By | Coverage Status | Rationale |
| --- | --- | --- | --- | --- |
| FR17-R01 | Admin xem coupon list. | FR17-TC-001 | `FULLY_COVERED` | Complete controlled seed set và count tạo deterministic oracle. |
| FR17-R02 | Admin tạo valid coupon. | FR17-TC-003, FR17-TC-004 | `FULLY_COVERED` | Independent percent/fixed submitted records phải xuất hiện trong list; cleanup diễn ra sau primary assertions. |
| FR17-R03 | Admin xóa coupon. | FR17-TC-014 | `FULLY_COVERED` | Owned setup record chuyển count 1 → 0; shared seeds không bị xóa. |
| FR17-R04 | `code` required. | FR17-TC-006 | `FULLY_COVERED` | Single-field omission giữ các field khác valid. |
| FR17-R05 | `code` unique. | FR17-TC-005 | `FULLY_COVERED` | Existing `SAVE10` cho exact duplicate oracle. |
| FR17-R06 | `type` required, domain `{percent, fixed}`. | FR17-TC-003, FR17-TC-004 | `FULLY_COVERED` | `percent` được exercised bằng actual CREATE ở TC-003; `fixed` bằng actual CREATE ở TC-004. Không invent arbitrary third-type UI test vì Admin UI dùng constrained selector và không có authoritative invalid-type presentation behavior. |
| FR17-R07 | `discount_value` required. | FR17-TC-007 | `FULLY_COVERED` | Omission outcome tách khỏi positivity. |
| FR17-R08 | `discount_value > 0`. | FR17-TC-004, FR17-TC-008 | `FULLY_COVERED` | Exact valid/invalid lower boundaries 1/0. |
| FR17-R09 | `expired_at` required. | FR17-TC-004, FR17-TC-009 | `FULLY_COVERED` | Non-empty positive control và missing-value negative partition. |
| FR17-R10 | `min_order_amount` required. | FR17-TC-010 | `FULLY_COVERED` | Explicit empty-input outcome. |
| FR17-R11 | `min_order_amount >= 0`. | FR17-TC-004, FR17-TC-011 | `FULLY_COVERED` | Exact valid/invalid lower boundaries 0/-1. |
| FR17-R12 | `max_uses_per_user` required. | FR17-TC-012 | `FULLY_COVERED` | Explicit empty-input outcome. |
| FR17-R13 | `max_uses_per_user >= 1`. | FR17-TC-004, FR17-TC-013 | `FULLY_COVERED` | Exact valid/invalid lower boundaries 1/0. |
| FR17-R14 | Valid JWT required. | FR17-TC-001–014, FR17-TC-015 | `FULLY_COVERED` | Valid-admin control paths và missing-JWT negative partition. |
| FR17-R15 | `role = 'admin'` required. | FR17-TC-001–014, FR17-TC-016 | `FULLY_COVERED` | Admin positive controls và valid non-admin negative partition. |
| FR17-R16 | Required field labels show `*`. | FR17-TC-002 | `FULLY_COVERED` | Objective enumerates all six confirmed required fields. |

## Coverage Summary

| Coverage Status | Count |
| --- | ---: |
| `FULLY_COVERED` | 16 |
| `PARTIALLY_COVERED` | 0 |
| `NOT_COVERED` | 0 |
| `NEEDS_CLARIFICATION` | 0 |

Requirement Coverage Result: `PASS_WITH_OPEN_REQUIREMENT_GAPS`.

Full coverage áp dụng cho extracted atomic requirements, không có nghĩa các undefined behaviors đã được quyết định.

## Open Requirement Gaps

| Gap ID | Gap | Coverage Effect | Test Case Classification Effect |
| --- | --- | --- | --- |
| FR17-GAP-001 | Update semantics absent. | `UPDATE` marked `NOT_IN_DETAILED_REQUIREMENT_SCOPE`. | No case added. |
| FR17-GAP-002 | Activation/deactivation absent. | Not covered. | No case added. |
| FR17-GAP-003 | Percent upper bound absent. | No 100/101 boundary. | No case needs clarification. |
| FR17-GAP-004 | Code length/charset absent. | Not covered. | No invented partition. |
| FR17-GAP-005 | Trim/case normalization absent. | Not covered. | No invented Expected Result. |
| FR17-GAP-006 | Filter/search/sort/pagination absent. | Not covered. | No case added. |
| FR17-GAP-007 | Exact message copy absent. | Business state/count used as oracle. | Existing cases remain automatable. |
| FR17-GAP-008 | Expiry timezone/future-date rules absent. | Only requiredness covered. | No date-boundary case. |
| FR17-GAP-009 | Fixed discount relative to total absent. | Not a management create oracle. | No case added. |
| FR17-GAP-010 | Stacking/application behavior outside FR-17. | Not covered. | No case added. |
| FR17-GAP-011 | Delete confirmation semantics absent. | Delete result only is covered. | TC-014 does not require dialog. |

Open Requirement Gaps: 11.

Test Cases Classified as `NEEDS_CLARIFICATION`: 0.

Hai metrics trên không được merge.

## Automation Candidate Coverage

| Classification | Test Cases | Count |
| --- | --- | ---: |
| `AUTOMATION_SUITABLE` | FR17-TC-015 | 1 |
| `AUTOMATION_POSSIBLE_WITH_SETUP` | FR17-TC-001–014, FR17-TC-016 | 15 |
| `MANUAL_RECOMMENDED` | None | 0 |
| `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` | None | 0 |
| `NEEDS_CLARIFICATION` | None | 0 |
| Total Automation Candidates | FR17-TC-001–016 | 16 |

Minimum Automation Candidate Count `12`: `PASS` với 16 legitimate frontend candidates.

## State Isolation Coverage

| Classification | Test Cases | Count |
| --- | --- | ---: |
| `READ_ONLY` | FR17-TC-001–002, FR17-TC-015–016 | 4 |
| `STATEFUL_CREATE_CLEANUP` | FR17-TC-003–004 | 2 |
| `STATEFUL_SETUP_REQUIRED` | FR17-TC-005–014 | 10 |
| Stateful Total | FR17-TC-003–014 | 12 |

Stateful cases require isolated database copy and independent restore/cleanup. No test consumes another test's created record.

## Demo Coverage

| Demo Suitability | Test Cases | Count |
| --- | --- | ---: |
| `PRIMARY_DEMO_CANDIDATE` | FR17-TC-004 | 1 |
| `SECONDARY_DEMO_CANDIDATE` | FR17-TC-003, FR17-TC-014 | 2 |
| `NOT_RECOMMENDED_FOR_DEMO` | FR17-TC-001–002, FR17-TC-005–013, FR17-TC-015–016 | 13 |

Primary demo recommendation vẫn là FR17-TC-004; TC-003 là visible percent-CREATE secondary candidate và TC-014 là independent DELETE secondary candidate.
