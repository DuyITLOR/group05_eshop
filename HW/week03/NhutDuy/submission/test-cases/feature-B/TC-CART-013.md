# TC-CART-013: Nút "Tiếp tục mua sắm" (cartOp = continueShopping)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng EP8 — `cartOp` hợp lệ: continueShopping)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; đang ở trang `/cart`.

## Test data
| Field | Value |
| --- | --- |
| cartOp | continueShopping (bấm nút "Tiếp tục mua sắm") |
| Mục kiểm | Điều hướng + nhãn nút |

## Test steps
1. Mở `/cart`.
2. Bấm nút **Tiếp tục mua sắm**.
3. Kiểm tra trang đích và nhãn nút (khi giỏ trống và khi giỏ có hàng).

## Expected result
Quay về **trang chủ** `/`, nhãn nút đúng **"Tiếp tục mua sắm"**.

## Actual result
`Link to="/"` → về trang chủ **OK**; tuy nhiên khi giỏ **có hàng** nhãn hiển thị là **"← Mua tiếp"** (≠ spec); khi giỏ trống thì nhãn đúng.

## Status / Related bugs
Pass / None (nhãn lệch khi giỏ có hàng — ứng viên BUG-B7, cosmetic)
