# STEP 1 — Spec Analysis: FR-07 Mobile Shopping Cart (feature_D)

**Feature:** feature_D (D5 Mobile – Shopping Cart)
**FR:** FR-07 (Giỏ hàng) + FR-20 (Mobile đầy đủ chức năng)
**Source Code:**
- Frontend Mobile: `group05_eshop/frontend-mobile/App.js` (lines 61–77, 129–158, 435–436, 590–657)
- Backend: `group05_eshop/backend/server.js` (lines 284–308)

---

## 1. Functional Description

### 1.1 Main Business Flow — Thêm sản phẩm vào giỏ hàng

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Xem danh sách sản phẩm, bấm "Thêm vào giỏ" trên product card | Gọi `addToCart(item, 1)` với quantity mặc định = 1 | [CODE-FE] App.js:475 |
| 2 | System | Kiểm tra sản phẩm đã có trong giỏ | `cart.findIndex(item => item.id === selectedProduct.id)` | [CODE-FE] App.js:136–137 |
| 3a | System | Nếu đã có → tăng quantity | `newCart[existingIndex].quantity += safeQuantity` | [CODE-FE] App.js:141–147 |
| 3b | System | Nếu chưa có → thêm mới | `setCart([...cart, {...selectedProduct, quantity: safeQuantity}])` | [CODE-FE] App.js:149 |
| 4 | System | Hiển thị Alert xác nhận | `Alert.alert("Thành công", "Đã thêm vào giỏ hàng")` | [CODE-FE] App.js:152 |

**Lưu ý:**
- Giỏ hàng lưu trong **state React** (client-side), **KHÔNG** dùng backend cart API (`POST /api/cart`). [CODE-FE] App.js:62
- `normalizeQuantity()`: parse integer, nếu ≤ 0 hoặc NaN → mặc định 1. [CODE-FE] App.js:129–132
- SPEC: "Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới" → CODE đúng. [SPEC ✓]

### 1.2 Sub-Flow — Thêm từ trang chi tiết sản phẩm (có chọn số lượng)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Mở chi tiết sản phẩm, nhập số lượng vào TextInput | State `quantity` cập nhật (kiểu string) | [CODE-FE] App.js:564–569 |
| 2 | User | Bấm "Thêm vào giỏ hàng" | Gọi `addToCart(product, quantity)` — quantity là **string** | [CODE-FE] App.js:575 |
| 3 | System | `normalizeQuantity(quantity)` parse string → int | `parseInt(value, 10)` → nếu > 0 thì dùng, nếu không → 1 | [CODE-FE] App.js:129–132 |

**Lưu ý:**
- `quantity` state khởi tạo là `""` (string rỗng), không phải số. [CODE-FE]
- Nếu user nhập "abc" hoặc "-5" → `normalizeQuantity` fallback về 1. Không hiển thị lỗi cho user. [CODE-FE]

### 1.3 Sub-Flow — Xem giỏ hàng (Read)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Bấm "Giỏ (N)" trên navbar | `setView("cart")` → render `renderCart()` | [CODE-FE] App.js:435–436, 978 |
| 2 | System | Nếu giỏ rỗng | Hiển thị "Giỏ hàng của bạn đang trống" + link "Tiếp tục mua sắm" | [CODE-FE] App.js:594–599 |
| 3 | System | Nếu có items | Hiển thị list: tên, giá, số lượng (TextInput chỉnh được), thành tiền, nút "Xóa" | [CODE-FE] App.js:603–633 |
| 4 | System | Hiển thị tổng tiền | `"Tổng tạm tính: {formatMoney(cartTotal)}"` | [CODE-FE] App.js:637–638 |

**Lưu ý:**
- SPEC: Tổng tiền nhãn "Tổng cộng". CODE: nhãn **"Tổng tạm tính"** → **SPEC-CODE mismatch**. [SPEC: FR-07]
- SPEC: "có nút +/- để chỉnh số lượng". CODE: dùng **TextInput** (nhập số trực tiếp), **KHÔNG có nút +/-** → **SPEC-CODE mismatch**. [SPEC: FR-07]
- Badge giỏ hàng: hiển thị `cart.length` (số loại sản phẩm), không phải tổng quantity. [CODE-FE] App.js:436

### 1.4 Sub-Flow — Chỉnh số lượng trong giỏ

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Nhập số mới vào TextInput quantity | `onChangeText` callback xử lý | [CODE-FE] App.js:615–623 |
| 2 | System | Parse và set quantity | `parseInt(text, 10)` → nếu > 0 → **parsed + 1** (BUG!); nếu không → 1 | [CODE-FE] App.js:617–621 |

**BUG QUAN TRỌNG:** Khi user nhập số N vào ô quantity, CODE set `parsed + 1` (dòng 620). Nghĩa là nhập "2" → quantity = 3, nhập "5" → quantity = 6. Đây là off-by-one bug. [CODE-FE] App.js:620

### 1.5 Sub-Flow — Xóa sản phẩm khỏi giỏ

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Bấm "Xóa" bên cạnh sản phẩm | Gọi `removeFromCart(index)` | [CODE-FE] App.js:630 |
| 2 | System | Xóa item khỏi array | `newCart.splice(index, 1)` → `setCart(newCart)` | [CODE-FE] App.js:155–158 |

**Lưu ý:**
- SPEC: "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện". CODE: **KHÔNG có confirm dialog** — xóa trực tiếp. → **SPEC-CODE mismatch** [SPEC: FR-07]

### 1.6 Sub-Flow — Thanh toán (Checkout)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | User | Bấm "Tiến hành thanh toán" | Kiểm tra user đăng nhập. Nếu chưa → redirect login. | [CODE-FE] App.js:342–346 |
| 2 | System | Gửi checkout request | `POST /api/checkout` với `items: cart.length > 1 ? cart.slice(0, -1) : cart` | [CODE-FE] App.js:391 |

**BUG QUAN TRỌNG:** `cart.slice(0, -1)` — khi giỏ có > 1 item, item cuối bị **bỏ ra** khỏi request checkout. Chỉ gửi N-1 items. [CODE-FE] App.js:391

**Lưu ý thêm:**
- Backend `POST /api/checkout`: nhận `total_amount` từ client và **lưu trực tiếp** vào DB. SPEC: "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên" → **SPEC-CODE mismatch** [SPEC: FR-08]
- `editableTotal` state cho phép user chỉnh tổng tiền trên UI checkout. [CODE-FE] App.js:65, 348

---

## 2. Input Fields

### 2.1 Direct Input Fields

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source |
| --- | --- | --- | --- | --- | --- | --- |
| quantity (product detail) | String → parseInt | No (default "") | `normalizeQuantity()`: parseInt > 0 → dùng; else → 1 | "1", "2", "10", "999" | "", "0", "-1", "abc", "1.5", null | [CODE-FE] App.js:129–132, 568 |
| quantity (cart inline edit) | String → parseInt | No | `parseInt(text, 10)`: > 0 → **parsed + 1**; else → 1 | "1"→2, "2"→3, "5"→6 (bug) | "", "0", "-1", "abc" | [CODE-FE] App.js:617–621 |
| product (addToCart) | Object | Yes | Phải có `id`, `name`, `price` | Product object từ API | null, undefined, thiếu fields | [CODE-FE] App.js:134 |

### 2.2 State Variables

| Field Name | Data Type | Default | Domain | Description | Source |
| --- | --- | --- | --- | --- | --- |
| cart | Array\<Object\> | `[]` | 0 → N items | Danh sách sản phẩm trong giỏ, mỗi item có {id, name, price, quantity, ...} | [CODE-FE] App.js:62 |
| cartTotal | Number (computed) | 0 | 0 → ∞ | `cart.reduce((t, i) => t + i.price * i.quantity, 0)` — useMemo | [CODE-FE] App.js:75–77 |
| user / token | Object / String | null / "" | Logged in / not | Ảnh hưởng checkout flow — cần đăng nhập để thanh toán | [CODE-FE] App.js:342 |
| view | String | "home" | "home", "cart", "checkout", ... | Navigation state | [CODE-FE] App.js |

### 2.3 Implicit Constraints

| Constraint | Description | SPEC | CODE | Match? |
| --- | --- | --- | --- | --- |
| Nút +/- chỉnh số lượng | FR-07: "Số lượng có nút +/- để chỉnh" | Có | **Dùng TextInput**, không có nút +/- | **Mismatch** |
| Nhãn tổng tiền | FR-07: nhãn "Tổng cộng" | "Tổng cộng" | **"Tổng tạm tính"** | **Mismatch** |
| Dialog xác nhận xóa | FR-07: "Nút Xóa phải có dialog xác nhận" | Có | **Không có** — xóa trực tiếp | **Mismatch** |
| Empty state giỏ rỗng | FR-07: "hình minh họa và thông báo rõ ràng" | Có hình + text | Có text "đang trống" nhưng **không có hình minh họa** | **Partial mismatch** |
| Checkout gửi đủ items | Implicit: checkout phải gửi tất cả items | Đủ | **Bỏ item cuối** khi > 1 item (`cart.slice(0, -1)`) | **Mismatch (BUG)** |
| Quantity inline edit | User nhập N → quantity = N | Đúng | **quantity = N + 1** (off-by-one) | **Mismatch (BUG)** |
| Nút "Tiếp tục mua sắm" | FR-07: có nút quay về trang chủ | Có | Có — `goHome()` khi giỏ rỗng; "← Mua tiếp" khi có items | **Match** |
| Backend tự tính tổng tiền | FR-08: "Backend phải tự tính lại tổng tiền" | Tự tính | **Dùng total_amount từ client** | **Mismatch** |

---

## 3. Field Dependencies

| Field A | Field B | Dependency Type | Condition | Description |
| --- | --- | --- | --- | --- |
| product.id | cart items | Lookup | addToCart kiểm tra product đã có trong giỏ chưa | Nếu trùng id → tăng quantity; nếu mới → thêm dòng |
| quantity (input) | cart[index].quantity | Calculation | Inline edit: parsed + 1 (bug) | Off-by-one — user nhập 2 thì quantity = 3 |
| cart items | cartTotal | Calculation | `reduce(price * quantity)` | Tổng tiền tính tự động khi cart thay đổi |
| user/token | checkout | Sequential | Phải đăng nhập trước checkout | Nếu chưa login → redirect |
| cart.length | checkout items | Threshold | `cart.length > 1 ? cart.slice(0, -1) : cart` | > 1 item → bỏ item cuối (bug) |
| cartTotal | editableTotal | Reset | openCheckout set `editableTotal = cartTotal` | User có thể chỉnh editableTotal trên UI |

---

## 4. Summary of SPEC vs CODE Discrepancies

| # | Issue | Impact | Severity |
| --- | --- | --- | --- |
| 1 | **Off-by-one quantity** — inline edit: nhập N → set N+1 | Sai số lượng, sai tổng tiền | High |
| 2 | **Checkout bỏ item cuối** — `cart.slice(0, -1)` khi > 1 item | Mất sản phẩm khi thanh toán | Critical |
| 3 | Nhãn "Tổng tạm tính" thay vì "Tổng cộng" | Vi phạm FR-07 | Low |
| 4 | Không có nút +/- chỉnh số lượng, dùng TextInput | Vi phạm FR-07 | Medium |
| 5 | Xóa sản phẩm không có confirm dialog | Vi phạm FR-07 | Medium |
| 6 | Empty state thiếu hình minh họa | Vi phạm FR-07 | Low |
| 7 | Backend nhận total_amount từ client, không tự tính | Vi phạm FR-08, security risk | High |
