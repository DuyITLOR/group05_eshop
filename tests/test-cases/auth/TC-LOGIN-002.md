# TC-LOGIN-002: Đăng nhập thất bại với mật khẩu sai

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.
- Tài khoản `test@eshop.com` tồn tại, không bị khóa, `login_attempts = 0`.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu | SaiMatKhau123! |

## Test steps
1. Mở trang Đăng nhập.
2. Nhập Email hợp lệ.
3. Nhập Mật khẩu sai.
4. Bấm nút Đăng nhập.

## Expected result
- Đăng nhập thất bại, hệ thống hiển thị thông báo lỗi chung (không tiết lộ chi tiết nguyên nhân).
- API trả về status 401 với message "Invalid email or password".
- Bộ đếm `login_attempts` tăng đúng **1 đơn vị** (từ 0 lên 1).
- Người dùng vẫn ở trang Đăng nhập.

## Status / Related bugs
Not Run / None
