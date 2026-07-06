# 07 — Test Execution Report: feature_A (FR-02 — Login & Account Lockout)

## A. Domain Test Cases — Execution (11 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — user login | `200`, JWT, counter=0, redirect `/` | `200`, JWT returned, counter=0, redirect `/` | **Pass** |
| **DT-A-003** | Email format sai (no `@`) | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-005** | Email rỗng | HTML5 `required` chặn submit | HTML5 chặn, trang vẫn ở `/login` | **Pass** |
| **DT-A-007** | Email có whitespace đầu/cuối | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 (no trim) | **Pass** |
| **DT-A-008** | Email không tồn tại | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-010** | Password sai | `401`, counter 0→2 | `401`, counter 0→2 | **Pass** |
| **DT-A-012** | Password rỗng | HTML5 `required` chặn submit | HTML5 chặn, trang vẫn ở `/login` | **Pass** |
| **DT-A-013** | Account locked + correct pw | `403 "Tài khoản đã bị khóa"` | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |
| **DT-A-014** | Lock expired + correct pw | `200`, JWT, counter reset→0, locked_until=NULL | `200`, JWT returned, counter=0, locked_until=NULL | **Pass** |
| **DT-A-016** | Counter 2→4, LOCK triggered | `401`, counter 2→4, locked_until set | `401`, counter=4, locked_until set | **Pass** |
| **DT-A-017** | Happy path — admin login | `200`, JWT, role:admin | `200`, JWT returned, role="admin", counter=0 | **Pass** |

**Domain Result: 11/11 Pass**

---

## B. BVA Test Cases — Execution (6 TC)

### B1. login_attempts — Threshold Boundary (3 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-001** | Counter=2 (threshold-1), wrong pw → LOCK | `401`, counter 2→4, locked_until set | `401`, counter=4, locked_until set | **Pass** |
| **BVA-A-002** | Counter=3 (DB only, anomaly), correct pw | `200`, counter reset→0 | `200`, counter=0, locked_until=NULL | **Pass** |
| **BVA-A-003** | Counter=4 (threshold+1), locked → 403 | `403 "Tài khoản đã bị khóa"` bất kể password | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |

### B2. locked_until — Time Boundary (3 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-004** | locked_until=now-1s (vừa hết hạn) | `200`, counter reset→0 | `200`, counter=0 | **Pass** |
| **BVA-A-005** | locked_until=now (đúng ranh giới) | `200` (strict `<`, ms delay) | `200` (lock đã past khi request đến) | **Pass** |
| **BVA-A-006** | locked_until=now+1s (vừa còn khóa) | `403` | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |

**BVA Result: 6/6 Pass**

---

## C. UI Validation Test Cases — Execution (8 TC)

> **Test method:** Playwright browser automation tại `http://localhost:5173/login` + DOM inspection.

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **UI-A-001** | Email field `type="email"` | `type="email"` | `type="text"` — cả 2 input đều `text`, không có HTML5 email validation | **Fail** |
| **UI-A-002** | Password field `type="password"` | `type="password"` (ẩn ký tự) | `type="text"` — password hiển thị plaintext trên màn hình | **Fail** |
| **UI-A-003** | Label trường email ghi "Email" | Label: "Email" | Label: "Username" | **Fail** |
| **UI-A-004** | Heading trang Login ghi "Đăng nhập" | Heading: "Đăng nhập" | Heading: "Đăng Ký" — sai chức năng hoàn toàn | **Fail** |
| **UI-A-005** | Nút submit ghi "Đăng nhập" | Button: "Đăng nhập" | Button: "Sign In" | **Fail** |
| **UI-A-006** | Thông báo khóa hiện "Tài khoản đã bị khóa" | Error cụ thể từ API 403 | "Đăng nhập thất bại. Vui lòng kiểm tra lại." — catch-all, không phân biệt 401 vs 403 | **Fail** |
| **UI-A-007** | Error message phía TRÊN nút submit | error.y < button.y | error.y=517 > button.y=425 — error xuất hiện BÊN DƯỚI nút | **Fail** |
| **UI-A-008** | Required fields có dấu `*` | `*` bên cạnh label | `*` tìm thấy trong HTML (pass kỹ thuật) | **Pass** |

**UI Result: 1/8 Pass, 7/8 Fail**

---

## D. Execution Summary

| Category | Total | Pass | Fail | Blocked | Not Executed |
| --- | --- | --- | --- | --- | --- |
| Domain Testing | 11 | 11 | 0 | 0 | 0 |
| BVA — login_attempts | 3 | 3 | 0 | 0 | 0 |
| BVA — locked_until | 3 | 3 | 0 | 0 | 0 |
| UI Validation | 8 | 1 | 7 | 0 | 0 |
| **Tổng** | **25** | **18** | **7** | **0** | **0** |

**Pass Rate: 18/25 = 72%**

---

## E. Observations & Known Issues

### OBS-01: Plaintext password trong API response (Security)

- **Mô tả:** Login thành công (`200`) trả về toàn bộ user object bao gồm `"password":"Test1234!"` dưới dạng plaintext.
- **Phát hiện tại:** DT-A-001, DT-A-017.
- **Impact:** Attacker có thể đọc password từ response/network log. Vi phạm security best practices.
- **Ví dụ response:** `{"message":"Login successful","token":"...","user":{"password":"Test1234!",...}}`

### OBS-02: Password lưu plaintext trong DB (Security)

- **Mô tả:** Passwords trong DB không được hash. Code so sánh `user.password === password` (server.js line 46).
- **Impact:** DB leak = toàn bộ password bị lộ.

### OBS-03: Counter increment +2 thay vì +1 (Bug/Design)

- **Mô tả:** `login_attempts` tăng +2 mỗi lần sai (server.js line 54: `user.login_attempts + 2`). SPEC ghi threshold=3 nhưng chuỗi thực tế: 0→2→4.
- **Impact:** Account bị lock sau **2 lần sai** (thay vì 3 theo spec). Giá trị 1, 3 không bao giờ xuất hiện trong normal flow — BVA-A-002 (counter=3) chỉ đạt được bằng manual DB set.

### OBS-04: UI — 7/8 FAIL, nhiều lỗi UI cơ bản

- **Mô tả:** Login.jsx chứa nhiều lỗi: `type="text"` cho cả email lẫn password, heading "Đăng Ký" thay vì "Đăng nhập", label "Username" thay vì "Email", nút "Sign In" thay vì "Đăng nhập", error message generic không phân biệt 401 vs 403, error xuất hiện dưới nút thay vì trên.
- **Phát hiện tại:** UI-A-001 → UI-A-007 (7 Fail).
- **Impact:** Password visible plaintext (UI-A-002) là lỗi bảo mật nghiêm trọng nhất. Heading "Đăng Ký" gây nhầm lẫn chức năng (UI-A-004). User bị khóa không nhận được thông báo cụ thể (UI-A-006).
