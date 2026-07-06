# STEP 3 — Domain Test Cases: FR-14 Category Management (CRUD)

### EC Naming Convention

> File này sử dụng EC numbering đơn giản (EC-N1, EC-N2, ...) thay vì format chi tiết trong `02_domain_table.md` (EC-N-V1, EC-N-I1, ...). Mapping:
> - EC-N1~N6 (Valid) ↔ EC-N-V1~V6 trong domain table
> - EC-N7~N10 (Invalid) ↔ EC-N-I1~I4 trong domain table
> - Tương tự cho các biến khác (EC-NU, EC-DI, EC-B)

---

## 1. Equivalence Classes Summary

### name (Create) — EC-N

| EC ID | Type | Description |
| --- | --- | --- |
| EC-N1 | Valid | Tên bình thường tiếng Việt |
| EC-N2 | Valid | Tên ASCII đơn giản |
| EC-N3 | Valid | Tên 1 ký tự |
| EC-N4 | Valid | Tên rất dài (1000 chars) |
| EC-N5 | Valid | Tên chứa ký tự đặc biệt |
| EC-N6 | Valid | Tên trùng danh mục đã tồn tại |
| EC-N7 | Invalid | Chuỗi rỗng `""` |
| EC-N8 | Invalid | `null` / thiếu field name |
| EC-N9 | Invalid | Chỉ whitespace |
| EC-N10 | Invalid | Chứa HTML/script tag (XSS) |

### name (Update) — EC-NU

| EC ID | Type | Description |
| --- | --- | --- |
| EC-NU1 | Valid | Tên mới hợp lệ, khác tên cũ |
| EC-NU2 | Valid | Tên mới trùng danh mục khác |
| EC-NU3 | Invalid | Chuỗi rỗng `""` |
| EC-NU4 | Invalid | `null` / thiếu field name |

### id (URL param) — EC-ID

| EC ID | Type | Description |
| --- | --- | --- |
| EC-ID1 | Valid | ID tồn tại trong DB |
| EC-ID2 | Invalid | ID không tồn tại (số dương) |
| EC-ID3 | Invalid | ID = 0 |
| EC-ID4 | Invalid | ID âm |
| EC-ID5 | Invalid | ID không phải số |
| EC-ID6 | Invalid | ID rỗng (missing param) |

### Behavioral — EC-B

| EC ID | Type | Description |
| --- | --- | --- |
| EC-B1 | Valid | Xóa category không có product liên kết |
| EC-B2 | Invalid (expected) | Xóa category có products liên kết |
| EC-B3 | Valid | GET danh sách khi có dữ liệu |
| EC-B4 | Valid | GET danh sách khi DB rỗng |
| EC-B5 | Valid (CODE) | Tạo 2 category cùng tên (duplicate) |

---

## 2. Domain Test Matrix

> **Nguyên tắc:** One-at-a-time — khi test 1 biến invalid, các biến khác giữ valid default.
> **Valid defaults:** name = `"Test Category"`, id = ID tồn tại, token = admin token.

| TC | Operation | Biến test | EC tested | name | id | Loại |
| --- | --- | --- | --- | --- | --- | --- |
| DT-C-001 | Create | name | EC-N1 | `"Điện tử"` | — | Valid |
| DT-C-002 | Create | name | EC-N2 | `"Laptop"` | — | Valid |
| DT-C-003 | Create | name | EC-N3 | `"A"` | — | Valid |
| DT-C-004 | Create | name | EC-N4 | `"A"×1000` | — | Valid |
| DT-C-005 | Create | name | EC-N5 | `"Đồ điện & gia dụng"` | — | Valid |
| DT-C-006 | Create | name | EC-N6 | `"Điện thoại"` | — | Valid |
| DT-C-007 | Create | name | EC-N7 | `""` | — | Invalid |
| DT-C-008 | Create | name | EC-N8 | (missing) | — | Invalid |
| DT-C-009 | Create | name | EC-N9 | `"   "` | — | Invalid |
| DT-C-010 | Create | name | EC-N10 | `"<script>alert(1)</script>"` | — | Invalid |
| DT-C-011 | Update | name | EC-NU1 | `"Phụ kiện mới"` | valid ID | Valid |
| DT-C-012 | Update | name | EC-NU2 | `"Laptop"` | valid ID | Valid |
| DT-C-013 | Update | name | EC-NU3 | `""` | valid ID | Invalid |
| DT-C-014 | Update | name | EC-NU4 | (missing) | valid ID | Invalid |
| DT-C-015 | Delete | id | EC-ID1 | — | `1` (tồn tại) | Valid |
| DT-C-016 | Delete | id | EC-ID2 | — | `9999` | Invalid |
| DT-C-017 | Delete | id | EC-ID3 | — | `0` | Invalid |
| DT-C-018 | Delete | id | EC-ID4 | — | `-1` | Invalid |
| DT-C-019 | Delete | id | EC-ID5 | — | `"abc"` | Invalid |
| DT-C-020 | Delete | id | EC-ID6 | — | (missing) | Invalid |
| DT-C-021 | Update | id | EC-ID2 | `"Test"` | `9999` | Invalid |
| DT-C-022 | Delete | behavioral | EC-B1 | — | new category ID | Valid |
| DT-C-023 | Delete | behavioral | EC-B2 | — | ID có products | Invalid (expected) |
| DT-C-024 | Read | behavioral | EC-B3 | — | — | Valid |
| DT-C-025 | Read | behavioral | EC-B4 | — | — | Valid |
| DT-C-026 | Create | behavioral | EC-B5 | `"Test"` × 2 | — | Valid (CODE) |

---

## 3. Domain Test Case Details

| Test Case ID | Operation | Field | EC ID | Type | Input Value | Expected Result |
| --- | --- | --- | --- | --- | --- | --- |
| DT-C-001 | POST /api/categories | name | EC-N1 | Valid | `{name: "Điện tử"}` | 200 OK, `{message: "Category created", id: N}`. Category xuất hiện trong GET list. |
| DT-C-002 | POST /api/categories | name | EC-N2 | Valid | `{name: "Laptop"}` | 200 OK, category created. Tên ASCII lưu đúng. |
| DT-C-003 | POST /api/categories | name | EC-N3 | Valid | `{name: "A"}` | 200 OK, category created. Tên 1 ký tự chấp nhận. |
| DT-C-004 | POST /api/categories | name | EC-N4 | Valid | `{name: "A"×1000}` | 200 OK, category created. |
| DT-C-005 | POST /api/categories | name | EC-N5 | Valid | `{name: "Đồ điện & gia dụng"}` | 200 OK, category created. Ký tự đặc biệt lưu đúng. |
| DT-C-006 | POST /api/categories | name | EC-N6 | Valid | `{name: "Điện thoại"}` | 200 OK, category created với id mới. |
| DT-C-007 | POST /api/categories | name | EC-N7 | Invalid | `{name: ""}` | 400 Bad Request — tên không được rỗng. |
| DT-C-008 | POST /api/categories | name | EC-N8 | Invalid | `{}` (không có field name) | 400 Bad Request — thiếu field name. |
| DT-C-009 | POST /api/categories | name | EC-N9 | Invalid | `{name: "   "}` | 400 Bad Request — whitespace-only coi như rỗng. |
| DT-C-010 | POST /api/categories | name | EC-N10 | Invalid | `{name: "<script>alert(1)</script>"}` | 400 hoặc sanitize — không lưu HTML/script tag. |
| DT-C-011 | PUT /api/categories/:id | name | EC-NU1 | Valid | `{name: "Phụ kiện mới"}`, id=3 | 200 OK, `{message: "Category updated"}`. GET trả về tên mới. |
| DT-C-012 | PUT /api/categories/:id | name | EC-NU2 | Valid | `{name: "Laptop"}`, id=3 | 200 OK, category updated. |
| DT-C-013 | PUT /api/categories/:id | name | EC-NU3 | Invalid | `{name: ""}`, id=3 | 400 Bad Request — tên không được rỗng. |
| DT-C-014 | PUT /api/categories/:id | name | EC-NU4 | Invalid | `{}`, id=3 | 400 Bad Request — thiếu field name. |
| DT-C-015 | DELETE /api/categories/:id | id | EC-ID1 | Valid | id=1 (tồn tại) | 200 OK, `{message: "Category deleted"}`. Category biến mất khỏi GET list. |
| DT-C-016 | DELETE /api/categories/:id | id | EC-ID2 | Invalid | id=9999 | 404 Not Found — category không tồn tại. |
| DT-C-017 | DELETE /api/categories/:id | id | EC-ID3 | Invalid | id=0 | 404 Not Found — id=0 không hợp lệ. |
| DT-C-018 | DELETE /api/categories/:id | id | EC-ID4 | Invalid | id=-1 | 400/404 — id âm không hợp lệ. |
| DT-C-019 | DELETE /api/categories/:id | id | EC-ID5 | Invalid | id="abc" | 400 Bad Request — id phải là số. |
| DT-C-020 | DELETE /api/categories/ | id | EC-ID6 | Invalid | id missing | 400/404 — thiếu id parameter. |
| DT-C-021 | PUT /api/categories/:id | id | EC-ID2 | Invalid | `{name: "Test"}`, id=9999 | 404 Not Found — category không tồn tại. |
| DT-C-022 | DELETE /api/categories/:id | behavioral | EC-B1 | Valid | Tạo category mới → xóa nó (không có products liên kết) | 200 OK, category deleted. Không side effect. |
| DT-C-023 | DELETE /api/categories/:id | behavioral | EC-B2 | Invalid (expected) | id=1 (seed, có products dùng category_id=1) | 400/409 Conflict — không cho xóa khi có products liên kết. |
| DT-C-024 | GET /api/categories | behavioral | EC-B3 | Valid | DB có seed data (3 categories) | 200 OK, trả về array 3 objects `[{id:1, name:"Điện thoại"}, {id:2, name:"Laptop"}, {id:3, name:"Phụ kiện"}]` |
| DT-C-025 | GET /api/categories | behavioral | EC-B4 | Valid | Xóa hết categories trước khi GET | 200 OK, trả về array rỗng `[]` |
| DT-C-026 | POST /api/categories | behavioral | EC-B5 | Valid (CODE) | POST `{name: "Test"}` 2 lần liên tiếp | 200 OK cả 2 lần, tạo 2 categories cùng tên khác id. |

---

## 4. EC Coverage Mapping

| EC ID | Covered by TC | Notes |
| --- | --- | --- |
| EC-N1 | DT-C-001 | ✅ |
| EC-N2 | DT-C-002 | ✅ |
| EC-N3 | DT-C-003 | ✅ |
| EC-N4 | DT-C-004 | ✅ |
| EC-N5 | DT-C-005 | ✅ |
| EC-N6 | DT-C-006 | ✅ |
| EC-N7 | DT-C-007 | ✅ SPEC-CODE mismatch |
| EC-N8 | DT-C-008 | ✅ SPEC-CODE mismatch |
| EC-N9 | DT-C-009 | ✅ SPEC-CODE mismatch |
| EC-N10 | DT-C-010 | ✅ XSS risk |
| EC-NU1 | DT-C-011 | ✅ |
| EC-NU2 | DT-C-012 | ✅ |
| EC-NU3 | DT-C-013 | ✅ SPEC-CODE mismatch |
| EC-NU4 | DT-C-014 | ✅ SPEC-CODE mismatch |
| EC-ID1 | DT-C-015 | ✅ |
| EC-ID2 | DT-C-016, DT-C-021 | ✅ Tested on both DELETE and PUT |
| EC-ID3 | DT-C-017 | ✅ |
| EC-ID4 | DT-C-018 | ✅ |
| EC-ID5 | DT-C-019 | ✅ |
| EC-ID6 | DT-C-020 | ✅ |
| EC-B1 | DT-C-022 | ✅ |
| EC-B2 | DT-C-023 | ✅ Orphan products |
| EC-B3 | DT-C-024 | ✅ |
| EC-B4 | DT-C-025 | ✅ |
| EC-B5 | DT-C-026 | ✅ Duplicate names |

**Coverage: 25/25 ECs = 100%**
