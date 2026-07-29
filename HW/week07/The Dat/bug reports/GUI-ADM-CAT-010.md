# Bug ID: `GUI-ADM-CAT-010`

## Bug description:
Khi nhấn nút "Xóa" một danh mục trong bảng dữ liệu, hệ thống ngay lập tức gọi API xóa mà không hiển thị Hộp thoại (Modal / Dialog) yêu cầu người dùng xác nhận trước khi thực hiện hành động nguy hiểm này (vi phạm tiêu chuẩn FR-24).

## Test case coverage: 
- `GUI-ADM-CAT-010` (Kiểm tra Hộp thoại xác nhận khi thực hiện xóa danh mục)

## Preconditions: 
- Có ít nhất 1 danh mục trong danh sách.

## Test steps: 
1. Điều hướng đến màn hình Quản lý Danh mục.
2. Tìm một danh mục và nhấn nút "Xóa" tương ứng.

## Expected results: 
Hiển thị một Dialog/Modal cảnh báo (ví dụ: "Bạn có chắc chắn muốn xóa danh mục này không?") kèm 2 nút "Xác nhận" và "Hủy".

## Actual results: 
Hệ thống kích hoạt trực tiếp hàm `deleteCategory(c.id)` và xóa mục khỏi CSDL mà không có bước xác nhận nào.

## Severity: 
Major

## Priority: 
High

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-ADM-CAT-010.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Thiếu Dialog xác nhận khi xóa danh mục](./images/GUI-ADM-CAT-010.png)`
