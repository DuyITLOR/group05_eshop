# Traceability Matrix — FR-08 (Thanh toán / Checkout) · Use-Case Testing

**Module:** CHECKOUT · **Kỹ thuật:** Use-Case Testing
**Nguồn thiết kế:** Use Case/UC-CHECKOUT.md
**Phương pháp thực thi:** Phân tích code tĩnh (chưa chạy Playwright/live) — xem `test-summary/run-FR08-use-case.md`

## Truy vết Scenario → Test Case → Kết quả

| Scenario | Requirement | Test Case | Result | Related Bug |
|---|---|---|---|---|
| Basic Flow (đặt hàng end-to-end) | FR-08 | TC-CHECKOUT-07 | Failed | FR08-bug-02, FR08-bug-03 |
| ALT-1 (Guest → login → checkout) | FR-08 | TC-CHECKOUT-08 | Failed | FR08-bug-03 |
| EXC-1 (chưa login vào thẳng /checkout) | FR-08 | TC-CHECKOUT-09 | Failed | FR08-bug-04 |
| EXC-2 (API checkout không token) | FR-08 / SEC-02 | TC-CHECKOUT-10 | Passed | — |
| EXC-3 (API checkout token sai/hết hạn) | FR-08 / SEC-02 | TC-CHECKOUT-11 | Passed | — |
| EXC-4 (total_amount sửa thấp) | FR-08 | TC-CHECKOUT-12 | Failed | FR08-bug-01 |
| EXC-5 (total_amount sửa cao) | FR-08 | TC-CHECKOUT-13 | Failed | FR08-bug-01 |
| EXC-6 (checkout giỏ rỗng) | FR-08 / FR-07 | TC-CHECKOUT-14 | Passed | — |

## Tổng kết độ phủ

- **Kỹ thuật phủ:** Use-Case Testing — 1 TC cho Basic Flow + 1 TC cho Alternative Flow + 1 TC cho mỗi Exception Flow (6 exception).
- **Scenario phủ:** Basic + ALT-1 + **6/6 Exception Flows**.
- **Số test case:** **8** (TC-CHECKOUT-07 → 14, nối tiếp bộ State Transition TC-FR08-01..06 đã có).
- **Kết quả:** 3 Passed / 5 Failed.

## Bug phát hiện

| Bug ID | Test Case | Mô tả ngắn | Mức độ (đề xuất) |
|---|---|---|---|
| FR08-bug-01 | TC-CHECKOUT-12, -13 | Backend không tính lại tổng tiền, nhận thẳng `total_amount` từ client | Critical / P0 |
| FR08-bug-02 | TC-CHECKOUT-07 | Trang Checkout cho phép sửa trực tiếp tổng tiền | Major / P1 |
| FR08-bug-03 | TC-CHECKOUT-07, -08 | Giỏ hàng không bị xóa sau thanh toán | Major / P1 |
| FR08-bug-04 | TC-CHECKOUT-09 | Route `/checkout` không có guard đăng nhập | Major / P1 |

## Ghi chú

- Kết quả được **suy ra từ phân tích mã nguồn** (backend `server.js`, frontend `Checkout.jsx`/`Cart.jsx`/`CartContext.jsx`/`App.jsx`), **chưa chạy trình duyệt thật**. Cần chạy lại bằng Playwright để xác nhận chính thức và bổ sung screenshot cho mỗi Bug Report (`Bug Report/images/`).
- Mỗi ca Fail đã có 1 file Bug Report trong `Bug Report/` liên kết ngược về test case phát hiện.
- Đây là bản nháp AI sinh ra — người thực hiện cần tự review trước khi nộp bài.
