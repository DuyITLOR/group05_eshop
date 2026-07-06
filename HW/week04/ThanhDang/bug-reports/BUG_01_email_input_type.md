# BUG-01: Email input dung type="text" thay vi type="email"

## Summary
Trang Login su dung `type="text"` cho truong Email thay vi `type="email"`, vi pham FR-22.

## Severity
**Medium**

## Priority
Medium

## Requirement
- **FR-02**: Truong email phai dung `type="email"` (co validate HTML5 format)
- **FR-22**: Truong Email phai dung `type="email"`

## Steps to Reproduce
1. Truy cap trang Login tai `http://localhost:5173/login`
2. Inspect truong nhap Email (F12 → Elements)
3. Kiem tra attribute `type` cua input element

## Actual Result
- Email input co `type="text"`
- Khong co HTML5 email validation
- Nguoi dung co the nhap bat ky chuoi nao (vd: "abc", "123") ma khong bi client validate

## Expected Result
- Email input phai co `type="email"`
- Browser tu dong validate format email truoc khi submit
- Cac gia tri khong hop le (thieu @, thieu domain) bi reject phia client

## Root Cause
File `frontend-web/src/pages/Login.jsx`, dong 30:
```jsx
// Hien tai:
<input type="text" ... />

// Dung ra phai la:
<input type="email" ... />
```

## Impact
- Khong co client-side email validation
- Nguoi dung co the gui request voi email format sai len server
- Vi pham accessibility standards (screen readers khong nhan dien dung truong email)

## Test Case Reference
- TC_01b (FR-02_login.spec.js)
- Decision Rule: R1

## Screenshot
Screenshot tu dong luu tai:
`test-results/FR-02_login-FR-02-Login-Ac-f7ab3--email-input-type-attribute-chromium/test-failed-1.png`
