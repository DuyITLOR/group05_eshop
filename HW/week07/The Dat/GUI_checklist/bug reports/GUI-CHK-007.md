# Bug ID: `GUI-CHK-007`

## Bug description:
Form nhập liệu/xác nhận thông tin trên trang Thanh toán không hiển thị ký hiệu `*` bên cạnh nhãn (label) của các trường thông tin bắt buộc theo quy định FR-22.

## Test case coverage: 
- `GUI-CHK-007` (Kiểm tra ký hiệu bắt buộc * trên biểu mẫu)

## Preconditions: 
- Người dùng đang ở trang Thanh toán (`/checkout`).

## Test steps: 
1. Truy cập trang Thanh toán (`/checkout`).
2. Quan sát các nhãn (label) của các ô nhập liệu (ví dụ: Tổng tiền thanh toán, Mã Giảm Giá).

## Expected results: 
Tất cả các trường dữ liệu bắt buộc trong form phải có dấu `*` màu đỏ bên cạnh nhãn (ví dụ: `Tổng tiền thanh toán *`).

## Actual results: 
Các nhãn hiển thị không có ký hiệu `*` đánh dấu trường bắt buộc.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CHK-007.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Thiếu ký hiệu bắt buộc asterisk](./images/GUI-CHK-007.png)`
