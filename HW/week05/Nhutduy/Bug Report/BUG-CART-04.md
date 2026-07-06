# [BUG][Cart] Nhãn tổng tiền sai — "Tổng tạm tính" thay vì "Tổng cộng"

## Found by Test Case
TC-CART-UC-06, TC-CART-UC-01 (Use-Case)

## Requirement liên quan
FR-07 — "Tổng tiền hiển thị nhãn chính xác: **'Tổng cộng'** (không phải 'Tổng tạm tính')."

## Severity / Priority
Minor / P3

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng)
- File: `frontend-web/src/pages/Cart.jsx`

## Steps to reproduce
1. Thêm 1 sản phẩm vào giỏ, mở trang Giỏ hàng.
2. Xem nhãn ở khu vực tổng tiền.

## Expected result
Nhãn tổng là **"Tổng cộng"**.

## Actual result
Nhãn hiển thị **"Tổng tạm tính"** → sai spec.

## Evidence
```jsx
Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
```

## Labels
type: bug, module: cart, severity: minor, priority: P3, status: new, found-by: test-case
