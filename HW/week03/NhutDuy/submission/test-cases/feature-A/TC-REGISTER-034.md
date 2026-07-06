# TC-REGISTER-034: BVA – mật khẩu có đúng 1 ký tự đặc biệt (biên dưới hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.special_count = 1`, min)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new34@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new34@domain.com` |
| password | `Aa1!bcxy` *(8 ký tự, 1 ký tự đặc biệt `!` ∈ tập, đủ hoa/thường/số)* |
| confirmPassword | `Aa1!bcxy` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 1 ký tự đặc biệt `!` thuộc tập `@$!%*?&` là biên dưới **hợp lệ** theo FR-01 (các nhóm khác đều đủ).

## Actual result
Form **chặn** "Mật khẩu quá yếu!" — biên hợp lệ bị từ chối do regex lỗi: `!` thuộc tập hợp lệ nhưng vẫn bị cấm.

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
