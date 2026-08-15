# Tóm tắt tạo Supporting Endurance JMeter Plan

## 1. Input đã được phê duyệt

- Design: `docs/performance-design/endurance-soak-design.md`.
- Design approval: `APPROVED`; scope `TASK1_ENDURANCE_SOAK_DESIGN`.
- Endpoint / Group / production context: `GET /api/orders/:id` / `READ_HEAVY` / reuses read-only LOAD request semantics.
- Student ID / design date: `23127107` / `2026-08-16`.
- Artifact Classification: `SUPPORTING_EXECUTION_ARTIFACT`.
- Submission Set Membership: `EXCLUDED_FROM_FINAL_3_JMX_SET`.

## 2. Artifact đã tạo

- Supporting JMX: `test-plans/supporting/23127107_Endurance_20260816.jmx`.
- CSV: không tạo mới; reuse nguyên trạng `test-data/read-heavy-orders.csv`.
- Không tạo raw JTL, HTML report, execution metadata, resource evidence hoặc result artifact.

## 3. Mapping workload

- Thread Group: `kg.apc.jmeter.threads.UltimateThreadGroup` từ `jpgc-casutg=3.1.1`.
- Cohort: `10` threads; initial delay `0s`; startup `60s`; hold `600s`; shutdown `60s`.
- Aggregate timeline: `0 -> 10 VUs / 60s` -> `10 VUs / 600s measured steady-state soak` -> `10 -> 0 VUs / 60s`.
- Total planned window: `720s`.
- Measured steady-state start: sau `60s` ramp-up; do đó raw JTL future có thể map `EARLY_WINDOW` và `LATE_WINDOW` bằng execution metadata.

## 4. Request, CSV và assertion

- Base URL: `${__P(baseUrl,http://127.0.0.1:3000)}`; harness tương lai truyền `-JbaseUrl=<disposable-runtime URL>` mà không đổi JMX.
- CSV path: `test-data/read-heavy-orders.csv` (repository-relative; execution từ project root).
- CSV config: `recycle=true`, `stopThread=false`, `shareMode=shareMode.all`.
- Request: `GET ${baseUrl}/api/orders/${order_id}`.
- `CSV_MODE`: `REQUEST_DRIVEN`; `DATA_DRIVEN_FIT`: `PASS` vì `${order_id}` drive path.
- Authentication: source handler hiện tại tại `backend/server.js:344-348` không gọi auth middleware. Plan không invent `Authorization` header; documented auth/owner scope vẫn được record là `IMPLEMENTATION_SPEC_CONFLICT` và không thuộc coverage của plan.
- Assertions: enabled HTTP `200`; JSON object có `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at`; values `id`, `user_id`, `status`, `total_amount` khớp row CSV; `created_at` non-empty; không có `error` field.

## 5. Think Time và result-data boundary

- Timer: enabled `Uniform Random Timer`, Constant Delay Offset `500 ms`, Random Delay Maximum `500 ms`, effective `500-1000 ms`.
- Không có p95, RSS, restart-count hay response/resource threshold calculation trong JMX. `late_p95 / early_p95 <= 1.25`, `late_median_RSS / early_median_RSS <= 1.15`, backend restart count `0`, và failed measured samples `0` là post-execution rules.
- JMX không hard-code raw JTL, HTML, log, database hay resource path. Execution harness tương lai phải truyền runtime-assigned `-l` output path, tạo execution metadata có `test_start`, và validate JTL header gồm timestamp, elapsed, success, response code và sampler label.

## 6. Isolation và resource boundary

- Runtime isolation: `DISPOSABLE_BACKEND_RUNTIME_COPY`.
- `backend/database.sqlite` không được đọc/ghi trực tiếp bởi JMX; source DB SHA-256 bắt buộc được verify trước setup, trước JMeter và sau cleanup.
- Resource monitor không là JMeter sampler. Harness tương lai phải thu backend PID, monitor PID, timestamped CPU/RSS, `resource-monitor.csv`, `resource-summary.json` nếu hỗ trợ, hardware context, backend/JMeter logs, preflight/postflight và cleanup verification.
- JTL/resource alignment: execution metadata dùng một timeline chung; only samples trong measured soak được dùng. `EARLY_WINDOW` là minutes `1-3` và `LATE_WINDOW` là minutes `8-10` tính từ steady state, không gồm ramp-up/ramp-down.

## 7. Dependency và static validation

| Check | Status | Evidence |
|---|---|---|
| XML parse | `PASS` | JMX well-formed XML static parse. |
| JMeter static compatibility | `PASS` | JMeter `5.6.3` version-only verification; generated plan không được load/run bằng JMeter trong interaction này. |
| Plugin | `PASS` | `D:\Tools\apache-jmeter-5.6.3\lib\ext\jmeter-plugins-casutg-3.1.1.jar` có mặt; `UltimateThreadGroup` class được static inspect. |
| Supporting classification | `PASS` | Path `test-plans/supporting/` và Test Plan comments record exclusion from final set. |
| Final 3 production JMX unchanged | `PASS` | Không sửa các file `Load_20260812`, `Spike_20260816`, `Stress_20260816`. |
| Thread group semantics | `PASS` | One cohort `10 / 0 / 60 / 600 / 60`; total `720s`. |
| CSV reuse / portability | `PASS` | Existing CSV, exact header, relative path, `0` absolute local paths. |
| Request mapping / assertions | `PASS` | Source-backed `GET /api/orders/:id`, CSV path variable, HTTP/JSON checks. |
| Secrets | `PASS` | `0` embedded JWT/password/reset token values. |
| Measured execution | `NOT_PERFORMED` | Không chạy JMeter, không có JTL/HTML. |

## 8. Execution readiness

Status: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`.

Mandatory future preflight remains: JMeter/plugin verification, fresh disposable runtime, source DB SHA-256 checks, exact fixtures and success smoke checks, resource monitor startup/fresh sample/parser validation, execution metadata and cleanup verification. Student Human Plan Review is required before a single authorized measured soak.

## 9. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

Supporting Plan Decision: `NOT_REVIEWED`

Execution: `NOT_RUN`

Raw JTL: `NONE`

HTML Report: `NONE`

Endurance Threshold Evaluation: `NOT_PERFORMED`

Task 2: `NOT_STARTED`

CHECKPOINT: `ENDURANCE_PLAN_REVIEW_REQUIRED`
