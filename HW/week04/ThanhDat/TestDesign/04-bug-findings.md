# Bug Findings — FR-09: Apply Coupon

Phát hiện khi đọc code `backend/server.js`. Xem chi tiết tại `bug-report_COUPON.md`.

---

| # | Bug | Vị trí | Severity | Trạng thái |
|---|-----|--------|----------|-----------|
| B1 | Off-by-one: `>` thay vì `>=` tại min_order check | `server.js:379` | Major | **Confirmed** (TC-COUPON-003b) |
| B2 | Công thức percent sai: `total * (1 - discount_value)` | `server.js:399` | Critical | **Confirmed** (TC-COUPON-007b) |
| B3 | Endpoint không yêu cầu auth token | `server.js:363` | Major | **Confirmed** (TC-COUPON-005/007) |
| B4 | Kiểm tra hết hạn sau min_order — thứ tự check sai | `server.js:379–382` | Minor | Cần TC riêng |
| B5 | Bỏ qua usage limit khi không có user_id | `server.js:386` | Major | **Confirmed** (TC-COUPON-005) |

## B1 — Off-by-one

```js
// Hiện tại (sai)
if (total_amount > coupon.min_order_amount)

// Đúng
if (total_amount >= coupon.min_order_amount)
```
Khi `total_amount == min_order_amount` → hệ thống từ chối thay vì áp dụng.

## B2 — Percent formula

```js
// Hiện tại (sai) — discount_value=10, total=400000
discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
// → 400000 * (1-10) = -3,600,000 → final_amount = 4,000,000

// Đúng
discount_amount = Math.floor(total_amount * (coupon.discount_value / 100));
// → 400000 * 0.1 = 40,000 → final_amount = 360,000
```

## B3 — Thiếu auth

```js
// Hiện tại
app.post("/api/apply-coupon", (req, res) => { ... }

// Đúng
app.post("/api/apply-coupon", authenticateToken, (req, res) => { ... }
// + lấy user_id từ req.user.id thay vì req.body.user_id
```

## B4 — Thứ tự check

Coupon EXPIRED + đơn < min_order → trả về "chưa đủ tối thiểu" thay vì "đã hết hạn".  
Kiểm tra `expired_at` nên được đặt trước `min_order_amount`.

## B5 — Bypass usage limit

Không gửi `user_id` → nhánh `else` bỏ qua hoàn toàn `coupon_usage` check → áp dụng thành công dù đã hết lượt.
