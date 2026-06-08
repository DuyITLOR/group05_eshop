# TC-LOGIN-007: Đăng nhập thành công sau khi hết thời gian khóa

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Đăng nhập.
- Tài khoản `test@eshop.com` đã bị khóa trước đó nhưng thời gian khóa đã hết (`locked_until` < thời gian hiện tại).

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu | Test1234! |

## Test steps
1. Đảm bảo tài khoản đã bị khóa trước đó.
2. Đợi hết thời gian khóa (30 giây trong demo).
3. Mở trang Đăng nhập.
4. Nhập Email và Mật khẩu đúng.
5. Bấm nút Đăng nhập.

## Expected result
- Đăng nhập thành công, hệ thống trả về JWT Token.
- `login_attempts` được reset về 0, `locked_until` được xóa.
- Người dùng được chuyển về trang Home.

## Status / Related bugs
Not Run / None
