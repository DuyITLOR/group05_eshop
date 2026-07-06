# Bug Report — Feature D / D3 Mobile Registration (Module `MOB_REG`)

> Không kèm ảnh. Bằng chứng thay bằng dẫn chứng dòng code + HTTP thực tế + đọc DB. Nguồn TC: [EP-D3.md](../test-design/EP-D3.md), [BVA-D3.md](../test-design/BVA-D3.md).

| Bug ID   | Found by TC                                              | Tiêu đề                                                                                                                                                                     | Severity |
| -------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BUG-D-01 | TC-MOB_REG-002..008, TC-MOB_REG-009..011, TC-MOB_REG-101 | Thiếu server-side validation: `POST /api/register` (server.js:20-30) không validate name/email/password; rỗng, sai định dạng, thiếu field đều được INSERT thẳng vào DB      | High     |
| BUG-D-02 | TC-MOB_REG-004                                           | Duplicate email: `database.js` không có UNIQUE trên cột `email` + server không check trùng → đăng ký nhiều tài khoản cùng email thành công                                  | High     |
| BUG-D-03 | TC-MOB_REG-012                                           | Plaintext password storage: `server.js:23` INSERT password trực tiếp không qua hashing (bcrypt/argon2)                                                                     | Critical |
| BUG-D-04 | TC-MOB_REG-013                                           | Regex client không khớp whitelist SRS: `App.js:212` dùng `[^A-Za-z\d]` chấp nhận MỌI ký tự đặc biệt (`#`, `^`, dấu cách...), SRS FR-01 chỉ cho `@ $ ! % * ? &`             | Medium   |
| BUG-D-05 | TC-MOB_REG-014                                           | Thiếu trường "Xác nhận mật khẩu": form Register mobile (`App.js`) không có confirm password, vi phạm SRS FR-01 (README.md:35)                                              | Medium   |

## Chi tiết

### BUG-D-01 — Thiếu server-side validation (High)
- **Found by:** TC-MOB_REG-002…008, -009…011, -101
- **Steps:** `POST /api/register` với name/email/password rỗng, sai định dạng, thiếu field, password yếu/ngắn.
- **Expected:** 400 báo lỗi tương ứng.
- **Actual:** 200, INSERT thẳng vào DB (server.js:20-30 không validate); thiếu field → NULL.

### BUG-D-02 — Duplicate email (High)
- **Found by:** TC-MOB_REG-004
- **Steps:** `POST /api/register` với `email=test@eshop.com` (đã tồn tại trong seed).
- **Expected:** 400/409 "email đã được sử dụng".
- **Actual:** 200, tạo tài khoản thứ 2. `database.js` không UNIQUE cột `email`, server không check trùng → DB có 2 bản ghi `test@eshop.com` (count=2).

### BUG-D-03 — Plaintext password storage (Critical)
- **Found by:** TC-MOB_REG-012
- **Steps:** Đăng ký `hash@domain.com` → `SELECT password FROM users WHERE email='hash@domain.com'`.
- **Expected:** DB lưu giá trị hash (bcrypt/argon2).
- **Actual:** DB lưu `"Abcd123!"` plaintext (server.js:23 INSERT trực tiếp không hash).

### BUG-D-04 — Regex client rộng hơn whitelist SRS (Medium)
- **Found by:** TC-MOB_REG-013
- **Steps:** Đăng ký với `password=Abcd123#`.
- **Expected (SRS FR-01):** từ chối `#` (chỉ cho `@ $ ! % * ? &`).
- **Actual:** regex `[^A-Za-z\d]` (App.js:212) chấp nhận `#` (test=true) → API 200, INSERT (id=13). Code (regex) rộng hơn spec → spec ≠ code.

### BUG-D-05 — Thiếu trường "Xác nhận mật khẩu" (Medium)
- **Found by:** TC-MOB_REG-014 (xác minh qua code review)
- **Steps:** Mở màn Register trên app, tìm trường xác nhận mật khẩu.
- **Expected (SRS FR-01, README.md:35):** có trường xác nhận, từ chối nếu 2 mật khẩu không khớp.
- **Actual:** form mobile chỉ có `registerName/registerEmail/registerPassword`, KHÔNG có confirm password → bỏ qua hoàn toàn yêu cầu SRS.

## Kết quả execute Feature D

| Chỉ số             | Số lượng                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Test case thiết kế | 17 (8 Domain + 3 BVA + 6 bổ sung sau review 009–014)                                         |
| Đã execute         | 17 (16 qua API/curl + đọc DB; TC-014 xác minh qua code review)                               |
| Pass               | 3 (TC-001 happy path, TC-102 biên 8 ký tự, TC-103 9 ký tự)                                   |
| Fail (lộ bug)      | 14 (TC-002…008, 101, 009…013, 014)                                                           |
| Bug xác nhận       | 5 (BUG-D-01 High, D-02 High, D-03 Critical, D-04 Medium, D-05 Medium)                         |
