# TC-LOGIN-001: Đăng nhập thành công với tài khoản hợp lệ

## Requirement ID
FR-02

## Test Design ID
TD-POOL-A

## Module / Test type / Technique
Login / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.
- Tài khoản test tồn tại và không bị khóa.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu | Test1234! |

## Test steps
1. Mở trang Đăng nhập.
2. Kiểm tra trường Email dùng `type="email"`.
3. Nhập Email hợp lệ.
4. Nhập Mật khẩu đúng.
5. Bấm nút Đăng nhập.

## Expected result
Đăng nhập thành công, hệ thống trả về JWT Token, token được lưu phía client và người dùng được chuyển về trang Home.

## Status / Related bugs
Not Run / None
