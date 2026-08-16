# Checklist review kiểm thử hiệu năng

## Test plan và API

- [ ] Tên file, Test Plan, Transaction Controller và sampler tuân thủ quy ước style; request dùng dạng `NN METHOD Tên hành động`.
- [ ] Cấu hình dùng chung nằm trước Thread Group; toàn bộ workflow nằm trong một transaction cha tạo E2E sample.
- [ ] Thứ tự endpoint khớp business workflow.
- [ ] Method, URL, header và JSON body khớp đặc tả API.
- [ ] Authentication và biến correlation đều được extract và assert.
- [ ] Assertion kiểm tra dữ liệu nghiệp vụ, không chỉ status code hoặc chuỗi mơ hồ.
- [ ] Timeout và hành động khi sampler lỗi có chủ đích.
- [ ] Mỗi test element có `hashTree` đúng cặp và JMX mở được bằng đúng phiên bản/plugin JMeter.
- [ ] Result Collector lưu field cần phân tích nhưng không lưu response/request body thành công ngoài ý muốn.

## Workload

- [ ] Test plan chính thức và smoke đều dùng Ultimate Thread Group; không có Thread Group thường hoặc fallback.
- [ ] Plugin Ultimate Thread Group được nhận diện trong JMeter GUI và non-GUI trước khi chạy.
- [ ] VU, ramp-up, hold, ramp-down và loop khớp scenario.
- [ ] VU, lịch thời gian, think time và đường dẫn CSV được ghi trực tiếp trong `.jmx`, không dùng `${__P(...)}` hoặc `-J...`.
- [ ] Think time có lý do và không vô tình đồng bộ request.
- [ ] Load, Stress, Spike và Endurance có mục tiêu cùng phase riêng.
- [ ] Listener/report đáp ứng rubric mà không làm cạn RAM máy tạo tải.

## Trạng thái và môi trường

- [ ] Backend health check pass trước khi tạo tải.
- [ ] Tài khoản tồn tại sau khi database khởi tạo.
- [ ] Mỗi VU có dữ liệu an toàn, xác định khi trạng thái có thể thay đổi.
- [ ] Cart/order và login lockout ba lần sai được reset hoặc ghi chú.
- [ ] Phiên bản công cụ, plugin, runtime, phần cứng và cấu hình được lưu.

## Smoke test của agent

- [ ] Agent dùng bản sao `<scenario>_smoke.jmx`; `.jmx` chính thức không bị đổi workload.
- [ ] Bản smoke ghi cứng workload nhỏ và CSV path, không dùng `${__P(...)}`, `-J...` hoặc property ngoài.
- [ ] Smoke output tách khỏi kết quả chính thức và chỉ dùng kiểm tra workflow/correlation/assertion.
- [ ] Dữ liệu được reset/seed lại sau smoke khi cần.
- [ ] Agent đã đọc trạng thái rồi xóa đúng bản JMX, JTL, HTML Report và log smoke do chính agent tạo.
- [ ] Không còn artifact smoke; `.jmx` và kết quả chính thức vẫn nguyên vẹn.
- [ ] Trạng thái được báo là `SMOKE-PASS`, `SMOKE-FAIL` hoặc `SMOKE-NOT-RUN`; người dùng không phải tự chạy smoke.

## Bằng chứng thực thi

- [ ] Lệnh non-GUI dùng JTL và HTML path mới.
- [ ] Ảnh active phase có JMeter và tài nguyên tiến trình backend.
- [ ] Bằng chứng PID-to-port xác định backend giữa nhiều tiến trình.
- [ ] Ảnh hoàn tất cho thấy run kết thúc bình thường.

## Test guide

- [ ] Mỗi scenario có guide khớp `.jmx` cuối cùng về workload, timer, listener và CSV; không yêu cầu property override cho các giá trị này.
- [ ] Working directory, lệnh chuẩn bị, health check, PID-to-port và mọi đường dẫn đều tồn tại hoặc được đánh dấu `TODO` rõ ràng.
- [ ] **Mọi câu lệnh thực thi trong guide (setup, start server, seed data, health check, PID, chạy JMeter, mở report, phân tích JTL) đều được định dạng 1 dòng duy nhất (single-line command)** nối nhau bằng dấu `;` trong PowerShell để người dùng paste trực tiếp vào Terminal an toàn, không bị enter sớm hay ngắt dòng.
- [ ] **Lệnh mở HTML report và phân tích raw JTL có cơ chế tự động tìm file/thư mục mới nhất**, không bị lỗi biến rỗng (`$jtl is null`) khi người dùng mở phiên terminal mới.
- [ ] Lệnh non-GUI sinh JTL, HTML Report và log mới theo timestamp.
- [ ] Guide nêu bằng chứng cần thu thập trong đúng phase và tách metric E2E transaction cha khỏi request con.
- [ ] Tiêu chí chấp nhận có nguồn; không lấy threshold từ ví dụ hoặc tự suy đoán.
- [ ] Artifact cần giữ lại đủ để chạy lại và phân tích độc lập.

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
