# 05 — BVA Test Cases: feature_B (FR-11 — Xem Lịch sử Đơn hàng) — v1

> **Scope:** BVA cho Orders List Size (fetch action)

---

## Orders List Size — Boundary Value Analysis (6 TC)

| TC ID | Boundary | Scenario | Expected Result |
| --- | --- | --- | --- |
| **BVA-B-001** | Empty (0 orders) | User has 0 orders → GET /api/orders/my-orders | `200` body: `[]` (empty array) |
| **BVA-B-002** | Min+1 (1 order) | User with 1 order → GET /api/orders/my-orders | `200` body: array[1] with 1 order object |
| **BVA-B-003** | Nominal (5 orders) | User with 5 orders → GET /api/orders/my-orders | `200` body: 5 orders sorted DESC by id (newest first). Verify: order[0].id > order[1].id > ... |
| **BVA-B-004** | Large (100+ orders) | User with 100+ orders → GET /api/orders/my-orders | `200` body: all orders returned (not paginated), sorted DESC by id. Response time < 5s |
| **BVA-B-005** | Concurrency (race condition) | Order status=pending, 2 cancel requests simultaneously | 1st: `200` (cancel ok). 2nd: `400` "Cannot cancel" (idempotent). DB: status=canceled (consistent) |
| **BVA-B-006** | Ordering verification (sort by ID DESC) | Multiple orders with different created_at | Orders sorted DESC by id (not by created_at). Verify: response[0].id > response[1].id > ... |

---

## Summary

| Category | Count |
| --- | --- |
| **Total BVA TC** | **6** |

---

## Preconditions

- Authenticated user (JWT token required)
- API endpoint: `GET /api/orders/my-orders` (authenticated)
- API endpoint: `PUT /api/orders/:id/cancel` (authenticated)
- For BVA-B-001: User with 0 orders in DB
- For BVA-B-005: Same order, concurrent cancel requests (use threading/async tools)
