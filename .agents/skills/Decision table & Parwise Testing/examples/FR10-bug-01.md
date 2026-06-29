# Bug ID: `FR10-bug-01`

## Bug description:
Hệ thống cho phép Admin cập nhật trạng thái đơn hàng đã hủy (`canceled`) sang đã giao hàng (`delivered`). Trái ngược với đặc tả (delivered và canceled là các trạng thái kết thúc, không được phép chuyển sang bất kỳ trạng thái nào khác).

## Test case coverage: 
- `TC-FR10-26` (Admin chuyển đơn hàng từ canceled sang delivered thất bại)

## Preconditions: 
1. Tài khoản đăng nhập có quyền Admin (`role = 'admin'`, sử dụng account mặc định `admin@eshop.com` / `Admin123!`).
2. Đã có một đơn hàng test với trạng thái hiện tại là `canceled`.

## Test steps: 
1. Gửi yêu cầu cập nhật trạng thái đơn hàng thông qua endpoint `PUT /api/admin/orders/:id/status` với body:
```json
{
  "status": "delivered"
}
```

## Expected results: 
1. Hệ thống từ chối yêu cầu, trả về HTTP status 400 Bad Request.
2. Response body chứa thông báo lỗi về việc chuyển đổi trạng thái không hợp lệ (`Invalid state transition...`).
3. Trạng thái đơn hàng trong DB giữ nguyên là `canceled`.

## Actual results: 
1. Yêu cầu thành công với mã phản hồi HTTP 200 OK.
2. Trạng thái đơn hàng được chuyển sang `delivered` thành công.
3. Response body: `{"message":"Order status updated"}`.
