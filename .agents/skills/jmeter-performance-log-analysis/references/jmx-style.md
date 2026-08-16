# Style tạo test plan JMeter E2E

Dùng style này làm mặc định khi sinh `.jmx`. Nó được khái quát từ một test plan Load có workflow mua hàng xác thực; chỉ tái sử dụng cấu trúc và quy ước chất lượng, không tái sử dụng dữ liệu hay workload cụ thể.

## Mục lục

1. Envelope và cách đặt tên
2. Thứ tự cây test plan
3. Workload controller
4. Transaction và label
5. HTTP request và header
6. Dữ liệu riêng theo VU
7. Correlation và tính toán
8. Assertion theo từng bước
9. Think time
10. Result Collector
11. Quality gate trước bàn giao
12. Smoke test của agent

## 1. Envelope và cách đặt tên

- Dùng XML UTF-8 và khai báo phiên bản JMeter tương thích môi trường đích.
- Đặt tên file `{StudentID}_{Scenario}_{YYYYMMDD}.jmx` khi đã có đủ dữ kiện; để trống phần chưa biết thay vì tự đặt Student ID/ngày.
- Đặt Test Plan theo dạng `{StudentID} {Scenario} - {Business goal}`.
- Ghi workload, thời lượng, dữ liệu riêng theo VU và ràng buộc quan trọng trong `TestPlan.comments`.
- Không nhúng kết quả chạy hoặc nhận định hiệu năng vào tên test plan.

## 2. Thứ tự cây test plan

Giữ thứ tự tổng quát:

1. Test Plan.
2. HTTP Request Defaults với protocol, host, port, encoding, implementation và timeout.
3. Header Manager dùng chung, thường gồm `Content-Type` và `Accept` cho JSON.
4. DNS Cache Manager khi cần hành vi DNS ổn định.
5. Một Ultimate Thread Group đại diện cho đúng scenario.
6. Một Transaction Controller cha chứa toàn bộ E2E workflow.
7. Summary Report theo cấu hình lưu kết quả an toàn.

Mỗi JMeter test element phải có `hashTree` đi kèm đúng vị trí. Không tạo XML bằng cách ghép chuỗi thiếu cặp node.

## 3. Workload controller

- Bắt buộc dùng `kg.apc.jmeter.threads.UltimateThreadGroup` cho Load, Stress, Spike, Endurance và smoke.
- Không tạo Thread Group thường và không fallback khi thiếu plugin. Báo dependency bị thiếu và cài Ultimate Thread Group trước khi chạy.
- Ghi trực tiếp các con số VU, initial delay, startup/ramp-up, hold, shutdown/ramp-down và loop vào node Thread Group trong `.jmx`.
- Không dùng `${__P(...)}`, `-J...`, `user.properties` hoặc biến môi trường để cấu hình workload.
- Đặt tên `{Scenario} Profile - {N} VU`; đặt `ThreadGroup.on_sample_error` thành `startnextloop` cho workflow phụ thuộc nếu request sau sẽ vô nghĩa khi request trước lỗi.
- Chỉ dùng loop vô hạn khi scheduler/thread schedule quyết định thời điểm dừng.
- Không sao chép các khóa hash nội bộ của Ultimate Thread Group như một API ổn định. Tạo cấu hình đúng định dạng plugin và xác minh lại bằng JMeter GUI.

## 4. Transaction và label

- Bọc toàn bộ business journey trong một Transaction Controller tên `E2E {Workflow name}`.
- Bật `Generate parent sample` để có một sample E2E; mặc định không cộng timer vào transaction nếu rubric không yêu cầu.
- Đặt sampler theo dạng `01 POST Login`, `02 GET Products`, `03 POST Add to Cart`.
- Số thứ tự phản ánh dependency thật, không phải thứ tự tùy ý trong XML.
- Không dùng sampler cuối cùng để đại diện cho tỷ lệ hoàn tất E2E.

## 5. HTTP request và header

- Đặt host/protocol/port/timeout tại HTTP Request Defaults, chỉ override ở sampler khi endpoint thật sự khác.
- Bật keep-alive và follow redirects khi phù hợp với API.
- Dùng raw JSON body cho POST/PUT/PATCH; phân biệt giá trị chuỗi với số khi chèn biến.
- Đặt header JSON dùng chung ở cấp Test Plan.
- Đặt `Authorization: Bearer ${token}` ở phạm vi request được bảo vệ hoặc một controller chỉ chứa request được bảo vệ; không gửi token vào login/public endpoint.

## 6. Dữ liệu riêng theo VU

- Dùng một account/data row xác định cho mỗi VU khi cart, order, lockout hoặc trạng thái người dùng có thể xung đột.
- Ghi literal đường dẫn CSV tương đối trực tiếp trong `.jmx`, ví dụ `../test-data/accounts_load.csv`; không lấy đường dẫn từ `-Jcsv=...` hoặc property ngoài.
- Với workflow lặp vô hạn, ưu tiên nạp dòng CSV một lần theo `ctx.getThreadNum()` và đánh dấu `accountLoaded`, thay vì để con trỏ CSV quay vòng ngoài ý muốn.
- Resolve đường dẫn tương đối từ `FileServer.getBaseDir()` để GUI và CLI dùng cùng dữ liệu.
- Kiểm tra số dòng, số cột và báo lỗi rõ VU/dòng thiếu trước khi gửi request.
- Dùng CSV Data Set Config nếu semantics của bài phù hợp hơn; vẫn phải xác định rõ sharing mode, recycle và stop-thread behavior.

## 7. Correlation và tính toán

- Dùng JSON PostProcessor cho token, user ID, entity/order ID hoặc dữ liệu động; đặt default như `NOT_FOUND`.
- Thêm assertion ngay sau extractor để fail rõ khi biến không tồn tại.
- Chỉ dùng JSR223 Groovy khi built-in extractor/assertion không biểu diễn đủ logic.
- Bật script caching và tránh đọc file hoặc parse dữ liệu bất biến ở mọi iteration nếu có thể nạp một lần.
- Tính giá trị dẫn xuất bằng số thập phân chính xác khi liên quan tiền; không dùng floating point tùy tiện.

## 8. Assertion theo từng bước

Mỗi request phải có đủ lớp kiểm tra phù hợp:

- HTTP assertion cho status mong đợi với failure message cụ thể.
- Response/business assertion cho thông báo hoặc field chứng minh thao tác thành công.
- Structured assertion khi cần xác minh entity, product, cart, user hay order khớp dữ liệu đã correlation.
- `try/catch` trong Groovy assertion để JSON lỗi trở thành assertion failure có thông báo, không thành lỗi mơ hồ.
- So sánh ID dưới dạng chuỗi khi kiểu JSON có thể thay đổi; chuẩn hóa số thập phân trước khi so sánh tiền.

## 9. Think time

- Ưu tiên Uniform Random Timer, ví dụ offset cộng range, để tránh đồng bộ request.
- Gắn timer vào bước cần trì hoãn và hiểu rằng timer con của sampler chạy trước sampler đó.
- Không thêm think time trước login nếu mục tiêu là bắt đầu session ngay, trừ khi scenario yêu cầu.
- Giá trị timer phải đến từ đề bài hoặc mô hình hành vi, không mặc định sao chép `1–3 giây`.

## 10. Result Collector

- Dùng Summary Report khi rubric yêu cầu listener này.
- Lưu timestamp, elapsed time, latency, connect time, label, response code/message, thread name, success, bytes, sent bytes, URL, thread counts, idle time, assertion và subresult.
- Lưu field names cho JTL CSV.
- Không lưu response body, request body hay header của sample thành công theo mặc định để tránh tăng file và RAM.
- Lưu assertion failure message để phân tích lỗi; chỉ bật response data on error khi có lý do và đã đánh giá rủi ro dữ liệu nhạy cảm.

## 11. Quality gate trước bàn giao

- XML parse được và mọi test element có `hashTree` đúng cặp.
- JMX mở được bằng đúng phiên bản JMeter cùng plugin cần thiết.
- Node workload là Ultimate Thread Group; không tồn tại Thread Group thường thay thế.
- Test Plan comment khớp workload thật.
- Transaction Controller tạo sample cha và chứa toàn bộ workflow.
- Sampler được đánh số, method/path/body/header đúng API.
- Mọi biến dùng sau đều có nguồn tạo và assertion bảo vệ.
- Mỗi bước có HTTP assertion; bước nghiệp vụ quan trọng có business assertion.
- Dữ liệu riêng theo VU không bị recycle hoặc chia sẻ ngoài ý muốn.
- Timer, error policy và listener có chủ đích.
- Workload, thời gian và CSV path không phụ thuộc `-J` hay property ngoài.
- File `.jmx` chính thức không bị sửa workload để phục vụ smoke test.
- Không còn giá trị được sao chép từ file mẫu mà chưa được xác minh với project hiện tại.

## 12. Smoke test của agent

- Agent tạo `<scenario>_smoke.jmx` cạnh file chính thức, giữ Ultimate Thread Group và ghi cứng 1 VU cùng lịch ngắn trong bản sao.
- Giữ nguyên literal CSV path; không dùng `${__P(...)}`, `-J...`, property ngoài hoặc biến môi trường.
- Chạy output riêng dưới tên có `smoke` và không đưa output này vào tập kết quả performance chính thức.
- Xác minh CSV, authentication, correlation, assertion và một E2E workflow hoàn chỉnh.
- Reset/seed lại dữ liệu sau smoke nếu workflow thay đổi trạng thái.
- Đọc trạng thái/lỗi rồi xóa chính xác bản JMX và toàn bộ output smoke do agent vừa tạo, kể cả khi smoke fail.
- Xác minh artifact chính thức còn nguyên và không còn file/thư mục smoke trong workspace.
- Không yêu cầu người dùng chạy smoke. Chỉ báo `SMOKE-PASS`, `SMOKE-FAIL` hoặc `SMOKE-NOT-RUN` trong phản hồi.
