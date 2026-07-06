# BUG-03: `login_attempts` tang 2 moi lan + khoa 180s thay vi 30s

## Summary
Phat hien lai qua **Use Case Testing** (UC-Login). Moi lan dang nhap sai, `login_attempts` tang **2** thay vi **1** → tai khoan bi khoa chi sau **2 lan** sai (thay vi 3). Ngoai ra thoi gian khoa la **180 giay** thay vi **30 giay**.

## Severity
**Critical**

## Priority
Critical

## Requirement
- **FR-02**: "Sau moi lan dang nhap sai, he thong tang bo dem len **dung 1 don vi**."
- **FR-02**: "Neu dang nhap sai tu **3 lan tro len** lien tiep, tai khoan bi tam khoa **30 giay**."

## Steps to Reproduce
1. Reset DB, chay server
2. Dang nhap dung 1 lan de reset counter ve 0
3. Dang nhap sai lan 1, kiem tra `login_attempts` qua `GET /api/admin/users`
4. Dang nhap sai lan 2

## Actual Result
```
after reset:  login_attempts=0
fail #1: HTTP 401 -> login_attempts=2
fail #2: HTTP 401 -> login_attempts=4, locked_until="...T08:57:06Z"  (LOCKED sau 2 lan)
locked + correct password: HTTP 403 "Tai khoan da bi khoa"
```
- Bo dem nhay 0 → 2 → 4 (moi lan +2).
- Khoa sau **2 lan** sai. Khoang cach `locked_until` = **180 giay** (3 phut).

## Expected Result
- Bo dem tang **+1** moi lan: 0 → 1 → 2 → 3.
- Khoa sau **3 lan** sai. Thoi gian khoa = **30 giay**.

## Root Cause
File `backend/server.js`:
```javascript
// dong 54 — BUG:
const newAttempts = user.login_attempts + 2;   // FIX: + 1

// dong 57 — BUG:
lockedUntil = new Date(Date.now() + 180000).toISOString();  // FIX: 30000
```

## Impact
- Nguoi dung bi khoa som (2 lan thay vi 3) va khoa lau gap 6 lan (180s vs 30s) → anh huong nghiem trong UX.
- Vi pham truc tiep FR-02.

## Test Case Reference
Phat hien boi **ca 2 ky thuat** ap dung tren FR-02:
- **State Transition**: ST_TC_02 (T4: EC→Failed_1 ky vong attempts=1) — **FAILED** (actual=2); ST_TC_03 (Failed_2→Locked sau dung 3 lan, 30s) — **FAILED** (khoa sau 2 lan); ST_TC_07 (T10 timeout 30s) — **FAILED** (thuc te ~180s)
- **Use Case**: UC_TC_04 (sai 1 lan → attempts=1) — **FAILED**; UC_TC_05 (khoa sau 3 lan, 30s) — **FAILED**
- Sequence/Scenario: V0-4, V0-6, V1-2 / SC-04, SC-05
- (Trung root cause voi phat hien Decision Table tuan truoc — tai xac nhan bang State Transition + Use Case.)

## Evidence
```
fail #1: HTTP 401  -> login_attempts:2
fail #2: HTTP 401  -> login_attempts:4, locked_until:2026-07-06T08:57:06.985Z
```
