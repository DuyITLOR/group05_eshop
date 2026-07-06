
# 08 — Bug Report: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

---

### BUG-B-001 — User cancel được order khi status=shipping (vi phạm SPEC FR-10)

**Severity:** High
**Priority:** High

**Steps to reproduce**

1. Login as `test@eshop.com`
2. Tạo/có order với `status=shipping`
3. Vào Profile → Lịch sử đơn hàng
4. Bấm "Hủy đơn" trên order đang giao

**Actual**
`200 OK`, order status cập nhật thành `canceled`

**Expected**
`400 "Cannot cancel this order"` — SPEC FR-10: User không được phép hủy khi đang giao (chỉ Admin)

**Notes**
Root cause: `server.js` line 329 — condition chỉ block `delivered` và `canceled`, thiếu `shipping`. Ảnh hưởng business logic: user bypass được quyền Admin. Related TC: DT-B-012

**Screenshot**
![BUG-B-001_before](screenshots/BUG-B-001_before.png)
![BUG-B-001_after](screenshots/BUG-B-001_after.png)

---

### BUG-B-002 — JWT verify trả 403 thay vì 401

**Severity:** Medium
**Priority:** Medium

**Steps to reproduce**

1. GET `/api/orders/my-orders` với expired hoặc malformed JWT token

**Actual**
`403 Forbidden`

**Expected**
`401 Unauthorized` — theo chuẩn HTTP, 401 = chưa xác thực, 403 = đã xác thực nhưng không có quyền

**Notes**
Root cause: `server.js` line 106 — `if (err) return res.status(403)`. Related TC: DT-B-003, DT-B-004

**Screenshot**
![BUG-B-002](screenshots/BUG-B-002.png)

---

### BUG-B-003 — NULL `created_at` hiển thị "Invalid Date"

**Severity:** Medium
**Priority:** Medium

**Steps to reproduce**

1. Set DB: `UPDATE orders SET created_at=NULL WHERE id=1`
2. Login → Profile → Lịch sử đơn hàng

**Actual**
Hiển thị "Invalid Date" (`new Date(null).toLocaleDateString()`)

**Expected**
Hiển thị "N/A" hoặc ẩn field ngày tạo

**Notes**
Root cause: `Profile.jsx` line 186 — không check null trước khi gọi `new Date()`. Related TC: DT-B-018

**Screenshot**
![BUG-B-003](screenshots/BUG-B-003.png)

---

## Thống kê

| Severity | Count | Bug IDs |
| --- | --- | --- |
| High | 1 | BUG-B-001 |
| Medium | 2 | BUG-B-002, BUG-B-003 |
| **Tổng** | **3** | |
