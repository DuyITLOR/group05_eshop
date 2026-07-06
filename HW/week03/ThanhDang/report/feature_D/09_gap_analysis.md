# STEP 9 — Gap Analysis: FR-07 Mobile Shopping Cart (feature_D)

---

## A. Gap Analysis Table

| Gap ID | Missed Item | Cause Type | Detailed Explanation | Added TC ID |
| --- | --- | --- | --- | --- |
| GAP-D-01 | Không test persistence — cart bị mất khi reload app | Scope Exclusion | Cart lưu trong React state (client-side). Khi user tắt/mở lại app, cart bị xóa. SPEC FR-07 không đề cập persistence nhưng đây là UX issue quan trọng. Chưa có TC kiểm tra. | DT-D-028 |
| GAP-D-02 | Không test badge counter — hiển thị số loại SX, không phải tổng qty | Missing Spec Detail | App.js:436 dùng `cart.length` (số loại sản phẩm) cho badge. Nếu user thêm 3 cái áo vào giỏ, badge hiển thị "1" thay vì "3". Chưa có TC riêng cho badge logic. | DT-D-029 |
| GAP-D-03 | Không test addToCart khi merge — normalizeQuantity áp dụng lên qty hiện có | Scope Exclusion | App.js:145: `normalizeQuantity(newCart[existingIndex].quantity) + safeQuantity`. Nếu quantity hiện có bị corrupt (ví dụ đã = 0 do bug), normalizeQuantity fallback 1 → quantity không cộng đúng. Edge case chưa cover. | DT-D-030 |
| GAP-D-04 | Không test thêm sản phẩm giá = 0 | Missing Spec Detail | Nếu sản phẩm có price=0 (hoặc price là string từ API — bug đã biết trong backend), `cartTotal = 0`. Chưa test edge case price=0 hoặc price=string. | DT-D-031 |
| GAP-D-05 | Không test removeFromCart với index sai (out of bounds) | Complexity | `newCart.splice(index, 1)` với index âm hoặc ≥ cart.length — JavaScript splice không throw, nhưng kết quả có thể unexpected. Chưa test defensive behavior. | — |
| GAP-D-06 | Không test tổng tiền overflow — price × qty rất lớn | Feature Complexity | qty=9999 × price=999.000.000đ = số rất lớn. JavaScript Number có giới hạn safe integer. Tổng tiền có hiển thị đúng hay bị mất chữ số không? | DT-D-032 |
| GAP-D-07 | UI test chỉ qua code analysis — không chạy app thực tế | Tool Limitation | DT-D-021, DT-D-025, DT-D-026, DT-D-027 đánh giá qua static code analysis (đọc App.js). Chưa chụp screenshot thực tế từ Expo. Cần manual verification trên device/emulator. | — |

---

## B. Assumptions AI Made

| # | Assumption | Confidence | Risk if Wrong |
| --- | --- | --- | --- |
| 1 | qty=0 trong inline edit nên xóa item (BUG-D-002) | Medium | SPEC không đề cập rõ. Nếu SPEC chấp nhận qty=0 → fallback 1 thì DT-D-014 thực ra PASS. |
| 2 | FR-07 "confirm dialog" áp dụng cho cart remove trong mobile | High | FR-07 ghi rõ "Nút Xóa phải có dialog xác nhận". Risk thấp. |
| 3 | "Tổng cộng" là nhãn đúng theo SPEC (thay vì "Tổng tạm tính") | High | FR-07 ghi rõ nhãn "Tổng cộng". Risk thấp. |
| 4 | Max đại diện = 999 cho BVA là hợp lý | Medium | Không có giới hạn thực từ SPEC/CODE. Nếu hệ thống thực có giới hạn khác (ví dụ 100), BVA Max boundary sẽ cần update. |
| 5 | UI checks dựa trên code analysis (không chạy app) là đủ tin cậy | Medium | App.js rõ ràng — không có `<Image>` trong empty state, không có +/- button. Tuy nhiên nếu có dynamic rendering thì cần verify thực tế. |

---

## C. Cause Distribution

| Cause Type | Count | Gap IDs |
| --- | --- | --- |
| Scope Exclusion | 2 | GAP-D-01, GAP-D-03 |
| Missing Spec Detail | 2 | GAP-D-02, GAP-D-04 |
| Complexity | 1 | GAP-D-05 |
| Feature Complexity | 1 | GAP-D-06 |
| Tool Limitation | 1 | GAP-D-07 |
| **Total** | **7** | |

---

## D. Supplementary TCs Proposed

| TC ID | Description | Priority | Related Gap |
| --- | --- | --- | --- |
| DT-D-028 | Tắt và mở lại app — kiểm tra cart có còn không | Medium | GAP-D-01 |
| DT-D-029 | Thêm 3 cái của cùng 1 sản phẩm — badge hiển thị "1" hay "3" | Low | GAP-D-02 |
| DT-D-030 | addToCart merge khi quantity hiện tại bị corrupt = 0 | Low | GAP-D-03 |
| DT-D-031 | Thêm sản phẩm có price=0 vào giỏ — tổng tiền = 0 | Low | GAP-D-04 |
| DT-D-032 | qty=9999 × price cao nhất — kiểm tra overflow tổng tiền | Low | GAP-D-06 |
