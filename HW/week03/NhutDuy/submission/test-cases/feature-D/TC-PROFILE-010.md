# TC-PROFILE-010: User chỉ sửa được hồ sơ của chính mình

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Security / Equivalence Partitioning (vùng bất biến — scope chỉ-hồ-sơ-của-mình)

## Preconditions
- Backend `:3000` đang chạy.
- Có JWT của **user A**, lấy qua `POST /api/login`.
- Kiểm qua API `PUT /api/users/me`.

## Test data
| Field | Value |
| --- | --- |
| endpoint | `PUT /api/users/me` |
| token | token của user A |
| mục tiêu | cố sửa hồ sơ của **user B** |

## Test steps
1. Đăng nhập user A → lấy token.
2. Gọi `PUT /api/users/me` bằng token user A, cố sửa dữ liệu của user B.
3. Kiểm tra xem hồ sơ user B có bị thay đổi không.

## Expected result
User A **chỉ sửa được hồ sơ của chính mình**, không sửa được hồ sơ user B.

## Actual result
Backend dùng `req.user.id` lấy từ token để xác định bản ghi cập nhật → **chỉ update chính chủ token**, không sửa được người khác → đúng kỳ vọng.

## Status / Related bugs
Pass / None
