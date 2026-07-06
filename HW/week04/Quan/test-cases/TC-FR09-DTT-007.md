# TC-FR09-DTT-007: Từ chối khi tổng đơn hàng chưa đạt ngưỡng

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Mã `SAVE10` tồn tại, active, còn hạn và user chưa dùng hết lượt.
- `SAVE10` có `min_order_amount = 300000`.
- Giỏ hàng có tổng tiền `299999`.

## Traceability

- Target Rule ID: Rule_04
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `SAVE10` | C1 = True |
| Current date | `2026-06-29` | C2 = True |
| Total amount | `299999` | C3 = False |
| Prior usage count | `0` | C5 = True |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Vào trang Checkout với giỏ hàng tổng tiền `299999`.
3. Nhập mã `SAVE10`.
4. Bấm `Áp dụng`.
5. Quan sát phản hồi của hệ thống.

## Expected result

Hệ thống từ chối áp dụng coupon vì tổng đơn hàng nhỏ hơn `min_order_amount`. Không tính giảm giá, tổng tiền không đổi và không ghi nhận usage.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
