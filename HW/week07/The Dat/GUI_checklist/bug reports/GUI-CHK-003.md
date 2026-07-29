# Bug ID: `GUI-CHK-003`

## Bug description:
Nút hành động chính "Xác Nhận Thanh Toán" đang hiển thị màu xanh lá cây (`bg-green-600`) thay vì tuân thủ màu xanh dương (primary action color) theo quy chuẩn giao diện hệ thống.

## Test case coverage: 
- `GUI-CHK-003` (Kiểm tra màu sắc nút hành động chính trên trang Thanh toán)

## Preconditions: 
- Người dùng đang ở trang Thanh toán (`/checkout`).

## Test steps: 
1. Điều hướng tới trang Thanh toán (`/checkout`).
2. Quan sát màu sắc của nút "Xác Nhận Thanh Toán" ở cuối form.

## Expected results: 
Nút hành động chính tích cực (Submit / Thanh toán) phải có màu xanh dương (`bg-blue-600` hoặc tương đương) theo quy chuẩn thiết kế chung (FR-21).

## Actual results: 
Nút "Xác Nhận Thanh Toán" đang sử dụng class `bg-green-600` (màu xanh lá cây).

## Severity: 
Minor

## Priority: 
Medium

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CHK-003.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Sai màu sắc nút Xác nhận thanh toán](./images/GUI-CHK-003.png)`
