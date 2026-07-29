# Bug ID: `GUI-ADM-CAT-007`

## Bug description:
Khi xảy ra lỗi trong thao tác thêm hoặc xóa danh mục, hệ thống sử dụng cửa sổ bật lên `alert()` của trình duyệt thay vì render thông báo lỗi dạng UI component phía trên nút submit theo quy định FR-22.

## Test case coverage: 
- `GUI-ADM-CAT-007` (Kiểm tra hình thức và vị trí hiển thị thông báo lỗi trên form Danh mục)

## Preconditions: 
- Admin đang ở màn hình Quản lý Danh mục.

## Test steps: 
1. Nhấn nút "Thêm mới" khi để trống tên danh mục hoặc khi server gặp sự cố.
2. Quan sát cách hệ thống hiển thị thông báo lỗi.

## Expected results: 
Thông báo lỗi phải hiển thị trực tiếp trên giao diện (inline UI error message), đặt ở vị trí phía trên nút Submit.

## Actual results: 
Hệ thống gọi `alert("Lỗi thêm DM: " + err.message)` gây gián đoạn trải nghiệm người dùng.

## Severity: 
Major

## Priority: 
Medium

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-ADM-CAT-007.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối: `![Sử dụng alert trình duyệt khi bị lỗi](./images/GUI-ADM-CAT-007.png)`
