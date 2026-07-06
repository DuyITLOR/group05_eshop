# ST_TC_05 — T7, T8: Failed_1 / Failed_2 --retry--> Entering Credentials

## Preconditions
- Dang o trang thai `Failed_1` (hoac `Failed_2`) sau khi submit sai
- Backend chay

## Steps
1. Sau khi submit sai (dang o Failed_1/Failed_2), thuc hien **retry**: sua lai email/password tren form
2. Quan sat man hinh tro ve trang thai nhap lieu

## Test Data
- Tu Failed_1: sua lai thong tin dang nhap
- Tu Failed_2: sua lai thong tin dang nhap

## Expected Result
- Man hinh tro ve `Entering Credentials` (cho phep nhap/submit lai)
- Bo dem `login_attempts` **khong** bi reset khi retry (van la 1 hoac 2) — retry chi la quay lai man nhap, khong phai login thanh cong

## Mapping
- Transition: T7 (Failed_1→EC), T8 (Failed_2→EC) | Sequence: V0-7, V0-8, V1-5 | Requirement: FR-02
- Coverage: retry tu Failed_1/Failed_2 (client-side / UI)
