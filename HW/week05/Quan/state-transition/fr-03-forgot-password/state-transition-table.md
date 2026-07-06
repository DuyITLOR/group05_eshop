# State Transition Table - FR-03 Forgot Password

## States

| State ID | State Name | Description |
|---|---|---|
| ST-01 | Login Page | Người dùng đang ở màn hình đăng nhập. |
| ST-02 | Step 1 - Email Input | Người dùng nhập email để lấy OTP. |
| ST-03 | OTP Issued | OTP 6 chữ số đã được tạo cho email đã đăng ký. |
| ST-04 | Step 2 - Reset Input | Người dùng nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. |
| ST-05 | Password Reset Success | Mật khẩu được đặt lại thành công. |
| ST-06 | Reset Rejected | Reset bị từ chối do dữ liệu không hợp lệ. |

## Transition Table

| Transition ID | Current State | Action / Event | Condition | Next State | Valid / Invalid | Expected Result |
|---|---|---|---|---|---|---|
| TR-ST-001 | Login Page | Click forgot password | Người dùng muốn reset mật khẩu | Step 1 - Email Input | Valid | Hiển thị form nhập email và Step Indicator `Bước 1 / 2`. |
| TR-ST-002 | Step 1 - Email Input | Submit registered email | Email đã đăng ký và đúng định dạng | OTP Issued | Valid | Hệ thống tạo OTP 6 chữ số ngẫu nhiên cho email đã yêu cầu. |
| TR-ST-003 | OTP Issued | Show reset step | OTP đã được tạo thành công | Step 2 - Reset Input | Valid | Hiển thị form nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. |
| TR-ST-004 | Step 2 - Reset Input | Submit reset form with valid data | OTP đúng email đã yêu cầu, mật khẩu mạnh, xác nhận khớp | Password Reset Success | Valid | Mật khẩu được đặt lại thành công. |
| TR-ST-005 | Step 1 - Email Input | Submit unregistered email | Email chưa đăng ký | Step 1 - Email Input | Invalid | Không tạo OTP có thể dùng để reset; hiển thị phản hồi lỗi hoặc phản hồi an toàn. |
| TR-ST-006 | Step 2 - Reset Input | Submit wrong OTP | OTP không khớp OTP đã tạo | Reset Rejected | Invalid | Từ chối reset, mật khẩu không thay đổi. |
| TR-ST-007 | Step 2 - Reset Input | Submit OTP for another email | OTP hợp lệ nhưng thuộc email khác | Reset Rejected | Invalid | Từ chối reset vì OTP không thuộc email đã yêu cầu. |
| TR-ST-008 | Step 2 - Reset Input | Submit weak new password | Mật khẩu mới không đạt FR-01 | Reset Rejected | Invalid | Từ chối reset và thông báo lỗi chính sách mật khẩu. |
| TR-ST-009 | Step 2 - Reset Input | Submit mismatched confirmation | Xác nhận mật khẩu không khớp | Reset Rejected | Invalid | Từ chối reset và thông báo hai mật khẩu không khớp. |
| TR-ST-010 | Step 1 - Email Input | Click back to login | Người dùng hủy flow | Login Page | Valid | Quay lại màn hình đăng nhập. |
| TR-ST-011 | Step 2 - Reset Input | Click back to login | Người dùng hủy flow | Login Page | Valid | Quay lại màn hình đăng nhập, không đặt lại mật khẩu. |

## Transition Notes

- `Reset Rejected` là trạng thái logic thể hiện kết quả từ chối; UI có thể vẫn ở `Step 2 - Reset Input` để người dùng sửa dữ liệu.
- OTP hết hạn, khóa sau nhiều lần nhập sai, và vô hiệu OTP sau khi dùng không được mô tả trong README nên không được xem là transition bắt buộc.
