# TC-FORGOT-PASSWORD-001: Quên mật khẩu và đặt lại mật khẩu thành công theo quy trình 2 bước

## Requirement ID
FR-03

## Test Design ID
TD-POOL-A

## Module / Test type / Technique
Forgot Password / Functional / Scenario Testing

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Quên mật khẩu.
- Email đã tồn tại trong hệ thống.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| OTP | Mã OTP hệ thống hiển thị sau bước lấy mã |
| Mật khẩu mới | NewPass123! |
| Xác nhận mật khẩu mới | NewPass123! |

## Test steps
1. Mở trang Quên mật khẩu.
2. Kiểm tra giao diện hiển thị Step Indicator ở bước lấy mã, ví dụ `Bước 1 / 2`.
3. Nhập Email đã đăng ký.
4. Bấm nút lấy mã OTP.
5. Ghi nhận OTP 6 chữ số được hệ thống hiển thị.
6. Kiểm tra giao diện chuyển sang bước đặt lại mật khẩu và có Step Indicator, ví dụ `Bước 2 / 2`.
7. Nhập OTP vừa nhận.
8. Nhập Mật khẩu mới thỏa điều kiện mạnh.
9. Nhập Xác nhận mật khẩu mới trùng với Mật khẩu mới.
10. Bấm nút đặt lại mật khẩu.
11. Quay lại trang Đăng nhập và đăng nhập bằng mật khẩu mới.

## Expected result
Hệ thống cho phép đặt lại mật khẩu thành công, chuyển hoặc cho phép quay lại trang Đăng nhập, và user đăng nhập được bằng mật khẩu mới.

## Status / Related bugs
Not Run / None
