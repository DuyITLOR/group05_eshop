# Design Report DTT: FR-09 - Mã Giảm Giá (Coupon)

## 1. Phạm vi kiểm thử

Thiết kế test theo Decision Table Testing cho chức năng áp dụng mã giảm giá tại bước Checkout của FR-09.

- Người dùng nhập mã giảm giá tại Checkout.
- Hệ thống chỉ áp dụng mã khi cả 5 điều kiện C1-C5 đều thỏa mãn.
- Hệ thống tính đúng giảm giá theo loại `percent` hoặc `fixed`.
- Hệ thống không thay đổi tổng tiền và không ghi nhận lượt dùng khi bất kỳ điều kiện bắt buộc nào không thỏa mãn.
- Sau checkout thành công với coupon hợp lệ, hệ thống ghi nhận lượt dùng để ràng buộc `max_uses_per_user`.

## 2. Nguồn đầu vào và giả định

### 2.1 Nguồn đầu vào

| Nguồn | Nội dung sử dụng |
| --- | --- |
| `README.md` | SRS FR-09, 5 điều kiện C1-C5, công thức giảm giá, dữ liệu coupon mẫu |
| `api_specification.md` | Endpoint `POST /api/apply-coupon`, cấu trúc phản hồi `discount_amount`, `final_amount` |
| `tests/test-cases/coupon-apply-EPBVA/Design-report.md` | EP/BVA companion report, dữ liệu test, boundary notes |
| `tests/e2e/fr09-coupon-apply.spec.js` | Gợi ý môi trường test và dữ liệu seed hiện có |

### 2.2 Giả định

- Ngày kiểm thử cố định là `2026-06-29` theo môi trường hiện tại.
- User hợp lệ: `test@eshop.com` / `Test1234!`.
- Backend chạy tại `http://localhost:3000`, frontend web chạy tại `http://localhost:5173`.
- Mỗi test reset `coupon_usage` hoặc chuẩn bị số lượt dùng đúng theo precondition.
- Kỳ vọng được viết theo SRS, không theo bug/hành vi hiện tại của implementation.
- SRS không quy định mã lỗi hoặc message chính xác, nên expected result chỉ yêu cầu nhóm lỗi đúng và trạng thái không bị thay đổi sai.
- Ưu tiên lỗi dùng cho bảng quyết định:
  1. C4: JWT không hợp lệ hoặc thiếu JWT.
  2. C1: Mã không tồn tại hoặc inactive.
  3. C2: Mã hết hạn.
  4. C3: Tổng đơn hàng chưa đủ ngưỡng.
  5. C5: User đã dùng hết lượt.
  6. Thành công, tính theo loại `percent` hoặc `fixed`.
- Khi C4 fail, hệ thống không được tiết lộ mã có tồn tại, hết hạn, thiếu ngưỡng hay hết lượt hay không.

## 3. Mục tiêu quyết định

Mục tiêu của bảng quyết định là xác định hệ thống phải:

- Từ chối áp dụng coupon với nguyên nhân đúng khi một điều kiện bắt buộc không thỏa mãn.
- Áp dụng coupon và tính đúng `discount_amount`, `final_amount` khi C1-C5 đều đúng.
- Ghi nhận lượt dùng chỉ sau checkout thành công với coupon hợp lệ.

## 4. Condition/Action Catalog

### 4.1 Conditions

| ID | Điều kiện | Giá trị `Y` | Giá trị `N` |
| --- | --- | --- | --- |
| C1 | Mã tồn tại và active | Coupon có trong CSDL và `is_active = 1` | Mã rỗng, không tồn tại hoặc inactive |
| C2 | Còn hạn sử dụng | Ngày hiện tại trước `expired_at` | Ngày hiện tại bằng hoặc sau `expired_at` |
| C3 | Đủ ngưỡng đơn hàng | `total_amount >= min_order_amount` | `total_amount < min_order_amount` |
| C4 | JWT hợp lệ | Request có JWT hợp lệ của user | Thiếu JWT, JWT sai định dạng, JWT hết hạn hoặc không hợp lệ |
| C5 | Chưa dùng hết lượt | `usage_count < max_uses_per_user` | `usage_count >= max_uses_per_user` |
| C6 | Loại coupon | `percent` hoặc `fixed` khi C1-C5 đều `Y` | Không xét khi một điều kiện bắt buộc fail |

### 4.2 Actions

| ID | Action / Expected output |
| --- | --- |
| A1 | Từ chối xác thực, trả lỗi 401/403 hoặc lỗi auth tương đương; không tiết lộ trạng thái coupon |
| A2 | Từ chối do mã không hợp lệ hoặc inactive |
| A3 | Từ chối do mã đã hết hạn |
| A4 | Từ chối do tổng đơn hàng chưa đạt `min_order_amount` |
| A5 | Từ chối do user đã dùng hết lượt |
| A6 | Áp dụng coupon `percent`: `discount_amount = total_amount x discount_value / 100` |
| A7 | Áp dụng coupon `fixed`: `discount_amount = discount_value` |
| A8 | Sau checkout thành công, ghi nhận thêm 1 lượt dùng coupon cho user |
| A9 | Khi bị từ chối, `final_amount` không bị giảm và `coupon_usage` không tăng |

## 5. Full Decision Table

Ký hiệu: `Y` = điều kiện đúng, `N` = điều kiện sai, `-` = không xét vì rule đã đi đến action fail trước đó.

| Full Rule | C4 JWT | C1 Code active | C2 Chưa hết hạn | C3 Đủ ngưỡng | C5 Còn lượt | C6 Type | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FT_01 | N | N | N | N | N | - | A1 + A9 |
| FT_02 | N | N | N | N | Y | - | A1 + A9 |
| FT_03 | N | N | N | Y | N | - | A1 + A9 |
| FT_04 | N | N | N | Y | Y | - | A1 + A9 |
| FT_05 | N | N | Y | N | N | - | A1 + A9 |
| FT_06 | N | N | Y | N | Y | - | A1 + A9 |
| FT_07 | N | N | Y | Y | N | - | A1 + A9 |
| FT_08 | N | N | Y | Y | Y | - | A1 + A9 |
| FT_09 | N | Y | N | N | N | - | A1 + A9 |
| FT_10 | N | Y | N | N | Y | - | A1 + A9 |
| FT_11 | N | Y | N | Y | N | - | A1 + A9 |
| FT_12 | N | Y | N | Y | Y | - | A1 + A9 |
| FT_13 | N | Y | Y | N | N | - | A1 + A9 |
| FT_14 | N | Y | Y | N | Y | - | A1 + A9 |
| FT_15 | N | Y | Y | Y | N | - | A1 + A9 |
| FT_16 | N | Y | Y | Y | Y | - | A1 + A9 |
| FT_17 | Y | N | N | N | N | - | A2 + A9 |
| FT_18 | Y | N | N | N | Y | - | A2 + A9 |
| FT_19 | Y | N | N | Y | N | - | A2 + A9 |
| FT_20 | Y | N | N | Y | Y | - | A2 + A9 |
| FT_21 | Y | N | Y | N | N | - | A2 + A9 |
| FT_22 | Y | N | Y | N | Y | - | A2 + A9 |
| FT_23 | Y | N | Y | Y | N | - | A2 + A9 |
| FT_24 | Y | N | Y | Y | Y | - | A2 + A9 |
| FT_25 | Y | Y | N | N | N | - | A3 + A9 |
| FT_26 | Y | Y | N | N | Y | - | A3 + A9 |
| FT_27 | Y | Y | N | Y | N | - | A3 + A9 |
| FT_28 | Y | Y | N | Y | Y | - | A3 + A9 |
| FT_29 | Y | Y | Y | N | N | - | A4 + A9 |
| FT_30 | Y | Y | Y | N | Y | - | A4 + A9 |
| FT_31 | Y | Y | Y | Y | N | - | A5 + A9 |
| FT_32 | Y | Y | Y | Y | Y | percent | A6 + A8 |
| FT_33 | Y | Y | Y | Y | Y | fixed | A7 + A8 |

## 6. Simplified Decision Table

| Rule ID | C4 JWT | C1 Code active | C2 Chưa hết hạn | C3 Đủ ngưỡng | C5 Còn lượt | C6 Type | Actions | Full rules |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rule_01 | N | - | - | - | - | - | A1 + A9 | FT_01-FT_16 |
| Rule_02 | Y | N | - | - | - | - | A2 + A9 | FT_17-FT_24 |
| Rule_03 | Y | Y | N | - | - | - | A3 + A9 | FT_25-FT_28 |
| Rule_04 | Y | Y | Y | N | - | - | A4 + A9 | FT_29-FT_30 |
| Rule_05 | Y | Y | Y | Y | N | - | A5 + A9 | FT_31 |
| Rule_06 | Y | Y | Y | Y | Y | percent | A6 + A8 | FT_32 |
| Rule_07 | Y | Y | Y | Y | Y | fixed | A7 + A8 | FT_33 |

## 7. Simplification Review

- Rule_01 được gộp vì khi JWT fail, mọi trạng thái coupon phải trở thành don't-care và hệ thống không được tiết lộ thông tin coupon.
- Rule_02 được gộp vì mã không tồn tại, mã rỗng và inactive đều dẫn đến lỗi mã không hợp lệ; các điều kiện còn lại không nên làm thay đổi kết quả.
- Rule_03 giữ riêng vì expired là lỗi user-visible khác với thiếu ngưỡng hoặc hết lượt.
- Rule_04 giữ riêng vì tổng đơn hàng dưới `min_order_amount` là lỗi tính toán/ngưỡng riêng.
- Rule_05 giữ riêng vì usage limit liên quan persisted state và phải không bị gộp với lỗi validation khác.
- Rule_06 và Rule_07 không được gộp vì công thức `percent` và `fixed` khác nhau, dù các điều kiện C1-C5 đều đúng.
- A8 chỉ xuất hiện trong Rule_06 và Rule_07. Bất kỳ rule fail nào cũng phải đi kèm A9 để tránh ghi nhận usage sai.
- Không có combination bị loại là impossible trong bảng đầy đủ vì test data có thể chuẩn bị nhiều trạng thái fail cùng lúc để kiểm tra ưu tiên lỗi.

## 8. Pairwise Risk Resolution

Pairwise không được áp dụng cho deliverable này.

- Các vùng được đơn giản hóa đều có action ưu tiên rõ ràng và được giữ bằng test case DTT đại diện.
- Các miền numeric/date/count đã có EP/BVA companion suite bao phủ biên chính.
- Rủi ro security của Rule_01 được xử lý bằng 2 test case DTT: một case thiếu JWT với dữ liệu hợp lệ và một case JWT không hợp lệ kèm nhiều điều kiện coupon sai để kiểm tra không rò rỉ thông tin.

Pairwise Cluster ID cho toàn bộ test case: `N/A`.

## 9. DTT Test Cases

| Test case | Target Rule ID | Mục tiêu |
| --- | --- | --- |
| TC-FR09-DTT-001 | Rule_06 | Áp dụng coupon `percent` khi C1-C5 đều đúng và ghi nhận usage sau checkout |
| TC-FR09-DTT-002 | Rule_07 | Áp dụng coupon `fixed` khi C1-C5 đều đúng |
| TC-FR09-DTT-003 | Rule_01 | Từ chối khi thiếu JWT dù coupon hợp lệ |
| TC-FR09-DTT-004 | Rule_01 | Từ chối theo auth priority khi JWT sai và nhiều điều kiện coupon cũng sai |
| TC-FR09-DTT-005 | Rule_02 | Từ chối mã không tồn tại hoặc inactive |
| TC-FR09-DTT-006 | Rule_03 | Từ chối mã hết hạn |
| TC-FR09-DTT-007 | Rule_04 | Từ chối khi tổng đơn hàng chưa đủ ngưỡng |
| TC-FR09-DTT-008 | Rule_05 | Từ chối khi user đã dùng hết lượt |
| TC-FR09-DTT-009 | Rule_03 | Kiểm tra ưu tiên lỗi expired khi C2, C3, C5 cùng fail |

## 10. Traceability Matrix

| Yêu cầu FR-09 | Test case bao phủ |
| --- | --- |
| C1: Mã tồn tại và active | TC-FR09-DTT-001, TC-FR09-DTT-002, TC-FR09-DTT-005 |
| C2: Ngày hiện tại trước `expired_at` | TC-FR09-DTT-001, TC-FR09-DTT-002, TC-FR09-DTT-006, TC-FR09-DTT-009 |
| C3: Tổng đơn hàng `>= min_order_amount` | TC-FR09-DTT-001, TC-FR09-DTT-002, TC-FR09-DTT-007, TC-FR09-DTT-009 |
| C4: JWT hợp lệ | TC-FR09-DTT-001, TC-FR09-DTT-002, TC-FR09-DTT-003, TC-FR09-DTT-004 |
| C5: User chưa dùng hết lượt | TC-FR09-DTT-001, TC-FR09-DTT-002, TC-FR09-DTT-008, TC-FR09-DTT-009 |
| Công thức `percent` | TC-FR09-DTT-001 |
| Công thức `fixed` | TC-FR09-DTT-002 |
| Không giảm tiền khi fail | TC-FR09-DTT-003, TC-FR09-DTT-004, TC-FR09-DTT-005, TC-FR09-DTT-006, TC-FR09-DTT-007, TC-FR09-DTT-008, TC-FR09-DTT-009 |
| Ghi nhận usage sau checkout thành công | TC-FR09-DTT-001 |
| Ưu tiên lỗi và chống rò rỉ thông tin khi auth fail | TC-FR09-DTT-004 |

## 11. AI Gap Check

- Đã chuyển 5 điều kiện bắt buộc của FR-09 thành predicate rõ ràng C1-C5.
- Đã thêm C6 để giữ riêng công thức `percent` và `fixed`.
- Đã xây bảng đầy đủ có 33 rule, sau đó đơn giản hóa thành 7 rule có traceability.
- Đã giữ riêng các action user-visible/security-sensitive; không gộp expired, under-minimum và usage-limit.
- Đã thêm kiểm thử priority cho auth để tránh rò rỉ trạng thái coupon.
- Đã tránh nhân đôi toàn bộ EP/BVA; DTT tập trung vào rule/action và combination priority.
- Rủi ro còn lại: SRS không quy định exact HTTP status/message và không mô tả rõ thứ tự ưu tiên lỗi; báo cáo đã ghi assumption để reviewer xác nhận.
