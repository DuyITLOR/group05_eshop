# EP-FR04 — Domain Testing (Equivalence Class Partitioning): Personal profile management

**Feature:** FR-04 — Personal profile management · **Module:** `PROFILE`
**Kỹ thuật:** ISTQB FL §4.2.1 Equivalence Partitioning (mỗi lớp 1 đại diện; phủ cả valid & invalid; single-fault assumption)
**File liên quan:** [BVA-FR04.md](BVA-FR04.md) · [bug-report_PROFILE.md](../bug-reports/bug-report_PROFILE.md)

## 0. Mô tả & nguồn tham chiếu

- **Chức năng:** Cập nhật hồ sơ cá nhân của người dùng đang đăng nhập (họ tên, địa chỉ giao hàng, số điện thoại). Yêu cầu JWT.
- **Endpoint / màn hình:** `GET /api/users/me` (lấy hồ sơ); `PUT /api/users/me` body `{ name, shipping_address, phone }`; trang "Hồ sơ cá nhân" (web) / tab Profile (mobile).
- **Nguồn đã đọc:**
  - api_specification.md §2.2: body cập nhật hồ sơ.
  - backend/server.js:118-135: handler `PUT /api/users/me` không validate server-side; nhận thêm trường `role` → cập nhật quyền nếu được truyền.
  - backend/database.js:50-61: schema bảng `users` (cột TEXT, không ràng buộc độ dài/format).
  - frontend-mobile/App.js:287 & frontend-web/src/pages/Profile.jsx:43: ràng buộc client `phone` = regex `^[1-9][0-9]{8,9}$` (9–10 chữ số, không bắt đầu bằng 0).
- **Môi trường test:** Chrome / Windows 11 25H2.

> ⚠️ **Cảnh báo bảo mật (thấy trong code):** `PUT /api/users/me` chấp nhận `role` từ body và ghi thẳng vào DB → privilege escalation. Có TC bảo mật riêng (EC-ROLE).

## 1. Các bước áp dụng (step-by-step)

1. **Liệt kê biến:** `name`, `phone`, `shipping_address`, `role` (trường ẩn), JWT `token`.
2. **Miền & ràng buộc (từ code):**
   - `name`: text, HTML `required`; server không validate → API trực tiếp nhận rỗng/whitespace.
   - `phone`: client regex `^[1-9][0-9]{8,9}$`; server không kiểm tra → bypass qua Postman. Số VN thật bắt đầu bằng 0 nhưng regex từ chối → nghi vấn design bug.
   - `shipping_address`: text tự do, không ràng buộc.
   - `role`: KHÔNG được người dùng thường gán; server.js:124 chỉ `if (role) {...}` → privilege escalation.
   - JWT `token`: middleware `authenticateToken` (server.js:100-110).
3. **Phát hiện thêm khi đọc code:** App.jsx:27 `dangerouslySetInnerHTML` → Stored XSS nếu `name` chứa HTML; App.js:302 mobile gửi `shippingAddress` (camelCase) ≠ server đọc `shipping_address` → address không lưu qua mobile (silent bug).
4. **Phân vùng tương đương:** xem §2 (17 lớp).
5. **Chọn đại diện:** mỗi lớp 1 giá trị điển hình (biên xử lý ở BVA).
6. **Thiết kế TC:** single-fault; mỗi invalid → 1 TC; test qua Postman (bypass client) để kiểm server-side thật.

## 2. Bảng phân tích Equivalence Classes

| Biến               | Lớp (EC)   | Loại             | Mô tả lớp                                                      | Giá trị đại diện                    |
| ------------------ | ---------- | ---------------- | -------------------------------------------------------------- | ----------------------------------- |
| `name`             | EC-NAME-1  | Valid            | Chuỗi không rỗng, có ≥1 ký tự non-whitespace                   | `Nguyen Van A`                      |
| `name`             | EC-NAME-2  | Invalid          | Chuỗi rỗng `""`                                                | `""`                                |
| `name`             | EC-NAME-3  | Invalid          | Chuỗi chỉ gồm khoảng trắng                                     | `"   "`                             |
| `name`             | EC-NAME-4  | Invalid/Security | XSS payload, kỳ vọng sanitize; thực tế Stored XSS             | `<script>alert('XSS')</script>`     |
| `phone`            | EC-PHONE-1 | Valid            | 9–10 chữ số, ký tự đầu 1–9 (đúng regex client)                | `912345678`                         |
| `phone`            | EC-PHONE-2 | Invalid          | Chứa ký tự không phải số                                       | `09abc12345`                        |
| `phone`            | EC-PHONE-3 | Invalid          | Bắt đầu bằng 0 (vi phạm regex; nhưng là số VN thật)           | `0912345678`                        |
| `phone`            | EC-PHONE-4 | Invalid          | Quá ngắn, < 9 chữ số (giá trị điển hình)                       | `91234` (5 số)                      |
| `phone`            | EC-PHONE-5 | Invalid          | Quá dài, > 10 chữ số (giá trị điển hình)                       | `91234567890123` (14 số)            |
| `phone`            | EC-PHONE-6 | Invalid          | Rỗng `""`                                                      | `""`                                |
| `shipping_address` | EC-ADDR-1  | Valid            | Địa chỉ không rỗng, text tự do                                 | `123 Le Loi, Q1, TP.HCM`            |
| `shipping_address` | EC-ADDR-2  | Invalid          | Rỗng `""`                                                      | `""`                                |
| `shipping_address` | EC-ADDR-3  | Invalid/Security | XSS payload, Stored XSS khi render                            | `<img src=x onerror=alert(1)>`      |
| `role`             | EC-ROLE-1  | Invalid/Security | User thường gửi `role=admin` để leo thang quyền               | `admin`                             |
| JWT `token`        | EC-AUTH-1  | Valid            | Token hợp lệ từ `POST /api/login`                             | JWT sau khi login                   |
| JWT `token`        | EC-AUTH-2  | Invalid          | Thiếu Authorization header                                     | _(không gửi header)_                |
| JWT `token`        | EC-AUTH-3  | Invalid          | Token sai định dạng / giả mạo                                  | `Bearer invalid_token_xyz`          |

> _EC-PHONE-3:_ regex client từ chối `0912345678` (số VN hợp lệ) → design bug (BUG-A-05).

## 3. Test cases — Domain Testing

| TC ID          | Mô tả                                              | Phủ EC                                      | Test data (Body JSON)                                                                        | Expected result                                                              | Status |
| -------------- | -------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------ |
| TC-PROFILE-001 | Cập nhật hồ sơ tất cả trường hợp lệ (happy path)   | EC-NAME-1, EC-PHONE-1, EC-ADDR-1, EC-AUTH-1 | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi, Q1, TP.HCM"}`    | 200 `{"message":"Profile updated"}`; GET /me trả về đúng dữ liệu mới          | Pass   |
| TC-PROFILE-002 | Tên rỗng qua API (bypass HTML required)            | EC-NAME-2                                   | `{"name":"","phone":"912345678","shipping_address":"123 Le Loi"}`                            | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu tên rỗng                            | Fail   |
| TC-PROFILE-003 | Tên chỉ khoảng trắng qua API                       | EC-NAME-3                                   | `{"name":"   ","phone":"912345678","shipping_address":"123 Le Loi"}`                         | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu `"   "`                             | Fail   |
| TC-PROFILE-004 | XSS payload trong tên (Stored XSS)                 | EC-NAME-4                                   | `{"name":"<script>alert('XSS')</script>","phone":"912345678","shipping_address":"123 Le Loi"}` | Kỳ vọng sanitize/từ chối. Thực tế (BUG-A-02): lưu raw → XSS render ở navbar   | Fail   |
| TC-PROFILE-005 | Phone chứa ký tự không phải số                     | EC-PHONE-2                                  | `{"name":"Nguyen Van A","phone":"09abc12345","shipping_address":"123 Le Loi"}`               | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu `09abc12345`                        | Fail   |
| TC-PROFILE-006 | Phone bắt đầu bằng 0 (số VN hợp lệ, regex từ chối) | EC-PHONE-3                                  | `{"name":"Nguyen Van A","phone":"0912345678","shipping_address":"123 Le Loi"}`               | Web: alert regex. Postman: kỳ vọng 400; thực tế 200 + regex sai (BUG-A-05)    | Fail   |
| TC-PROFILE-007 | Phone quá ngắn (5 số) qua API                      | EC-PHONE-4                                  | `{"name":"Nguyen Van A","phone":"91234","shipping_address":"123 Le Loi"}`                    | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu `91234`                             | Fail   |
| TC-PROFILE-008 | Phone quá dài (14 số) qua API                      | EC-PHONE-5                                  | `{"name":"Nguyen Van A","phone":"91234567890123","shipping_address":"123 Le Loi"}`           | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu số 14 chữ số                        | Fail   |
| TC-PROFILE-009 | Phone rỗng qua API (phone có bắt buộc?)            | EC-PHONE-6                                  | `{"name":"Nguyen Van A","phone":"","shipping_address":"123 Le Loi"}`                         | Cần xác minh spec. Thực tế: API cho update phone rỗng                         | Fail   |
| TC-PROFILE-010 | Địa chỉ rỗng qua API                               | EC-ADDR-2                                   | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":""}`                          | Kỳ vọng 400. Thực tế (BUG-A-03): 200, lưu địa chỉ rỗng                        | Fail   |
| TC-PROFILE-011 | XSS payload trong địa chỉ (Stored XSS)             | EC-ADDR-3                                   | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"<img src=x onerror=alert(1)>"}` | Kỳ vọng sanitize. Thực tế (BUG-A-04): lưu raw → Stored XSS                    | Fail   |
| TC-PROFILE-012 | User thường tự gán role=admin (privilege esc.)     | EC-ROLE-1                                   | `{"name":"Nguyen Van A","phone":"912345678","shipping_address":"123 Le Loi","role":"admin"}` | Kỳ vọng bỏ qua `role`. Thực tế (BUG-A-01): `role`→`admin`                     | Fail   |
| TC-PROFILE-013 | Gọi API không Authorization header                 | EC-AUTH-2                                   | body hợp lệ, không header `Authorization`                                                     | 401 `{"error":"Unauthorized"}`                                               | Pass   |
| TC-PROFILE-014 | Gọi API token giả mạo / sai định dạng              | EC-AUTH-3                                   | body hợp lệ + `Authorization: Bearer invalid_token_xyz`                                       | 403 `{"error":"Forbidden"}`                                                  | Pass   |

## 4. Truy vết coverage (EC ↔ TC)

| Lớp (EC)   | Phủ bởi TC     | Ghi chú                                            |
| ---------- | -------------- | -------------------------------------------------- |
| EC-NAME-1  | TC-PROFILE-001 |                                                    |
| EC-NAME-2  | TC-PROFILE-002 |                                                    |
| EC-NAME-3  | TC-PROFILE-003 |                                                    |
| EC-NAME-4  | TC-PROFILE-004 | Stored XSS qua dangerouslySetInnerHTML             |
| EC-PHONE-1 | TC-PROFILE-001 |                                                    |
| EC-PHONE-2 | TC-PROFILE-005 |                                                    |
| EC-PHONE-3 | TC-PROFILE-006 | Web (client regex) + Postman (server bypass)       |
| EC-PHONE-4 | TC-PROFILE-007 | Biên 8 số xử lý ở BVA                              |
| EC-PHONE-5 | TC-PROFILE-008 | Biên 11 số xử lý ở BVA                             |
| EC-PHONE-6 | TC-PROFILE-009 |                                                    |
| EC-ADDR-1  | TC-PROFILE-001 |                                                    |
| EC-ADDR-2  | TC-PROFILE-010 |                                                    |
| EC-ADDR-3  | TC-PROFILE-011 | Stored XSS qua address                             |
| EC-ROLE-1  | TC-PROFILE-012 | Bug đã xác nhận (server.js:124)                    |
| EC-AUTH-1  | TC-PROFILE-001 | Precondition mọi TC valid                          |
| EC-AUTH-2  | TC-PROFILE-013 |                                                    |
| EC-AUTH-3  | TC-PROFILE-014 |                                                    |

## 5. AI Gap Analysis (bổ sung sau review)

Sau khi AI sinh 14 TC Domain + 4 TC BVA, đối chiếu lại từng TC với code thật. Tìm 6 gap, 2 gap dẫn tới bug nghiêm trọng mới:

| #  | AI bỏ sót                                                                                           | Bổ sung                                        | Nguyên nhân |
| -- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| 1  | GET `/me` (`SELECT *`, server.js:113) rò rỉ `password`+`reset_token`; không TC nào kiểm output GET  | TC-PROFILE-015 + BUG-A-07 (Critical)           | AI framing thiên về input-validation, bỏ output |
| 2  | Partial update ghi NULL (server.js:121 luôn SET cả 3 field); AI luôn gửi đủ 3 field                 | TC-PROFILE-016 + BUG-A-08 (High)               | Gộp "field thiếu" với "field rỗng" |
| 3  | Lớp con "token hợp lệ nhưng hết hạn" chưa tách (jwt.verify err → 403)                                | TC-PROFILE-017                                 | AI coi token nhị phân valid/invalid |
| 4  | `role` giá trị rác ngoài enum (`superadmin`); AI chỉ test `admin`                                   | TC-PROFILE-018                                 | AI chọn ca "hấp dẫn nhất", bỏ phủ kín miền |
| 5  | BUG-A-06 (mobile camelCase) không có TC dẫn                                                          | Tham chiếu chéo Feature D                       | Tách rời "đọc code" và "thiết kế TC" |
| 6  | `name`/`address` không giới hạn độ dài → không chặn trên; AI đánh dấu "không áp dụng BVA"           | TC-PROFILE-019 (~100k ký tự)                   | AI áp quy tắc BVA máy móc |

### Test case bổ sung (015–019, test qua Postman)

| TC ID          | Mô tả                                                        | Phủ gap | Test data / thao tác                                                                      | Expected result                                                                          | Status |
| -------------- | ------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| TC-PROFILE-015 | GET /me không rò rỉ password/reset_token                     | #1      | `GET /api/users/me` với JWT → kiểm field response                                         | Kỳ vọng không chứa `password`,`reset_token`. Thực tế (BUG-A-07): trả cả hai (plaintext)  | Fail   |
| TC-PROFILE-016 | PUT chỉ `{name}` → partial update ghi NULL?                  | #2      | body chỉ `{"name":"Nguyen Van B"}` → `GET /api/users/me`                                   | Kỳ vọng chỉ `name` đổi. Thực tế (BUG-A-08): `phone`/`address` bị set NULL                 | Fail   |
| TC-PROFILE-017 | PUT với JWT đã hết hạn                                        | #3      | body hợp lệ + `Authorization: Bearer <expired_jwt>`                                        | 403 `{"error":"Forbidden"}`                                                              | Pass   |
| TC-PROFILE-018 | User thường gán `role=superadmin` (ngoài enum)               | #4      | `{...,"role":"superadmin"}` → `GET /api/users/me`                                          | Kỳ vọng từ chối. Thực tế: lưu `role="superadmin"` (mở rộng BUG-A-01)                      | Fail   |
| TC-PROFILE-019 | `name`/`address` ~100k ký tự → có giới hạn độ dài?           | #6      | `{"name":"<100k 'A'>",...,"shipping_address":"<100k>"}`                                    | Kỳ vọng 400. Thực tế (dự đoán): 200, lưu nguyên → nguy cơ storage/DoS                     | Fail   |

> Tổng TC Feature A: 23 = 14 (Domain 001–014) + 4 (BVA 101–104, xem [BVA-FR04.md](BVA-FR04.md)) + 5 (Domain bổ sung 015–019).
