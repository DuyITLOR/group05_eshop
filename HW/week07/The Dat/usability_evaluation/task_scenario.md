# Kịch bản Nhiệm vụ Kiểm thử Tính khả dụng (Usability Task Scenario)
**Hệ thống kiểm thử (SUT)**: EShop — Web Admin (`http://localhost:5174/`)  
**Phạm vi (Scope)**: Quản lý Admin (FR-12 Access Control, FR-14 Category, FR-15 Product, FR-17 Coupon) & Interface Aspects (IA-01, IA-02, IA-03, IA-04)  
**Luồng End-to-End (E2E Flow)**: Đăng nhập Admin ➔ Tạo Danh mục mới ➔ Tạo Sản phẩm mới thuộc danh mục đó ➔ Tạo Mã giảm giá (Coupon)  

---

## 1. Mục tiêu Kiểm thử (Usability Objectives)

Buổi kiểm thử hướng tới các mục tiêu cụ thể sau:
* **Khả năng hoàn thành nhiệm vụ (Task Completion Rate)**: Đánh giá tỷ lệ người dùng (đóng vai Admin) hoàn thành trọn vẹn luồng thiết lập hàng hóa và khuyến mãi mới mà không cần trợ giúp.
* **Điểm nghẽn điều hướng (Navigation Bottlenecks)**: Xác định xem người dùng có gặp khó khăn khi di chuyển giữa các menu quản lý (Danh mục, Sản phẩm, Mã giảm giá) và khi tìm kiếm/xác nhận dữ liệu vừa tạo (đặc biệt khi giao diện không có ô tìm kiếm sản phẩm).
* **Phản hồi hệ thống (Feedback & State)**: Đánh giá cảm nhận của người dùng về tính rõ ràng của thông báo lỗi, thông báo thành công (toast/modal) sau mỗi thao tác khởi tạo.
* **Mức độ tự tin & Tin tưởng (User Confidence & Trust)**: Đánh giá mức độ dễ sử dụng, thời gian phản hồi và sự tự tin của người dùng khi làm việc trên phân hệ Web Admin.

---

## 2. Kịch bản Nhiệm vụ cho Người tham gia (Participant Task Scenario)

> ⚠️ **Lưu ý dành cho Người điều phối (Moderator)**:  
> Tuân thủ nghiêm ngặt nguyên tắc: **Cung cấp cho người tham gia một mục tiêu nghiệp vụ thực tế (Goal-oriented Scenario), KHÔNG cung cấp hướng dẫn chi tiết từng bước click/bấm (No step-by-step instructions).**

### 📋 Bối cảnh & Mục tiêu (Given to Participant)

> **Bối cảnh**:  
> Bạn vừa tiếp quản vị trí **Quản trị viên (Admin)** cho trang thương mại điện tử EShop. Hôm nay, cửa hàng quyết định mở rộng kinh doanh sang ngành hàng mới và chạy chương trình khuyến mãi để kích cầu mua sắm.
> 
> **Nhiệm vụ của bạn**:
> 1. Truy cập vào hệ thống Admin và đăng nhập bằng tài khoản Quản trị viên được cung cấp.
> 2. Khởi tạo danh mục hàng hóa mới có tên là **"Đồ gia dụng"**.
> 3. Đăng bán sản phẩm mới tên là **"Nồi chiên không dầu"** với giá **1.500.000 ₫**, mô tả *"Nồi chiên không dầu 5L cao cấp"*, thuộc danh mục **"Đồ gia dụng"** vừa tạo.
> 4. Tạo một mã giảm giá khuyến mãi khai trương có mã là **"SALE20"**, loại **phần trăm (20%)**, áp dụng cho đơn hàng tối thiểu từ **200.000 ₫**, số lần dùng tối đa **1 lần/người**, hạn sử dụng đến ngày **31/12/2099**.

---

## 3. Thông tin Cung cấp cho Người tham gia (Test Environment & Data)

* **URL Web Admin**: `http://localhost:5174/`
* **Tài khoản đăng nhập (Admin)**: `admin@eshop.com` / `Admin123!`
* **Dữ liệu mẫu cần nhập**:
  * **Danh mục**: `Đồ gia dụng`
  * **Sản phẩm**: 
    * Tên: `Nồi chiên không dầu`
    * Giá: `1500000`
    * Mô tả: `Nồi chiên không dầu 5L cao cấp`
    * URL Ảnh: `https://via.placeholder.com/150` (hoặc để mặc định/link ảnh tùy ý)
    * Danh mục chọn: `Đồ gia dụng`
  * **Mã giảm giá**:
    * Mã coupon: `SALE20`
    * Loại: `Phần trăm (%)`
    * Giá trị: `20`
    * Đơn tối thiểu: `200000`
    * Ngày hết hạn: `2099-12-31`
    * Số lần dùng/người: `1`

---

## 4. Quá trình điều phối

Quy trình thực hiện trong phiên kiểm thử:

1. **Thiết lập tâm lý (Set the stage)**: 
   * Giải thích rõ với người tham gia: *"Chúng tôi đang kiểm thử giao diện sản phẩm, không phải kiểm thử bạn. Hãy thoải mái thao tác và phát biểu suy nghĩ."*
   * Yêu cầu người tham gia **suy nghĩ thành lời (Think-Aloud Protocol)** trong suốt quá trình thao tác (ví dụ: đang tìm nút ở đâu, đang phân vân điều gì, cảm thấy thao tác dễ hay khó).
2. **Quan sát trung lập (Observe neutrally)**:
   * Người điều phối không đưa ra gợi ý (leading hints), không giải thích giao diện.
   * Chỉ can thiệp hỗ trợ nếu người tham gia bị kẹt hoàn toàn (completely stuck) quá 3 phút và ghi nhận đó là 1 điểm tắc nghẽn (Blocker).
3. **Ghi nhận bằng chứng (Capture evidence)**:
   * Ghi hình màn hình & âm thanh (khi được sự đồng ý).
   * Ghi chép các điểm gây khó chịu (friction points), lỗi thao tác, sự ngập ngừng (hesitation) và phản hồi tiêu cực từ người tham gia.

---

## 5. Công cụ Đánh giá sau Phiên kiểm thử (Post-Session Evaluation Instruments)

Sau khi hoàn thành kịch bản nhiệm vụ, người tham gia sẽ thực hiện 2 phần đánh giá:

### A. Đánh giá Định lượng (System Usability Scale - SUS)

Thang đo **SUS (System Usability Scale)** là công cụ chuẩn quốc tế gồm 10 câu hỏi để đánh giá tính khả dụng của hệ thống.

#### Thang điểm phản hồi (Likert 5 điểm)
Người tham gia chọn 1 mức độ phù hợp cho mỗi câu hỏi:
* **1**: Rất không đồng ý (Strongly Disagree)
* **2**: Không đồng ý (Disagree)
* **3**: Bình thường / Trung lập (Neutral)
* **4**: Đồng ý (Agree)
* **5**: Rất đồng ý (Strongly Agree)

#### Danh sách 10 câu hỏi SUS chuẩn:

| STT | Nội dung câu hỏi (Tiếng Việt) | Loại câu hỏi |
| :---: | :--- | :---: |
| **Q1** | Tôi nghĩ rằng mình sẽ muốn sử dụng hệ thống này thường xuyên. | Tích cực (Số lẻ) |
| **Q2** | Tôi thấy hệ thống này phức tạp một cách không cần thiết. | Tiêu cực (Số chẵn) |
| **Q3** | Tôi thấy hệ thống này dễ sử dụng. | Tích cực (Số lẻ) |
| **Q4** | Tôi nghĩ rằng mình sẽ cần sự hỗ trợ của một kỹ thuật viên để có thể sử dụng được hệ thống này. | Tiêu cực (Số chẵn) |
| **Q5** | Tôi thấy các chức năng trong hệ thống này được tích hợp rất tốt. | Tích cực (Số lẻ) |
| **Q6** | Tôi nghĩ rằng hệ thống này có quá nhiều điểm bất nhất (không nhất quán). | Tiêu cực (Số chẵn) |
| **Q7** | Tôi tưởng tượng rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh. | Tích cực (Số lẻ) |
| **Q8** | Tôi thấy hệ thống này rất cồng kềnh/rắc rối khi sử dụng. | Tiêu cực (Số chẵn) |
| **Q9** | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. | Tích cực (Số lẻ) |
| **Q10** | Tôi cần phải học rất nhiều thứ trước khi có thể bắt đầu sử dụng hệ thống này. | Tiêu cực (Số chẵn) |

#### Công thức tính điểm SUS (Thang điểm 0 - 100):

Gọi $S_{\text{lẻ}}$ là tổng điểm người dùng chọn cho 5 câu tích cực (Q1, Q3, Q5, Q7, Q9) và $S_{\text{chẵn}}$ là tổng điểm người dùng chọn cho 5 câu tiêu cực (Q2, Q4, Q6, Q8, Q10):

1. **Điểm quy đổi nhóm Tích cực (câu lẻ: Q1, Q3, Q5, Q7, Q9)**:  
   $$\text{Score}_{\text{tích cực}} = S_{\text{lẻ}} - 5$$
2. **Điểm quy đổi nhóm Tiêu cực (câu chẵn: Q2, Q4, Q6, Q8, Q10)**:  
   $$\text{Score}_{\text{tiêu cực}} = 25 - S_{\text{chẵn}}$$
3. **Tổng điểm SUS (Overall SUS Score)**:  
   $$\text{SUS Score} = \left( \text{Score}_{\text{tích cực}} + \text{Score}_{\text{tiêu cực}} \right) \times 2.5$$


#### Thước đo đánh giá kết quả điểm SUS (SUS Rating & Acceptability Scale):

Dựa theo mô hình đánh giá chuẩn quốc tế (Bangor et al., 2008 & Sauro):

1. **Mức độ chấp nhận (Acceptability Range)**:
   * **Không thể chấp nhận (Not Acceptable)**: $< 50$ điểm
   * **Vùng biên (Marginal)**: $50 - 70$ điểm *(Biên thấp / Marginal Low: 50 – 62; Biên cao / Marginal High: 62 – 70)*
   * **Chấp nhận được (Acceptable)**: $> 70$ điểm

2. **Thang xếp loại (Grade Scale)**:
   * **Grade A**: $90 - 100$ điểm
   * **Grade B**: $80 - 90$ điểm
   * **Grade C**: $70 - 80$ điểm
   * **Grade D**: $60 - 70$ điểm
   * **Grade F**: $0 - 60$ điểm

3. **Đánh giá cảm nhận (Adjective Rating)**:
   * **Worst Imaginable** ($\approx 25$ điểm): Tệ nhất có thể hình dung
   * **Poor** ($\approx 38 - 39$ điểm): Kém
   * **OK** ($\approx 52$ điểm): Tạm được
   * **Good** ($\approx 72 - 73$ điểm): Tốt
   * **Excellent** ($\approx 85.5$ điểm): Xuất sắc
   * **Best Imaginable** ($100$ điểm): Tốt nhất có thể hình dung


---

### B. Câu hỏi Đào sâu (Open-ended Probe Questions)

Phỏng vấn nhanh người tham gia về 4 khía cạnh cốt lõi sau:

1. **Độ rõ ràng (Clarity)**: *"Bạn thấy các menu điều hướng, nhãn của ô nhập liệu và các nút bấm trên trang Admin có rõ ràng, dễ hiểu không?"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: *"Nếu bạn nhập sai dữ liệu (ví dụ bỏ trống tên danh mục hoặc nhập giá tiền âm), giao diện cảnh báo có giúp bạn biết cách sửa lại không?"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: *"Bạn cảm thấy tốc độ hoàn thành công việc từ tạo danh mục -> sản phẩm -> mã giảm giá nhanh hay chậm? Có thao tác nào làm bạn tốn thời gian tìm kiếm không?"*
4. **Mức độ tin tưởng (Trust & State)**: *"Sau khi bấm 'Lưu sản phẩm' hoặc 'Tạo mã', bạn có tin tưởng là hệ thống đã lưu thành công không? Điều gì trên giao diện làm bạn nhận biết điều đó?"*
