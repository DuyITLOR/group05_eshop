# STEP 4 — BVA Table: FR-14 Category Management (CRUD)

> **Nguyên tắc:** BVA chỉ áp dụng cho ordered domains (numeric, length). Categorical values (format, encoding, XSS) KHÔNG phải BVA → để ở Supplementary trong Step 5.

---

## BVA Boundaries

### Field 1: `name` Length — Create Category

> **Boundary source:** SPEC — "Tên danh mục không được để trống" → Min = 1.
> CODE — không validate, không giới hạn max. SQLite TEXT unlimited.
> SPEC không quy định max → dùng implementation boundary test (stress test).

| # | Boundary | Value | Length | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | Min-1 (empty) | `""` | 0 | **SPEC:** Reject — tên không được rỗng. **CODE:** Accept (no validation) | Biên dưới — dưới ngưỡng tối thiểu theo SPEC |
| 2 | Min | `"A"` | 1 | Accept — tên ngắn nhất hợp lệ | Đúng biên dưới |
| 3 | Min+1 | `"AB"` | 2 | Accept — trên biên dưới | Xác nhận tên 2 ký tự hoạt động bình thường |
| 4 | Nominal | `"Điện tử"` | 7 | Accept — tên thông thường | Giá trị giữa domain |
| 5 | Long (stress) | `"A"×255` | 255 | Accept — chuỗi dài vừa phải | Test chuỗi dài ở ngưỡng thường gặp (VARCHAR 255) |
| 6 | Very long (stress) | `"A"×1000` | 1000 | Accept — SQLite TEXT unlimited | Stress test — implementation boundary |
| 7 | Extremely long | `"A"×10000` | 10000 | Accept hoặc timeout/error | Extreme stress — kiểm tra giới hạn thực tế |

> **Lưu ý:** Không có Max boundary rõ ràng từ SPEC hay CODE. Các giá trị 255, 1000, 10000 là stress test boundaries, không phải spec boundaries.

---

### Field 2: `name` Length — Update Category

> **Boundary source:** Tương tự Create — SPEC không quy định cụ thể cho Update (SPEC không đề cập Update). CODE không validate.

| # | Boundary | Value | Length | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1 | Min-1 (empty) | `""` | 0 | **SPEC:** Reject. **CODE:** Accept — set name="" | Biên dưới cho Update |
| 2 | Min | `"X"` | 1 | Accept — tên mới ngắn nhất hợp lệ | Đúng biên dưới |
| 3 | Min+1 | `"XY"` | 2 | Accept | Trên biên dưới |
| 4 | Nominal | `"Phụ kiện mới"` | 11 | Accept | Giá trị giữa domain |

> **Lưu ý:** Không lặp lại stress test (long/very long) vì logic xử lý name trong Update giống Create — cùng `INSERT`/`UPDATE` TEXT vào SQLite.

---

### Field 3: `id` (URL Parameter — Delete/Update)

> **Boundary source:** SQLite AUTOINCREMENT bắt đầu từ 1. Valid range = [1, max_existing_id].
> Seed data: id = 1, 2, 3.

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | `0` | **Expected:** 404/400. **CODE:** 200 OK — silent no-op (0 rows) | Dưới biên — AUTOINCREMENT bắt đầu từ 1 |
| 2 | Min (first valid) | `1` | 200 OK — thao tác thành công trên category đầu tiên | Biên dưới valid — ID nhỏ nhất tồn tại |
| 3 | Min+1 | `2` | 200 OK — thao tác thành công | Trên biên dưới |
| 4 | Nominal | `2` | 200 OK | Giá trị giữa (seed có 3 categories) |
| 5 | Max (last existing) | `3` | 200 OK — thao tác trên category cuối cùng | Biên trên valid — ID lớn nhất tồn tại trong seed |
| 6 | Max+1 | `4` | **Expected:** 404. **CODE:** 200 OK — silent no-op | Trên biên — ID chưa tồn tại |
| 7 | Far out of range | `9999` | **Expected:** 404. **CODE:** 200 OK — silent no-op | Xa biên trên — rõ ràng không tồn tại |
| 8 | Negative | `-1` | **Expected:** 400/404. **CODE:** 200 OK — silent no-op | Dưới 0 — ngoài domain hoàn toàn |

---

## Supplementary (Non-BVA — Categorical)

> Các giá trị sau KHÔNG phải boundary values mà là categorical/format tests. Sẽ được chuyển thành TC ở Step 5.

| Field | Category | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| name | Whitespace-only | `"   "` | SPEC: Reject. CODE: Accept | Không phải length boundary — là format category |
| name | Special chars | `"Đồ điện & gia dụng"` | Accept | Categorical — ký tự đặc biệt |
| name | HTML/XSS | `"<script>alert(1)</script>"` | SPEC: Reject/sanitize. CODE: Accept | Security category — không phải length |
| name | Duplicate | `"Điện thoại"` (đã tồn tại) | CODE: Accept (no UNIQUE) | Uniqueness category — không phải ordered |
| name | null/missing | body `{}` | SPEC: Reject. CODE: Accept | Absence — không phải length |
| id | Non-numeric | `"abc"` | Expected: 400. CODE: 200 OK | Type category — không phải ordered integer |
| id | Missing param | `/api/categories/` | Có thể match route khác | Routing category |

---

## Summary

| Field | BVA Points | Boundary Type |
| --- | --- | --- |
| name length (Create) | 7 | Spec boundary (min=1), Implementation boundary (stress max) |
| name length (Update) | 4 | Spec boundary (min=1) — stress không lặp lại |
| id (URL param) | 8 | Data boundary (AUTOINCREMENT min=1, max=last existing) |
| **Total BVA points** | **19** | |
| Supplementary (non-BVA) | 7 | Categorical values |
