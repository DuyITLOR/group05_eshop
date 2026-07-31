# GUI Testing Report - EShop

## 1. Test Target (Đối tượng kiểm thử)
- **Giao diện được kiểm thử (UI):** Trang Giỏ hàng (Shopping Cart).
- **Mục đích:** Kiểm tra sự tuân thủ của giao diện giỏ hàng so với Đặc tả Yêu cầu Hệ thống EShop (Mục 8: Yêu cầu Giao diện).

## 2. Environment (Môi trường kiểm thử)
*Đối với GUI testing, môi trường đóng vai trò cực kỳ quan trọng để đảm bảo giao diện hiển thị đúng, không bị vỡ layout trên các nền tảng và thiết bị khác nhau. Dưới đây là cấu hình môi trường được sử dụng cho đợt test này:*

| Thông số | Chi tiết | Ghi chú / Ý nghĩa |
|---|---|---|
| **Thiết bị (Device)** | Laptop | Thiết bị phần cứng dùng để kiểm tra thực tế giao diện. |
| **Hệ điều hành (OS)** | Windows 11 | GUI có thể render phông chữ và scrollbar khác nhau trên Win/Mac. |
| **Trình duyệt (Browser)** | Google Chrome (Phiên bản mới nhất) | Đảm bảo tính tương thích của CSS, HTML5. |
| **Độ phân giải màn hình** | 1920x1080 (Desktop chuẩn) | Kiểm tra layout ở màn hình ngang rộng. |
| **Kích thước cửa sổ (Viewport)**| Fullscreen (Toàn màn hình) | Kích thước hiển thị thực tế của website. |
| **Môi trường Server** | Localhost | Frontend (Vite) ở port 5173. |
| **Công cụ / Phương pháp** | Manual Testing kết hợp Code Inspection | Kiểm tra bằng mắt thường (Manual) và soi mã nguồn React. |

---

## 3. GUI Checklist & Results

### IA01: General UI standards (Tiêu chuẩn Giao diện Chung)
*Kiểm tra ngôn ngữ, màu sắc, tiêu đề trang, định dạng hiển thị và các tiêu chuẩn cơ bản.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-CART-001 | Thẻ tiêu đề trang (H1) | Trang có đúng 1 thẻ `<h1>` mô tả rõ nội dung trang (ví dụ: "Giỏ hàng"). | Failed | AI Generated | Đang dùng thẻ `<h2>` thay vì `<h1>`. |
| GUI-CART-002 | Tiêu đề các cột bảng sản phẩm | Bảng danh sách hiển thị đầy đủ các cột: **Sản phẩm**, **Đơn giá**, **Số lượng**, **Thành tiền**, **Thao tác**. | Failed | AI Generated | Dùng tiêu đề cột là "Giá" thay vì "Đơn giá". |
| GUI-CART-003 | Định dạng tiền tệ | Toàn bộ giá tiền (Đơn giá, Thành tiền, Tổng cộng) đều dùng đơn vị `₫` và có định dạng phân cách hàng nghìn. | Passed | AI Generated | Các số tiền đã được format bằng `.toLocaleString()` và có ký hiệu `₫`. |
| GUI-CART-004 | Màu sắc nút "Xóa sản phẩm" | Nút thao tác "Xóa sản phẩm" hiển thị màu đỏ (chuẩn cho hành động nguy hiểm/hủy bỏ). | Passed | AI Generated | Dùng class `text-red-500` đúng chuẩn. |
| GUI-CART-005 | Nhãn tính tổng tiền | Hiển thị chính xác nhãn là **"Tổng cộng"** (không được dùng từ "Tổng tạm tính"). | Failed | AI Generated | Nhãn hiển thị đang là "Tổng tạm tính:" thay vì "Tổng cộng:". |
| GUI-CART-006 | Màu sắc nút thao tác chính | Các nút hành động tích cực (Ví dụ: "Tiến hành thanh toán") được hiển thị bằng màu xanh dương. | Failed | AI Generated | Nút "Tiến hành thanh toán" đang có màu xanh lá (`bg-green-500`). |
| GUI-CART-007 | Thứ tự phím Tab (Tab Order) | Dùng phím Tab chuyển focus qua các thành phần tương tác theo thứ tự từ trên xuống dưới, trái sang phải hợp lý. | Passed | **Student Added** | Thứ tự HTML cơ bản hợp lý (tab qua các link, nút, xoá). |
| GUI-CART-008 | Sự nhất quán ngôn ngữ | Toàn bộ giao diện trang Giỏ hàng sử dụng 100% tiếng Việt. | Passed | AI Generated | Toàn bộ các thông báo, nhãn, nút đều dùng tiếng Việt. |

### IA02: Forms (Yêu cầu về Biểu mẫu và Ô nhập liệu)
*Kiểm tra các thành phần nhập liệu, form điều chỉnh.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-CART-009 | Nút điều chỉnh số lượng | Có nút `+` và `-` trực quan bên cạnh ô nhập để người dùng tăng/giảm số lượng sản phẩm. | Failed | AI Generated | Cột số lượng chỉ hiện text tĩnh (`item.quantity`), không có ô nhập liệu và nút tăng/giảm. |

### IA03: Navigation (Yêu cầu về Điều hướng)
*Kiểm tra thanh điều hướng, menu, link liên kết và vị trí người dùng.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-CART-010 | Hiển thị breadcrumb | Breadcrumb được hiển thị rõ ràng trên trang Giỏ hàng để định vị vị trí. | Failed | AI Generated | Không có component breadcrumb nào trên trang. |
| GUI-CART-011 | Highlight Navbar menu | Menu hoặc link "Giỏ hàng" trên thanh điều hướng được highlight khi đang xem trang này. | Failed | AI Generated | Link ở Navbar không có trạng thái highlight khi đang active. |
| GUI-CART-012 | Badge giỏ hàng (Navbar) | Link "Giỏ hàng" trên header hiển thị badge báo hiệu tổng số lượng sản phẩm. | Failed | AI Generated | Chỉ có text "Giỏ hàng", không hiển thị số lượng (badge). |
| GUI-CART-013 | Nút "Tiếp tục mua sắm" | Hiển thị rõ nút "Tiếp tục mua sắm", khi bấm vào sẽ quay về trang chủ. | Failed | AI Generated | Nhãn nút đang là "← Mua tiếp", không phải "Tiếp tục mua sắm". |

### IA04: Feedback / state (Phản hồi & Trạng thái UI)
*Kiểm tra các thay đổi trạng thái, thông báo tương tác, hiển thị ảnh và xử lý dữ liệu trống.*

| ID | Check item | Expected result | Results | Nguồn gốc | Notes |
|---|---|---|---|---|---|
| GUI-CART-014 | Hiển thị ảnh sản phẩm và thẻ `alt` | Ảnh sản phẩm được hiển thị rõ ràng và bắt buộc có thuộc tính `alt` mô tả nội dung ảnh (không rỗng). | Failed | **Student Added** | Không có hình ảnh sản phẩm (cột sản phẩm chỉ hiển thị text). |
| GUI-CART-015 | Hộp thoại xác nhận khi xóa | Khi nhấn "Xóa", hiển thị một Dialog yêu cầu người dùng xác nhận trước khi xóa mục khỏi giỏ. | Failed | AI Generated | Không có Dialog xác nhận, bấm là bị xóa ngay. |
| GUI-CART-016 | Giao diện giỏ hàng trống (Empty State) | Hiển thị thông báo rõ ràng, thân thiện kèm theo hình minh họa/icon khi giỏ hàng không có sản phẩm. | Failed | **Student Added** | Có text thân thiện ("Giỏ hàng của bạn đang trống") nhưng hoàn toàn thiếu hình ảnh/icon minh họa. |

---

## 4. Test Summary (Tổng kết)

| Hạng mục | Số lượng | Tỷ lệ |
|---|:---:|:---:|
| **Tổng số Test Cases** | 16 | 100% |
| **Do AI tự động sinh (AI-Generated)** | 13 | 81.25% |
| **Do Sinh viên bổ sung (Student-Added)** | 3 | 18.75% |
| **Pass (Đạt)** | 4 | 25% |
| **Fail (Không đạt)** | 12 | 75% |
| **Untested (Chưa chạy)** | 0 | 0% |

---

## 5. Phân tích các Checklist Items do Sinh viên bổ sung (Lý do AI bỏ sót)

Trong quá trình đánh giá độc lập bộ Checklist của AI, sinh viên đã chỉ ra 3 thiếu sót quan trọng và chủ động bổ sung:

1. **GUI-CART-007 — Thứ tự phím Tab (Keyboard Focus & Accessibility):**
   - **Vì sao AI bỏ sót:** AI Agent kiểm tra mã nguồn theo tư duy quét các thẻ tương tác độc lập (`<button>`, `<a>`), không tự giác thử nghiệm chuỗi điều hướng bằng phím Tab (Keyboard Navigation Flow) dành cho người dùng hỗ trợ tiếp cận (A11y).
2. **GUI-CART-014 — Thuộc tính `alt` của Hình ảnh sản phẩm (Screen Reader Accessibility):**
   - **Vì sao AI bỏ sót:** AI Agent chủ yếu soi các đoạn text hiển thị trực tiếp cho thị giác (`item.name`, `item.price`), dễ bỏ sót các thuộc tính ẩn HTML như `alt="..."` dùng cho công cụ đọc màn hình (Screen Reader) do Prompt không chỉ định rõ tiêu chuẩn WCAG A11y.
3. **GUI-CART-016 — Giao diện Giỏ hàng trống (Empty State UI / Zero-Data Edge Case):**
   - **Vì sao AI bỏ sót:** AI truy cập trang giỏ hàng sau khi đã thực hiện kịch bản thêm sản phẩm vào giỏ (Positive Test Flow). AI bị hạn chế trong việc tự động làm rỗng giỏ hàng (Clear LocalStorage / Cart State) để kiểm tra giao diện Empty State nếu không được hướng dẫn riêng trong Prompt.
