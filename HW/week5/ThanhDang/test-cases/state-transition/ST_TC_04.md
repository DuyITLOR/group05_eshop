# ST_TC_04 — T3: Entering Credentials --submit_valid--> Authenticated (FINAL)

## Preconditions
- Backend chay, DB reset; `test@eshop.com` chua bi khoa

## Steps
1. Submit voi email + mat khau **dung**:
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Email `test@eshop.com` / Password `Test1234!`

## Expected Result
- 200 OK, tra ve JWT `token` + `user`
- State chuyen EC → **Authenticated** (final) → dieu huong vao trang da dang nhap
- `login_attempts` reset = 0

## Mapping
- Transition: T3 | Sequence: V0-3, V1-1 | Requirement: FR-02
- Coverage: Entering Credentials → Authenticated (final state)
