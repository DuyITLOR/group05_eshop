#!/usr/bin/env bash
# Tạo 6 GitHub Issue cho Feature A (FR-01 Register) trên repo fork nhóm.
# SV: Lê Nhựt Duy - 23127178
#
# YÊU CẦU: đã đăng nhập gh trước  ->  gh auth login   (hoặc export GH_TOKEN=...)
# CHẠY 1 LẦN DUY NHẤT (chạy lại sẽ tạo issue trùng).
#
# Ảnh: gh không upload được ảnh local. Sau khi tạo, mở từng issue trên web,
#      kéo-thả ảnh từ bug-report/screenshots/ vào chỗ "<!-- chèn ảnh -->".

set -euo pipefail
REPO="DuyITLOR/group05_eshop"

echo ">> Repo đích: $REPO"
gh auth status >/dev/null || { echo "Chưa đăng nhập gh. Chạy: gh auth login"; exit 1; }

# --- Tạo label (bỏ qua nếu đã có) ---
mklabel() { gh label create "$1" -R "$REPO" --color "$2" --description "$3" 2>/dev/null || true; }
mklabel "type: bug"          "d73a4a" "Lỗi"
mklabel "module: register"   "1d76db" "FR-01 Đăng ký"
mklabel "severity: critical" "b60205" "Nghiêm trọng"
mklabel "severity: major"    "d93f0b" "Lớn"
mklabel "severity: minor"    "fbca04" "Nhỏ"
mklabel "priority: P0"       "b60205" ""
mklabel "priority: P1"       "d93f0b" ""
mklabel "priority: P2"       "fbca04" ""
mklabel "priority: P3"       "0e8a16" ""
mklabel "status: new"        "ededed" ""
mklabel "found-by: test-case" "5319e7" ""

newissue() { # $1 title ; $2 body ; $3 labels
  gh issue create -R "$REPO" --title "$1" --body "$2" --label "$3"
}

newissue \
"[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt" \
"**Found by Test Case:** TC-REGISTER-001, 006, 011, 012, 025–035
**Requirement:** FR-01 · **Severity/Priority:** Critical / P0
**Environment:** Chrome / macOS / http://localhost:5173/register

**Steps to reproduce**
1. Mở /register, nhập name + email mới + mật khẩu \`Password123!\` (đúng spec).
2. Bấm Đăng Ký.

**Expected:** Đăng ký thành công (mật khẩu ≥8, có hoa/thường/số/ký tự đặc biệt).
**Actual:** Form báo \"Mật khẩu quá yếu!\" và chặn. Ngược lại \`Password 1\` (có khoảng trắng, thiếu đặc biệt) lại được chấp nhận. Regex \`Register.jsx:15\` = \`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\s)[A-Za-z\\d\\s]{8,}\$/\` — đòi \`\\s\` và lớp ký tự không cho ký tự đặc biệt.

**Evidence:** <!-- chèn ảnh: bug-a1-strong-rejected.png, bug-a1-weak-accepted-payload.png, bug-a1-weak-accepted-200.png -->" \
"type: bug,module: register,severity: critical,priority: P0,status: new,found-by: test-case"

newissue \
"[BUG][module: register] API /register không validate đầu vào" \
"**Found by Test Case:** TC-REGISTER-003, 015, 016, 017, 018, 019
**Requirement:** FR-01 · **Severity/Priority:** Critical / P1
**Environment:** API POST http://localhost:3000/api/register

**Steps to reproduce**
1. Mở /register, nhập email sai định dạng \`abc\` (hoặc tên toàn số/HTML), mật khẩu \`Password 1\`.
2. Mở DevTools > Network, bấm Đăng Ký, xem request \`register\`.

**Expected:** Backend từ chối (400) khi email sai định dạng/rỗng, mật khẩu yếu/rỗng, tên rỗng.
**Actual:** Trả HTTP 200 \`{\"message\":\"User registered successfully\"}\` cho mọi đầu vào không hợp lệ. \`server.js:20\` insert thẳng vào DB, không kiểm tra. (Trường rỗng bị HTML \`required\` chặn ở form; lỗi chỉ tái hiện ở mức API hoặc dữ liệu không rỗng nhưng sai.)

**Evidence:** <!-- chèn ảnh: bug-a2-input-invalid-email.png, bug-a2-api-200.png, bug-a2-tc015..019 -->" \
"type: bug,module: register,severity: critical,priority: P1,status: new,found-by: test-case"

newissue \
"[BUG][module: register] Email không duy nhất (cho phép trùng)" \
"**Found by Test Case:** TC-REGISTER-004
**Requirement:** FR-01 · **Severity/Priority:** Major / P1

**Steps to reproduce**
1. Đăng ký với email \`test@eshop.com\` (đã tồn tại sẵn — tài khoản seed).
2. Đăng ký lần nữa cũng email đó.

**Expected:** Từ chối \"Email đã tồn tại\".
**Actual:** Tạo thêm tài khoản trùng email (id mới). DB thiếu \`UNIQUE\` (\`database.js:50\`), code không kiểm tra trùng.

**Evidence:** <!-- chèn ảnh: bug-a3-payload-dup-1.png, bug-a3-payload-dup-2.png -->" \
"type: bug,module: register,severity: major,priority: P1,status: new,found-by: test-case"

newissue \
"[BUG][module: register] Form thiếu trường Xác nhận mật khẩu" \
"**Found by Test Case:** TC-REGISTER-009
**Requirement:** FR-01 · **Severity/Priority:** Major / P2

**Steps to reproduce**
1. Mở /register, quan sát các trường của form.

**Expected:** Có trường Xác nhận mật khẩu; từ chối khi không khớp.
**Actual:** Form chỉ có name/email/password — không có trường xác nhận mật khẩu (\`Register.jsx\`).

**Evidence:** <!-- chèn ảnh: bug-a4-no-confirm-field.png -->" \
"type: bug,module: register,severity: major,priority: P2,status: new,found-by: test-case"

newissue \
"[BUG][module: register] Email field dùng type=\"text\" thay vì type=\"email\"" \
"**Found by:** Kiểm tra UI/source
**Requirement:** FR-01/FR-02 · **Severity/Priority:** Minor / P3

**Steps to reproduce**
1. Mở /register > DevTools > Elements, inspect ô Email.

**Expected:** \`type=\"email\"\` (có HTML5 validate định dạng).
**Actual:** \`type=\"text\"\` (\`Register.jsx:48\`) → không validate định dạng phía trình duyệt.

**Evidence:** <!-- chèn ảnh: bug-a5-email-type-text.png -->" \
"type: bug,module: register,severity: minor,priority: P3,status: new"

newissue \
"[BUG][module: register] Mật khẩu lưu plaintext (SEC-01)" \
"**Found by Test Case:** TC-REGISTER-001 (kiểm bảo mật)
**Requirement:** SEC-01 · **Severity/Priority:** Critical / P1

**Steps to reproduce**
1. Đăng ký/đăng nhập 1 user, gọi \`GET /api/users/me\` (hoặc xem bảng \`users\` trong DB).

**Expected:** Mật khẩu được hash, không lộ plaintext.
**Actual:** Trường \`password\` lưu/trả nguyên văn (\`server.js:23,52,114\` dùng \`SELECT *\` trả cả password).

**Evidence:** <!-- chèn ảnh: bug-a6-plaintext-password.png -->" \
"type: bug,module: register,severity: critical,priority: P1,status: new,found-by: test-case"

echo ">> Đã tạo 6 issue. Liệt kê:"
gh issue list -R "$REPO" --limit 20
