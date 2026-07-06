# Execution Summary — Week 5 (State Transition + Use Case Testing tren FR-02 Login)

> **SUT**: EShop backend `http://localhost:3000` — DB reset (`node database.js`), server chay (`node server.js`).
> Thuc thi bang API (curl). Tai khoan: `admin@eshop.com/Admin123!`, `test@eshop.com/Test1234!`.
> Ca hai ky thuat deu ap dung cho **chuc nang Login (FR-02)** o hai goc nhin khac nhau:
> State Transition = su thay doi trang thai bo dem/khoa; Use Case = luong hanh vi nguoi dung.

## 1. State Transition Testing — FR-02 Login FSM (Idle → EC → Failed_1 → Failed_2 → Locked / Authenticated)

| Test | Transition / Seq | Ky vong | Ket qua thuc te | Verdict |
|------|------------------|---------|-----------------|:-------:|
| ST_TC_01 | T1 Idle→EC (input) | chuyen man nhap lieu | (UI — client-side) | ⏸️ UI |
| ST_TC_02 | T4 EC→Failed_1 (submit_invalid) | attempts 0→**1** | attempts 0→**2** | ❌ **FAIL → BUG-03** |
| ST_TC_03 | T5,T6 →Failed_2→Locked | khoa sau **3** lan, 30s | khoa sau **2** lan (0→2→4) | ❌ **FAIL → BUG-03** |
| ST_TC_04 | T3 EC→Authenticated (submit_valid) | 200 + token, attempts=0 | 200 + token, attempts=0 | ✅ PASS |
| ST_TC_05 | T7,T8 retry Failed_N→EC | ve man nhap, giu attempts | (UI — client-side) | ⏸️ UI |
| ST_TC_06 | T9 Locked+login_attempt | 403, van Locked | 403, van Locked | ✅ PASS |
| ST_TC_07 | T10 Locked→timeout→Idle | mo khoa sau **30s** | `locked_until` ~ **180s** | ❌ **FAIL → BUG-03** |
| ST_TC_08 | E2E lockout&recovery | 8 buoc dung | Buoc 2-4 lech (do +2), 5 PASS | ❌ **FAIL → BUG-03** |

**Ket luan**: T3 (submit_valid→Authenticated) va T9 (Locked tu choi pass dung) hoat dong dung. Cac transition lien quan bo dem (T4, T6) va timeout (T10) SAI → BUG-03. ST_TC_01/05 la buoc UI (client-side).

## 2. Use Case Testing — FR-02 UC-Login

| Test | Scenario | Ky vong | Ket qua thuc te | Verdict |
|------|----------|---------|-----------------|:-------:|
| UC_TC_01 | SC-01 login dung | 200 + token, attempts=0 | 200 + token, attempts=0 | ✅ PASS |
| UC_TC_02 | SC-02 email sai format | HTML5 chan submit | (kiem tra UI — client-side) | ⏸️ UI |
| UC_TC_03 | SC-03 email chua dang ky | 401 loi chung | 401 `Invalid email or password` | ✅ PASS |
| UC_TC_04 | SC-04 sai pass 1 lan | attempts=1 | **attempts=2** | ❌ **FAIL → BUG-03** |
| UC_TC_05 | SC-05 khoa sau 3 lan, 30s | khoa sau 3 lan, 30s | **khoa sau 2 lan, ~180s** | ❌ **FAIL → BUG-03** |
| UC_TC_06 | SC-06 locked + pass dung | 403, khong cap token | 403, khong cap token | ✅ PASS |
| UC_TC_07 | SC-07 het 30s → login lai | 200 sau 30s | (phu thuoc BUG-03: thuc te ~180s) | ⏸️ phu thuoc BUG-03 |

**Ket luan**: UC_TC_04, UC_TC_05 FAIL → BUG-03. UC_TC_02 kiem tra client-side. UC_TC_07 phu thuoc thoi luong khoa (hien ~180s).

## 3. Tong hop Bug

| Bug | Requirement | Severity | Phat hien boi |
|-----|-------------|----------|---------------|
| BUG-03 `login_attempts += 2`, khoa sau 2 lan, khoa ~180s (khong phai +1 / 3 lan / 30s) | FR-02 | Critical | State Transition (ST_TC_01/02/05) **va** Use Case (UC_TC_04/05) |

> Ca hai ky thuat doc lap deu chi ra cung mot root cause tai `backend/server.js:54` (`+2`) va `:57` (`180000`) — cho thay do tin cay cao cua phat hien.

## 4. Evidence (trich log chay)
```
=== T1 S0--fail-->S1 (expect attempts 0->1) ===
  before= login_attempts:0, locked_until:null
  fail http=401 | after= login_attempts:2, locked_until:null        <<< expect 1

=== fails -> Locked (expect lock after 3 fails) ===
  fail#1 http=401 | login_attempts:2
  fail#2 http=401 | login_attempts:4, locked_until:2026-07-06T09:06:35Z   <<< LOCKED after 2 fails
  now(UTC)=2026-07-06T09:03:36Z   → khoa ~179s (≈180s, expect 30s)

=== T8 Locked + correct password (expect 403) ===
  correct-pw-while-locked http=403     <<< PASS (khong cap token khi khoa)

=== T4/T5 login OK reset ===
  success http=200 | login_attempts:0  <<< PASS
```
