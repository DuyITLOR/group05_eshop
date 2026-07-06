# UC_TC_06 — SC-06: Tai khoan da khoa, nhap mat khau DUNG (Exception E5)

## Preconditions
- Backend chay; tai khoan `test@eshop.com` **dang bi khoa** (sai >= 3 lan, chua het 30s)

## Steps
1. Trong khi con bi khoa, dang nhap voi mat khau **dung**
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Email `test@eshop.com` / Password `Test1234!` (dung) khi account locked

## Expected Result
- **403** `Tai khoan da bi khoa. Vui long thu lai sau.`
- KHONG cap token du mat khau dung (khong kiem tra password khi locked)

## Mapping
- Scenario: SC-06 | Flows: E5 | Requirement: FR-02
