# TC-CART-003: Số lượng = 0

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng không hợp lệ EP2 — `quantity` = 0) — biên min−1 đối chiếu BVA

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `0` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `0`.
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart`.

## Expected result
Từ chối thêm vào giỏ (FR-06: số lượng tối thiểu 1).

## Actual result
Ô số lượng không có thuộc tính `min` → `parseInt("0") = 0` → vẫn thêm dòng iPhone với `quantity = 0` vào giỏ.

## Status / Related bugs
Fail / BUG-B1 (#51)
