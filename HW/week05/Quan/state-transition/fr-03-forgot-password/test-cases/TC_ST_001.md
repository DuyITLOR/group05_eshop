Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_001.md

Filename: TC_ST_001.md

# TC_ST_001 - Open Forgot Password Step 1

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that the user can transition from Login Page to Step 1 - Email Input.

## Preconditions
- User is on the Login Page.

## Test Data

| Field | Value |
|---|---|
| N/A | N/A |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Click the forgot password link/button. | The forgot password flow opens. |
| 2 | Observe the displayed form. | The email input form is shown with Step Indicator `Bước 1 / 2` and button `Quay lại đăng nhập`. |

## Expected Result
System transitions to Step 1 - Email Input.

## Related State Transition
Current State: Login Page  
Action: Click forgot password  
Next State: Step 1 - Email Input

## Status
Not Run
