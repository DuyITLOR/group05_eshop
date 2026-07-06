# Boundary Value Analysis – Feature D (D7 Mobile / FR-04: Hồ sơ cá nhân)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – App Mobile (`frontend-mobile/App.js`) → API `PUT /api/users/me`
> **Kỹ thuật:** Boundary Value Analysis (BVA) — 3-value BVA (min−1 / min / min+1, max−1 / max / max+1).
> **Quy ước mã:** Domain Testing dùng `TC-PROFILE-001…011`. BVA dùng `TC-PROFILE-012, 013` + tái dùng `TC-PROFILE-001, 002`.
> **Nguồn biên:** bảng domain ở `domain-testing.md` (Bước 2 & 4) + đặc tả FR-04 (SRS README.md:62–66).
> Actual = đối chiếu source (`App.js` regex, `server.js`) — cần xác nhận trên app/API.

**Đặc tả FR-04 (ràng buộc có thứ tự):**
- `phone`: bắt đầu `0`, **độ dài 10–11 chữ số** → `10 ≤ phone.length ≤ 11` (cận trên & dưới rõ ràng).

---

## Bước 1 – Chọn biến đủ điều kiện BVA

| Biến | Có thứ tự? | Có cận? | Đưa vào BVA? | Lý do |
|------|-----------|---------|--------------|-------|
| `phone.length` | | (min=10, **max=11**) | **Có** | SRS "10–11 chữ số" → có **cả 2 cận** rõ ràng |
| `name` | (độ dài không ràng buộc trong SRS) | | | SRS không nêu cận độ dài → giữ ở EP |
| `shipping_address` | | | | Không ràng buộc → EP |
| `email` / `role` | | | | Luật bất biến/bảo mật, không phải dải số → EP |

> **Tổng: 1 biến BVA = `phone.length`** (dải hẹp 10–11, cả 2 cận inclusive). Lưu ý: định dạng "bắt đầu `0`" là **EP** (không phải biên), xử lý ở domain-testing.

---

## Bước 2 – Xác định cận (bounds)

| Biến | Cận dưới (min) | Cận trên (max) | Inclusive? | Đơn vị |
|------|---------------|----------------|------------|--------|
| `phone.length` | **10** | **11** | Cả 2 **inclusive** (`10 ≤ len ≤ 11`) | chữ số |

> Giữ định dạng hợp lệ (bắt đầu `0`, toàn chữ số) khi test độ dài, để cô lập biến `phone.length`.

---

## Bước 3 – Sinh giá trị biên (3-value BVA)

Dải `phone.length` rất hẹp (10–11) nên 6 điểm chỉ còn **4 giá trị duy nhất**: min−1, min, max, max+1.

| Biến | min−1 | **min** | min+1 = max | **max** | max+1 |
|------|-------|---------|-------------|---------|-------|
| `phone.length` | 9 (`012345678` → reject) | **10** (`0912345678` → accept) | 11 (`09123456789` → accept) | **11** | 12 (`012345678901` → reject) |

> min+1 (11) trùng max, max−1 (10) trùng min → tập biên duy nhất = **{9, 10, 11, 12}**.

---

## Bước 4 – Thiết kế test case BVA

> Giữ `name="Test User"`, `shippingAddress` hợp lệ; chỉ đổi độ dài `phone` (đều bắt đầu `0`, toàn chữ số).

### Nhóm B1 – `phone.length` (cận 10–11, inclusive cả 2 cận)

| TC ID | Tiêu đề | Điểm biên | Input phone | Expected (SRS) | Actual (từ source) | Result | Bug |
|-------|---------|-----------|-------------|----------------|--------------------|--------|-----|
| **TC-PROFILE-012** | 9 chữ số (min−1) | **9** (off) | `012345678` | **Từ chối** (quá ngắn) | Mobile từ chối (regex cần 9-10 *nhưng đầu 0 cũng fail*) | Pass | — |
| TC-PROFILE-001 *(tái dùng)* | 10 chữ số (biên min) | **10** (on) | `0912345678` | **Chấp nhận** | Mobile regex `^[1-9]…` **từ chối** (đòi đầu 1-9) | Fail | BUG-D1 |
| TC-PROFILE-002 *(tái dùng)* | 11 chữ số (biên max) | **11** (on) | `09123456789` | **Chấp nhận** | Mobile **từ chối** (đầu 0 + dài 11 > "9-10") | Fail | BUG-D1 |
| **TC-PROFILE-013** | 12 chữ số (max+1) | **12** (off) | `012345678901` | **Từ chối** (quá dài) | Mobile từ chối | Pass | — |

---

## Tổng kết test case BVA

| Nhóm | TC IDs | Số TC | Pass | Fail |
|------|--------|-------|------|------|
| B1 `phone.length` | 012, 001†, 002†, 013 | 4 | 2 | 2 |
| **Tổng** | | **4** | **2** | **2** |

> TC mới thực sự của BVA: **TC-PROFILE-012, 013 = 2 TC mới**. `TC-001, 002` tái dùng từ domain-testing.
> † TC-001/002 (biên min/max hợp lệ theo SRS) bị mobile **từ chối sai** → đó chính là BUG-D1 lộ rõ nhất tại biên (giống cách BVA Feature A phơi bày BUG-A1 tại biên hợp lệ).

---

## Bước 5 – Giải thích cách áp dụng BVA cho FR-04

1. **Chọn biến (Bước 1):** chỉ `phone.length` có thứ tự + cận; `name`/`address` không ràng buộc độ dài, `email`/`role` là luật → giữ EP.
2. **Xác định cận (Bước 2):** `phone.length` 10–11, **cả 2 inclusive**. Giữ định dạng (đầu 0, toàn số) để cô lập độ dài.
3. **Sinh giá trị biên (Bước 3):** dải hẹp → 4 điểm {9, 10, 11, 12}.
4. **Phát hiện chính:** BVA phơi bày **BUG-D1** ngay tại **biên hợp lệ** — `phone.length=10` và `=11` (đúng SRS) đáng lẽ PASS nhưng mobile **từ chối** do regex `^[1-9][0-9]{8,9}$` (sai cả đầu số lẫn dải độ dài "9-10"). Các điểm ngoài dải (9, 12) thì cả SRS lẫn mobile đều từ chối → Pass.
5. **Inclusive:** `10` và `11` đều phải **được chấp nhận** (`≤`/`≥`). Regex mobile vô tình dùng dải **9–10** (lệch hẳn) → đây là lỗi điển hình của việc đặt cận sai.

**Giả định:** giữ định dạng "đầu 0, toàn chữ số" khi test độ dài; SRS coi `phone` bắt buộc khi cập nhật.

---

## Bước 6 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Inclusive đúng chưa?** `phone.length` 10 và 11 đều **inclusive** (accept). Regex mobile đang dùng dải **9–10** + đầu **1-9** → sai hoàn toàn so SRS.
2. **Biên nào bị bỏ sót?** Cân nhắc: SĐT có ký tự `+84` (định dạng quốc tế), khoảng trắng giữa số, số 0 ở đầu bị trim.
3. **Chạy thật trên app:** nhập `012345678` / `0912345678` / `09123456789` / `012345678901`, xem app chặn/cho qua thế nào (hiện là đối chiếu source).
4. **Đối chiếu chéo domain-testing:** điểm on/off (10/11 vs 9/12) khớp phân vùng `phone` (EP1 ↔ EP3/EP4).

> Sau khi duyệt + chạy xác nhận: viết **bug report** (BUG-D1 lộ rõ qua BVA; cùng D2/D3/D4 từ domain) rồi tạo issue.

---

## AI Gap Analysis (ứng viên)

| Điểm BVA AI dễ bỏ sót | Vì sao AI sót |
|-----------------------|----------------|
| Biên hợp lệ `10`/`11` bị từ chối sai | AI thấy "bị chặn" tưởng đúng kỳ vọng EP-invalid; BVA mới phân biệt rõ điểm **on (10/11)** lẽ ra PASS. |
| Regex dùng dải `9–10` thay vì `10–11` | AI ít so từng con số trong regex `{8,9}` với cận SRS → bỏ lọt lệch cận. |
| Đầu số `0` bị regex `[1-9]` loại | Lỗi vừa về **định dạng** (EP) vừa về **độ dài** (BVA) — cần cả 2 kỹ thuật mới thấy trọn. |
