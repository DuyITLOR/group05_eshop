Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_005.md

Filename: TC_UC_005.md

# TC_UC_005 - Reject Wrong OTP

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify exception flow when the entered OTP is wrong.

## Preconditions
- A valid OTP has been generated for `test@eshop.com`.
- User is on Step 2 - Reset Input.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | `000000` |
| New Password | `NewPassword123!` |
| Confirm New Password | `NewPassword123!` |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter wrong OTP `000000`. | OTP value is entered. |
| 2 | Enter matching strong passwords. | Password inputs are accepted. |
| 3 | Submit the reset form. | System rejects the reset because OTP is wrong. |

## Expected Result
Password is not changed.

## Related Use Case Flow
EF-UC-002

## Status
Not Run
