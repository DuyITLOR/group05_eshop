# ST_TC_08 — E2E: Lockout & Recovery (Idle → ... → Locked → timeout → Idle → Authenticated)

## Preconditions
- Backend chay, DB reset; `test@eshop.com` o Idle (`login_attempts=0`)

## Steps
1. Nhap thong tin → EC
2. Submit sai lan 1 → ky vong Failed_1 (`attempts=1`)
3. Submit sai lan 2 → ky vong Failed_2 (`attempts=2`)
4. Submit sai lan 3 → ky vong Locked (`attempts=3`, khoa 30s)
5. Submit mat khau **dung** khi con khoa → ky vong 403, van Locked
6. Cho > 30s → ky vong khoa het han (ve Idle)
7. Nhap lai + submit dung → ky vong 200 + token, Authenticated

## Test Data
- 3 lan sai → 1 lan dung (locked) → cho 31s → 1 lan dung

## Expected Result
| Buoc | Event | State/Ky vong |
|------|-------|---------------|
| 1 | input | Entering Credentials |
| 2 | submit_invalid | Failed_1, attempts=1 |
| 3 | submit_invalid | Failed_2, attempts=2 |
| 4 | submit_invalid | Locked, attempts=3, khoa 30s |
| 5 | login_attempt (pass dung) | 403, van Locked |
| 6 | timeout 30s | ve Idle |
| 7 | submit_valid | 200 + token, Authenticated |

## Mapping
- Sequence: E2E (T1→T4→T5→T6→T9→T10→T3) | Requirement: FR-02
- Coverage: vong doi day du lockout & recovery
