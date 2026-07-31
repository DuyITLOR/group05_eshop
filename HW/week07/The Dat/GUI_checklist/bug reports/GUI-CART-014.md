# Bug ID: `GUI-CART-014`

## Bug description:
Bảng sản phẩm trong trang Giỏ hàng không hiển thị Hình ảnh thu nhỏ và thẻ `alt`. Cột sản phẩm chỉ hiển thị tên bằng text.

## Test case coverage: 

- `GUI-CART-014` (Kiểm tra hiển thị ảnh sản phẩm và thẻ `alt` trong giỏ hàng)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Thêm sản phẩm vào giỏ và truy cập Giỏ hàng.
2. Quan sát cột "Sản phẩm" trong bảng hiển thị danh sách.

## Expected results: 
Hiển thị hình ảnh thu nhỏ của sản phẩm rõ ràng, đồng thời hình ảnh đó bắt buộc phải có thuộc tính `alt`.

## Actual results: 
Chỉ hiển thị text tên sản phẩm, hoàn toàn không có thẻ `<img>` nào được render.

## Severity: 
Major

## Priority: 
High

### Bug screenshot: 

![Thiếu hình ảnh thumbnail và thẻ alt sản phẩm](./images/GUI-CART-014.png)
