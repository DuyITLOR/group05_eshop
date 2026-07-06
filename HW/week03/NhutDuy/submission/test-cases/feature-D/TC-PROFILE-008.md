# TC-PROFILE-008: User tự đổi `role` qua API (leo thang đặc quyền)

## Requirement ID
FR-04 (feature thuộc **Pool D — Mobile App**)

## Module / Test type / Technique
Profile / Security / Equivalence Partitioning (vùng EP9b — thuộc tính `role` user **không được tự đổi**)

## Preconditions
- Backend `:3000` đang chạy.
- Có JWT của một **user thường** (`role = "user"`), lấy qua `POST /api/login`.
- Dùng REST Client với file `test-cases/feature-D/feature-D-api-tests.rest`.

## Test data
| Field | Value |
| --- | --- |
| endpoint | `PUT /api/users/me` |
| body | `{"name":"Test User","phone":"912345678","role":"admin"}` |

## Test steps
1. Đăng nhập user thường → lấy token.
2. Gọi `PUT /api/users/me` kèm body có `"role":"admin"`.
3. Gọi `GET /api/users/me` để kiểm tra `role`.

## Expected result
Hệ thống **bỏ qua/từ chối** trường `role` — user không thể tự nâng quyền (FR-04: "không thể tự thay đổi thuộc tính `role`").

## Actual result
`GET /api/users/me` trả về `"role": "admin"` — user thường **đã tự nâng quyền lên admin**. `server.js:124`: `if (role) { query += ", role = ?" }` cập nhật `role` theo body.

## Status / Related bugs
Fail / BUG-D2 (`[BUG][module: profile] Leo thang đặc quyền: user tự đổi role`) — #83 — **lỗi bảo mật Critical/P0**
