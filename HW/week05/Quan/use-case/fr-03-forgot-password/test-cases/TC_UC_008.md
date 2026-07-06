Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_008.md

Filename: TC_UC_008.md

# TC_UC_008 - Reject Mismatched Confirmation Password

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify exception flow when confirmation password does not match.

## Preconditions
- A valid OTP has been generated for `test@eshop.com`.
- User is on Step 2 - Reset Input.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | Valid OTP for `test@eshop.com` |
| New Password | `NewPassword123!` |
| Confirm New Password | `OtherPassword123!` |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter the valid OTP. | OTP value is accepted as input. |
| 2 | Enter `NewPassword123!` as new password. | New password satisfies FR-01. |
| 3 | Enter `OtherPassword123!` as confirmation password and submit. | System rejects the reset because confirmation does not match. |

## Expected Result
Password is not changed.

## Related Use Case Flow
EF-UC-005

## Status
Not Run
