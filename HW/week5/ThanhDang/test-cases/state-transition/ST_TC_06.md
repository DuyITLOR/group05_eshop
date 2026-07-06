# ST_TC_06 — T9: Locked --login_attempt--> Locked (tu choi ke ca mat khau dung)

## Preconditions
- Backend chay; `test@eshop.com` **dang o Locked** (sai >= 3 lan, con trong 30s)

## Steps
1. Trong khi con khoa, submit voi mat khau **dung**:
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Email `test@eshop.com` / Password dung `Test1234!` khi dang Locked

## Expected Result
- **403** `Tai khoan da bi khoa. Vui long thu lai sau.`
- Van o **Locked** (khong cap token, khong doi state) — he thong khong kiem tra password khi khoa

## Mapping
- Transition: T9 | Sequence: V0-9, V1-6 | Requirement: FR-02
- Coverage: Locked + login_attempt → tu choi
