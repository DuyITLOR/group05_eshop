# Production READ_HEAVY Load Run-002 Execution Review

## 1. Thông tin chung

- Endpoint: `GET /api/orders/:id`
- Group: `READ_HEAVY`
- Scenario: `LOAD`
- Student ID: `23127107`
- Run identity: `run-002`
- Retry reason: `RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE`
- Previous attempt: `run-001` (`FAILED_PRE_EXECUTION_ATTEMPT`, JMeter not executed)
- Approved JMX: `test-plans/23127107_Load_20260812.jmx`
- Approved CSV: `test-data/read-heavy-orders.csv`
- Performance interpretation: `NOT_PERFORMED`

## 2. Run-001 preservation

- `results/23127107_Load_20260812/run-001/` remains unchanged.
- All `10` run-001 evidence files match the hashes captured during failure triage.
- No raw JTL/HTML was added retroactively to run-001.
- Run-001 classification remains `FAILED_PRE_EXECUTION_ATTEMPT` / `EVIDENCE_FAILURE`.

## 3. Mandatory preflight

| Check | Result | Evidence / Note |
|---|---|---|
| Run-002 collision before setup | `PASS` | `run-002` absent before wrapper creation. |
| Approved JMX fingerprint | `PASS` | `13BBDA897DC17E4907FF1E7BB1C05AD87AE33768D2B896862C18172F61F2D2B7`. |
| Approved CSV fingerprint | `PASS` | `CA8770F8795EC6C7E21DDE68704BE35B19758940B4A41D54D89D0A4FE1D1EECF`. |
| Disposable runtime isolation | `PASS` | Fresh `DISPOSABLE_BACKEND_RUNTIME_COPY`; runtime DB belongs to OS temp copy. |
| Source DB before setup/load | `PASS` | `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| Seeded dedicated user | `PASS` | Runtime-verified user ID `2`. |
| Exact fixture rows | `PASS` | Exactly IDs `2312710701` and `2312710702`; approved field values match. |
| Temporary token provision | `PASS` | Setup-only login; raw token/hash/Authorization header not recorded. |
| `/api/users/me` identity | `PASS` | HTTP `200`, `id == 2`. |
| Order `2312710701` smoke check | `PASS` | HTTP `200`, exact fields match, `created_at` non-empty. |
| Order `2312710702` smoke check | `PASS` | HTTP `200`, exact fields match, `created_at` non-empty. |
| Resource monitor initialization | `PASS` | Native non-CIM monitor, initial sample `1`, backend PID resolved, stderr empty. |
| Approved workload traceability | `PASS` | `0 -> 5 -> 10 VUs / 120s`; Uniform Random Timer `500-1000 ms`; `Summary Report`. |

Preflight evidence:

- `results/23127107_Load_20260812/run-002/evidence/preflight.json`
- `results/23127107_Load_20260812/run-002/evidence/monitor-preflight.json`
- `results/23127107_Load_20260812/run-002/evidence/execution-start.json`

Authentication note: current handler does not enforce authentication/ownership. Preflight does not prove JWT or owner-authorization coverage; the documented `IMPLEMENTATION_SPEC_CONFLICT` remains.

## 4. Execution facts

| Fact | Value |
|---|---:|
| JMeter version | `5.6.3` |
| JMeter exit code | `0` |
| JMeter invocation count | `1` |
| Automatic rerun count | `0` |
| Planned workload duration | `120 seconds` |
| JMeter invocation wall-clock duration | `134.458 seconds` |
| Raw JTL sample timestamp span | `118.071 seconds` |
| Total samples | `1250` |
| Successful samples | `1250` |
| Failed samples | `0` |
| HTML file count | `127` |
| Resource samples | `133` |
| Backend-not-alive resource samples | `0` |

`134.458 seconds` là wall-clock của một JMeter CLI invocation, tính từ lúc process JMeter bắt đầu đến khi process kết thúc. Khoảng này gồm JMeter startup, workload window đã approve và bước sinh HTML dashboard bằng `-e -o`; đây không phải full orchestration duration của disposable-runtime setup/cleanup. Raw JTL có sample timestamp span `118.071 seconds`. Chênh lệch với planned workload window `120 seconds` không được phân loại là performance defect tại checkpoint này.

The sample counts were independently recounted from raw JTL with a structured CSV reader. These are execution facts only. No p50/p95/p99, Throughput quality, SLA, capacity, bottleneck or production-readiness conclusion is made.

## 5. Raw JTL and HTML

- Raw JTL: `results/23127107_Load_20260812/run-002/raw/23127107_Load_20260812_run-002.jtl`
- Raw JTL SHA-256: `35B7055E06C290A43358ECA8380C42F18A04507B0F41F58E23C4F1E31E9F3A66`
- Raw JTL handling: content not rewritten, normalized, sorted or manually edited.
- HTML dashboard: `results/23127107_Load_20260812/run-002/html/index.html`
- HTML readability: `PASS`; Apache JMeter Dashboard marker present.
- HTML provenance: same authorized JMeter invocation using `-l`, `-e` and `-o`; no second workload execution.

## 6. Resource and runtime evidence

- `results/23127107_Load_20260812/run-002/evidence/backend.pid`
- `results/23127107_Load_20260812/run-002/evidence/backend-stdout.log`
- `results/23127107_Load_20260812/run-002/evidence/backend-stderr.log`
- `results/23127107_Load_20260812/run-002/evidence/cleanup-verification.json`
- `results/23127107_Load_20260812/run-002/evidence/execution-metadata.json`
- `results/23127107_Load_20260812/run-002/evidence/execution-start.json`
- `results/23127107_Load_20260812/run-002/evidence/hardware-context.json`
- `results/23127107_Load_20260812/run-002/evidence/jmeter.pid`
- `results/23127107_Load_20260812/run-002/evidence/jmeter-run.log`
- `results/23127107_Load_20260812/run-002/evidence/jmeter-stderr.log`
- `results/23127107_Load_20260812/run-002/evidence/jmeter-stdout.log`
- `results/23127107_Load_20260812/run-002/evidence/jmeter-version-check.log`
- `results/23127107_Load_20260812/run-002/evidence/monitor-load-resources.ps1`
- `results/23127107_Load_20260812/run-002/evidence/monitor-preflight.json`
- `results/23127107_Load_20260812/run-002/evidence/postflight.json`
- `results/23127107_Load_20260812/run-002/evidence/preflight.json`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor.csv`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor.pid`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor.stop`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor-stderr.log`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor-stdout.log`
- `results/23127107_Load_20260812/run-002/evidence/resource-summary.json`
- `results/23127107_Load_20260812/run-002/evidence/run-approved-load-jmeter.ps1`

Resource monitor stderr is empty. No screenshot or resource measurement was fabricated.

## 7. Cleanup and integrity

- Runtime order rows after GET-only workload: exactly `2`, unchanged.
- Concurrent mutating order workflow detected: `NO`.
- Temporary external token properties: `DELETED`.
- Disposable runtime: `DELETED`.
- Backend PID `31600`: `NOT_PRESENT` after cleanup verification.
- Port `3000`: `NOT_LISTENING` after cleanup verification.
- Source DB SHA-256 after cleanup: `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.
- Production source modified: `NO`.
- Source DB integrity after cleanup: `PASS`.
- Secret/JWT pattern scan in run-002 evidence: `PASS` (no raw token found).

`postflight.json` records `backend_stopped:false` because the child state was serialized before Node reflected termination. The separately captured `cleanup-verification.json` confirms the backend PID is absent and port `3000` is closed; the original postflight evidence was not rewritten.

## 8. No-silent-rerun status

- Authorized retry run: `run-002`.
- JMeter invocation count: `1`.
- Automatic rerun count: `0`.
- No silent rerun: `PASS`.
- `run-003`: `NOT_CREATED`.

## 9. Evidence completeness

- Raw JTL: `COMPLETE`
- HTML dashboard: `COMPLETE`
- Resource/hardware evidence: `COMPLETE`
- Execution metadata/logs: `COMPLETE`
- Cleanup/source integrity evidence: `COMPLETE`
- `REAL_EXECUTION_EVIDENCE_COMPLETE: YES`
- Task 2 analysis: `NOT_STARTED`

## 10. Human Review

Review Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `READ_HEAVY_LOAD_RUN_002_EXECUTION_EVIDENCE`

Verification Result: `PASSED`

Execution Evidence: `APPROVED`

Performance Interpretation: `NOT_PERFORMED`

Student Notes:

- `run-002` is accepted as the valid production READ_HEAVY / LOAD execution.
- `run-001` remains preserved as `FAILED_PRE_EXECUTION_ATTEMPT`.
- `run-002` completed exactly one authorized retry after monitor remediation.
- Raw JTL, HTML report and resource evidence are present and internally consistent.
- `1250` total samples, `1250` successful and `0` failed are accepted as factual execution results.
- No SLA, capacity or performance-quality conclusion is made at this checkpoint.
- Task 2 analysis has not yet started.

CHECKPOINT: `RAW_JTL_AVAILABLE`

Next allowed action: Task 2 raw JTL analysis using the approved `run-002` evidence. Do not perform that analysis as part of this Human Execution Review.
