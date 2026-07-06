# STEP 3 — Domain Test Cases: FR-07 Mobile Shopping Cart (feature_D) (v1)

---

## 1. Equivalence Classes Summary

### quantity (Product Detail) — EC-QA

| EC ID | Type | Description |
| --- | --- | --- |
| EC-QA-V1 | Valid | Số dương bình thường |
| EC-QA-V2 | Valid | Số lượng = 1 (biên dưới hợp lệ) |
| EC-QA-V3 | Valid | Số lượng lớn |
| EC-QA-V4 | Valid | Không nhập — mặc định 1 (từ product card) |
| EC-QA-I1 | Invalid | Chuỗi rỗng `""` |
| EC-QA-I2 | Invalid | Số 0 |
| EC-QA-I3 | Invalid | Số âm |
| EC-QA-I4 | Invalid | Chuỗi không phải số |
| EC-QA-I5 | Invalid | Số thập phân |

### quantity (Cart Inline Edit) — EC-QE

| EC ID | Type | Description |
| --- | --- | --- |
| EC-QE-V1 | Valid | Số dương bình thường |
| EC-QE-V2 | Valid | Nhập 1 (biên dưới hợp lệ) |
| EC-QE-V3 | Valid | Số lớn |
| EC-QE-I1 | Invalid | Chuỗi rỗng |
| EC-QE-I2 | Invalid | Số 0 |
| EC-QE-I3 | Invalid | Số âm |
| EC-QE-I4 | Invalid | Chuỗi không phải số |

### product (addToCart) — EC-P

| EC ID | Type | Description |
| --- | --- | --- |
| EC-P-V1 | Valid | Sản phẩm mới (chưa có trong giỏ) |
| EC-P-V2 | Valid | Sản phẩm đã có trong giỏ (trùng id) |
| EC-P-V3 | Valid | Nhiều sản phẩm khác nhau trong giỏ |

### Behavioral (Cart State) — EC-CART / EC-UI

| EC ID | Type | Description |
| --- | --- | --- |
| EC-CART-V1 | Valid | Xem giỏ hàng có items |
| EC-CART-V2 | Valid | Xem giỏ hàng rỗng |
| EC-CART-V3 | Valid | Tổng tiền tính đúng |
| EC-CART-V4 | Valid | Xóa sản phẩm khỏi giỏ |
| EC-CART-V5 | Valid | Xóa item cuối — giỏ trở thành rỗng |
| EC-UI-I1 | Invalid | Không có nút +/- chỉnh quantity |
| EC-UI-I2 | Invalid | Nhãn "Tổng tạm tính" thay vì "Tổng cộng" |
| EC-UI-I3 | Invalid | Empty state thiếu hình minh họa |

---

## 2. Domain Test Matrix

> **Nguyên tắc:** One-at-a-time — khi test 1 biến invalid, các biến khác giữ valid default.
> **Valid defaults:** quantity = `"2"`, product = product hợp lệ từ API.

| TC | Operation | Biến test | EC tested | quantity | product | Loại |
| --- | --- | --- | --- | --- | --- | --- |
| DT-D-001 | Add to cart (product detail) | quantity | EC-QA-V1 | `"3"` | valid | Valid |
| DT-D-002 | Add to cart (product detail) | quantity | EC-QA-V2 | `"1"` | valid | Valid |
| DT-D-003 | Add to cart (product detail) | quantity | EC-QA-V3 | `"999"` | valid | Valid |
| DT-D-004 | Add to cart (product card) | quantity | EC-QA-V4 | *(mặc định 1)* | valid | Valid |
| DT-D-005 | Add to cart (product detail) | quantity | EC-QA-I1 | `""` | valid | Invalid |
| DT-D-006 | Add to cart (product detail) | quantity | EC-QA-I2 | `"0"` | valid | Invalid |
| DT-D-007 | Add to cart (product detail) | quantity | EC-QA-I3 | `"-5"` | valid | Invalid |
| DT-D-008 | Add to cart (product detail) | quantity | EC-QA-I4 | `"abc"` | valid | Invalid |
| DT-D-009 | Add to cart (product detail) | quantity | EC-QA-I5 | `"2.7"` | valid | Invalid |
| DT-D-010 | Cart inline edit | quantity | EC-QE-V1 | `"2"` | — | Valid |
| DT-D-011 | Cart inline edit | quantity | EC-QE-V2 | `"1"` | — | Valid |
| DT-D-012 | Cart inline edit | quantity | EC-QE-V3 | `"50"` | — | Valid |
| DT-D-013 | Cart inline edit | quantity | EC-QE-I1 | `""` | — | Invalid |
| DT-D-014 | Cart inline edit | quantity | EC-QE-I2 | `"0"` | — | Invalid |
| DT-D-015 | Cart inline edit | quantity | EC-QE-I3 | `"-3"` | — | Invalid |
| DT-D-016 | Cart inline edit | quantity | EC-QE-I4 | `"xyz"` | — | Invalid |
| DT-D-017 | Add to cart | product | EC-P-V1 | `"1"` | product id mới | Valid |
| DT-D-018 | Add to cart | product | EC-P-V2 | `"1"` | product đã có trong giỏ | Valid |
| DT-D-019 | Add to cart | product | EC-P-V3 | `"1"` | 3 products khác nhau lần lượt | Valid |
| DT-D-020 | View cart | behavioral | EC-CART-V1 | — | — | Valid |
| DT-D-021 | View cart | behavioral | EC-CART-V2 | — | — | Valid |
| DT-D-022 | View cart | behavioral | EC-CART-V3 | — | — | Valid |
| DT-D-023 | Remove from cart | behavioral | EC-CART-V4 | — | — | Valid |
| DT-D-024 | Remove from cart | behavioral | EC-CART-V5 | — | — | Valid |
| DT-D-025 | View cart (UI) | behavioral | EC-UI-I1 | — | — | Invalid |
| DT-D-026 | View cart (UI) | behavioral | EC-UI-I2 | — | — | Invalid |
| DT-D-027 | View cart (UI) | behavioral | EC-UI-I3 | — | — | Invalid |

---

## 3. Domain Test Case Details

| Test Case ID | Operation | Field | EC ID | Type | Input / Condition | Expected Result |
| --- | --- | --- | --- | --- | --- | --- |
| DT-D-001 | Add to cart từ product detail | quantity | EC-QA-V1 | Valid | Nhập `"3"` → bấm "Thêm vào giỏ hàng" | Alert "Đã thêm vào giỏ hàng". Cart có item với quantity = 3. |
| DT-D-002 | Add to cart từ product detail | quantity | EC-QA-V2 | Valid | Nhập `"1"` → bấm "Thêm vào giỏ hàng" | Alert thành công. Cart có item với quantity = 1. |
| DT-D-003 | Add to cart từ product detail | quantity | EC-QA-V3 | Valid | Nhập `"999"` → bấm "Thêm vào giỏ hàng" | Alert thành công. Cart có item với quantity = 999. |
| DT-D-004 | Add to cart từ product card | quantity | EC-QA-V4 | Valid | Bấm "Thêm vào giỏ" trên product card (không nhập quantity) | Alert thành công. Cart có item với quantity = 1 (mặc định). |
| DT-D-005 | Add to cart từ product detail | quantity | EC-QA-I1 | Invalid | Xóa hết text trong TextInput (để `""`) → bấm thêm | quantity fallback = 1. Không hiển thị lỗi cho user. |
| DT-D-006 | Add to cart từ product detail | quantity | EC-QA-I2 | Invalid | Nhập `"0"` → bấm thêm | quantity fallback = 1. Không hiển thị lỗi cho user. |
| DT-D-007 | Add to cart từ product detail | quantity | EC-QA-I3 | Invalid | Nhập `"-5"` → bấm thêm | quantity fallback = 1. Không hiển thị lỗi cho user. |
| DT-D-008 | Add to cart từ product detail | quantity | EC-QA-I4 | Invalid | Nhập `"abc"` → bấm thêm | quantity fallback = 1. Không hiển thị lỗi cho user. |
| DT-D-009 | Add to cart từ product detail | quantity | EC-QA-I5 | Invalid | Nhập `"2.7"` → bấm thêm | quantity = 2 (parseInt lấy phần nguyên). Không hiển thị lỗi. |
| DT-D-010 | Cart inline edit | quantity | EC-QE-V1 | Valid | Trong cart, đổi ô quantity thành `"2"` | quantity trong cart = 2. Tổng tiền cập nhật tương ứng. |
| DT-D-011 | Cart inline edit | quantity | EC-QE-V2 | Valid | Đổi ô quantity thành `"1"` | quantity trong cart = 1. Tổng tiền cập nhật tương ứng. |
| DT-D-012 | Cart inline edit | quantity | EC-QE-V3 | Valid | Đổi ô quantity thành `"50"` | quantity trong cart = 50. Tổng tiền cập nhật tương ứng. |
| DT-D-013 | Cart inline edit | quantity | EC-QE-I1 | Invalid | Xóa hết text trong ô quantity (`""`) | quantity fallback = 1. Không hiển thị lỗi. |
| DT-D-014 | Cart inline edit | quantity | EC-QE-I2 | Invalid | Nhập `"0"` vào ô quantity | Item bị xóa khỏi giỏ hàng (quantity = 0 đồng nghĩa không muốn mua). |
| DT-D-015 | Cart inline edit | quantity | EC-QE-I3 | Invalid | Nhập `"-3"` vào ô quantity | quantity fallback = 1. Không hiển thị lỗi. |
| DT-D-016 | Cart inline edit | quantity | EC-QE-I4 | Invalid | Nhập `"xyz"` vào ô quantity | quantity fallback = 1. Không hiển thị lỗi. |
| DT-D-017 | Add to cart | product | EC-P-V1 | Valid | Thêm sản phẩm chưa có trong giỏ (id mới) | Cart tăng thêm 1 dòng mới. Badge giỏ tăng 1. |
| DT-D-018 | Add to cart | product | EC-P-V2 | Valid | Thêm sản phẩm đã có trong giỏ (cùng id) | Quantity của item đó tăng lên, không tạo dòng mới. Badge không đổi. |
| DT-D-019 | Add to cart | product | EC-P-V3 | Valid | Thêm lần lượt 3 sản phẩm khác nhau | Cart có 3 dòng riêng biệt. Badge = 3. |
| DT-D-020 | View cart | behavioral | EC-CART-V1 | Valid | Đã có 2+ items trong giỏ → vào trang cart | Hiển thị list sản phẩm, từng item có tên/giá/quantity/thành tiền, nút "Xóa". Có tổng tiền và nút checkout. |
| DT-D-021 | View cart | behavioral | EC-CART-V2 | Valid | Giỏ rỗng → vào trang cart | Hiển thị thông báo "Giỏ hàng của bạn đang trống", hình minh họa (SPEC), nút "Tiếp tục mua sắm". |
| DT-D-022 | View cart | behavioral | EC-CART-V3 | Valid | Cart có 2 items: A(price=100k, qty=2), B(price=50k, qty=3) | Tổng tiền hiển thị = 350.000 đ. |
| DT-D-023 | Remove from cart | behavioral | EC-CART-V4 | Valid | Cart có 2 items → bấm "Xóa" item đầu | Hiển thị dialog xác nhận (SPEC). Sau xác nhận: item bị xóa, cart còn 1 item. |
| DT-D-024 | Remove from cart | behavioral | EC-CART-V5 | Valid | Cart có 1 item → bấm "Xóa" | Hiển thị dialog xác nhận. Sau xác nhận: cart rỗng, chuyển sang empty state. |
| DT-D-025 | View cart (UI check) | behavioral | EC-UI-I1 | Invalid | Vào trang cart → quan sát cách chỉnh quantity | Có nút "+" và "−" bên cạnh số lượng mỗi item (SPEC FR-07). |
| DT-D-026 | View cart (UI check) | behavioral | EC-UI-I2 | Invalid | Vào trang cart → quan sát nhãn tổng tiền | Nhãn phải là "Tổng cộng" (SPEC FR-07). |
| DT-D-027 | View cart empty (UI check) | behavioral | EC-UI-I3 | Invalid | Giỏ rỗng → quan sát empty state | Hiển thị hình minh họa (ảnh/icon) cùng với text thông báo (SPEC FR-07). |

---

## 4. EC Coverage Mapping

| EC ID | Covered by TC | Notes |
| --- | --- | --- |
| EC-QA-V1 | DT-D-001 | ✅ |
| EC-QA-V2 | DT-D-002 | ✅ |
| EC-QA-V3 | DT-D-003 | ✅ |
| EC-QA-V4 | DT-D-004 | ✅ |
| EC-QA-I1 | DT-D-005 | ✅ |
| EC-QA-I2 | DT-D-006 | ✅ |
| EC-QA-I3 | DT-D-007 | ✅ |
| EC-QA-I4 | DT-D-008 | ✅ |
| EC-QA-I5 | DT-D-009 | ✅ |
| EC-QE-V1 | DT-D-010 | ✅ SPEC-CODE mismatch (off-by-one) |
| EC-QE-V2 | DT-D-011 | ✅ SPEC-CODE mismatch (off-by-one) |
| EC-QE-V3 | DT-D-012 | ✅ SPEC-CODE mismatch (off-by-one) |
| EC-QE-I1 | DT-D-013 | ✅ |
| EC-QE-I2 | DT-D-014 | ✅ |
| EC-QE-I3 | DT-D-015 | ✅ |
| EC-QE-I4 | DT-D-016 | ✅ |
| EC-P-V1 | DT-D-017 | ✅ |
| EC-P-V2 | DT-D-018 | ✅ |
| EC-P-V3 | DT-D-019 | ✅ |
| EC-CART-V1 | DT-D-020 | ✅ |
| EC-CART-V2 | DT-D-021 | ✅ |
| EC-CART-V3 | DT-D-022 | ✅ |
| EC-CART-V4 | DT-D-023 | ✅ SPEC-CODE mismatch (no confirm dialog) |
| EC-CART-V5 | DT-D-024 | ✅ |
| EC-UI-I1 | DT-D-025 | ✅ SPEC-CODE mismatch (no +/- buttons) |
| EC-UI-I2 | DT-D-026 | ✅ SPEC-CODE mismatch (label) |
| EC-UI-I3 | DT-D-027 | ✅ SPEC-CODE mismatch (empty state) |

**Coverage: 27/27 ECs = 100%**
