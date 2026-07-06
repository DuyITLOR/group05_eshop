# TC-CART-006: Số lượng rỗng / không phải số

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng không hợp lệ EP5 — `quantity` rỗng / không phải số)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `""` (để trống ô số lượng) |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Xóa trống ô **Số lượng** (giá trị rỗng).
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart` và xem tổng tiền.

## Expected result
Từ chối thêm vào giỏ (số lượng bắt buộc, phải là số ≥ 1).

## Actual result
`parseInt("") = NaN` → thêm dòng iPhone với `quantity = NaN` → tổng tiền giỏ hiển thị **NaN**.

## Status / Related bugs
Fail / BUG-B1 (#51)
