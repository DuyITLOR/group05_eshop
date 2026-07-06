# TC-REGISTER-022: BVA – tên dài đúng 1 ký tự (biên dưới hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `name.length = 1`, min)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new22@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"A"` *(1 ký tự, biên dưới hợp lệ)* |
| email | `new22@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — 1 ký tự là biên dưới **hợp lệ** theo FR-01 (`name.length ≥ 1`).

## Actual result
Form tạo user thành công (HTTP 200).

## Status / Related bugs
Pass / None
