---
name: run-gui-checklist-workflow
description: Thực hiện hoặc tiếp tục quy trình GUI checklist của HW03 theo các phase scope, generate, critique, execute, bugs và summary; sử dụng khi Codex cần xác định phạm vi GUI, tạo hơn 40 checklist item theo IA-01 đến IA-04, phản biện checklist, ghi kết quả quan sát thật, soạn bug-report draft, tổng hợp kết quả, chuẩn bị demo video, hoặc làm việc với các artifact Task 1 tương ứng cho Admin Order Management hay một màn hình hoặc flow khác do người dùng cung cấp.
---

# Chạy quy trình GUI checklist

## Mục tiêu

- Thực hiện chuỗi `scope → generate → critique → execute → bugs → summary`.
- Cho phép chạy một phase riêng hoặc nhiều phase hợp lệ theo đúng thứ tự phụ thuộc.
- Dùng mặc định `Admin Order Management` làm primary screen và `Admin Dashboard`, `Order Detail`, `Update Order Status` làm supporting screens.
- Thay phạm vi mặc định bằng screen hoặc flow đã được người dùng xác nhận.
- Không suy đoán chức năng, trạng thái SUT hoặc bằng chứng chưa được cung cấp.

## Đầu vào bắt buộc

- Nhận phase cần chạy hoặc yêu cầu chạy toàn bộ workflow.
- Nhận repository root và đường dẫn artifact nếu khác mặc định.
- Nhận user role, primary screen, supporting screens, FR/IA hoặc tài liệu SUT có thể kiểm tra cho phase `scope`.
- Nhận scope đã xác nhận cho phase `generate`.
- Nhận checklist hiện có cho phase `critique`.
- Nhận kết quả quan sát thật, môi trường kiểm thử và evidence cho phase `execute`.
- Nhận các Failed item đã được xác minh cho phase `bugs`.
- Nhận checklist execution và bug report cho phase `summary`.

## Kiểm tra đầu vào

1. Xác nhận phase yêu cầu thuộc `scope`, `generate`, `critique`, `execute`, `bugs`, `summary`.
2. Đọc artifact hiện có trước khi tạo hoặc chỉnh sửa.
3. Kiểm tra đường dẫn tùy chỉnh nằm trong phạm vi người dùng cho phép.
4. Kiểm tra scope nêu rõ user role, screen, component, action, precondition và test data khi áp dụng.
5. Kiểm tra dữ liệu execution phân biệt quan sát thật với giả định hoặc dữ liệu demo.
6. Kiểm tra mọi Failed item có Actual Result, Notes, môi trường, Evidence và lý do không đạt.
7. Dừng phase phụ thuộc nếu artifact đầu vào bắt buộc không tồn tại hoặc không đủ nội dung.

## Các phase được hỗ trợ

| Phase | Phụ thuộc tối thiểu | Đầu ra mặc định |
| --- | --- | --- |
| `scope` | Tài liệu hoặc mô tả SUT đã xác nhận | `artifacts/task1/gui-scope.md` |
| `generate` | Scope đã xác nhận | `artifacts/task1/gui-checklist.md` |
| `critique` | Checklist hiện có | `artifacts/task1/gui-checklist-critique.md` |
| `execute` | Checklist và quan sát thật | `artifacts/task1/gui-execution.md` |
| `bugs` | Failed item đã xác minh | `artifacts/task1/bug-reports.md` |
| `summary` | Execution và bug report | `artifacts/task1/gui-test-summary.md` |

## Quy trình thực hiện

### Phase `scope`

1. Xác định user role.
2. Xác định primary screen và supporting screens.
3. Liệt kê component, user action, precondition và test data.
4. Bao phủ các trạng thái `normal`, `loading`, `empty`, `error`, `success`, `disabled`.
5. Ánh xạ FR và IA dựa trên nguồn đã đọc.
6. Ghi rõ phần chưa được xác nhận.
7. Cảnh báo nếu scope quá nhỏ để tạo hơn 40 item có ý nghĩa.
8. Ghi kết quả vào `artifacts/task1/gui-scope.md` hoặc đường dẫn đã chọn.

### Phase `generate`

1. Tạo khoảng 48–55 item ban đầu khi scope đủ rộng.
2. Bao phủ `IA-01: General UI standards`, `IA-02: Forms`, `IA-03: Navigation`, `IA-04: Feedback / state`.
3. Viết mỗi item cụ thể, quan sát được, không trùng lặp và có Expected Result rõ ràng.
4. Gắn mỗi item với screen, component và precondition cần thiết.
5. Dùng ID `GUI-001`, `GUI-002`, tiếp tục tuần tự.
6. Đặt `Source` thành `AI-generated`.
7. Để trống `Actual Result`, `Status`, `Notes`, `Evidence`.
8. Không tự đánh dấu Passed hoặc Failed.

### Phase `critique`

1. Tìm item trùng lặp, quá chung chung, không quan sát được hoặc có Expected Result mơ hồ.
2. Kiểm tra thiếu coverage và mất cân bằng giữa IA-01 đến IA-04.
3. Kiểm tra accessibility, keyboard navigation, focus visibility và screen-reader label.
4. Kiểm tra responsive layout, localization, RTL và dark mode.
5. Kiểm tra loading, empty, validation error, server error, success, disabled và destructive-action confirmation.
6. Kiểm tra status consistency giữa các screen liên quan.
7. Đề xuất item bổ sung và giải thích lý do AI có thể đã bỏ sót.
8. Không tự gắn `Student-added`.
9. Chỉ gắn `Student-added` sau khi người dùng xác nhận đã tự rà soát và chấp nhận item.

### Phase `execute`

1. Giữ nguyên `Test Item` và `Expected Result`.
2. Chỉ ghi kết quả từ quan sát thật do người dùng cung cấp hoặc bằng chứng có thể kiểm tra.
3. Chỉ dùng `Passed`, `Failed`, `Blocked`, `Not Run`.
4. Dùng `Not Run` khi chưa có quan sát.
5. Dùng `Blocked` khi có nguyên nhân chặn rõ ràng.
6. Yêu cầu screenshot cho Failed item; không bắt buộc screenshot cho Passed item.
7. Ghi Actual Result, Notes, môi trường, Evidence và lý do không đạt cho mọi Failed item.
8. Không suy đoán trạng thái từ tên file, test step hoặc Expected Result.

### Phase `bugs`

1. Chỉ xử lý Failed item đã được xác minh.
2. Nhóm các Failed item có cùng nguyên nhân để tránh issue trùng.
3. Dùng ID `BUG-001`, `BUG-002`, tiếp tục tuần tự.
4. Ghi Title, Related Checklist IDs, Environment, Preconditions, Steps to Reproduce, Expected Result, Actual Result, Severity, Priority, Reproducibility, Evidence và GitHub Issue Status.
5. Giữ `GitHub Issue Status` là draft hoặc trạng thái thật đã kiểm tra.
6. Không tự đăng GitHub Issue.
7. Không bịa URL, screenshot hoặc kết quả tái hiện.

### Phase `summary`

1. Đếm tổng checklist item và số item theo từng IA.
2. Đếm Passed, Failed, Blocked và Not Run.
3. Đếm số bug duy nhất.
4. Liệt kê số Failed item chưa có screenshot.
5. Tổng hợp coverage theo screen.
6. Nêu rõ dữ liệu thiếu hoặc chưa xác minh.

## Định dạng artifact đầu ra

### Bảng checklist

Giữ đúng các cột:

| Checklist ID | Interface Aspect | Screen | Component | Preconditions | Test Item | Test Steps | Expected Result | Actual Result | Status | Notes | Evidence | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### Bảng bug report

Giữ các trường `Bug ID`, `Title`, `Related Checklist IDs`, `Environment`, `Preconditions`, `Steps to Reproduce`, `Expected Result`, `Actual Result`, `Severity`, `Priority`, `Reproducibility`, `Evidence`, `GitHub Issue Status`.

### Hợp đồng artifact chung

- Dùng Task 1: `gui-scope.md`, `gui-checklist.md`, `gui-checklist-critique.md`, `gui-execution.md`, `bug-reports.md`, `gui-test-summary.md`.
- Nhận biết Task 2: `usability-plan.md`, `moderator-session-kit.md`, `session-observations.md`, `usability-scores.md`, `severity-findings.md`, `usability-report.md`.
- Nhận biết validation: `hw03-compliance-report.md`.
- Cho phép đường dẫn khác khi người dùng cung cấp rõ ràng.
- Không ghi đè nội dung sinh viên đã sửa trước khi đọc và bảo toàn phần không liên quan.

## Quy tắc đặt tên và traceability

- Dùng `GUI-NNN` cho checklist item và không tái sử dụng ID.
- Dùng `BUG-NNN` cho bug duy nhất và không tái sử dụng ID.
- Ánh xạ checklist item đến IA, screen, component, FR và nguồn.
- Ánh xạ bug đến một hoặc nhiều Checklist ID.
- Ánh xạ summary đến artifact execution và bug report đã dùng.
- Dùng đường dẫn tương đối từ repository root trong artifact khi có thể.

## Quy tắc bảo vệ bằng chứng

- Tách nội dung `AI-generated`, `Student-added` và kết quả quan sát thật.
- Không tự nhận phần AI đề xuất là human review.
- Không tạo Passed, Failed, screenshot, URL, GitHub Issue hoặc kết quả tái hiện giả.
- Không dùng dữ liệu demo làm bằng chứng nộp bài.
- Gắn `DEMO_ONLY` cho dữ liệu thử skill và lưu tách khỏi artifact thật.
- Không ghi secret hoặc dữ liệu cá nhân chưa được che.

## Stop conditions

- Dừng `generate` khi chưa có scope đủ rõ hoặc scope quá nhỏ mà người dùng chưa mở rộng.
- Dừng `execute` khi không có checklist hoặc quan sát thật; chỉ tạo khung khi người dùng yêu cầu rõ.
- Dừng `bugs` khi không có Failed item đã xác minh.
- Dừng `summary` khi không có execution artifact; báo chính xác phần còn thiếu.
- Dừng trước thao tác đăng GitHub Issue hoặc thay đổi hệ thống bên ngoài nếu chưa có yêu cầu rõ.
- Không tuyên bố hoàn thành Task 1 khi còn item Not Run, Blocked, Failed thiếu evidence hoặc human review chưa xác nhận.

## Quy trình dành cho demo video

1. Hiển thị scope và đường dẫn artifact.
2. Chạy `scope`.
3. Chạy `generate`.
4. Hiển thị checklist và thống kê IA.
5. Chạy `critique`.
6. Yêu cầu người dùng xác nhận phần human review.
7. Nạp execution artifact thật đã chuẩn bị và kiểm tra nguồn.
8. Chạy `execute`.
9. Chạy `bugs`.
10. Chạy `summary`.
11. Hiển thị danh sách artifact được tạo.
12. Không thực thi trực tiếp toàn bộ hơn 40 item trong lúc quay; dùng kết quả thật đã chuẩn bị khi đã kiểm tra tính xác thực.

## Kiểm tra trước khi kết thúc

- Kiểm tra phase và dependency đúng thứ tự.
- Kiểm tra khoảng 48–55 item khi chạy `generate` và hơn 40 item có ý nghĩa cho bài nộp.
- Kiểm tra IA-01 đến IA-04 đều có coverage.
- Kiểm tra ID duy nhất và traceability đầy đủ.
- Kiểm tra chỉ dùng trạng thái hợp lệ.
- Kiểm tra Failed item có Notes, môi trường, Evidence, lý do và screenshot.
- Kiểm tra không có bằng chứng giả hoặc human review giả.
- Kiểm tra artifact được ghi đúng đường dẫn và nội dung sinh viên được bảo toàn.
- Báo rõ artifact đã tạo, validation đã chạy, giới hạn và bước tiếp theo.
