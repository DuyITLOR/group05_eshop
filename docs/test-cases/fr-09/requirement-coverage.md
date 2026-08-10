# FR-09 Requirement Coverage

## Coverage Matrix

| Requirement ID | Requirement | Covered By | Coverage Status | Rationale |
| --- | --- | --- | --- | --- |
| FR09-R01 | Coupon entry/apply UI tại Checkout | FR09-TC-001 | `FULLY_COVERED` | Objective xác nhận input/action ở authenticated Checkout mà không invent exact copy. |
| FR09-R02 | Coupon phải tồn tại | FR09-TC-002–006, FR09-TC-008–009, FR09-TC-011, FR09-TC-014–015 | `FULLY_COVERED` | Existing valid coupons và absent-code negative partition đều có coverage. |
| FR09-R03 | Coupon phải active | FR09-TC-002–006, FR09-TC-008, FR09-TC-010–011, FR09-TC-014–015 | `FULLY_COVERED` | Active success paths và isolated inactive rejection được tách riêng. |
| FR09-R04 | Current time trước `expired_at` | FR09-TC-002–006, FR09-TC-008, FR09-TC-011, FR09-TC-014–015 | `FULLY_COVERED` | Future-expiry valid coupons và documented `EXPIRED` negative partition. |
| FR09-R05 | `total >= min_order_amount` | FR09-TC-006–008 | `FULLY_COVERED` | Explicit below/equal/above boundary coverage. |
| FR09-R06 | Valid JWT required | FR09-TC-002–012, FR09-TC-014–016 | `FULLY_COVERED` | Valid-session success paths và missing/invalid JWT rejection. |
| FR09-R07 | `usage_count < max_uses_per_user` | FR09-TC-002–006, FR09-TC-008, FR09-TC-014–015 | `FULLY_COVERED` | Usage zero baseline plus explicit max−1/max boundaries; TC-014/015 use seed total 4000000 so C3 remains valid and C5 is isolated. |
| FR09-R08 | Percent `discount_amount` formula | FR09-TC-002, FR09-TC-006 | `FULLY_COVERED` | Normal existing-seed oracle và exact-minimum formula oracle đều deterministic. |
| FR09-R09 | Fixed `discount_amount` formula | FR09-TC-004, FR09-TC-008, FR09-TC-015 | `FULLY_COVERED` | Documented fixed coupons cover normal and boundary contexts. |
| FR09-R10 | `final_amount = total - discount_amount` | FR09-TC-003, FR09-TC-005, FR09-TC-006, FR09-TC-008, FR09-TC-015 | `FULLY_COVERED` | Percent và fixed final amounts được assert độc lập. |
| FR09-R11 | Checkout requires authenticated user | FR09-TC-001–006, FR09-TC-008, FR09-TC-012–016 | `FULLY_COVERED` | Authenticated flow và direct unauthenticated access được tách vì có thể fail độc lập. |
| FR09-R12 | Checkout total auto-calculated và non-editable | FR09-TC-016 | `FULLY_COVERED` | Direct UI objective xác nhận cart-derived trusted total. |

## Coverage Summary

| Coverage Status | Count |
| --- | ---: |
| `FULLY_COVERED` | 12 |
| `PARTIALLY_COVERED` | 0 |
| `NOT_COVERED` | 0 |
| `NEEDS_CLARIFICATION` | 0 |

Requirement coverage `FULLY_COVERED` không đóng các open gaps về exact copy, rounding, timezone, usage lifecycle hoặc undefined coupon behaviors. Các gap đó không được chuyển thành invented Expected Results.

## Five-Condition Traceability

| Condition | Positive Control | Individual False Rule | Boundary Coverage |
| --- | --- | --- | --- |
| C1 Exists + Active | FR09-TC-002–006, 008, 015 | Not found: FR09-TC-009; inactive: FR09-TC-010 | N/A |
| C2 Not Expired | FR09-TC-002–006, 008, 014–015 | FR09-TC-011 | Exact-time boundary excluded due timezone gap. |
| C3 Meets Minimum | FR09-TC-002–006, 008, 014–015 | FR09-TC-007 | Below/equal/above: TC-007/006/008; TC-014/015 use existing seed total 4000000, above both coupon minimums. |
| C4 Valid JWT | FR09-TC-001–011, 014–016 | FR09-TC-012; access prerequisite TC-013 | Valid/invalid session partitions. |
| C5 Below Usage Limit | FR09-TC-002–006, 008, 015 | FR09-TC-014 | max−1/max: TC-015/014; independent controlled pre-state, no test-order dependency. |

## Open Requirement Gaps

| Gap ID | Coverage Effect | Test Case Classification Effect |
| --- | --- | --- |
| FR09-GAP-001 Exact message copy | Không ảnh hưởng business decision coverage; exact text không assert. | Không có `NEEDS_CLARIFICATION` case. |
| FR09-GAP-002 Expiry timezone | Exact timestamp boundary chưa covered. | Existing expired/valid partitions vẫn automatable. |
| FR09-GAP-003 Percent rounding | Fractional oracle chưa covered. | Deterministic integer formula data tránh assumption. |
| FR09-GAP-004 Usage increment timing | Persistence transition chưa covered. | Usage limit cases dùng explicit pre-state, không test increment lifecycle. |
| FR09-GAP-005 Input normalization | Không covered vì undocumented. | Không tạo trimming/case/empty cases. |
| FR09-GAP-006 Stacking/remove/replace | Không covered vì undocumented. | Không tạo lifecycle cases. |
| FR09-GAP-007 Network recovery | Không covered vì undocumented. | Không tạo network-error case. |

Setup/reset không còn là open requirement gap: human đã phê duyệt isolated test DB/transaction fixture và controlled frontend cart fixture với constraints. TC-010/014/015 vẫn là `AUTOMATION_POSSIBLE_WITH_SETUP`; quyết định setup không thay đổi requirement coverage hoặc Expected Results.

## Automation Candidate Coverage

| Classification | Test Cases | Count |
| --- | --- | ---: |
| `AUTOMATION_SUITABLE` | FR09-TC-013 | 1 |
| `AUTOMATION_POSSIBLE_WITH_SETUP` | FR09-TC-001–012, FR09-TC-014–016 | 15 |
| Non-candidates | None | 0 |
| Total Automation Candidates | FR09-TC-001–016 | 16 |

Minimum Automation Candidate Count `13`: `PASS` with 16 legitimate frontend candidates.
