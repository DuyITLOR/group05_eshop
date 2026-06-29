# TC-REGISTER-004: Từ chối đăng ký khi Email đã tồn tại

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-004 (R4) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-004 | Email đúng định dạng nhưng đã tồn tại (C2 = T, C3 = F) → từ chối đăng ký | `Nguyen Van A` | `test@eshop.com` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi Email đã tồn tại (A2) |

## Preconditions
1. Backend đang chạy (`:3000`) và frontend-web đang chạy (`:5173`).
2. Người dùng đang ở trang Đăng ký.
3. Tài khoản `test@eshop.com` đã tồn tại sẵn trong hệ thống.

## Test data
| Field | Value |
|---|---|
| Họ tên | Nguyen Van A |
| Email | test@eshop.com |
| Mật khẩu | Pass123! |
| Xác nhận mật khẩu | Pass123! |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`.
3. Nhập Email `test@eshop.com` (đã đăng ký).
4. Nhập Mật khẩu `Pass123!`.
5. Nhập Xác nhận mật khẩu `Pass123!`.
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống từ chối đăng ký.
2. Hiển thị thông báo lỗi Email đã tồn tại.
3. Không tạo tài khoản trùng, ở lại trang Đăng ký.

## Actual results
1. Thất bại: Đăng ký với email đã tồn tại `test@eshop.com` vẫn THÀNH CÔNG (API trả về `{"message":"User registered successfully","id":3}`).
2. Bảng `users` không có ràng buộc UNIQUE trên cột email → cho phép nhiều tài khoản trùng email. Truy vấn DB xác nhận `test@eshop.com` xuất hiện 2 dòng (id 2 và 3).
3. Vi phạm FR-01 (email phải duy nhất).

## Status
Failed

## Related bugs
BUG-REGISTER-03
