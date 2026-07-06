Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_008.md

Filename: TC_ST_008.md

# TC_ST_008 - Reject Weak New Password

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that a new password violating FR-01 cannot be used for reset.

## Preconditions
- User is on Step 2 - Reset Input.
- A valid OTP has been generated for `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | Valid OTP for `test@eshop.com` |
| New Password | `weakpass` |
| Confirm New Password | `weakpass` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter the valid OTP. | OTP is accepted as input. |
| 2 | Enter `weakpass` as new password. | Password violates FR-01 because it lacks uppercase, digit, and special character. |
| 3 | Enter `weakpass` as confirmation password. | Confirmation matches but password policy is still invalid. |
| 4 | Submit the reset password form. | System rejects the reset and shows a password policy error. |

## Expected Result
Password is not changed and reset is rejected.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Submit weak new password  
Next State: Reset Rejected

## Status
Not Run
