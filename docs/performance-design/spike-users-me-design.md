# AUTH_HEAVY SPIKE - GET /api/users/me

## 1. Scenario Identity

- Endpoint: `GET /api/users/me`
- HTTP method: `GET`
- Endpoint group: `AUTH_HEAVY`
- Scenario: `SPIKE`
- Design status: `APPROVED`
- Primary Listener: `Response Time Graph`
- Pham vi bang chung da doc: `backend/server.js`, `backend/database.js`, `api_specification.md`, `README.md`, `docs/performance-design/hw05-production-matrix-proposal.md`, `docs/performance-design/load-order-detail-design.md`, cac design HW05 hien co, workflow hien tai va hardware/resource context cua production LOAD `run-002`.

## 2. Source Verification

| Hang muc | Phan tich |
|---|---|
| Route va method | `backend/server.js:112` khai bao `app.get("/api/users/me", authenticateToken, ...)`; API specification cung ghi `GET /api/users/me` tai `api_specification.md:59-62`. |
| Authentication | `authenticateToken` doc header `authorization`, tra `401` neu khong co token, dung `jwt.verify`, tra `403` neu token khong hop le, va gan payload vao `req.user` (`backend/server.js:100-109`). |
| Request | Khong co path parameter, query hay body. Header du kien cua measured request la `Authorization: Bearer ${__P(hw05.auth_token,)}`. |
| Response | Handler truy van user theo `req.user.id` va goi `res.json(user)` (`backend/server.js:112-115`). API specification xac nhan endpoint lay thong tin ca nhan, nhung khong dinh nghia JSON schema chi tiet. |
| Read/write va database | Moi request thanh cong thuc hien `SELECT * FROM users WHERE id = ?`; endpoint khong goi `INSERT`, `UPDATE` hay `DELETE`. |
| State mutation | Khong co state mutation trong `GET /api/users/me`. Token setup ngoai measured workload co the reset `login_attempts` khi login thanh cong (`backend/server.js:46-52`). |
| Seeded user availability | `backend/database.js:90-94` seed mot admin truoc va mot `Test User` role `user` sau do. Exact identity phai duoc preflight xac minh trong disposable runtime truoc execution; khong tao CSV row o design phase. |
| Startup behavior | `backend/database.js:9-14` drop/recreate tables khi backend khoi dong. Vi vay khoi dong truc tiep tren source backend co rui ro mutate source DB du endpoint measured chi doc. |
| Concurrent-request risk | Nhieu request cung token khong mutate user record, nhung cung do tai len JWT verification va cung identity lookup. Response co the chua truong nhay cam do `SELECT *`; khong ghi response body hay token vao audit/evidence. |

## 3. AUTH_HEAVY Classification

- `FACT`: Moi measured request di qua `jwt.verify` truoc khi handler truy van identity bang `req.user.id` (`backend/server.js:100-115`).
- `FACT`: API documentation yeu cau `Authorization: Bearer <token>` cho Users APIs (`api_specification.md:59-62`); README cung quy dinh token JWT duoc gui qua Authorization header (`README.md:41-43`).
- `RECOMMENDATION`: Phan loai endpoint la `AUTH_HEAVY` vi workload do JWT verification va authenticated identity lookup tren moi request.
- Khong coi endpoint nay la login/password-hashing/credential-validation workload. Password validation, failed-login lockout va token issuing thuoc `POST /api/login`, phai nam ngoai measured SPIKE samples.

## 4. SPIKE Objective

Muc tieu la quan sat factual behavior cua current implementation khi authenticated identity traffic chuyen tu baseline on dinh sang burst dong thoi lon hon ro ret, giu ngan, roi phuc hoi ve baseline. Day la `SPIKE`, khong phai LOAD hay Stress progression; khong dung de khang dinh capacity, SLA, p95 hay bottleneck.

De Task 2 co the phan tach theo pha, JMX/generation summary sau nay phai preserve exact stage schedule, execution-start timestamp, thread-group/cohort names va raw JTL timestamp. Task 2 khong duoc thuc hien o design phase.

## 5. Proposed Workload Profile

`RECOMMENDATION`: Profile ben duoi da duoc Student approve trong scope `AUTH_HEAVY_SPIKE_DESIGN`; khong duoc thay doi tru khi co technical impossibility da xac minh doc lap.

| Timeline | Target concurrency | Hanh vi |
|---|---:|---|
| `t=0-20s` | `5 VUs` | Baseline on dinh trong `20s`. |
| `t=20-23s` | `5 -> 25 VUs` | Spike ramp trong `3s`. |
| `t=23-43s` | `25 VUs` | Spike plateau/hold trong `20s`. |
| `t=43-48s` | `25 -> 5 VUs` | Recovery ramp-down trong `5s`. |
| `t=48-68s` | `5 VUs` | Recovery baseline trong `20s`. |

- Threads/VUs: baseline `5`; spike `25` total VUs, gap `20` VUs va magnitude `5x` baseline.
- Ramp-up: `3s` cho spike; `5s` cho ramp-down.
- Duration: `68 seconds` planned workload window.
- Stage implementation recommendation: map bang `Ultimate Thread Group` sau khi builder reverify plugin. Cohort baseline: `5` threads, initial delay `0s`, startup `1s`, hold `66s`, shutdown `1s`. Cohort spike: them `20` threads, initial delay `20s`, startup `3s`, hold `20s`, shutdown `5s`.
- Justification: baseline `5 VUs` tao cua so quan sat truoc burst; `25 VUs` la thay doi dong thoi gấp nam lan, du dot ngot de phan biet spike transition ma khong khang dinh day la capacity cua may. Hold `20s` va recovery `20s` giu run ngan, de review tren student-local environment va van co du bon pha ro rang.
- `FACT`: hardware context cua production LOAD `run-002` ghi `16` logical processors va `16890978304` bytes physical memory. Day chi la context cua may da capture, khong chung minh `25 VUs` realistic hay system capacity.
- Throughput/p95 evaluation: `NEEDS_CLARIFICATION`; khong co SLA hay production baseline de dat nguong.

## 6. Think Time

- Think Time: `250-500 ms`.
- Think Time Justification: `RECOMMENDATION`. Khoang ngan hon LOAD `500-1000 ms` de burst authenticated traffic van ro rang, nhung tranh moi VU gui hot loop `0 ms`. Day mo phong nhip refresh/identity-check ngan, khong phai claim ve hanh vi production.
- JMeter Timer Mapping:
  - Timer Type: `Uniform Random Timer`
  - Lower Bound: `250 ms`
  - Upper Bound: `500 ms`
  - JMeter Parameters: Constant Delay Offset `250 ms`; Random Delay Maximum `250 ms`
  - Scope: dat trong moi measured SPIKE Thread Group, ap dung cho `GET /api/users/me`; khong ap dung cho setup-only login/token provisioning.
  - Mapping Status: `PASS`

## 7. Authentication Strategy

- `FACT`: missing token tra `401`; token khong verify duoc tra `403` (`backend/server.js:101-106`). Cac response nay khong thuoc primary measured success path.
- `FACT`: current `jwt.sign` call khong truyen `expiresIn` (`backend/server.js:51`); source khong the hien token-expiration policy cho token duoc tao boi route nay.
- `RECOMMENDATION`: JMX chi doc token tu temporary external property `hw05.auth_token` va gui `Authorization: Bearer ${__P(hw05.auth_token,)}`. Khong luu JWT trong Git, JMX, CSV, design example, audit hay output.
- `RECOMMENDATION`: builder phai co fail-closed preflight/preprocessor: property rong hoac thieu thi dung truoc measured sample, khong silently gui header rong.
- Token provisioning preflight, nam ngoai measured workload: (1) khoi dong disposable runtime, (2) xac minh dedicated seeded user, (3) setup-only successful authentication, (4) trich temporary token, (5) goi `/api/users/me` xac minh identity, (6) ghi token chi vao temporary external properties, (7) xoa secret/runtime sau execution.
- `FACT`: source login lock account sau unsuccessful path theo `login_attempts + 2` va `180000 ms` (`backend/server.js:54-63`); README mo ta increment `1` va lock `30` giay (`README.md:40-43`). Preflight khong duoc co failed-login attempts, va conflict nay phai duoc giu visible.

## 8. Test Data Strategy

- CSV Required: `YES`
- Suggested File: `test-data/auth-heavy-users-me.csv`
- CSV Required Status: `NEEDS_DATA_SETUP`; file va rows chua duoc tao o design phase.
- Runtime Verification Evidence: `docs/test-data-reviews/evidence/spike-users-me-runtime-verification.json` (`PASS`); verified identity `id=2`, `name=Test User`, `email=test@eshop.com`; no password or JWT value was recorded.
- Primary Dataset: `SUCCESS_PATH_ONLY`
- Columns:
  - `expected_user_id` - `ASSERTION_DRIVEN`; doi chieu identity cua response.
  - `expected_email` - `ASSERTION_DRIVEN`; doi chieu email da duoc preflight/source back.
  - `expected_name` - `ASSERTION_DRIVEN`; doi chieu name da duoc preflight/source back.
  - `auth_case` - `TRACE_ONLY`; chi danh dau success authenticated case.
  - `iteration_key` - `TRACE_ONLY`; trace row/iteration trong evidence.
- Purpose: CSV tach rieng cho AUTH_HEAVY cung cap expected identity va traceability; khong chua JWT, credential hay request parameter gia.
- Data generation/reset considerations: Student phai approve row success-path sau runtime preflight trong disposable DB. Token duoc provision runtime va xoa sau run; CSV khong can reset business state vi endpoint chi doc. Recycle/EOF/sharing mode chi duoc chot khi builder mapping sau Human Review.
- CSV_MODE: `TRACEABILITY_ONLY`
- DATA_DRIVEN_FIT: `RISK`
- HW05_DATA_DRIVEN_RISK: `YES`
- Project-matrix data-strategy conflict: approved matrix proposal dat `access_token` la request-driving CSV field va `CSV_MODE: REQUEST_DRIVEN`; token-safety direction cua design nay yeu cau token chi o external property `hw05.auth_token`. Vi CSV khong drive path/query/body/header trong design nay, khong duoc silently giu `DATA_DRIVEN_FIT: PASS`. Student da approve external-property safety va traceability-only strategy o design scope; final candidate rows van can data review rieng truoc CSV creation.

## 9. Assertions

| Luong | HTTP status | Body/JSON Assertion | Dieu kien |
|---|---|---|---|
| Primary measured success | Exact `200` | JSON object; `id == ${expected_user_id}`; `email == ${expected_email}`; `name == ${expected_name}`; khong co `error` field | Dedicated user/token da PASS setup-only preflight. |
| Missing token | Exact `401` | JSON `error` theo current handler | Negative preflight/functional case, khong nam trong primary SPIKE dataset. |
| Invalid token | Exact `403` | JSON `error` theo current handler | Negative preflight/functional case, khong nam trong primary SPIKE dataset. |
| Unexpected response | Khac `200` trong primary path | Any non-object, missing expected identity field, mismatch identity hoac `error` field deu la Assertion failure | Khong coi HTTP response nhan duoc la automatic PASS. |

Khong assert hay log plaintext `password`, `reset_token` hoac JWT. Exact expected identity values chi duoc set sau khi Student approve data va preflight runtime xac nhan source-backed row.

## 10. Listener

- Listener: `Response Time Graph`
- Reason: Human-approved production matrix map `AUTH_HEAVY / SPIKE` voi `Response Time Graph` de quan sat response-time trend qua baseline, spike transition, plateau va recovery.
- Uniqueness Check: `PASS` theo approved production matrix: `READ_HEAVY / LOAD` dung `Summary Report`; `AUTH_HEAVY / SPIKE` dung `Response Time Graph`; `TRANSACTIONAL / STRESS` duoc assign `Aggregate Report`.
- Evidence / conflict: final project-level uniqueness va component availability phai duoc builder recheck sau khi ca ba production JMX ton tai. Design nay khong tao GUI listener hay JMX.

## 11. Runtime Isolation and Preflight

- Runtime Isolation: `DISPOSABLE_BACKEND_RUNTIME_COPY`
- Source Database Mutation Risk: endpoint measured la read-only, nhung `backend/database.js` drop/recreate tables khi backend start. Risk tren source DB la cao neu khoi dong source backend truc tiep; giam xuong acceptable chi khi copied runtime DB nam ngoai repository va duoc verify truoc setup.
- `FACT`: production READ_HEAVY / LOAD `run-002` da dung strategy nay, preserve source DB SHA-256 va cleanup temporary runtime. Reuse chi la `RECOMMENDATION` va phai reverify truoc SPIKE execution.
- Mandatory preflight sau nay: fresh disposable backend; runtime DB khac `backend/database.sqlite`; source DB SHA-256 before/after; exact seeded user identity; setup-only token; `/api/users/me` `200` va expected identity; missing-token property fail-close; no concurrent user mutation; backend PID/resource monitor readiness; no JWT value trong evidence.

## 12. Resource Evidence Strategy

- Strategy: `DEFINED`
- Reuse conceptually the proven non-CIM monitor strategy: backend PID/process identity, system CPU, system memory, backend memory/process fields, timestamps, hardware/runtime context, JMeter logs, preflight, postflight va cleanup verification.
- `RECOMMENDATION`: record approximately one resource sample per second from truoc JMeter start qua recovery and process completion; luu exact stage schedule/execution-start metadata de Task 2 segment raw JTL by time.
- Khong chay monitor, JMeter hay tao resource evidence trong design interaction nay.

## 13. Risks / Implementation-Spec Conflicts

- `IMPLEMENTATION_SPEC_CONFLICT`: `backend/server.js:112-115` dung `SELECT *` va return toan bo user row; `backend/database.js:50-60` cho thay row co `password` va `reset_token`, trong khi API specification chi mo ta lay thong tin ca nhan va README `SEC-01` cam plaintext password (`README.md:276-280`). Impact: response may expose sensitive fields; performance evidence/audit khong duoc persist full body. Required resolution: Student giu conflict visible va khong claim response da an toan.
- `IMPLEMENTATION_SPEC_CONFLICT`: source login unsuccessful path tang `login_attempts` them `2` va lock `180s`; README mo ta tang `1` va lock `30s`. Impact: setup must never deliberately fail login; endpoint measured khong duoc claim account-lockout coverage.
- Static token reuse cho nhieu VUs la safe ve state mutation nhung khong chung minh multi-account behavior, token expiration behavior hay authorization-role coverage.
- Handler khong co explicit `err` branch cho `db.get`; behavior khi DB error can duoc quan sat sau nay, khong tu dat `500` assertion cho primary success path.
- Token external-property safety lam CSV traceability-only; `DATA_DRIVEN_FIT: RISK` can Student decision truoc JMX.

### HW05 Compliance Check

| Requirement | Status | Evidence / Note |
|---|---|---|
| Endpoint group assigned | `PASS` | Approved matrix map `GET /api/users/me` voi `AUTH_HEAVY`. |
| Scenario assigned | `PASS` | Approved matrix map endpoint voi `SPIKE`. |
| Group uniqueness | `PASS` | Matrix co mot production row cho moi group; ownership la `PASS_BY_STUDENT_CONFIRMATION`. |
| Scenario uniqueness | `PASS` | Matrix map `LOAD`, `SPIKE`, `STRESS` mot-mot. |
| Separate CSV | `NEEDS_DATA_SETUP` | Unique proposed path `test-data/auth-heavy-users-me.csv`; final file/rows chua tao. |
| Listener uniqueness | `PASS` | Approved matrix assign ba distinct listener types; final JMX recheck van bat buoc. |
| Workload justified | `PASS` | Moi VU, duration, spike ratio va Think Time deu la labeled `RECOMMENDATION` co rationale. |
| Assertions defined | `PASS` | Exact `200`, JSON identity va negative `401/403` separation duoc dinh nghia. |

## 14. Assumptions and Limitations

- `ASSUMPTION_REQUIRES_REVIEW`: dedicated seeded user va expected identity se ton tai trong fresh disposable runtime tai thoi diem execution; preflight phai xac minh truoc JMeter.
- `ASSUMPTION_REQUIRES_REVIEW`: `Ultimate Thread Group` va `Response Time Graph` van available khi builder tao JMX; builder phai static verify component mapping truoc generation.
- `ASSUMPTION_REQUIRES_REVIEW`: single temporary external token duoc dung an toan trong planned `68s` run. Current source khong show expiry, nhung server restart/secret change van lam token invalid.
- `ASSUMPTION_REQUIRES_REVIEW`: hardware context cua LOAD `run-002` van la relevant local context; khong co production traffic baseline, SLA hay capacity baseline.
- Limitation: design nay khong tao CSV final, JMX, JTL, HTML, resource evidence, execution result, performance analysis hay optimization recommendation.

## 15. Student Human Review

Review Status: `FINALIZED`

Student Decision: `APPROVED`

Approval Scope: `AUTH_HEAVY_SPIKE_DESIGN`

Profile Decision: `APPROVED`

Data Strategy Decision: `APPROVED`

Student Notes:

- `GET /api/users/me` is accepted as `AUTH_HEAVY` because measured traffic exercises authenticated Bearer/JWT verification and user lookup.
- Scenario does not represent login/password hashing, credential verification, account lockout or token issuance.
- The approved profile remains `SPIKE`; no capacity, SLA or production-readiness claim is approved.
- Dedicated CSV strategy is approved, while final candidate rows remain subject to a separate `TEST_DATA_REVIEW_REQUIRED` decision.
- Documented `IMPLEMENTATION_SPEC_CONFLICT` items remain visible.

JMX: `NOT_CREATED`

Execution: `NOT_RUN`

CHECKPOINT: `TEST_DATA_REVIEW_REQUIRED`

Next allowed action: Student must APPROVE_DATA, MODIFY_DATA, or REJECT_DATA for the verified AUTH_HEAVY / SPIKE candidate dataset before final CSV creation.
