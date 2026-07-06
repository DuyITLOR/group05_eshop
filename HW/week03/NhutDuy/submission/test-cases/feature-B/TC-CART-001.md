# TC-CART-001: Thêm sản phẩm hợp lệ vào giỏ (số lượng = 1, biên min)

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng hợp lệ EP1 — `quantity` nguyên ≥ 1)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `1` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `1`.
3. Bấm **Thêm vào giỏ hàng** *(lưu ý: nút ở trang FR-06 cần bấm 2 lần)*.
4. Mở `/cart`.

## Expected result
Giỏ hàng có 1 dòng iPhone với `quantity = 1`, Thành tiền = đơn giá × 1.

## Actual result
Thêm vào giỏ OK, dòng iPhone hiển thị `quantity = 1`, thành tiền đúng.

## Status / Related bugs
Pass / None
