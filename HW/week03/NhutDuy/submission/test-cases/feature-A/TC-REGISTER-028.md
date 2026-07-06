# TC-REGISTER-028: BVA – mật khẩu có đúng 1 chữ thường (biên dưới hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.lowercase_count = 1`, min)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new28@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new28@domain.com` |
| password | `AAa1!BCX` *(8 ký tự, 1 thường, đủ hoa/số/đặc biệt)* |
| confirmPassword | `AAa1!BCX` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 1 chữ thường là biên dưới **hợp lệ** theo FR-01 (cần ≥1 chữ thường, các nhóm khác đều đủ).

## Actual result
Form **chặn** "Mật khẩu quá yếu!" — biên hợp lệ bị từ chối do regex lỗi (đòi khoảng trắng, cấm ký tự đặc biệt).

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
