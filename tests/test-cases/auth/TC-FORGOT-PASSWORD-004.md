# TC-FORGOT-PASSWORD-004: Đặt lại mật khẩu với OTP sai hoặc không hợp lệ

## Requirement ID
FR-03

## Module / Test type / Technique
Forgot Password / Functional / Error Guessing

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đã hoàn thành Bước 1 và đang ở trang Bước 2 (Nhập OTP & Mật khẩu mới).
- Email test tồn tại và đã được kích hoạt OTP.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| OTP sai | 999999 |
| Mật khẩu mới | NewPass123! |
| Xác nhận mật khẩu mới | NewPass123! |

## Test steps
1. Nhập mã OTP sai vào ô nhập OTP.
2. Nhập Mật khẩu mới hợp lệ.
3. Nhập Xác nhận mật khẩu mới trùng khớp.
4. Bấm nút đặt lại mật khẩu.

## Expected result
Hệ thống không cho phép đổi mật khẩu, hiển thị thông báo lỗi "Mã OTP không hợp lệ" hoặc thông báo tương tự, và giữ nguyên giao diện Bước 2. Mật khẩu cũ của user vẫn giữ nguyên hiệu lực.

## Status / Related bugs
Not Run / None
