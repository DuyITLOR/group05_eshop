# TC-CART-010: Chỉnh số lượng trong giỏ bằng nút +/- (cartOp = increase/decrease)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng EP8 — `cartOp` hợp lệ: increase(+) / decrease(−))

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; giỏ hàng có sẵn 1 dòng iPhone.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max (có trong giỏ) |
| cartOp | increase(+) / decrease(−) ở cột Số lượng |

## Test steps
1. Mở `/cart` (đang có dòng iPhone).
2. Tìm nút **+** và **-** ở cột Số lượng để tăng/giảm số lượng.

## Expected result
Có nút **+/-** ở cột Số lượng để tăng/giảm số lượng sản phẩm trong giỏ.

## Actual result
`Cart.jsx` chỉ in `{item.quantity}` dưới dạng text — **không có nút +/-**; `CartContext` cũng **không có** hàm cập nhật số lượng.

## Status / Related bugs
Fail / BUG-B5 (#55)
