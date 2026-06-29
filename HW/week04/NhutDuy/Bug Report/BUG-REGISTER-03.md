# [BUG][Register] Email không được đảm bảo duy nhất — cho phép tạo tài khoản trùng email

## Found by Test Case
TC-REGISTER-004

## Requirement liên quan
FR-01

## Severity / Priority
Critical / P0

## Environment
- URL: http://localhost:5173 / API http://localhost:3000/api/register
- File: backend/database.js (bảng `users` — cột `email TEXT`, **không** UNIQUE); backend/server.js — `/api/register`

## Steps to reproduce
1. Gửi `POST /api/register` với email đã tồn tại `test@eshop.com`.
2. (Hoặc đăng ký 2 lần cùng một email mới qua giao diện.)

## Expected result
Từ chối, báo lỗi "Email đã tồn tại". Mỗi email chỉ tồn tại 1 tài khoản.

## Actual result
Đăng ký THÀNH CÔNG, tạo tài khoản trùng email:
- `POST` với `test@eshop.com` → `{"message":"User registered successfully","id":3}`.
- `POST` `dup@eshop.com` 2 lần → `id:4` và `id:5`.

## Evidence
`SELECT email, COUNT(*) c FROM users GROUP BY email HAVING c>1`
→ `[{"email":"dup@eshop.com","c":2},{"email":"test@eshop.com","c":2}]`

## Labels
type: bug, module: register, severity: critical, priority: P0, status: new, found-by: test-case
