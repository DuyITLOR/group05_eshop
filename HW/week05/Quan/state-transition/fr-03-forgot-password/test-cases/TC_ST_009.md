Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_009.md

Filename: TC_ST_009.md

# TC_ST_009 - Reject Mismatched Password Confirmation

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that mismatched password confirmation cannot reset the password.

## Preconditions
- User is on Step 2 - Reset Input.
- A valid OTP has been generated for `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | Valid OTP for `test@eshop.com` |
| New Password | `NewPassword123!` |
| Confirm New Password | `OtherPassword123!` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter the valid OTP. | OTP is accepted as input. |
| 2 | Enter `NewPassword123!` as new password. | New password satisfies FR-01. |
| 3 | Enter `OtherPassword123!` as confirmation password. | Confirmation does not match new password. |
| 4 | Submit the reset password form. | System rejects the reset and shows mismatch error. |

## Expected Result
Password is not changed and reset is rejected.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Submit mismatched confirmation  
Next State: Reset Rejected

## Status
Not Run
