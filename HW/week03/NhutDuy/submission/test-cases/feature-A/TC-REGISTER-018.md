# TC-REGISTER-018: Đăng ký với email thiếu TLD

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP4d — email thiếu TLD)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Test ở mức API: gọi thẳng `POST /api/register` để bỏ qua kiểm tra form.

## Test data
| Field | Value |
| --- | --- |
| name | `Nguyen Van A` |
| email | `user@domain` *(thiếu phần `.tld`)* |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register` (hoặc gửi request `POST /api/register`).
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký** (hoặc gửi request API).

## Expected result
Hệ thống từ chối, hiển thị lỗi kiểu "Email không hợp lệ" (FR-01: email phải đúng định dạng `local@domain.tld`).

## Actual result
API tạo user với email `user@domain` (HTTP 200). Backend không validate định dạng email.

## Status / Related bugs
Fail / BUG-A2 (`[BUG][module: register] API /register không validate đầu vào`)
