# JMeter AI Review

> Báo cáo AI review JMeter; nội dung chính bằng tiếng Việt.

## 1. Thông tin review

- Scenario / Endpoint / Group: `STRESS` / `POST /api/apply-coupon` / `TRANSACTIONAL`
- Design: `docs/performance-design/stress-apply-coupon-design.md`
- JMX: `test-plans/23127107_Stress_20260812.jmx`
- CSV: `test-data/transactional.csv`
- Generation Summary: `docs/jmeter-generation/23127107-stress-generation-summary.md`
- Reviewer: `perf-plan-reviewer`
- Review Status: `COMPLETED_STUDENT_APPROVED`
- Review Revision: `2` (sau `Student Decision: APPROVE_DATA` cho đề xuất R-001)

## 2. Phạm vi review

Đã đọc approved design, JMX, CSV đã populate, generation summary, proposal dữ liệu đã được Student approve, `api_specification.md`, `backend/server.js`, `backend/database.js`, `README.md`, current SQLite data ở chế độ read-only, JMeter `5.6.3` plugin inventory và contract HW05. Review chỉ parse/inspect tĩnh; không chạy JMeter, không gọi endpoint và không tạo execution evidence.

## 3. Đánh giá tổng quan

- Total Findings: `3`
- Critical: `0`
- High: `0`
- Medium: `1`
- Low: `0`
- Info: `2`
- Execution Readiness: `CONDITIONALLY_READY`
- Plan correctness: workload/request/assertion/dependency mapping tĩnh đạt; two approved success-path rows are request-driven and source-backed. Runtime coupon/quota precheck remains mandatory immediately before a real execution.

## 3A. Resolution of Prior R-001

| Prior finding | Resolution status | Evidence | Residual control |
|---|---|---|---|
| `R-001` (`HIGH` / `DATA_STRATEGY`) | `RESOLVED_BY_REVIEW_EVIDENCE` | `test-data/transactional.csv` has exactly two approved rows; both are `SAVE10,500000,<user_id>,success_path_save10,...`. Current read-only SQLite snapshot shows active `SAVE10`, minimum `300000`, expiry `2099-12-31`, usage `0/1` for user IDs `1` and `2`. JMX binds the first three CSV columns into the JSON body. | Immediately before any real run, perform the documented read-only coupon/quota precheck. No JMeter execution has verified a runtime response. |

## 4. Findings

| ID | Severity | Category | Classification | Finding | Evidence | Proposed Fix | Status |
|---|---|---|---|---|---|---|---|
| R-002 | MEDIUM | WORKLOAD_MODEL | REQUIREMENT_AMBIGUITY | Chưa có hardware baseline/SLA để xác minh 30 VUs là workload thực tế hoặc đặt threshold p95/error. | Approved design mục 4/5/11; generation summary mục 3/10. | Thu thập hardware baseline và baseline run đã được duyệt trước khi diễn giải capacity hoặc đặt threshold. | OPEN |
| R-003 | INFO | HW05_COMPLIANCE | REQUIREMENT_AMBIGUITY | `Aggregate Report` đúng approved STRESS design, nhưng uniqueness toàn HW05 chưa được chứng minh do thiếu production LOAD/SPIKE artifacts. | Approved design mục 8/12; generation summary mục 6/9. | Re-check project matrix sau khi production LOAD/SPIKE designs/plans được chọn. | OPEN |
| R-004 | INFO | API_CONTRACT | IMPLEMENTATION_DEPENDENCY | Plan cố ý theo current handler: không JWT và dùng success data `total_amount > min_order_amount`; README lại yêu cầu JWT và mô tả `>=`. | `backend/server.js:363-439`; `README.md:112-120`; generation summary mục 4. | Giữ discrepancy trong Human Review/AI Critique và quyết định lại khi chọn final HW05 endpoint; không tự sửa plan/SUT trong review này. | OPEN |

## 5. Design Fidelity

| Field | Approved Design | JMX / Summary | Status |
|---|---|---|---|
| Method / route | `POST /api/apply-coupon` | HTTP sampler `POST`, path `${baseUrl}/api/apply-coupon` | PASS |
| Group / scenario | `TRANSACTIONAL` / `STRESS` | Test Plan và generation summary khớp | PASS |
| Target VUs | `5 -> 10 -> 20 -> 30 -> 5` | Bốn additive cohorts tổng 5/10/20/30/5 | PASS |
| Duration | `315s` | Maximum cohort end `315s` | PASS |
| Think Time | Constant `1000 ms` | Enabled Constant Timer `1000` trong Thread Group scope | PASS |
| CSV schema | 5 approved columns | Header và `variableNames` khớp | PASS |
| Assertions | HTTP 200, success true, 4 required fields | Response + JSONPath Assertions khớp | PASS |
| Listener | Aggregate Report | Enabled `StatVisualizer` / `Aggregate Report` | PASS |
| Authentication | Current implementation, no JWT | Không có Authorization Header | PASS |

## 6. Workload Review

Ultimate Thread Group dùng cohort, không cộng nhầm target stage thành `5 + 10 + 20 + 30`:

| Cohort | Threads | Delay | Startup | Hold | Shutdown | Active profile contribution |
|---|---:|---:|---:|---:|---:|---|
| A | 5 | 0s | 15s | 300s | 0s | ramp 0-15s, giữ 5 tới 315s |
| B | 5 | 60s | 15s | 165s | 15s | ramp 60-75s, giữ tới 240s, shutdown 240-255s |
| C | 10 | 120s | 15s | 105s | 15s | ramp 120-135s, giữ tới 240s, shutdown 240-255s |
| D | 10 | 180s | 15s | 45s | 15s | ramp 180-195s, giữ tới 240s, shutdown 240-255s |

Aggregate profile khớp `0 -> 5`, `5`, `5 -> 10`, `10`, `10 -> 20`, `20`, `20 -> 30`, `30`, `30 -> 5`, `5` trên đúng các phase tới 315s. `Shutdown Time=0` của cohort A không tạo phép chia cho zero trong installed component; bytecode tính shutdown contribution bằng phép nhân với field này. `WORKLOAD_MAPPING: PASS`.

R-002 vẫn mở vì profile là recommendation chưa có hardware/SLA, không phải capacity claim.

## 7. Think Time Review

- Timer Type: `Constant Timer` - PASS.
- Delay: `1000 ms` - PASS.
- Enabled: `true` - PASS.
- Scope: con trực tiếp của Ultimate Thread Group, áp dụng cho HTTP sampler duy nhất - PASS.
- Lower/Upper Bound: `1000/1000 ms` - PASS.

## 8. Assertion Review

- HTTP `200`: enabled Response Assertion - PASS.
- Business `success: true`: enabled JSONPath Assertion `$.success` - PASS.
- Field existence: `$.coupon_id`, `$.discount_amount`, `$.final_amount`, `$.message` - PASS.
- Không có exact numeric discount Assertion - khớp approved design.
- Không trộn intentional `400`/`404` vào primary sampler - PASS.

## 9. Data-driven Review

- CSV_MODE: `REQUEST_DRIVEN` - PASS.
- DATA_DRIVEN_FIT: `PASS`; `${code}`, `${total_amount}`, `${user_id}` thực sự drive JSON body.
- `${coupon_case}` và `${iteration_key}` không xuất hiện trong JSON body - PASS.
- CSV path/schema/delimiter/encoding và variable names - PASS.
- Primary Dataset intent: `SUCCESS_PATH_ONLY` - PASS về configuration và current rows.
- Actual data readiness: `PASS` for the two approved source-backed rows; `R-001` is resolved by this static review revision.
- CSV has exactly `1` header row and `2` data rows: `SAVE10,500000,1,success_path_save10,save10-user-1` and `SAVE10,500000,2,success_path_save10,save10-user-2`.
- Both rows use `total_amount 500000 > SAVE10.min_order_amount 300000`; neither is the excluded equality boundary.
- JMX keeps `recycle=true`, `stopThread=false`, and `shareMode.all`. This supports reuse of the two rows for the current read-only handler, not a claim that runtime state cannot change.

## 10. Authentication / Business State

- Current `POST /api/apply-coupon` handler không gắn `authenticateToken`; JMX không gửi JWT - PASS theo approved `CURRENT_IMPLEMENTATION_BEHAVIOR`.
- `IMPLEMENTATION_DOCUMENTATION_DISCREPANCY` được giữ lại trong summary và R-004.
- Handler apply-coupon đọc `coupons`/`coupon_usage`, không tự insert usage; `/api/coupon-usage` là route ghi riêng - PASS.
- Current read-only SQLite snapshot has no `coupon_usage` row for `SAVE10` / user `1` or `2`, so both candidate combinations are `0 < max_uses_per_user 1` at review time.
- Existing quota/coupon state vẫn có thể đổi outcome. `REQUIRED_RUNTIME_PRECHECK: YES` immediately before a real execution; this is a mandatory control, not execution evidence.

## 11. Listener Review

- Primary Listener: `Aggregate Report` - PASS theo approved design.
- Enabled component: `ResultCollector` với `StatVisualizer` - PASS.
- Global Listener Uniqueness: `NEEDS_SCOPE_EVIDENCE` / R-003; không giả PASS khi production LOAD/SPIKE chưa đủ.

## 12. Dependency / JMX Structure Review

- JMeter installation: `D:\Tools\apache-jmeter-5.6.3` (`5.6.3`).
- Plugin artifact: `jmeter-plugins-casutg-3.1.1.jar`, version metadata `3.1.1` - VERIFIED.
- Plugins Manager: `jmeter-plugins-manager-1.12.jar` - AVAILABLE.
- Ultimate Thread Group class/GUI class tồn tại trong plugin jar - VERIFIED.
- Student GUI verification: component xuất hiện và mở được - PASS supporting runtime evidence.
- XML well-formed, filename regex, test element/hashTree pairing, class name, four schedule records, Timer, sampler, Assertions, Listener và absence of unresolved secret placeholders đều static PASS.
- `DEPENDENCY_STATUS: VERIFIED`.

## 13. HW05 Compliance Review

| Requirement | Status | Evidence |
|---|---|---|
| Correct scenario/group mapping | PASS | Controlled scope: `TRANSACTIONAL -> STRESS`. |
| Project group/scenario uniqueness | NEEDS_SCOPE_EVIDENCE | Production READ_HEAVY/AUTH_HEAVY artifacts chưa đủ. |
| Separate CSV | PASS | `test-data/transactional.csv`. |
| Listener unique | NEEDS_SCOPE_EVIDENCE | Aggregate Report đúng STRESS; project uniqueness chưa chứng minh. |
| Filename convention | PASS | `23127107_Stress_20260812.jmx`. |
| Data-driven design | PASS | Ba request fields lấy từ CSV; trace-only fields không gửi. |
| Actual data readiness | PASS | CSV has two Student-approved, source-backed, success-path rows; runtime precheck remains mandatory. |
| Meaningful assertions | PASS | HTTP, application success và response fields. |

## 14. Execution Readiness

`CONDITIONALLY_READY`

Reason: JMX, CSV binding, assertions, dependency mapping and two approved success-path rows pass static review. `R-001` no longer blocks this plan. The plan is not auto-approved: `R-002`, `R-003`, `R-004`, the implementation/documentation discrepancy, and the mandatory read-only coupon/quota precheck remain for Student Human Plan Review. `CONDITIONALLY_READY` only permits the next controlled preflight after approval; it is not real-execution evidence or a performance result.

## 15. Giới hạn AI / Assumption chưa xác minh

- `REQUIRES_HUMAN_REVIEW`: approved candidate data was verified only against a read-only current snapshot; coupon active/expiry and quota must be rechecked immediately before run.
- `ASSUMPTION`: chưa có hardware baseline/SLA, không kết luận capacity hay threshold.
- Review không mở JMX bằng GUI và không chạy JMeter; class/component availability dựa trên jar inventory, bytecode/static XML và Student GUI verification.
- Không có production LOAD/SPIKE evidence đủ để kết luận global Listener uniqueness.

## 16. Student Human Review

Student Decision: `APPROVED`

Possible values: `APPROVED`, `MODIFIED_AND_APPROVED`, `REJECTED`

Approval Scope: `CONTROLLED_STRESS_EXECUTION`

Student Notes:

- R-001 is resolved with the two approved source-backed success-path rows.
- R-002 is accepted as a non-blocking limitation; 30 VUs is not a capacity claim and no p95/error SLA is claimed before real evidence.
- R-003 remains pending until production LOAD/SPIKE artifacts exist.
- R-004 remains a documented implementation/documentation discrepancy.
- Immediately before real execution, perform a read-only runtime precheck for SAVE10 active/expiry state and quota for user IDs 1 and 2.
- Final HW05 Transactional Endpoint remains `NOT_YET_APPROVED`.

| Finding | Student disposition |
|---|---|
| `R-001` | `RESOLVED` |
| `R-002` | `ACCEPTED_NON_BLOCKING` |
| `R-003` | `DEFERRED_PROJECT_LEVEL_CHECK` |
| `R-004` | `ACCEPTED_DOCUMENTED_DISCREPANCY` |

Required Preflight: `YES` — immediately before the approved controlled Stress execution, perform the documented read-only `SAVE10` active/expiry and quota precheck for user IDs `1` and `2`.

CHECKPOINT RESOLUTION: `PLAN_APPROVED`

CHECKPOINT: `REAL_EXECUTION_REQUIRED`
