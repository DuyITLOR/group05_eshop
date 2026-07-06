# TC-FR09-DTT-008: Từ chối khi user đã dùng hết lượt

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Mã `VIP100` tồn tại, active, còn hạn, type `fixed`, `min_order_amount = 300000`, `max_uses_per_user = 2`.
- Bảng `coupon_usage` có đúng 2 lượt user này đã dùng `VIP100`.
- Giỏ hàng có tổng tiền `500000`.

## Traceability

- Target Rule ID: Rule_05
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `VIP100` | C1 = True |
| Current date | `2026-06-29` | C2 = True |
| Total amount | `500000` | C3 = True |
| Prior usage count | `2` | C5 = False |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Chuẩn bị `coupon_usage` có 2 lượt dùng `VIP100` cho user.
3. Vào trang Checkout với giỏ hàng tổng tiền `500000`.
4. Nhập mã `VIP100`.
5. Bấm `Áp dụng`.
6. Quan sát phản hồi và số bản ghi usage.

## Expected result

Hệ thống từ chối áp dụng coupon vì `usage_count` không nhỏ hơn `max_uses_per_user`. Không tính giảm giá, tổng tiền không đổi và không tạo thêm usage.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
