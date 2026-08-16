Resume HW05 READ_HEAVY / LOAD workflow at:

TEST_DATA_REVIEW_REQUIRED

Endpoint:
GET /api/orders/:id

Scenario:
LOAD

Design:
docs/performance-design/load-order-detail-design.md

Data Proposal:
docs/test-data-reviews/load-order-detail-data-candidates.md

Student Decision:
MODIFY_DATA

Decision Scope:
READ_HEAVY_LOAD_FIXTURE_STRATEGY

==================================================
1. HUMAN REVIEW CORRECTION
==================================================

The deterministic fixture values are accepted in principle:

Fixture A:
order_id = 2312710701
user_id = 2
total_amount = 30000000
status = pending
shipping_address = HW05_LOAD_FIXTURE_A
order_case = deterministic_success_a
iteration_key = load-order-a

Fixture B:
order_id = 2312710702
user_id = 2
total_amount = 28000000
status = pending
shipping_address = HW05_LOAD_FIXTURE_B
order_case = deterministic_success_b
iteration_key = load-order-b

created_at:
use SQLite CURRENT_TIMESTAMP and assert only non-empty string.

However the current proposed isolated DB injection/launcher mechanism is
NOT approved.

Reason:

backend/server.js imports:

./database

directly.

backend/database.js resolves:

__dirname/database.sqlite

and invokes initDatabase() during module loading.

The repository currently has no approved runtime DB-path injection
mechanism.

Do not modify production server/database code merely to make the
performance test possible.

==================================================
2. REVISED ISOLATION STRATEGY
==================================================

Replace the DB-injection proposal with:

DISPOSABLE_BACKEND_RUNTIME_COPY

Create the runtime outside tracked repository files, for example under an
ignored/temp directory.

Concept:

repository backend
        ↓ copy
temporary HW05 runtime backend
        ↓
start copied server.js
        ↓
copied database.js initializes copied database.sqlite
        ↓
insert deterministic fixture orders
        ↓
run preflight / later JMeter against temporary backend
        ↓
discard runtime after execution

The original:

backend/database.sqlite

must never be mutated by fixture setup.

==================================================
3. DO NOT CHANGE SUT SOURCE
==================================================

Do not modify:

backend/server.js
backend/database.js

to add:

DB_PATH
environment DB injection
test-only branching
fixture routes
performance-specific logic

unless a separately approved Human Decision later requests an actual SUT
change.

This task must keep production source unchanged.

==================================================
4. IMPLEMENT FIXTURE TOOLING
==================================================

Create reusable HW05 fixture/runtime tooling in an appropriate repository
location.

Suggested paths if no better repository convention exists:

scripts/performance/load-order-detail-setup.js
scripts/performance/load-order-detail-runtime.js

or equivalent.

The tooling must be reviewable and deterministic.

Do NOT classify this implementation as Agent Skill development.

It is HW05 test setup tooling and therefore part of the substantive
performance-testing workflow.

==================================================
5. RUNTIME COPY
==================================================

The runtime setup must:

1. Resolve repository backend directory explicitly.

2. Create a disposable runtime directory in an ignored/temp location.

3. Copy the backend application required to start the server.

4. Ensure the runtime's database.sqlite belongs to the copied backend,
   not repository backend/database.sqlite.

5. Record SHA-256 of repository backend/database.sqlite before setup.

6. Start the copied backend.

7. Wait until database initialization has completed.

8. Verify the copied database contains:
   - seeded users;
   - no required dependency on historical orders.

9. Never write to repository backend/database.sqlite.

Fail closed if runtime path resolves to repository backend.

==================================================
6. FIXTURE INSERTION ORDER
==================================================

IMPORTANT:

Do NOT insert orders before backend startup if copied database.js will
drop/recreate the orders table during initialization.

Required sequence:

start copied backend
        ↓
wait for initialization complete
        ↓
open copied runtime database.sqlite
        ↓
insert deterministic fixtures

Insert exactly:

2312710701
2312710702

using a transaction.

Before insert:

- verify orders schema;
- verify user ID 2 exists;
- delete/clear historical orders ONLY inside disposable runtime DB;
- verify proposed fixture IDs do not exist.

After insert:

verify exactly two rows exist and match expected fields.

Rollback on failure.

==================================================
7. TOKEN PREFLIGHT
==================================================

Do not require Student to manually paste a permanent JWT.

Use a setup-only authentication flow outside the measured workload.

Inspect current seeded dedicated user credentials from source evidence.

If valid seeded credentials exist:

perform one preflight:

POST /api/login

against the temporary backend.

This request is NOT part of the measured Load workload.

Extract returned JWT.

Do not print it.

Write it only to a temporary external JMeter properties file such as:

<temp>/hw05-load-secrets.properties

with:

hw05.auth_token=<runtime token>

The properties file must be:

- outside tracked repository artifacts;
- excluded from audit output contents;
- deleted during cleanup.

Then verify:

GET /api/users/me

with that token returns:

HTTP 200
id == 2

Evidence may record:

token_present = true
verified_user_id = 2

but must never record:

- raw token;
- token hash;
- Authorization header.

==================================================
8. VERIFY ORDER ENDPOINT
==================================================

After fixture setup and token verification:

perform read-only smoke requests outside measured workload:

GET /api/orders/2312710701
GET /api/orders/2312710702

Send contract-compliant Bearer header.

For each require:

HTTP 200

and exact:

id
user_id
total_amount
status
shipping_address

created_at:
non-empty string

Remember:

current /api/orders/:id handler does not itself enforce JWT/ownership.

Do not claim this smoke check validates authorization.

==================================================
9. SOURCE DATABASE IMMUTABILITY
==================================================

After setup verification:

recalculate SHA-256 of:

backend/database.sqlite

Expected:

SOURCE_DB_UNCHANGED:
PASS

If source database hash differs:

STOP.

Do not continue.

Classify:

SOURCE_DB_MUTATION:
FAIL

and require Human Review.

==================================================
10. DATA CANDIDATE TRANSITION
==================================================

Only after successful runtime fixture insertion and verification:

change:

DATA_CANDIDATES:
NOT_FOUND

to:

DATA_CANDIDATES:
FOUND

and:

SOURCE_BACKED:
PARTIAL

to a precise status such as:

RUNTIME_VERIFIED_FIXTURE

or actual canonical enum supported by current skill/workflow.

Do not call synthetic fixture values repository seed data.

Classification must preserve:

SOURCE:
HUMAN_APPROVED_DETERMINISTIC_FIXTURE

RUNTIME_VERIFICATION:
PASS

==================================================
11. PATCH DATA PROPOSAL
==================================================

Update:

docs/test-data-reviews/load-order-detail-data-candidates.md

Record Human Review:

Student Decision:
MODIFY_DATA

Document:

- rejected unsupported DB injection assumption;
- approved disposable runtime-copy strategy;
- fixture values;
- setup sequence;
- runtime verification result;
- source DB immutability evidence;
- token preflight strategy.

If runtime verification succeeds:

Status:
READY_FOR_FINAL_DATA_APPROVAL

Do NOT mark final CSV approved yet.

==================================================
12. PATCH DESIGN
==================================================

Update:

docs/performance-design/load-order-detail-design.md

Replace any assumption that requires an unsupported isolated-DB launcher.

Document:

Runtime Isolation:
DISPOSABLE_BACKEND_RUNTIME_COPY

Keep:

IMPLEMENTATION_SPEC_CONFLICT

Keep approved:

- READ_HEAVY / LOAD;
- 0 -> 5 -> 10 VUs;
- 120 seconds;
- Uniform Random Timer 500-1000 ms;
- Summary Report;
- request-driven CSV.

==================================================
13. FINAL CSV
==================================================

Do NOT create:

test-data/read-heavy-orders.csv

yet.

Even after runtime fixtures PASS, stop for another Student approval of the
exact verified rows.

Next Student decision should be:

APPROVE_DATA
MODIFY_DATA
REJECT_DATA

==================================================
14. JMETER
==================================================

DO NOT generate JMX.

DO NOT run Load test.

DO NOT generate JTL.

The only allowed HTTP requests in this task are setup/preflight smoke
requests against the disposable backend runtime.

These are not performance measurements.

==================================================
15. CLEANUP
==================================================

After verification:

stop temporary backend.

Preserve only non-secret setup evidence required for Human Review.

Delete:

- temporary JWT properties;
- raw JWT;
- temporary runtime if it is no longer needed.

If the runtime DB must remain temporarily for Human Review:

keep it only in ignored/temp storage and clearly classify:

NON_EVIDENCE_RUNTIME_FIXTURE

Never commit it.

Verify repository source database hash again.

==================================================
16. AUDIT
==================================================

This is substantive HW05 test-data/setup work.

Use $log-ai-audit according to current HW05 scope.

The Human Review correction must be recorded:

The AI proposed an isolated DB strategy that assumed a backend DB-path
injection/launcher mechanism not supported by the current SUT source.

Student replaced it with a disposable backend runtime-copy approach that
preserves production source code and source database immutability.

Do not audit Agent Skill implementation.

Do not include secrets.

==================================================
17. WORKFLOW
==================================================

If fixture setup and all preflight checks PASS:

Workflow checkpoint:

TEST_DATA_FINAL_APPROVAL_REQUIRED

Do not move to JMeter builder.

If setup cannot be implemented safely:

Workflow remains:

TEST_DATA_REVIEW_REQUIRED

with exact blocker.

==================================================
18. GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

==================================================
19. FINAL OUTPUT
==================================================

Return:

READ_HEAVY LOAD — DETERMINISTIC FIXTURE IMPLEMENTATION

Student Decision:
MODIFY_DATA

Isolation Strategy:
DISPOSABLE_BACKEND_RUNTIME_COPY

Production Source Modified:
NO

Source Database Mutated:
NO / FAIL

Fixture Setup:
PASS / FAIL

Fixture Rows:
2 / <actual>

Order 2312710701:
PASS / FAIL

Order 2312710702:
PASS / FAIL

Token Provision:
PASS / FAIL

Token Secret Leaked:
NO / FAIL

/users/me Preflight:
PASS / FAIL

Order Smoke Checks:
PASS / FAIL

Source DB SHA-256 Integrity:
PASS / FAIL

Data Candidates:
FOUND / NOT_FOUND

Runtime Fixture Verification:
PASS / FAIL

Final CSV:
NOT_CREATED

JMX:
NOT_CREATED

JMeter Load Execution:
NOT_RUN

Proposal:
UPDATED / FAIL

Design:
UPDATED / FAIL

Workflow State:
TEST_DATA_FINAL_APPROVAL_REQUIRED / TEST_DATA_REVIEW_REQUIRED

Final Checkpoint:
<state>

Next Allowed Action:
Student Human Review and final approval/rejection of the verified
deterministic Load dataset.

NO PERFORMANCE EXECUTION.
NO JMX.
NO FINAL CSV.
NO COMMIT.
NO PUSH.