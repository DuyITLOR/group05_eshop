Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_011.md

Filename: TC_ST_011.md

# TC_ST_011 - Back To Login From Step 2

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that the user can return to Login Page from Step 2 if the UI provides this control.

## Preconditions
- User is on Step 2 - Reset Input.

## Test Data

| Field | Value |
|---|---|
| N/A | N/A |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click `Quay lại đăng nhập` if available on Step 2. | System navigates back to the Login Page. |
| 2 | Do not submit reset password data. | Password remains unchanged. |

## Expected Result
User returns to Login Page without resetting the password.

## Related State Transition
Current State: Step 2 - Reset Input  
Action: Click back to login  
Next State: Login Page

## Status
Not Run
