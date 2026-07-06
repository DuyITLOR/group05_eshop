# STEP 8 — Gap Analysis: FR-14 Category Management (CRUD)

---

## A. Gap Analysis Table

| Gap ID | Missed Item | Cause Type | Detailed Explanation | Added TC ID |
| --- | --- | --- | --- | --- |
| GAP-01 | SEC-03: API category không kiểm tra `role = 'admin'` | Prompt Quality | Prompt yêu cầu bỏ JWT Token/User Role khỏi scope → không test authorization. Tuy nhiên SEC-03 rõ ràng yêu cầu kiểm tra role. Customer có token hợp lệ có thể CRUD category. | DT-C-027 |
| GAP-02 | SEC-04: Kiểm tra XSS khi render tên category trên frontend | AI Limitation | DT-C-010 chỉ kiểm tra backend lưu script tag. Chưa kiểm tra frontend có escape/sanitize khi render tên hay không (có dùng `dangerouslySetInnerHTML` không). | DT-C-028 |
| GAP-03 | DT-C-023 test không chính xác — products linked = 0 | AI Limitation | Script test resetDB() tạo seed categories mới (id khác seed gốc), nhưng seed products vẫn trỏ đến category_id cũ. Kết quả "Products linked before: 0" không phản ánh đúng thực tế. Cần reset DB bằng `node database.js` thay vì API. | — (fix script) |
| GAP-04 | Không test concurrent create (race condition) | Feature Complexity | Hai admin cùng tạo category cùng tên đồng thời — race condition có thể dẫn đến duplicate ngay cả khi có UNIQUE constraint. Ngoài scope domain testing truyền thống. | — |
| GAP-05 | Không test response body schema validation | AI Limitation | Chỉ kiểm tra status code và message, chưa validate response schema (ví dụ: POST trả về `id` đúng kiểu INTEGER, GET trả về đúng fields `{id, name}`). | DT-C-029 |
| GAP-06 | Không test encoding edge cases cho `name` | AI Limitation | Chưa test: emoji (🎮), null bytes (`\0`), unicode RTL characters, SQL injection attempts (`'; DROP TABLE categories;--`). Chỉ test XSS và ký tự đặc biệt cơ bản. | DT-C-030 |
| GAP-07 | Không test `GET /api/categories` error handling | AI Limitation | GET endpoint không có error handling — nếu DB bị lỗi (corrupt, locked), response sẽ thế nào? Chỉ test happy path (có data, không data). | — |
| GAP-08 | Không test PUT endpoint qua UI (frontend không có Edit UI) | Prompt Quality | SPEC nói "Thêm / Xem / Xóa" nhưng CODE có PUT. Đã test PUT qua API nhưng chưa ghi nhận rõ đây là gap giữa SPEC và implementation — frontend thiếu Edit button/form. | UI-C-008 |
| GAP-09 | UI: Không test tab order / keyboard navigation (FR-21) | AI Limitation | FR-21: "Tab Order: thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải". Chưa test keyboard navigation trên form thêm danh mục. | UI-C-009 |
| GAP-10 | UI: Không test responsive / mobile viewport | AI Limitation | Chỉ test desktop (1920×1080). Chưa test mobile viewport (375×812) — bảng danh mục có responsive không, nút Xóa có bị che không. | UI-C-010 |

---

## B. Assumptions AI Made

| # | Assumption | Confidence | Risk if Wrong |
| --- | --- | --- | --- |
| 1 | SPEC ngụ ý tên danh mục nên unique (vì "quản lý danh mục" cần phân biệt) | Medium | Nếu SPEC cho phép trùng tên → DT-C-006, DT-C-012, DT-C-026 PASS thay vì FAIL. 3 bugs bị loại. |
| 2 | Xóa category có products liên kết nên bị chặn (referential integrity) | Medium | Nếu SPEC cho phép xóa tự do → DT-C-023 PASS. Tuy nhiên orphan data vẫn là vấn đề data integrity. |
| 3 | FR-24 "Khi xóa item" áp dụng cho cả danh mục, không chỉ giỏ hàng | High | FR-24 ghi chung "Khi xóa item khỏi giỏ" — có thể chỉ áp dụng cho giỏ hàng. Nếu vậy UI-C-006 không phải bug. |
| 4 | Whitespace-only name nên bị reject (coi như rỗng) | High | SPEC chỉ nói "không được để trống" — whitespace có thể được coi là non-empty. Low risk vì đây là best practice. |
| 5 | Seed data products luôn link đến seed category id=1 | Medium | DT-C-023 giả định category đầu tiên có products. Nếu seed data khác → test kết quả sai. |

---

## C. Cause Type Distribution

| Cause Type | Count | Gap IDs | Pattern |
| --- | --- | --- | --- |
| **Prompt Quality** | 2 | GAP-01, GAP-08 | User yêu cầu bỏ JWT/Role scope → bỏ sót security TCs liên quan. SPEC vs CODE gap (PUT endpoint) chưa cover đủ UI side. |
| **AI Limitation** | 6 | GAP-02, GAP-03, GAP-05, GAP-06, GAP-07, GAP-09, GAP-10 | Thiếu chiều sâu: chỉ test backend lưu XSS nhưng không test render. Thiếu encoding edge cases. Không test schema validation. Test script logic lỗi (resetDB). |
| **Feature Complexity** | 1 | GAP-04 | Race condition ngoài scope domain testing — cần load testing hoặc concurrency testing. |

---

## D. Test Cases Bổ Sung

> Các TC sau bổ sung vào file 03 (Domain) hoặc 06 (UI).

### Domain Test Cases bổ sung (→ 03_domain_testcases.md)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- |
| DT-C-027 | Customer (role≠admin) tạo category | User login với `test@eshop.com` / `Test1234!` (role=customer) | 1. POST `/api/categories` với customer token, body `{name: "Test"}` | Customer token + `{name: "Test"}` | 403 Forbidden — SEC-03: chỉ admin mới được CRUD category |
| DT-C-028 | XSS render check — frontend có escape tên category chứa HTML không | Admin tạo category name=`<img onerror=alert(1) src=x>` | 1. POST category với XSS name 2. Mở frontend-admin, tab Danh mục 3. Inspect DOM xem tên có bị render as HTML không | `{name: "<img onerror=alert(1) src=x>"}` | Frontend phải escape — hiển thị text thuần, không render thành HTML element |
| DT-C-029 | Validate response schema — POST trả về đúng fields | Admin authenticated | 1. POST `/api/categories` `{name: "Schema Test"}` 2. Kiểm tra response có `message` (string) và `id` (integer) | `{name: "Schema Test"}` | Response: `{message: string, id: integer}`. `id` phải > 0. |
| DT-C-030 | Tạo category với tên chứa emoji | Admin authenticated | 1. POST `/api/categories` `{name: "Gaming 🎮"}` 2. GET kiểm tra | `{name: "Gaming 🎮"}` | 200 OK, emoji lưu và trả về đúng |

### UI Test Cases bổ sung (→ 06_detailed_testcases.md section C)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- |
| UI-C-008 | Frontend không có UI để Edit danh mục (SPEC vs CODE gap) | Admin logged in, tab Danh mục | 1. Quan sát bảng danh mục 2. Tìm nút Edit/Sửa | — | SPEC chỉ nói "Thêm / Xem / Xóa" → không cần Edit UI. Nhưng backend có PUT endpoint → gap document. |
| UI-C-009 | Tab order trên form thêm danh mục (FR-21) | Admin logged in, tab Danh mục | 1. Press Tab từ input "Tên danh mục mới" 2. Kiểm tra focus chuyển đến nút "Thêm mới" | — | Focus di chuyển theo thứ tự: Input → Button (trên xuống dưới, trái sang phải) |
| UI-C-010 | Responsive — bảng danh mục trên mobile viewport | Admin logged in, tab Danh mục | 1. Resize browser 375×812 2. Quan sát bảng, nút, form | — | Bảng không bị tràn, nút Xóa vẫn hiển thị và clickable |
