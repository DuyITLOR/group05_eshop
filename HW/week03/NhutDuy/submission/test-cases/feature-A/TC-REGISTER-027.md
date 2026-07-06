# TC-REGISTER-027: BVA – mật khẩu có 0 chữ thường (biên dưới − 1, không hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.lowercase_count = 0`, min−1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new27@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new27@domain.com` |
| password | `AA1!BCXY` *(8 ký tự, 0 thường, đủ hoa/số/đặc biệt)* |
| confirmPassword | `AA1!BCXY` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu có 0 chữ thường (FR-01: cần ≥1 chữ thường).

## Actual result
Form chặn — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi (không có khoảng trắng + cấm ký tự đặc biệt), **không** phải vì thiếu chữ thường — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
