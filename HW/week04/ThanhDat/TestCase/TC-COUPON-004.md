# TC-COUPON-004: Mã giảm giá đã hết hạn

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R4 (C1=Y, C2=Y, C3=Y, C4=N) → A4  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `EXPIRED` tồn tại: min_order = 100,000đ, `expired_at = 2020-01-01` (đã hết hạn), `is_active = 1`

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | EXPIRED |
| total_amount | 200000 *(> 100,000đ min_order — thoả C3)* |
| user_id | 1 |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "EXPIRED", "total_amount": 200000, "user_id": 1 }`

**Expected result:**
- HTTP status: `400`
- Body: `{ "error": "Mã giảm giá đã hết hạn" }`

---

**Status:** Pass  
**Actual result:** HTTP 400 — `{ "error": "Mã giảm giá đã hết hạn" }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
