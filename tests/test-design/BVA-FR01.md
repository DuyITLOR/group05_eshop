# Phân tích giá trị biên (BVA) - FR01: Đăng ký tài khoản

## 1. Xác định các biên (Boundaries)
Dựa trên đặc tả FR-01, điều kiện duy nhất có quy định rõ ràng về giới hạn kích thước (biên) là **Độ dài mật khẩu** (yêu cầu "Tối thiểu 8 ký tự").
Các trường khác như Họ Tên, Email không có quy định độ dài cụ thể trong tài liệu, do đó ta tập trung phân tích giá trị biên cho Mật khẩu.

*   **Điều kiện:** Độ dài mật khẩu (Password length)
*   **Giá trị Min:** 8 (ký tự)
*   **Giá trị Max:** Không quy định (N/A) - *Chỉ kiểm thử xung quanh biên Min*

## 2. Chọn giá trị test tại biên (Boundary Values)
Áp dụng cách tiếp cận 3 giá trị biên (3-value BVA):

*   Tại biên Min: `Min - 1`, `Min`, `Min + 1`

| Điều kiện | Min - 1 (Invalid) | Min (Valid) | Min + 1 (Valid) |
| :--- | :--- | :--- | :--- |
| **Độ dài mật khẩu** | 7 ký tự | 8 ký tự | 9 ký tự |

*Lưu ý quan trọng: Để chắc chắn kết quả trả về là do kiểm tra độ dài chứ không phải do thiếu loại ký tự (defect masking), các mật khẩu được test phải đảm bảo đủ độ phức tạp (1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt).*

## 3. Thiết kế Test Case (Test Case Design)

Các trường bắt buộc khác (Họ Tên, Email) sẽ được cung cấp với các giá trị hợp lệ để đảm bảo chỉ tập trung test giới hạn biên của Mật khẩu. Trường Xác nhận mật khẩu được nhập khớp với giá trị Mật khẩu tương ứng.

| Test Case ID | Mục đích test (Test Objective) | Đầu vào (Input: Độ dài mật khẩu) | Loại biên (Boundary Type) | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- |
| TC_BVA_FR01_01 | Kiểm tra độ dài mật khẩu dưới ngưỡng Min (Min - 1 = 7 ký tự) | Mật khẩu: `Aa1@bcd` (7 ký tự, đủ chữ hoa, thường, số, ký tự đặc biệt) | Invalid Boundary | Hệ thống từ chối đăng ký, hiển thị thông báo lỗi "Mật khẩu tối thiểu 8 ký tự" (hoặc thông báo tương đương). |
| TC_BVA_FR01_02 | Kiểm tra độ dài mật khẩu tại biên Min (Min = 8 ký tự) | Mật khẩu: `Aa1@bcde` (8 ký tự, đủ chữ hoa, thường, số, ký tự đặc biệt) | Valid Boundary | Hệ thống đăng ký thành công, chuyển hướng người dùng tới trang Đăng nhập. |
| TC_BVA_FR01_03 | Kiểm tra độ dài mật khẩu trên ngưỡng Min (Min + 1 = 9 ký tự) | Mật khẩu: `Aa1@bcdef` (9 ký tự, đủ chữ hoa, thường, số, ký tự đặc biệt) | Valid Boundary | Hệ thống đăng ký thành công, chuyển hướng người dùng tới trang Đăng nhập. |
