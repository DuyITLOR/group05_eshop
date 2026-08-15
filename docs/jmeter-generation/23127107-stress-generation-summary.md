# Tóm tắt tạo JMeter Plan (JMeter Plan Generation Summary)

## 1. Input Design

- Design file: `docs/performance-design/stress-admin-coupons-design.md`.
- Test-data review: `docs/test-data-reviews/stress-admin-coupons-data-review.md`.
- Final CSV: `test-data/transactional-admin-coupons.csv`.
- Endpoint / Group / Scenario: `POST /api/admin/coupons` / `TRANSACTIONAL` / `STRESS`.
- Student ID / execution-design date: `23127107` / `2026-08-16`.
- Design approval: `MODIFIED_AND_APPROVED`; test data approval: `APPROVED`.
- Output JMX: `test-plans/23127107_Stress_20260816.jmx`.

## 2. Thread Group và mapping workload

- Implementation: `kg.apc.jmeter.threads.UltimateThreadGroup` từ `jpgc-casutg=3.1.1`.
- Planned duration: `145 giây`.

| Cohort cộng dồn | Threads | Initial delay | Startup | Hold | Shutdown | Hiệu ứng aggregate |
|---|---:|---:|---:|---:|---:|---|
| Baseline | 5 | 0s | 0s | 145s | 0s | Giữ 5 VUs trong toàn bộ cửa sổ. |
| Increment 5 | 5 | 20s | 10s | 80s | 15s | Tạo `5 -> 10`, rồi cùng các cohort khác ramp-down `30 -> 5`. |
| Increment 10 A | 10 | 50s | 10s | 50s | 15s | Tạo `10 -> 20`, rồi cùng ramp-down. |
| Increment 10 B | 10 | 80s | 10s | 20s | 15s | Tạo `20 -> 30`, giữ 30 VUs và cùng ramp-down. |

Timeline aggregate materialized: `5 VUs / 20s` -> `5 -> 10 / 10s` -> `10 VUs / 20s` -> `10 -> 20 / 10s` -> `20 VUs / 20s` -> `20 -> 30 / 10s` -> `30 VUs / 20s` -> `30 -> 5 / 15s` -> `5 VUs / 20s`.

## 3. Think Time và request

- `Uniform Random Timer` được enabled trong measured Thread Group scope.
- Constant Delay Offset: `1000 ms`; Random Delay Maximum: `500 ms`.
- Effective Think Time: `1000-1500 ms`.
- Measured request: `POST ${baseUrl}/api/admin/coupons`.
- `baseUrl` chỉ nhận từ external JMeter property và guard dừng trước sampler khi blank; không có default port/runtime source path trong JMX.
- Setup smoke, token provisioning, preflight cleanup và resource monitor không nằm trong measured plan.

## 4. CSV, uniqueness và authentication

- CSV relative path: `test-data/transactional-admin-coupons.csv`.
- Schema: `coupon_code_prefix,type,discount_value,min_order_amount,expired_at,max_uses_per_user,coupon_case,iteration_key`.
- CSV mode: `SUCCESS_PATH_ONLY`; `CSV_MODE: REQUEST_DRIVEN`; `DATA_DRIVEN_FIT: PASS`.
- Business fields `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` trực tiếp drive JSON body. `coupon_code_prefix` drive final `code`; `coupon_case` và `iteration_key` trace-only.
- `CSVDataSet`: `recycle=true`, `stopThread=false`, `shareMode=shareMode.all`.
- `CounterConfig` `coupon_iteration` starts at `1`, increments `1`, and is `per_user=true`.
- Final code is created once in the sampler's JSR223 preprocessor as `<coupon_code_prefix>-<hw05.run_tag>-t<thread>-i<coupon_iteration>`; không dùng timestamp, random hoặc UUID làm nguồn uniqueness chính.
- Required external properties: `hw05.run_tag`, `hw05.auth_token`, `baseUrl`. Missing/blank property hoặc unavailable prefix/counter ném exception trước measured sampler.
- Header: `Authorization: Bearer ${__P(hw05.auth_token,)}` và `Content-Type: application/json`. Không có JWT/secret trong JMX, CSV hoặc summary.

## 5. Request body và assertions

Body JSON source-backed:

```json
{
  "code": "${generated_coupon_code}",
  "type": "${type}",
  "discount_value": ${discount_value},
  "min_order_amount": ${min_order_amount},
  "expired_at": "${expired_at}",
  "max_uses_per_user": ${max_uses_per_user}
}
```

- `coupon_code_prefix` không được gửi như API field.
- `Response Assertion` yêu cầu HTTP `200`.
- `JSR223 Assertion` yêu cầu response parse được JSON object, `message == "Coupon created"`, và `id` là số dương.
- Vì vậy duplicate, validation failure, `401`, `403`, `5xx`, non-JSON hoặc response contract sai không được tính là success sample.

## 6. Listener và dependency

- Exactly one primary Listener: `Aggregate Report` (`ResultCollector`, `guiclass=StatVisualizer`).
- `Summary Report`, `Graph Results`, `View Results Tree`, và `Response Times Over Time` không có trong plan này.
- Project mapping static check: `LOAD -> Summary Report`; `SPIKE -> Response Time Graph`; `STRESS -> Aggregate Report` (`PASS`).
- JMeter: `5.6.3` (version-only command; no plan/workload execution).
- Required Custom Thread Groups dependency: JAR `jmeter-plugins-casutg-3.1.1.jar`; `UltimateThreadGroup` class found (`PASS`).

## 7. Static validation

| Check | Status | Evidence |
|---|---|---|
| Filename convention | `PASS` | `23127107_Stress_20260816.jmx`. |
| XML parse / component loadability evidence | `PASS` | XML parse succeeds; JMeter 5.6.3 and required `UltimateThreadGroup` class were verified without executing this plan. |
| STRESS profile / duration | `PASS` | Four additive cohorts end at `145s` and materialize approved timeline. |
| Timer mapping | `PASS` | `1000 + 0..500 ms`, enabled in measured group. |
| CSV / request mapping | `PASS` | Exact dedicated relative path, approved header/row, request-driven fields and generated code. |
| External property guards | `PASS` | `baseUrl`, `hw05.auth_token`, `hw05.run_tag` fail closed before sampler. |
| Assertions | `PASS` | HTTP 200 plus source-backed JSON `message`/positive `id`. |
| Listener uniqueness | `PASS` | Exactly one Aggregate Report and unique project mapping. |
| Absolute local paths | `PASS` | `0` matches. |
| Embedded secrets | `PASS` | `0` JWT-shaped/password-literal matches. |

## 8. Isolation, limitations và no-execution boundary

- Runtime isolation remains `DISPOSABLE_BACKEND_RUNTIME_COPY`; the JMX neither reads nor mutates `backend/database.sqlite` directly and contains no cleanup SQL.
- `STATE_GROWTH_CONFOUND: DOCUMENTED`: measured successful requests add coupon rows. Deleting each coupon would change the approved workload; whole runtime is discarded later.
- `IMPLEMENTATION_SPEC_CONFLICT`: server requires JWT but does not enforce an admin role, although the documented contract says it should. This plan does not claim server-side role-authorization coverage.
- Mandatory preflight remains required before any real execution: disposable runtime, source DB SHA-256, external temporary token, success smoke, fail-closed auth/run-tag checks, separate preflight namespace, resource monitor, and parser-safe resource CSV.
- JMeter execution: `NOT_RUN`. Raw JTL: `NONE`. HTML report: `NONE`. Task 2 interpretation: `NOT_PERFORMED`.

## 9. Execution readiness

Status: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`

Static construction is complete, but it neither approves the plan nor authorizes production execution.

## 10. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

CHECKPOINT: `JMETER_PLAN_REVIEW_REQUIRED`

Next allowed action: run the independent static AI review, then Student must `APPROVE`, `MODIFY`, or `REJECT` the JMeter plan before any real execution.
