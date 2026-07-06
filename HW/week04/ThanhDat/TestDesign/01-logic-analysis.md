# Logic Analysis — FR-09: Apply Coupon

**Nguồn:** `backend/server.js:362–441`

---

## Luồng xử lý thực tế

Endpoint **không yêu cầu xác thực** (không có middleware `authenticateToken`). Luồng xử lý tuần tự theo guard clause — mỗi điều kiện thất bại sẽ dừng sớm (early return):

```
1. !code                              → 400 A1
2. coupon không tồn tại / inactive   → 404 A2
3. total_amount > min_order_amount   → else 400 A3   ← dùng ">", không phải ">="
4. expiry < now                      → 400 A4
5. user_id không có                  → 200 A6 (bỏ qua kiểm tra usage)
6. usage_count >= max_uses_per_user  → 400 A5
7. (all clear)                       → 200 A6
```

## Code thực tế (đã rút gọn)

```js
// server.js:363
app.post("/api/apply-coupon", (req, res) => {          // ← không có authenticateToken
  const { code, total_amount, user_id } = req.body;

  if (!code)                                           // Guard C1
    return res.status(400).json({ error: "Vui lòng nhập mã giảm giá" });

  db.get("SELECT * FROM coupons WHERE code = ? AND is_active = 1", [code], (err, coupon) => {
    if (!coupon)                                       // Guard C2
      return res.status(404).json({ error: "Mã giảm giá không tồn tại..." });

    if (total_amount > coupon.min_order_amount) {      // Guard C3 — BUG: ">" thay vì ">="
      const expiry = new Date(coupon.expired_at);
      if (expiry < now)                                // Guard C4
        return res.status(400).json({ error: "Mã giảm giá đã hết hạn" });

      if (user_id) {                                   // Guard C5
        db.get("SELECT COUNT(*) ...", (err, result) => {
          if (result.usage_count >= coupon.max_uses_per_user)  // Guard C6
            return res.status(400).json({ error: "...đã đạt giới hạn" });

          // BUG: discount_amount = Math.floor(total_amount * (1 - coupon.discount_value))
          // Với discount_value=10 → total * (1-10) = total * (-9) → âm
          return res.json({ success: true, discount_amount, final_amount, ... });
        });
      } else {
        // Không có user_id → bỏ qua kiểm tra usage hoàn toàn
        return res.json({ success: true, ... });
      }
    } else {
      return res.status(400).json({ error: "Đơn hàng chưa đủ giá trị tối thiểu..." });
    }
  });
});
```

## Hệ quả với Decision Table

Cấu trúc guard clause tuần tự làm cho:

- Các điều kiện **phụ thuộc nhau theo thứ tự**: C2 chỉ được kiểm tra khi C1=Y, C3 chỉ khi C2=Y...
- Phần lớn trong 2⁶ = 64 tổ hợp là **impossible rules** (57 rules loại bỏ)
- Chỉ còn **7 rule có nghĩa** → 7 test case tối thiểu
