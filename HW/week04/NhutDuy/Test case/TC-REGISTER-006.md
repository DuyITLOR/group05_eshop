# TC-REGISTER-006: Từ chối đăng ký khi Xác nhận mật khẩu không khớp

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-006 (R6) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-006 | Xác nhận mật khẩu không khớp với mật khẩu (C5 = F) → từ chối đăng ký | `Nguyen Van A` | `newuser@eshop.com` | `Pass123!` | `Pass999!` | Từ chối, báo lỗi Xác nhận mật khẩu không khớp (A2) |

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
| Xác nhận mật khẩu | Pass999! |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`.
3. Nhập Email `newuser@eshop.com`.
4. Nhập Mật khẩu `Pass123!`.
5. Nhập Xác nhận mật khẩu `Pass999!` (khác mật khẩu).
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống từ chối đăng ký.
2. Hiển thị thông báo lỗi Xác nhận mật khẩu không khớp.
3. Không tạo tài khoản, ở lại trang Đăng ký.

## Actual results
1. Thất bại: Form Đăng ký KHÔNG có trường "Xác nhận mật khẩu". Không thể nhập giá trị xác nhận nên không thể kiểm tra điều kiện khớp/không khớp.
2. Hệ thống thiếu hoàn toàn chức năng xác nhận mật khẩu. Vi phạm FR-01.

## Status
Failed

## Related bugs
BUG-REGISTER-04
