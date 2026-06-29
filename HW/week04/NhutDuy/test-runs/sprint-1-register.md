# Test Run — Sprint 1 — Module Register (FR-01)

**Kỹ thuật:** Decision Table
**Ngày chạy:** 2026-06-29
**Tester:** NhutDuy
**Môi trường:** frontend-web `http://localhost:5173`, backend `http://localhost:3000`

| Test Case ID | Module | Tester | Result | Related Bug | Note |
|---|---|---|---|---|---|
| TC-REGISTER-001 | Register | NhutDuy | Fail | BUG-REGISTER-01 | Mật khẩu mạnh hợp lệ `Pass123!` bị từ chối |
| TC-REGISTER-002 | Register | NhutDuy | Pass | — | Họ tên trống bị chặn bởi thuộc tính `required` |
| TC-REGISTER-003 | Register | NhutDuy | Fail | BUG-REGISTER-02 | Không kiểm tra định dạng email |
| TC-REGISTER-004 | Register | NhutDuy | Fail | BUG-REGISTER-03 | Cho phép đăng ký trùng email |
| TC-REGISTER-005 | Register | NhutDuy | Pass | — | Mật khẩu yếu `pass` bị từ chối đúng kỳ vọng |
| TC-REGISTER-006 | Register | NhutDuy | Fail | BUG-REGISTER-04 | Thiếu trường Xác nhận mật khẩu |

**Tổng kết:** 6 test case · **2 Pass · 4 Fail · 0 Blocked**.
**Bug phát hiện:** 4 (BUG-REGISTER-01 … 04).
