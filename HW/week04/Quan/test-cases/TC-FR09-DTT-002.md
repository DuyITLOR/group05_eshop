# TC-FR09-DTT-002: Áp dụng mã fixed khi tất cả điều kiện đều đúng

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Bảng `coupon_usage` không có bản ghi user này đã dùng `BIGBUY`.
- Mã `BIGBUY` tồn tại, active, type `fixed`, `discount_value = 50000`, `min_order_amount = 500000`, `expired_at = 2099-12-31`, `max_uses_per_user = 1`.
- Giỏ hàng có tổng tiền `600000`.

## Traceability

- Target Rule ID: Rule_07
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `BIGBUY` | C1 = True |
| Current date | `2026-06-29` | C2 = True |
| Total amount | `600000` | C3 = True |
| Prior usage count | `0` | C5 = True |
| Coupon type | `fixed` | C6 = fixed |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Vào trang Checkout với giỏ hàng tổng tiền `600000`.
3. Nhập mã `BIGBUY`.
4. Bấm `Áp dụng`.
5. Quan sát kết quả giảm giá và tổng tiền sau giảm.

## Expected result

Coupon được áp dụng thành công. `discount_amount = 50000`, `final_amount = 600000 - 50000 = 550000`. Không có lỗi validation, auth, expired, threshold hoặc usage-limit.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
