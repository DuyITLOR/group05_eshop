# GUI Testing Report - Trang Quản lý Danh mục (Admin)

## 1. Test Target (Đối tượng kiểm thử)
- **Giao diện được kiểm thử (UI):** Trang Quản lý Danh mục Admin (`frontend-admin/src/App.jsx` - Tab Categories).
- **Mục đích:** Kiểm tra sự tuân thủ của giao diện Quản lý Danh mục so với Đặc tả Yêu cầu Hệ thống EShop (Mục 6: FR-14 & Mục 8: Yêu cầu Giao diện FR-21 đến FR-24).

## 2. Environment (Môi trường kiểm thử)

| Thông số | Chi tiết | Ghi chú / Ý nghĩa |
|---|---|---|
| **Thiết bị (Device)** | Laptop | Thiết bị phần cứng dùng để kiểm tra thực tế giao diện. |
| **Hệ điều hành (OS)** | Windows 11 | GUI có thể render phông chữ và scrollbar khác nhau trên Win/Mac. |
| **Trình duyệt (Browser)** | Google Chrome (Phiên bản mới nhất) | Đảm bảo tính tương thích của CSS, HTML5. |
| **Độ phân giải màn hình** | 1920x1080 (Desktop chuẩn) | Kiểm tra layout ở màn hình ngang rộng. |
| **Kích thước cửa sổ (Viewport)**| Fullscreen (Toàn màn hình) | Kích thước hiển thị thực tế của website. |
| **Môi trường Server** | Localhost (Vite port 5174 / Node port 3000) | Môi trường triển khai Frontend Admin & Backend API. |
| **Công cụ / Phương pháp** | Manual Testing kết hợp Code Inspection | Kiểm tra bằng mắt thường (Manual) và soi mã nguồn React. |

---

## 3. GUI Checklist & Results

### IA01: General UI standards (Tiêu chuẩn Giao diện Chung)
*Kiểm tra ngôn ngữ, màu sắc, tiêu đề trang, định dạng hiển thị và các tiêu chuẩn cơ bản.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-ADM-CAT-001 | Thẻ tiêu đề trang (H1) | Trang có đúng 1 thẻ `<h1>` mô tả rõ nội dung trang (ví dụ: "Quản lý Danh mục"). | Failed | AI Generated | Trang đang sử dụng thẻ `<h2>` thay vì `<h1>`. |
| GUI-ADM-CAT-002 | Màu sắc nút "Thêm mới" | Nút bấm thao tác tích cực (Thêm mới) hiển thị màu xanh dương (`bg-blue-600`). | Passed | AI Generated | Nút "Thêm mới" dùng màu xanh dương (`bg-blue-600`) đúng quy chuẩn. |
| GUI-ADM-CAT-003 | Màu sắc nút "Xóa" | Nút thao tác nguy hiểm/xóa danh mục hiển thị màu đỏ (`bg-red-500`). | Passed | AI Generated | Nút "Xóa" sử dụng màu đỏ (`bg-red-500`) đúng quy chuẩn. |
| GUI-ADM-CAT-004 | Sự nhất quán ngôn ngữ | Toàn bộ giao diện trang Quản lý Danh mục sử dụng 100% tiếng Việt. | Passed | AI Generated | Tiêu đề, tiêu đề cột bảng, placeholder và các nút bấm đều là tiếng Việt. |
| GUI-ADM-CAT-005 | Thứ tự phím Tab (Tab Order) | Phím Tab chuyển focus qua ô nhập liệu, nút bấm và danh sách hành động hợp lý từ trên xuống, trái sang phải. | Passed | **Student Added** | Thứ tự tab trên DOM tự nhiên theo thứ tự ô input -> Nút Thêm mới -> Nút Xóa. |

### IA02: Forms (Yêu cầu về Biểu mẫu và Ô nhập liệu)
*Kiểm tra các thành phần nhập liệu, form điều chỉnh.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-ADM-CAT-006 | Thẻ label & Ký hiệu trường bắt buộc | Ô nhập tên danh mục phải có thẻ `<label>` và ký hiệu `*` đỏ bên cạnh nhãn. | Failed | AI Generated | Ô nhập liệu chỉ dùng placeholder, thiếu thẻ `<label>` và dấu `*` đánh dấu trường bắt buộc. |
| GUI-ADM-CAT-007 | Vị trí thông báo lỗi | Thông báo lỗi khi thêm/xóa danh mục phải hiển thị inline phía trên nút submit, không dùng alert bật lên. | Failed | AI Generated | Hệ thống hiển thị thông báo lỗi qua `alert()` trình duyệt. |
| GUI-ADM-CAT-012 | Tự động trim khoảng trắng thừa | Khi nhập tên danh mục chứa khoảng trắng thừa ở đầu/cuối, hệ thống tự động loại bỏ khoảng trắng khi lưu. | Passed | **Student Added** | Mã nguồn xử lý `categoryName.trim()` chính xác trước khi gửi dữ liệu tạo mới. |

### IA03: Navigation (Yêu cầu về Điều hướng)
*Kiểm tra thanh điều hướng, menu, link liên kết và vị trí người dùng.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-ADM-CAT-008 | Highlight Sidebar menu | Tab "Danh mục" trên menu Sidebar được làm nổi bật (highlight) khi người dùng chọn xem. | Passed | AI Generated | Menu Sidebar áp dụng class `text-blue-400` khi `activeTab === "categories"`. |
| GUI-ADM-CAT-009 | Hiển thị Breadcrumb | Màn hình quản lý có thanh điều hướng Breadcrumb (ví dụ: Admin > Quản lý Danh mục). | Failed | AI Generated | Giao diện hoàn toàn không có thành phần Breadcrumb. |

### IA04: Feedback / state (Phản hồi & Trạng thái UI)
*Kiểm tra các thay đổi trạng thái, thông báo tương tác, hiển thị ảnh và xử lý dữ liệu trống.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-ADM-CAT-010 | Hộp thoại xác nhận khi xóa | Khi nhấn nút "Xóa" danh mục, phải hiển thị Dialog yêu cầu người dùng xác nhận trước khi thực hiện. | Failed | AI Generated | Bấm nút "Xóa" là hệ thống gọi API xóa lập tức mà không có Dialog xác nhận. |
| GUI-ADM-CAT-011 | Giao diện danh sách trống (Empty State) | Khi chưa có danh mục nào, hệ thống hiển thị thông báo rõ ràng kèm icon/hình ảnh minh họa. | Failed | **Student Added** | Khi danh sách rỗng, bảng chỉ hiển thị khung tiêu đề rỗng, thiếu icon/hình minh họa empty state. |

---

## 4. Test Summary (Tổng kết)

| Hạng mục | Số lượng | Tỷ lệ |
|---|:---:|:---:|
| **Tổng số Test Cases** | 12 | 100% |
| **Do AI tự động sinh (AI-Generated)** | 9 | 75.00% |
| **Do Sinh viên bổ sung (Student-Added)** | 3 | 25.00% |
| **Pass (Đạt)** | 6 | 50.00% |
| **Fail (Không đạt)** | 6 | 50.00% |
| **Untested (Chưa chạy)** | 0 | 0% |

---

## 5. Phân tích các Checklist Items do Sinh viên bổ sung (Lý do AI bỏ sót)

Trong quá trình rà soát bộ Checklist do AI khởi tạo ban đầu, sinh viên đã phát hiện AI bỏ sót 3 tiêu chí kiểm thử quan trọng và đã tiến hành bổ sung trực tiếp:

1. **GUI-ADM-CAT-005 — Thứ tự phím Tab (Keyboard Tab Order / Accessibility):**
   - **Vì sao AI bỏ sót:** AI Agent chủ yếu phân tích cú pháp HTML/CSS tĩnh và quét trực quan bố cục cơ bản theo Prompt đầu vào. AI không tự giác mô phỏng hành vi điều hướng bằng phím Tab (Keyboard Navigation) của người dùng khuyết tật và thiếu khả năng đánh giá tiêu chuẩn Accesibility (WCAG 2.1 Focus Order) nếu không được yêu cầu cụ thể trong Prompt.
2. **GUI-ADM-CAT-011 — Giao diện danh sách trống (Empty State UI / Edge Feedback):**
   - **Vì sao AI bỏ sót:** AI Agent thực thi kiểm thử trên môi trường đã có sẵn dữ liệu danh mục mẫu (Positive Data Flow). AI không tự động thiết lập trạng thái cơ sở dữ liệu rỗng (Zero-Data State) để kiểm tra giao diện phản hồi khi dữ liệu trống nếu không được chỉ định kịch bản ranh giới dữ liệu trong Prompt.
3. **GUI-ADM-CAT-012 — Tự động loại bỏ khoảng trắng thừa (Input Trim Validation / Passed):**
   - **Vì sao AI bỏ sót:** AI Agent khi quét cấu trúc HTML JSX chỉ phân tích thuộc tính ô nhập tĩnh (`<input type="text">`), không tự soi sâu vào handler xử lý sự kiện JavaScript/React `handleSubmit` để phát hiện logic `categoryName.trim()` chuẩn hóa chuỗi dữ liệu nếu không được yêu cầu test ranh giới nhập liệu (Boundary Input Validation) trong Prompt.
