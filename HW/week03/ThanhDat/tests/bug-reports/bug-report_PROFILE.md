# Bug Report — Feature A / FR-04 Personal profile management (Module `PROFILE`)

> Không kèm ảnh. Bằng chứng thay bằng dẫn chứng dòng code + HTTP thực tế. Nguồn TC: [EP-FR04.md](../test-design/EP-FR04.md), [BVA-FR04.md](../test-design/BVA-FR04.md).

| Bug ID   | Found by TC                                                                                    | Tiêu đề                                                                                                                                                    | Severity |
| -------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BUG-A-01 | TC-PROFILE-012                                                                                 | Privilege escalation: user thường tự gán `role=admin` qua `PUT /api/users/me` (server.js:124)                                                              | Critical |
| BUG-A-02 | TC-PROFILE-004                                                                                 | Stored XSS: `name` chứa HTML/script lưu raw; navbar Web render qua `dangerouslySetInnerHTML` (App.jsx:27) → script thực thi                                 | High     |
| BUG-A-03 | TC-PROFILE-002, -003, -005, -007, -008, -010                                                   | Thiếu validation server-side: `name`, `phone`, `shipping_address` không validate tại server; bypass qua Postman bỏ qua ràng buộc client                     | High     |
| BUG-A-04 | TC-PROFILE-011                                                                                 | Stored XSS: `shipping_address` chứa XSS payload lưu raw; render ở các trang hiển thị địa chỉ                                                                | Medium   |
| BUG-A-05 | TC-PROFILE-006                                                                                 | Design bug regex phone: `^[1-9][0-9]{8,9}$` từ chối số VN hợp lệ bắt đầu bằng 0 (vd `0912345678`)                                                           | Medium   |
| BUG-A-06 | _(Mobile — execute ở Feature D)_                                                               | Mobile field mismatch: App.js:302 gửi `shippingAddress` (camelCase) ≠ server đọc `shipping_address` → address không lưu được qua mobile                     | Medium   |
| BUG-A-07 | TC-PROFILE-015                                                                                 | Sensitive Data Exposure: `GET /api/users/me` dùng `SELECT *` (server.js:113) trả cả `password` (plaintext) và `reset_token` về client                       | Critical |
| BUG-A-08 | TC-PROFILE-016                                                                                 | Data loss: `PUT /api/users/me` luôn `SET name,shipping_address,phone` (server.js:121) → cập nhật thiếu field ghi NULL đè dữ liệu cũ (không partial update)  | High     |

## Chi tiết

### BUG-A-01 — Privilege escalation (Critical)
- **Found by:** TC-PROFILE-012
- **Steps:** Đăng nhập user thường → `PUT /api/users/me` body `{...,"role":"admin"}` → `GET /api/users/me`.
- **Expected:** Server bỏ qua trường `role`; GET vẫn trả `role:"user"`.
- **Actual:** `role` bị đổi thành `admin` (server.js:124 `if (role) { ... }`) → leo thang đặc quyền.

### BUG-A-02 — Stored XSS qua `name` (High)
- **Found by:** TC-PROFILE-004
- **Steps:** `PUT /api/users/me` với `name=<script>alert('XSS')</script>` → đăng nhập lại → quan sát navbar render `Chào, ...`.
- **Expected:** Sanitize/escape, script không chạy.
- **Actual:** Lưu raw; App.jsx:27 dùng `dangerouslySetInnerHTML` → script thực thi.

### BUG-A-03 — Thiếu validation server-side (High)
- **Found by:** TC-PROFILE-002, -003, -005, -007, -008, -010 (+ BVA -101, -104)
- **Steps:** Gửi qua Postman các body có `name` rỗng/whitespace, `phone` sai định dạng/độ dài, `address` rỗng.
- **Expected:** 400 báo lỗi tương ứng.
- **Actual:** 200, server lưu thẳng dữ liệu không hợp lệ (server.js:118-135 không validate).

### BUG-A-04 — Stored XSS qua `shipping_address` (Medium)
- **Found by:** TC-PROFILE-011
- **Steps:** `PUT /api/users/me` với `shipping_address=<img src=x onerror=alert(1)>` → GET /me → render.
- **Expected:** Sanitize.
- **Actual:** Lưu raw → Stored XSS khi địa chỉ được render.

### BUG-A-05 — Regex phone từ chối số VN hợp lệ (Medium)
- **Found by:** TC-PROFILE-006
- **Steps:** Nhập `0912345678` trên Web.
- **Expected:** Chấp nhận (số VN thật bắt đầu bằng 0).
- **Actual:** Regex `^[1-9][0-9]{8,9}$` từ chối vì ký tự đầu là 0 → lỗi thiết kế regex.

### BUG-A-06 — Mobile field name mismatch (Medium)
- **Found by:** Mobile test (execute ở Feature D)
- **Steps:** Cập nhật địa chỉ qua app mobile.
- **Expected:** Địa chỉ được lưu.
- **Actual:** App.js:302 gửi `shippingAddress` (camelCase) ≠ server đọc `shipping_address` → không bao giờ lưu (silent bug).

### BUG-A-07 — Sensitive Data Exposure (Critical)
- **Found by:** TC-PROFILE-015
- **Steps:** `GET /api/users/me` với JWT hợp lệ → kiểm field response.
- **Expected:** Không trả `password`, `reset_token`.
- **Actual:** server.js:113 `SELECT *` → trả cả `password` (plaintext) + `reset_token`.

### BUG-A-08 — Data loss on partial update (High)
- **Found by:** TC-PROFILE-016
- **Steps:** User có sẵn `phone`, `address` → `PUT /api/users/me` chỉ `{name}` → GET /me.
- **Expected:** Chỉ `name` đổi, các field khác giữ nguyên.
- **Actual:** server.js:121 luôn `SET name,shipping_address,phone` → `phone`/`address` bị set NULL → mất dữ liệu.

## Kết quả execute Feature A

| Chỉ số             | Số lượng                                          |
| ------------------ | ------------------------------------------------- |
| Test case thiết kế | 23 (14 Domain + 4 BVA + 5 bổ sung sau review)     |
| Đã execute         | 23                                                |
| Pass               | 6 (TC-001, 013, 014, 017, 102, 103)               |
| Fail               | 17                                                |
| Bug tìm được       | 7 (BUG-A-01…05, 07, 08; BUG-A-06 phủ ở Feature D) |
