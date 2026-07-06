# UC_TC_05 — SC-05: Sai mat khau cham nguong → khoa 30s (Exception E4)

## Preconditions
- Backend chay, DB reset (`test@eshop.com`, `login_attempts = 0`)

## Steps
1. Dang nhap sai **lan 1** → ky vong `login_attempts = 1`, chua khoa
2. Dang nhap sai **lan 2** → ky vong `login_attempts = 2`, chua khoa
3. Dang nhap sai **lan 3** → ky vong `login_attempts = 3` → **khoa 30 giay**
```bash
for i in 1 2 3; do
  curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
    -d '{"email":"test@eshop.com","password":"WrongPass'$i'!"}'; done
```

## Test Data
- Email `test@eshop.com` / mat khau sai lien tiep 3 lan

## Expected Result
- Bo dem tang **dung 1** moi lan (1, 2, 3)
- Khoa tai khoan **chi sau 3 lan** sai, thoi gian khoa = **30 giay**

## Mapping
- Scenario: SC-05 | Flows: MSS 1-5 → E4 | Requirement: FR-02
