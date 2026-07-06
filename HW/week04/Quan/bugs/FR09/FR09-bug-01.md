# Bug ID: `FR09-bug-01`

## Bug description:
Hệ thống tính sai số tiền giảm đối với coupon loại `percent`. Theo FR-09, công thức đúng phải là `discount_amount = total x discount_value / 100`. Tuy nhiên trong `backend/server.js`, hệ thống đang tính `discount_amount = total_amount * (1 - coupon.discount_value)`, làm số tiền giảm bị âm rất lớn khi `discount_value > 1`.

## Test case coverage: 

- `TC-FR09-DTT-001` (Áp dụng mã percent khi tất cả điều kiện đều đúng)

## Preconditions: 
1. User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
2. Mã `SAVE10` tồn tại, đang active, type `percent`, `discount_value = 10`, `min_order_amount = 300000`, `expired_at = 2099-12-31`.
3. User chưa dùng hết lượt mã `SAVE10`.
4. Tổng đơn hàng là `500000`.

## Test steps: 
1. Đăng nhập bằng tài khoản `test@eshop.com`.
2. Vào trang Checkout với tổng đơn hàng `500000`.
3. Nhập mã giảm giá `SAVE10`.
4. Bấm `Áp dụng`.
5. Quan sát `discount_amount` và `final_amount` trả về.

## Expected results: 
1. Coupon được áp dụng thành công.
2. `discount_amount = 500000 x 10 / 100 = 50000`.
3. `final_amount = 500000 - 50000 = 450000`.

## Actual results: 
1. API áp dụng coupon thành công nhưng tính sai tiền giảm.
2. Với `SAVE10`, backend tính `discount_amount = 500000 x (1 - 10) = -4500000`.
3. `final_amount = 500000 - (-4500000) = 5000000`, làm tổng thanh toán tăng lên thay vì giảm.
4. Nguyên nhân nằm ở `backend/server.js`, logic xử lý coupon type `percent`.

### Bug screenshot: 

Không có screenshot giao diện. Bug được xác định qua API và code tại `backend/server.js`, endpoint `POST /api/apply-coupon`.
