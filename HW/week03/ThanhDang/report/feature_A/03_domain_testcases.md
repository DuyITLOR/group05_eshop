# 03 — Domain Test Cases: feature_A (FR-02 — Login & Account Lockout) (v2)

> **Scope:** Bộ test case domain tối ưu — mỗi TC đại diện cho một **hành vi hệ thống khác biệt**. Các TC có cùng outcome và code path đã được gộp lại. Tổng: 11 TC (giảm từ 18).

---

## 1. Equivalence Classes Summary

### Email

| EC ID | Class Description | Type |
| --- | --- | --- |
| EC-E1 | Valid format, exists in DB, exact case match | Valid |
| EC-E2 | Valid format, exists in DB, case mismatch | Invalid |
| EC-E3 | Invalid format — missing `@` | Invalid |
| EC-E4 | Invalid format — missing domain | Invalid |
| EC-E5 | Empty / null | Invalid |
| EC-E7 | Valid format, contains whitespace (not trimmed) | Invalid |
| EC-E8 | Valid format, not in DB | Invalid |

> **EC-E6 (email too long):** Reclassified → robustness testing. Không có behavioral boundary trong code, expected result không xác định (`401` hoặc `500`). Không thuộc domain testing.

### Password

| EC ID | Class Description | Type |
| --- | --- | --- |
| EC-P1 | Exact match with stored password | Valid |
| EC-P2 | Case mismatch | Invalid |
| EC-P3 | Character difference | Invalid |
| EC-P4 | Contains extra whitespace | Invalid |
| EC-P5 | Empty / null | Invalid |

### Account State

| EC ID | Class Description | Type |
| --- | --- | --- |
| EC-S1 | `login_attempts=0`, `locked_until=NULL` — fresh account | Valid |
| EC-S2 | `login_attempts>=3`, `locked_until=future` — currently locked | Invalid |
| EC-S3 | `login_attempts>=3`, `locked_until=past` — lock expired | Valid |

---

## 2. Domain Test Matrix (11 TC)

| TC | EC tested | Email | Password | State (attempts / locked) | Expected |
| --- | --- | --- | --- | --- | --- |
| DT-A-001 | EC-E1, EC-P1, EC-S1 | `test@eshop.com` | `Test1234!` | 0 / NULL | `200` |
| DT-A-003 | EC-E3, EC-E4 *(merged)* | `testeshop.com` | `Test1234!` | 0 / NULL | `401`, no counter |
| DT-A-005 | EC-E5 | *(empty)* | `Test1234!` | 0 / NULL | Form blocked / `401` |
| DT-A-007 | EC-E7 | ` test@eshop.com ` | `Test1234!` | 0 / NULL | `401`, no counter |
| DT-A-008 | EC-E2, EC-E8 *(merged)* | `unknown@eshop.com` | `Test1234!` | 0 / NULL | `401`, no counter |
| DT-A-010 | EC-P2, EC-P3, EC-P4 *(merged)* | `test@eshop.com` | `Test123!` | 0 / NULL | `401`, counter → 2 |
| DT-A-012 | EC-P5 | `test@eshop.com` | *(empty)* | 0 / NULL | Form blocked / `401`, counter → 2 |
| DT-A-013 | EC-S2 | `test@eshop.com` | `Test1234!` | 4 / future | `403` |
| DT-A-014 | EC-S3 | `test@eshop.com` | `Test1234!` | 4 / past | `200`, counter reset |
| DT-A-016 | EC-S1 + EC-P3 | `test@eshop.com` | `WrongPass!` | 2 / NULL | `401`, counter 2→4, **LOCK** |
| DT-A-017 | EC-E1 (admin) | `admin@eshop.com` | `Admin123!` | 0 / NULL | `200`, role=admin |

---

## 3. Domain Test Case Details

| Test Case ID | EC ID | Type | Input | Expected Result |
| --- | --- | --- | --- | --- |
| **DT-A-001** | EC-E1, EC-P1, EC-S1 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, State: attempts=0, unlocked | `200 OK`. JWT returned. `login_attempts` reset → 0. Redirect Home. |
| **DT-A-003** | EC-E3 + EC-E4 | Negative | Email: `testeshop.com` (no `@`), Password: `Test1234!`, State: attempts=0 | `401 "Invalid email or password"`. Counter NOT incremented. *(Covers EC-E4 — missing domain produces same behavior.)* |
| **DT-A-005** | EC-E5 | Negative | Email: *(empty)*, Password: `Test1234!`, State: attempts=0 | HTML5 `required` blocks submit. If bypassed → `401`. Counter NOT incremented. |
| **DT-A-007** | EC-E7 | Negative | Email: ` test@eshop.com ` (leading/trailing spaces), Password: `Test1234!`, State: attempts=0 | `401`. Counter NOT incremented. *(Verifies system does NOT trim email before lookup.)* |
| **DT-A-008** | EC-E2 + EC-E8 | Negative | Email: `unknown@eshop.com`, Password: `Test1234!`, State: attempts=0 | `401`. Counter NOT incremented. *(Covers EC-E2 — case mismatch produces same user-not-found behavior.)* |
| **DT-A-010** | EC-P2 + EC-P3 + EC-P4 | Negative | Email: `test@eshop.com`, Password: `Test123!` (missing char), State: attempts=0 | `401`. `login_attempts` 0 → 2. *(Covers EC-P2 case mismatch and EC-P4 trailing space — all wrong passwords produce same outcome.)* |
| **DT-A-012** | EC-P5 | Negative | Email: `test@eshop.com`, Password: *(empty)*, State: attempts=0 | HTML5 `required` blocks submit. If bypassed → `401`, counter → 2. |
| **DT-A-013** | EC-S2 | Negative | Email: `test@eshop.com`, Password: `Test1234!` (correct), State: attempts=4, locked_until=future | `403 "Tài khoản đã bị khóa"`. Login blocked regardless of password. *(Lock check precedes password check — covers both correct and wrong pw scenarios.)* |
| **DT-A-014** | EC-S3 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, State: attempts=4, locked_until=past (expired) | `200 OK`. JWT returned. `login_attempts` reset → 0. `locked_until` cleared. |
| **DT-A-016** | EC-S1 + EC-P3 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, State: attempts=2, unlocked | `401`. `login_attempts` 2 → 4 (≥ 3). Account LOCKED. `locked_until` set. *(Also demonstrates counter increment behavior, subsuming DT-A-015.)* |
| **DT-A-017** | EC-E1 (admin) | Positive | Email: `admin@eshop.com`, Password: `Admin123!`, State: attempts=0, unlocked | `200 OK`. JWT với `role: admin`. *(Distinct behavior from DT-A-001: admin role in token.)* |

---

## 4. Removed / Merged Cases

| TC | Action | Reason |
| --- | --- | --- |
| DT-A-002 | Merged → DT-A-008 | Email case mismatch and email not in DB both result in user-not-found → `401`, no counter. Same code path. |
| DT-A-004 | Merged → DT-A-003 | Missing domain produces identical behavior to missing `@` (invalid format → `401`, no counter). |
| DT-A-006 | Reclassified → robustness testing | Extremely long email has no behavioral boundary in code; expected result is `401` or `500` (ambiguous). Belongs to stress/robustness testing. |
| DT-A-009 | Merged → DT-A-010 | Password case mismatch produces same outcome as character difference (`401`, counter +2). |
| DT-A-011 | Merged → DT-A-010 | Password trailing space produces same outcome (`401`, counter +2). |
| DT-A-015 | Subsumed by DT-A-016 | First failure (0→2) tests counter increment, already demonstrated by DT-A-016 (2→4, LOCK). Threshold crossing is the critical behavior; first step adds no new signal. |
| DT-A-018 | Merged → DT-A-013 | Locked account returns `403` regardless of whether password is correct or wrong. Lock check precedes password check in code. |

---

## 5. EC Coverage Mapping

| EC ID | Covered by | Notes |
| --- | --- | --- |
| EC-E1 | DT-A-001, DT-A-017 | Happy path (user + admin) |
| EC-E2 | DT-A-008 | Merged — same behavior as email not in DB |
| EC-E3 | DT-A-003 | Invalid format representative |
| EC-E4 | DT-A-003 | Merged — same behavior as EC-E3 |
| EC-E5 | DT-A-005 | Empty email |
| EC-E6 | *(reclassified)* | Robustness testing, out of scope for domain TCs |
| EC-E7 | DT-A-007 | Whitespace — verifies no-trim behavior |
| EC-E8 | DT-A-008 | Email not in DB |
| EC-P1 | DT-A-001, DT-A-017 | Correct password |
| EC-P2 | DT-A-010 | Merged — same outcome as EC-P3 |
| EC-P3 | DT-A-010 | Wrong password representative |
| EC-P4 | DT-A-010 | Merged — same outcome as EC-P3 |
| EC-P5 | DT-A-012 | Empty password |
| EC-S1 | DT-A-001, DT-A-016 | Fresh account / threshold crossing |
| EC-S2 | DT-A-013 | Account locked |
| EC-S3 | DT-A-014 | Lock expired |

**Coverage:** 15/15 active ECs phủ (EC-E6 reclassified, không tính).

---

## 6. Coverage Justification

| Required Behavior | Covered by |
| --- | --- |
| Successful login | DT-A-001, DT-A-017 |
| Invalid email (format) | DT-A-003 |
| Email not found | DT-A-008 |
| Invalid password | DT-A-010 |
| Empty email | DT-A-005 |
| Empty password | DT-A-012 |
| Account locked | DT-A-013 |
| Lock expiration (unlock) | DT-A-014 |
| Threshold crossing → LOCK | DT-A-016 |
