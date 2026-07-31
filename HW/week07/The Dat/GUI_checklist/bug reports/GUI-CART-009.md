# Bug ID: `GUI-CART-009`

## Bug description:
Cột số lượng trong bảng sản phẩm giỏ hàng thiếu form nhập liệu và nút Tăng/Giảm (+/-).

## Test case coverage: 

- `GUI-CART-009` (Kiểm tra nút điều chỉnh số lượng)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Thêm sản phẩm vào giỏ và vào trang Giỏ hàng.
2. Quan sát cột "Số lượng" của sản phẩm trong bảng.

## Expected results: 
Có ô nhập liệu và các nút `+` , `-` trực quan để người dùng điều chỉnh số lượng ngay trong giỏ hàng.

## Actual results: 
Cột số lượng chỉ hiển thị số dạng text tĩnh (ví dụ: "1"), không có bất kỳ nút bấm hay input nào để thay đổi số lượng. Người dùng không thể đổi số lượng từ trang `/cart`.

## Severity: 
Major

## Priority: 
High

### Bug screenshot: 

![Cột số lượng thiếu nút tăng giảm](./images/GUI-CART-009.png)
