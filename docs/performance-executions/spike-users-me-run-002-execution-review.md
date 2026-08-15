# Production AUTH_HEAVY SPIKE Run-002 Execution Review

## 1. Thong tin chung

- Endpoint: `GET /api/users/me`
- Group / Scenario: `AUTH_HEAVY` / `SPIKE`
- Student ID / Run: `23127107` / `run-002`
- Retry authorization: `APPROVED`
- Retry reason: `RETRY_AFTER_PRE_EXECUTION_ENVIRONMENT_FAILURE`
- Previous run: `run-001` (`FAILED_PRE_EXECUTION_ATTEMPT` / `ENVIRONMENT_FAILURE`), preserved and not modified.
- Execution classification: `FAILED_PRE_EXECUTION_ATTEMPT` / `EVIDENCE_FAILURE`.
- Performance Interpretation: `NOT_PERFORMED`.

## 2. Approved Artifact and Environment Preflight

| Check | Result | Evidence |
| --- | --- | --- |
| Approved JMX / CSV / design / plan-review fingerprints | `PASS` | `execution-metadata.json` records the approved SHA-256 values. |
| JMeter version guard | `PASS` | `jmeter-version-check.log` and `jmeter-version-engine.log` report `5.6.3`. |
| Plugin/class preflight | `PASS` | Remediated diagnostic had verified `jpgc-graphs-basic=2.0`, `jpgc-casutg=3.1.1`, Listener and Ultimate Thread Group classes. |
| Approved workload traceability | `PASS` | Metadata records the exact `5 -> 25 -> 5 VUs` / `68s` profile, Timer, token boundary and Listener. |
| Source DB before and before JMeter | `PASS` | Both SHA-256 values are `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| Disposable runtime / seeded identity / setup-only token / identity / fail-closed check | `PASS` | Runtime was created outside source DB and the failure occurred only after monitor initial sample handling. No secret was recorded. |

## 3. Resource Monitor Failure

- The monitor process created `resource-monitor.csv`, `hardware-context.json`, PID files and one initial valid capture. Its stderr is empty.
- The CSV header is quoted, including `"backend_alive"`. `summarizeResources()` parsed it with `split(",")`, leaving quoted header keys, then dereferenced `item.backend_alive.toLowerCase()`.
- Therefore `item.backend_alive` was `undefined` and the wrapper stopped with `Cannot read properties of undefined (reading 'toLowerCase')`.
- This is a wrapper CSV-parser defect after initial monitor capture, classified as `EVIDENCE_FAILURE`. It is not evidence of a JMeter engine failure, plugin failure, SUT failure or performance result.

## 4. Root Cause and CSV Facts

Root Cause Category: `CSV_HEADER_PARSE_FAILURE` / `PARSER_IMPLEMENTATION_DEFECT`

- Resource CSV: `results/23127107_Spike_20260816/run-002/evidence/resource-monitor.csv`
- Encoding: `UTF-8 with BOM` (`EF BB BF`); delimiter `,`; line endings `CRLF`; file has a trailing newline.
- `RESOURCE_CSV_HEADER`: `timestamp,system_cpu_percent,system_memory_used_bytes,system_memory_free_bytes,backend_pid,backend_alive,backend_cpu_seconds,backend_working_set_bytes,backend_private_memory_bytes,backend_thread_count`
- `RESOURCE_CSV_ROWS`: `1` data row (`2` physical lines including header).
- Quoting behavior: PowerShell `Export-Csv` quoted every header and data field. No PowerShell type/meta lines are present. The row has no empty/null fields; numeric values use `.` as decimal separator.
- First valid data row: timestamp `2026-08-16T03:25:26.7058411+07:00`, CPU `14.35`, backend PID `30600`, backend alive `True`.

Expected Format (old parser): comma-separated text whose header key was exactly `backend_alive` after `split(",")`.

Actual Format: a BOM-prefixed, CRLF-delimited CSV whose lexical header field is `"backend_alive"`. The old `split(",")` parser retained quotation marks in object keys, so `item.backend_alive` was undefined. The failure was not caused by delimiter, locale, empty field, extra PowerShell metadata, or CSV flush timing.

Root Cause Evidence: historical CSV above; empty `resource-monitor-stdout.log` and `resource-monitor-stderr.log`; `execution-metadata.json` failure message; and the former `summarizeResources()` implementation in `scripts/performance/auth-heavy-spike-execute.js`.

## 5. Parser Remediation and Diagnostic Validation

- Modified only `scripts/performance/auth-heavy-spike-execute.js` in its resource-monitor parser/validation path.
- `parseResourceCsv()` now removes a UTF-8 BOM, ignores blank lines, parses quoted CSV fields, requires the exact ten-column monitor schema in the documented order, validates timestamp/numeric/boolean fields, and requires live-backend metrics when `backend_alive` is `true`.
- `summarizeResources()` now receives validated parsed objects. It remains fail-closed when the file has no sample, schema mismatch, malformed quoting, invalid values, or missing live-backend metrics.
- Added `--diagnostic-resource-csv <path>` for a `DIAGNOSTIC_ONLY` parser check; it does not start a backend, monitor, JMeter workload, JTL, or HTML report.

Diagnostic Evidence: `tmp/hw05-spike-monitor-parser-diagnostic-679015b81a5648b0bb314e447942568d/`

| Diagnostic input | Result | Evidence |
| --- | --- | --- |
| Copy of preserved run-002 CSV | `PASS` | Exact ten-column header, one sample, timestamp and CPU/memory/backend fields read, `backend_not_alive_samples: 0`. |
| Header-only CSV | `PASS` (rejected) | `EVIDENCE_FAILURE: resource monitor CSV has no samples`. |
| Wrong-schema CSV | `PASS` (rejected) | `EVIDENCE_FAILURE: resource monitor CSV schema mismatch`. |

Monitor-Parser Pipeline Diagnostic: `NOT_REQUIRED_WITH_JUSTIFICATION`. The actual run-002 monitor already produced the exact PowerShell `Export-Csv` output used for the parser test; exercising a separate monitor against another process would add no schema evidence and is intentionally avoided before retry authorization.

Approved Artifact Impact:

- JMX change required: `NO`.
- Test-data CSV change required: `NO`.
- Design change required: `NO`.
- Execution tooling change required: `YES`.

## 6. Execution Facts

| Fact | Value |
| --- | --- |
| JMeter invocation count | `0` |
| Automatic rerun count | `0` |
| JMeter exit status | `NOT_AVAILABLE` |
| Raw JTL / SHA-256 | `NOT_CREATED` / `NOT_AVAILABLE` |
| HTML report | `NOT_CREATED` |
| Resource monitor CSV | `CREATED` (one initial sample only) |
| Total / successful / failed samples | `NOT_COMPUTABLE / NOT_COMPUTABLE / NOT_COMPUTABLE` |
| Actual measured duration | `NOT_COMPUTABLE` |

No measured SPIKE workload occurred. No latency, percentile, Throughput, SLA, capacity, bottleneck, regression or production-readiness conclusion is permitted.

## 7. Cleanup and Safety

- Source DB integrity after stop: `PASS`; SHA-256 remains `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.
- Temporary external token property: deleted.
- Disposable runtime: deleted.
- JWT / password value / reset-token value exposed: `NO / NO / NO`.
- No silent rerun: `PASS`.
- Raw `postflight.json` records `backend_stopped: false` at its capture time. A later read-only PID check found neither the backend PID nor the monitor PID running; raw evidence remains immutable.

## 8. Evidence Inventory

- `results/23127107_Spike_20260816/run-002/evidence/execution-metadata.json`
- `results/23127107_Spike_20260816/run-002/evidence/resource-monitor.csv`
- `results/23127107_Spike_20260816/run-002/evidence/hardware-context.json`
- `results/23127107_Spike_20260816/run-002/evidence/jmeter-version-check.log`
- `results/23127107_Spike_20260816/run-002/evidence/jmeter-version-engine.log`
- `results/23127107_Spike_20260816/run-002/evidence/postflight.json`
- `results/23127107_Spike_20260816/run-002/evidence/cleanup-verification.json`

## 9. Human Review

Status: `MODIFIED_AND_APPROVED`

Student Decision: `MODIFIED_AND_APPROVED`

Decision Scope: `AUTH_HEAVY_SPIKE_RUN_002_EVIDENCE_PARSER_REMEDIATION`

Parser Remediation: `PASS`

Parser Diagnostic: `PASS`

This approves only the execution-evidence parser remediation. It does not reclassify `run-002`, authorize a rerun of `run-002`, authorize `run-003`, or establish a performance result.

CHECKPOINT: `RETRY_REVIEW_REQUIRED`

Next allowed action: Student authorize or reject exactly one new production SPIKE attempt using `run-003`.
