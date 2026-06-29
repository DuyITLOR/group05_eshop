# [BUG][Register] Thiếu trường "Xác nhận mật khẩu" trên form đăng ký

## Found by Test Case
TC-REGISTER-006

## Requirement liên quan
FR-01

## Severity / Priority
Major / P1

## Environment
- URL: http://localhost:5173 (trang Đăng ký)
- File: frontend-web/src/pages/Register.jsx (form chỉ có Họ tên, Email, Mật khẩu — dòng 35–67)

## Steps to reproduce
1. Mở trang Đăng ký.
2. Quan sát các trường của form.

## Expected result
Form phải có trường "Xác nhận mật khẩu"; hệ thống từ chối nếu hai trường không khớp (FR-01).

## Actual result
Form KHÔNG có trường "Xác nhận mật khẩu". Không thể kiểm tra điều kiện khớp/không khớp — chức năng xác nhận mật khẩu bị thiếu hoàn toàn.

## Evidence
Register.jsx chỉ render 3 input: `name`, `email`, `password` (dòng 35–67); không có input xác nhận.

## Labels
type: bug, module: register, severity: major, priority: P1, status: new, found-by: test-case
