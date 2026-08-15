# Performance Scenario Design - READ_HEAVY / LOAD

## 1. Thông tin chung

- Endpoint: `GET /api/orders/:id`
- Group: `READ_HEAVY`
- Scenario: `LOAD`
- Primary Listener: `Summary Report`
- Design status: `MODIFIED_AND_APPROVED`
- Workflow gate: `HUMAN_PLAN_REVIEW_REQUIRED`
- Authority / API-source consistency: `IMPLEMENTATION_SPEC_CONFLICT`
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Data status: `APPROVED_FINAL_DATASET`

## 2. Phân tích endpoint

| Thuộc tính | Phân tích |
|---|---|
| HTTP method | `GET` |
| Route | `/api/orders/:id`; giá trị path segment `:id` được truyền trực tiếp làm bind parameter cho câu SQL. |
| Endpoint group | `READ_HEAVY`; matrix đã được Student `MODIFIED_AND_APPROVED`. |
| Authentication | API specification yêu cầu `Authorization: Bearer <token>` cho Cart & Orders, nhưng handler hiện tại không gắn `authenticateToken`. |
| Owner scoping | Handler hiện tại chỉ query `WHERE id = ?`; không dùng `req.user.id` và không kiểm tra order thuộc authenticated user. |
| Request parameters | Path parameter `id`; không có query parameter. |
| Request body | Không có. |
| Response expectation | Nếu tìm thấy: JSON object chứa row `orders`; nếu không tìm thấy: HTTP `404` với `{"error":"Order not found"}`. Spec chỉ nêu route, không định nghĩa schema response chi tiết. |
| Read/write behavior | Chỉ đọc một row theo primary key; không có state mutation trong handler. |
| Potential database interaction | SQLite `SELECT * FROM orders WHERE id = ?`. |
| Business constraints | README nói user chỉ xem đơn của chính mình, nhưng current handler không enforce constraint này. |
| Test-data dependency | Cần allowlist order IDs tồn tại ổn định và snapshot expected values ngay trước execution. |
| Concurrent risk | Request đọc có thể lặp lại, nhưng checkout/cancel/admin status update chạy đồng thời có thể làm row biến mất hoặc đổi status, gây contamination. |

### IMPLEMENTATION_SPEC_CONFLICT

- Documented Contract: `api_specification.md` yêu cầu Bearer token cho nhóm Cart & Orders; `README.md` yêu cầu user chỉ xem đơn của chính mình.
- Current Implementation: `backend/server.js` route `GET /api/orders/:id` không dùng `authenticateToken` và query chỉ theo `id`.
- Design: vẫn gửi Bearer token theo documented contract, nhưng không trình bày token hoặc owner scoping là hành vi được current handler enforce.
- Impact: test hiện tại đo lookup theo order ID, không chứng minh authorization, authenticated-owner isolation, HTTP `401` hay `403`.
- Required Resolution: Student review conflict; nếu SUT được sửa trước plan build thì design phải được review lại và fingerprint lại.

## 3. Facts

- **FACT:** `backend/server.js:100-110` định nghĩa middleware lấy Bearer token và verify JWT; `backend/server.js:344-349` không gắn middleware này cho endpoint đang thiết kế.
- **FACT:** `backend/server.js:345` dùng parameterized query `SELECT * FROM orders WHERE id = ?` với `req.params.id`.
- **FACT:** `backend/server.js:346-347` trả HTTP `404` khi không có row, hoặc JSON của row khi tìm thấy.
- **FACT:** `backend/database.js:74-81` định nghĩa các field `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`.
- **FACT:** `backend/database.js:15-20` drop các bảng, gồm `orders`; `backend/database.js:73-81` recreate `orders` nhưng phần seed `83-111` chỉ seed categories, users, products và coupons, không seed order.
- **FACT:** read-only snapshot ngày `2026-08-15` có ba historical orders. IDs `2` và `3` thuộc user `2`, nhưng không có source seed nào tái tạo chúng sau database initialization.
- **FACT:** user ID `2` tồn tại với role `user` tại thời điểm snapshot.
- **FACT:** `api_specification.md:110-146` đặt endpoint trong nhóm Cart & Orders yêu cầu Bearer token.
- **FACT:** `README.md:164-168` mô tả user chỉ xem được đơn hàng của chính mình.
- **FACT:** hardware context đã ghi nhận Intel Core i5-12500H, 16 logical processors và 16,890,978,304 bytes RAM; đây chỉ là execution-host context từ controlled run, không phải capacity baseline cho endpoint này.
- **FACT:** Student xác nhận cross-member ownership của workflow này là `PASS_BY_STUDENT_CONFIRMATION`; kết luận này không suy ra từ repository.

## 4. Assumptions

- `ASSUMPTION_REQUIRES_REVIEW`: production traffic profile, expected concurrency, SLA p95/error rate và Throughput target chưa được cung cấp.
- `ASSUMPTION_REQUIRES_REVIEW`: một valid token cho dedicated user ID `2` có thể được provision ngoài measured workload mà không lưu secret vào repository hoặc audit.
- `ASSUMPTION_REQUIRES_REVIEW`: runtime setup tooling phải được chạy lại ngay trước future Load execution; lần verification hiện tại chỉ chứng minh fixture strategy khả thi và không phải execution evidence.
- `ASSUMPTION_REQUIRES_REVIEW`: hai deterministic fixture rows là đủ diversity cho baseline Load; chúng được recycle để đọc lặp, không đại diện production data distribution.

## 5. Mô hình workload (Workload Model)

### Mục tiêu

Đánh giá tính ổn định của lookup order detail dưới mức tải khởi đầu bảo thủ. Design không tìm breaking point và không tuyên bố `10 VUs` là production capacity hay mức tải thực tế của máy.

| Pha | VUs | Thời gian | Hành vi |
|---|---:|---:|---|
| Initial ramp | `0 -> 5` | `10 giây` | Khởi động có kiểm soát, tránh dồn request ngay thời điểm đầu. |
| Baseline hold | `5` | `30 giây` | Thu baseline nội bộ trước target load. |
| Target ramp | `5 -> 10` | `20 giây` | Tăng đều để phân biệt tác động ramp với sustained load. |
| Sustained hold | `10` | `60 giây` | Quan sát tính ổn định ở target concurrency. |

- Threads/VUs: baseline `5`, target `10`.
- Ramp-up: `10 giây` tới baseline, sau đó `20 giây` từ baseline tới target.
- Duration: tổng planned workload `120 giây`.
- Iteration behavior: mỗi VU lặp request trong pha active; CSV recycle khi EOF, không stop thread và chia sẻ dataset toàn Thread Group.
- Throughput expectation: `NEEDS_CLARIFICATION`; chưa có SLA/telemetry nên không đặt target hoặc PASS threshold.
- Warm-up: initial ramp và baseline hold cung cấp vùng quan sát trước sustained phase; không loại sample âm thầm. Khi phân tích phải tách phase theo timestamp.

### Think Time

- Think Time: `500-1000 ms`.
- Justification: mô phỏng khoảng nghỉ ngắn giữa các lần người dùng mở chi tiết đơn, tránh vòng lặp zero-think-time biến Load Test thành request saturation không chủ đích.
- JMeter Timer Mapping:
  - Timer Type: `Uniform Random Timer`
  - Lower Bound: `500 ms`
  - Upper Bound: `1000 ms`
  - JMeter Parameters: Constant Delay Offset `500 ms`; Random Delay Maximum `500 ms`
  - Resulting Range: `500-1000 ms`
  - Mapping Status: `PASS`

### Justification workload

- **RECOMMENDATION:** `5 -> 10 VUs` là điểm bắt đầu bảo thủ vì chưa có traffic baseline/SLA; điều chỉnh chỉ sau baseline run được approve.
- **RECOMMENDATION:** hold `60 giây` tạo nhiều iteration đọc lặp để quan sát ổn định mà vẫn giới hạn blast radius của lần production design đầu tiên.
- **RECOMMENDATION:** tổng `120 giây` đủ chứa initial ramp, baseline, target ramp và sustained window rõ ràng; không được diễn giải là endurance test.

## 6. Chiến lược dữ liệu kiểm thử (Test Data Strategy)

- CSV Required: `YES`
- Suggested File: `test-data/read-heavy-orders.csv`
- File Status: `CREATED`; exactly `2` Student-approved success-path rows.
- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Encoding: `UTF-8`
- Header: `order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key`
- Request-driving field: `order_id`, thay trực tiếp `:id` trong path.
- Authentication setup data: token không nằm trong CSV này; dùng runtime JMeter property `${__P(hw05.auth_token,)}` trong Header Manager.
- Assertion-driving fields: `expected_user_id`, `expected_status`, `expected_total_amount`.
- Trace-only fields: `order_case`, `iteration_key`; không gửi vào request.
- CSV behavior đề xuất: `Recycle on EOF = true`; `Stop thread on EOF = false`; `Sharing mode = shareMode.all`.

### Human correction: NON_DETERMINISTIC_ORDER_SNAPSHOT

| order_id | snapshot owner | snapshot status | snapshot total | Classification |
|---:|---:|---|---:|---|
| `2` | `2` | `pending` | `90000000` | `SNAPSHOT_REFERENCE_ONLY` |
| `3` | `2` | `pending` | `58000000` | `SNAPSHOT_REFERENCE_ONLY` |

Human Review xác định AI ban đầu chưa tính đầy đủ việc `backend/database.js` drop/recreate `orders` nhưng không seed deterministic orders. IDs `2` và `3` chỉ là historical snapshot, không phải candidate production data và không được copy vào final CSV. Missing/foreign-owner IDs và intentional `401/403/404` vẫn phải nằm trong functional/security validation riêng, không trộn vào measured Load dataset.

Deterministic fixture proposal: `docs/test-data-reviews/load-order-detail-data-candidates.md`. Student Decision `MODIFY_DATA` đã thay unsupported DB-injection/launcher assumption bằng `DISPOSABLE_BACKEND_RUNTIME_COPY`; Student Decision `APPROVE_DATA` sau đó phê duyệt đúng hai runtime-verified rows cho final CSV.

### Runtime Isolation

- Strategy: `DISPOSABLE_BACKEND_RUNTIME_COPY`.
- Tooling: `scripts/performance/load-order-detail-setup.js` và `scripts/performance/load-order-detail-runtime.js`.
- Sequence: copy backend vào OS temp, start copied server, đợi copied `database.js` reset/seed copied `database.sqlite`, rồi insert hai fixtures bằng transaction.
- Source protection: tooling fail closed nếu runtime DB trùng source DB hoặc không thuộc OS temp; `backend/server.js` và `backend/database.js` không bị sửa.
- Verification evidence: `docs/test-data-reviews/evidence/load-order-detail-runtime-verification.json` (`PASS`).
- Cleanup: copied backend, runtime DB và external secret properties file đã bị xóa; source DB SHA-256 trước/sau cùng là `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.

### Token handling

- Dùng `Authorization: Bearer ${__P(hw05.auth_token,)}` trong plan tương lai.
- Cấp property bằng JMeter properties file nằm ngoài repository, truyền qua `-q <external-secret-properties-file>`; không đưa token vào command line, design, JMX, CSV, log hay audit.
- Preflight đọc cùng external property, chỉ ghi `property_present`, HTTP result và verified user ID; fail closed nếu property trống và không được in token/header.
- Preflight gọi `GET /api/users/me` ngoài measured workload, yêu cầu HTTP `200` và response `id == 2` để xác nhận token valid/dedicated identity.
- Đây chỉ là contract/setup control. Current `GET /api/orders/:id` không verify token, không đo JWT verification và không cover owner authorization.

### Preflight read-only bắt buộc

1. Tạo `DISPOSABLE_BACKEND_RUNTIME_COPY` dưới OS temp và xác nhận copied `database.js` resolve runtime `database.sqlite`, không phải source `backend/database.sqlite`; ghi SHA-256 source DB trước setup.
2. Xác nhận fixture manifest đã được Student approve; đúng hai IDs được insert, thuộc dedicated user `2`, và fields khớp proposal.
3. Xác minh `${__P(hw05.auth_token,)}` tồn tại qua external properties file, gọi `GET /api/users/me` ngoài measured workload và yêu cầu HTTP `200`, `id == 2`; không log token/header.
4. Read-only query hai fixture rows và gọi order-detail smoke request ngoài measured workload; yêu cầu HTTP `200`, đúng `id/user_id/status/total_amount`, `created_at` là non-empty string.
5. Xác nhận không có checkout/cancel/admin-order workflow chạy song song và primary CSV chỉ chứa approved deterministic fixture IDs.
6. Nếu DB path, row, token identity hoặc source fingerprints khác approved evidence, dừng với `DESIGN_STALE` hoặc `NEEDS_DETERMINISTIC_FIXTURE_SETUP`; không tự thay candidate.

Cleanup/restore: dừng copied backend, xóa disposable runtime cùng secret properties file; re-hash `backend/database.sqlite` và yêu cầu bằng pre-setup hash. Không cleanup bằng cách mutate shared/source DB.

## 7. Chiến lược Assertion

Primary success-path sample chỉ PASS khi đồng thời thỏa:

1. HTTP status code bằng `200`.
2. Response là một JSON object hợp lệ.
3. Có các field `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`.
4. `id == ${order_id}`.
5. `user_id == ${expected_user_id}`.
6. `status == ${expected_status}`.
7. `total_amount == ${expected_total_amount}`.
8. `created_at` là string không rỗng. Fixture proposal dùng database default `CURRENT_TIMESTAMP`, vì vậy không assert exact timestamp equality.
9. Response không chứa field `error`.

HTTP `401`, `403` và `404` là failure trong primary measured workload. Chúng không được coi là valid alternate outcome. Vì current handler không gắn middleware, design cũng không tuyên bố Assertion này kiểm thử authorization; security/owner-scope behavior cần test riêng sau khi conflict được resolve.

## 8. Listener / Report View

- Listener: `Summary Report`
- Reason: phù hợp Load Test để tổng hợp sample count, error rate, response-time summary và Throughput cho baseline/target window; không dùng để tự kết luận SLA/capacity.
- Uniqueness Check: `PASS`
- Evidence: Human-approved production matrix dành `Response Time Graph` cho SPIKE và `Aggregate Report` cho STRESS; ba Listener khác nhau.

## 9. Rủi ro

| ID | Rủi ro | Kiểm soát |
|---|---|---|
| `R-LOAD-001` | `IMPLEMENTATION_SPEC_CONFLICT`: thiếu JWT middleware và owner scoping. | Giữ conflict trong design; gửi externalized token theo spec; review lại nếu SUT thay đổi. |
| `R-LOAD-002` | `NON_DETERMINISTIC_ORDER_SNAPSHOT`: IDs `2/3` biến mất sau database initialization. | Classify `SNAPSHOT_REFERENCE_ONLY`; dùng explicit fixture setup trên isolated DB và không copy chúng vào final CSV. |
| `R-LOAD-003` | Order status/data đổi trong khi test gây Assertion failure không thuộc read workload. | Isolated snapshot, mandatory read-only preflight và không chạy mutating workflow song song. |
| `R-LOAD-004` | Token bị lộ qua committed artifact/log. | Runtime property ngoài repo, fail closed khi thiếu, redaction và không audit secret value. |
| `R-LOAD-005` | Diễn giải `10 VUs` thành capacity hoặc realistic traffic. | Ghi rõ đây là conservative starting recommendation; không có SLA/capacity claim. |
| `R-LOAD-006` | Recycle hai fixture IDs tạo cache-skew và bỏ sót data diversity. | Ghi giới hạn trong analysis; chỉ mở rộng bằng approved deterministic rows. |
| `R-LOAD-007` | Import source `backend/database.js` có thể drop/reseed source DB. | Chỉ start copied `server.js` trong OS temp để copied module initialize copied DB; fail closed nếu target path là source DB. |

## 10. Cơ sở thiết kế (Design Rationale)

Endpoint phù hợp `READ_HEAVY / LOAD` vì mỗi sample thực hiện parameterized primary-key lookup, không mutate state và có thể đọc lặp trên allowlisted rows. `order_id` thực sự drive path nên CSV có fit trực tiếp. Workload nhỏ, ramp rõ và Think Time ngẫu nhiên có giới hạn giúp tạo baseline ban đầu mà không giả định production concurrency. `Summary Report` đúng mapping đã được Human approve. Design cố ý không dùng lỗi auth/not-found làm primary outcomes và không che conflict giữa documented authentication/ownership với current source.

## 11. Câu hỏi mở / Clarifications

- Trước real Load execution, Student sẽ approve chạy lại disposable runtime tooling và lưu external secret properties file tại OS temp nào?
- SUT có được sửa để thêm `authenticateToken` và owner filter trước builder không? Nếu có, design phải review/fingerprint lại.
- Có SLA, production traffic baseline hoặc threshold p95/error rate nào được course/team cung cấp không?
- Isolated database snapshot và cửa sổ không có concurrent mutation sẽ được chứng minh bằng evidence nào trước run?

## 12. Kiểm tra tuân thủ HW05

| Requirement | Status | Evidence / Note |
|---|---|---|
| Endpoint group assigned | `PASS` | `READ_HEAVY` được Human approve cho `GET /api/orders/:id`. |
| Scenario assigned | `PASS` | `LOAD` được Human approve cho group này. |
| Group uniqueness | `PASS` | Approved matrix map mỗi group đúng một lần. |
| Scenario uniqueness | `PASS` | Approved matrix dùng `LOAD`, `SPIKE`, `STRESS` đúng một lần. |
| Cross-member ownership | `PASS_BY_STUDENT_CONFIRMATION` | Human confirmation; không suy ra từ repository. |
| Separate CSV | `PASS` | `test-data/read-heavy-orders.csv` khác AUTH_HEAVY và TRANSACTIONAL và có đúng `2` approved rows. |
| Data-driven fit | `PASS` | `order_id` drive `:id`; auth token là runtime setup data riêng. |
| Listener uniqueness | `PASS` | `Summary Report` khác `Response Time Graph` và `Aggregate Report`. |
| Workload justified | `PASS` | Mỗi VU/ramp/hold/Think Time có rationale và không có capacity claim. |
| Assertions defined | `PASS` | Status, JSON structure và field/value checks được chỉ định; 401/403/404 không phải success. |
| Authentication conflict disclosed | `PASS` | `IMPLEMENTATION_SPEC_CONFLICT` và secure token handling được ghi rõ. |
| Data readiness | `PASS` | IDs `2/3` vẫn snapshot-only; fixtures `2312710701/02` đã runtime-verify và được Student approve cho final CSV. |

## 13. Human Review

Status: `REVIEWED`

Student Decision: `MODIFIED_AND_APPROVED`

Approval Scope: `READ_HEAVY_LOAD_DESIGN`

Human Finding: `NON_DETERMINISTIC_ORDER_SNAPSHOT`

Human correction: current IDs `2/3` là `SNAPSHOT_REFERENCE_ONLY`, không phải deterministic final production data. Workload, Uniform Random Timer, `Summary Report`, request-driven `order_id` design và `IMPLEMENTATION_SPEC_CONFLICT` được approve.

CHECKPOINT RESOLUTION: `PERFORMANCE_DESIGN_APPROVED_WITH_DATA_CORRECTION`

Data Strategy Student Decision: `MODIFY_DATA`

Data Strategy Scope: `READ_HEAVY_LOAD_FIXTURE_STRATEGY`

Runtime Isolation: `DISPOSABLE_BACKEND_RUNTIME_COPY`

Runtime Verification: `PASS`

Final Data Student Decision: `APPROVE_DATA`

Final Data Approval Scope: `READ_HEAVY_LOAD_DETERMINISTIC_DATASET`

Final Dataset: `APPROVED`

NEXT CHECKPOINT: `HUMAN_PLAN_REVIEW_REQUIRED`

Next allowed action: Student Human Review của generated JMX, CSV, generation summary và AI plan review. Không chạy JMeter.
