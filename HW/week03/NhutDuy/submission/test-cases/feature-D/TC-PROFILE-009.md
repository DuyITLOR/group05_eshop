# TC-PROFILE-009: Lưu Địa chỉ giao hàng (lệch tên trường shippingAddress / shipping_address)

## Requirement ID
FR-04 (Pool D — Mobile App)

## Module / Test type / Technique
Profile / Functional / Equivalence Partitioning (vùng EP7 — `shipping_address`, kiểm khả năng lưu/persist)

## Preconditions
- Backend `:3000` đang chạy (LAN cho mobile).
- App Mobile (Expo) đã đăng nhập user; đang ở màn **Hồ sơ cá nhân**.
- Dùng SĐT mà mobile **chấp nhận** (vd `912345678`) để qua được bước validate (do BUG-D1), mới quan sát được lỗi địa chỉ.

## Test data
| Field | Value |
| --- | --- |
| name | `Test User` |
| phone | `912345678` *(để qua validate mobile)* |
| shippingAddress | `123 Nguyễn Văn A` |

## Test steps
1. Mở màn **Hồ sơ**.
2. Nhập **Địa chỉ giao hàng** = `123 Nguyễn Văn A`.
3. Bấm **Cập nhật**.
4. Đăng nhập lại và mở lại màn **Hồ sơ** để kiểm tra địa chỉ.

## Expected result
Địa chỉ được lưu và **vẫn còn** sau khi đăng nhập lại.

## Actual result
Mobile gửi key `shippingAddress` (camelCase) nhưng backend đọc `shipping_address` (snake_case) → lưu **NULL**, địa chỉ **mất sau reload**. (Đối chứng API gửi đúng key `shipping_address` thì lưu được — xem `feature-D-api-tests.rest` request 9–10.)

## Status / Related bugs
Fail / BUG-D3 (`[BUG][module: profile] Địa chỉ không lưu do lệch tên trường`) — #84
