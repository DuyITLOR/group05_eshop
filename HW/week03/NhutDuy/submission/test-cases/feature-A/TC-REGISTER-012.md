# TC-REGISTER-012: BVA – mật khẩu dài 9 ký tự (biên dưới + 1, hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.length = 9`, min+1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `len9@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Bien 9` |
| email | `len9@domain.com` |
| password | `Aa1!bcxyz` *(9 ký tự, đủ hoa/thường/số/đặc biệt)* |
| confirmPassword | `Aa1!bcxyz` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 9 ký tự là biên dưới + 1, hợp lệ theo FR-01 ("tối thiểu 8 ký tự").

## Actual result
Form **chặn** "Mật khẩu quá yếu!" — biên hợp lệ bị từ chối do regex lỗi (đòi khoảng trắng, cấm ký tự đặc biệt).

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
