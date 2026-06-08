# TC-REGISTER-001: Đăng ký tài khoản thành công với dữ liệu hợp lệ

## Requirement ID
FR-01

## Test Design ID
TD-POOL-A

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng ký.
- Email dùng để đăng ký chưa tồn tại trong hệ thống.

## Test data
| Field | Value |
| --- | --- |
| Họ tên | Nguyen Van A |
| Email | register01@example.com |
| Mật khẩu | Password123! |
| Xác nhận mật khẩu | Password123! |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên hợp lệ.
3. Nhập Email hợp lệ và chưa tồn tại.
4. Nhập Mật khẩu thỏa điều kiện mạnh.
5. Nhập Xác nhận mật khẩu trùng với Mật khẩu.
6. Bấm nút Đăng ký.

## Expected result
Đăng ký thành công và người dùng được chuyển tới trang Đăng nhập.

## Status / Related bugs
Not Run / None
