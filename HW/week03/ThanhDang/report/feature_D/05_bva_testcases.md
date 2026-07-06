# STEP 5 — BVA Test Cases: FR-07 Mobile Shopping Cart (feature_D)

---

**Defaults:**
- App: React Native mobile app đang chạy (Expo)
- DB: Seed data — có ít nhất 1 sản phẩm hợp lệ để thêm vào giỏ
- Precondition: App đang ở màn hình product detail hoặc cart view

---

### Field 1: `quantity` (Product Detail — Add to Cart) — 7 TC

> Min = 1 (normalizeQuantity: parseInt > 0 → dùng). Max đại diện = 999.

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-D-001 | Min-1 (0) | Nhập `"0"` → bấm "Thêm vào giỏ hàng" | quantity fallback = 1. Alert "Đã thêm vào giỏ hàng" với qty=1. Không hiển thị lỗi. |
| BVA-D-002 | Min (1) | Nhập `"1"` → bấm "Thêm vào giỏ hàng" | quantity = 1. Alert thành công. Cart có item với qty=1. |
| BVA-D-003 | Min+1 (2) | Nhập `"2"` → bấm "Thêm vào giỏ hàng" | quantity = 2. Alert thành công. Cart có item với qty=2. |
| BVA-D-004 | Nominal (5) | Nhập `"5"` → bấm "Thêm vào giỏ hàng" | quantity = 5. Alert thành công. Cart có item với qty=5. |
| BVA-D-005 | Max-1 (998) | Nhập `"998"` → bấm "Thêm vào giỏ hàng" | quantity = 998. Alert thành công. Tổng tiền hiển thị đúng. |
| BVA-D-006 | Max (999) | Nhập `"999"` → bấm "Thêm vào giỏ hàng" | quantity = 999. Alert thành công. Tổng tiền hiển thị đúng. |
| BVA-D-007 | Max+1 (1000) | Nhập `"1000"` → bấm "Thêm vào giỏ hàng" | quantity = 1000. Alert thành công. Không xảy ra lỗi UI overflow. |

---

### Field 2: `quantity` (Cart Inline Edit) — 7 TC

> Min = 1 (parseInt > 0). Min-1 = 0 → xóa item (SPEC đề xuất). Max đại diện = 999.

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-D-008 | Min-1 (0) | Trong cart, đổi ô quantity thành `"0"` | Item bị xóa khỏi giỏ hàng. Cart giảm 1 dòng. |
| BVA-D-009 | Min (1) | Đổi ô quantity thành `"1"` | quantity trong cart = 1. Tổng tiền cập nhật tương ứng. |
| BVA-D-010 | Min+1 (2) | Đổi ô quantity thành `"2"` | quantity trong cart = 2. Tổng tiền cập nhật tương ứng. |
| BVA-D-011 | Nominal (5) | Đổi ô quantity thành `"5"` | quantity trong cart = 5. Tổng tiền cập nhật tương ứng. |
| BVA-D-012 | Max-1 (998) | Đổi ô quantity thành `"998"` | quantity trong cart = 998. Tổng tiền hiển thị đúng. |
| BVA-D-013 | Max (999) | Đổi ô quantity thành `"999"` | quantity trong cart = 999. Tổng tiền hiển thị đúng. |
| BVA-D-014 | Max+1 (1000) | Đổi ô quantity thành `"1000"` | quantity trong cart = 1000. Không xảy ra lỗi UI overflow. |

---

## Summary

| Field | Count | TC Range |
| --- | --- | --- |
| quantity (Product Detail) | 7 | BVA-D-001 → BVA-D-007 |
| quantity (Cart Inline Edit) | 7 | BVA-D-008 → BVA-D-014 |
| **Total** | **14** | |
