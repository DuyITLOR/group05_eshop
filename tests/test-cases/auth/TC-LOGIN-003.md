# TC-LOGIN-003: Đăng nhập thất bại với email không tồn tại

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
| Field | Value |
| --- | --- |
| Email | khongtontai@eshop.com |
| Mật khẩu | Test1234! |

## Test steps
1. Mở trang Đăng nhập.
2. Nhập Email không tồn tại trong hệ thống.
3. Nhập Mật khẩu bất kỳ.
4. Bấm nút Đăng nhập.

## Expected result
- Đăng nhập thất bại, hệ thống hiển thị thông báo lỗi chung (không tiết lộ chi tiết nguyên nhân).
- API trả về status 401 với message "Invalid email or password".
- Người dùng vẫn ở trang Đăng nhập.

## Status / Related bugs
Not Run / None
