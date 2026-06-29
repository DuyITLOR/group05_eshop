# TC-REGISTER-005: Từ chối đăng ký khi Mật khẩu chưa đủ mạnh

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-005 (R5) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-005 | Mật khẩu không thỏa điều kiện mạnh (C4 = F) → từ chối đăng ký | `Nguyen Van A` | `newuser@eshop.com` | `pass` | `pass` | Từ chối, báo lỗi Mật khẩu chưa đủ mạnh (A2) |

## Preconditions
1. Backend đang chạy (`:3000`) và frontend-web đang chạy (`:5173`).
2. Người dùng đang ở trang Đăng ký.
3. Email `newuser@eshop.com` chưa tồn tại trong hệ thống.

## Test data
| Field | Value |
|---|---|
| Họ tên | Nguyen Van A |
| Email | newuser@eshop.com |
| Mật khẩu | pass |
| Xác nhận mật khẩu | pass |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`.
3. Nhập Email `newuser@eshop.com`.
4. Nhập Mật khẩu `pass` (yếu: < 8 ký tự, không có chữ hoa/số/ký tự đặc biệt).
5. Nhập Xác nhận mật khẩu `pass`.
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống từ chối đăng ký.
2. Hiển thị thông báo lỗi yêu cầu mật khẩu mạnh (≥ 8 ký tự, có hoa/thường/số/ký tự đặc biệt).
3. Không tạo tài khoản, ở lại trang Đăng ký.

## Actual results
1. Thành công: Mật khẩu yếu `pass` bị từ chối với thông báo "Mật khẩu quá yếu!".
2. Không tạo tài khoản, ở lại trang Đăng ký — đúng kỳ vọng (từ chối mật khẩu yếu).

## Status
Passed

## Related bugs
None
