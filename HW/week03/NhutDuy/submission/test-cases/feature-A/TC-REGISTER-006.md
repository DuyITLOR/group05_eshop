# TC-REGISTER-006: Đăng ký với mật khẩu yếu (có khoảng trắng, thiếu ký tự đặc biệt)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP12 — thiếu ký tự đặc biệt)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new06@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Yeu Mat Khau` |
| email | `new06@domain.com` |
| password | `Password 1`  *(có khoảng trắng, KHÔNG có ký tự đặc biệt → yếu theo FR-01)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu không đủ mạnh (thiếu ký tự đặc biệt).

## Actual result
Form **chấp nhận** và tạo tài khoản thành công với mật khẩu yếu. Regex lỗi xem khoảng trắng `\s` là điều kiện "mạnh", nên mật khẩu có khoảng trắng vượt qua kiểm tra.

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
