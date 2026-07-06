Path: tests/state-transition/fr-03-forgot-password/test-cases/TC_ST_005.md

Filename: TC_ST_005.md

# TC_ST_005 - Reject Unregistered Email OTP Request

## Technique
State Transition Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify that an unregistered email cannot produce a usable OTP.

## Preconditions
- User is on Step 1 - Email Input.
- Email `notfound@eshop.com` is not registered.

## Test Data

| Field | Value |
|---|---|
| Email | `notfound@eshop.com` |

## Steps

| Step | Action | Expected Result |
|---|---|---|
| 1 | Enter `notfound@eshop.com`. | Email value is entered. |
| 2 | Submit the forgot password request. | System rejects the request or returns a safe response. |
| 3 | Try to continue reset using any displayed/guessed OTP. | No usable OTP exists for reset. |

## Expected Result
System remains at Step 1 - Email Input and does not create a usable OTP.

## Related State Transition
Current State: Step 1 - Email Input  
Action: Submit unregistered email  
Next State: Step 1 - Email Input

## Status
Not Run
