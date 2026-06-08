# TC-LOGIN-006: Đăng nhập khi tài khoản đang bị khóa

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.
- Tài khoản `test@eshop.com` đang bị khóa (`locked_until` > thời gian hiện tại).

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu | Test1234! |

## Test steps
1. Đảm bảo tài khoản đang bị khóa (đăng nhập sai 3+ lần trước đó).
2. Mở trang Đăng nhập.
3. Nhập Email và Mật khẩu **đúng**.
4. Bấm nút Đăng nhập.

## Expected result
- Đăng nhập thất bại dù mật khẩu đúng.
- API trả về status 403 với thông báo "Tài khoản đã bị khóa. Vui lòng thử lại sau."
- Thông báo lỗi không tiết lộ chi tiết nguyên nhân khóa.
- Người dùng vẫn ở trang Đăng nhập.

## Status / Related bugs
Not Run / None
