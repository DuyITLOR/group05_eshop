# TC-REGISTER-002: Đăng ký với tên rỗng

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP2 — tên rỗng)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new02@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `""` *(để trống)* |
| email | `new02@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Để trống trường Họ tên, nhập Email và Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối, hiển thị lỗi kiểu "Họ tên bắt buộc" (FR-01: `name` là trường bắt buộc).

## Actual result
Trình duyệt chặn submit bằng thuộc tính HTML5 `required` ("Please fill out this field") → `handleSubmit` không chạy → API không được gọi → form từ chối **đúng**.

## Status / Related bugs
Pass † / None
