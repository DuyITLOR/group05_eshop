# Boundary Value Analysis – Feature C (FR-15: Quản lý Sản phẩm)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Admin `:5174` (tab Sản phẩm) → API `POST/PUT /api/products`
> **Kỹ thuật:** Boundary Value Analysis (BVA) — 3-value BVA (min−1 / min / min+1, và max−1 / max / max+1 nơi có cận trên).
> **Quy ước mã:** Domain Testing dùng `TC-PRODUCT-001…010` (+ 016/017 giả định). BVA dùng `TC-PRODUCT-011…015` và `018, 019` (đánh tiếp, không xáo số cũ); tái dùng `TC-PRODUCT-002, 005` từ domain.
> **Nguồn biên:** bảng domain ở `domain-testing.md` (Bước 2 & 4) + đặc tả FR-15 (SRS README.md:191–198).
> Actual = dự đoán từ source (`frontend-admin/src/App.jsx`, `backend/server.js`) — cần xác nhận trên UI/API.

**Đặc tả FR-15 (các ràng buộc có thứ tự):**
- `name`: bắt buộc, **tối đa 255 ký tự** → `1 ≤ length ≤ 255` (cận trên rõ ràng).
- `price`: bắt buộc, **số dương** → `price > 0` (cận dưới **0 exclusive**, không có cận trên).
- `category_id`: chọn từ list (enum, **không phải dải số** → không BVA).

---

## Bước 1 – Chọn biến đủ điều kiện BVA

BVA chỉ áp dụng cho biến **có thứ tự + có cận (ordered + bounded)**. Phân tích từng biến:

| Biến | Có thứ tự? | Có cận? | Đưa vào BVA? | Lý do |
|------|-----------|---------|--------------|-------|
| `name.length` | | (min=1, **max=255**) | **Có** | SRS "tối đa 255 ký tự" → có **cả cận dưới (1) lẫn cận trên (255)** |
| `price` | | (min=0 exclusive, max=unspec.) | **Có** | SRS "số dương > 0" → cận dưới **0 exclusive** |
| `category_id` | | | Không | Khóa ngoại rời rạc (chọn từ list) — không phải dải số → giữ ở EP |
| `productOp` | | | Không | Tập thao tác CRUD rời — không có thứ tự/cận → giữ ở EP |

> **Tổng: 2 biến BVA.** Khác Feature A (6 biến "ít nhất N", chỉ có cận dưới) và Feature B (1 biến, 1 cận): Feature C có `name.length` **đủ 2 cận** (test 6 điểm) và `price` có **cận dưới exclusive** (điểm dễ sai nhất).

---

## Bước 2 – Xác định cận (bounds) của từng biến

| Biến | Cận dưới (lower) | Cận trên (upper) | Inclusive? | Đơn vị |
|------|-----------------|-----------------|------------|--------|
| `name.length` | **1** (bắt buộc) | **255** | Cả 2 **inclusive** (`1 ≤ len ≤ 255`) | ký tự |
| `price` | **0** | Không quy định (SRS) | Cận dưới **exclusive** (`price > 0` → 0 bị loại) | VND |

> **Điểm dễ sai nhất:** `price` dùng `>` (exclusive) → **0 phải bị TỪ CHỐI**; `name.length` dùng `≤ 255` (inclusive) → **255 phải được CHẤP NHẬN**. Nhầm dấu là lỗi BVA phổ biến nhất.

---

## Bước 3 – Sinh giá trị biên (3-value BVA)

Với mỗi cận, sinh 3 điểm: **bound−1 / bound / bound+1**. `name.length` có **2 cận** → 6 điểm; `price` chỉ có cận dưới → 3 điểm (cận trên không có → "—").

| Biến | min−1 | **min** | min+1 | max−1 | **max** | max+1 |
|------|-------|---------|-------|-------|---------|-------|
| `name.length` | 0 (`""` → reject) | **1** (`"A"` → accept) | 2 (`"AB"` → accept) | 254 (accept) | **255** (accept) | 256 (reject) |
| `price` | −1 (reject) | **0** (reject — exclusive) | 1 (accept) | — | (không có max) | — |

> `name.length` test **đủ 6 điểm** ở cả 2 cận (1 và 255). `price` chỉ có cận dưới exclusive → `0` **reject**, `1` accept; **cận trên không có trong SRS → thêm 1 TC giá trị rất lớn dò "giới hạn ẩn"** (giống Feature A test name=256, Feature B test quantity=1.000.000) → xem **TC-PRODUCT-020**.

---

## Bước 4 – Thiết kế test case BVA

> Quy tắc 1 TC / 1 điểm biên; biến khác giữ hợp lệ. Khi test `name` → `price=1000`, `category_id=1`; khi test `price` → `name="Laptop Test"`, `category_id=1`.

### Nhóm B1 – `name.length` (cận 1–255, inclusive cả 2 cận)

| TC ID | Tiêu đề | Điểm biên | Input name | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|---------|-----------|-----------|----------------|----------------------------|--------|-----|
| TC-PRODUCT-002 *(tái dùng)* | name rỗng | **0** (min−1) | `""` | Từ chối (bắt buộc) | UI `required` chặn → đúng; API trực tiếp backend vẫn tạo | Pass † | (API: BUG-C4) |
| **TC-PRODUCT-013** | name 1 ký tự (biên min) | **1** (min, on) | `"A"` | **Chấp nhận** | Lưu OK | Pass | — |
| **TC-PRODUCT-018** | name 2 ký tự (min+1) | **2** (min+1, in) | `"AB"` | **Chấp nhận** | Lưu OK | Pass | — |
| **TC-PRODUCT-019** | name 254 ký tự (max−1) | **254** (max−1, in) | `"A"×254` | **Chấp nhận** | Lưu OK | Pass | — |
| **TC-PRODUCT-011** | name 255 ký tự (biên max) | **255** (max, on) | `"A"×255` | **Chấp nhận** (đúng giới hạn) | Lưu OK | Pass | — |
| **TC-PRODUCT-012** | name 256 ký tự (max+1) | **256** (max+1, off) | `"A"×256` | **Từ chối** (vượt 255) | Ô `name` không `maxLength`, backend không validate → **vẫn lưu** | Fail | BUG-C3 |

### Nhóm B2 – `price` (cận dưới 0, exclusive; không có cận trên)

| TC ID | Tiêu đề | Điểm biên | Input price | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|---------|-----------|-------------|----------------|----------------------------|--------|-----|
| TC-PRODUCT-005 *(tái dùng)* | giá âm | **−1** (min−1) | `-1000` | Từ chối | Lưu giá âm | Fail | BUG-C1 |
| **TC-PRODUCT-014** | giá = 0 (biên, exclusive) | **0** (min, off) | `0` | **Từ chối** (phải > 0) | Không validate → **lưu giá 0** | Fail | BUG-C1 |
| **TC-PRODUCT-015** | giá = 1 (hợp lệ nhỏ nhất) | **1** (min+1, in) | `1` | **Chấp nhận** | Lưu OK | Pass | — |
| **TC-PRODUCT-020** | giá rất lớn (giới hạn ẩn) | **giá trị lớn** | `999999999999` | Chấp nhận (SRS không có max) — **nhưng nên kiểm giá phi lý / tràn số khi tính tổng tiền** | Lưu OK, không chặn (không kiểm) | Pass\* | (rủi ro: thiếu kiểm giá tối đa) |

---

## Tổng kết test case BVA

| Nhóm | TC IDs | Số TC | Pass | Fail |
|------|--------|-------|------|------|
| B1 `name.length` | 002†, 013, 018, 019, 011, 012 | 6 | 5 | 1 |
| B2 `price` | 005, 014, 015, 020 | 4 | 2 | 2 |
| **Tổng** | | **10** | **7** | **3** |

> TC mới thực sự của BVA: **011, 012, 013, 014, 015, 018, 019, 020 = 8 TC mới**. `TC-002, 005` tái dùng từ domain-testing (không đếm trùng).
> † TC-002 (name rỗng): Pass vì HTML `required` chặn submit; lỗi backend không validate là BUG-C4 (lộ khi gọi API).
> \* TC-020 (giá rất lớn): Pass theo đúng SRS (không có cận trên) nhưng phơi bày **rủi ro thiếu kiểm giá tối đa / tràn số** — giống TC giới hạn ẩn của Feature A (name=256) & Feature B (quantity=1tr).

---

## Bước 5 – Giải thích cách áp dụng BVA cho FR-15

1. **Chọn biến (Bước 1):** chỉ `name.length` và `price` là biến *có thứ tự + có cận*; `category_id`/`productOp` rời rạc → giữ ở EP (không ép BVA).
2. **Xác định cận (Bước 2):** `name.length` có **2 cận inclusive** (1 và 255); `price` có **1 cận dưới exclusive** (0). Ghi rõ inclusive/exclusive — lỗi BVA phổ biến nhất.
3. **Sinh giá trị biên (Bước 3):** `name.length` đủ 6 điểm quanh 1 và 255; `price` 3 điểm quanh 0 (không có cận trên trong SRS).
4. **Thiết kế TC single-variable (Bước 4):** mỗi TC đẩy 1 biến sang biên, giữ biến khác hợp lệ; test **đủ cả min, min+1, max−1, max** (khắc phục thiếu sót min+1=2 và max−1=254 ở bản trước).
5. **Phát hiện chính:** BVA phơi bày 2 lỗi tại biên — **256 ký tự vẫn lưu** (BUG-C3, biên max+1 không bị chặn) và **giá 0 vẫn lưu** (BUG-C1, biên dưới exclusive bị bỏ qua). Các biên hợp lệ (1, 2, 254, 255 cho name; 1 cho price) đều phải PASS.
6. **Inclusive vs exclusive:** `name` **255 phải accept** (`≤`); `price` **0 phải reject** (`>`). Nhầm dấu → kết quả ngược.

**Giả định được ghi nhận:**
- (a) `price` cho phép số thực > 0; SRS không nêu cận trên → **thêm 1 TC giá trị rất lớn (TC-020) dò "giới hạn ẩn" / tràn số** (giống Feature A test name=256, Feature B test quantity=1.000.000) thay vì bỏ trống biên trên.
- (b) `name.length` đo theo số ký tự nhập; SRS nêu rõ "tối đa 255" nên cận trên là biên cứng (khác Feature A/B vốn không có cận trên).

---

## Bước 6 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Inclusive/exclusive đúng chưa?** `name`: 1 và 255 **inclusive** (accept); `price`: 0 **exclusive** (reject). Đối chiếu lại SRS.
2. **Biên nào bị bỏ sót?** Cân nhắc: cận trên `price` (tồn kho / tràn số `max int`), `price` thập phân (vd `0.5`), `name` 255 tính theo ký tự Unicode hay byte.
3. **Chạy thật trên UI/API:** nhập `name` = 1/2/254/255/256 ký tự và `price` = −1/0/1, xem có chặn không (hiện là dự đoán từ source).
4. **Đối chiếu chéo domain-testing:** điểm on/off (255/256, 0/1) phải khớp phân vùng `name`/`price` ở domain-testing (EP3 ↔ max+1, EP5 ↔ price 0).

> Sau khi duyệt + chạy xác nhận: viết **bug report** (BUG-C1, C3 lộ rõ qua BVA; cùng C2, C4 từ domain) rồi tạo issue.

---

## AI Gap Analysis (ứng viên)

| Điểm BVA AI dễ bỏ sót | Vì sao AI sót |
|-----------------------|----------------|
| Biên `name.length = 256` (max+1) vẫn lưu | AI ít test độ dài tối đa; ô không `maxLength` nên dễ tưởng đã giới hạn. |
| Biên `price = 0` (exclusive) bị chấp nhận | AI dễ coi 0 là "không âm = hợp lệ", quên SRS yêu cầu **> 0**. |
| Thiếu **min+1 (2)** và **max−1 (254)** cho name | AI hay chỉ test min & max, bỏ điểm "in" sát biên → 3-value BVA không đủ. |
| Không probe **giá trị rất lớn** cho price (giới hạn ẩn) | Cận trên không có trong SRS → AI bỏ qua; nên test giá phi lý dò tràn số / thiếu kiểm (TC-020). |
| Chỉ 2 biến BVA (name, price) | Tránh ép BVA cho `category_id`/`productOp` (rời rạc) — đúng nguyên tắc. |
