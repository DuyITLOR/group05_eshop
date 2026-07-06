# Bug ID: `FR09-bug-03`

## Bug description:
Hệ thống kiểm tra điều kiện ngưỡng đơn hàng trước điều kiện hết hạn, làm sai thứ tự ưu tiên lỗi trong Decision Table. Với trường hợp mã đã hết hạn đồng thời tổng đơn hàng chưa đủ ngưỡng, test design yêu cầu trả lỗi hết hạn theo Rule_03. Tuy nhiên code hiện tại kiểm tra `total_amount > coupon.min_order_amount` trước, nên trả lỗi chưa đủ giá trị tối thiểu.

## Test case coverage: 

- `TC-FR09-DTT-009` (Ưu tiên lỗi hết hạn khi nhiều điều kiện sau xác thực cùng fail)

## Preconditions: 
1. User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
2. Mã `EXPIRED` tồn tại, active, `expired_at = 2020-01-01`.
3. Ngày kiểm thử sau ngày hết hạn của mã.
4. Tổng đơn hàng là `50000`, nhỏ hơn `min_order_amount = 100000`.

## Test steps: 
1. Đăng nhập bằng tài khoản `test@eshop.com`.
2. Vào Checkout với tổng đơn hàng `50000`.
3. Nhập mã `EXPIRED`.
4. Bấm `Áp dụng`.
5. Quan sát lỗi trả về.

## Expected results: 
1. Hệ thống từ chối áp dụng coupon vì mã đã hết hạn.
2. Response trả lỗi hết hạn, ví dụ `Mã giảm giá đã hết hạn`.
3. Không tính giảm giá và không ghi nhận usage.

## Actual results: 
1. Backend kiểm tra ngưỡng đơn hàng trước khi kiểm tra hạn dùng.
2. API trả lỗi `Đơn hàng chưa đủ giá trị tối thiểu 100000 ₫ để áp dụng mã này`.
3. Lỗi trả về không đúng Rule_03 trong decision table khi nhiều điều kiện cùng fail.

### Bug screenshot: 

Không có screenshot giao diện. Bug được xác định qua API và code tại `backend/server.js`, endpoint `POST /api/apply-coupon`.
