# TC-COUPON-007b: Percent coupon — công thức tính discount sai

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Mục đích:** Xác nhận BUG-02 (công thức tính giảm giá phần trăm sai)  
**Tham chiếu:** `TestDesign/FR-09-Apply-Coupon/04-bug-findings.md` — B2

---

**Preconditions:**
- Server đang chạy
- Coupon `SAVE10`: type=percent, discount_value=10, min_order=300,000đ, còn hạn

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | SAVE10 |
| total_amount | 400000 |
| user_id | *(không gửi — tránh usage check từ TC-006)* |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "SAVE10", "total_amount": 400000 }`

**Expected result (theo logic đúng — 10% off):**
- HTTP status: `200`
- `discount_amount`: `40000` *(10% × 400,000)*
- `final_amount`: `360000` *(400,000 − 40,000)*

**Actual result (theo code hiện tại — có bug):**
- HTTP status: `200`
- `discount_amount`: `-3600000` *(400000 × (1 − 10) = 400000 × −9)*
- `final_amount`: `4000000` *(400000 − (−3600000))*

---

**Status:** Bug confirmed  
**Root cause:** `server.js:399` — `Math.floor(total_amount * (1 - coupon.discount_value))` với `discount_value=10` (integer) → nhân với −9  
**Fix:** `Math.floor(total_amount * (coupon.discount_value / 100))`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** BUG-02
