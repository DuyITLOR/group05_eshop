# TC-CART-E2E-01: Mua sắm, chỉnh sửa giỏ & thanh toán (Khởi tạo → … → Đã thanh toán)

## Requirement ID
FR-07 (tham chiếu FR-06, FR-08, FR-24)

## Module / Test type / Technique
Cart / End-to-End / State Transition

## Test design source
Test Design/ST-CART.md — Kịch bản End-to-End E2E-01

## Coverage
| Coverage Type | Chuyển tiếp phủ |
|---|---|
| End-to-End (chuỗi chuyển tiếp liên tiếp) | Khởi tạo→Giỏ trống, Giỏ trống→Giỏ 1 dòng, Giỏ 1 dòng→Giỏ 1 dòng (A2 +/−/biên min 1), Giỏ 1 dòng→Giỏ nhiều dòng, Giỏ nhiều dòng→Giỏ nhiều dòng (A1, A2), Giỏ nhiều dòng→Dialog xác nhận, Dialog→Giỏ nhiều dòng (Cancel & Confirm còn ≥2 dòng), Dialog→Giỏ 1 dòng (Confirm còn 1 dòng), Giỏ 1 dòng→Đã thanh toán |

## Kịch bản (đường đi trạng thái)
| Bước | State trước | Sự kiện | State sau | Chuyển tiếp |
|:--:|:--|---|:--|---|
| 0 | — | Mở app *(khởi tạo tự động)* | Giỏ trống | Khởi tạo → Giỏ trống |
| 1 | Giỏ trống | A1 AddNew (SP A) | Giỏ 1 dòng | Giỏ trống → Giỏ 1 dòng |
| 2 | Giỏ 1 dòng | A2 ChangeQty **+** (A: 1→2) | Giỏ 1 dòng | Giỏ 1 dòng → Giỏ 1 dòng |
| 3 | Giỏ 1 dòng | A2 ChangeQty **−** (A: 2→1) | Giỏ 1 dòng | Giỏ 1 dòng → Giỏ 1 dòng |
| 4 | Giỏ 1 dòng | A1 AddNew (SP B) | Giỏ nhiều dòng | Giỏ 1 dòng → Giỏ nhiều dòng |
| 5 | Giỏ nhiều dòng | A1 AddNew (SP C) | Giỏ nhiều dòng | Giỏ nhiều dòng → Giỏ nhiều dòng |
| 6 | Giỏ nhiều dòng | A2 ChangeQty (B +) | Giỏ nhiều dòng | Giỏ nhiều dòng → Giỏ nhiều dòng |
| 7 | Giỏ nhiều dòng | A3 ClickDelete (C) | Dialog xác nhận | Giỏ nhiều dòng → Dialog xác nhận |
| 8 | Dialog xác nhận | A5 CancelDelete (giỏ ≥2 dòng) | Giỏ nhiều dòng | Dialog → Giỏ nhiều dòng (Cancel) |
| 9 | Giỏ nhiều dòng | A3 ClickDelete (C) | Dialog xác nhận | Giỏ nhiều dòng → Dialog xác nhận |
| 10 | Dialog xác nhận | A4 ConfirmDelete (còn A, B) | Giỏ nhiều dòng | Dialog → Giỏ nhiều dòng (Confirm, còn ≥2 dòng) |
| 11 | Giỏ nhiều dòng | A3 ClickDelete (B) | Dialog xác nhận | Giỏ nhiều dòng → Dialog xác nhận |
| 12 | Dialog xác nhận | A4 ConfirmDelete (còn A) | Giỏ 1 dòng | Dialog → Giỏ 1 dòng (Confirm, còn 1 dòng) |
| 13 | Giỏ 1 dòng | A2 ChangeQty **−** (A: 1→1, biên) | Giỏ 1 dòng | Giỏ 1 dòng → Giỏ 1 dòng (min 1) |
| 14 | Giỏ 1 dòng | A6 Checkout | **Đã thanh toán** | Giỏ 1 dòng → Đã thanh toán |

## Preconditions
1. Backend (`:3000`) và frontend-web (`:5173`) đang chạy.
2. Người dùng đã đăng nhập (cần cho bước Checkout).
3. Tồn tại ít nhất 3 sản phẩm A, B, C.
4. Giỏ hàng đang trống khi bắt đầu.

## Test steps
1. Mở ứng dụng → mở trang Giỏ hàng, xác nhận giỏ **trống**.
2. Thêm SP A vào giỏ → giỏ có 1 dòng A.
3. Ở giỏ, bấm **+** trên dòng A → số lượng A = 2.
4. Bấm **−** trên dòng A → số lượng A = 1.
5. Thêm SP B → giỏ có 2 dòng (nhiều dòng).
6. Thêm SP C → giỏ có 3 dòng.
7. Bấm **+** trên dòng B → số lượng B tăng.
8. Bấm **Xóa** trên dòng C → hiện **dialog xác nhận**.
9. Bấm **Hủy** → dialog đóng, C vẫn còn (giỏ nhiều dòng).
10. Bấm **Xóa** trên dòng C → dialog xác nhận.
11. Bấm **Xác nhận** → C bị xóa, còn A, B (giỏ nhiều dòng).
12. Bấm **Xóa** trên dòng B → dialog xác nhận.
13. Bấm **Xác nhận** → B bị xóa, còn A (giỏ 1 dòng).
14. Bấm **−** trên dòng A (đang = 1) → số lượng giữ nguyên 1.
15. Đăng nhập (nếu chưa) → vào **Thanh toán** → xác nhận → thanh toán **thành công**.

## Expected results
1. Mỗi bước trạng thái giỏ đúng như cột "State sau" của kịch bản.
2. Thêm/bớt số lượng bằng nút +/−, cột **Số lượng** hiển thị đúng; nhãn tổng là **"Tổng cộng"**.
3. Nút **Xóa** luôn mở **dialog xác nhận** trước khi xóa; **Hủy** giữ nguyên, **Xác nhận** mới xóa.
4. Bấm **−** khi số lượng = 1 → **giữ nguyên 1** (không về 0, không xóa dòng) — số lượng tối thiểu = 1.
5. Sau **Checkout thành công** → chuyển sang trạng thái **Đã thanh toán (kết thúc)**; phiên mua sắm dừng lại.

## Actual results
_(Chưa thực thi — điền khi chạy kiểm thử. Ghi rõ bước đầu tiên bị sai nếu có.)_

## Status
Not Run

## Related bugs
_(điền khi chạy)_
