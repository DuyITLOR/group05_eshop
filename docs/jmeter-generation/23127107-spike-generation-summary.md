# Tom tat tao JMeter Plan (JMeter Plan Generation Summary)

## 1. Input Design

- Design file: `docs/performance-design/spike-users-me-design.md`
- Data review: `docs/test-data-reviews/spike-users-me-data-candidates.md`
- Final CSV: `test-data/auth-heavy-users-me.csv`
- Endpoint: `GET /api/users/me`
- Group / Scenario: `AUTH_HEAVY` / `SPIKE`
- Student ID / execution-design date: `23127107` / `2026-08-16`
- Output JMX: `test-plans/23127107_Spike_20260816.jmx`
- Design and data Human Review: `APPROVED` / `APPROVE_DATA`; this artifact does not approve the JMeter plan.

## 2. Dependency Resolution

- Previous blocker: `DEPENDENCY_MISSING`.
- Resolution: `RESOLVED_BY_STUDENT_LOCAL_INSTALLATION`.
- JMeter: `5.6.3`.
- Plugins Manager: `jmeter-plugins-manager-1.12.jar` (`PluginsManagerCMD.bat` present).
- Required Listener semantic mapping: `Response Time Graph`.
- Materialized Listener: `jp@gc - Response Times Over Time`.
- Plugin: `jpgc-graphs-basic=2.0`, JAR `lib/ext/jmeter-plugins-graphs-basic-2.0.jar`.
- Listener GUI class: `kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui` (`PASS` static JAR scan and `Class.forName` verification).
- Listener collector class: `kg.apc.jmeter.vizualizers.CorrectedResultCollector` (`PASS`).
- Custom Thread Groups: `jpgc-casutg=3.1.1`, class `kg.apc.jmeter.threads.UltimateThreadGroup` (`PASS`).
- Common dependency: `jmeter-plugins-cmn-jmeter-0.7.jar`, collector class found and loadable.
- The previous AI-side installation attempt was blocked by restricted network access. The Student's local installation is recorded only as a dependency fact, not as AI-generated HW05 execution evidence.

## 3. Workload va Thread Group Mapping

`Ultimate Thread Group` materializes the approved aggregate timeline with two cohorts:

| Cohort | Threads | Initial delay | Startup | Hold | Shutdown | Aggregate effect |
|---|---:|---:|---:|---:|---:|---|
| Baseline | 5 | 0s | 1s | 66s | 1s | Duy tri 5 VUs den het cua so 68s. |
| Spike addition | 20 | 20s | 3s | 20s | 5s | Tao 5 -> 25 VUs, giu 25, roi tro ve 5 VUs. |

- Baseline: `5 VUs / 20s`.
- Spike ramp: `5 -> 25 VUs / 3s`.
- Spike hold: `25 VUs / 20s`.
- Recovery: `25 -> 5 VUs / 5s`.
- Recovery hold: `5 VUs / 20s`.
- Planned window: `68s`.
- Scenario remains `SPIKE`; no gradual Stress/Load progression was introduced.

## 4. Think Time va HTTP Request

- Timer: enabled `Uniform Random Timer` in the measured Thread Group scope.
- Constant Delay Offset: `250 ms`.
- Random Delay Maximum: `250 ms`.
- Effective Think Time: `250-500 ms`.
- Measured request: `GET ${baseUrl}/api/users/me`.
- Setup login/token provisioning is excluded from the measured Thread Group.
- `baseUrl` is an externalizable JMeter property with local default `http://localhost:3000`.

## 5. CSV va Authentication

- CSV file: `test-data/auth-heavy-users-me.csv`.
- Schema: `expected_user_id,expected_email,expected_name,auth_case,iteration_key`.
- `expected_user_id`, `expected_email`, `expected_name`: assertion-driven only.
- `auth_case`, `iteration_key`: trace-only.
- `CSV_MODE: TRACEABILITY_ONLY`.
- `DATA_DRIVEN_FIT: RISK_ACCEPTED`; no CSV column drives path, query, body, or header.
- `Recycle on EOF: true`; one approved read-only identity can be reused for a short SPIKE run.
- `Stop thread on EOF: false`; repeated samples must not terminate merely because the single-row CSV reaches EOF.
- `Sharing mode: shareMode.all`; all VUs consume the same approved identity row consistently.
- Header: `Authorization: Bearer ${__P(hw05.auth_token,)}`.
- Token is not present in JMX, CSV, summary, output, or assertion text.
- A JSR223 PreProcessor fails closed before measured sampling when `hw05.auth_token` is missing or blank.

## 6. Assertions

- `Response Assertion`: HTTP response code must equal `200`; `401`, `403`, `5xx`, and every other non-`200` response fail the primary path.
- `JSR223 Assertion`: response must parse as a JSON object; `id`, `email`, and `name` must equal approved CSV values; no top-level `error` field is permitted.
- The plan never asserts, logs, or stores values for `password` or `reset_token`.

## 7. Listener

- Exactly one enabled primary Listener: `jp@gc - Response Times Over Time`.
- It implements the approved `Response Time Graph` mapping for `AUTH_HEAVY / SPIKE`.
- `Summary Report`, `Aggregate Report`, `View Results Tree`, and core `Graph Results` are absent.
- Project mapping remains `LOAD -> Summary Report`, `SPIKE -> Response Time Graph`, `STRESS -> Aggregate Report`.

## 8. Implementation Conflict va Execution Prerequisites

- `IMPLEMENTATION_SPEC_CONFLICT`: current `GET /api/users/me` handler returns `SELECT *` user data. Runtime verification observed field names including `password` and `reset_token`; this plan does not persist or expose their values.
- `IMPLEMENTATION_SPEC_CONFLICT`: source failed-login lockout behavior differs from README. Preflight must not create failed-login attempts.
- Before real execution: create disposable backend runtime, verify source DB hash, provision a temporary external token, verify `/api/users/me` identity, verify missing-token guard, capture backend PID/resource monitor readiness, and remove runtime/secret material after the run.
- No JMeter execution, JTL, HTML dashboard, resource evidence, or performance conclusion was created by plan generation.

## 9. Static Validation

| Check | Status | Evidence |
|---|---|---|
| Filename convention | `PASS` | `23127107_Spike_20260816.jmx`. |
| XML / hashTree | `PASS` | Static XML parse and hashTree pairing completed with `0` errors. |
| Separate CSV | `PASS` | Dedicated AUTH_HEAVY CSV exists with exact approved row. |
| CSV semantics | `RISK_ACCEPTED` | `TRACEABILITY_ONLY`; no request-driving columns. |
| SPIKE mapping | `PASS` | Two verified Ultimate Thread Group cohorts preserve 68s profile. |
| Think Time | `PASS` | Uniform Random Timer `250 + 0..250 ms`. |
| Authentication | `PASS` | External property only with fail-closed guard. |
| Assertions | `PASS` | HTTP 200 plus JSON identity/no-error checks. |
| Listener unique | `PASS` | Exactly `jp@gc - Response Times Over Time`; no LOAD/STRESS Listener added. |
| Plugin dependency | `PASS` | Basic Graphs 2.0 and Custom Thread Groups 3.1.1 classes loadable in local JMeter classpath. |
| Secret safety | `PASS` | No JWT or sensitive response values in generated artifacts. |

## 10. Execution Readiness

Status: `CONDITIONALLY_READY`

Reasons:

- Static plan generation completed, but Student Human Plan Review is still mandatory.
- Mandatory disposable-runtime/token/identity/resource-monitor preflight remains required before any real execution.
- No SLA, capacity, p95, throughput, bottleneck, or execution-result claim exists.

## 11. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

CHECKPOINT: `JMETER_AI_REVIEW_REQUIRED`

Next allowed action: run `$perf-plan-reviewer`, then Student must `APPROVE`, `MODIFY`, or `REJECT` the generated plan.
