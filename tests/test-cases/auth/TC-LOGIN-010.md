# TC-LOGIN-010: Kiểm tra tiêu đề trang Đăng nhập hiển thị đúng

## Requirement ID
FR-02

## Module / Test type / Technique
Login / UI / Inspection

## Preconditions
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
Không cần dữ liệu nhập.

## Test steps
1. Mở trang Đăng nhập (`/login`).
2. Quan sát tiêu đề (heading) hiển thị trên form.
3. Quan sát label của các trường nhập liệu.

## Expected result
- Tiêu đề form phải hiển thị "Đăng Nhập" (không phải "Đăng Ký").
- Label trường email phải hiển thị "Email" (không phải "Username").
- Nội dung trang phải nhất quán với chức năng đăng nhập.

## Status / Related bugs
Not Run / None
