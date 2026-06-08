# TC-FORGOT-PASSWORD-003: Yêu cầu OTP với Email sai định dạng

## Requirement ID
FR-03, FR-22

## Module / Test type / Technique
Forgot Password / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Quên mật khẩu.

## Test data
| Field | Value |
| --- | --- |
| Email sai định dạng 1 | invalid-email-format |
| Email sai định dạng 2 | email@missingdomain |

## Test steps
1. Mở trang Quên mật khẩu.
2. Nhập Email sai định dạng 1 vào trường Email.
3. Nhấn nút lấy mã OTP.
4. Xóa email cũ, nhập Email sai định dạng 2.
5. Nhấn nút lấy mã OTP.

## Expected result
Giao diện báo lỗi định dạng email không hợp lệ (hoặc trình duyệt chặn không cho submit do type="email" của trường nhập liệu). Hệ thống không gửi mã OTP và không chuyển sang Bước 2.

## Status / Related bugs
Not Run / None
