# Test Run – Sprint 1 – Feature A (Register / FR-01)

## Execution information
| Field | Value |
| --- | --- |
| Sprint / Release | Sprint 1 |
| Feature / Module | FR-01 Đăng ký tài khoản / `REGISTER` |
| Environment | macOS, Frontend Web `http://localhost:5173`, Backend API `http://localhost:3000`, commit fork `20a1243` |
| Tester | Lê Nhựt Duy (23127178) |
| Execution date | 2026-06-26 |

## Test run result
| Test Case ID | Module | Tester | Result | Related Bug | Note |
| --- | --- | --- | --- | --- | --- |
| TC-REGISTER-001 | Register | Duy | Fail | BUG-A1 (#17) | Mật khẩu đúng spec `Password123!` bị form từ chối |
| TC-REGISTER-002 | Register | Duy | Pass † | — | HTML5 `required` chặn submit khi tên rỗng ("Please fill out this field") → từ chối đúng |
| TC-REGISTER-003 | Register | Duy | Fail | BUG-A2 (#18) | Tạo user với email `abc` sai định dạng |
| TC-REGISTER-004 | Register | Duy | Fail | BUG-A3 (#19) | Tạo user trùng email `test@eshop.com` |
| TC-REGISTER-005 | Register | Duy | Pass † | — | HTML5 `required` chặn submit khi email rỗng → từ chối đúng |
| TC-REGISTER-006 | Register | Duy | Fail | BUG-A1 (#17) | Mật khẩu yếu có khoảng trắng được chấp nhận |
| TC-REGISTER-007 | Register | Duy | Pass\* | — | Bị chặn (đúng kết quả, sai lý do — xem AI gap) |
| TC-REGISTER-008 | Register | Duy | Pass † | — | HTML5 `required` chặn submit khi mật khẩu rỗng → từ chối đúng |
| TC-REGISTER-009 | Register | Duy | Fail | BUG-A4 (#20) | Form thiếu trường Xác nhận mật khẩu |
| TC-REGISTER-010 | Register | Duy | Pass | — | BVA len=7 bị chặn (đúng) |
| TC-REGISTER-011 | Register | Duy | Fail | BUG-A1 (#17) | BVA len=8 (biên hợp lệ) bị từ chối |
| TC-REGISTER-012 | Register | Duy | Fail | BUG-A1 (#17) | BVA len=9 (biên hợp lệ) bị từ chối |
| TC-REGISTER-013 | Register | Duy | Pass\* | — | EP mật khẩu thiếu chữ thường (`PASSWORD123!`) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-014 | Register | Duy | Pass\* | — | EP mật khẩu thiếu chữ số (`Password!`) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-015 | Register | Duy | Fail | BUG-A2 (#18) | EP tên chỉ gồm khoảng trắng → `required` không chặn, API tạo user |
| TC-REGISTER-016 | Register | Duy | Fail | BUG-A2 (#18) | EP tên toàn chữ số → API tạo user (HTTP 200) |
| TC-REGISTER-017 | Register | Duy | Fail | BUG-A2 (#18) | EP tên chứa thẻ HTML `<b>x</b>` → API lưu nguyên, nguy cơ stored XSS |
| TC-REGISTER-018 | Register | Duy | Fail | BUG-A2 (#18) | EP email thiếu TLD (`user@domain`) → API tạo user |
| TC-REGISTER-019 | Register | Duy | Fail | BUG-A2 (#18) | EP email toàn chữ số (`12345`) → API tạo user |
| TC-REGISTER-020 | Register | Duy | Pass\* | — | EP mật khẩu ký tự đặc biệt ngoài tập (`Password123#`) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-021 | Register | Duy | Pass\* | — | EP mật khẩu toàn chữ số (`12345678`) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-022 | Register | Duy | Pass | — | BVA name=1 ký tự (biên min hợp lệ) → chấp nhận |
| TC-REGISTER-023 | Register | Duy | Pass | — | BVA name=2 ký tự (min+1) → chấp nhận |
| TC-REGISTER-024 | Register | Duy | Pass\* | — | BVA 0 chữ hoa (min−1) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-025 | Register | Duy | Fail | BUG-A1 (#17) | BVA 1 chữ hoa (biên min hợp lệ) bị từ chối |
| TC-REGISTER-026 | Register | Duy | Fail | BUG-A1 (#17) | BVA 2 chữ hoa (min+1 hợp lệ) bị từ chối |
| TC-REGISTER-027 | Register | Duy | Pass\* | — | BVA 0 chữ thường (min−1) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-028 | Register | Duy | Fail | BUG-A1 (#17) | BVA 1 chữ thường (biên min hợp lệ) bị từ chối |
| TC-REGISTER-029 | Register | Duy | Fail | BUG-A1 (#17) | BVA 2 chữ thường (min+1 hợp lệ) bị từ chối |
| TC-REGISTER-030 | Register | Duy | Pass\* | — | BVA 0 chữ số (min−1) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-031 | Register | Duy | Fail | BUG-A1 (#17) | BVA 1 chữ số (biên min hợp lệ) bị từ chối |
| TC-REGISTER-032 | Register | Duy | Fail | BUG-A1 (#17) | BVA 2 chữ số (min+1 hợp lệ) bị từ chối |
| TC-REGISTER-033 | Register | Duy | Pass\* | — | BVA 0 ký tự đặc biệt (min−1) → form chặn (đúng kết quả, sai lý do) |
| TC-REGISTER-034 | Register | Duy | Fail | BUG-A1 (#17) | BVA 1 ký tự đặc biệt (biên min hợp lệ, `!` ∈ tập) bị từ chối |
| TC-REGISTER-035 | Register | Duy | Fail | BUG-A1 (#17) | BVA 2 ký tự đặc biệt (min+1 hợp lệ) bị từ chối |
| TC-REGISTER-036 | Register | Duy | Pass | — | BVA name dài 256 ký tự → chấp nhận (không có giới hạn trên) |
| TC-REGISTER-037 | Register | Duy | Pass | — | BVA password dài 129 ký tự → chấp nhận (không có giới hạn trên) |

**Tổng kết:** 37 designed · 37 executed · 17 Pass · 20 Fail · 0 Blocked · 0 Not Run.

> † TC-002/005/008 (trường rỗng) được đính chính từ Fail → **Pass**: cả 3 input có HTML `required` nên trình duyệt chặn submit; form từ chối đúng. BUG-A2 (backend không validate) chỉ tái hiện khi gọi thẳng API (`curl POST /api/register`), không qua form.

## Evidence
- (Đính kèm screenshot từng test fail khi nộp — đặt trong `bug-report/screenshots/`.)
- Đối chiếu chéo qua API: log script [../run-tests.sh](../run-tests.sh).

## Retest note
Chưa retest. Sau khi developer fix (PR `Fixes #…`), chuyển bug sang **Ready for Retest**, execute lại các TC tương ứng và cập nhật ở file test-run regression của Sprint 2.
