# TC-REGISTER-015: Đăng ký với tên chỉ gồm khoảng trắng

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP2b — tên chỉ gồm khoảng trắng)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new15@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"   "` *(chỉ gồm khoảng trắng)* |
| email | `new15@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên là chuỗi chỉ gồm khoảng trắng, nhập Email và Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì tên rỗng-về-ngữ-nghĩa sau khi trim (FR-01: `name` bắt buộc, không chỉ gồm khoảng trắng).

## Actual result
HTML5 `required` không chặn được chuỗi khoảng trắng → API tạo user với `name = "   "`. Backend không trim và không validate tên.

## Status / Related bugs
Fail / BUG-A2 (`[BUG][module: register] API /register không validate đầu vào`)
