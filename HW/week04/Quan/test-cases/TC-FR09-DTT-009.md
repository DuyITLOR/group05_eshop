# TC-FR09-DTT-009: Ưu tiên lỗi hết hạn khi nhiều điều kiện sau xác thực cùng fail

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Mã `EXPIRED` tồn tại và active nhưng `expired_at = 2020-01-01`.
- Ngày kiểm thử là `2026-06-29`.
- Giỏ hàng có tổng tiền `50000`, nhỏ hơn `min_order_amount = 100000` của `EXPIRED`.
- Bảng `coupon_usage` đã có `usage_count = 1` cho user với mã `EXPIRED`, bằng `max_uses_per_user = 1`.

## Traceability

- Target Rule ID: Rule_03
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `EXPIRED` | C1 = True |
| Current date | `2026-06-29` | C2 = False |
| Total amount | `50000` | C3 = False |
| Prior usage count | `1` | C5 = False |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Chuẩn bị usage count của `EXPIRED` cho user bằng 1.
3. Vào trang Checkout với giỏ hàng tổng tiền `50000`.
4. Nhập mã `EXPIRED`.
5. Bấm `Áp dụng`.
6. Quan sát nhóm lỗi trả về và kiểm tra usage không tăng.

## Expected result

Theo failure-priority của bảng quyết định, hệ thống từ chối ở Rule_03 vì mã đã hết hạn. Không áp dụng giảm giá dù C3 và C5 cũng fail, tổng tiền không đổi và `coupon_usage` không tăng.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
