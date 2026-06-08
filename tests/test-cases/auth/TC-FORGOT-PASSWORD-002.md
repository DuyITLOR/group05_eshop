# TC-FORGOT-PASSWORD-002: Yêu cầu OTP với Email không tồn tại trên hệ thống

## Requirement ID
FR-03

## Module / Test type / Technique
Forgot Password / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Quên mật khẩu.
- Email chưa được đăng ký trong hệ thống.

## Test data
| Field | Value |
| --- | --- |
| Email | non_existent_email@eshop.com |

## Test steps
1. Mở trang Quên mật khẩu.
2. Nhập Email chưa đăng ký.
3. Bấm nút lấy mã OTP.

## Expected result
Hệ thống không gửi mã OTP, không chuyển tiếp sang Bước 2, và hiển thị thông báo lỗi phù hợp (ví dụ: "Email không tồn tại trong hệ thống" hoặc lỗi tương đương).

## Status / Related bugs
Not Run / None
