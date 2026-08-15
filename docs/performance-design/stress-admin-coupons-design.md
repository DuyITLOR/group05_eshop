# Thiết kế Kịch bản Hiệu năng (Performance Scenario Design)

## 1. Thông tin chung

- Endpoint: `POST /api/admin/coupons`
- HTTP method: `POST`
- Endpoint group: `TRANSACTIONAL`
- Scenario: `STRESS`
- Design status: `NEEDS_DATA_SETUP`
- PROFILE_SOURCE: `AI_PROPOSED`
- Primary Listener: `Aggregate Report`
- Phạm vi bằng chứng đã đọc: `backend/server.js`, `backend/database.js`, `api_specification.md`, `README.md`, `docs/performance-design/hw05-production-matrix-proposal.md`, các production design `READ_HEAVY / LOAD` và `AUTH_HEAVY / SPIKE`, cùng hardware context của `AUTH_HEAVY / SPIKE run-003`.
- Boundary: Đây là design-only artifact. Final CSV, JMX, JTL, HTML report và real execution đều `NOT_CREATED` / `NOT_RUN`.

## 2. Phân tích endpoint

| Hạng mục | Phân tích |
|---|---|
| Route / method | `POST /api/admin/coupons` được khai báo tại `backend/server.js:457-480`. |
| Authentication | Route gọi `authenticateToken`; thiếu Authorization header trả `401`, token JWT không hợp lệ trả `403` (`backend/server.js:100-109`). |
| Authorization | Handler không đọc `req.user.role`, nên source hiện chỉ xác thực JWT, không enforce admin role. |
| Request body | Handler nhận `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`. `max_uses_per_user || 1` là default ở handler (`backend/server.js:457-475`). |
| Response expectation | Insert thành công trả HTTP `200` mặc định với JSON `{ message: "Coupon created", id: this.lastID }`; database error trả HTTP `500` và `{ error: err.message }` (`backend/server.js:476-479`). |
| Read/write và database | Handler thực hiện `INSERT INTO coupons (...)`; đây là persistent write (`backend/server.js:466-475`). |
| State mutation | Mỗi request thành công tạo một coupon row. `coupons.code` có SQLite `UNIQUE` constraint (`backend/database.js:29-38`). |
| Business constraints | API specification ghi body đầy đủ cho create coupon (`api_specification.md:201-213`). README FR-17 yêu cầu code unique, type `percent/fixed`, discount dương, expiration, `min_order_amount >= 0`, `max_uses_per_user >= 1` (`README.md:213-217`). |
| Test-data dependency | Cần body hợp lệ theo documented contract, token external và code duy nhất cho từng sample. Không cần pool hàng nghìn code CSV nếu JMeter tạo deterministic suffix theo VU/iteration. |
| Concurrent-request risk | Code trùng sẽ thành database error; concurrent successful writes làm database tăng dần. SQLite được xác nhận là database driver (`backend/database.js:1-9`), nhưng write contention thực tế chưa được đo. |

### IMPLEMENTATION_SPEC_CONFLICT - ADMIN_ROLE_AUTHORIZATION

- Intended test configuration: dùng token của seeded admin identity trong disposable runtime để phù hợp ý nghĩa endpoint admin.
- Current Implementation: `authenticateToken` chỉ verify JWT và gán `req.user`; handler `POST /api/admin/coupons` không kiểm tra `req.user.role` (`backend/server.js:100-109`, `457-480`).
- Documented Contract: API specification nói mọi `/api/admin/*` cần Admin (`api_specification.md:171-174`); README FR-12 yêu cầu valid JWT và `role = 'admin'` (`README.md:174-179`).
- Impact: Stress run chỉ có thể khẳng định current implementation xử lý authenticated coupon insert; không được diễn giải là chứng minh owner/admin authorization coverage.
- Required Resolution: Student giữ scope current implementation hoặc sửa SUT trong một change được phê duyệt riêng; design này không sửa source.

### IMPLEMENTATION_SPEC_CONFLICT - BUSINESS_VALIDATION

- Current Implementation: handler không validate `type`, positivity, expiration, minimum amount hoặc `max_uses_per_user`; các giá trị được bind thẳng vào SQLite. Schema chỉ có `UNIQUE` cho `code` và các defaults (`backend/server.js:457-475`, `backend/database.js:29-38`).
- Documented Contract: README FR-17 yêu cầu các business constraints nêu trên (`README.md:213-217`).
- Impact: Primary Stress dataset chủ động chỉ dùng source-backed/documented-valid shapes; HTTP `200` không tự chứng minh toàn bộ business validation đã được enforce.
- Required Resolution: Student cần review shape/values của CSV trước builder; không mix invalid cases vào measured traffic.

## 3. Facts

- `FACT`: endpoint là authenticated write path với `INSERT INTO coupons`, vì vậy phù hợp `TRANSACTIONAL` hơn `POST /api/apply-coupon`, endpoint controlled-only không ghi coupon usage (`backend/server.js:457-480`; matrix Candidate C-20).
- `FACT`: `code` được unique ở database; duplicate code sẽ vào nhánh database error HTTP `500` của handler, không phải success sample (`backend/database.js:29-38`, `backend/server.js:476-479`).
- `FACT`: module database gọi `initDatabase()` lúc load và có `DROP TABLE` trước khi seed (`backend/database.js:12-21`, `104`). Không được khởi động backend từ source runtime cho performance run.
- `FACT`: matrix đã được Human-approved theo mapping `TRANSACTIONAL -> POST /api/admin/coupons -> STRESS -> Aggregate Report`, CSV riêng `test-data/transactional-admin-coupons.csv` (`docs/performance-design/hw05-production-matrix-proposal.md:566-585`).
- `FACT`: hardware context của run-003 ghi `16` logical processors và khoảng `16 GB` physical memory; đây chỉ là local execution context, không phải baseline/capacity evidence cho endpoint này (`results/23127107_Spike_20260816/run-003/evidence/hardware-context.json`).

### Phân loại TRANSACTIONAL

`TRANSACTIONAL` được hỗ trợ bởi authenticated request processing, input body business fields, persistent coupon creation và unique business key. Điều này không khẳng định route có DB transaction boundary, locking semantics hoặc server-side admin authorization ngoài những gì source thực thi.

## 4. Assumptions

- `ASSUMPTION_REQUIRES_REVIEW`: Chưa có endpoint-specific hardware baseline, traffic target hoặc SLA. Peak `30 VUs` là điểm khởi đầu thận trọng cho local environment, không phải capacity claim.
- `ASSUMPTION_REQUIRES_REVIEW`: Runtime sẽ provision được token của seeded admin identity trong bản sao disposable mà không ghi credential/JWT vào Git-intended artifact.
- `ASSUMPTION_REQUIRES_REVIEW`: Student sẽ approve ít nhất một canonical valid coupon shape, với expiration còn hiệu lực tại ngày chạy. Không tạo giá trị CSV trong design này.
- `ASSUMPTION_REQUIRES_REVIEW`: Builder sẽ re-verify JMeter, Custom Thread Groups plugin và parser-safe resource monitor trước real execution.
- `ASSUMPTION_REQUIRES_REVIEW`: Generated code mapping bằng thread/iteration function sẽ được static-review trong JMX trước execution; không dùng wall-clock randomness làm uniqueness source chính.

## 5. Mô hình workload (Workload Model)

### Mục tiêu STRESS

Tăng dần concurrent authenticated coupon-creation writes để quan sát về sau cách lỗi/Assertion, latency distribution và recovery thay đổi theo stage. Design không đặt SLA, p95 threshold, error-rate threshold hoặc capacity maximum trước real evidence.

### Stages đề xuất

| Pha | Aggregate VUs | Ramp | Hold | Lý do |
|---|---:|---:|---:|---|
| Baseline | 5 | N/A | 20 giây | Xác nhận write path và evidence pipeline dưới tải thấp trước khi tăng. |
| Stage 1 | 5 -> 10 | 10 giây | 20 giây | Tăng gấp đôi để có điểm so sánh đầu tiên mà không tạo burst. |
| Stage 2 | 10 -> 20 | 10 giây | 20 giây | Tăng write concurrency rõ rệt để quan sát dấu hiệu suy giảm theo stage. |
| Stage 3 | 20 -> 30 | 10 giây | 20 giây | Mức cao nhất được AI đề xuất, đủ khác baseline để là Stress nhưng chưa tự nhận là capacity limit. |
| Recovery | 30 -> 5 | 15 giây | 20 giây tại 5 VUs | Quan sát recovery trong evidence sau này mà không chạy thêm workload. |

- Threads/VUs: `5 -> 10 -> 20 -> 30 -> 5 VUs`.
- Ramp-up / ramp-down: `10 / 10 / 10 / 15 giây` theo các stage trên.
- Total planned duration: `145 giây`.
- JMeter workload component recommendation: `Ultimate Thread Group` để materialize timeline staged và recovery; dependency phải được re-verify trước builder/execution.
- Mutation-volume guard: timeline có khoảng `2,137.5 VU-seconds`; với Think Time tối thiểu `1000 ms`, upper bound timer-only xấp xỉ `2,138` attempts trước khi tính response time. Actual count có thể thấp hơn và không được dự đoán là throughput.
- Stress qualification: concurrency tăng theo ba nấc và có hold riêng ở mỗi nấc; nó không phải flat Load, sudden Spike hay Endurance profile.
- Degradation/recovery observation cho Task 2 sau này: Assertion failures, errors lặp lại, timeout hoặc latency percentiles tăng theo stage rồi có/không recovery. Không có ngưỡng PASS/FAIL được bịa trong design.

### Think Time

- Think Time: `1000-1500 ms`.
- Think Time Justification: Coupon creation là write mutation; một range ngắn có jitter tránh đồng bộ tất cả VUs thành zero-think-time flood, nhưng vẫn tạo sustained write pressure để phân biệt các stage. Đây là `RECOMMENDATION`, không mô phỏng chính xác thao tác admin thật.
- JMeter Timer Mapping:
  - Timer Type: `Uniform Random Timer`
  - Lower Bound: `1000 ms`
  - Upper Bound: `1500 ms`
  - JMeter Parameters: Constant Delay Offset `1000 ms`; Random Delay Maximum `500 ms`
  - Scope: chỉ measured `POST /api/admin/coupons` sampler; setup login, preflight và cleanup nằm ngoài measured scope.
  - Mapping Status: `PASS`

### Throughput/p95 evaluation

`NEEDS_REAL_EXECUTION_EVIDENCE`. Chỉ Task 2 trên immutable raw JTL mới được diễn giải p95, Throughput quality, error behavior, capacity hoặc bottleneck.

## 6. Chiến lược dữ liệu kiểm thử (Test Data Strategy)

- CSV Required: `YES`
- Suggested File: `test-data/transactional-admin-coupons.csv`
- File status: `CREATED_APPROVED`
- Data status: `APPROVED_FINAL_DATASET`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS` khi approved CSV fields drive request body; token nằm tại external property boundary, không phải CSV.

| Column | Classification | Purpose |
|---|---|---|
| `coupon_code_prefix` | `REQUEST_DRIVEN` | Prefix được dùng để tạo final `code` cho request. |
| `type` | `REQUEST_DRIVEN` | Drive body field `type`; primary row chỉ dùng documented-valid type. |
| `discount_value` | `REQUEST_DRIVEN` | Drive body field `discount_value`. |
| `min_order_amount` | `REQUEST_DRIVEN` | Drive body field `min_order_amount`. |
| `expired_at` | `REQUEST_DRIVEN` | Drive body field `expired_at`; cần runtime/date review. |
| `max_uses_per_user` | `REQUEST_DRIVEN` | Drive body field `max_uses_per_user`. |
| `coupon_case` | `TRACE_ONLY` | Xác nhận primary data là `SUCCESS_PATH_ONLY`. |
| `iteration_key` | `TRACE_ONLY` | Liên kết CSV row với generated code/evidence mà không tự tạo coupon code tĩnh. |

- Primary Dataset: `SUCCESS_PATH_ONLY`. Không đưa duplicate, unauthorized, malformed, expired hoặc validation-negative case vào measured stages.
- Coupon shape strategy: đề xuất một canonical documented-valid `percent` shape trước để giảm business variability. `fixed` chỉ được thêm nếu Student muốn variation và approve row source-backed; không thêm chỉ để đa dạng.
- CSV Data Set Config proposal: `Recycle on EOF = true`, `Stop thread on EOF = false`, `Sharing mode = shareMode.all`. Recycle chỉ reuse approved shape, không reuse final coupon code.

### Coupon Uniqueness Strategy

- `UNIQUENESS_STRATEGY`: `DETERMINISTIC_RUNTIME_GENERATION`.
- Mỗi measured request tạo `code` từ approved `coupon_code_prefix`, required nonblank runtime `hw05.run_tag`, JMeter thread number và per-thread iteration counter. Conceptual form: `<coupon_code_prefix>-<run_tag>-<thread>-<iteration>`.
- Builder phải materialize function mapping bằng JMeter-supported `__threadNum` và per-thread `__counter(TRUE, ...)`, rồi static-review uniqueness/collision behavior trong generated JMX.
- `hw05.run_tag` được provision riêng cho một run và phải fail closed nếu blank; code không phụ thuộc chỉ vào current wall-clock randomness.
- Preflight sử dụng namespace tách biệt `HW05-STRESS-PREFLIGHT-<run_tag>-...`; preflight coupon được xóa trong disposable runtime và xác minh bằng read-only SQLite count trước JMeter, hoặc nếu delete verification không đáng tin cậy thì run phải dừng.
- Data generation/reset considerations: toàn bộ runtime copy bị dispose sau run; không tạo/xóa coupon trên `backend/database.sqlite`. Runtime metadata lưu prefix/run tag non-secret và code counts, không lưu JWT.

## 7. Chiến lược Assertion (Assertion Strategy)

| Luồng | HTTP status | Body/JSON Assertion | Điều kiện |
|---|---|---|---|
| Thành công primary | `200` | JSON hợp lệ; `message == "Coupon created"`; `id` là số nguyên dương | Chỉ khi request dùng approved valid fields và generated unique code. |
| Auth/token failure | `401` hoặc `403` | JSON error nếu response có body | Assertion failure trong measured workload; missing/invalid token chỉ được kiểm tra ở preflight. |
| Duplicate / database failure | `500` theo current handler | Không coi `{ error: ... }` là success; không ghi raw error body vào audit | Assertion failure, yêu cầu điều tra uniqueness/data setup; không mix deliberate duplicate row vào primary data. |
| Validation/business failure | Current source chưa có explicit validation branch | Không tạo assertion cho field không được response trả về | Invalid/missing data không thuộc `SUCCESS_PATH_ONLY`; documented constraint được kiểm tra ở data review/preflight. |

Không assert coupon code/type/value trong response vì source chỉ trả `message` và `id`. HTTP response nhận được không tự động là PASS.

## 8. JMeter Listener / Report View

- Listener: `Aggregate Report`
- Reason: STRESS cần aggregate error/response/percentile/Throughput measurements theo staged write workload; raw JTL vẫn là source cho Task 2.
- Uniqueness Check: `PASS`
- Evidence / conflict: matrix assigns `Summary Report` cho production LOAD, `Response Time Graph` cho production SPIKE và `Aggregate Report` cho production STRESS. Static listener uniqueness sẽ được recheck sau khi Stress JMX tồn tại; design này không tạo JMX.

## 9. Rủi ro

- `STATE_GROWTH_CONFOUND: DOCUMENTED`: mỗi success tạo một coupon row. Later-stage behavior có thể phản ánh đồng thời higher concurrency và accumulated coupon state; không suy luận nguyên nhân chỉ từ design.
- `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`: SQLite và concurrent inserts là FACT; SQLite bottleneck không phải FACT trước raw JTL/resource evidence.
- `DUPLICATE_CODE_RISK`: một collision biến success path thành HTTP `500`; mandatory uniqueness preflight và generated-code static review là required.
- `SOURCE_DATABASE_RESET_RISK`: `database.js` reset tables at startup; chạy backend ngay trong source path có thể phá source state. Disposable runtime copy là mandatory.
- `AUTHORIZATION_SCOPE_RISK`: valid JWT có thể đủ cho current source dù user không có admin role; không diễn giải test là role-authorization evidence.
- `DOCUMENTED_VALIDATION_GAP`: source không enforce documented coupon constraints; success metric chỉ áp dụng approved input shape, không chứng minh validation coverage.
- `EVIDENCE_PIPELINE_RISK`: Windows-safe JMeter invocation và parser-safe resource monitor phải được kiểm tra trước run, dựa trên các remediation đã chứng minh ở SPIKE.

## 10. Lý do thiết kế (Design Rationale)

Profile `5 -> 10 -> 20 -> 30 -> 5` dùng các step và hold đủ tách stage, có recovery, và giới hạn planned duration `145 giây` để mutation volume của local disposable SQLite vẫn bounded. Uniform Random Timer `1000-1500 ms` giảm synchronized writes nhưng không biến test thành user-behavior claim. CSV drive business fields, còn runtime code generation bảo vệ uniqueness mà không buộc Student phải nhập hàng nghìn code tĩnh.

Isolation toàn runtime phù hợp hơn cleanup theo từng row vì current database module reset/seed tables lúc backend load. Aggregate Report giữ mapping Listener one-to-one đã được matrix approve; raw JTL và resource evidence vẫn là authority cho mọi kết luận performance sau này.

## 11. Câu hỏi mở / Cần làm rõ

- Student có approve canonical `percent` shape hay muốn thêm một documented-valid `fixed` shape vào CSV? Không tạo final row trước quyết định.
- Token setup phải được kiểm tra với seeded admin identity, nhưng current route không enforce role. Student có giữ scope đo current implementation hay thay đổi SUT theo một task riêng?
- Runtime preflight có thể xác nhận absence của preflight coupon bằng read-only SQLite query trong disposable copy không? Nếu không, yêu cầu alternate deterministic preflight cleanup proof trước execution.
- JMeter Custom Thread Groups và resource-monitor dependencies phải được xác nhận lại trên environment tại thời điểm builder/execution.

## 12. Kiểm tra tuân thủ HW05 (HW05 Compliance Check)

| Requirement | Status | Evidence / Note |
|---|---|---|
| Endpoint group assigned | `PASS` | Human-approved matrix maps `POST /api/admin/coupons` to `TRANSACTIONAL`. |
| Scenario assigned | `PASS` | Human-approved matrix maps `TRANSACTIONAL` to `STRESS`. |
| Group uniqueness | `PASS` | Matrix has exactly one production row for each group. |
| Scenario uniqueness | `PASS` | Matrix uses `LOAD`, `SPIKE`, `STRESS` exactly once. |
| Separate CSV | `PASS` | Dedicated proposed path `test-data/transactional-admin-coupons.csv`; final file remains `NOT_CREATED`. |
| Listener uniqueness | `PASS` | `Aggregate Report` differs from approved `Summary Report` and `Response Time Graph`; final JMX recheck pending. |
| Workload justified | `PASS` | Every VU, ramp, hold, duration and Timer value has documented rationale. |
| Assertions defined | `PASS` | Success, auth, duplicate/database and validation boundaries are separated. |

## 13. Human Review

Review Status: `FINALIZED`

Student Decision: `MODIFIED_AND_APPROVED`

Approval Scope: `TRANSACTIONAL_STRESS_DESIGN`

Profile Decision: `APPROVED_WITH_DURATION_CORRECTION`

Original Total Planned Duration: `165 giây`

Approved Total Planned Duration: `145 giây`

Think Time Decision: `APPROVED` (`1000-1500 ms`)

Data Strategy Decision: `APPROVED_FOR_FINALIZATION`

Uniqueness Strategy Decision: `APPROVED` (`DETERMINISTIC_PER_RUN_THREAD_ITERATION`; exact JMeter expression deferred to test-data/JMX preparation)

Isolation Strategy Decision: `APPROVED` (`DISPOSABLE_BACKEND_RUNTIME_COPY`)

Listener Decision: `APPROVED` (`Aggregate Report`)

Final CSV: `test-data/transactional-admin-coupons.csv` (`APPROVED`; `1` canonical `SUCCESS_PATH_ONLY` row)

JMX: `NOT_CREATED`

Execution: `NOT_RUN`

Performance Interpretation: `NOT_PERFORMED`

CHECKPOINT: `JMETER_PLAN_GENERATION_REQUIRED`

Next allowed action: Generate the TRANSACTIONAL / STRESS JMeter plan from the Human-approved design and test data.
