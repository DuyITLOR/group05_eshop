# Load Order Detail — Deterministic Test Data Proposal

## 1. Trạng thái

- Endpoint: `GET /api/orders/:id`
- Group / Scenario: `READ_HEAVY / LOAD`
- Proposal status: `APPROVED_FINAL_DATASET`
- DETERMINISTIC_FIXTURE_STRATEGY: `DISPOSABLE_BACKEND_RUNTIME_COPY`
- DATA_CANDIDATES: `FOUND`
- SOURCE_BACKED: `RUNTIME_VERIFIED_FIXTURE`
- SOURCE: `HUMAN_APPROVED_DETERMINISTIC_FIXTURE`
- RUNTIME_VERIFICATION: `PASS`
- ISOLATED_DB: `DISPOSABLE_RUNTIME_VERIFIED_AND_REMOVED`
- DATA_DRIVEN_FIT: `PASS`
- Final CSV: `test-data/read-heavy-orders.csv` (`CREATED`; exactly `2` approved rows)

Source vẫn không có deterministic order seed. Student đã phê duyệt chính xác hai fixture values ở mục 5 sau khi tooling insert/verify chúng trên disposable backend runtime copy rồi xóa runtime. `RUNTIME_VERIFIED_FIXTURE` không có nghĩa các rows là repository seed; approval chỉ cho phép dùng chúng làm final READ_HEAVY request-driven dataset.

## 2. Human Finding và quyết định sửa

`NON_DETERMINISTIC_ORDER_SNAPSHOT`

AI ban đầu xem current SQLite orders `2` và `3` như proposal candidates mà chưa tính đầy đủ lifecycle initialization. Human Review sửa kết luận này: hai IDs chỉ là `SNAPSHOT_REFERENCE_ONLY` và không được copy vào final production CSV.

Human Review tiếp theo xác định proposal isolated-DB injection/launcher là assumption không được source hỗ trợ: `backend/server.js` import trực tiếp `./database`, còn `backend/database.js` resolve `__dirname/database.sqlite` và gọi `initDatabase()` khi module load. Student Decision `MODIFY_DATA` thay assumption đó bằng `DISPOSABLE_BACKEND_RUNTIME_COPY`; production `server.js` và `database.js` không bị sửa.

## 3. Database Initialization Evidence

- `backend/database.js:4-5` hard-code target `backend/database.sqlite` theo `__dirname`.
- `backend/database.js:15-20` drop tất cả core tables, gồm `orders`.
- `backend/database.js:73-81` recreate `orders` với `id INTEGER PRIMARY KEY AUTOINCREMENT`, `user_id`, `total_amount`, `status`, `shipping_address` và `created_at DEFAULT CURRENT_TIMESTAMP`.
- `backend/database.js:83-111` seed categories, users, products và coupons; không insert order nào.
- `backend/database.js:90-94` insert Admin trước, Test User sau; trên freshly recreated users table, dedicated Test User được dự kiến là ID `2` và phải được preflight xác nhận.
- `backend/database.js:117` gọi `initDatabase()` ngay khi module được import. `backend/server.js:4` import module này khi startup bình thường.
- `setup_guide.md` cũng mô tả `node database.js` là thao tác reset/seed.

Kết luận: historical order IDs trong `backend/database.sqlite` có thể biến mất sau reset hoặc normal server import. Chúng không phải deterministic setup evidence.

## 4. Fixture Setup Strategy

Tooling reusable đã được tạo tại:

- `scripts/performance/load-order-detail-setup.js`
- `scripts/performance/load-order-detail-runtime.js`

Đây là HW05 test setup tooling, không phải Agent Skill development. Tooling fail closed nếu runtime DB trùng source DB hoặc nằm ngoài OS temporary directory.

### 4.1 Disposable backend runtime copy

1. Ghi SHA-256 của source `backend/database.sqlite`, `backend/server.js` và `backend/database.js`; không mở source DB ở write mode.
2. Tạo runtime directory dưới OS temp, ngoài tracked repository, rồi copy `server.js`, `database.js` và `package.json` cần để khởi động application.
3. Start copied `server.js`. Chính copied `database.js` tạo `database.sqlite` cạnh nó và thực hiện reset/seed đúng lifecycle thật của SUT.
4. Poll copied database ở read-only mode cho tới khi schema và seeded Test User ID `2` sẵn sàng; không dùng historical order làm dependency.
5. Chỉ sau initialization mới mở copied DB ở write mode, `BEGIN IMMEDIATE`, verify schema/user, clear historical orders trong runtime, verify reserved IDs chưa tồn tại, insert đúng hai rows và exact-verify trước `COMMIT`; mọi lỗi dẫn tới `ROLLBACK`.
6. Login một lần ngoài measured workload, lưu JWT tạm thời vào external properties file dưới cùng OS temp, verify `/api/users/me`, rồi smoke GET hai order.
7. Dừng copied backend, xóa secret file và toàn bộ runtime; re-hash source files và yêu cầu không đổi.

Không có DB-path injection, launcher assumption, test branch hoặc thay đổi SUT source. Runtime verification đã `PASS`; evidence không chứa secret ở `docs/test-data-reviews/evidence/load-order-detail-runtime-verification.json`.

### 4.2 Setup ngoài measured workload

Fixture creation, token validation, row verification và smoke requests đều chạy trước Load window. Không gọi `POST /api/checkout` trong measured workload hoặc dùng checkout để tạo orders.

## 5. Proposed Deterministic Orders

| order_id | user_id | total_amount | status | shipping_address | created_at / assertion treatment | order_case | iteration_key | evidence |
|---:|---:|---:|---|---|---|---|---|---|
| `2312710701` | `2` | `30000000` | `pending` | `HW05_LOAD_FIXTURE_A` | Omit khi insert; DB dùng `CURRENT_TIMESTAMP`; assert field là non-empty string, không exact equality | `deterministic_success_a` | `load-order-a` | ID dùng Student-scoped reserved range trong isolated DB; user `2`, product seed price `30000000`, default status và timestamp có source evidence; address được setup script định nghĩa cho TEXT column. |
| `2312710702` | `2` | `28000000` | `pending` | `HW05_LOAD_FIXTURE_B` | Omit khi insert; DB dùng `CURRENT_TIMESTAMP`; assert field là non-empty string, không exact equality | `deterministic_success_b` | `load-order-b` | ID dùng cùng reserved range; user `2`, product seed price `28000000`, default status và timestamp có source evidence; address được setup script định nghĩa cho TEXT column. |

### 5.1 Evidence classification

- **FACT:** schema cho phép explicit integer primary key, `total_amount INTEGER`, `shipping_address TEXT`, default `status='pending'` và `created_at=CURRENT_TIMESTAMP`.
- **FACT:** source seed định nghĩa dedicated Test User thứ hai và product prices `30000000`, `28000000`.
- **HUMAN-APPROVED FIXTURE INPUT:** explicit IDs `2312710701/02`, addresses, cases và iteration keys là reserved fixture namespace được Student chấp nhận cho runtime verification, không phải repository seed facts.
- **CONTROL:** setup phải assert IDs chưa tồn tại sau isolated-order cleanup và chỉ insert trên isolated DB. Explicit high IDs có thể advance `sqlite_sequence`, vì vậy runtime DB phải bị discard/restore sau execution.

Hai rows đã được insert và exact-verify trong disposable runtime; classification là `SOURCE: HUMAN_APPROVED_DETERMINISTIC_FIXTURE` và `SOURCE_BACKED: RUNTIME_VERIFIED_FIXTURE`. Không gọi chúng là repository seed. Final CSV vẫn cần một quyết định `APPROVE_DATA`, `MODIFY_DATA` hoặc `REJECT_DATA` riêng.

## 6. CSV Proposal

- Expected final path: `test-data/read-heavy-orders.csv`
- Status: `CREATED_APPROVED_DATASET`
- Schema:

```csv
order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key
2312710701,2,pending,30000000,deterministic_success_a,load-order-a
2312710702,2,pending,28000000,deterministic_success_b,load-order-b
```

- Request-driving field: `order_id`.
- Assertion-driving fields: `expected_user_id`, `expected_status`, `expected_total_amount`.
- Trace-only fields: `order_case`, `iteration_key`.
- Authentication data: không nằm trong CSV; token là external runtime property.
- Primary rows: success-path only; không đưa intentional `401`, `403`, `404` hoặc missing order vào measured dataset.
- Proposed runtime behavior: `Recycle on EOF = true`, `Stop thread on EOF = false`, `Sharing mode = shareMode.all`.

CSV có đúng `2` data rows, `SUCCESS_PATH_ONLY`; không có historical ID `2/3`, negative case, `401`, `403`, `404` hoặc foreign-owner row.

## 7. Runtime / Preflight Strategy và kết quả

### 7.1 Token control

1. Thực hiện đúng một setup-only `POST /api/login` vào copied backend bằng seeded dedicated credentials đọc từ source; request này không thuộc measured workload.
2. Lưu `hw05.auth_token=<secret>` trong JMeter properties file ngoài repository với access hạn chế.
3. Plan tương lai dùng `Authorization: Bearer ${__P(hw05.auth_token,)}` và nhận file qua `-q <external-secret-properties-file>`; không đưa token vào command line.
4. Gọi `GET /api/users/me` ngoài measured workload; yêu cầu HTTP `200`, JSON `id == 2`.
5. Evidence chỉ ghi `token_present=true`, `verified_user_id=2` và flags redaction; không ghi token, token hash hoặc header.
6. Xóa external properties file trong cleanup.

Token check là contract/setup control. Current `GET /api/orders/:id` không attach `authenticateToken`; Load scenario không đo JWT verification và không cover owner authorization.

### 7.2 Database/fixture control

Runtime verification ngày `2026-08-15` đã `PASS` toàn bộ check sau:

- resolved backend DB path thuộc copied backend dưới OS temp và khác source `backend/database.sqlite`;
- source DB SHA-256 không đổi sau setup;
- dedicated user ID `2` tồn tại và token identity khớp;
- đúng hai fixture orders tồn tại, không thừa historical order;
- mỗi row khớp exact ID/user/amount/status/address;
- `created_at` tồn tại, là string không rỗng;
- read-only smoke request cho từng ID trả HTTP `200` và expected fields;
- không có checkout/cancel/admin-order workload chạy đồng thời;
- final CSV chưa được tạo; row transition dừng tại final Human approval gate.

Preflight output không phải performance result và phải chạy ngay trước real Load execution.

## 8. Cleanup / Restore Strategy

1. Copied backend đã dừng; port `3000` được nhả sau verification.
2. External JWT properties file và toàn bộ disposable runtime đã bị xóa; không giữ raw JWT hay runtime DB làm evidence.
3. Source `backend/database.sqlite` SHA-256 trước/sau đều là `C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6`.
4. Source `server.js` và `database.js` fingerprints cũng không đổi; không cleanup SQL trên source/shared DB.

## 9. Human Review

Prior Student Decision: `MODIFY_DATA`

Decision Scope: `READ_HEAVY_LOAD_FIXTURE_STRATEGY`

Accepted in principle: đúng hai fixture values ở mục 5 và `created_at` do SQLite `CURRENT_TIMESTAMP`, chỉ assert non-empty string.

Rejected: isolated DB-path injection/launcher assumption không được current SUT source hỗ trợ.

Correction: `DISPOSABLE_BACKEND_RUNTIME_COPY`, production source unchanged, source database immutable, runtime/token cleaned up.

Status: `REVIEWED`

Student Decision: `APPROVE_DATA`

Approval Scope: `READ_HEAVY_LOAD_DETERMINISTIC_DATASET`

Approval Status: `APPROVED`

Data Classification: `HUMAN_APPROVED_DETERMINISTIC_FIXTURE`

Runtime Verification: `PASS`

Isolation Strategy: `DISPOSABLE_BACKEND_RUNTIME_COPY`

Source DB Integrity: `PASS`

CHECKPOINT RESOLUTION: `TEST_DATA_APPROVED`

NEXT CHECKPOINT: `JMETER_PLAN_BUILD_ALLOWED`

Next allowed action: `$jmeter-plan-builder` tạo production Load JMX từ approved design và exact final CSV; không chạy JMeter.
