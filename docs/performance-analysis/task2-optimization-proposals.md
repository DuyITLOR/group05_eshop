# Đề xuất tối ưu hóa Task 2 — HW05

## 1. Phạm vi và boundary

Artifact này là `AI_OPTIMIZATION_PROPOSAL`, dựa trên Human-reviewed JTL analysis và source hiện hành. Đây không phải implementation, feasibility decision cuối của Student, performance rerun, hay Task 3.

Baseline đã được Human Review chấp nhận:

| Scenario | Endpoint                  | Samples | Success / Failed |  p95 |   p99 |    Throughput |
| -------- | ------------------------- | ------: | ---------------: | ---: | ----: | ------------: |
| `LOAD`   | `GET /api/orders/:id`     |    1250 |         1250 / 0 | 2 ms |  3 ms |  10.58685 RPS |
| `SPIKE`  | `GET /api/users/me`       |    2123 |         2123 / 0 | 4 ms |  6 ms | 32.025463 RPS |
| `STRESS` | `POST /api/admin/coupons` |    1687 |         1687 / 0 | 8 ms | 16 ms | 11.865158 RPS |

`0%` error rate không chứng minh capacity, SLA, production readiness, business correctness hoặc future zero-error behavior. Với `STRESS`, giữ nguyên `STATE_GROWTH_CONFOUND: DOCUMENTED` và `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`.

## 2. Optimization Matrix

| ID               | Scenario | Endpoint                  | Proposal                                                                                                       | Proposal Type   | Evidence Level | Evidence                                                                                                                        | Expected Mechanism                                                             | Potential Benefit                                                     | Trade-Off                                                      | Risk                                                        | Hallucination Risk | AI Preliminary Feasibility | Priority | Validation Method                                                                                                           | Student Decision                    | Student Notes                                                                   |
| ---------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- | ------------------ | -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- |
| `OPT-LOAD-001`   | `LOAD`   | `GET /api/orders/:id`     | `NO_CHANGE_RECOMMENDED` cho performance path hiện tại                                                          | `PERFORMANCE`   | `DIRECT`       | p95 `2 ms`; query theo primary key ở `backend/server.js:344-348`, `orders.id` là primary key                                    | Không thêm lớp xử lý mới khi chưa có symptom                                   | Tránh tối ưu sớm                                                      | Không xử lý auth/owner discrepancy                             | Có thể bỏ sót issue ở workload khác                         | `LOW`              | `LIKELY_NOT_WORTH_IT`      | `P3`     | Chỉ rerun cùng profile nếu source/runtime thay đổi                                                                          | `ACCEPTED_NO_CHANGE_RECOMMENDATION` | Student `DIRECT`; không có measured performance problem trong profile này       |
| `OPT-LOAD-002`   | `LOAD`   | `GET /api/orders/:id`     | Bổ sung authentication, owner scoping và response projection trước khi dùng endpoint này như private order API | `MULTI_PURPOSE` | `DIRECT`       | Route hiện `db.get(... WHERE id = ?)` không dùng `authenticateToken` hay `user_id`; schema có `orders.user_id`                  | Chặn đọc order ngoài quyền và giảm payload về fields cần thiết                 | Security/correctness; payload benefit chưa đo                         | Làm thay đổi contract và cần design/JMX/assertion review lại   | Regression auth/client compatibility                        | `LOW`              | `LIKELY_FEASIBLE`          | `P0`     | Unit/API authorization cases, rồi rerun LOAD cùng workload sau khi plan mới được approve                                    | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; security/correctness feasible, performance benefit unproven |
| `OPT-SPIKE-001`  | `SPIKE`  | `GET /api/users/me`       | Thay `SELECT *` bằng explicit public-profile projection                                                        | `SECURITY`      | `DIRECT`       | `backend/server.js:112-115` trả toàn bộ `users` row; schema chứa `password`, `reset_token`, `phone`, `shipping_address`         | Loại bỏ sensitive fields khỏi API response                                     | Security/data minimization; payload effect `UNQUANTIFIED_UNTIL_RERUN` | Client cần dùng contract profile rõ ràng                       | Regression nếu client đang phụ thuộc field không nên public | `LOW`              | `LIKELY_FEASIBLE`          | `P0`     | Contract tests không có sensitive field; rerun same SPIKE profile riêng nếu cần đo payload/latency                          | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; security justified, performance benefit unproven            |
| `OPT-SPIKE-002`  | `SPIKE`  | `GET /api/users/me`       | Xử lý DB error và absent user rõ ràng, ghi observability tối thiểu không chứa secret                           | `CORRECTNESS`   | `DIRECT`       | Callback `/api/users/me` bỏ qua `err` và luôn `res.json(user)`                                                                  | Phân biệt 5xx/404 thay vì trả response mơ hồ                                   | Correctness và khả năng chẩn đoán; không có performance benefit đã đo | Thêm response branch và test cases                             | Có thể thay đổi status observed bởi client                  | `LOW`              | `LIKELY_FEASIBLE`          | `P1`     | API tests cho DB error/not-found boundary; không đổi workload khi đo trước/sau                                              | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; correctness/observability, performance relevance `NONE`     |
| `OPT-SPIKE-004`  | `SPIKE`  | `GET /api/users/me`       | Externalize và rotate JWT signing secret                                                                       | `SECURITY`      | `DIRECT`       | `backend/server.js:9` hard-code `SECRET_KEY`; middleware `jwt.verify` dùng cùng key                                             | Tách secret khỏi source và cho phép rotation                                   | Security/operability; không có performance effect đã đo               | Cần secret provisioning/rotation procedure                     | Configuration error có thể invalid token                    | `LOW`              | `LIKELY_FEASIBLE`          | `P0`     | Startup fail-closed test, valid/invalid token tests và secret scan; không cần performance rerun để xác nhận security change | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; security/operability, performance relevance `NONE`          |
| `OPT-SPIKE-003`  | `SPIKE`  | `GET /api/users/me`       | Bổ sung stage-tolerance/coverage report vào post-run analysis, không đổi request path                          | `TEST_DESIGN`   | `DIRECT`       | Stage mapping chỉ bao phủ `2078/2123` (`97.880358%`); `45` samples unmapped vẫn ở overall                                       | Buộc report nêu coverage và cấm suy diễn fully recovered khi chưa có tolerance | Diễn giải repeatable hơn                                              | Không trực tiếp giảm latency                                   | Dễ bị nhầm là product optimization                          | `LOW`              | `LIKELY_FEASIBLE`          | `P2`     | Re-run cùng approved SPIKE profile khi được authorize; so sánh cùng stage map/tolerance                                     | `ACCEPTED_WITH_BOUNDARY`            | Student `DIRECT`; test-design value direct, performance relevance `NONE`        |
| `OPT-STRESS-001` | `STRESS` | `POST /api/admin/coupons` | Enforce server-side `admin` role trước INSERT                                                                  | `SECURITY`      | `DIRECT`       | Route chỉ dùng `authenticateToken` tại `backend/server.js:457`; token chứa `role` từ middleware nhưng route không kiểm tra role | Reject non-admin trước write path                                              | Security/correctness; không claim latency improvement                 | Cần admin/non-admin API tests và token policy rõ               | Có thể phá các client đang gọi sai quyền                    | `LOW`              | `LIKELY_FEASIBLE`          | `P0`     | Authorization tests, then review/approve a revised plan before any comparable STRESS rerun                                  | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; security/correctness feasible, performance benefit unproven |
| `OPT-STRESS-002` | `STRESS` | `POST /api/admin/coupons` | Validate required fields/domain và map unique-code violation thành controlled response                         | `CORRECTNESS`   | `DIRECT`       | INSERT dùng request fields trực tiếp; validation chỉ dựa vào DB error; `coupons.code` là `UNIQUE`                               | Fail fast với input invalid/duplicate, tạo response semantics ổn định          | Correctness/observability; không có performance gain đã chứng minh    | Cần quyết định validation rules/response contract              | Có thể thay đổi client-visible errors                       | `LOW`              | `LIKELY_FEASIBLE`          | `P1`     | API boundary tests; separate before/after STRESS rerun chỉ khi plan/data được review lại                                    | `ACCEPTED_WITH_BOUNDARY`            | Student `INDIRECT`; correctness feasible, performance relevance `NONE`          |
| `OPT-STRESS-003` | `STRESS` | `POST /api/admin/coupons` | Điều tra index ghép `coupon_usage(coupon_id, user_id)` trước khi quyết định thêm index                         | `PERFORMANCE`   | `INDIRECT`     | Schema không định nghĩa index ghép; current code có quota lookup theo cả `coupon_id` và `user_id` ở `backend/server.js:387-395` | Có thể giảm lookup cost khi bảng usage tăng                                    | Benefit chỉ khả dĩ khi data volume/plan cho thấy need                 | Index làm tăng write cost và reset database có thể che nhu cầu | Thêm index không cần thiết ở dataset hiện tại               | `MEDIUM`           | `NEEDS_INVESTIGATION`      | `P2`     | `EXPLAIN QUERY PLAN` với representative usage volume, sau đó rerun identical STRESS profile và compare p95/error/resource   | `DEFERRED_PENDING_EVIDENCE`         | Student `HYPOTHESIS`; quota query không thuộc measured STRESS endpoint          |

Các category có thể overlap; matrix không coi security/correctness change là performance improvement đã được chứng minh.

## 3. Detailed Candidates

### OPT-LOAD-001 — Không tối ưu sớm query order detail

Scenario: `LOAD`  
Endpoint: `GET /api/orders/:id`

Current Source Behavior: `backend/server.js:344-348` thực hiện một `db.get` theo `orders.id`; `backend/database.js:74-81` định nghĩa `id INTEGER PRIMARY KEY`.

Relevant Performance Evidence: 1250 samples, p95 `2 ms`, p99 `3 ms`, error rate `0%`, throughput `10.58685 RPS` trong đúng approved workload.

Proposal: `NO_CHANGE_RECOMMENDED` cho performance path hiện tại.

Proposal Type: `PERFORMANCE`  
Evidence Level: `DIRECT`

Reasoning: Không có measured symptom hoặc source hot path phức tạp đủ để biện minh cache, index bổ sung, queue hoặc infrastructure change.

Expected Mechanism: Không thêm mechanism mới.  
Expected Effect: `NOT_APPLICABLE`; không claim giảm p95.  
Trade-Offs: Không giải quyết security/correctness discrepancy.  
Implementation Complexity: `NONE`  
Regression Risk: `LOW`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_NOT_WORTH_IT`

Validation Plan: Chỉ dùng rerun cùng profile nếu source/runtime có thay đổi material; không thay đổi workload trong phép so sánh.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-LOAD-002 — Đưa order detail về private-resource contract

Scenario: `LOAD`  
Endpoint: `GET /api/orders/:id`

Current Source Behavior: Route không có `authenticateToken`; query chỉ lọc `id` và trả full order row. Schema có `orders.user_id`, nên owner scoping là source-supported capability chưa được dùng.

Relevant Performance Evidence: LOAD metrics thấp, nhưng Human Review giữ implementation/spec auth-owner discrepancy; evidence không đo ảnh hưởng của security change.

Proposal: Authentication, query condition `id + user_id` và response projection tối thiểu cho contract private order.

Proposal Type: `MULTI_PURPOSE`  
Evidence Level: `DIRECT`

Reasoning: Đây là security/correctness remediation, không phải cách chứng minh performance nhanh hơn.

Expected Mechanism: Kiểm tra token/ownership trước response và chỉ serialize fields cần thiết.  
Expected Effect: `UNQUANTIFIED_UNTIL_RERUN`  
Trade-Offs: Contract, JMX và assertions hiện tại có thể phải review lại.  
Implementation Complexity: `MEDIUM`  
Regression Risk: `MEDIUM`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: API authorization contract tests; nếu source change được Student approve, tạo/review plan mới rồi mới rerun LOAD cùng workload tương đương.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-SPIKE-001 — Project explicit user profile fields

Scenario: `SPIKE`  
Endpoint: `GET /api/users/me`

Current Source Behavior: `/api/users/me` chạy `SELECT * FROM users WHERE id = ?` và `res.json(user)`; schema users chứa `password`, `reset_token`, `phone`, `shipping_address`.

Relevant Performance Evidence: SPIKE p95 `4 ms`, p99 `6 ms`, `0%` JTL error; Human Review không cho diễn giải thành auth/business correctness.

Proposal: Chọn explicit safe profile fields, ví dụ `id`, `name`, `email`, `role` nếu contract cần role; loại sensitive fields.

Proposal Type: `SECURITY`  
Evidence Level: `DIRECT`

Reasoning: Source trực tiếp chứng minh sensitive-data exposure risk. Payload reduction là secondary mechanism, không được gọi là measured latency optimization.

Expected Mechanism: Giảm data serialized/returned và thu hẹp API exposure.  
Expected Effect: `UNQUANTIFIED_UNTIL_RERUN`  
Trade-Offs: Cần explicit API contract.  
Implementation Complexity: `LOW`  
Regression Risk: `MEDIUM`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: Contract tests xác nhận absent sensitive fields; chỉ rerun exact SPIKE profile sau khi plan/assertion được review.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-SPIKE-002 — Handle profile lookup errors explicitly

Scenario: `SPIKE`  
Endpoint: `GET /api/users/me`

Current Source Behavior: Callback của user lookup bỏ qua `err` và không xử lý explicit `user` absent.

Relevant Performance Evidence: 2123 successful raw samples không chứng minh các DB error/not-found branch.

Proposal: Trả controlled `500` cho DB error, `404` hoặc contract-specific response khi user absent, và log safe correlation metadata không có token/sensitive field.

Proposal Type: `CORRECTNESS`  
Evidence Level: `DIRECT`

Reasoning: Đảm bảo response semantics quan sát được và phân biệt operational fault; không đề xuất latency improvement.

Expected Mechanism: Error branches rõ ràng và diagnosable.  
Expected Effect: `NOT_APPLICABLE` cho latency hiện tại.  
Trade-Offs: Client có thể phải handle status mới.  
Implementation Complexity: `LOW`  
Regression Risk: `LOW`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: API tests cho error/not-found branch; telemetry review không chứa JWT hoặc password.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-SPIKE-004 — Externalize JWT signing secret

Scenario: `SPIKE`  
Endpoint: `GET /api/users/me`

Current Source Behavior: `backend/server.js:9` hard-code `SECRET_KEY`; login signing và `authenticateToken` verification dùng key này.

Relevant Performance Evidence: SPIKE metrics không đo secret management. Candidate này là security/operability work, không phải measured performance remediation.

Proposal: Đọc signing secret từ protected runtime configuration, fail closed khi absent, và đặt rotation procedure có kiểm soát.

Proposal Type: `SECURITY`  
Evidence Level: `DIRECT`

Reasoning: Secret có trong source là direct security risk; không cần giả định cache, identity provider hay external service.

Expected Mechanism: Tách secret khỏi repository và cho phép đổi key có kế hoạch.  
Expected Effect: `NOT_APPLICABLE` cho latency hiện tại.  
Trade-Offs: Cần quản lý configuration và token invalidation/rotation.  
Implementation Complexity: `LOW_TO_MEDIUM`  
Regression Risk: `MEDIUM`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: Startup fail-closed test, valid/invalid token tests, secret scan; không đưa actual secret vào artifact hay audit.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-SPIKE-003 — Chuẩn hóa stage-coverage/tolerance reporting

Scenario: `SPIKE`  
Endpoint: `GET /api/users/me`

Current Source Behavior: Không cần source change; proposal thuộc post-run analysis/reporting.

Relevant Performance Evidence: Stage map coverage `97.880358%`; 45 samples unmapped vẫn được tính overall. Human Review cấm kết luận fully recovered nếu không có tolerance.

Proposal: Ghi coverage, unmapped count, tolerance policy và `NOT_COMPARABLE` khi tolerance chưa được Student duyệt.

Proposal Type: `TEST_DESIGN`  
Evidence Level: `DIRECT`

Reasoning: Tăng reproducibility của interpretation thay vì cố làm endpoint “nhanh hơn”.

Expected Mechanism: Ngăn stage-result overclaim.  
Expected Effect: `NOT_APPLICABLE` cho response time.  
Trade-Offs: Report phức tạp hơn.  
Implementation Complexity: `LOW`  
Regression Risk: `LOW`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: Lần phân tích tiếp theo phải preserve all overall samples và report coverage/tolerance trước recovery wording.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-STRESS-001 — Enforce admin authorization for coupon creation

Scenario: `STRESS`  
Endpoint: `POST /api/admin/coupons`

Current Source Behavior: Route dùng `authenticateToken` nhưng không check `req.user.role`; JWT payload có `role` từ login middleware.

Relevant Performance Evidence: STRESS p95 `8 ms`, p99 `16 ms`, `0%` JTL error. Human Review giữ server-side admin authorization là chưa implement.

Proposal: Require `req.user.role === 'admin'` trước INSERT và define 403 contract.

Proposal Type: `SECURITY`  
Evidence Level: `DIRECT`

Reasoning: Đây là correctness/security gap trực tiếp, không phải symptom của p95 hay bằng chứng write performance.

Expected Mechanism: Chặn unauthorized writes trước database action.  
Expected Effect: `UNQUANTIFIED_UNTIL_RERUN` cho performance; security effect là mục tiêu chính.  
Trade-Offs: Non-admin traffic hiện tại sẽ nhận 403.  
Implementation Complexity: `LOW`  
Regression Risk: `MEDIUM`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: Admin/non-admin authorization tests; sửa/review JMX only if test identity/contract changes, sau đó rerun same STRESS profile riêng biệt.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-STRESS-002 — Validate coupon creation input and duplicate semantics

Scenario: `STRESS`  
Endpoint: `POST /api/admin/coupons`

Current Source Behavior: INSERT nhận direct fields từ request; `coupons.code` là unique nhưng route chỉ biến DB error thành generic `500`.

Relevant Performance Evidence: JTL success không cover malformed body/duplicate code branches. `STATE_GROWTH_CONFOUND` vẫn phải giữ.

Proposal: Validate `code`, `type`, numeric amounts, expiry và max-use domain trước write; convert duplicate-code violation thành controlled client error.

Proposal Type: `CORRECTNESS`  
Evidence Level: `DIRECT`

Reasoning: Làm behavior ổn định và observable; không gọi validation là measured latency fix.

Expected Mechanism: Fail fast cho invalid input và cung cấp error semantics nhất quán.  
Expected Effect: `UNQUANTIFIED_UNTIL_RERUN`  
Trade-Offs: Cần contract/error-message decisions.  
Implementation Complexity: `MEDIUM`  
Regression Risk: `MEDIUM`  
Hallucination Risk: `LOW`  
AI Preliminary Feasibility: `LIKELY_FEASIBLE`

Validation Plan: API validation/duplicate tests; baseline-vs-after STRESS rerun chỉ khi data/JMX mới được review và workload giữ đồng nhất.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

### OPT-STRESS-003 — Investigate coupon usage composite index

Scenario: `STRESS`  
Endpoint: `POST /api/admin/coupons`

Current Source Behavior: `coupon_usage` không khai báo index ghép; API apply-coupon chạy quota lookup `WHERE coupon_id = ? AND user_id = ?`. Đây là related coupon read path, không phải INSERT path của production STRESS endpoint.

Relevant Performance Evidence: STRESS endpoint measured là `/api/admin/coupons`, không gọi quota lookup. Do đó raw STRESS không trực tiếp chứng minh index này cần thiết.

Proposal: Trước khi thêm index, dùng representative data và `EXPLAIN QUERY PLAN` cho quota lookup; chỉ cân nhắc index `coupon_usage(coupon_id, user_id)` khi evidence chỉ ra full scan/latency concern ở endpoint thực sự dùng query đó.

Proposal Type: `PERFORMANCE`  
Evidence Level: `INDIRECT`

Reasoning: Query shape source-backed nhưng performance need chưa được đo trong scenario production hiện tại. Đây không phải claim SQLite contention/bottleneck.

Expected Mechanism: Có thể giảm lookup cost khi coupon usage growth lớn.  
Expected Effect: `UNQUANTIFIED_UNTIL_RERUN`  
Trade-Offs: Write overhead và schema migration.  
Implementation Complexity: `LOW`  
Regression Risk: `LOW`  
Hallucination Risk: `MEDIUM`  
AI Preliminary Feasibility: `NEEDS_INVESTIGATION`

Validation Plan: Inspect query plan with representative volume; isolate index-only change; then compare a relevant approved coupon-usage workload. Không dùng STRESS admin-coupon result để claim benefit.

Student Review: `FINALIZED`; xem `docs/performance-analysis/task2-optimization-human-review.md`.

## 4. Explicit Non-Candidates

- `Redis`, read replicas, horizontal scaling, sharding, message queue, WAL-mode tuning và database replacement: `NOT_PROPOSED`. Repository/evidence không chứng minh architecture hoặc symptom cần các thay đổi này.
- SQLite/write contention: `UNVERIFIED`; không phải optimization premise.
- Numeric performance improvement: `NOT_CLAIMED`; mọi effect performance là `UNQUANTIFIED_UNTIL_RERUN` khi applicable.

## 5. Human Review Checkpoint

Review Status: `FINALIZED`  
Student Decision: `MODIFIED_AND_APPROVED`  
Approval Scope: `TASK2_AI_OPTIMIZATION_PROPOSALS`  
Optimization Proposal Status: `AI_GENERATED_AND_HUMAN_REVIEWED`  
Feasibility Classification: `COMPLETE`  
Hallucination Review: `COMPLETE`  
Implementation: `NOT_REQUIRED_FOR_CURRENT_TASK2_REVIEW`  
Performance Rerun: `NOT_AUTHORIZED`

CHECKPOINT: `TASK2_COMPLETE_TASK3_READY`

Student Review Artifact: `docs/performance-analysis/task2-optimization-human-review.md`
