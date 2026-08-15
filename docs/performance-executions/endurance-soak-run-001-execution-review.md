# Báo cáo rà soát thực thi Endurance / Soak run-001

## 1. Phạm vi và phân loại artifact

- Run: `run-001`
- Endpoint: `GET /api/orders/:id`
- JMX: `test-plans/supporting/23127107_Endurance_20260816.jmx`
- CSV tái sử dụng: `test-data/read-heavy-orders.csv`
- Phân loại: `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT`
- Thành viên tập artifact nộp cuối: `EXCLUDED_FROM_FINAL_3_JMX_JTL_HTML_SET`
- Mục đích: xác minh evidence thực thi cho thiết kế Endurance/Soak hỗ trợ Task 1; không tạo scenario thứ tư cho production matrix.

Run này được Student ủy quyền đúng một lần sau khi preflight bắt buộc đạt `PASS`. Không tạo `run-002`, không sửa ba production JMX/JTL/HTML, và không thực hiện Task 2 performance interpretation trong tài liệu này.

## 2. Preflight và tính toàn vẹn artifact đã duyệt

Nguồn: `results/supporting-endurance/23127107_Endurance_20260816/run-001/evidence/preflight.json`.

| Kiểm tra | Kết quả |
| --- | --- |
| JMeter version guard | `PASS` - `5.6.3` |
| `jpgc-casutg` | `PASS` - `3.1.1` |
| Disposable runtime | `PASS` - `DISPOSABLE_BACKEND_RUNTIME_COPY` |
| Source database SHA-256 trước / ngay trước JMeter | `PASS` - đều là `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6` |
| Supporting JMX, reused CSV, design, static review fingerprint | `PASS` |
| Ba final production JMX fingerprint | `PASS` - không thay đổi |
| Fixture cô lập | `PASS` - `2312710701`, `2312710702`; user `2`; trạng thái `pending` |
| Smoke endpoint setup-only | `PASS` - `GET /api/orders/2312710701`, HTTP `200`, field chính xác |
| Authentication theo handler source hiện tại | `NOT_APPLICABLE` - không dùng token |
| Resource monitor/parser ban đầu | `PASS` |

Sau cleanup, source database giữ nguyên cùng SHA-256. Kiểm chứng cleanup độc lập ghi tại `evidence/cleanup-verification.json`: backend PID và monitor PID đã dừng, port backend không còn listener, runtime copy đã bị xóa.

## 3. Workload và traceability

Approved workload trong JMX là `60s` ramp-up, `10 VUs` steady `600s`, `60s` ramp-down, tổng kế hoạch `720s`, với `Uniform Random Timer 500-1000ms`.

Evidence thực tế trong raw JTL xác nhận `allThreads` tối đa là `10`; steady hold bắt đầu tại `2026-08-15T23:16:59.071Z` và kéo dài đến `2026-08-15T23:26:59.071Z`. Trong đúng steady interval 600 giây, số sample có `allThreads != 10` là `0`. Xem `evidence/timeline-alignment-verification.json`.

JMeter process chạy từ `2026-08-15T23:15:55.814Z` đến `2026-08-15T23:28:09.589Z`, tương ứng `733.775` giây. Đây là fact về process interval, bao gồm overhead khởi chạy/dashboard; profile được đối chiếu từ approved JMX và trường `allThreads`, không suy diễn từ tên file hay process duration.

## 4. Evidence thực thi

| Hạng mục | Kết quả |
| --- | --- |
| JMeter exit code | `0` |
| JMeter invocation count | `1` |
| Automatic rerun count | `0` |
| No silent rerun | `PASS`; `run-002` không tồn tại |
| Raw JTL | `results/supporting-endurance/23127107_Endurance_20260816/run-001/raw/23127107_Endurance_20260816_run-001.jtl` |
| Raw JTL SHA-256 | `2B4E8A398EAD44F438B11D83758B6087E31B298D6DDA48A678DF43D9E7DF4B10` |
| HTML report | `results/supporting-endurance/23127107_Endurance_20260816/run-001/html/index.html` |
| HTML provenance | `PASS` - tạo trong cùng JMeter invocation với raw JTL |
| Resource evidence | `results/supporting-endurance/23127107_Endurance_20260816/run-001/evidence/resource-monitor.csv` |
| Resource continuity | `PASS` - `725` samples; `0` backend-not-alive samples |

Raw JTL có `8740` samples toàn run, gồm `8740` successful và `0` failed. Các dữ liệu toàn run này được giữ riêng với mẫu của steady measurement window để tránh nhập nhằng phạm vi tính threshold.

## 5. Đánh giá threshold Endurance đã được Student duyệt

Nguồn threshold: `AI_PROPOSED_AND_STUDENT_APPROVED`. Đây là threshold riêng cho Endurance Task 1, không phải official SLA, không phải capacity claim, và không phải kết luận Task 2.

Window được neo vào sample đầu tiên có `allThreads=10` trong raw JTL bất biến:

- Measured steady window: `2026-08-15T23:16:59.071Z` đến `2026-08-15T23:26:59.071Z`.
- Early window: `2026-08-15T23:17:59.071Z` đến `2026-08-15T23:19:59.071Z`.
- Late window: `2026-08-15T23:23:59.071Z` đến `2026-08-15T23:26:59.071Z`.

| Tiêu chí được duyệt | Số liệu dẫn xuất | Tính toán | Kết quả |
| --- | --- | --- | --- |
| Response stability | early p95 `3 ms`; late p95 `2 ms` | `2 / 3 = 0.666667 <= 1.25` | `STABLE_WITHIN_PROPOSED_THRESHOLD` |
| Resource stability | early median RSS `66072576`; late median RSS `67371008` bytes | `67371008 / 66072576 = 1.019652 <= 1.15` | `STABLE_WITHIN_PROPOSED_THRESHOLD` |
| Backend restart | resource monitor liên tục | `0` restart | `PASS` |
| Error stability | steady window `7962` total / `7962` successful / `0` failed | failed `= 0` | `PASS` |

Tệp dẫn xuất: `results/supporting-endurance/23127107_Endurance_20260816/run-001/evidence/endurance-threshold-calculation.json`. Cửa sổ ban đầu theo mốc process invocation đã được thay bằng mốc `allThreads=10` từ raw JTL; chỉ evidence dẫn xuất được cập nhật, raw JTL và HTML report không bị sửa đổi.

Kết quả tổng hợp threshold đã duyệt: `STABLE_WITHIN_PROPOSED_THRESHOLD`.

## 6. An toàn dữ liệu và giới hạn kết luận

- Source database integrity sau cleanup: `PASS`.
- Disposable runtime và temporary non-secret properties: `DELETED`.
- JWT, password, reset token, và secret property value exposure: `NO`.
- Không có silent rerun hoặc retry.
- Không diễn giải SLA, capacity, throughput quality, bottleneck, regression, hay chất lượng hiệu năng tổng quát.
- Task 2: `NOT_STARTED`.

## 7. Human Review

Review Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `TASK1_ENDURANCE_SOAK_RUN_001_EXECUTION_EVIDENCE`

Verification Method: `EXECUTION_EVIDENCE_REVIEW`

Verification Result: `PASSED`

Execution Evidence: `APPROVED`

Endurance Stability Evaluation: `APPROVED`

### Student Notes

- Xác nhận đúng một Endurance workload đã được thực thi: `run-001`, JMeter invocation count `1`, automatic rerun count `0`, và `run-002` không tồn tại.
- Phân loại `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT` cùng `EXCLUDED_FROM_FINAL_3_JMX_JTL_HTML_SET` được giữ nguyên; ba artifact production LOAD/SPIKE/STRESS giữ nguyên fingerprint đã preflight.
- Traceability workload `60 / 600 / 60` được chấp nhận: raw JTL có `0` non-10-VU samples trong steady hold 600 giây.
- Full-run counts `8740 / 8740 / 0` và measured-soak counts `7962 / 7962 / 0` được chấp nhận.
- Response ratio `0.666667` thỏa criterion Student-approved `<= 1.25`; RSS ratio `1.019652` thỏa criterion Student-approved `<= 1.15`; backend restart count là `0`.
- Kết quả Endurance `STABLE_WITHIN_PROPOSED_THRESHOLD` được chấp nhận trong phạm vi coursework threshold. Đây không phải SLA, production-readiness verdict, capacity proof, hoặc kết luận không có memory leak/bottleneck.
- Task 2 giữ `NOT_STARTED`.

CHECKPOINT: `TASK1_COMPLETE_TASK2_READY`

Next Allowed Action: Thực hiện dedicated AI Audit catch-up cho các substantive interaction TRANSACTIONAL/STRESS và Endurance còn thiếu trước khi bắt đầu Task 2.
