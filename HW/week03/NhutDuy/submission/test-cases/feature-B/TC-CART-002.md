# TC-CART-002: Số lượng hợp lệ điển hình (quantity = 5)

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
| quantity | `5` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `5`.
3. Bấm **Thêm vào giỏ hàng** *(lưu ý: nút ở trang FR-06 cần bấm 2 lần)*.
4. Mở `/cart`.

## Expected result
Giỏ hàng có 1 dòng iPhone với `quantity = 5`, Thành tiền = đơn giá × 5.

## Actual result
Thêm vào giỏ OK, dòng iPhone hiển thị `quantity = 5`, thành tiền đúng = giá × 5.

## Status / Related bugs
Pass / None
