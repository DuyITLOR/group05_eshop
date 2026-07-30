# Bảng Đánh giá Phản hồi Thang đo SUS (System Usability Scale Response)

**Hệ thống kiểm thử (SUT)**: EShop — Web Admin (`http://localhost:5174/`)  
**Đối tượng kiểm thử**: 7 người dùng thực tế (7 Real Participants)  

---

## 1. Danh sách 10 Câu hỏi Thang đo SUS (SUS 10 Questions)

Thang điểm đánh giá từ **1 (Rất không đồng ý)** đến **5 (Rất đồng ý)**:

* **Q1 (Tích cực)**: Tôi nghĩ rằng mình sẽ muốn sử dụng hệ thống này thường xuyên.
* **Q2 (Tiêu cực)**: Tôi thấy hệ thống này phức tạp một cách không cần thiết.
* **Q3 (Tích cực)**: Tôi thấy hệ thống này dễ sử dụng.
* **Q4 (Tiêu cực)**: Tôi nghĩ rằng mình sẽ cần sự hỗ trợ của một kỹ thuật viên để có thể sử dụng được hệ thống này.
* **Q5 (Tích cực)**: Tôi thấy các chức năng trong hệ thống này được tích hợp rất tốt.
* **Q6 (Tiêu cực)**: Tôi nghĩ rằng hệ thống này có quá nhiều điểm bất nhất (không nhất quán).
* **Q7 (Tích cực)**: Tôi tưởng tượng rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh.
* **Q8 (Tiêu cực)**: Tôi thấy hệ thống này rất cồng kềnh/rắc rối khi sử dụng.
* **Q9 (Tích cực)**: Tôi cảm thấy rất tự tin khi sử dụng hệ thống này.
* **Q10 (Tiêu cực)**: Tôi cần phải học rất nhiều thứ trước khi có thể bắt đầu sử dụng hệ thống này.

---

## 2. Bảng Nhập Phản hồi Chi tiết của 7 Người tham gia (Raw Response Scores)

| Mã ND | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | $S_{lẻ}$ (Tổng Q1,3,5,7,9) | $S_{chẵn}$ (Tổng Q2,4,6,8,10) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **P01** | 3 | 3 | 4 | 4 | 2 | 3 | 2 | 4 | 2 | 2 | 13 | 16 |
| **P02** | 3 | 2 | 4 | 2 | 4 | 4 | 2 | 3 | 2 | 3 | 15 | 14 |
| **P03** | 3 | 2 | 4 | 2 | 3 | 3 | 4 | 2 | 4 | 3 | 18 | 12 |
| **P04** | 4 | 1 | 4 | 2 | 5 | 2 | 4 | 2 | 5 | 2 | 22 | 9 |
| **P05** | 4 | 1 | 5 | 1 | 4 | 1 | 5 | 1 | 5 | 1 | 23 | 5 |
| **P06** | 4 | 2 | 5 | 3 | 4 | 1 | 3 | 2 | 4 | 2 | 20 | 10 |
| **P07** | 3 | 2 | 1 | 2 | 1 | 3 | 4 | 2 | 1 | 2 | 10 | 11 |

---

## 3. Công thức & Chi tiết Tính điểm SUS từng Người dùng

### Công thức tính điểm quy đổi chuẩn Bangor et al. (2008):
1. **Điểm quy đổi nhóm Tích cực (câu lẻ: Q1, Q3, Q5, Q7, Q9)**:  
   $$\text{Score}_{\text{tích cực}} = S_{lẻ} - 5$$

2. **Điểm quy đổi nhóm Tiêu cực (câu chẵn: Q2, Q4, Q6, Q8, Q10)**:  
   $$\text{Score}_{\text{tiêu cực}} = 25 - S_{chẵn}$$

3. **Tổng điểm SUS (Overall SUS Score thang 100)**:  
   $$\text{SUS Score} = (\text{Score}_{\text{tích cực}} + \text{Score}_{\text{tiêu cực}}) \times 2.5$$

---

## 4. Kết quả Bảng tổng hợp Điểm SUS & Xếp loại (SUS Final Results & Ratings)

Dựa theo thang đo chuẩn Bangor et al. (2008) & Sauro:

| Mã ND | $S_{lẻ} - 5$ | $25 - S_{chẵn}$ | Điểm thô | Điểm SUS (Thang 100) | Xếp loại (Grade) | Mức độ chấp nhận (Acceptability) | Cảm nhận đánh giá (Adjective Rating) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **P01** | 8 | 9 | 17 | **42.5** | **Grade F (<60)** | Không thể chấp nhận (Not Acceptable) | Poor (Yếu) |
| **P02** | 10 | 11 | 21 | **52.5** | **Grade D (50-62)** | Vùng biên (Marginal Low) | OK (Tạm được) |
| **P03** | 13 | 13 | 26 | **65.0** | **Grade D (62-70)** | Vùng biên (Marginal High) | OK (Tạm được) |
| **P04** | 17 | 16 | 33 | **82.5** | **Grade B (80-90)** | Chấp nhận được (Acceptable) | Excellent (Xuất sắc) |
| **P05** | 18 | 20 | 38 | **95.0** | **Grade A (90-100)** | Chấp nhận được (Acceptable) | Best Imaginable (Xuất sắc nhất) |
| **P06** | 15 | 15 | 30 | **75.0** | **Grade C (70-80)** | Chấp nhận được (Acceptable) | Good (Tốt) |
| **P07** | 5 | 14 | 19 | **47.5** | **Grade F (<60)** | Không thể chấp nhận (Not Acceptable) | Poor (Yếu) |

---

## 5. Thống kê & Tổng hợp Đánh giá (Statistical Summary & Analysis)

| Chỉ số Thống kê | Giá trị Điểm SUS | Đánh giá Tổng quan |
| :--- | :---: | :--- |
| **Điểm SUS Trung bình (Mean SUS Score)** | **65.71 / 100** | **Đạt mức MARGINAL HIGH (Vùng biên trên) — Tiệm cận mức Good (68 điểm)** |
| **Điểm SUS Trung vị (Median)** | **65.00 / 100** | Đạt xếp loại Grade D (Marginal High) |
| **Điểm Cao nhất (Max)** | **95.00** (P05) | Mức Best Imaginable (Xuất sắc nhất) |
| **Điểm Thấp nhất (Min)** | **42.50** (P01) | Mức Not Acceptable (Không thể chấp nhận) |
| **Tỷ lệ Chấp nhận được (Acceptable Rate)** | **42.86%** (3/7 người >= 70 điểm) | 3/7 người dùng cảm thấy hệ thống dễ dùng và tự tin sử dụng |
| **Tỷ lệ Vùng biên (Marginal Rate)** | **28.57%** (2/7 người 50-70 điểm) | 2/7 người dùng nhận thấy hệ thống ổn nhưng cần mượt hơn |
| **Tỷ lệ Không chấp nhận (Not Acceptable)** | **28.57%** (2/7 người < 50 điểm) | 2/7 người dùng gặp khó khăn do thiếu phản hồi trạng thái & nhãn |

---

## 6. Kết luận & Hướng Cải tiến Usability (Usability Synthesis)

1. **Điểm mạnh (Strengths)**:
   * Nhóm người dùng có nền tảng tốt (P04, P05, P06) đạt điểm SUS cao (75.0 - 95.0 điểm), khen ngợi luồng công việc ngắn gọn, dữ liệu hiển thị cập nhật trực tiếp trên bảng.
   * Tất cả 7 người dùng đều tự hoàn thành các Task chính.

2. **Điểm cần cải thiện (Weaknesses / Friction Points)**:
   * **Trường điều kiện Mã giảm giá (6/7 người gặp)**: Vị trí ô "Đơn tối thiểu (đ)" và "Số lần dùng tối đa/người" gây bối rối cho phần lớn người dùng.
   * **Nhập ô Giá tiền (3/7 người gặp)**: Ô nhập giá tiền chỉ dùng placeholder (thiếu Label), người dùng bấm nhầm/nhập sai nhiều lần do thiếu định dạng ngăn cách 3 chữ số và không tự xóa khoảng trắng.
   * **Form Tạo danh mục (4/7 người gặp)**: Người dùng hay có thói quen bấm nút "Thêm mới" ngay lập tức khi chưa điền thông tin hoặc lúng túng tìm vị trí menu.
   * **Định dạng Ngày tháng**: Ô chọn ngày tháng năm chưa hỗ trợ định dạng chuẩn `dd/mm/yyyy`.

3. **Kế hoạch Cải tiến UX (Actionable Recommendations)**:
   * **Ưu tiên 1**: Sắp xếp lại nhóm ô nhập điều kiện trên Form Tạo Mã giảm giá theo khối (Section block) phân định rõ ràng.
   * **Ưu tiên 2**: Cải thiện ô nhập "Giá tiền": Thêm Label cố định phía trên, tích hợp tự động phân cách dấu chấm/phẩy hàng nghìn (currency mask) và tự trim khoảng trắng.
   * **Ưu tiên 3**: Validate form tạo danh mục: Highlight màu đỏ hoặc disable nút "Thêm mới" cho đến khi điền tên danh mục.
