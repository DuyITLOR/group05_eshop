# TC-REGISTER-009: Xác nhận mật khẩu không khớp

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP15 — confirmPassword không khớp)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new09@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new09@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Khac1` *(khác `password`)* |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên, Email, Mật khẩu theo Test data.
3. Nhập Xác nhận mật khẩu khác với Mật khẩu.
4. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối, hiển thị lỗi kiểu "Mật khẩu không khớp" (FR-01: từ chối khi `confirmPassword` không khớp `password`).

## Actual result
Form **không có** trường Xác nhận mật khẩu → không thể kiểm tra ràng buộc liên biến này. Đặc tả FR-01 yêu cầu trường này nhưng `Register.jsx` thiếu.

## Status / Related bugs
Fail / BUG-A4 (`[BUG][module: register] Form thiếu trường Xác nhận mật khẩu`)
