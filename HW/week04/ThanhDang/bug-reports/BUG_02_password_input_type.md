# BUG-02: Password input dung type="text" thay vi type="password"

## Summary
Trang Login su dung `type="text"` cho truong Mat khau thay vi `type="password"`, khien mat khau hien thi ro rang tren man hinh.

## Severity
**High**

## Priority
High

## Requirement
- **FR-22**: Truong Mat khau phai dung `type="password"` (khong hien thi ro)

## Steps to Reproduce
1. Truy cap trang Login tai `http://localhost:5173/login`
2. Nhap mat khau bat ky vao truong "Mat khau"
3. Quan sat: mat khau hien thi dang plaintext, khong bi an

## Actual Result
- Password input co `type="text"`
- Mat khau hien thi ro rang (plaintext) tren man hinh khi nguoi dung nhap
- Bat ky ai nhin man hinh deu doc duoc mat khau

## Expected Result
- Password input phai co `type="password"`
- Mat khau hien thi dang dots/asterisks (●●●●●●)
- Khong ai co the doc mat khau khi nhin man hinh

## Root Cause
File `frontend-web/src/pages/Login.jsx`, dong 40:
```jsx
// Hien tai:
<input type="text" ... />

// Dung ra phai la:
<input type="password" ... />
```

## Impact
- **Bao mat nghiem trong**: Mat khau bi lo khi nguoi dung nhap tai noi cong cong
- Shoulder surfing attack co the doc mat khau
- Vi pham bao mat co ban va FR-22

## Test Case Reference
- TC_01c (FR-02_login.spec.js)
- Decision Rule: R1

## Screenshot
Screenshot tu dong luu tai:
`test-results/FR-02_login-FR-02-Login-Ac-2a8fb-ssword-input-type-attribute-chromium/test-failed-1.png`
