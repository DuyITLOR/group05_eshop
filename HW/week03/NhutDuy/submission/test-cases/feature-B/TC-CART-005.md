# TC-CART-005: Số lượng thập phân (quantity = 2.5)

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng không hợp lệ EP4 — `quantity` số thập phân)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `2.5` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `2.5`.
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart`.

## Expected result
Từ chối thêm vào giỏ (số lượng phải là số nguyên).

## Actual result
`parseInt("2.5") = 2` → cắt thầm phần thập phân, thêm dòng iPhone với `quantity = 2` mà không báo lỗi.

## Status / Related bugs
Fail / BUG-B1 (#51)
