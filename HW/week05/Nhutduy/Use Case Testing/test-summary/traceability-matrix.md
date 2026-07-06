# Traceability Matrix — FR-07 (Giỏ hàng) · Use-Case Testing

**Module:** CART · **Kỹ thuật:** Use-Case Testing
**Nguồn thiết kế:** Use Case/UC-CART.md

## Truy vết Scenario/Extension → Test Case

| Scenario / Extension | Requirement | Test Case | Result | Status |
|---|---|---|---|---|
| Main Success Scenario (bước 1–10) | FR-07 | TC-CART-UC-01 | Not Run | Designed |
| Extension 1a — thêm lại SP đã có | FR-07 | TC-CART-UC-02 | Not Run | Designed |
| Extension 4a — giỏ trống (empty state) | FR-07 / FR-24 | TC-CART-UC-03 | Not Run | Designed |
| Extension 5a — giảm số lượng tại biên = 1 | FR-07 / FR-06 | TC-CART-UC-04 | Not Run | Designed |
| Extension 8a — hủy dialog xóa | FR-07 / FR-24 | TC-CART-UC-05 | Not Run | Designed |
| Bước 4 — bất biến hiển thị ("Tổng cộng", đủ cột) | FR-07 | TC-CART-UC-06 | Not Run | Designed |

## Tổng kết độ phủ

- **Kỹ thuật phủ:** Use-Case Testing — 1 TC cho Main Success Scenario + 1 TC cho mỗi Extension + 1 TC kiểm hiển thị.
- **Scenario/Extension phủ:** Main Success Scenario + **4/4 Extensions** (1a, 4a, 5a, 8a) + bất biến hiển thị bước 4.
- **Số test case:** **6**.
- **Cross-reference:** TC-UC-03/05 liên quan FR-24 (dialog xác nhận, empty state); TC-UC-04 liên quan FR-06 (số lượng tối thiểu = 1).

## Ghi chú

- Test case ở trạng thái **Designed / Not Run** (thiết kế black-box từ đặc tả FR-07).
- Khi thực thi: cập nhật **Result** (Pass/Fail/Blocked) và cột **Bug** nếu Actual ≠ Expected; mỗi ca Fail lập 1 file Bug Report trong `Bug Report/` và liên kết ngược về test case.
