# TC-PROFILE-003: Số điện thoại không bắt đầu bằng 0 (sai spec) lại được chấp nhận

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng không hợp lệ EP2 — `phone` không bắt đầu bằng `0`)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `912345678` *(không đầu `0`, 9 chữ số → sai spec, phải bị từ chối)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `912345678`.
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (SĐT phải bắt đầu bằng `0` theo FR-04).

## Actual result
Mobile **chấp nhận** số `912345678` (9 chữ số, đầu `9`) vì khớp regex `^[1-9][0-9]{8,9}$` → cho qua dù sai SRS.

## Status / Related bugs
Fail / BUG-D1 (`[BUG][module: profile] Validate SĐT sai spec`) — #82
