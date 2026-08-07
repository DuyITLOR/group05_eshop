# 🐛 Báo Cáo Lỗi Kiểm Thử (Bug Report) - Feature FR-10 (Order State Machine)

**Ngày tạo:** 2026-08-07  
**Người thực hiện:** 23127340  

---

## [BUG-FR10-01] SUT cho phép chuyển trạng thái giao hàng thành công (delivered) đối với đơn hàng đã bị hủy (canceled)

- **Bug ID:** BUG-FR10-01
- **Test Case liên quan:** FR10-STT-19 (Chặn giao thành công đơn hàng đã bị hủy (canceled -> delivered))
- **Trình duyệt bị lỗi:** Chromium, Firefox, WebKit
- **Severity (Mức độ nghiêm trọng kỹ thuật):** Major
- **Priority (Mức độ ưu tiên xử lý kinh doanh):** P1 (High)
- **Trạng thái:** New

### 1. Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập tài khoản Admin lấy JWT token qua API `POST http://localhost:3000/api/login`.
2. Khởi tạo một đơn hàng mới qua API `POST http://localhost:3000/api/checkout`.
3. Cập nhật đơn hàng sang trạng thái đã hủy (`canceled`) qua API `PUT http://localhost:3000/api/admin/orders/{orderId}/status` với dữ liệu `{ "status": "canceled" }`.
4. Gửi yêu cầu chuyển trạng thái đơn hàng sang đã giao hàng (`delivered`) qua API `PUT http://localhost:3000/api/admin/orders/{orderId}/status` với dữ liệu `{ "status": "delivered" }`.

### 2. Kết quả thực tế (Actual Result)
- API trả về mã phản hồi `HTTP 200 OK`.
- Đơn hàng bị cập nhật trạng thái từ `canceled` sang `delivered` bất hợp lệ.
- Playwright Assertion log:
  ```text
  Error: expect(received).toBe(expected)
  Expected: 400
  Received: 200
  ```

### 3. Kết quả kỳ vọng (Expected Result)
- API từ chối việc chuyển trạng thái nhảy vọt/bất hợp lệ từ `canceled` sang `delivered`.
- Trả về mã lỗi `HTTP 400 Bad Request` cùng thông điệp lỗi chứa `"Invalid state transition"`.
- Trạng thái lưu trữ thực tế của đơn hàng trong CSDL vẫn giữ nguyên là `canceled`.

---
