# 05 — BVA Test Cases: feature_A (FR-02 — Login & Account Lockout) (v2)

> **Scope:** 6 TCs từ `04_bva_table_v2.md` — chỉ `login_attempts` (threshold boundary) và `locked_until` (time boundary). Email/password length không có behavioral boundary trong code nên không có TC.

---

## B1. login_attempts — Threshold Boundary (BVA-A-001 → BVA-A-003)

| TC ID | Boundary | Pre-condition | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- |
| **BVA-A-001** | Threshold-1 (stored=2) — wrong pw | Backend running. Set DB: `login_attempts=2`, `locked_until=NULL` | 1. POST `/api/auth/login` với password sai 2. Verify DB: `login_attempts`, `locked_until` | Email: `test@eshop.com`, Password: `WrongPass!` | `401`. `login_attempts` 2→4 (`2+2=4 ≥ 3`). `locked_until` được set → **LOCK triggered**. |
| **BVA-A-002** | Threshold (stored=3, DB manipulation only) — correct pw | Backend running. Set DB: `login_attempts=3`, `locked_until=NULL` *(chỉ đạt qua DB, normal flow nhảy 0→2→4)* | 1. POST `/api/auth/login` với password đúng 2. Verify response + DB | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned. `login_attempts` reset → 0. *(Anomaly: SPEC threshold=3 nhưng code không bao giờ produce value này trong normal flow)* |
| **BVA-A-003** | Threshold+1 (stored=4, locked_until=future) — any login | Backend running. Set DB: `login_attempts=4`, `locked_until=future` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`. Login bị block trước khi check password. |

---

## B2. locked_until — Time Boundary (BVA-A-004 → BVA-A-006)

| TC ID | Boundary | Pre-condition | Steps | Test Data | Expected Result |
| --- | --- | --- | --- | --- | --- |
| **BVA-A-004** | Now-1 (vừa hết hạn) | Backend running. Set DB: `locked_until = now() - 1 second`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng (trong vòng 1s) | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned. Lock đã expired (`now > locked_until`). Counter reset → 0. |
| **BVA-A-005** | Now (đúng ranh giới) | Backend running. Set DB: `locked_until = now()` | 1. POST `/api/auth/login` với password đúng ngay lập tức | Email: `test@eshop.com`, Password: `Test1234!` | `200` (code dùng `<`: `now < locked_until` → false → expired). Kết quả có thể thay đổi theo timing. |
| **BVA-A-006** | Now+1 (vừa còn khóa) | Backend running. Set DB: `locked_until = now() + 1 second`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng ngay lập tức | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`. Lock chưa hết hạn (`now < locked_until`). |

---

## Summary

| Group | TC IDs | Count |
| --- | --- | --- |
| `login_attempts` threshold boundary | BVA-A-001 → BVA-A-003 | 3 |
| `locked_until` time boundary | BVA-A-004 → BVA-A-006 | 3 |
| **Total** | | **6** |
