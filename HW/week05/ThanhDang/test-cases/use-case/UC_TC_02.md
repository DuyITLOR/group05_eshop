# UC_TC_02 — SC-02: Email sai dinh dang (Exception E1)

## Preconditions
- Backend chay; o trang Login (`http://localhost:5173/login`)

## Steps
1. Nhap email sai format `abc` (thieu `@domain`)
2. Nhap mat khau bat ky
3. Bam Dang nhap

## Test Data
- Email `abc` / Password `Whatever1!`

## Expected Result
- Truong email `type="email"` kich hoat HTML5 validation → **chan submit**, khong goi API
- Hien thi thong bao yeu cau nhap email hop le

## Mapping
- Scenario: SC-02 | Flows: MSS 1-3 → E1 | Requirement: FR-02, FR-22
- Ghi chu: kiem tra tren UI (client-side validation)
