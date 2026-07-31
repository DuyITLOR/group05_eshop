# Bug ID: `GUI-CART-015`

## Bug description:
Hệ thống xóa thẳng sản phẩm khỏi giỏ hàng khi nhấn nút "Xóa" mà không có hộp thoại (Dialog) xác nhận.

## Test case coverage: 

- `GUI-CART-015` (Kiểm tra hộp thoại xác nhận khi xóa sản phẩm)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Tại trang Giỏ hàng, click vào nút "Xóa" màu đỏ ở cột Thao tác.
2. Quan sát phản hồi của giao diện sau khi click.

## Expected results: 
Phải xuất hiện một Dialog yêu cầu người dùng xác nhận "Bạn có chắc chắn muốn xóa không?" trước khi thực sự xóa sản phẩm.

## Actual results: 
Sản phẩm bị xóa khỏi giỏ hàng NGAY LẬP TỨC mà không có bất kỳ bước hỏi xác nhận nào.

## Severity: 
Major

## Priority: 
High

### Bug screenshot: 

![Xóa sản phẩm không qua dialog xác nhận](./images/GUI-CART-015.png)
