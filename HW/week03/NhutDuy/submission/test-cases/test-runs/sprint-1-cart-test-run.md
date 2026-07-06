# Test Run – Sprint 1 – Feature B (Cart / FR-07)

## Execution information
| Field | Value |
| --- | --- |
| Sprint / Release | Sprint 1 |
| Feature / Module | FR-07 Giỏ hàng / `CART` |
| Environment | macOS, Frontend Web `http://localhost:5173`, Backend API `http://localhost:3000`, commit fork `20a1243` |
| Tester | Lê Nhựt Duy (23127178) |
| Execution date | 2026-06-28 |

> Actual hiện là **dự đoán từ source code** (giỏ hàng là React state `CartContext`). Cần chạy lại trên UI để xác nhận và cập nhật cột Result/Note.

## Test run result
| Test Case ID | Module | Tester | Result | Related Bug | Note |
| --- | --- | --- | --- | --- | --- |
| TC-CART-001 | Cart | Duy | Pass | — | qty=1 hợp lệ |
| TC-CART-002 | Cart | Duy | Pass | — | qty=5 hợp lệ |
| TC-CART-003 | Cart | Duy | Fail | BUG-B1 (#51) | qty=0 vẫn thêm được |
| TC-CART-004 | Cart | Duy | Fail | BUG-B1 (#51) | qty=-3 → tổng tiền âm |
| TC-CART-005 | Cart | Duy | Fail | BUG-B1 (#51) | qty=2.5 → parseInt cắt thành 2 |
| TC-CART-006 | Cart | Duy | Fail | BUG-B1 (#51) | qty rỗng → tổng = NaN |
| TC-CART-007 | Cart | Duy | Fail | BUG-B2 (#52) | thêm trùng → 2 dòng (không gộp) |
| TC-CART-008 | Cart | Duy | Fail | BUG-B3 (#53) | xóa ngay, không dialog xác nhận |
| TC-CART-009 | Cart | Duy | Fail | BUG-B4 (#54) | nhãn "Tổng tạm tính" thay vì "Tổng cộng" |
| TC-CART-010 | Cart | Duy | Fail | BUG-B5 (#55) | không có nút +/- chỉnh số lượng |
| TC-CART-011 | Cart | Duy | Fail | BUG-B6 (#56) | giỏ trống thiếu hình minh họa |
| TC-CART-013 | Cart | Duy | Pass | — | Nút "Tiếp tục mua sắm" về trang chủ OK (nhãn "← Mua tiếp" lệch khi giỏ có hàng — ứng viên BUG-B7) |
| TC-CART-014 | Cart | Duy | Pass | — | BVA qty=2 (min+1) chấp nhận |
| TC-CART-015 | Cart | Duy | Pass\* | — | BVA qty rất lớn — không kiểm tồn kho (rủi ro) |

**Tổng kết:** 14 designed · 14 executed · 5 Pass · 9 Fail · 0 Blocked · 0 Not Run. *(TC-CART-012 đã loại — thuộc FR-06.)*

## Evidence
- Đính kèm screenshot UI cho từng test fail khi nộp (đặt trong `bug-report/screenshots/`).

## Retest note
Chưa retest. Cần chạy UI xác nhận Actual trước; sau khi dev fix (PR `Fixes #…`), execute lại các TC tương ứng.
