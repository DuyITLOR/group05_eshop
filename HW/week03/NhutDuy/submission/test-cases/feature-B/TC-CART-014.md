# TC-CART-014: Số lượng = 2 (biên min+1)

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Boundary Value Analysis (biên `quantity`: min+1 = 2, vùng chấp nhận)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `2` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `2` (biên min+1).
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart`.

## Expected result
Chấp nhận, thêm dòng iPhone với `quantity = 2`.

## Actual result
Thêm vào giỏ OK, dòng iPhone hiển thị `quantity = 2`.

## Status / Related bugs
Pass / None
