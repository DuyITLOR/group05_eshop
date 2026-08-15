# AUTH_HEAVY SPIKE - Test Data Candidates

> Pham vi: xac minh du lieu cho production `GET /api/users/me` / `AUTH_HEAVY` / `SPIKE`. Artifact nay ghi nhan source/runtime evidence va de xuat candidate rows; khong tao final CSV, JMX, JTL, HTML report hay performance conclusion.

## 1. Decision Context

- Approved design: `docs/performance-design/spike-users-me-design.md`
- Design Student Decision: `APPROVED`
- Approval Scope: `AUTH_HEAVY_SPIKE_DESIGN`
- Data strategy: external property `hw05.auth_token`; dedicated CSV khong chua JWT/credential.
- Proposed final CSV: `test-data/auth-heavy-users-me.csv` (`APPROVED_FOR_CREATION`)
- Primary dataset: `SUCCESS_PATH_ONLY`
- Candidate status: `FOUND`

## 2. Source and Runtime Evidence

### 2.1 Source facts

| Item | Evidence |
|---|---|
| Route authentication | `authenticateToken` verifies JWT before the route handler (`backend/server.js:100-112`). Missing token is `401`; invalid token is `403`. |
| Identity lookup | Handler executes `SELECT * FROM users WHERE id = ?` with `req.user.id`, then returns `res.json(user)` (`backend/server.js:112-115`). |
| Seed definition | `backend/database.js:90-94` inserts a `Test User` role `user` after the admin seed. |
| Startup risk | `backend/database.js:9-14` drops and recreates tables on backend startup; runtime verification must not launch the source backend against `backend/database.sqlite`. |
| Documented contract | API specification identifies `GET /api/users/me` as a Users API requiring Bearer token (`api_specification.md:59-62`) but does not define a full response schema. |

### 2.2 Isolated runtime verification

Evidence: `docs/test-data-reviews/evidence/spike-users-me-runtime-verification.json`

| Check | Result |
|---|---|
| Verification status | `PASS` |
| Runtime isolation | `DISPOSABLE_BACKEND_RUNTIME_COPY` in OS temp outside repository |
| Seeded authenticated identity | `id=2`, `name=Test User`, `email=test@eshop.com`, role `user` |
| Setup authentication | `PASS`; setup-only, not measured; JWT retained in memory only and not recorded |
| `GET /api/users/me` response | HTTP `200`, JSON object, exact `id`, `email`, `name` match seeded identity |
| Source DB integrity | `PASS`; SHA-256 before/after: `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6` |
| Runtime cleanup | `PASS`; copied runtime deleted after verification |
| JMeter / final CSV | `NOT_CREATED` / `NOT_CREATED` |

Returned field names observed from the real successful response are `id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`, `reset_token`, `shipping_address`, and `phone`. Sensitive field values were not recorded.

## 3. Response Contract Verification

| Field | Runtime result | CSV decision |
|---|---|---|
| `id` | Present and equals verified user ID `2` | `ASSERTION_DRIVEN` |
| `email` | Present and equals verified email | `ASSERTION_DRIVEN` |
| `name` | Present and equals verified name | `ASSERTION_DRIVEN` |
| `password` / `reset_token` | Returned by current implementation, but values are not persisted in this artifact | Excluded from CSV/assertion values |
| Other returned fields | Observed but not needed to prove authenticated identity | Excluded from primary CSV |

`IMPLEMENTATION_SPEC_CONFLICT`: current handler returns `SELECT *` user data, including field names for `password` and `reset_token`; API documentation has no response schema and README `SEC-01` requires passwords not be plaintext. This conflict remains visible and no response body containing sensitive values may be stored in evidence, audit or reports.

## 4. Proposed CSV Schema and Semantics

Proposed header, not yet created:

```text
expected_user_id,expected_email,expected_name,auth_case,iteration_key
```

| Column | Semantics | Measured-request binding |
|---|---|---|
| `expected_user_id` | `ASSERTION_DRIVEN` | Used only to assert response `id`. |
| `expected_email` | `ASSERTION_DRIVEN` | Used only to assert response `email`. |
| `expected_name` | `ASSERTION_DRIVEN` | Used only to assert response `name`. |
| `auth_case` | `TRACE_ONLY` | Labels the successful authenticated path. |
| `iteration_key` | `TRACE_ONLY` | Preserves row/iteration traceability. |

- CSV_MODE: `TRACEABILITY_ONLY`
- DATA_DRIVEN_FIT: `RISK`
- REQUEST_DRIVEN columns: `NONE`
- Token boundary: future JMX reads only temporary external property `hw05.auth_token`; JWT is not a CSV value.
- Matrix discrepancy: the approved matrix proposal mentioned `access_token` as a request-driving CSV field. The approved design instead preserves token safety using an external property, so this candidate artifact does not mislabel CSV as request-driven.

## 5. Proposed Success-path Candidate Row

| Row | expected_user_id | expected_email | expected_name | auth_case | iteration_key | Evidence |
|---:|---:|---|---|---|---|---|
| 1 | `2` | `test@eshop.com` | `Test User` | `authenticated_success` | `auth-users-me-success-001` | Source seed and isolated runtime HTTP `200` verification. |

This row is `SUCCESS_PATH_ONLY`. Missing token, invalid token, expired token, `401` and `403` are excluded from primary measured SPIKE traffic and remain preflight/functional cases.

## 6. Token and Isolation Boundary

1. Future execution starts a fresh `DISPOSABLE_BACKEND_RUNTIME_COPY` and verifies source DB SHA-256 before setup.
2. Setup-only authentication obtains a temporary token outside measured traffic.
3. The token is supplied only through temporary external property `hw05.auth_token`; missing value must fail closed before measured samples.
4. Setup verifies `GET /api/users/me` against the candidate identity before JMeter starts.
5. Cleanup deletes temporary secret material and copied runtime, then rechecks source DB SHA-256.

The runtime verification in this artifact used token memory only and did not retain an external properties file because it did not create or run JMeter.

## 7. Limitations and Required Resolution

- `DATA_DRIVEN_FIT: RISK` remains because CSV does not drive path, query, body or header; it supports assertions and traceability only.
- One shared successful identity does not prove multi-account behavior, token expiry policy, role authorization, capacity or security quality.
- Source login lockout behavior conflicts with README documentation; no failed login is permitted in setup.
- Listener/component availability and final JMeter mapping remain builder checks after data approval.
- Candidate discovery is not final CSV approval.

## 8. Student Human Review

Status: `FINALIZED`

Student Data Decision: `APPROVE_DATA`

Approval Scope: `AUTH_HEAVY_SPIKE_DATASET`

Candidate Rows: `1`

CSV Strategy: `TRACEABILITY_ONLY`

DATA_DRIVEN_FIT: `RISK_ACCEPTED`

Final CSV: `APPROVED_FOR_CREATION`

Student Notes:

- The verified candidate identity is accepted as source/runtime-backed.
- CSV remains assertion/traceability-driven because `GET /api/users/me` has no business request path, query, or body input.
- JWT remains outside the CSV through temporary external property `hw05.auth_token`.
- The CSV must not contain credentials, JWT, `password`, `reset_token`, or hidden data.
- `DATA_DRIVEN_FIT: RISK` remains documented; it is not upgraded to `REQUEST_DRIVEN`.
- The `SELECT *` sensitive-field exposure remains an `IMPLEMENTATION_SPEC_CONFLICT`, not a performance-plan requirement.

CHECKPOINT: `JMETER_PLAN_GENERATION_REQUIRED`

Next allowed action: invoke `$jmeter-plan-builder` after verifying every required JMeter component dependency.
