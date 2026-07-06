# TC-REGISTER-026: BVA – mật khẩu có 2 chữ hoa (biên dưới + 1, hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.uppercase_count = 2`, min+1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new26@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new26@domain.com` |
| password | `AAa1!bxy` *(8 ký tự, 2 hoa, 1 thường, 1 số, 1 đặc biệt)* |
| confirmPassword | `AAa1!bxy` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 2 chữ hoa là biên dưới + 1, hợp lệ theo FR-01 (các nhóm khác đều đủ).

## Actual result
Form **chặn** "Mật khẩu quá yếu!" — biên hợp lệ bị từ chối do regex lỗi (đòi khoảng trắng, cấm ký tự đặc biệt).

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
