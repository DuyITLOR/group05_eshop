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

| Mã Người dùng | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | $S_{\text{lẻ}}$ (Tổng Q1,3,5,7,9) | $S_{\text{chẵn}}$ (Tổng Q2,4,6,8,10) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **P01** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | 20 | 9 |
| **P02** | 4 | 2 | 5 | 1 | 4 | 2 | 5 | 1 | 4 | 1 | 22 | 7 |
| **P03** | 3 | 3 | 4 | 2 | 3 | 2 | 4 | 2 | 3 | 2 | 17 | 11 |
| **P04** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | 20 | 9 |
| **P05** | 5 | 1 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 1 | 21 | 7 |
| **P06** | 3 | 3 | 3 | 2 | 4 | 3 | 4 | 3 | 3 | 2 | 17 | 13 |
| **P07** | 4 | 2 | 4 | 1 | 4 | 2 | 5 | 2 | 4 | 1 | 21 | 8 |

---

## 3. Công thức & Chi tiết Tính điểm SUS từng Người dùng

### Công thức tính điểm:
1. **Điểm quy đổi nhóm Tích cực (câu lẻ: Q1, Q3, Q5, Q7, Q9)**:  
   $$\text{Score}_{\text{tích cực}} = S_{\text{lẻ}} - 5$$

2. **Điểm quy đổi nhóm Tiêu cực (câu chẵn: Q2, Q4, Q6, Q8, Q10)**:  
   $$\text{Score}_{\text{tiêu cực}} = 25 - S_{\text{chẵn}}$$

3. **Tổng điểm SUS (Overall SUS Score)**:  
   $$\text{SUS Score} = \left( \text{Score}_{\text{tích cực}} + \text{Score}_{\text{tiêu cực}} \right) \times 2.5$$

---

## 4. Kết quả Bảng tổng hợp Điểm SUS & Xếp loại (SUS Final Results & Ratings)

Dựa theo thang đo chuẩn Bangor et al. (2008) & Sauro:

| Mã ND | $S_{\text{lẻ}} - 5$ | $25 - S_{\text{chẵn}}$ | Điểm quy đổi thô | Điểm SUS (Thang 100) | Thang xếp loại (Grade) | Mức độ chấp nhận (Acceptability) | Cảm nhận đánh giá (Adjective Rating) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **P01** | 15 | 16 | 31 | **77.5** | **Grade C** | Chấp nhận được (Acceptable) | Good (Tốt) |
| **P02** | 17 | 18 | 35 | **87.5** | **Grade B** | Chấp nhận được (Acceptable) | Excellent (Xuất sắc) |
| **P03** | 12 | 14 | 26 | **65.0** | **Grade D** | Vùng biên (Marginal High) | OK (Tạm được) |
| **P04** | 15 | 16 | 31 | **77.5** | **Grade C** | Chấp nhận được (Acceptable) | Good (Tốt) |
| **P05** | 16 | 18 | 34 | **85.0** | **Grade B** | Chấp nhận được (Acceptable) | Excellent (Xuất sắc) |
| **P06** | 12 | 12 | 24 | **60.0** | **Grade D** | Vùng biên (Marginal Low) | OK (Tạm được) |
| **P07** | 16 | 17 | 33 | **82.5** | **Grade B** | Chấp nhận được (Acceptable) | Good (Tốt) |

---

## 5. Thống kê & Tổng hợp Đánh giá (Statistical Summary & Analysis)

| Chỉ số Thống kê | Giá trị Điểm SUS | Đánh giá Tổng quan |
| :--- | :---: | :--- |
| **Điểm SUS Trung bình (Mean SUS Score)** | **76.43 / 100** | **Đạt mức GOOD (Tốt) — Chấp nhận được (Acceptable)** |
| **Điểm SUS Trung vị (Median)** | **77.50 / 100** | Đạt mức Grade C+ |
| **Điểm Cao nhất (Max)** | **87.50** (P02) | Mức Excellent |
| **Điểm Thấp nhất (Min)** | **60.00** (P06) | Mức Marginal Low (Vùng biên) |
| **Tỷ lệ Chấp nhận được (Acceptable Rate)** | **71.4%** (5/7 người) | Hệ thống đáp ứng tốt nhu cầu sử dụng cơ bản của Admin |

---

## 6. Kết luận & Hướng Cải tiến Usability (Usability Synthesis)

1. **Điểm mạnh (Strengths)**:
   * Điểm trung bình **76.43** vượt mức chuẩn trung bình ngành (68 điểm).
   * Giao diện các form nhập liệu cơ bản (Tạo danh mục, Tạo coupon) được đánh giá là trực quan, dễ học.
2. **Điểm cần cải thiện (Weaknesses / Friction Points)**:
   * Người dùng đánh giá thấp nhất ở Q6 & Q8 (P06 cho điểm SUS 60.0) chủ yếu do **thiếu chức năng tìm kiếm sản phẩm** và **thiếu thông báo phản hồi trạng thái thành công** sau khi lưu dữ liệu.
   * Cần ưu tiên bổ sung thanh Tìm kiếm & Bộ lọc tại trang Sản phẩm để nâng điểm SUS lên mức **Grade A (>= 85 điểm)**.
