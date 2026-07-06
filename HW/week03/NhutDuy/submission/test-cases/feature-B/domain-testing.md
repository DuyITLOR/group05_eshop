# Domain Testing – Feature B (FR-07: Giỏ hàng)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Trang chi tiết SP `/products/:id` (ô Số lượng) → Giỏ hàng `/cart` → API `POST/GET /api/cart`
> **Kỹ thuật:** Domain Testing / Equivalence Partitioning (EP). Biên `quantity` được đánh dấu để chuyển sang BVA.
> **Quy ước mã:** `TC-CART-###` (module FR-07 = `CART`).
> **Actual = dự đoán từ đọc source** (`CartContext.jsx`, `Cart.jsx`, `ProductDetail.jsx`, `server.js`). Cần **chạy lại trên UI** để xác nhận (human review).

**Đặc tả đầu vào (SRS – FR-07, kèm FR-06 cho ô số lượng):**
- Ô **Số lượng**: chỉ nhận **số nguyên dương, tối thiểu 1** (FR-06).
- Thêm **cùng một sản phẩm** vào giỏ → **tăng số lượng, không tạo dòng mới** (FR-07).
- Cột Số lượng có **nút +/-** để chỉnh.
- Nút **Xóa** phải có **dialog xác nhận** trước khi xóa.
- Tổng tiền hiển thị nhãn **"Tổng cộng"** (không phải "Tổng tạm tính").
- Giỏ trống phải có **hình minh họa** + thông báo rõ ràng.
- Có nút **Tiếp tục mua sắm**.

> **Phạm vi & biên FR-06 ↔ FR-07 (quan trọng):** Ô **nhập** Số lượng + luật "tối thiểu 1" thuộc **FR-06** (trang `/products/:id`); còn **hệ quả** của số lượng (thành tiền, tổng giỏ, dòng giỏ) và việc **chỉnh số lượng bằng +/-** thuộc **FR-07** (trang `/cart`). Vì nút +/- trong giỏ bị thiếu (BUG-B5), giá trị `quantity` chỉ nhập được ở FR-06 nhưng **kết quả sai lộ ra ở FR-07**. Do đó các TC `quantity` (TC-003→006 + BVA) được khai báo là **biên liên FR-06↔FR-07** — đi theo *dòng dữ liệu*, không gán nhầm cho FR-07.

---

## Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `quantity` | integer | Ô "Số lượng" (`ProductDetail.jsx`, `type="number"`) → `addToCart` → dòng giỏ | **Biến chính**; FR-06: nguyên ≥ 1 |
| 2 | `product` | object {id, name, price} | Chọn từ trang sản phẩm | Xác định dòng giỏ; dùng cho **luật gộp** trùng |
| 3 | `cartOp` | enum | Thao tác: add / increase(+) / decrease(−) / remove / **continueShopping** (Tiếp tục mua sắm) | Hành vi giỏ (FR-07) |

> Biến rút từ **đặc tả FR-07/FR-06**, không phải từ UI. (Thực tế UI thiếu nút +/- và không validate `quantity` — chính là các khiếm khuyết, xem BUG-B5/BUG-B1.)

> **EP xét cả Input VÀ Output (lý thuyết Week 03, B1):** ngoài các biến **đầu vào** ở bảng trên, FR-07 còn có các **đầu ra (Output)** phải phân vùng tương đương. Liệt kê ngắn các Output của feature:
> - **Trạng thái giỏ:** số dòng giỏ; `quantity` mỗi dòng; **tổng tiền** (thành tiền từng dòng + tổng cộng).
> - **Phản hồi hành vi:** có/không **dialog xác nhận** khi xóa; nhãn tổng tiền (**"Tổng cộng"** vs **"Tổng tạm tính"**); có/không **nút +/-**; trạng thái **giỏ trống** (có/không hình minh họa); kết quả thao tác add/remove/continueShopping.

---

## Bước 2 – Xác định domain của từng biến

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `quantity` | **Số nguyên ≥ 1** | FR-06: "số nguyên dương, tối thiểu 1". SRS không nêu cận trên (không có kiểm tồn kho). |
| `product` | Sản phẩm tồn tại trong hệ thống | Thêm trùng → phải gộp (FR-07). |
| `cartOp` | add / increase(+) / decrease(−) / remove / continueShopping | remove cần **dialog xác nhận**; continueShopping → **về trang chủ** `/`. |

### Miền giá trị của Output (B2 – áp cho cả Input và Output)

| Output | Miền giá trị ĐÚNG (hợp lệ) | Miền giá trị SAI (lỗi/từ chối) |
|--------|----------------------------|--------------------------------|
| Số dòng giỏ khi thêm trùng | **Gộp 1 dòng** (qty cộng dồn) | **Tạo dòng trùng** (2+ dòng cùng SP) |
| Tổng tiền | Số ≥ 0, đúng = Σ(giá×qty) | **Âm / NaN** khi qty = 0 / âm / rỗng |
| Hành vi xóa | **Có dialog xác nhận** trước khi xóa | **Xóa ngay, không hỏi** |
| Nhãn tổng tiền | **"Tổng cộng"** | **"Tổng tạm tính"** |
| Nút chỉnh số lượng | **Có nút +/-** | **Thiếu +/-** |
| Giỏ trống | **Có hình minh họa** + thông báo | **Thiếu hình** (chỉ text) |

---

## Bước 2b – Miền giá trị Output (kết quả)

Phân vùng tương đương cho **Output** (kết quả/phản hồi của FR-07): một vùng **Thành công** và các vùng **Từ chối/lỗi**. Đối chiếu trực tiếp với cột **Expected** trong bảng test case (Bước 5) để bảo đảm nhất quán.

| Vùng Output | Mã | Mô tả kết quả | TC đối chiếu (cột Expected) |
|-------------|----|---------------|------------------------------|
| **Thành công** | OUT-OK | Thêm/chỉnh đúng: gộp 1 dòng khi trùng, qty đúng, tổng tiền = Σ(giá×qty) ≥ 0, có dialog xác nhận xóa, nhãn "Tổng cộng", có +/-, giỏ trống có hình | TC-001, TC-002 (Expected = thêm OK, qty/tổng đúng) |
| **Từ chối – qty không hợp lệ** | OUT-REJ-QTY | Phải từ chối khi qty = 0 / âm / thập phân / rỗng (tránh tổng âm/NaN) | TC-003→006 (Expected = "Từ chối") |
| **Lỗi – luật gộp** | OUT-ERR-MERGE | Thêm SP trùng phải gộp 1 dòng; nếu tạo dòng trùng → lỗi | TC-007 (Expected = gộp 1 dòng, qty=2) |
| **Lỗi – thiếu xác nhận xóa** | OUT-ERR-CONFIRM | Xóa phải có dialog; xóa ngay không hỏi → lỗi | TC-008 (Expected = có dialog) |
| **Lỗi – nhãn tổng tiền** | OUT-ERR-LABEL | Nhãn phải là "Tổng cộng"; "Tổng tạm tính" → lỗi | TC-009 (Expected = "Tổng cộng") |
| **Lỗi – thiếu +/-** | OUT-ERR-STEP | Phải có nút +/- để chỉnh qty; thiếu → lỗi | TC-010 (Expected = có +/-) |
| **Lỗi – giỏ trống thiếu hình** | OUT-ERR-EMPTY | Giỏ trống phải có hình minh họa; thiếu → lỗi | TC-011 (Expected = có hình) |
| **Thành công – điều hướng** | OUT-OK-NAV | continueShopping về trang chủ `/`, nhãn "Tiếp tục mua sắm" | TC-013 (Expected = về `/`, nhãn đúng) |

---

## Bước 3 – Phân vùng tương đương (Equivalence Partitions)

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `quantity` | **EP1**: số nguyên ≥ 1 | **EP2**: = 0 · **EP3**: số âm (<0) · **EP4**: số thập phân (vd `2.5`) · **EP5**: không phải số / rỗng |
| `product` (luật gộp) | **EP6**: thêm sản phẩm **mới** (chưa có trong giỏ) | **EP7**: thêm sản phẩm **đã có** → phải gộp, không tạo dòng mới |
| `cartOp` (hành vi FR-07) | **EP8**: thao tác hợp lệ (remove / increase(+) / decrease(−) / continueShopping) | **EP9**: thao tác ngoài tập (không khả thi từ UI — ghi nhận cho phân vùng đầy đủ) |

> Các vùng `quantity` rời nhau & phủ kín mọi đầu vào ô số lượng. SRS không có cận trên → "số rất lớn" vẫn thuộc EP1 (hợp lệ) nhưng được đánh dấu cho BVA.

---

## Bước 4 – Chọn điểm đại diện (representative points)

| Vùng | Đại diện | Loại điểm |
|------|----------|-----------|
| EP1 `quantity` hợp lệ | `1` (min) ; `5` (typical) | **on** (1) / in (5) |
| EP2 `quantity` = 0 | `0` | **off** (= biên min−1) |
| EP3 `quantity` âm | `-3` | out |
| EP4 `quantity` thập phân | `2.5` | out |
| EP5 `quantity` không phải số | `""` (rỗng) ; `abc` (nếu nhập được) | out |
| EP6 sản phẩm mới | iPhone (chưa có trong giỏ) | in |
| EP7 sản phẩm trùng | thêm iPhone lần 2 | (combination) |
| EP8 `cartOp` hợp lệ | remove (xóa) · +/- (chỉnh qty) · continueShopping (về trang chủ) | mỗi thao tác 1 đại diện |

> **Chuyển cho BVA:** biên `quantity` tại **0 (off) / 1 (on) / 2 (in)** → xử lý trong skill `boundary-value-analysis` (**TC-CART-014/015**; TC-CART-013 đã dùng cho domain — nút Tiếp tục mua sắm, xem Nhóm R).

---

## Bước 5 – Thiết kế test case (single-fault: chỉ thả 1 biến sang vùng invalid)

> Giữ `product` hợp lệ (sản phẩm tồn tại), chỉ thay đổi `quantity`. Nhóm sau (combination/luật giỏ) test các hành vi FR-07.

### Nhóm Q – Biến `quantity`

| TC ID | Tiêu đề | Input (product / quantity) | Vùng phủ | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|---------|----------------------------|----------|----------------|----------------------------|--------|-----|
| TC-CART-001 | Số lượng = 1 (biên min) | iPhone / `1` | EP1 | Thêm vào giỏ, dòng có qty=1 | Thêm OK | Pass | — |
| TC-CART-002 | Số lượng hợp lệ điển hình | iPhone / `5` | EP1 | Thêm vào giỏ, qty=5, thành tiền = giá×5 | Thêm OK | Pass | — |
| TC-CART-003 | Số lượng = 0 | iPhone / `0` | EP2 | Từ chối (tối thiểu 1) | Input không có `min` → `parseInt("0")=0` → thêm qty=0 | Fail | BUG-B1 |
| TC-CART-004 | Số lượng âm | iPhone / `-3` | EP3 | Từ chối | Thêm qty=-3 → tổng tiền **âm** | Fail | BUG-B1 |
| TC-CART-005 | Số lượng thập phân | iPhone / `2.5` | EP4 | Từ chối (phải nguyên) | `parseInt("2.5")=2` → cắt thầm, thêm qty=2 | Fail | BUG-B1 |
| TC-CART-006 | Số lượng rỗng / không phải số | iPhone / `""` | EP5 | Từ chối | `parseInt("")=NaN` → thêm qty=NaN → tổng = **NaN** | Fail | BUG-B1 |

### Nhóm R – Luật giỏ hàng (combination / FR-07)

| TC ID | Tiêu đề | Thao tác | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|---------|----------|----------------|----------------------------|--------|-----|
| TC-CART-007 | Thêm cùng sản phẩm 2 lần | add iPhone (q1) rồi add iPhone (q1) | Gộp thành **1 dòng**, qty=2 | `addToCart` luôn `push` → **2 dòng** trùng | Fail | BUG-B2 |
| TC-CART-008 | Xóa sản phẩm | bấm **Xóa** | Hiện **dialog xác nhận** rồi mới xóa | Gọi `removeFromCart` trực tiếp → **xóa ngay, không hỏi** | Fail | BUG-B3 |
| TC-CART-009 | Nhãn tổng tiền *(specification-based, không từ EP)* | mở giỏ có hàng | Hiển thị **"Tổng cộng"** | Hiển thị **"Tổng tạm tính"** | Fail | BUG-B4 |
| TC-CART-010 | Chỉnh số lượng trong giỏ | tìm nút **+/-** ở cột Số lượng | Có nút +/- để tăng/giảm | Cart.jsx chỉ in `{item.quantity}` (text) — **không có +/-**; CartContext **không có** hàm update qty | Fail | BUG-B5 |
| TC-CART-011 | Giỏ hàng trống | mở `/cart` khi rỗng | Có **hình minh họa** + thông báo | Chỉ có text "Giỏ hàng trống" — **thiếu hình** | Fail | BUG-B6 |
| TC-CART-013 | Nút "Tiếp tục mua sắm" (cartOp=continueShopping, EP8) | bấm nút này ở `/cart` | Về **trang chủ** `/`, nhãn đúng **"Tiếp tục mua sắm"** | `Link to="/"` → về trang chủ **OK**; nhưng khi giỏ **có hàng** nhãn là **"← Mua tiếp"** ≠ spec (giỏ trống thì đúng) | Pass | (nhãn lệch — ứng viên BUG-B7, cosmetic) |

> **Phủ vùng `quantity`:** EP1→TC-001/002 · EP2→TC-003 · EP3→TC-004 · EP4→TC-005 · EP5→TC-006.
> **Phủ vùng `product`:** EP6 (SP mới) = mặc định của TC-001..006 · EP7 (trùng)→TC-007.
> **Phủ vùng `cartOp` (EP8):** remove→TC-008 · increase/decrease (+/-)→TC-010 · continueShopping→TC-013.
> **Specification-based (KHÔNG từ phân vùng EP):** nhãn tổng→TC-009 · giỏ trống→TC-011. FR-07 chủ yếu là **luật hành vi/hiển thị** nên các TC này sinh trực tiếp từ đặc tả, không qua phân vùng (ghi rõ để trung thực, không gán domain giả).
> **Đã loại khỏi Feature B:** TC-CART-012 (nút "Thêm vào giỏ" phải bấm 2 lần) — bug này thuộc **FR-06** (nút ở trang chi tiết sản phẩm), **ngoài phạm vi FR-07** nên không tính. (Số `TC-CART-012` để trống, không tái sử dụng.)

### Bước 5b – Rút gọn test case (B5)

**Nguyên tắc B5:** Hai test case được coi là **trùng** khi **Input VÀ Expected Output giống hệt nhau** → chỉ **giữ lại 1** (loại bớt cái còn lại). TC khác nhau ở Input *hoặc* Expected thì **không trùng**, phải giữ.

**Kết quả rà soát bộ TC hiện tại của FR-07:**

| Cặp đối chiếu | Input giống nhau? | Expected giống nhau? | Kết luận |
|---------------|-------------------|----------------------|----------|
| TC-001 (qty=1) vs TC-002 (qty=5) | Khác (1 ≠ 5) | Khác (qty/thành tiền khác) | Không trùng – giữ cả 2 |
| TC-003→006 (qty 0/âm/2.5/rỗng) | Khác nhau từng giá trị | Expected = "Từ chối" nhưng *lý do/biểu hiện khác* (0, âm, cắt thập phân, NaN) → mỗi vùng EP riêng | Không trùng – giữ tất cả (đại diện 4 vùng invalid) |
| Nhóm R (TC-007→011, 013) | Mỗi TC một thao tác/luật riêng | Expected khác nhau hoàn toàn | Không trùng – giữ tất cả |

**Kết luận:** Bộ TC được thiết kế theo **single-fault** (mỗi TC chỉ thả 1 biến sang vùng invalid, các biến khác giữ hợp lệ) nên **Input và Expected đôi một khác nhau** → **không có cặp TC trùng cần loại** theo B5. Riêng TC-003→006 tuy cùng nhãn Expected "Từ chối" nhưng thuộc **4 vùng EP khác nhau** (qty=0, âm, thập phân, rỗng) và **Input khác nhau**, nên **không phải trùng** và phải giữ đủ để phủ vùng. Không phát hiện cặp gần-trùng nào khác.

---

## Bước 6 – Giải thích từng bước (áp dụng cho FR-07)

1. **Xác định biến (Bước 1):** Biến đầu vào trọng tâm của giỏ là `quantity` (số nguyên dương). `product` đi kèm để kiểm **luật gộp trùng**. Các thao tác (+/-, xóa) là hành vi FR-07 cần kiểm.
2. **Domain (Bước 2):** `quantity` hợp lệ = nguyên ≥1 (FR-06); không có cận trên (không kiểm tồn kho — bản thân điều này là rủi ro).
3. **Phân vùng (Bước 3):** `quantity` chia 1 vùng valid + 4 vùng invalid (0, âm, thập phân, không-phải-số) để bắt mọi kiểu nhập sai của ô `type="number"` không ràng buộc.
4. **Đại diện (Bước 4):** mỗi vùng 1 giá trị; `quantity` có thứ tự nên phân in/on/off/out, đánh dấu biên 0/1/2 cho BVA.
5. **Sinh test case (Bước 5):** single-fault cho `quantity` (giữ product hợp lệ); thêm nhóm R cho các **luật nghiệp vụ FR-07** (gộp, xóa-xác nhận, nhãn, +/-, empty, 1-click) — vì FR-07 chủ yếu là luật hành vi, không chỉ giá trị.
6. **Thực thi:** chạy trên UI `/products/:id` và `/cart`, đối chiếu Expected (suy từ SRS).

**Giả định:** (a) `quantity` không có cận trên trong SRS → "số rất lớn" hợp lệ (đánh dấu cho BVA dò giới hạn ẩn/tồn kho); (b) ô số lượng tham chiếu rule FR-06 vì FR-07 hiển thị cột số lượng.

---

## Ghi chú cho AI Gap Analysis (ứng viên)

| Test case / lỗi AI dễ bỏ sót | Vì sao AI sót |
|------------------------------|----------------|
| `quantity` âm/0/thập phân/NaN (TC-003→006) | AI hay chỉ test "số dương"; quên ô `type="number"` không chặn 0/âm/thập phân/rỗng → tổng tiền âm/NaN. |
| Không gộp sản phẩm trùng (TC-007) | AI test "thêm được vào giỏ" là xong, không đối chiếu luật FR-07 "gộp, không tạo dòng mới". |
| Thiếu dialog xác nhận khi xóa (TC-008) | AI coi "xóa được" = đạt; bỏ qua yêu cầu UX "phải xác nhận". |
| Sai nhãn "Tổng tạm tính" vs "Tổng cộng" (TC-009) | Lỗi từ ngữ nhỏ, AI dễ bỏ nếu không đối chiếu đúng câu chữ SRS. |
| Thiếu nút +/- (TC-010) | AI test theo API (push item) nên không thấy UI thiếu chức năng chỉnh số lượng. |
| Nhãn nút "← Mua tiếp" ≠ "Tiếp tục mua sắm" (TC-013) | Lỗi từ ngữ nhỏ + chỉ sai khi giỏ **có hàng** (giỏ trống lại đúng) nên dễ bỏ sót; ứng viên **BUG-B7** (cosmetic, severity thấp). |

---

## Bước 7 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Chạy thật trên UI** để xác nhận cột Actual (đặc biệt TC-003→006: thử nhập 0/-3/2.5/rỗng vào ô số lượng, xem giỏ + tổng tiền).
2. **Biến đủ chưa?** Có cần test "thêm khi chưa đăng nhập", "tồn kho", "số lượng cực lớn" không?
3. **Expected có bám SRS?** Nhất là luật gộp (TC-007) và nhãn tổng tiền (TC-009).
4. **Bug:** xác nhận BUG-B1→B6 là thật (tái hiện trên UI) trước khi viết bug report + tạo issue.

> Sau khi bạn duyệt + chạy xác nhận: làm tiếp **BVA** (biên `quantity` 0/1/2), rồi **bug report** (BUG-B1→B6) theo playbook.
