# TC-COUPON-006: User đã dùng hết lượt cho phép

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R6 (C1=Y, C2=Y, C3=Y, C4=Y, C5=Y, C6=N) → A5  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**
- Server đang chạy
- Coupon `SAVE10`: max_uses_per_user = 1, còn hạn, min_order = 300,000đ
- Test user (`test@eshop.com`) đã sử dụng `SAVE10` đúng 1 lần → hết lượt

**Setup precondition (Playwright tự động):**
```js
// Login → lấy token
// POST /api/coupon-usage với { coupon_id: <SAVE10 id> } và Authorization header
```
Hoặc thủ công:
```sql
INSERT INTO coupon_usage (coupon_id, user_id)
SELECT id, <user_id> FROM coupons WHERE code = 'SAVE10';
```

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | SAVE10 |
| total_amount | 400000 *(> 300,000đ min_order)* |
| user_id | *id của test user* |

**Test steps:**
1. Đảm bảo precondition: test user đã dùng SAVE10 đúng 1 lần
2. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
3. Body JSON: `{ "code": "SAVE10", "total_amount": 400000, "user_id": <id> }`

**Expected result:**
- HTTP status: `400`
- Body: `{ "error": "Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)" }`

---

**Status:** Pass  
**Actual result:** HTTP 400 — `{ "error": "Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)" }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
