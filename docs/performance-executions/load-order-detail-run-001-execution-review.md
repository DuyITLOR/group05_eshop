# Production READ_HEAVY Load Execution Attempt Review

## 1. Thông tin chung

- Endpoint: `GET /api/orders/:id`
- Group: `READ_HEAVY`
- Scenario: `LOAD`
- Student ID: `23127107`
- Run identity: `run-001`
- Approved JMX: `test-plans/23127107_Load_20260812.jmx`
- Approved CSV: `test-data/read-heavy-orders.csv`
- Attempt started: `2026-08-16T00:24:28.906+07:00`
- Failure classification: `EVIDENCE_FAILURE`
- Performance interpretation: `NOT_PERFORMED`

## 2. Mandatory preflight

| Check | Result | Evidence / Note |
|---|---|---|
| Output collision before attempt | `PASS` | `run-001` chưa tồn tại trước khi wrapper tạo evidence directory. |
| Approved artifact fingerprints | `PASS` | JMX, CSV, design, plan review và source fingerprints khớp approved values. |
| JMeter version | `PASS` | JMeter CLI `5.6.3`. Không chạy workload trong version check. |
| Disposable runtime isolation | `PASS` | Fresh `DISPOSABLE_BACKEND_RUNTIME_COPY`; runtime DB thuộc OS temp, không trùng source DB. |
| Exact fixture rows | `PASS` | Đúng `2` rows: `2312710701` và `2312710702`; không thêm measured row. |
| Temporary token provision | `PASS` | Setup-only login cấp token; raw token/hash/Authorization header không được ghi vào evidence. |
| `/api/users/me` | `PASS` | HTTP `200`, `id == 2`. |
| Order `2312710701` smoke check | `PASS` | HTTP `200`, exact fields match, `created_at` non-empty. |
| Order `2312710702` smoke check | `PASS` | HTTP `200`, exact fields match, `created_at` non-empty. |
| Approved workload traceability | `PASS` | `0 -> 5 -> 10 VUs / 120s`, Uniform Random Timer `500-1000 ms`, `Summary Report`. |
| Source DB integrity before workload | `PASS` | SHA-256 giữ nguyên `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| Resource monitor readiness | `FAIL` | Windows trả `Access denied` tại `Get-CimInstance Win32_ComputerSystem`; monitor dừng trước JMeter. |

Chi tiết preflight: `results/23127107_Load_20260812/run-001/evidence/preflight.json`.

## 3. Execution result

JMeter không được chạy vì mandatory resource-monitoring evidence không thể khởi tạo. One-run guard ghi nhận:

| Fact | Value |
|---|---:|
| JMeter invocation count | `0` |
| Rerun count | `0` |
| JMeter exit code | `NOT_AVAILABLE` |
| Raw JTL | `NOT_CREATED` |
| HTML report | `NOT_CREATED` |
| Total samples | `NOT_COMPUTABLE` |
| Successful samples | `NOT_COMPUTABLE` |
| Failed samples | `NOT_COMPUTABLE` |
| Task 2 analysis | `NOT_STARTED` |

Không có p50/p95/p99, Throughput, SLA, capacity hoặc bottleneck conclusion.

## 4. Evidence inventory

- `results/23127107_Load_20260812/run-001/evidence/preflight.json`
- `results/23127107_Load_20260812/run-001/evidence/postflight.json`
- `results/23127107_Load_20260812/run-001/evidence/execution-metadata.json`
- `results/23127107_Load_20260812/run-001/evidence/resource-monitor-stderr.log`
- `results/23127107_Load_20260812/run-001/evidence/resource-monitor-stdout.log`
- `results/23127107_Load_20260812/run-001/evidence/resource-monitor.pid`
- `results/23127107_Load_20260812/run-001/evidence/monitor-load-resources.ps1`
- `results/23127107_Load_20260812/run-001/evidence/backend.pid`
- `results/23127107_Load_20260812/run-001/evidence/backend-stdout.log`
- `results/23127107_Load_20260812/run-001/evidence/backend-stderr.log`

`resource-monitor.csv`, `hardware-context.json` và `resource-summary.json` không được tạo. Không có screenshot hoặc resource measurement giả.

## 5. Cleanup và source integrity

- Temporary external properties file: `DELETED`
- Disposable runtime: `DELETED`
- Backend PID `19900`: `NOT_PRESENT` tại cleanup verification
- Port `3000`: `NOT_LISTENING` tại cleanup verification
- Source database SHA-256 after cleanup: `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`
- Production source modified: `NO`
- Source DB integrity: `PASS`

`postflight.json` ghi `backend_stopped: false` do child-process state chưa phản ánh kịp tại thời điểm serialization. Kiểm tra process/port trực tiếp sau wrapper xác nhận PID không còn và port không còn listener; field gốc được giữ nguyên, không rewrite failure evidence.

## 6. No-rerun status

- No silent rerun: `PASS`
- Workload rerun count: `0`
- `run-001` hiện tồn tại dưới dạng failed pre-execution attempt và không được overwrite.
- Không tự chọn `run-002`; cần Student Human Review trước mọi remediation hoặc execution attempt mới.

## 7. Failure sequence

| Step | Result | Evidence |
|---:|---|---|
| 1. Disposable runtime creation | `PASS` | `preflight.json`: `DISPOSABLE_BACKEND_RUNTIME_COPY`, runtime DB trong OS temp và không trùng source DB. |
| 2. Fixture insertion | `PASS` | Transaction committed; đúng hai fixture IDs `2312710701`, `2312710702`. |
| 3. Token provisioning | `PASS` | Setup-only login cấp temporary external property; token value/hash/header không được ghi. |
| 4. `/api/users/me` verification | `PASS` | HTTP `200`, verified user ID `2`. |
| 5. Order smoke verification | `PASS` | Cả hai order trả HTTP `200`, exact fields match và có `created_at`. |
| 6. Source DB integrity check | `PASS` | Source DB SHA-256 trước workload vẫn là `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`. |
| 7. Monitor startup attempt | `PASS` | PowerShell process được tạo; PID/log files tồn tại và script đã bắt đầu thực thi. |
| 8. Monitor initialization | `FAIL` | `Get-CimInstance Win32_ComputerSystem` trả `Access denied`, HRESULT `0x80041003`. |
| 9. JMeter prevented from starting | `PASS` | Guard dừng trước `runJmeterOnce`; `jmeter_invocation_count=0`. JMeter execution: `NOT_REACHED`. |
| 10. Cleanup | `PASS` | Temporary secret/runtime bị xóa; backend PID và port `3000` không còn; source DB giữ nguyên. |

## 8. Root cause analysis

- Root cause category: `PERMISSION_FAILURE`
- Root cause: Windows CIM provider từ chối quyền truy cập đối với `Get-CimInstance Win32_ComputerSystem` trong execution account hiện tại. `$ErrorActionPreference='Stop'` biến lỗi này thành terminating error, làm monitor exit code `1` trước hardware JSON và sampling loop.
- Primary evidence: `results/23127107_Load_20260812/run-001/evidence/resource-monitor-stderr.log`.
- Source location at failed attempt: preserved `results/23127107_Load_20260812/run-001/evidence/monitor-load-resources.ps1:16`.
- Exact evidence: `PermissionDenied`, HRESULT `0x80041003`, cmdlet `GetCimInstanceCommand`.

Parameter binding, PID argument, output directory và path quoting không phải root cause đã quan sát:

- Stderr hiển thị full script path có spaces và đúng line `16`, chứng minh PowerShell đã load đúng script.
- `resource-monitor.pid` tồn tại và wrapper đã truyền backend PID; failure xảy ra trước old process lookup line `36`.
- Evidence directory và stdout/stderr files được tạo thành công.
- JMeter launcher chưa được gọi, nên JMeter path/argument quoting không tham gia failure sequence.

Contributing tooling limitation: monitor cũ phụ thuộc CIM ngay khi khởi tạo và không có non-CIM path/fallback cho restricted execution account.

## 9. Minimal remediation

Modified file: `scripts/performance/monitor-load-resources.ps1`.

Changes are limited to resource-monitor tooling:

- bỏ các call `Get-CimInstance`;
- lấy system CPU bằng Windows `GetSystemTimes`;
- lấy RAM bằng Windows `GlobalMemoryStatusEx`;
- tiếp tục resolve backend PID/process metrics bằng `Get-Process`;
- validate output directory và backend PID trước sampling;
- ghi unavailable manufacturer/model là `null`, không fabricate;
- giữ timestamp ISO 8601 và interval một giây;
- giữ stop-file termination contract và non-zero exit on real error.

Không sửa:

- `test-plans/23127107_Load_20260812.jmx`;
- `test-data/read-heavy-orders.csv`;
- `docs/performance-design/load-order-detail-design.md`;
- backend source, workload hoặc fixture values.

## 10. Monitor-only validation

- Result: `PASS`
- Classification: `DIAGNOSTIC_ONLY`
- Output: `tmp/hw05-load-monitor-diagnostic-20260816-001/`
- Summary: `tmp/hw05-load-monitor-diagnostic-20260816-001/diagnostic-summary.json`
- Harmless process: temporary Node process, PID `30408`
- Monitor exit code: `0`
- Samples: `3`
- CSV schema: `PASS`
- PID resolution / process alive: `PASS / PASS`
- CPU/RAM structural validation: `PASS / PASS`
- Hardware context: `PASS` via `WINDOWS_NATIVE_API_NO_CIM`
- Diagnostic stderr: empty
- JMeter executed: `NO`
- JTL/HTML created: `NO / NO`
- Performance interpretation: `NOT_PERFORMED`

Diagnostic values only prove monitor output structure and collection viability. They are not production performance evidence and must not enter Task 2.

## 11. Artifact impact

- JMX change required: `NO`
- CSV change required: `NO`
- Design change required: `NO`
- Monitor tooling change required: `YES` (`IMPLEMENTED_AND_VALIDATED`)
- New real run required: `YES`
- Recommended identity: `run-002`
- Retry reason: `RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE`
- Retry authorization: `PENDING_STUDENT_APPROVAL`

## 12. Human Review

Status: `COMPLETE`

Student Decision: `MODIFIED_AND_APPROVED`

Approval scope: `RUN001_FAILURE_TRIAGE_AND_MONITOR_REMEDIATION`

- Run-001: `PRESERVED_FAILED_PRE_EXECUTION_ATTEMPT`
- Failure Classification: `EVIDENCE_FAILURE`
- JMeter Executed: `NO`
- Performance Evidence: `NONE`
- Rerun Required: `YES`
- Rerun Authorization: `PENDING_STUDENT_APPROVAL`
- This decision does not authorize `run-002` execution.

CHECKPOINT: `RETRY_REVIEW_REQUIRED`

Next allowed action: Student review the validated monitor remediation and explicitly approve or reject one new Load execution attempt using `run-002`.
