# TC-LOGIN-012: Kiểm tra điều hướng link "Quên mật khẩu" và "Đăng ký ngay"

## Requirement ID
FR-02

## Module / Test type / Technique
Login / UI / Functional

## Preconditions
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
Không cần dữ liệu nhập.

## Test steps
1. Mở trang Đăng nhập (`/login`).
2. Bấm link "Quên mật khẩu?".
3. Kiểm tra trang được chuyển đến.
4. Quay lại trang Đăng nhập.
5. Bấm link "Đăng ký ngay".
6. Kiểm tra trang được chuyển đến.

## Expected result
- Link "Quên mật khẩu?" chuyển đến trang `/forgot-password`.
- Link "Đăng ký ngay" chuyển đến trang `/register`.
- Cả hai link hoạt động đúng, không bị lỗi 404 hay blank page.

## Status / Related bugs
Not Run / None
