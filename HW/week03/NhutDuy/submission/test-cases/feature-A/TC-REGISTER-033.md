# TC-REGISTER-033: BVA – mật khẩu có 0 ký tự đặc biệt (biên dưới − 1, không hợp lệ)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.special_count = 0`, min−1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new33@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new33@domain.com` |
| password | `Aa12bcxy` *(8 ký tự, 0 ký tự đặc biệt, đủ hoa/thường/số)* |
| confirmPassword | `Aa12bcxy` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì mật khẩu có 0 ký tự đặc biệt (FR-01: cần ≥1 ký tự đặc biệt thuộc `@$!%*?&`).

## Actual result
Form chặn — khớp kết quả mong đợi (từ chối). · Lưu ý: nguyên nhân chặn là regex lỗi (không có khoảng trắng), **không** phải vì thiếu ký tự đặc biệt — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
