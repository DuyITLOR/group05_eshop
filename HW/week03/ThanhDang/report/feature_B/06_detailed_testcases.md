# 06 — Detailed Test Cases: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Domain + BVA + UI test cases, sẵn sàng thực thi. Validate response structure, UI rendering, error handling.

---

## A. Domain Tests (20 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-B-001 | Fetch orders — response structure validation | User logged in (test@eshop.com) | 1. GET /api/orders/my-orders + Bearer token 2. Verify response structure | Valid JWT, user has 3 orders | `200`, body: Array of order objects. Each order has: { id, user_id, total_amount, status, shipping_address, created_at }. No sensitive fields (no password). DB: không đổi | | |
| DT-B-002 | Fetch without token | User not logged in / no token | 1. GET /api/orders/my-orders (no auth header) | No JWT | `401 Unauthorized` (unauthenticated middleware blocks). DB: không đổi | | |
| DT-B-003 | Fetch with expired token | Expired JWT exists | 1. GET /api/orders/my-orders + expired token | Expired JWT | `401 Unauthorized` (token validation fails). DB: không đổi | | |
| DT-B-004 | Fetch with malformed token | Invalid JWT syntax | 1. GET /api/orders/my-orders + invalid JWT | Malformed JWT | `401 Unauthorized` (JWT parsing fails). DB: không đổi | | |
| DT-B-005 | Cancel non-existent order | Order ID doesn't exist | 1. PUT /api/orders/99999/cancel | orderId=99999 | `404`, body: `{ error: "Order not found" }`. DB: không đổi | | |
| DT-B-006 | Cancel different user's order (security isolation) | Order exists but owned by admin | 1. PUT /api/orders/5/cancel (as test user) | admin's orderId=5 | `404`, body: `{ error: "Order not found" }` (security: không tiết lộ order tồn tại). DB: không đổi | | |
| DT-B-007 | Cancel with bad orderId format | Invalid orderId type | 1. PUT /api/orders/abc/cancel | orderId=abc (string) | `404`, body: `{ error: "Order not found" }` (treated as invalid ID). DB: không đổi | | |
| DT-B-008 | Cancel order (pending status) — verify response + DB update | Order status=pending, owned by user | 1. PUT /api/orders/{id}/cancel 2. Verify DB status changed 3. GET /api/orders/my-orders verify status | status=pending, orderId valid | `200`, body: `{ message: "Order canceled successfully" }` (NOT updated order). DB: `status` → `canceled`. Follow-up fetch shows updated status. | | |
| DT-B-009 | Cancel order (confirmed status) — verify response + DB update | Order status=confirmed, owned by user | 1. PUT /api/orders/{id}/cancel 2. Verify DB status changed 3. GET /api/orders/my-orders verify status | status=confirmed, orderId valid | `200`, body: `{ message: "Order canceled successfully" }` (NOT updated order). DB: `status` → `canceled`. Follow-up fetch shows updated status. | | |
| DT-B-010 | Cancel order (delivered status) — reject | Order status=delivered, owned by user | 1. PUT /api/orders/{id}/cancel | status=delivered | `400`, body: `{ error: "Cannot cancel this order." }`. DB: status vẫn `delivered` | | |
| DT-B-011 | Cancel order (canceled status) — idempotent | Order already canceled, owned by user | 1. PUT /api/orders/{id}/cancel (1st call) 2. PUT /api/orders/{id}/cancel (2nd call) | status=canceled | Both calls: `400`, body: `{ error: "Cannot cancel this order." }`. DB: status vẫn `canceled`. Idempotent (no side effect). | | |
| DT-B-012 | Cancel order (shipping status) — **BUG** | Order status=shipping, owned by user | 1. PUT /api/orders/{id}/cancel | status=shipping | **SPEC (FR-10):** `400` (User cannot cancel). **CODE ACTUAL:** `200`, body: `{ message: "Order canceled successfully" }`. DB: status → `canceled` (**BUG: violates SPEC**). | | |
| DT-B-013 | User isolation (fetch) — verify filter | Two users with different orders | 1. Login as test → GET /api/orders/my-orders (has 3 orders) 2. Login as admin → GET /api/orders/my-orders (has 2 orders) | JWT for test + admin | `200` both users. test user sees only their 3 orders. admin sees only their 2 orders. No cross-user leakage. DB: không đổi | | |
| DT-B-016 | Fetch orders — error handling (DB error) | Simulate DB connection failure | 1. Disconnect DB / cause DB error 2. GET /api/orders/my-orders | Valid JWT, DB unavailable | `500` (internal error) or graceful error response. NOT undefined JSON / crash | | |
| DT-B-017 | Access without login (authorization boundary) | User not authenticated | 1. Clear token / logout 2. Navigate to Profile page 3. Verify behavior | No JWT / null user | Frontend shows "Vui lòng đăng nhập" message. No API call made. No crash. | | |
| DT-B-018 | Handle NULL created_at field | Order with created_at=NULL in DB | 1. Set order.created_at=NULL 2. GET /api/orders/my-orders 3. Verify rendering | Order with NULL created_at | Frontend handles gracefully (blank date, default, or error message). NOT crash. Date format check: no "Invalid Date" displayed. | | |
| DT-B-019 | Handle NULL total_amount field | Order with total_amount=NULL in DB | 1. Set order.total_amount=NULL 2. GET /api/orders/my-orders 3. Verify rendering | Order with NULL total_amount | Frontend handles gracefully (displays "0 ₫" or blank). NOT crash. Price format check: no "NaN ₫" displayed. | | |

---

## B. BVA Tests (6 TC)

> Source: `05_bva_testcases_v1.md` — Orders List Size + Ordering + Concurrency

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-B-001 | Fetch list size = 0 (Empty) | User with 0 orders | 1. GET /api/orders/my-orders | New user, no orders | `200`, body: empty array `[]`. DB: không đổi | | |
| BVA-B-002 | Fetch list size = 1 (Min+1) | User with 1 order | 1. GET /api/orders/my-orders | User with 1 order | `200`, body: array[1] (1 order object). DB: không đổi | | |
| BVA-B-003 | Fetch list size = 5 (Nominal) | User with 5 orders | 1. GET /api/orders/my-orders 2. Verify order sequence | User with 5 orders | `200`, body: 5 orders in DESC order by id. Verify: orders[0].id > orders[1].id > orders[2].id (descending). DB: không đổi | | |
| BVA-B-004 | Fetch list size = 100+ (Large) | User with 100+ orders | 1. GET /api/orders/my-orders 2. Verify all returned, DESC order | User with 100+ orders | `200`, body: all orders returned (not paginated). All in DESC order by id. DB: không đổi. Performance: response < 5s | | |
| BVA-B-005 | Concurrent cancel requests (race condition) | Order status=pending, 2 users with same order(?) or same user | 1. Send 2x PUT /api/orders/{id}/cancel simultaneously 2. Verify DB state | Same orderId, concurrent requests | First request: `200` (cancel succeeds). Second request: `400` "Cannot cancel" (idempotent). DB: status=canceled (consistent). No race condition corruption. | | |
| BVA-B-006 | Date ordering verification (sort by ID DESC = newest first) | Multiple orders created at different times | 1. GET /api/orders/my-orders 2. Compare order IDs vs timestamps 3. Verify newest order appears first | Orders with created_at: T1 < T2 < T3 but ID1 < ID2 < ID3 | ID3 order appears first in response (DESC by id). Verify: response[0].id = 3, response[1].id = 2, etc. | | |

---

## C. UI Tests (9 TC)

> FR-22 Form Requirements + FR-21 UI Standards

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-B-001 | Status translated to Vietnamese | Orders displayed on Profile | 1. Navigate to Profile 2. View order status column 3. Read labels | Order with status=pending | Status shows "Chờ xác nhận" (Vietnamese), NOT "pending" | | |
| UI-B-002 | Status color differentiation (FR-21 color consistency) | Orders with different statuses visible | 1. View multiple orders with statuses: pending, confirmed, shipping, delivered, canceled 2. Inspect badge colors | All 5 statuses | pending=yellow (bg-yellow-100), confirmed=indigo (bg-indigo-100), shipping=blue (bg-blue-100), delivered=green (bg-green-100), canceled=red (bg-red-100) | | |
| UI-B-003 | Empty state message (FR-24 empty state) | New user with 0 orders | 1. Navigate to Profile (new user) 2. Check "Lịch sử đơn hàng" section | No orders | Shows message: "Bạn chưa có đơn hàng nào." (not blank, not crash) | | |
| UI-B-004 | Date format readable (not ISO string) | Orders with various created_at values | 1. View order dates 2. Verify format | Multiple orders | Dates displayed in locale format (e.g., "6/24/2026"), NOT ISO "2026-06-24T10:00:00Z" | | |
| UI-B-005 | Price format with ₫ + thousand separators (FR-21 currency) | Orders with various total_amount values | 1. View total_amount column 2. Check formatting | Orders: 100000, 500000, 1500000 | Format: "100,000 ₫", "500,000 ₫", "1,500,000 ₫" (with comma separators, ₫ suffix) | | |
| UI-B-006 | Order ID display with # prefix | Order table visible | 1. View "Mã ĐH" column | Orders with id: 1, 5, 10 | Displayed as "#1", "#5", "#10" (with # prefix) | | |
| UI-B-007 | Cancel button visibility (pending/confirmed/shipping) | Orders with these statuses | 1. View each order status 2. Check for "Hủy đơn" button | status ∈ {pending, confirmed, shipping} | Cancel button VISIBLE for each status | | |
| UI-B-008 | Cancel button hidden (delivered/canceled) | Orders with these statuses | 1. View each order status 2. Check for "Hủy đơn" button | status ∈ {delivered, canceled} | Cancel button NOT VISIBLE / DISABLED (hidden from UI) | | |
| UI-B-009 | Error alert on cancel failure | User attempts cancel but gets 400/404 error | 1. Click cancel button 2. Server returns error 3. Check alert message | Cancel fails (e.g., shipping order or 404) | Alert shows error message (e.g., "Lỗi: Cannot cancel this order") — not silent failure, not generic "error" | | |

---

## Summary

| Category | Count | Range |
| --- | --- | --- |
| Domain | 20 | DT-B-001 → DT-B-019 |
| BVA | 6 | BVA-B-001 → BVA-B-006 |
| UI | 9 | UI-B-001 → UI-B-009 |
| **Total** | **35** | |

---

## Notes

- **Domain Testing:** authentication, authorization, error handling, DB validation, NULL field handling, response structure, spec mismatch
- **BVA:** list size boundaries (0, 1, 5, 100+), DESC ordering verification, concurrent requests, race condition safety
- **UI Tests:** FR-22 form requirements + FR-21 UI standards (Vietnamese labels, colors, formatting, button visibility)
