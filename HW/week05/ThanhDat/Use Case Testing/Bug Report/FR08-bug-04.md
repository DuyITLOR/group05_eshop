# Bug ID: `FR08-bug-04`

## Bug description:
Trang Checkout (`/checkout`) **không có route guard**: người dùng chưa đăng nhập truy cập thẳng URL vẫn vào được trang Checkout, vi phạm FR-08 ("Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được"). Việc kiểm tra đăng nhập chỉ nằm ở nút bấm trong trang Giỏ hàng (`Cart.jsx`), có thể bỏ qua bằng cách gõ URL trực tiếp. Component `Checkout` không tự kiểm tra trạng thái đăng nhập.

## Test case coverage:
- `TC-CHECKOUT-09` (Chưa đăng nhập truy cập thẳng trang Checkout → phải bị chặn)

## Preconditions:
1. Trình duyệt ở trạng thái chưa đăng nhập (không có JWT ở client).

## Test steps:
1. Đảm bảo chưa đăng nhập (xóa token trong localStorage nếu cần).
2. Gõ thẳng URL `http://localhost:5173/checkout` trên thanh địa chỉ.
3. Quan sát: trang có bị chặn / điều hướng về Đăng nhập không.

## Expected results:
Không cho vào trang Checkout khi chưa đăng nhập; điều hướng về trang Đăng nhập.

## Actual results:
Trang Checkout được render bình thường khi chưa đăng nhập (không có bảo vệ route, không có redirect).

Dẫn chứng code:
- `frontend-web/src/App.jsx:58` — `<Route path="/checkout" element={<Checkout />} />` khai báo trần, không bọc bất kỳ lớp bảo vệ đăng nhập nào.
- `frontend-web/src/pages/Checkout.jsx` — không có kiểm tra `if (!user) navigate('/login')`. Chỉ `Cart.jsx:11–18` mới chặn, nhưng có thể bỏ qua bằng URL trực tiếp.

### Bug screenshot:
- Chưa có ảnh — kết quả suy ra từ phân tích code tĩnh. Khi chạy thật, chụp trang Checkout hiển thị khi chưa đăng nhập và lưu tại `./bugs/FR08/images/FR08-bug-04.png`.
- (Nhúng khi có ảnh) `![Checkout truy cập khi chưa đăng nhập](./images/FR08-bug-04.png)`

## Đề xuất mức độ (tham khảo)
Severity: Major · Priority: P1. Sửa: thêm route guard (protected route) cho `/checkout`, hoặc trong `Checkout.jsx` redirect về `/login` khi chưa đăng nhập.
