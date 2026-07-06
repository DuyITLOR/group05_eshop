# TC-PROFILE-001: Cập nhật Số điện thoại hợp lệ (đầu 0, 10 chữ số)

## Requirement ID
FR-04 (feature thuộc **Pool D — Mobile App**)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng hợp lệ EP1 — `phone` đầu `0`, 10–11 chữ số)

## Preconditions
- Backend `:3000` đang chạy; app Mobile (Expo) đã mở.
- Đã đăng nhập `test@eshop.com` / `Test1234!`.
- Đang ở màn **Hồ sơ của bạn**.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `0912345678` *(đầu `0`, 10 chữ số → hợp lệ theo SRS)* |
| shippingAddress | `123 Nguyễn Văn A` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Số điện thoại** = `0912345678`.
3. Bấm **Cập nhật**.

## Expected result
Hệ thống chấp nhận và cập nhật thành công (SĐT đúng định dạng FR-04: bắt đầu `0`, 10–11 chữ số).

## Actual result
App báo lỗi *"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."* và **chặn**. Regex `App.js:287` = `^[1-9][0-9]{8,9}$` đòi chữ số đầu là `1-9` (loại số `0`) và độ dài 9–10 → trái SRS.

## Status / Related bugs
Fail / BUG-D1 (`[BUG][module: profile] Validate SĐT sai spec`) — #82
