# TC-PROFILE-007: Email không cho đổi qua giao diện

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng bất biến EP8b — cố đổi `email`)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| email | (thử sửa ô **Email** sang giá trị khác) |

## Test steps
1. Mở màn **Hồ sơ**.
2. Thử nhập/sửa giá trị tại ô **Email (Không đổi)**.
3. Bấm **Cập nhật**.

## Expected result
Email **không đổi được** (FR-04: email không được sửa qua giao diện).

## Actual result
Ô Email có thuộc tính `editable={false}` (disabled) nên không nhập được; backend `PUT /api/users/me` cũng **không** đọc trường `email` → email **giữ nguyên**.

## Status / Related bugs
Pass / None
