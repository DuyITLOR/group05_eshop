Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_007.md

Filename: TC_ST_007.md

# TC_ST_007 - Reject OTP Issued For Another Email

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that an OTP cannot be reused for a different email.

## Preconditions
- OTP has been generated for another registered email.
- User is attempting to reset `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email being reset | `test@eshop.com` |
| OTP | Valid OTP issued for another email |
| New Password | `NewPassword123!` |
| Confirm New Password | `NewPassword123!` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter `test@eshop.com` as the account being reset, if email is present in the reset request. | Email is associated with the reset attempt. |
| 2 | Enter an OTP that was issued for another email. | OTP value is entered. |
| 3 | Enter matching strong passwords. | Password fields are valid. |
| 4 | Submit the reset password form. | System rejects the reset because the OTP is not bound to `test@eshop.com`. |

## Expected Result
Password is not changed and reset is rejected.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Submit OTP for another email  
Next State: Reset Rejected

## Status
Not Run
