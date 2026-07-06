# TC-COUPON-002: Mã giảm giá không tồn tại trong hệ thống

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R2 (C1=Y, C2=N) → A2  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Mã `INVALID999` không tồn tại trong bảng `coupons`

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | INVALID999 |
| total_amount | 500000 |
| user_id | 1 |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "INVALID999", "total_amount": 500000, "user_id": 1 }`

**Expected result:**
- HTTP status: `404`
- Body: `{ "error": "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" }`

---

**Status:** Pass  
**Actual result:** HTTP 404 — `{ "error": "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
