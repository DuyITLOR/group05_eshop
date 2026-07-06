# TC-REGISTER-004: Đăng ký với email đã tồn tại (trùng)

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Equivalence Partitioning (vùng không hợp lệ EP5 — email trùng)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Email `test@eshop.com` **đã tồn tại** (tài khoản seed mặc định).

## Test data
| Field | Value |
| --- | --- |
| name | `Trung Email` |
| email | `test@eshop.com` |
| password | `Password 1` *(qua được regex lỗi của form)* |
| confirmPassword | `Password 1` |

## Test steps
1. Mở trang `/register`.
2. Nhập Test data ở trên.
3. Bấm **Đăng Ký**.

## Expected result
Hệ thống từ chối, hiển thị lỗi kiểu "Email đã tồn tại" (FR-01: email phải **duy nhất**).

## Actual result
Tạo thêm tài khoản mới trùng email (HTTP 200, `id` mới). DB không có ràng buộc `UNIQUE` trên cột email và backend không kiểm tra trùng.

## Status / Related bugs
Fail / BUG-A3 (`[BUG][module: register] Email không duy nhất (cho phép trùng)`)
