# BVA-D3 — Boundary Value Analysis: Mobile – Registration (độ dài password)

**Feature:** D3 — Mobile Registration · **Module:** `MOB_REG`
**Kỹ thuật:** ISTQB FL §4.2.2 Boundary Value Analysis — chiến lược **3-value**. Chỉ áp dụng cho biến có thứ tự.
**File liên quan:** [EP-D3.md](EP-D3.md) · [bug-report_MOB_REG.md](../bug-reports/bug-report_MOB_REG.md)

## 1. Các bước áp dụng (step-by-step)

**Bước 0 — Tái dùng EC:** từ [EP-D3.md](EP-D3.md) §2 (10 lớp). Biên xác định từ regex đã phân tích.

**Bước 1 — Biến áp dụng được BVA:**

| Biến               | Áp dụng BVA? | Lý do                                                                 |
| ------------------ | ------------ | --------------------------------------------------------------------- |
| `độ dài password`  | ✅ Có        | Biến số có thứ tự, biên dưới đóng tại 8 xác định rõ qua regex         |
| `name` (nội dung)  | ❌ Không     | Text tự do, không có thứ tự                                          |
| `email` (nội dung) | ❌ Không     | Text theo định dạng; không có độ dài min/max được định nghĩa         |

**Bước 2 — Biên của `độ dài password`:** nguồn regex `.{8,}` (App.js:212).
- **Biên dưới: `min = 8` (đóng, `≥ 8`).**
- **Không có biên trên** được định nghĩa → chỉ test quanh biên dưới.
- **Oracle:** server (server.js:20-30) không validate độ dài → API trực tiếp cho thấy server chấp nhận mọi độ dài → lộ BUG-D-01.

**Bước 3 — Chiến lược 3-value:** kiểm `{min-1, min, min+1}` để bắt off-by-one. Chỉ 1 biên → 3 điểm test → 3 TC.

**Bước 8 — Nghi vấn bug:**
- **BUG-D-01 mở rộng:** TC-MOB_REG-101 (7 ký tự) kỳ vọng server 400; thực tế 200, INSERT password ngắn vì server không validate.

## 2. Bảng giá trị biên

| Biến              | Biên (đóng/mở)  | Điểm BVA | Độ dài  | Giá trị ví dụ | Kỳ vọng đúng (mobile client) | Kỳ vọng thực tế (API trực tiếp) |
| ----------------- | --------------- | -------- | ------- | ------------- | ---------------------------- | ------------------------------- |
| `độ dài password` | dưới, đóng (≥8) | min-1    | 7 ký tự | `Aa1@bcd`     | Invalid (báo lỗi, không gửi) | BUG-D-01: 200, INSERT 7 ký tự   |
| `độ dài password` | dưới, đóng (≥8) | min      | 8 ký tự | `Aa1@bcde`    | Valid                        | 200 OK ✓                        |
| `độ dài password` | dưới, đóng (≥8) | min+1    | 9 ký tự | `Aa1@bcdef`   | Valid                        | 200 OK ✓                        |

## 3. Test cases — BVA

| TC ID          | Mô tả                                                          | Điểm biên phủ   | Test data (Body JSON)                                                      | Expected result                                                                          | Status |
| -------------- | -------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| TC-MOB_REG-101 | password 7 ký tự (min-1), server không được chấp nhận         | min-1 (7 ký tự) | `{"name":"Nguyen Van A","email":"bva1@domain.com","password":"Aa1@bcd"}`   | Mobile: "Mật khẩu quá yếu!". Server: kỳ vọng 400; thực tế (BUG-D-01): 200, INSERT 7 ký tự | Fail   |
| TC-MOB_REG-102 | password 8 ký tự (min), cả mobile & server chấp nhận          | min (8 ký tự)   | `{"name":"Nguyen Van A","email":"bva2@domain.com","password":"Aa1@bcde"}`  | 200 `{"message":"User registered successfully","id":<n>}`                                 | Pass   |
| TC-MOB_REG-103 | password 9 ký tự (min+1), cả mobile & server chấp nhận        | min+1 (9 ký tự) | `{"name":"Nguyen Van A","email":"bva3@domain.com","password":"Aa1@bcdef"}` | 200 `{"message":"User registered successfully","id":<n>}`                                 | Pass   |

## 4. Truy vết coverage (Biên ↔ TC)

| Điểm biên | Độ dài  | Phủ bởi TC     | Ghi chú                      |
| --------- | ------- | -------------- | ---------------------------- |
| min-1     | 7 ký tự | TC-MOB_REG-101 | Invalid, dưới biên dưới      |
| min       | 8 ký tự | TC-MOB_REG-102 | Valid, tại biên dưới         |
| min+1     | 9 ký tự | TC-MOB_REG-103 | Valid, trên biên dưới 1 bước |
