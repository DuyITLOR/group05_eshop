# STEP 2 — Domain Table: FR-14 Category Management (CRUD) (v1)

---

## STEP 1 — Identify Input Fields

| # | Field Name | Required? | Source of Constraint | Related FR |
| --- | --- | --- | --- | --- |
| 1 | `name` (Create) | Yes [SPEC] / No [CODE] | SPEC: "không được để trống". CODE: không validate | FR-14 |
| 2 | `name` (Update) | Yes [implied] / No [CODE] | CODE: không validate. SPEC không đề cập Update | FR-14 (extra) |
| 3 | `id` (URL param — Update/Delete) | Yes | URL path parameter, phải là ID trong DB | FR-14 |

---

## STEP 2 — Domain Table

### Field 1: `name` (Create Category)

| Attribute | Detail |
| --- | --- |
| **Data Type** | TEXT (string) |
| **Required** | Yes [SPEC] / No [CODE] |
| **Min Length** | SPEC: 1 (không được rỗng). CODE: 0 (không validate) |
| **Max Length** | SPEC: không quy định. CODE: không giới hạn (SQLite TEXT unlimited) |
| **Allowed Characters** | Không quy định — bất kỳ ký tự nào |
| **Unique** | SPEC: không quy định. CODE: không UNIQUE constraint |
| **Frontend Validation** | Không có (`<input>` không có `required`, không `minLength`) |
| **Backend Validation** | Không có (insert trực tiếp vào DB) |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-N-V1 | Valid | Tên hợp lệ, chuỗi bình thường (tiếng Việt) | `"Điện tử"` | Happy path — tên danh mục thông thường |
| EC-N-V2 | Valid | Tên hợp lệ, ký tự ASCII đơn giản | `"Laptop"` | Tên chỉ dùng ký tự Latin |
| EC-N-V3 | Valid | Tên 1 ký tự (min valid theo SPEC) | `"A"` | Biên dưới — tên ngắn nhất hợp lệ theo SPEC |
| EC-N-V4 | Valid | Tên rất dài (stress test) | `"A" * 1000` | Kiểm tra hệ thống xử lý chuỗi dài |
| EC-N-V5 | Valid | Tên chứa ký tự đặc biệt | `"Đồ điện & gia dụng"` | Tên có ký tự đặc biệt (&, /, dấu tiếng Việt) |
| EC-N-V6 | Valid | Tên trùng với danh mục đã tồn tại | `"Điện thoại"` (đã có seed) | DB không có UNIQUE → CODE chấp nhận trùng |
| EC-N-I1 | Invalid | Chuỗi rỗng `""` | `""` | SPEC: "không được để trống". CODE: chấp nhận → **SPEC-CODE mismatch** |
| EC-N-I2 | Invalid | `null` / không gửi field name | body: `{}` | Thiếu field name hoàn toàn |
| EC-N-I3 | Invalid | Chỉ whitespace | `"   "` | Trông rỗng nhưng có whitespace — SPEC nên reject |
| EC-N-I4 | Invalid | Chuỗi chứa HTML/script tag | `"<script>alert(1)</script>"` | XSS injection — kiểm tra sanitization |

---

### Field 2: `name` (Update Category)

| Attribute | Detail |
| --- | --- |
| **Data Type** | TEXT (string) |
| **Required** | Implied / No [CODE] |
| **Validation** | Không có (tương tự Create) |
| **UI** | **Không có UI** — chỉ test qua API |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-NU-V1 | Valid | Tên mới hợp lệ, khác tên cũ | `"Phụ kiện mới"` | Happy path — đổi tên danh mục |
| EC-NU-V2 | Valid | Tên mới trùng tên danh mục khác | `"Laptop"` (đã tồn tại) | Không UNIQUE constraint → CODE chấp nhận |
| EC-NU-I1 | Invalid | Chuỗi rỗng `""` | `""` | Tương tự Create — SPEC-CODE mismatch |
| EC-NU-I2 | Invalid | `null` / không gửi field name | body: `{}` | Thiếu field name |

> **Lưu ý:** SPEC không đề cập Update. EC này test API endpoint có trong CODE nhưng không trong SPEC.

---

### Field 3: `id` (URL Parameter — Update/Delete)

| Attribute | Detail |
| --- | --- |
| **Data Type** | INTEGER (URL path param) |
| **Required** | Yes |
| **Valid Range** | ID tồn tại trong bảng `categories` (seed: 1, 2, 3) |
| **Backend Handling** | Truyền trực tiếp vào SQL WHERE clause. Không validate tồn tại. |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-ID-V1 | Valid | ID tồn tại trong DB | `1` | Happy path — category có trong DB |
| EC-ID-I1 | Invalid | ID không tồn tại (số dương) | `9999` | CODE trả 200 OK nhưng 0 rows affected — silent no-op |
| EC-ID-I2 | Invalid | ID = 0 | `0` | Biên — SQLite AUTOINCREMENT bắt đầu từ 1 |
| EC-ID-I3 | Invalid | ID âm | `-1` | Giá trị ngoài domain hợp lệ |
| EC-ID-I4 | Invalid | ID không phải số | `"abc"` | Type mismatch — string thay vì integer |
| EC-ID-I5 | Invalid | ID rỗng (missing param) | `/api/categories/` | URL path thiếu id — có thể match route khác |

---

### Field 4: Behavioral Partitions (Cross-field / System-level)

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-DEL-V1 | Valid | Xóa category không có product liên kết | Category mới tạo, chưa có product | Happy path — xóa an toàn |
| EC-DEL-I1 | Invalid (expected) / Valid (CODE) | Xóa category có products liên kết | Category id=1 (seed có products) | CODE không check → xóa thành công, products thành orphan |
| EC-GET-V1 | Valid | GET danh sách khi có dữ liệu | DB có 3 seed categories | Trả về array đầy đủ |
| EC-GET-V2 | Valid | GET danh sách khi DB rỗng | Sau khi xóa hết categories | Trả về array rỗng `[]` |
| EC-DUP-V1 | Valid (CODE) | Tạo 2+ category cùng tên | POST `{name: "Test"}` × 2 | Không UNIQUE → cả 2 được tạo với id khác nhau |

---

## EC Summary

| Field / Group | Valid ECs | Invalid ECs | Total |
| --- | --- | --- | --- |
| name (Create) | EC-N-V1→V6 (6) | EC-N-I1→I4 (4) | 10 |
| name (Update) | EC-NU-V1→V2 (2) | EC-NU-I1→I2 (2) | 4 |
| id (URL param) | EC-ID-V1 (1) | EC-ID-I1→I5 (5) | 6 |
| Behavioral | EC-DEL-V1, EC-GET-V1→V2, EC-DUP-V1 (4) | EC-DEL-I1 (1) | 5 |
| **Total** | **13** | **12** | **25** |
