# TC-LOGIN-009: Kiểm tra trường Mật khẩu sử dụng type="password"

## Requirement ID
FR-02

## Module / Test type / Technique
Login / UI / Inspection

## Preconditions
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
| Field | Value |
| --- | --- |
| Mật khẩu | Test1234! |

## Test steps
1. Mở trang Đăng nhập.
2. Kiểm tra thuộc tính `type` của trường nhập Mật khẩu trong DOM (Inspect Element).
3. Nhập mật khẩu vào trường.
4. Quan sát xem ký tự mật khẩu có bị ẩn (hiển thị dấu •) hay không.

## Expected result
- Trường Mật khẩu phải có `type="password"` để ẩn ký tự khi nhập.
- Mật khẩu không được hiển thị dạng plain text trên giao diện.

## Status / Related bugs
Not Run / None
