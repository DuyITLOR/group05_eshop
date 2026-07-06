# Bug Report — Feature B / FR-08 Checkout (Module `CHECKOUT`)

> Không kèm ảnh. Bằng chứng thay bằng dẫn chứng dòng code + HTTP thực tế. Nguồn TC: [EP-FR08.md](../test-design/EP-FR08.md), [BVA-FR08.md](../test-design/BVA-FR08.md).

| Bug ID   | Found by TC                                             | Tiêu đề                                                                                                                                                             | Severity |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BUG-B-01 | TC-CHECKOUT-102                                         | Off-by-one: `apply-coupon` dùng `total > min_order_amount` thay vì `>=` → đơn đúng ngưỡng tối thiểu bị từ chối (server.js:379)                                       | High     |
| BUG-B-02 | TC-CHECKOUT-009, TC-CHECKOUT-103                        | Sai công thức percent discount: `total*(1-discount_value)` với `discount_value=10` → discount âm, final > total (server.js:399)                                     | Critical |
| BUG-B-03 | TC-CHECKOUT-002…007                                     | Thiếu validation server-side cho checkout: `total_amount` (0, âm, chuỗi, thiếu) và `shipping_address` (rỗng, thiếu) đều được chấp nhận (server.js:297-309)           | High     |
| BUG-B-04 | TC-CHECKOUT-015                                         | Bypass `max_uses_per_user`: `apply-coupon` không có `authenticateToken`; bỏ field `user_id` → `if(user_id)`=false (server.js:386) → bỏ qua kiểm số lần dùng          | Critical |

## Chi tiết

### BUG-B-01 — Off-by-one ngưỡng coupon (High)
- **Found by:** TC-CHECKOUT-102
- **Steps:** `POST /api/apply-coupon` `{"code":"SAVE10","total_amount":300000}`.
- **Expected:** 200, áp mã (spec: total `≥` min 300000).
- **Actual:** 400 từ chối vì server.js:379 dùng `>`: `300000 > 300000` = false.

### BUG-B-02 — Sai công thức percent discount (Critical)
- **Found by:** TC-CHECKOUT-009, TC-CHECKOUT-103
- **Steps:** `POST /api/apply-coupon` `{"code":"SAVE10","total_amount":400000,"user_id":2}`.
- **Expected:** discount = 400000×10/100 = 40000, final = 360000.
- **Actual:** server.js:399 `Math.floor(total*(1-discount_value))` với `discount_value=10` → `400000*(-9)` → discount=-3600000, final=4000000 (final > total).

### BUG-B-03 — Thiếu validation server-side checkout (High)
- **Found by:** TC-CHECKOUT-002, -003, -004, -005, -006, -007
- **Steps:** `POST /api/checkout` với `total_amount` = 0 / âm / "abc" / thiếu; `shipping_address` = "" / thiếu.
- **Expected:** 400 báo lỗi tương ứng.
- **Actual:** 200, INSERT thẳng vào DB (server.js:297-309 không validate); "abc"→0, thiếu field→NULL.

### BUG-B-04 — Bypass max_uses_per_user (Critical)
- **Found by:** TC-CHECKOUT-015
- **Steps:** Dùng SAVE10 (max=1) với `user_id=2` → ghi `coupon-usage` → áp lại SAVE10 **không** gửi `user_id`.
- **Expected:** 400 (đã đạt giới hạn).
- **Actual:** 200, áp thành công. `apply-coupon` không có `authenticateToken`; nhánh `if (user_id)` (server.js:386) = false → bỏ toàn bộ kiểm số lần dùng → mã giới hạn lượt áp vô hạn bởi caller ẩn danh.

## Kết quả execute Feature B

| Chỉ số             | Số lượng                       |
| ------------------ | ------------------------------ |
| Test case thiết kế | 20 (14 Domain + 3 BVA + 3 Gap) |
| Đã execute         | 20                             |
| Pass               | 9                              |
| Fail               | 11                             |
| Bug tìm được       | 4 (BUG-B-01, B-02, B-03, B-04) |
