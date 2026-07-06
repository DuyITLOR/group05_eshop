# TC-REGISTER-016: Đăng ký với tên toàn chữ số

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP2c — tên toàn chữ số)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new16@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"12345"` *(chỉ gồm chữ số)* |
| email | `new16@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên là chuỗi toàn chữ số, nhập Email và Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì tên không hợp lệ (giả định nghiệp vụ: tên không nên chỉ gồm chữ số).

## Actual result
API tạo user với `name = 12345` (HTTP 200). Backend không validate định dạng tên.

## Status / Related bugs
Fail / BUG-A2 (`[BUG][module: register] API /register không validate đầu vào`)
