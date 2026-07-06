# 01 — Specification Analysis: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Requirement/specification analysis only. No test cases. No BVA.

**References:**

| Label | Source | Location |
| --- | --- | --- |
| `[SPEC]` | SRS — FR-02, FR-22, SEC-01, SEC-02 | `group05_eshop/README.md` |
| `[CODE-BE]` | Login endpoint | `group05_eshop/backend/server.js:32–66` |
| `[CODE-DB]` | Users table schema + seed data | `group05_eshop/backend/database.js:50–94` |
| `[CODE-FE]` | Login form (web) | `group05_eshop/frontend-web/src/pages/Login.jsx` |
| `[CODE-CTX]` | Auth context (token storage) | `group05_eshop/frontend-web/src/context/AuthContext.jsx` |

---

## 1. Functional Description

**Purpose:** Authenticate users via Email + Password; issue a JWT token for session management; prevent brute-force attacks by temporarily locking accounts after consecutive failed attempts.

### Main Business Flow (step-by-step)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | User | Enters Email and Password on login form | — |
| 2 | User | Clicks "Login" button | Frontend sends `POST /api/login` with `{ email, password }` `[CODE-CTX]` |
| 3 | System | Looks up user by email | `SELECT * FROM users WHERE email = ?` (parameterized) `[CODE-BE]` |
| 4a | System | Email not found | Return `401 "Invalid email or password"` — counter NOT incremented `[CODE-BE]` |
| 4b | System | Email found → check lock status | If `locked_until` is set AND `now < locked_until` → return `403 "Tài khoản đã bị khóa"` `[CODE-BE]` |
| 5a | System | Not locked → password matches | Reset `login_attempts = 0`, `locked_until = NULL`; sign JWT `{ id, role }`; return `200` with `{ token, user }` `[CODE-BE]` |
| 5b | System | Not locked → password does NOT match | Increment `login_attempts += 2`; if `>= 3` → set `locked_until = now + 180s`; return `401` `[CODE-BE]` |
| 6 | Frontend | On success | Store token in `localStorage`, set `Authorization: Bearer` header, redirect to Home `[CODE-CTX]` |
| 7 | Frontend | On failure | Display generic error "Đăng nhập thất bại. Vui lòng kiểm tra lại." `[CODE-FE]` |

### Lockout Sub-flow

| Step | Condition | Behavior | Source |
| --- | --- | --- | --- |
| L1 | Wrong password entered | `login_attempts += 2` (SPEC says +1) | `[CODE-BE]` line 54 |
| L2 | `login_attempts >= 3` | Set `locked_until = now + 180000ms` (SPEC says 30s) | `[CODE-BE]` line 56–57 |
| L3 | Account locked, any login attempt | Return `403` — even if password is correct (priority check) | `[CODE-BE]` line 40–44 |
| L4 | Lock expires (`now >= locked_until`) | Login allowed again, but `login_attempts` NOT reset (still high) | `[CODE-BE]` (no reset logic on expiry) |
| L5 | Successful login after unlock | Reset `login_attempts = 0`, `locked_until = NULL` | `[CODE-BE]` line 48 |


## 2. Input Fields

### 2.1 Direct Input Fields (User-entered)

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `email` | String (email) | Yes (`required` on form) | SPEC: Must use `type="email"` (HTML5 format validation). CODE: form uses `type="text"` — no format validation on frontend. Backend: no format validation, exact string match via `WHERE email = ?` | RFC-compliant email that exists in DB with exact case match. Seed: `test@eshop.com`, `admin@eshop.com` | (1) Invalid format: missing `@`, missing domain, missing local part. (2) Empty / null. (3) Too long (1000+ chars). (4) Valid format but not in DB. (5) Valid format, exists but wrong case. (6) Contains whitespace (not trimmed) | `[SPEC]` FR-02, FR-22; `[CODE-BE]` line 35; `[CODE-FE]` line 30 |
| `password` | String (password) | Yes (`required` on form) | SPEC: Must use `type="password"` (mask input). CODE: form uses `type="text"` — password visible. Backend: plaintext comparison `user.password === password`, case-sensitive, no trim | Exact match of stored password. Seed: `Test1234!` (for test user), `Admin123!` (for admin) | (1) Any string ≠ stored password. (2) Case mismatch (e.g., `test1234!`). (3) Extra whitespace. (4) Empty / null | `[SPEC]` FR-22; `[CODE-BE]` line 46; `[CODE-FE]` line 40 |

### 2.2 State Variables (Server-side, affect behavior but not user-entered)

| Field Name | Data Type | Default | Domain | Description | Source |
| --- | --- | --- | --- | --- | --- |
| `login_attempts` | INTEGER | `0` | 0, 2, 4, 6, ... (increments by 2 per failure) | Consecutive failed login counter. SPEC: should increment by 1 | `[CODE-DB]` line 56; `[CODE-BE]` line 54 |
| `locked_until` | DATETIME | `NULL` | `NULL` (unlocked), future timestamp (locked), past timestamp (expired) | Account lock expiry time. Set when `login_attempts >= 3` | `[CODE-DB]` line 57; `[CODE-BE]` line 57 |

### 2.3 Implicit Constraints (not in any single field definition)

| Constraint | Description | SPEC | CODE | Match? |
| --- | --- | --- | --- | --- |
| Case sensitivity (email) | Whether `Test@` matches `test@` | Not specified | Case-sensitive (`WHERE email = ?` on TEXT) | ⚠️ Ambiguous — SPEC silent |
| Case sensitivity (password) | Whether `test1234!` matches `Test1234!` | Not specified | Case-sensitive (`===` comparison) | ⚠️ Ambiguous — SPEC silent |
| Whitespace trimming | Whether leading/trailing spaces are stripped | Not specified | No trimming on either field | ⚠️ Ambiguous — SPEC silent |
| Counter increment | How much counter increases per failure | +1 per failure | +2 per failure (`login_attempts + 2`) | ❌ Mismatch |
| Lock duration | How long account stays locked | 30 seconds (demo) | 180,000 ms = 180 seconds | ❌ Mismatch |
| Lock threshold | When lockout triggers | ≥ 3 consecutive failures | `newAttempts >= 3` | ✅ Same number, but reached faster due to +2 |
| Email input type | HTML input type for email field | `type="email"` | `type="text"` | ❌ Mismatch |
| Password input type | HTML input type for password field | `type="password"` | `type="text"` (visible) | ❌ Mismatch |
| Form heading | Login page title | Should say "Đăng nhập" | Says "Đăng Ký" (Register) | ❌ Mismatch |
| Button label | Submit button text | Vietnamese expected | "Sign In" (English) | ❌ Mismatch |
| Email field label | Label text | Should say "Email" | Says "Username" | ❌ Mismatch |
| Lock error visibility | Whether user sees lock message | Should show appropriate error | Frontend catches error → shows generic message, hides backend's `403` lock message | ❌ Mismatch |
| Password storage | How passwords are stored | Must NOT be plaintext (SEC-01) | Stored as plaintext in DB | ❌ Mismatch |
| Login response data | What data is returned on success | Token only (implied) | Returns full `user` object including `password` field | ❌ Security leak |
| JWT expiry | Token lifetime | Not specified | No `expiresIn` → token lives forever | ⚠️ Ambiguous — SPEC silent |
| Counter scope (email not found) | Does counter increase for non-existent email? | "consecutive failed login" — ambiguous | No increment (returns 401 early before counter logic) | ⚠️ Ambiguous |
| Counter reset on lock expiry | Does counter reset to 0 when lock expires? | Not specified | No — counter stays high, next failure re-locks immediately | ⚠️ Ambiguous |

---

## 3. Field Dependencies

| Field A | Field B | Dependency Type | Condition | Description |
| --- | --- | --- | --- | --- |
| `email` | `password` | **Sequential** | Email must resolve to a user before password is checked | Backend checks email first (`SELECT WHERE email`); if not found → `401` immediately, password is never evaluated |
| `email` | `login_attempts` | **Lookup** | Email resolves to a user record that carries `login_attempts` | Counter is per-account; if email is not found, no account → no counter to increment |
| `login_attempts` | `locked_until` | **Threshold trigger** | `login_attempts >= 3` triggers `locked_until = now + 180s` | Each wrong password adds +2 to counter; when crossing threshold, lock is set |
| `locked_until` | `password` | **Priority / blocking** | If `locked_until` is active, password check is skipped entirely | Lock check runs BEFORE password comparison — even correct password → `403` |
| `login_attempts` | success login | **Reset** | Successful login resets `login_attempts = 0` and `locked_until = NULL` | Counter only resets on successful login, NOT on lock expiry |

