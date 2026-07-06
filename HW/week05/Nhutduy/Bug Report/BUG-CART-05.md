# [BUG][Cart] Giỏ hàng trống thiếu hình minh họa

## Found by Test Case
TC-CART-UC-03 (Use-Case) · TC-CART-E2E-02 (State Transition)

## Requirement liên quan
FR-07 — "Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng." (tham chiếu FR-24)

## Severity / Priority
Minor / P3

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng, khi giỏ trống)
- File: `frontend-web/src/pages/Cart.jsx`

## Steps to reproduce
1. Đảm bảo giỏ hàng trống.
2. Mở trang Giỏ hàng.

## Expected result
Hiển thị **hình minh họa/icon** + thông báo giỏ trống + nút "Tiếp tục mua sắm".

## Actual result
Chỉ có **chữ** ("Giỏ hàng của bạn đang trống") và 1 link — **không có hình minh họa/icon**.

## Evidence
Nhánh giỏ trống chỉ gồm text + link, không có `<img>`/icon:
```jsx
<div className="text-center mt-10">
  <h2 className="text-2xl mb-4">Giỏ hàng của bạn đang trống</h2>
  <Link to="/" className="text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
</div>
```

## Labels
type: bug, module: cart, severity: minor, priority: P3, status: new, found-by: test-case
