# Use Case Flows - FR-03 Forgot Password

## Use Case

| Field | Value |
|---|---|
| Use Case ID | UC-FR-03 |
| Name | Quên mật khẩu & Đặt lại mật khẩu |
| Primary Actor | User |
| Goal | Đặt lại mật khẩu bằng OTP được tạo cho email đã đăng ký. |

## Main Success Scenario

| Step | Actor Action | System Response |
|---|---|---|
| 1 | User chọn chức năng quên mật khẩu từ màn hình đăng nhập. | Hệ thống hiển thị bước nhập email với Step Indicator `Bước 1 / 2` và nút `Quay lại đăng nhập`. |
| 2 | User nhập email đã đăng ký. | Hệ thống chấp nhận email. |
| 3 | User gửi yêu cầu lấy OTP. | Hệ thống tạo OTP 6 chữ số ngẫu nhiên và gửi/hiển thị OTP. |
| 4 | User chuyển sang bước đặt lại mật khẩu. | Hệ thống hiển thị form nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. |
| 5 | User nhập OTP đúng, mật khẩu mới mạnh và xác nhận mật khẩu khớp. | Hệ thống chấp nhận dữ liệu reset. |
| 6 | User gửi form đặt lại mật khẩu. | Hệ thống cập nhật mật khẩu. |
| 7 | User nhận kết quả reset thành công. | Hệ thống thông báo đặt lại mật khẩu thành công. |

## Alternative Flows

| Flow ID | Condition | Flow Description | Expected Result |
|---|---|---|---|
| AF-UC-001 | User hủy ở bước 1 | User bấm `Quay lại đăng nhập`. | Hệ thống quay lại màn hình đăng nhập, không tạo OTP. |
| AF-UC-002 | OTP được hiển thị trong môi trường demo | Sau khi gửi email hợp lệ, hệ thống hiển thị OTP trực tiếp trên màn hình. | User có thể dùng OTP hiển thị để reset mật khẩu. |

## Exception Flows

| Flow ID | Error Condition | System Response | Expected Result |
|---|---|---|---|
| EF-UC-001 | Email chưa đăng ký | Hệ thống không tạo OTP có thể dùng để reset. | User không thể reset mật khẩu bằng email chưa đăng ký. |
| EF-UC-002 | OTP sai | Hệ thống từ chối reset. | Mật khẩu không thay đổi. |
| EF-UC-003 | OTP thuộc email khác | Hệ thống từ chối reset. | Mật khẩu không thay đổi. |
| EF-UC-004 | Mật khẩu mới yếu | Hệ thống từ chối reset. | Mật khẩu không thay đổi. |
| EF-UC-005 | Xác nhận mật khẩu không khớp | Hệ thống từ chối reset. | Mật khẩu không thay đổi. |

## Notes

- Các flow về OTP hết hạn, resend OTP, rate limit, hoặc khóa sau nhiều lần nhập sai không được mô tả trong README.
- Nếu cần test các flow bảo mật này, cần cập nhật hoặc xác nhận thêm yêu cầu.
