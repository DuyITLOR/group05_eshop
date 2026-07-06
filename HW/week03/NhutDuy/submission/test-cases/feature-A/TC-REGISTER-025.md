# TC-REGISTER-025: BVA – mật khẩu có đúng 1 chữ hoa (biên dưới hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.uppercase_count = 1`, min)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new25@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new25@domain.com` |
| password | `Aa1!bcxy` *(8 ký tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt)* |
| confirmPassword | `Aa1!bcxy` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 1 chữ hoa là biên dưới **hợp lệ** theo FR-01 (cần ≥1 chữ hoa, các nhóm khác đều đủ).

## Actual result
Form **chặn** "Mật khẩu quá yếu!" — biên hợp lệ bị từ chối do regex lỗi (`!` là ký tự đặc biệt trong tập nhưng bị cấm).

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
