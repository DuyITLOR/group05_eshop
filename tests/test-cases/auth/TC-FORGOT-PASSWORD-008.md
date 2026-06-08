# TC-FORGOT-PASSWORD-008: Kiểm tra nút "Quay lại đăng nhập" và trạng thái chuyển đổi Step Indicator

## Requirement ID
FR-03, FR-22

## Module / Test type / Technique
Forgot Password / UI-UX / State Transition Testing

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Quên mật khẩu.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |

## Test steps
1. Mở trang Quên mật khẩu.
2. Kiểm tra phần giao diện có hiển thị Step Indicator rõ ràng (ví dụ: "Bước 1 / 2" hoặc tương đương).
3. Kiểm tra sự tồn tại của nút "Quay lại đăng nhập".
4. Nhấp chọn nút "Quay lại đăng nhập".
5. Quay lại trang Quên mật khẩu, nhập Email và bấm lấy mã OTP.
6. Sau khi nhận OTP và hệ thống tự động/hoặc thủ công chuyển sang Bước 2, kiểm tra xem Step Indicator có thay đổi tương ứng không (ví dụ: "Bước 2 / 2" hoặc tương đương).

## Expected result
1. Nút "Quay lại đăng nhập" điều hướng người dùng quay lại trang Đăng nhập thành công.
2. Step Indicator hiển thị rõ ràng từng bước: Bước 1 / 2 cho màn hình nhập Email nhận OTP, và Bước 2 / 2 cho màn hình nhập OTP & đặt mật khẩu mới.

## Status / Related bugs
Not Run / None
