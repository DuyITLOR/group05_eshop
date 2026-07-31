# Bug ID: `GUI-CART-006`

## Bug description:
Nút "Tiến hành thanh toán" sai màu sắc chuẩn. Đặc tả yêu cầu nút hành động tích cực dùng màu xanh dương nhưng giao diện đang dùng màu xanh lá.

## Test case coverage: 

- `GUI-CART-006` (Kiểm tra màu sắc nút thao tác chính/tích cực)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Truy cập trang Giỏ hàng có chứa sản phẩm.
2. Quan sát màu nền của nút "Tiến hành thanh toán" ở góc dưới.

## Expected results: 
Nút hành động tích cực phải có màu **xanh dương** (blue).

## Actual results: 
Nút "Tiến hành thanh toán" đang được hiển thị bằng màu **xanh lá** (`bg-green-500`).

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

![Nút thanh toán màu xanh lá thay vì xanh dương](./images/GUI-CART-006.png)
