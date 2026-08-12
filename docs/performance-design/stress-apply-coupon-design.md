# Thiết kế Kịch bản Hiệu năng (Performance Scenario Design)

## 1. Thông tin chung

- Endpoint: `POST /api/apply-coupon`
- HTTP method: `POST`
- Endpoint group: `TRANSACTIONAL`
- Scenario: `STRESS`
- Design status: `ASSUMPTION_REQUIRES_REVIEW`
- Phạm vi bằng chứng đã đọc: `api_specification.md`, `backend/server.js`, `backend/database.js`, `README.md`, các contract skill HW05; chưa có hardware baseline, SLA hoặc CSV thật.

## 2. Phân tích endpoint

| Hạng mục | Phân tích |
|---|---|
| Authentication | `AUTHENTICATION_TEST_DECISION: CURRENT_IMPLEMENTATION_BEHAVIOR`. Handler hiện tại không gắn `authenticateToken`; JMeter plan không thêm JWT mà current handler không enforce. README mô tả authentication expectation quanh coupon/checkout flow; giữ discrepancy này để Human Review/AI Critique. |
| Request parameters/body | JSON body có `code`, `total_amount`, `user_id`; source chỉ bắt buộc `code`. |
| Response expectation | Coupon active, total vượt `min_order_amount`, chưa hết hạn và usage còn quota (khi có user_id) trả JSON `success: true`, `coupon_id`, `discount_amount`, `final_amount`, `message`. |
| Read/write và database | Handler đọc `coupons` và có thể đọc count từ `coupon_usage`; handler này không có `INSERT`/`UPDATE`. Endpoint `/api/coupon-usage` khác mới insert usage. |
| State mutation | Không có mutation được chứng minh trong chính handler apply-coupon; outcome phụ thuộc state coupon/usage đã có. |
| Business constraints | code active/tồn tại, `total_amount > min_order_amount` theo current source, expiry, quota per user khi gửi `user_id`. Primary Stress data không dùng boundary `total_amount == min_order_amount`. |
| Test-data dependency | Cần valid `code`, `total_amount` rõ ràng lớn hơn threshold và `user_id` hiện chưa vượt quota. Primary dataset chỉ chứa success-path variants. |
| Concurrent-request risk | Concurrent lookup/count có thể bộc lộ contention; nếu workflow sau đó gọi coupon-usage, record reuse có thể chạm quota hoặc tạo duplicate side effect. |

## 3. Facts

- `FACT`: HW05 Requirements là authority cho compliance; design này là intended test configuration; `backend/server.js` là current behavior; `api_specification.md` là documented API contract.
- `FACT`: Specification nêu body `code`, `total_amount`, `user_id` và response có `discount_amount`, `final_amount`. (nguồn: `api_specification.md:154-164`)
- `FACT`: Source kiểm tra coupon active, expiry, usage count và các response `400`/`404`; handler chỉ đọc. (nguồn: `backend/server.js:363-439`)
- `FACT`: `POST /api/coupon-usage` là endpoint riêng ghi vào `coupon_usage`. (nguồn: `backend/server.js:443-455`)
- `FACT`: Seed coupon có `max_uses_per_user` 1 hoặc 2. (nguồn: `backend/database.js:105-110`)
- `FACT`: README nêu coupon checkout yêu cầu JWT nhưng apply-coupon handler hiện không authenticate; đây là conflict specification/business documentation với source. (nguồn: `README.md:110-121`, `backend/server.js:363`)
- `FACT`: API specification và source nhất quán về `POST /api/apply-coupon` body gồm `code`, `total_amount`, `user_id`; không có `IMPLEMENTATION_SPEC_CONFLICT` cho method/body hiện tại.
- `FACT`: Current apply-coupon handler không `INSERT`/`UPDATE coupon_usage`; request này không tự consume quota. (nguồn: `backend/server.js:363-439`)
- `FACT`: `POST /api/coupon-usage` là route riêng mới ghi usage. (nguồn: `backend/server.js:443-455`)

### Discrepancy được Human Review giữ lại

- `AUTHENTICATION_TEST_DECISION`: `CURRENT_IMPLEMENTATION_BEHAVIOR`.
- Current Handler: không có JWT middleware theo current implementation evidence.
- README / supporting documentation: mô tả authentication expectation quanh coupon/checkout flow.
- Classification: `IMPLEMENTATION_DOCUMENTATION_DISCREPANCY`.
- JMeter Design Decision: không thêm authentication mà current handler không enforce.
- Minimum amount: source dùng `total_amount > min_order_amount`, supporting README dùng `>=`.
- `PRIMARY_STRESS_DATA_RULE`: chọn `total_amount` rõ ràng lớn hơn `min_order_amount`; giữ equality boundary ngoài primary measured workload.

## 4. Assumptions

- `ASSUMPTION_REQUIRES_REVIEW`: Chưa có hardware baseline/SLA, nên 30 VUs không phải capacity hoặc lưu lượng thực tế.
- `ASSUMPTION_REQUIRES_REVIEW`: Chưa xác nhận apply-coupon có được gọi kèm coupon-usage/checkout trong JMeter flow; không tự thêm side effect đó vào sampler.

## 5. Mô hình workload (Workload Model)

- Threads/VUs: stage `5 -> 10 -> 20 -> 30 VUs`, sau đó recovery về `5 VUs`.
- Ramp-up: tổng `75 giây`, gồm năm ramp `15 giây`.
- Duration: tổng planned duration `315 giây` (xấp xỉ `5 phút 15 giây`).
- Stages: timeline deterministic bên dưới.
- Think Time: `1 giây` giữa iteration.
- Think Time Justification: `RECOMMENDATION` tăng từng nấc để quan sát error/p95 thay đổi và recovery khi chưa có baseline. Think Time mô phỏng khoảng dừng khi người dùng nhập/xem coupon, đồng thời hạn chế reuse record vô kiểm soát. Không biến request này thành flow checkout hay coupon-usage nếu chưa có evidence.
- JMeter Timer Mapping:
  - Timer Type: `Constant Timer`
  - Lower Bound: `1000 ms`
  - Upper Bound: `1000 ms`
  - JMeter Parameters: `Delay: 1000 ms`
  - Mapping Status: `PASS`
- Throughput/p95 evaluation: quan sát p95, HTTP/error assertion theo từng stage và recovery; xác định degradation bằng xu hướng xấu đi liên tiếp, không dùng ngưỡng pass/fail không có SLA.

### Timeline Stress deterministic

| Phase | Ramp | Ramp Duration | Hold |
|---|---|---:|---:|
| Stage 1 | `0 -> 5 VUs` | `15 giây` | `5 VUs` trong `45 giây` |
| Stage 2 | `5 -> 10 VUs` | `15 giây` | `10 VUs` trong `45 giây` |
| Stage 3 | `10 -> 20 VUs` | `15 giây` | `20 VUs` trong `45 giây` |
| Stage 4 | `20 -> 30 VUs` | `15 giây` | `30 VUs` trong `45 giây` |
| Recovery | `30 -> 5 VUs` | `15 giây` | `5 VUs` trong `60 giây` |

- Planned Total Duration: `75 giây ramp + 180 giây stress hold + 60 giây recovery hold = 315 giây`.
- Classification: toàn bộ VU/timeline là `RECOMMENDATION` vì chưa có hardware baseline/SLA; `30 VUs` không phải claimed capacity.

## 6. Chiến lược dữ liệu kiểm thử (Test Data Strategy)

- CSV Required: YES
- Suggested File: `test-data/transactional.csv`
- Columns: `code`, `total_amount`, `user_id`, `coupon_case`, `iteration_key`
- Primary Stress Dataset: `SUCCESS_PATH_ONLY`
- Purpose: `CSV Data Set Config` externalize `code`, `total_amount`, `user_id` để drive JSON request. `iteration_key` chỉ traceability. Nếu giữ `coupon_case`, mọi value trong primary dataset phải là valid-success variant.
- Primary row expectation: HTTP `200` và business response `success: true` theo current implementation.
- Excluded from primary measured workload: invalid/inactive/expired coupon, exhausted usage, below-minimum và equality-boundary rows. Các case này chỉ dùng sampler/run/label riêng ngoài primary error-rate/p95 interpretation.
- Data generation/reset considerations: với apply-coupon-only workload, request không tự tăng coupon usage nên không cần reset `coupon_usage` giữa mỗi iteration chỉ vì apply-coupon. Có thể reuse valid coupon/user combination nếu existing database state vẫn cho business success; trước run phải xác minh user/coupon chưa vượt quota. Unique/reset/isolation trở thành mandatory nếu scope mở rộng sang `/api/coupon-usage`, checkout hoặc state mutation.
- Data status: `NEEDS_DATA_SETUP`.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- HW05_DATA_DRIVEN_RISK: `NO` cho sampler apply-coupon vì `${code}`, `${total_amount}`, `${user_id}` phải drive JSON body; risk data exhaustion/quota vẫn cần setup, không biến CSV thành bằng chứng execution.

## 7. Chiến lược Assertion (Assertion Strategy)

| Luồng | HTTP status | Body/JSON Assertion | Điều kiện |
|---|---|---|---|
| Primary measured success | `200` | `success: true`; có `coupon_id`, `discount_amount`, `final_amount`, `message` | Valid active code, `total_amount > min_order_amount`, chưa expiry và user còn quota. Không assert exact discount numeric calculation khi semantics chưa được Human Review đầy đủ. |
| Negative/boundary documentation only | `400` hoặc `404` | Có `error` theo current handler | Không dùng làm expected outcome trong primary success-path Stress dataset; tách sampler/run/label nếu kiểm thử. |

## 8. JMeter Listener / Report View

- Listener: `Aggregate Report`
- Reason: `RECOMMENDATION` cho Stress vì cần quan sát aggregate response time, throughput và lỗi khi VU tăng từng stage; primary view khác Load/Spike.
- Uniqueness Check: `PASS`
- Evidence / conflict: bộ ba dry-run gán `STRESS -> Aggregate Report`; không trùng `Summary Report` hay `View Results Tree`.

## 9. Rủi ro

- Existing database state có thể khiến selected user/coupon đã vượt quota; phải kiểm tra trước run dù apply-coupon-only không tự consume quota.
- Mâu thuẫn README về authentication với handler hiện tại có thể làm Assertion/security scope sai.
- `total_amount > min_order_amount` trong source khác điều kiện `>=` nêu ở README; boundary test cần quyết định Student review.
- Computation `discount_amount` trong source cần được review độc lập trước khi biến thành exact numeric Assertion.

## 10. Lý do thiết kế (Design Rationale)

Endpoint áp dụng quy tắc coupon có nhiều lookup và điều kiện business nên được dùng cho controlled Stress integration theo stage. Handler apply-coupon hiện chỉ đọc, nhưng output phụ thuộc coupon/user/quota và một flow lân cận có thể ghi usage; final use as HW05 `TRANSACTIONAL` endpoint remains `NOT_YET_APPROVED`. Timeline explicit giúp builder map deterministic. CSV `REQUEST_DRIVEN` chỉ chứa success-path data cho primary measured workload để error rate/p95 không bị trộn với intentional rejection.

## 11. Câu hỏi mở / Cần làm rõ

- Có giữ `POST /api/apply-coupon` làm final HW05 `TRANSACTIONAL` endpoint hay chuyển sang endpoint có actual state mutation?
- Production `LOAD` và `SPIKE` designs nào sẽ được chọn để xác minh group/scenario/Listener uniqueness?
- Dataset coupon/user thật nào sẽ được chuẩn bị trước execution?
- Có SLA/p95/error budget chính thức hay không?

## 12. Kiểm tra tuân thủ HW05 (HW05 Compliance Check)

| Requirement | Status | Evidence / Note |
|---|---|---|
| Endpoint group assigned | PASS | `TRANSACTIONAL` được gán cho endpoint này. |
| Scenario assigned | PASS | `STRESS` được gán cho `TRANSACTIONAL`. |
| Group uniqueness | NEEDS_CLARIFICATION | Chưa có đủ production designs của `READ_HEAVY` và `AUTH_HEAVY`; dry-run artifacts không phải project-level evidence. |
| Scenario uniqueness | NEEDS_CLARIFICATION | Chưa có đủ ba production scenario designs; dry-run/smoke-test artifacts không chứng minh uniqueness toàn project. |
| Separate CSV | PASS | File riêng đề xuất: `test-data/transactional.csv`. |
| Data-driven fit | PASS | `code`, `total_amount`, `user_id` là request body inputs theo API/source; `CSV_MODE: REQUEST_DRIVEN`. |
| Listener uniqueness | NEEDS_CLARIFICATION | `Aggregate Report` phù hợp với STRESS hiện tại; chỉ PASS toàn HW05 sau khi đối chiếu production LOAD và SPIKE designs. |
| Workload justified | PASS | Stage/ramp/recovery/Think Time đều được giải thích. |
| Assertions defined | PASS | Success và valid business error tách riêng. |

## 13. Human Review

Status: `REVIEWED`

Student Decision: `MODIFIED_AND_APPROVED`

Student Notes:

- Corrected project-level group/scenario/listener uniqueness from PASS to NEEDS_CLARIFICATION because dry-run artifacts are not production HW05 evidence.
- Primary Stress workload uses success-path data only; intentional `400`/`404` and boundary cases are excluded from the measured workload.
- For apply-coupon-only scope, coupon_usage reset is not required between iterations because the current handler does not mutate usage.
- Current implemented authentication behavior will be tested; JWT will not be added when the current handler does not enforce it. The documentation/implementation discrepancy remains recorded.
- `total_amount == min_order_amount` is excluded from the primary Stress dataset because source/documentation boundary semantics conflict.
- Stress timeline was made explicit for deterministic JMeter generation.
- Approval applies only to the controlled integration test. Final use of `POST /api/apply-coupon` as the HW05 `TRANSACTIONAL` endpoint remains subject to endpoint-selection review.

Human Review Scope: `CONTROLLED_INTEGRATION_TEST`

Final HW05 Transactional Endpoint: `NOT_YET_APPROVED`

Checkpoint Resolution: `DESIGN_APPROVED`
