# Mẫu Ghi chú Quan sát Phiên Kiểm thử Tính khả dụng (Usability Observation Notes)

**Hệ thống kiểm thử (SUT)**: EShop — Web Admin (`http://localhost:5174/`)  
**Kịch bản E2E**: Đăng nhập Admin ➔ Tạo Danh mục mới ➔ Tạo Sản phẩm thuộc danh mục ➔ Tạo Mã giảm giá  

---

## 1. Danh sách 7 Người tham gia Kiểm thử (Participant List)

| Mã Người dùng | Họ và Tên | Thông tin liên hệ (Che 4 số giữa) | Nghề nghiệp / Nền tảng | Ngày & Giờ Test | Thiết bị / Trình duyệt |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **P01** | Nguyễn Văn A | 0912****56 (Zalo) | Sinh viên Kinh tế (Non-IT) | DD/MM/2026 --:-- | Windows / Chrome |
| **P02** | Trần Thị B | 0983****12 (Phone) | Nhân viên Kế toán | DD/MM/2026 --:-- | macOS / Safari |
| **P03** | Lê Hoàng C | 0905****89 (Zalo) | Chuyên viên Marketing | DD/MM/2026 --:-- | Windows / Edge |
| **P04** | Phạm Minh D | 0934****77 (Phone) | Quản lý Cửa hàng | DD/MM/2026 --:-- | Windows / Chrome |
| **P05** | Đỗ Ngọc E | 0971****34 (Zalo) | Nhân viên Bán hàng | DD/MM/2026 --:-- | macOS / Chrome |
| **P06** | Vũ Thành F | 0968****90 (Phone) | Thiết kế Đồ họa (Non-IT) | DD/MM/2026 --:-- | Windows / Firefox |
| **P07** | Bùi Anh G | 0915****23 (Zalo) | Nhân viên Hành chính | DD/MM/2026 --:-- | Windows / Chrome |

---

## 2. Nhật ký Quan sát Chi tiết (Chi tiết từng Người tham gia)

---

### 👤 Mẫu Ghi chú Quan sát: Người tham gia P01

* **Họ tên người dùng**: Nguyễn Văn A  
* **Thời gian bắt đầu/kết thúc**: 14:00 - 14:15 (Tổng thời gian: 15 phút)  
* **Thiết bị/Trình duyệt**: Laptop Windows 11 / Google Chrome  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian (giây) | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Điểm ngập ngừng / Lỗi UX |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 25s | 🟢 Tự hoàn thành | - Người dùng tìm đúng form đăng nhập.<br>- Nhập email/password nhanh chóng. |
| **Task 2: Tạo Danh mục mới** | 40s | 🟢 Tự hoàn thành | - *Think-Aloud*: *"Menu 'Danh mục' ở bên trái rất dễ thấy."*<br>- Ngập ngừng 3s sau khi bấm 'Thêm mới' vì không có thông báo thành công (Toast notification), phải nhìn xuống bảng mới biết đã thêm. |
| **Task 3: Tạo Sản phẩm mới** | 120s | 🟡 Cần hỗ trợ nhẹ | - *Think-Aloud*: *"Ủa danh mục 'Đồ gia dụng' vừa tạo nằm đâu nhỉ?"*<br>- Chọn đúng danh mục trong dropdown.<br>- **Lỗi UX/Điểm nghẽn**: Sau khi bấm 'Lưu sản phẩm', người dùng cuộn lên cuộn xuống tìm ô Tìm kiếm sản phẩm nhưng **không có ô Search** để kiểm tra sản phẩm vừa tạo. |
| **Task 4: Tạo Mã giảm giá** | 90s | 🟢 Tự hoàn thành | - Tìm đúng menu 'Mã Giảm Giá'.<br>- Nhập đầy đủ thông tin mã SALE20, 20%, đơn 200k, hạn 2099-12-31.<br>- *Think-Aloud*: *"Form này nhìn rõ ràng, dễ điền hơn bên sản phẩm."* |

#### B. Kết quả Phỏng vấn Đào sâu (Open-ended Probe Questions)

1. **Độ rõ ràng (Clarity)**:  
   > *"Các nhãn tên nút và menu bên trái khá rõ ràng. Tuy nhiên bên trang Sản phẩm form nhìn hơi rối."*
2. **Khả năng phục hồi lỗi (Error Recovery)**:  
   > *"Tôi chưa nhập sai thử, nhưng nút bấm có vẻ phản hồi tốt."*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**:  
   > *"Tốc độ chuyển trang nhanh, nhưng tôi tốn thời gian tìm sản phẩm sau khi lưu vì danh sách dài mà không có thanh tìm kiếm."*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**:  
   > *"Tôi cảm thấy chưa thực sự tự tin khi bấm Lưu vì thiếu thông báo 'Đã lưu thành công' dạng popup góc màn hình."*

---

### 👤 Mẫu Ghi chú Quan sát: Người tham gia P02

*(Điền thông tin quan sát chi tiết cho P02 tương tự như trên)*

---

### 👤 Mẫu Ghi chú Quan sát: Người tham gia P03 đến P07

*(Điền thông tin quan sát chi tiết cho P03, P04, P05, P06, P07)*

---

## 3. Tổng hợp Vấn đề Tính khả dụng Phát hiện (Usability Findings & Bug Summary)

| ID Vấn đề | Mô tả Vấn đề UX / Lỗi Giao diện | Khía cạnh (IA) | Số người gặp (x/7) | Mức độ nghiêm trọng | Hướng đề xuất cải tiến |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **UX-01** | Thiếu thanh tìm kiếm & bộ lọc sản phẩm tại trang Quản lý Sản phẩm | IA-03 / IA-01 | 7/7 | 🔴 **Major (Nghiêm trọng)** | Thêm thanh Tìm kiếm theo tên & Bộ lọc Dropdown theo Danh mục. |
| **UX-02** | Thiếu thông báo phản hồi (Toast Notification) sau khi Thêm/Sửa/Xóa thành công | IA-04 | 6/7 | 🟠 **Moderate (Trung bình)** | Bổ sung Toast notification góc trên bên phải (VD: "Đã thêm danh mục thành công!"). |
| **UX-03** | Nút bấm "Lưu sản phẩm" thiếu hiệu ứng Loading/Disable khi đang gửi dữ liệu | IA-04 | 4/7 | 🟡 **Minor (Nhẹ)** | Thêm hiệu ứng loading spinner trên nút bấm để tránh người dùng click đúp (double-click). |
