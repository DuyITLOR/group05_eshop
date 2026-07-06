# TC-PROFILE-002: Cập nhật Số điện thoại hợp lệ (đầu 0, 11 chữ số)

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng hợp lệ EP1 — `phone` đầu `0`, 10–11 chữ số)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user (`test@eshop.com` / `Test1234!`); đang ở màn **Hồ sơ cá nhân**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `09123456789` *(đầu `0`, 11 chữ số → hợp lệ theo SRS)* |
| shippingAddress | `123 NVA` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `09123456789`.
3. Bấm **Cập nhật**.

## Expected result
Hệ thống chấp nhận và cập nhật thành công (SĐT đúng định dạng FR-04: bắt đầu `0`, 10–11 chữ số).

## Actual result
Mobile **từ chối** (số đầu `0` và độ dài 11 chữ số vượt quá dải "9-10" của regex). Regex `App.js` = `^[1-9][0-9]{8,9}$` đòi chữ số đầu là `1-9` và độ dài 9–10 → trái SRS.

## Status / Related bugs
Fail / BUG-D1 (`[BUG][module: profile] Validate SĐT sai spec`) — #82
