# TC-REGISTER-023: BVA – tên dài 2 ký tự (biên dưới + 1, hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `name.length = 2`, min+1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new23@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"AB"` *(2 ký tự, biên dưới + 1)* |
| email | `new23@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 2 ký tự là biên dưới + 1, hợp lệ theo FR-01 (`name.length ≥ 1`).

## Actual result
Form tạo user thành công.

## Status / Related bugs
Pass / None
