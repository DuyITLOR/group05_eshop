# HW03 - GUI and Usability Testing

## Thông tin bài làm

| Thuộc tính    | Nội dung                                                                                |
| ------------- | --------------------------------------------------------------------------------------- |
| Mã bài tập    | HW03-AI                                                                                 |
| Sinh viên     | Nguyễn Huy Quân                                                                         |
| MSSV          | 23127107                                                                                |
| SUT           | EShop - Frontend Web, Admin Web và Backend API                                          |
| Ngày cập nhật | 03/08/2026                                                                              |
| Công cụ AI    | Codex và công cụ AI được khai báo trong AI Audit                                        |
| Trạng thái    | Đã cập nhật Task 1-3; Pending Student Human Review và các deliverable nộp bài còn thiếu |

Báo cáo chỉ sử dụng kết quả có artifact hoặc evidence tương ứng. Participant được trình bày bằng mã `P01`-`P07`; tên, liên hệ, consent và recording gốc không được đưa vào báo cáo công khai.

## Tóm tắt kết quả

| Hạng mục                      | Kết quả chính                                                                      | Trạng thái                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Task 1 - GUI Checklist        | 60 checklist item: 32 Passed, 28 Failed; 15 bug đã được sinh viên xác nhận         | Hoàn thành phần checklist; GitHub Issues chưa tạo                                    |
| Task 2 - Usability Evaluation | 7/7 hoàn thành độc lập; median 95 giây; mean SUS 61,1/100; 7 finding               | Provisional - findings và dữ liệu phiên đang Pending Human Review; chưa có pilot P00 |
| Task 3 - Cross-Platform       | 12 use case trên Chrome/Windows, Firefox/Windows và Safari/iPhone; 30 ảnh evidence | Đã thực thi; thiếu browser/OS/device version metadata và Human Review cuối           |
| Agent Skill                   | 4 skill Markdown, 1 video demo                                                     | Source và video demo đã có                                                           |

## 1. Task 1 - GUI Checklist

### 1.1. Phạm vi

Task 1 tập trung vào Admin Order Management, với các bề mặt hỗ trợ gồm Admin Login, Admin Dashboard, bảng đơn hàng và thao tác cập nhật trạng thái inline. Checklist bao phủ bốn nhóm:

- `IA-01`: General UI standards.
- `IA-02`: Forms and input controls.
- `IA-03`: Navigation.
- `IA-04`: Feedback and states.

Phạm vi và traceability được định nghĩa tại [gui-scope.md](../artifacts/task1/gui-scope.md). Checklist ban đầu có 52 mục; sau AI Critique và Human Review, sinh viên bổ sung 8 mục về table semantics, accessible action name, live-region announcement, focus recovery, zoom/reflow, viewport hẹp, update error và persistence.

Các artifact thiết kế:

- [Checklist ban đầu](../artifacts/task1/gui-checklist.md)
- [AI Critique](../artifacts/task1/gui-checklist-critique.md)
- [Checklist sau Human Review](../artifacts/task1/gui-checklist-reviewed.md)

### 1.2. Phương pháp

Các kiểm tra có tiêu chí khách quan và lặp lại được được hỗ trợ thực thi bằng browser automation. Các tiêu chí mang tính cảm quan hoặc yêu cầu đánh giá trực quan được sinh viên thực hiện và xác nhận thủ công. Mọi kết quả do AI/công cụ tạo ra đều được Human Review trước khi đưa vào báo cáo.

Controlled mock chỉ được dùng để tạo loading, empty và server-error state. Kết quả mock mô tả trạng thái UI được quan sát, không được trình bày như lỗi thật từ backend.

### 1.3. Kết quả checklist

| Interface Aspect                 | Passed | Failed |   Tổng |
| -------------------------------- | -----: | -----: | -----: |
| IA-01 - General UI standards     |      9 |      7 |     16 |
| IA-02 - Forms and input controls |      9 |      5 |     14 |
| IA-03 - Navigation               |      9 |      5 |     14 |
| IA-04 - Feedback and states      |      5 |     11 |     16 |
| **Tổng**                         | **32** | **28** | **60** |

- Passed rate: `53,33%`.
- Failed rate: `46,67%`.
- Pending Human Review trong checklist: `0`.
- Kết quả chi tiết: [gui-execution.md](../artifacts/task1/gui-execution.md).
- Evidence: [artifacts/task1/evidence](../artifacts/task1/evidence/).

### 1.4. Nhóm vấn đề chính

| Nhóm                         | Checklist tiêu biểu                                  | Kết quả quan sát                                                                   |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Dữ liệu dài và responsive    | GUI-006, GUI-008, GUI-011, GUI-039, GUI-057, GUI-058 | Overflow, reflow kém và khó tiếp cận action ở viewport/zoom bất lợi                |
| Form và duplicate submission | GUI-014, GUI-017, GUI-019, GUI-026                   | Label/required validation chưa đầy đủ; thao tác có thể gửi lặp khi request pending |
| Keyboard và focus            | GUI-033-035, GUI-038, GUI-054-056                    | Sidebar không truy cập tốt bằng bàn phím; focus và accessible feedback chưa đủ     |
| Loading, empty và error      | GUI-040-043, GUI-059                                 | State thiếu thông báo hoặc recovery guidance phù hợp                               |
| Order data/state             | GUI-009, GUI-012, GUI-047, GUI-049, GUI-051, GUI-052 | HTML-like data, revenue và state transition có lỗi sản phẩm                        |

### 1.5. Bug report Task 1

Task 1 có 15 bug report đã được sinh viên xác nhận: High 4, Medium 10, Low 1; không có Critical. Bug report có checklist traceability, evidence và disclosure về controlled mock. Chi tiết nằm tại [bug-report-summary.md](../artifacts/task1/bug-reports/bug-report-summary.md) và [validation-report.md](../artifacts/task1/bug-reports/validation-report.md).

Các GitHub Issue chưa được tạo. Do đó, phần checklist và bug-report artifact đã hoàn thành, nhưng yêu cầu đăng issue/đính kèm evidence của submission vẫn còn thiếu.

## 2. Task 2 - Usability Evaluation

### 2.1. Kế hoạch và phương pháp

Luồng đánh giá:

`Product Search -> Product Detail -> Add to Cart -> Apply VIP100 -> Checkout -> Order Confirmation`

Participant bắt đầu từ tài khoản test đã đăng nhập và giỏ hàng trống. Scenario giao mục tiêu mua một thiết bị trong ngân sách và tận dụng coupon `VIP100`, không cung cấp tên control hoặc hướng dẫn thao tác từng bước. Instrument sau phiên là SUS 10 câu chuẩn; câu hỏi mở được phân theo `Clarity`, `Error recovery`, `Speed` và `Trust`.

Kế hoạch nghiên cứu: [usability-plan.md](../artifacts/task2/usability-plan.md). Moderator script: [moderator-session-kit.md](../artifacts/task2/moderator-session-kit.md).

### 2.2. Participant và bảo vệ dữ liệu

- Có 7 session chính, mã `P01`-`P07`.
- Consent, contact và recording được lưu riêng; main report không đưa PII.
- Dữ liệu raw được giữ đến hết 28/08/2026; participant có thể yêu cầu rút dữ liệu đến hết ngày này qua researcher/moderator.
- Không có compensation.
- Pilot riêng `P00` chưa có artifact, nên không được tuyên bố đã hoàn thành pilot.
- Session `P03` và `P05` chưa có ngày/giờ chính xác trong note; `P07` có deviation do cart chưa reset và cần Human Review lại evidence về đúng sản phẩm/coupon.

### 2.3. Kết quả định lượng

| Participant | Outcome            | Time (s) | Errors | Hesitations | Interventions |  SUS |
| ----------- | ------------------ | -------: | -----: | ----------: | ------------: | ---: |
| P01         | Success unassisted |       95 |      0 |           1 |             0 | 62,5 |
| P02         | Success unassisted |       44 |      1 |           0 |             0 | 37,5 |
| P03         | Success unassisted |      135 |      0 |           0 |             0 | 67,5 |
| P04         | Success unassisted |       80 |      1 |           0 |             0 | 47,5 |
| P05         | Success unassisted |      110 |      0 |           0 |             0 | 62,5 |
| P06         | Success unassisted |      100 |      0 |           0 |             0 | 75,0 |
| P07         | Success unassisted |       36 |      0 |           0 |             0 | 75,0 |

| Metric                          |       Kết quả |
| ------------------------------- | ------------: |
| Recorded main sessions          |             7 |
| Reported independent completion |    7/7 (100%) |
| Median completion time          |       95 giây |
| Min / max completion time       | 36 / 135 giây |
| Total observed errors           |             2 |
| Total hesitations               |             1 |
| Total interventions             |             0 |
| Mean SUS                        |      61,1/100 |
| Median SUS                      |      62,5/100 |
| SUS range                       |     37,5-75,0 |

Mean SUS 61,1 thấp hơn success criterion 70. Người dùng có thể hoàn thành luồng nhanh và không cần hỗ trợ, nhưng perceived usability vẫn ở mức marginal vì feedback, tính nhất quán và trust chưa tốt.

### 2.4. Đánh giá success criteria

| ID    | Criterion                            | Kết quả                          | Trạng thái                              |
| ----- | ------------------------------------ | -------------------------------- | --------------------------------------- |
| SC-01 | Ít nhất 6/7 hoàn thành độc lập       | 7/7 reported                     | Passed, chờ review deviation P07        |
| SC-02 | 7/7 đúng sản phẩm và số lượng        | Findings report ghi 7/7          | Pending Human Review P07                |
| SC-03 | Ít nhất 6/7 hiểu và áp dụng `VIP100` | Findings report ghi 7/7          | Pending Human Review P07                |
| SC-04 | Median <= 5 phút                     | 95 giây                          | Passed                                  |
| SC-05 | Không quá 1/7 cần intervention       | 0/7                              | Passed                                  |
| SC-06 | Ít nhất 6/7 nhận biết confirmation   | 7/7 reported                     | Passed                                  |
| SC-07 | Mean SUS >= 70                       | 61,1                             | Failed                                  |
| SC-08 | Không có blocker Critical            | Không có blocker ngăn completion | Passed; có một product finding Critical |

### 2.5. Findings định tính

| Finding | Tóm tắt                                                | Severity |                               Tần suất |
| ------- | ------------------------------------------------------ | -------- | -------------------------------------: |
| FIND-02 | Tổng thanh toán có thể chỉnh sửa và vẫn tạo đơn        | Critical | 4/7 nhận biết; P06 chứng minh tác động |
| FIND-01 | Thiếu feedback tức thời khi thêm vào giỏ               | High     |                                    6/7 |
| FIND-04 | Cart không clear sau thanh toán                        | High     |                                  1-2/7 |
| FIND-03 | Thiếu hình ảnh và mô tả sản phẩm                       | Medium   |                                    5/7 |
| FIND-06 | Thiếu email/order confirmation ngoài màn hình hiện tại | Medium   |                                    4/7 |
| FIND-05 | Thêm cùng sản phẩm tạo nhiều dòng                      | Medium   |                                    1/7 |
| FIND-07 | Xóa sản phẩm phản hồi chậm                             | Medium   |                                    1/7 |

Bản phân tích nguồn là [findings.md](../artifacts/task2/findings.md). Artifact này đang `Draft - Pending Human Review`; trước khi nộp phải ẩn danh các tên participant đang xuất hiện trong findings/session note công khai.

Bốn bug report `BUG-016`-`BUG-019` đã được soạn từ findings, nhưng trường `Confirmed by student` vẫn là `Pending`. Vì vậy, báo cáo phân biệt rõ: 15 bug Task 1 đã xác nhận và 4 bug Task 2 đang chờ xác nhận; không gọi cả 19 bug là đã xác nhận.

### 2.6. Kết luận Task 2

Đã có 7 session, SUS và findings draft. Kết quả vẫn là `Provisional` cho đến khi sinh viên Human Review dữ liệu, xử lý deviation P07, ẩn danh artifact công khai và xác nhận hoặc bác bỏ bốn bug mới. Pilot P00 vẫn là deliverable còn thiếu.

## 3. Task 3 - Cross-Browser / Cross-Platform

### 3.1. Nền tảng

| Platform             | URL quan sát được       | Identity overlay | Metadata còn thiếu          |
| -------------------- | ----------------------- | ---------------- | --------------------------- |
| Chrome trên Windows  | `http://localhost:5174` | Có               | Chrome/Windows version      |
| Firefox trên Windows | `http://localhost:5174` | Có               | Firefox/Windows version     |
| Safari trên iPhone   | Dev Tunnel tới SUT      | Có               | iPhone model và iOS version |

Task 3 có 30 ảnh evidence, bao phủ 12 use case được lọc từ checklist Task 1. Ma trận đầy đủ và link từng ảnh nằm tại [cross-platform.md](../artifacts/task3/cross-platform.md).

### 3.2. Kết quả

| Platform        | Passed | Failed | N/A | Tổng |
| --------------- | -----: | -----: | --: | ---: |
| Chrome Windows  |      6 |      6 |   0 |   12 |
| Firefox Windows |      6 |      6 |   0 |   12 |
| Safari iPhone   |      6 |      5 |   1 |   12 |

Các lỗi lặp lại trên nhiều nền tảng gồm table overflow, long owner/address data, HTML-like address và responsive layout. Đây là lỗi SUT chung, không phải lỗi riêng của browser engine. Browser-native error UI có khác nhau nhưng vẫn cung cấp feedback. `Zoom 200%` trên Safari ghi `N/A` vì pinch zoom không tương đương desktop browser zoom.

### 3.3. Kết luận Task 3

Yêu cầu tối thiểu ba nền tảng đã có evidence. Trước submission cần bổ sung browser/OS/device version metadata và sinh viên xác nhận ma trận kết quả cuối.

## 4. Agent Skill

| Skill                               | Mục đích                                                    | Source                                                                 | Video demo                           |
| ----------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| `log-ai-audit`                      | Ghi interaction HW03 vào AI Audit                           | [SKILL.md](../agent-skills/log-ai-audit/SKILL.md)                      | [Link](https://youtu.be/bYpBHybMgjE) |
| `run-gui-checklist-workflow`        | Workflow scope, critique, execution và bug report           | [SKILL.md](../agent-skills/run-gui-checklist-workflow/SKILL.md)        | [Link](https://youtu.be/bYpBHybMgjE) |
| `run-usability-evaluation-workflow` | Workflow plan, prepare, record, analyze và report usability | [SKILL.md](../agent-skills/run-usability-evaluation-workflow/SKILL.md) | [Link](https://youtu.be/bYpBHybMgjE) |
| `validate-hw03-deliverables`        | Kiểm tra readiness và compliance                            | [SKILL.md](../agent-skills/validate-hw03-deliverables/SKILL.md)        | [Link](https://youtu.be/bYpBHybMgjE) |

Source skill và video minh họa end-to-end đã có.

## 5. AI Audit và AI Critique

Tuyên bố sử dụng AI: **Tôi sử dụng AI để hỗ trợ phân tích đề, thiết kế và phản biện checklist, chuẩn hóa artifact, hỗ trợ thực thi kiểm tra khách quan, tổng hợp usability data và soạn cấu trúc báo cáo. Sinh viên chịu trách nhiệm Human Review mọi kết quả trước khi nộp.**

AI Audit hiện có tại [AI_AUDIT_LOG.md](../docs/ai-audit/AI_AUDIT_LOG.md). Cần kiểm tra nhật ký đã bao phủ các interaction Task 2, Task 3 và lần cập nhật report này trước khi xuất phụ lục PDF.

AI Critique 200-300 từ là phản ánh cá nhân của sinh viên. Báo cáo không tự tạo trải nghiệm hoặc nhận định cá nhân thay sinh viên. Phần này vẫn cần sinh viên tự viết và chèn trước submission.

## 6. Git Commit Log

| Commit    | Nội dung                                                 |
| --------- | -------------------------------------------------------- |
| `229f76f` | `feat(skills): add reusable HW03 testing workflows`      |
| `48f1c50` | `test(gui): generate and critique initial GUI checklist` |
| `6b310c4` | `docs: finalize task 1 GUI checklist`                    |
| `db71fe9` | `docs: record task 1 execution and human review`         |
| `2a4e216` | `docs: add bug reports`                                  |
| `3ddfe63` | `Done task 3`                                            |

Chưa có commit riêng cho pilot, từng usability session, usability analysis hoặc report cuối.

## 7. Submission Readiness

| Deliverable                  | Trạng thái                      | Việc cần làm trước khi nộp                                      |
| ---------------------------- | ------------------------------- | --------------------------------------------------------------- |
| Main report Markdown         | Đã cập nhật                     | Student Human Review nội dung cuối                              |
| Main report PDF              | Chưa có                         | Xuất PDF sau khi khóa nội dung                                  |
| GUI checklist > 40 mục       | Có Markdown 60 mục              | Xuất đúng format Excel nếu rubric yêu cầu                       |
| Task 1 evidence              | Có                              | Đăng 15 GitHub Issues và gắn screenshot/link nếu rubric yêu cầu |
| Task 2 sessions/SUS/findings | Có draft                        | Ẩn danh tên; review P07; xác nhận findings/BUG-016-019          |
| Pilot P00                    | Không có                        | Bổ sung pilot thật hoặc khai báo thiếu                          |
| Task 3 evidence              | Có 3 nền tảng/30 ảnh            | Bổ sung browser/OS/device version metadata                      |
| Agent Skill                  | Có 4 source skill và video demo | Đã hoàn thành                                                   |
| AI Audit appendix            | Có Markdown                     |                                                                 |
| AI Critique 200-300 từ       | Có                              | /docs/ai-audit/ai-critique.md                                   |
| Git commit log text          | Chưa có file riêng              | Xuất sau các commit cuối                                        |

**Kết luận:** nội dung `main.md` đã được đồng bộ với artifact hiện có, nhưng bộ bài chưa an toàn để submit ngay. Các blocker lớn nhất là PII trong Task 2 artifact, Human Review của findings/P07, pilot P00, GitHub Issues, AI Critique và các file xuất cuối (PDF/Excel/commit log).

## 8. Tài liệu tham chiếu

- [Đề tiếng Anh](../2026.HW03.GUI%20Usability_En.pdf)
- [Bản tiếng Việt](../2026.HW03.GUI_Usability_VI.pdf)
- [GUI test summary](../artifacts/task1/gui-test-summary.md)
- [Usability findings](../artifacts/task2/findings.md)
- [Cross-platform execution](../artifacts/task3/cross-platform.md)
