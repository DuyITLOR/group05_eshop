# Bug ID: `FR08-bug-01`

## Bug description:
Backend không tự tính lại tổng tiền khi thanh toán — API `POST /api/checkout` nhận thẳng `total_amount` do client gửi và lưu nguyên vào bảng `orders`. Người dùng có thể sửa payload để đặt hàng với số tiền tùy ý (thấp hoặc cao hơn giá trị thật của giỏ), vi phạm FR-08 ("Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên"). Đây là lỗ hổng nghiêm trọng: có thể mua hàng với giá gần như 0₫.

## Test case coverage:
- `TC-CHECKOUT-12` (Client gửi total_amount thấp hơn thực tế → server phải tính lại)
- `TC-CHECKOUT-13` (Client gửi total_amount cao hơn thực tế → server phải tính lại)

## Preconditions:
1. Backend chạy tại `http://localhost:3000`.
2. Tài khoản đã đăng nhập có JWT hợp lệ (`test@eshop.com` / `Test1234!`).
3. Giỏ hàng có tổng giá trị thật xác định (ví dụ 220,000₫).

## Test steps:
1. Đăng nhập, lấy JWT hợp lệ.
2. Gửi request:
   ```
   POST http://localhost:3000/api/checkout
   Authorization: Bearer <token hợp lệ>
   Content-Type: application/json

   { "total_amount": 1000, "shipping_address": "123 Nguyễn Văn Cừ, Q5" }
   ```
3. Gọi `GET /api/orders/my-orders` (hoặc `GET /api/orders/:id`) để xem `total_amount` đã lưu.

## Expected results:
Đơn hàng được tạo với `total_amount` = giá trị **server tự tính lại** từ giỏ hàng (220,000₫), không phụ thuộc giá trị client gửi.

## Actual results:
Đơn hàng lưu `total_amount = 1000` — đúng bằng giá trị client gửi. Backend không đọc giỏ hàng, không tính lại.

Dẫn chứng code — `backend/server.js:297–309`:
```js
app.post("/api/checkout", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { total_amount, shipping_address } = req.body;   // ← lấy thẳng từ client
  db.run(
    "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
    [userId, total_amount, "pending", shipping_address],  // ← lưu nguyên, không tính lại
    ...
  );
});
```

### Bug screenshot:
- Chưa có ảnh — kết quả suy ra từ phân tích code tĩnh (chưa chạy Playwright/live). Khi chạy thật, chụp response `GET /api/orders/:id` cho thấy `total_amount = 1000` và lưu tại `./bugs/FR08/images/FR08-bug-01.png`.
- (Nhúng khi có ảnh) `![total_amount lưu sai](./images/FR08-bug-01.png)`

## Đề xuất mức độ (tham khảo)
Severity: Critical · Priority: P0. Sửa: backend phải tính `total_amount` từ dữ liệu giỏ hàng phía server, bỏ qua giá trị client gửi.
