Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_004.md

Filename: TC_UC_004.md

# TC_UC_004 - Reject Unregistered Email

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify exception flow when the user requests OTP for an unregistered email.

## Preconditions
- User is on Step 1 - Email Input.
- Email `notfound@eshop.com` is not registered.

## Test Data

| Field | Value |
|---|---|
| Email | `notfound@eshop.com` |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter `notfound@eshop.com`. | Email value is entered. |
| 2 | Submit the OTP request. | System rejects or returns a safe response and does not create a usable OTP. |

## Expected Result
User cannot reset password using an unregistered email.

## Related Use Case Flow
EF-UC-001

## Status
Not Run
