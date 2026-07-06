# TC-COUPON-005: Áp dụng thành công không có user_id (anonymous)

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R5 (C1=Y, C2=Y, C3=Y, C4=Y, C5=N) → A6  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `BIGBUY` tồn tại: type=fixed, discount_value=50,000đ, min_order=500,000đ, còn hạn

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
- Body:
  ```json
  {
    "success": true,
    "discount_amount": 50000,
    "final_amount": 550000
  }
  ```

---

**Status:** Pass  
**Actual result:** HTTP 200 — `{ "success": true, "discount_amount": 50000, "final_amount": 550000, ... }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** BUG-03 (không cần auth token), BUG-05 (usage limit bị bỏ qua khi không có user_id)
