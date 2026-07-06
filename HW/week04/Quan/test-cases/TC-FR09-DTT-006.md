# TC-FR09-DTT-006: Từ chối mã đã hết hạn

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Mã `EXPIRED` tồn tại, active, type `percent`, `expired_at = 2020-01-01`.
- Ngày kiểm thử là `2026-06-29`.
- Giỏ hàng có tổng tiền `500000`, lớn hơn `min_order_amount = 100000`.
- User chưa dùng hết lượt của mã `EXPIRED`.

## Traceability

- Target Rule ID: Rule_03
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `EXPIRED` | C1 = True |
| Current date | `2026-06-29` | C2 = False |
| Total amount | `500000` | C3 = True |
| Prior usage count | `0` | C5 = True |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Vào trang Checkout với giỏ hàng tổng tiền `500000`.
3. Nhập mã `EXPIRED`.
4. Bấm `Áp dụng`.
5. Quan sát phản hồi của hệ thống.

## Expected result

Hệ thống từ chối áp dụng coupon vì mã đã hết hạn. Không tính giảm giá, tổng tiền không đổi và không ghi nhận usage.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
