---
name: validate-hw03-deliverables
description: Kiểm tra mức độ tuân thủ và sẵn sàng nộp của artifact HW03 mà không tự sửa hoặc tạo bằng chứng; sử dụng khi Codex cần audit Task 1 GUI checklist, Task 2 usability evaluation, AI Audit, AI Critique, báo cáo Markdown/PDF, Excel checklist, cross-platform evidence, Git history, Agent Skill, demo video, README self-assessment, test summary, tên ZIP, hoặc tạo và cập nhật hw03-compliance-report.md từ đường dẫn mặc định hay đường dẫn do người dùng cung cấp.
---

# Kiểm tra deliverable HW03

## Mục tiêu

- Kiểm tra nội dung và evidence của HW03 thay vì chỉ kiểm tra tên file.
- Dùng trạng thái `Pass`, `Fail`, `Warning`, `Not Checked`, `Present but Unverified`.
- Tạo báo cáo tuân thủ mà không tự sửa artifact hoặc bịa bằng chứng còn thiếu.
- Chỉ kết luận `Ready` khi không còn blocking problem.

## Đầu vào bắt buộc

- Nhận repository root hoặc thư mục bài nộp.
- Nhận rubric, yêu cầu bài hoặc tiêu chí validation có thẩm quyền.
- Nhận đường dẫn artifact mặc định hoặc mapping đường dẫn tùy chỉnh.
- Nhận quyền đọc các artifact và evidence nằm trong phạm vi.
- Nhận phiên bản hoặc thời điểm snapshot cần kiểm tra nếu repository đang thay đổi.

## Kiểm tra đầu vào

1. Xác nhận repository root và phạm vi validation.
2. Đọc rubric hoặc yêu cầu hiện hành trước khi kết luận.
3. Kiểm tra artifact contract mặc định và ghi lại mọi mapping đường dẫn khác.
4. Phân biệt file thiếu, file rỗng, file có nội dung và evidence chưa thể xác minh.
5. Không coi sự tồn tại của filename là bằng chứng đạt.
6. Không chạy thao tác sửa, sinh dữ liệu hoặc thay đổi hệ thống ngoài phạm vi read-only.
7. Ghi `Not Checked` khi không có quyền, công cụ hoặc dữ liệu để kiểm tra.

## Các phase được hỗ trợ

| Phase | Mục đích | Đầu ra |
| --- | --- | --- |
| `discover` | Lập inventory và mapping artifact | Ghi trong compliance report |
| `validate-task1` | Kiểm tra GUI checklist, execution và bug evidence | Ghi trong compliance report |
| `validate-task2` | Kiểm tra usability plan, session, score và finding | Ghi trong compliance report |
| `validate-other` | Kiểm tra các deliverable còn lại | Ghi trong compliance report |
| `conclude` | Tổng hợp blocker, warning và readiness | `artifacts/validation/hw03-compliance-report.md` |

## Quy trình thực hiện

### Phase `discover`

1. Liệt kê artifact trong phạm vi.
2. Ánh xạ tên mặc định sang đường dẫn thực tế do người dùng cung cấp.
3. Ghi kích thước, loại file và khả năng đọc khi hữu ích.
4. Đọc nội dung cần thiết để kiểm tra từng requirement.
5. Không mở rộng phạm vi sang dữ liệu riêng tư không cần thiết.

### Phase `validate-task1`

1. Kiểm tra có hơn 40 checklist item có ý nghĩa.
2. Kiểm tra đủ IA-01 đến IA-04.
3. Kiểm tra primary screen rõ ràng.
4. Kiểm tra human review có xác nhận của sinh viên.
5. Kiểm tra trạng thái chỉ gồm Passed, Failed, Blocked, Not Run.
6. Kiểm tra Failed item có Notes, Actual Result, môi trường và lý do.
7. Kiểm tra mỗi Failed item có screenshot thật và reference đọc được.
8. Kiểm tra bug report có traceability đến Checklist ID.
9. Kiểm tra GitHub Issue evidence thực tế; không suy đoán URL hoặc issue tồn tại.
10. Kiểm tra test summary khớp dữ liệu nguồn.

### Phase `validate-task2`

1. Kiểm tra một flow end-to-end rõ ràng.
2. Kiểm tra pilot session có evidence.
3. Kiểm tra đủ 7 participant thật ở ngoài lớp HW03 theo yêu cầu.
4. Kiểm tra thông tin liên hệ đã che và consent có evidence.
5. Kiểm tra observation notes cho P01–P07.
6. Kiểm tra dùng SUS hoặc UEQ-S nhất quán.
7. Tái kiểm tra công thức và điểm từ response gốc khi có thể.
8. Kiểm tra recording/evidence reference.
9. Kiểm tra severity-ranked findings và traceability đến P01–P07.
10. Kiểm tra bug screenshot và phân biệt bug riêng lẻ với vấn đề thiết kế hệ thống.
11. Không coi dữ liệu demo hoặc smoke test là usability evidence thật.

### Phase `validate-other`

1. Kiểm tra AI Audit Report và `Human Review` của mỗi AI interaction.
2. Kiểm tra AI Critique dài 200–300 từ theo cách đếm đã nêu.
3. Kiểm tra Git commit log và traceability đến quá trình làm bài.
4. Kiểm tra main report có cả Markdown và PDF.
5. Kiểm tra Excel checklist có nội dung tương ứng với nguồn.
6. Kiểm tra cross-platform evidence trên số nền tảng được yêu cầu và danh tính môi trường thật.
7. Kiểm tra README self-assessment và test summary.
8. Kiểm tra các Agent Skill chỉ chứa artifact được yêu cầu và có nội dung hoàn chỉnh.
9. Kiểm tra demo video links có thể truy cập khi có quyền.
10. Kiểm tra tên ZIP đúng định dạng trong rubric.

### Phase `conclude`

1. Ghi một hàng cho mỗi requirement.
2. Dùng `Pass` khi nội dung và evidence đã được kiểm tra đạt.
3. Dùng `Fail` cho vi phạm hoặc artifact bắt buộc bị thiếu.
4. Dùng `Warning` cho rủi ro không chặn nhưng cần xử lý.
5. Dùng `Present but Unverified` khi artifact có mặt nhưng evidence chưa đủ xác minh.
6. Dùng `Not Checked` khi chưa thể kiểm tra.
7. Tổng hợp Blocking problems, Warnings, Missing artifacts và Unverified evidence.
8. Kết luận `Not Ready` khi còn bất kỳ blocking problem.
9. Kết luận `Ready` chỉ khi không còn blocking problem.

## Định dạng artifact đầu ra

Tạo `artifacts/validation/hw03-compliance-report.md` với bảng:

| Requirement ID | Requirement | Status | Evidence | Problem | Required Action |
| --- | --- | --- | --- | --- | --- |

Thêm các phần:

- Validation scope và thời điểm kiểm tra
- Artifact path mapping
- Blocking problems
- Warnings
- Missing artifacts
- Unverified evidence
- Ready/Not Ready conclusion
- Checks not run

### Hợp đồng artifact chung

- Kiểm tra Task 1: `gui-scope.md`, `gui-checklist.md`, `gui-checklist-critique.md`, `gui-execution.md`, `bug-reports.md`, `gui-test-summary.md`.
- Kiểm tra Task 2: `usability-plan.md`, `moderator-session-kit.md`, `session-observations.md`, `usability-scores.md`, `severity-findings.md`, `usability-report.md`.
- Tạo validation: `hw03-compliance-report.md`.
- Cho phép đường dẫn khác khi người dùng cung cấp mapping rõ ràng.
- Không ghi đè nội dung sinh viên đã sửa trước khi đọc và bảo toàn phần không liên quan.

## Quy tắc đặt tên và traceability

- Dùng Requirement ID ổn định theo nhóm, ví dụ `T1-001`, `T2-001`, `OTHER-001`.
- Ánh xạ mỗi requirement đến đường dẫn và evidence cụ thể.
- Ghi line, section, ID hoặc reference đủ để kiểm tra lại khi có thể.
- Ánh xạ Failed GUI item đến screenshot và bug report.
- Ánh xạ usability finding đến participant code đã ẩn danh và evidence.
- Ghi nguồn rubric hoặc tiêu chí dùng cho từng nhóm validation.

## Quy tắc bảo vệ bằng chứng

- Không tạo file hoặc dữ liệu để biến Fail thành Pass.
- Không tự sửa evidence participant, consent, response, recording hoặc finding.
- Không bịa GitHub Issue, screenshot, platform identity, demo video hoặc URL.
- Không dùng filename, dữ liệu demo hoặc smoke test làm bằng chứng đạt.
- Không đưa thông tin liên hệ hoặc dữ liệu riêng tư chưa che vào compliance report.
- Ghi rõ `Present but Unverified` khi chỉ xác nhận được sự hiện diện.
- Giữ validation read-only đối với artifact nguồn; chỉ tạo hoặc cập nhật compliance report.

## Stop conditions

- Dừng kết luận khi chưa đọc được rubric hoặc tiêu chí bắt buộc; dùng `Not Checked`.
- Dừng truy cập dữ liệu participant chưa ẩn danh và yêu cầu bản đã che.
- Dừng đánh dấu Pass khi evidence không mở được hoặc không truy vết được.
- Dừng kết luận `Ready` khi còn Fail, missing artifact hoặc blocking unverified evidence.
- Dừng trước mọi thao tác tự sửa artifact nguồn hoặc tạo evidence còn thiếu.
- Không tuyên bố validation đầy đủ nếu phạm vi hoặc công cụ kiểm tra bị giới hạn.

## Quy trình dành cho demo video

1. Hiển thị phạm vi, rubric và artifact mapping.
2. Chạy validation lần đầu.
3. Hiển thị Fail, Warning và Present but Unverified.
4. Yêu cầu người dùng sửa artifact thật ngoài validator.
5. Chạy lại validation trên snapshot mới.
6. So sánh trạng thái trước và sau.
7. Hiển thị blocking problems và kết luận readiness.
8. Không tự sửa lỗi hoặc tạo evidence chỉ để có kết quả đẹp.

## Kiểm tra trước khi kết thúc

- Kiểm tra đã đọc nội dung thay vì chỉ kiểm tra filename.
- Kiểm tra mọi trạng thái thuộc tập hợp hợp lệ.
- Kiểm tra Task 1, Task 2 và các deliverable khác đều có requirement.
- Kiểm tra evidence và traceability đủ cụ thể.
- Kiểm tra không có dữ liệu riêng tư hoặc bằng chứng giả.
- Kiểm tra `Ready` chỉ xuất hiện khi không còn blocker.
- Kiểm tra đường dẫn tùy chỉnh được ghi trong mapping.
- Kiểm tra compliance report bảo toàn nội dung sinh viên cần giữ.
- Báo rõ checks not run, giới hạn, blocking action và bước tiếp theo.
