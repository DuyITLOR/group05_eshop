# Bug ID: `FR10-bug-01`

## Bug description:
API Admin cập nhật trạng thái đơn hàng (`PUT /api/admin/orders/:id/status`) không kiểm tra quyền admin (`role === 'admin'`). Người dùng có tài khoản thông thường (role = 'user') vẫn có thể gọi API này để thay đổi trạng thái của bất kỳ đơn hàng nào trong hệ thống.

## Test case coverage: 
- [TC-FR10-14](file:///d:/group05_eshop/tests/test-cases/FR10/TC-FR10-14.md)

## Preconditions: 
1. Đăng nhập hệ thống với tài khoản User thường (`test@eshop.com` / `Test1234!`) và lấy JWT Token của User thường.
2. Có một đơn hàng tồn tại trong hệ thống ở trạng thái `pending` (Ví dụ: ID đơn hàng = 1).

## Test steps: 
1. Gửi request `PUT /api/admin/orders/1/status` với Header `Authorization: Bearer <user_token>`.
2. Body gửi kèm: `{"status": "confirmed"}`.
3. Kiểm tra response và kiểm tra trạng thái đơn hàng trong cơ sở dữ liệu.

## Expected results: 
1. API trả về mã lỗi `HTTP 403 Forbidden`.
2. Trạng thái đơn hàng trong DB không bị thay đổi (vẫn giữ nguyên `pending`).

## Actual results: 
1. API trả về `HTTP 200 OK` với body: `{"message":"Order status updated"}`.
2. Trạng thái đơn hàng trong DB bị thay đổi thành `confirmed`.

### Bug screenshot: 
*(Lỗi phân quyền phía Backend API, không có giao diện hiển thị lỗi)*
