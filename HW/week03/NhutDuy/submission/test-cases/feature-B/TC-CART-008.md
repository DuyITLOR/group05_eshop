# TC-CART-008: Xóa sản phẩm khỏi giỏ (cartOp = remove)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng EP8 — `cartOp` hợp lệ: remove)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; giỏ hàng có sẵn 1 dòng iPhone.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max (đang có trong giỏ) |
| cartOp | remove (bấm Xóa) |

## Test steps
1. Mở `/cart` (đang có dòng iPhone).
2. Bấm nút **Xóa** trên dòng iPhone.

## Expected result
Hiện **dialog xác nhận** trước khi xóa; chỉ xóa khi người dùng đồng ý.

## Actual result
Gọi `removeFromCart` trực tiếp → **xóa ngay**, không hiển thị dialog xác nhận.

## Status / Related bugs
Fail / BUG-B3 (#53)
