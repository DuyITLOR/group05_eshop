# AI Review JMeter Plan - TRANSACTIONAL STRESS - Admin Coupons

## 1. Thông tin review

- Reviewed artifacts:
  - `docs/performance-design/stress-admin-coupons-design.md`
  - `docs/test-data-reviews/stress-admin-coupons-data-review.md`
  - `test-data/transactional-admin-coupons.csv`
  - `test-plans/23127107_Stress_20260816.jmx`
  - `docs/jmeter-generation/23127107-stress-generation-summary.md`
- Endpoint / Group / Scenario: `POST /api/admin/coupons` / `TRANSACTIONAL` / `STRESS`.
- Review type: static JMX, CSV, local dependency, source and documentation review only.
- JMeter execution, JTL, HTML report, resource evidence, and Task 2 performance interpretation: `NOT_PERFORMED`.

## 2. Kết luận ngắn

- Critical / High / Medium / Low / Info: `0 / 0 / 1 / 0 / 2`.
- Static plan fidelity: `PASS`.
- Dependency status: `VERIFIED`.
- Execution Readiness: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`.
- Human Plan Review: `REQUIRED`.

## 3. Mapping Design -> JMX -> API/Source

| Dimension | Approved design / source | JMX static evidence | Status |
|---|---|---|---|
| Endpoint / method | `POST /api/admin/coupons` (`backend/server.js:457-480`) | `POST ${baseUrl}/api/admin/coupons` | `PASS` |
| Group / scenario | `TRANSACTIONAL` / `STRESS` | Ultimate Thread Group test name and generated artifacts | `PASS` |
| Request body | `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` | generated `${generated_coupon_code}` plus five approved CSV business fields; JSON numbers remain unquoted | `PASS` |
| Authentication | JWT required (`backend/server.js:100-109`) | external `hw05.auth_token` Header plus enabled fail-closed guard | `PASS` |
| Authorization scope | documented admin restriction; source handler lacks `req.user.role` check | no client assertion claims server-side role enforcement | `PASS_WITH_IMPLEMENTATION_SPEC_CONFLICT` |
| Workload | `5 -> 10 -> 20 -> 30 -> 5` / `145s` | four additive cohorts end at 145 seconds | `PASS` |
| Think Time | Uniform Random `1000-1500ms` | delay `1000`, range `500`, enabled in measured group | `PASS` |
| CSV | dedicated request-driven success-path CSV | exact relative path, approved schema, one row, business variables drive body | `PASS` |
| Uniqueness | deterministic per run/thread/iteration | per-user Counter plus prefix/run-tag/thread/iteration generated once before sampler | `PASS` |
| Assertions | HTTP `200`, valid JSON, `message`, positive `id` | Response Assertion and JSR223 Assertion | `PASS` |
| Listener | Aggregate Report | one core `ResultCollector` with `StatVisualizer` | `PASS` |

## 4. XML, component và dependency integrity

- XML root `jmeterTestPlan` parses successfully.
- Required enabled components are present: `UltimateThreadGroup`, `CSVDataSet`, `CounterConfig`, `HeaderManager`, `UniformRandomTimer`, `HTTPSamplerProxy`, `JSR223PreProcessor`, `ResponseAssertion`, `JSR223Assertion`, and one `ResultCollector`.
- Local JMeter version-only verification returns `5.6.3`; it did not load or execute the generated plan.
- Local `jmeter-plugins-casutg-3.1.1.jar` contains `kg.apc.jmeter.threads.UltimateThreadGroup` and its GUI class. Core Aggregate Report requires no additional plugin.
- XML parsing plus class/dependency inspection establishes static loadability evidence without sending measured HTTP traffic.

## 5. Workload, Timer và result boundary review

- Baseline cohort: 5 threads, `0+0+145+0 = 145s`.
- Additional 5: delay 20s, startup 10s, hold 80s, shutdown 15s.
- Additional 10 A: delay 50s, startup 10s, hold 50s, shutdown 15s.
- Additional 10 B: delay 80s, startup 10s, hold 20s, shutdown 15s.
- Additive timing gives exact approved windows: baseline 5, three ten-second ramps, holds at 10/20/30, fifteen-second `30 -> 5` recovery, then final 20-second 5-VU hold. Latest cohort ends at `145s`.
- `UniformRandomTimer` contributes `1000 + 0..500 ms` and is scoped to the measured coupon sampler; no preflight request appears in this plan.
- The collector filename is blank. No `run-001` destination, raw JTL path, HTML path, database path, or cleanup SQL is embedded.

## 6. CSV, data-driven mapping và uniqueness review

- CSV path is repository relative, exact, and has `0` absolute-path matches.
- Header and exactly one row match the approved schema and `SUCCESS_PATH_ONLY` strategy.
- `type`, `discount_value`, `min_order_amount`, `expired_at`, and `max_uses_per_user` drive the POST body; `coupon_code_prefix` drives generated `code`. The plan does not send unsupported `coupon_code_prefix`.
- `recycle=true`, `stopThread=false`, `shareMode=shareMode.all` reuse only the approved business shape, not a static coupon code.
- `CounterConfig` starts at `1`, increments by `1`, and is `per_user=true`. It is referenced once by the preprocessor through `${coupon_iteration}`, avoiding repeated `__counter` evaluation in body fields.
- `generated_coupon_code` contains `prefix`, required external `hw05.run_tag`, `ctx.getThreadNum()+1`, and the per-thread counter. Thus same-run cross-thread and cross-iteration collisions are prevented by different thread/iteration segments; cross-run collision is prevented by required run-tag namespace.
- The JSR223 guard throws before the sampler if `baseUrl`, token, run tag, prefix, or counter value is blank/unavailable.

## 7. HTTP, assertions và secret safety

- Header is `Authorization: Bearer ${__P(hw05.auth_token,)}`; no JWT value is embedded.
- `Content-Type: application/json` is present.
- HTTP `200` is required. `401`, `403`, `500`, duplicate code, non-JSON, or any other non-200 response fails measured success semantics.
- JSON assertion parses response, requires object `message == "Coupon created"`, and verifies `id` is a positive number; it neither invents extra response fields nor logs response bodies.
- Static scan found `0` JWT-shaped values and `0` password/secret literal matches in JMX. CSV has no secret field.

## 8. Listener và project uniqueness

- This JMX has exactly one required primary listener: core `Aggregate Report` (`ResultCollector`, `StatVisualizer`).
- It does not contain Summary Report, Graph Results, View Results Tree, or Response Times Over Time.
- Current production plan mapping is `READ_HEAVY / LOAD -> Summary Report`, `AUTH_HEAVY / SPIKE -> jp@gc - Response Times Over Time` (approved Response Time Graph mapping), and `TRANSACTIONAL / STRESS -> Aggregate Report`: `PASS`.

## 9. Findings

### R-001 - MEDIUM - EXECUTION_PREFLIGHT_REQUIRED

- Status: `OPEN`.
- Category: `RUNTIME_ISOLATION_AND_DATA_SAFETY`.
- Evidence: `backend/database.js` initializes/reset-seeds state at backend startup, and this endpoint inserts persistent coupon rows. Static artifacts cannot prove that the future target is a disposable copy, that the current source DB hash remains unchanged, or that an external token/success smoke/resource monitor are ready.
- Impact: running without a fresh preflight risks mutating source state, using an invalid token/namespace, or producing incomplete execution evidence.
- Required Action: immediately before a real run, verify disposable runtime, source DB SHA-256, external temporary token, required blank-property fail-close behavior, success smoke with a separate preflight namespace and cleanup proof, resource monitor, and parser-safe resource CSV. Do not run JMeter if any check fails.
- Execution Blocking: `YES`.

### R-002 - INFO - IMPLEMENTATION_SPEC_CONFLICT

- Status: `OPEN`.
- Category: `ADMIN_AUTHORIZATION_SCOPE`.
- Evidence: `backend/server.js:457-480` applies `authenticateToken` but does not check `req.user.role`; `api_specification.md:171-174` and `README.md:174-179` document an admin role requirement.
- Impact: a successful run covers current authenticated coupon insertion only. It is not evidence of JWT role/owner authorization correctness.
- Required Action: preserve the discrepancy in execution/report interpretation or change SUT under a separately approved task; do not add a fake client-side authorization assertion.
- Execution Blocking: `NO`.

### R-003 - INFO - STATE_GROWTH_CONFOUND_DOCUMENTED

- Status: `OPEN`.
- Category: `TRANSACTIONAL_LIMITATION`.
- Evidence: each successful request executes an `INSERT INTO coupons`; approved design declares `STATE_GROWTH_CONFOUND: DOCUMENTED` and prohibits per-sample delete cleanup.
- Impact: later stages may reflect both concurrency and accumulated coupon rows; static plan cannot isolate a causal performance explanation.
- Required Action: retain this limitation in subsequent evidence/Task 2 analysis; discard the disposable runtime after execution rather than modifying measured traffic.
- Execution Blocking: `NO`.

## 10. HW05 Compliance

| Requirement | Status | Evidence |
|---|---|---|
| Endpoint group and scenario | `PASS` | Approved matrix/design and JMX are `TRANSACTIONAL` / `STRESS`. |
| Separate CSV | `PASS` | Dedicated `test-data/transactional-admin-coupons.csv`. |
| Data-driven fit | `PASS` | Approved business CSV fields drive POST body and generated `code`. |
| Workload justified/preserved | `PASS` | Exact approved 145-second staged profile. |
| Think Time mapping | `PASS` | Uniform Random `1000 + 0..500 ms`. |
| Assertions defined | `PASS` | HTTP and JSON success semantics are enabled. |
| Listener mapping | `PASS` | Exactly one core Aggregate Report. |
| Project listener uniqueness | `PASS` | Current three production plan artifacts use distinct Listener mappings. |
| No source DB mutation logic | `PASS` | No database path, SQL cleanup, or source-runtime reference exists in JMX. |
| No fabricated execution | `PASS` | No workload, JTL, HTML, resource evidence, or Task 2 conclusion was created. |

## 11. Execution Readiness

Status: `CONDITIONALLY_READY_FOR_HUMAN_REVIEW`

Rationale:

- Critical and High static findings: `0`.
- JMX structure, dependency, workload, timer, CSV binding, uniqueness, property guards, body mapping, assertions, listener and secret/path checks pass.
- R-001 is a mandatory future preflight, and Student Human Plan Review remains required. R-002/R-003 are documented current-implementation limitations, not hidden plan changes.
- No SLA, capacity, p95, throughput-quality, bottleneck, regression, execution or performance conclusion is made.

## 12. Human Plan Review

Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `TRANSACTIONAL_STRESS_JMETER_PLAN`

JMX Decision: `APPROVED`

### Student Assessment and Finding Decisions

| ID | Severity | Category | Execution Blocking | Student Assessment | Student Decision |
|---|---|---|---|---|---|
| R-001 | `MEDIUM` | `RUNTIME_ISOLATION_AND_DATA_SAFETY` | `YES` until preflight passes | Đây là mandatory pre-execution dependency for the disposable runtime and evidence pipeline, không phải static JMX defect. | `ACCEPT_AS_PREFLIGHT_DEPENDENCY` (`ACCEPTED_PREFLIGHT_DEPENDENCY`) |
| R-002 | `INFO` | `ADMIN_AUTHORIZATION_SCOPE` | `NO` | Current source/API discrepancy is factual; JMX không được và không cố giải quyết server-side admin-role enforcement. | `ACCEPT` |
| R-003 | `INFO` | `TRANSACTIONAL_LIMITATION` | `NO` | State growth là limitation đã được design phê duyệt; xóa coupon trong measured traffic sẽ đổi workload. | `ACCEPT` |

Required pre-execution condition for R-001:

- Verify JMeter `5.6.3` and `jpgc-casutg=3.1.1`; create a fresh `DISPOSABLE_BACKEND_RUNTIME_COPY`; verify source DB SHA-256 before setup and before JMeter; provision only an external temporary token; perform success smoke with a dedicated preflight namespace; verify blank token/run-tag guards; confirm measured/preflight namespace separation; start resource monitor and obtain a fresh sample; verify the resource CSV parser; then verify source DB integrity after cleanup. Do not run JMeter if any condition fails.

Static Review Readiness: `CONDITIONALLY_READY`

Execution Readiness: `REAL_EXECUTION_REQUIRED`

Execution: `NOT_RUN`

Raw JTL: `NONE`

HTML Report: `NONE`

Performance Interpretation: `NOT_PERFORMED`

Plan Status: `PLAN_APPROVED`

Execution Preflight Required: `YES`

CHECKPOINT: `REAL_EXECUTION_REQUIRED`

Next allowed action: prepare the dedicated audit checkpoint and Git checkpoint, then perform the mandatory TRANSACTIONAL / STRESS runtime preflight before authorizing the first real execution.
