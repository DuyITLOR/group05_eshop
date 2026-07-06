# UC_TC_07 — SC-07: Khoa het han 30s → dang nhap lai thanh cong (Exception E6)

## Preconditions
- Backend chay; tai khoan `test@eshop.com` vua bi khoa

## Steps
1. Cho **> 30 giay** ke tu luc bi khoa
2. Dang nhap lai voi mat khau dung
```bash
sleep 31
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Email `test@eshop.com` / Password `Test1234!` sau khi het 30s

## Expected Result
- 200 OK, cap token; `login_attempts` reset ve 0
- Thoi gian khoa dung **30 giay** (khong lau hon)

## Mapping
- Scenario: SC-07 | Flows: E6 → MSS | Requirement: FR-02
