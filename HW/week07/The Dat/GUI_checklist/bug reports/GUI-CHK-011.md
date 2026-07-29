# Bug ID: `GUI-CHK-011`

## Bug description:
Màn hình phản hồi trạng thái "Thanh toán thành công!" sử dụng thẻ tiêu đề `<h2 className="text-3xl text-green-600 ...">` thay vì thẻ `<h1>` duy nhất, đồng thời thiếu biểu tượng/hình ảnh minh họa trực quan cho trạng thái hoàn tất thành công.

## Test case coverage: 
- `GUI-CHK-011` (Kiểm tra thẻ H1 và hình ảnh minh họa trên màn hình Thanh toán thành công)

## Preconditions: 
- Người dùng vừa thực hiện thành công thao tác xác nhận thanh toán.

## Test steps: 
1. Nhấn nút "Xác Nhận Thanh Toán" để hoàn tất đơn hàng.
2. Quan sát giao diện thông báo thành công hiển thị.
3. Mở Inspect Element kiểm tra thẻ HTML tiêu đề "Thanh toán thành công!".

## Expected results: 
- Tiêu đề thông báo "Thanh toán thành công!" phải sử dụng thẻ `<h1>` chuẩn.
- Có icon (ví dụ checkmark xanh) hoặc hình minh họa trực quan thân thiện báo hiệu thành công.

## Actual results: 
- Tiêu đề bọc trong thẻ `<h2>`.
- Chỉ hiển thị chữ thuần túy, hoàn toàn thiếu icon/hình ảnh minh họa.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CHK-011.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Màn hình thành công thiếu H1 và icon](./images/GUI-CHK-011.png)`
