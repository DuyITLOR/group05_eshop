# EP-FR18 — Domain Testing (Equivalence Class Partitioning): Order management (admin)

**Feature:** FR-18 — Order management (admin) · **Module:** `ADMIN_ORDER`
**Kỹ thuật:** ISTQB FL §4.2.1 Equivalence Partitioning (single-fault assumption)
**File liên quan:** [BVA-FR18.md](BVA-FR18.md) · [bug-report_ADMIN_ORDER.md](../bug-reports/bug-report_ADMIN_ORDER.md)

## 0. Mô tả & nguồn tham chiếu

- **Chức năng:** Admin xem danh sách đơn hàng toàn hệ thống và cập nhật trạng thái đơn theo máy trạng thái.
- **Endpoint:** `GET /api/admin/orders`; `PUT /api/admin/orders/:id/status` body `{ status }`. Trạng thái hợp lệ: `pending, confirmed, shipping, delivered, canceled`.
- **Nguồn đã đọc:** api_specification.md §6.2; backend/server.js:525-568 (logic transition).
- **Máy trạng thái hợp lệ (đọc từ code):** `pending → {confirmed, canceled}`, `confirmed → {shipping, canceled}`, `shipping → {delivered}`.
- **Môi trường test:** Windows 11 25H2, Node v22.22.1, backend `http://localhost:3000` (reset DB `node database.js`), gọi API trực tiếp (REST Client/curl).

> ⚠️ **Điểm nghi vấn:**
> 1. server.js:550-551 cho phép `canceled → delivered` (đơn đã hủy lại thành đã giao).
> 2. Route chỉ `authenticateToken`, không kiểm `role === admin` → user thường đổi được trạng thái đơn (authorization bug).

## 1. Các bước áp dụng (step-by-step)

1. **Liệt kê biến:** `order_id` (URL), `status` (body), JWT `token` (xác thực + phân quyền); biến ngữ cảnh ẩn `current_status` (trạng thái hiện tại trong DB).
2. **Miền & ràng buộc (từ code):** `order_id` số nguyên dương, phải tồn tại (server.js:528 `SELECT ... WHERE id=?`, SQLite coerce chuỗi→0); `status` spec 5 giá trị nhưng server.js:526 không validate enum (giá trị ngoài tập → 400 vì không match transition); JWT kiểm chữ ký nhưng route thiếu `role === admin`.
3. **Máy trạng thái (server.js:537-551):** pending→confirmed ✓, pending→canceled ✓, confirmed→shipping ✓, confirmed→canceled ✓, shipping→delivered ✓; `canceled → delivered` ← BUG (dòng 550-551) cho phép nhưng vô lý; mọi transition khác → 400.
4. **Phân vùng tương đương:** xem §2 (13 lớp).
5. **Single-fault:** mỗi TC invalid chỉ vi phạm 1 điều kiện.
6. **Test qua REST Client** (direct API, bypass frontend).

## 2. Bảng phân tích Equivalence Classes (ma trận transition)

| Lớp (EC)    | Loại        | Mô tả (from → to / điều kiện)                                | Giá trị đại diện               |
| ----------- | ----------- | ------------------------------------------------------------ | ------------------------------ |
| EC-TRANS-1  | Valid       | pending → confirmed                                          | current=pending, to=confirmed  |
| EC-TRANS-2  | Valid       | pending → canceled                                           | current=pending, to=canceled   |
| EC-TRANS-3  | Valid       | confirmed → shipping                                         | current=confirmed, to=shipping |
| EC-TRANS-4  | Valid       | confirmed → canceled                                         | current=confirmed, to=canceled |
| EC-TRANS-5  | Valid       | shipping → delivered                                         | current=shipping, to=delivered |
| EC-TRANS-6  | Invalid     | delivered → bất kỳ (terminal state)                          | current=delivered, to=canceled |
| EC-TRANS-7  | Invalid/Bug | canceled → delivered (code cho phép nhưng sai nghiệp vụ)     | current=canceled, to=delivered |
| EC-TARGET-1 | Invalid     | `status` không thuộc tập 5 giá trị hợp lệ                    | `"done"`                       |
| EC-ID-1     | Invalid     | `order_id` không tồn tại                                     | `99999`                        |
| EC-ID-2     | Invalid     | `order_id` không phải số (non-numeric)                       | `"abc"`                        |
| EC-AUTH-1   | Invalid/Bug | Token user thường (role=user), route thiếu role check        | token của test@eshop.com       |
| EC-AUTH-2   | Invalid     | Không có Authorization header                                | _(bỏ header)_                  |
| EC-AUTH-3   | Invalid     | Token sai định dạng / giả mạo                                | `Bearer fake_token_xyz`        |

## 3. Test cases — Domain Testing

| TC ID              | Mô tả                                              | Phủ EC                    | Test data                                                          | Expected result                                                                                        | Status |
| ------------------ | -------------------------------------------------- | ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------ |
| TC-ADMIN_ORDER-001 | Lấy danh sách đơn với quyền admin (happy path)     | EC-TRANS-1 (auth precond) | `GET /api/admin/orders` + Bearer admin_token                       | 200, mảng đơn hàng toàn hệ thống (kèm `user_name` từ JOIN)                                              | PASS   |
| TC-ADMIN_ORDER-002 | Lấy danh sách với token user thường                | EC-AUTH-1                 | `GET /api/admin/orders` + Bearer user_token                        | Kỳ vọng 403. Thực tế (BUG-C-01): 200, trả toàn bộ đơn, thiếu role check                                | FAIL   |
| TC-ADMIN_ORDER-003 | GET không có token                                 | EC-AUTH-2                 | `GET /api/admin/orders` (không header)                             | 401 `{"error":"Unauthorized"}`                                                                        | PASS   |
| TC-ADMIN_ORDER-004 | pending → confirmed (happy path)                   | EC-TRANS-1                | `PUT /api/admin/orders/1/status` `{"status":"confirmed"}`          | 200 `{"message":"Order status updated"}`; GET xác nhận `confirmed`                                      | PASS   |
| TC-ADMIN_ORDER-005 | pending → canceled                                 | EC-TRANS-2                | `{"status":"canceled"}` từ pending                                 | 200, status `canceled`                                                                                 | PASS   |
| TC-ADMIN_ORDER-006 | confirmed → shipping                               | EC-TRANS-3                | `{"status":"shipping"}` từ confirmed                               | 200, status `shipping`                                                                                 | PASS   |
| TC-ADMIN_ORDER-007 | confirmed → canceled                               | EC-TRANS-4                | `{"status":"canceled"}` từ confirmed                               | 200, status `canceled`                                                                                 | PASS   |
| TC-ADMIN_ORDER-008 | shipping → delivered                               | EC-TRANS-5                | `{"status":"delivered"}` từ shipping                               | 200, status `delivered`                                                                                | PASS   |
| TC-ADMIN_ORDER-009 | delivered → canceled (transition bị cấm)           | EC-TRANS-6                | `{"status":"canceled"}` từ delivered                               | 400 `{"error":"Invalid state transition from delivered to canceled"}`                                  | PASS   |
| TC-ADMIN_ORDER-010 | canceled → delivered (BUG: code cho phép)          | EC-TRANS-7                | `{"status":"delivered"}` từ canceled                               | Kỳ vọng 400. Thực tế (BUG-C-02): 200 (server.js:550-551 cho phép transition vô lý)                     | FAIL   |
| TC-ADMIN_ORDER-011 | status ngoài tập hợp lệ ("done")                   | EC-TARGET-1               | `{"status":"done"}`                                               | 400 (isValidTransition=false)                                                                          | PASS   |
| TC-ADMIN_ORDER-012 | order_id không tồn tại                             | EC-ID-1                   | `PUT /api/admin/orders/99999/status` `{"status":"confirmed"}`     | 404 `{"error":"Order not found"}`                                                                      | PASS   |
| TC-ADMIN_ORDER-013 | User thường cập nhật trạng thái (authorization)    | EC-AUTH-1                 | `{"status":"confirmed"}` + Bearer user_token                       | Kỳ vọng 403. Thực tế (BUG-C-01): 200, thực hiện thành công, thiếu role check                           | FAIL   |

## 4. Truy vết coverage (EC ↔ TC)

| Lớp (EC)    | Phủ bởi TC                             | Ghi chú                                                               |
| ----------- | -------------------------------------- | --------------------------------------------------------------------- |
| EC-TRANS-1  | TC-ADMIN_ORDER-004                     | pending → confirmed                                                   |
| EC-TRANS-2  | TC-ADMIN_ORDER-005                     | pending → canceled                                                    |
| EC-TRANS-3  | TC-ADMIN_ORDER-006                     | confirmed → shipping                                                  |
| EC-TRANS-4  | TC-ADMIN_ORDER-007                     | confirmed → canceled                                                  |
| EC-TRANS-5  | TC-ADMIN_ORDER-008                     | shipping → delivered                                                  |
| EC-TRANS-6  | TC-ADMIN_ORDER-009                     | delivered → any, từ chối đúng                                         |
| EC-TRANS-7  | TC-ADMIN_ORDER-010                     | canceled → delivered, BUG-C-02                                        |
| EC-TARGET-1 | TC-ADMIN_ORDER-011                     | status="done"                                                        |
| EC-ID-1     | TC-ADMIN_ORDER-012                     | order_id=99999 không tồn tại                                          |
| EC-ID-2     | TC-ADMIN_ORDER-015                     | order_id="abc" (bổ sung sau review — trước đó bị ánh xạ khống)        |
| EC-AUTH-1   | TC-ADMIN_ORDER-002, TC-ADMIN_ORDER-013 | BUG-C-01, thiếu role check                                            |
| EC-AUTH-2   | TC-ADMIN_ORDER-003                     | Không có token                                                        |
| EC-AUTH-3   | TC-ADMIN_ORDER-014                     | Token giả mạo (bổ sung sau review — trước đó bị ánh xạ khống)         |

## 5. AI Gap Analysis (bổ sung sau review)

Đối chiếu từng EC/TC với code thật (server.js:100-110 middleware, 510-568 handler admin). 6 gap; 1 gap sinh bug mới (BUG-C-03), 1 gap là oracle problem cố hữu.

| #  | AI bỏ sót                                                                                             | Bổ sung                                        | Nguyên nhân |
| -- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| 1  | EC-AUTH-3 (token giả) bị **ánh xạ khống** vào TC-101 (thực chất gửi token admin)                     | TC-ADMIN_ORDER-014 (token giả → 403)           | Ảo giác độ phủ (coverage hallucination) |
| 2  | EC-ID-2 ("abc") bị **ánh xạ khống** vào TC-101 (dùng id=0, là số)                                    | TC-ADMIN_ORDER-015 (id="abc")                  | Lớp không rời nhau: gộp "biên 0" với "sai kiểu" |
| 3  | Status THIẾU/RỖNG bị gộp với status SAI GIÁ TRỊ; server.js:526 không validate `status` bắt buộc/enum | TC-ADMIN_ORDER-016 (thiếu), -017 (`""`) + BUG-C-03 | Gộp "field thiếu" với "field sai" |
| 4  | Lớp "self-transition" (from==to) không mô hình hoá                                                    | TC-ADMIN_ORDER-018 (`pending→pending`)         | AI suy luận theo cú pháp code, không theo mô hình trạng thái đầy đủ |
| 5  | Transition hợp lệ nghiệp vụ nhưng CODE THIẾU (vd `shipping → canceled`)                               | TC-ADMIN_ORDER-019 (cần đối chiếu spec)        | Oracle problem: AI lấy code làm chân lý |
| 6  | Output của GET không được kiểm (đa user + LEFT JOIN khi user bị xoá)                                  | TC-ADMIN_ORDER-020                             | AI chỉ test input + status code, bỏ output |

### Test case bổ sung (014–020, test qua REST Client)

| TC ID              | Mô tả                                                        | Phủ gap | Test data / thao tác                                                                                     | Expected result                                                                                                                    | Status       |
| ------------------ | ------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| TC-ADMIN_ORDER-014 | Token giả mạo / sai chữ ký                                   | #1      | `PUT /api/admin/orders/1/status` + `Authorization: Bearer fake_token_xyz`                                | 403 `{"error":"Forbidden"}` (jwt.verify err, server.js:106)                                                                       | Pass         |
| TC-ADMIN_ORDER-015 | order_id không phải số (`"abc"`)                             | #2      | `PUT /api/admin/orders/abc/status` `{"status":"confirmed"}`                                              | Kỳ vọng 400 lỗi kiểu. Thực tế: SQLite coerce `"abc"`→0 → 404 (lỗi kiểu bị che thành 404)                                          | Pass         |
| TC-ADMIN_ORDER-016 | Body thiếu field `status`                                    | #3      | `PUT /api/admin/orders/1/status` body `{}`                                                               | Kỳ vọng 400 "status bắt buộc". Thực tế (BUG-C-03): 400 `"...from pending to undefined"` (thông điệp sai)                          | Fail         |
| TC-ADMIN_ORDER-017 | `status = ""` (rỗng)                                         | #3      | `PUT /api/admin/orders/1/status` `{"status":""}`                                                         | Kỳ vọng 400 "status không hợp lệ". Thực tế (BUG-C-03): 400 `"...from pending to "` (không validate enum)                          | Fail         |
| TC-ADMIN_ORDER-018 | Self-transition `pending → pending`                          | #4      | `{"status":"pending"}` từ pending                                                                        | Hiện trả 400 `"...from pending to pending"`. Đề xuất: nên no-op/200 hoặc lỗi rõ ràng                                              | Pass         |
| TC-ADMIN_ORDER-019 | `shipping → canceled` (nghiệp vụ có thể đúng nhưng code thiếu) | #5      | `{"status":"canceled"}` từ shipping                                                                       | Code hiện trả 400. Nghi vấn under-permissive: nếu spec cho hủy đơn đang giao → bug. Cần xác nhận spec                             | Cần xác minh |
| TC-ADMIN_ORDER-020 | GET admin orders — kiểm output (đa user + LEFT JOIN)         | #6      | Tạo đơn từ user A & B → `GET /api/admin/orders`; xoá user A → GET lại                                    | Thấy đơn của cả A & B kèm `user_name`; sau khi xoá A: đơn A vẫn hiện `user_name=null` (LEFT JOIN), không crash                     | Pass         |

> Gap #3 sinh BUG-C-03. Gap #5 là nghi vấn cần đối chiếu spec. Tổng TC Feature C: 23 = 13 (Domain 001–013) + 3 (BVA 101–103, xem [BVA-FR18.md](BVA-FR18.md)) + 7 (Domain bổ sung 014–020).
