# STEP 6 — Detailed Test Cases: FR-14 Category Management (CRUD)

> **Source:** 03_domain_testcases.md + 05_bva_testcases_v1.md + UI TCs (FR-21/FR-22/FR-24)
> **Defaults:** Admin login `admin@eshop.com` / `Admin123!`, DB seed data (3 categories).
> **Nguyên tắc Expected Result:** Dựa trên **SPEC** (SRS) — hệ thống nên hoạt động thế nào. Actual Result sẽ điền ở Step 7 dựa trên thực thi thực tế trên CODE.

---

## A. Domain Test Cases — Chi tiết (32 TC)

### A1. Create Category — name field (DT-C-001 → DT-C-010)

| Test Case ID | Description                                | Pre-condition                             | Steps                                                                                    | Test Data                             | Expected Result                                                                                           | Actual Result | Status |
| ------------ | ------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| DT-C-001     | Tạo category với tên tiếng Việt hợp lệ     | Admin authenticated, DB seed              | 1. POST `/api/categories` với body `{name: "Điện tử"}` 2. GET `/api/categories` kiểm tra | `{name: "Điện tử"}`                   | 200 OK, `{message: "Category created", id: N}`. Category xuất hiện trong GET list với đúng tên "Điện tử". |               |        |
| DT-C-002     | Tạo category với tên ASCII đơn giản        | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "Gaming"}`                                    | `{name: "Gaming"}`                    | 200 OK, category created. Tên ASCII lưu đúng.                                                             |               |        |
| DT-C-003     | Tạo category với tên 1 ký tự               | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "A"}`                                         | `{name: "A"}`                         | 200 OK, category created. Tên 1 ký tự chấp nhận.                                                          |               |        |
| DT-C-004     | Tạo category với tên rất dài (1000 chars)  | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "A"×1000}`                                    | `{name: "AAA...A"}` (1000 chars)      | 200 OK, category created.                                                                                 |               |        |
| DT-C-005     | Tạo category với tên chứa ký tự đặc biệt   | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "Đồ điện & gia dụng"}`                        | `{name: "Đồ điện & gia dụng"}`        | 200 OK, category created. Ký tự đặc biệt lưu đúng.                                                        |               |        |
| DT-C-006     | Tạo category trùng tên danh mục đã tồn tại | Admin authenticated, seed có "Điện thoại" | 1. POST `/api/categories` với body `{name: "Điện thoại"}`                                | `{name: "Điện thoại"}`                | 400/409 Conflict — tên danh mục đã tồn tại, không cho tạo trùng.                                          |               |        |
| DT-C-007     | Tạo category với tên rỗng                  | Admin authenticated                       | 1. POST `/api/categories` với body `{name: ""}`                                          | `{name: ""}`                          | 400 Bad Request — tên không được rỗng.                                                                    |               |        |
| DT-C-008     | Tạo category không gửi field name          | Admin authenticated                       | 1. POST `/api/categories` với body `{}`                                                  | `{}`                                  | 400 Bad Request — thiếu field name.                                                                       |               |        |
| DT-C-009     | Tạo category với tên chỉ whitespace        | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "   "}`                                       | `{name: "   "}`                       | 400 Bad Request — whitespace-only coi như rỗng.                                                           |               |        |
| DT-C-010     | Tạo category với HTML/script tag (XSS)     | Admin authenticated                       | 1. POST `/api/categories` với body `{name: "<script>alert(1)</script>"}`                 | `{name: "<script>alert(1)</script>"}` | 400 hoặc sanitize — không lưu HTML/script tag.                                                            |               |        |

### A2. Update Category — name field (DT-C-011 → DT-C-014)

| Test Case ID | Description                             | Pre-condition                                                | Steps                                                                                          | Test Data                      | Expected Result                                                             | Actual Result | Status |
| ------------ | --------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------- | ------------- | ------ |
| DT-C-011     | Update tên category hợp lệ              | Admin authenticated, category id=3 tồn tại                   | 1. PUT `/api/categories/3` với body `{name: "Phụ kiện mới"}` 2. GET `/api/categories` kiểm tra | `{name: "Phụ kiện mới"}`, id=3 | 200 OK, `{message: "Category updated"}`. GET trả về tên mới "Phụ kiện mới". |               |        |
| DT-C-012     | Update tên category trùng danh mục khác | Admin authenticated, category id=3 tồn tại, seed có "Laptop" | 1. PUT `/api/categories/3` với body `{name: "Laptop"}`                                         | `{name: "Laptop"}`, id=3       | 400/409 Conflict — tên trùng với danh mục khác, không cho update.           |               |        |
| DT-C-013     | Update tên category thành rỗng          | Admin authenticated, category id=3 tồn tại                   | 1. PUT `/api/categories/3` với body `{name: ""}`                                               | `{name: ""}`, id=3             | 400 Bad Request — tên không được rỗng.                                      |               |        |
| DT-C-014     | Update category không gửi field name    | Admin authenticated, category id=3 tồn tại                   | 1. PUT `/api/categories/3` với body `{}`                                                       | `{}`, id=3                     | 400 Bad Request — thiếu field name.                                         |               |        |

### A3. Delete — id field (DT-C-015 → DT-C-021)

| Test Case ID | Description                          | Pre-condition                              | Steps                                                           | Test Data                      | Expected Result                                                           | Actual Result | Status |
| ------------ | ------------------------------------ | ------------------------------------------ | --------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------- | ------------- | ------ |
| DT-C-015     | Xóa category tồn tại                 | Admin authenticated, category id=1 tồn tại | 1. DELETE `/api/categories/1` 2. GET `/api/categories` kiểm tra | id=1                           | 200 OK, `{message: "Category deleted"}`. Category biến mất khỏi GET list. |               |        |
| DT-C-016     | Xóa category không tồn tại (id=9999) | Admin authenticated                        | 1. DELETE `/api/categories/9999`                                | id=9999                        | 404 Not Found — category không tồn tại.                                   |               |        |
| DT-C-017     | Xóa category với id=0                | Admin authenticated                        | 1. DELETE `/api/categories/0`                                   | id=0                           | 400/404 — id=0 không hợp lệ.                                              |               |        |
| DT-C-018     | Xóa category với id âm               | Admin authenticated                        | 1. DELETE `/api/categories/-1`                                  | id=-1                          | 400/404 — id âm không hợp lệ.                                             |               |        |
| DT-C-019     | Xóa category với id là text          | Admin authenticated                        | 1. DELETE `/api/categories/abc`                                 | id="abc"                       | 400 Bad Request — id phải là số.                                          |               |        |
| DT-C-020     | Xóa category với id rỗng             | Admin authenticated                        | 1. DELETE `/api/categories/`                                    | id=""                          | 400/404 — thiếu id parameter.                                             |               |        |
| DT-C-021     | Xóa category với id là script tag    | Admin authenticated                        | 1. DELETE `/api/categories/<script>alert(1)</script>`           | id=`<script>alert(1)</script>` | 400 Bad Request — id phải là số nguyên dương.                             |               |        |

### A4. Update — id field (DT-C-022 → DT-C-028)

| Test Case ID | Description                             | Pre-condition                              | Steps                                                                                        | Test Data                                        | Expected Result                                              | Actual Result | Status |
| ------------ | --------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ | ------------- | ------ |
| DT-C-022     | Update category không tồn tại (id=9999) | Admin authenticated                        | 1. PUT `/api/categories/9999` với body `{name: "Test"}`                                      | `{name: "Test"}`, id=9999                        | 404 Not Found — category không tồn tại.                      |               |        |
| DT-C-023     | Update category với id=0                | Admin authenticated                        | 1. PUT `/api/categories/0` với body `{name: "Test"}`                                         | `{name: "Test"}`, id=0                           | 400/404 — id=0 không hợp lệ.                                 |               |        |
| DT-C-024     | Update category với id âm               | Admin authenticated                        | 1. PUT `/api/categories/-1` với body `{name: "Test"}`                                        | `{name: "Test"}`, id=-1                          | 400/404 — id âm không hợp lệ.                                |               |        |
| DT-C-025     | Update category với id là text          | Admin authenticated                        | 1. PUT `/api/categories/abc` với body `{name: "Test"}`                                       | `{name: "Test"}`, id="abc"                       | 400 Bad Request — id phải là số.                             |               |        |
| DT-C-026     | Update category với id rỗng             | Admin authenticated                        | 1. PUT `/api/categories/` với body `{name: "Test"}`                                          | `{name: "Test"}`, id=""                          | 400/404 — thiếu id parameter.                                |               |        |
| DT-C-027     | Update category với id là script tag    | Admin authenticated                        | 1. PUT `/api/categories/<script>alert(1)</script>` với body `{name: "Test"}`                 | `{name: "Test"}`, id=`<script>alert(1)</script>` | 400 Bad Request — id phải là số nguyên dương.                |               |        |
| DT-C-028     | Update category hợp lệ (id tồn tại)     | Admin authenticated, category id=2 tồn tại | 1. PUT `/api/categories/2` với body `{name: "Laptop Pro"}` 2. GET `/api/categories` kiểm tra | `{name: "Laptop Pro"}`, id=2                     | 200 OK, `{message: "Category updated"}`. GET trả về tên mới. |               |        |

### A5. Behavioral Tests (DT-C-029 → DT-C-033)

| Test Case ID | Description                             | Pre-condition                                                     | Steps                                                                                                   | Test Data               | Expected Result                                                                                              | Actual Result | Status |
| ------------ | --------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- | ------ |
| DT-C-029     | Xóa category không có products liên kết | Admin authenticated                                               | 1. POST `/api/categories` tạo category mới 2. DELETE category vừa tạo 3. GET `/api/categories` kiểm tra | Category mới tạo        | 200 OK, category deleted. Không side effect.                                                                 |               |        |
| DT-C-030     | Xóa category có products liên kết       | Admin authenticated, category id=1 có products dùng category_id=1 | 1. DELETE `/api/categories/1` 2. GET `/api/products` kiểm tra products có category_id=1                 | id=1 (seed có products) | 400/409 Conflict — không cho xóa khi có products liên kết.                                                   |               |        |
| DT-C-031     | GET danh sách khi có dữ liệu seed       | DB seed data (3 categories)                                       | 1. GET `/api/categories`                                                                                | —                       | 200 OK, trả về array 3 objects `[{id:1, name:"Điện thoại"}, {id:2, name:"Laptop"}, {id:3, name:"Phụ kiện"}]` |               |        |
| DT-C-032     | GET danh sách khi DB rỗng               | Xóa hết categories trước                                          | 1. DELETE tất cả categories 2. GET `/api/categories`                                                    | —                       | 200 OK, trả về array rỗng `[]`                                                                               |               |        |
| DT-C-033     | Tạo 2 category cùng tên (duplicate)     | Admin authenticated                                               | 1. POST `{name: "Test"}` 2. POST `{name: "Test"}` lần 2                                                 | `{name: "Test"}` × 2    | Lần 1: 200 OK. Lần 2: 400/409 Conflict — tên danh mục đã tồn tại.                                            |               |        |

---

## B. BVA Test Cases — Chi tiết (15 TC)

### B1. name Length — Create (BVA-C-001 → BVA-C-004)

| Test Case ID | Description                           | Pre-condition       | Steps                                                  | Test Data                     | Expected Result                                 | Actual Result | Status |
| ------------ | ------------------------------------- | ------------------- | ------------------------------------------------------ | ----------------------------- | ----------------------------------------------- | ------------- | ------ |
| BVA-C-001    | Create: name length Min-1 (0 chars)   | Admin authenticated | 1. POST `/api/categories` với body `{name: ""}`        | `{name: ""}` (0 chars)        | 400 — tên không được rỗng (SPEC: min = 1 char). |               |        |
| BVA-C-002    | Create: name length Min (1 char)      | Admin authenticated | 1. POST `/api/categories` với body `{name: "A"}`       | `{name: "A"}` (1 char)        | 200 OK, `{message: "Category created", id: N}`  |               |        |
| BVA-C-003    | Create: name length Min+1 (2 chars)   | Admin authenticated | 1. POST `/api/categories` với body `{name: "AB"}`      | `{name: "AB"}` (2 chars)      | 200 OK, category created                        |               |        |
| BVA-C-004    | Create: name length Nominal (7 chars) | Admin authenticated | 1. POST `/api/categories` với body `{name: "Điện tử"}` | `{name: "Điện tử"}` (7 chars) | 200 OK, category created                        |               |        |

### B2. name Length — Update (BVA-C-005 → BVA-C-008)

| Test Case ID | Description                            | Pre-condition                              | Steps                                                        | Test Data                                 | Expected Result                                 | Actual Result | Status |
| ------------ | -------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------- | ----------------------------------------------- | ------------- | ------ |
| BVA-C-005    | Update: name length Min-1 (0 chars)    | Admin authenticated, category id=3 tồn tại | 1. PUT `/api/categories/3` với body `{name: ""}`             | `{name: ""}` (0 chars), id=3              | 400 — tên không được rỗng (SPEC: min = 1 char). |               |        |
| BVA-C-006    | Update: name length Min (1 char)       | Admin authenticated, category id=3 tồn tại | 1. PUT `/api/categories/3` với body `{name: "X"}`            | `{name: "X"}` (1 char), id=3              | 200 OK, `{message: "Category updated"}`         |               |        |
| BVA-C-007    | Update: name length Min+1 (2 chars)    | Admin authenticated, category id=3 tồn tại | 1. PUT `/api/categories/3` với body `{name: "XY"}`           | `{name: "XY"}` (2 chars), id=3            | 200 OK, category updated                        |               |        |
| BVA-C-008    | Update: name length Nominal (11 chars) | Admin authenticated, category id=3 tồn tại | 1. PUT `/api/categories/3` với body `{name: "Phụ kiện mới"}` | `{name: "Phụ kiện mới"}` (11 chars), id=3 | 200 OK, category updated                        |               |        |

### B3. id (URL Parameter) — 7-point BVA (BVA-C-009 → BVA-C-015)

| Test Case ID | Description                  | Pre-condition                              | Steps                                                            | Test Data              | Expected Result                                                  | Actual Result | Status |
| ------------ | ---------------------------- | ------------------------------------------ | ---------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- | ------------- | ------ |
| BVA-C-009    | id Min-1 (0) — Delete        | Admin authenticated                        | 1. DELETE `/api/categories/0`                                    | id=0                   | 404 — id=0 không tồn tại (AUTOINCREMENT từ 1).                   |               |        |
| BVA-C-010    | id Min (1) — Delete          | Admin authenticated, category id=1 tồn tại | 1. DELETE `/api/categories/1` 2. GET `/api/categories` kiểm tra  | id=1                   | 200 OK, `{message: "Category deleted"}`. Category id=1 biến mất. |               |        |
| BVA-C-011    | id Min+1 (2) — Delete        | Admin authenticated, category id=2 tồn tại | 1. DELETE `/api/categories/2`                                    | id=2                   | 200 OK, category deleted                                         |               |        |
| BVA-C-012    | id Nominal (2) — Update      | Admin authenticated, category id=2 tồn tại | 1. PUT `/api/categories/2` với body `{name: "Test"}`             | `{name: "Test"}`, id=2 | 200 OK, category updated                                         |               |        |
| BVA-C-013    | id Max-1 (2) — Verify exists | Admin authenticated                        | 1. GET `/api/categories` 2. Kiểm tra category id=2 có trong list | id=2                   | 200 OK, category id=2 tồn tại trong response                     |               |        |
| BVA-C-014    | id Max (3) — Delete          | Admin authenticated, category id=3 tồn tại | 1. DELETE `/api/categories/3`                                    | id=3                   | 200 OK, category deleted — ID lớn nhất trong seed                |               |        |
| BVA-C-015    | id Max+1 (4) — Delete        | Admin authenticated                        | 1. DELETE `/api/categories/4`                                    | id=4                   | 404 — id=4 không tồn tại.                                        |               |        |

---

## C. UI Validation Test Cases (7 TC)

> **Source:** FR-21 (Giao diện chung), FR-22 (Form Requirements), FR-24 (Feedback & State)

| Test Case ID | Description                                           | Pre-condition                                         | Steps                                                                          | Test Data | Expected Result                                                                                                 | Actual Result | Status |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| UI-C-001     | Tab "Danh mục" highlight khi được chọn (FR-21)        | Admin logged in, trang Admin                          | 1. Click tab "Danh mục" 2. Kiểm tra CSS class highlight                        | —         | Tab "Danh mục" có highlight (text-blue-400 hoặc tương tự) để phân biệt với tab khác.                            |               |        |
| UI-C-002     | Tiêu đề trang "Quản lý Danh mục" có thẻ h1/h2 (FR-21) | Admin logged in, tab Danh mục                         | 1. Inspect DOM, kiểm tra tiêu đề trang                                         | —         | Trang có tiêu đề "Quản lý Danh mục" trong thẻ heading (h1 hoặc h2). Mỗi trang chỉ 1 thẻ `<h1>`.                 |               |        |
| UI-C-003     | Trường "Tên danh mục mới" có dấu `*` required (FR-22) | Admin logged in, tab Danh mục                         | 1. Quan sát form thêm danh mục 2. Kiểm tra label có ký hiệu `*`                | —         | Trường bắt buộc (tên danh mục) phải có ký hiệu `*` bên cạnh nhãn.                                               |               |        |
| UI-C-004     | Nút "Thêm mới" dùng màu xanh dương (FR-21)            | Admin logged in, tab Danh mục                         | 1. Quan sát nút "Thêm mới" 2. Kiểm tra CSS background color                    | —         | Nút "Thêm mới" có background màu xanh dương (blue/bg-blue-600).                                                 |               |        |
| UI-C-005     | Nút "Xóa" dùng màu đỏ (FR-21)                         | Admin logged in, tab Danh mục                         | 1. Quan sát nút "Xóa" bên cạnh mỗi danh mục                                    | —         | Nút "Xóa" có background màu đỏ (red/bg-red-500).                                                                |               |        |
| UI-C-006     | Xóa danh mục phải có dialog xác nhận (FR-24)          | Admin logged in, tab Danh mục, có ít nhất 1 category  | 1. Click nút "Xóa" bên cạnh 1 danh mục 2. Quan sát có dialog confirm hay không | —         | Hiển thị dialog xác nhận trước khi xóa (ví dụ: "Bạn có chắc muốn xóa danh mục này?"). Chỉ xóa khi user confirm. |               |        |
| UI-C-007     | Trang danh mục rỗng hiển thị empty state (FR-24)      | Admin logged in, tab Danh mục, DB không có categories | 1. Xóa hết categories 2. Quan sát giao diện tab Danh mục                       | —         | Hiển thị empty state với icon/hình minh họa và message thân thiện (ví dụ: "Chưa có danh mục nào").              |               |        |

---

## Thống kê

| Nhóm                    | Số TC  | ID Range              | Source                 |
| ----------------------- | ------ | --------------------- | ---------------------- |
| A. Domain — Create name | 10     | DT-C-001 → DT-C-010   | 03_domain_testcases.md |
| A. Domain — Update name | 4      | DT-C-011 → DT-C-014   | 03_domain_testcases.md |
| A. Domain — Delete id   | 7      | DT-C-015 → DT-C-021   | 03_domain_testcases.md |
| A. Domain — Update id   | 7      | DT-C-022 → DT-C-028   | 03_domain_testcases.md |
| A. Domain — Behavioral  | 5      | DT-C-029 → DT-C-033   | 03_domain_testcases.md |
| B. BVA — name Create    | 4      | BVA-C-001 → BVA-C-004 | 05_bva_testcases_v1.md |
| B. BVA — name Update    | 4      | BVA-C-005 → BVA-C-008 | 05_bva_testcases_v1.md |
| B. BVA — id param       | 7      | BVA-C-009 → BVA-C-015 | 05_bva_testcases_v1.md |
| C. UI Validation        | 7      | UI-C-001 → UI-C-007   | FR-21, FR-22, FR-24    |
| **Tổng cộng**           | **54** |                       |                        |
