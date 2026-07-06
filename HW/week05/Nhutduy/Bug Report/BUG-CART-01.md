# [BUG][Cart] Thêm lại sản phẩm đã có tạo dòng mới thay vì tăng số lượng

## Found by Test Case
TC-CART-UC-02 (Use-Case) · TC-CART-E2E-01 (State Transition)

## Requirement liên quan
FR-07 — "Thêm cùng một sản phẩm vào giỏ sẽ **tăng số lượng, không tạo dòng mới**."

## Severity / Priority
Major / P1

## Environment
- Browser: Chrome (mọi trình duyệt), OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng)
- File: `frontend-web/src/context/CartContext.jsx` (hàm `addToCart`)

## Steps to reproduce
1. Thêm sản phẩm A vào giỏ (số lượng 1).
2. Quay lại trang chi tiết A, thêm A một lần nữa.
3. Mở trang Giỏ hàng.

## Expected result
Giỏ có **đúng 1 dòng** SP A với số lượng = 2.

## Actual result
Giỏ có **2 dòng** SP A riêng biệt (mỗi lần thêm tạo 1 dòng mới) → sai spec.

## Evidence
`addToCart` luôn nối phần tử mới vào mảng, không kiểm tra sản phẩm đã tồn tại:
```js
const addToCart = (product, quantity) => {
  setCart([...cart, { ...product, quantity }]);   // luôn tạo dòng mới
};
```

## Labels
type: bug, module: cart, severity: major, priority: P1, status: new, found-by: test-case
