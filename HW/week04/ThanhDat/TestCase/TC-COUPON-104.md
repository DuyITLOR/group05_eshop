# TC-COUPON-104: Pairwise PW4 — fixed × user_id omitted × max_uses=1

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Pairwise (All-Pairs)  
**Phủ Pairwise:** PW4 — F1=fixed, F2=omitted, F3=1  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/05-pairwise.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `BIGBUY`: type=fixed, discount_value=50,000đ, min_order=500,000đ, còn hạn, max_uses=1

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | BIGBUY |
| total_amount | 600000 *(> 500,000đ min_order)* |
| user_id | *(không gửi trường này)* |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "BIGBUY", "total_amount": 600000 }` *(không có user_id)*

**Expected result:**
- HTTP status: `200`
- `discount_amount`: `50000` · `final_amount`: `550000`

---

**Status:** Pass  
**Actual result:** HTTP 200 — `discount_amount=50000`, `final_amount=550000`  
**Executed by:** Playwright `coupon-pairwise.spec.js` — 2026-06-29  
**Related bugs:** BUG-04 (bỏ qua usage check khi không có user_id)
