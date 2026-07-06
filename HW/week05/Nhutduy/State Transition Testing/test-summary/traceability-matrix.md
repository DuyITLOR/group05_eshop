# Traceability Matrix — FR-07 (Giỏ hàng) · State Transition Testing (End-to-End)

**Module:** CART · **Kỹ thuật:** State Transition — độ phủ **End-to-End**
**Nguồn thiết kế:** Test Design/ST-CART.md
**States (6):** Khởi tạo, Giỏ trống, Giỏ 1 dòng, Giỏ nhiều dòng, Dialog xác nhận, Đã thanh toán · **Actions (6):** A1–A6

## Danh sách Test Case

| Test Case | Loại | Kịch bản | Requirement | Result | Bug |
|---|---|---|---|---|---|
| TC-CART-E2E-01 | End-to-End | Mua sắm, chỉnh sửa giỏ & thanh toán | FR-07 (+FR-06/08/24) | ❌ Failed | BUG-CART-06, 01, 02, 03, 04 |
| TC-CART-E2E-02 | End-to-End | Xóa hết giỏ, mua lại & thanh toán | FR-07 (+FR-06/08/24) | ❌ Failed | BUG-CART-03, 05 |

## Bug phát hiện (thư mục `Bug Report/` — dùng chung cho FR-07)

| Bug | Mô tả | Severity | Found by |
|---|---|---|---|
| BUG-CART-01 | Thêm lại SP đã có tạo dòng mới (không gộp) | Major | TC-CART-E2E-01 |
| BUG-CART-02 | Thiếu nút +/- chỉnh số lượng | Major | TC-CART-E2E-01 |
| BUG-CART-03 | Nút Xóa không có dialog xác nhận | Major | TC-CART-E2E-01, 02 |
| BUG-CART-04 | Nhãn tổng "Tổng tạm tính" (phải "Tổng cộng") | Minor | TC-CART-E2E-01 |
| BUG-CART-05 | Giỏ trống thiếu hình minh họa | Minor | TC-CART-E2E-02 |
| BUG-CART-06 | "Thêm vào giỏ" phải bấm 2 lần | Major | TC-CART-E2E-01 |

## Truy vết Chuyển tiếp → Test Case (phủ bởi kịch bản E2E)

| Chuyển tiếp (From → To) | Action / Trigger | E2E-01 | E2E-02 |
|---|---|:--:|:--:|
| Khởi tạo → Giỏ trống | *(khởi tạo tự động)* | ✓ | ✓ |
| Giỏ trống → Giỏ 1 dòng | A1 AddNew | ✓ | ✓ |
| Giỏ 1 dòng → Giỏ 1 dòng | A2 ChangeQty (+, −, biên min 1) | ✓ | |
| Giỏ 1 dòng → Giỏ nhiều dòng | A1 AddNew | ✓ | ✓ |
| Giỏ 1 dòng → Dialog xác nhận | A3 ClickDelete | | ✓ |
| Giỏ 1 dòng → Đã thanh toán | A6 Checkout | ✓ | |
| Giỏ nhiều dòng → Giỏ nhiều dòng | A1 AddNew | ✓ | |
| Giỏ nhiều dòng → Giỏ nhiều dòng | A2 ChangeQty | ✓ | |
| Giỏ nhiều dòng → Dialog xác nhận | A3 ClickDelete | ✓ | |
| Giỏ nhiều dòng → Đã thanh toán | A6 Checkout | | ✓ |
| Dialog xác nhận → Giỏ trống | A4 ConfirmDelete (còn 0 dòng) | | ✓ |
| Dialog xác nhận → Giỏ 1 dòng | A4 ConfirmDelete (còn 1 dòng) | ✓ | |
| Dialog xác nhận → Giỏ nhiều dòng | A4 ConfirmDelete (còn ≥2 dòng) | ✓ | |
| Dialog xác nhận → Giỏ 1 dòng | A5 CancelDelete (giỏ 1 dòng) | | ✓ |
| Dialog xác nhận → Giỏ nhiều dòng | A5 CancelDelete (giỏ ≥2 dòng) | ✓ | |

## Tổng kết độ phủ

- **Kỹ thuật phủ:** **End-to-End Test** — mỗi test case là 1 kịch bản xuyên suốt Khởi tạo → Đã thanh toán.
- **States phủ:** 6/6 (Khởi tạo, Giỏ trống, Giỏ 1 dòng, Giỏ nhiều dòng, Dialog xác nhận, Đã thanh toán).
- **Chuyển tiếp phủ:** phủ **11/11 tổ hợp valid** trong bảng C1 (36 tổ hợp) + **1 chuyển tiếp khởi tạo tự động**; trong đó 2 tổ hợp có End theo điều kiện (Dialog×A4, Dialog×A5) được phủ **đủ mọi nhánh kết quả**, cùng 2 lối vào **trạng thái kết thúc** và **empty state**.
- **Số test case:** **2** kịch bản End-to-End.
- **Cross-reference:** cả 2 kịch bản kết thúc bằng Checkout → Đã thanh toán (liên quan FR-08).

## Ghi chú

- Đã **thực thi**: cả 2 kịch bản End-to-End đều **Failed** — mỗi kịch bản dừng ở bước đầu tiên gặp lỗi.
- Phát hiện **6 bug** (BUG-CART-01…06) trong FR-07, mỗi bug 1 file trong `Bug Report/`, liên kết 2 chiều với test case phát hiện.
