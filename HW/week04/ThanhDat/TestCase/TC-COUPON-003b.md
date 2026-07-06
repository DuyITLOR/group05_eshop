# TC-COUPON-003b: Off-by-one — total_amount bằng đúng min_order_amount

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Mục đích:** Xác nhận BUG-01 (off-by-one `>` thay vì `>=`)  
**Tham chiếu:** `TestDesign/FR-09-Apply-Coupon/04-bug-findings.md` — B1

---

**Preconditions:**
- Server đang chạy
- Coupon `SAVE10` tồn tại: min_order = 300,000đ

**Test data:**

| Trường | Giá trị |
|--------|---------|
| code | SAVE10 |
| total_amount | 300000 *(= min_order_amount)* |
| user_id | 1 |

**Test steps:**
1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "code": "SAVE10", "total_amount": 300000, "user_id": 1 }`

**Expected result (theo spec đúng):**
- HTTP status: `200` — đơn bằng đúng mức tối thiểu nên được áp dụng

**Actual result (theo code hiện tại — có bug):**
- HTTP status: `400`
- Body: `{ "error": "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này" }`

---

**Status:** Bug confirmed  
**Root cause:** `server.js:379` dùng `total_amount > min_order_amount` (strict), khi bằng nhau thì vào nhánh else → lỗi sai  
**Fix:** Đổi `>` thành `>=`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** BUG-01
