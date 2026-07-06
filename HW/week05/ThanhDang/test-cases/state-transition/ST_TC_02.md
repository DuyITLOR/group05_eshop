# ST_TC_02 — T4: Entering Credentials --submit_invalid--> Failed_1

## Preconditions
- Backend chay `http://localhost:3000`, DB reset
- `test@eshop.com` chua sai lan nao (`login_attempts = 0`)

## Steps
1. Submit voi mat khau **sai** 1 lan:
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"WrongX!"}'
```
2. Kiem tra `login_attempts` (`GET /api/admin/users`)

## Test Data
- Email `test@eshop.com` / Password sai `WrongX!`

## Expected Result
- 401 `Invalid email or password`
- State chuyen EC → **Failed_1**: `login_attempts = 1`, chua khoa

## Mapping
- Transition: T4 | Sequence: V0-4 | Requirement: FR-02
- Coverage: Entering Credentials → Failed_1
