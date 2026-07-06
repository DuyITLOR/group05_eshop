# TC-COUPON-103: Pairwise PW3 — fixed × user_id provided × max_uses=2

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Pairwise (All-Pairs)  
**Phủ Pairwise:** PW3 — F1=fixed, F2=provided, F3=2  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/05-pairwise.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `VIP100`: type=fixed, discount_value=100,000đ, min_order=300,000đ, còn hạn, max_uses=2
- Test user **chưa** dùng `VIP100`

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | VIP100 |
| total_amount | 400000 *(> 300,000đ min_order)* |
| user_id | *id của test user* |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "VIP100", "total_amount": 400000, "user_id": <id> }`

**Expected result:**
- HTTP status: `200`
- `discount_amount`: `100000` · `final_amount`: `300000`

---

**Status:** Pass  
**Actual result:** HTTP 200 — `discount_amount=100000`, `final_amount=300000` (fixed tính đúng)  
**Executed by:** Playwright `coupon-pairwise.spec.js` — 2026-06-29  
**Related bugs:** None
