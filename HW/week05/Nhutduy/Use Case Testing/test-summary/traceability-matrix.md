# Traceability Matrix — FR-07 (Giỏ hàng) · Use-Case Testing

**Module:** CART · **Kỹ thuật:** Use-Case Testing
**Nguồn thiết kế:** Use Case/UC-CART.md

## Truy vết Scenario/Extension → Test Case

| Scenario / Extension | Requirement | Test Case | Result | Bug |
|---|---|---|---|---|
| Main Success Scenario (bước 1–10) | FR-07 | TC-CART-UC-01 | ❌ Failed | BUG-CART-06, 04, 02, 03, 07 |
| Extension 1a — thêm lại SP đã có | FR-07 | TC-CART-UC-02 | ❌ Failed | BUG-CART-01 |
| Extension 4a — giỏ trống (empty state) | FR-07 / FR-24 | TC-CART-UC-03 | ❌ Failed | BUG-CART-05 |
| Extension 5a — giảm số lượng tại biên = 1 | FR-07 / FR-06 | TC-CART-UC-04 | ⏸ Blocked | BUG-CART-02 |
| Extension 8a — hủy dialog xóa | FR-07 / FR-24 | TC-CART-UC-05 | ⏸ Blocked | BUG-CART-03 |
| Bước 4 — bất biến hiển thị ("Tổng cộng", đủ cột) | FR-07 | TC-CART-UC-06 | ❌ Failed | BUG-CART-04, 02 |

## Bug phát hiện (thư mục `Bug Report/` — dùng chung cho FR-07)

| Bug | Mô tả | Severity | Found by |
|---|---|---|---|
| BUG-CART-01 | Thêm lại SP đã có tạo dòng mới (không gộp) | Major | TC-CART-UC-02 |
| BUG-CART-02 | Thiếu nút +/- chỉnh số lượng | Major | TC-CART-UC-01, 04, 06 |
| BUG-CART-03 | Nút Xóa không có dialog xác nhận | Major | TC-CART-UC-01, 05 |
| BUG-CART-04 | Nhãn tổng "Tổng tạm tính" (phải "Tổng cộng") | Minor | TC-CART-UC-06, 01 |
| BUG-CART-05 | Giỏ trống thiếu hình minh họa | Minor | TC-CART-UC-03 |
| BUG-CART-06 | "Thêm vào giỏ" phải bấm 2 lần | Major | TC-CART-UC-01 |
| BUG-CART-07 | Nút "Mua tiếp" (phải "Tiếp tục mua sắm") | Trivial | TC-CART-UC-01 |

## Tổng kết độ phủ

- **Kỹ thuật phủ:** Use-Case Testing — 1 TC cho Main Success Scenario + 1 TC cho mỗi Extension + 1 TC kiểm hiển thị.
- **Scenario/Extension phủ:** Main Success Scenario + **4/4 Extensions** (1a, 4a, 5a, 8a) + bất biến hiển thị bước 4.
- **Số test case:** **6**.
- **Cross-reference:** TC-UC-03/05 liên quan FR-24 (dialog xác nhận, empty state); TC-UC-04 liên quan FR-06 (số lượng tối thiểu = 1).

## Ghi chú

- Đã **thực thi**: 4 Failed + 2 Blocked (2 ca Blocked do thiếu control để thao tác: không có nút − và không có dialog xác nhận).
- Phát hiện **7 bug** (BUG-CART-01…07) trong FR-07, mỗi bug 1 file trong `Bug Report/`, liên kết 2 chiều với test case phát hiện.
