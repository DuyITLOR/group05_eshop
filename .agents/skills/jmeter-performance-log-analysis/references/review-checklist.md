# Checklist review kiểm thử hiệu năng

## Test plan và API

- [ ] Thứ tự endpoint khớp business workflow.
- [ ] Method, URL, header và JSON body khớp đặc tả API.
- [ ] Authentication và biến correlation đều được extract và assert.
- [ ] Assertion kiểm tra dữ liệu nghiệp vụ, không chỉ status code hoặc chuỗi mơ hồ.
- [ ] Timeout và hành động khi sampler lỗi có chủ đích.

## Workload

- [ ] VU, ramp-up, hold, ramp-down và loop khớp scenario.
- [ ] Think time có lý do và không vô tình đồng bộ request.
- [ ] Load, Stress, Spike và Endurance có mục tiêu cùng phase riêng.
- [ ] Listener/report đáp ứng rubric mà không làm cạn RAM máy tạo tải.

## Trạng thái và môi trường

- [ ] Backend health check pass trước khi tạo tải.
- [ ] Tài khoản tồn tại sau khi database khởi tạo.
- [ ] Mỗi VU có dữ liệu an toàn, xác định khi trạng thái có thể thay đổi.
- [ ] Cart/order và login lockout ba lần sai được reset hoặc ghi chú.
- [ ] Phiên bản công cụ, plugin, runtime, phần cứng và cấu hình được lưu.

## Bằng chứng thực thi

- [ ] Lệnh non-GUI dùng JTL và HTML path mới.
- [ ] Ảnh active phase có JMeter và tài nguyên tiến trình backend.
- [ ] Bằng chứng PID-to-port xác định backend giữa nhiều tiến trình.
- [ ] Ảnh hoàn tất cho thấy run kết thúc bình thường.

## Chất lượng log và phân tích

- [ ] Khoảng timestamp JTL khớp run dự kiến.
- [ ] Label, sample count, thread, success và response code hợp lý.
- [ ] Segment cũ/nối thêm được loại bằng quy tắc rõ ràng.
- [ ] E2E transaction cha và request con được báo cáo riêng.
- [ ] HTML statistics khớp phép tính raw log hoặc khác biệt được giải thích.
- [ ] Percentile nêu rõ thuật toán/nguồn và phase.
- [ ] Stress breaking point, Spike recovery và Endurance threshold dùng dữ liệu thực nghiệm.

## Human review

- [ ] Mọi nhận định AI quan trọng trỏ đến bằng chứng gốc.
- [ ] Bản sửa nêu lỗi ban đầu, cách sửa, lý do và kết quả chạy lại.
- [ ] Đề xuất optimization thiếu bằng chứng không được trình bày như sự thật.
- [ ] Không bịa metric, threshold, ảnh hoặc xác nhận thủ công.
