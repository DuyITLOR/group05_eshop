# Test Design Analysis - Use Case Testing

## Feature Name

FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Requirement Summary

Người dùng đặt lại mật khẩu bằng cách yêu cầu OTP qua email đã đăng ký, sau đó nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. OTP là mã 6 chữ số ngẫu nhiên, gửi qua email hoặc hiển thị trực tiếp trên màn hình trong môi trường demo. Mật khẩu mới phải tuân thủ chính sách mật khẩu mạnh của FR-01, hai trường mật khẩu phải khớp, và OTP chỉ hợp lệ cho email đã yêu cầu.

## Reason for Applying Use Case Testing

FR-03 phù hợp với Use Case Testing vì có actor rõ ràng là người dùng, mục tiêu rõ ràng là đặt lại mật khẩu khi quên mật khẩu, có luồng thành công chính và nhiều luồng lỗi do dữ liệu không hợp lệ như email chưa đăng ký, OTP sai, OTP của email khác, mật khẩu yếu hoặc xác nhận mật khẩu không khớp.

## Assumptions

| ID | Assumption |
|---|---|
| AS-UC-01 | Người dùng có thể truy cập flow quên mật khẩu từ màn hình đăng nhập. |
| AS-UC-02 | Email đã đăng ký dùng cho happy path là `test@eshop.com`. |
| AS-UC-03 | API `POST /api/forgot-password` trả về `resetToken` trong môi trường demo theo `api_specification.md`. |
| AS-UC-04 | README không mô tả OTP hết hạn, giới hạn số lần nhập sai, hoặc hành vi gửi email thất bại; các luồng này không nằm trong phạm vi bắt buộc. |
| AS-UC-05 | README yêu cầu có nút `Quay lại đăng nhập` ở bước 1; nếu UI cũng hiển thị nút này ở bước 2 thì kiểm thử như một alternative flow hợp lệ, nhưng đây không phải yêu cầu bắt buộc từ README. |

## Actors

| Actor | Description |
|---|---|
| User | Người dùng đã có tài khoản và cần đặt lại mật khẩu. |
| Email/Demo OTP Mechanism | Cơ chế gửi OTP qua email hoặc hiển thị OTP trực tiếp trong môi trường demo. |

## Preconditions

| ID | Precondition |
|---|---|
| PC-UC-01 | Người dùng đang ở màn hình đăng nhập hoặc có thể mở flow quên mật khẩu. |
| PC-UC-02 | Tài khoản cần reset tồn tại trong hệ thống. |
| PC-UC-03 | Hệ thống có thể tạo OTP 6 chữ số cho email đã đăng ký. |

## Postconditions

| ID | Postcondition |
|---|---|
| PO-UC-01 | Nếu luồng thành công, mật khẩu của tài khoản được cập nhật thành mật khẩu mới. |
| PO-UC-02 | Nếu luồng lỗi xảy ra, mật khẩu cũ không bị thay đổi. |
| PO-UC-03 | Người dùng có thể quay lại màn hình đăng nhập bằng nút `Quay lại đăng nhập` ở bước 1. |

## Main Success Scenario

| Step | Actor Action | System Response |
|---|---|---|
| 1 | User chọn chức năng quên mật khẩu từ màn hình đăng nhập. | Hệ thống hiển thị bước nhập email với Step Indicator `Bước 1 / 2` và nút `Quay lại đăng nhập`. |
| 2 | User nhập email đã đăng ký. | Hệ thống chấp nhận email. |
| 3 | User gửi yêu cầu lấy OTP. | Hệ thống gọi `POST /api/forgot-password`, tạo OTP 6 chữ số ngẫu nhiên và gửi/hiển thị OTP. |
| 4 | User chuyển sang bước đặt lại mật khẩu. | Hệ thống hiển thị form nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. |
| 5 | User nhập OTP đúng, mật khẩu mới mạnh và xác nhận mật khẩu khớp. | Hệ thống chấp nhận dữ liệu reset. |
| 6 | User gửi form đặt lại mật khẩu. | Hệ thống gọi `POST /api/reset-password` và cập nhật mật khẩu. |
| 7 | User nhận kết quả reset thành công. | Hệ thống thông báo đặt lại mật khẩu thành công. |

## Alternative Flows

| Flow ID | Condition | Flow Description | Expected Result |
|---|---|---|---|
| AF-UC-001 | User muốn hủy ở bước 1 | User bấm `Quay lại đăng nhập` khi đang ở bước nhập email. | Hệ thống quay lại màn hình đăng nhập, không tạo OTP. |
| AF-UC-002 | Môi trường demo hiển thị OTP trực tiếp | Sau khi email hợp lệ được gửi, OTP được hiển thị trực tiếp trên màn hình thay vì chỉ gửi email. | User có thể dùng OTP hiển thị để tiếp tục bước đặt lại mật khẩu. |

## Exception Flows

| Flow ID | Error Condition | System Response | Expected Result |
|---|---|---|---|
| EF-UC-001 | Email chưa đăng ký được gửi ở bước lấy OTP | Hệ thống từ chối hoặc trả phản hồi an toàn và không tạo OTP có thể dùng để reset. | User không thể reset mật khẩu bằng email chưa đăng ký. |
| EF-UC-002 | OTP nhập ở bước reset không đúng | Hệ thống từ chối yêu cầu reset. | Mật khẩu không thay đổi. |
| EF-UC-003 | OTP hợp lệ nhưng thuộc email khác | Hệ thống từ chối yêu cầu reset vì OTP không hợp lệ cho email đang reset. | Mật khẩu không thay đổi. |
| EF-UC-004 | Mật khẩu mới không đạt chính sách FR-01 | Hệ thống từ chối yêu cầu reset và hiển thị lỗi mật khẩu. | Mật khẩu không thay đổi. |
| EF-UC-005 | Xác nhận mật khẩu mới không khớp mật khẩu mới | Hệ thống từ chối yêu cầu reset và hiển thị lỗi xác nhận mật khẩu. | Mật khẩu không thay đổi. |

## Use Case Coverage Notes

- Happy path cần kiểm tra đầy đủ hai API: `POST /api/forgot-password` và `POST /api/reset-password`.
- Cần kiểm tra Step Indicator ở bước 1 theo README; với bước 2, README chỉ mô tả quy trình 2 bước nên nên kiểm tra UI có chỉ báo bước phù hợp nhưng ghi nhận là suy luận từ yêu cầu tổng.
- Cần kiểm tra mật khẩu mới theo chính sách FR-01: tối thiểu 8 ký tự, có chữ hoa, chữ thường, chữ số và ký tự đặc biệt thuộc `@`, `$`, `!`, `%`, `*`, `?`, `&`.
- README không nêu response cụ thể khi reset thành công trong `api_specification.md`; test chi tiết nên kiểm tra theo behavior thực tế hoặc API hiện hành.
- README không nêu OTP hết hạn, rate limit, resend OTP, hoặc khóa sau nhiều lần nhập OTP sai; không đưa các flow này vào phạm vi bắt buộc.

## Review Question

Bạn có xác nhận Use Case Test Design Analysis này không?  
Trả lời `yes` để sinh test cases, hoặc gửi feedback để tôi chỉnh lại.
