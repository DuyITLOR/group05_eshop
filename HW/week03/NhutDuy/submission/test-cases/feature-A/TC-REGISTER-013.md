# TC-REGISTER-013: Đăng ký với mật khẩu thiếu chữ thường

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP10 — thiếu chữ thường)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new13@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new13@domain.com` |
| password | `PASSWORD123!` *(không có chữ thường)* |
| confirmPassword | `PASSWORD123!` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu thiếu chữ thường (FR-01: cần ≥1 chữ thường).

## Actual result
Form chặn "Mật khẩu quá yếu!" — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi đòi khoảng trắng và cấm ký tự đặc biệt, **không** phải vì thiếu chữ thường — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
