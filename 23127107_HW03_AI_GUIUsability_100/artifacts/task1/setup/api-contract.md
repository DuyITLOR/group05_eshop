# API Contract — Admin Login and Order Management

## Contract table

| Purpose | Method | Endpoint | Request | Response | Authentication | Headers | Source Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Authentication / Admin Login boundary | `POST` | `/api/login` | JSON object with `email` and `password` | Success JSON: `{ message, token, user }`; the frontend checks `user.role` and stores only `token` for an admin | No bearer token on login | `Content-Type: application/json` | `api_specification.md:23-32`; `backend/server.js:32-65`; `frontend-admin/src/App.jsx:61-73` |
| Load all orders | `GET` | `/api/admin/orders` | No body | JSON array. Each row comes from `orders.*` plus `user_name`: `{ id, user_id, total_amount, status, shipping_address, created_at, user_name }` | Bearer JWT required by middleware. The route implementation does not add a `role === 'admin'` guard. | `Authorization: Bearer <token>` | `api_specification.md:171-182`; `backend/server.js:100-110,510-523` |
| Update one order status | `PUT` | `/api/admin/orders/:id/status` | JSON object `{ "status": "confirmed" }`, where the actual target status depends on the current state | Success JSON: `{ "message": "Order status updated" }` | Bearer JWT required by middleware. The route implementation does not add a `role === 'admin'` guard. | `Authorization: Bearer <token>`; `Content-Type: application/json` | `api_specification.md:179-182`; `backend/server.js:100-110,525-568`; `frontend-admin/src/App.jsx:85-92` |

Base URL is `http://localhost:3000` (`api_specification.md:1-5`). The Admin client hard-codes `http://localhost:3000/api` (`frontend-admin/src/App.jsx:1-5`).

## Token contract and client storage

| Property | Finding | Evidence |
| --- | --- | --- |
| Token response field | `token` | `backend/server.js:46-52` |
| Token content used by server | Signed payload contains user `id` and `role`; no expiry is configured in the token creation call | `backend/server.js:46-52` |
| Transport | `Authorization: Bearer <token>`; middleware takes the second space-delimited value | `README.md:38-44`; `backend/server.js:100-109` |
| Storage type | Browser `localStorage` | `frontend-admin/src/App.jsx:6-8,64-70` |
| Storage key | `adminToken` | `frontend-admin/src/App.jsx:7,69-70` |
| Invalid-session handling | A 401/403 during the Admin data fetch clears the React token and removes `adminToken` | `frontend-admin/src/App.jsx:34-58` |
| Non-admin login handling | The login response is checked client-side; a non-admin response is rejected before the token is stored | `frontend-admin/src/App.jsx:61-70` |

No real token, credential, signing value, or response user data is recorded here.

## Related error responses

| Operation | Status | Response / condition | Evidence |
| --- | --- | --- | --- |
| Login | `401` | `{ "error": "Invalid email or password" }` when user is absent or password is wrong | `backend/server.js:35-38,53-64` |
| Login | `403` | `{ "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` while account is locked | `backend/server.js:40-44` |
| Login | `500` | `{ "error": <database message> }` on the handled user lookup error | `backend/server.js:35-36` |
| Login | `400`, `404` | No explicit branch in this route | `backend/server.js:32-65` |
| List/update without token | `401` | `{ "error": "Unauthorized" }` | `backend/server.js:100-104` |
| List/update with invalid or rejected token | `403` | `{ "error": "Forbidden" }` | `backend/server.js:105-109` |
| Update missing order | `404` | `{ "error": "Order not found" }` | `backend/server.js:528-533` |
| Update invalid transition | `400` | `{ "error": "Invalid state transition from <current> to <target>" }` | `backend/server.js:534-556` |
| List/update database failure | `500` | No explicit 500 handler in these two route callbacks; this must not be invented as a confirmed response contract | `backend/server.js:510-568` |

## Status transitions

The requirements define these allowed transitions:

```text
pending   -> confirmed | canceled
confirmed -> shipping  | canceled
shipping  -> delivered
```

`delivered` and `canceled` are final states (`README.md:141-162`). The backend implements the three paths above but also permits `canceled -> delivered` (`backend/server.js:537-551`), and the frontend renders an inline action for it (`frontend-admin/src/App.jsx:862-868`). This is a static contract discrepancy and test target, not a Passed/Failed result.

Although the API specification lists all five status strings as possible body values (`api_specification.md:179-182`), the backend validates a requested value against the current status. It does not support transition back to `pending`.

## Frontend data use in scope

- Admin fetch sends sequential requests and assigns the order response body directly to `orders` (`frontend-admin/src/App.jsx:41-52`).
- Dashboard order count is `orders.length` (`frontend-admin/src/App.jsx:286-289`).
- Required delivered revenue is the sum of `total_amount` for delivered orders (`README.md:181-184`). The frontend currently multiplies each delivered amount by 2 (`frontend-admin/src/App.jsx:217-220`); retain this only as a static risk until execution.
- Successful status update calls the list fetch again (`frontend-admin/src/App.jsx:85-92`).
