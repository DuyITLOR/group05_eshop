# STEP 7 — Test Execution: FR-07 Mobile Shopping Cart (feature_D) (v1)

---

## 1. Execution Environment

| Item                 | Detail                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **SUT**              | `group05_eshop/frontend-mobile/App.js` (React Native / Expo)                                      |
| **Backend**          | `group05_eshop/backend/server.js` — `http://localhost:3000`                                       |
| **Test Script**      | `submission/report/feature_D/test-cart.mjs`                                                       |
| **Approach**         | Extract pure JS logic từ App.js, chạy qua Node.js (ESM). UI checks dựa trên static code analysis. |
| **Products fetched** | 5 sản phẩm từ `GET /api/products` (backend đang chạy)                                             |
| **Date**             | 2026-06-27                                                                                        |

---

## 2. Execution Results — Domain Test Cases (23 TC)

### A1. quantity — Product Detail (DT-D-001 → DT-D-009)

| TC ID    | Description                    | Expected         | Actual  | Status  |
| -------- | ------------------------------ | ---------------- | ------- | ------- |
| DT-D-001 | qty='3' — số dương bình thường | qty=3, alert     | qty=3   | ✅ PASS |
| DT-D-002 | qty='1' — biên dưới            | qty=1            | qty=1   | ✅ PASS |
| DT-D-003 | qty='999' — số lớn             | qty=999          | qty=999 | ✅ PASS |
| DT-D-004 | Default qty=1 từ product card  | qty=1            | qty=1   | ✅ PASS |
| DT-D-005 | qty='' — fallback 1            | qty=1 (fallback) | qty=1   | ✅ PASS |
| DT-D-006 | qty='0' — fallback 1           | qty=1 (fallback) | qty=1   | ✅ PASS |
| DT-D-007 | qty='-5' — fallback 1          | qty=1 (fallback) | qty=1   | ✅ PASS |
| DT-D-008 | qty='abc' — fallback 1         | qty=1 (fallback) | qty=1   | ✅ PASS |
| DT-D-009 | qty='2.7' — parseInt→2         | qty=2            | qty=2   | ✅ PASS |

### A2. quantity — Cart Inline Edit (DT-D-010, DT-D-013 → DT-D-016)

| TC ID    | Description            | Expected         | Actual                                | Status  |
| -------- | ---------------------- | ---------------- | ------------------------------------- | ------- |
| DT-D-010 | qty='2' → expected 2   | qty=2            | qty=**3** (BUG: parsed+1)             | ❌ FAIL |
| DT-D-013 | qty='' — fallback 1    | qty=1 (fallback) | qty=1                                 | ✅ PASS |
| DT-D-014 | qty='0' → remove item  | item removed     | qty=**1** (CODE: fallback, không xóa) | ❌ FAIL |
| DT-D-015 | qty='-3' — fallback 1  | qty=1 (fallback) | qty=1                                 | ✅ PASS |
| DT-D-016 | qty='xyz' — fallback 1 | qty=1 (fallback) | qty=1                                 | ✅ PASS |

### A3. product — addToCart (DT-D-017 → DT-D-019)

| TC ID    | Description                                   | Expected           | Actual             | Status  |
| -------- | --------------------------------------------- | ------------------ | ------------------ | ------- |
| DT-D-017 | Sản phẩm mới → thêm dòng mới                  | length=1, id match | length=1, id match | ✅ PASS |
| DT-D-018 | Sản phẩm đã có → tăng qty, không tạo dòng mới | length=1, qty=5    | length=1, qty=5    | ✅ PASS |
| DT-D-019 | 3 sản phẩm khác nhau → 3 dòng                 | length=3           | length=3           | ✅ PASS |

### A4. Behavioral — Cart State (DT-D-020 → DT-D-025)

| TC ID    | Description                         | Expected                     | Actual                                        | Status  |
| -------- | ----------------------------------- | ---------------------------- | --------------------------------------------- | ------- |
| DT-D-020 | Cart có items — hiển thị đủ fields  | 2 items với price+qty        | 2 items, price✅, qty✅                       | ✅ PASS |
| DT-D-021 | Empty state — hình minh họa + text  | Image + text (SPEC FR-07)    | Không có `<Image>` (App.js:594-599)           | ❌ FAIL |
| DT-D-022 | Tổng tiền A×2 + B×3 = 350.000đ      | total=350000                 | total=350000                                  | ✅ PASS |
| DT-D-023 | Xóa item — confirm dialog trước     | Dialog xác nhận (SPEC FR-07) | Xóa trực tiếp, không dialog (App.js:630)      | ❌ FAIL |
| DT-D-024 | Xóa item cuối — confirm + cart rỗng | Dialog + cart=[]             | Cart rỗng ✅, không có dialog ❌              | ❌ FAIL |
| DT-D-025 | UI: nút +/- chỉnh qty               | Nút + và − (SPEC FR-07)      | TextInput keyboardType='numeric' (App.js:611) | ❌ FAIL |

---

## 3. Execution Results — BVA Test Cases (14 TC)

### B1. quantity — Product Detail BVA (BVA-D-001 → BVA-D-007)

| TC ID     | Boundary     | Input    | Expected         | Actual   | Status  |
| --------- | ------------ | -------- | ---------------- | -------- | ------- |
| BVA-D-001 | Min-1 (0)    | `"0"`    | qty=1 (fallback) | qty=1    | ✅ PASS |
| BVA-D-002 | Min (1)      | `"1"`    | qty=1            | qty=1    | ✅ PASS |
| BVA-D-003 | Min+1 (2)    | `"2"`    | qty=2            | qty=2    | ✅ PASS |
| BVA-D-004 | Nominal (5)  | `"5"`    | qty=5            | qty=5    | ✅ PASS |
| BVA-D-005 | Max-1 (998)  | `"998"`  | qty=998          | qty=998  | ✅ PASS |
| BVA-D-006 | Max (999)    | `"999"`  | qty=999          | qty=999  | ✅ PASS |
| BVA-D-007 | Max+1 (1000) | `"1000"` | qty=1000         | qty=1000 | ✅ PASS |

### B2. quantity — Cart Inline Edit BVA (BVA-D-008 → BVA-D-014)

| TC ID     | Boundary     | Input    | Expected     | Actual                          | Status  |
| --------- | ------------ | -------- | ------------ | ------------------------------- | ------- |
| BVA-D-008 | Min-1 (0)    | `"0"`    | item removed | qty=**1** (fallback, không xóa) | ❌ FAIL |
| BVA-D-009 | Min (1)      | `"1"`    | qty=1        | qty=**2** (BUG: parsed+1)       | ❌ FAIL |
| BVA-D-010 | Min+1 (2)    | `"2"`    | qty=2        | qty=**3** (BUG: parsed+1)       | ❌ FAIL |
| BVA-D-011 | Nominal (5)  | `"5"`    | qty=5        | qty=**6** (BUG: parsed+1)       | ❌ FAIL |
| BVA-D-012 | Max-1 (998)  | `"998"`  | qty=998      | qty=**999** (BUG: parsed+1)     | ❌ FAIL |
| BVA-D-013 | Max (999)    | `"999"`  | qty=999      | qty=**1000** (BUG: parsed+1)    | ❌ FAIL |
| BVA-D-014 | Max+1 (1000) | `"1000"` | qty=1000     | qty=**1001** (BUG: parsed+1)    | ❌ FAIL |

---

## 4. Summary

| Category   | Total  | Pass   | Fail   | Pass Rate |
| ---------- | ------ | ------ | ------ | --------- |
| Domain TCs | 23     | 17     | 6      | 73.9%     |
| BVA TCs    | 14     | 7      | 7      | 50.0%     |
| **Total**  | **37** | **24** | **13** | **64.9%** |

---

## 5. Observations

### OBS-D-01: Off-by-one trong Cart Inline Edit — ảnh hưởng toàn bộ BVA

- **Scope:** DT-D-010, BVA-D-009 → BVA-D-014 (7 TCs)
- **Root cause:** App.js:620 — `parsed + 1` thay vì `parsed`
- **Impact:** Mọi lần user chỉnh quantity trong cart đều bị sai +1. Tổng tiền tính sai theo.

### OBS-D-02: qty=0 trong Cart Inline Edit không xóa item

- **Scope:** DT-D-014, BVA-D-008 (2 TCs)
- **Root cause:** CODE dùng fallback 1 khi parsed ≤ 0, không implement business rule "qty=0 → remove"
- **Impact:** User không thể xóa item bằng cách nhập 0

### OBS-D-03: Không có confirm dialog khi xóa

- **Scope:** DT-D-023, DT-D-024 (2 TCs)
- **Root cause:** App.js:630 — `onPress={() => removeFromCart(index)}` không có Alert.alert confirm
- **Impact:** Vi phạm SPEC FR-07 — user có thể xóa nhầm item

### OBS-D-04: UI không đúng SPEC — 2 mismatch

- **Scope:** DT-D-025 (nút +/-), DT-D-021 (empty state) — 2 TCs
- **Root cause:** Implementation chọn TextInput thay nút +/-, không có `<Image>` trong empty state
- **Impact:** Vi phạm FR-07 requirements về UI

### OBS-D-05: normalizeQuantity hoạt động đúng — không bug

- **Scope:** DT-D-001 → DT-D-009, BVA-D-001 → BVA-D-007 (16 TCs — tất cả PASS)
- **Note:** `normalizeQuantity()` xử lý đúng mọi edge case. Bug chỉ nằm ở `inlineEditQuantity` (App.js:620).
