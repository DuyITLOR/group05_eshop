Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_006.md

Filename: TC_UC_006.md

# TC_UC_006 - Reject OTP From Another Email

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify exception flow when an OTP belongs to a different email.

## Preconditions
- An OTP has been generated for another registered email.
- User is attempting to reset `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email being reset | `test@eshop.com` |
| OTP | Valid OTP issued for another email |
| New Password | `NewPassword123!` |
| Confirm New Password | `NewPassword123!` |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter/use `test@eshop.com` as the reset email. | Reset attempt is associated with `test@eshop.com`. |
| 2 | Enter OTP issued for another email. | OTP value is entered. |
| 3 | Enter matching strong passwords and submit. | System rejects the reset because OTP is not valid for `test@eshop.com`. |

## Expected Result
Password is not changed.

## Related Use Case Flow
EF-UC-003

## Status
Not Run
