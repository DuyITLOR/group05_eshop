# 04 — Boundary Value Analysis (BVA): feature_A (FR-02 — Login & Account Lockout) (v2)

> **Scope:** Chỉ áp dụng BVA cho các field có **behavioral boundary thực sự trong code** — tức là giá trị tại ngưỡng đó làm thay đổi hành vi hệ thống. Email và password không có constraint độ dài trong code nên không có boundary hành vi → loại bỏ.

---

## BVA Overview

Boundary Value Analysis tập trung vào các giá trị tại **"ranh giới hành vi"** — nơi một sự thay đổi nhỏ trong input dẫn đến kết quả khác nhau của hệ thống. Chỉ có 2 field thỏa mãn điều kiện này trong FR-02:

| Field | Behavioral Boundary | Lý do |
| --- | --- | --- |
| `login_attempts` | threshold = 3 (kích hoạt lock) | Code check `newAttempts >= 3` → hành vi thay đổi rõ ràng |
| `locked_until` | now (phân biệt expired vs locked) | Code check `now < locked_until` → 2 kết quả hoàn toàn khác nhau |

> **Email & password length:** Backend không enforce bất kỳ constraint độ dài nào → không có behavioral boundary → test length thuộc về stress/validation testing, không phải BVA.

---

## Field 1: `login_attempts` — Threshold Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `login_attempts` |
| **Boundary Type** | Integer — threshold |
| **Threshold** | 3 (SPEC FR-02: kích hoạt lock khi `newAttempts >= 3`) |
| **Code behavior** | `newAttempts = stored + 2` → lock khi `stored + 2 >= 3`, tức `stored >= 1` |
| **Observable values** | Normal flow: 0 → 2 → 4 (code nhảy +2 mỗi lần fail) |

**BVA Table (3 điểm quanh threshold = 3):**

| Boundary | Stored Value | Description | Behavior khi fail | Behavior khi pass |
| --- | --- | --- | --- | --- |
| **Threshold-1** | 2 | Ngay trước ngưỡng lock. Đạt được sau 1 lần fail trong normal flow (0→2). | `2+2=4 ≥ 3` → **LOCK triggered**, 401 | `200`, counter reset → 0 |
| **Threshold** | 3 | Đúng bằng threshold SPEC. **Chỉ đạt qua DB manipulation** (normal flow nhảy 0→2→4, bỏ qua 3). | `3+2=5 ≥ 3` → **LOCK triggered**, 401 | `200`, counter reset → 0 (anomaly: value này không xuất hiện trong normal flow) |
| **Threshold+1** | 4 | Sau lần fail thứ 2 trong normal flow (2→4). Account bị lock, `locked_until` đã được set. | `403` (bị block trước khi check counter) | `403` (locked) |

**Lưu ý:**
- Lock thực tế được kích hoạt bởi `newAttempts = stored + 2 >= 3`, không phải `stored >= 3`.
- Với stored = 2: đây là boundary quan trọng nhất trong normal flow — lần fail tiếp theo sẽ lock.
- Với stored = 3: chỉ test được qua DB manipulation, giúp xác nhận anomaly (SPEC threshold = 3 nhưng code nhảy qua).
- Với stored = 4: account đã locked (locked_until đã set), mọi request đều bị chặn bởi lock check trước.

> **ON/OFF point:** Biến boundary thực sự là `newAttempts` (computed `stored + 2`). ON point: `newAttempts = 3` (giá trị đầu tiên kích hoạt lock). OFF point: `newAttempts = 2` (giá trị lớn nhất không kích hoạt lock).

---

## Field 2: `locked_until` — Time Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `locked_until` |
| **Boundary Type** | DATETIME — time comparison |
| **Code logic** | `if (now < locked_until)` → locked (403). Khi `now >= locked_until` → expired (200). |
| **Critical boundary** | `locked_until = now` — phân chia giữa locked và expired |

**BVA Table (3 điểm quanh now):**

| Boundary | Value | Lock Status | Expected |
| --- | --- | --- | --- |
| **Now-1** | `now() - 1 second` | Expired — `now > locked_until` | `200` (unlocked, password đúng) |
| **Now** | `now()` | Edge case — `now == locked_until` (phụ thuộc operator `<` vs `<=`) | `403` hoặc `200` (timing-dependent) |
| **Now+1** | `now() + 1 second` | Locked — `now < locked_until` | `403` |

**Lưu ý:**
- Code dùng `<` (strict less than), nên đúng tại `now()` → `now < locked_until` là **false** → **expired** → `200`.
- Trong thực tế, test `now()` chính xác rất khó do timing — đây là edge case acknowledge, không phải fail.
- Chỉ cần 3 điểm: vừa hết hạn, đúng ranh giới, vừa còn khóa.

> **ON/OFF point:** ON point: `locked_until = now + 1ms` (đang locked, `now < locked_until` = true). OFF point: `locked_until = now - 1ms` (vừa expired, `now < locked_until` = false).

---

## Summary

| Field | Boundary Points | TC IDs |
| --- | --- | --- |
| `login_attempts` | threshold-1 (2), threshold (3), threshold+1 (4) | BVA-A-001 → BVA-A-003 |
| `locked_until` | now-1, now, now+1 | BVA-A-004 → BVA-A-006 |
| **Total** | **6 boundary points** | **6 TCs** |
