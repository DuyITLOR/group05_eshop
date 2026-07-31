# Bug ID: `GUI-CART-001`

## Bug description:
Sử dụng sai thẻ tiêu đề (Heading) cho trang Giỏ hàng. Tiêu đề đang nằm trong thẻ H2 thay vì H1 như đặc tả yêu cầu giao diện.

## Test case coverage: 

- `GUI-CART-001` (Kiểm tra thẻ tiêu đề H1 của trang Giỏ hàng)

## Preconditions: 
- Ứng dụng Frontend đang chạy bình thường.

## Test steps: 
1. Điều hướng đến trang Giỏ hàng (`/cart`).
2. Mở Developer Tools (F12) để Inspect Element phần tiêu đề "Giỏ Hàng".

## Expected results: 
Tiêu đề trang phải được bọc trong thẻ `<h1>` duy nhất để đảm bảo chuẩn HTML.

## Actual results: 
Tiêu đề "Giỏ Hàng" đang được bọc trong thẻ `<h2>`.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

![Sai thẻ tiêu đề H2 cho trang Giỏ hàng](./images/GUI-CART-001.png)
