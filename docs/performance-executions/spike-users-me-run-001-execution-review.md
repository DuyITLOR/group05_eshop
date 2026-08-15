# Production AUTH_HEAVY SPIKE Execution Attempt Review

## 1. Thong tin chung

- Endpoint: `GET /api/users/me`
- Group / Scenario: `AUTH_HEAVY` / `SPIKE`
- Student ID / Run: `23127107` / `run-001`
- Approved JMX: `test-plans/23127107_Spike_20260816.jmx`
- Approved CSV: `test-data/auth-heavy-users-me.csv`
- Planned workload: `5 VUs / 20s -> 25 VUs in 3s -> 25 VUs / 20s -> 5 VUs in 5s -> 5 VUs / 20s` (`68s`).
- Failure classification: `ENVIRONMENT_FAILURE` / `FAILED_PRE_EXECUTION_ATTEMPT`.
- Performance Interpretation: `NOT_PERFORMED`.

## 2. Approved Artifact Integrity

| Artifact | SHA-256 | Result |
|---|---|---|
| JMX | `64E17D39739D7656296840EA84A429BDD3F60FCC5C0F95CFAC907F30F5E144B6` | `PASS` |
| CSV | `B511539176DA16D396DFA2B3FC1DF02DFFA4236B2DF4C48A0FB33721A5877A3C` | `PASS` |
| Design | `A4E26C5DE9EC71B7293961D9E943B05C4F35F1ADD6D18E5C81C02AF5CBC11921` | `PASS` |
| Plan review | `68A2651FB66B46C2545C27DCB6542DCEDDBF3B431D5C4FB89AEAEDC31D5EEB10` | `PASS` |

The CSV remained `TRACEABILITY_ONLY` with `DATA_DRIVEN_FIT: RISK_ACCEPTED`. No approved JMX, CSV, or design artifact was changed.

## 3. Preflight Result

| Check | Result | Evidence |
|---|---|---|
| Run-ID collision before attempt | `PASS` | `results/23127107_Spike_20260816/run-001/` did not exist before the wrapper started. |
| Source DB SHA-256 before setup | `PASS` | `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| JMeter CLI version preflight | `FAIL` | Version-only guard reported `ENVIRONMENT_FAILURE: JMeter CLI 5.6.3 verification failed`. |
| Disposable runtime | `NOT_REACHED` | Failure occurred before runtime creation. |
| Plugin/class, token, identity, fail-close, resource monitor | `NOT_REACHED` | They were correctly guarded after the failed version preflight and were not attempted. |
| Source DB SHA-256 after stop | `PASS` | Remained `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |

`jmeter-version-check.log` is empty. The available evidence establishes only that the version guard failed; it does not establish a JMeter workload failure or an SUT failure.

## 4. Execution Result

| Fact | Value |
|---|---:|
| JMeter invocation count | `0` |
| Automatic rerun count | `0` |
| JMeter exit code | `NOT_AVAILABLE` |
| Raw JTL | `NOT_CREATED` |
| HTML report | `NOT_CREATED` |
| Resource monitor CSV | `NOT_CREATED` |
| Total / successful / failed samples | `NOT_COMPUTABLE / NOT_COMPUTABLE / NOT_COMPUTABLE` |

No measured SPIKE traffic occurred. There is no p50/p95/p99, Throughput, capacity, SLA, regression, bottleneck, or production-readiness conclusion.

## 5. Evidence Inventory

- `results/23127107_Spike_20260816/run-001/evidence/jmeter-version-check.log`
- `results/23127107_Spike_20260816/run-001/evidence/execution-metadata.json`
- `results/23127107_Spike_20260816/run-001/evidence/postflight.json`
- `results/23127107_Spike_20260816/run-001/evidence/cleanup-verification.json`

No raw JTL, HTML dashboard, resource-monitor sample, backend log, temporary token file, or copied runtime was produced. These absences are recorded as actual facts, not replaced with synthetic evidence.

## 6. Sensitive-value Safety

- JWT exposed: `NO`.
- Password value exposed: `NO`.
- Reset-token value exposed: `NO`.
- Full `/api/users/me` response body stored: `NO`.

No setup-only authentication occurred, so no temporary secret file was created. Metadata fields that report a non-deleted secret/runtime mean `NOT_CREATED`, not a cleanup failure.

## 7. Failure Analysis and Required Human Decision

- Failure point: JMeter version-only preflight, before disposable runtime setup and before any measured invocation.
- Root cause evidence: the wrapper recorded `ENVIRONMENT_FAILURE: JMeter CLI 5.6.3 verification failed`; its captured version log is empty.
- Root cause beyond that guard: `NOT_YET_CONFIRMED`. Do not infer a JMeter engine, plugin, SUT, or network defect from the empty log.
- Remediation candidate for review: inspect and correct only the version-only launcher/error capture so its invocation details are evidenceable, then revalidate preflight without running a workload.
- Any new measured attempt must use a new run identity and needs explicit Student authorization. `run-001` must remain preserved and must not be overwritten.

## 8. Cleanup and Source Integrity

- Source DB integrity after stopped attempt: `PASS`.
- Backend / monitor process: `NOT_CREATED`.
- Temporary token properties file: `NOT_CREATED`.
- Disposable runtime: `NOT_CREATED`.
- No silent rerun: `PASS`.

## 9. Human Failure Triage and Remediation

- Root cause category: `PROCESS_INVOCATION_FAILURE`.
- Root cause: `verifyJmeterVersion()` invoked `D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat` directly through Node.js `spawnSync`. On this Windows environment, the process result had `status: null` and `error.code: EINVAL`; therefore both captured streams were empty and the previous version guard failed before any JMeter workload invocation.
- Evidence: a diagnostic direct `spawnSync` of that exact path returned `spawnSync D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat EINVAL`. The path exists. The same `jmeter.bat -v` command invoked through PowerShell returned exit code `0`, emitted warning lines followed by the `5.6.3` banner, and was therefore not a path, version-regex, or plugin failure.
- Remediation: `scripts/performance/auth-heavy-spike-execute.js` now calls the existing PowerShell JMeter launcher in `-VersionOnly` mode instead of directly spawning the batch file. It records combined stdout/stderr and still fails closed for a spawn error, nonzero exit code, or an output that does not contain the exact `5.6.3` version.
- Diagnostic validation: `PASS` / `DIAGNOSTIC_ONLY`. `node scripts/performance/auth-heavy-spike-execute.js --diagnostic-version-only` detected `5.6.3`; `jpgc-graphs-basic=2.0`, `jpgc-casutg=3.1.1`, and `jpgc-plugins-manager=1.12` were present; `ResponseTimesOverTimeGui`, `CorrectedResultCollector`, and `UltimateThreadGroup` all passed class verification. It did not create application runtime, provision a token, start a monitor, or execute a JMeter workload.
- Diagnostic storage: temporary OS-directory files were deleted after validation. No diagnostic output was added to `run-001` or treated as production performance evidence.
- Approved artifact impact: JMX / CSV / design changes are `NO / NO / NO`.
- Retry recommendation: `run-002`, reason `RETRY_AFTER_PRE_EXECUTION_ENVIRONMENT_FAILURE`. It was not created or executed.

## 10. Human Review

Status: `MODIFIED_AND_APPROVED`

Student Decision: `MODIFIED_AND_APPROVED`

Decision Scope: `AUTH_HEAVY_SPIKE_RUN_001_ENVIRONMENT_REMEDIATION`

This decision approves the documented execution-tooling remediation only. It does not convert `run-001` into a performance execution and does not authorize a retry.

CHECKPOINT: `RETRY_REVIEW_REQUIRED`

Next allowed action: Student authorize or reject exactly one new production AUTH_HEAVY / SPIKE attempt with run identity `run-002`.
