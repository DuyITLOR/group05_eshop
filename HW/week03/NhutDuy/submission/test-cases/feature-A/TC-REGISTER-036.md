# TC-REGISTER-036: BVA – tên rất dài 256 ký tự (giới hạn trên ẩn)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Boundary Value Analysis (biên `name.length = 256`, giá trị lớn thực tế — giới hạn trên không quy định)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `new36@domain.com` chưa tồn tại.

## Test data
| Field | Value |
| --- | --- |
| name | `"A"×256` *(chuỗi 256 ký tự `A`)* |
| email | `new36@domain.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Họ tên là chuỗi 256 ký tự `A`, nhập Email và Mật khẩu theo Test data.
3. Bấm **Đăng Ký**.

## Expected result
Đăng ký thành công — SRS không quy định giới hạn trên cho `name.length` nên 256 ký tự vẫn hợp lệ.

## Actual result
API tạo user thành công (không chặn). Không có giới hạn trên ẩn ở backend/DB cho trường tên.

## Status / Related bugs
Pass / None
