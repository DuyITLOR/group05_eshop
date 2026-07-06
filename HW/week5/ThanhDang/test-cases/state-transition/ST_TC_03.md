# ST_TC_03 — T5, T6: Failed_1 --submit_invalid--> Failed_2 --submit_invalid--> Locked

## Preconditions
- Backend chay, DB reset; `test@eshop.com` o Idle/EC (`login_attempts = 0`)

## Steps
1. Submit sai lien tiep, kiem tra `login_attempts` sau moi lan:
```bash
for i in 1 2 3; do
  curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
    -d '{"email":"test@eshop.com","password":"Wrong'$i'!"}'
done
```

## Test Data
- Submit sai lien tiep 3 lan

## Expected Result
- Sau lan 1: **Failed_1** (`login_attempts=1`)
- Sau lan 2: **Failed_2** (`login_attempts=2`)
- Sau lan 3: **Locked** (`login_attempts=3`, `locked_until` = now + **30 giay**)
- Chi vao Locked khi **du 3 lan** submit sai

## Mapping
- Transition: T5, T6 | Sequence: V0-5, V0-6, V1-2 | Requirement: FR-02
- Coverage: Failed_1→Failed_2, Failed_2→Locked (nguong khoa)
