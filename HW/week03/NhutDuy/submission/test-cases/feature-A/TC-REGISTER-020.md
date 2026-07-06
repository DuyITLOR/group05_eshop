# TC-REGISTER-020: Đăng ký với mật khẩu dùng ký tự đặc biệt ngoài tập cho phép

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP12b — ký tự đặc biệt ngoài tập `@$!%*?&`)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new20@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new20@domain.com` |
| password | `Password123#` *(`#` không thuộc tập `@$!%*?&`)* |
| confirmPassword | `Password123#` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối vì ký tự đặc biệt `#` nằm ngoài tập cho phép `@$!%*?&` (FR-01).

## Actual result
Form chặn "Mật khẩu quá yếu!" — khớp kết quả mong đợi (từ chối). · Lưu ý: form chặn vì regex lỗi cấm mọi ký tự đặc biệt (kể cả ký tự hợp lệ trong tập), **không** phân biệt được "trong tập" vs "ngoài tập" — đây là "Pass nhưng đúng vì lý do sai".

## Status / Related bugs
Pass* / None
