# JMeter AI Review - Supporting Endurance / Soak

## 1. Thông tin review

- Reviewed artifacts:
  - `docs/performance-design/endurance-soak-design.md`
  - `test-plans/supporting/23127107_Endurance_20260816.jmx`
  - `test-data/read-heavy-orders.csv`
  - `docs/jmeter-generation/23127107-endurance-supporting-generation-summary.md`
  - `backend/server.js:344-348`
- Review type: static JMX/XML, CSV, local dependency, source and artifact-boundary review only.
- Artifact Classification: `SUPPORTING_EXECUTION_ARTIFACT`.
- Submission Set Membership: `EXCLUDED_FROM_FINAL_3_JMX_SET`.
- JMeter execution, raw JTL, HTML report, resource evidence, Endurance threshold evaluation and Task 2 interpretation: `NOT_PERFORMED`.

## 2. Đánh giá tổng quan

- Critical / High / Medium / Low / Info: `0 / 0 / 1 / 0 / 1`.
- Static plan fidelity: `PASS`.
- JMeter static compatibility: `PASS` (XML parse, JMeter `5.6.3` version-only verification, installed `jpgc-casutg=3.1.1` class inspection; plan itself was not loaded or run by JMeter).
- Execution Readiness: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`.
- Human Plan Review: `REQUIRED`.

## 3. Mapping design -> JMX -> source

| Dimension | Approved design / source | JMX static evidence | Status |
|---|---|---|---|
| Artifact boundary | Supporting artifact, excluded from final three JMX files | `test-plans/supporting/` path and Test Plan comments state `SUPPORTING_EXECUTION_ARTIFACT` / `EXCLUDED_FROM_FINAL_3_JMX_SET` | `PASS` |
| Endpoint / method | `GET /api/orders/:id`; source `backend/server.js:344-348` uses a parameterized lookup | `GET ${baseUrl}/api/orders/${order_id}` | `PASS` |
| Base URL | Future disposable runtime must be redirectable without JMX edit | `${__P(baseUrl,http://127.0.0.1:3000)}` | `PASS` |
| Authentication | Current source handler does not call auth middleware | No invented `Authorization` header or auth preprocessor | `PASS_WITH_IMPLEMENTATION_SPEC_CONFLICT` |
| Workload | Ramp-up `60s`, measured soak `600s`, ramp-down `60s`, total `720s`, steady `10 VUs` | One `UltimateThreadGroup` cohort: `10 / 0 / 60 / 600 / 60` | `PASS` |
| Think Time | Uniform Random `500-1000ms` | delay `500`; range `500`; enabled within measured Thread Group | `PASS` |
| CSV | Reuse `test-data/read-heavy-orders.csv`; request-driven `order_id` | exact relative path, approved six-column header, `recycle=true`, `stopThread=false`, `shareMode=shareMode.all` | `PASS` |
| Assertions | HTTP `200`; source-backed order JSON and CSV values | enabled `ResponseAssertion` and `JSR223Assertion` | `PASS` |
| Observation windows | Exclude ramps; compare minutes `1-3` and `8-10` of measured steady state later | schedule has distinct 600-second hold; no plan choice prevents timestamp segmentation | `PASS` |
| Threshold boundary | p95/RSS/restart/error criteria are post-execution rules | no p95/RSS/restart threshold calculation embedded | `PASS` |

## 4. Findings

| ID | Severity | Category | Classification | Finding | Evidence | Proposed Fix | Status |
|---|---|---|---|---|---|---|---|
| `R-001` | `MEDIUM` | `RUNTIME_PREFLIGHT_AND_EVIDENCE` | `REQUIRES_HUMAN_REVIEW` | Static artifacts cannot prove disposable-runtime isolation, exact fixture availability, source DB integrity, resource-monitor readiness, or future clock alignment. | Design sections 10-12 and supporting plan comments intentionally leave those responsibilities to the future harness. | Before execution, perform the approved fail-closed preflight and stop if any check fails. | `OPEN` |
| `R-002` | `INFO` | `IMPLEMENTATION_SPEC_CONFLICT` | `DOCUMENTED_LIMITATION` | Current `/api/orders/:id` source does not enforce the documented auth/owner scope. | `backend/server.js:344-348`; supporting JMX has no auth header because current handler requires none. | Preserve this limitation in later execution/report interpretation; do not add an artificial client-side auth assertion. | `OPEN` |

### R-001 - MEDIUM - RUNTIME_PREFLIGHT_AND_EVIDENCE

- **Impact:** Không có preflight, một run có thể dùng source database hoặc fixture không đúng, thiếu resource evidence, hoặc không thể align timestamp giữa raw JTL và `resource-monitor.csv`.
- **Required Action:** Ngay trước execution, verify JMeter `5.6.3`, `jpgc-casutg=3.1.1`, fresh `DISPOSABLE_BACKEND_RUNTIME_COPY`, source DB SHA-256 trước setup/trước JMeter/sau cleanup, exact two fixtures và two success smoke checks, resource monitor/PID/fresh sample/parser, execution metadata common timeline, backend/JMeter logs, và cleanup verification. Không chạy nếu bất kỳ check nào fail.
- **Execution Blocking:** `YES` cho đến khi preflight pass.

### R-002 - INFO - IMPLEMENTATION_SPEC_CONFLICT

- **Impact:** Endurance run chỉ cover current read lookup behavior; không chứng minh JWT hay owner authorization coverage.
- **Execution Blocking:** `NO`.

## 5. Thread Group, Timer và result-data review

- `UltimateThreadGroup` dùng đúng component/class từ `jpgc-casutg=3.1.1`.
- Một cohort duy nhất có `10` threads, `0s` initial delay, `60s` startup, `600s` hold và `60s` shutdown. Tổng schedule là `720s`; hold 600 giây tồn tại độc lập, không bị gộp vào ramp.
- `UniformRandomTimer` dùng `500 + 0..500 ms`, không dùng zero-think-time và không scope vào preflight sampler nào.
- JMX không có raw JTL/HTML/log absolute path. Future harness phải gán output runtime bằng `-l`, preserve timestamp, elapsed, success, response code và sampler label, sau đó tạo execution metadata để map `EARLY_WINDOW`/`LATE_WINDOW` cùng resource timestamps.
- `WINDOW_ALIGNMENT_SUPPORT`: `PASS`.

## 6. CSV, request, assertion và secret review

- CSV vẫn có đúng hai approved deterministic rows; không bị sửa hay sao chép.
- `${order_id}` drive route path; four expected fields drive JSON assertion only. Đây là `CSV_MODE: REQUEST_DRIVEN`, `DATA_DRIVEN_FIT: PASS`.
- HTTP `200`, JSON object, required fields, row-matched `id`/`user_id`/`status`/`total_amount`, non-empty `created_at`, và absence of `error` field đều enabled. HTTP/application failure không được tính như success sample.
- `ABSOLUTE_LOCAL_PATHS`: `0` trong JMX.
- `EMBEDDED_SECRETS`: `0` trong JMX; không có JWT, password, reset token hay Authorization value.

## 7. Artifact, listener và HW05 constraint review

- JMX dùng path `test-plans/supporting/23127107_Endurance_20260816.jmx`, không tạo bản sao ở `test-plans/` root.
- Static Git check xác nhận `test-plans/23127107_Load_20260812.jmx`, `test-plans/23127107_Spike_20260816.jmx`, và `test-plans/23127107_Stress_20260816.jmx` không có working-tree diff.
- Supporting plan không được thêm vào `LOAD`/`SPIKE`/`STRESS` mapping và không đặt primary Listener thứ tư. Raw JTL/HTML cho future supporting run phải được label `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT`, không thay thế ba final scenario artifacts.
- `THRESHOLD_SOURCE: AI_PROPOSED_AND_STUDENT_APPROVED` được giữ nguyên. A later `THRESHOLD_EXCEEDED` không tự xác nhận memory leak, database bottleneck, capacity limit hoặc production readiness.

## 8. Execution Readiness

Status: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`.

Rationale:

- Critical/High static findings: `0`.
- XML, plugin, schedule, timer, endpoint, CSV binding, assertion, portability, secret scan, supporting-artifact boundary, future timestamp segmentation support và final-three-JMX immutability đều pass.
- R-001 là mandatory runtime preflight/evidence dependency; R-002 là documented source/spec limitation. Student Human Plan Review vẫn bắt buộc.
- Không có JMeter execution, raw JTL, HTML, performance result, threshold calculation, Task 2 analysis hay performance conclusion.

## 9. Human Plan Review

Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `TASK1_SUPPORTING_ENDURANCE_JMETER_PLAN`

Supporting Plan Decision: `APPROVED`

Static Review Readiness: `CONDITIONALLY_READY`

Execution Readiness: `REAL_ENDURANCE_EXECUTION_REQUIRED`

### Student Assessment and Finding Decisions

| ID | Severity | Category | Execution Blocking | Student Assessment | Student Decision |
|---|---|---|---|---|---|
| `R-001` | `MEDIUM` | `RUNTIME_PREFLIGHT_AND_EVIDENCE` | `YES` until preflight passes | Đây là mandatory runtime/preflight and evidence dependency, không phải JMX defect. Plan không cần sửa để thực hiện đúng 60/600/60 schedule. | `ACCEPT_AS_PREFLIGHT_DEPENDENCY` |
| `R-002` | `INFO` | `IMPLEMENTATION_SPEC_CONFLICT` | `NO` | Đây là discrepancy factual giữa source handler hiện tại và documented auth/owner scope. Supporting JMX đúng khi không invent auth requirement. | `ACCEPT` |

R-001 giữ severity `MEDIUM` và trạng thái runtime dependency cho đến khi preflight thực tế pass. R-002 giữ nguyên như documented limitation; approval không biến nó thành coverage JWT/owner authorization.

### Mandatory Pre-Execution Condition for R-001

Trước đúng một Endurance execution, phải pass toàn bộ: JMeter `5.6.3`; `jpgc-casutg=3.1.1`; fresh `DISPOSABLE_BACKEND_RUNTIME_COPY`; exact deterministic READ_HEAVY fixture verification và two success smoke checks; source DB SHA-256 trước setup, trước JMeter và sau cleanup; resource monitor/PID/fresh sample; PowerShell `Export-Csv`-compatible parser validation; execution metadata common timeline cho JTL/resource timestamps; backend/JMeter logs; cleanup và source DB integrity after cleanup. Không chạy JMeter nếu có bất kỳ check nào fail.

Execution: `NOT_RUN`

Raw JTL: `NONE`

HTML Report: `NONE`

Endurance Threshold Evaluation: `NOT_PERFORMED`

Task 2: `NOT_STARTED`

CHECKPOINT: `REAL_ENDURANCE_EXECUTION_REQUIRED`

Next Allowed Action: Create the Git checkpoint for the approved supporting Endurance plan, then authorize exactly one real Endurance execution with a 600-second measured soak after mandatory preflight passes.
