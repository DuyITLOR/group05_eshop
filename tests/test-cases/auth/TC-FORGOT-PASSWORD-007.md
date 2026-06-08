# TC-FORGOT-PASSWORD-007: Đặt lại mật khẩu khi Mật khẩu mới và Xác nhận mật khẩu mới không trùng khớp

## Requirement ID
FR-03

## Module / Test type / Technique
Forgot Password / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đã nhận mã OTP hợp lệ cho email `test@eshop.com` và đang ở trang đặt lại mật khẩu Bước 2.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| OTP | Mã OTP hợp lệ nhận được |
| Mật khẩu mới | NewPass123! |
| Xác nhận mật khẩu mới | Different123! |

## Test steps
1. Ở giao diện Bước 2, điền OTP hợp lệ.
2. Nhập Mật khẩu mới: `NewPass123!`.
3. Nhập Xác nhận mật khẩu mới: `Different123!`.
4. Nhấn nút đặt lại mật khẩu.

## Expected result
Giao diện báo lỗi "Mật khẩu xác nhận không khớp" (hoặc thông báo tương đương) hiển thị trên nút submit. Hệ thống không cho phép đổi mật khẩu.

## Status / Related bugs
Not Run / None
