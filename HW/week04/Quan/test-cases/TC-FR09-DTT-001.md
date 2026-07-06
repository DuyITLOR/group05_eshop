# TC-FR09-DTT-001: Áp dụng mã percent khi tất cả điều kiện đều đúng

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Bảng `coupon_usage` không có bản ghi user này đã dùng `SAVE10`.
- Mã `SAVE10` tồn tại, active, type `percent`, `discount_value = 10`, `min_order_amount = 300000`, `expired_at = 2099-12-31`, `max_uses_per_user = 1`.
- Giỏ hàng có tổng tiền `500000`.

## Traceability

- Target Rule ID: Rule_06
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `SAVE10` | C1 = True |
| Current date | `2026-06-29` | C2 = True |
| Total amount | `500000` | C3 = True |
| Prior usage count | `0` | C5 = True |
| Coupon type | `percent` | C6 = percent |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Vào trang Checkout với giỏ hàng tổng tiền `500000`.
3. Nhập mã `SAVE10`.
4. Bấm `Áp dụng`.
5. Hoàn tất checkout thành công.
6. Kiểm tra phản hồi áp dụng coupon và bản ghi usage của user.

## Expected result

Coupon được áp dụng thành công. `discount_amount = 500000 x 10 / 100 = 50000`, `final_amount = 450000`. Sau checkout thành công, hệ thống ghi nhận thêm 1 lượt dùng `SAVE10` cho user.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
