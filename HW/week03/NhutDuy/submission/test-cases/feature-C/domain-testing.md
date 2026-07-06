# Domain Testing – Feature C (FR-15: Quản lý Sản phẩm / Product CRUD)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Trang Admin `http://localhost:5174` (tab **Sản phẩm**) → API `POST/PUT/DELETE /api/products`
> **Kỹ thuật:** Domain Testing / Equivalence Partitioning (EP). Biên `name.length` và `price` được đánh dấu để chuyển sang BVA.
> **Quy ước mã:** `TC-PRODUCT-###` (module FR-15 = `PRODUCT`).
> **Actual = dự đoán từ đọc source** (`frontend-admin/src/App.jsx`, `backend/server.js`). Cần **chạy lại trên UI admin** để xác nhận (human review).

**Đặc tả đầu vào (SRS – FR-15):**
- Admin có thể **Thêm / Xem / Sửa / Xóa** sản phẩm (CRUD).
- **Tên sản phẩm:** bắt buộc, **tối đa 255 ký tự**.
- **Giá:** bắt buộc, phải là số **dương (> 0)**.
- **Danh mục:** bắt buộc, **chọn từ danh sách có sẵn**.
- Khi **Sửa** một sản phẩm → **chỉ sản phẩm đó** bị thay đổi, các sản phẩm khác giữ nguyên.

---

## Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `name` | string | Ô "Tên sản phẩm" (`App.jsx`, `required`) → `POST/PUT /api/products` | **Biến chính**; bắt buộc, ≤ 255 ký tự |
| 2 | `price` | number | Ô "Giá tiền" (`App.jsx`, `type="number"`) → body API | **Biến chính**; bắt buộc, > 0 |
| 3 | `category_id` | enum (FK) | `<select>` từ danh mục có sẵn | bắt buộc, phải thuộc danh sách |
| 4 | `imageUrl` | string | Ô "URL Ảnh" | SRS không ràng buộc → thêm **ràng buộc giả định** (nên là URL hợp lệ) để test; **ngoài SRS** |
| 5 | `description` | string | Ô "Mô tả" (textarea) | SRS không ràng buộc → thêm **ràng buộc giả định** (nên escape HTML chống XSS) để test; **ngoài SRS** |
| 6 | `productOp` | enum | Thao tác CRUD: create / read / **update(edit)** / delete | Hành vi FR-15; chứa **luật sửa-cô-lập** |

> Biến rút từ **đặc tả FR-15** + rà toàn bộ form admin. 3 trường có ràng buộc SRS (`name`, `price`, `category_id`) được phân vùng & test. 2 trường `imageUrl`/`description` **SRS không quy định** → mình **bổ sung ràng buộc giả định** (assumption, **ghi rõ ngoài SRS**) để test thêm cho đủ — `imageUrl` nên là URL hợp lệ, `description` nên escape HTML. Nhờ tiếp cận từ đặc tả → bắt được backend không validate, ô Giá thiếu `required`/`min`, và luật "sửa 1 SP" bị vi phạm (mass-update).

> **EP xét cả Input VÀ Output (B1):** Domain Testing/EP không chỉ phân vùng đầu vào mà còn phân vùng **kết quả đầu ra**. **Output của FR-15** gồm: (a) **trạng thái sản phẩm trong DB** (được tạo / sửa / xóa), (b) **hiển thị trên bảng admin** (`GET /api/products` render danh sách), (c) **thông báo / phản hồi API** (tạo OK hay từ chối/lỗi). Riêng thao tác **Sửa** còn có Output về **phạm vi ảnh hưởng**: chỉ đúng 1 SP được sửa thay đổi. Các Output này được phân vùng ở **Bước 2b** và đối chiếu với cột **Expected** trong bảng test case (Bước 5).

---

## Bước 2 – Xác định domain của từng biến

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `name` | Chuỗi **1–255 ký tự** (không rỗng/khoảng trắng) | SRS: "bắt buộc, tối đa 255 ký tự". |
| `price` | Số thực **> 0** | SRS: "bắt buộc, số dương (> 0)". Cận dưới **0 là exclusive**. |
| `category_id` | id **thuộc** danh mục đang có | SRS: "chọn từ danh sách có sẵn" (FK hợp lệ). |
| `imageUrl` | URL hợp lệ (http/https) hoặc rỗng | **Giả định** (SRS không quy định): nên là URL hợp lệ. |
| `description` | Text thường (đã escape HTML) | **Giả định** (SRS không quy định): nên escape để chống XSS. |
| `productOp` | create / read / update / delete | update: **chỉ sản phẩm được sửa** thay đổi. |

**Miền giá trị của Output (kết quả):**

| Output | Miền ĐÚNG (kỳ vọng) | Miền SAI (vi phạm / lỗi) |
|--------|---------------------|---------------------------|
| Tạo SP (DB + bảng admin + thông báo) | Tạo/sửa/xóa **OK** khi input hợp lệ; SP hiển thị đúng trên bảng admin | **Lưu được** giá ≤ 0 / rỗng; **lưu** tên > 255 ký tự |
| Sửa SP (phạm vi ảnh hưởng) | Sửa 1 SP → **chỉ SP đó** đổi, SP khác giữ nguyên | **Mass-update**: đổi tên/giá **TẤT CẢ** SP |
| Toàn vẹn dữ liệu (FK danh mục) | SP luôn thuộc danh mục hợp lệ | Tạo **SP mồ côi** (category_id không tồn tại) |

> Output domain được tách chi tiết ở **Bước 2b** và là cơ sở cho cột **Expected** ở bảng test case Bước 5.

---

## Bước 2b – Miền giá trị Output (kết quả)

EP áp dụng cho cả đầu ra: ta phân **kết quả** thành vùng **Thành công** và các vùng **Từ chối/Lỗi**. Mỗi test case ở Bước 5 phải rơi vào đúng một vùng Output dưới đây (đối chiếu cột **Expected**):

| Mã Output | Vùng kết quả (Output partition) | Mô tả | Loại |
|-----------|----------------------------------|-------|------|
| **O1** | **Thành công** | Tạo/Sửa/Xóa OK; SP hiển thị đúng trên bảng admin; thông báo thành công | Đúng |
| **O2** | Từ chối – tên không hợp lệ | Từ chối khi `name` rỗng/chỉ khoảng trắng hoặc > 255 ký tự | Đúng (validate) |
| **O3** | Từ chối – giá không hợp lệ | Từ chối khi `price` ≤ 0 / rỗng / không phải số | Đúng (validate) |
| **O4** | Từ chối – danh mục không hợp lệ | Từ chối khi `category_id` không thuộc danh mục có sẵn (chống SP mồ côi) | Đúng (validate) |
| **O5** | Sửa cô lập đúng | Sửa 1 SP → **chỉ SP đó** đổi, SP khác giữ nguyên | Đúng (luật sửa) |

**Các vùng Output SAI cần phát hiện (không được phép xảy ra):**

| Mã | Output SAI | TC bắt lỗi |
|----|------------|-----------|
| O-SAI-1 | Lưu được giá ≤ 0 / rỗng | TC-004 / 005 / 006 (BUG-C1) |
| O-SAI-2 | Lưu được tên > 255 ký tự | TC-003 (BUG-C3) |
| O-SAI-3 | Mass-update đổi tên/giá TẤT CẢ SP | TC-008 (BUG-C2) |
| O-SAI-4 | Tạo SP mồ côi (category_id không tồn tại) | TC-007 (BUG-C4) |

> **Đối chiếu nhất quán:** mỗi giá trị ở cột **Expected (SRS)** trong bảng Bước 5 đều ánh xạ về một vùng Output ở trên — Expected "thành công" ↔ **O1**; các Expected "Từ chối …" ↔ **O2–O4**; Expected "chỉ SP#1 đổi" ↔ **O5**. Khi Actual rơi vào **O-SAI-\*** → test **Fail** + gắn bug tương ứng.

---

## Bước 3 – Phân vùng tương đương (Equivalence Partitions)

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `name` | **EP1**: 1–255 ký tự | **EP2**: rỗng / chỉ khoảng trắng · **EP3**: > 255 ký tự |
| `price` | **EP4**: số > 0 | **EP5**: = 0 · **EP6**: âm (< 0) · **EP7**: rỗng / không phải số |
| `category_id` | **EP8**: id thuộc danh mục có sẵn | **EP9**: id **không tồn tại** / không chọn |
| `imageUrl` | **EP12**: URL hợp lệ / rỗng | **EP12b** *(giả định)*: chuỗi không phải URL |
| `description` | **EP13**: text thường | **EP13b** *(giả định)*: chứa HTML/script (XSS) |
| `productOp` (luật sửa) | **EP10**: sửa 1 SP → **chỉ SP đó** đổi | **EP11**: sửa lan sang SP khác (vi phạm) |

> Các vùng rời nhau & phủ kín mọi đầu vào. `name.length` (biên 255) và `price` (biên 0 exclusive) là **biên số thật** → đánh dấu cho BVA.
> Vùng invalid **EP12b/EP13b là giả định** (ngoài SRS) — vẫn test để dò validate URL & XSS (TC-016/017).

---

## Bước 4 – Chọn điểm đại diện (representative points)

| Vùng | Đại diện | Loại điểm |
|------|----------|-----------|
| EP1 `name` hợp lệ | `"Laptop Test"` (11 ký tự) | in |
| EP2 `name` rỗng | `""` / `"   "` | out |
| EP3 `name` > 255 | chuỗi 256 ký tự | **off** (= max+1) |
| EP4 `price` hợp lệ | `1000000` | in |
| EP5 `price` = 0 | `0` | **on** (= biên dưới, exclusive → reject) |
| EP6 `price` âm | `-1000` | out |
| EP7 `price` rỗng | `""` | out |
| EP8 `category_id` hợp lệ | `1` (danh mục tồn tại) | in |
| EP9 `category_id` lạ | `9999` (không tồn tại) | out |
| EP12 / EP12b `imageUrl` | `"https://placehold.co/300"` / `"abc"` (không phải URL) | in / out *(giả định)* |
| EP13 / EP13b `description` | `"Mô tả mẫu"` / `"<script>alert(1)</script>"` | in / out *(giả định)* |
| EP10/EP11 sửa | sửa tên SP #1 → kỳ vọng chỉ #1 đổi | (rule) |

> **Chuyển cho BVA:** `name.length` đủ 6 điểm 2 cận (**0/1/2/254/255/256**) và `price` (**−1/0/1**, cận dưới exclusive) → xử lý ở skill `boundary-value-analysis` (TC-PRODUCT-011→015 + 018, 019).

---

## Bước 5 – Thiết kế test case (single-fault: chỉ thả 1 biến sang vùng invalid)

> Baseline hợp lệ: `name="Laptop Test"`, `price=1000000`, `category_id=1` (tồn tại). Mỗi TC chỉ đổi **một** trường, giữ các trường còn lại hợp lệ — cột **Input thể hiện đủ cả 3 trường** `name / price / category_id`.

> Baseline 5 trường: `name="Laptop Test"`, `price=1000000`, `category_id=1`, `imageUrl="https://img.co"`, `description="Mô tả"`. Mỗi TC chỉ đổi 1 trường.

| TC ID | Mô tả | Input (name / price / category_id / imageUrl / description) | Vùng | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|-------|------------------------------------------------------------|------|----------------|----------------------------|--------|-----|
| TC-PRODUCT-001 | Thêm SP hợp lệ (mốc) | `"Laptop Test"` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP1+EP4+EP8 | Tạo SP thành công | `POST /api/products` tạo OK | Pass | — |
| TC-PRODUCT-002 | Tên rỗng | `""` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP2 | Từ chối (bắt buộc) | UI `required` chặn → từ chối **đúng**; gọi **API trực tiếp** backend **vẫn tạo** | Pass † | (API: BUG-C4) |
| TC-PRODUCT-003 | Tên > 255 ký tự | `<256 ký tự>` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP3 | Từ chối (tối đa 255) | Ô `name` **không `maxLength`**, backend không validate → **lưu cả chuỗi 256** | Fail | BUG-C3 |
| TC-PRODUCT-004 | Giá = 0 | `"Laptop Test"` / `0` / `1` / `"https://img.co"` / `"Mô tả"` | EP5 | Từ chối (phải > 0) | Ô Giá **không `required`/`min`** → **tạo SP giá 0** | Fail | BUG-C1 |
| TC-PRODUCT-005 | Giá âm | `"Laptop Test"` / `-1000` / `1` / `"https://img.co"` / `"Mô tả"` | EP6 | Từ chối | Tạo SP **giá âm** | Fail | BUG-C1 |
| TC-PRODUCT-006 | Giá rỗng / không phải số | `"Laptop Test"` / `""` / `1` / `"https://img.co"` / `"Mô tả"` | EP7 | Từ chối | Ô Giá **không `required`** → lưu price rỗng/`NULL` | Fail | BUG-C1 |
| TC-PRODUCT-007 | Danh mục không tồn tại **(chỉ API — UI là `<select>`, không nhập số được)** | `"Laptop Test"` / `1000000` / `9999` / `"https://img.co"` / `"Mô tả"` (API) | EP9 | Từ chối (phải thuộc list) | `category_id INTEGER` **không có FK**, không `PRAGMA foreign_keys`, POST không validate → tạo SP **mồ côi** danh mục | Fail | BUG-C4 |
| TC-PRODUCT-008 | Sửa tên 1 SP | sửa SP#1: `name→"TEST"` (4 trường còn lại giữ nguyên) | EP10/EP11 | **Chỉ SP#1** đổi tên, SP khác giữ nguyên | `fakeMassUpdatedProducts` gán `name` mới cho **TẤT CẢ** SP | Fail | BUG-C2 |
| TC-PRODUCT-009 | Xóa 1 sản phẩm | xóa SP#2 ( `—`/`—`/`—`/`—`/`—` ) | — | SP#2 biến mất, SP khác còn | `DELETE /api/products/2` → xóa đúng | Pass | — |
| TC-PRODUCT-010 | Xem danh sách sản phẩm | mở tab Sản phẩm ( `—`/`—`/`—`/`—`/`—` ) | — | Hiển thị đầy đủ SP | `GET /api/products` render đầy đủ | Pass | — |
| TC-PRODUCT-016 | *(giả định)* imageUrl không phải URL | `"Laptop Test"` / `1000000` / `1` / `"abc"` / `"Mô tả"` | EP12b | *(giả định)* nên validate URL | Lưu được; khi hiển thị `onError` → **ảnh placeholder** (không vỡ UI) → chấp nhận được | Pass\* | (giả định, ngoài SRS) |
| TC-PRODUCT-017 | *(giả định)* description chứa HTML/script (XSS probe) | `"Laptop Test"` / `1000000` / `1` / `"https://img.co"` / `"<script>alert(1)</script>"` | EP13b | *(giả định)* escape, không thực thi | ProductDetail render `{description}` (JSX **auto-escape**) → hiện nguyên văn, **không chạy script** → an toàn | Pass | (XSS thật ở `shipping_address`/`search` — ngoài FR-15) |

> **Phủ vùng:** `name` EP1→TC-001 · EP2→TC-002 · EP3→TC-003 · `price` EP4→TC-001 · EP5→TC-004 · EP6→TC-005 · EP7→TC-006 · `category_id` EP8→TC-001 · EP9→TC-007 · `productOp` EP10/EP11→TC-008 (sửa), delete→TC-009, read→TC-010.
> `imageUrl`/`description`: EP12/EP13 (hợp lệ) = baseline; **EP12b/EP13b (giả định ngoài SRS)** → TC-016 (URL không hợp lệ) / TC-017 (XSS probe). *Đánh số: BVA = 011–015 + 018, 019; EP giả định = 016, 017 — đánh tiếp, không xáo số cũ.*

---

## Bước 5b – Rút gọn test case (B5)

**Nguyên tắc B5:** hai test case được coi là **trùng** (và chỉ giữ lại **1**) khi **Input GIỐNG HỆT NHAU VÀ Expected Output cũng giống hệt nhau**. Nếu khác nhau ở **bất kỳ** giá trị input nào, hoặc cùng input nhưng Expected khác → **không trùng**, giữ cả hai.

**Rà soát bộ TC hiện tại (TC-PRODUCT-001 → 010, 016, 017):**

| Cặp xét | Khác Input? | Khác Expected? | Kết luận |
|---------|-------------|----------------|----------|
| Mỗi TC single-fault (002–007) | Có — mỗi TC thả **1 biến khác nhau** sang vùng invalid | Có — Expected từ chối theo từng luật riêng | Không trùng |
| TC-004 / 005 / 006 (price = 0 / âm / rỗng) | Có — giá trị `price` khác nhau (`0` / `-1000` / `""`) | Expected cùng "Từ chối" nhưng **Input khác** | Không trùng (chỉ trùng khi cả Input lẫn Expected giống hệt) |
| TC-001 (mốc hợp lệ) vs các TC còn lại | Có | Có | Không trùng |
| TC-009 (delete) / TC-010 (read) | Có — thao tác khác | Có | Không trùng |

**Kết luận:** các TC đều là **single-fault khác nhau ở Input và/hoặc Expected Output** → **không có cặp TC trùng nào cần loại bỏ**. Bộ test case sau rút gọn **giữ nguyên** đầy đủ các TC hiện có. (Không phát hiện cặp gần-trùng; lưu ý TC-004/005/006 tuy cùng Expected "Từ chối" nhưng **khác Input** nên theo B5 vẫn phải giữ riêng.)

---

## Bước 6 – Giải thích từng bước (áp dụng cho FR-15)

1. **Xác định biến (Bước 1):** form có 5 trường — **3 trường có ràng buộc SRS** (`name`, `price`, `category_id`) được test; **2 trường SRS không quy định** (`imageUrl`, `description`) được test bằng **ràng buộc giả định** (TC-016/017, ghi rõ ngoài SRS) — cộng nhóm CRUD (`productOp`) chứa luật "sửa-cô-lập".
2. **Domain (Bước 2):** bám SRS — name 1–255, price > 0 (chú ý **biên 0 là exclusive**), category phải là FK hợp lệ.
3. **Phân vùng (Bước 3):** mỗi biến 1 vùng valid + các vùng invalid theo từng luật; `productOp` thêm vùng "sửa lan" để bắt mass-update.
4. **Đại diện (Bước 4):** mỗi vùng 1 giá trị; `name.length` và `price` có thứ tự → phân in/on/off và đánh dấu biên (255, 0) cho BVA.
5. **Sinh test case (Bước 5):** single-fault — giữ 2 biến hợp lệ, chỉ thả 1 biến sang invalid; thêm nhóm Op cho luật CRUD. Expected suy trực tiếp từ SRS.
6. **Thực thi:** chạy trên Admin UI `:5174` (tab Sản phẩm) và đối chiếu; với các lỗi backend (name rỗng, category lạ) cần **gọi API trực tiếp** vì UI có thể che bằng `required`/`select`.

**Giả định:** (a) `price` cho phép số thực > 0 (SRS chỉ nói "số dương"); (b) giá trị "rỗng" ở ô số = không nhập; (c) endpoint sản phẩm đáng lẽ chỉ dành cho admin (xem AI gap — hiện **thiếu xác thực**).

---

## Ghi chú cho AI Gap Analysis (ứng viên)

| Test case / lỗi AI dễ bỏ sót | Vì sao AI sót |
|------------------------------|----------------|
| Giá = 0 / âm / rỗng (TC-004→006) | AI hay chỉ test "giá hợp lệ"; quên ô Giá **không `required`/`min`** và backend không validate. |
| Tên > 255 ký tự (TC-003) | AI ít test biên độ dài; ô `name` không `maxLength`, backend không cắt. |
| **Hệ quả layout: tên dài làm tràn bảng, không có horizontal scroll → nút Sửa/Xóa bị đẩy mất, không thao tác được** (phát hiện khi chạy TC-003 trên UI admin) | AI/người test chỉ kiểm "dữ liệu có lưu không", **bỏ qua hệ quả hiển thị**: bảng `<table>` không bọc `overflow-x:auto`, cột Hành động bị đẩy ra ngoài viewport. Đây là tác động UX nghiêm trọng từ việc không giới hạn 255 ký tự (liên quan BUG-C3). |
| Mass-update khi sửa (TC-008) | Bug ẩn trong `fakeMassUpdatedProducts`; AI test "sửa được" là xong, không đối chiếu luật "chỉ SP đó đổi". |
| Category không tồn tại (TC-007) | Chỉ lộ khi gọi API trực tiếp; UI `<select>` che mất. |
| **Endpoint sản phẩm thiếu auth admin** | `POST/PUT/DELETE /api/products` **không** `authenticateToken` → ai cũng sửa được. (Thuộc yêu cầu bảo mật, ghi nhận như ứng viên ngoài phạm vi FR-15.) |
| `imageUrl`/`description` không validate (TC-016/017, giả định) | AI dễ bỏ qua trường không ràng buộc SRS; cần kiểm URL hợp lệ + XSS. Thực tế: ảnh có `onError` fallback, description được auto-escape → an toàn (Pass). |

---

## Bước 7 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Chạy thật trên Admin UI** `:5174` để xác nhận cột Actual (đặc biệt TC-004→006: nhập giá 0/âm/rỗng; TC-008: sửa 1 SP xem các SP khác có đổi tên không).
2. **Biến đủ chưa?** Có cần test `imageUrl`/`description` (SRS không ràng buộc → không bắt buộc) hay trùng tên SP không?
3. **Expected bám SRS chưa?** Nhất là luật sửa-cô-lập (TC-008) và biên giá > 0 (exclusive).
4. **Bug:** xác nhận BUG-C1→C4 là thật (tái hiện trên UI/API) trước khi viết bug report + tạo issue.

> Sau khi bạn duyệt + chạy xác nhận: làm tiếp **BVA** (biên `name.length` 255, `price` 0), rồi **bug report** (BUG-C1→C4).
