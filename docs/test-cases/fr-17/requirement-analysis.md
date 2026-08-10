# FR-17 Requirement Analysis — Coupon management

## Analysis Scope

Phân tích này thiết kế coverage cho Web Admin, actor `Admin`, feature `FR-17 — Coupon management`. Detailed requirement scope chỉ gồm `VIEW`, `CREATE`, `DELETE`; từ `CRUD` trong tiêu đề không suy diễn thêm `UPDATE`.

Source code và seed data chỉ được dùng để đánh giá feasibility, locator, isolation và discrepancy. Chúng không thay đổi requirement hoặc `Expected Result`.

## Source Inventory

| Source | Authority Classification | FR-17 Evidence Used |
| --- | --- | --- |
| `README.md` — FR-17, lines 213–216 | `AUTHORITATIVE` | Admin có thể thêm, xem, xóa coupon; sáu field bắt buộc và các domain/boundary đã nêu. |
| `README.md` — FR-12, lines 174–179 | `AUTHORITATIVE_CROSS_FEATURE` | Admin surface và data-changing coupon APIs yêu cầu valid JWT và `role = 'admin'`. |
| `README.md` — FR-22, lines 250–252 | `AUTHORITATIVE_CROSS_FEATURE` | Required fields trên form phải có ký hiệu `*`; áp dụng trực tiếp cho coupon create form. |
| `README.md` — SEC-02/SEC-03, lines 279–280 | `SUPPORTING_REQUIREMENT` | Củng cố JWT và server-side admin-role boundary; không tạo requirement trùng với FR-12. |
| `api_specification.md` — 5.2, 6.4 | `SUPPORTING_CONTRACT` | `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/:id` và create payload fields. |
| `frontend-admin/src/App.jsx` | `IMPLEMENTATION_ONLY` | Coupon tab, form, table, create/delete flow, present locators và current client-side controls. |
| `backend/server.js` | `IMPLEMENTATION_ONLY` | Current routes, JWT middleware, insert/delete behavior và missing role/validation enforcement. |
| `backend/database.js` | `IMPLEMENTATION_ONLY` | Coupon schema, four coupon seeds, admin/user roles; dùng cho deterministic data planning. |

`FR-21` được review nhưng không đưa các cross-feature visual/layout clauses vào FR-17 atomic inventory. Chúng không cần thiết để chứng minh detailed coupon operations; việc mở rộng sang color, heading hoặc tab-order sẽ là scope riêng. `FR-22` required marker được chọn vì liên kết trực tiếp với sáu required coupon fields.

## Detailed FR-17 Operations

| Operation | Requirement Status | Test Design Status |
| --- | --- | --- |
| `VIEW` | `CONFIRMED` | Covered bằng controlled seed-list oracle. |
| `CREATE` | `CONFIRMED` | Covered bằng valid partitions, required-field omissions, uniqueness và numeric boundaries. |
| `DELETE` | `CONFIRMED` | Covered bằng owned controlled coupon và observable list removal. |
| `UPDATE` | `NOT_IN_DETAILED_REQUIREMENT_SCOPE` | Không tạo test case, data, oracle hoặc automation assumption. |

## Extracted Atomic Requirements

| Requirement ID | Atomic Requirement | Source | Testable | Notes |
| --- | --- | --- | --- | --- |
| FR17-R01 | Admin có thể xem danh sách coupon. | README FR-17 | Yes | Controlled oracle dùng bốn existing seed coupons. |
| FR17-R02 | Admin có thể tạo coupon hợp lệ. | README FR-17 | Yes | Observable qua record mới xuất hiện trong list. |
| FR17-R03 | Admin có thể xóa coupon. | README FR-17 | Yes | Chỉ xóa controlled record do test sở hữu. |
| FR17-R04 | `code` là required. | README FR-17 | Yes | Không suy diễn trim/case/format. |
| FR17-R05 | `code` phải unique. | README FR-17 | Yes | Dùng existing `SAVE10` làm duplicate oracle. |
| FR17-R06 | `type` là required và domain chỉ gồm `percent`, `fixed`. | README FR-17 | Yes | Một constrained-choice control phải luôn có một trong hai allowed values; không invent type khác. |
| FR17-R07 | `discount_value` là required. | README FR-17 | Yes | Controlled omission phải không tạo record. |
| FR17-R08 | `discount_value > 0`. | README FR-17 | Yes | Exact invalid boundary `0`; positive control trong valid create. |
| FR17-R09 | `expired_at` là required. | README FR-17 | Yes | Không suy diễn future-date rule hoặc timezone. |
| FR17-R10 | `min_order_amount` là required. | README FR-17 | Yes | Controlled omission riêng với boundary case. |
| FR17-R11 | `min_order_amount >= 0`. | README FR-17 | Yes | Valid `0` và invalid `-1`. |
| FR17-R12 | `max_uses_per_user` là required. | README FR-17 | Yes | Controlled omission riêng với boundary case. |
| FR17-R13 | `max_uses_per_user >= 1`. | README FR-17 | Yes | Valid `1` và invalid `0`. |
| FR17-R14 | Coupon management yêu cầu valid JWT. | README FR-12; SEC-02 | Yes | Không buộc một redirect URL hoặc exact denial copy. |
| FR17-R15 | Coupon management chỉ dành cho `role = 'admin'`. | README FR-12; SEC-03 | Yes | Non-admin token phải không có usable management flow. |
| FR17-R16 | Mỗi required coupon field có ký hiệu `*` bên cạnh nhãn. | README FR-22 | Yes | Objective chỉ là required-field indication, không đánh giá style chủ quan. |

## Boundary and Partition Model

| Field / Rule | Valid Partition or Boundary | Invalid Partition or Boundary | Technique |
| --- | --- | --- | --- |
| `type` | `percent`, `fixed` | Không tạo arbitrary invalid type vì UI control không cho nhập và requirement không nêu error contract. | `EQUIVALENCE_PARTITIONING` |
| `discount_value > 0` | `1` | `0` | `BOUNDARY_VALUE_ANALYSIS` |
| `min_order_amount >= 0` | `0` | `-1` | `BOUNDARY_VALUE_ANALYSIS` |
| `max_uses_per_user >= 1` | `1` | `0` | `BOUNDARY_VALUE_ANALYSIS` |
| Required fields | Non-empty valid value | Omit exactly one field while all other fields remain valid. | `EQUIVALENCE_PARTITIONING` |
| Authorization | Valid admin session | No valid JWT; valid non-admin JWT | `DECISION_TABLE` |

Không dùng boundary không có technical basis như percent `100/101`, code length, fixed discount so với order total hoặc expiry exact-time.

## Existing Seed Data Relevant to FR-17

| Data | Verified Implementation Snapshot | Legitimate Use |
| --- | --- | --- |
| Coupon `SAVE10` | `percent`, value 10, min 300000, expiry 2099-12-31, max 1 | List oracle và duplicate-code case. |
| Coupon `BIGBUY` | `fixed`, value 50000, min 500000, expiry 2099-12-31, max 1 | List oracle và fixed display reference. |
| Coupon `VIP100` | `fixed`, value 100000, min 300000, expiry 2099-12-31, max 2 | List oracle. |
| Coupon `EXPIRED` | `percent`, value 20, min 100000, expiry 2020-01-01, max 1 | List oracle only; không biến expiry state thành FR-17 validation rule. |
| Admin role seed | `admin` role exists | Future admin-session fixture; credentials phải được externalize/configure. |
| Public user role seed | `user` role exists | Future non-admin authorization fixture. |

Seed snapshot phải được verify lại trước future execution. Không test nào được phụ thuộc vào order hoặc state do test khác để lại.

## State Isolation Model

| Classification | Meaning for FR-17 |
| --- | --- |
| `READ_ONLY` | Chỉ quan sát UI/access; không gửi operation dự kiến làm thay đổi coupon data. |
| `STATEFUL_SETUP_REQUIRED` | Chạy trên isolated backend/database copy; chuẩn bị deterministic pre-state và restore snapshot dù operation dự kiến bị reject. |
| `STATEFUL_CREATE_CLEANUP` | Chạy trên isolated backend/database copy; tạo unique owned record, verify, rồi cleanup đúng record đó hoặc restore snapshot. |

Future state-changing automation phải dùng isolated database copy. Shared workspace/production-like database không được mutate. Cleanup không được trở thành primary objective của create case.

## Implementation Discrepancies

Các mục dưới đây là `IMPLEMENTATION_ONLY` observations, chưa phải runtime defect verdict:

| Discrepancy ID | Confirmed Requirement | Current Implementation Observation | Likely Affected Cases |
| --- | --- | --- | --- |
| FR17-IMP-001 | API/surface phải kiểm tra `role = 'admin'`. | `authenticateToken` chỉ verify JWT; `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/:id` không có server-side role guard. | FR17-TC-016 |
| FR17-IMP-002 | `code` required/unique. | DB enforces uniqueness but backend create không validate missing/empty `code`; DB column không `NOT NULL`. | FR17-TC-005, FR17-TC-006 |
| FR17-IMP-003 | `type` required và chỉ `percent/fixed`. | UI select chỉ có hai values, nhưng backend không validate missing/arbitrary `type`; DB has default and no check constraint. | FR17-TC-003, FR17-TC-004 |
| FR17-IMP-004 | `discount_value` required và > 0. | UI has native `required` but no `min`; backend/DB không enforce presence hoặc positivity. | FR17-TC-007, FR17-TC-008 |
| FR17-IMP-005 | `expired_at` required. | UI has native `required`; backend/DB không enforce requiredness. | FR17-TC-009 |
| FR17-IMP-006 | `min_order_amount` required và >= 0. | UI initializes `0` but has neither `required` nor `min`; backend/DB không enforce presence/non-negative value. | FR17-TC-010, FR17-TC-011 |
| FR17-IMP-007 | `max_uses_per_user` required và >= 1. | UI has `min="1"` but not `required`; backend uses `max_uses_per_user || 1`, silently converting missing/zero to 1. | FR17-TC-012, FR17-TC-013 |
| FR17-IMP-008 | Required fields need `*` beside labels. | Coupon form uses placeholders/no field labels and no visible `*`. | FR17-TC-002 |

Client login checks `res.data.user.role`, nhưng đây không thay thế server-side authorization required bởi FR-12/SEC-03.

## Requirement Gaps

| Gap ID | Undefined Area | Design Decision |
| --- | --- | --- |
| FR17-GAP-001 | `UPDATE` behavior despite CRUD title | `NOT_IN_DETAILED_REQUIREMENT_SCOPE`; no case. |
| FR17-GAP-002 | Activation/deactivation | No case or oracle. |
| FR17-GAP-003 | Maximum percent value such as 100 | No upper-bound test. |
| FR17-GAP-004 | Code length, charset | No arbitrary limit/format test. |
| FR17-GAP-005 | Code trimming/case normalization | No trimming/case assumption. |
| FR17-GAP-006 | Filter/search/sort/pagination | No case. |
| FR17-GAP-007 | Exact success/error copy | Assertions use observable business state, not invented copy. |
| FR17-GAP-008 | Expiry timezone/date normalization/future-date validation | Only requiredness is tested. |
| FR17-GAP-009 | Fixed discount relative to cart/order total | Belongs to application semantics, not management create rule. |
| FR17-GAP-010 | Coupon stacking/application behavior | Out of FR-17 management scope. |
| FR17-GAP-011 | Delete confirmation semantics | Delete outcome is tested without inventing a required dialog. |

Open requirement gaps remain separate from test cases classified `NEEDS_CLARIFICATION`. Current design has zero `NEEDS_CLARIFICATION` cases because no primary objective depends on these undefined areas.

## Future External Data Strategy

Future approved test data will be placed in `test-data/fr-17.json`; it is not created in this phase. Planned logical data includes:

- verified seed-list oracle;
- admin and non-admin session setup descriptors without inline credentials;
- isolated database copy/snapshot setup;
- unique owned coupon records for `percent` and `fixed` partitions;
- single-field omission datasets;
- exact numeric boundary datasets `discount_value = 0`, `min_order_amount = -1`, `max_uses_per_user = 0`;
- cleanup identifiers derived from controlled unique coupon codes.

No artificial shared-database record is created during design.
