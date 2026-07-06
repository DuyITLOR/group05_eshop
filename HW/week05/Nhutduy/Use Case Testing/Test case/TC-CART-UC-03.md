# TC-CART-UC-03: Giỏ hàng trống → hiển thị empty state (Extension 4a)

## Requirement ID
FR-07 (tham chiếu FR-24)

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Extension 4a

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Extension 4a (giỏ trống) |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-03 | Mở trang giỏ khi không có sản phẩm | Giỏ trống | Empty state: hình minh họa + thông báo + nút tiếp tục |

## Preconditions
1. Giỏ hàng đang trống (chưa thêm sản phẩm nào / đã xóa hết).

## Test steps
1. Mở trang **Giỏ hàng**.

## Expected results
1. Hiển thị **hình minh họa/icon** cho trạng thái trống.
2. Có **thông báo rõ ràng** kiểu "Giỏ hàng của bạn đang trống".
3. Có nút **"Tiếp tục mua sắm"** để quay về trang chủ.

## Actual results
1. Trang giỏ trống chỉ có **chữ** + 1 link, **không có hình minh họa/icon** (thiếu so với spec).

## Status
Failed

## Related bugs
BUG-CART-05
