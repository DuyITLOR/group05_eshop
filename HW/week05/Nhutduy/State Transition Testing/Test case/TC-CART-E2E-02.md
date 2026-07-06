# TC-CART-E2E-02: Xóa hết giỏ, mua lại & thanh toán (Khởi tạo → … → Đã thanh toán)

## Requirement ID
FR-07 (tham chiếu FR-06, FR-08, FR-24)

## Module / Test type / Technique
Cart / End-to-End / State Transition

## Test design source
Test Design/ST-CART.md — Kịch bản End-to-End E2E-02

## Coverage
| Coverage Type | Chuyển tiếp phủ |
|---|---|
| End-to-End (chuỗi chuyển tiếp liên tiếp) | Khởi tạo→Giỏ trống, Giỏ trống→Giỏ 1 dòng, Giỏ 1 dòng→Dialog xác nhận, Dialog→Giỏ 1 dòng (Cancel), Dialog→Giỏ trống (Confirm còn 0 dòng, empty state), Giỏ 1 dòng→Giỏ nhiều dòng, Giỏ nhiều dòng→Đã thanh toán |

## Kịch bản (đường đi trạng thái)
| Bước | State trước | Sự kiện | State sau | Chuyển tiếp |
|:--:|:--|---|:--|---|
| 0 | — | Mở app *(khởi tạo tự động)* | Giỏ trống | Khởi tạo → Giỏ trống |
| 1 | Giỏ trống | A1 AddNew (SP A) | Giỏ 1 dòng | Giỏ trống → Giỏ 1 dòng |
| 2 | Giỏ 1 dòng | A3 ClickDelete (A) | Dialog xác nhận | Giỏ 1 dòng → Dialog xác nhận |
| 3 | Dialog xác nhận | A5 CancelDelete (giỏ 1 dòng) | Giỏ 1 dòng | Dialog → Giỏ 1 dòng (Cancel) |
| 4 | Giỏ 1 dòng | A3 ClickDelete (A) | Dialog xác nhận | Giỏ 1 dòng → Dialog xác nhận |
| 5 | Dialog xác nhận | A4 ConfirmDelete (dòng cuối) | Giỏ trống | Dialog → Giỏ trống (Confirm, còn 0 dòng) → empty state |
| 6 | Giỏ trống | A1 AddNew (SP A) | Giỏ 1 dòng | Giỏ trống → Giỏ 1 dòng |
| 7 | Giỏ 1 dòng | A1 AddNew (SP B) | Giỏ nhiều dòng | Giỏ 1 dòng → Giỏ nhiều dòng |
| 8 | Giỏ nhiều dòng | A6 Checkout | **Đã thanh toán** | Giỏ nhiều dòng → Đã thanh toán |

## Preconditions
1. Backend (`:3000`) và frontend-web (`:5173`) đang chạy.
2. Người dùng đã đăng nhập (cần cho bước Checkout).
3. Tồn tại ít nhất 2 sản phẩm A, B.
4. Giỏ hàng đang trống khi bắt đầu.

## Test steps
1. Mở ứng dụng → mở trang Giỏ hàng, xác nhận giỏ **trống**.
2. Thêm SP A → giỏ có 1 dòng A.
3. Bấm **Xóa** trên dòng A → hiện **dialog xác nhận**.
4. Bấm **Hủy** → dialog đóng, A vẫn còn (giỏ 1 dòng).
5. Bấm **Xóa** trên dòng A → dialog xác nhận.
6. Bấm **Xác nhận** → A bị xóa, giỏ về **trống**.
7. Kiểm tra **empty state**: có hình minh họa/icon + thông báo giỏ trống + nút "Tiếp tục mua sắm".
8. Thêm lại SP A → giỏ có 1 dòng.
9. Thêm SP B → giỏ có 2 dòng (nhiều dòng).
10. Đăng nhập (nếu chưa) → vào **Thanh toán** → xác nhận → thanh toán **thành công**.

## Expected results
1. Mỗi bước trạng thái giỏ đúng như cột "State sau" của kịch bản.
2. Nút **Xóa** luôn mở **dialog xác nhận**; **Hủy** giữ nguyên item, **Xác nhận** mới xóa.
3. Khi xóa dòng cuối cùng → giỏ về **trống** và hiển thị **empty state** đầy đủ (hình minh họa + message + nút tiếp tục mua sắm).
4. Sau **Checkout thành công** → chuyển sang trạng thái **Đã thanh toán (kết thúc)**; phiên mua sắm dừng lại.

## Actual results
Kịch bản **Fail**: bước Xóa (bước 2) không hiện dialog xác nhận, xóa ngay (BUG-CART-03) → không thực hiện được nhánh Hủy; khi giỏ về trống thì thiếu hình minh họa (BUG-CART-05).

## Status
Failed

## Related bugs
BUG-CART-03, BUG-CART-05
