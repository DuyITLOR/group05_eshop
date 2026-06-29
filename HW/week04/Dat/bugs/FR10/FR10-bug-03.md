# Bug ID: `FR10-bug-03`

## Bug description:
Hổng phân quyền nghiêm trọng trên API cập nhật trạng thái đơn hàng của Admin (`PUT /api/admin/orders/:id/status`). API này chỉ sử dụng middleware `authenticateToken` để xác thực sự tồn tại của Token mà không kiểm tra thuộc tính `req.user.role === 'admin'`, cho phép người dùng bình thường cập nhật trạng thái đơn hàng tùy ý.

## Test case coverage: 
- `TC-FR10-29` (User chuyển đơn hàng từ pending sang confirmed thất bại)
- `TC-FR10-34` (User chuyển đơn hàng từ confirmed sang shipping thất bại)
- `TC-FR10-39` (User chuyển đơn hàng từ shipping sang delivered thất bại)
- `TC-FR10-47` (User chuyển đơn hàng từ canceled sang delivered thất bại)

## Preconditions: 
1. Tài khoản đăng nhập là User thông thường (`test@eshop.com` / `Test1234!`).
2. Đã có một đơn hàng test với trạng thái ban đầu tương ứng.

## Test steps: 
1. Gửi yêu cầu cập nhật trạng thái đơn hàng bằng Token của User thông qua endpoint `PUT /api/admin/orders/:id/status` với body:
```json
{
  "status": "confirmed"
}
```

## Expected results: 
1. Hệ thống từ chối yêu cầu, trả về HTTP status 401 Unauthorized hoặc 403 Forbidden do tài khoản User gọi API Admin.
2. Trạng thái đơn hàng trong DB không bị thay đổi.

## Actual results: 
1. Yêu cầu thành công với mã phản hồi HTTP 200 OK.
2. Trạng thái đơn hàng trong DB bị thay đổi thành công theo giá trị truyền lên.
