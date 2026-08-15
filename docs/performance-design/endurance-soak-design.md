# Thiết kế Endurance / Soak (Endurance / Soak Test Design)

## 1. Xác minh yêu cầu bài tập (Assignment Requirement Verification)

### Nguồn yêu cầu đã kiểm tra

- `FACT`: Repository không có bản đề HW05 gốc/PDF hoặc rubric độc lập có thể đối chiếu trong lần thiết kế này.
- `FACT`: `agent-skills/hw05-performance-workflow/SKILL.md:161-164` ghi submission readiness gồm `3 plans / 3 CSV / 3 raw JTL / 3 HTML reports`, và liệt kê Endurance là hạng mục riêng.
- `FACT`: `agent-skills/hw05-performance-workflow/SKILL.md:348` xác định Endurance/Soak là **additional requirement**, không phải scenario thứ tư trong mapping `LOAD`/`STRESS`/`SPIKE`; thời lượng `10-15` phút với real metadata mới pass duration, dưới `10` phút là `ENDURANCE_DURATION_RISK`.
- `FACT`: Prompt điều phối hiện tại yêu cầu một concrete empirical threshold có thể đánh giá bằng raw Endurance evidence, nhưng không cung cấp SLA tuyệt đối.

| Hạng mục | Kết quả | Nguồn / giới hạn |
|---|---|---|
| Endurance/Soak có bắt buộc | `PASS` | Contract workflow nêu Endurance là additional requirement. |
| Thời lượng yêu cầu | `10-15 minutes` | Contract workflow; không tìm thấy bản đề gốc độc lập trong repository. |
| Concrete empirical threshold | `PASS` | Prompt điều phối hiện tại yêu cầu; giá trị số chưa phải requirement/SLA chính thức. |
| Final JMX count | `3` | Contract submission readiness. |
| Final raw JTL count | `3` | Contract submission readiness. |
| Final HTML report folder count | `3` | Contract submission readiness. |
| Cơ chế Endurance | `ADDITIONAL_REQUIREMENT`, không phải scenario thứ tư | Contract workflow. |

**Requirement Verification:** `PARTIAL_BUT_ACCEPTED_BY_STUDENT`. Đã tìm repository/project materials nhưng không có bản đề HW05 gốc, instructor README/specification hay assignment-source artifact cao hơn. Student chấp nhận design theo interpretation hiện có từ workflow contract, đồng thời giữ nguyên limitation này.

## 2. Bối cảnh ba scenario production hiện có (Existing Production Scenario Context)

| Group | Endpoint | Scenario | Listener | Trạng thái workflow hiện có |
|---|---|---|---|---|
| `READ_HEAVY` | `GET /api/orders/:id` | `LOAD` | `Summary Report` | `RAW_JTL_AVAILABLE` |
| `AUTH_HEAVY` | `GET /api/users/me` | `SPIKE` | `Response Time Graph` | `RAW_JTL_AVAILABLE` |
| `TRANSACTIONAL` | `POST /api/admin/coupons` | `STRESS` | `Aggregate Report` | `RAW_JTL_AVAILABLE` |

`FACT`: Ba mapping production đã đủ `LOAD`/`SPIKE`/`STRESS`; Endurance không được thêm vào bảng mapping này như một scenario thứ tư.

## 3. Ràng buộc số lượng artifact (Artifact Count Constraint)

- Final production deliverable vẫn là đúng `3` JMX, `3` raw JTL và `3` HTML report folders theo `agent-skills/hw05-performance-workflow/SKILL.md:161-164`.
- `RECOMMENDATION`: Không sửa `test-plans/23127107_Load_20260812.jmx`, vì approved LOAD profile hiện tại chỉ dài `120 giây` (`test-plans/23127107_Load_20260812.jmx:20-30`) và không biểu diễn measured soak 10 phút.
- `RECOMMENDATION`: Nếu Human Review phê duyệt execution, tạo một `SUPPORTING_EXECUTION_ARTIFACT` riêng, không đếm là final scenario thứ tư và không gắn nhầm vào một trong ba raw JTL/HTML bắt buộc.

**Fourth Final JMX Required:** `NO` theo contract repository hiện có.
**JMX_MODIFICATION_REVIEW_REQUIRED:** `YES` nếu sau này có đề xuất sửa một JMX production đã approved thay vì dùng supporting plan.

## 4. Lựa chọn endpoint (Endpoint Selection)

| Candidate | Phù hợp Endurance | Rủi ro / giới hạn | Kết luận |
|---|---|---|---|
| `GET /api/orders/:id` | Read-only primary-key lookup; `order_id` được CSV drive trực tiếp; có fixture deterministic và infrastructure runtime disposable đã được dùng cho LOAD. | Source hiện tại không có middleware auth dù API docs/approved design mô tả auth/owner scope; chỉ có hai fixture rows, nên phải preflight và không chạy workflow mutate song song. | `SELECTED` |
| `GET /api/users/me` | Read-only. | Phụ thuộc token external; CSV chỉ `TRACEABILITY_ONLY`; response identity có bề mặt dữ liệu nhạy cảm hơn; không tạo data diversity cho request. | `NOT_SELECTED` |
| `POST /api/admin/coupons` | Có thể tạo sustained write pressure. | Mỗi iteration tạo database mutation/code mới, tăng dữ liệu và side effect trong 10 phút; dễ làm confound resource trend bằng cumulative INSERT. | `NOT_SELECTED` |

**Selected Endpoint:** `GET /api/orders/:id`
**Selection Reason:** Đây là candidate duy nhất vừa read-only, vừa có request-driving CSV, fixture deterministic và `DISPOSABLE_BACKEND_RUNTIME_COPY` đã được kiểm chứng ở workflow LOAD. Lựa chọn này giảm rủi ro state growth và contamination so với coupon creation, đồng thời tránh token/traceability-only limitation của `/api/users/me`.

`FACT`: `backend/server.js:344-348` thực hiện `db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], ...)`, trả `404` khi không có row và trả JSON order khi có row. Handler hiện tại không gọi auth middleware; documented auth/ownership claim của API/design LOAD vẫn là `IMPLEMENTATION_SPEC_CONFLICT`, không phải coverage của soak này.

## 5. Mục tiêu Endurance (Endurance Objective)

Duy trì một mức tải đọc ổn định trong 10 phút để thu thập evidence cho các tín hiệu theo thời gian: response-time drift, assertion/HTTP failure frequency, backend liveness và memory/RSS growth. Thiết kế này **không** chẩn đoán memory leak, SQLite bottleneck, capacity hoặc production readiness trước khi có raw Endurance JTL, resource evidence và Human Review.

## 6. Workload đề xuất (Proposed Workload)

| Thuộc tính | Giá trị đề xuất | Phân loại / lý do |
|---|---|---|
| Sustained concurrency | `10 VUs` | `RECOMMENDATION`; đây là mức đã xuất hiện trong approved LOAD profile, nhưng không được diễn giải là capacity/safe limit/optimal throughput. |
| Ramp-up | `60 seconds`, `0 -> 10 VUs` tuyến tính | `RECOMMENDATION`; đủ tách ramp khỏi window steady-state và tránh burst khởi động. |
| Measured soak duration | `600 seconds` (`10 minutes`) tại `10 VUs` | Đáp ứng mức tối thiểu 10 phút của contract mà không kéo dài hơn khi chưa có lý do evidence-backed. |
| Ramp-down | `60 seconds`, `10 -> 0 VUs` tuyến tính | `RECOMMENDATION`; tách recovery/shutdown khỏi measured soak. |
| Total orchestration window | `720 seconds` (`12 minutes`) | `60 + 600 + 60`; chỉ 600 giây hold được tính là measured soak. |
| Iteration behavior | Mỗi VU lặp `GET /api/orders/${order_id}` trong pha active | Reuse semantics của LOAD; CSV recycle phải không làm thread dừng. |

**CONCURRENCY_SOURCE:** `AI_PROPOSED_FOR_HUMAN_REVIEW`.

## 7. Thời lượng (Duration)

- **RAMP_UP_DURATION:** `60 seconds`.
- **MEASURED_SOAK_DURATION:** `600 seconds` (`10 minutes`).
- **RAMP_DOWN_DURATION:** `60 seconds`.
- **TOTAL_ORCHESTRATION_WINDOW:** `720 seconds` (`12 minutes`).
- `ASSUMPTION_REQUIRES_REVIEW`: Contract repository dùng wording `10-15 phút` nhưng bản đề gốc không có trong workspace. Human Review cần xác nhận 600 giây measured hold, không gộp ramp, đúng interpretation môn học.

## 8. Concurrency (Concurrency)

`10 VUs` là workload candidate giữ cố định trong soak. Nó được chọn để comparable với approved LOAD configuration, không dựa trên phân tích JTL cũ và không là claim về hardware. Nếu Student muốn một workload khác, thay đổi này cần rationale, updated threshold basis và Human Review trước builder/execution.

## 9. Think Time

- **Think Time:** `500-1000 ms`.
- **Think Time Justification:** Reuse approved LOAD semantics để request cadence có thể so sánh và tránh hot loop `0 ms`; không khẳng định mô phỏng chính xác traffic production.
- **JMeter Timer Mapping:**
  - Timer Type: `Uniform Random Timer`
  - Minimum / Constant Delay Offset: `500 ms`
  - Random Maximum: `500 ms`
  - Effective Range: `500-1000 ms`
  - Mapping Status: `PASS`

## 10. Chiến lược dữ liệu (Data Strategy)

- **DATA_STRATEGY:** `REUSE_EXISTING`.
- **DATA_SOURCE:** `test-data/read-heavy-orders.csv`.
- **CSV_MODE:** `REQUEST_DRIVEN`; `${order_id}` drive trực tiếp `GET /api/orders/:id`.
- **DATA_DRIVEN_FIT:** `PASS`; request path lấy biến thực từ approved CSV, không phải traceability-only.
- Approved rows: `2312710701` và `2312710702`; giữ nguyên header, giá trị và file hiện có.
- **CSV Data Set Config (future plan):** `Recycle on EOF = true`; `Stop thread on EOF = false`; `Sharing mode = shareMode.all`.
- Reuse chỉ an toàn sau khi fresh disposable runtime đã tạo đúng hai fixture rows và cả hai smoke checks trả expected success. Không thêm order ID, không tái dùng production database, không chạy concurrent mutating order workflow.

## 11. Cô lập runtime (Runtime Isolation)

- **Runtime Isolation:** `DISPOSABLE_BACKEND_RUNTIME_COPY`.
- **Source Database:** `backend/database.sqlite` phải không đổi.
- Future execution phải verify SHA-256 source DB: trước setup, trước JMeter và sau cleanup.
- Reuse các helpers đã có cho LOAD (`scripts/performance/load-order-detail-setup.js`, `scripts/performance/load-order-detail-runtime.js`, `scripts/performance/load-order-detail-execute.js`) chỉ sau static review riêng của supporting plan; không chạy helper trong interaction này.

## 12. Giám sát tài nguyên (Resource Monitoring)

Future execution phải dùng PowerShell-safe JMeter invocation và PowerShell `Export-Csv`-compatible monitor/parser đã được chứng minh ở các workflow trước, rồi lưu ít nhất:

- backend PID và monitor PID;
- timestamped CPU samples và backend memory/RSS samples;
- `resource-monitor.csv` và `resource-summary.json` nếu monitor hỗ trợ;
- hardware context, backend/JMeter logs, execution metadata, preflight/postflight, cleanup verification.

Mỗi resource sample cần timestamp cùng clock/timezone với execution metadata. Future analyzer map JTL timestamp vào `[test_start + 60s, test_start + 660s)` cho measured soak trước khi chia early/late window.

## 13. Thiết kế ngưỡng thực nghiệm (Empirical Threshold Design)

**THRESHOLD_SOURCE:** `AI_PROPOSED_AND_STUDENT_APPROVED`.

Không có repository SLA/production baseline hợp lệ để đặt absolute p95 hoặc RPS target. Vì vậy, ngưỡng đề xuất là within-run comparison dưới demand không đổi, có công thức deterministic, scope rõ và chỉ dùng sau real evidence.

- Không gọi bất kỳ giá trị nào dưới đây là official SLA hoặc production SLA.
- Mọi threshold result chỉ có thể là `STABLE_WITHIN_PROPOSED_THRESHOLD` hoặc `THRESHOLD_EXCEEDED`.
- `THRESHOLD_EXCEEDED` không tự chứng minh root cause, capacity limit, memory leak hay database bottleneck.

## 14. Cửa sổ quan sát (Observation Windows)

Tính thời gian tương đối từ `test_start` ghi trong execution metadata:

| Window | Khoảng absolute từ test start | Khoảng trong 600s measured soak | Mục đích |
|---|---:|---:|---|
| Ramp-up excluded | `[0s, 60s)` | Không áp dụng | Không trộn acceleration vào steady state. |
| `EARLY_WINDOW` | `[120s, 240s)` | Phút `1-3` của soak | Bỏ phút steady-state đầu tiên để giảm tác động transition sau ramp-up. |
| `LATE_WINDOW` | `[540s, 660s)` | Phút `8-10` của soak | Hai phút cuối trước ramp-down. |
| Ramp-down excluded | `[660s, 720s)` | Không áp dụng | Không trộn shutdown/recovery vào comparison. |

JTL samples được gán bằng `timeStamp`; resource samples được gán bằng timestamp trong `resource-monitor.csv`. Future analysis phải ghi rõ timezone/clock source, coverage từng window và bỏ window nếu clock alignment không chứng minh được.

## 15. Tiêu chí ổn định response (Response Stability Criterion)

- **Metric:** p95 of `elapsed` (`ms`) cho samples thuộc measured success path `GET /api/orders/:id` trong từng window.
- **Formula:** `late_p95_ms / early_p95_ms`.
- **Proposed threshold:** `<= 1.25`.
- **Interpretation:** `STABLE_WITHIN_PROPOSED_THRESHOLD` khi ratio `<= 1.25`; `THRESHOLD_EXCEEDED` khi ratio `> 1.25`, thiếu sample hợp lệ hoặc không map được window.
- **Reason:** Tolerance 25% là guardrail thận trọng để phát hiện tail-latency drift đáng kể trong 10 phút dưới concurrency/Timer không đổi, đồng thời không biến jitter nhỏ thành SLA failure. Nó không có basis SLA/production telemetry và phải được Student phê duyệt trước execution.

## 16. Tiêu chí ổn định resource (Resource Stability Criterion)

- **Metric:** median backend RSS (`bytes` hoặc `MiB`, ghi rõ unit) trong từng resource window; backend liveness được kiểm tra riêng ở toàn bộ measured soak.
- **Formula:** `late_window_median_RSS / early_window_median_RSS`.
- **Proposed threshold:** `<= 1.15` và không có backend process-exit/restart trong `[60s, 660s)`.
- **Interpretation:** `STABLE_WITHIN_PROPOSED_THRESHOLD` khi cả RSS ratio và liveness pass; `RESOURCE_STABILITY_THRESHOLD_EXCEEDED` khi ratio `> 1.15`, liveness fail, sample thiếu hoặc timestamp không alignment được.
- **Reason:** Endpoint read-only với fixture cố định không chủ động tạo row mới trong soak, nên 15% là indicator bảo thủ cho sustained resource growth cần investigation. Vượt ngưỡng chỉ là observation; không được kết luận `MEMORY_LEAK_CONFIRMED`.

## 17. Tiêu chí lỗi (Error Criterion)

- **Metric:** số HTTP/Assertion failures của primary success-path samples trong `[60s, 660s)`.
- **Proposed threshold:** `0` failures sau khi mandatory preflight đã xác nhận hai fixture IDs và response shape expected.
- **Interpretation:** bất kỳ failure nào là `THRESHOLD_EXCEEDED` và phải được phân loại sau này thành functional assertion failure, environment/preflight failure hoặc performance-related signal; không tự quy kết là degradation.
- **Reason:** Đây là read-only route với exact deterministic success fixtures. Điều kiện `0` không được áp dụng chung cho endpoint write/auth khác và vẫn là `AI_PROPOSED_FOR_HUMAN_REVIEW`, không phải assignment SLA.

## 18. Chiến lược artifact execution (Execution Artifact Strategy)

**Strategy:** `CREATE_SUPPORTING_ENDURANCE_PLAN_NOT_COUNTED_AS_FOURTH_FINAL_SCENARIO`.

Sau Human Review, một supporting plan riêng có thể materialize profile 60s/600s/60s mà không sửa approved production JMX. Conceptual namespace cho raw evidence là `results/endurance/`; execution metadata phải gắn `Artifact Classification: SUPPORTING_EXECUTION_ARTIFACT` và nêu rõ nó không phải một trong ba mandatory scenario JTL/HTML. Không tạo JMX, JTL, HTML, directory hoặc execution artifact trong design interaction này.

## 19. Rủi ro và giới hạn (Risks and Limitations)

| ID | Rủi ro / giới hạn | Giảm thiểu bắt buộc |
|---|---|---|
| `E-001` | Bản đề HW05 gốc không có trong repository; contract skill là nguồn yêu cầu hiện có. | Student xác nhận wording duration/count/threshold trước plan generation. |
| `E-002` | Source route không có auth middleware trong khi docs/approved LOAD design mô tả auth/owner scope. | Record `IMPLEMENTATION_SPEC_CONFLICT`; không diễn giải soak như JWT/owner authorization coverage. |
| `E-003` | Hai fixture rows có thể bị mutate/xóa bởi workflow khác. | Fresh disposable runtime, SHA checks, exact fixture verification, two smoke checks, no concurrent mutation. |
| `E-004` | Fixed 10 VUs có thể không phản ánh production demand/hardware capacity. | Label AI proposal; không đưa capacity claim; Human Review quyết định level. |
| `E-005` | RSS ratio có thể phản ánh runtime/cache/monitor behavior, không đủ chẩn đoán root cause. | Chỉ classify stability threshold; phân tích nguyên nhân thuộc Task 2/evidence review sau này. |
| `E-006` | Supporting evidence có thể bị nhầm thành artifact final thứ tư. | Namespace/metadata `SUPPORTING_EXECUTION_ARTIFACT`; preserve final count 3. |

## 20. Human Review

Review Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `TASK1_ENDURANCE_SOAK_DESIGN`

Requirement Verification Decision: `PARTIAL_BUT_ACCEPTED_BY_STUDENT`

Requirement Source: `agent-skills/hw05-performance-workflow/SKILL.md:161-164,348` (highest available source found after repository/project-material search)

Endpoint Decision: `APPROVED`

Duration Decision: `APPROVED`

Measured Soak Requirement: `SATISFIED` (`600 seconds` measured hold)

Concurrency Source: `AI_PROPOSED_FOR_HUMAN_REVIEW`

Concurrency Decision: `APPROVED_BY_STUDENT`

Think Time Decision: `APPROVED`

Data Strategy: `REUSE_EXISTING`

Data Decision: `APPROVED`

Isolation Decision: `APPROVED`

Response Stability Decision: `APPROVED_BY_STUDENT`

Approved Response Criterion: `late_p95 / early_p95 <= 1.25`

Resource Stability Decision: `APPROVED_BY_STUDENT`

Approved Resource Criterion: `late_median_RSS / early_median_RSS <= 1.15` and `backend restart count = 0`

Error Decision: `APPROVED_BY_STUDENT`

Approved Error Criterion: `failed measured samples = 0`

Observation Window Decision: `APPROVED`

Artifact Strategy Decision: `APPROVED`

Fourth Final JMX Required: `NO`

Supporting Plan Category: `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT`

Threshold Source: `AI_PROPOSED_AND_STUDENT_APPROVED`; không phải official SLA, production SLA hay industry-standard requirement.

Execution: `NOT_RUN`

Performance Interpretation: `NOT_PERFORMED`

Task 2: `NOT_STARTED`

CHECKPOINT: `ENDURANCE_PLAN_GENERATION_REQUIRED`

Next Allowed Action: Generate and statically review the supporting Endurance execution plan. Không sửa approved `test-plans/23127107_Load_20260812.jmx`.
