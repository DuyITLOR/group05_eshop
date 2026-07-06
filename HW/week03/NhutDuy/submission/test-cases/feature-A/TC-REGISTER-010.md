# TC-REGISTER-010: BVA – mật khẩu dài 7 ký tự (biên dưới − 1, không hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.length = 7`, min−1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `len7@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Bien 7` |
| email | `len7@domain.com` |
| password | `Aa1!bcx` *(7 ký tự, đủ hoa/thường/số/đặc biệt nhưng dưới 8)* |
| confirmPassword | `Aa1!bcx` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối — 7 ký tự là biên dưới − 1, ngắn hơn tối thiểu 8 ký tự theo FR-01.

## Actual result
Form chặn — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi (đòi khoảng trắng, cấm ký tự đặc biệt `!`), **không** phải vì độ dài < 8 — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
