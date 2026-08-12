---
name: perf-scenario-designer
description: Thiết kế Performance Test bằng tiếng Việt cho một endpoint HW05, gồm phân tích endpoint, workload Load/Stress/Spike, dữ liệu CSV, Assertion, JMeter Listener, rủi ro và kiểm tra tuân thủ ba endpoint group. Dùng khi cần trả lời endpoint nên được kiểm thử hiệu năng như thế nào hoặc tạo tài liệu performance design; không dùng để tạo/chạy JMeter plan hay tuyên bố kết quả thực thi.
---

# perf-scenario-designer

Thiết kế một tài liệu Performance Scenario Design có thể Human Review cho **một** endpoint. Chỉ tạo design, không tạo `.jmx`, `.jtl`, HTML report, không chạy JMeter và không kết luận PASS/FAIL cho một lần chạy.

## Input bắt buộc

Yêu cầu tối thiểu gồm:

- `Endpoint`: route, ví dụ `GET /api/categories`.
- `HTTP method`: nếu chưa nằm trong Endpoint.
- `Endpoint group`: đúng một trong `READ_HEAVY`, `AUTH_HEAVY`, `TRANSACTIONAL`.
- `Scenario`: đúng một trong `LOAD`, `STRESS`, `SPIKE`.

Tận dụng các input bổ sung khi có: API specification, request body, authentication, expected status, business rule, source code, phần cứng, CSV hiện có và các design đã có. Không tự suy luận chúng là đã tồn tại.

Nếu thiếu route/method/group/scenario, không tạo design hoàn chỉnh; trả về `NEEDS_CLARIFICATION` và liệt kê trường còn thiếu. Nếu có input tối thiểu nhưng evidence về hành vi chưa đủ, vẫn tạo bản nháp với `Design status: NEEDS_CLARIFICATION` hoặc `ASSUMPTION_REQUIRES_REVIEW` tại đúng mục bị thiếu.

## Quy trình bắt buộc

1. Đọc cấu trúc repository và convention hiện có trước khi ghi file. Tìm API specification, source/config liên quan endpoint, `docs/performance-design/`, `test-data/`, và các skill/rule audit.
2. Đọc toàn bộ design hiện có trong `docs/performance-design/` trước khi chọn mapping hoặc Listener. Không sửa, đổi tên hay silently chỉnh design của sinh viên/scenario khác.
3. Lập sổ evidence theo **role-based authority model**. HW05 Requirements là authority cho assignment compliance; Approved Performance Scenario Design là authority cho intended test configuration; source code/runtime config là authority cho current SUT behavior; API specification là documented API contract; docs khác chỉ supporting evidence. Mỗi nhận định phải được phân loại chính xác:
   - **FACT**: có nguồn trong specification, source code hoặc config; ghi đường dẫn và vị trí/đoạn liên quan.
   - **ASSUMPTION**: cần để tiếp tục nhưng chưa chứng minh; ghi `ASSUMPTION_REQUIRES_REVIEW`.
   - **RECOMMENDATION**: quyết định thiết kế do AI đề xuất; luôn kèm lý do.
   Khi source mâu thuẫn specification/design, ghi `IMPLEMENTATION_SPEC_CONFLICT` hoặc `IMPLEMENTATION_CONFLICT` gồm Design, Current Implementation, Documented Contract, Impact và Required Resolution. Không nói bên nào sai hoặc silently chọn một bên.
4. Phân tích endpoint trước workload: method, route, group, auth, parameter/body, response, read/write, database interaction, state mutation, business constraints, dependency dữ liệu và rủi ro concurrent request. Không suy ra HTTP success chỉ vì endpoint trả response.
5. Kiểm tra ma trận HW05 và chỉ sau đó thiết kế workload, CSV, Assertion và Listener.
6. Ghi Markdown vào `docs/performance-design/<scenario-lower>-<endpoint-slug>-design.md`. `endpoint-slug` bỏ HTTP method, bỏ `/api/`, thay `/`, `:`, khoảng trắng bằng `-`, lowercase; ví dụ `GET /api/categories` là `categories`.
7. Sau khi file chính được tạo, tìm `$log-ai-audit` hoặc skill audit tương đương và áp dụng đúng contract của skill đó. Không tự chế audit format. Lưu nguyên văn prompt/output/timestamp thực tế khi audit yêu cầu. Nếu audit cần Student Information mà chưa có, trả về status của audit (`AUDIT_INITIALIZATION_INFORMATION_REQUIRED`) và **không bịa** thông tin hoặc entry.
8. Dừng ngay sau output checkpoint. Chỉ Student mới có thể `APPROVE`, `MODIFY`, hoặc `REJECT` design.

## Ma trận HW05: validation deterministic

Chỉ nhận enum viết hoa đúng như input contract. Xây ma trận từ tất cả design đã có và design đang tạo.

| Rule | Điều kiện | Hành động |
|---|---|---|
| Group | Mỗi `READ_HEAVY`, `AUTH_HEAVY`, `TRANSACTIONAL` xuất hiện đúng một lần | Group trùng: `FAIL`, không chọn workload/Listener mới cho design xung đột. Group chưa có design: `NEEDS_CLARIFICATION`, không đánh dấu toàn HW05 PASS. |
| Scenario | `LOAD`, `STRESS`, `SPIKE` phải tạo mapping một-một với ba group | Scenario trùng hoặc scenario còn thiếu sau khi xét scope hiện có: đánh dấu `FAIL` hoặc `NEEDS_CLARIFICATION` tương ứng. Không silently remap input. |
| CSV | Mỗi group có CSV riêng | Đề xuất `test-data/<group-lower-hyphen>.csv`; không dùng CSV chung. Nếu file/record chưa có, `NEEDS_DATA_SETUP`. |
| Listener | Mỗi scenario dùng một primary Listener/report view khác nhau | Chọn đúng một loại chưa được design khác dùng. Nếu hết loại khả dụng, `FAIL` và yêu cầu Student chọn/điều chỉnh mapping. |
| Justification | Mọi số workload và Think Time có lý do | Thiếu lý do là `FAIL`. |

Chỉ đánh dấu `HW05 Compliance Check` PASS toàn cục khi đủ ba group, đủ ba scenario, không trùng group/scenario/Listener, và cả ba CSV riêng đã được chỉ ra. Một design đơn lẻ không được tự tuyên bố toàn HW05 compliant.

### Chọn Listener theo thứ tự xác định

Lần lượt ưu tiên theo scenario, nhưng loại bỏ Listener đã dùng bởi scenario khác:

| Scenario | Ưu tiên Listener |
|---|---|
| `LOAD` | `Summary Report`, `Aggregate Report`, `View Results Tree` |
| `STRESS` | `Aggregate Report`, `Summary Report`, `View Results Tree` |
| `SPIKE` | `View Results Tree`, `Aggregate Report`, `Summary Report` |

Ghi `Uniqueness Check: PASS` chỉ khi đối chiếu design hiện có chứng minh chưa trùng. Nếu thiếu design scenario khác, ghi `NEEDS_CLARIFICATION`; không suy ra uniqueness toàn HW05 chỉ từ một file.

## Thiết kế workload

Luôn tách **FACT**, **ASSUMPTION**, **RECOMMENDATION**. Khi chưa có hardware baseline, không viết một số VU là thực tế cho máy nào; ghi:

```text
ASSUMPTION: Chưa có hardware baseline.
RECOMMENDATION: Bắt đầu workload thận trọng, chạy baseline được phê duyệt rồi hiệu chỉnh từng mức.
```

Con số dưới đây là điểm bắt đầu bảo thủ khi không có hardware/SLA/production telemetry, không phải FACT. Thay đổi được khi input có evidence, nhưng mỗi số phải có rationale.

### `LOAD`

- Mục tiêu: tải dự kiến/bình thường, không phải tìm điểm gãy.
- Dùng baseline `5 VUs`, tăng đều tới `10 VUs` trong `20 giây`, duy trì `60 giây`, Think Time `500-1000 ms` cho luồng người dùng. Đây là **RECOMMENDATION** để tạo baseline có thể đo và tránh gửi vòng lặp không thực tế.
- Nếu đo service boundary cần throughput thuần, có thể dùng Think Time `0 ms`, nhưng phải ghi rõ mục tiêu là loại tác động từ hành vi người dùng và đây không mô phỏng phiên người dùng.
- Nêu iteration behavior, warm-up (nếu có) và throughput chỉ khi có SLA/baseline để so sánh; nếu không ghi `NEEDS_CLARIFICATION`, không đặt ngưỡng tự tạo.

### `STRESS`

- Mục tiêu: nhận biết degradation và giới hạn ổn định, không tuyên bố capacity.
- Dùng stage rõ ràng, mặc định thận trọng: `5 -> 10 -> 20 -> 30 VUs`; mỗi stage `45 giây`; Ramp giữa stage `15 giây`; cuối cùng recovery `60 giây` ở `5 VUs`. Đây là **RECOMMENDATION** để quan sát xu hướng từng nấc và khả năng phục hồi khi chưa biết hardware.
- Định nghĩa tín hiệu degradation bằng observation, ví dụ error rate tăng liên tiếp, p95 tăng rõ rệt so với baseline, timeout hoặc Assertion failure. Không tự đặt threshold p95/error-rate là pass criterion nếu chưa có SLA.
- Với endpoint ghi/thay đổi state, tính số record cần thiết cho tổng request dự kiến. Nếu CSV/reset không đủ, trạng thái là `BLOCKED_BY_DATA` hoặc `NEEDS_DATA_SETUP`.

### `SPIKE`

- Trình bày bốn pha bắt buộc: `Baseline -> sudden spike -> hold -> recovery`.
- Mặc định thận trọng khi chưa có baseline: `5 VUs` baseline `30 giây` -> `25 VUs` trong `5 giây` -> hold `30 giây` -> về `5 VUs` và quan sát recovery `30 giây`. Đây là **RECOMMENDATION**, spike gấp 5 lần nhằm tạo thay đổi đột ngột có thể quan sát, không khẳng định phản ánh lưu lượng thật.
- Nếu endpoint đại diện request hệ thống thay vì thao tác người dùng, Think Time `0 ms` có thể hợp lý để cô lập burst; phải nêu lý do. Nếu mô phỏng người dùng, dùng range có lý do.

### Contract Think Time / JMeter Timer Mapping

Mỗi design phải ghi mapping deterministic **trước Human Review**:

```text
Think Time: <0 | X ms | L-U ms>
Think Time Justification: <...>
JMeter Timer Mapping:
- Timer Type: NONE | Constant Timer | Uniform Random Timer
- Lower Bound: <ms>
- Upper Bound: <ms>
- JMeter Parameters: <Delay hoặc Constant Delay Offset + Random Delay Maximum>
- Mapping Status: PASS | NEEDS_CLARIFICATION
```

Canonical mapping: `0` -> `NONE`; fixed `X ms` -> `Constant Timer`, Delay `X ms`; range `L-U ms` -> `Uniform Random Timer`, Constant Delay Offset `L ms`, Random Delay Maximum `U-L ms`, Resulting Range `L-U ms`. Range thiếu mapping là `NEEDS_CLARIFICATION`; không để builder tự invent sau approval.

## Chính sách data và an toàn

### CSV bắt buộc

Trong mỗi output luôn ghi:

```text
CSV Required: YES
Suggested File: test-data/<group-lower-hyphen>.csv
Columns: <chỉ các biến endpoint thực sự cần>
Purpose: <cách Thread/VU lấy một record>
Data generation/reset considerations: <uniqueness, exhaustion, reset>
CSV_MODE: REQUEST_DRIVEN | TRACEABILITY_ONLY
DATA_DRIVEN_FIT: PASS | RISK | BLOCKED
```

Không hard-code body nếu biến phù hợp có thể externalize bằng `CSV Data Set Config`. Không invent dữ liệu mẫu/credential/token. `DATA_DRIVEN_FIT: PASS` chỉ khi CSV variable thật sự drive path/query/body/account/product/coupon/order/credential/workflow input. Endpoint không có input có thể dùng CSV riêng traceability, nhưng phải ghi `CSV_MODE: TRACEABILITY_ONLY`, `DATA_DRIVEN_FIT: RISK`, `HW05_DATA_DRIVEN_RISK: YES` và khuyến nghị Student cân nhắc endpoint/workflow có input thật trước final selection. Nếu requirement không thể đáp ứng theo interpretation hiện tại, dùng `DATA_DRIVEN_FIT: BLOCKED`; không tự đổi endpoint.

### `AUTH_HEAVY`

Kiểm tra source/spec về lockout, failed-login limit, token expiration, reuse tài khoản, uniqueness credential/email và reset giữa run. Nếu có rule lockout, thiết kế không vô tình trigger nó hoặc cô lập tài khoản có reset được. Nếu endpoint liên quan reset/OTP/token, coi mỗi request có thể mutate state; xác định record reuse/reset. Thiếu bằng chứng rate limit/lockout là risk, không phải FACT rằng hệ thống an toàn.

### `TRANSACTIONAL`

Kiểm tra DB write, duplicate, one-time transition, idempotency, data exhaustion, cleanup/reset, unique record, database growth và side effect. Với endpoint kiểm tra business rule nhưng chưa write, ghi rõ source evidence thay vì tự gắn nhãn write. Nếu response/outcome phụ thuộc record đã dùng hoặc state thay đổi, cần data isolation; nếu số record nhỏ hơn nhu cầu workload, dùng `BLOCKED_BY_DATA`/`NEEDS_DATA_SETUP`.

## Assertion strategy

Mỗi design phải có Assertion cho:

- HTTP status code theo evidence. Nếu có nhiều valid outcome, liệt kê tất cả cùng điều kiện dữ liệu; không coi mọi HTTP response là PASS.
- JSON structure/các field cần thiết hoặc body expected.
- application-level success/error, chẳng hạn `success: true` chỉ khi source/spec xác nhận field đó.
- lỗi auth và validation/business-rule có thể hợp lệ nhưng phải tách riêng khỏi luồng thành công.

Nếu expected status/body chưa chứng minh được, ghi `NEEDS_CLARIFICATION`; không đặt assertion hư cấu. Assertion failure là tín hiệu quan sát, không phải kết quả PASS/FAIL của toàn performance run.

## Cấu trúc output bắt buộc

Tạo file Markdown với chính xác các mục sau. Nội dung chính bằng tiếng Việt, giữ technical identifier/enum/route/filename nguyên dạng.

```markdown
# Thiết kế Kịch bản Hiệu năng (Performance Scenario Design)

## 1. Thông tin chung

- Endpoint:
- HTTP method:
- Endpoint group:
- Scenario:
- Design status: `DRAFT` | `NEEDS_CLARIFICATION` | `ASSUMPTION_REQUIRES_REVIEW` | `NEEDS_DATA_SETUP` | `BLOCKED_BY_DATA`
- Phạm vi bằng chứng đã đọc:

## 2. Phân tích endpoint

| Hạng mục | Phân tích |
|---|---|
| Authentication | |
| Request parameters/body | |
| Response expectation | |
| Read/write và database | |
| State mutation | |
| Business constraints | |
| Test-data dependency | |
| Concurrent-request risk | |

## 3. Facts

- `FACT`: ... (nguồn: `path:line/section`)

## 4. Assumptions

- `ASSUMPTION_REQUIRES_REVIEW`: ...

## 5. Mô hình workload (Workload Model)

- Threads/VUs:
- Ramp-up:
- Duration:
- Stages:
- Think Time:
- Think Time Justification:
- JMeter Timer Mapping:
  - Timer Type:
  - Lower Bound:
  - Upper Bound:
  - JMeter Parameters:
  - Mapping Status:
- Justification:
- Throughput/p95 evaluation: ...

## 6. Chiến lược dữ liệu kiểm thử (Test Data Strategy)

- CSV Required: YES
- Suggested File:
- Columns:
- Purpose:
- Data generation/reset considerations:
- Data status:
- CSV_MODE:
- DATA_DRIVEN_FIT:

## 7. Chiến lược Assertion (Assertion Strategy)

| Luồng | HTTP status | Body/JSON Assertion | Điều kiện |
|---|---|---|---|
| Thành công | | | |
| Hợp lệ nhưng không thành công | | | |

## 8. JMeter Listener / Report View

- Listener:
- Reason:
- Uniqueness Check: `PASS` | `FAIL` | `NEEDS_CLARIFICATION`
- Evidence / conflict:

## 9. Rủi ro

- ...

## 10. Lý do thiết kế (Design Rationale)

...

## 11. Câu hỏi mở / Cần làm rõ

- ...

## 12. Kiểm tra tuân thủ HW05 (HW05 Compliance Check)

| Requirement | Status | Evidence / Note |
|---|---|---|
| Endpoint group assigned | PASS/FAIL/NEEDS_CLARIFICATION | |
| Scenario assigned | PASS/FAIL/NEEDS_CLARIFICATION | |
| Group uniqueness | PASS/FAIL/NEEDS_CLARIFICATION | |
| Scenario uniqueness | PASS/FAIL/NEEDS_CLARIFICATION | |
| Separate CSV | PASS/FAIL/NEEDS_CLARIFICATION | |
| Listener uniqueness | PASS/FAIL/NEEDS_CLARIFICATION | |
| Workload justified | PASS/FAIL | |
| Assertions defined | PASS/FAIL/NEEDS_CLARIFICATION | |

## 13. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

CHECKPOINT: PERFORMANCE_DESIGN_REVIEW_REQUIRED

Next allowed action: Student must APPROVE, MODIFY, or REJECT the design.
```

Không đổi `PENDING`/`NOT_REVIEWED` thành approved, không tạo Human Review giả và không chuyển checkpoint. Sau khi trả status audit (nếu có), output cuối cùng vẫn phải kết thúc bằng hai dòng checkpoint trong template.

## Dry-run tự kiểm tra

Khi validate skill, dùng ba input độc lập sau để kiểm tra structure, không chạy JMeter và không tạo `.jmx`/`.jtl`/HTML report:

1. `GET /api/categories`, `READ_HEAVY`, `LOAD`: cần có CSV riêng, Load workload, Listener, Timer mapping `500-1000 ms -> Uniform Random Timer offset 500/max 500`, và `TRACEABILITY_ONLY`/`DATA_DRIVEN_FIT: RISK` nếu CSV không drive request.
2. `POST /api/forgot-password`, `AUTH_HEAVY`, `SPIKE`: cần có bốn pha spike, CSV email/account, analysis reset token/state và cảnh báo khi thiếu thông tin implementation/rate limit.
3. `POST /api/apply-coupon`, `TRANSACTIONAL`, `STRESS`: cần stage Stress, columns liên quan coupon, risk business/data state và không khẳng định DB write nếu source chỉ đọc.

Một dry-run chỉ PASS khi design có 13 mục, phân loại FACT/ASSUMPTION/RECOMMENDATION, role authority/conflict handling, Timer mapping explicit, CSV fit đúng semantics, Listener khác nhau trên toàn bộ bộ ba, checkpoint đúng và không có execution evidence.
