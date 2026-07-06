# Bug ID: `FR08-bug-02`

## Bug description:
Trang Checkout cho phép người dùng **chỉnh sửa trực tiếp tổng tiền thanh toán**. Ô tổng tiền được render bằng `<input type="number">` có thể gõ giá trị bất kỳ, vi phạm FR-08 ("Tổng tiền thanh toán được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp"). Kết hợp với `FR08-bug-01`, người dùng có thể đặt hàng với giá tùy ý ngay từ giao diện, không cần can thiệp API.

## Test case coverage:
- `TC-CHECKOUT-07` (Đặt hàng thành công end-to-end — kiểm tra tổng tiền không cho sửa)

## Preconditions:
1. Người dùng đã đăng nhập, giỏ hàng có ít nhất 1 sản phẩm.
2. Đang ở trang Checkout (`/checkout`).

## Test steps:
1. Đăng nhập, thêm sản phẩm vào giỏ, vào trang Giỏ hàng, nhấn "Tiến hành thanh toán".
2. Ở trang Checkout, tìm ô "Tổng tiền thanh toán (VND)".
3. Thử gõ/sửa trực tiếp giá trị trong ô này (ví dụ đổi thành 1000).
4. Quan sát dòng "Tổng thanh toán" cập nhật theo giá trị vừa gõ.

## Expected results:
Tổng tiền chỉ hiển thị (read-only / text), không có ô cho phép người dùng chỉnh sửa trực tiếp.

## Actual results:
Tổng tiền nằm trong `<input type="number">` có `onChange` cập nhật `editableTotal`; người dùng gõ được giá trị bất kỳ và giá trị đó được dùng làm `total_amount` khi gửi checkout.

Dẫn chứng code — `frontend-web/src/pages/Checkout.jsx:91–103`:
```jsx
<label className="font-semibold">Tổng tiền thanh toán (VND):</label>
<input
  type="number"
  value={editableTotal}
  onChange={(e) => { setEditableTotal(Number(e.target.value)); ... }}
  className="border p-2 rounded text-red-600 font-bold"
/>
```

### Bug screenshot:
- Chưa có ảnh — kết quả suy ra từ phân tích code tĩnh. Khi chạy thật, chụp ô tổng tiền bị sửa và lưu tại `./bugs/FR08/images/FR08-bug-02.png`.
- (Nhúng khi có ảnh) `![Ô tổng tiền cho sửa](./images/FR08-bug-02.png)`

## Đề xuất mức độ (tham khảo)
Severity: Major · Priority: P1. Sửa: hiển thị tổng tiền dạng read-only, không dùng input editable; tổng tiền lấy từ `cartTotal`.
