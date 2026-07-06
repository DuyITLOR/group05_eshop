# Bug ID: `FR09-bug-04`

## Bug description:
Hệ thống dùng điều kiện `total_amount > coupon.min_order_amount` thay vì `total_amount >= coupon.min_order_amount` khi kiểm tra ngưỡng tối thiểu của coupon. Theo FR-09, tổng đơn hàng bằng đúng `min_order_amount` vẫn phải được xem là đủ điều kiện áp dụng mã giảm giá.

## Test case coverage: 

- `TC-FR09-DTT-002` (Áp dụng mã fixed khi tất cả điều kiện đều đúng)
- `TC-FR09-DTT-007` (Từ chối khi tổng đơn hàng chưa đạt ngưỡng)

## Preconditions: 
1. User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
2. Mã `BIGBUY` tồn tại, active, type `fixed`, `discount_value = 50000`, `min_order_amount = 500000`, `expired_at = 2099-12-31`.
3. User chưa dùng hết lượt mã `BIGBUY`.
4. Tổng đơn hàng bằng đúng `500000`.

## Test steps: 
1. Đăng nhập bằng tài khoản `test@eshop.com`.
2. Vào Checkout với tổng đơn hàng bằng đúng `500000`.
3. Nhập mã giảm giá `BIGBUY`.
4. Bấm `Áp dụng`.
5. Quan sát response.

## Expected results: 
1. Hệ thống chấp nhận áp dụng mã vì `total_amount = min_order_amount`.
2. `discount_amount = 50000`.
3. `final_amount = 450000`.

## Actual results: 
1. Backend chỉ cho áp dụng khi `total_amount > coupon.min_order_amount`.
2. Với tổng đơn hàng bằng đúng ngưỡng, API trả lỗi chưa đủ giá trị tối thiểu.
3. Điều kiện C3 trong FR-09 bị triển khai sai vì thiếu trường hợp bằng ngưỡng.

### Bug screenshot: 

Không có screenshot giao diện. Bug được xác định qua API và code tại `backend/server.js`, endpoint `POST /api/apply-coupon`.
