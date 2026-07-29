# Bug ID: `GUI-CHK-009`

## Bug description:
Trang Thanh toán (`/checkout`) không hiển thị thanh điều hướng phân cấp (Breadcrumb) để giúp người dùng nhận biết vị trí hiện tại trong luồng mua sắm (vi phạm tiêu chuẩn FR-23).

## Test case coverage: 
- `GUI-CHK-009` (Kiểm tra sự tồn tại của thành phần Breadcrumb trên trang Thanh toán)

## Preconditions: 
- Người dùng đang truy cập trang Thanh toán (`/checkout`).

## Test steps: 
1. Điều hướng đến trang Thanh toán (`/checkout`).
2. Mở Developer Tools hoặc quan sát phần trên cùng của vùng nội dung trang.

## Expected results: 
Hiển thị Breadcrumb rõ ràng phía dưới Header/Navbar (ví dụ: `Trang chủ > Giỏ hàng > Thanh toán`).

## Actual results: 
Giao diện hoàn toàn không có thành phần Breadcrumb nào.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CHK-009.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Thiếu Breadcrumb trang Thanh toán](./images/GUI-CHK-009.png)`
