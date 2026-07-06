Path: tests/use-case/fr-03-forgot-password/test-cases/TC_UC_007.md

Filename: TC_UC_007.md

# TC_UC_007 - Reject Weak New Password

## Technique
Use Case Testing

## Feature
FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)

## Objective
Verify exception flow when the new password violates FR-01.

## Preconditions
- A valid OTP has been generated for `test@eshop.com`.
- User is on Step 2 - Reset Input.

## Test Data

| Field | Value |
|---|---|
| Email | `test@eshop.com` |
| OTP | Valid OTP for `test@eshop.com` |
| New Password | `weakpass` |
| Confirm New Password | `weakpass` |

## Steps

| Step | User Action | Expected System Response |
|---|---|---|
| 1 | Enter the valid OTP. | OTP value is accepted as input. |
| 2 | Enter `weakpass` for both password fields. | System detects password does not satisfy FR-01. |
| 3 | Submit the reset form. | System rejects the reset and shows password policy error. |

## Expected Result
Password is not changed.

## Related Use Case Flow
EF-UC-004

## Status
Not Run
