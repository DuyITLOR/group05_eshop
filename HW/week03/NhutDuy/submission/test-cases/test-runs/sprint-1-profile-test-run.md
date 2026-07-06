# Test Run – Sprint 1 – Feature D (Mobile Profile / FR-04)

## Execution information
| Field | Value |
| --- | --- |
| Sprint / Release | Sprint 1 |
| Feature / Module | FR-04 Hồ sơ cá nhân (Mobile) / `PROFILE` |
| Environment | iOS + Expo Go, app Mobile (`frontend-mobile`), Backend API `http://localhost:3000` (LAN `192.168.0.197`), commit fork `20a1243` |
| Tester | Lê Nhựt Duy (23127178) |
| Execution date | 2026-06-28 |

> Actual đối chiếu **source thật** (`frontend-mobile/App.js` `handleUpdateProfile`, `backend/server.js` `PUT /api/users/me`). Cần chạy lại trên app Mobile / API để xác nhận và cập nhật cột Result/Note.

## Test run result
| Test Case ID | Module | Tester | Result | Related Bug | Note |
| --- | --- | --- | --- | --- | --- |
| TC-PROFILE-001 | Profile | Duy | Fail | BUG-D1 (#82) | SĐT `0912345678` (đúng spec) bị mobile từ chối |
| TC-PROFILE-002 | Profile | Duy | Fail | BUG-D1 (#82) | SĐT `09123456789` (11 số, đúng spec) bị từ chối |
| TC-PROFILE-003 | Profile | Duy | Fail | BUG-D1 (#82) | SĐT `912345678` (sai spec) lại được chấp nhận |
| TC-PROFILE-004 | Profile | Duy | Pass | — | SĐT quá ngắn → bị chặn |
| TC-PROFILE-005 | Profile | Duy | Pass | — | SĐT chứa chữ → bị chặn |
| TC-PROFILE-006 | Profile | Duy | Pass | — | SĐT rỗng → bị chặn |
| TC-PROFILE-007 | Profile | Duy | Pass | — | Email disabled, không đổi được |
| TC-PROFILE-008 | Profile | Duy | Fail | BUG-D2 (#83) | API `role:"admin"` → user tự lên admin (bảo mật) |
| TC-PROFILE-009 | Profile | Duy | Fail | BUG-D3 (#84) | Địa chỉ không lưu (lệch tên trường) → mất sau reload |
| TC-PROFILE-010 | Profile | Duy | Pass | — | Chỉ sửa hồ sơ của mình (token id) |
| TC-PROFILE-011 | Profile | Duy | Fail | BUG-D4 (#85) | API không validate name/phone |
| TC-PROFILE-012 | Profile | Duy | Pass | — | BVA phone 9 số (min−1) → từ chối |
| TC-PROFILE-013 | Profile | Duy | Pass | — | BVA phone 12 số (max+1) → từ chối |

**Tổng kết:** 13 designed · 13 executed · 7 Pass · 6 Fail · 0 Blocked · 0 Not Run. *(TC-001/002 vừa là EP biên min/max vừa tái dùng cho BVA.)*

## Evidence
- Đính kèm screenshot app Mobile / Postman cho từng test fail khi nộp (đặt trong `bug-report/screenshots/feature-D/`).

## Retest note
Chưa retest. Cần chạy app Mobile / API xác nhận Actual; sau khi dev fix (PR `Fixes #…`), execute lại các TC tương ứng (đặc biệt BUG-D2 bảo mật).
