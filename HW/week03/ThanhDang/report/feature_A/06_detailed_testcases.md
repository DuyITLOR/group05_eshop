# 06 — Detailed Test Cases (Domain + BVA): feature_A (FR-02) (v2)

> **Scope:** Gộp Domain Test Cases (DT-A) từ `03_domain_testcases_v2.md`, BVA Test Cases (BVA-A) từ `05_bva_testcases_v2.md`, và UI Validation TCs thành bảng chi tiết đầy đủ, sẵn sàng thực thi.
>
> **Nguyên tắc:** Mỗi TC trong file này trace về đúng 1 TC trong source file. Không thêm TC mới.

---

## A. Domain Test Cases — Chi tiết (11 TC)

> Source: `03_domain_testcases_v2.md` — 11 TCs (tối ưu từ 18, giữ nguyên IDs gốc)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — login thành công (user) | Backend running. Tài khoản `test@eshop.com` tồn tại, counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset=0, redirect Home | | |
| **DT-A-003** | Email format sai (EC-E3 + EC-E4) | Backend running | 1. Mở trang Login 2. Nhập email sai format 3. Nhập password valid 4. Bấm Sign In | Email: `testeshop.com` (no `@`), Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented. *(Covers EC-E4 — same behavior.)* | | |
| **DT-A-005** | Email rỗng (EC-E5) | Backend running | 1. Mở trang Login 2. Để trống email 3. Nhập password valid 4. Bấm Sign In | Email: *(empty)*, Password: `Test1234!` | HTML5 `required` chặn submit; nếu bypass → `401` | | |
| **DT-A-007** | Email có whitespace (EC-E7) | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email có space đầu/cuối 3. Nhập password valid 4. Bấm Sign In | Email: ` test@eshop.com `, Password: `Test1234!` | `401` (exact match fails, no trim), counter NOT incremented | | |
| **DT-A-008** | Email không tồn tại trong DB (EC-E2 + EC-E8) | Backend running | 1. Mở trang Login 2. Nhập email không tồn tại 3. Nhập password 4. Bấm Sign In | Email: `unknown@eshop.com`, Password: `Test1234!` | `401`, counter NOT incremented. *(Covers EC-E2 — case mismatch = same user-not-found behavior.)* | | |
| **DT-A-010** | Password sai (EC-P2 + EC-P3 + EC-P4) | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password sai 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test123!` (thiếu char) | `401`, counter 0 → 2. *(Covers EC-P2 case mismatch và EC-P4 trailing space — cùng outcome.)* | | |
| **DT-A-012** | Password rỗng (EC-P5) | Backend running. Counter=0 | 1. Mở trang Login 2. Nhập email valid 3. Để trống password 4. Bấm Sign In | Email: `test@eshop.com`, Password: *(empty)* | HTML5 blocks; nếu bypass → `401`, counter → 2 | | |
| **DT-A-013** | Account locked (EC-S2) | Backend running. Set DB: counter=4, locked_until=future | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`. Lock check trước password — kết quả không đổi dù password đúng hay sai. | | |
| **DT-A-014** | Lock expired — unlock flow (EC-S3) | Backend running. Set DB: counter=4, locked_until=past (expired) | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset → 0, locked_until cleared | | |
| **DT-A-016** | Threshold crossing — counter 2→4, LOCK (EC-S1 + EC-P3) | Backend running. Set DB: counter=2, locked=NULL | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In 4. Verify counter + locked_until | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2 → 4 (≥3), account LOCKED, locked_until set. *(Also covers first-fail counter increment behavior.)* | | |
| **DT-A-017** | Happy path — login thành công (admin) | Backend running. Tài khoản `admin@eshop.com` tồn tại, counter=0, unlocked | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `admin@eshop.com`, Password: `Admin123!` | `200`, JWT với `role: admin`, redirect Home | | |

---

## B. BVA Test Cases — Chi tiết (6 TC)

> Source: `05_bva_testcases_v2.md` — BVA-A-001 → BVA-A-006
>
> Chỉ test 2 field có behavioral boundary thực trong code: `login_attempts` (threshold=3) và `locked_until` (now).

### B1. login_attempts — Threshold Boundary (3 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-001** | Counter=2 (threshold-1) — wrong pw → LOCK | Backend running. Set DB: `login_attempts=2`, `locked_until=NULL` | 1. POST `/api/auth/login` với password sai 2. Verify DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`. Counter 2→4 (`2+2=4 ≥ 3`). `locked_until` được set → **LOCK triggered**. | | |
| **BVA-A-002** | Counter=3 (threshold exact, DB only) — correct pw | Backend running. Set DB: `login_attempts=3`, `locked_until=NULL` *(normal flow không bao giờ đạt value này)* | 1. POST `/api/auth/login` với password đúng 2. Verify response | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned. Counter reset → 0. *(Anomaly: SPEC threshold=3 nhưng code nhảy 0→2→4, value=3 không xuất hiện trong normal flow)* | | |
| **BVA-A-003** | Counter=4 (threshold+1), locked — any login | Backend running. Set DB: `login_attempts=4`, `locked_until=future` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`. Login bị block trước khi check password. | | |

### B2. locked_until — Time Boundary (3 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-004** | locked_until=now-1s (vừa hết hạn) | Backend running. Set DB: `locked_until=now()-1s`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng ngay sau khi set | Email: `test@eshop.com`, Password: `Test1234!` | `200`. Lock đã expired (`now > locked_until`). Counter reset → 0. | | |
| **BVA-A-005** | locked_until=now (đúng ranh giới) | Backend running. Set DB: `locked_until=now()` | 1. POST `/api/auth/login` với password đúng ngay lập tức | Email: `test@eshop.com`, Password: `Test1234!` | `200` (code dùng strict `<`: `now < locked_until` → false tại now() → expired). Timing-sensitive. | | |
| **BVA-A-006** | locked_until=now+1s (vừa còn khóa) | Backend running. Set DB: `locked_until=now()+1s`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng ngay lập tức | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`. Lock chưa hết hạn (`now < locked_until`). | | |

---

## C. UI Validation Test Cases (FR-21, FR-22, FR-24)

> Các requirement giao diện quy định ràng buộc **presentation** cho form Login. Không phải data boundary nhưng là testable requirement cần phủ.

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **UI-A-001** | Email field phải dùng `type="email"` | Frontend web chạy tại `:5173` | 1. Mở trang Login 2. Inspect element trường Email 3. Kiểm tra attribute `type` | N/A (inspect DOM) | `type="email"` (HTML5 format validation) `[FR-22]` | | |
| **UI-A-002** | Password field phải dùng `type="password"` (ẩn ký tự) | Frontend web chạy | 1. Mở trang Login 2. Nhập password bất kỳ 3. Quan sát ký tự có bị ẩn không 4. Inspect attribute `type` | Password: `Test1234!` | Ký tự bị ẩn (dots/asterisks), `type="password"` `[FR-22]` | | |
| **UI-A-003** | Label trường email phải ghi "Email" | Frontend web chạy | 1. Mở trang Login 2. Đọc label của trường nhập email | N/A (visual) | Label ghi "Email" (không phải "Username") `[FR-22]` | | |
| **UI-A-004** | Heading trang Login phải ghi "Đăng nhập" | Frontend web chạy | 1. Mở trang Login 2. Đọc heading (h1 hoặc h2) | N/A (visual) | Heading ghi "Đăng nhập" (không phải "Đăng Ký") `[FR-21]` | | |
| **UI-A-005** | Nút submit phải ghi tiếng Việt | Frontend web chạy | 1. Mở trang Login 2. Đọc text nút submit | N/A (visual) | Nút ghi "Đăng nhập" (không phải "Sign In") `[FR-21]` | | |
| **UI-A-006** | Thông báo lỗi khi bị khóa phải hiện rõ | Frontend + Backend chạy. Set DB: counter=4, locked=future | 1. Mở Login 2. Nhập email + password đúng 3. Submit 4. Quan sát thông báo lỗi | Email: `test@eshop.com`, Password: `Test1234!` | Hiển thị "Tài khoản đã bị khóa" (không phải thông báo chung "Đăng nhập thất bại") `[FR-02]` | | |
| **UI-A-007** | Thông báo lỗi phải hiển thị **trên** nút submit | Frontend chạy | 1. Mở Login 2. Nhập sai email/password 3. Submit 4. Quan sát vị trí error message | Email: `test@eshop.com`, Password: `WrongPass!` | Error message xuất hiện **phía trên** nút submit (không phải bên dưới) `[FR-22]` | | |
| **UI-A-008** | Các trường bắt buộc phải có dấu `*` | Frontend chạy | 1. Mở trang Login 2. Kiểm tra label Email và Password có dấu `*` bên cạnh | N/A (visual) | Cả Email và Password có `*` cạnh label `[FR-22]` | | |

---

## Thống kê

| Nhóm | Số TC | ID Range | Source |
| --- | --- | --- | --- |
| Domain Testing | 11 | DT-A-001, 003, 005, 007, 008, 010, 012, 013, 014, 016, 017 | `03_domain_testcases_v2.md` |
| BVA — login_attempts | 3 | BVA-A-001 → BVA-A-003 | `05_bva_testcases_v2.md` |
| BVA — locked_until | 3 | BVA-A-004 → BVA-A-006 | `05_bva_testcases_v2.md` |
| UI Validation | 8 | UI-A-001 → UI-A-008 | FR-21, FR-22, FR-24 |
| **Tổng** | **25** | | |
