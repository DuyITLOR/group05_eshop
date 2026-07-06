Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_003.md

Filename: TC_UC_003.md

# TC_UC_003 - Use Demo Displayed OTP

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that the OTP displayed in demo mode can be used to continue the reset flow.

## Preconditions
- User is on Step 1 - Email Input.
- Account `test@eshop.com` exists.
- Demo environment displays OTP directly on screen.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | OTP displayed on screen |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter `test@eshop.com` and submit OTP request. | System generates and displays a 6-digit OTP. |
| 2 | Copy/use the displayed OTP in the reset step. | System accepts the OTP as the one issued for `test@eshop.com`. |

## Expected Result
User can proceed with password reset using the displayed demo OTP.

## Related Use Case Flow
AF-UC-002

## Status
Not Run
