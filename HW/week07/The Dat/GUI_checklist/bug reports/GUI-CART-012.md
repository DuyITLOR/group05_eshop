# Bug ID: `GUI-CART-012`

## Bug description:
Link "Giỏ hàng" trên Navbar không hiển thị Badge báo hiệu số lượng sản phẩm đang có trong giỏ hàng.

## Test case coverage: 

- `GUI-CART-012` (Kiểm tra badge giỏ hàng trên Navbar)

## Preconditions: 
- Ứng dụng Frontend đang chạy bình thường.

## Test steps: 
1. Đứng ở Trang chủ, click nút "Thêm vào giỏ hàng" cho 1 vài sản phẩm.
2. Quan sát link "Giỏ hàng" trên Navbar ở góc trên màn hình.

## Expected results: 
Navbar hiển thị Badge (nhãn đếm số) báo hiệu tổng số lượng sản phẩm đang có trong giỏ hàng.

## Actual results: 
Chỉ hiển thị text "Giỏ hàng", hoàn toàn không có badge số lượng.

## Severity: 
Major

## Priority: 
Medium

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CART-012.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối (Ví dụ: `![Mô tả ảnh](./images/GUI-CART-012.png)`)
