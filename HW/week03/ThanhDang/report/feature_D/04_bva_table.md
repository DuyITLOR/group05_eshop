# STEP 4 — BVA Table: FR-07 Mobile Shopping Cart (feature_D) (v1)

> **Nguyên tắc:** BVA chỉ áp dụng cho ordered domains (numeric). Categorical values (chuỗi rỗng, ký tự không phải số, object structure, UI label) KHÔNG phải BVA → đã cover ở Domain Testing (Step 3).

---

## BVA Boundaries

### Field 1: `quantity` (Product Detail — Add to Cart)

> **Boundary source:** `normalizeQuantity()` tại App.js:129–132 — `parseInt(value, 10)`: nếu > 0 → dùng; else → 1.
> Min = 1 (giá trị dương nhỏ nhất được chấp nhận). Max = không định nghĩa trong SPEC/CODE — chọn `999` làm Max đại diện.

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | `0` | Fallback quantity = 1. Không hiển thị lỗi. | Dưới ngưỡng — normalizeQuantity reject → fallback 1 |
| 2 | Min | `1` | quantity = 1. Alert "Đã thêm vào giỏ hàng". | Biên dưới hợp lệ nhỏ nhất |
| 3 | Min+1 | `2` | quantity = 2. Alert thành công. | Trên biên dưới — hoạt động bình thường |
| 4 | Nominal | `5` | quantity = 5. Alert thành công. | Giá trị thông thường giữa domain |
| 5 | Max-1 | `998` | quantity = 998. Alert thành công. | Dưới biên đại diện |
| 6 | Max | `999` | quantity = 999. Alert thành công. | Biên trên đại diện |
| 7 | Max+1 | `1000` | quantity = 1000 hoặc lỗi UI overflow. | Trên biên đại diện — kiểm tra giới hạn thực tế |

> **Lưu ý:** SPEC và CODE không định nghĩa upper bound cho quantity. Giá trị Max=999 được chọn làm representative value cho stress testing, không phải BVA Max boundary chuẩn. Các BVA point 998/999/1000 nên được phân loại là Robustness/Stress tests. BVA chuẩn chỉ áp dụng cho lower boundary: Min-1=0, Min=1, Min+1=2.

---

### Field 2: `quantity` (Cart Inline Edit)

> **Boundary source:** `onChangeText` tại App.js:617–621 — `parseInt(text, 10)`: nếu > 0 → **parsed + 1** (BUG); else → 1.
> Min = 1 (biên dưới hợp lệ). Min-1 = 0 → theo SPEC đề xuất: xóa item khỏi giỏ. Max = không định nghĩa — chọn `999` làm Max đại diện.

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | `0` | Item bị xóa khỏi giỏ hàng (SPEC đề xuất). | Biên đặc biệt — quantity = 0 đồng nghĩa không mua |
| 2 | Min | `1` | quantity trong cart = 1. Tổng tiền cập nhật. | Biên dưới hợp lệ nhỏ nhất |
| 3 | Min+1 | `2` | quantity trong cart = 2. Tổng tiền cập nhật. | Trên biên dưới |
| 4 | Nominal | `5` | quantity trong cart = 5. Tổng tiền cập nhật. | Giá trị thông thường |
| 5 | Max-1 | `998` | quantity trong cart = 998. Tổng tiền cập nhật. | Dưới biên đại diện |
| 6 | Max | `999` | quantity trong cart = 999. Tổng tiền cập nhật. | Biên trên đại diện |
| 7 | Max+1 | `1000` | quantity = 1000 hoặc lỗi UI overflow. | Trên biên đại diện |

> **Lưu ý off-by-one BUG:** Với mọi giá trị > 0, CODE thực thi `parsed + 1`. Actual result sẽ luôn = input + 1. BVA vẫn dùng SPEC-based expected (không bù trừ bug vào expected).

---

## Summary

| Field | BVA Points | Boundary Type |
| --- | --- | --- |
| quantity (Product Detail) | 7 | Code boundary (min=1), Max đại diện = 999 |
| quantity (Cart Inline Edit) | 7 | Code boundary (min=1, min-1=0→remove), Max đại diện = 999 |
| **Total BVA points** | **14** | |
