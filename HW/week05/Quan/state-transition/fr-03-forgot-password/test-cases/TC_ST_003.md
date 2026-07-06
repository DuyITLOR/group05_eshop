Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_003.md

Filename: TC_ST_003.md

# TC_ST_003 - Show Reset Password Step

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that after OTP is issued, the user can continue to Step 2 - Reset Input.

## Preconditions
- OTP has been generated successfully for `test@eshop.com`.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | OTP returned/displayed by the system |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Complete the OTP request successfully. | OTP is issued for the requested email. |
| 2 | Continue to the reset password step if navigation is required. | Reset form is displayed. |
| 3 | Observe the reset form fields. | Form contains OTP, new password, and confirm new password fields. |

## Expected Result
System transitions to Step 2 - Reset Input.

## Related State Transition
Current State: OTP Issued  
Action: Show reset step  
Next State: Step 2 - Reset Input

## Status
Not Run
