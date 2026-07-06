# 03 — Domain Test Cases: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Domain test case từ equivalence classes. One-at-a-time cho invalid.

---

## Test Matrix

> **Default values:**
>
> - JWT: Valid token (from logged-in user)
> - User: test@eshop.com
> - Orders in DB: Multiple orders with different statuses

### 1. Authentication (JWT)

| TC ID    | Test Field      | EC      | Type     | Input                                     | Expected                                                                 |
| -------- | --------------- | ------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| DT-B-001 | JWT (valid)     | EC-T-V1 | Positive | GET /api/orders/my-orders + valid token   | `200`, body: `orders[]` chỉ chứa orders của user hiện tại. DB: không đổi |
| DT-B-002 | JWT (missing)   | EC-T-I1 | Negative | GET /api/orders/my-orders without token   | `401 Unauthorized`, body: error message. DB: không đổi                   |
| DT-B-003 | JWT (expired)   | EC-T-I2 | Negative | GET /api/orders/my-orders + expired token | `401 Unauthorized`, body: error message. DB: không đổi                   |
| DT-B-004 | JWT (malformed) | EC-T-I3 | Negative | GET /api/orders/my-orders + invalid token | `401 Unauthorized`, body: error message. DB: không đổi                   |

### 2. Order ID Validation

| TC ID    | Test Field               | EC      | Type     | Input                                       | Expected                                                                                |
| -------- | ------------------------ | ------- | -------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| DT-B-005 | orderId (non-existent)   | EC-O-I1 | Negative | PUT /api/orders/99999/cancel                | `404 Order not found`, body: error message. DB: không đổi                               |
| DT-B-006 | orderId (different user) | EC-O-I2 | Negative | PUT /api/orders/5/cancel (belongs to admin) | `404 Order not found` (security isolation — không tiết lộ order tồn tại). DB: không đổi |
| DT-B-007 | orderId (invalid format) | EC-O-I3 | Negative | PUT /api/orders/abc/cancel                  | `400 Bad request` hoặc `404`. DB: không đổi                                             |

### 3. Cancel — Cancelable States

| TC ID    | Test Field         | EC               | Type     | Input                                                       | Expected                                                     |
| -------- | ------------------ | ---------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| DT-B-008 | status = pending   | EC-O-V1, EC-S-V1 | Positive | PUT /api/orders/{id}/cancel (order owned, status=pending)   | `200`, body: updated order object. DB: `status` → `canceled` |
| DT-B-009 | status = confirmed | EC-S-V2          | Positive | PUT /api/orders/{id}/cancel (order owned, status=confirmed) | `200`, body: updated order object. DB: `status` → `canceled` |

### 4. Cancel — Non-cancelable States

| TC ID    | Test Field         | EC      | Type     | Input                                          | Expected                                                                                                                  |
| -------- | ------------------ | ------- | -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| DT-B-010 | status = delivered | EC-S-I1 | Negative | PUT /api/orders/{id}/cancel (status=delivered) | `400 "Cannot cancel this order"`. DB: status vẫn `delivered`                                                              |
| DT-B-011 | status = canceled  | EC-S-I2 | Negative | PUT /api/orders/{id}/cancel (status=canceled)  | `400 "Cannot cancel this order"`. DB: status vẫn `canceled`. Idempotency: gọi cancel lần 2 → vẫn `400`, không side effect |

### 5. Cancel — Spec Mismatch (shipping)

| TC ID    | Test Field        | EC      | Type    | Input                                         | Expected                                                                                                                               |
| -------- | ----------------- | ------- | ------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| DT-B-012 | status = shipping | EC-S-V3 | **BUG** | PUT /api/orders/{id}/cancel (status=shipping) | **SPEC:** `400` (User cannot cancel). **ACTUAL:** `200`, DB: `status` → `canceled`. BUG: code cho phép cancel shipping order, SPEC cấm |

### 6. Supplementary

| TC ID    | Test Field             | EC                  | Type     | Input                                           | Expected                                                                         |
| -------- | ---------------------- | ------------------- | -------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| DT-B-013 | User isolation (fetch) | EC-T-V1 + ownership | Positive | Login as test user → GET /api/orders/my-orders  | `200`, body: chỉ orders của test user (không có orders của admin). DB: không đổi |
| DT-B-014 | Empty orders           | EC-T-V1 + no orders | Positive | New user (0 orders) → GET /api/orders/my-orders | `200`, body: empty array `[]`. DB: không đổi                                     |

---

## EC Coverage

| EC      | Covered by                   | Notes                                                  |
| ------- | ---------------------------- | ------------------------------------------------------ |
| EC-T-V1 | DT-B-001, DT-B-013, DT-B-014 | Valid token path                                       |
| EC-T-I1 | DT-B-002                     | No token                                               |
| EC-T-I2 | DT-B-003                     | Expired token                                          |
| EC-T-I3 | DT-B-004                     | Malformed token                                        |
| EC-O-V1 | DT-B-008                     | Valid order, owned by user (gộp vào cancelable states) |
| EC-O-I1 | DT-B-005                     | Non-existent order                                     |
| EC-O-I2 | DT-B-006                     | Different user's order                                 |
| EC-O-I3 | DT-B-007                     | Invalid format                                         |
| EC-S-V1 | DT-B-008                     | pending → cancel OK                                    |
| EC-S-V2 | DT-B-009                     | confirmed → cancel OK                                  |
| EC-S-V3 | DT-B-012                     | **BUG:** shipping → code allows but spec forbids       |
| EC-S-I1 | DT-B-010                     | delivered → reject                                     |
| EC-S-I2 | DT-B-011                     | canceled → reject (+ idempotency check)                |

**Total:** 14 TC, 13/13 EC covered (100%)

---

## Changes (v0 → v1)

| #   | Change                                                     | Reason                                                                     |
| --- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Expected thêm **DB changed?**                              | Verify side effect: cancel có update DB không, reject có giữ nguyên không  |
| 2   | Expected thêm **response body**                            | Verify response format (orders array, updated object, error message)       |
| 3   | DT-B-011: expected thêm **idempotency**                    | Cancel order đã canceled → verify gọi lại không gây side effect            |
| 4   | Group TCs theo cancelable / non-cancelable / spec mismatch | Rõ ràng hơn, dễ trace theo behavior                                        |
| 5   | Gộp DT-B-005 (orderId valid) vào DT-B-008 (pending cancel) | Giảm duplication: cancel valid + owned đã implicit trong cancelable states |
| 6   | Renumber DT-B-005→014 liên tục                             | Cleanup, 15 → 14 TC                                                        |
