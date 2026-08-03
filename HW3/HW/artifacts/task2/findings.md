# Task 2 — Usability Findings Report

## Metadata

| Thuộc tính             | Nội dung                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------- |
| SUT                    | EShop Frontend Web & Backend API cục bộ                                                |
| Researcher / moderator | Nguyễn Huy Quân — 23127107                                                             |
| Số phiên               | 7 (P01–P07)                                                                            |
| Ngày thực hiện         | 02/08/2026 – 03/08/2026                                                                |
| Luồng đánh giá         | Product Search → Product Detail → Add to Cart → Apply Coupon → Checkout → Confirmation |
| Instrument đo lường    | SUS 10 câu chuẩn; 8 câu hỏi mở (Clarity · Error Recovery · Speed · Trust)              |
| Trạng thái báo cáo     | **Draft — Pending Human Review**                                                       |

---

## 1. Kết quả hoàn thành nhiệm vụ

| Participant | Tên                   | Outcome            | Thời gian (s) | Errors | Hesitations | Interventions |
| ----------- | --------------------- | ------------------ | ------------- | ------ | ----------- | ------------- |
| P01         | Nguyễn Lê Hồ Anh Khoa | SUCCESS_UNASSISTED | 95            | 0      | 1           | 0             |
| P02         | Nguyễn Phúc Thọ       | SUCCESS_UNASSISTED | 44            | 1      | 0           | 0             |
| P03         | Trương Thành Đạt      | SUCCESS_UNASSISTED | 135           | 0      | 0           | 0             |
| P04         | Ngô Nguyễn Thế Khoa   | SUCCESS_UNASSISTED | 80            | 1      | 0           | 0             |
| P05         | Đỗ Đăng Nhật Tiến     | SUCCESS_UNASSISTED | 110           | 0      | 0           | 0             |
| P06         | Nguyễn Thành Dâng     | SUCCESS_UNASSISTED | 100           | 0      | 0           | 0             |
| P07         | Lê Nhựt Duy           | SUCCESS_UNASSISTED | 36            | 0      | 0           | 0             |

**Tóm tắt:** 7/7 participants hoàn thành độc lập (100%). Không ai cần intervention. Median thời gian: **95 giây**. Min: 36s, Max: 135s.

### Đánh giá theo Success Criteria

| ID    | Tiêu chí                       | Ngưỡng                  | Kết quả                          | Đạt?       |
| ----- | ------------------------------ | ----------------------- | -------------------------------- | ---------- |
| SC-01 | Hoàn thành độc lập end-to-end  | >= 6/7                  | 7/7 (100%)                       | Passed     |
| SC-02 | Đúng sản phẩm và số lượng      | 7/7                     | 7/7                              | Passed     |
| SC-03 | Hiểu coupon và tổng tiền       | >= 6/7                  | 7/7 tự áp dụng VIP100 thành công | Passed     |
| SC-04 | Thời gian hoàn thành           | Median <= 5 phút        | Median 95s (~1.6 phút)           | Passed     |
| SC-05 | Nhu cầu trợ giúp               | <= 1/7 cần intervention | 0/7                              | Passed     |
| SC-06 | Nhận biết kết quả cuối         | >= 6/7                  | 7/7 nhận màn hình xác nhận       | Passed     |
| SC-07 | Perceived usability (Mean SUS) | >= 70/100               | **61.1/100**                     | **Failed** |
| SC-08 | Không có Blocker Critical      | 0 blocker               | 0 blocker chặn hoàn thành        | Passed     |

> **SC-07 không đạt:** Mean SUS = 61.1, thấp hơn ngưỡng 70. P02 (SUS 37.5) và P04 (SUS 47.5) có điểm bất thường thấp, trong khi họ vẫn hoàn thành task nhanh và không gặp blocker. SUT có vấn đề về trust và nhất quán giao diện dù usability cơ bản còn chấp nhận được.

---

## 2. Điểm SUS

### Điểm thô và quy đổi

| Participant | Q1  | Q2  | Q3  | Q4  | Q5  | Q6  | Q7  | Q8  | Q9  | Q10 | SUS Score | Phân loại |
| ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- |
| P01         | 4   | 2   | 4   | 4   | 2   | 2   | 4   | 2   | 3   | 2   | **62.5**  | OK        |
| P02         | 1   | 2   | 5   | 4   | 2   | 5   | 2   | 4   | 4   | 4   | **37.5**  | Poor      |
| P03         | 3   | 1   | 4   | 2   | 3   | 4   | 4   | 2   | 4   | 2   | **67.5**  | OK        |
| P04         | 1   | 3   | 3   | 3   | 3   | 4   | 3   | 3   | 4   | 2   | **47.5**  | Poor      |
| P05         | 2   | 2   | 5   | 1   | 2   | 4   | 4   | 3   | 4   | 2   | **62.5**  | OK        |
| P06         | 1   | 1   | 5   | 1   | 3   | 4   | 5   | 2   | 5   | 1   | **75.0**  | Good      |
| P07         | 1   | 1   | 5   | 1   | 3   | 4   | 5   | 2   | 5   | 1   | **75.0**  | Good      |

> Công thức SUS: `[(Q1-1)+(Q3-1)+(Q5-1)+(Q7-1)+(Q9-1)+(5-Q2)+(5-Q4)+(5-Q6)+(5-Q8)+(5-Q10)] x 2.5`

### Thống kê tổng hợp

| Chỉ số             | Giá trị                        |
| ------------------ | ------------------------------ |
| **Mean SUS**       | **61.1**                       |
| Median SUS         | 62.5                           |
| Min SUS (P02)      | 37.5                           |
| Max SUS (P06, P07) | 75.0                           |
| Phân loại tổng     | **Marginal** (dưới Good 70-80) |

### Phân tích từng câu hỏi (Item-level)

| Câu | Nội dung (rút gọn)            | Mean điểm thô | Nhận xét                                        |
| --- | ----------------------------- | ------------- | ----------------------------------------------- |
| Q1  | Muốn dùng thường xuyên        | 1.86          | Thấp — nhiều người không muốn dùng thường xuyên |
| Q2  | Không cần thiết phức tạp      | 1.71          | Thấp = người dùng cảm thấy system khá phức tạp  |
| Q3  | Dễ sử dụng                    | 4.57          | Cao — luồng về cơ bản vẫn thực hiện được        |
| Q4  | Cần hỗ trợ kỹ thuật           | 2.14          | Thấp = không cần support — tốt                  |
| Q5  | Chức năng được tích hợp tốt   | 2.71          | Trung bình — tích hợp chưa nhất quán            |
| Q6  | Có nhiều điểm không nhất quán | 3.86          | Cao = người dùng cảm thấy nhiều inconsistency   |
| Q7  | Hầu hết học nhanh             | 4.00          | Khá cao — learnability ổn                       |
| Q8  | Cồng kềnh khi dùng            | 2.57          | Trung bình                                      |
| Q9  | Tự tin khi dùng               | 4.29          | Cao — confidence cao                            |
| Q10 | Phải học nhiều trước khi dùng | 2.00          | Thấp = ít học vẫn dùng được — tốt               |

> **Điểm yếu nổi bật:** Q1 (muốn dùng lại thấp) và Q6 (nhiều điểm không nhất quán cao) phản ánh vấn đề tin cậy và trải nghiệm thiếu đồng nhất.

---

## 3. Findings định tính

---

### FIND-01: Thiếu phản hồi tức thời khi thêm vào giỏ hàng

| Thuộc tính       | Nội dung                                                                                                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID               | FIND-01                                                                                                                                                                                                                                            |
| Nhóm chủ đề      | Clarity, Error Recovery                                                                                                                                                                                                                            |
| Severity         | High                                                                                                                                                                                                                                               |
| Tần suất         | 6/7 participants (P01, P02, P03, P04, P05, P07)                                                                                                                                                                                                    |
| Mô tả            | Sau khi click "Thêm vào giỏ hàng", hệ thống không hiển thị toast message hoặc bất kỳ phản hồi tức thời nào. Badge số lượng trên header cũng không cập nhật ngay. Participants phải click lần 2 hoặc tự điều hướng sang trang giỏ hàng để kiểm tra. |
| Hành vi mong đợi | Toast/snackbar confirmation ngay sau khi thêm thành công. Badge số lượng cập nhật ngay lập tức.                                                                                                                                                    |
| Bằng chứng       | P01: "Bấm lần đầu không phản hồi, phải click lần 2" · P03: "khi mình bấm vô thêm giỏ hàng thì nó không có thông báo" · P03: "nút giỏ hàng này cũng khá là nhỏ... không có cái dấu 1 hay là 2"                                                      |
| Khuyến nghị      | Bổ sung toast notification sau Add-to-Cart. Cập nhật badge số lượng giỏ hàng realtime.                                                                                                                                                             |

---

### FIND-02: Lỗi bảo mật nghiêm trọng — Cho phép chỉnh sửa tổng tiền trên trang thanh toán

| Thuộc tính       | Nội dung                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID               | FIND-02                                                                                                                                                                                                                  |
| Nhóm chủ đề      | Trust, Clarity                                                                                                                                                                                                           |
| Severity         | **Critical**                                                                                                                                                                                                             |
| Tần suất         | 4/7 phát hiện; P06 khai thác triệt để                                                                                                                                                                                    |
| Mô tả            | Trường "Tổng thanh toán (VNĐ)" là một input có thể chỉnh sửa tự do. Người dùng có thể nhập bất kỳ số nào và hệ thống vẫn xác nhận đơn thành công với giá trị đó. P06 đặt đơn với giá trị 1,199,900,000 VND (bất thường). |
| Hành vi mong đợi | Tổng tiền là trường read-only. Backend phải validate tổng tiền trước khi confirm đơn.                                                                                                                                    |
| Bằng chứng       | P01: "Ủa, cái này có thể điều chỉnh à?" · P03: "cái này có lẽ cũng là một cái bug ha" · P06: "Wow, cái này là tôi cũng được tự giảm giá cho chính mình luôn"                                                             |
| Lưu ý            | Cần tạo GitHub Issue mới mức Critical/P0 — chưa có trong Task 1                                                                                                                                                          |
| Khuyến nghị      | Đặt field thành readonly. Validate tổng tiền server-side trước khi tạo order.                                                                                                                                            |

---

### FIND-03: Thiếu hình ảnh và mô tả sản phẩm trên trang chi tiết

| Thuộc tính  | Nội dung                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| ID          | FIND-03                                                                                                   |
| Nhóm chủ đề | Clarity                                                                                                   |
| Severity    | Medium                                                                                                    |
| Tần suất    | 5/7 participants (P01, P02, P04, P05, P07)                                                                |
| Mô tả       | Trang chi tiết sản phẩm không hiển thị hình ảnh, không có mô tả đầy đủ và không có đánh giá khách hàng.   |
| Bằng chứng  | P01: "Thông tin hơi ít. Hình ảnh hiển thị cũng không có." · P05: "Hình ở đây thì nó... đang chưa có hình" |
| Khuyến nghị | Bổ sung hình ảnh sản phẩm, mô tả chi tiết và khu vực review từ phía backend.                              |

---

### FIND-04: Giỏ hàng không được xóa sau khi thanh toán thành công

| Thuộc tính  | Nội dung                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| ID          | FIND-04                                                                                                                   |
| Nhóm chủ đề | Trust, Clarity                                                                                                            |
| Severity    | High                                                                                                                      |
| Tần suất    | 1/7 quan sát trực tiếp (P05); P07 gặp cart còn dữ liệu cũ                                                                 |
| Mô tả       | Sau khi thanh toán thành công, sản phẩm vừa mua vẫn còn trong giỏ hàng, khiến người dùng không chắc đơn đã được ghi nhận. |
| Bằng chứng  | P05: "Ủa. Sao giỏ hàng vẫn còn ta? Thanh toán rồi mà."                                                                    |
| Khuyến nghị | Clear cart sau khi tạo order thành công.                                                                                  |

---

### FIND-05: Sản phẩm thêm nhiều lần bị tách thành nhiều dòng riêng biệt

| Thuộc tính  | Nội dung                                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| ID          | FIND-05                                                                                                  |
| Nhóm chủ đề | Clarity                                                                                                  |
| Severity    | Medium                                                                                                   |
| Tần suất    | 1/7 (P04)                                                                                                |
| Mô tả       | Click "Thêm vào giỏ" nhiều lần với cùng sản phẩm tạo ra nhiều dòng riêng biệt thay vì cộng dồn số lượng. |
| Bằng chứng  | P04: "mua cùng 1 sản phẩm nhiều lần nhưng lại bị tách ra riêng"                                          |
| Khuyến nghị | Implement logic upsert trong Cart: nếu sản phẩm đã tồn tại, cộng thêm số lượng.                          |

---

### FIND-06: Thiếu xác nhận đơn hàng qua email hoặc thông báo ngoài app

| Thuộc tính  | Nội dung                                                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID          | FIND-06                                                                                                                                                           |
| Nhóm chủ đề | Trust                                                                                                                                                             |
| Severity    | Medium                                                                                                                                                            |
| Tần suất    | 4/7 participants đề cập (P02, P03, P05, P06)                                                                                                                      |
| Mô tả       | Sau đặt hàng thành công, hệ thống chỉ hiển thị màn hình xác nhận nhưng không gửi email confirmation hoặc thông báo ngoài app.                                     |
| Bằng chứng  | P02: "Không tin tưởng vì không có thông báo về mail" · P05: "hoàn toàn không có bất kì minh chứng (ví dụ 1 đơn hàng để ở mục Đã đặt hoặc một thông báo về email)" |
| Khuyến nghị | Thêm chức năng gửi email confirmation. Bổ sung mục "Đơn hàng của tôi".                                                                                            |

---

### FIND-07: Nút xóa trong giỏ hàng phản hồi cực kỳ chậm

| Thuộc tính  | Nội dung                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------- |
| ID          | FIND-07                                                                                      |
| Nhóm chủ đề | Speed                                                                                        |
| Severity    | Medium                                                                                       |
| Tần suất    | 1/7 (P05)                                                                                    |
| Mô tả       | Click nút "Xóa" sản phẩm trong giỏ hàng phản hồi chậm, buộc người dùng phải click nhiều lần. |
| Bằng chứng  | P05: "Xóa... Xóa tiếp... Xóa thì nó mất."                                                    |
| Khuyến nghị | Tối ưu API call. Thêm optimistic UI update.                                                  |

---

## 4. Phân tích tổng hợp

| Finding ID | Tóm tắt                               | Severity | Tần suất | Ưu tiên xử lý     |
| ---------- | ------------------------------------- | -------- | -------- | ----------------- |
| FIND-02    | Chỉnh sửa tổng tiền ảo khi thanh toán | Critical | 4/7      | Ngay lập tức (P0) |
| FIND-01    | Thiếu feedback khi thêm giỏ hàng      | High     | 6/7      | Cao (P1)          |
| FIND-04    | Giỏ hàng không clear sau thanh toán   | High     | 1-2/7    | Cao (P1)          |
| FIND-03    | Thiếu hình ảnh và mô tả sản phẩm      | Medium   | 5/7      | Trung bình (P2)   |
| FIND-06    | Thiếu email confirmation              | Medium   | 4/7      | Trung bình (P2)   |
| FIND-05    | Sản phẩm thêm nhiều lần bị tách dòng  | Medium   | 1/7      | Trung bình (P2)   |
| FIND-07    | Nút xóa giỏ hàng phản hồi chậm        | Medium   | 1/7      | Thấp (P3)         |

### Chủ đề định tính lặp lại

1. **Thiếu feedback sau thao tác (6/7 phiên):** Toast notification, badge update, popup đều bị thiếu.
2. **Thiếu tin cậy về trạng thái đơn hàng (5/7 phiên):** Participants không chắc đơn đã được ghi nhận.
3. **Lỗi logic bảo mật (4/7 phiên đặt câu hỏi):** Ô tổng tiền có thể chỉnh sửa là lỗi nghiêm trọng nhất.
4. **Thiếu thông tin sản phẩm (5/7 phiên):** Trang chi tiết quá sơ sài.

---

## 5. Trạng thái và bước tiếp theo

| Hạng mục                      | Trạng thái |
| ----------------------------- | ---------- |
| Sessions P01–P07 completed    | Hoàn thành |
| SUS scores tính toán          | Hoàn thành |
| Qualitative findings tổng hợp | Hoàn thành |
| P07 researcher summary        | Hoàn thành |
| Human Review by researcher    | Reviewed   |

---
