---
name: jmeter-plan-builder
description: Chuyển Performance Scenario Design HW05 đã được Human Review và APPROVED thành JMeter test plan `.jmx`, CSV riêng theo endpoint group và generation summary bằng tiếng Việt. Dùng khi cần build hoặc kiểm tra JMeter plan từ design đã approved; không dùng để thiết kế lại workload, chạy JMeter hay tạo execution evidence.
---

# jmeter-plan-builder

Chuyển **một** Performance Scenario Design đã được phê duyệt thành artifact JMeter có thể review. Đây là bước build plan, không phải real execution: không chạy `jmeter`, không tạo `.jtl`, HTML report, screenshot hay kết luận performance PASS/FAIL.

## Input contract

Nhận một trong hai loại input:

- Đường dẫn đến Performance Scenario Design đã approved; hoặc
- `Scenario`, `Endpoint`, `Student ID`, `Execution Date` để tìm chính xác một design phù hợp.

`Student ID` và `Execution Date` là bắt buộc trước khi tạo filename `.jmx`. Execution Date phải là ngày thật do user cung cấp, định dạng `YYYY-MM-DD`, rồi chuyển thành `YYYYMMDD`. Không suy ra từ ngày máy, Git history hoặc ví dụ trong tài liệu. Thiếu một trong hai trả về `STATUS: NEEDS_CLARIFICATION` và không tạo plan.

Đọc thêm khi có: API specification, source/config, base URL, strategy authentication, CSV hiện có, JMeter installation/version và plugin inventory. Không giả định các input này tồn tại.

## Thứ tự nguồn và quy trình

1. Inspect cấu trúc repository, `agent-skills/`, `docs/performance-design/`, `test-plans/`, `test-data/`, `docs/jmeter-generation/`, API specification, source/config và `$log-ai-audit`.
2. Đọc đầy đủ design được chọn, các design/plan scenario khác và các CSV liên quan. Không sửa `$perf-scenario-designer` hay design upstream chỉ để làm plan dễ hơn.
3. Xác minh approval gate trước mọi thao tác tạo `.jmx`, CSV production hoặc generation summary production.
4. Chỉ sau gate, đối chiếu theo **role-based authority model**: HW05 Requirements cho assignment compliance; approved design cho intended test configuration; source/runtime config cho current SUT behavior; API specification cho documented contract; docs khác supporting evidence. Không dùng một priority list để silently chọn behavior.
5. Nếu design mâu thuẫn API/source, không silently fix. Trả về hoặc ghi trong summary:

```text
IMPLEMENTATION_CONFLICT
Design says: ...
Implementation says: ...
Documented Contract: ...
Impact: ...
Proposed resolution: ...
```

Nếu source khác API specification, ghi `IMPLEMENTATION_SPEC_CONFLICT` với Current behavior FACT, Documented behavior FACT, Impact và Required Resolution. Nếu conflict làm request, Assertion, auth hoặc data safety không thể xây dựng an toàn, dừng `STATUS: BLOCKED`.
6. Validate toàn bộ plan tĩnh; chỉ khi tất cả critical checks pass mới ghi JMX/CSV/summary. Không dùng execution để validate.
7. Nếu artifact được tạo, gọi `$log-ai-audit` theo contract của nó. Preserve verbatim prompt/output/timestamp thực tế. Không tạo audit format mới hoặc bịa Student Information/audit entry.
8. Kết thúc tại Human Review checkpoint, không chạy JMeter và không tự approve plan.

## Approval gate bắt buộc

Chỉ accept chính xác một trong các marker trong **design được chọn**:

```text
Student Decision: APPROVED
Student Decision: MODIFIED_AND_APPROVED
```

Các marker `PENDING`, `NOT_REVIEWED`, `REJECTED`, marker thiếu, hoặc approval chỉ tồn tại ở file khác đều không đạt. Không diễn giải `Status: PENDING` là approved.

Khi không đạt:

```text
STATUS: BLOCKED
REASON: PERFORMANCE_DESIGN_NOT_APPROVED
AFFECTED_FILE: <design path>
REQUIRED_USER_ACTION: Student hoàn tất Human Review và ghi approval hợp lệ trong design.
CAN_CONTINUE: Chỉ static analysis; không tạo production JMX/CSV/summary.
```

Approval gate áp dụng khi dùng skill, không áp dụng cho việc build `SKILL.md` này.

## Quy tắc output và filename

Ưu tiên convention repository. Khi chưa có output convention phù hợp, dùng:

```text
test-plans/{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx
test-data/{group-lower-hyphen}.csv
docs/jmeter-generation/{studentid}-{scenario-lower}-generation-summary.md
```

`ScenarioType` filename phải là `Load`, `Stress`, hoặc `Spike`. Ví dụ hợp lệ: `23127107_Load_20260812.jmx`. Regex kiểm tra: `^[0-9]+_(Load|Stress|Spike)_[0-9]{8}\.jmx$`.

Filename khác regex là `COMPLIANCE_CHECK: FAIL`; không đổi ID/date/scenario input để làm nó pass. Không tạo thư mục `.jtl` hay HTML report rỗng để giả execution.

## Bảo toàn approved design

Extract và đối chiếu nguyên văn các field design: Endpoint/method, group, scenario, Threads/VUs, Ramp-up, Duration, Stages, Think Time, CSV schema, Assertions, Listener và auth strategy. Giá trị plan phải khớp design approved; không tự tăng/giảm VU, đổi duration/ramp/Think Time, remap scenario hay đổi Listener.

Consume `JMeter Timer Mapping` approved design đúng nguyên văn: `0 -> NONE`; fixed `X ms -> Constant Timer Delay X`; range `L-U ms -> Uniform Random Timer Constant Delay Offset L, Random Delay Maximum U-L`. Verify Timer Type, Lower/Upper Bound, parameters, enabled state và scope. Design cũ/range không có `Mapping Status: PASS` trả `NEEDS_CLARIFICATION`; không tự chọn mapping sau approval.

## Kiểm tra mapping HW05

Đọc toàn bộ design và plan hiện có. Enforce:

| Check | Điều kiện |
|---|---|
| Group | `READ_HEAVY`, `AUTH_HEAVY`, `TRANSACTIONAL` mỗi group đúng một scenario. |
| Scenario | `LOAD`, `STRESS`, `SPIKE` mỗi scenario đúng một group. |
| CSV | Mỗi group dùng CSV riêng; không dùng `common.csv` cho tất cả. |
| Listener | Ba scenario dùng ba primary Listener/report view khác nhau. |

Nếu approved design yêu cầu Listener đã được scenario khác dùng, trả `STATUS: LISTENER_CONFLICT`. Không đổi Listener của approved design; hướng resolution là sửa và phê duyệt lại design upstream.

Nếu design chọn một trong các file `test-data/read-heavy.csv`, `test-data/auth-heavy.csv`, `test-data/transactional.csv`, giữ đúng filename. Nếu design dùng filename khác nhưng vẫn riêng theo group, giữ design. Nếu không chỉ định, cần Student làm rõ; không tự thay schema/file của approved design.

## Data safety và CSV generation

Lấy columns và semantics **chỉ** từ approved design, rồi cross-check API/source:

- Không thêm cột vô nghĩa chỉ để có CSV.
- Không hard-code request data trong JMX khi design yêu cầu CSV data-driven.
- Không tạo credentials, token, email, order/coupon hay secret giả như data production.
- Không ghi secret thật vào repository; ưu tiên `${authToken}` hoặc JMeter property/environment variable theo strategy approved.

Tính nhu cầu data tối thiểu từ workload: concurrent VUs, iteration/loop/duration, khả năng recycle, one-time transition và reset plan. Nếu không tính được số iteration từ design, ghi `DATA_RISK: UNKNOWN` và `NEEDS_CLARIFICATION`.

| Tình huống | Kết quả |
|---|---|
| CSV không đủ row cho record one-time/không reuse được | `STATUS: BLOCKED_BY_DATA` |
| Reuse có thể gây lockout, quota, ghi đè token, duplicate hoặc side effect | `DATA_RISK: HIGH`; dừng nếu không có isolation/reset được phê duyệt. |
| CSV schema có nhưng record actual chưa được cung cấp | `NEEDS_DATA_SETUP`; không tự bịa rows. |
| `CSV_MODE: TRACEABILITY_ONLY` / `DATA_DRIVEN_FIT: RISK` | giữ CSV riêng theo design nhưng không đưa trace field vào request và không ghi fully data-driven PASS. |
| `DATA_DRIVEN_FIT: BLOCKED` | dừng `STATUS: BLOCKED_BY_DATA`; Student phải resolve interpretation/endpoint. |

Với `AUTH_HEAVY`, kiểm tra lockout, failed-login limit, token expiration, credential/account reuse, reset và rate limit. Với `TRANSACTIONAL`, kiểm tra write, idempotency, quota, one-time state, cleanup, data exhaustion/database growth. Không gán một endpoint là write nếu source chỉ chứng minh read.

## Base URL và authentication

Không hard-code `localhost` vào từng HTTP Request. Dùng `User Defined Variables` hoặc JMeter property `baseUrl`, tham chiếu `${baseUrl}`. Chỉ đặt default local URL khi specification/config xác nhận và document đó là default có thể override.

Lấy authentication strategy từ approved design: pre-generated token, setup login, token CSV hoặc property/environment variable. Nếu route cần auth mà strategy không rõ, `STATUS: NEEDS_CLARIFICATION`; không tự login, tạo token hay nhúng secret.

## Chuyển đổi thành JMeter plan

Tạo JMX XML well-formed bằng component tương thích với **JMeter installation/version đã kiểm tra**. Mỗi test element phải đi kèm `hashTree` đúng ngữ nghĩa JMeter. Không copy XML/class name từ mạng mà không xác minh version/component hiện diện.

Plan cần có cấu trúc đọc được, tối thiểu khi design yêu cầu:

```text
Test Plan
├── User Defined Variables (baseUrl)
├── Thread Group hoặc workload component tương đương
│   ├── CSV Data Set Config
│   ├── HTTP Header Manager
│   ├── HTTP Request
│   ├── Response Assertion / JSON Assertion
│   ├── Timer (khi Think Time > 0)
│   └── Required Listener
```

### HTTP Request

Map chính xác method, path, query, body, headers, content type, auth và `${csv_variable}` theo design/API. JSON number giữ numeric trong body khi contract yêu cầu number; không quote vì tiện XML. Header `Content-Type: application/json` chỉ thêm khi API request body JSON yêu cầu.

### Thread Group, stage và dependency

- `LOAD`: dùng JMeter core `Thread Group` với thread count, Ramp-up, loop/scheduler duration đúng design nếu core biểu diễn chính xác.
- `STRESS`: khi design staged cần `Ultimate Thread Group` hay extension khác, kiểm tra JMeter installation, plugin manager/inventory và component/class trước. Plugin thiếu: `PLUGIN_CHECK: FAIL`, ghi `Required`, `Component`, `Action`; mặc định không tạo production JMX không thể mở.
- `SPIKE`: chỉ dùng nhiều core Thread Group có delayed start/duration nếu mô hình đó biểu diễn chính xác baseline -> spike -> hold -> recovery. Nếu không, kiểm tra component/plugin phù hợp; không thay spike thành một Thread Group constant.

Chỉ tạo `DRAFT` plan có dependency thiếu khi user yêu cầu rõ artifact draft; summary phải ghi `EXECUTION_READY: NO`. Không tự coi plugin tồn tại và không đổi workload model để tránh plugin.

### Timer, Assertions và Listener

- Implement Timer solely from approved `JMeter Timer Mapping`; no `Timer Type: NONE` means no Timer. Không suy ra type/offset/max chỉ từ prose Think Time.
- Implement HTTP status bằng `Response Assertion` và body/json assertion từ design. Nếu cần JSON Assertion, chỉ sử dụng component được xác minh trong JMeter version hiện có. Nếu response contract mơ hồ, `ASSERTION_STATUS: NEEDS_CLARIFICATION`; không invent field/pattern.
- Cài đúng một primary Listener đã approved. Giữ `View Results Tree` nếu bài yêu cầu, nhưng summary phải cảnh báo `PERFORMANCE_TOOLING_RISK` vì listener có thể có overhead/giữ sample trong GUI.

## Static validation trước khi hoàn tất

Không chạy `jmeter -n -t ... -l ...`. Validate bằng XML parser và static inspection:

1. XML well-formed và filename regex PASS.
2. Required components/hashTree tồn tại theo plan structure.
3. CSV path tồn tại, columns match `${variable}` trong JMX; không có reference CSV thừa/missing.
4. HTTP method/path/body/header/auth khớp approved design và API/source.
5. Thread/VU, Ramp-up, Duration, Stage, Think Time, Timer Type/offset/max/bounds/scope/enabled state và Listener khớp từng field approved design.
6. Assertion phản ánh status/body/json đã approved.
7. Listener/group/scenario/CSV uniqueness HW05 không conflict.
8. Không có hard-coded secret, `TODO`, `CHANGE_ME`, `example.com` hoặc placeholder chưa documented.
9. Kiểm tra plugin/component dependency. JMX tham chiếu class thiếu là validation failure, không phải warning nhẹ.

Không có JMeter installation không tự động là blocker cho core-only JMX XML validation, nhưng `DEPENDENCY_STATUS: UNKNOWN` và `EXECUTION_READY: NO` nếu plan cần runtime/plugin check chưa chứng minh được.

## Generation summary bắt buộc

Tạo `docs/jmeter-generation/<studentid>-<scenario-lower>-generation-summary.md` cùng plan. Nội dung chính bằng tiếng Việt và có template sau:

```markdown
# Tóm tắt tạo JMeter Plan (JMeter Plan Generation Summary)

## 1. Input Design
- Design file:
- Approval status:
- Endpoint / Group / Scenario:

## 2. Artifacts đã tạo
- JMX:
- CSV:

## 3. Mapping workload
- Threads/VUs:
- Ramp-up:
- Duration:
- Stages:
- Think Time:
- JMeter Timer Mapping:

## 4. Cấu hình request
- Method / Route:
- Headers:
- Authentication:
- Body / CSV variables:

## 5. Assertions
...

## 6. Listener
...

## 7. Kiểm tra dependency
- PLUGIN_CHECK:
- DEPENDENCY_STATUS:

## 8. An toàn dữ liệu
- DATA_RISK:
- CSV_MODE / DATA_DRIVEN_FIT:
- Reset / isolation:

## 9. Tuân thủ HW05
| Check | Status | Evidence |
|---|---|---|
| Filename convention | PASS/FAIL | |
| Separate CSV | PASS/FAIL | |
| Listener unique | PASS/FAIL | |
| Data-driven request | PASS/FAIL/RISK/BLOCKED | Không ghi PASS khi `CSV_MODE: TRACEABILITY_ONLY`. |
| Assertions implemented | PASS/FAIL | |
| Design parameters preserved | PASS/FAIL | |

## 10. Execution readiness
`READY` / `NOT_READY`

Reasons:
...

## 11. Human Review
Status: `PENDING`

Student Decision: `NOT_REVIEWED`
```

Không ghi `READY` khi plugin/data/auth/critical validation chưa resolved. `READY` chỉ là plan readiness, không phải execution result hoặc performance approval.

Sau tạo artifact và audit status, kết thúc bằng:

```text
CHECKPOINT: JMETER_PLAN_REVIEW_REQUIRED

Generated:
- <jmx path>
- <csv path>
- <summary path>

Execution:
NOT_STARTED

Next allowed action:
Human Review trước khi real execution.
```

## Static/dry smoke test khi build skill

Không tạo JMX, CSV rows, JTL hay thực thi. Kiểm tra skill theo các case sau:

| Case | Input/condition | Expected |
|---|---|---|
| A | `LOAD`, `GET /api/categories`, `READ_HEAVY`, approved design | Map design -> core plan structure, filename canonical, CSV/Listener design-driven, no execution. |
| B | `SPIKE`, `POST /api/forgot-password`, `AUTH_HEAVY`, approved design | Body `${email}`, email CSV strategy, spike preserved và risk state/auth được giữ. |
| C | `STRESS`, `POST /api/apply-coupon`, `TRANSACTIONAL`, approved design | Stage preserved, CSV body fields từ contract, transactional/data-risk validation. |
| D | `Student Decision: NOT_REVIEWED` | `STATUS: BLOCKED`, `REASON: PERFORMANCE_DESIGN_NOT_APPROVED`, không production JMX. |
| E | `LOAD` và `STRESS` cùng `Summary Report` | `STATUS: LISTENER_CONFLICT`, không đổi Listener. |
| F | Design cần `Ultimate Thread Group`, plugin không có | `PLUGIN_CHECK: FAIL`, `EXECUTION_READY: NO`, không giả dependency. |

Một case chỉ PASS khi result expected có thể suy ra từ rule trong skill và không có real JMeter execution.

## Guardrails cuối

- Không tự approve design, JMX, CSV, summary hay audit.
- Không tự điều chỉnh approved scenario để source “có vẻ hợp lý hơn”; report conflict upstream.
- Không commit, push, chạy JMeter hay tạo execution evidence trong workflow này.
- Documentation/user-facing content chủ yếu bằng tiếng Việt; giữ JMeter identifier và technical term chuẩn khi cần chính xác.
