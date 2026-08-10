# AI Critique - HW04 Automation Testing

## Review Status

`STUDENT_REVIEW_REQUIRED`

## Critique

Trong bài tập này, AI giúp tôi chuyển yêu cầu thành test cases, external test data, Playwright scripts và tài liệu traceability nhanh hơn, nhưng output ban đầu không thể được dùng nguyên trạng. AI thường tối ưu cho một giải pháp có vẻ hợp lý về cú pháp mà chưa kiểm tra đầy đủ ranh giới requirement, dữ liệu và runtime. Ở FR-05, helper kiểm tra thousand grouping đã lấy cả khoảng trắng trước hậu tố tiền tệ, gây false failure cho TC-006. Ở FR-17, `getCouponRow` dùng locator đã scope qua ancestor table bên trong `filter({ has })`, có thể bỏ sót row hợp lệ; một helper khác còn thêm locale-dependent assertion ngoài primary objective của TC-003. AI cũng từng dùng generic rejection oracle phụ thuộc error UI không được requirement định nghĩa và ánh xạ nhầm dataset giữa các test cases.

Các lỗi này xảy ra vì prompt hoặc static context không thể thay thế việc đối chiếu đồng thời requirement, approved test data, DOM thực tế, isolation setup và browser runtime. Model có xu hướng tái sử dụng helper chung và thêm assertion “hữu ích”, nhưng abstraction đó có thể làm yếu traceability hoặc tạo oracle ngoài phạm vi. Human review theo checkpoint, Chromium automation-defect gate và targeted cross-browser rerun đã giúp tách automation defect khỏi product defect trước khi lập bug report.

Nguyên tắc tôi rút ra là AI nên tạo draft có traceability, còn con người phải sở hữu oracle và quyết định cuối. Mỗi assertion cần trả lời rõ nó đến từ requirement nào; mỗi helper phải được kiểm tra với valid và invalid examples; mỗi failure phải được triage bằng evidence trước khi gọi là product defect. AI làm tăng tốc độ, nhưng evidence, review và correction mới tạo ra độ tin cậy.

## Word Count

Current count: `300 words`, tính theo whitespace-separated tokens. Phải chạy lại validation sau khi sinh viên chỉnh sửa.
