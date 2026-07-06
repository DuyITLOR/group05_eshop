# Bug ID: `FR09-bug-02`

## Bug description:
API áp dụng mã giảm giá (`POST /api/apply-coupon`) không yêu cầu JWT token hợp lệ. Theo FR-09, điều kiện C4 bắt buộc người dùng phải đăng nhập và có JWT hợp lệ trước khi áp dụng coupon. Tuy nhiên endpoint hiện tại không dùng middleware `authenticateToken`, đồng thời cho phép request không có `user_id` vẫn được tính giảm giá.

## Test case coverage: 

- `TC-FR09-DTT-003` (Từ chối áp dụng coupon khi thiếu JWT)
- `TC-FR09-DTT-004` (Ưu tiên lỗi xác thực khi JWT sai và dữ liệu coupon cũng sai)

## Preconditions: 
1. Người dùng chưa đăng nhập hoặc request không gửi header `Authorization`.
2. Mã `BIGBUY` tồn tại, active, còn hạn, đủ điều kiện ngưỡng đơn hàng.
3. Tổng đơn hàng là `600000`.

## Test steps: 
1. Gửi request trực tiếp đến endpoint:
```http
POST /api/apply-coupon
Content-Type: application/json
```
2. Gửi body:
```json
{
  "code": "BIGBUY",
  "total_amount": 600000
}
```
3. Quan sát status code và response body.
4. Lặp lại với header `Authorization: Bearer invalid-token` và dữ liệu coupon sai để kiểm tra ưu tiên lỗi xác thực.

## Expected results: 
1. Hệ thống từ chối request do thiếu hoặc sai JWT token.
2. API trả về lỗi xác thực, ví dụ HTTP `401 Unauthorized` hoặc `403 Forbidden`.
3. Hệ thống không tính `discount_amount`, không trả `final_amount` đã giảm và không tiết lộ trạng thái mã coupon khi auth fail.

## Actual results: 
1. Endpoint `POST /api/apply-coupon` không kiểm tra JWT vì route không gắn middleware `authenticateToken`.
2. Khi không gửi token và mã coupon hợp lệ, API vẫn áp dụng coupon thành công.
3. Khi gửi token sai nhưng mã coupon không tồn tại, API xử lý dữ liệu coupon trước và trả lỗi mã không tồn tại thay vì lỗi xác thực.
4. Bug này làm điều kiện C4 của FR-09 không được thực thi.

### Bug screenshot: 

Không có screenshot giao diện. Bug được xác định qua API và code tại `backend/server.js`, endpoint `POST /api/apply-coupon`.
