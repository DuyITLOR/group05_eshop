# STEP 1 — Spec Analysis: FR-14 Category Management (CRUD)

**Feature:** feature_C
**FR:** FR-14 — Quản lý Danh mục (Category CRUD)
**Source Code:**
- Backend: `group05_eshop/backend/server.js` (lines 243–278)
- Database: `group05_eshop/backend/database.js` (lines 22–26, 84–88)
- Frontend Admin: `group05_eshop/frontend-admin/src/App.jsx` (lines 294–333)

---

## 1. Functional Description

### 1.1 Main Business Flow — Xem danh sách danh mục (Read)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | Admin | Truy cập trang Admin, click tab "Danh mục" | Frontend gọi `GET /api/categories`, hiển thị bảng danh mục với cột ID, Tên Danh Mục, Hành động | [CODE-FE] App.jsx:49, 294–333 |
| 2 | System | Trả về danh sách categories | `SELECT * FROM categories` → trả về JSON array `[{id, name}, ...]` | [CODE-BE] server.js:243–246 |

**Lưu ý:**
- `GET /api/categories` **KHÔNG** yêu cầu authentication (`authenticateToken` không được dùng). [CODE-BE]
- SPEC ghi "Admin có thể Xem" nhưng API cho phép **bất kỳ ai** (kể cả chưa đăng nhập) xem danh mục. [SPEC vs CODE mismatch — xem Implicit Constraints]

### 1.2 Sub-Flow — Thêm danh mục (Create)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | Admin | Nhập tên danh mục vào ô "Tên danh mục mới" | Frontend lưu vào state `categoryName` | [CODE-FE] App.jsx:302–303 |
| 2 | Admin | Click nút "Thêm mới" | Frontend gọi `POST /api/categories` với body `{name: categoryName}` | [CODE-FE] App.jsx:142–150 |
| 3 | System | Xác thực JWT token | Middleware `authenticateToken` kiểm tra header `Authorization: Bearer <token>`. Nếu thiếu → 401, nếu sai → 403 | [CODE-BE] server.js:100–110 |
| 4 | System | Insert vào DB | `INSERT INTO categories (name) VALUES (?)` | [CODE-BE] server.js:251 |
| 5 | System | Trả response | `{message: "Category created", id: <lastID>}` | [CODE-BE] server.js:253 |
| 6 | Frontend | Reload danh sách | Gọi lại `fetchData()` để refresh bảng | [CODE-FE] App.jsx:147 |

**Lưu ý:**
- **KHÔNG có validation tên danh mục** ở backend. Tên rỗng `""`, `null`, whitespace-only đều được chấp nhận. [CODE-BE]
- **KHÔNG có validation ở frontend** — form không có `required` attribute, không có `minLength`. [CODE-FE]
- SPEC ghi "Tên danh mục là bắt buộc, không được để trống" → **SPEC vs CODE mismatch**. [SPEC]
- **KHÔNG kiểm tra role** — bất kỳ user đã đăng nhập (kể cả customer) đều có thể tạo danh mục. [CODE-BE]
- **KHÔNG kiểm tra trùng tên** — DB schema không có UNIQUE constraint trên `name`. [CODE-BE]

### 1.3 Sub-Flow — Cập nhật danh mục (Update)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | Admin | (Không có UI cho Update) | Frontend admin **KHÔNG** render nút/form edit danh mục | [CODE-FE] App.jsx:318–331 |
| 2 | Client | Gửi `PUT /api/categories/:id` với body `{name}` | Backend update `categories SET name = ? WHERE id = ?` | [CODE-BE] server.js:257–267 |
| 3 | System | Trả response | `{message: "Category updated"}` | [CODE-BE] server.js:264 |

**Lưu ý:**
- API endpoint **tồn tại** ở backend nhưng **KHÔNG có UI** ở frontend admin. [CODE-FE vs CODE-BE mismatch]
- SPEC ghi "Thêm / Xem / Xóa" — không đề cập Update. API có PUT nhưng SPEC không yêu cầu. [SPEC vs CODE]
- **KHÔNG kiểm tra category tồn tại** — PUT cho id không tồn tại vẫn trả 200 OK (SQLite `UPDATE` với 0 rows affected không lỗi). [CODE-BE]
- **KHÔNG validate name** tương tự Create. [CODE-BE]

### 1.4 Sub-Flow — Xóa danh mục (Delete)

| Step | Actor | Action | System Response | Source |
| --- | --- | --- | --- | --- |
| 1 | Admin | Click nút "Xóa" (đỏ) bên cạnh danh mục | Frontend gọi `DELETE /api/categories/:id` | [CODE-FE] App.jsx:153–158, 323–328 |
| 2 | System | Xác thực JWT token | Middleware `authenticateToken` | [CODE-BE] server.js:269 |
| 3 | System | Xóa khỏi DB | `DELETE FROM categories WHERE id = ?` | [CODE-BE] server.js:271 |
| 4 | System | Trả response | `{message: "Category deleted"}` | [CODE-BE] server.js:275 |
| 5 | Frontend | Reload danh sách | Gọi lại `fetchData()` | [CODE-FE] App.jsx:156 |

**Lưu ý:**
- **KHÔNG kiểm tra sản phẩm liên kết** — xóa category mà có products dùng `category_id` đó vẫn thành công. Products trở thành orphan (category_id trỏ đến category không tồn tại). [CODE-BE]
- **KHÔNG có dialog xác nhận** ở frontend trước khi xóa. [CODE-FE] (FR-24 yêu cầu dialog xác nhận khi xóa)
- **KHÔNG kiểm tra category tồn tại** — DELETE cho id không tồn tại vẫn trả 200 OK. [CODE-BE]
- **KHÔNG kiểm tra role** — tương tự Create. [CODE-BE]

---

## 2. Input Fields

### 2.1 Direct Input Fields

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `name` (Create) | TEXT | Yes [SPEC] / No [CODE] | SPEC: không được để trống. CODE: **không validate** | Chuỗi ký tự bất kỳ (1+ ký tự) | Chuỗi rỗng `""`, `null`, whitespace-only | [SPEC] FR-14, [CODE-BE] server.js:250–251 |
| `name` (Update) | TEXT | Yes [SPEC implied] / No [CODE] | CODE: **không validate** | Chuỗi ký tự bất kỳ | Chuỗi rỗng, `null`, whitespace-only | [CODE-BE] server.js:258 |
| `id` (URL param — Update/Delete) | INTEGER | Yes | Phải là ID tồn tại trong DB | ID hợp lệ (1, 2, 3...) | 0, -1, 9999 (không tồn tại), "abc" (non-numeric), null | [CODE-BE] server.js:260, 272 |

### 2.2 State Variables

| Field Name | Data Type | Default | Domain | Description | Source |
| --- | --- | --- | --- | --- | --- |
| JWT Token | String | N/A | Valid JWT signed with `SECRET_KEY` | Bắt buộc cho POST/PUT/DELETE. GET không cần. | [CODE-BE] server.js:100–110 |
| User Role | String | "customer" | "admin", "customer" | Backend **KHÔNG** kiểm tra role — chỉ cần token hợp lệ | [CODE-BE] server.js:100–110 |
| DB categories count | Integer | 3 (seed data) | 0 → ∞ | Số danh mục hiện có trong DB | [CODE-BE] database.js:84–88 |
| Products referencing category | Integer | varies | 0 → ∞ | Số sản phẩm có `category_id` trỏ đến category đang xóa | [CODE-BE] database.js:70 |

### 2.3 Implicit Constraints

| Constraint | Description | SPEC | CODE | Match? |
| --- | --- | --- | --- | --- |
| Tên danh mục bắt buộc | "Tên danh mục là bắt buộc, không được để trống" | Có | **Không validate** — `name` rỗng/null được chấp nhận | **Mismatch** |
| Chỉ Admin thao tác | "Admin có thể Thêm / Xem / Xóa" | Implicit (Admin) | **Không kiểm tra role** — bất kỳ user có token đều CRUD được | **Mismatch** |
| GET cần auth | SPEC ngụ ý "Admin có thể Xem" | Admin only | **Không cần auth** — GET /api/categories public | **Mismatch** |
| Tên danh mục unique | Ngầm hiểu tên nên unique | Không nói rõ | DB schema **không có UNIQUE** constraint trên `name` | N/A (SPEC không quy định) |
| Cascade delete | Xóa category → xử lý products liên quan | Không nói rõ | **Không cascade** — products trở thành orphan | N/A (SPEC không quy định) |
| Xác nhận trước khi xóa | FR-24: "Khi xóa item khỏi giỏ phải có dialog xác nhận" | FR-24 general delete | **Không có confirmation dialog** cho xóa danh mục | **Mismatch** (nếu áp dụng FR-24) |
| CRUD operations | SPEC: "Thêm / Xem / Xóa" (3 operations) | Không có Update | Backend **có PUT endpoint** cho Update | **Extra feature** in CODE |

---

## 3. Field Dependencies

| Field A | Field B | Dependency Type | Condition | Description |
| --- | --- | --- | --- | --- |
| JWT Token | name (Create/Update) | Sequential | Token phải valid trước khi xử lý name | authenticateToken middleware chạy trước handler |
| id (Delete) | Products.category_id | Lookup | Khi xóa category, products tham chiếu category_id đó trở thành orphan | Không có foreign key constraint, không cascade |
| id (URL param) | categories.id (DB) | Lookup | id phải tồn tại trong bảng categories | CODE không validate — trả 200 OK ngay cả khi id không tồn tại |
| name (Create) | categories.name (DB) | Potential duplicate | Không có UNIQUE constraint | Có thể tạo nhiều category cùng tên |
| User Role | CRUD operations | Authorization (expected) | SPEC ngụ ý chỉ Admin | CODE không enforce — bất kỳ authenticated user đều có quyền |

---

## 4. Summary of SPEC vs CODE Discrepancies

| # | Issue | Impact |
| --- | --- | --- |
| 1 | Name validation missing (empty/null accepted) | Data integrity — tạo category vô nghĩa |
| 2 | No role-based authorization | Security — customer có thể CRUD category |
| 3 | GET /api/categories is public (no auth) | Minor — danh mục thường public, nhưng SPEC nói "Admin" |
| 4 | PUT endpoint exists but not in SPEC or UI | Extra feature — untested in normal flow |
| 5 | No cascade/check on delete with linked products | Data integrity — orphan products |
| 6 | No confirmation dialog on delete | UX — FR-24 violation |
| 7 | Update/Delete return 200 for non-existent ID | Misleading response — silent no-op |
