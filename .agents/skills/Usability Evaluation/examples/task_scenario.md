# Kịch bản Nhiệm vụ Kiểm thử Tính khả dụng (Usability Task Scenario Example)

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
   * Yêu cầu người tham gia **suy nghĩ thành lời (Think-Aloud Protocol)** trong suốt quá trình thao tác.
2. **Quan sát trung lập (Observe neutrally)**:
   * Người điều phối không đưa ra gợi ý, không giải thích giao diện. Chỉ hỗ trợ nếu kẹt quá 3 phút.
3. **Ghi nhận bằng chứng (Capture evidence)**:
   * Ghi hình màn hình & ghi chép điểm nghẽn.
