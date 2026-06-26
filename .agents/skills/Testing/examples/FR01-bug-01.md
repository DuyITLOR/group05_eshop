# Bug ID: `FR01-bug-01`

## Bug description:
Regex kiểm tra mật khẩu bị lỗi logic, bắt buộc phải có ký tự khoảng trắng (space) và chặn toàn bộ các ký tự đặc biệt thực sự như `!`, `@`, `#`... khiến mật khẩu mạnh hợp lệ không thể đăng ký được.

## Test case coverage: 
- `TC-FR01-01` (Đăng ký thành công với thông tin hợp lệ)
- Các test case BVA liên quan đến mật khẩu hợp lệ: `TC-FR01-15`, `TC-FR01-16`, `TC-FR01-17`, `TC-FR01-18`, `TC-FR01-21`, `TC-FR01-22`, `TC-FR01-23`, `TC-FR01-24`, `TC-FR01-27`, `TC-FR01-28`, `TC-FR01-29`, `TC-FR01-30`, `TC-FR01-33`, `TC-FR01-34`, `TC-FR01-36`, `TC-FR01-37`, `TC-FR01-39`, `TC-FR01-40`, `TC-FR01-42`, `TC-FR01-43`.

## Preconditions: 
- Người dùng đang ở màn hình Đăng ký tài khoản (`http://localhost:5173/register`).

## Test steps: 
1. Nhập Họ Tên: `Nguyen Van A`
2. Nhập Email: `newuser@eshop.com`
3. Nhập Mật khẩu: `Password123!` (mật khẩu mạnh hợp lệ, chứa chữ hoa, chữ thường, số, ký tự đặc biệt, độ dài >= 8).
4. Nhấp nút "Đăng Ký".

## Expected results: 
- Đăng ký tài khoản thành công, lưu tài khoản vào DB và chuyển hướng sang trang Đăng nhập.

## Actual results: 
- Đăng ký thất bại. Giao diện hiển thị thông báo lỗi: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."*
- **Nguyên nhân:** Regex kiểm tra mật khẩu trong `Register.jsx` bị sai logic:
  `const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;`
  Regex này bắt buộc phải có khoảng trắng (`(?=.*\s)`) và chỉ cho phép chữ cái, chữ số, khoảng trắng (`[A-Za-z\d\s]`), từ đó chặn hoàn toàn các ký tự đặc biệt thực sự như `!`, `@`, `#`... và ép buộc mật khẩu phải chứa dấu cách.

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./bugs/FR01/images/FR01-bug-01.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: ![Mật khẩu hợp lệ bị báo lỗi yếu](./images/FR01-bug-01.png)
