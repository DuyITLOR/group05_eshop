# [BUG][Cart] Giỏ hàng thiếu nút +/- để chỉnh số lượng

## Found by Test Case
TC-CART-UC-01, TC-CART-UC-04 (Use-Case) · TC-CART-E2E-01 (State Transition)

## Requirement liên quan
FR-07 — cột "**Số lượng** (có nút +/- để chỉnh)".

## Severity / Priority
Major / P1

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng)
- File: `frontend-web/src/pages/Cart.jsx`

## Steps to reproduce
1. Thêm 1 sản phẩm vào giỏ, mở trang Giỏ hàng.
2. Tìm nút **+** / **−** trên dòng sản phẩm để chỉnh số lượng.

## Expected result
Mỗi dòng có nút **+** và **−** để tăng/giảm số lượng; Thành tiền & Tổng cập nhật theo.

## Actual result
**Không có nút +/-** — số lượng chỉ là văn bản tĩnh, không thể chỉnh trong giỏ.

## Evidence
Cột số lượng render tĩnh, không có control:
```jsx
<td>{item.quantity}</td>   // chỉ hiển thị, không có nút +/-
```

## Labels
type: bug, module: cart, severity: major, priority: P1, status: new, found-by: test-case
