# TC-REGISTER-017: Đăng ký với tên chứa thẻ HTML (nguy cơ XSS)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP2d — tên chứa ký tự đặc biệt / thẻ HTML)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new17@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"<b>x</b>"` *(chứa thẻ HTML)* |
| email | `new17@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên là chuỗi chứa thẻ HTML, nhập Email và Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối hoặc khử HTML trong tên (giả định nghiệp vụ: cần chặn để tránh stored XSS).

## Actual result
API lưu nguyên chuỗi `<b>x</b>` (HTTP 200) → nguy cơ stored XSS khi render tên ở các màn hình khác. Backend không khử và không validate tên.

## Status / Related bugs
Fail / BUG-A2 (`[BUG][module: register] API /register không validate đầu vào`)
