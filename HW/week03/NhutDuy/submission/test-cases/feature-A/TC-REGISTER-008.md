# TC-REGISTER-008: Đăng ký với mật khẩu rỗng

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP13 — mật khẩu rỗng)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new08@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new08@domain.com` |
| password | `""` *(để trống)* |
| confirmPassword | `""` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên và Email, để trống trường Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối (FR-01: `password` là trường bắt buộc).

## Actual result
Trình duyệt chặn submit bằng thuộc tính HTML5 `required` ("Please fill out this field") → form từ chối **đúng**, API không được gọi.

## Status / Related bugs
Pass † / None
