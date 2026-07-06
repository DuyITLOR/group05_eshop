# EP-D3 — Domain Testing (Equivalence Class Partitioning): Mobile – Registration

**Feature:** D3 — Mobile Registration · **Module:** `MOB_REG`
**Kỹ thuật:** ISTQB FL §4.2.1 Equivalence Partitioning (single-fault assumption)
**File liên quan:** [BVA-D3.md](BVA-D3.md) · [bug-report_MOB_REG.md](../bug-reports/bug-report_MOB_REG.md)

## 0. Mô tả & nguồn tham chiếu

- **Chức năng:** Đăng ký tài khoản mới trên app mobile (React Native/Expo). Gửi `{ name, email, password }` tới `POST /api/register`.
- **Endpoint / màn hình:** màn hình "Register" trong frontend-mobile/App.js; API `POST /api/register`.
- **Nguồn đã đọc:**
  - frontend-mobile/App.js:209-239: `handleRegister` chỉ validate password bằng regex `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$`; `name`, `email` không validate client.
  - backend/server.js:20-30: `POST /api/register` không validate, INSERT thẳng vào DB.
  - backend/database.js:50-61: cột `email` không UNIQUE → cho phép trùng email.
- **Môi trường test (đã execute thật):** Windows 11 25H2, Node v22.22.1, backend `http://localhost:3000`, gọi `POST /api/register` bằng `curl`, đọc DB bằng `sqlite3`.
  - **Phạm vi:** toàn bộ bug ở tầng API/backend → test trực tiếp API. Luồng UI mobile end-to-end cần Expo Go/emulator (ghi nhận gap #4).

> ⚠️ **Điểm nghi vấn:** email không UNIQUE + không kiểm trùng → đăng ký nhiều tài khoản cùng email. Password lưu plaintext.

## 1. Các bước áp dụng (step-by-step)

1. **Liệt kê biến:** `name`, `email`, `password`.
2. **Miền & ràng buộc (từ code):** `name` text tự do, client + server không validate; `email` không validate định dạng, không kiểm trùng, DB không UNIQUE; `password` client validate regex (≥8 ký tự + đủ 4 loại), server không validate, lưu plaintext.
3. **Phát hiện thêm:** thiếu server-side validation toàn bộ (bypass qua API trực tiếp); plaintext password (server.js:23); duplicate email không bị chặn.
4. **Phân vùng tương đương:** xem §2 (10 lớp).
5. **Chọn đại diện:** mỗi lớp 1 giá trị điển hình.
6. **Thiết kế TC:** single-fault; test qua REST Client trực tiếp (bypass mobile app) để phơi bày thiếu server-side validation.

## 2. Bảng phân tích Equivalence Classes

| Biến       | Lớp (EC)    | Loại    | Mô tả lớp                                      | Giá trị đại diện |
| ---------- | ----------- | ------- | ---------------------------------------------- | ---------------- |
| `name`     | EC-MNAME-1  | Valid   | Không rỗng                                     | `Nguyen Van A`   |
| `name`     | EC-MNAME-2  | Invalid | Rỗng                                           | `""`             |
| `email`    | EC-MEMAIL-1 | Valid   | Đúng định dạng & chưa tồn tại                  | `new@domain.com` |
| `email`    | EC-MEMAIL-2 | Invalid | Sai định dạng                                  | `abc@`           |
| `email`    | EC-MEMAIL-3 | Invalid | Đã tồn tại (kỳ vọng từ chối; nghi BUG cho qua) | `test@eshop.com` |
| `password` | EC-MPWD-1   | Valid   | ≥8 ký tự, đủ 4 loại                            | `Abcd123!`       |
| `password` | EC-MPWD-2   | Invalid | Thiếu chữ hoa                                  | `abcd123!`       |
| `password` | EC-MPWD-3   | Invalid | Thiếu số                                       | `Abcdefg!`       |
| `password` | EC-MPWD-4   | Invalid | Thiếu ký tự đặc biệt                           | `Abcd1234`       |
| `password` | EC-MPWD-5   | Invalid | <8 ký tự                                       | `Ab1!`           |

## 3. Test cases — Domain Testing

| TC ID          | Mô tả                                              | Phủ EC                             | Test data (Body JSON)                                                     | Expected result                                                                                | Status |
| -------------- | -------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| TC-MOB_REG-001 | Happy path, đăng ký thành công                     | EC-MNAME-1, EC-MEMAIL-1, EC-MPWD-1 | `{"name":"Nguyen Van A","email":"new@domain.com","password":"Abcd123!"}`  | 200 `{"message":"User registered successfully","id":<n>}`                                       | Pass   |
| TC-MOB_REG-002 | name rỗng qua API (bypass mobile)                  | EC-MNAME-2                         | `{"name":"","email":"new2@domain.com","password":"Abcd123!"}`             | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT name=""                                            | Fail   |
| TC-MOB_REG-003 | email sai định dạng qua API                        | EC-MEMAIL-2                        | `{"name":"Nguyen Van A","email":"abc@","password":"Abcd123!"}`            | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT email="abc@"                                       | Fail   |
| TC-MOB_REG-004 | email đã tồn tại (kỳ vọng từ chối)                 | EC-MEMAIL-3                        | `{"name":"Nguyen Van B","email":"test@eshop.com","password":"Abcd123!"}`  | Kỳ vọng 400/409. Thực tế (BUG-D-02): 200, `test@eshop.com` có 2 bản ghi                         | Fail   |
| TC-MOB_REG-005 | password thiếu chữ hoa (mobile chặn; API không)    | EC-MPWD-2                          | `{"name":"Nguyen Van A","email":"new3@domain.com","password":"abcd123!"}` | Mobile: "Mật khẩu quá yếu!". Server: kỳ vọng 400; thực tế (BUG-D-01): 200, INSERT              | Fail   |
| TC-MOB_REG-006 | password thiếu chữ số                              | EC-MPWD-3                          | `{"name":"Nguyen Van A","email":"new4@domain.com","password":"Abcdefg!"}` | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT                                                    | Fail   |
| TC-MOB_REG-007 | password thiếu ký tự đặc biệt                      | EC-MPWD-4                          | `{"name":"Nguyen Van A","email":"new5@domain.com","password":"Abcd1234"}` | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT                                                    | Fail   |
| TC-MOB_REG-008 | password < 8 ký tự                                 | EC-MPWD-5                          | `{"name":"Nguyen Van A","email":"new6@domain.com","password":"Ab1!"}`     | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT `"Ab1!"`                                           | Fail   |

## 4. Truy vết coverage (EC ↔ TC)

| Lớp (EC)    | Phủ bởi TC     | Ghi chú                                                           |
| ----------- | -------------- | ----------------------------------------------------------------- |
| EC-MNAME-1  | TC-MOB_REG-001 |                                                                   |
| EC-MNAME-2  | TC-MOB_REG-002 | Server chấp nhận name="" → BUG-D-01                               |
| EC-MEMAIL-1 | TC-MOB_REG-001 |                                                                   |
| EC-MEMAIL-2 | TC-MOB_REG-003 | Server không validate email format → BUG-D-01                     |
| EC-MEMAIL-3 | TC-MOB_REG-004 | BUG-D-02: thiếu UNIQUE + không check trùng                        |
| EC-MPWD-1   | TC-MOB_REG-001 |                                                                   |
| EC-MPWD-2   | TC-MOB_REG-005 | Client chặn regex; bypass API → BUG-D-01                          |
| EC-MPWD-3   | TC-MOB_REG-006 | Client chặn regex; bypass API → BUG-D-01                          |
| EC-MPWD-4   | TC-MOB_REG-007 | Client chặn regex; bypass API → BUG-D-01                          |
| EC-MPWD-5   | TC-MOB_REG-008 | Client chặn regex; bypass API → BUG-D-01                          |

## 5. AI Gap Analysis (bổ sung sau review)

Dựng backend, execute thật 15 TC qua `curl` + đọc DB SQLite, đối chiếu với cả code LẪN SRS (README.md FR-01). 6 gap; 2 gap (#5, #6) dẫn tới 2 bug mới (BUG-D-04, BUG-D-05) mà AI hoàn toàn không thấy.

> **Bằng chứng execute:** 15/15 TC đã chạy, mọi request trả 200 kể cả name rỗng, email sai, password yếu, thiếu field, email trùng. DB xác nhận: `password` plaintext, field thiếu lưu NULL (khác `""`), `test@eshop.com` có 2 bản ghi. → BUG-D-01/02/03 xác nhận bằng execute.

| #    | AI bỏ sót                                                                                             | Bổ sung                                        | Nguyên nhân |
| ---- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| 1    | Lớp "field vắng mặt" ≠ "field rỗng" (`undefined`→NULL khác `""`)                                     | TC-MOB_REG-009/010/011 (thiếu name/email/password) | Gộp "field thiếu" với "field rỗng" |
| 2    | Không TC xác minh password lưu plaintext (BUG-D-03 chỉ ghi ở §0, không có TC đọc DB)                  | TC-MOB_REG-012 (đọc DB assert plaintext)       | Tách rời "đọc code phát hiện bug" và "TC thực thi" |
| 3    | Không TC kiểm response body không trả `password`                                                      | TC-MOB_REG-012 kiêm assert response            | AI bỏ output-assertion |
| 4    | Không TC mobile UI end-to-end                                                                          | Ghi chú: cần test manual trên emulator          | Giới hạn scope/tool (API-only) |
| 5 ⭐ | Bỏ sót HOÀN TOÀN biến "Xác nhận mật khẩu" (SRS FR-01 bắt buộc); form mobile không có confirm password | Biến `confirmPassword` + EC + TC-MOB_REG-014 + BUG-D-05 | Skill không dẫn đọc README/SRS; bug "missing requirement" là sự VẮNG MẶT |
| 6 ⭐ | Bỏ sót lớp "ký tự đặc biệt NGOÀI whitelist SRS `{@$!%*?&}`"; regex `[^A-Za-z\d]` chấp nhận mọi ký tự  | EC-MPWD-6 + TC-MOB_REG-013 (`Abcd123#`) + BUG-D-04 | AI lấy regex code làm oracle, không đối chiếu SRS |

### Test case bổ sung (009–014)

| TC ID          | Mô tả                                                                         | Phủ gap    | Test data / thao tác                                                                                     | Expected result                                                                                                    | Status |
| -------------- | ----------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------ |
| TC-MOB_REG-009 | Body thiếu field `name` → undefined→NULL                                     | #1         | `{"email":"gap9@domain.com","password":"Abcd123!"}`                                                      | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT name=NULL                                                             | Fail   |
| TC-MOB_REG-010 | Body thiếu field `email`                                                      | #1         | `{"name":"Nguyen Van A","password":"Abcd123!"}`                                                          | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT email=NULL                                                            | Fail   |
| TC-MOB_REG-011 | Body thiếu field `password`                                                   | #1         | `{"name":"Nguyen Van A","email":"gap11@domain.com"}`                                                     | Kỳ vọng 400. Thực tế (BUG-D-01): 200, INSERT password=NULL                                                         | Fail   |
| TC-MOB_REG-012 | Đăng ký xong đọc DB → assert password plaintext                              | #2, #3     | POST register `hash@domain.com` → `SELECT password FROM users WHERE email='hash@domain.com'`             | Response không chứa `password`; DB kỳ vọng hash. Thực tế (BUG-D-03): DB lưu `"Abcd123!"` plaintext                 | Fail   |
| TC-MOB_REG-013 | password có ký tự đặc biệt NGOÀI whitelist SRS (`#`)                          | #6         | `{"name":"SpecChar","email":"spec@domain.com","password":"Abcd123#"}`                                   | Kỳ vọng (SRS): từ chối `#`. Thực tế (BUG-D-04): regex `[^A-Za-z\d]` chấp nhận `#` → API 200, INSERT                | Fail   |
| TC-MOB_REG-014 | Trường "Xác nhận mật khẩu" — mobile có chặn khi 2 mật khẩu khác nhau?         | #5         | Kiểm chứng qua đọc `App.js` (`handleRegister`, state chỉ có name/email/password)                        | Kỳ vọng (SRS FR-01): có trường xác nhận, từ chối nếu khác. Thực tế (BUG-D-05): form mobile KHÔNG có confirm password | Fail   |

> Gap #4 (mobile UI end-to-end) cần test thủ công trên emulator. Tổng TC Feature D: 17 = 8 (Domain 001–008) + 3 (BVA 101–103, xem [BVA-D3.md](BVA-D3.md)) + 6 (Domain bổ sung 009–014).
