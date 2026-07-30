---
name: log-ai-audit
description: Ghi và duy trì nhật ký AI Audit dạng Markdown cho mọi công việc liên quan đến HW03, gồm phân tích đề bài, chọn phạm vi, thiết kế prompt, tạo hoặc chỉnh sửa Agent Skill, tạo hoặc phản biện GUI checklist, ghi kết quả kiểm thử, tạo bug report, lập kế hoạch hoặc chuẩn bị usability evaluation, phân tích SUS hoặc UEQ-S, viết báo cáo, kiểm tra bài nộp và chỉnh sửa artifact; sử dụng skill này cho mỗi yêu cầu mới của người dùng thuộc HW03, khi backfill lịch sử chat, hoặc khi xuất AI Audit Report.
---

# Ghi AI Audit cho HW03

## Tuân thủ các nguyên tắc

- Tính mỗi tin nhắn mới của người dùng là một interaction cần ghi.
- Gộp mọi thao tác đọc tệp, chỉnh sửa tệp và chạy công cụ để xử lý cùng một tin nhắn vào đúng một bản ghi.
- Ghi cả yêu cầu lập kế hoạch, tư vấn, tạo skill, kiểm tra bài và chỉnh sửa tệp.
- Không tạo bản ghi riêng cho từng tool call.
- Không coi thao tác cập nhật nhật ký AI Audit là một interaction mới.
- Không tạo hai bản ghi cho cùng một prompt.
- Không ghi chain-of-thought hoặc suy luận nội bộ.
- Không ghi secret hoặc dữ liệu riêng tư chưa được che.
- Giữ `docs/ai-audit/AI_AUDIT_LOG.md` theo kiểu append-only và bảo toàn mọi thay đổi không liên quan.

## Xử lý mỗi interaction

1. Đọc `docs/ai-audit/AI_AUDIT_LOG.md` trước khi tạo bản ghi.
2. Kiểm tra các ID đã có và tạo ID theo dạng `HW03-AI-YYYYMMDD-NNN`.
3. Lấy ngày theo múi giờ `Asia/Ho_Chi_Minh`.
4. Bắt đầu `NNN` từ `001` cho mỗi ngày và tăng theo ID lớn nhất đã tồn tại trong ngày đó.
5. Không tái sử dụng ID.
6. Ghi nguyên văn tin nhắn của người dùng vào `User Prompt`; không sửa chính tả, tóm tắt hoặc viết lại.
7. Thay mật khẩu, token, API key, thông tin liên hệ chưa che và dữ liệu cá nhân của người tham gia bằng `[REDACTED]`; ghi chú rõ rằng nội dung đã được che vì lý do riêng tư.
8. Thực hiện yêu cầu bình thường và theo dõi các tệp đã đọc, tạo hoặc chỉnh sửa, quyết định quan trọng, validation, lỗi và giới hạn.
9. Soạn hoàn chỉnh câu trả lời cuối cùng trước khi gửi.
10. Ghi nguyên văn câu trả lời đó vào `AI Output`.
11. Cập nhật bảng artifact và trạng thái interaction.
12. Nối bản ghi mới vào cuối nhật ký.
13. Gửi cho người dùng đúng nội dung đã ghi trong `AI Output`.
14. Vẫn ghi interaction và lỗi trong `AI Output` khi yêu cầu bị chặn hoặc thất bại.

Nếu tạo một artifact dài, không sao chép toàn bộ artifact vào nhật ký. Hãy ghi đường dẫn, loại artifact, mô tả, trạng thái validation và phiên bản hoặc checksum nếu có. Luôn ghi nguyên văn câu trả lời văn bản cuối cùng.

## Ghi metadata

- Ghi công cụ AI thực tế vào `AI tool`.
- Ghi tên model chỉ khi môi trường cung cấp.
- Ghi `Not exposed by the current environment` nếu môi trường không cung cấp tên model.
- Không tự đoán tên model.
- Chọn `Related task` trong `Task 1`, `Task 2`, `Task 3`, `Agent Skill`, `Report` hoặc `Other`.
- Chọn `Status` trong `Completed`, `Partially completed`, `Blocked` hoặc `Failed`.
- Chỉ ghi các quyết định và giả định ảnh hưởng đến kết quả trong `Important Decisions`.

## Dùng cấu trúc bản ghi

````markdown
---

## HW03-AI-YYYYMMDD-NNN

- Date and time:
- Timezone: Asia/Ho_Chi_Minh
- AI tool:
- Model:
- Task category:
- Related task: Task 1 / Task 2 / Task 3 / Agent Skill / Report / Other
- Status: Completed / Partially completed / Blocked / Failed

### User Prompt

```text
Nội dung prompt nguyên văn
```

### AI Output

```text
Nội dung câu trả lời cuối cùng nguyên văn
```

### Files and Artifacts

| Path | Action | Description | Validation |
| --- | --- | --- | --- |
| ... | Created/Modified/Read | ... | Passed/Failed/Not checked |

### Important Decisions

- Chỉ ghi các quyết định và giả định ảnh hưởng đến kết quả.
- Không ghi chain-of-thought.

### Human Review

- Review status: Pending
- Reviewed by:
- Review date:
- Corrections made:
- Accepted artifacts:

---
````

## Giữ quyền rà soát cho sinh viên

- Đặt `Review status: Pending` cho mọi interaction mới.
- Không tự đổi trạng thái thành `Reviewed`, `Accepted` hoặc `Corrected`.
- Chỉ cập nhật thông tin rà soát khi sinh viên xác nhận và cung cấp nội dung.
- Thêm phần `Correction` mới khi cần sửa bản ghi; không xóa hoặc sửa nội dung cũ nếu người dùng không yêu cầu.

## Backfill lịch sử

1. Đọc nội dung chat đã xuất, tệp Markdown lịch sử chat hoặc prompt/output cũ do người dùng cung cấp.
2. Chuyển từng cặp prompt/output thành một interaction riêng.
3. Thêm `Entry mode: Backfilled` vào metadata của từng bản ghi backfill.
4. Giữ nguyên prompt và output, đồng thời áp dụng quy tắc che dữ liệu nhạy cảm.
5. Dùng `[MISSING OUTPUT]` khi không có output gốc.
6. Không tự tái tạo output bị thiếu.
7. Nêu rõ giới hạn và không tuyên bố lịch sử đầy đủ khi dữ liệu đầu vào không đầy đủ.
8. Giữ `Human Review` ở trạng thái `Pending`.

## Xuất AI Audit Report

1. Đọc toàn bộ nhật ký.
2. Sắp xếp interaction theo thời gian.
3. Giữ nguyên prompt và output.
4. Tạo báo cáo Markdown riêng tại đường dẫn người dùng yêu cầu.
5. Loại bỏ secret và che dữ liệu cá nhân chưa được che trước khi đưa vào báo cáo.
6. Liệt kê mọi interaction chưa được sinh viên xác nhận trong `Human Review`.
7. Không tự xác nhận thay cho sinh viên.

## Khởi tạo nhật ký khi chưa tồn tại

- Tạo `docs/ai-audit/AI_AUDIT_LOG.md`.
- Thêm tiêu đề, mô tả ngắn, quy tắc `Human Review` và khu vực chứa interaction.
- Không thêm dữ liệu mẫu có thể bị hiểu nhầm là interaction thật.

## Kiểm tra trước khi hoàn tất

- Kiểm tra ID không trùng và đúng ngày tại `Asia/Ho_Chi_Minh`.
- Kiểm tra prompt được lưu nguyên văn, trừ phần bắt buộc che dữ liệu nhạy cảm.
- Kiểm tra `AI Output` giống chính xác câu trả lời sắp gửi.
- Kiểm tra bảng artifact phản ánh các thao tác và validation thực tế.
- Kiểm tra `Human Review` vẫn là `Pending`.
- Kiểm tra bản ghi được nối vào cuối tệp và không làm thay đổi bản ghi cũ.
