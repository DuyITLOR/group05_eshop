# TC-LOGIN-005: Khóa tài khoản sau 3 lần đăng nhập sai liên tiếp

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Boundary Value Analysis

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.
- Tài khoản `test@eshop.com` tồn tại, không bị khóa, `login_attempts = 0`.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu sai | SaiMatKhau123! |

## Test steps
1. Mở trang Đăng nhập.
2. Nhập Email hợp lệ và Mật khẩu sai, bấm Đăng nhập. (Lần 1)
3. Nhập Email hợp lệ và Mật khẩu sai, bấm Đăng nhập. (Lần 2)
4. Nhập Email hợp lệ và Mật khẩu sai, bấm Đăng nhập. (Lần 3)
5. Kiểm tra giá trị `login_attempts` và `locked_until` trong database.

## Expected result
- Lần 1, 2: API trả về 401 "Invalid email or password", `login_attempts` tăng đúng 1 đơn vị mỗi lần.
- Lần 3: `login_attempts = 3`, tài khoản bị khóa 30 giây (demo), `locked_until` được set.
- Sau lần 3, hệ thống trả về thông báo lỗi phù hợp khi thử đăng nhập tiếp.

## Status / Related bugs
Not Run / None
