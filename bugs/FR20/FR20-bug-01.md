# Bug ID: `FR20-bug-01`

## Bug description:
API backend hủy đơn hàng (`PUT /api/orders/:id/cancel`) không kiểm tra và chặn trường hợp đơn hàng đang ở trạng thái "Đang giao" (`shipping`). Người dùng vẫn có thể gửi yêu cầu hủy trực tiếp đến API để chuyển đổi trạng thái đơn hàng đang đi giao thành "Đã hủy" (`canceled`), vi phạm đặc tả của sơ đồ chuyển đổi trạng thái đơn hàng (State Machine).

## Test case coverage: 
- `TC-D9-11` (Người dùng cố gắng hủy đơn hàng ở trạng thái `shipping` bằng API)

## Preconditions: 
1. Người dùng đã đăng nhập tài khoản khách hàng và lấy JWT Token hợp lệ.
2. Có đơn hàng thuộc sở hữu của người dùng đang ở trạng thái `shipping` (Đang giao) trong hệ thống.

## Test steps: 
1. Gửi yêu cầu HTTP PUT tới API `/api/orders/{orderId}/cancel` với token xác thực hợp lệ của người dùng để cố gắng hủy đơn hàng đang ở trạng thái `shipping`.
2. Kiểm tra phản hồi trả về từ API và kiểm tra trạng thái đơn hàng trong cơ sở dữ liệu.

## Expected results: 
1. Hệ thống từ chối yêu cầu và trả về lỗi `HTTP 400 Bad Request` kèm thông báo lỗi phù hợp (Ví dụ: "Cannot cancel this order." hoặc "Không thể hủy đơn.").
2. Đơn hàng trong cơ sở dữ liệu giữ nguyên trạng thái cũ là `shipping`.

## Actual results: 
1. API phản hồi thành công với `HTTP 200 OK` và trả về `{"message":"Order canceled successfully"}`.
2. Trạng thái đơn hàng trong cơ sở dữ liệu bị cập nhật trái phép thành `canceled`.

### Bug screenshot: 
*(Không yêu cầu chụp ảnh màn hình)*
