# Bug ID: `GUI-CHK-010`

## Bug description:
Thanh điều hướng chung (Navbar Header) không phản ánh trạng thái làm nổi bật (highlight / active state) khi người dùng đang truy cập route Thanh toán (`/checkout`), vi phạm quy chuẩn FR-23.

## Test case coverage: 
- `GUI-CHK-010` (Kiểm tra trạng thái Highlight của Navbar menu trên trang Thanh toán)

## Preconditions: 
- Người dùng đang ở đường dẫn `/checkout`.

## Test steps: 
1. Truy cập trang Thanh toán (`http://localhost:5173/checkout`).
2. Quan sát thanh Header/Navbar phía trên cùng màn hình.

## Expected results: 
Menu hoặc đường dẫn liên quan đến Thanh toán / Giỏ hàng trên Navbar được đổi màu/thêm viền/active style để báo hiệu người dùng đang ở bước này.

## Actual results: 
Navbar chỉ chứa các liên kết tĩnh (`<Link to="/cart">Giỏ hàng</Link>`) mà không có bất kỳ trạng thái highlight hay active class nào khi đang ở route `/checkout`.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

![Không highlight menu Navbar](./images/GUI-CHK-010.png)
