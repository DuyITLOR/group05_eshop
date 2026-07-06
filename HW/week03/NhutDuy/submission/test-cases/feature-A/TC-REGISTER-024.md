# TC-REGISTER-024: BVA – mật khẩu có 0 chữ hoa (biên dưới − 1, không hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.uppercase_count = 0`, min−1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new24@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new24@domain.com` |
| password | `aa1!bcxy` *(8 ký tự, 0 hoa, 1 thường, 1 số, 1 đặc biệt)* |
| confirmPassword | `aa1!bcxy` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu có 0 chữ hoa (FR-01: cần ≥1 chữ hoa).

## Actual result
Form chặn — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi (không có khoảng trắng + cấm ký tự đặc biệt), **không** phải vì thiếu chữ hoa — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
