# TC-PROFILE-013: Số điện thoại 12 chữ số (biên max+1)

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Boundary Value Analysis (biên `phone.length` = 12, off-point trên cận max 11)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `012345678901` *(12 chữ số → max+1, quá dài)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `012345678901` (12 chữ số).
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (độ dài 12 > cận trên 11 → quá dài).

## Actual result
Mobile **từ chối** (12 chữ số vượt dải regex) → đúng kỳ vọng tại off-point trên.

## Status / Related bugs
Pass / None
