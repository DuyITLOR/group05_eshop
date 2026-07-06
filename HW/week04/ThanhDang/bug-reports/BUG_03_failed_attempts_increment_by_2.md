# BUG-03: failed_attempts tang 2 moi lan thay vi 1

## Summary
Khi dang nhap sai, he thong tang `failed_attempts` len **2 don vi** thay vi **1 don vi** theo spec. Hau qua: tai khoan bi khoa chi sau **2 lan** sai (thay vi 3 lan).

## Severity
**Critical**

## Priority
Critical

## Requirement
- **FR-02**: "Sau moi lan dang nhap sai, he thong tang bo dem len **dung 1 don vi**"
- **FR-02**: "Neu dang nhap sai tu **3 lan tro len** lien tiep, tai khoan bi tam khoa 30 giay"

## Steps to Reproduce

### Cach 1: Via API
```bash
# Reset DB
cd backend && node database.js

# Dang nhap sai lan 1
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Wrong1!"}'
# Result: 401 — nhung failed_attempts = 2 (thay vi 1)

# Dang nhap sai lan 2
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Wrong2!"}'
# Result: 401 — failed_attempts = 4 (da vuot nguong 3 → account LOCKED)

# Thu dang nhap voi mat khau DUNG
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
# Result: 403 — "Tai khoan da bi khoa" (CHI SAI 2 LAN MA DA BI KHOA)
```

### Cach 2: Via UI
1. Truy cap `http://localhost:5173/login`
2. Nhap `test@eshop.com` + mat khau sai → lan 1
3. Nhap `test@eshop.com` + mat khau sai → lan 2
4. Nhap `test@eshop.com` + mat khau **dung** → BI REJECT vi account da locked

## Actual Result
- Moi lan sai, `failed_attempts` tang **2** (khong phai 1)
- Tai khoan bi khoa chi sau **2 lan** sai lien tiep (thay vi 3 lan)
- Timeline:
  - Sau lan sai 1: `failed_attempts = 2`
  - Sau lan sai 2: `failed_attempts = 4` → **LOCKED** (vuot nguong 3)

## Expected Result
- Moi lan sai, `failed_attempts` tang **1**
- Tai khoan bi khoa sau **3 lan** sai lien tiep
- Timeline dung:
  - Sau lan sai 1: `failed_attempts = 1`
  - Sau lan sai 2: `failed_attempts = 2`
  - Sau lan sai 3: `failed_attempts = 3` → **LOCKED**

## Root Cause
File `backend/server.js`, dong 54:
```javascript
// BUG:
const newAttempts = user.login_attempts + 2;

// FIX:
const newAttempts = user.login_attempts + 1;
```

## Impact
- **Nghiem trong**: Nguoi dung bi khoa som hon mong doi (2 lan thay vi 3 lan)
- User experience bi anh huong: nguoi dung nham mat khau 2 lan la bi khoa
- Vi pham truc tiep yeu cau nghiep vu FR-02
- Anh huong den tat ca cac test case lien quan den lockout threshold

## Additional Bug: Lock duration sai
- Spec yeu cau khoa **30 giay** (moi truong demo)
- Thuc te: `180000` ms = **180 giay = 3 phut**
- File `backend/server.js`, dong 57:
```javascript
// BUG:
lockedUntil = new Date(Date.now() + 180000).toISOString();

// FIX:
lockedUntil = new Date(Date.now() + 30000).toISOString();
```

## Test Case Reference
- TC_04b: failed_attempts tang dung 1 don vi (FAILED)
- TC_06c: Login thanh cong reset failed_attempts (FAILED)
- Decision Rules: R4a, R4b, R5

## Evidence
Test output:
```
After 2 failed attempts, login with correct password: status=403
→ BUG: failed_attempts tang 2 moi lan thay vi 1

After reset + 2 fails, correct login status: 403
→ BUG lien dai: du da reset, 2 lan sai la du lock (vi +2 moi lan)
```
