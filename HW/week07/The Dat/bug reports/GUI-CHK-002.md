# Bug ID: `GUI-CHK-002`

## Bug description:
Trường "Tổng tiền thanh toán" cho phép người dùng tự do nhập/sửa số tiền trực tiếp qua ô input `type="number"`. Đồng thời nhãn ghi đơn vị là `(VND)` thay vì dùng định dạng chuẩn tiền tệ `₫` có phân cách hàng nghìn.

## Test case coverage: 
- `GUI-CHK-002` (Kiểm tra hiển thị và khả năng chỉnh sửa của trường Tổng tiền thanh toán)

## Preconditions: 
- Người dùng có sản phẩm trong giỏ hàng và mở trang Thanh toán (`/checkout`).

## Test steps: 
1. Điều hướng đến trang Thanh toán (`/checkout`).
2. Quan sát ô nhập "Tổng tiền thanh toán (VND)".
3. Thử thay đổi số tiền trong ô nhập liệu (ví dụ: thay đổi từ 500000 thành 1000).

## Expected results: 
- Tổng tiền thanh toán được tính tự động từ giỏ hàng và là trường **chỉ đọc (read-only / static text)**, người dùng không thể tự chỉnh sửa.
- Định dạng tiền tệ phải sử dụng đơn vị `₫` và phân cách hàng nghìn (ví dụ: `500,000 ₫`).

## Actual results: 
- Ô nhập liệu cho phép người dùng thay đổi giá trị số tiền trực tiếp (`<input type="number" value={editableTotal} ... />`).
- Hiển thị nhãn `(VND)` và số nguyên thô thay vì định dạng `₫` phân cách hàng nghìn.

## Severity: 
Critical

## Priority: 
High

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CHK-002.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Cho phép sửa tổng tiền thanh toán](./images/GUI-CHK-002.png)`
