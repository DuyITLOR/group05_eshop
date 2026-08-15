# Tóm tắt tạo JMeter Plan (JMeter Plan Generation Summary)

## 1. Input Design

- Design file: `docs/performance-design/load-order-detail-design.md`
- Approval status: `MODIFIED_AND_APPROVED`
- Final data decision: `APPROVE_DATA`
- Endpoint / Group / Scenario: `GET /api/orders/:id` / `READ_HEAVY` / `LOAD`
- Student ID / Execution Date: `23127107` / `2026-08-12`
- Authority / API-source consistency: `IMPLEMENTATION_SPEC_CONFLICT`

## 2. Artifacts đã tạo

- JMX: `test-plans/23127107_Load_20260812.jmx`
- CSV: `test-data/read-heavy-orders.csv`
- CSV rows: `2`, `SUCCESS_PATH_ONLY`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`

## 3. Mapping workload

JMeter core biểu diễn approved aggregate profile bằng hai additive Thread Group:

| Cohort | Threads | Delay | Ramp-up | Duration | End time |
|---|---:|---:|---:|---:|---:|
| Baseline | `5` | `0s` | `10s` | `120s` | `120s` |
| Increment | `5` | `40s` | `20s` | `80s` | `120s` |

Aggregate mapping:

| Phase | Time window | Target concurrency |
|---|---|---|
| 1 | `0-10s` | `0 -> 5 VUs` |
| 2 | `10-40s` | hold `5 VUs` |
| 3 | `40-60s` | `5 -> 10 VUs` |
| 4 | `60-120s` | hold `10 VUs` |

- Total planned duration: `120 giây`.
- Iteration behavior: Loop Controller `-1` trong scheduler window; CSV recycle khi EOF.
- `WORKLOAD_MAPPING: PASS`.
- Đây là approved Load recommendation, không phải capacity claim hoặc production-traffic fact.

### Think Time

- Think Time: `500-1000 ms`.
- JMeter Timer Mapping: enabled `Uniform Random Timer` trong từng Thread Group.
- Constant Delay Offset: `500 ms`.
- Random Delay Maximum: `500 ms`.
- Effective range: `500-1000 ms`.
- `THINK_TIME_MAPPING: PASS`.

## 4. Cấu hình request

- Method / Route: `GET ${baseUrl}/api/orders/${order_id}`.
- Base URL: `${baseUrl}` với evidence-backed default `${__P(baseUrl,http://localhost:3000)}`; có thể override bằng JMeter property.
- Request body: `NONE`.
- CSV request-driving field: `${order_id}`.
- Assertion-driving fields: `${expected_user_id}`, `${expected_status}`, `${expected_total_amount}`.
- Trace-only fields: `${order_case}`, `${iteration_key}`; không gửi vào HTTP request.
- Header: `Authorization: Bearer ${__P(hw05.auth_token,)}`.

### Authentication và secret handling

- Real JWT không nằm trong JMX, CSV, design, summary, log hoặc audit.
- Runtime token phải được cấp bằng external properties file qua `-q <temp>/hw05-load-secrets.properties`.
- Mỗi Thread Group có enabled `JSR223 PreProcessor` fail closed khi `hw05.auth_token` thiếu/rỗng; script không in token hoặc Authorization header.
- `IMPLEMENTATION_SPEC_CONFLICT`: API specification/README yêu cầu Bearer authentication và owner scoping, nhưng current `GET /api/orders/:id` handler không gắn `authenticateToken` và chỉ query theo order ID. Plan vẫn gửi header theo documented contract nhưng không claim current handler enforce JWT/ownership.

## 5. Assertions

Mỗi primary sample chỉ PASS khi:

- enabled Response Assertion xác nhận HTTP `200`; do đó `401`, `403`, `404` là failure;
- response parse được thành JSON object;
- có `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`;
- `id == ${order_id}`;
- `user_id == ${expected_user_id}`;
- `status == ${expected_status}`;
- `total_amount == ${expected_total_amount}`;
- `created_at` là non-empty string;
- response không chứa field `error`.

JSON contract/value checks dùng enabled core `JSR223 Assertion` với Groovy `JsonSlurper`; không có valid alternate error outcome.

## 6. Listener

- Primary Listener: `Summary Report`.
- Enabled ResultCollector count: `1`.
- Không có `Aggregate Report`, `Response Time Graph` hoặc `View Results Tree` trong plan.
- Approved project mapping: LOAD `Summary Report`; SPIKE `Response Time Graph`; STRESS `Aggregate Report`.
- `LISTENER_MAPPING: PASS` theo Human-approved matrix; phải re-check actual production plans khi SPIKE/STRESS được build.

## 7. Kiểm tra dependency

- Inspected JMeter: `D:\Tools\apache-jmeter-5.6.3` / `5.6.3`; JMeter không được chạy.
- Plan chỉ dùng JMeter core components: `ThreadGroup`, `CSVDataSet`, `HeaderManager`, `JSR223PreProcessor`, `UniformRandomTimer`, `HTTPSamplerProxy`, `ResponseAssertion`, `JSR223Assertion`, `ResultCollector`.
- `saveservice.properties` xác nhận `JSR223Assertion`, `JSR223PreProcessor`, `UniformRandomTimer`, `SummaryReport` và `ThreadGroupGui` có trong installation.
- `PLUGIN_CHECK: NOT_REQUIRED`
- `DEPENDENCY_STATUS: VERIFIED_CORE_COMPONENTS`

## 8. An toàn dữ liệu và pre-execution control

- Data classification: `HUMAN_APPROVED_DETERMINISTIC_FIXTURE`.
- Fixture strategy: `DISPOSABLE_BACKEND_RUNTIME_COPY`.
- Source DB integrity verification: `PASS`; SHA-256 trước/sau setup là `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.
- CSV schema: `order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key`.
- CSV behavior: `Recycle on EOF = true`; `Stop thread on EOF = false`; `Sharing mode = shareMode.all`.
- Historical IDs `2/3`: `SNAPSHOT_REFERENCE_ONLY`, không có trong final CSV.

Ngay trước real execution, bắt buộc chạy preflight ngoài measured Load sampler:

1. Tạo disposable backend runtime bằng `scripts/performance/load-order-detail-runtime.js`.
2. Yêu cầu fixture setup `PASS`, source DB integrity `PASS` và đúng hai approved rows.
3. Cấp external `hw05.auth_token`; không ghi secret vào repository artifact.
4. Yêu cầu `/api/users/me` trả HTTP `200`, user ID `2`.
5. Yêu cầu cả hai order smoke GET trả HTTP `200` và expected fields.
6. Xác nhận không có concurrent checkout/cancel/admin-order mutation.

Preflight là setup control, không phải performance sampler hoặc execution evidence. Thiếu bất kỳ control nào phải dừng trước Load execution.

## 9. Tuân thủ HW05

| Check | Status | Evidence |
|---|---|---|
| Filename convention | `PASS` | `23127107_Load_20260812.jmx` khớp regex và exact Student ID/scenario/date. |
| Separate CSV | `PASS` | `test-data/read-heavy-orders.csv` dành riêng cho `READ_HEAVY`. |
| Listener unique | `PASS` | `Summary Report` đúng approved matrix và khác hai listener đã reserved. |
| Data-driven request | `PASS` | `${order_id}` drive request path; expected fields drive Assertions. |
| Assertions implemented | `PASS` | HTTP `200`, JSON object/fields/equality/non-empty/no-error checks. |
| Design parameters preserved | `PASS` | Exact `0 -> 5 -> 10`, `120s`, Uniform Random Timer `500-1000 ms`. |
| Auth secret externalized | `PASS` | JMX chỉ có `${__P(hw05.auth_token,)}` và fail-closed presence check. |

## 10. Execution readiness

`CONDITIONALLY_READY`

Reasons:

- JMX/CSV/workload/Timer/Assertions/Listener/filename/dependency mapping đều static `PASS`.
- Disposable runtime, exact fixtures, external token identity và source DB integrity phải được preflight lại ngay trước real execution.
- Student chưa Human Review JMeter plan; không có performance execution/result/SLA/capacity claim.

## 11. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

CHECKPOINT: `JMETER_PLAN_REVIEW_REQUIRED`

Execution: `NOT_STARTED`
