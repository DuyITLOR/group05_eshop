# TC-LOGIN-008: Kiểm tra trường Email sử dụng type="email"

## Requirement ID
FR-02

## Module / Test type / Technique
Login / UI / Inspection

## Preconditions
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
| Field | Value |
| --- | --- |
| Email | emailkhonghople |

## Test steps
1. Mở trang Đăng nhập.
2. Kiểm tra thuộc tính `type` của trường nhập Email trong DOM (Inspect Element).
3. Nhập giá trị không đúng format email (ví dụ: "emailkhonghople").
4. Bấm nút Đăng nhập.

## Expected result
- Trường Email phải có `type="email"` để kích hoạt HTML5 validation.
- Khi nhập email không đúng format, trình duyệt hiển thị cảnh báo validation trước khi submit form.

## Status / Related bugs
Not Run / None
