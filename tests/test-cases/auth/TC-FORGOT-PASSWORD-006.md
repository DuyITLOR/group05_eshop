# TC-FORGOT-PASSWORD-006: Đặt lại mật khẩu với Mật khẩu mới không thỏa điều kiện mật khẩu mạnh

## Requirement ID
FR-03, FR-01

## Module / Test type / Technique
Forgot Password / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đã nhận mã OTP hợp lệ cho email `test@eshop.com` và đang ở trang đặt lại mật khẩu Bước 2.

## Test data
| Kịch bản | Mật khẩu mới | Xác nhận mật khẩu mới | Lý do không hợp lệ |
| --- | --- | --- | --- |
| 1. Quá ngắn | `Ab1!` | `Ab1!` | Dưới 8 ký tự |
| 2. Thiếu chữ hoa | `test1234!` | `test1234!` | Thiếu chữ cái viết hoa |
| 3. Thiếu chữ số | `Testabcd!` | `Testabcd!` | Thiếu chữ số |
| 4. Thiếu ký tự đặc biệt | `Test12345` | `Test12345` | Thiếu ký tự đặc biệt |

## Test steps
1. Ở giao diện Bước 2, điền OTP hợp lệ.
2. Thực hiện lần lượt thử nghiệm với từng bộ dữ liệu kiểm thử (Kịch bản 1, 2, 3, 4).
3. Nhập mật khẩu mới tương ứng vào ô Mật khẩu mới và Xác nhận mật khẩu mới.
4. Nhấn nút đặt lại mật khẩu.

## Expected result
Giao diện báo lỗi định dạng mật khẩu không đủ mạnh (chưa thỏa các ràng buộc: tối thiểu 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt). Hệ thống không cho phép đổi mật khẩu.

## Status / Related bugs
Not Run / None
