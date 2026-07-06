# TC-FR09-DTT-005: Từ chối mã không tồn tại hoặc inactive

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User `test@eshop.com` đã đăng nhập và có JWT hợp lệ.
- Mã `NO_SUCH_CODE` không tồn tại trong CSDL hoặc một mã test tương đương đang inactive.
- Giỏ hàng có tổng tiền đủ lớn để không fail do ngưỡng đơn hàng.

## Traceability

- Target Rule ID: Rule_02
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | JWT hợp lệ của `test@eshop.com` | C4 = True |
| Code | `NO_SUCH_CODE` | C1 = False |
| Current date | `2026-06-29` | C2 = N/A |
| Total amount | `600000` | C3 = True |
| Prior usage count | N/A | C5 = N/A |

## Test steps

1. Đăng nhập bằng `test@eshop.com` để lấy JWT hợp lệ.
2. Vào trang Checkout với giỏ hàng tổng tiền `600000`.
3. Nhập mã `NO_SUCH_CODE`.
4. Bấm `Áp dụng`.
5. Quan sát phản hồi của hệ thống.

## Expected result

Hệ thống từ chối áp dụng coupon vì mã không tồn tại hoặc inactive. Không tính giảm giá, tổng tiền không đổi và không ghi nhận usage.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
