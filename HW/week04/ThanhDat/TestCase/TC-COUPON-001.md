# TC-COUPON-001: Không cung cấp trường `code`

**Requirement ID:** FR-09  
**Module / Test type / Technique:** COUPON / Functional / Decision Table Testing  
**Phủ Rule:** R1 (C1=N) → A1  
**Tham chiếu thiết kế:** `TestDesign/FR-09-Apply-Coupon/03-decision-table.md`

---

**Preconditions:**

- Server backend đang chạy tại `http://localhost:3000`

**Test data:**

| Trường       | Giá trị                  |
| ------------ | ------------------------ |
| code         | _(không gửi trường này)_ |
| total_amount | 500000                   |
| user_id      | 1                        |

**Test steps:**

1. Gửi POST request đến `http://localhost:3000/api/apply-coupon`
2. Body JSON: `{ "total_amount": 500000, "user_id": 1 }` _(không có trường `code`)_

**Expected result:**

- HTTP status: `400`
- Body: `{ "error": "Vui lòng nhập mã giảm giá" }`

---

**Status:** Pass  
**Actual result:** HTTP 400 — `{ "error": "Vui lòng nhập mã giảm giá" }`  
**Executed by:** Playwright `coupon.spec.js` — 2026-06-29  
**Related bugs:** None
