# FR-09 Static Design Review Notes

## Review Result

`TEST_CASE_DESIGN_REVIEW_REQUIRED`

Design đạt minimum gates nhưng chưa được human approve.

## Static Review Checklist

| Review Area | Result | Notes |
| --- | --- | --- |
| Duplicate objectives | `PASS` | Percent/fixed discount và final amounts được split theo independent outputs; không có duplicate assertion objective. |
| Split/merge opportunities | `PASS` | Route-level authentication và apply-coupon JWT enforcement giữ riêng vì có thể fail độc lập. |
| Invented business rules | `PASS` | Không tạo case về empty input, trimming, case sensitivity, stacking, remove, replacement, max code length hoặc network behavior. |
| Boundary validity | `PASS` | Chỉ dùng explicit minimum and usage boundaries; exact expiry boundary loại bỏ vì timezone gap. |
| Frontend scope | `PASS` | Mọi case mô tả Checkout UI behavior; API/DB chỉ là setup/evidence support. |
| Test-order dependency | `PASS` | TC-010/014/015 có independent setup/cleanup; không case nào consume state cho case khác. |
| Setup realism | `PASS_WITH_APPROVED_CONSTRAINTS` | Human đã approve controlled frontend cart fixtures cho bốn requirement-supported totals và isolated test DB/transaction fixtures cho TC-010/014/015, theo constraints bên dưới. |
| Cleanup/isolation | `PASS` | Stateful cases yêu cầu transaction/isolated fixture rollback; read-only cases không complete checkout. |
| Requirement traceability | `PASS` | 12 atomic requirements đều map tới case IDs và coverage status. |
| Test count | `PASS` | 16 >= 12. |
| Automation candidate count | `PASS` | 16 >= 13. |

## Review History

| Review ID | Finding | Decision | Applied Correction |
| --- | --- | --- | --- |
| FR09-REV-001 | Initial formula examples at 300000/500000 would require synthetic cart values for all formula cases. | `REWRITE` | Normal formula cases now reuse existing 4000000 seed product; controlled totals remain only where explicit boundaries require them. |
| FR09-REV-002 | A single successful coupon case could hide independent `discount_amount` and `final_amount` failures. | `SPLIT` | Percent and fixed discount/final objectives are four atomic cases. |
| FR09-REV-003 | Combining unauthenticated Checkout access with apply-coupon JWT enforcement would obscure two independently failing boundaries. | `SPLIT` | FR09-TC-012 covers apply authorization; FR09-TC-013 covers Checkout access prerequisite. |
| FR09-REV-004 | Exact error copy and input normalization were observable in implementation but unsupported by authoritative sources. | `REMOVE_FROM_SCOPE` | Assertions use applied/rejected state and amounts; undocumented behaviors remain gaps. |
| FR09-REV-005 | `EXPIRED` at exact minimum could be rejected by current known `>` defect before expiration logic. | `REWRITE` | FR09-TC-011 uses controlled total 100001 so C3 is valid and C2 remains the primary false condition. |
| FR09-REV-006 | TC-014/015 dùng exact-minimum total 300000 nên current `>` defect có thể làm C3 reject trước khi C5 được cô lập. | `REWRITE` | Cả hai case dùng existing `Bàn phím cơ Keychron Q1` total 4000000; TC-014 giữ payable 4000000 khi reject, TC-015 có discount 100000 và final 3900000. |
| FR09-REV-007 | Human-directed post-design correction: original total 300000 làm failure attribution mơ hồ vì current implementation có thể reject tại C3 trước C5. | `MODIFIED` | Giữ nguyên C5 boundary objectives và authoritative semantics: TC-014 kiểm tra `1 = max 1` với payable 4000000; TC-015 kiểm tra `1 = max - 1` với discount 100000/final 3900000. Existing seed total 4000000 chỉ là C3-positive control để cô lập condition, không làm yếu requirement hoặc Expected Result. |

## Stateful Case Inventory

| Test Case ID | Isolation Classification | Required Setup | Cleanup |
| --- | --- | --- | --- |
| FR09-TC-010 | `STATEFUL_SETUP_REQUIRED` | Controlled inactive coupon in isolated test DB/transaction. | Roll back only fixture state. |
| FR09-TC-014 | `STATEFUL_SETUP_REQUIRED` | Exact `SAVE10` usage count 1 for isolated user; existing Keychron seed cart total 4000000. | Restore/roll back only required usage rows and browser/cart state. |
| FR09-TC-015 | `STATEFUL_SETUP_REQUIRED` | Exact `VIP100` usage count 1 for isolated user; existing Keychron seed cart total 4000000. | Restore/roll back only required usage rows and browser/cart state. |

All other cases are `READ_ONLY` for persistent business data. Browser auth/cart state vẫn phải được reset per test.

## Existing Data Reuse

- Coupon seeds: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`.
- Product seed: `Bàn phím cơ Keychron Q1` at 4000000 for normal formula cases and both usage-limit cases TC-014/015.
- Existing user row is only an implementation feasibility reference; future credentials must be handled through approved setup, not embedded in test code.
- Current `coupon_usage` snapshot is empty but future automation must not assume shared DB remains unchanged.

## Future Controlled Setup Needed

1. Authenticated browser session fixture with valid JWT.
2. UI-driven cart setup using existing seed product.
3. Controlled frontend cart-total fixture only for approved requirement-supported boundaries 299999, 300000, 500001 and 100001, without creating database products.
4. Isolated inactive-coupon fixture under the approved test DB/transaction constraints.
5. Isolated per-user usage-count fixture and rollback for max−1/max under the approved test DB/transaction constraints; use existing seed total 4000000.
6. Observable applied/rejected UI contract that does not depend on exact message copy.

## Human Setup Decisions

1. Isolated test DB/transaction fixture strategy: `APPROVED_WITH_CONSTRAINTS` cho FR09-TC-010, FR09-TC-014 và FR09-TC-015. Chỉ dùng isolated test-only deterministic state; không dùng shared/production business data; không phụ thuộc execution order; rollback/cleanup sau mỗi case; chỉ mutate required rows; giữ nguyên business semantics và authoritative Expected Results.
2. Controlled frontend cart fixture strategy: `APPROVED_WITH_CONSTRAINTS` chỉ khi explicit requirement-supported boundary không thể đạt tự nhiên từ existing seed. Approved current totals: 299999, 300000, 500001, 100001. Normal/non-boundary cases ưu tiên existing seed cart/product data; không tạo artificial database products.

## Open Requirement Gaps Preserved

- Exact success/error UI copy.
- Expiry timezone.
- Fractional percent rounding.
- Usage increment timing.
- Coupon normalization.
- Stacking, removal và replacement.
- Network recovery.

Các gap này vẫn mở và không được biến thành Expected Results. Chúng không block 16-case inventory hiện tại vì các case không dựa vào undefined semantics.

## Duplicate / Out-of-Scope Check

- Duplicate cases: 0.
- API-only cases: 0.
- Unsupported behavior cases: 0.
- Test-order dependencies: 0.
- Artificial product/database records created: 0.
- SUT/browser/test execution performed: 0.

## Current Checkpoint

`CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`
