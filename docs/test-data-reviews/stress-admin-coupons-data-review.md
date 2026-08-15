# TRANSACTIONAL STRESS Test Data Review

## 1. Scope

- Endpoint: `POST /api/admin/coupons`
- Group / Scenario: `TRANSACTIONAL` / `STRESS`
- Approved design: `docs/performance-design/stress-admin-coupons-design.md`
- CSV under review: `test-data/transactional-admin-coupons.csv`
- Scope: test-data finalization and static contract verification only. JMX, JTL, HTML report and JMeter execution are not created.

## 2. Source Contract Verification

| Contract item | Verified current behavior |
|---|---|
| Request fields | Handler destructures `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` (`backend/server.js:457-475`). |
| Authentication | `authenticateToken` requires JWT; missing token is `401`, invalid token is `403` (`backend/server.js:100-109`). |
| Server-side admin role | `NOT_IMPLEMENTED`: handler does not inspect `req.user.role`. API specification and README require Admin, so this remains `IMPLEMENTATION_SPEC_CONFLICT`. |
| Insert / unique behavior | Handler executes `INSERT INTO coupons`; `coupons.code` is `TEXT UNIQUE` (`backend/server.js:466-479`, `backend/database.js:29-38`). Duplicate code reaches current database-error response path `500`. |
| Success contract | Successful insert uses default HTTP `200` and `{ message: "Coupon created", id: this.lastID }` (`backend/server.js:476-479`). |
| Validation / optionality | Current route has no explicit business validation. `max_uses_per_user || 1` defaults falsy input to `1`; SQLite schema has defaults but no `NOT NULL` or type/check constraints for the remaining fields. |
| Documented business contract | README FR-17 requires unique code, `percent/fixed`, positive `discount_value`, `expired_at`, `min_order_amount >= 0`, and `max_uses_per_user >= 1` (`README.md:213-217`). |
| Date format / semantics | Source does not parse/validate `expired_at`; API specification and seed values use ISO date form `YYYY-MM-DD` (`api_specification.md:202-213`, `backend/database.js:107-110`). |
| Minimum / usage semantics | Creation route stores these numeric fields but does not validate/enforce them. Candidate values follow the documented contract and a seeded valid coupon shape. |

Source Contract Verification: `PASS`. Approved schema columns match source request semantics; `coupon_code_prefix` is intentionally an input to later generate the actual request `code`, not an unsupported API field.

## 3. Final CSV Schema

```text
coupon_code_prefix,type,discount_value,min_order_amount,expired_at,max_uses_per_user,coupon_case,iteration_key
```

- Encoding: `UTF-8`, no BOM.
- Delimiter: comma.
- One deterministic header and one deterministic data row.
- No JWT, Authorization header, password, reset token or other secret is stored.

## 4. Column Classification

| Column | Classification | Source-backed use |
|---|---|---|
| `coupon_code_prefix` | `REQUEST_DRIVEN` | Combined later with external `run_tag`, thread and iteration to make request `code`. |
| `type` | `REQUEST_DRIVEN` | Maps to request body `type`. |
| `discount_value` | `REQUEST_DRIVEN` | Maps to request body `discount_value`. |
| `min_order_amount` | `REQUEST_DRIVEN` | Maps to request body `min_order_amount`. |
| `expired_at` | `REQUEST_DRIVEN` | Maps to request body `expired_at`. |
| `max_uses_per_user` | `REQUEST_DRIVEN` | Maps to request body `max_uses_per_user`. |
| `coupon_case` | `TRACE_ONLY` | Labels the row as primary `SUCCESS_PATH_ONLY`. |
| `iteration_key` | `TRACE_ONLY` | Traceability from the static shape to generated runtime code. |

`ASSERTION_DRIVEN` fields: `NONE`. Current success response does not return the submitted coupon fields, so no unused decorative assertion column was added.

## 5. Final Dataset

| Row | coupon_code_prefix | type | discount_value | min_order_amount | expired_at | max_uses_per_user | coupon_case | iteration_key |
|---:|---|---|---:|---:|---|---:|---|---|
| 1 | `HW05S` | `percent` | `10` | `300000` | `2099-12-31` | `1` | `success_path` | `stress-admin-coupon-001` |

- Primary Dataset: `SUCCESS_PATH_ONLY`.
- Dataset size: one canonical valid shape. Một row là đủ vì final code được generated per run/thread/iteration; thêm `fixed` row lúc này chỉ làm tăng business variability mà không cần cho Stress objective.
- Business-value source: canonical numeric/date shape khớp seeded valid coupon `SAVE10` (`percent`, `10`, `300000`, `2099-12-31`, `1`) tại `backend/database.js:107`; prefix duy nhất được tách riêng cho HW05 Stress.

## 6. Business-Rule Validation

| Field | Candidate check | Result |
|---|---|---|
| `type` | `percent` là một documented valid type và có seed example. | `PASS` |
| `discount_value` | `10` là positive và có seed example cho `percent`. | `PASS` |
| `min_order_amount` | `300000` là non-negative và có seed example. | `PASS` |
| `expired_at` | `2099-12-31` dùng source-supported ISO date form, sau lifecycle HW05 hiện tại. | `PASS` |
| `max_uses_per_user` | `1` là positive, documented valid và có seed example. | `PASS` |
| Static code collision | Source DB read-only inventory có `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; không có `HW05S` prefix. | `PASS` |

`EXPIRATION_STABILITY: PASS`. Date tĩnh `2099-12-31` được source seed dùng cho valid coupon; không cần dynamic expression trong CSV.

## 7. Coupon Namespace Strategy

- `MEASURED_PREFIX`: `HW05S`
- Future preflight namespace: `HW05P-<run_tag>-...`
- Verification-only namespace (không phải measured/preflight): `HW05V-DATA-001`
- `RUN_TAG_SOURCE`: `EXTERNAL_RUNTIME_PROPERTY`
- Preferred property: `hw05.run_tag`
- Static CSV không chứa production run tag hoặc JMeter expression.

## 8. Uniqueness Model

`UNIQUENESS_MODEL: PASS`

Future measured code composition is conceptually:

```text
HW05S + run_tag + thread_id + iteration_id
```

- Cross-thread: `thread_id` differentiates concurrently running VUs.
- Cross-iteration: per-thread `iteration_id` differentiates repeated samples.
- Cross-run: nonblank external `run_tag` differentiates retry/run namespaces.
- Preflight vs measured: `HW05P` and `HW05S` are disjoint prefixes.
- Source constraint: `code` is SQLite `TEXT UNIQUE`; current source declares no maximum code length or character restriction that invalidates this composition.
- Exact JMeter expression remains deferred to JMX generation/static review and must fail closed when `hw05.run_tag` is blank.

## 9. Runtime Verification

Runtime Verification: `NOT_REQUIRED`

Static verification is sufficient for this data-finalization gate: all candidate business fields are source-backed by the current handler/schema, documented contract, and seeded valid shape; the source DB was queried read-only only. A successful disposable-runtime `POST /api/admin/coupons` smoke with a verification-only namespace remains mandatory real-execution preflight before JMeter, not fabricated execution evidence in this review.

Response Verification: `NOT_REQUIRED`

Expected future preflight response remains source-backed: HTTP `200`, valid JSON, `message == "Coupon created"`, positive created `id`. This review does not claim that HTTP request was executed.

## 10. Source DB Integrity

- Source DB SHA-256 before read-only verification: `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`
- Source DB SHA-256 after read-only verification: `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`
- Source DB Integrity: `PASS`
- State mutation boundary: no coupon row was created in `backend/database.sqlite`; any future candidate smoke and measured Stress writes must occur only in `DISPOSABLE_BACKEND_RUNTIME_COPY`.

## 11. Sensitive Data Check

- JWT values: `0`
- Authorization headers: `0`
- Password values: `0`
- Reset-token values: `0`
- Secret Values: `0`

## 12. Limitations

- Current handler does not enforce documented business validation or server-side admin role; this dataset follows the documented valid shape but does not prove those controls exist.
- Runtime HTTP success is intentionally deferred to mandatory disposable-runtime preflight; no JMeter, JTL, HTML or performance interpretation was performed.
- State growth and potential SQLite write contention remain future execution/analysis considerations, not data-validation results.

## 13. Student Human Review

Review Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `TRANSACTIONAL_STRESS_TEST_DATA`

CSV Decision: `APPROVED`

Business Data Decision: `APPROVED`

Uniqueness Model Decision: `APPROVED`

Runtime Verification Decision: `DEFERRED_TO_MANDATORY_PRE_EXECUTION_PREFLIGHT`

Primary Dataset: `SUCCESS_PATH_ONLY`

Final Row Count: `1`

Invalid Business Rows: `0`

Unsupported Fields: `0`

Duplicate Static Rows: `0`

Secret Values: `0`

JMX: `NOT_CREATED`

Execution: `NOT_RUN`

CHECKPOINT: `JMETER_PLAN_GENERATION_REQUIRED`

Next allowed action: Generate the TRANSACTIONAL / STRESS JMeter plan from the Human-approved design and test data.
