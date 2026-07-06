# TC-REGISTER-037: BVA – mật khẩu rất dài 129 ký tự (giới hạn trên ẩn)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `password.length = 129`, giá trị lớn thực tế — giới hạn trên không quy định)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new37@domain.com` chưa tồn tại.
- Test ở mức API: gọi thẳng `POST /api/register` (form chặn ký tự đặc biệt nên kiểm giới hạn trên qua API).

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `new37@domain.com` |
| password | `Aa1!` + `x`×125 *(129 ký tự, đủ hoa/thường/số/đặc biệt)* |
| confirmPassword | `Aa1!` + `x`×125 |

## Test steps
1. Mở trang `/register` (hoặc gửi request `POST /api/register`).
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký** (hoặc gửi request API).

## Expected result
Đăng ký thành công — SRS không quy định giới hạn trên cho `password.length` nên 129 ký tự vẫn hợp lệ.

## Actual result
API tạo user thành công (không chặn). Không có giới hạn trên ẩn ở backend/DB cho trường mật khẩu.

## Status / Related bugs
Pass / None
