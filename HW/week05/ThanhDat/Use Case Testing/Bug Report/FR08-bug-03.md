# Bug ID: `FR08-bug-03`

## Bug description:
Giỏ hàng **không được xóa** sau khi thanh toán thành công, vi phạm FR-08 ("Sau thanh toán thành công, giỏ hàng được xóa"). Ở frontend, hàm `handleCheckout` có import `clearCart` nhưng không bao giờ gọi; ở backend, handler `POST /api/checkout` chỉ chèn đơn hàng mà không đụng tới `userCarts`. Hệ quả: sau khi đặt hàng, người dùng quay lại giỏ vẫn thấy nguyên sản phẩm cũ, dễ dẫn tới đặt trùng.

## Test case coverage:
- `TC-CHECKOUT-07` (Đặt hàng thành công end-to-end — kiểm tra giỏ rỗng sau thanh toán)
- `TC-CHECKOUT-08` (Guest → login → hoàn tất thanh toán — kiểm tra giỏ rỗng sau thanh toán)

## Preconditions:
1. Người dùng đã đăng nhập, giỏ hàng có ít nhất 1 sản phẩm.

## Test steps:
1. Đăng nhập, thêm sản phẩm vào giỏ.
2. Vào Checkout, nhấn "Xác Nhận Thanh Toán" đến khi hiển thị "Thanh toán thành công!".
3. Quay lại trang Giỏ hàng (hoặc gọi `GET /api/cart`).

## Expected results:
Giỏ hàng rỗng sau khi thanh toán thành công (cả trên UI lẫn qua API).

## Actual results:
Giỏ hàng vẫn còn nguyên sản phẩm. Không có lời gọi `clearCart()` sau khi checkout thành công, và backend không xóa `userCarts[userId]`.

Dẫn chứng code:
- `frontend-web/src/pages/Checkout.jsx:40–66` — `handleCheckout` chỉ `setSuccess(true)`, không gọi `clearCart()` (dù đã import ở dòng 8).
- `backend/server.js:297–309` — handler checkout chỉ `INSERT INTO orders`, không thao tác `userCarts`.

### Bug screenshot:
- Chưa có ảnh — kết quả suy ra từ phân tích code tĩnh. Khi chạy thật, chụp trang Giỏ hàng vẫn còn sản phẩm sau thanh toán và lưu tại `./bugs/FR08/images/FR08-bug-03.png`.
- (Nhúng khi có ảnh) `![Giỏ hàng không bị xóa](./images/FR08-bug-03.png)`

## Đề xuất mức độ (tham khảo)
Severity: Major · Priority: P1. Sửa: gọi `clearCart()` sau khi checkout thành công ở frontend, và/hoặc xóa `userCarts[userId]` ở backend sau khi tạo đơn.
