Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_002.md

Filename: TC_ST_002.md

# TC_ST_002 - Generate OTP For Registered Email

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that submitting a registered email generates a 6-digit OTP.

## Preconditions
- User is on Step 1 - Email Input.
- Email `test@eshop.com` is registered.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter `test@eshop.com`. | Email is accepted by the form. |
| 2 | Submit the forgot password request. | System calls `POST /api/forgot-password`. |
| 3 | Observe the OTP response/display. | A random OTP with exactly 6 digits is generated for `test@eshop.com`. |

## Expected Result
System transitions to OTP Issued.

## Related State Transition
Current State: Step 1 - Email Input  
Action: Submit registered email  
Next State: OTP Issued

## Status
Not Run
