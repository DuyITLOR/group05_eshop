# ST_TC_01 — T1: Idle --input--> Entering Credentials

## Preconditions
- Truy cap trang Login (`http://localhost:5173/login`) — dang o `Idle` (chua nhap)

## Steps
1. Nhap email va password vao form

## Test Data
- Email `test@eshop.com`, Password (bat ky, chua submit)

## Expected Result
- Man hinh chuyen sang trang thai `Entering Credentials` (form co du lieu, nut Dang nhap san sang)
- Chua goi API (chua submit)

## Mapping
- Transition: T1 | Sequence: V0-1 | Requirement: FR-02
- Coverage: Idle → Entering Credentials (client-side / UI)
