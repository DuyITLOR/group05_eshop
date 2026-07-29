# GUI Testing Report - Trang Thanh Toán (Checkout)

## 1. Test Target (Đối tượng kiểm thử)
- **Giao diện được kiểm thử (UI):** Trang Thanh toán (`Checkout.jsx`).
- **Mục đích:** Kiểm tra sự tuân thủ của giao diện Thanh toán so với Đặc tả Yêu cầu Hệ thống EShop (Mục 4: FR-08, FR-09 & Mục 8: Yêu cầu Giao diện FR-21 đến FR-24).

## 2. Environment (Môi trường kiểm thử)

| Thông số | Chi tiết | Ghi chú / Ý nghĩa |
|---|---|---|
| **Thiết bị (Device)** | Laptop | Thiết bị phần cứng dùng để kiểm tra thực tế giao diện. |
| **Hệ điều hành (OS)** | Windows 11 | GUI có thể render phông chữ và scrollbar khác nhau trên Win/Mac. |
| **Trình duyệt (Browser)** | Google Chrome (Phiên bản mới nhất) | Đảm bảo tính tương thích của CSS, HTML5. |
| **Độ phân giải màn hình** | 1920x1080 (Desktop chuẩn) | Kiểm tra layout ở màn hình ngang rộng. |
| **Kích thước cửa sổ (Viewport)**| Fullscreen (Toàn màn hình) | Kích thước hiển thị thực tế của website. |
| **Môi trường Server** | Localhost (Vite port 5173 / Node port 3000) | Môi trường triển khai Frontend & Backend API. |
| **Công cụ / Phương pháp** | Manual Testing kết hợp Code Inspection | Kiểm tra bằng mắt thường (Manual) và soi mã nguồn React. |

---

## 3. GUI Checklist & Results

### IA01: General UI standards (Tiêu chuẩn Giao diện Chung)
*Kiểm tra ngôn ngữ, màu sắc, tiêu đề trang, định dạng hiển thị và các tiêu chuẩn cơ bản.*

| ID | Check item | Expected result | Results | Notes |
|---|---|---|---|---|
| GUI-CHK-001 | Thẻ tiêu đề trang (H1) | Trang có đúng 1 thẻ `<h1>` mô tả rõ nội dung trang (ví dụ: "Thanh toán" hoặc "Xác Nhận Đơn Hàng"). | Failed | Trang đang sử dụng thẻ `<h2>` thay vì `<h1>`. |
| GUI-CHK-002 | Hiển thị & nhập Tổng tiền thanh toán | Tổng tiền được tính tự động từ giỏ hàng, hiển thị định dạng đơn vị `₫` phân cách hàng nghìn và không cho sửa trực tiếp. | Failed | Cho phép chỉnh sửa tổng tiền trực tiếp qua ô input `type="number"` và nhãn ghi `(VND)` thay vì dùng đơn vị `₫` phân cách hàng nghìn. |
| GUI-CHK-003 | Màu sắc nút "Xác Nhận Thanh Toán" | Các nút hành động tích cực chính được hiển thị bằng màu xanh dương (`bg-blue-600`). | Failed | Nút "Xác Nhận Thanh Toán" đang dùng màu xanh lá (`bg-green-600`). |
| GUI-CHK-004 | Định dạng tiền tệ đơn hàng | Giá tiền của các sản phẩm trong đơn và tổng thanh toán hiển thị đơn vị `₫` phân cách hàng nghìn. | Passed | Các số tiền đã được định dạng bằng `.toLocaleString()` kèm ký hiệu `₫`. |
| GUI-CHK-005 | Sự nhất quán ngôn ngữ | Toàn bộ giao diện trang Thanh toán sử dụng 100% tiếng Việt. | Passed | Toàn bộ nhãn, thông báo và nút bấm đều sử dụng tiếng Việt. |
| GUI-CHK-006 | Thứ tự phím Tab (Tab Order) | Phím Tab chuyển focus qua các thành phần tương tác theo thứ tự từ trên xuống dưới, trái sang phải hợp lý. | Passed | Thứ tự tab trên DOM đi qua các ô nhập và nút bấm theo thứ tự tuyến tính hợp lý. |

### IA02: Forms (Yêu cầu về Biểu mẫu và Ô nhập liệu)
*Kiểm tra các thành phần nhập liệu, form điều chỉnh.*

| ID | Check item | Expected result | Results | Notes |
|---|---|---|---|---|
| GUI-CHK-007 | Ký hiệu trường bắt buộc | Tất cả các trường thông tin/nhập liệu bắt buộc phải có ký hiệu `*` bên cạnh nhãn. | Failed | Không có ký hiệu `*` đánh dấu các trường bắt buộc trên giao diện. |
| GUI-CHK-008 | Vị trí thông báo lỗi | Thông báo lỗi khi thực hiện thao tác phải hiển thị phía trên nút submit, không dùng alert bật lên. | Failed | Lỗi thanh toán dùng `alert()` của trình duyệt và lỗi áp dụng coupon xuất hiện bên dưới khung nhập liệu. |

### IA03: Navigation (Yêu cầu về Điều hướng)
*Kiểm tra thanh điều hướng, menu, link liên kết và vị trí người dùng.*

| ID | Check item | Expected result | Results | Notes |
|---|---|---|---|---|
| GUI-CHK-009 | Hiển thị breadcrumb | Trang Thanh toán phải hiển thị thanh điều hướng Breadcrumb (ví dụ: Trang chủ > Giỏ hàng > Thanh toán). | Failed | Trang Thanh toán hoàn toàn thiếu thành phần Breadcrumb. |
| GUI-CHK-010 | Highlight Navbar menu | Thanh điều hướng (Navbar) phải highlight trang/route đang được chọn. | Failed | Link hoặc menu không có trạng thái highlight khi người dùng truy cập trang Thanh toán. |

### IA04: Feedback / state (Phản hồi & Trạng thái UI)
*Kiểm tra các thay đổi trạng thái, thông báo tương tác, hiển thị ảnh và xử lý dữ liệu trống.*

| ID | Check item | Expected result | Results | Notes |
|---|---|---|---|---|
| GUI-CHK-011 | Giao diện Thanh toán thành công | Màn hình thông báo thành công có tiêu đề `<h1>` chuẩn và icon/hình ảnh minh họa trực quan. | Failed | Đang dùng thẻ `<h2>` cho tiêu đề thành công và hoàn toàn thiếu icon/hình minh họa. |
| GUI-CHK-012 | Hiển thị ảnh sản phẩm & thẻ `alt` | Danh sách tóm tắt đơn hàng hiển thị ảnh thumbnail sản phẩm kèm thuộc tính `alt` mô tả. | Failed | Tóm tắt đơn hàng chỉ hiển thị text dạng danh sách `<ul>`, không hiển thị ảnh sản phẩm. |
| GUI-CHK-013 | Trạng thái Loading trên nút bấm | Nút bấm hiển thị trạng thái loading rõ ràng và bị vô hiệu hóa khi hệ thống đang xử lý request. | Passed | Nút hiển thị 'Đang xử lý...' và áp dụng `disabled` trong lúc gửi API request. |

---

## 4. Test Summary (Tổng kết)

| Hạng mục | Số lượng | Tỷ lệ |
|---|:---:|:---:|
| **Tổng số Test Cases** | 13 | 100% |
| **Pass (Đạt)** | 4 | 30.77% |
| **Fail (Không đạt)** | 9 | 69.23% |
| **Untested (Chưa chạy)** | 0 | 0% |
