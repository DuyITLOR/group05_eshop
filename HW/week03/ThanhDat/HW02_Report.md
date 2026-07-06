# HW02 — Domain Testing & Boundary Value Analysis on EShop — Báo cáo chính

> **Bản tổ chức lại theo file riêng.** Mỗi feature tách thành file EP (Domain Testing) và file BVA riêng trong `tests/test-design/`; bug tách theo module trong `tests/bug-reports/`. Bản này **không kèm ảnh** (bằng chứng thay bằng dẫn chứng dòng code + HTTP thực tế).

## 0. Thông tin sinh viên

| Trường              | Giá trị                                          |
| ------------------- | ------------------------------------------------ |
| Họ tên              | Trương Thành Đạt                                 |
| MSSV                | 23127344                                         |
| Lớp / Nhóm          | Kiểm thử phần mềm - 23KTPM3                      |
| Assignment          | HW02 — Domain Testing & BVA                      |
| GitHub repo (nhóm)  | https://github.com/DuyITLOR/group05_eshop        |

---

## 1. Feature đã chọn

| Ký hiệu   | Pool       | FR ID | Tên feature                 | Module (mã TC) | File EP | File BVA | File Bug |
| --------- | ---------- | ----- | --------------------------- | -------------- | ------- | -------- | -------- |
| Feature A | A          | FR-04 | Personal profile management | `PROFILE`      | [EP-FR04.md](tests/test-design/EP-FR04.md) | [BVA-FR04.md](tests/test-design/BVA-FR04.md) | [bug-report_PROFILE.md](tests/bug-reports/bug-report_PROFILE.md) |
| Feature B | B          | FR-08 | Checkout                    | `CHECKOUT`     | [EP-FR08.md](tests/test-design/EP-FR08.md) | [BVA-FR08.md](tests/test-design/BVA-FR08.md) | [bug-report_CHECKOUT.md](tests/bug-reports/bug-report_CHECKOUT.md) |
| Feature C | C          | FR-18 | Order management (admin)    | `ADMIN_ORDER`  | [EP-FR18.md](tests/test-design/EP-FR18.md) | [BVA-FR18.md](tests/test-design/BVA-FR18.md) | [bug-report_ADMIN_ORDER.md](tests/bug-reports/bug-report_ADMIN_ORDER.md) |
| Feature D | D (Mobile) | D3    | Mobile – Registration       | `MOB_REG`      | [EP-D3.md](tests/test-design/EP-D3.md) | [BVA-D3.md](tests/test-design/BVA-D3.md) | [bug-report_MOB_REG.md](tests/bug-reports/bug-report_MOB_REG.md) |

> **Quy ước mã test case:** `TC-<MODULE>-<NNN>`. Domain Testing dùng số `001…099`; BVA dùng số `101…199` (không trùng).

---

## 2. Test Summary Report (tổng toàn bài)

| Chỉ số             | A   | B   | C   | D   | Tổng |
| ------------------ | --- | --- | --- | --- | ---- |
| Số feature         | 1   | 1   | 1   | 1   | 4    |
| Test case thiết kế | 23  | 20  | 23  | 17  | 83   |
| Đã execute         | 23  | 20  | 23  | 17  | 83   |
| Pass               | 6   | 9   | 17  | 3   | 35   |
| Fail               | 17  | 11  | 5   | 14  | 47   |
| Chưa execute       | 0   | 0   | 0   | 0   | 0    |
| Bug                | 8   | 4   | 3   | 5   | 20   |

> **Ghi chú:**
> - **Feature C** có thêm 1 TC "cần xác minh spec" (TC-ADMIN_ORDER-019 `shipping → canceled`): đã execute (trả 400) nhưng verdict phụ thuộc SRS → `17 Pass + 5 Fail + 1 cần xác minh = 23`. Tổng toàn bài: 35 Pass + 47 Fail + 1 cần xác minh = 83.
> - **Feature A** có 8 bug (BUG-A-01…08); BUG-A-06 (mobile camelCase mismatch) được kiểm chứng chéo ở Feature D. Tổng bug toàn bài (distinct): 20.

---

## 3. Bug Report tổng hợp (không kèm ảnh)

| Bug ID   | Feature | Found by TC                        | Tiêu đề                                                                                         | Severity | Status                    |
| -------- | ------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- | -------- | ------------------------- |
| BUG-A-01 | A       | TC-PROFILE-012                     | Privilege escalation: user thường tự gán `role=admin` qua `PUT /api/users/me`                   | Critical | Confirmed (executed)      |
| BUG-A-02 | A       | TC-PROFILE-004                     | Stored XSS qua `name` + `dangerouslySetInnerHTML` (App.jsx:27)                                  | High     | Confirmed (executed)      |
| BUG-A-03 | A       | TC-PROFILE-002/003/005/007/008/010 | Thiếu validation server-side cho `name`/`phone`/`shipping_address`                              | High     | Confirmed (executed)      |
| BUG-A-04 | A       | TC-PROFILE-011                     | Stored XSS qua `shipping_address`                                                               | Medium   | Confirmed (executed)      |
| BUG-A-05 | A       | TC-PROFILE-006                     | Design bug regex phone: từ chối số VN hợp lệ bắt đầu bằng `0`                                   | Medium   | Confirmed (executed)      |
| BUG-A-06 | A       | _(Mobile, execute ở Feature D)_    | Mobile field mismatch: App.js gửi `shippingAddress` ≠ server đọc `shipping_address`             | Medium   | Open (code review)        |
| BUG-A-07 | A       | TC-PROFILE-015                     | Sensitive Data Exposure: `GET /api/users/me` `SELECT *` trả cả `password`/`reset_token`         | Critical | Confirmed (executed)      |
| BUG-A-08 | A       | TC-PROFILE-016                     | Data loss: partial update ghi NULL đè dữ liệu cũ                                                | High     | Confirmed (executed)      |
| BUG-B-01 | B       | TC-CHECKOUT-102                    | Off-by-one: apply-coupon dùng `>` thay vì `>=` (server.js:379)                                  | High     | Confirmed (executed)      |
| BUG-B-02 | B       | TC-CHECKOUT-009, -103              | Sai công thức percent discount → discount âm, final > total (server.js:399)                     | Critical | Confirmed (executed)      |
| BUG-B-03 | B       | TC-CHECKOUT-002…007                | Thiếu validation server-side cho checkout (`total_amount`, `shipping_address`)                  | High     | Confirmed (executed)      |
| BUG-B-04 | B       | TC-CHECKOUT-015                    | Bypass `max_uses_per_user`: bỏ field `user_id` → bỏ qua kiểm tra số lần dùng                    | Critical | Confirmed (executed)      |
| BUG-C-01 | C       | TC-ADMIN_ORDER-002, -013           | Authorization bypass: `/api/admin/*` không kiểm tra `role=admin`                                | Critical | Confirmed (executed)      |
| BUG-C-02 | C       | TC-ADMIN_ORDER-010                 | State machine bug: cho phép `canceled → delivered` (server.js:550-551)                          | High     | Confirmed (executed)      |
| BUG-C-03 | C       | TC-ADMIN_ORDER-016, -017           | Thiếu input validation cho `status` (thiếu field / rỗng) → thông điệp lỗi sai                   | Medium   | Confirmed (executed)      |
| BUG-D-01 | D       | TC-MOB_REG-002…011, -101           | Thiếu server-side validation `POST /api/register` (name/email/password)                         | High     | Confirmed (executed)      |
| BUG-D-02 | D       | TC-MOB_REG-004                     | Duplicate email: thiếu UNIQUE constraint + không check trùng                                    | High     | Confirmed (executed)      |
| BUG-D-03 | D       | TC-MOB_REG-012                     | Plaintext password storage (server.js:23)                                                       | Critical | Confirmed (executed)      |
| BUG-D-04 | D       | TC-MOB_REG-013                     | Regex client `[^A-Za-z\d]` rộng hơn whitelist SRS `{@$!%*?&}`                                   | Medium   | Confirmed (executed)      |
| BUG-D-05 | D       | TC-MOB_REG-014                     | Thiếu trường "Xác nhận mật khẩu" trên mobile, vi phạm FR-01                                     | Medium   | Confirmed (code review)   |

Chi tiết từng bug (kèm steps/expected/actual) ở các file trong [tests/bug-reports/](tests/bug-reports/).

---

## 4. AI Critique (200–300 từ)

Qua 4 feature, AI sinh test case nhanh và phủ tốt các lớp tương đương "hiển nhiên", nhưng lộ ra năm kiểu thiên lệch lặp lại có hệ thống:

**(1) Thiên về input, bỏ quên output.** AI mặc định "domain testing = validate đầu vào" nên hầu như không assert nội dung response, bỏ sót rò rỉ dữ liệu nhạy cảm (BUG-A-07: `GET /me` trả `password` plaintext) và nội dung JOIN của admin (C gap #6).

**(2) Gộp "field thiếu" với "field rỗng".** AI coi `undefined` và `""` là một lớp, trong khi với `const {x}=req.body` + SQLite chúng cho hành vi khác (NULL vs ""). Lặp ở A gap #2, C gap #3, D gap #1.

**(3) Oracle problem, lấy code làm chân lý.** AI chỉ bắt "code làm sai cái nó có" (BUG-C-02), không thấy "code thiếu cái SRS đòi": thiếu trường xác nhận mật khẩu (BUG-D-05) và regex rộng hơn whitelist SRS (BUG-D-04) chỉ lộ khi đối chiếu README/FR-01.

**(4) Ảo giác độ phủ.** AI gán khống EC↔TC cho bảng truy vết trông kín (C gap #1, #2) dù TC không kích hoạt lớp đó.

**(5) Tuân thủ quy tắc máy móc.** "Không có biên định nghĩa" bị hiểu thành "không cần test" (A gap #6).

**Nguyên tắc rút ra:** human review là bắt buộc, phải tự execute và đọc DB để xác minh, không tin output AI; phải cấp spec nghiệp vụ độc lập làm oracle; và dò chéo mọi bảng coverage. AI là công cụ tăng tốc bản nháp, trách nhiệm đúng/sai cuối cùng thuộc về người kiểm thử.

---

## 5. Self-Assessment Table

| No. | Tiêu chí                              | Điểm tối đa | Tự đánh giá |
| --- | ------------------------------------- | ----------- | ----------- |
| 1   | Feature A (Domain + Boundary)         | 25          | 25          |
| 2   | Feature B (Domain + Boundary)         | 25          | 25          |
| 3   | Feature C (Domain + Boundary)         | 25          | 25          |
| 4   | Feature D (Mobile, Domain + Boundary) | 15          | 15          |
| 5   | Agent Skills                          | 10          | 10          |
|     | **Tổng**                              | **100**     | **100**     |
