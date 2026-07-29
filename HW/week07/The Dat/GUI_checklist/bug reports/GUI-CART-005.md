# Bug ID: `GUI-CART-005`

## Bug description:
Sai nhãn text của mục tính tổng tiền ở giỏ hàng. Hệ thống đang hiển thị "Tổng tạm tính:" thay vì "Tổng cộng:".

## Test case coverage: 

- `GUI-CART-005` (Kiểm tra nhãn tính tổng tiền)

## Preconditions: 
- Có ít nhất 1 sản phẩm trong giỏ hàng.

## Test steps: 
1. Thêm sản phẩm vào giỏ và vào trang Giỏ hàng.
2. Cuộn xuống phần tính tổng tiền ở dưới cùng của bảng giỏ hàng.

## Expected results: 
Nhãn hiển thị tổng tiền phải ghi chính xác là "**Tổng cộng:**" (không được dùng từ "Tổng tạm tính").

## Actual results: 
Nhãn đang hiển thị là "**Tổng tạm tính:**".

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CART-005.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối (Ví dụ: `![Mô tả ảnh](./images/GUI-CART-005.png)`)
