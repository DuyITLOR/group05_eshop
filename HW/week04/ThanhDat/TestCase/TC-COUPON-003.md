# TC-COUPON-003: Đơn hàng chưa đủ giá trị tối thiểu

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R3 (C1=Y, C2=Y, C3=N) → A3  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `SAVE10` tồn tại: min_order = 300,000đ, còn hạn

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | SAVE10 |
| total_amount | 200000 *(< 300,000đ min_order)* |
| user_id | 1 |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "SAVE10", "total_amount": 200000, "user_id": 1 }`

**Expected result:**
- HTTP status: `400`
- Body: `{ "error": "Đơn hàng chưa đủ giá trị tối thiểu 300.000 ₫ để áp dụng mã này" }`

---

**Status:** Pass  
**Actual result:** HTTP 400 — `{ "error": "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này" }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
