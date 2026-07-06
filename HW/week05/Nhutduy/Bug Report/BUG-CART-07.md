# [BUG][Cart] Nút quay lại mua sắm ghi "Mua tiếp" thay vì "Tiếp tục mua sắm"

## Found by Test Case
TC-CART-UC-01 (Use-Case)

## Requirement liên quan
FR-07 — "Có nút **'Tiếp tục mua sắm'** để quay về trang chủ."

## Severity / Priority
Trivial / P3

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng, khi có hàng)
- File: `frontend-web/src/pages/Cart.jsx`

## Steps to reproduce
1. Thêm sản phẩm vào giỏ, mở trang Giỏ hàng.
2. Xem nhãn nút quay lại mua sắm (khu vực dưới bảng).

## Expected result
Nút có nhãn **"Tiếp tục mua sắm"**.

## Actual result
Nút ghi **"← Mua tiếp"** → lệch nhãn chuẩn spec (không nhất quán với empty state đang dùng "Tiếp tục mua sắm").

## Evidence
```jsx
<Link to="/" className="border px-4 py-2 rounded ...">← Mua tiếp</Link>
```

## Labels
type: bug, module: cart, severity: trivial, priority: P3, status: new, found-by: test-case
