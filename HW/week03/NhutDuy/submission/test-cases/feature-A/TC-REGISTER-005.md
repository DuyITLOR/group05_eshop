# TC-REGISTER-005: Đăng ký với email rỗng

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP6 — email rỗng)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `""` *(để trống)* |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên và Mật khẩu, để trống trường Email theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối (FR-01: `email` là trường bắt buộc).

## Actual result
Trình duyệt chặn submit bằng thuộc tính HTML5 `required` ("Please fill out this field") → form từ chối **đúng**, API không được gọi.

## Status / Related bugs
Pass † / None
