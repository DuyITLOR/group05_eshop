# TC-REGISTER-002: Từ chối đăng ký khi bỏ trống Họ tên

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-002 (R2) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-002 | Họ tên để trống (C1 = F) → từ chối đăng ký | *(để trống)* | `newuser@eshop.com` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi yêu cầu nhập Họ tên (A2) |

## Preconditions
1. Backend đang chạy (`:3000`) và frontend-web đang chạy (`:5173`).
2. Người dùng đang ở trang Đăng ký.
3. Email `newuser@eshop.com` chưa tồn tại trong hệ thống.

## Test data
| Field | Value |
|---|---|
| Họ tên | *(để trống)* |
| Email | newuser@eshop.com |
| Mật khẩu | Pass123! |
| Xác nhận mật khẩu | Pass123! |

## Test steps
1. Mở trang Đăng ký.
2. Để trống trường Họ tên.
3. Nhập Email `newuser@eshop.com`.
4. Nhập Mật khẩu `Pass123!`.
5. Nhập Xác nhận mật khẩu `Pass123!`.
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống từ chối đăng ký.
2. Hiển thị thông báo lỗi yêu cầu nhập Họ tên.
3. Không tạo tài khoản, ở lại trang Đăng ký.

## Actual results
1. Thành công: Trường Họ tên có thuộc tính `required`, trình duyệt chặn việc gửi form khi để trống và hiển thị nhắc nhập.
2. Không tạo tài khoản, ở lại trang Đăng ký — đúng kỳ vọng.

## Status
Passed

## Related bugs
None
