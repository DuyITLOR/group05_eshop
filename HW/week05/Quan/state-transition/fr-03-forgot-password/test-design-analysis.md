# Test Design Analysis - State Transition Testing

## Feature Name

FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Requirement Summary

Người dùng có thể đặt lại mật khẩu qua quy trình 2 bước:

1. Nhập email đã đăng ký để lấy OTP.
2. Nhập OTP, mật khẩu mới và xác nhận mật khẩu mới để đặt lại mật khẩu.

Hệ thống sinh OTP 6 chữ số ngẫu nhiên và gửi qua email; trong môi trường demo, OTP được hiển thị trực tiếp trên màn hình. Giao diện phải hiển thị Step Indicator, ví dụ `Bước 1 / 2`. Bước đặt lại mật khẩu yêu cầu mật khẩu mới tuân thủ chính sách mật khẩu mạnh của FR-01, hai trường mật khẩu phải khớp nhau, và OTP chỉ hợp lệ cho email đã yêu cầu.

API liên quan:

- `POST /api/forgot-password`
- `POST /api/reset-password`

## Reason for Applying State Transition Testing

FR-03 phù hợp với State Transition Testing vì hành vi chính của tính năng phụ thuộc vào trạng thái hiện tại của quy trình: người dùng chưa yêu cầu OTP, đã gửi email hợp lệ, đã có OTP, đang nhập thông tin reset, reset thành công, hoặc bị từ chối vì dữ liệu không hợp lệ. Các transition hợp lệ và không hợp lệ đều ảnh hưởng trực tiếp đến việc có được đặt lại mật khẩu hay không.

## Assumptions

| ID | Assumption |
|---|---|
| AS-ST-01 | Email hợp lệ trong phân tích là email đã đăng ký trong hệ thống, ví dụ `test@eshop.com`. |
| AS-ST-02 | Nếu email chưa đăng ký, hệ thống không tạo OTP có thể dùng để reset mật khẩu. |
| AS-ST-03 | Vì README không mô tả OTP hết hạn, phân tích không đưa transition hết hạn OTP vào phạm vi bắt buộc. |
| AS-ST-04 | Vì README không mô tả việc OTP bị vô hiệu sau khi dùng, đây được xem là coverage note thay vì yêu cầu bắt buộc. |
| AS-ST-05 | Form reset mật khẩu có thể chứa email hoặc hệ thống lưu email đã yêu cầu OTP ở bước trước; trong cả hai trường hợp, OTP phải được ràng buộc với đúng email đã yêu cầu. |

## States

| State ID | State Name | Description |
|---|---|---|
| ST-01 | Login Page | Người dùng đang ở màn hình đăng nhập trước khi bắt đầu flow quên mật khẩu. |
| ST-02 | Step 1 - Email Input | Người dùng đang ở bước nhập email để yêu cầu OTP; giao diện hiển thị `Bước 1 / 2`. |
| ST-03 | OTP Issued | Hệ thống đã tạo OTP 6 chữ số cho email đã đăng ký và hiển thị/gửi OTP. |
| ST-04 | Step 2 - Reset Input | Người dùng đang ở bước nhập OTP, mật khẩu mới và xác nhận mật khẩu mới. |
| ST-05 | Password Reset Success | Mật khẩu được đặt lại thành công. |
| ST-06 | Reset Rejected | Hệ thống từ chối reset do dữ liệu không hợp lệ; người dùng vẫn ở form phù hợp để sửa lỗi. |

## Actions / Events

| Action ID | Action / Event | Description |
|---|---|---|
| AC-01 | Click forgot password | Người dùng mở flow quên mật khẩu từ màn hình đăng nhập. |
| AC-02 | Submit registered email | Người dùng gửi email đã đăng ký để lấy OTP. |
| AC-03 | Submit unregistered email | Người dùng gửi email chưa đăng ký. |
| AC-04 | Submit reset form with valid data | Người dùng gửi OTP đúng, mật khẩu mạnh và xác nhận mật khẩu khớp. |
| AC-05 | Submit wrong OTP | Người dùng gửi OTP không khớp OTP đã tạo. |
| AC-06 | Submit OTP for another email | Người dùng gửi OTP được tạo cho email khác. |
| AC-07 | Submit weak new password | Người dùng gửi mật khẩu mới không đạt chính sách FR-01. |
| AC-08 | Submit mismatched confirmation | Người dùng gửi xác nhận mật khẩu không khớp mật khẩu mới. |
| AC-09 | Click back to login | Người dùng quay lại màn hình đăng nhập. |

## State Transition Table

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

## Valid Transitions

| ID | Transition | Expected Result |
|---|---|---|
| VT-ST-001 | Login Page -> Step 1 - Email Input | Flow quên mật khẩu được mở với Step Indicator `Bước 1 / 2`. |
| VT-ST-002 | Step 1 - Email Input -> OTP Issued | OTP 6 chữ số được tạo cho email đã đăng ký. |
| VT-ST-003 | OTP Issued -> Step 2 - Reset Input | Người dùng được chuyển sang bước nhập OTP và mật khẩu mới. |
| VT-ST-004 | Step 2 - Reset Input -> Password Reset Success | Mật khẩu được đặt lại khi OTP, mật khẩu mới và xác nhận đều hợp lệ. |
| VT-ST-005 | Step 1 - Email Input -> Login Page | Người dùng quay lại đăng nhập từ bước 1. |
| VT-ST-006 | Step 2 - Reset Input -> Login Page | Người dùng quay lại đăng nhập từ bước 2. |

## Invalid Transitions

| ID | Invalid Transition | Expected Result |
|---|---|---|
| IT-ST-001 | Step 1 - Email Input -> OTP Issued với email chưa đăng ký | Không tạo OTP có thể dùng để reset mật khẩu. |
| IT-ST-002 | Step 2 - Reset Input -> Password Reset Success với OTP sai | Reset bị từ chối, mật khẩu không thay đổi. |
| IT-ST-003 | Step 2 - Reset Input -> Password Reset Success với OTP của email khác | Reset bị từ chối vì OTP không thuộc email đã yêu cầu. |
| IT-ST-004 | Step 2 - Reset Input -> Password Reset Success với mật khẩu yếu | Reset bị từ chối vì vi phạm chính sách mật khẩu FR-01. |
| IT-ST-005 | Step 2 - Reset Input -> Password Reset Success với xác nhận mật khẩu không khớp | Reset bị từ chối vì hai mật khẩu không khớp. |

## Test Coverage Notes

- Cần kiểm tra OTP là 6 chữ số theo FR-03.
- Cần kiểm tra Step Indicator ở bước lấy OTP là `Bước 1 / 2`; README không nêu rõ text bắt buộc ở bước 2, nhưng nên kiểm tra có chỉ báo bước phù hợp cho quy trình 2 bước.
- Cần kiểm tra chính sách mật khẩu mạnh từ FR-01: tối thiểu 8 ký tự, có chữ hoa, chữ thường, chữ số và ký tự đặc biệt thuộc `@`, `$`, `!`, `%`, `*`, `?`, `&`.
- README không quy định OTP hết hạn, giới hạn số lần nhập OTP sai, hoặc vô hiệu OTP sau khi dùng; các điểm này nên được ghi nhận là gap nếu cần kiểm thử bảo mật sâu hơn.

## Review Question

Bạn có xác nhận Test Design Analysis này không?  
Trả lời `yes` để sinh test cases, hoặc gửi feedback để tôi chỉnh lại.
