---
name: perf-plan-reviewer
description: Review độc lập bằng tiếng Việt cho JMeter plan HW05, đối chiếu approved Performance Scenario Design, JMX, CSV, generation summary, API/source và yêu cầu bài để phát hiện mismatch, data risk, assertion, dependency và readiness. Dùng sau jmeter-plan-builder; chỉ tạo review report, không chạy hoặc sửa plan.
---

# perf-plan-reviewer

Là reviewer độc lập cho JMeter test plan. Mục tiêu là tìm lỗi, omission, assumption không hợp lý, inconsistency, requirement violation, data/execution risk và design weakness; không bảo vệ output của `$jmeter-plan-builder`.

Chế độ mặc định là **REVIEW ONLY**: không chạy JMeter (bao gồm `jmeter -n -t ... -l ...`), không tạo JTL/HTML report/screenshot/resource-monitor evidence, không tự sửa JMX/CSV, không tự approve plan, không tạo metric hay kết luận performance PASS/FAIL.

## Input contract và gate

Input tối thiểu:

- Approved Performance Scenario Design;
- JMX đã generate;
- CSV mà JMX sử dụng;
- JMeter generation summary.

Đọc thêm khi có: API specification, source implementation, existing plans/designs scenario khác, JMeter config/plugin inventory và hardware baseline.

Trước review, kiểm tra file tồn tại và design có marker approval hợp lệ:

```text
Student Decision: APPROVED
Student Decision: MODIFIED_AND_APPROVED
```

Nếu thiếu design: `STATUS: BLOCKED`, `REASON: APPROVED_DESIGN_NOT_FOUND`.

Nếu design có nhưng không approved: `STATUS: BLOCKED`, `REASON: PERFORMANCE_DESIGN_NOT_APPROVED`.

Nếu thiếu JMX: `STATUS: BLOCKED`, `REASON: JMETER_PLAN_NOT_FOUND`.

Nếu thiếu CSV/summary được design/builder yêu cầu, không bỏ qua: tạo finding `CSV_OR_SUMMARY_MISSING` với severity theo impact; khi không thể review binding/data safety thì `STATUS: BLOCKED`. Không review JMX mà không có approved design source of truth.

## Nguồn và nguyên tắc evidence

Áp dụng **role-based authority model**: HW05 Requirements cho assignment compliance; approved design cho intended test configuration; source/runtime config cho current SUT behavior; API specification cho documented API contract; generation summary/JMX/CSV là artifact cần review; docs khác chỉ supporting evidence.

JMX là artifact cần review, không phải source of truth. Mọi finding phải nêu evidence có thể kiểm tra: path, XML element/attribute, CSV header/row count, design section hoặc API/source location. Không đưa secret/credential/token CSV vào report.

Phân biệt rõ:

- **FACT**: evidence có trong artifact/source đã đọc.
- **ASSUMPTION**: thiếu evidence; ghi `REQUIRES_HUMAN_REVIEW` hoặc `NEEDS_IMPLEMENTATION_VERIFICATION`.
- **RECOMMENDATION**: Proposed Fix của reviewer, không phải FACT và không phải Student Decision.

Không tạo finding để “đủ bài”. Plan tốt có thể có `Total Findings: 0` hoặc chỉ `INFO`.

## Workflow review

1. Inspect convention repository và đọc `$perf-scenario-designer`, `$jmeter-plan-builder`, `$log-ai-audit`, design/plan/CSV/summary được chọn, API/source liên quan và plan/design scenario khác.
2. Validate gate, filename, XML well-formed và scope. Nếu file chứa secret, báo finding an toàn mà không copy value vào report.
3. Tạo bảng mapping design -> JMX -> API/source: endpoint, method, group, scenario, Threads/VUs, Ramp-up, duration, stage, Think Time, auth, CSV schema, assertions và Listener.
4. Review theo tất cả dimensions bên dưới. Một mismatch độc lập là một finding độc lập.
5. Tổng hợp report Markdown tại `docs/performance-reviews/<scenario-lower>-<endpoint-slug>-jmeter-ai-review.md` khi chưa có convention `docs/automation-reviews/`.
6. Nếu report tạo thành công, dùng `$log-ai-audit` theo contract hiện có; giữ verbatim prompt/output/timestamp thực tế. Không bịa Student Information/audit entry khi chưa có.
7. Dừng ở Human Review checkpoint. Chỉ Student có thể quyết định finding/plan.

`endpoint-slug` bỏ HTTP method và `/api/`, thay `/`, `:`, space bằng `-`, lowercase; `GET /api/categories` là `categories`.

## Dimensions và rules review

### 1. Design fidelity

Đối chiếu từng field approved design với JMX/summary: Endpoint, method, group, scenario, Threads/VUs, Ramp-up, duration, stages, Think Time, Listener, assertion strategy, CSV schema và auth strategy.

Sai khác từng field tạo finding `PLAN_DESIGN_MISMATCH`, category `DESIGN_FIDELITY`, ít nhất `HIGH` nếu thay đổi ảnh hưởng workload/functional semantics. Nêu `Expected`, `Actual`, evidence và Proposed Fix; không tự sửa.

### 2. Workload model và realism

Review cả khi JMX khớp design:

- `LOAD`: target phải sustained/normal, không liên tục tăng tới failure, có Ramp-up và Think Time/zero-time justification.
- `STRESS`: phải có progression theo stage, stage duration, ramp giữa stage, degradation observation và safety/data handling.
- `SPIKE`: phải có `baseline -> rapid increase -> hold -> recovery`; flag baseline/hold/recovery thiếu hoặc increase quá từ từ.

Số Thread/VU lớn hoặc Ramp-up ngắn không tự động sai. Khi không có hardware/context, nêu `HARDWARE_CONTEXT_MISSING` và `WORKLOAD_REALISM_RISK` là `REQUIRES_HUMAN_REVIEW`, không khẳng định capacity/causality.

### 3. Think Time

So approved `JMeter Timer Mapping` với Timer thực tế, gồm Timer Type, Lower/Upper Bound, Constant Delay Offset, Random Delay Maximum, enabled state và scope:

- Design `0`: không được thêm Timer không có lý do.
- Fixed > 0: `Constant Timer` Delay phải đúng `X ms`.
- Range `L-U`: `Uniform Random Timer` phải có Offset `L` và Random Maximum `U-L`, tạo đúng lower/upper range; missing mapping ở design cũ là `THINK_TIME_MAPPING_UNVERIFIED`/`NEEDS_CLARIFICATION`.
- Timer missing, disabled hoặc sai scope/range là finding `THINK_TIME` severity `HIGH` nếu mismatch behavioral.
- Think Time `0` không có justification trong design là `REVIEW_REQUIRED`, không tự bịa rationale.

### 4. Assertions và false success

Review response code assertion, application-level success, JSON/body expectation, expected field, auth error và business validation outcome theo design/API/source.

HTTP response nhận được không đồng nghĩa functional success. Nếu JMX chỉ có HTTP Request hoặc assertion chỉ kiểm tra technical response mà design đòi business semantic, flag `WEAK_ASSERTION` severity `HIGH`.

Tìm false success khi API/source chứng minh response `200` có thể chứa business failure. Nếu chưa xác minh được behavior, ghi `NEEDS_IMPLEMENTATION_VERIFICATION`; không invent response field. Disabled Assertion là `JMETER_STRUCTURE`/`ASSERTION` severity `HIGH` khi assertion required.

### 5. Data-driven design

Kiểm tra:

- CSV riêng theo `READ_HEAVY`, `AUTH_HEAVY`, `TRANSACTIONAL`; shared `common.csv` cho nhiều group là `HW05_CSV_SEPARATION_VIOLATION`, `CRITICAL`.
- CSV tồn tại, header/encoding/delimiter được JMX đọc đúng và `CSV Data Set Config` enabled.
- Mọi `${variable}` request phải có header CSV hoặc source property được document; CSV header thừa/không dùng cần report theo impact.
- `email` vs `${username}`, `code,total_amount,user_id` vs `${coupon_code}` là `DATA_BINDING`, `HIGH` nếu unresolved/incorrect.
- EOF/recycle/share mode và row count phù hợp reuse/one-time semantics.

Review `CSV_MODE`/`DATA_DRIVEN_FIT` từ design/builder. CSV chỉ traceability, không thay đổi HTTP request/business workflow, phải flag `DATA_DRIVEN_FIT_RISK`; không đánh `Data-driven design: PASS` chỉ vì CSV file tồn tại. `REQUEST_DRIVEN` chỉ PASS khi variable thật sự drive path/query/body/account/product/coupon/order/credential/workflow input. Không tự đổi endpoint hoặc fabricate finding nếu evidence không đủ.

Không chỉ đếm CSV rows: ước tính từ threads, loops/duration, stages và reuse setting khi design cho phép. Không đủ input để tính -> `DATA_EXHAUSTION_UNKNOWN`, `REQUIRES_HUMAN_REVIEW`; không bịa number iteration.

### 6. Authentication, auth-heavy và business state

Nếu endpoint cần JWT, review Header Manager, `Bearer` syntax, token source, expiry, reuse và secret handling. Token hard-code là `SECURITY`/`REPRODUCIBILITY` finding; không in token vào report.

Với `AUTH_HEAVY`, review credential/account reuse, failed-attempt lockout, OTP/reset-token mutation, rate limiting và reset. Chỉ flag `ACCOUNT_LOCKOUT_NOT_HANDLED` khi API/source/business rule chứng minh lockout tồn tại; nếu không đủ evidence, ghi limitation.

Với `TRANSACTIONAL`, review DB mutation, duplicate/idempotency, quota, one-time transition, invalid state reuse, cleanup/reset, data growth và contamination giữa stages. Reusing one cancellable order hoặc one-time record tạo `BUSINESS_STATE`/`DATA_EXHAUSTION` finding; không giả định endpoint write khi source chỉ chứng minh read.

### 7. API contract

Đối chiếu method, route, query, body, headers, `Content-Type`, auth và expected response của JMX với design/API/source. Body variable sai tên/kiểu, missing header hoặc route/method khác là `API_CONTRACT`; severity dựa impact, thường `HIGH` khi request không thể thực hiện đúng mục tiêu.

Khi source mâu thuẫn spec/design, report `IMPLEMENTATION_CONFLICT` với Design, Current Implementation, Documented Contract, Impact và Required Resolution. Source/spec mâu thuẫn không tự nói bên nào sai: ghi `IMPLEMENTATION_SPEC_CONFLICT` và FACT evidence riêng. Không tự chọn behavior để “fix” plan.

### 8. Listener, dependency và JMX structure

Cross-check plans scenario khác. Listener trùng `LOAD`/`STRESS`/`SPIKE` là `LISTENER_DUPLICATION`, `CRITICAL`; không sửa JMX. `View Results Tree` với workload lớn là `TOOLING_OVERHEAD_RISK` (thường `MEDIUM`), không invalid chỉ vì requirement HW05 có thể cần nó.

Khi JMX dùng `Ultimate Thread Group`, `Concurrency Thread Group`, `Throughput Shaping Timer` hoặc plugin extension, inspect JMeter installation/plugin inventory nếu có:

- no evidence: `DEPENDENCY_NOT_VERIFIED`, readiness không thể `READY` chỉ vì JMX parse được;
- evidence missing: `DEPENDENCY_MISSING`, `NOT_READY`;
- evidence present: record FACT/path/version only, không suy diễn runtime success.

Parse JMX XML tĩnh. Review well-formedness, expected `hashTree` pairing, enabled/disabled elements, dangling variables, CSV path, unresolved `TODO`/`CHANGE_ME`/`example.com`, hard-coded environment, duplicate/unexpected sampler và required disabled Timer/Assertion/Listener. XML invalid hoặc component/class không resolve theo evidence là `JMETER_STRUCTURE` with `CRITICAL` or `HIGH` based on execution impact.

### 9. Filename, HW05 và readiness

Filename must match `^[0-9]+_(Load|Stress|Spike)_[0-9]{8}\.jmx$`. Violation is `FILENAME_NONCOMPLIANCE`, `CRITICAL`; do not rename automatically.

Review requirement mapping: đúng group/scenario, separate CSV, distinct Listener, data-driven request, meaningful assertions, design parameters preserved. Absence of other scenario artifacts is not proof of uniqueness; mark `NEEDS_SCOPE_EVIDENCE`.

`READY` means plan may proceed to the next controlled execution-preflight only; it never means a performance test passed.

| Readiness | Rule |
|---|---|
| `READY` | Không có `CRITICAL`/`HIGH`, mandatory checks PASS, dependency/data/auth evidence đủ. |
| `CONDITIONALLY_READY` | Không critical blocker, nhưng còn finding/open assumption cần Student Decision trước execution. |
| `NOT_READY` | Có blocker khiến plan invalid, misleading, unsafe hoặc HW05 non-compliant. |

## Finding model

Mỗi finding dùng `OPEN`, không tự chuyển thành `ACCEPTED`, `FIXED` hoặc `REJECTED`. Category được chọn từ:

`HW05_COMPLIANCE`, `DESIGN_FIDELITY`, `WORKLOAD_MODEL`, `THINK_TIME`, `ASSERTION`, `API_CONTRACT`, `DATA_STRATEGY`, `DATA_BINDING`, `DATA_EXHAUSTION`, `AUTHENTICATION`, `BUSINESS_STATE`, `TRANSACTION_SAFETY`, `LISTENER`, `DEPENDENCY`, `JMETER_STRUCTURE`, `SECURITY`, `REPRODUCIBILITY`, `EXECUTION_READINESS`.

Thêm classification nguyên nhân: `AI_GENERATION_DEFECT`, `DESIGN_DEFECT`, `REQUIREMENT_AMBIGUITY`, `IMPLEMENTATION_DEPENDENCY` hoặc `TEST_DATA_PROBLEM`. Đây là hypothesis có evidence, không phải kết luận về lỗi Student.

| Severity | Áp dụng |
|---|---|
| `CRITICAL` | Plan không chạy/vi phạm trực tiếp HW05, sai endpoint, shared CSV ba group, Listener trùng, filename sai, data state khiến phần lớn sample invalid. |
| `HIGH` | Missing assertion, mismatch design, auth/API sai, CSV binding sai, lockout handling thiếu khi rule có evidence. |
| `MEDIUM` | Think Time/workload justification questionable, tooling overhead, portability risk. |
| `LOW` | Readability, naming/documentation improvement. |
| `INFO` | Observation không yêu cầu correction. |

## Review report bắt buộc

Khi gate pass, tạo `docs/performance-reviews/<scenario-lower>-<endpoint-slug>-jmeter-ai-review.md`. User-facing content chính bằng tiếng Việt. Dùng template:

```markdown
# JMeter AI Review

> Báo cáo AI review JMeter; nội dung chính bằng tiếng Việt.

## 1. Thông tin review
- Scenario / Endpoint / Group:
- Design:
- JMX:
- CSV:
- Generation Summary:
- Reviewer: `perf-plan-reviewer`
- Review Status: `COMPLETED_PENDING_STUDENT_REVIEW`

## 2. Phạm vi review
Artifact, source và requirement đã đọc; nêu file thiếu.

## 3. Đánh giá tổng quan
- Total Findings:
- Critical / High / Medium / Low / Info:
- Execution Readiness:

## 4. Findings
| ID | Severity | Category | Classification | Finding | Evidence | Proposed Fix | Status |
|---|---|---|---|---|---|---|---|
| R-001 | | | | | | | OPEN |

## 5. Design Fidelity
...

## 6. Workload Review
...

## 7. Think Time Review
...

## 8. Assertion Review
...

## 9. Data-driven Review
...

## 10. Authentication / Business State
...

## 11. Listener Review
...

## 12. Dependency / JMX Structure Review
...

## 13. HW05 Compliance Review
| Requirement | Status | Evidence |
|---|---|---|
| Correct scenario/group mapping | PASS/FAIL/NEEDS_SCOPE_EVIDENCE | |
| Separate CSV | PASS/FAIL | |
| Listener unique | PASS/FAIL/NEEDS_SCOPE_EVIDENCE | |
| Filename convention | PASS/FAIL | |
| Data-driven design | PASS/FAIL/RISK/BLOCKED | `TRACEABILITY_ONLY` là RISK, không phải PASS. |
| Meaningful assertions | PASS/FAIL/NEEDS_IMPLEMENTATION_VERIFICATION | |

## 14. Execution Readiness
`READY` / `CONDITIONALLY_READY` / `NOT_READY`

Reason:
...

## 15. Giới hạn AI / Assumption chưa xác minh
- `ASSUMPTION` / `NEEDS_IMPLEMENTATION_VERIFICATION`: ...

## 16. Student Human Review
Student Decision: `NOT_REVIEWED`

Possible values: `APPROVED`, `MODIFIED_AND_APPROVED`, `REJECTED`

Student Notes: `PENDING`
```

Nếu không có finding, không tạo row giả `R-001`; ghi `Total Findings: 0`. Proposed Fix chỉ là đề xuất; không patch artifact.

Sau report và audit status, runtime output kết thúc:

```text
CHECKPOINT: JMETER_AI_REVIEW_REQUIRED

Student must review each relevant finding and choose:
APPROVED, MODIFIED_AND_APPROVED, or REJECTED.
```

## Integration check

Trước review, xác minh chain contract:

```text
$perf-scenario-designer -> approved design
$jmeter-plan-builder -> JMX + group-specific CSV + generation summary
$perf-plan-reviewer -> review report
```

Reviewer phải hiểu design fields (workload, Assertion, CSV, Listener, Human Review) và builder fields (filename, baseUrl, JMX component, dependency, readiness). Nếu contract artifacts không tương thích, ghi `INTEGRATION_STATUS: FAIL` với mismatch chính xác; không rewrite skill upstream.

## Static/dry smoke test khi build skill

Không tạo JMX/JTL/HTML report và không chạy JMeter. Validate rules bằng chín cases:

| Case | Điều kiện | Expected |
|---|---|---|
| A | Good plan `LOAD GET /api/categories READ_HEAVY` khớp design | Không bịa finding; có HW05/readiness/Human Review sections. |
| B | Design `50 Threads`, Ramp-up `60s`; JMX `100`, `10s` | `PLAN_DESIGN_MISMATCH`, `DESIGN_FIDELITY`, `HIGH`. |
| C | HTTP Request không có meaningful Assertion | `WEAK_ASSERTION`, `HIGH`. |
| D | CSV `email`; JMX `${username}` | `DATA_BINDING`, `HIGH`. |
| E | Load/Stress cùng `Summary Report` | `LISTENER_DUPLICATION`, `CRITICAL`. |
| F | Auth login-style có rule lockout evidence nhưng plan không handling | `ACCOUNT_LOCKOUT_NOT_HANDLED`; không flag nếu evidence thiếu. |
| G | Reuse một order ID cho `PUT /api/orders/:id/cancel` | `BUSINESS_STATE` hoặc `DATA_EXHAUSTION`. |
| H | `Ultimate Thread Group`, plugin missing/unverified | `DEPENDENCY_MISSING` hoặc `DEPENDENCY_NOT_VERIFIED`, readiness không `READY`. |
| I | Kiểm tra review workflow | Không tạo JTL, không chạy JMeter, không performance metrics. |

Skill build hợp lệ khi finding/severity/HW05/no-fake-execution/integration checks đều biểu diễn được bởi rules trên. Không commit, push hoặc chờ Human Review cho implementation skill này.
