# [BUG][Register] Không kiểm tra định dạng Email khi đăng ký

## Found by Test Case
TC-REGISTER-003

## Requirement liên quan
FR-01

## Severity / Priority
Major / P1

## Environment
- URL: http://localhost:5173 (trang Đăng ký)
- File: frontend-web/src/pages/Register.jsx (ô email dùng `type="text"`, dòng 47–53)
- Backend: backend/server.js — `/api/register` (không validate)

## Steps to reproduce
1. Mở trang Đăng ký.
2. Nhập Họ tên hợp lệ, Email `abc` (sai định dạng).
3. (Dùng mật khẩu được hệ thống chấp nhận, vd `Pass 123`, để vượt qua bước kiểm tra mật khẩu.)
4. Bấm Đăng Ký.

## Expected result
Từ chối đăng ký, báo lỗi "Email sai định dạng".

## Actual result
Không có bước kiểm tra định dạng email ở cả frontend lẫn backend. Email sai định dạng vẫn được gửi và chèn vào DB. (Với mật khẩu `Pass123!` thì form còn bị BUG-REGISTER-01 chặn trước, hiển thị sai lý do "Mật khẩu quá yếu".)

## Evidence
- Register.jsx: input email `type="text"`, không có validate định dạng.
- API: `POST /api/register` chèn thẳng vào bảng `users` không kiểm tra.

## Labels
type: bug, module: register, severity: major, priority: P1, status: new, found-by: test-case
