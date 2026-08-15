# Đề xuất Ma trận Production HW05 - Revision 2

## 1. Trạng thái revision

- PRODUCTION_MATRIX_STATUS: `MODIFIED_AND_APPROVED`
- Revision Reason: `ENDPOINT_OWNERSHIP_CONFLICT`
- Previous Matrix: `REJECTED_FOR_FINAL_PRODUCTION`
- Revised Proposal Status: `REVIEWED`
- Hard-excluded Workflows: `5`
- Remaining Candidates Reviewed: `25`
- Controlled apply-coupon evidence: `PRESERVED`
- JMX/CSV/JTL generation: `NOT_PERFORMED`

Revision này thay thế recommendation active của Revision 1 nhưng giữ lịch sử matrix bị reject bên dưới. Không endpoint nào trong hard exclusion list được giữ làm candidate hoặc backup. Cross-member ownership của ba workflow được chọn là xác nhận trực tiếp của Student, không phải suy luận từ repository.

## 2. Human Review của matrix trước

Student Decision: `REJECTED`

Reason: `ENDPOINT_OWNERSHIP_CONFLICT`

| Group | Previous endpoint | Scenario | Listener | Final-production status |
|---|---|---|---|---|
| `READ_HEAVY` | `GET /api/products?search={search_term}` | `LOAD` | `Summary Report` | `REJECTED_OWNERSHIP_CONFLICT` |
| `AUTH_HEAVY` | `POST /api/login` | `SPIKE` | `Response Time Graph` | `REJECTED_OWNERSHIP_CONFLICT` |
| `TRANSACTIONAL` | `POST /api/checkout` | `STRESS` | `Aggregate Report` | `REJECTED_OWNERSHIP_CONFLICT` |

Design `docs/performance-design/load-products-search-design.md` được giữ với classification `NON_PRODUCTION_DUE_TO_OWNERSHIP_CONFLICT`; không được tạo JMX từ design đó.

## 3. Hard endpoint exclusion list

| # | Reserved endpoint/workflow | Matching rule | Status |
|---:|---|---|---|
| 1 | `POST /api/login` | Exact endpoint và login workflow | `HARD_EXCLUDED` |
| 2 | `GET /api/products?search=...` | Product search endpoint/workflow | `HARD_EXCLUDED` |
| 3 | Product detail endpoint/workflow | `GET /api/products/:id` và product-detail flow | `HARD_EXCLUDED` |
| 4 | Cart endpoint/workflow | `GET /api/cart`, `POST /api/cart` và cart flow | `HARD_EXCLUDED` |
| 5 | `POST /api/checkout` hoặc checkout workflow | Exact endpoint và checkout flow | `HARD_EXCLUDED` |

Hard exclusions là Human-provided ownership evidence cho các workflow trên. Với endpoint còn lại, absence khỏi list chỉ tạo `HARD_EXCLUSION_CHECK: PASS`; nó không chứng minh ownership toàn nhóm.

## 4. Authority và tiêu chí review

- `FACT`: current behavior lấy từ `backend/server.js`; schema/seed lấy từ `backend/database.js` và read-only database snapshot; documented contract lấy từ `api_specification.md`; `README.md` là supporting business/security documentation.
- `FACT`: repository không có full group endpoint-assignment record ngoài hard exclusion list do Student cung cấp trong Human Review này.
- `HUMAN_CONFIRMATION`: Student xác nhận trực tiếp ba workflow được chọn không được giao cho thành viên khác; giá trị này không được suy ra từ repository.
- `HUMAN_DECISION`: revised endpoint/group/scenario/Listener/CSV matrix được `MODIFIED_AND_APPROVED`.
- `ASSUMPTION_REQUIRES_REVIEW`: chưa có SLA hoặc production traffic profile cho các endpoints mới.
- Candidate viable nghĩa là route thực tồn tại và có thể map có lý do vào ít nhất một group; viable không đồng nghĩa recommended, execution-ready hoặc ownership-confirmed.

## 5. Remaining viable candidates

### Candidate C-01

- Endpoint: `POST /api/register`
- Method: `POST`
- Endpoint Group Candidate: `AUTH_HEAVY` / `TRANSACTIONAL`
- Current Implementation Behavior: Insert `name`, `email`, `password` vào `users`; trả message và ID.
- Authentication: Không có JWT input; account-onboarding logic nhưng không verify credential/token.
- State Mutation: `INSERT users`.
- Input Fields: `name`, `email`, `password`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có nếu dùng unique run-tagged email; source/schema không enforce email uniqueness.
- Reset Requirement: Xóa đúng user fixtures theo run-tagged email/ID; backup và row-count trước/sau.
- Isolation Requirement: Không dùng seeded/admin/real-like accounts; mỗi sample có unique identity.
- Scenario Fit: Spike/Stress có thể đo account creation, nhưng yếu hơn token verification cho `AUTH_HEAVY`.
- Listener Fit: `Response Time Graph` hoặc `Aggregate Report` theo scenario được Human Review.
- Implementation/Documentation Conflict: Password lưu plaintext, trái `SEC-01`; thiếu validation/uniqueness được kỳ vọng cho registration.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Database growth và dữ liệu account không hợp lệ nếu cleanup sai.

### Candidate C-02

- Endpoint: `POST /api/forgot-password`
- Method: `POST`
- Endpoint Group Candidate: `AUTH_HEAVY`
- Current Implementation Behavior: Lookup user theo email, tạo token bốn chữ số và overwrite `users.reset_token`.
- Authentication: Account-recovery/security flow; không verify JWT/password.
- State Mutation: `UPDATE users.reset_token`.
- Input Fields: `email`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có điều kiện; cùng account tiếp tục success nhưng token bị overwrite concurrent.
- Reset Requirement: Restore/null reset token của đúng fixture accounts sau run.
- Isolation Requirement: Dedicated account pool, không chạy song song password-reset thực.
- Scenario Fit: `SPIKE` phù hợp burst recovery request nhưng state races làm interpretation khó hơn C-04.
- Listener Fit: `Response Time Graph`.
- Implementation/Documentation Conflict: Spec gọi OTP/reset token; source chỉ tạo bốn chữ số, không expiry/rate limit và không xử lý lookup error đầy đủ; README yêu cầu tối thiểu sáu chữ số/expiry.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Token overwrite, state contamination và security semantics yếu.

### Candidate C-03

- Endpoint: `POST /api/reset-password`
- Method: `POST`
- Endpoint Group Candidate: `AUTH_HEAVY` / `TRANSACTIONAL`
- Current Implementation Behavior: Update password và clear reset token khi email/token khớp.
- Authentication: One-time account-recovery validation, không JWT.
- State Mutation: `UPDATE users.password/reset_token`.
- Input Fields: `email`, `resetToken`, `newPassword`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Thấp; token bị consume sau một success.
- Reset Requirement: Pre-generate unique valid tokens và restore password/token snapshot.
- Isolation Requirement: Unique account/token per success sample.
- Scenario Fit: Không recommended cho primary Load/Spike/Stress khi chưa có large deterministic fixture pool.
- Listener Fit: Phụ thuộc scenario; không được chọn trong revised matrix.
- Implementation/Documentation Conflict: Password plaintext, missing error handling và token lifecycle yếu.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA` nếu token/account pool không đủ; one-time transition contamination.

### Candidate C-04

- Endpoint: `GET /api/users/me`
- Method: `GET`
- Endpoint Group Candidate: `AUTH_HEAVY`
- Current Implementation Behavior: `authenticateToken` verify JWT, lấy `req.user.id`, query user row và trả JSON.
- Authentication: JWT verification thật trên mỗi request.
- State Mutation: Không.
- Input Fields: `Authorization: Bearer <access_token>`; token claim drive user lookup.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Cao với valid pre-provisioned token/account; source-signed token không có expiry.
- Reset Requirement: Không reset SUT state; revoke/delete only test-token files after run.
- Isolation Requirement: Dedicated test accounts/tokens; không gọi hard-excluded login workflow để lấy token trong measured flow; không lưu token trong audit.
- Scenario Fit: `SPIKE` phù hợp quan sát JWT verification + identity lookup burst và recovery.
- Listener Fit: `Response Time Graph`.
- Implementation/Documentation Conflict: Handler trả toàn bộ user row gồm plaintext password; spec chỉ nói lấy thông tin cá nhân.
- Ownership Status: Hard exclusion `PASS`; cross-member `PASS_BY_STUDENT_CONFIRMATION` cho workflow được chọn.
- Risk: Static token reuse và sensitive CSV; token setup phải được Human Review.

### Candidate C-05

- Endpoint: `PUT /api/users/me`
- Method: `PUT`
- Endpoint Group Candidate: `AUTH_HEAVY` / `TRANSACTIONAL`
- Current Implementation Behavior: Verify JWT rồi update name/address/phone và có thể update role.
- Authentication: JWT verification.
- State Mutation: `UPDATE users`.
- Input Fields: Token, `name`, `shipping_address`, `phone`, optional `role`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có nhưng concurrent writes cùng user tạo last-write-wins contamination.
- Reset Requirement: Restore full user snapshot.
- Isolation Requirement: Dedicated user per thread/VU; exclude `role` from primary data.
- Scenario Fit: Auth/transaction candidate nhưng không recommended do same-record write contention.
- Listener Fit: `Aggregate Report` nếu Stress.
- Implementation/Documentation Conflict: Source cho phép client đổi role, trái spec/README `SEC-06`.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Privilege escalation và nondeterministic final state.

### Candidate C-06

- Endpoint: `POST /api/products`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: Insert product row.
- Authentication: Không có middleware trong source.
- State Mutation: `INSERT products`.
- Input Fields: `name`, `price`, `description`, `imageUrl`, `category_id`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có với unique run-tagged names.
- Reset Requirement: Delete only run-tagged product fixtures and verify row counts.
- Isolation Requirement: Unique name/iteration key; dedicated category fixture.
- Scenario Fit: Stress write candidate, nhưng product management ownership ngoài hard list vẫn chưa rõ.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Spec/README mô tả admin/auth requirement nhưng source không authenticate/authorize.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Unauthenticated writes, DB growth và possible product-workflow overlap chưa được chứng minh.

### Candidate C-07

- Endpoint: `PUT /api/products/:id`
- Method: `PUT`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: Update một product theo ID.
- Authentication: Không có middleware trong source.
- State Mutation: `UPDATE products`.
- Input Fields: `id`, product fields.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có điều kiện; same-row concurrent update gây last-write-wins.
- Reset Requirement: Restore product snapshot.
- Isolation Requirement: Dedicated product per thread/sample.
- Scenario Fit: Stress candidate nhưng fixture need cao.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Missing admin authentication/authorization.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: State contamination và high setup cost.

### Candidate C-08

- Endpoint: `DELETE /api/products/:id`
- Method: `DELETE`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: Delete product theo ID và luôn trả success message nếu SQL không lỗi.
- Authentication: Không có middleware trong source.
- State Mutation: `DELETE products`.
- Input Fields: `id`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Thấp; mỗi fixture chỉ delete meaningful một lần.
- Reset Requirement: Recreate/restore deleted fixtures.
- Isolation Requirement: Unique product per sample.
- Scenario Fit: Không recommended do data exhaustion.
- Listener Fit: `Aggregate Report` nếu Stress.
- Implementation/Documentation Conflict: Missing admin auth; no changes-count validation.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA` ở workload lớn và destructive cleanup complexity.

### Candidate C-09

- Endpoint: `POST /api/admin/import-products`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify, prepare statement, iterate JSON product array và insert rows; response after finalize.
- Authentication: JWT verification, không role check.
- State Mutation: Nhiều `INSERT products`.
- Input Fields: `products[]` với product fields.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có với unique run-tagged batches.
- Reset Requirement: Delete all run-tagged imported products; pre/post counts and backup.
- Isolation Requirement: Unique batch/product names per request.
- Scenario Fit: Stress candidate nhưng batch size làm request-cost không đồng nhất nếu CSV không fixed.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: API says admin; source only verifies token, not role.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Large DB growth, partial batch success and product-workflow overlap uncertainty.

### Candidate C-10

- Endpoint: `GET /api/categories`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY`
- Current Implementation Behavior: Select toàn bộ categories và trả JSON array.
- Authentication: Không.
- State Mutation: Không.
- Input Fields: Không có request-driving field.
- CSV_MODE: `TRACEABILITY_ONLY`
- DATA_DRIVEN_FIT: `RISK`
- Success-path Repeatability: Cao khi category snapshot ổn định.
- Reset Requirement: Không; preflight snapshot.
- Isolation Requirement: Không chạy song song category mutations.
- Scenario Fit: `LOAD` có thể dùng nhưng data-driven fit yếu hơn C-16.
- Listener Fit: `Summary Report`.
- Implementation/Documentation Conflict: Không phát hiện method/route conflict.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Chỉ `3` seeded categories và CSV không drive request.

### Candidate C-11

- Endpoint: `POST /api/categories`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify rồi insert category.
- Authentication: JWT verification, không role check.
- State Mutation: `INSERT categories`.
- Input Fields: `name`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có với unique run-tagged names; schema không unique.
- Reset Requirement: Delete run-tagged categories and verify references/counts.
- Isolation Requirement: Dedicated prefix/iteration key.
- Scenario Fit: Stress write candidate nhưng business semantics đơn giản.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Spec/README expects admin role; source only token-verifies.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Duplicate categories, DB growth, potential references from products.

### Candidate C-12

- Endpoint: `PUT /api/categories/:id`
- Method: `PUT`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify rồi update category name.
- Authentication: JWT verification, không role check.
- State Mutation: `UPDATE categories`.
- Input Fields: `id`, `name`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Có điều kiện; same-row write contamination.
- Reset Requirement: Restore category snapshot.
- Isolation Requirement: Dedicated category per thread/sample.
- Scenario Fit: Stress candidate nhưng fixture pool/reset phức tạp.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Missing admin role authorization.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Last-write-wins và referenced-name side effects.

### Candidate C-13

- Endpoint: `DELETE /api/categories/:id`
- Method: `DELETE`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify rồi delete category.
- Authentication: JWT verification, không role check.
- State Mutation: `DELETE categories`.
- Input Fields: `id`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Thấp; one-time delete.
- Reset Requirement: Recreate/restore fixtures and validate product references.
- Isolation Requirement: Unique unreferenced category per sample.
- Scenario Fit: Không recommended do data exhaustion/destructive behavior.
- Listener Fit: `Aggregate Report` nếu Stress.
- Implementation/Documentation Conflict: Missing admin role authorization; no changes-count validation.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA`, orphan/reference effects.

### Candidate C-14

- Endpoint: `GET /api/orders/my-orders`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY` / `AUTH_HEAVY`
- Current Implementation Behavior: JWT verify, select orders by token user ID ordered descending.
- Authentication: JWT verification.
- State Mutation: Không.
- Input Fields: `access_token` (user ID claim drives query).
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Cao nếu order snapshot ổn định.
- Reset Requirement: Không; snapshot orders and avoid concurrent order mutation.
- Isolation Requirement: Dedicated token/account; no checkout/cart workflow.
- Scenario Fit: Load or Spike; combines auth/read but workload depends on per-user order volume.
- Listener Fit: `Summary Report` hoặc `Response Time Graph`.
- Implementation/Documentation Conflict: Không phát hiện route/auth conflict.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Small/skewed dataset and sensitive token.

### Candidate C-15

- Endpoint: `PUT /api/orders/:id/cancel`
- Method: `PUT`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify, lookup owned order, transition to `canceled` unless already delivered/canceled.
- Authentication: JWT verification.
- State Mutation: One-time `UPDATE orders.status`.
- Input Fields: `id`, `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Thấp; each order only cancels once.
- Reset Requirement: Unique pending/confirmed orders or approved status restore.
- Isolation Requirement: One order per sample, owned by token user.
- Scenario Fit: Transaction semantics strong but not safe enough for primary Stress without very large fixtures.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Source permits shipping cancel, README forbids it; update error handling incomplete.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA`, race on shared order IDs.

### Candidate C-16

- Endpoint: `GET /api/orders/:id`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY`
- Current Implementation Behavior: Parameterized order lookup by path ID; `404` if missing, JSON order if found.
- Authentication: Current source không có `authenticateToken` dù API section nói Cart & Orders cần Authorization.
- State Mutation: Không.
- Input Fields: Path `order_id`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Cao với allowlisted existing IDs và fixed snapshot.
- Reset Requirement: Không; preflight IDs/status and prevent concurrent order mutation.
- Isolation Requirement: Primary CSV chỉ matched IDs; missing IDs tách khỏi measured Load.
- Scenario Fit: `LOAD` phù hợp repeatable request-driven DB read.
- Listener Fit: `Summary Report`.
- Implementation/Documentation Conflict: `IMPLEMENTATION_SPEC_CONFLICT`: current route is unauthenticated; API section documents Authorization requirement.
- Ownership Status: Hard exclusion `PASS`; cross-member `PASS_BY_STUDENT_CONFIRMATION` cho workflow được chọn.
- Risk: Current DB chỉ có `3` orders; latency không đại diện production scale và endpoint exposes any order by ID.

### Candidate C-17

- Endpoint: `GET /api/coupons`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY` / `AUTH_HEAVY`
- Current Implementation Behavior: JWT verify rồi select toàn bộ coupons.
- Authentication: JWT verification; no role check.
- State Mutation: Không.
- Input Fields: `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS` cho auth header, nhưng query payload không thay đổi theo row.
- Success-path Repeatability: Cao với stable coupon snapshot.
- Reset Requirement: Không; avoid concurrent coupon changes.
- Isolation Requirement: Dedicated token.
- Scenario Fit: Load/Spike possible, less query diversity than C-16/C-04.
- Listener Fit: Summary/Response Time Graph.
- Implementation/Documentation Conflict: Spec calls it admin; source checks token only, not role.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Tiny dataset and weak data variation.

### Candidate C-18

- Endpoint: `POST /api/apply-coupon`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL` with semantics risk.
- Current Implementation Behavior: Read coupon + usage count and calculate discount; no usage write.
- Authentication: Current source none; supporting README expects authenticated coupon use.
- State Mutation: Không.
- Input Fields: `code`, `total_amount`, `user_id`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: High with valid coupon/quota precheck; controlled run exists.
- Reset Requirement: Apply-only no reset; quota preflight mandatory.
- Isolation Requirement: Do not mix `/api/coupon-usage` or checkout side effects.
- Scenario Fit: Stress read/business-rule workload, not strong state-changing transaction.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: auth discrepancy, `>` versus `>=`, discount calculation risk.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `TRANSACTIONAL_SEMANTICS_RISK: YES`; do not auto-promote controlled metrics.

### Candidate C-19

- Endpoint: `POST /api/coupon-usage`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify then insert coupon/user usage row.
- Authentication: JWT verification.
- State Mutation: `INSERT coupon_usage`.
- Input Fields: `coupon_id`, `access_token` (user ID claim).
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Technically high because schema has no uniqueness/quota constraint.
- Reset Requirement: Delete only test coupon/user usage rows or restore snapshot.
- Isolation Requirement: Dedicated coupon/user not used by apply-coupon/checkout flows.
- Scenario Fit: Stress write path possible, but business validity weak.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Route absent from API spec; source does not validate coupon/quota.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Duplicate invalid usage and contamination of coupon quota.

### Candidate C-20

- Endpoint: `POST /api/admin/coupons`
- Method: `POST`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify then insert coupon with unique code and business fields.
- Authentication: JWT verification; no admin-role enforcement.
- State Mutation: `INSERT coupons`.
- Input Fields: `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`, `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: High with unique run-tagged code per sample.
- Reset Requirement: Delete only coupons matching approved run prefix after verifying no usage references; backup and pre/post row counts.
- Isolation Requirement: Dedicated admin test token; unique `${run_tag}-${iteration_key}` code; never reuse production-like code.
- Scenario Fit: `STRESS` phù hợp for staged authenticated DB inserts and uniqueness behavior.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: API/README require admin; source only token-verifies. Source has limited field validation.
- Ownership Status: Hard exclusion `PASS`; cross-member `PASS_BY_STUDENT_CONFIRMATION` cho workflow được chọn.
- Risk: DB growth, unique-code exhaustion/collision and missing role authorization; execution requires approved cleanup/data sizing.

### Candidate C-21

- Endpoint: `DELETE /api/admin/coupons/:id`
- Method: `DELETE`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify then delete coupon by ID.
- Authentication: JWT verification; no admin-role enforcement.
- State Mutation: `DELETE coupons`.
- Input Fields: `id`, `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Low; one-time delete.
- Reset Requirement: Recreate coupon fixtures and validate usage references.
- Isolation Requirement: Unique unused coupon per sample.
- Scenario Fit: Not recommended due destructive data exhaustion.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Missing role check; no changes-count validation.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA` and coupon-state contamination.

### Candidate C-22

- Endpoint: `GET /api/admin/users`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY` / `AUTH_HEAVY`
- Current Implementation Behavior: JWT verify then select user fields for all users.
- Authentication: JWT verification; no admin role check.
- State Mutation: Không.
- Input Fields: `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS` for auth header, weak query variation.
- Success-path Repeatability: High with stable users table.
- Reset Requirement: None; avoid concurrent user mutations.
- Isolation Requirement: Dedicated token and protected credential storage.
- Scenario Fit: Load/Spike possible; broader payload than users/me but authz conflict.
- Listener Fit: Summary/Response Time Graph.
- Implementation/Documentation Conflict: API/README require admin; source only token-verifies.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Sensitive user enumeration and tiny dataset.

### Candidate C-23

- Endpoint: `DELETE /api/admin/users/:id`
- Method: `DELETE`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify then delete user by ID.
- Authentication: JWT verification; no admin role check.
- State Mutation: `DELETE users`.
- Input Fields: `id`, `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Low; destructive one-time action.
- Reset Requirement: Recreate full user fixtures and dependent state.
- Isolation Requirement: Unique isolated users only.
- Scenario Fit: Not recommended for performance workload.
- Listener Fit: Aggregate if Stress.
- Implementation/Documentation Conflict: Missing role check and no dependency/cascade handling.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: High data loss/orphan risk; `BLOCKED_BY_DATA` for meaningful load.

### Candidate C-24

- Endpoint: `GET /api/admin/orders`
- Method: `GET`
- Endpoint Group Candidate: `READ_HEAVY` / `AUTH_HEAVY`
- Current Implementation Behavior: JWT verify then `LEFT JOIN` orders/users and sort descending.
- Authentication: JWT verification; no admin role check.
- State Mutation: Không.
- Input Fields: `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS` for auth header, weak query variation.
- Success-path Repeatability: High with stable order/user snapshot.
- Reset Requirement: None; avoid concurrent order/user mutations.
- Isolation Requirement: Dedicated token.
- Scenario Fit: Load read candidate; query heavier than order-by-ID but input diversity lower.
- Listener Fit: `Summary Report`.
- Implementation/Documentation Conflict: Missing admin role authorization.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: Dataset currently tiny and response exposes all orders.

### Candidate C-25

- Endpoint: `PUT /api/admin/orders/:id/status`
- Method: `PUT`
- Endpoint Group Candidate: `TRANSACTIONAL`
- Current Implementation Behavior: JWT verify, read current order status, validate transition and update status.
- Authentication: JWT verification; no admin role check.
- State Mutation: One-time `UPDATE orders.status` transitions.
- Input Fields: `id`, `status`, `access_token`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Success-path Repeatability: Low; each order has limited transition sequence.
- Reset Requirement: Unique order per transition or approved snapshot restore.
- Isolation Requirement: One order per sample/thread and deterministic current state.
- Scenario Fit: Strong business transaction semantics but unsafe for primary Stress without large fixture setup.
- Listener Fit: `Aggregate Report`.
- Implementation/Documentation Conflict: Missing admin role check; source allows `canceled -> delivered`, contrary README final-state rule.
- Ownership Status: Hard exclusion `PASS`; cross-member `NOT_VERIFIABLE`.
- Risk: `BLOCKED_BY_DATA`, transition races and intentional validation errors contaminating metrics.

## 6. Candidate comparison

| Group | Recommended candidate | Strong alternative | Why recommended |
|---|---|---|---|
| `READ_HEAVY` | `GET /api/orders/:id` | `GET /api/orders/my-orders` | Path ID drives request and Assertion; repeatable parameterized read; avoids token as the only varying input. |
| `AUTH_HEAVY` | `GET /api/users/me` | `POST /api/forgot-password` | Performs JWT verification on every request without mutating account state; safer and more deterministic for Spike. |
| `TRANSACTIONAL` | `POST /api/admin/coupons` | `POST /api/categories` | Actual authenticated `INSERT`, unique run-tagged business key, and deterministic cleanup/isolation plan; stronger mutation semantics than apply-coupon. |

Rejected/weak alternatives are not backup recommendations. In particular, none of the five hard-excluded workflows may be restored without a new explicit Human Decision.

## 7. Revised 3x3 matrix proposal

| Group | Endpoint | Scenario | Listener | CSV | Data-driven Fit | State Mutation | Ownership | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `READ_HEAVY` | `GET /api/orders/:id` | `LOAD` | `Summary Report` | `test-data/read-heavy-orders.csv` | `PASS` | Không | `PASS_BY_STUDENT_CONFIRMATION` | `APPROVED_WITH_PREFLIGHT` |
| `AUTH_HEAVY` | `GET /api/users/me` | `SPIKE` | `Response Time Graph` | `test-data/auth-heavy-users-me.csv` | `PASS` | Không | `PASS_BY_STUDENT_CONFIRMATION` | `APPROVED_WITH_TOKEN_SAFETY` |
| `TRANSACTIONAL` | `POST /api/admin/coupons` | `STRESS` | `Aggregate Report` | `test-data/transactional-admin-coupons.csv` | `PASS` | `INSERT coupons` | `PASS_BY_STUDENT_CONFIRMATION` | `APPROVED_WITH_RESET` |

- Group Uniqueness: `PASS`.
- Scenario Uniqueness: `PASS`.
- Listener Uniqueness: `PASS`.
- CSV Uniqueness: `PASS`.
- HARD_EXCLUSION_CHECK: `PASS`.
- CROSS_MEMBER_OWNERSHIP: `PASS_BY_STUDENT_CONFIRMATION`.
- Production approval: `MODIFIED_AND_APPROVED`.

## 8. Scenario và Listener strategy

| Scenario | Group / Endpoint | Listener | Rationale |
|---|---|---|---|
| `LOAD` | `READ_HEAVY` / `GET /api/orders/:id` | `Summary Report` | Sustained repeatable reads; summary metrics for normal-load baseline/target. |
| `SPIKE` | `AUTH_HEAVY` / `GET /api/users/me` | `Response Time Graph` | Visualize JWT verification/identity lookup response-time change across baseline, burst, hold and recovery. |
| `STRESS` | `TRANSACTIONAL` / `POST /api/admin/coupons` | `Aggregate Report` | Aggregate response/error/percentile/Throughput across staged authenticated inserts. |

Ba Listener là distinct built-in JMeter types đã có trong JMeter `5.6.3`. Không dùng `View Results Tree` trong production Spike execution plan.

## 9. CSV strategy

### READ_HEAVY

- CSV: `test-data/read-heavy-orders.csv`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Request-driving fields: `order_id`
- Assertion-driving fields: `expected_user_id`, `expected_status`
- Trace-only fields: `order_case`, `iteration_key`
- Setup: chỉ matched existing order IDs approved after read-only preflight; missing IDs tách khỏi primary Load.

### AUTH_HEAVY

- CSV: `test-data/auth-heavy-users-me.csv`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Request-driving fields: `access_token`
- Assertion-driving fields: `expected_user_id`, `expected_email`
- Trace-only fields: `account_case`, `iteration_key`
- Setup: provision tokens outside measured flow without invoking hard-excluded login workflow; store securely and never copy token values into audit/report.

### TRANSACTIONAL

- CSV: `test-data/transactional-admin-coupons.csv`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Request-driving fields: `access_token`, `code_prefix`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`
- Generated-per-iteration request field: final `code = code_prefix + run_tag + iteration_key`; exact generator mapping requires design Human Review.
- Trace-only fields: `coupon_case`, `iteration_key`, `run_tag`
- Reset: delete only run-tagged coupons after checking `coupon_usage` references; backup/hash and row-count before/after.

Không tạo actual CSV hoặc rows trong matrix phase.

## 10. Apply-coupon trade-off

- Endpoint: `POST /api/apply-coupon`
- Current Classification: `CONTROLLED_INTEGRATION_EVIDENCE`
- Existing design/JMX/CSV/JTL/HTML/resource evidence/Human Reviews: `PRESERVED`
- Current source state mutation: `NO`
- TRANSACTIONAL_SEMANTICS_RISK: `YES`
- APPLY_COUPON_FINAL_RECOMMENDATION: `KEEP_CONTROLLED_ONLY`
- Reason: C-20 provides an actual repeatable DB mutation with reset/isolation. Therefore apply-coupon does not need automatic promotion despite its reusable controlled infrastructure evidence.
- Existing Stress Evidence Reusable: `PARTIAL`
- Reusable: JMeter environment, Custom Thread Groups dependency, evidence capture, resource monitoring, directory convention and review workflow.
- Not reusable as final metrics: apply-coupon response times, p95, Throughput, error behavior or capacity inference cannot represent admin-coupon creation.

## 11. Risks and open decisions

- `CROSS_MEMBER_OWNERSHIP: PASS_BY_STUDENT_CONFIRMATION` cho đúng ba workflow được chọn; đây là Human confirmation, không phải repository-derived evidence.
- `GET /api/orders/:id` current source lacks auth despite API section expectation; design must classify the conflict and test current behavior unless Student changes SUT scope.
- Current database has only three orders; Load usefulness may require approved deterministic data setup, but no data may be created at matrix phase.
- `GET /api/users/me` CSV contains sensitive tokens; audit/output must never include token values.
- `POST /api/admin/coupons` lacks role authorization and validation; Stress data sizing/cleanup must be approved before JMX or execution.
- Unique coupon data may exhaust or grow DB; design must estimate required rows from workload or use deterministic per-iteration code generation with bounded cleanup.
- No SLA/traffic baseline exists; scenario workload parameters remain future design decisions.

## 12. Human Review

Status: `REVIEWED`

Student Decision: `MODIFIED_AND_APPROVED`

Cross-member Ownership: `PASS_BY_STUDENT_CONFIRMATION`

Student Notes:

- `GET /api/users/me` được chấp nhận là `AUTH_HEAVY` vì workload thực hiện authenticated request processing, JWT verification và user identity lookup.
- Không tuyên bố `GET /api/users/me` thực hiện login credential validation, password hashing hoặc account lockout.
- `POST /api/admin/coupons` được chấp nhận là endpoint `TRANSACTIONAL` thay đổi state mạnh hơn.
- Future Stress design của `POST /api/admin/coupons` bắt buộc có isolated database execution, unique coupon codes, deterministic pre-state, explicit cleanup/restore và protection against dataset exhaustion/duplicate-code failures.
- Giữ nguyên implementation/documentation discrepancy về server-side admin-role authorization; không sửa SUT hoặc test plan âm thầm để che discrepancy.
- `POST /api/apply-coupon` tiếp tục là `CONTROLLED_INTEGRATION_TEST_ONLY`.

CHECKPOINT RESOLUTION: `PRODUCTION_MATRIX_APPROVED`

Next allowed action: invoke `$perf-scenario-designer` cho `READ_HEAVY / LOAD / GET /api/orders/:id`. Không tạo JMX/CSV/JTL và không chạy JMeter tại matrix phase.
