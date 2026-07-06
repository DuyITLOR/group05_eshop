# Bug ID: `FR10-bug-02`

## Bug description:
Khách hàng (User) vẫn có thể tự hủy đơn hàng khi trạng thái đơn hàng đã chuyển sang đang giao (`shipping`). Trái ngược với đặc tả (khi đơn hàng đã ở trạng thái shipping, User không được phép tự hủy).

## Test case coverage: 
- `TC-FR10-48` (User tự hủy đơn hàng đang shipping thất bại)

## Preconditions: 
1. Tài khoản đăng nhập là User thông thường (`test@eshop.com` / `Test1234!`).
2. Đã có một đơn hàng test thuộc sở hữu của User này với trạng thái hiện tại là `shipping`.

## Test steps: 
1. Gửi yêu cầu hủy đơn hàng thông qua endpoint `PUT /api/orders/:id/cancel`.

## Expected results: 
1. Hệ thống từ chối yêu cầu, trả về HTTP status 400 Bad Request.
2. Trạng thái đơn hàng trong DB giữ nguyên là `shipping`.

## Actual results: 
1. Yêu cầu thành công với mã phản hồi HTTP 200 OK.
2. Trạng thái đơn hàng được cập nhật thành `canceled` trong Cơ sở dữ liệu.
