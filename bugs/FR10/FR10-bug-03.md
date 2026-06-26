# Bug ID: `FR10-bug-03`

## Bug description:
API Admin cập nhật trạng thái đơn hàng cho phép chuyển đổi từ trạng thái kết thúc `canceled` sang trạng thái kết thúc khác `delivered`. Theo đặc tả FR-10: "Trạng thái `delivered` và `canceled` là trạng thái kết thúc — không được phép chuyển sang bất kỳ trạng thái nào khác."

## Test case coverage: 
- `TC-FR10-12` (Admin cập nhật từ trạng thái kết thúc `canceled` sang trạng thái khác (`canceled` -> `confirmed`))
 

## Preconditions: 
1. Đăng nhập hệ thống với tài khoản Admin (`admin@eshop.com` / `Admin123!`) và lấy JWT Token Admin.
2. Có một đơn hàng trong hệ thống ở trạng thái `canceled` (Ví dụ: ID đơn hàng = 1).

## Test steps: 
1. Gửi request `PUT /api/admin/orders/1/status` với Header `Authorization: Bearer <admin_token>`.
2. Body gửi kèm: `{"status": "delivered"}`.
3. Kiểm tra response và kiểm tra trạng thái đơn hàng trong cơ sở dữ liệu.

## Expected results: 
1. API trả về mã lỗi `HTTP 400 Bad Request` hoặc thông báo lỗi chuyển trạng thái không hợp lệ.
2. Trạng thái đơn hàng trong DB không thay đổi (vẫn giữ nguyên là `canceled`).

## Actual results: 
1. API trả về `HTTP 200 OK` với body: `{"message":"Order status updated"}`.
2. Trạng thái đơn hàng trong DB bị thay đổi thành `delivered`.
3. Đoạn mã lỗi trong `backend/server.js` (dòng 550-551):
   ```javascript
   if (currentStatus === "canceled" && status === "delivered")
     isValidTransition = true;
   ```

### Bug screenshot: 
*(Lỗi logic Backend API, không có giao diện hiển thị trực tiếp)*
