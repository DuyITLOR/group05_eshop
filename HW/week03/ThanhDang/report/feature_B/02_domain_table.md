# 02 — Domain Table: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Input fields + Equivalence Classes. KHÔNG BVA, KHÔNG test cases.

---

## Input Fields

| # | Field | Type | Required | Source |
| --- | --- | --- | --- | --- |
| 1 | JWT Token | String (Bearer) | Yes | `GET /api/orders/my-orders` header |
| 2 | orderId | Integer | Yes (for cancel) | `PUT /api/orders/{id}/cancel` URL param |
| 3 | order.status | Enum | N/A (state variable) | DB — affects cancel eligibility |

---

## Equivalence Classes

### JWT Token

| EC ID | Type | Description | Example | Rationale |
| --- | --- | --- | --- | --- |
| EC-T-V1 | Valid | Valid, not expired, correct secret | Valid JWT from login | Happy path — user authenticated |
| EC-T-I1 | Invalid | Missing / empty token | `` or `null` | Rejects unauthenticated request (401) |
| EC-T-I2 | Invalid | Expired token | Token with `exp < now` | Rejects outdated token (401) |
| EC-T-I3 | Invalid | Malformed / wrong secret | Random string / tampered JWT | Rejects invalid signature (401) |

### orderId (Cancel Action Only)

| EC ID | Type | Description | Example | Rationale |
| --- | --- | --- | --- | --- |
| EC-O-V1 | Valid | Valid order ID, owned by user | `123` (from my orders) | Allows cancel attempt |
| EC-O-I1 | Invalid | Non-existent order ID | `99999` | Returns 404 |
| EC-O-I2 | Invalid | Order owned by different user | `456` (belongs to user_b) | Returns 404 (not accessible) |
| EC-O-I3 | Invalid | Negative / invalid format | `-1` or `abc` | Returns error |

### order.status (State During Cancel)

| EC ID | Type | Description | Example | Rationale |
| --- | --- | --- | --- | --- |
| EC-S-V1 | Valid (cancelable) | pending | pending | Cancel allowed |
| EC-S-V2 | Valid (cancelable) | confirmed | confirmed | Cancel allowed |
| EC-S-V3 | Valid (cancelable) | shipping | shipping | **BUG: Cancel allowed but SPEC forbids** |
| EC-S-I1 | Invalid (not cancelable) | delivered | delivered | Reject cancel (400) |
| EC-S-I2 | Invalid (not cancelable) | canceled | canceled | Reject cancel (400) |

### Response/Field Validation (State Variables)

| EC ID | Type | Description | Example | Rationale |
| --- | --- | --- | --- | --- |
| EC-R-V1 | Valid | Response array with valid orders | Array of order objects | Happy path — all fields present |
| EC-R-I1 | Invalid | NULL created_at field | `{ ..., created_at: null }` | DB allows NULL, frontend must handle gracefully |
| EC-R-I2 | Invalid | NULL total_amount field | `{ ..., total_amount: null }` | DB allows NULL, frontend must handle gracefully |
| EC-R-I3 | Invalid | Missing required field | `{ id, status }` (no total_amount) | Data contract violation — test robustness |
| EC-E-V1 | Valid | DB available, no errors | Normal operations | Happy path — API responds normally |
| EC-E-I1 | Invalid | DB connection error | DB unavailable | Error handling test — API should return 500, not crash |

---

## Coverage Summary

| Field | Valid | Invalid | Total |
| --- | --- | --- | --- |
| JWT Token | 1 | 3 | 4 |
| orderId | 1 | 3 | 4 |
| order.status | 3 | 2 | 5 |
| Response/Fields | 1 | 3 | 4 |
| Error Handling | 1 | 1 | 2 |
| **Tổng** | **7** | **12** | **19** |
