# Template: Boundary Value Analysis (Phân tích giá trị biên - BVA)

## 1. Xác định các biên (Boundaries)
Dựa trên các lớp tương đương đã xác định (từ kỹ thuật EP), xác định các điểm biên cho mỗi điều kiện đầu vào. BVA thường áp dụng tốt nhất cho các dải giá trị số, ngày tháng, kích thước mảng/chuỗi.

*   **Điều kiện:** [Tên điều kiện] (Ví dụ: Tuổi từ 18 đến 60)
*   **Giá trị Min:** [Giá trị nhỏ nhất hợp lệ, ví dụ: 18]
*   **Giá trị Max:** [Giá trị lớn nhất hợp lệ, ví dụ: 60]

## 2. Chọn giá trị test tại biên (Boundary Values)
Tuỳ thuộc vào loại phân tích giá trị biên (2 giá trị hoặc 3 giá trị) để chọn các giá trị cần test.

**Cách tiếp cận 2 giá trị biên (2-value BVA):**
*   Tại biên Min: `Min`, `Min - 1`
*   Tại biên Max: `Max`, `Max + 1`

**Cách tiếp cận 3 giá trị biên (3-value BVA) - Khuyến nghị cho hệ thống quan trọng:**
*   Tại biên Min: `Min - 1`, `Min`, `Min + 1`
*   Tại biên Max: `Max - 1`, `Max`, `Max + 1`

| Điều kiện | Min - 1 (Invalid) | Min (Valid) | Min + 1 (Valid) | Max - 1 (Valid) | Max (Valid) | Max + 1 (Invalid) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **[Điều kiện]** | [Giá trị] | [Giá trị] | [Giá trị] | [Giá trị] | [Giá trị] | [Giá trị] |

## 3. Thiết kế Test Case (Test Case Design)

Mỗi giá trị biên được chọn ở bước 2 sẽ tạo thành một test case (hoặc kết hợp với các giá trị hợp lệ điển hình của các điều kiện khác).

| Test Case ID | Mục đích test (Test Objective) | Đầu vào (Input: [Điều kiện]) | Loại biên (Boundary Type) | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- |
| TC_BVA_01 | Kiểm tra biên dưới - 1 (Dưới ngưỡng Min) | `Min - 1` | Invalid Boundary | [Báo lỗi...] |
| TC_BVA_02 | Kiểm tra biên dưới (Tại Min) | `Min` | Valid Boundary | [Xử lý thành công...] |
| TC_BVA_03 | Kiểm tra biên dưới + 1 (Trên Min) | `Min + 1` | Valid Boundary | [Xử lý thành công...] |
| TC_BVA_04 | Kiểm tra biên trên - 1 (Dưới Max) | `Max - 1` | Valid Boundary | [Xử lý thành công...] |
| TC_BVA_05 | Kiểm tra biên trên (Tại Max) | `Max` | Valid Boundary | [Xử lý thành công...] |
| TC_BVA_06 | Kiểm tra biên trên + 1 (Vượt ngưỡng Max) | `Max + 1` | Invalid Boundary | [Báo lỗi...] |
