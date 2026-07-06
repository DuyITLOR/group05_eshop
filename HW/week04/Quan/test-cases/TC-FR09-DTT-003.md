# TC-FR09-DTT-003: Từ chối áp dụng coupon khi thiếu JWT

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- User chưa đăng nhập hoặc request không gửi header `Authorization`.
- Mã `BIGBUY` tồn tại, active, còn hạn, đủ ngưỡng và user chưa dùng hết lượt.
- Giỏ hàng có tổng tiền `600000`.

## Traceability

- Target Rule ID: Rule_01
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | Không gửi | C4 = False |
| Code | `BIGBUY` | C1 = True |
| Current date | `2026-06-29` | C2 = True |
| Total amount | `600000` | C3 = True |
| Prior usage count | `0` | C5 = True |

## Test steps

1. Mở Checkout hoặc gọi `POST /api/apply-coupon` khi chưa đăng nhập.
2. Nhập/gửi mã `BIGBUY`.
3. Gửi tổng tiền `600000`.
4. Bấm `Áp dụng` hoặc gửi request apply coupon.
5. Quan sát phản hồi của hệ thống.

## Expected result

Hệ thống từ chối áp dụng coupon do thiếu JWT hợp lệ, trả lỗi auth phù hợp. Không tính giảm giá, không thay đổi `final_amount`, không ghi nhận usage.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
