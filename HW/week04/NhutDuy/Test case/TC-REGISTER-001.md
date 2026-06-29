# TC-REGISTER-001: Đăng ký thành công với dữ liệu hợp lệ

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-001 (R1) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-001 | Mọi điều kiện hợp lệ (C1..C5 = T) → đăng ký thành công | `Nguyen Van A` | `newuser@eshop.com` | `Pass123!` | `Pass123!` | Đăng ký thành công → chuyển trang Đăng nhập (A1) |

## Preconditions
1. Backend đang chạy (`:3000`) và frontend-web đang chạy (`:5173`).
2. Người dùng đang ở trang Đăng ký.
3. Email `newuser@eshop.com` chưa tồn tại trong hệ thống.

## Test data
| Field | Value |
|---|---|
| Họ tên | Nguyen Van A |
| Email | newuser@eshop.com |
| Mật khẩu | Pass123! |
| Xác nhận mật khẩu | Pass123! |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`.
3. Nhập Email `newuser@eshop.com`.
4. Nhập Mật khẩu `Pass123!`.
5. Nhập Xác nhận mật khẩu `Pass123!`.
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống tạo tài khoản thành công.
2. Hiển thị thông báo đăng ký thành công.
3. Tự động chuyển sang trang Đăng nhập.

## Actual results
1. Thất bại: Mật khẩu `Pass123!` (đúng chuẩn mạnh theo FR-01) bị hệ thống từ chối với thông báo "Mật khẩu quá yếu!".
2. Form không gọi tới API đăng ký, không tạo tài khoản, ở lại trang Đăng ký.
3. Nguyên nhân: biểu thức kiểm tra mật khẩu sai — bắt buộc phải có ký tự khoảng trắng và cấm ký tự đặc biệt (xem BUG-REGISTER-01).

## Status
Failed

## Related bugs
BUG-REGISTER-01
