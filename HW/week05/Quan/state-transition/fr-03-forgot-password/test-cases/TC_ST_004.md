Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_004.md

Filename: TC_ST_004.md

# TC_ST_004 - Reset Password With Valid OTP And Strong Password

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that valid reset data transitions the flow to Password Reset Success.

## Preconditions
- User is on Step 2 - Reset Input.
- A valid OTP has been generated for `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | Valid OTP for `test@eshop.com` |
| New Password | `NewPassword123!` |
| Confirm New Password | `NewPassword123!` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter the valid OTP. | OTP input accepts the value. |
| 2 | Enter `NewPassword123!` as new password. | Password satisfies FR-01 strong password rule. |
| 3 | Enter `NewPassword123!` as confirmation password. | Confirmation matches the new password. |
| 4 | Submit the reset password form. | System calls `POST /api/reset-password`. |

## Expected Result
Password is reset successfully and system transitions to Password Reset Success.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Submit reset form with valid data  
Next State: Password Reset Success

## Status
Not Run
