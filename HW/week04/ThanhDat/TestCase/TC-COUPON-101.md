# TC-COUPON-101: Pairwise PW1 — percent × user_id provided × max_uses=1

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Pairwise (All-Pairs)  
**Phủ Pairwise:** PW1 — F1=percent, F2=provided, F3=1  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/05-pairwise.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `SAVE10`: type=percent, discount_value=10, min_order=300,000đ, còn hạn, max_uses=1
- Test user (`test@eshop.com`) **chưa** dùng `SAVE10` (coupon_usage trống cho cặp này)

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | SAVE10 |
| total_amount | 400000 *(> 300,000đ min_order)* |
| user_id | *id của test user* |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "SAVE10", "total_amount": 400000, "user_id": <id> }`

**Expected result (theo logic đúng — 10% off):**
- HTTP status: `200`
- `discount_amount`: `40000` · `final_amount`: `360000`

**Actual result (code hiện tại — BUG-02):**
- HTTP status: `200`
- `discount_amount`: `-3600000` · `final_amount`: `4000000`

---

**Status:** Pass (HTTP 200 như mong đợi) — đồng thời re-confirm BUG-02 ở giá trị discount  
**Executed by:** Playwright `coupon-pairwise.spec.js` — 2026-06-29  
**Related bugs:** BUG-02 (percent formula)
