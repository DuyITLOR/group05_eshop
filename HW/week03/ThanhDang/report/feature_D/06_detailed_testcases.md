# STEP 6 — Detailed Test Cases: FR-07 Mobile Shopping Cart (feature_D) (v1)

> **Source:** 03_domain_testcases_v1.md (23 TCs) + 05_bva_testcases.md (14 TCs)
> **Defaults:** App React Native đang chạy (Expo), DB seed có sản phẩm hợp lệ.

---

## A. Domain Test Cases (23 TC)

### A1. quantity — Product Detail, Add to Cart (DT-D-001 → DT-D-009)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-D-001 | Thêm vào giỏ với quantity số dương bình thường | Product detail đang mở | 1. Nhập `"3"` vào TextInput quantity 2. Bấm "Thêm vào giỏ hàng" | quantity = `"3"` | Alert "Đã thêm vào giỏ hàng". Cart có item với qty=3. | | |
| DT-D-002 | Thêm vào giỏ với quantity = 1 (biên dưới) | Product detail đang mở | 1. Nhập `"1"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"1"` | Alert thành công. Cart có item với qty=1. | | |
| DT-D-003 | Thêm vào giỏ với quantity lớn | Product detail đang mở | 1. Nhập `"999"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"999"` | Alert thành công. Cart có item với qty=999. | | |
| DT-D-004 | Thêm vào giỏ từ product card (không nhập quantity) | Danh sách sản phẩm | 1. Bấm "Thêm vào giỏ" trên product card | *(mặc định 1)* | Alert thành công. Cart có item với qty=1. | | |
| DT-D-005 | Thêm vào giỏ với quantity rỗng | Product detail đang mở | 1. Xóa TextInput (để `""`) 2. Bấm "Thêm vào giỏ hàng" | quantity = `""` | quantity fallback = 1. Alert thành công. Không hiển thị lỗi. | | |
| DT-D-006 | Thêm vào giỏ với quantity = 0 | Product detail đang mở | 1. Nhập `"0"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"0"` | quantity fallback = 1. Alert thành công. Không hiển thị lỗi. | | |
| DT-D-007 | Thêm vào giỏ với quantity âm | Product detail đang mở | 1. Nhập `"-5"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"-5"` | quantity fallback = 1. Alert thành công. Không hiển thị lỗi. | | |
| DT-D-008 | Thêm vào giỏ với quantity không phải số | Product detail đang mở | 1. Nhập `"abc"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"abc"` | quantity fallback = 1. Alert thành công. Không hiển thị lỗi. | | |
| DT-D-009 | Thêm vào giỏ với quantity thập phân | Product detail đang mở | 1. Nhập `"2.7"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"2.7"` | quantity = 2 (parseInt lấy phần nguyên). Alert thành công. | | |

---

### A2. quantity — Cart Inline Edit (DT-D-010, DT-D-013 → DT-D-016)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-D-010 | Chỉnh quantity trong giỏ thành số dương bình thường | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"2"` | quantity = `"2"` | quantity trong cart = 2. Tổng tiền cập nhật tương ứng. | | |
| DT-D-013 | Chỉnh quantity trong giỏ thành rỗng | Cart có 1 item | 1. Vào trang cart 2. Xóa ô quantity (để `""`) | quantity = `""` | quantity fallback = 1. Không hiển thị lỗi. | | |
| DT-D-014 | Chỉnh quantity trong giỏ thành 0 | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"0"` | quantity = `"0"` | Item bị xóa khỏi giỏ hàng. Cart giảm 1 dòng. | | |
| DT-D-015 | Chỉnh quantity trong giỏ thành số âm | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"-3"` | quantity = `"-3"` | quantity fallback = 1. Không hiển thị lỗi. | | |
| DT-D-016 | Chỉnh quantity trong giỏ thành chuỗi không phải số | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"xyz"` | quantity = `"xyz"` | quantity fallback = 1. Không hiển thị lỗi. | | |

---

### A3. product — addToCart (DT-D-017 → DT-D-019)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-D-017 | Thêm sản phẩm chưa có trong giỏ | Cart không có sản phẩm id=2 | 1. Bấm "Thêm vào giỏ" sản phẩm id=2 | product id=2 | Cart tăng thêm 1 dòng mới. Badge giỏ tăng 1. | | |
| DT-D-018 | Thêm sản phẩm đã có trong giỏ (cùng id) | Cart đã có sản phẩm id=1 | 1. Bấm "Thêm vào giỏ" sản phẩm id=1 lần 2 | product id=1 (đã có) | Quantity của item đó tăng lên. Không tạo dòng mới. Badge không đổi. | | |
| DT-D-019 | Thêm lần lượt nhiều sản phẩm khác nhau | Cart rỗng | 1. Thêm sản phẩm id=1 2. Thêm id=2 3. Thêm id=3 | id=1, id=2, id=3 | Cart có 3 dòng riêng biệt. Badge = 3. | | |

---

### A4. Behavioral — Cart State (DT-D-020 → DT-D-025)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-D-020 | Xem giỏ hàng có items | Cart có 2+ items | 1. Bấm "Giỏ (N)" trên navbar | — | Hiển thị list sản phẩm với tên/giá/quantity/thành tiền, nút "Xóa". Có tổng tiền và nút checkout. | | |
| DT-D-021 | Xem giỏ hàng rỗng | Cart = [] | 1. Bấm "Giỏ (0)" trên navbar | — | Hiển thị thông báo "Giỏ hàng của bạn đang trống", hình minh họa (SPEC FR-07), nút "Tiếp tục mua sắm". | | |
| DT-D-022 | Tổng tiền tính đúng | Cart có 2 items | 1. Thêm A (price=100.000đ, qty=2) 2. Thêm B (price=50.000đ, qty=3) 3. Vào trang cart | A×2 + B×3 | Tổng tiền hiển thị = 350.000đ. | | |
| DT-D-023 | Xóa sản phẩm khỏi giỏ (còn items) | Cart có 2 items | 1. Vào cart 2. Bấm "Xóa" item đầu | — | Hiển thị dialog xác nhận (SPEC FR-07). Sau xác nhận: item bị xóa, cart còn 1 item. | | |
| DT-D-024 | Xóa item cuối — giỏ thành rỗng | Cart có 1 item | 1. Vào cart 2. Bấm "Xóa" item duy nhất | — | Hiển thị dialog xác nhận. Sau xác nhận: cart rỗng, chuyển sang empty state. | | |
| DT-D-025 | Kiểm tra nút +/- chỉnh quantity (UI) | Cart có 1 item | 1. Vào trang cart 2. Quan sát cách chỉnh quantity | — | Có nút "+" và "−" bên cạnh số lượng mỗi item (SPEC FR-07). | | |

---

## B. BVA Test Cases (14 TC)

### B1. quantity — Product Detail (BVA-D-001 → BVA-D-007)

| TC ID | Boundary | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-D-001 | Min-1 (0) | Product detail đang mở | 1. Nhập `"0"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"0"` | quantity fallback = 1. Alert thành công. Không hiển thị lỗi. | | |
| BVA-D-002 | Min (1) | Product detail đang mở | 1. Nhập `"1"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"1"` | quantity = 1. Alert "Đã thêm vào giỏ hàng". | | |
| BVA-D-003 | Min+1 (2) | Product detail đang mở | 1. Nhập `"2"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"2"` | quantity = 2. Alert thành công. | | |
| BVA-D-004 | Nominal (5) | Product detail đang mở | 1. Nhập `"5"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"5"` | quantity = 5. Alert thành công. | | |
| BVA-D-005 | Max-1 (998) | Product detail đang mở | 1. Nhập `"998"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"998"` | quantity = 998. Alert thành công. Tổng tiền hiển thị đúng. | | |
| BVA-D-006 | Max (999) | Product detail đang mở | 1. Nhập `"999"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"999"` | quantity = 999. Alert thành công. Tổng tiền hiển thị đúng. | | |
| BVA-D-007 | Max+1 (1000) | Product detail đang mở | 1. Nhập `"1000"` 2. Bấm "Thêm vào giỏ hàng" | quantity = `"1000"` | quantity = 1000. Alert thành công. Không xảy ra lỗi UI overflow. | | |

---

### B2. quantity — Cart Inline Edit (BVA-D-008 → BVA-D-014)

| TC ID | Boundary | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-D-008 | Min-1 (0) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"0"` | quantity = `"0"` | Item bị xóa khỏi giỏ hàng. Cart giảm 1 dòng. | | |
| BVA-D-009 | Min (1) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"1"` | quantity = `"1"` | quantity trong cart = 1. Tổng tiền cập nhật. | | |
| BVA-D-010 | Min+1 (2) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"2"` | quantity = `"2"` | quantity trong cart = 2. Tổng tiền cập nhật. | | |
| BVA-D-011 | Nominal (5) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"5"` | quantity = `"5"` | quantity trong cart = 5. Tổng tiền cập nhật. | | |
| BVA-D-012 | Max-1 (998) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"998"` | quantity = `"998"` | quantity trong cart = 998. Tổng tiền hiển thị đúng. | | |
| BVA-D-013 | Max (999) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"999"` | quantity = `"999"` | quantity trong cart = 999. Tổng tiền hiển thị đúng. | | |
| BVA-D-014 | Max+1 (1000) | Cart có 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"1000"` | quantity = `"1000"` | quantity trong cart = 1000. Không xảy ra lỗi UI overflow. | | |

---

## C. Test Case Summary

| Group | Source | Count | TC Range |
| --- | --- | --- | --- |
| quantity Product Detail | Domain | 9 | DT-D-001 → DT-D-009 |
| quantity Cart Inline Edit | Domain | 5 | DT-D-010, DT-D-013 → DT-D-016 |
| product addToCart | Domain | 3 | DT-D-017 → DT-D-019 |
| Behavioral Cart + UI | Domain | 6 | DT-D-020 → DT-D-025 |
| quantity Product Detail | BVA | 7 | BVA-D-001 → BVA-D-007 |
| quantity Cart Inline Edit | BVA | 7 | BVA-D-008 → BVA-D-014 |
| **Total** | | **37** | |
