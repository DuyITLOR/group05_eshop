# Conditions & Actions — FR-09: Apply Coupon

---

## Conditions

| Mã | Mô tả | Giá trị | Nguồn |
|----|-------|---------|-------|
| C1 | Trường `code` được cung cấp (không null, không rỗng) | Y / N | `server.js:366` |
| C2 | Coupon tồn tại trong DB và `is_active = 1` | Y / N | `server.js:370` |
| C3 | `total_amount > coupon.min_order_amount` *(strict — code thực tế)* | Y / N | `server.js:379` |
| C4 | Coupon chưa hết hạn (`expired_at >= ngày hiện tại`) | Y / N | `server.js:382` |
| C5 | `user_id` được cung cấp trong request body | Y / N | `server.js:386` |
| C6 | `usage_count < coupon.max_uses_per_user` | Y / N | `server.js:391` |

## Actions

| Mã | HTTP | Nội dung phản hồi |
|----|------|------------------|
| A1 | 400 | `{ "error": "Vui lòng nhập mã giảm giá" }` |
| A2 | 404 | `{ "error": "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" }` |
| A3 | 400 | `{ "error": "Đơn hàng chưa đủ giá trị tối thiểu X ₫ để áp dụng mã này" }` |
| A4 | 400 | `{ "error": "Mã giảm giá đã hết hạn" }` |
| A5 | 400 | `{ "error": "Bạn đã sử dụng mã này X lần (đã đạt giới hạn)" }` |
| A6 | 200 | `{ success, coupon_id, discount_amount, final_amount, message }` |
