# TC-PROFILE-005: Số điện thoại chứa ký tự chữ

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng không hợp lệ EP5 — `phone` chứa ký tự không phải số)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `09abc45678` *(chứa chữ → không hợp lệ)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `09abc45678`.
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (SĐT chỉ được gồm chữ số).

## Actual result
Mobile **từ chối** (chuỗi chứa chữ không khớp regex chỉ-số) → đúng kỳ vọng.

## Status / Related bugs
Pass / None
