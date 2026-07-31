# Bug ID: `GUI-CART-002`

## Bug description:
Tiêu đề cột hiển thị giá của sản phẩm trong bảng giỏ hàng sai so với đặc tả (Dùng "Giá" thay vì "Đơn giá").

## Test case coverage: 

- `GUI-CART-002` (Kiểm tra tiêu đề các cột bảng sản phẩm trong giỏ hàng)

## Preconditions: 
- Đã đăng nhập hoặc sử dụng ứng dụng bình thường. Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Thêm 1 sản phẩm vào giỏ hàng.
2. Truy cập trang Giỏ hàng và quan sát bảng danh sách sản phẩm.

## Expected results: 
Tiêu đề cột hiển thị chính xác theo requirement là: "Sản phẩm", "**Đơn giá**", "Số lượng", "Thành tiền", "Thao tác".

## Actual results: 
Tiêu đề cột đang hiển thị là "**Giá**" thay vì "Đơn giá".

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

![Sai tiêu đề cột Giá thay vì Đơn giá](./images/GUI-CART-002.png)
