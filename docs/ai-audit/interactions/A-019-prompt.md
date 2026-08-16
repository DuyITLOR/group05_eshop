Resume HW05 production READ_HEAVY / LOAD workflow from:

REAL_EXECUTION_REQUIRED

Retry State:

RETRY_AUTHORIZATION_REQUIRED

Student Decision:

MODIFIED_AND_APPROVED

Decision Scope:

READ_HEAVY_LOAD_RUN_001_FAILURE_REMEDIATION

==================================================

1. EXECUTION CONTEXT
   ==================================================

Production endpoint:

GET /api/orders/:id

Group:

READ_HEAVY

Scenario:

LOAD

Approved JMX:

test-plans/23127107_Load_20260812.jmx

Approved CSV:

test-data/read-heavy-orders.csv

Approved design:

docs/performance-design/load-order-detail-design.md

Approved AI review:

docs/performance-reviews/load-order-detail-jmeter-ai-review.md

Fixture tooling:

scripts/performance/load-order-detail-runtime.js
scripts/performance/load-order-detail-setup.js

Execution tooling:

scripts/performance/load-order-detail-execute.js
scripts/performance/run-approved-load-jmeter.ps1
scripts/performance/monitor-load-resources.ps1

==================================================
2. PREVIOUS ATTEMPT
===================

Previous attempt:

results/23127107_Load_20260812/run-001/

Classification:

FAILED_PRE_EXECUTION_ATTEMPT

Failure Category:

EVIDENCE_FAILURE

Root Cause Category:

PERMISSION_FAILURE

Root cause:

Windows CIM provider rejected:

Get-CimInstance Win32_ComputerSystem

with:

PermissionDenied / HRESULT 0x80041003

JMeter Executed:

NO

Performance Result:

NONE

Monitor Remediation:

PASS

Monitor-only Validation:

PASS

==================================================
3. PRESERVE RUN-001
===================

run-001 is immutable historical evidence.

Do NOT:

* delete it;
* overwrite it;
* rename it;
* put run-002 evidence inside it;
* create JTL/HTML retroactively;
* change its classification.

Keep:

run-001:
FAILED_PRE_EXECUTION_ATTEMPT

JMeter Executed:
NO

Performance Result:
NONE

==================================================
4. AUTHORIZE EXACTLY ONE RETRY
==============================

The Student authorizes exactly ONE new real execution attempt:

run-002

Retry Reason:

RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE

Do NOT automatically create:

run-003

if run-002 fails.

No silent rerun.

==================================================
5. RUN-002 COLLISION CHECK
==========================

Before doing any setup, inspect:

results/23127107_Load_20260812/run-002/

If it already contains real execution evidence:

STOP.

Return:

RUN_ID_COLLISION

Do not overwrite it.

If absent, create canonical:

results/23127107_Load_20260812/run-002/
├── raw/
├── html/
└── evidence/

==================================================
6. APPROVED PLAN MUST REMAIN IMMUTABLE
======================================

Do NOT modify:

test-plans/23127107_Load_20260812.jmx
test-data/read-heavy-orders.csv

Do NOT change:

Endpoint:
GET /api/orders/:id

Load profile:
0 -> 5 VUs in 10 seconds
hold 5 VUs for 30 seconds
5 -> 10 VUs in 20 seconds
hold 10 VUs for 60 seconds

Total planned duration:
120 seconds

Think Time:
Uniform Random Timer 500-1000 ms

Listener:
Summary Report

Fixture IDs:
2312710701
2312710702

==================================================
7. CREATE FRESH DISPOSABLE BACKEND RUNTIME
==========================================

Create a NEW disposable backend runtime.

Do not reuse:

* previous fixture verification runtime;
* monitor diagnostic runtime;
* run-001 runtime.

Use the approved:

DISPOSABLE_BACKEND_RUNTIME_COPY

strategy.

Production source must remain unchanged.

Verify:

PRODUCTION_SOURCE_MODIFIED:
NO

==================================================
8. SOURCE DATABASE INTEGRITY — BEFORE SETUP
===========================================

Calculate SHA-256 of:

backend/database.sqlite

Record as:

SOURCE_DB_SHA256_BEFORE

All runtime/fixture writes must occur against the disposable backend DB.

Fail closed if resolved runtime DB path equals:

backend/database.sqlite

==================================================
9. INITIALIZE DISPOSABLE BACKEND
================================

Start the copied backend.

Wait until:

database initialization is complete.

Because database.js recreates tables during startup:

Do NOT insert fixture rows before initialization finishes.

Verify seeded dedicated Test User exists.

Expected dedicated user:

id = 2

Do not assume without runtime verification.

==================================================
10. INSERT APPROVED FIXTURES
============================

After initialization, insert exactly:

Fixture A:

id:
2312710701

user_id:
2

total_amount:
30000000

status:
pending

shipping_address:
HW05_LOAD_FIXTURE_A

Fixture B:

id:
2312710702

user_id:
2

total_amount:
28000000

status:
pending

shipping_address:
HW05_LOAD_FIXTURE_B

created_at:

allow DB CURRENT_TIMESTAMP.

Require exactly two measured fixture rows.

No historical IDs 2/3.

==================================================
11. TOKEN PROVISION
===================

Provision JWT outside measured workload.

Use source-backed seeded dedicated test credentials.

Perform one setup-only:

POST /api/login

against disposable backend.

Do NOT count this as Load performance traffic.

Extract token without printing it.

Create temporary external JMeter property file containing:

hw05.auth_token=<secret>

Do not expose token in:

* stdout;
* stderr;
* evidence;
* JMX;
* CSV;
* audit;
* Git.

==================================================
12. IDENTITY PREFLIGHT
======================

Using the temporary token:

GET /api/users/me

Require:

HTTP 200

id == 2

Evidence may record:

token_present = true

verified_user_id = 2

Do NOT record:

raw token
token hash
Authorization header

==================================================
13. ORDER PREFLIGHT
===================

Perform setup-only read requests:

GET /api/orders/2312710701

GET /api/orders/2312710702

Send contract-compliant Bearer header.

Require HTTP 200 and exact:

id
user_id
total_amount
status
shipping_address

Require:

created_at

is a non-empty string.

Remember:

Current `/api/orders/:id` does NOT enforce authentication or ownership.

Do not claim this preflight proves authorization behavior.

==================================================
14. SOURCE DB INTEGRITY — BEFORE JMETER
=======================================

Recalculate:

backend/database.sqlite

SHA-256.

Require exact equality with:

SOURCE_DB_SHA256_BEFORE

If mismatch:

STOP.

JMeter:
NOT_RUN

Failure:
SOURCE_DB_MUTATION

==================================================
15. START REMEDIATED RESOURCE MONITOR
=====================================

Use the remediated:

scripts/performance/monitor-load-resources.ps1

Known CIM permission failure must not be reintroduced.

Before starting JMeter verify the monitor:

* process starts successfully;
* does not exit immediately;
* creates expected output artifact;
* captures at least initial valid resource sample;
* backend PID/process identity is resolved;
* stderr does not contain fatal monitor error.

If monitor initialization FAILS:

STOP BEFORE JMETER.

Classify:

EVIDENCE_FAILURE

Do not create another run automatically.

==================================================
16. EXECUTION START EVIDENCE
============================

Before measured workload begins, preserve:

* run identity;
* execution timestamp;
* JMX path;
* JMX hash if workflow supports it;
* CSV path/hash;
* backend PID;
* monitor PID;
* hardware/runtime context;
* preflight result;
* retry reason.

Do not record JWT.

==================================================
17. EXECUTE PRODUCTION LOAD
===========================

Only when ALL mandatory preflight checks PASS.

Execute exactly:

test-plans/23127107_Load_20260812.jmx

using:

test-data/read-heavy-orders.csv

and external properties containing:

hw05.auth_token

Run exactly ONCE.

Do not alter the approved workload.

==================================================
18. RAW JTL
===========

Expected raw JTL:

results/23127107_Load_20260812/run-002/raw/23127107_Load_20260812_run-002.jtl

Preserve it as immutable raw execution evidence.

After completion calculate:

SHA-256

Record:

RAW_JTL_SHA256: <actual>

Do not:

* rewrite;
* normalize;
* clean;
* sort;
* manually edit

the raw JTL.

==================================================
19. HTML REPORT
===============

Generate JMeter HTML dashboard from the SAME raw JTL.

Expected:

results/23127107_Load_20260812/run-002/html/index.html

Do not execute the workload a second time just to obtain HTML.

Verify dashboard is readable.

==================================================
20. RESOURCE EVIDENCE
=====================

Preserve actual evidence under:

results/23127107_Load_20260812/run-002/evidence/

Include where applicable:

preflight.json
postflight.json
execution-start.json
execution-metadata.json
hardware-context.json
resource-monitor.csv
resource-summary.json
backend.pid
resource-monitor.pid
JMeter stdout/stderr/run logs
backend stdout/stderr logs
monitor stdout/stderr logs

Only preserve real files actually produced.

Do not fabricate missing evidence.

==================================================
21. EXECUTION FACTS
===================

From real run evidence compute factual counts only:

Total Samples
Successful Samples
Failed Samples

Record:

actual execution duration

JMeter exit status

Do NOT perform Task 2 interpretation.

Do NOT conclude:

* p95 acceptable;
* SLA PASS;
* capacity;
* maximum stable RPS;
* bottleneck;
* production readiness.

==================================================
22. FAILURE HANDLING
====================

If run-002 fails at any stage:

preserve all evidence.

Classify accurately:

ENVIRONMENT_FAILURE
EVIDENCE_FAILURE
DATA_STATE_FAILURE
JMETER_FAILURE
SUT_FAILURE

Do not automatically run again.

No run-003.

Stop at Human Review.

==================================================
23. CLEANUP
===========

After execution/evidence preservation:

* stop resource monitor;
* stop disposable backend;
* remove temporary JWT properties;
* remove all secret material;
* cleanup disposable runtime as approved.

Do not remove:

run-002 execution evidence.

==================================================
24. SOURCE DB INTEGRITY — AFTER CLEANUP
=======================================

Recalculate SHA-256 of:

backend/database.sqlite

Compare against:

SOURCE_DB_SHA256_BEFORE

Expected:

SOURCE_DB_INTEGRITY_AFTER:
PASS

If mismatch:

report it explicitly.

Do not hide or repair evidence silently.

==================================================
25. EXECUTION REVIEW ARTIFACT
=============================

Create:

docs/performance-executions/load-order-detail-run-002-execution-review.md

Include:

* reason for retry;
* run-001 preservation statement;
* run-002 identity;
* preflight result;
* fixture verification;
* token/identity result without secret;
* monitor result;
* JMeter result;
* raw JTL path/hash;
* HTML path;
* resource evidence inventory;
* factual sample counts;
* cleanup result;
* source DB integrity;
* no-silent-rerun statement.

Human Review:

Status:
PENDING

Student Decision:
NOT_REVIEWED

Do not auto-approve execution.

==================================================
26. WORKFLOW
============

If run-002 execution and required evidence complete:

transition canonically to:

EXECUTION_REVIEW_REQUIRED

Do NOT start Task 2.

If execution fails:

transition to the appropriate Human failure-review checkpoint.

==================================================
27. AI AUDIT
============

This is substantive HW05 assignment work.

Use:

$log-ai-audit

CREATE_ENTRY

for the run-002 execution/evidence-registration interaction.

Do not create an audit entry for Agent Skill development.

The entry must remain:

Review Status:
PENDING_HUMAN_REVIEW

because the Student has not reviewed run-002 yet.

Important:

Raw JTL, HTML dashboard, logs and resource measurements are REAL
execution evidence.

Do not describe them as AI-generated evidence.

Do not expose secret token.

==================================================
28. GIT
=======

DO NOT COMMIT.

DO NOT PUSH.

Wait for Student Human Execution Review.

==================================================
29. FINAL OUTPUT
================

Return:

PRODUCTION READ_HEAVY LOAD — RETRY RUN

Retry Authorization:
APPROVED

Previous Run:
run-001

Previous Run Preserved:
PASS / FAIL

Retry Run:
run-002

Retry Reason:
RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE

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

Order Smoke Checks:
PASS / FAIL

Resource Monitor:
PASS / FAIL

Source DB Integrity Before:
PASS / FAIL

JMeter:
PASS / FAIL / NOT_RUN

Execution:
COMPLETE / FAILED / NOT_RUN

Raw JTL:
<path / NONE>

Raw JTL SHA-256:
<hash / NONE>

HTML Report:
<path / NONE>

Resource Evidence:
<path / NONE>

Total Samples:
<number / NOT_COMPUTABLE>

Successful Samples:
<number / NOT_COMPUTABLE>

Failed Samples:
<number / NOT_COMPUTABLE>

Actual Duration:
<seconds / NOT_COMPUTABLE>

No Silent Rerun:
PASS / FAIL

Source DB Integrity After:
PASS / FAIL

Execution Review:
<path / NONE>

Performance Interpretation:
NOT_PERFORMED

Audit Entry:
<Artifact ID / NONE>

Audit Review:
PENDING_HUMAN_REVIEW / NONE

Workflow State: <actual>

Final Checkpoint: <actual>

Next Allowed Action:
Student Human Review of production READ_HEAVY / LOAD run-002 evidence.

NO TASK 2 ANALYSIS.
NO AUTOMATIC RUN-003.
NO COMMIT.
NO PUSH.
