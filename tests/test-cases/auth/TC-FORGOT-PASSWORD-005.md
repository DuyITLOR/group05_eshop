# TC-FORGOT-PASSWORD-005: Đặt lại mật khẩu bằng mã OTP của tài khoản khác

## Requirement ID
FR-03

## Module / Test type / Technique
Forgot Password / Security / Logical Flow Testing

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- Tài khoản A (`test@eshop.com`) và Tài khoản B (`admin@eshop.com`) tồn tại trong hệ thống.
- Cả hai tài khoản đều đã yêu cầu mã OTP (OTP của A là OTP_A, OTP của B là OTP_B).
- User đang ở trang đặt lại mật khẩu cho Tài khoản B.

## Test data
| Field | Value |
| --- | --- |
| Email cần reset | admin@eshop.com |
| OTP nhập vào | OTP_A (OTP lấy từ tài khoản test@eshop.com) |
| Mật khẩu mới | NewPass123! |
| Xác nhận mật khẩu mới | NewPass123! |

## Test steps
1. Trên giao diện khôi phục mật khẩu của tài khoản B (`admin@eshop.com`), nhập mã OTP của tài khoản A (`test@eshop.com`).
2. Nhập Mật khẩu mới hợp lệ và Xác nhận mật khẩu mới trùng khớp.
3. Bấm nút đặt lại mật khẩu.

## Expected result
Hệ thống từ chối yêu cầu đổi mật khẩu cho tài khoản B, báo lỗi "OTP không hợp lệ hoặc không thuộc về tài khoản này". Mật khẩu cũ của cả hai tài khoản vẫn giữ nguyên.

## Status / Related bugs
Not Run / None
