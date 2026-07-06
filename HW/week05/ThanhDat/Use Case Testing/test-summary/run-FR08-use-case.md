# Test Execution Report — FR-08 Thanh toán (Checkout) — Use Case Testing

## 0. Thông tin
- **Feature:** FR-08 — Thanh toán (Checkout)
- **Kỹ thuật:** Use Case Testing
- **Test design source:** `tests/test-design/UC-FR08.md`
- **Môi trường mục tiêu:** frontend-web `http://localhost:5173`, backend `http://localhost:3000`
- **Công cụ thực thi:** Claude Code — **phân tích code tĩnh** (KHÔNG chạy Playwright/live)
- **Ngày chạy:** 2026-07-06

> ⚠️ **Cảnh báo phương pháp:** Kết quả dưới đây được **suy ra từ đọc mã nguồn** (backend `server.js`, frontend `Checkout.jsx`/`Cart.jsx`/`CartContext.jsx`/`App.jsx`), KHÔNG phải từ thực thi trình duyệt thật. Các verdict có độ tin cậy cao vì dựa trên đường đi code cụ thể, nhưng **cần chạy lại bằng Playwright để xác nhận chính thức** trước khi nộp bài. Bug report chưa có screenshot (thay bằng dẫn chứng dòng code).

## 1. Kết quả từng Test Case

| Test Case ID | Test Objective | Status | Related Bug |
|---|---|---|---|
| TC-CHECKOUT-07 | Basic Flow — đặt hàng thành công end-to-end | **Failed** | FR08-bug-02, FR08-bug-03 |
| TC-CHECKOUT-08 | ALT-1 — Guest → login → hoàn tất thanh toán | **Failed** | FR08-bug-03 |
| TC-CHECKOUT-09 | EXC-1 — chưa đăng nhập truy cập thẳng Checkout | **Failed** | FR08-bug-04 |
| TC-CHECKOUT-10 | EXC-2 — API checkout không token → 401 | Passed | None |
| TC-CHECKOUT-11 | EXC-3 — API checkout token sai/hết hạn → 401/403 | Passed | None |
| TC-CHECKOUT-12 | EXC-4 — total_amount sửa thấp → server tính lại | **Failed** | FR08-bug-01 |
| TC-CHECKOUT-13 | EXC-5 — total_amount sửa cao → server tính lại | **Failed** | FR08-bug-01 |
| TC-CHECKOUT-14 | EXC-6 — checkout giỏ rỗng bị chặn | Passed | None (có quan sát phụ) |

## 2. Thống kê

- Tổng số test case: **8**
- Passed: **3** · Failed: **5** · Blocked: 0 · Not Run: 0
- Tỉ lệ pass: **3/8 (37.5%)**

## 3. Truy vết (Scenario ↔ Test Case ↔ Kết quả)

| ID Test Design | Scenario | Test Case | Status |
|---|---|---|---|
| FR08_UC_01 | Basic Flow | TC-CHECKOUT-07 | Failed |
| FR08_UC_02 | ALT-1 | TC-CHECKOUT-08 | Failed |
| FR08_UC_03 | EXC-1 | TC-CHECKOUT-09 | Failed |
| FR08_UC_04 | EXC-2 | TC-CHECKOUT-10 | Passed |
| FR08_UC_05 | EXC-3 | TC-CHECKOUT-11 | Passed |
| FR08_UC_06 | EXC-4 | TC-CHECKOUT-12 | Failed |
| FR08_UC_07 | EXC-5 | TC-CHECKOUT-13 | Failed |
| FR08_UC_08 | EXC-6 | TC-CHECKOUT-14 | Passed |

## 4. Bug phát hiện

| Bug ID | Test Case | Mô tả ngắn | Mức độ (đề xuất) |
|---|---|---|---|
| FR08-bug-01 | TC-CHECKOUT-12, -13 | Backend không tính lại tổng tiền — nhận thẳng `total_amount` từ client (`server.js:299–303`) | Critical / P0 |
| FR08-bug-02 | TC-CHECKOUT-07 | Trang Checkout cho phép sửa trực tiếp tổng tiền (`Checkout.jsx:91–103`) | Major / P1 |
| FR08-bug-03 | TC-CHECKOUT-07, -08 | Giỏ hàng không bị xóa sau thanh toán (`Checkout.jsx:40–66`; `server.js:297–309`) | Major / P1 |
| FR08-bug-04 | TC-CHECKOUT-09 | Route `/checkout` không có guard — truy cập được khi chưa đăng nhập (`App.jsx:58`) | Major / P1 |

Chi tiết đầy đủ ở `bugs/FR08/FR08-bug-01.md` … `FR08-bug-04.md`.

## 5. Ghi chú & bước tiếp theo
- FR08-bug-01 và FR08-bug-02 kết hợp tạo lỗ hổng nghiêm trọng: người dùng đặt hàng với giá tùy ý ngay từ UI (sửa ô tổng tiền) hoặc qua API.
- Các test case bảo mật API (TC-10, TC-11) đạt — middleware `authenticateToken` chặn đúng khi thiếu/sai token.
- **Việc cần làm:** chạy lại toàn bộ 8 test case bằng Playwright khi phiên có MCP để xác nhận verdict và bổ sung screenshot cho 4 bug report; sau đó cân nhắc chạy skill `gen-audit-log` để log phiên làm việc.

> Đây là báo cáo do AI tạo dựa trên phân tích mã nguồn — người thực hiện cần tự review lại trước khi nộp bài.
