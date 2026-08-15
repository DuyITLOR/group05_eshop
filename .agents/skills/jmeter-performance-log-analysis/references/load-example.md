# Ví dụ Load Test: workflow mua hàng có xác thực

Chỉ dùng làm ví dụ cấu trúc. Không tái sử dụng các giá trị này làm threshold cho hệ thống khác.

## Scenario

- Công cụ: Apache JMeter 5.6.3 với Ultimate Thread Group.
- Workflow: Login -> Products -> Add to Cart -> Get Cart -> Checkout -> Get Order Detail.
- Lịch tải: 30 VU, ramp-up 60 giây, hold 300 giây, ramp-down 30 giây.
- Think time: constant offset 1000 ms cộng tối đa 2000 ms ngẫu nhiên.
- Dữ liệu: mỗi VU dùng một tài khoản CSV riêng.
- Output: raw JTL, HTML Dashboard và ảnh liên kết cổng backend 3000 với PID Node.js.

## Correlation và assertion

- Extract và assert JWT cùng user ID sau Login.
- Chọn và assert một product hợp lệ từ Products.
- Assert thông báo Add to Cart.
- Assert cart chứa đúng product đã chọn.
- Extract và assert order ID sau Checkout.
- Assert Order Detail khớp order vừa tạo.

Với workflow phụ thuộc, `Start Next Thread Loop` giúp tránh request phía sau vô nghĩa khi sampler lỗi. Phải kiểm tra hành vi thực tế với plugin Thread Group đang dùng.

## Kết quả quan sát

HTML Report đã kiểm chứng ghi nhận:

- 1.043 E2E transaction sample.
- 0 lỗi.
- Khoảng 2,70 E2E transaction/giây.
- Khoảng 16,06 request sample/giây.
- RAM backend khoảng 156 MB trong ảnh sustained load.
- Task Manager hiển thị CPU backend là `00` vì mức sử dụng thấp hơn độ chính xác số nguyên của giao diện.

Các giá trị này chỉ mô tả một máy và một lần chạy. Chúng là bằng chứng, không phải SLO dùng lại.

## Bài học từ review

- Resolve đường dẫn test data theo vị trí JMX để GUI và CLI đọc cùng một file.
- Seed tài khoản sau khi backend khởi động nếu startup tạo lại database.
- Dùng đường dẫn JTL và HTML mới; log cũ hoặc nối thêm có thể làm sai phân tích.
- Transaction Controller có thể khiến terminal, listener, JTL và HTML hiển thị count khác nhau.
- Không kết luận loop chỉ từ một terminal summary. Kiểm tra label, timestamp, thread name và HTML statistics.
- Raw JTL có thể chứa cả transaction cha và request con khi bật lưu subresult.
- Trong ramp-down, request cuối có thể ít sample hơn vì thread dừng trước khi hoàn tất vòng tiếp theo.

