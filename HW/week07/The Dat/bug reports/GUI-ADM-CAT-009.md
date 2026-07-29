# Bug ID: `GUI-ADM-CAT-009`

## Bug description:
Màn hình Quản lý Danh mục phân hệ Web Admin không hiển thị thanh điều hướng phân cấp (Breadcrumb), vi phạm tiêu chuẩn thiết kế FR-23.

## Test case coverage: 
- `GUI-ADM-CAT-009` (Kiểm tra sự tồn tại của thành phần Breadcrumb trên trang Quản lý Danh mục)

## Preconditions: 
- Admin đang xem trang Quản lý Danh mục.

## Test steps: 
1. Truy cập tab "Danh mục" trong Web Admin.
2. Kiểm tra vùng trên cùng của giao diện làm việc.

## Expected results: 
Hiển thị Breadcrumb rõ ràng giúp định vị vị trí thao tác của Admin (ví dụ: `Dashboard > Quản lý danh mục`).

## Actual results: 
Giao diện không có thành phần Breadcrumb nào được render.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-ADM-CAT-009.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Thiếu Breadcrumb trang Quản lý Danh mục](./images/GUI-ADM-CAT-009.png)`
