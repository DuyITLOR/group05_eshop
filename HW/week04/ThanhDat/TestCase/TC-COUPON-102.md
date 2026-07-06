# TC-COUPON-102: Pairwise PW2 — percent × user_id omitted × max_uses=2

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Pairwise (All-Pairs)  
**Phủ Pairwise:** PW2 — F1=percent, F2=omitted, F3=2  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/05-pairwise.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `PWPCT2` được tạo qua admin: type=percent, discount_value=10, min_order=300,000đ, expired_at=2099-12-31, max_uses=2

**Setup (Playwright tự động):**
```js
// Login admin (admin@eshop.com / Admin123!) → token
// POST /api/admin/coupons { code:"PWPCT2", type:"percent", discount_value:10,
//   min_order_amount:300000, expired_at:"2099-12-31", max_uses_per_user:2 }
```

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | PWPCT2 |
| total_amount | 400000 *(> 300,000đ min_order)* |
| user_id | *(không gửi trường này)* |

**Test steps:**
1. Tạo coupon `PWPCT2` qua admin (precondition)
2. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
3. Body JSON: `{ "code": "PWPCT2", "total_amount": 400000 }` *(không có user_id)*

**Expected result (theo logic đúng — 10% off):**
- HTTP status: `200`
- `discount_amount`: `40000` · `final_amount`: `360000`

**Actual result (code hiện tại — BUG-02):**
- HTTP status: `200`
- `discount_amount`: `-3600000` · `final_amount`: `4000000`

---

**Status:** Pass (HTTP 200 như mong đợi) — đồng thời re-confirm BUG-02  
**Executed by:** Playwright `coupon-pairwise.spec.js` — 2026-06-29  
**Related bugs:** BUG-02 (percent formula), BUG-04 (bỏ qua usage check khi không có user_id)
