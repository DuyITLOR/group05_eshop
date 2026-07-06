# Boundary Value Analysis – Feature B (FR-07: Giỏ hàng)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Ô Số lượng (`/products/:id`) → Giỏ hàng `/cart`
> **Kỹ thuật:** Boundary Value Analysis (BVA) — 3-value BVA (min−1 / min / min+1).
> **Quy ước mã:** Tiếp nối `TC-CART-###` (Domain Testing tới `TC-CART-013` — nút Tiếp tục mua sắm) → BVA dùng `TC-CART-014`, `TC-CART-015`.
> Actual = dự đoán từ source (`ProductDetail.jsx`, `CartContext.jsx`) — cần xác nhận trên UI.

---

## Bước 1 – Chọn biến đủ điều kiện BVA

| Biến | Có thứ tự + cận? | Đưa vào BVA? | Lý do |
|------|------------------|--------------|-------|
| `quantity` | (min=1, số nguyên) | **Có** | FR-06: "số nguyên dương, tối thiểu 1" — biên dưới = 1, là **biên số thật**. |
| `product` | | | Là lựa chọn rời rạc (id), không phải dải — đã xử lý ở EP (luật gộp). |
| `price` | (không do user nhập trong giỏ) | | Lấy từ sản phẩm, người dùng không chỉnh trực tiếp. |
| số dòng trong giỏ | | | SRS không quy định cận → không có biên để test. |

> **Kết luận:** Feature B chỉ có **1 biến BVA đúng nghĩa = `quantity`** (biên số rõ ràng tại 1). Đây là điểm khác với các ràng buộc "có/không" (thuộc EP). *Ghi nhận theo hướng dẫn: chỉ áp BVA nơi có biên thật, không ép.*

---

## Bước 2 – Xác định cận (bounds)

| Biến | Cận dưới (min) | Cận trên | Inclusive? | Đơn vị |
|------|---------------|----------|------------|--------|
| `quantity` | **1** | Không quy định (SRS không kiểm tồn kho) | Inclusive (`≥ 1`) | sản phẩm |

> SRS không có cận trên → thêm 1 TC dò **giới hạn ẩn** (số lượng cực lớn) để kiểm có chặn tồn kho không.

---

## Bước 3 – Sinh giá trị biên (3-value BVA)

| Biến | min−1 (reject) | **min** (accept) | min+1 (accept) | giá trị lớn (giới hạn ẩn) |
|------|---------------|-----------------|----------------|---------------------------|
| `quantity` | **0** | **1** | **2** | 1 000 000 |

---

## Bước 4 – Test case BVA & kết quả

> Giữ `product` hợp lệ (iPhone, giá hợp lệ), chỉ đổi `quantity`.

| TC ID | Biên | Input quantity | Expected (SRS) | Actual (dự đoán từ source) | Result | Bug |
|-------|------|----------------|----------------|----------------------------|--------|-----|
| TC-CART-003 *(tái dùng)* | 0 (min−1) | `0` | Từ chối (tối thiểu 1) | Ô không có `min` → thêm qty=0 | Fail | BUG-B1 |
| TC-CART-001 *(tái dùng)* | **1** (min, on) | `1` | **Chấp nhận** | Thêm OK (qty=1) | Pass | — |
| **TC-CART-014** | 2 (min+1) | `2` | Chấp nhận | Thêm OK (qty=2) | Pass | — |
| **TC-CART-015** | 1 000 000 (giới hạn ẩn) | `1000000` | Chấp nhận (không có max) — nhưng **nên có kiểm tồn kho** | Thêm OK, không chặn (không kiểm tồn kho) | Pass\* | (rủi ro: thiếu kiểm tồn kho) |

> \* TC-015 "Pass" theo đúng SRS (không có cận trên), nhưng phơi bày **rủi ro thiếu kiểm tồn kho** — đáng ghi nhận, không tính là bug bắt buộc vì SRS không yêu cầu.

---

## Bước 5 – Giải thích cách áp dụng BVA cho FR-07

1. **Chọn biến (Bước 1):** Chỉ `quantity` là biến *có thứ tự, có cận* → biến BVA duy nhất. `product`/`price` không phải dải số nên không áp BVA (đúng nguyên tắc "không ép BVA nơi không có biên").
2. **Xác định cận (Bước 2):** biên dưới **inclusive** = 1 (FR-06 "tối thiểu 1"). Không có cận trên.
3. **Sinh 3 giá trị biên (Bước 3):** 0 (reject) / 1 (accept — điểm quan trọng nhất) / 2 (accept), + 1 giá trị lớn dò giới hạn ẩn.
4. **Phát hiện chính:** BVA tại biên dưới phơi bày **BUG-B1** rõ ràng — `quantity=0` (min−1) lẽ ra bị từ chối nhưng được thêm vào giỏ (ô `type="number"` không đặt `min="1"`, backend/context không validate). Biên trên cho thấy **không kiểm tồn kho**.
5. **Inclusive:** cận là `≥ 1` (inclusive); nếu nhầm thành `> 1` thì qty=1 hợp lệ sẽ bị xem là invalid → sai.

**Giả định:** SRS không nêu cận trên `quantity` → coi không giới hạn; test 1 giá trị lớn để dò giới hạn ẩn/tồn kho.

---

## Bước 6 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Inclusive/exclusive đúng chưa?** Cận dưới `quantity` = 1 là **inclusive** (`≥ 1`) — đối chiếu lại SRS FR-06 ("tối thiểu 1"). Nếu nhầm thành `> 1` thì qty=1 hợp lệ bị xem là invalid → sai cả bộ.
2. **Có biên nào bị bỏ sót?** Cân nhắc: giới hạn **tồn kho** (max ẩn), giới hạn **kiểu số** (max int / tràn số), giá trị **rỗng/`NaN`** (đã đẩy sang EP ở domain-testing).
3. **Chạy thật trên UI:** nhập `0 / 1 / 2 / 1000000` vào ô Số lượng `/products/:id`, xem giỏ `/cart` để xác nhận cột Actual (hiện là dự đoán từ source).
4. **Đối chiếu chéo domain-testing:** điểm off/on/in (0/1/2) phải khớp phân vùng `quantity` (EP2/EP1) bên domain-testing — tránh lệch on/off point.

---

## AI Gap Analysis (ứng viên)

| Điểm BVA AI dễ bỏ sót | Vì sao AI sót |
|-----------------------|----------------|
| Biên `quantity=0` (min−1) bị thêm vào giỏ | AI hay test "số dương hợp lệ", quên kiểm mép 0 nơi ô số không ràng buộc `min`. |
| Không kiểm tồn kho khi qty cực lớn (TC-014) | AI không nghĩ tới giới hạn trên ẩn khi SRS không nêu max. |
| Chỉ `quantity` là BVA thật | Tránh lạm dụng BVA cho `product`/`price` (không phải dải) — đúng nguyên tắc. |
