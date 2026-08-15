# Production AUTH_HEAVY SPIKE Run-003 Execution Review

## 1. Thong tin chung

- Endpoint: `GET /api/users/me`
- Group / Scenario: `AUTH_HEAVY` / `SPIKE`
- Student ID / Run: `23127107` / `run-003`
- Retry authorization: `APPROVED`
- Retry reason: `RETRY_AFTER_PRE_EXECUTION_EVIDENCE_PARSER_FAILURE`
- Historical attempts: `run-001` and `run-002` remain immutable `FAILED_PRE_EXECUTION_ATTEMPT` evidence; neither was overwritten or reinterpreted.
- Performance Interpretation: `NOT_PERFORMED`.

## 2. Preflight va truy vet artifact

| Check | Result | Evidence |
| --- | --- | --- |
| Approved JMX / CSV / design / plan-review fingerprints | `PASS` | `preflight.json` records the approved SHA-256 values. |
| JMeter version guard | `PASS` | `5.6.3`; `jmeter-version-check.log` and `jmeter-version-engine.log`. |
| Plugin/class preflight | `PASS` | `jpgc-graphs-basic=2.0`, `jpgc-casutg=3.1.1`, `ResponseTimesOverTimeGui`, and `UltimateThreadGroup`. |
| Version-invocation remediation | `PASS` | JMeter version check completed through the approved PowerShell-compatible path. |
| CSV parser remediation | `PASS` | Fresh `resource-monitor.csv` was parsed before JMeter; BOM, CRLF, quoted header/data and schema validation passed. |
| Disposable runtime | `PASS` | `DISPOSABLE_BACKEND_RUNTIME_COPY` outside source database. |
| Seeded identity and setup-only token | `PASS` | User `2` was verified; token value was not recorded. |
| `/api/users/me` success preflight | `PASS` | HTTP `200`, expected identity fields. |
| Fail-closed token preflight | `PASS` | Missing token returned HTTP `401`. |
| Source DB before / before JMeter | `PASS` | Both SHA-256 values are `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| Workload traceability | `PASS` | `5 -> 25 -> 5 VUs`, `68s`, `Uniform Random Timer 250-500 ms`, `jp@gc - Response Times Over Time`. |

## 3. Ket qua thuc thi factual

| Fact | Value |
| --- | --- |
| JMeter exit code | `0` |
| JMeter invocation count / automatic rerun count | `1 / 0` |
| Raw JTL | `results/23127107_Spike_20260816/run-003/raw/23127107_Spike_20260816_run-003.jtl` |
| Raw JTL SHA-256 | `B5484DF66137CFB3A7B2787D02DFB2D12B69F4AFFA2127D7A05EF524586E30AB` |
| HTML report | `results/23127107_Spike_20260816/run-003/html/index.html` (`readable`) |
| Total / successful / failed samples | `2123 / 2123 / 0` |
| JMeter orchestration duration | `82.278 seconds` |
| Primary Listener traceability | `PASS`; approved JMX contains `jp@gc - Response Times Over Time`. |

Các facts trên khong ket luan p95, Throughput quality, SLA, capacity, bottleneck, regression hay production readiness. Task 2 remains `NOT_STARTED`.

## 4. Resource evidence va cleanup

- Resource evidence directory: `results/23127107_Spike_20260816/run-003/evidence/`.
- `resource-monitor.csv` parsed successfully before execution; final `resource-summary.json` records `82` samples and `0` backend-not-alive samples.
- Evidence includes preflight/postflight, execution start/metadata, hardware context, monitor CSV/summary, backend and monitor logs/PIDs, JMeter logs/PID, and copied monitor/JMeter launcher scripts.
- Monitor stdout/stderr are empty.
- Source DB integrity after cleanup: `PASS`; SHA-256 remains `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.
- Temporary token property and disposable runtime: `DELETED / DELETED`.
- `postflight.json` recorded `backend_stopped: false` at capture time. Later read-only PID checks confirmed backend, monitor and JMeter launcher are all `NOT_RUNNING`; raw postflight evidence was not changed.
- JWT / password value / reset-token value exposed: `NO / NO / NO`.
- No silent rerun: `PASS`; `run-004` was not created.

## 5. Human Review

Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `AUTH_HEAVY_SPIKE_RUN_003_EXECUTION_EVIDENCE`

Verification Method: `EXECUTION_EVIDENCE_REVIEW`

Verification Result: `PASSED`

Execution Evidence: `APPROVED`

Student Notes:

- `run-003` is accepted as the valid production `AUTH_HEAVY` / `SPIKE` execution.
- `run-001` and `run-002` remain preserved as failed pre-execution attempts.
- `run-003` executed exactly one authorized retry after validated remediation.
- Raw JTL, HTML report and resource evidence are present and internally consistent.
- Factual counts are accepted as `2123 total`, `2123 successful`, `0 failed`.
- No SLA, capacity, latency-quality, throughput-quality, bottleneck or regression conclusion is approved at this checkpoint.
- Task 2 remains not started.

This approval is limited to execution/evidence integrity. It does not approve a performance-quality interpretation.

Performance Interpretation: `NOT_PERFORMED`

CHECKPOINT: `RAW_JTL_AVAILABLE`

Next allowed action: finalize the dedicated audit for `run-003` before moving to production `TRANSACTIONAL` / `STRESS`. Do not start Task 2.
