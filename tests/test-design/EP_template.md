# Template: Equivalence Partitioning (Phân hoạch tương đương - EP)

## 1. Xác định các điều kiện đầu vào (Input Conditions)
Liệt kê tất cả các tham số, trường dữ liệu hoặc điều kiện đầu vào cần được kiểm thử.
*   **Điều kiện 1:** [Tên điều kiện 1] (Ví dụ: Tuổi, Số lượng, Định dạng email)
*   **Điều kiện 2:** [Tên điều kiện 2]

## 2. Phân tích các lớp tương đương (Equivalence Classes)
Đối với mỗi điều kiện đầu vào, xác định các lớp hợp lệ (Valid) và không hợp lệ (Invalid).

| Điều kiện đầu vào | Lớp hợp lệ (Valid Classes) | Lớp không hợp lệ (Invalid Classes) |
| :--- | :--- | :--- |
| **[Điều kiện 1]** | *   [Valid Class 1.1]<br>*   [Valid Class 1.2] | *   [Invalid Class 1.1]<br>*   [Invalid Class 1.2] |
| **[Điều kiện 2]** | *   [Valid Class 2.1] | *   [Invalid Class 2.1]<br>*   [Invalid Class 2.2] |

## 3. Thiết kế Test Case (Test Case Design)

### 3.1. Test Cases cho Lớp hợp lệ (Valid Classes)
Thiết kế các test case sao cho **bao phủ tất cả các lớp hợp lệ**. Một test case có thể bao phủ nhiều lớp hợp lệ của các điều kiện khác nhau (để tối ưu số lượng test case).

| Test Case ID | Mục đích test (Test Objective) | [Điều kiện 1] | [Điều kiện 2] | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- |
| TC_EP_V01 | Kiểm tra với các giá trị hợp lệ 1.1 và 2.1 | [Giá trị thuộc Valid Class 1.1] | [Giá trị thuộc Valid Class 2.1] | [Hệ thống xử lý thành công...] |

### 3.2. Test Cases cho Lớp không hợp lệ (Invalid Classes)
Thiết kế các test case sao cho **bao phủ tất cả các lớp không hợp lệ**.
**Lưu ý quan trọng:** Mỗi test case chỉ nên kiểm tra **MỘT** lớp không hợp lệ tại một thời điểm (để tránh hiện tượng lỗi bị che khuất - defect masking). Các điều kiện khác phải dùng giá trị hợp lệ.

| Test Case ID | Mục đích test (Test Objective) | [Điều kiện 1] | [Điều kiện 2] | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- | :--- |
| TC_EP_IV01 | Kiểm tra với giá trị không hợp lệ 1.1 | **[Giá trị thuộc Invalid Class 1.1]** | [Giá trị thuộc Valid Class 2.1] | [Báo lỗi...] |
| TC_EP_IV02 | Kiểm tra với giá trị không hợp lệ 2.1 | [Giá trị thuộc Valid Class 1.1] | **[Giá trị thuộc Invalid Class 2.1]** | [Báo lỗi...] |
