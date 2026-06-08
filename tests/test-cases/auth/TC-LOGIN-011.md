# TC-LOGIN-011: Kiểm tra bộ đếm login_attempts tăng đúng 1 đơn vị mỗi lần sai

## Requirement ID
FR-02

## Module / Test type / Technique
Login / Functional / Boundary Value Analysis

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Tài khoản `test@eshop.com` tồn tại, không bị khóa, `login_attempts = 0`.

## Test data
| Field | Value |
| --- | --- |
| Email | test@eshop.com |
| Mật khẩu sai | SaiMatKhau123! |

## Test steps
1. Kiểm tra `login_attempts = 0` trong database.
2. Gửi request POST `/api/login` với mật khẩu sai. (Lần 1)
3. Kiểm tra `login_attempts` trong database — kỳ vọng = 1.
4. Gửi request POST `/api/login` với mật khẩu sai. (Lần 2)
5. Kiểm tra `login_attempts` trong database — kỳ vọng = 2.

## Expected result
- Sau mỗi lần đăng nhập sai, `login_attempts` tăng đúng **1 đơn vị** (theo FR-02).
- Lần 1: `login_attempts = 1`.
- Lần 2: `login_attempts = 2`.
- Bộ đếm **không được** tăng 2 đơn vị mỗi lần.

## Status / Related bugs
Not Run / None
