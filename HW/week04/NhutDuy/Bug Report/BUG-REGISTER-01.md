# [BUG][Register] Mật khẩu mạnh hợp lệ bị từ chối; quy tắc kiểm tra mật khẩu sai

## Found by Test Case
TC-REGISTER-001 (đồng thời làm nhiễu TC-REGISTER-003)

## Requirement liên quan
FR-01

## Severity / Priority
Critical / P1

## Environment
- Browser: Chrome (mọi trình duyệt)
- OS: macOS
- URL: http://localhost:5173 (trang Đăng ký)
- Backend: http://localhost:3000
- File: frontend-web/src/pages/Register.jsx (dòng 15–20)

## Steps to reproduce
1. Mở trang Đăng ký.
2. Nhập Họ tên `Nguyen Van A`, Email `newuser@eshop.com`.
3. Nhập Mật khẩu `Pass123!` (đúng chuẩn mạnh theo FR-01: ≥ 8 ký tự, có hoa/thường/số/ký tự đặc biệt).
4. Bấm Đăng Ký.

## Expected result
Mật khẩu hợp lệ → đăng ký thành công → chuyển sang trang Đăng nhập.

## Actual result
Hiển thị lỗi "Mật khẩu quá yếu!" và chặn đăng ký.
Biểu thức kiểm tra: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/`
- Sai: bắt buộc phải có ký tự **khoảng trắng** `\s`.
- Sai: **cấm ký tự đặc biệt** (`!@$…`) vì lớp ký tự chỉ cho phép `[A-Za-z\d\s]`.
- Hệ quả ngược: mật khẩu sai chuẩn như `Pass 123` (có khoảng trắng, không ký tự đặc biệt) lại ĐƯỢC chấp nhận.

## Evidence
node eval: `re.test("Pass123!")` → `false`; `re.test("Pass 123")` → `true`.

## Labels
type: bug, module: register, severity: critical, priority: P1, status: new, found-by: test-case
