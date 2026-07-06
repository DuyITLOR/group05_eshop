# [BUG][Cart] Nút "Xóa" không có dialog xác nhận — xóa ngay lập tức

## Found by Test Case
TC-CART-UC-01, TC-CART-UC-05 (Use-Case) · TC-CART-E2E-01, TC-CART-E2E-02 (State Transition)

## Requirement liên quan
FR-07 — "Nút Xóa sản phẩm **phải có dialog xác nhận** trước khi thực hiện." (tham chiếu FR-24)

## Severity / Priority
Major / P1

## Environment
- Browser: Chrome, OS: macOS
- URL: http://localhost:5173 (trang Giỏ hàng)
- File: `frontend-web/src/pages/Cart.jsx`

## Steps to reproduce
1. Thêm 1 sản phẩm vào giỏ, mở trang Giỏ hàng.
2. Bấm nút **Xóa** trên dòng sản phẩm.

## Expected result
Xuất hiện **dialog xác nhận** (Xác nhận / Hủy); sản phẩm chỉ bị xóa sau khi **Xác nhận**.

## Actual result
Sản phẩm **bị xóa ngay lập tức**, không có bước xác nhận → không thể "Hủy" thao tác xóa.

## Evidence
Nút Xóa gọi thẳng `removeFromCart`, không mở dialog:
```jsx
<button onClick={() => removeFromCart(index)}>Xóa</button>
```

## Labels
type: bug, module: cart, severity: major, priority: P1, status: new, found-by: test-case
