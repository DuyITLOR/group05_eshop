# [BUG][Cart] Nút "Thêm vào giỏ hàng" phải bấm 2 lần mới thêm được

## Found by Test Case
TC-CART-UC-01 (Use-Case) · TC-CART-E2E-01 (State Transition)

## Requirement liên quan
FR-07 / FR-06 — thêm sản phẩm vào giỏ phải có tác dụng ngay khi bấm.

## Severity / Priority
Major / P1

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Chi tiết sản phẩm)
- File: `frontend-web/src/pages/ProductDetail.jsx` (hàm `handleAddToCart`)

## Steps to reproduce
1. Mở trang chi tiết một sản phẩm.
2. Bấm **Thêm vào giỏ hàng** **một lần**.
3. Mở trang Giỏ hàng.

## Expected result
Sau **1 lần bấm**, sản phẩm được thêm vào giỏ.

## Actual result
**Lần bấm đầu tiên không làm gì** — phải bấm **2 lần** sản phẩm mới được thêm.

## Evidence
Lần bấm đầu chỉ tăng `clickCount` rồi `return`, không thêm:
```js
const handleAddToCart = () => {
  if (clickCount === 0) { setClickCount(1); return; } // lần đầu không thêm
  addToCart(product, parseInt(quantity));
  ...
};
```

## Labels
type: bug, module: cart, severity: major, priority: P1, status: new, found-by: test-case
