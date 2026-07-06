# TC-FR09-DTT-004: Ưu tiên lỗi xác thực khi JWT sai và dữ liệu coupon cũng sai

## Requirement ID

FR-09

## Module / Test type / Technique

Coupon Apply / Functional / DTT

## Preconditions

- Request gửi header `Authorization: Bearer invalid-token`.
- Không cần user đăng nhập hợp lệ.
- Dữ liệu gửi kèm cố ý làm sai nhiều điều kiện coupon để kiểm tra auth priority.

## Traceability

- Target Rule ID: Rule_01
- Pairwise Cluster ID: N/A

## Test data

| Parameter | Value | Condition Mapping |
| --- | --- | --- |
| JWT | `Bearer invalid-token` | C4 = False |
| Code | `NO_SUCH_CODE` | C1 = False |
| Current date | `2026-06-29` | C2 = N/A |
| Total amount | `299999` | C3 = False |
| Prior usage count | N/A | C5 = N/A |

## Test steps

1. Gọi `POST /api/apply-coupon` với header `Authorization: Bearer invalid-token`.
2. Gửi body có `code = "NO_SUCH_CODE"` và `total_amount = 299999`.
3. Quan sát status, message và dữ liệu trả về.
4. Kiểm tra không có bản ghi usage mới.

## Expected result

Hệ thống từ chối theo lỗi xác thực trước tiên. Phản hồi không tiết lộ mã có tồn tại, hết hạn, thiếu ngưỡng hay hết lượt hay không. Không có `discount_amount` hợp lệ, `final_amount` không bị giảm và `coupon_usage` không tăng.

## Actual results

[To be filled during execution]

## Status / Related bugs

Not Run / None
