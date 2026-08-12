# Controlled Stress — Execution Evidence Review

## 1. Phạm vi review

- Review mode: `READ_ONLY`
- Student ID: `23127107`
- Scenario: `STRESS`
- Run: `run-001`
- Approved JMX: `test-plans/23127107_Stress_20260812.jmx`
- Approved CSV: `test-data/transactional.csv`
- Run root: `results/23127107_Stress_20260812/run-001/`
- Performance interpretation: `NOT_PERFORMED`

Review này chỉ xác minh integrity, identity, completeness và traceability của execution evidence. Không chạy JMeter, không tạo lại JTL/HTML, không sửa raw evidence, không tính p95/throughput/capacity và không thực hiện Task 2.

## 2. Raw JTL integrity

| Check | Expected | Actual | Result |
|---|---|---|---|
| Path | `results/23127107_Stress_20260812/run-001/raw/23127107_Stress_20260812_run-001.jtl` | File tồn tại, `700690` bytes | `PASS` |
| SHA-256 | `8DDAFB1DBC7975C26DBD1FAC1680D5F2493E015C5DCA29D8948B96A21936DD66` | `8DDAFB1DBC7975C26DBD1FAC1680D5F2493E015C5DCA29D8948B96A21936DD66` | `PASS` |
| CSV structure | JMeter JTL header | Header có `timeStamp`, `elapsed`, `success`, thread fields và URL | `PASS` |

- `EXECUTION_ARTIFACT_INTEGRITY: PASS`
- `RAW_JTL_IMMUTABILITY: PASS`

Hash được tính lại trực tiếp từ raw JTL trong review này. File không được mở để ghi hoặc normalize.

## 3. Sample integrity

Counts được tính trực tiếp bằng cách parse toàn bộ raw JTL CSV và chỉ phân loại trường `success`; không tính percentile, throughput hoặc metric diễn giải khác.

| Sample count | Expected | Actual | Result |
|---|---:|---:|---|
| Total | `4191` | `4191` | `PASS` |
| Successful (`success=true`) | `4191` | `4191` | `PASS` |
| Failed | `0` | `0` | `PASS` |

- `SAMPLE_COUNTS: PASS`

## 4. HTML report integrity

- Path: `results/23127107_Stress_20260812/run-001/html/index.html`
- Index exists and is non-empty: `PASS` (`9695` bytes).
- Dashboard structure: `PASS`; index contains `Apache JMeter Dashboard`, Start Time and End Time fields.
- Report file count: `127`.
- Same-run traceability: `PASS`. `jmeter-run.log` records that JMeter would generate the report at end of test from the exact run-001 raw JTL, then records `Generating Dashboard` and export to the exact run-001 HTML directory.
- HTML `statistics.json` reports label `POST /api/apply-coupon` and total sample/error counts `4191/0`, matching the raw JTL integrity counts.
- `HTML_REPORT: PASS`

No performance-quality interpretation was taken from the dashboard.

## 5. Resource evidence

Actual files under `results/23127107_Stress_20260812/run-001/evidence/`:

1. `backend.pid`
2. `backend-launch-attempt-1-stderr.log`
3. `backend-launch-attempt-1-stdout.log`
4. `backend-stderr.log`
5. `backend-stdout.log`
6. `execution-metadata.json`
7. `execution-start.json`
8. `hardware-context.json`
9. `jmeter.pid`
10. `jmeter-run.log`
11. `jmeter-stderr.log`
12. `jmeter-stdout.log`
13. `monitor-resources.ps1`
14. `postflight.json`
15. `preflight.json`
16. `resource-monitor.csv`
17. `resource-monitor.pid`
18. `resource-monitor.stop`
19. `resource-monitor-stderr.log`
20. `resource-monitor-stdout.log`
21. `resource-summary.json`
22. `start-backend-preserve-db.js`

Monitoring sufficiency checks:

| Check | Evidence | Result |
|---|---|---|
| System CPU | `resource-monitor.csv` has `system_cpu_percent` | `PASS` |
| System RAM | CSV has used/free physical memory columns | `PASS` |
| Backend process | CSV has PID, alive flag, CPU seconds, working/private memory and thread count | `PASS` |
| Coverage during run | `273` samples from `02:09:00.380+07:00` to `02:15:25.961+07:00`; raw JTL samples span `02:09:05.691` to `02:14:16.521` | `PASS` |
| Backend liveness | `0` samples report backend not alive | `PASS` |
| Hardware/runtime context | `hardware-context.json` records machine, OS, CPU, logical processors and physical RAM | `PASS` |
| Execution logs | JMeter and backend stdout/runtime logs are present; execution metadata records process IDs and artifact paths | `PASS` |

- `RESOURCE_EVIDENCE: PASS`

No screenshot exists. This is recorded as `NOT_CAPTURED_LOG_EVIDENCE_USED`; no fake screenshot or observation was created. The timestamped resource CSV, hardware context, process metadata and runtime logs are sufficient to establish that CPU/RAM/backend monitoring occurred during this run.

## 6. Run identity

| Identity field | Evidence | Result |
|---|---|---|
| Student ID `23127107` | `execution-metadata.json` and plan filename identity | `PASS` |
| Scenario `STRESS` | metadata plus approved JMX Test Plan / Ultimate Thread Group | `PASS` |
| Run `run-001` | run root, metadata `run_id`, raw/HTML/evidence paths | `PASS` |
| Approved JMX | metadata path and SHA-256 `0A8366B53356FFFF5301C49C3F6D0AA671B20EBB152A8288845F533CFE0DBB3E` match current approved file | `PASS` |
| Approved CSV | metadata path and SHA-256 `194B43212CEE61226A52F2CC13A15DE54708FBAD95D31BA54E9286D38D5C3CC2` match current approved file | `PASS` |
| Endpoint | JMX sampler and HTML statistics label are `POST /api/apply-coupon` | `PASS` |

- `RUN_TRACEABILITY: PASS`

## 7. Approved workload traceability

Traceability is based on approved JMX configuration, its recorded SHA-256 in execution-start metadata, and the single JMeter run log that loads that exact plan.

| Approved contract | JMX evidence | Result |
|---|---|---|
| `5 -> 10 -> 20 -> 30 -> 5 VUs` | Four additive Ultimate Thread Group cohorts: `5@0s`, `5@60s`, `10@120s`, `10@180s`, with approved startup/hold/shutdown fields | `PASS` |
| Planned duration `315s` | Cohort A has `15s` startup + `300s` hold; aggregate schedule ends at `315s`; metadata records `approved_duration_seconds=315` | `PASS` |
| Constant Timer `1000 ms` | Enabled `ConstantTimer.delay=1000` in the approved JMX | `PASS` |
| Exact plan used | JMeter log loads `test-plans/23127107_Stress_20260812.jmx`; execution-start hash matches the approved file | `PASS` |

- `APPROVED_WORKLOAD_TRACEABILITY: PASS`

## 8. No silent rerun check

- Repository contains exactly one `.jtl`: the reviewed run-001 raw JTL.
- `results/23127107_Stress_20260812/` contains exactly one run directory: `run-001`.
- Repository logs contain one `Starting standalone test` marker, in run-001 `jmeter-stdout.log`.
- Execution metadata records `rerun_count=0`.
- A live JMeter GUI process predates run-001 and has no listening socket or additional workload log/evidence; it is not evidence of another execution.
- The live Node process is the current Codex session.

- `NO_SILENT_RERUN: PASS`

This conclusion is limited to current repository/runtime evidence. No second real Stress run was found or hidden.

## 9. Execution evidence verdict

| Classification | Result |
|---|---|
| `EXECUTION_ARTIFACT_INTEGRITY` | `PASS` |
| `RAW_JTL_IMMUTABILITY` | `PASS` |
| `HTML_REPORT` | `PASS` |
| `RESOURCE_EVIDENCE` | `PASS` |
| `RUN_TRACEABILITY` | `PASS` |
| `SAMPLE_COUNTS` | `PASS` |
| `PERFORMANCE_INTERPRETATION` | `NOT_PERFORMED` |

This verdict does not classify system capacity, acceptable latency, SLA compliance, regression or bottleneck.

## 10. Human Review

Review Status: `COMPLETED`

Student Decision: `APPROVED`

Student Decision Scope: `CONTROLLED_STRESS_EXECUTION_EVIDENCE`

Student Notes:

- Raw JTL integrity and SHA-256 are accepted.
- Total samples `4191`, successful `4191`, failed `0` are accepted as execution facts only.
- HTML report and resource-monitoring evidence are accepted.
- Approved workload traceability is accepted.
- No silent rerun occurred.
- This approval confirms execution/evidence integrity only.
- No SLA, capacity, p95, throughput-quality, bottleneck, or performance conclusion is made at this checkpoint.
- Performance interpretation belongs to Task 2.

Checkpoint Resolution: `EXECUTION_EVIDENCE_APPROVED`

Post-execution State: `RAW_JTL_AVAILABLE`

Next allowed action: Invoke `$jtl-performance-analyzer` on the immutable run-001 raw JTL when beginning Task 2. Task 2 was not performed while recording this decision.
