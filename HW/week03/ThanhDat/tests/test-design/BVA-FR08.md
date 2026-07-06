# BVA-FR08 — Boundary Value Analysis: Checkout (ngưỡng coupon)

**Feature:** FR-08 — Checkout · **Module:** `CHECKOUT`
**Kỹ thuật:** ISTQB FL §4.2.2 Boundary Value Analysis — chiến lược **3-value**.
**File liên quan:** [EP-FR08.md](EP-FR08.md) · [bug-report_CHECKOUT.md](../bug-reports/bug-report_CHECKOUT.md)

## 1. Các bước áp dụng (step-by-step)

**Bước 0 — Tái dùng EC:** từ [EP-FR08.md](EP-FR08.md) §2. Biên xác định từ `min_order_amount` của SAVE10.

**Bước 1 — Biến áp dụng được BVA:**

| Biến                      | Áp dụng BVA? | Lý do                                                                |
| ------------------------- | ------------ | -------------------------------------------------------------------- |
| `total_amount` (coupon)   | ✅ Có        | Biến số có thứ tự, biên qua `min_order_amount = 300000`              |
| `total_amount` (checkout) | ⚠️ Giới hạn  | Không có biên định nghĩa ở server; đã phủ bởi EC (EC-TOTAL-2…5)      |
| `shipping_address`        | ❌ Không     | Text tự do                                                          |
| `code`                    | ❌ Không     | Biến danh mục                                                       |
| JWT `token`               | ❌ Không     | Biến xác thực nhị phân                                              |

**Bước 2 — Biên của `total_amount` trong apply-coupon:** nguồn server.js:379 `if (total_amount > coupon.min_order_amount)`. SAVE10 `min_order_amount = 300000`.
- **Biên: `min = 300000` (spec là `≥ 300000`; code dùng `>` → off-by-one).**
- Hệ quả: đơn đúng 300000 → theo spec được áp mã, nhưng code từ chối.

**Bước 3 — Chiến lược 3-value:** `{min-1=299999, min=300000, min+1=300001}`, giữ `code=SAVE10` cố định để cô lập biến.

**Bước 8 — Nghi vấn bug:**
- **BUG-B-01 (off-by-one):** TC-CHECKOUT-102 (total=300000) kỳ vọng 200; thực tế 400 vì `300000 > 300000` = false.
- **BUG-B-02 (percent formula):** TC-CHECKOUT-103 (total=300001) pass min nhưng `Math.floor(300001*(1-10)) = -2700009` → `final = 3000010` > tổng gốc.

## 2. Bảng giá trị biên

| Biến           | Biên (đóng/mở)       | Điểm BVA | Giá trị | Kỳ vọng đúng (spec `≥`) | Kỳ vọng thực tế (code dùng `>`)            |
| -------------- | -------------------- | -------- | ------- | ----------------------- | ------------------------------------------ |
| `total_amount` | min, đóng (≥ 300000) | min-1    | 299999  | Từ chối mã              | Từ chối mã ✓                               |
| `total_amount` | min, đóng (≥ 300000) | min      | 300000  | **Chấp nhận mã**        | Bug: Từ chối (`300000 > 300000` = false)   |
| `total_amount` | min, đóng (≥ 300000) | min+1    | 300001  | Chấp nhận mã            | Chấp nhận ✓ (nhưng discount sai, BUG-B-02) |

## 3. Test cases — BVA

| TC ID           | Mô tả                                                          | Điểm biên phủ | Test data (Body JSON)                     | Expected result                                                                                   | Status |
| --------------- | -------------------------------------------------------------- | ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- | ------ |
| TC-CHECKOUT-101 | total=299999 (min-1), dưới ngưỡng, từ chối đúng                | min-1         | `{"code":"SAVE10","total_amount":299999}` | 400 "Đơn hàng chưa đủ giá trị tối thiểu 300.000 ₫"                                                | PASS   |
| TC-CHECKOUT-102 | total=300000 (min), spec chấp nhận nhưng code từ chối → BUG-B-01 | min           | `{"code":"SAVE10","total_amount":300000}` | Kỳ vọng 200 applied. Thực tế (BUG-B-01): 400 vì `300000 > 300000` = false                          | FAIL   |
| TC-CHECKOUT-103 | total=300001 (min+1), chấp nhận nhưng discount sai → BUG-B-02   | min+1         | `{"code":"SAVE10","total_amount":300001}` | Kỳ vọng discount=30000, final=270001. Thực tế (BUG-B-02): discount=-2700009, final=3000010         | FAIL   |

## 4. Truy vết coverage (Biên ↔ TC)

| Điểm biên | Giá trị | Phủ bởi TC      | Ghi chú                                    |
| --------- | ------- | --------------- | ------------------------------------------ |
| min-1     | 299999  | TC-CHECKOUT-101 | Invalid, dưới ngưỡng, từ chối đúng         |
| min       | 300000  | TC-CHECKOUT-102 | Ranh giới, BUG-B-01: bị từ chối sai        |
| min+1     | 300001  | TC-CHECKOUT-103 | Valid, chấp nhận; BUG-B-02 lộ discount sai |
