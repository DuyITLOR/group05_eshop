Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_010.md

Filename: TC_ST_010.md

# TC_ST_010 - Back To Login From Step 1

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that the user can return to Login Page from Step 1.

## Preconditions
- User is on Step 1 - Email Input.

## Test Data

| Field | Value |
|---|---|
| N/A | N/A |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click `Quay lại đăng nhập`. | System navigates back to the Login Page. |

## Expected Result
User returns to Login Page and no OTP is created.

## Related State Transition
Current State: Step 1 - Email Input  
Action: Click back to login  
Next State: Login Page

## Status
Not Run
