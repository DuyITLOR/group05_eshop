# UC_TC_04 — SC-04: Sai mat khau, chua toi nguong khoa (Exception E3)

## Preconditions
- Backend chay, DB reset (`test@eshop.com`, `login_attempts = 0`)

## Steps
1. Dang nhap sai mat khau **1 lan**
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"WrongPass1!"}'
```
2. Kiem tra `login_attempts` trong DB / qua API admin users

## Test Data
- Email `test@eshop.com` / Password `WrongPass1!`

## Expected Result
- 401 `Invalid email or password`
- `login_attempts` tang **dung 1** (= 1), tai khoan **chua** bi khoa

## Mapping
- Scenario: SC-04 | Flows: MSS 1-5 → E3 | Requirement: FR-02
