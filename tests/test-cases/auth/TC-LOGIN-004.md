# TC-LOGIN-004: Đăng nhập thất bại khi để trống các trường

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Boundary Value Analysis

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.

## Test data
| Case | Email | Mật khẩu |
| --- | --- | --- |
| A | (trống) | Test1234! |
| B | test@eshop.com | (trống) |
| C | (trống) | (trống) |

## Test steps
1. Mở trang Đăng nhập.
2. Với mỗi case (A, B, C): nhập dữ liệu tương ứng.
3. Bấm nút Đăng nhập.

## Expected result
- Với cả 3 case, form không được submit (HTML5 `required` validation chặn).
- Hệ thống hiển thị thông báo yêu cầu nhập trường còn thiếu.
- Không có request nào gửi đến API.

## Status / Related bugs
Not Run / None
