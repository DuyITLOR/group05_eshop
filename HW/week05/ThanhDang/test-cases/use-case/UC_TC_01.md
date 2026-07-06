# UC_TC_01 — SC-01: Dang nhap thanh cong (Main Success Scenario)

## Preconditions
- Backend chay `http://localhost:3000`, DB reset
- Tai khoan `test@eshop.com` chua bi khoa, `login_attempts = 0`

## Steps
1. Truy cap trang Login
2. Nhap email + mat khau dung
3. Bam Dang nhap
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Email `test@eshop.com` / Password `Test1234!`

## Expected Result
- 200 OK, tra ve JWT `token` + `user`
- `login_attempts` reset ve 0, chuyen vao trang da dang nhap

## Mapping
- Scenario: SC-01 | Flows: MSS (1→8) | Requirement: FR-02
