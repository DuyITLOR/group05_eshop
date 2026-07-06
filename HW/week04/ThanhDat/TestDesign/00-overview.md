# Test Design — FR-09: Apply Coupon

**Technique:** Decision Table Testing  
**Endpoint:** `POST /api/apply-coupon`

---

## Thông tin feature

| Mục           | Nội dung                                                                                |
| ------------- | --------------------------------------------------------------------------------------- |
| Feature       | FR-09 — Áp dụng mã giảm giá                                                             |
| Module        | COUPON                                                                                  |
| Endpoint      | `POST /api/apply-coupon`                                                                |
| Nguồn đã đọc  | `api_specification.md §5.1`, `backend/server.js:362–441`, `backend/database.js:106–111` |
| Technique     | Decision Table Testing                                                                  |
| Quy ước mã TC | `TC-COUPON-001` trở đi                                                                  |

## Cấu trúc tài liệu thiết kế

| File                       | Nội dung                                    |
| -------------------------- | ------------------------------------------- |
| `01-logic-analysis.md`     | Phân tích luồng xử lý thực tế từ server.js  |
| `02-conditions-actions.md` | Danh sách Conditions và Actions             |
| `03-decision-table.md`     | Bảng quyết định đầy đủ + rút gọn + truy vết |
| `04-bug-findings.md`       | Nghi vấn bug phát hiện khi đọc code         |
| `05-pairwise.md`           | Pairwise (all-pairs) cho tham số độc lập vùng success |

## Seed data (coupon có sẵn trong DB)

| code    | type    | discount_value | min_order_amount | expired_at | is_active | max_uses_per_user |
| ------- | ------- | -------------- | ---------------- | ---------- | --------- | ----------------- |
| SAVE10  | percent | 10             | 300,000đ         | 2099-12-31 | 1         | 1                 |
| BIGBUY  | fixed   | 50,000         | 500,000đ         | 2099-12-31 | 1         | 1                 |
| VIP100  | fixed   | 100,000        | 300,000đ         | 2099-12-31 | 1         | 2                 |
| EXPIRED | percent | 20             | 100,000đ         | 2020-01-01 | 1         | 1                 |

## Test Cases sinh ra

| TC             | Rule   | Mô tả ngắn               | Kết quả       |
| -------------- | ------ | ------------------------ | ------------- |
| TC-COUPON-001  | R1     | Thiếu `code`             | Pass          |
| TC-COUPON-002  | R2     | Mã không tồn tại         | Pass          |
| TC-COUPON-003  | R3     | Đơn chưa đủ tối thiểu    | Pass          |
| TC-COUPON-003b | BUG-01 | Off-by-one tại min_order | Bug confirmed |
| TC-COUPON-004  | R4     | Coupon hết hạn           | Pass          |
| TC-COUPON-005  | R5     | Không có user_id         | Pass          |
| TC-COUPON-006  | R6     | User hết lượt dùng       | Pass          |
| TC-COUPON-007  | R7     | Happy path               | Pass          |
| TC-COUPON-007b | BUG-02 | Percent formula sai      | Bug confirmed |

### Pairwise (all-pairs) — bổ sung, xem `05-pairwise.md`

| TC            | Pairwise | Tổ hợp (type × user_id × max_uses) | Kết quả               |
| ------------- | -------- | ---------------------------------- | --------------------- |
| TC-COUPON-101 | PW1      | percent × provided × 1             | Pass (re-confirm BUG-02) |
| TC-COUPON-102 | PW2      | percent × omitted × 2              | Pass (re-confirm BUG-02) |
| TC-COUPON-103 | PW3      | fixed × provided × 2               | Pass                  |
| TC-COUPON-104 | PW4      | fixed × omitted × 1                | Pass                  |

**Playwright run:**
- Decision Table: `playwright-tests/tests/coupon.spec.js` — 9/9 passed (2026-06-29, 763ms)
- Pairwise: `playwright-tests/tests/coupon-pairwise.spec.js` — 4/4 passed (2026-06-29, 655ms)
