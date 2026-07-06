Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_006.md

Filename: TC_ST_006.md

# TC_ST_006 - Reject Reset With Wrong OTP

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that a wrong OTP cannot reset the password.

## Preconditions
- User is on Step 2 - Reset Input.
- A valid OTP has been generated for `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | `000000` |
| New Password | `NewPassword123!` |
| Confirm New Password | `NewPassword123!` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter wrong OTP `000000`. | OTP input accepts the value. |
| 2 | Enter matching strong passwords. | Password fields are valid. |
| 3 | Submit the reset password form. | System rejects the reset because OTP is wrong. |

## Expected Result
Password is not changed and reset is rejected.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Submit wrong OTP  
Next State: Reset Rejected

## Status
Not Run
