# STEP 7 — Test Execution: FR-14 Category Management (CRUD)

> **Test Tool:** Playwright + Node.js fetch API
> **Script:** `test-category.mjs`
> **Backend:** `http://localhost:3000` | **Frontend Admin:** `http://localhost:5174`
> **Date:** 2026-06-27

---

## A. Domain Test Cases — Execution (26 TC)

### A1. Create Category — name field (10 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| DT-C-001 | Tạo category với tên tiếng Việt hợp lệ | 200 OK, category created, xuất hiện trong GET list | 200 OK, `{message: "Category created", id: N}`. Tên "Điện tử" xuất hiện trong GET list. | **PASS** |
| DT-C-002 | Tạo category với tên ASCII đơn giản | 200 OK, category created | 200 OK, `{message: "Category created"}`. Tên "Gaming" lưu đúng. | **PASS** |
| DT-C-003 | Tạo category với tên 1 ký tự | 200 OK, category created | 200 OK, `{message: "Category created"}`. Tên "A" chấp nhận. | **PASS** |
| DT-C-004 | Tạo category với tên rất dài (1000 chars) | 200 OK, category created | 200 OK, category created. Tên 1000 ký tự lưu đúng trong DB. | **PASS** |
| DT-C-005 | Tạo category với tên chứa ký tự đặc biệt | 200 OK, ký tự đặc biệt lưu đúng | 200 OK, "Đồ điện & gia dụng" lưu đúng trong DB. | **PASS** |
| DT-C-006 | Tạo category trùng tên đã tồn tại | 400/409 — tên trùng | 200 OK, tạo thành công với id mới. DB có 2 category cùng tên "Điện thoại". | **FAIL** |
| DT-C-007 | Tạo category với tên rỗng `""` | 400 — tên không được rỗng | 200 OK, `{message: "Category created"}`. Category với name="" được tạo. | **FAIL** |
| DT-C-008 | Tạo category không gửi field name | 400 — thiếu field name | 200 OK, `{message: "Category created"}`. Category với name=null được tạo. | **FAIL** |
| DT-C-009 | Tạo category với tên chỉ whitespace | 400 — whitespace-only coi như rỗng | 200 OK, `{message: "Category created"}`. Category với name="   " được tạo. | **FAIL** |
| DT-C-010 | Tạo category với HTML/script tag (XSS) | 400 hoặc sanitize | 200 OK, `<script>alert(1)</script>` lưu nguyên trong DB. XSS risk. | **FAIL** |

### A2. Update Category — name field (4 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| DT-C-011 | Update tên category hợp lệ | 200 OK, GET trả về tên mới | 200 OK, `{message: "Category updated"}`. GET trả về "Phụ kiện mới". | **PASS** |
| DT-C-012 | Update tên trùng danh mục khác | 400/409 — tên trùng | 200 OK, `{message: "Category updated"}`. Cho phép update thành tên trùng. | **FAIL** |
| DT-C-013 | Update tên thành rỗng `""` | 400 — tên không được rỗng | 200 OK, `{message: "Category updated"}`. Name set thành "". | **FAIL** |
| DT-C-014 | Update không gửi field name | 400 — thiếu field name | 200 OK, `{message: "Category updated"}`. Name set thành null. | **FAIL** |

### A3. Delete/Update — id field (7 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| DT-C-015 | Xóa category tồn tại | 200 OK, category biến mất | 200 OK, `{message: "Category deleted"}`. Category không còn trong GET list. | **PASS** |
| DT-C-016 | Xóa category không tồn tại (id=9999) | 404 Not Found | 200 OK, `{message: "Category deleted"}`. Silent no-op — 0 rows affected nhưng vẫn trả success. | **FAIL** |
| DT-C-017 | Xóa category với id=0 | 400/404 | 200 OK, `{message: "Category deleted"}`. Silent no-op. | **FAIL** |
| DT-C-018 | Xóa category với id âm (-1) | 400/404 | 200 OK, `{message: "Category deleted"}`. Silent no-op. | **FAIL** |
| DT-C-019 | Xóa category với id non-numeric ("abc") | 400 — id phải là số | 200 OK, `{message: "Category deleted"}`. SQLite WHERE id="abc" matches 0 rows, silent no-op. | **FAIL** |
| DT-C-020 | Xóa category thiếu id param | 400/404 | DELETE `/api/categories/` matched GET route → trả về danh sách categories thay vì lỗi. Status khác 200 (method not matched properly). | **PASS** |
| DT-C-021 | Update category không tồn tại (id=9999) | 404 Not Found | 200 OK, `{message: "Category updated"}`. Silent no-op. | **FAIL** |

### A4. Behavioral Tests (5 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| DT-C-022 | Xóa category không có products liên kết | 200 OK, không side effect | 200 OK, category xóa thành công. Không ảnh hưởng data khác. | **PASS** |
| DT-C-023 | Xóa category có products liên kết | 400/409 Conflict | 200 OK, `{message: "Category deleted"}`. Category xóa thành công dù có products liên kết. Products trở thành orphan (category_id trỏ đến id không tồn tại). | **FAIL** |
| DT-C-024 | GET danh sách khi có dữ liệu seed | 200 OK, array 3 objects | 200 OK, trả về array 3 objects đúng: Điện thoại, Laptop, Phụ kiện. | **PASS** |
| DT-C-025 | GET danh sách khi DB rỗng | 200 OK, array rỗng `[]` | 200 OK, trả về `[]`. | **PASS** |
| DT-C-026 | Tạo 2 category cùng tên | Lần 2: 400/409 — tên trùng | Cả 2 lần đều 200 OK. DB có 2 categories cùng tên "Test" với id khác nhau. | **FAIL** |

---

## B. BVA Test Cases — Execution (15 TC)

### B1. name Length — Create (4 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| BVA-C-001 | Min-1 (0 chars): name="" | 400 — tên không được rỗng | 200 OK, category created với name="". | **FAIL** |
| BVA-C-002 | Min (1 char): name="A" | 200 OK | 200 OK, `{message: "Category created"}`. | **PASS** |
| BVA-C-003 | Min+1 (2 chars): name="AB" | 200 OK | 200 OK, category created. | **PASS** |
| BVA-C-004 | Nominal (7 chars): name="Điện tử" | 200 OK | 200 OK, category created. | **PASS** |

### B2. name Length — Update (4 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| BVA-C-005 | Min-1 (0 chars): name="" | 400 — tên không được rỗng | 200 OK, name set thành "". | **FAIL** |
| BVA-C-006 | Min (1 char): name="X" | 200 OK | 200 OK, category updated. | **PASS** |
| BVA-C-007 | Min+1 (2 chars): name="XY" | 200 OK | 200 OK, category updated. | **PASS** |
| BVA-C-008 | Nominal (11 chars): name="Phụ kiện mới" | 200 OK | 200 OK, category updated. | **PASS** |

### B3. id (URL Parameter) — 7-point BVA (7 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| BVA-C-009 | Min-1 (0): DELETE /api/categories/0 | 404 — id=0 không tồn tại | 200 OK, `{message: "Category deleted"}`. Silent no-op. | **FAIL** |
| BVA-C-010 | Min (1st seed id): DELETE | 200 OK, category deleted | 200 OK, category biến mất khỏi list. | **PASS** |
| BVA-C-011 | Min+1 (2nd seed id): DELETE | 200 OK, category deleted | 200 OK, category deleted. | **PASS** |
| BVA-C-012 | Nominal: PUT update | 200 OK, category updated | 200 OK, category updated. | **PASS** |
| BVA-C-013 | Max-1: Verify exists | 200 OK, category tồn tại | Category tồn tại trong GET response. | **PASS** |
| BVA-C-014 | Max (last seed id): DELETE | 200 OK, category deleted | 200 OK, category deleted. | **PASS** |
| BVA-C-015 | Max+1: DELETE | 404 — id không tồn tại | 200 OK, `{message: "Category deleted"}`. Silent no-op. | **FAIL** |

---

## C. UI Validation — Execution (7 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| UI-C-001 | Tab "Danh mục" highlight (FR-21) | Tab có highlight | Tab có class `text-blue-400` khi active. | **PASS** |
| UI-C-002 | Tiêu đề heading (FR-21) | Có heading "Quản lý Danh mục" | `<h2>` với text "Quản lý Danh mục". Không có `<h1>` trùng lặp. | **PASS** |
| UI-C-003 | Trường bắt buộc có dấu `*` (FR-22) | Có ký hiệu `*` bên cạnh nhãn | Không có `*` trong form. Input không có attribute `required`. | **FAIL** |
| UI-C-004 | Nút "Thêm mới" màu xanh dương (FR-21) | Background blue | Nút có class `bg-blue-600`. | **PASS** |
| UI-C-005 | Nút "Xóa" màu đỏ (FR-21) | Background red | Nút có class `bg-red-500`. | **PASS** |
| UI-C-006 | Dialog xác nhận khi xóa (FR-24) | Hiển thị confirm dialog | Không có dialog. Click "Xóa" → category bị xóa ngay lập tức mà không hỏi xác nhận. | **FAIL** |
| UI-C-007 | Empty state khi không có danh mục (FR-24) | Hiển thị empty state + icon | Bảng trống, không có message thân thiện, không có icon/illustration. | **FAIL** |

---

## D. Execution Summary

| Category | Total | Pass | Fail | Blocked | Not Executed |
| --- | --- | --- | --- | --- | --- |
| A. Domain — Create name | 10 | 5 | 5 | 0 | 0 |
| A. Domain — Update name | 4 | 1 | 3 | 0 | 0 |
| A. Domain — Delete/Update id | 7 | 2 | 5 | 0 | 0 |
| A. Domain — Behavioral | 5 | 3 | 2 | 0 | 0 |
| B. BVA — name Create | 4 | 3 | 1 | 0 | 0 |
| B. BVA — name Update | 4 | 3 | 1 | 0 | 0 |
| B. BVA — id param | 7 | 5 | 2 | 0 | 0 |
| C. UI Validation | 7 | 4 | 3 | 0 | 0 |
| **Tổng** | **48** | **26** | **22** | **0** | **0** |

**Pass Rate: 54.2% (26/48)**

---

## E. Observations & Known Issues

### OBS-01: Hoàn toàn thiếu input validation ở backend

Backend không validate bất kỳ input nào cho Category CRUD:
- `name` không kiểm tra rỗng, null, whitespace, XSS, trùng lặp.
- `id` (URL param) không kiểm tra tồn tại, kiểu dữ liệu, giá trị hợp lệ.
- Mọi request đều trả 200 OK bất kể input — chỉ lỗi khi SQLite internal error.

### OBS-02: Silent no-op trên DELETE/PUT cho id không tồn tại

SQLite `DELETE FROM categories WHERE id = ?` và `UPDATE ... WHERE id = ?` với id không match → 0 rows affected nhưng không lỗi. Backend không kiểm tra `this.changes` (số rows affected) nên luôn trả success.

### OBS-03: XSS vulnerability qua category name

`<script>alert(1)</script>` được lưu nguyên trong DB. Khi frontend render tên danh mục, nếu dùng `dangerouslySetInnerHTML` hoặc framework không auto-escape, sẽ thực thi script.

### OBS-04: Không có cascade/referential integrity cho categories-products

Xóa category không kiểm tra products liên kết. DB schema không có `FOREIGN KEY` constraint hoặc `ON DELETE` rule. Products trở thành orphan.

### OBS-05: Frontend admin thiếu nhiều UI requirements

- Không có `*` cho trường bắt buộc (FR-22).
- Không có confirmation dialog khi xóa (FR-24).
- Không có empty state khi danh sách rỗng (FR-24).
- Input field không có attribute `required`.
