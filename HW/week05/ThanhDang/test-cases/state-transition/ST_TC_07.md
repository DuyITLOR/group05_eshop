# ST_TC_07 — T10: Locked --timeout(30s)--> Idle

## Preconditions
- Backend chay; `test@eshop.com` vua bi khoa (Locked)

## Steps
1. Cho **> 30 giay** ke tu luc khoa
2. Submit lai voi mat khau dung:
```bash
sleep 31
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```

## Test Data
- Cho 31s sau khi khoa → `Test1234!`

## Expected Result
- Thoi gian khoa dung **30 giay** (`locked_until` = luc khoa + 30s)
- Sau 30s: state tro ve **Idle** (khoa het han), submit dung → 200 OK + token

## Mapping
- Transition: T10 | Sequence: V0-10, V1-3, V1-6 | Requirement: FR-02
- Coverage: Locked → timeout → Idle (kiem tra thoi luong khoa 30s)
