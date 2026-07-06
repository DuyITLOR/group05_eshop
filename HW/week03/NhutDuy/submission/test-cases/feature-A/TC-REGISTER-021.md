# TC-REGISTER-021: Đăng ký với mật khẩu toàn chữ số

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP-NUM — mật khẩu toàn chữ số)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new21@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new21@domain.com` |
| password | `12345678` *(toàn chữ số, thiếu hoa/thường/đặc biệt)* |
| confirmPassword | `12345678` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu thiếu chữ hoa, chữ thường và ký tự đặc biệt (FR-01).

## Actual result
Form chặn "Mật khẩu quá yếu!" — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi đòi khoảng trắng và cấm ký tự đặc biệt, **không** phải vì thiếu các nhóm ký tự — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
