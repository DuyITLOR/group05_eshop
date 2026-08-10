# FR-09 Requirement Analysis — Discount coupons

## Analysis Scope

Phân tích này chỉ bao phủ coupon behavior tại web Checkout cho authenticated customer. `README.md` FR-09 quyết định Expected Result; API và implementation chỉ hỗ trợ traceability, feasibility và discrepancy discovery.

## Source Inventory

| Source ID | Source | Source Type | Authority | Related Requirement | Notes |
| --- | --- | --- | --- | --- | --- |
| FR09-S01 | `README.md`, FR-09 — Mã Giảm Giá | Functional requirement | `AUTHORITATIVE` | FR09-R01–FR09-R10 | Năm điều kiện bắt buộc, công thức và bốn sample coupons. |
| FR09-S02 | `README.md`, FR-08 — Checkout | Related functional requirement | `AUTHORITATIVE` | FR09-R11–FR09-R12 | Chỉ dùng cho authentication prerequisite và checkout-total context. |
| FR09-S03 | `api_specification.md`, 5.1 Apply coupon | API contract | `SUPPORTING` | FR09-R08–FR09-R10 | Xác nhận endpoint và response fields; example body có `user_id` không thay thế JWT rule. |
| FR09-S04 | `frontend-web/src/pages/Checkout.jsx` | Source code | `IMPLEMENTATION_ONLY` | UI/locator/flow feasibility | Có coupon input, apply button, result/error regions và displayed amounts. |
| FR09-S05 | `frontend-web/src/App.jsx`, `Cart.jsx`, `CartContext.jsx`, `AuthContext.jsx` | Source code | `IMPLEMENTATION_ONLY` | FR09-R06, FR09-R11, FR09-R12 | Route, login/cart state và current navigation behavior. |
| FR09-S06 | `backend/server.js` | Source code | `IMPLEMENTATION_ONLY` | C1–C5, formulas | Dùng để phát hiện nonconformance; không định nghĩa Expected Result. |
| FR09-S07 | `backend/database.js`, `backend/database.sqlite` | Seed/schema/current state | `IMPLEMENTATION_ONLY` | Data feasibility | SQLite được đọc bằng read-only connection; không có mutation. |

## Extracted Atomic Requirements

Các ID dưới đây là `INTERNAL_TRACEABILITY_ID`.

| Requirement ID | Requirement Statement | Source | Testable | Notes |
| --- | --- | --- | --- | --- |
| FR09-R01 | Checkout cung cấp UI để authenticated customer nhập và apply coupon code. | FR09-S01 | Yes | Không quy định exact copy, Enter trigger hoặc input normalization. |
| FR09-R02 | Coupon code phải tồn tại trong database. | FR09-S01, C1 | Yes | Tách khỏi active status vì có thể fail độc lập. |
| FR09-R03 | Coupon tồn tại phải có `is_active = 1`. | FR09-S01, C1 | Yes | Cần controlled inactive state vì seed không có inactive coupon. |
| FR09-R04 | Coupon chỉ valid khi current date/time trước `expired_at`. | FR09-S01, C2 | Yes | `EXPIRED` hỗ trợ negative equivalence partition. |
| FR09-R05 | Coupon chỉ valid khi `total >= min_order_amount`. | FR09-S01, C3 | Yes | Explicit boundary: below, equal, above. |
| FR09-R06 | Coupon application yêu cầu valid JWT Token. | FR09-S01, C4 | Yes | `user_id` trong API example không thay thế JWT identity. |
| FR09-R07 | Coupon chỉ valid khi user usage count `< max_uses_per_user`. | FR09-S01, C5 | Yes | Explicit boundary: max−1 và max. |
| FR09-R08 | Với `percent`, `discount_amount = total × discount_value / 100`. | FR09-S01 | Yes | Chọn dữ liệu cho kết quả nguyên, không cần invent rounding. |
| FR09-R09 | Với `fixed`, `discount_amount = discount_value`. | FR09-S01 | Yes | Dùng documented `BIGBUY`. |
| FR09-R10 | Sau khi apply valid coupon, `final_amount = total - discount_amount`. | FR09-S01, FR09-S03 | Yes | Percent và fixed được verify độc lập. |
| FR09-R11 | Chỉ authenticated user được tiến hành Checkout. | FR09-S02 | Yes | Supporting prerequisite trực tiếp cho coupon UI. |
| FR09-R12 | Checkout total được tính tự động từ cart và user không chỉnh trực tiếp. | FR09-S02 | Yes | Coupon eligibility/calculation phải dùng trusted checkout-total context. |

## Five-Condition Decision Model

| Rule | C1 Exists + Active | C2 Not Expired | C3 Meets Minimum | C4 Valid JWT | C5 Below Usage Limit | Expected Decision | Covered By |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | T | T | T | T | T | Apply coupon và tính amounts theo formula. | FR09-TC-002–006, FR09-TC-008 |
| D2 | F — not found | N/A | T | T | N/A | Reject; coupon không được apply. | FR09-TC-009 |
| D3 | F — inactive | T | T | T | T | Reject; coupon không được apply. | FR09-TC-010 |
| D4 | T | F | T | T | T | Reject; coupon không được apply. | FR09-TC-011 |
| D5 | T | T | F | T | T | Reject; coupon không được apply. | FR09-TC-007 |
| D6 | T | T | T | F | T | Reject; coupon không được apply. | FR09-TC-012 |
| D7 | T | T | T | T | F | Reject; coupon không được apply. | FR09-TC-014 |

Không tạo mọi tổ hợp Boolean. Mỗi negative rule cô lập một condition sai, trong khi các condition còn lại được giữ valid khi có ý nghĩa. Riêng hai usage-limit boundaries dùng existing seed cart total 4000000 để C3 chắc chắn valid theo cả requirement `>=` và current nonconforming implementation `>`; controlled pre-state chỉ cô lập C5.

## Boundary Model

| Boundary | Data | Expected Decision | Covered By | Setup |
| --- | ---: | --- | --- | --- |
| `SAVE10` just below minimum | 299999 | Reject | FR09-TC-007 | Controlled cart-total fixture |
| `SAVE10` exactly minimum | 300000 | Accept | FR09-TC-006 | Controlled cart-total fixture |
| `BIGBUY` just above minimum | 500001 | Accept | FR09-TC-008 | Controlled cart-total fixture |
| `VIP100` usage = max−1 | 1 of 2; total 4000000 | Accept | FR09-TC-015 | Existing seed cart + isolated `coupon_usage` setup |
| `SAVE10` usage = max | 1 of 1; total 4000000 | Reject | FR09-TC-014 | Existing seed cart + isolated `coupon_usage` setup |

## Formula Oracles

| Coupon | Controlled Total | Formula | Expected `discount_amount` | Expected `final_amount` | Covered By |
| --- | ---: | --- | ---: | ---: | --- |
| `SAVE10` | 4000000 | `4000000 × 10 / 100` | 400000 | 3600000 | FR09-TC-002, FR09-TC-003 |
| `BIGBUY` | 4000000 | fixed 50000 | 50000 | 3950000 | FR09-TC-004, FR09-TC-005 |
| `VIP100` | 4000000 | fixed 100000 | 100000 | 3900000 | FR09-TC-015 |

Giá trị 4000000 tận dụng seed product `Bàn phím cơ Keychron Q1` cho normal formula và usage-limit cases; không tạo product record mới, synthetic cart total hoặc rounding assumption.

## Existing Data Snapshot

Read-only inspection của `backend/database.sqlite` xác nhận:

| Data | Current Verified State | Intended Use |
| --- | --- | --- |
| `SAVE10` | percent 10; min 300000; active; expiry 2099-12-31; max 1 | Percent formula, minimum boundaries, usage=max. |
| `BIGBUY` | fixed 50000; min 500000; active; expiry 2099-12-31; max 1 | Fixed formula, above-minimum boundary. |
| `VIP100` | fixed 100000; min 300000; active; expiry 2099-12-31; max 2 | Usage=max−1 boundary. |
| `EXPIRED` | percent 20; min 100000; active; expiry 2020-01-01; max 1 | Expiration rejection. |
| Test User | user id 2, role `user` | Future authenticated session setup; không hardcode credential vào test design. |
| `coupon_usage` | Không có row tại thời điểm read-only inspection | Baseline discovery only; future tests vẫn phải isolate state. |
| Inactive coupon | Không tồn tại trong seed | Cần future controlled test fixture; không insert trong phase này. |

## Implementation Discrepancies

| Discrepancy ID | Requirement | Implementation Observation | Impact on Design |
| --- | --- | --- | --- |
| FR09-IMP-001 | FR09-R06 | `POST /api/apply-coupon` không dùng `authenticateToken`; frontend gửi `user_id` trong body. | Giữ Expected Result theo valid-JWT rule; FR09-TC-012 dự kiến có thể reveal product defect. |
| FR09-IMP-002 | FR09-R06, FR09-R07 | Khi `user_id` absent, backend bỏ qua usage check và vẫn có success path. | Authentication và per-user enforcement phải được assert độc lập. |
| FR09-IMP-003 | FR09-R05 | Backend dùng `total_amount > min_order_amount` thay vì `>=`. | Exact-minimum case FR09-TC-006 giữ requirement oracle và có thể reveal defect. |
| FR09-IMP-004 | FR09-R08 | Percent branch dùng `Math.floor(total_amount * (1 - discount_value))`, không phải `/ 100`. | Percent discount/final assertions không được làm yếu. |
| FR09-IMP-005 | FR09-R11 | `/checkout` route không có route guard; chỉ normal Cart navigation kiểm tra `user`. | Direct-route authentication case FR09-TC-013 là automatable và có thể reveal defect. |
| FR09-IMP-006 | FR09-R12 | Checkout total được render bằng editable number input và gửi từ client. | FR09-TC-016 giữ non-editable/trusted-total Expected Result. |
| FR09-IMP-007 | Requirement gaps | Frontend `trim()` và `toUpperCase()` coupon code. | Chỉ là implementation observation; không tạo case về trimming/case sensitivity. |
| FR09-IMP-008 | FR09-R07 | Usage được ghi qua separate authenticated endpoint sau checkout, không atomic với apply. | Stateful tests cần isolated setup/cleanup; không dựa vào test order. |

## Requirement Gaps

| Gap ID | Missing Information | Why It Matters | Affected Behavior | Question |
| --- | --- | --- | --- | --- |
| FR09-GAP-001 | Exact error/success message copy không được quy định. | Không có oracle cho exact text. | All apply outcomes | Có approved UI copy hoặc chỉ cần observable accepted/rejected state? |
| FR09-GAP-002 | Timezone và timestamp parsing cho `expired_at` không được quy định. | Không thể thiết kế exact-time expiry boundary ổn định. | FR09-R04 | Timezone chuẩn nào áp dụng cho `expired_at`? |
| FR09-GAP-003 | Percent rounding semantics không được quy định. | Fractional results có thể tạo ambiguous oracle. | FR09-R08, FR09-R10 | Round/floor/decimal policy là gì? |
| FR09-GAP-004 | Thời điểm increment coupon usage chưa được quy định rõ. | Ảnh hưởng persistence/rollback và retry behavior. | FR09-R07 | Usage được consume khi apply hay khi checkout thành công? |
| FR09-GAP-005 | Empty input, case sensitivity và trimming không được quy định. | Không được biến current normalization thành requirement. | Coupon input validation | Có canonicalization rule được phê duyệt không? |
| FR09-GAP-006 | Coupon stacking, replacement và removal không được quy định. | Không có Expected Result hợp lệ cho multi-coupon lifecycle. | Checkout coupon state | Mỗi order cho phép bao nhiêu coupon và có remove/replace không? |
| FR09-GAP-007 | Network/server-error presentation không được quy định. | Không có UI recovery/message oracle. | Apply-coupon error handling | Có approved retry/recovery contract không? |
Các gap trên không ngăn 16 cases hiện tại vì Expected Result của chúng chỉ dùng confirmed business rules và observable apply/reject/amount states.

## Approved Setup Constraints

- Isolated test DB/transaction fixture: `APPROVED_WITH_CONSTRAINTS` cho FR09-TC-010, FR09-TC-014 và FR09-TC-015. Setup phải test-only, deterministic, không dùng shared/production business data, không phụ thuộc execution order, chỉ mutate rows cần thiết và rollback sau mỗi case; business semantics và authoritative Expected Results không thay đổi.
- Controlled frontend cart fixture: `APPROVED_WITH_CONSTRAINTS` chỉ cho requirement-supported boundaries không thể đạt tự nhiên từ seed data. Approved current totals là 299999, 300000, 500001 và 100001. Normal/non-boundary cases phải ưu tiên existing seed data; không tạo artificial database product records.

## Conflict Assessment

Không phát hiện conflict giữa các authoritative sources. API example có `user_id` và không mô tả JWT cho apply-coupon; đây là supporting omission/mismatch, không được dùng để override FR09-R06.
