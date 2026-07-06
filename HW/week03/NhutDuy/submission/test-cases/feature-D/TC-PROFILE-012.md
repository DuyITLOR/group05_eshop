# TC-PROFILE-012: Số điện thoại 9 chữ số (biên min−1)

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Boundary Value Analysis (biên `phone.length` = 9, off-point dưới cận min 10)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `012345678` *(9 chữ số → min−1, quá ngắn)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `012345678` (9 chữ số).
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (độ dài 9 < cận dưới 10 → quá ngắn).

## Actual result
Mobile **từ chối** (regex cần 9–10 chữ số nhưng đầu `0` cũng fail) → đúng kỳ vọng tại off-point dưới.

## Status / Related bugs
Pass / None
