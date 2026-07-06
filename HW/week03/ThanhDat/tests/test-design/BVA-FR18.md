# BVA-FR18 — Boundary Value Analysis: Order management (admin) — `order_id`

**Feature:** FR-18 — Order management (admin) · **Module:** `ADMIN_ORDER`
**Kỹ thuật:** ISTQB FL §4.2.2 Boundary Value Analysis — chiến lược **3-value**. Chỉ áp dụng cho biến có thứ tự.
**File liên quan:** [EP-FR18.md](EP-FR18.md) · [bug-report_ADMIN_ORDER.md](../bug-reports/bug-report_ADMIN_ORDER.md)

## 1. Các bước áp dụng (step-by-step)

1. **Chọn biến có thứ tự:** `status` là tập rời rạc không thứ tự → BVA không áp dụng. `order_id` là số nguyên dương → áp dụng BVA.
2. **Biên của `order_id`:**
   - Biên dưới đóng: `min = 1` (SQLite auto-increment bắt đầu từ 1 sau seed).
   - Biên trên: `max` = ID lớn nhất trong DB (phụ thuộc dữ liệu; reset DB seed 1 đơn → max=1).
   - Giá trị đặc biệt: id=0 (dưới min), id âm, id > max.
3. **Chiến lược 3-value:** {min-1, min, min+1} và {max-1, max, max+1}. min=1 → min-1=0, min+1=2. Chọn đại diện thực tế: min-1=0, min=1, max+1=99999.
4. **Nghi vấn off-by-one:** SQLite coerce `order_id="abc"`→0 → 404 (không crash, nhưng không báo lỗi kiểu). Server dùng exact match `WHERE id=?` → không có off-by-one ở biên.

## 2. Bảng giá trị biên (`order_id`)

| Biến       | Biên      | Điểm  | Giá trị | Kỳ vọng                                             |
| ---------- | --------- | ----- | ------- | --------------------------------------------------- |
| `order_id` | dưới (=1) | min-1 | `0`     | Invalid, SQLite coerce 0, không tìm thấy → 404      |
| `order_id` | dưới (=1) | min   | `1`     | Valid, đơn tồn tại sau seed → 200                   |
| `order_id` | dưới (=1) | min+1 | `2`     | Valid nếu có đơn thứ 2, else 404                    |
| `order_id` | trên      | max+1 | `99999` | Invalid, không tồn tại → 404                        |
| `order_id` | ký tự     | —     | `"abc"` | Invalid kiểu, SQLite coerce → 0 → 404 (không crash) |

## 3. Test cases — BVA

> Dùng transition `pending → confirmed` (valid) để cô lập tác động của biên `id`.

| TC ID              | Mô tả                                          | Biên kiểm tra | Test data                                                          | Expected result                                                             | Status |
| ------------------ | ---------------------------------------------- | ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------ |
| TC-ADMIN_ORDER-101 | order_id = 0 (min-1), dưới biên nhỏ nhất       | min-1 = 0     | `PUT /api/admin/orders/0/status` `{"status":"confirmed"}`          | 404 `{"error":"Order not found"}`, SQLite coerce 0, không match bản ghi     | PASS   |
| TC-ADMIN_ORDER-102 | order_id = 1 (min), đơn tồn tại sau seed        | min = 1       | `PUT /api/admin/orders/1/status` `{"status":"confirmed"}`          | 200 `{"message":"Order status updated"}`                                    | PASS   |
| TC-ADMIN_ORDER-103 | order_id = 99999 (max+1), ngoài range           | max+1 = 99999 | `PUT /api/admin/orders/99999/status` `{"status":"confirmed"}`      | 404 `{"error":"Order not found"}`                                           | PASS   |

## 4. Truy vết coverage (Biên ↔ TC)

| Điểm biên | Giá trị | Phủ bởi TC         | Ghi chú                              |
| --------- | ------- | ------------------ | ------------------------------------ |
| min-1     | 0       | TC-ADMIN_ORDER-101 | Invalid, dưới biên; coerce 0 → 404   |
| min       | 1       | TC-ADMIN_ORDER-102 | Valid, đơn tồn tại sau seed          |
| max+1     | 99999   | TC-ADMIN_ORDER-103 | Invalid, ngoài range → 404           |

> Ghi chú: `order_id="abc"` (sai kiểu) được kiểm ở TC-ADMIN_ORDER-015 (xem [EP-FR18.md](EP-FR18.md) §5), không phải điểm biên số học.
