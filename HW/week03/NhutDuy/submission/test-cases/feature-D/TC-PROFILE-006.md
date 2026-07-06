# TC-PROFILE-006: Số điện thoại rỗng

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng không hợp lệ EP5 — `phone` rỗng)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `""` *(rỗng → không hợp lệ)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Xóa trống ô **Số điện thoại** (để rỗng).
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (SĐT là bắt buộc khi cập nhật).

## Actual result
Mobile **từ chối** (chuỗi rỗng không khớp regex) → đúng kỳ vọng.

## Status / Related bugs
Pass / None
