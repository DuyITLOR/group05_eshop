# TC-REGISTER-014: Đăng ký với mật khẩu thiếu chữ số

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP11 — thiếu chữ số)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new14@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new14@domain.com` |
| password | `Password!` *(không có chữ số)* |
| confirmPassword | `Password!` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu thiếu chữ số (FR-01: cần ≥1 chữ số).

## Actual result
Form chặn "Mật khẩu quá yếu!" — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi đòi khoảng trắng và cấm ký tự đặc biệt, **không** phải vì thiếu chữ số — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
