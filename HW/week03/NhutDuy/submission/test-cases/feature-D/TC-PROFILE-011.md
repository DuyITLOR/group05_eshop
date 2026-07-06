# TC-PROFILE-011: Backend không validate name rỗng / phone sai (qua API)

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng không hợp lệ EP6b/EP5 — `name` rỗng, `phone` sai định dạng)

## Preconditions
- Backend `:3000` đang chạy.
- Có JWT của một **user thường**, lấy qua `POST /api/login`.
- Kiểm qua API `PUT /api/users/me` (dùng `feature-D-api-tests.rest`).

## Test data
| Field | Value |
| --- | --- |
| endpoint | `PUT /api/users/me` |
| body | `{"name":"","phone":"abc","shipping_address":"123 NVA"}` |

## Test steps
1. Đăng nhập user thường → lấy token.
2. Gọi `PUT /api/users/me` kèm body có `name` rỗng và `phone` = `abc`.
3. Gọi `GET /api/users/me` để kiểm tra dữ liệu đã lưu.

## Expected result
Hệ thống **từ chối** (tên rỗng vi phạm "Họ Tên bắt buộc"; SĐT `abc` sai định dạng đầu `0`, 10–11 chữ số).

## Actual result
Backend chèn thẳng vào DB, **không validate** → lưu được `name` rỗng và `phone` = `"abc"`. `GET /api/users/me` trả về đúng các giá trị sai này.

## Status / Related bugs
Fail / BUG-D4 (`[BUG][module: profile] Backend không validate name/phone`) — #85
