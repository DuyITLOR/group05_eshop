# Bảng Ghi chú Quan sát Phiên Kiểm thử Tính khả dụng (Usability Observation Notes)

**Hệ thống kiểm thử (SUT)**: EShop — Web Admin (`http://localhost:5174/`)  
**Kịch bản E2E**: Đăng nhập Admin ➔ Tạo Danh mục mới ➔ Tạo Sản phẩm thuộc danh mục ➔ Tạo Mã giảm giá  

---

## 1. Danh sách 7 Người tham gia Kiểm thử (Participant List)

| Mã Người dùng | Họ và Tên | Thông tin liên hệ (Che 4 số giữa) | Nghề nghiệp / Nền tảng | Ngày & Giờ Test | Thiết bị / Trình duyệt |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **P01** | Đặng Diều Hưng | 0338****79 (Zalo) | Môi trường | 30/07/2026 10:55 | Windows / Firefox |
| **P02** | Nguyễn Công Kiên | 0856****19 (Zalo) | Công nghệ thông tin | 30/07/2026 12:07 | Windows / Firefox |
| **P03** | Lương Thành Lộc | 0393****96 (Zalo) | Công nghệ Tri thức | 30/07/2026 12:26 | Windows / Firefox |
| **P04** | Hồ Đắc Lực | 0932****63 (Zalo) | Toán Tin | 30/07/2026 12:55 | Windows / Firefox |
| **P05** | Mai Thảo Trang | 0982****29 (Zalo) | Ngôn Ngữ Anh | 30/07/2026 14:43 | Windows / Firefox |
| **P06** | Nguyễn Trần Hải Đăng | 0396****02 (Zalo) | An ninh mạng và phòng chống tội phạm công nghệ cao | 30/07/2026 15:01 | Windows / Firefox |
| **P07** | Lê Thị Hồng Đang | 0839****56 (Zalo) | Toán tin | 30/07/2026 15:42 | Windows / Firefox |

---

## 2. Nhật ký Quan sát Chi tiết (Chi tiết từng Người tham gia)

---

### 👤 Nhật ký Quan sát: Người tham gia P01 (Đặng Diều Hưng)

* **Họ và tên**: Đặng Diều Hưng  
* **Thông tin liên hệ**: 0338****79 (Zalo)  
* **Chuyên ngành**: Môi trường | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 10:55  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 30s | 🟢 Tự hoàn thành | - Thao tác nhập tài khoản admin mượt mà, không gặp trở ngại. |
| **Task 2: Tạo Danh mục mới** | 90s | 🟡 Cần hỗ trợ nhẹ | - Thêm danh mục thành công nhưng lúng túng vì không biết vị trí "danh mục hàng hóa" nằm ở đâu. Ban đầu bấm thêm mới ngay lập tức mà không điền tên danh mục. |
| **Task 3: Tạo Sản phẩm mới** | 200s | 🟡 Cần hỗ trợ nhẹ | - Người dùng nhập sai nhiều lần ở ô "giá tiền", người dùng muốn ô giá tiền tự động ngăn cách sau 3 chữ số để dễ nhìn hơn và phải biết tự loại bỏ khoảng trắng. |
| **Task 4: Tạo Mã giảm giá** | 180s | 🟢 Tự hoàn thành | - Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người", gặp khó khăn trong việc ghi ngày tháng năm. |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Menu điều hướng, nhãn nhập liệu và nút bấm có rõ ràng, nhưng tên của nhãn nhập liệu nên để phía trên hoặc bên trái sẽ thấy rõ hơn."*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"Có"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"Nếu bắt đầu sẽ chậm nhưng quen việc sẽ nhanh hơn"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"Không chắc chắn phải cần xem lại, nên có thông báo lưu thành công"*

---

### 👤 Nhật ký Quan sát: Người tham gia P02 (Nguyễn Công Kiên)

* **Họ và tên**: Nguyễn Công Kiên  
* **Thông tin liên hệ**: 0856****19 (Zalo)  
* **Chuyên ngành**: Công nghệ thông tin | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 12:07  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 30s | 🟢 Tự hoàn thành | - Đăng nhập nhanh chóng. |
| **Task 2: Tạo Danh mục mới** | 45s | 🟢 Tự hoàn thành | - Ban đầu bấm thêm mới ngay lập tức mà không điền tên danh mục. |
| **Task 3: Tạo Sản phẩm mới** | 120s | 🟢 Tự hoàn thành | - Tạo sản phẩm mượt mà. |
| **Task 4: Tạo Mã giảm giá** | 70s | 🟢 Tự hoàn thành | - Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người". |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Các vùng nhập liệu khi nhập khó biết được là dành cho việc gì. Các thao tác thêm dữ liệu không có ràng buộc dễ gây nhầm lẫn."*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"Khi dữ liệu được nhập sai hay đúng đều không có sự kiện thông báo nào cả."*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"Luồng hoàn thành công việc ngắn gọn, chỉ có vài điểm nhỏ gây hiểu nhầm, nhưng không tốn quá nhiều thời gian."*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"Có, bởi có thể thấy được sản phẩm/mã hiển thị rõ ràng ở phía người dùng."*

---

### 👤 Nhật ký Quan sát: Người tham gia P03 (Lương Thành Lộc)

* **Họ và tên**: Lương Thành Lộc  
* **Thông tin liên hệ**: 0393****96 (Zalo)  
* **Chuyên ngành**: Công nghệ Tri thức | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 12:26  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 30s | 🟢 Tự hoàn thành | - Thao tác nhanh gọn. |
| **Task 2: Tạo Danh mục mới** | 130s | 🟢 Tự hoàn thành | - Tạo danh mục thuận lợi. Người dùng nhận xét tạo tên danh mục quá đơn giản. |
| **Task 3: Tạo Sản phẩm mới** | 130s | 🟢 Tự hoàn thành | - Người dùng nhập sai nhiều lần ở ô "giá tiền". Người dùng muốn thêm label cho ô nhập liệu thay vì chỉ hiện placeholder. |
| **Task 4: Tạo Mã giảm giá** | 60s | 🟢 Tự hoàn thành | - Điền thông tin mã giảm giá mượt mà. Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người". |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Có"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"Có"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"Khá nhanh, Không mất thời gian tìm kiếm"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"Có vì hệ thống hiển thị ngay lập tức"*

---

### 👤 Nhật ký Quan sát: Người tham gia P04 (Hồ Đắc Lực)

* **Họ và tên**: Hồ Đắc Lực  
* **Thông tin liên hệ**: 0932****63 (Zalo)  
* **Chuyên ngành**: Toán Tin | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 12:55  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 30s | 🟢 Tự hoàn thành | - Đăng nhập lập tức. |
| **Task 2: Tạo Danh mục mới** | 30s | 🟢 Tự hoàn thành | - Đã hiểu rõ luồng công việc. |
| **Task 3: Tạo Sản phẩm mới** | 65s | 🟢 Tự hoàn thành | - Hài lòng với phản hồi cập nhật tức thì trên bảng dữ liệu. |
| **Task 4: Tạo Mã giảm giá** | 50s | 🟢 Tự hoàn thành | - Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người". |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Tôi thấy rất dễ hiểu"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"Có, giao diện thông báo lỗi giúp tôi biết tôi đã nhập sai ở đâu"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"Tốc độ hoàn thành luồng công việc nhanh. Không có chỗ nào phải mất thời gian tìm kiếm"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"Tôi tin là hệ thống đã lưu thành công bởi vì tôi thấy sản phẩm hoặc mã vừa tạo được cập nhật ngay trên giao diện và khi tôi tải lại trang thì những thông tin vừa tạo vẫn ở đấy"*

---

### 👤 Nhật ký Quan sát: Người tham gia P05 (Mai Thảo Trang)

* **Họ và tên**: Mai Thảo Trang  
* **Thông tin liên hệ**: 0982****29 (Zalo)  
* **Chuyên ngành**: Ngôn Ngữ Anh | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 14:43  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 60s | 🟢 Tự hoàn thành | - Đăng nhập không tốn thời gian. |
| **Task 2: Tạo Danh mục mới** | 25s | 🟢 Tự hoàn thành | - Điền form nhanh. |
| **Task 3: Tạo Sản phẩm mới** | 100s | 🟢 Tự hoàn thành | - Hoàn thành tạo sản phẩm mượt mà. |
| **Task 4: Tạo Mã giảm giá** | 40s | 🟢 Tự hoàn thành | - Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người". |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Có"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"có"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"tốc độ hoàn thành nhanh"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"tôi tin. vì sản phẩm và mã đều hiển thị trên bảng"*

---

### 👤 Nhật ký Quan sát: Người tham gia P06 (Nguyễn Trần Hải Đăng)

* **Họ và tên**: Nguyễn Trần Hải Đăng  
* **Thông tin liên hệ**: 0396****02 (Zalo)  
* **Chuyên ngành**: An ninh mạng và phòng chống tội phạm công nghệ cao | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 15:01  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 30s | 🟢 Tự hoàn thành | - Đăng nhập thành công. |
| **Task 2: Tạo Danh mục mới** | 50s | 🟢 Tự hoàn thành | - Ban đầu bấm thêm mới ngay lập tức mà không điền tên danh mục. |
| **Task 3: Tạo Sản phẩm mới** | 75s | 🟢 Tự hoàn thành | - Người dùng nhập sai nhiều lần ở ô "giá tiền". |
| **Task 4: Tạo Mã giảm giá** | 60s | 🟢 Tự hoàn thành | - Ô nhập ngày tháng năm format không chuẩn (mm/dd/yy). Người dùng không biết rõ vị trí ô "Đơn tối thiểu (đ)" và "số lần dùng tối đa/người". |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"có"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"không"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"tốc độ hoàn thành lường công việc nhanh"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"mình có vì sản phẩm đã được hiện ra trên màn hình"*

---

### 👤 Nhật ký Quan sát: Người tham gia P07 (Lê Thị Hồng Đang)

* **Họ và tên**: Lê Thị Hồng Đang  
* **Thông tin liên hệ**: 0839****56 (Zalo)  
* **Chuyên ngành**: Toán tin | **Thiết bị**: Windows / Firefox  
* **Ngày giờ kiểm thử**: 30/07/2026 15:42  

#### A. Quan sát Thao tác theo Nhiệm vụ (Task Execution Notes)

| Nhiệm vụ (Task) | Thời gian | Trạng thái | Ghi chú phát biểu (Think-Aloud) & Lỗi thao tác / Điểm ngập ngừng |
| :--- | :---: | :---: | :--- |
| **Task 1: Đăng nhập Admin** | 35s | 🟢 Tự hoàn thành | - Thao tác đăng nhập tiêu chuẩn. |
| **Task 2: Tạo Danh mục mới** | 60s | 🟢 Tự hoàn thành | - Ban đầu bấm thêm mới ngay lập tức mà không điền tên danh mục. Đánh giá giao diện khá sơ khai so với các trang TMĐT thông thường. |
| **Task 3: Tạo Sản phẩm mới** | 120s | 🟢 Tự hoàn thành | - Hoàn thành tạo sản phẩm mượt mà. |
| **Task 4: Tạo Mã giảm giá** | 90s | 🟢 Tự hoàn thành | - Tạo mã giảm giá mượt mà. |

#### B. Phản hồi Phỏng vấn Đào sâu (Probe Questions)

1. **Độ rõ ràng (Clarity)**: > *"Tạm thời là dễ hiểu, chỉ hơi có một số đơn giản so với các trang web thông thường"*
2. **Khả năng phục hồi lỗi (Error Recovery)**: > *"có"*
3. **Tốc độ & Sự mượt mà (Speed & Efficiency)**: > *"ổn định, nhanh"*
4. **Mức độ tin tưởng & Trạng thái (Trust & State)**: > *"có, vì hiển thị lên màn hình"*


---

## 3. Tổng hợp Vấn đề Tính khả dụng Phát hiện (Usability Findings & Bug Summary)

| ID Vấn đề | Mô tả Vấn đề UX / Lỗi Giao diện | Khía cạnh (IA) | Số người gặp (x/7) | Mức độ nghiêm trọng | Hướng đề xuất cải tiến |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **UX-01** | Bố trí layout ô "Đơn tối thiểu (đ)" và "Số lần dùng tối đa/người" trên Form Tạo Mã giảm giá chưa rõ ràng, khiến người dùng không biết rõ vị trí | IA-02 (Navigation & Forms) | 6/7 (86%) | 🔴 **Major (Nghiêm trọng)** | Sắp xếp lại nhóm trường điều kiện giảm giá theo khối (Section block) rõ ràng kèm nhãn Label cố định phía trên. |
| **UX-02** | Ô nhập "Giá tiền" dễ gây nhập sai nhiều lần; thiếu Label cố định (chỉ dùng placeholder), không tự phân cách 3 chữ số (VD: 100.000) và không tự trim khoảng trắng | IA-04 (Error Handling / Input) | 3/7 (43%) | 🔴 **Major (Nghiêm trọng)** | Bổ sung Label cố định, tự động format tiền tệ theo thời gian thực (currency mask) và trim khoảng trắng thừa. |
| **UX-03** | Thói quen bấm nút "Thêm mới" ngay lập tức mà không điền Tên danh mục; lúng túng tìm vị trí menu "Danh mục hàng hóa" | IA-02 (Forms & Validation) | 4/7 (57%) | 🟠 **Moderate (Trung bình)** | Vô hiệu hóa (Disable) nút "Thêm mới" cho đến khi điền tên danh mục hoặc báo lỗi validation trực quan ngay dưới ô nhập. |
| **UX-04** | Định dạng ngày tháng năm (Input date) chưa chuẩn hóa theo chuẩn Việt Nam (`dd/mm/yyyy`), gây rắc rối khi chọn hạn dùng mã | IA-02 (Form Inputs) | 2/7 (29%) | 🟠 **Moderate (Trung bình)** | Chuẩn hóa DatePicker theo định dạng `dd/mm/yyyy` trực quan. |
| **UX-05** | Thiếu thông báo phản hồi trạng thái (Toast notification / Popup) khi bấm "Lưu sản phẩm" hoặc "Tạo mã" thành công | IA-04 (Feedback) | 4/7 (57%) | 🟠 **Moderate (Trung bình)** | Bổ sung Toast notification ở góc màn hình (VD: "Đã lưu sản phẩm thành công!"). |
