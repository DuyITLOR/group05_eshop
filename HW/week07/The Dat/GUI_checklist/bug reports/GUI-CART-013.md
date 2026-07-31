# Bug ID: `GUI-CART-013`

## Bug description:
Nhãn của nút điều hướng quay về trang chủ hiển thị sai chữ so với đặc tả (Hiện "Mua tiếp" thay vì "Tiếp tục mua sắm").

## Test case coverage: 

- `GUI-CART-013` (Kiểm tra nút Tiếp tục mua sắm)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Vào trang Giỏ hàng có chứa sản phẩm.
2. Cuộn xuống cuối trang và quan sát nút điều hướng nằm cạnh nút Thanh toán.

## Expected results: 
Nút điều hướng về trang chủ phải có nhãn là "**Tiếp tục mua sắm**".

## Actual results: 
Nút đang hiển thị nhãn "**← Mua tiếp**".

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

![Sai nhãn Mua tiếp thay vì Tiếp tục mua sắm](./images/GUI-CART-013.png)
