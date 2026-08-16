Resume HW05 production READ_HEAVY / LOAD workflow at:

REAL_EXECUTION_REQUIRED

Endpoint:
GET /api/orders/:id

Scenario:
LOAD

Approved JMX:
test-plans/23127107_Load_20260812.jmx

Approved CSV:
test-data/read-heavy-orders.csv

Design:
docs/performance-design/load-order-detail-design.md

Plan Review:
docs/performance-reviews/load-order-detail-jmeter-ai-review.md

Fixture Tooling:
scripts/performance/load-order-detail-runtime.js
scripts/performance/load-order-detail-setup.js

Student ID:
23127107

==================================================
1. EXECUTION POLICY
==================================================

This is the REAL production LOAD execution.

Run exactly ONE approved Load workload if and only if every mandatory
preflight check passes.

Do not redesign the workload.

Do not modify JMX or CSV.

Do not silently rerun on failure.

==================================================
2. RECREATE DISPOSABLE RUNTIME
==================================================

Use the Human-approved:

DISPOSABLE_BACKEND_RUNTIME_COPY

strategy.

Recreate a fresh disposable backend runtime.

Do not reuse the previous verification runtime because it was correctly
cleaned up.

Production source files must remain unchanged.

Verify:

PRODUCTION_SOURCE_MODIFIED:
NO

==================================================
3. SOURCE DATABASE INTEGRITY
==================================================

Before runtime setup:

calculate SHA-256 of:

backend/database.sqlite

Record:

SOURCE_DB_SHA256_BEFORE:
<hash>

The fixture/runtime tooling must not mutate this source DB.

==================================================
4. START ISOLATED BACKEND
==================================================

Start the copied backend runtime.

Wait until its database initialization is fully complete.

Do NOT insert fixtures before initialization if database.js will
drop/recreate orders.

Verify runtime DB path is not:

backend/database.sqlite

If isolation cannot be proven:

STOP.

Do not run JMeter.

==================================================
5. CREATE APPROVED FIXTURES
==================================================

Insert exactly the two Human-approved orders into the disposable DB:

Order A:
id = 2312710701
user_id = 2
total_amount = 30000000
status = pending
shipping_address = HW05_LOAD_FIXTURE_A

Order B:
id = 2312710702
user_id = 2
total_amount = 28000000
status = pending
shipping_address = HW05_LOAD_FIXTURE_B

created_at:
database-generated CURRENT_TIMESTAMP

Do not insert additional measured rows.

Verify exactly two fixture orders.

==================================================
6. TOKEN PROVISION
==================================================

Provision a temporary token outside the measured workload.

Use source-backed dedicated seeded user credentials.

Perform:

POST /api/login

against the disposable backend.

Do not include this request in Load measurements.

Extract JWT without printing it.

Write:

hw05.auth_token=<token>

to a temporary external JMeter properties file.

Do not:

- commit it;
- print it;
- log the Authorization header;
- store it in audit;
- store it in JMX/CSV.

==================================================
7. AUTH PREFLIGHT
==================================================

Perform:

GET /api/users/me

using the temporary token.

Require:

HTTP 200
id == 2

Evidence may contain:

token_present = true
verified_user_id = 2

but never the token itself.

==================================================
8. ORDER PREFLIGHT
==================================================

Perform read-only smoke requests:

GET /api/orders/2312710701
GET /api/orders/2312710702

with the contract-compliant Bearer header.

Require for each:

HTTP 200

and exact expected:

id
user_id
total_amount
status
shipping_address

created_at:
non-empty string

Do not interpret this as authorization coverage.

Current IMPLEMENTATION_SPEC_CONFLICT remains.

==================================================
9. SOURCE DB RECHECK BEFORE LOAD
==================================================

Recalculate source:

backend/database.sqlite

SHA-256.

Require exact match with:

SOURCE_DB_SHA256_BEFORE

If changed:

STOP.

Do not execute JMeter.

==================================================
10. RESOURCE MONITORING
==================================================

Prepare resource monitoring for the disposable backend process.

Capture during the real Load execution at minimum:

- CPU;
- memory/RAM;
- backend process identity/PID;
- timestamps;
- hardware context;
- execution metadata.

Use the existing controlled Stress evidence conventions where useful.

Do not fabricate screenshots or measurements.

==================================================
11. EXECUTE APPROVED LOAD PLAN
==================================================

Only if all preflight checks PASS.

Run exactly:

test-plans/23127107_Load_20260812.jmx

with:

test-data/read-heavy-orders.csv

and temporary external properties containing:

hw05.auth_token

Approved workload:

0 -> 5 VUs:
10 seconds

hold 5:
30 seconds

5 -> 10 VUs:
20 seconds

hold 10:
60 seconds

Total planned duration:
120 seconds

Think Time:
Uniform Random Timer 500-1000 ms

Listener:
Summary Report

Do not change any values.

==================================================
12. RESULT DIRECTORY
==================================================

Use stable run identity.

Suggested canonical structure if current workflow supports it:

results/23127107_Load_20260812/run-001/

with:

raw/
html/
evidence/

Do not overwrite any existing real run.

If run-001 already exists unexpectedly:

STOP and report collision.

Do not silently create a replacement run number unless workflow contract
explicitly permits it and records the reason.

==================================================
13. RAW JTL
==================================================

Preserve raw JTL as immutable evidence.

Suggested filename:

results/23127107_Load_20260812/run-001/raw/
23127107_Load_20260812_run-001.jtl

After run:

calculate SHA-256.

Record:

RAW_JTL_SHA256:
<hash>

Never rewrite/normalize raw JTL.

==================================================
14. HTML REPORT
==================================================

Generate JMeter HTML dashboard from the SAME raw JTL.

Do not execute a second workload to generate HTML.

Expected:

results/23127107_Load_20260812/run-001/html/index.html

Verify it is readable.

==================================================
15. EXECUTION FACTS ONLY
==================================================

After execution record factual values only:

- JMeter exit status;
- actual duration;
- total samples;
- successful samples;
- failed samples;
- raw JTL path/hash;
- HTML path;
- resource evidence paths.

Do NOT yet interpret:

- p50;
- p95;
- p99;
- acceptable latency;
- maximum throughput;
- SLA;
- capacity;
- bottleneck.

Those belong to Task 2.

==================================================
16. NO SILENT RERUN
==================================================

If the first real production Load run fails:

preserve evidence.

Classify the failure:

ENVIRONMENT_FAILURE
DATA_STATE_FAILURE
JMETER_FAILURE
SUT_FAILURE
EVIDENCE_FAILURE

Do not rerun automatically.

Return to Human Review.

==================================================
17. CLEANUP
==================================================

After execution/evidence capture:

stop disposable backend.

Delete temporary secret property file.

Do not expose JWT.

Dispose temporary runtime according to approved tooling.

Recalculate source DB SHA-256.

Expected:

SOURCE_DB_INTEGRITY:
PASS

==================================================
18. EXECUTION REVIEW ARTIFACT
==================================================

Create a Human-review artifact, for example:

docs/performance-executions/load-order-detail-run-001-execution-review.md

Include:

- preflight results;
- run identity;
- exact evidence paths;
- counts;
- JTL hash;
- resource evidence inventory;
- source DB integrity;
- no-rerun status.

Human Decision:

NOT_REVIEWED

Do not self-approve.

==================================================
19. WORKFLOW
==================================================

If execution and required evidence complete:

transition from:

REAL_EXECUTION_REQUIRED

to:

EXECUTION_REVIEW_REQUIRED

or exact canonical equivalent.

Do NOT start Task 2.

==================================================
20. AI AUDIT
==================================================

This is substantive HW05 execution work.

Use $log-ai-audit CREATE_ENTRY for the AI-supported execution/evidence
registration interaction.

Do not audit Agent Skill implementation.

Important:

Raw JTL, HTML dashboard and real resource measurements are REAL EXECUTION
EVIDENCE, not AI-generated evidence.

Audit may reference them, but must not claim AI created their contents.

Do not finalize the new audit entry yet because Human Execution Review
has not occurred.

Expected:

Review Status:
PENDING_HUMAN_REVIEW

Do not expose token.

==================================================
21. GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

Execution evidence must be Human reviewed first.

==================================================
22. FINAL OUTPUT
==================================================

Return:

PRODUCTION READ_HEAVY LOAD EXECUTION

Preflight:
PASS / FAIL

Disposable Runtime:
PASS / FAIL

Fixture Rows:
2 / <actual>

Order 2312710701:
PASS / FAIL

Order 2312710702:
PASS / FAIL

Token Provision:
PASS / FAIL

/users/me:
PASS / FAIL

Source DB Integrity Before Run:
PASS / FAIL

JMeter:
PASS / FAIL / NOT_RUN

Execution:
COMPLETE / FAILED / NOT_RUN

Run:
run-001 / NONE

Raw JTL:
<path / NONE>

Raw JTL SHA-256:
<hash / NONE>

HTML Report:
<path / NONE>

Resource Evidence:
<path(s) / NONE>

Total Samples:
<number / NOT_COMPUTABLE>

Successful Samples:
<number / NOT_COMPUTABLE>

Failed Samples:
<number / NOT_COMPUTABLE>

No Silent Rerun:
PASS / FAIL

Source DB Integrity After Cleanup:
PASS / FAIL

Execution Review:
<path / NONE>

Performance Interpretation:
NOT_PERFORMED

Audit Entry:
<Artifact ID / NONE>

Audit Review Status:
PENDING_HUMAN_REVIEW / NONE

Workflow State:
EXECUTION_REVIEW_REQUIRED / <blocker>

Final Checkpoint:
EXECUTION_REVIEW_REQUIRED / <blocker>

Next Allowed Action:
Student Human Review of production READ_HEAVY / LOAD execution evidence.

NO TASK 2 ANALYSIS.
NO SILENT RERUN.
NO COMMIT.
NO PUSH.