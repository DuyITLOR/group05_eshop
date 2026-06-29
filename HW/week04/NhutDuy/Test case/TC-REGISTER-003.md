# TC-REGISTER-003: Từ chối đăng ký khi Email sai định dạng

## Requirement ID
FR-01

## Module / Test type / Technique
Register / Functional / Decision Table

## Test design source
Test Design/DT-REGISTER.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Decision Table | TC-REGISTER-003 (R3) |

## Detail
| ID | Test Objective | Họ tên (Input) | Email (Input) | Mật khẩu (Input) | Xác nhận (Input) | Kết quả (Output) |
|---|---|---|---|---|---|---|
| TC-REGISTER-003 | Email sai định dạng (C2 = F) → từ chối đăng ký | `Nguyen Van A` | `abc` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi Email sai định dạng (A2) |

## Preconditions
1. Backend đang chạy (`:3000`) và frontend-web đang chạy (`:5173`).
2. Người dùng đang ở trang Đăng ký.

## Test data
| Field | Value |
|---|---|
| Họ tên | Nguyen Van A |
| Email | abc |
| Mật khẩu | Pass123! |
| Xác nhận mật khẩu | Pass123! |

## Test steps
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`.
3. Nhập Email `abc` (sai định dạng).
4. Nhập Mật khẩu `Pass123!`.
5. Nhập Xác nhận mật khẩu `Pass123!`.
6. Bấm nút Đăng ký.

## Expected results
1. Hệ thống từ chối đăng ký.
2. Hiển thị thông báo lỗi Email sai định dạng.
3. Không tạo tài khoản, ở lại trang Đăng ký.

## Actual results
1. Thất bại: Hệ thống KHÔNG kiểm tra định dạng email. Ô Email dùng `type="text"`, không validate ở frontend; backend cũng chèn thẳng vào DB không kiểm tra.
2. Với dữ liệu thiết kế (mật khẩu `Pass123!`), form còn bị BUG-REGISTER-01 chặn trước nên hiển thị sai thông báo "Mật khẩu quá yếu" thay vì lỗi định dạng email.
3. Kiểm chứng qua API: email sai định dạng vẫn được backend chấp nhận. Vi phạm FR-01.

## Status
Failed

## Related bugs
BUG-REGISTER-02
