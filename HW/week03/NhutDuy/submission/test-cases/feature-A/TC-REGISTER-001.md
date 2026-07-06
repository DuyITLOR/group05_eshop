# TC-REGISTER-001: Đăng ký với dữ liệu hợp lệ hoàn toàn

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng hợp lệ EP1+EP3+EP7+EP14)

## Preconditions
- Backend `:3000` và Frontend Web `:5173` đang chạy.
- Email `new01@domain.com` chưa tồn tại trong hệ thống.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new01@domain.com` |
| password | `Password123!` |
| confirmPassword | `Password123!` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên, Email, Mật khẩu (và Xác nhận mật khẩu) theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công, tài khoản được tạo, hệ thống chuyển sang trang `/login`.

## Actual result
Form hiển thị lỗi "Mật khẩu quá yếu!" và **không** gọi API — dù mật khẩu đúng đặc tả FR-01. Nguyên nhân: regex ở `Register.jsx:15` bắt buộc có khoảng trắng và cấm ký tự đặc biệt.

## Status / Related bugs
Fail / BUG-A1 (`[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt`)
