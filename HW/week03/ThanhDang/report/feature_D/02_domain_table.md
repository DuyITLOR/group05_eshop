# STEP 2 — Domain Table: FR-07 Mobile Shopping Cart (feature_D)

---

## STEP 1 — Identify Input Fields

| # | Field Name | Required? | Source of Constraint | Related FR |
| --- | --- | --- | --- | --- |
| 1 | `quantity` (Product Detail — addToCart) | No (default 1) | `normalizeQuantity()`: parseInt > 0 → dùng; else → 1 | FR-07 |
| 2 | `quantity` (Cart Inline Edit) | No | `parseInt(text, 10)`: > 0 → parsed + 1 (BUG); else → 1 | FR-07 |
| 3 | `product` (addToCart — object input) | Yes | Phải có `id`, `name`, `price` để merge/thêm mới | FR-07 |
| 4 | Behavioral (Cart state operations) | N/A | Các thao tác trên cart array: thêm, xem, xóa, tổng tiền | FR-07 |

---

## STEP 2 — Domain Table

### Field 1: `quantity` (Product Detail — Add to Cart)

| Attribute | Detail |
| --- | --- |
| **Data Type** | String → parseInt (qua `normalizeQuantity()`) |
| **Required** | Không — nếu rỗng hoặc invalid → fallback 1 |
| **Min Value** | SPEC: 1. CODE: fallback 1 nếu ≤ 0 |
| **Max Value** | SPEC: không quy định. CODE: không giới hạn |
| **Default** | `""` (string rỗng) — state khởi tạo tại App.js:568 |
| **Validation** | `normalizeQuantity()`: parseInt > 0 → dùng; else → 1. Không hiển thị lỗi. |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-QA-V1 | Valid | Số dương bình thường | `"3"` | Happy path — thêm 3 sản phẩm |
| EC-QA-V2 | Valid | Số lượng = 1 (biên dưới hợp lệ) | `"1"` | Nhỏ nhất còn được chấp nhận |
| EC-QA-V3 | Valid | Số lượng lớn | `"999"` | Stress — không có upper limit |
| EC-QA-V4 | Valid | Không nhập (bấm "Thêm vào giỏ" từ product card) | *(mặc định 1)* | `addToCart(item, 1)` — happy path chính |
| EC-QA-I1 | Invalid | Chuỗi rỗng `""` | `""` | State mặc định — `normalizeQuantity` fallback 1 |
| EC-QA-I2 | Invalid | Số 0 | `"0"` | Biên không hợp lệ — fallback 1 |
| EC-QA-I3 | Invalid | Số âm | `"-5"` | Ngoài domain — fallback 1 |
| EC-QA-I4 | Invalid | Chuỗi không phải số | `"abc"` | parseInt → NaN → fallback 1 |
| EC-QA-I5 | Invalid | Số thập phân | `"2.7"` | parseInt lấy phần nguyên (2) → dùng 2 |

---

### Field 2: `quantity` (Cart Inline Edit)

| Attribute | Detail |
| --- | --- |
| **Data Type** | String → parseInt |
| **Required** | Không — nếu invalid → set 1 |
| **Min Value** | SPEC: 1. CODE: fallback 1 nếu ≤ 0 |
| **Max Value** | SPEC: không quy định. CODE: không giới hạn |
| **Validation** | `parseInt(text, 10)`: > 0 → parsed + 1 (BUG App.js:620); else → 1. Không hiển thị lỗi. |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-QE-V1 | Valid | Số dương bình thường | `"2"` | Happy path — chỉnh số lượng |
| EC-QE-V2 | Valid | Nhập 1 (biên dưới hợp lệ) | `"1"` | Nhỏ nhất còn được chấp nhận |
| EC-QE-V3 | Valid | Số lớn | `"50"` | Stress — không có upper limit |
| EC-QE-I1 | Invalid | Chuỗi rỗng | `""` | parseInt("") → NaN → fallback 1 |
| EC-QE-I2 | Invalid | Số 0 | `"0"` | Biên không hợp lệ — fallback 1 |
| EC-QE-I3 | Invalid | Số âm | `"-3"` | Ngoài domain — fallback 1 |
| EC-QE-I4 | Invalid | Chuỗi không phải số | `"xyz"` | parseInt("xyz") → NaN → fallback 1 |

---

### Field 3: `product` (addToCart — Object Input)

| Attribute | Detail |
| --- | --- |
| **Data Type** | Object `{id, name, price, ...}` |
| **Required** | Yes |
| **Min Value** | N/A |
| **Max Value** | N/A |
| **Validation** | CODE dùng `product.id` để findIndex merge/thêm mới. Không validate thiếu fields. |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-P-V1 | Valid | Sản phẩm mới (chưa có trong giỏ) | Product id=2 (chưa add) | Thêm dòng mới vào cart |
| EC-P-V2 | Valid | Sản phẩm đã có trong giỏ (trùng id) | Product id=1 (đã add trước đó) | SPEC: tăng quantity, không tạo dòng mới |
| EC-P-V3 | Valid | Nhiều sản phẩm khác nhau trong giỏ | id=1, id=2, id=3 lần lượt | Cart chứa nhiều items |

---

### Field 4: Behavioral Partitions (Cart State Operations)

| Attribute | Detail |
| --- | --- |
| **Data Type** | N/A — trạng thái hệ thống |
| **Required** | N/A |
| **Min Value** | N/A |
| **Max Value** | N/A |
| **Validation** | Dựa trên SPEC FR-07 về trạng thái giỏ hàng và UI requirements |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-CART-V1 | Valid | Xem giỏ hàng có items | Cart có 2+ items | Hiển thị list, tổng tiền, nút Xóa |
| EC-CART-V2 | Valid | Xem giỏ hàng rỗng | Cart = [] | SPEC: hình + text. CODE: chỉ text |
| EC-CART-V3 | Valid | Tổng tiền tính đúng | price=100, quantity=2 | `cartTotal = reduce(price * quantity)` |
| EC-CART-V4 | Valid | Xóa sản phẩm khỏi giỏ | Bấm "Xóa" trên 1 item | SPEC: confirm dialog. CODE: xóa trực tiếp |
| EC-CART-V5 | Valid | Xóa item cuối — giỏ trở thành rỗng | Cart 1 item → xóa | Sau xóa: empty state |
| EC-UI-I1 | Invalid | Không có nút +/- chỉnh quantity | Kiểm tra UI cart view | SPEC: nút +/-. CODE: TextInput |
| EC-UI-I2 | Invalid | Nhãn "Tổng tạm tính" thay vì "Tổng cộng" | Kiểm tra label tổng tiền | Vi phạm FR-07 |
| EC-UI-I3 | Invalid | Empty state thiếu hình minh họa | Cart rỗng → kiểm tra UI | SPEC: hình + text. CODE: chỉ text |

---

## EC Summary

| Field / Group | Valid ECs | Invalid ECs | Total |
| --- | --- | --- | --- |
| quantity (Product Detail) | EC-QA-V1→V4 (4) | EC-QA-I1→I5 (5) | 9 |
| quantity (Cart Inline Edit) | EC-QE-V1→V3 (3) | EC-QE-I1→I4 (4) | 7 |
| product (addToCart) | EC-P-V1→V3 (3) | — | 3 |
| Behavioral (Cart + UI) | EC-CART-V1→V5 (5) | EC-UI-I1→I3 (3) | 8 |
| **Total** | **15** | **12** | **27** |
