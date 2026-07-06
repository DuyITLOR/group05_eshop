# 09 — AI Gap Analysis: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Tự đánh giá trung thực các điểm AI bỏ sót qua 8 steps trước. Phân loại nguyên nhân theo 3 nhóm. Bổ sung test case còn thiếu.
>
> **Self-critique principle:** Mục tiêu là tìm điểm yếu, không tự khen.

---

## A. Gap Analysis Table

| Gap ID | Missed Item (Test Case / Bug) | Cause Type | Detailed Explanation | Added TC ID |
| --- | --- | --- | --- | --- |
| **GAP-A-001** | EC-E-I3 (`@eshop.com` — thiếu local part) có trong `02_domain_table` nhưng bị **drop** khi renumber sang `03_domain_testcases_v1` | **AI Limitation** | AI renumber EC-E-I1→I8 thành EC-E1→E8, bỏ mất EC-E-I3 (missing local part). 02 có 8 invalid email classes nhưng 03_v1 chỉ có 7 (thiếu `@eshop.com`). Đây là lỗi đếm/tracing khi convert giữa 2 file — AI không cross-check lại đầy đủ | DT-A-019 |
| **GAP-A-002** | `02_domain_table` giả định email case-insensitive (line 29: "Case-insensitive matching") — **SAI**, code là case-sensitive | **AI Limitation** | AI viết "email chuẩn thường không phân biệt hoa thường" dựa trên RFC convention, nhưng code `WHERE email = ?` trên SQLite TEXT column là case-sensitive. Giả định sai này mâu thuẫn với chính 01_spec_analysis (đã ghi đúng là case-sensitive). AI không nhất quán giữa 2 file | — (đã có DT-A-002 cover, nhưng domain table cần sửa mô tả) |
| **GAP-A-003** | `02_domain_table` giả định email max 320 chars theo RFC 5321 — **không có ý nghĩa** vì code không enforce bất kỳ length limit nào | **Prompt Quality** | Prompt không yêu cầu phân biệt rõ "spec boundary" vs "implementation boundary". AI tự áp dụng RFC limit làm Max cho BVA, nhưng code backend không có validation → 320 là boundary giả, BVA-A-004/005/006 test boundary không tồn tại trong code | — (BVA vẫn giữ vì RFC context, nhưng cần ghi chú rõ đây là assumed boundary) |
| **GAP-A-004** | Không test `POST /api/login` với body rỗng `{}` hoặc thiếu field (`{ email: "x" }`) | **Feature Complexity** | Code line 33: `const { email, password } = req.body` — nếu body rỗng, `email=undefined`, `password=undefined`. Query `WHERE email = undefined` → no user found → 401. Nếu `password` missing → `user.password === undefined` → false → counter+2. Đây là edge case API-level mà AI không nghĩ đến vì focus vào form input | DT-A-020 |
| **GAP-A-005** | Không test `locked_until` chứa string không phải datetime (format corruption) | **AI Limitation** | Nếu `locked_until = "garbage"`, `new Date("garbage")` trả `Invalid Date`. So sánh `new Date() < Invalid Date` → `false` → lock bị bypass. AI chỉ test valid datetime values (past/future/now) mà không test invalid format — đây là boundary analysis thiếu chiều sâu | BVA-A-028 |
| **GAP-A-006** | Response 200 trả về password plaintext — chỉ ghi OBS, không có formal FAIL test case | **Prompt Quality** | Prompt các steps chỉ yêu cầu Domain Testing + BVA cho functional requirements. Security test nằm ngoài scope explicit. AI ghi nhận qua OBS-01 nhưng không tạo TC vì "không thuộc domain testing". Tuy nhiên, đây là verifiable behavior cần formal TC | DT-A-021 |
| **GAP-A-007** | Không verify chính xác lock duration (180s CODE vs 30s SPEC) | **Feature Complexity** | Tất cả TC chỉ test locked=future hoặc locked=past, không TC nào verify rằng lock được set đúng `now+180000ms`. Cần TC login sai → đọc DB → kiểm tra `locked_until ≈ now+180s`. Đây là temporal verification phức tạp, AI chỉ test input/output mà bỏ qua state verification | BVA-A-029 |
| **GAP-A-008** | Lock extension khi re-fail: BVA-A-016 check counter 4→6 nhưng không verify `locked_until` có được **reset lại** (extend) hay giữ nguyên giá trị cũ | **AI Limitation** | Code line 57: `lockedUntil = new Date(Date.now() + 180000).toISOString()` — mỗi lần sai đều tạo locked_until mới. BVA-A-016 chỉ verify counter tăng + "re-lock triggered" nhưng không verify locked_until timestamp mới > timestamp cũ | — (bổ sung verify step vào BVA-A-016) |

---

## B. Assumptions AI Made (có thể sai)

| # | Assumption | Confidence | Risk if Wrong |
| --- | --- | --- | --- |
| 1 | Email max length = 320 chars (RFC 5321) | Low | BVA boundaries vô nghĩa — code không enforce, SQLite TEXT unlimited |
| 2 | Password max length ~1000 chars (assumed) | Low | Tương tự — code không enforce. 1000 là con số AI tự chọn, không có basis |
| 3 | `express.json()` middleware parse body trước login route | High | Nếu middleware không có, `req.body` = undefined → crash. Nhưng đã verify code line 6 có `app.use(express.json())` |
| 4 | SQLite TEXT comparison là case-sensitive | High | Đã verify qua test DT-A-002. Nhưng SQLite LIKE là case-insensitive — nếu code đổi sang LIKE thì behavior thay đổi |
| 5 | Counter chỉ increment khi email found + password wrong | High | Đã verify: email not found → return 401 early, không qua counter logic |
| 6 | Seed data chỉ có 2 users (admin, test) | Medium | AI chỉ test 2 accounts. Nếu có thêm users, coverage bị hạn chế |

---

## C. Cause Type Distribution

| Cause Type | Count | Gap IDs | Pattern |
| --- | --- | --- | --- |
| **AI Limitation** | 4 | GAP-A-001, 002, 005, 008 | AI thiếu khả năng cross-check nhất quán giữa nhiều file, bỏ sót edge cases ngoài happy path |
| **Prompt Quality** | 2 | GAP-A-003, 006 | Prompt không explicit yêu cầu phân biệt spec vs code boundaries, không yêu cầu security TCs |
| **Feature Complexity** | 2 | GAP-A-004, 007 | Temporal verification và API-level edge cases vượt ngoài domain testing truyền thống |

---

## D. Test Cases Bổ Sung

### Thêm vào `03_domain_testcases_v1.md`:

| Test Case ID | Field | EC ID | Type | Input Value | Expected Result |
| --- | --- | --- | --- | --- | --- |
| **DT-A-019** | email | EC-E-I3 (recovered) | Negative | Email: `@eshop.com` (thiếu local part), Password: `Test1234!`, State: 0/NULL | `401 "Invalid email or password"`, counter NOT incremented |
| **DT-A-020** | email + password | (API edge) | Negative | Body: `{}` (empty JSON, email=undefined, password=undefined) | `401 "Invalid email or password"`, counter NOT incremented (undefined email → user not found) |
| **DT-A-021** | response | (Security) | Negative | Email: `test@eshop.com`, Password: `Test1234!` (correct login) — **verify response body** | `200` nhưng response body KHÔNG được chứa field `password`. **Actual:** response chứa `"password":"Test1234!"` → **FAIL** |

### Thêm vào `05_bva_testcases_v1.md`:

| Test Case ID | Boundary Type | Precondition | Input | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-028** | locked_until = invalid string (corruption) | Set DB: `locked_until='not-a-date'`, counter=4 | Password: `Test1234!` (correct) | Nên trả `403` (account locked). **Actual:** `new Date("not-a-date")` → Invalid Date → comparison false → lock bypass → `200` → **FAIL** |
| **BVA-A-029** | Lock duration verification | Counter=0, Locked=NULL | Password: `WrongPass!` (wrong) → sau khi response, **đọc DB locked_until** | `locked_until` phải ≈ `now + 180s` (±2s tolerance). Verify code set đúng 180000ms. SPEC nói 30s → **FAIL** (nếu test theo spec) |

---

## E. Summary

| Metric | Value |
| --- | --- |
| Gaps found | 8 |
| Wrong assumptions | 6 |
| Test cases bổ sung | 5 (DT-A-019, 020, 021, BVA-A-028, 029) |
| Tổng TC sau bổ sung | 50 + 5 = **55 TC** |
| AI Limitation gaps | 4/8 (50%) |
| Prompt Quality gaps | 2/8 (25%) |
| Feature Complexity gaps | 2/8 (25%) |

> **Nhận xét tổng:** AI mạnh ở systematic enumeration (EC listing, BVA table) nhưng yếu ở cross-file consistency (GAP-001, 002), security-oriented thinking (GAP-005, 006), và temporal/state verification (GAP-007, 008). Prompt cần explicit hơn về scope (bao gồm security? API edge?) để AI không tự giới hạn.
