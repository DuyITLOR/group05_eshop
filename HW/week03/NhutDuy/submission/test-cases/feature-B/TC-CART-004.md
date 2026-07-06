# TC-CART-004: Số lượng âm (quantity = -3)

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng không hợp lệ EP3 — `quantity` số âm)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `-3` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `-3`.
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart` và xem tổng tiền.

## Expected result
Từ chối thêm vào giỏ (số lượng phải ≥ 1).

## Actual result
Thêm dòng iPhone với `quantity = -3` → thành tiền và tổng tiền giỏ bị **âm**.

## Status / Related bugs
Fail / BUG-B1 (#51)
