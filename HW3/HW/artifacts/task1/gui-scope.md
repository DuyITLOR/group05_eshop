# GUI Scope — Admin Order Management

## 1. Trạng thái tài liệu

- Phase: `scope`
- Primary screen được yêu cầu: `Admin Order Management`
- Supporting screens được yêu cầu: `Admin Dashboard`, `Order Detail`, `Update Order Status`
- User role: `admin`
- SUT được đối chiếu: `D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-eshop-sut`
- Phương pháp: đọc đặc tả API, README, frontend admin và backend liên quan
- Mức bằng chứng: phân tích tĩnh; chưa chạy SUT và chưa ghi Passed/Failed
- Human review: `Pending`

## 2. Nguồn đã kiểm tra

| Nguồn | Vị trí chính | Nội dung xác nhận |
| --- | --- | --- |
| `README.md` của SUT | dòng 141–162 | FR-10 và state machine của đơn hàng |
| `README.md` của SUT | dòng 174–184 | FR-12 Access Control và FR-13 Dashboard |
| `README.md` của SUT | dòng 218–222 | FR-18 Admin xem toàn bộ đơn, đổi trạng thái, hiển thị địa chỉ an toàn |
| `api_specification.md` | dòng 129–136 | Checkout tạo đơn với tổng tiền và địa chỉ giao hàng |
| `api_specification.md` | dòng 171–182 | API Admin yêu cầu token/quyền admin; danh sách đơn và cập nhật trạng thái |
| `frontend-admin/src/App.jsx` | dòng 34–93 | Nạp dữ liệu, xử lý token, đăng nhập và cập nhật trạng thái |
| `frontend-admin/src/App.jsx` | dòng 162–292 | Nhãn/màu trạng thái, sidebar và Dashboard |
| `frontend-admin/src/App.jsx` | dòng 777–877 | Bảng Quản lý Đơn hàng và các action theo trạng thái |
| `backend/server.js` | dòng 510–568 | API danh sách đơn và kiểm tra chuyển trạng thái |
| `backend/database.js` | dòng 73–81 | Cấu trúc dữ liệu đơn hàng |

Các nhóm IA dùng trong tài liệu này lấy theo workflow HW03:

- `IA-01`: General UI standards
- `IA-02`: Forms
- `IA-03`: Navigation
- `IA-04`: Feedback / state

## 3. Ranh giới screen đã xác nhận

| Tên trong yêu cầu | Kết luận từ SUT | Phạm vi được dùng |
| --- | --- | --- |
| Admin Order Management | Có thật dưới tab `Đơn hàng` với tiêu đề `Quản lý Đơn hàng` | Primary screen |
| Admin Dashboard | Có thật dưới tab `Dashboard` | Supporting screen |
| Order Detail | Không có route, modal, trang hoặc selected-order state riêng trong frontend admin | Chỉ dùng row-level order summary trong bảng; không coi là màn hình riêng |
| Update Order Status | Không có màn hình/form riêng | Dùng inline action group trong mỗi order row |
| Admin Login | Có thật nhưng không nằm trong supporting screens được yêu cầu | Chỉ dùng làm precondition/access-control boundary |

Không đưa Product, Category, Coupon hoặc User Management vào scope này.

## 4. User role và precondition chung

### User role

- Dùng tài khoản có `role = 'admin'`.
- Yêu cầu JWT hợp lệ theo FR-12 và API specification.
- Không dùng hoặc ghi thông tin đăng nhập vào artifact.

### Môi trường

- Backend được đặc tả tại `http://localhost:3000`.
- Web Admin được đặc tả tại `http://localhost:5174`.
- Yêu cầu backend và frontend admin đang chạy, kết nối được với cùng dữ liệu SUT.

### Dữ liệu nền

- Chuẩn bị ít nhất một đơn cho mỗi trạng thái: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`.
- Tạo đơn ban đầu qua checkout hợp lệ; checkout tạo đơn ở trạng thái `pending`.
- Chuẩn bị order có `id`, `user_name`, `total_amount`, `shipping_address`, `status`.
- Chuẩn bị tập dữ liệu gồm nhiều người đặt và nhiều mức tổng tiền để kiểm tra bảng và Dashboard.
- Chuẩn bị một địa chỉ văn bản thông thường và một chuỗi HTML-like vô hại, ví dụ `<b>Địa chỉ thử</b>`, để kiểm tra yêu cầu hiển thị địa chỉ dưới dạng an toàn.
- Không giả định database đã có order seed; block seed đã kiểm tra không tạo đơn hàng.

## 5. Component, action, state, precondition, test data và FR/IA

| ID | Surface | Component | User action / observation | UI state | Precondition | Test data | FR | IA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SCOPE-01 | Admin Login boundary | Email input, password input, Login button | Đăng nhập vào Web Admin | normal, error, success | Backend hoạt động; chưa có admin token | Tài khoản admin hợp lệ; tài khoản non-admin; thông tin không hợp lệ | FR-12 | IA-02, IA-04 |
| SCOPE-02 | Global admin shell | Sidebar `Dashboard` | Chọn Dashboard | normal, selected | Đã xác thực admin | Admin token hợp lệ | FR-12, FR-13 | IA-01, IA-03 |
| SCOPE-03 | Global admin shell | Sidebar `Đơn hàng` | Chọn Quản lý Đơn hàng | normal, selected | Đã xác thực admin | Admin token hợp lệ | FR-12, FR-18 | IA-01, IA-03 |
| SCOPE-04 | Global admin shell | Token/session handling | Quan sát khi token hết hạn hoặc bị từ chối | error | Đang ở Web Admin | Token hết hạn/không hợp lệ | FR-12 | IA-04 |
| SCOPE-05 | Admin Dashboard | Revenue card | Đọc tổng doanh thu delivered | normal, empty | Đã nạp danh sách order | Không có order; delivered và non-delivered orders | FR-13 | IA-01, IA-04 |
| SCOPE-06 | Admin Dashboard | Order-count card | Đọc tổng số đơn hàng | normal, empty | Đã nạp danh sách order | 0, 1 và nhiều orders | FR-13 | IA-01, IA-04 |
| SCOPE-07 | Admin Order Management | Page title và order table | Nhận biết đúng trang và cấu trúc bảng | normal | Chọn tab `Đơn hàng` | Ít nhất một order | FR-18 | IA-01, IA-03 |
| SCOPE-08 | Admin Order Management | Table body | Quan sát danh sách toàn bộ đơn | normal, empty | API danh sách đơn trả về | Orders của nhiều users; danh sách rỗng | FR-18 | IA-01, IA-04 |
| SCOPE-09 | Row-level order summary | ID cell | Đọc mã đơn | normal | Có order | ID đơn hợp lệ | FR-18 | IA-01 |
| SCOPE-10 | Row-level order summary | `Người đặt` cell | Đọc tên người đặt | normal | Order được join với user | User có tên; dữ liệu tên thiếu để quan sát fallback thực tế | FR-18 | IA-01 |
| SCOPE-11 | Row-level order summary | `Tổng tiền` cell | Đọc số tiền định dạng theo locale và ký hiệu ₫ | normal, boundary | Có order | 0; số tiền nhỏ; số tiền lớn | FR-18 | IA-01 |
| SCOPE-12 | Row-level order summary | `Địa chỉ` cell | Đọc địa chỉ giao hàng | normal, security-sensitive | Có order | Địa chỉ thường; rỗng; chuỗi HTML-like vô hại | FR-18 | IA-01, IA-04 |
| SCOPE-13 | Row-level order summary | Status badge | Đọc nhãn trạng thái tiếng Việt và màu phân biệt | normal, success | Có order | Cả 5 trạng thái | FR-10, FR-18 | IA-01, IA-04 |
| SCOPE-14 | Inline status update | `Xác nhận` button | Chuyển `pending → confirmed` | normal, success, error | Order đang pending | Pending order ID | FR-10, FR-18 | IA-02, IA-04 |
| SCOPE-15 | Inline status update | `Hủy` button của pending order | Chuyển `pending → canceled` | normal, success, error | Order đang pending | Pending order ID | FR-10, FR-18 | IA-02, IA-04 |
| SCOPE-16 | Inline status update | `Giao hàng` button | Chuyển `confirmed → shipping` | normal, success, error | Order đang confirmed | Confirmed order ID | FR-10, FR-18 | IA-02, IA-04 |
| SCOPE-17 | Inline status update | `Hủy` button của confirmed order | Chuyển `confirmed → canceled` | normal, success, error | Order đang confirmed | Confirmed order ID | FR-10, FR-18 | IA-02, IA-04 |
| SCOPE-18 | Inline status update | `Hoàn thành` button | Chuyển `shipping → delivered` | normal, success, error | Order đang shipping | Shipping order ID | FR-10, FR-18 | IA-02, IA-04 |
| SCOPE-19 | Inline status update | Action area của delivered order | Xác nhận không còn chuyển trạng thái | final state | Order đang delivered | Delivered order ID | FR-10, FR-18 | IA-04 |
| SCOPE-20 | Inline status update | Action area của canceled order | Xác nhận không còn chuyển trạng thái theo đặc tả | final state | Order đang canceled | Canceled order ID | FR-10, FR-18 | IA-04 |
| SCOPE-21 | Inline status update | Error alert | Đọc lỗi cập nhật trạng thái | error | API trả lỗi | Chuyển trạng thái không hợp lệ hoặc order không còn tồn tại | FR-10, FR-18 | IA-04 |
| SCOPE-22 | Admin Order Management | Data refresh sau update | Quan sát row và Dashboard nhận dữ liệu mới | success | API cập nhật thành công | Một order cho mỗi chuyển đổi hợp lệ | FR-10, FR-13, FR-18 | IA-04 |
| SCOPE-23 | Admin Order Management | Order table layout | Quan sát bảng ở viewport hẹp/rộng | normal, responsive | Có nhiều rows và chuỗi dài | Tên dài, địa chỉ dài, tổng tiền lớn | FR-18 | IA-01 |
| SCOPE-24 | Admin Order Management | Navigation + action controls | Điều hướng và thao tác bằng bàn phím, quan sát focus | normal, accessibility | Đã xác thực admin | Không phụ thuộc dữ liệu đặc biệt | FR-18 | IA-01, IA-03 |

## 6. Ma trận trạng thái giao diện

| State | Bằng chứng triển khai | Cách giữ trong scope |
| --- | --- | --- |
| `normal` | Dashboard, sidebar, table, badges và action buttons được render | Bao phủ đầy đủ |
| `loading` | Không tìm thấy loading state hoặc loading indicator riêng cho `fetchData()` | Ghi là coverage cần kiểm tra; không khẳng định có UI loading |
| `empty` | `orders = []` làm table body không có row; không thấy empty-state message riêng | Kiểm tra hành vi table rỗng, không suy đoán thông báo |
| `error` | 401/403 xóa token; update status hiển thị alert lỗi; lỗi fetch khác không có UI được xác nhận | Bao phủ access error và update error; ghi rõ giới hạn |
| `success` | Update thành công gọi lại `fetchData()`; không thấy success message riêng | Kiểm tra dữ liệu refresh; không giả định toast thành công |
| `disabled` | Không thấy thuộc tính disabled cho action order; action hợp lệ được hiện/ẩn theo status | Kiểm tra action availability, không tạo disabled control giả |
| `final` | FR-10 quy định delivered và canceled là final states | Bao phủ cả hai trạng thái kết thúc |

## 7. Ánh xạ FR sang IA

| FR | Yêu cầu được xác nhận | IA chính | Lý do |
| --- | --- | --- | --- |
| FR-10 | State machine, final states và lỗi chuyển trạng thái | IA-04 | Trạng thái, feedback và tính nhất quán sau action |
| FR-10 | Action chuyển trạng thái qua các button inline | IA-02 | Control nhận thao tác cập nhật dữ liệu |
| FR-12 | Chỉ admin có quyền truy cập | IA-02, IA-04 | Login input và phản hồi khi quyền/token không hợp lệ |
| FR-12 | Điều hướng trong admin shell | IA-03 | Truy cập đúng Dashboard và Orders |
| FR-13 | Hiển thị tổng doanh thu delivered và tổng số đơn | IA-01, IA-04 | Trình bày số liệu và trạng thái dữ liệu |
| FR-18 | Danh sách toàn bộ đơn và row-level summary | IA-01 | Bảng, format, nhãn và khả năng đọc |
| FR-18 | Điều hướng tới tab Đơn hàng | IA-03 | Sidebar navigation và selected state |
| FR-18 | Cập nhật trạng thái và hiển thị địa chỉ an toàn | IA-02, IA-04 | Action, phản hồi và trạng thái dữ liệu |

## 8. Chênh lệch đặc tả–mã cần giữ làm risk, chưa kết luận runtime

| Risk ID | Đặc tả | Mã đã đọc | Ảnh hưởng đến phase sau |
| --- | --- | --- | --- |
| RISK-01 | FR-10 quy định `canceled` là final state | Frontend có button `Đánh dấu Đã giao` cho canceled order; backend cho phép `canceled → delivered` | Phase `generate` phải có item kiểm tra final-state consistency; chỉ phase `execute` mới kết luận Passed/Failed |
| RISK-02 | FR-13 chỉ cộng `total_amount` của delivered orders | Frontend tính delivered revenue bằng `total_amount * 2` | Thêm item kiểm tra số liệu Dashboard với expected result từ FR-13 |
| RISK-03 | FR-18 yêu cầu hiển thị địa chỉ an toàn, không render HTML | Frontend dùng `dangerouslySetInnerHTML` cho shipping address | Thêm item an toàn hiển thị bằng chuỗi HTML-like vô hại; chưa tuyên bố exploit/runtime result |
| RISK-04 | FR-12 yêu cầu API Admin kiểm tra `role = 'admin'` | Hai endpoint order đã đọc chỉ gắn `authenticateToken`; chưa thấy role guard tại route | Giữ access-control test trong scope; không kết luận quyền thực tế nếu chưa chạy |

## 9. Đánh giá độ rộng scope

- Scope có đủ nguồn để chuyển sang phase `generate`.
- Có thể tạo hơn 40 item có ý nghĩa nếu phân bổ cho IA-01 đến IA-04, access boundary, Dashboard, order table, năm trạng thái, transition actions, error/empty/loading, accessibility và responsive layout.
- Không được tăng số item bằng cách coi `Order Detail` và `Update Order Status` là hai màn hình riêng.
- Không được tạo item cho search, filter, sort, pagination, modal chi tiết, confirmation dialog hoặc bulk action vì các chức năng này chưa được xác nhận.

## 10. Quyết định scope cần Human Review

- Chấp nhận `Order Detail` là row-level summary thay vì màn hình riêng.
- Chấp nhận `Update Order Status` là inline action group thay vì màn hình riêng.
- Xác nhận checkout `Hcmus-Software_Testing-eshop-sut` là đúng SUT của HW03.
- Xác nhận dùng các risk đặc tả–mã làm nguồn cho checklist candidate, không coi chúng là kết quả thực thi.

Review status: `Pending`
