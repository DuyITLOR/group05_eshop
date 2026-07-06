# TC-PROFILE-004: Số điện thoại quá ngắn

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng không hợp lệ EP3 — `phone` < 10 chữ số)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `09123` *(5 chữ số → quá ngắn so với 10–11)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `09123`.
3. Bấm **Cập nhật**.

## Expected result
Hệ thống **từ chối** (SĐT quá ngắn so với yêu cầu 10–11 chữ số).

## Actual result
Mobile **từ chối** (regex cần 9–10 chữ số nên `09123` không khớp) → đúng kỳ vọng.

## Status / Related bugs
Pass / None
