# Bug Report — FR-09: Apply Coupon

**Endpoint:** `POST /api/apply-coupon`  
**Phát hiện qua:** Decision Table Testing  
**Nguồn phân tích:** `backend/server.js:362–441`, `backend/database.js:106–111`  
**Ngày:** 2026-06-29

---

## BUG-01: Off-by-one trong kiểm tra giá trị đơn hàng tối thiểu

| Mục              | Nội dung                |
| ---------------- | ----------------------- |
| **ID**           | BUG-01                  |
| **Severity**     | Major                   |
| **Liên quan TC** | TC-COUPON-003           |
| **Vị trí**       | `backend/server.js:379` |

**Mô tả:**  
Điều kiện kiểm tra giá trị đơn hàng tối thiểu sử dụng toán tử `>` (strictly greater than) thay vì `>=`. Khi `total_amount` bằng đúng `min_order_amount`, hệ thống từ chối áp dụng coupon.

**Steps to reproduce:**

1. Gửi `POST /api/apply-coupon`
2. Body: `{ "code": "SAVE10", "total_amount": 300000, "user_id": 1 }`
   _(SAVE10 có min_order_amount = 300,000đ)_

**Expected result:**  
HTTP 200 — Áp dụng thành công (đơn hàng đúng bằng mức tối thiểu nên hợp lệ).

**Actual result:**  
HTTP 400 — `"Đơn hàng chưa đủ giá trị tối thiểu 300.000 ₫ để áp dụng mã này"`

**Root cause:**

```js
// server.js:379 — hiện tại
if (total_amount > coupon.min_order_amount) {

// Đúng ra phải là
if (total_amount >= coupon.min_order_amount) {
```

---

## BUG-02: Công thức tính giảm giá phần trăm sai hoàn toàn

| Mục              | Nội dung                                         |
| ---------------- | ------------------------------------------------ |
| **ID**           | BUG-02                                           |
| **Severity**     | Critical                                         |
| **Liên quan TC** | TC-COUPON-007 (khi dùng coupon type=percent)     |
| **Vị trí**       | `backend/server.js:399–400`, `server.js:419–420` |

**Mô tả:**  
Công thức tính `discount_amount` cho coupon loại `percent` bị sai. Code tính `total_amount * (1 - discount_value)` trong đó `discount_value` được lưu là số nguyên (ví dụ: `10` cho 10%). Kết quả là một số âm rất lớn, khiến `final_amount` trả về cao hơn nhiều lần so với giá gốc.

**Steps to reproduce:**

1. Gửi `POST /api/apply-coupon`
2. Body: `{ "code": "SAVE10", "total_amount": 400000, "user_id": 1 }`
   _(SAVE10: type=percent, discount_value=10)_

**Expected result:**

```json
{
  "success": true,
  "discount_amount": 40000,
  "final_amount": 360000
}
```

**Actual result:**

```json
{
  "success": true,
  "discount_amount": -3600000,
  "final_amount": 4000000
}
```

_(discount_amount = floor(400000 × (1 − 10)) = floor(400000 × −9) = −3,600,000)_

**Root cause:**

```js
// server.js:399–400 — hiện tại (sai)
discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
// → 400000 * (1 - 10) = 400000 * (-9) = -3,600,000

// Đúng ra phải là
discount_amount = Math.floor(total_amount * (coupon.discount_value / 100));
// → 400000 * (10 / 100) = 400000 * 0.1 = 40,000
```

**Ảnh hưởng:** Mọi coupon loại `percent` đều trả về `final_amount` sai — người dùng nhìn thấy giá sau giảm cao hơn giá gốc nhiều lần.

---

## BUG-03: Endpoint không yêu cầu xác thực — user_id có thể bị giả mạo

| Mục              | Nội dung                     |
| ---------------- | ---------------------------- |
| **ID**           | BUG-03                       |
| **Severity**     | Major                        |
| **Liên quan TC** | TC-COUPON-005, TC-COUPON-007 |
| **Vị trí**       | `backend/server.js:363`      |

**Mô tả:**  
Endpoint `POST /api/apply-coupon` không có middleware `authenticateToken`. `user_id` được đọc trực tiếp từ request body mà không kiểm tra với JWT token. Bất kỳ client nào cũng có thể truyền `user_id` tùy ý để giả mạo danh tính người dùng khác khi kiểm tra lượt dùng coupon.

**Steps to reproduce:**

1. Không cần đăng nhập, không cần Authorization header
2. Gửi `POST /api/apply-coupon` với body: `{ "code": "SAVE10", "total_amount": 400000, "user_id": 99 }`
3. Hệ thống kiểm tra usage limit của user_id=99 — mặc dù client không phải user 99

**Expected result:**  
Endpoint yêu cầu Bearer token hợp lệ; `user_id` được lấy từ token, không từ body.

**Actual result:**  
Request thành công không cần auth. `user_id` lấy hoàn toàn từ client.

**Root cause:**

```js
// server.js:363 — thiếu middleware
app.post("/api/apply-coupon", (req, res) => {

// Nên là
app.post("/api/apply-coupon", authenticateToken, (req, res) => {
// và lấy user_id từ req.user.id thay vì req.body.user_id
```

---

## BUG-04: Bỏ qua kiểm tra giới hạn lượt dùng khi không có user_id

| Mục              | Nội dung                |
| ---------------- | ----------------------- |
| **ID**           | BUG-04                  |
| **Severity**     | Major                   |
| **Liên quan TC** | TC-COUPON-005           |
| **Vị trí**       | `backend/server.js:386` |

**Mô tả:**  
Khi request không gửi `user_id`, hệ thống bỏ qua hoàn toàn kiểm tra `max_uses_per_user` và áp dụng coupon thành công. Điều này cho phép người dùng bypass giới hạn lượt dùng bằng cách đơn giản là không gửi `user_id` trong body.

**Steps to reproduce:**

1. Giả sử user_id=1 đã dùng hết lượt cho SAVE10 (max_uses=1)
2. Gửi `POST /api/apply-coupon` với body: `{ "code": "SAVE10", "total_amount": 400000 }` _(không có user_id)_
3. Hệ thống vẫn trả về 200 thành công

**Expected result:**  
Hệ thống phải xác định danh tính từ token và kiểm tra usage. Không thể bypass bằng cách bỏ user_id.

**Actual result:**  
HTTP 200 — áp dụng thành công dù user đã hết lượt.

**Root cause:**

```js
// server.js:386 — nhánh else khi không có user_id hoàn toàn bỏ qua usage check
if (user_id) {
  // kiểm tra usage
} else {
  // áp dụng thẳng không kiểm tra
}
```

---

## BUG-05: Thứ tự kiểm tra không hợp lý — hết hạn bị che bởi lỗi "chưa đủ tiền"

| Mục              | Nội dung                     |
| ---------------- | ---------------------------- |
| **ID**           | BUG-05                       |
| **Severity**     | Minor                        |
| **Liên quan TC** | TC-COUPON-003, TC-COUPON-004 |
| **Vị trí**       | `backend/server.js:379–382`  |

**Mô tả:**  
Kiểm tra hạn sử dụng (`expired_at`) chỉ được thực hiện bên trong nhánh `if (total_amount > min_order_amount)`. Khi coupon đã hết hạn nhưng đơn hàng chưa đủ tiền, hệ thống trả về lỗi "chưa đủ tối thiểu" thay vì "đã hết hạn", gây nhầm lẫn cho người dùng.

**Steps to reproduce:**

1. Gửi `POST /api/apply-coupon`
2. Body: `{ "code": "EXPIRED", "total_amount": 50000, "user_id": 1 }`
   _(EXPIRED: min_order=100,000đ — đơn chưa đủ; expired_at=2020-01-01 — đã hết hạn)_

**Expected result:**  
HTTP 400 — `"Mã giảm giá đã hết hạn"` _(lỗi hết hạn nên được ưu tiên thông báo)_

**Actual result:**  
HTTP 400 — `"Đơn hàng chưa đủ giá trị tối thiểu 100.000 ₫ để áp dụng mã này"` _(che mất lỗi hết hạn)_

**Root cause:**  
Kiểm tra `expiry < now` nằm lồng bên trong `if (total_amount > min_order_amount)`, thay vì được đặt trước đó.

---

## Tổng hợp

| Bug ID | Severity | Vị trí              | Xác nhận                                                                                          |
| ------ | -------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| BUG-01 | Major    | `server.js:379`     | **Confirmed** — Playwright TC-COUPON-003b: `total=300000` → 400 (kỳ vọng 200)                     |
| BUG-02 | Critical | `server.js:399–400` | **Confirmed** — Playwright TC-COUPON-007b: `discount_amount=-3,600,000`, `final_amount=4,000,000` |
| BUG-03 | Major    | `server.js:363`     | **Confirmed** — Playwright TC-COUPON-005/007: không cần auth header vẫn 200                       |
| BUG-04 | Major    | `server.js:386`     | **Confirmed** — Playwright TC-COUPON-005: bỏ user_id → 200 (bỏ qua usage check)                   |
| BUG-05 | Minor    | `server.js:379–382` | Cần test case riêng (EXPIRED + total < min_order)                                                 |

**Playwright run:** `playwright-tests/tests/coupon.spec.js` — 9/9 passed, 2026-06-29
