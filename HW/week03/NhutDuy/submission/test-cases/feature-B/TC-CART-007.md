# TC-CART-007: Thêm cùng một sản phẩm 2 lần (luật gộp)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Equivalence Partitioning (vùng EP7 — `product` đã có trong giỏ → luật gộp)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; giỏ hàng đang trống.

## Test data
| Field | Value |
| --- | --- |
| product (lần 1) | iPhone 15 Pro Max, quantity = 1 |
| product (lần 2) | iPhone 15 Pro Max, quantity = 1 (cùng sản phẩm) |

## Test steps
1. Thêm iPhone (qty 1) vào giỏ.
2. Quay lại trang chi tiết iPhone, thêm iPhone (qty 1) **lần nữa**.
3. Mở `/cart`.

## Expected result
Giỏ gộp thành **1 dòng** iPhone với `quantity = 2` (FR-07: "thêm cùng một sản phẩm → tăng số lượng, không tạo dòng mới").

## Actual result
Giỏ tạo **2 dòng iPhone riêng biệt** (mỗi dòng qty=1). `CartContext.addToCart` luôn `setCart([...cart, {...product, quantity}])` → không kiểm tra trùng để gộp.

## Status / Related bugs
Fail / BUG-B2 (`[BUG][module: cart] Thêm cùng sản phẩm không gộp (tạo dòng trùng)`) — #52
