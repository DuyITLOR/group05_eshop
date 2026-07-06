# BVA-FR04 — Boundary Value Analysis: Personal profile management

**Feature:** FR-04 — Personal profile management · **Module:** `PROFILE`
**Kỹ thuật:** ISTQB FL §4.2.2 Boundary Value Analysis — chiến lược **3-value**. Chỉ áp dụng cho biến có thứ tự.
**File liên quan:** [EP-FR04.md](EP-FR04.md) · [bug-report_PROFILE.md](../bug-reports/bug-report_PROFILE.md)

## 1. Các bước áp dụng (step-by-step)

**Bước 0 — Tái dùng EC:** tái dùng bảng Equivalence Classes từ [EP-FR04.md](EP-FR04.md) §2 (17 lớp). Biên xác định từ cùng regex đã phân tích.

**Bước 1 — Biến áp dụng được BVA (có thứ tự):**

| Biến               | Áp dụng BVA? | Lý do                                                                |
| ------------------ | ------------ | -------------------------------------------------------------------- |
| `độ dài phone`     | ✅ Có        | Biến số có thứ tự, biên dưới và trên xác định rõ qua regex           |
| `name` (nội dung)  | ❌ Không     | Text tự do, không có thứ tự                                          |
| `shipping_address` | ❌ Không     | Text tự do, không có thứ tự                                          |
| `role`             | ❌ Không     | Biến danh mục (categorical)                                          |
| JWT `token`        | ❌ Không     | Biến xác thực nhị phân                                               |

**Bước 2 — Biên của `độ dài phone`:** nguồn regex `^[1-9][0-9]{8,9}$` (Profile.jsx:43, App.js:287). `[1-9]`=1 ký tự đầu; `[0-9]{8,9}`=8–9 ký tự → tổng 9–10 ký tự.
- **Biên dưới: `min = 9` (đóng, `≥ 9`).**
- **Biên trên: `max = 10` (đóng, `≤ 10`).**
- **Oracle:** server (server.js:118-135) không validate độ dài → Postman cho thấy server chấp nhận mọi độ dài → lộ bug thiếu server-side validation.

**Bước 3 — Chiến lược 3-value:** kiểm `{min-1, min, min+1}` và `{max-1, max, max+1}`. Miền `[9,10]` chỉ rộng 2 đơn vị: `min+1 = max = 10`, `max-1 = min = 9` → 6 điểm lý thuyết hợp nhất còn **4 điểm test (8, 9, 10, 11) → 4 TC**.

**Bước 8 — Nghi vấn bug:**
- **Thiếu server-side validation độ dài phone:** TC-PROFILE-101 (8 số) & TC-PROFILE-104 (11 số) kỳ vọng 400; thực tế 200, lưu phone không hợp lệ (mở rộng BUG-A-03).
- **Regex không nhận số 0-đầu:** số 10 chữ số bắt đầu `0` là số VN hợp lệ nhưng regex từ chối (BUG-A-05), lỗi thiết kế regex, không phải off-by-one.

## 2. Bảng giá trị biên

| Biến           | Biên (đóng/mở)   | Điểm BVA | Độ dài | Giá trị ví dụ | Kỳ vọng đúng (client)     | Kỳ vọng thực tế (server via Postman) |
| -------------- | ---------------- | -------- | ------ | ------------- | ------------------------- | ------------------------------------ |
| `độ dài phone` | dưới, đóng (≥9)  | min-1    | 8 số   | `91234567`    | Invalid (quá ngắn)        | **Bug: 200 OK (lưu phone 8 số)**     |
| `độ dài phone` | dưới, đóng (≥9)  | min      | 9 số   | `912345678`   | Valid                     | 200 OK ✓                             |
| `độ dài phone` | dưới, đóng (≥9)  | min+1    | 10 số  | `9123456789`  | Valid                     | 200 OK ✓                             |
| `độ dài phone` | trên, đóng (≤10) | max-1    | 9 số   | `912345678`   | Valid _(= min, gộp TC)_   | 200 OK ✓ _(= min)_                   |
| `độ dài phone` | trên, đóng (≤10) | max      | 10 số  | `9123456789`  | Valid _(= min+1, gộp TC)_ | 200 OK ✓ _(= min+1)_                 |
| `độ dài phone` | trên, đóng (≤10) | max+1    | 11 số  | `91234567890` | Invalid (quá dài)         | **Bug: 200 OK (lưu phone 11 số)**    |

> Miền `[9,10]` rộng 2 đơn vị → `max-1=min=9`, `max=min+1=10` → gộp còn 4 TC.

## 3. Test cases — BVA

| TC ID          | Mô tả                                          | Điểm biên phủ              | Test data (Body JSON)                                                             | Expected result                                                              | Status |
| -------------- | ---------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------ |
| TC-PROFILE-101 | Phone 8 số (min-1), server không được lưu      | min-1 (8 số)               | `{"name":"Nguyen Van A","phone":"91234567","shipping_address":"123 Le Loi"}`      | Web: alert. Server: kỳ vọng 400; thực tế (BUG-A-03) 200, lưu phone 8 số       | Fail   |
| TC-PROFILE-102 | Phone 9 số (min = max-1), server phải chấp nhận | min (9 số), max-1 (9 số)   | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi"}`     | 200 `{"message":"Profile updated"}`; GET /me trả `phone:"912345678"`          | Pass   |
| TC-PROFILE-103 | Phone 10 số (min+1 = max), server phải chấp nhận | min+1 (10 số), max (10 số) | `{"name":"Nguyen Van A","phone":"9123456789","shipping_address":"123 Le Loi"}`    | 200; GET /me trả `phone:"9123456789"`, biên trên hợp lệ                       | Pass   |
| TC-PROFILE-104 | Phone 11 số (max+1), server không được lưu     | max+1 (11 số)              | `{"name":"Nguyen Van A","phone":"91234567890","shipping_address":"123 Le Loi"}`   | Web: alert. Server: kỳ vọng 400; thực tế (BUG-A-03) 200, lưu phone 11 số      | Fail   |

## 4. Truy vết coverage (Biên ↔ TC)

| Điểm biên | Độ dài | Phủ bởi TC     | Ghi chú                                                    |
| --------- | ------ | -------------- | ---------------------------------------------------------- |
| min-1     | 8 số   | TC-PROFILE-101 | Invalid, dưới biên dưới                                    |
| min       | 9 số   | TC-PROFILE-102 | Valid, tại biên dưới                                       |
| min+1     | 10 số  | TC-PROFILE-103 | Valid, trên biên dưới 1 bước                               |
| max-1     | 9 số   | TC-PROFILE-102 | = min → cùng TC-PROFILE-102                                |
| max       | 10 số  | TC-PROFILE-103 | = min+1 → cùng TC-PROFILE-103                              |
| max+1     | 11 số  | TC-PROFILE-104 | Invalid, trên biên trên                                    |
