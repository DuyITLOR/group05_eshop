# TC-COUPON-007: Áp dụng mã giảm giá thành công — happy path

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R7 (C1=Y, C2=Y, C3=Y, C4=Y, C5=Y, C6=Y) → A6  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `BIGBUY`: type=fixed, discount_value=50,000đ, min_order=500,000đ, còn hạn, max_uses=1
- Test user chưa sử dụng `BIGBUY` lần nào

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | BIGBUY |
| total_amount | 600000 |
| user_id | *id của test user* |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "BIGBUY", "total_amount": 600000, "user_id": <id> }`

**Expected result:**
- HTTP status: `200`
- Body:
  ```json
  {
    "success": true,
    "coupon_id": <id của BIGBUY>,
    "discount_amount": 50000,
    "final_amount": 550000,
    "message": "Áp dụng thành công! Giảm 50.000 ₫"
  }
  ```

---

**Status:** Pass  
**Actual result:** HTTP 200 — `{ "success": true, "discount_amount": 50000, "final_amount": 550000, ... }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
