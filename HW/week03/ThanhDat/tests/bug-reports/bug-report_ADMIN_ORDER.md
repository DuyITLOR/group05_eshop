# Bug Report — Feature C / FR-18 Order management (admin) (Module `ADMIN_ORDER`)

> Không kèm ảnh. Bằng chứng thay bằng dẫn chứng dòng code + HTTP thực tế. Nguồn TC: [EP-FR18.md](../test-design/EP-FR18.md), [BVA-FR18.md](../test-design/BVA-FR18.md).

| Bug ID   | Found by TC                            | Tiêu đề                                                                                                                                                                                             | Severity |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BUG-C-01 | TC-ADMIN_ORDER-002, TC-ADMIN_ORDER-013 | Authorization bypass: `/api/admin/*` không kiểm tra `role=admin` → user thường đọc/sửa được đơn (server.js:510/525)                                                                                 | Critical |
| BUG-C-02 | TC-ADMIN_ORDER-010                     | State machine bug: `canceled → delivered` được cho phép (server.js:550-551), đơn đã hủy lại thành đã giao                                                                                           | High     |
| BUG-C-03 | TC-ADMIN_ORDER-016, TC-ADMIN_ORDER-017 | Thiếu input validation cho `status`: body thiếu field hoặc `status=""` không bị chặn (server.js:526) → lọt vào kiểm transition, trả thông điệp sai `"...to undefined"`/`"...to "` thay vì 400       | Medium   |

## Chi tiết

### BUG-C-01 — Authorization bypass (Critical)
- **Found by:** TC-ADMIN_ORDER-002, TC-ADMIN_ORDER-013
- **Steps:** Đăng nhập user thường → `GET /api/admin/orders` và `PUT /api/admin/orders/:id/status` với token user.
- **Expected:** 403 Forbidden (chỉ admin).
- **Actual:** 200, đọc/sửa được đơn. Route `/api/admin/*` chỉ `authenticateToken`, không kiểm `role==='admin'` (server.js:510/525).

### BUG-C-02 — State machine bug canceled → delivered (High)
- **Found by:** TC-ADMIN_ORDER-010
- **Steps:** Đưa đơn về `canceled` → `PUT .../status` `{"status":"delivered"}`.
- **Expected:** 400 (canceled là trạng thái kết thúc).
- **Actual:** 200, chuyển thành `delivered`. server.js:550-551 cho phép transition vô lý này.

### BUG-C-03 — Thiếu input validation cho `status` (Medium)
- **Found by:** TC-ADMIN_ORDER-016, TC-ADMIN_ORDER-017
- **Steps:** `PUT /api/admin/orders/1/status` với body `{}` (thiếu `status`) hoặc `{"status":""}`.
- **Expected:** 400 "status là bắt buộc / không hợp lệ".
- **Actual:** 400 nhưng thông điệp sai: `"Invalid state transition from pending to undefined"` / `"...to "`. server.js:526 không validate `status` bắt buộc/enum trước khi vào kiểm transition.

## Kết quả execute Feature C

> Đã execute thật trên `http://localhost:3000` (Node v22.22.1, DB reset bằng `node database.js`), gọi API trực tiếp bằng curl.

| Chỉ số             | Số lượng                         |
| ------------------ | -------------------------------- |
| Test case thiết kế | 23 (13 Domain + 3 BVA + 7 Gap)   |
| Đã execute         | 23                               |
| Pass               | 17                               |
| Fail               | 5 (TC-002, 010, 013, 016, 017)   |
| Cần xác minh spec  | 1 (TC-019, shipping → canceled)  |
| Bug tìm được       | 3 (BUG-C-01, BUG-C-02, BUG-C-03) |
