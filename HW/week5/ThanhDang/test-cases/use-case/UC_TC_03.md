# UC_TC_03 — SC-03: Email chua dang ky (Exception E2)

## Preconditions
- Backend chay, DB reset

## Steps
1. Nhap email chua ton tai + mat khau bat ky, bam Dang nhap
```bash
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"nobody@eshop.com","password":"Whatever1!"}'
```

## Test Data
- Email `nobody@eshop.com` / Password `Whatever1!`

## Expected Result
- 401 voi **thong bao chung** `Invalid email or password`
- KHONG tiet lo "email khong ton tai" (khong lo nguyen nhan)

## Mapping
- Scenario: SC-03 | Flows: MSS 1-5 → E2 | Requirement: FR-02
