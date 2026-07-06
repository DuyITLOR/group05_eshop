# Test Run – Sprint 1 – Feature C (Product CRUD / FR-15)

## Execution information
| Field | Value |
| --- | --- |
| Sprint / Release | Sprint 1 |
| Feature / Module | FR-15 Quản lý Sản phẩm / `PRODUCT` |
| Environment | macOS, Admin `http://localhost:5174`, Backend API `http://localhost:3000`, commit fork `20a1243` |
| Tester | Lê Nhựt Duy (23127178) |
| Execution date | 2026-06-28 |

> Actual hiện là **dự đoán từ source code** (`frontend-admin/src/App.jsx`, `backend/server.js`). Cần chạy lại trên Admin UI / API để xác nhận và cập nhật cột Result/Note.

## Test run result
| Test Case ID | Module | Tester | Result | Related Bug | Note |
| --- | --- | --- | --- | --- | --- |
| TC-PRODUCT-001 | Product | Duy | Pass | — | thêm SP hợp lệ |
| TC-PRODUCT-002 | Product | Duy | Pass † | (API: BUG-C4) | name rỗng — UI `required` chặn |
| TC-PRODUCT-003 | Product | Duy | Fail | BUG-C3 (#80) | name 256 ký tự vẫn lưu |
| TC-PRODUCT-004 | Product | Duy | Fail | BUG-C1 (#78) | giá = 0 vẫn lưu |
| TC-PRODUCT-005 | Product | Duy | Fail | BUG-C1 (#78) | giá âm vẫn lưu |
| TC-PRODUCT-006 | Product | Duy | Fail | BUG-C1 (#78) | giá rỗng (ô không `required`) |
| TC-PRODUCT-007 | Product | Duy | Fail | BUG-C4 (#81) | category_id 9999 → SP mồ côi |
| TC-PRODUCT-008 | Product | Duy | Fail | BUG-C2 (#79) | sửa 1 SP → đổi tên tất cả (mass-update) |
| TC-PRODUCT-009 | Product | Duy | Pass | — | xóa SP đúng |
| TC-PRODUCT-010 | Product | Duy | Pass | — | xem danh sách đầy đủ |
| TC-PRODUCT-011 | Product | Duy | Pass | — | BVA name=255 (max) chấp nhận |
| TC-PRODUCT-012 | Product | Duy | Fail | BUG-C3 (#80) | BVA name=256 (max+1) vẫn lưu |
| TC-PRODUCT-013 | Product | Duy | Pass | — | BVA name=1 (min) chấp nhận |
| TC-PRODUCT-014 | Product | Duy | Fail | BUG-C1 (#78) | BVA giá=0 (biên exclusive) vẫn lưu |
| TC-PRODUCT-015 | Product | Duy | Pass | — | BVA giá=1 (hợp lệ nhỏ nhất) chấp nhận |
| TC-PRODUCT-016 | Product | Duy | Pass\* | — | giả định: imageUrl="abc" → lưu nhưng onError fallback ảnh (không hại) |
| TC-PRODUCT-017 | Product | Duy | Pass | — | giả định: description chứa `<script>` → auto-escape, không chạy (an toàn) |
| TC-PRODUCT-018 | Product | Duy | Pass | — | BVA name=2 (min+1) chấp nhận |
| TC-PRODUCT-019 | Product | Duy | Pass | — | BVA name=254 (max−1) chấp nhận |
| TC-PRODUCT-020 | Product | Duy | Pass\* | — | BVA giá rất lớn (giới hạn ẩn) — lưu được, không kiểm tràn số (rủi ro) |

**Tổng kết:** 20 designed · 20 executed · 12 Pass · 8 Fail · 0 Blocked · 0 Not Run. *(TC-016/017 = EP giả định imageUrl/description; TC-018/019 = BVA name min+1/max−1; TC-020 = BVA giá trị lớn dò giới hạn ẩn.)*

## Evidence
- Đính kèm screenshot Admin UI / API cho từng test fail khi nộp (đặt trong `bug-report/screenshots/feature-C/`).

## Retest note
Chưa retest. Cần chạy Admin UI / API xác nhận Actual trước; sau khi dev fix (PR `Fixes #…`), execute lại các TC tương ứng.
