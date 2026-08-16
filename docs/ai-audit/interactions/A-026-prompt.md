Resume HW05 Task 1 from:

REAL_EXECUTION_REQUIRED

Retry State:

RETRY_AUTHORIZATION_REQUIRED

Production Scenario:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Approved JMX:

test-plans/23127107_Spike_20260816.jmx

Approved CSV:

test-data/auth-heavy-users-me.csv

Approved Design:

docs/performance-design/spike-users-me-design.md

Plan Review:

docs/performance-reviews/spike-users-me-jmeter-ai-review.md

==================================================
1. RETRY AUTHORIZATION
==================================================

Student Retry Decision:

APPROVED

Authorized Run:

run-002

Previous Run:

run-001

Previous Run Classification:

FAILED_PRE_EXECUTION_ATTEMPT

Previous Failure:

ENVIRONMENT_FAILURE

Previous Root Cause:

PROCESS_INVOCATION_FAILURE

Root Cause Detail:

Node.js `spawnSync` invoking `jmeter.bat` directly returned `EINVAL`
with `status: null`.

Validated remediation:

Invoke the JMeter Windows batch command through the corrected
PowerShell-compatible execution path.

Remediation:

PASS

Version-Guard Diagnostic:

PASS

Detected JMeter Version:

5.6.3

Plugin Verification:

PASS

Retry Reason:

RETRY_AFTER_PRE_EXECUTION_ENVIRONMENT_FAILURE

Exactly ONE new production attempt is authorized.

Do NOT automatically create run-003.

==================================================
2. PRESERVE RUN-001
==================================================

Treat:

results/23127107_Spike_20260816/run-001/

as immutable historical evidence.

Do NOT:

- delete it;
- overwrite it;
- rename it;
- merge run-002 evidence into it;
- create JTL or HTML retroactively;
- reinterpret it as successful execution.

Preserve:

run-001:
FAILED_PRE_EXECUTION_ATTEMPT

Failure:
ENVIRONMENT_FAILURE

JMeter Executed:
NO

Performance Result:
NONE

==================================================
3. RUN-002 COLLISION CHECK
==================================================

Before setup inspect:

results/23127107_Spike_20260816/run-002/

If it already contains real production evidence:

STOP.

Return:

RUN_ID_COLLISION

Do not overwrite or silently choose another run number.

If absent, create:

results/23127107_Spike_20260816/run-002/
├── raw/
├── html/
└── evidence/

==================================================
4. APPROVED ARTIFACT INTEGRITY
==================================================

Verify without modifying:

test-plans/23127107_Spike_20260816.jmx

test-data/auth-heavy-users-me.csv

Expected CSV:

expected_user_id,expected_email,expected_name,auth_case,iteration_key
2,test@eshop.com,Test User,authenticated_success,auth-users-me-success-001

Preserve:

CSV_MODE:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

Do not modify approved JMX, CSV, design or workload.

==================================================
5. JMETER VERSION GUARD
==================================================

Use the remediated JMeter invocation logic.

JMeter installation:

D:\Tools\apache-jmeter-5.6.3

Require:

Detected Version:
5.6.3

The version guard must still fail closed if:

- JMeter is missing;
- invocation fails;
- detected version differs from 5.6.3.

Do not bypass or disable the guard.

If version verification fails:

STOP.

JMeter Workload:
NOT_RUN

Classification:
ENVIRONMENT_FAILURE

==================================================
6. PLUGIN PREFLIGHT
==================================================

Verify locally before measured execution:

jpgc-graphs-basic:
2.0

Required Listener:

jp@gc - Response Times Over Time

Required Listener class:

kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui

Custom Thread Groups:

jpgc-casutg:
3.1.1

Ultimate Thread Group class:
PASS

If any required class/dependency is unavailable:

STOP BEFORE WORKLOAD.

Do not reinstall plugins automatically.

==================================================
7. SOURCE DB INTEGRITY — BEFORE
==================================================

Calculate SHA-256 of:

backend/database.sqlite

Record:

SOURCE_DB_SHA256_BEFORE:
<actual>

The source database must never become the mutable test runtime database.

==================================================
8. CREATE FRESH DISPOSABLE RUNTIME
==================================================

Create a new:

DISPOSABLE_BACKEND_RUNTIME_COPY

for run-002.

Do not reuse:

- run-001 state;
- previous verification runtime;
- diagnostic runtime;
- READ_HEAVY runtime.

Verify runtime DB path is not:

backend/database.sqlite

If isolation cannot be proven:

STOP.

==================================================
9. START DISPOSABLE BACKEND
==================================================

Start the copied backend.

Wait for database initialization to complete.

Verify seeded identity:

id:
2

name:
Test User

email:
test@eshop.com

Do not persist credentials or sensitive user fields.

==================================================
10. TEMPORARY TOKEN PROVISION
==================================================

Perform setup-only authentication.

This login is outside the measured SPIKE workload.

Obtain a temporary JWT.

Do not print it.

Create a temporary external JMeter properties file:

hw05.auth_token=<secret>

Never commit/store the real token in:

JMX
CSV
Git
audit
execution review
stdout
stderr

==================================================
11. SUCCESS-PATH PREFLIGHT
==================================================

Using the temporary token call:

GET /api/users/me

Require:

HTTP 200
id == 2
email == test@eshop.com
name == Test User

Do NOT preserve the full response body.

Current implementation may return sensitive fields.

Only record the minimum verified non-sensitive identity facts.

==================================================
12. FAIL-CLOSED TOKEN PREFLIGHT
==================================================

Outside measured traffic verify missing/blank token behavior.

Expected source-backed behavior:

missing token -> 401

or the exact current fail-closed behavior.

Require:

FAIL_CLOSED_TOKEN_CHECK:
PASS

If unauthenticated request unexpectedly succeeds:

STOP.

Do not run JMeter.

==================================================
13. SENSITIVE DATA SAFETY
==================================================

Do not persist values of:

password
reset_token
JWT
Authorization header

Search execution configuration/evidence before completion for accidental
secret exposure.

Expected:

JWT_EXPOSED:
NO

PASSWORD_VALUE_EXPOSED:
NO

RESET_TOKEN_VALUE_EXPOSED:
NO

If any secret appears in a Git-intended artifact:

STOP and report only the artifact path.

Do not echo the secret.

==================================================
14. SOURCE DB INTEGRITY — PRE-RUN
==================================================

Recalculate:

backend/database.sqlite

SHA-256.

Require equality with:

SOURCE_DB_SHA256_BEFORE

If changed:

STOP.

Classification:
DATA_STATE_FAILURE

JMeter:
NOT_RUN

==================================================
15. RESOURCE MONITOR
==================================================

Use the proven/remediated resource-monitor implementation.

Before measured execution require:

backend PID:
RESOLVED

monitor PID:
RESOLVED

monitor process:
RUNNING

resource output:
CREATED

initial valid sample:
PRESENT

fatal monitor stderr:
NONE

If resource monitoring fails:

STOP BEFORE JMETER.

Classification:
EVIDENCE_FAILURE

Do not silently retry.

==================================================
16. EXECUTION METADATA
==================================================

Before JMeter starts record non-secret execution metadata:

Scenario:
SPIKE

Group:
AUTH_HEAVY

Endpoint:
GET /api/users/me

Run:
run-002

Retry Reason:
RETRY_AFTER_PRE_EXECUTION_ENVIRONMENT_FAILURE

JMX path

CSV path

JMeter version

plugin versions

backend PID

monitor PID

source DB integrity

execution timestamp

preflight status

Do not record the JWT.

==================================================
17. EXECUTE EXACT APPROVED SPIKE
==================================================

Only if every mandatory preflight check PASS.

Execute exactly:

test-plans/23127107_Spike_20260816.jmx

using:

test-data/auth-heavy-users-me.csv

and the temporary external:

hw05.auth_token

Approved aggregate profile:

Baseline:
5 VUs for 20 seconds

Spike ramp:
5 -> 25 VUs in 3 seconds

Spike hold:
25 VUs for 20 seconds

Recovery:
25 -> 5 VUs in 5 seconds

Recovery hold:
5 VUs for 20 seconds

Total planned window:
68 seconds

Think Time:
250-500 ms

Primary Listener:
jp@gc - Response Times Over Time

Run exactly ONCE.

==================================================
18. RAW JTL
==================================================

Write raw JTL to:

results/23127107_Spike_20260816/run-002/raw/23127107_Spike_20260816_run-002.jtl

After execution calculate:

SHA-256

Record:

RAW_JTL_SHA256:
<actual>

Treat raw JTL as immutable evidence.

Do not:

- rewrite;
- normalize;
- sort;
- edit;
- regenerate by another workload.

==================================================
19. HTML REPORT
==================================================

Generate the JMeter HTML dashboard from the SAME run-002 raw JTL.

Expected:

results/23127107_Spike_20260816/run-002/html/index.html

Do not execute another SPIKE workload to produce HTML.

Verify dashboard readability.

==================================================
20. RESPONSE-TIME GRAPH
==================================================

Preserve evidence that the approved JMX contains:

jp@gc - Response Times Over Time

If the execution/reporting tooling can produce a graph artifact from the
same execution without rerunning the workload, preserve it.

Do not run another workload solely for a graph screenshot.

Do not fabricate Listener output.

==================================================
21. RESOURCE EVIDENCE
==================================================

Preserve actual run-002 evidence under:

results/23127107_Spike_20260816/run-002/evidence/

Include actual available evidence such as:

preflight.json
postflight.json
execution-start.json
execution-metadata.json
hardware-context.json
resource-monitor.csv
resource-summary.json
backend.pid
resource-monitor.pid
jmeter stdout/stderr/run logs
backend stdout/stderr
monitor stdout/stderr

Do not fabricate missing files.

==================================================
22. EXECUTION FACTS ONLY
==================================================

After the real run record factual execution values:

JMeter exit status

Total Samples

Successful Samples

Failed Samples

Actual execution/orchestration duration

Raw JTL path/hash

HTML path

Resource evidence path

Do NOT yet interpret:

p50
p90
p95
p99
throughput quality
SLA
capacity
bottleneck
regression
production readiness

Task 2 remains locked.

==================================================
23. FAILURE RULE
==================================================

If run-002 fails at any stage:

preserve all evidence.

Classify accurately:

ENVIRONMENT_FAILURE
DATA_STATE_FAILURE
EVIDENCE_FAILURE
JMETER_FAILURE
SUT_FAILURE
SENSITIVE_EVIDENCE_RISK

Do NOT automatically create:

run-003

Do not silently rerun.

Return to Student Human Review.

==================================================
24. CLEANUP
==================================================

After execution/evidence preservation:

- stop resource monitor;
- stop disposable backend;
- delete temporary external token properties;
- remove secret material;
- dispose temporary runtime.

Do not delete run-002 evidence.

==================================================
25. SOURCE DB INTEGRITY — AFTER
==================================================

Recalculate:

backend/database.sqlite

SHA-256.

Compare with:

SOURCE_DB_SHA256_BEFORE

Require:

SOURCE_DB_INTEGRITY_AFTER:
PASS

==================================================
26. EXECUTION REVIEW
==================================================

Create:

docs/performance-executions/spike-users-me-run-002-execution-review.md

Include:

- retry authorization;
- retry reason;
- run-001 preservation;
- JMeter version remediation confirmation;
- plugin verification;
- runtime isolation;
- token preflight;
- identity preflight;
- fail-closed token preflight;
- resource-monitor status;
- JMeter execution status;
- raw JTL path/hash;
- HTML report;
- evidence inventory;
- factual sample counts;
- sensitive-value checks;
- cleanup;
- source DB integrity;
- no-silent-rerun status.

Human Review:

Status:
PENDING

Student Decision:
NOT_REVIEWED

Performance Interpretation:
NOT_PERFORMED

==================================================
27. WORKFLOW
==================================================

If run-002 execution and required evidence complete:

transition to:

EXECUTION_REVIEW_REQUIRED

If run-002 fails:

transition to the appropriate Human failure-review checkpoint.

Do NOT start Task 2.

==================================================
28. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

Audit for run-002 will be handled separately after Student Human
Execution Review.

Do not create a new audit entry now.

==================================================
29. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

==================================================
30. FINAL OUTPUT
==================================================

Return:

PRODUCTION AUTH_HEAVY SPIKE — RETRY RUN

Retry Authorization:
APPROVED

Previous Run:
run-001

Previous Run Preserved:
PASS / FAIL

Retry Run:
run-002

Retry Reason:
RETRY_AFTER_PRE_EXECUTION_ENVIRONMENT_FAILURE

JMeter Version Guard:
PASS / FAIL

Detected JMeter Version:
<actual>

Plugin Verification:
PASS / FAIL

Preflight:
PASS / FAIL

Disposable Runtime:
PASS / FAIL

Seeded Identity:
PASS / FAIL

Token Provision:
PASS / FAIL

/users/me Success Preflight:
PASS / FAIL

Fail-Closed Token Preflight:
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
<actual / NOT_COMPUTABLE>

JWT Exposed:
NO / YES / NOT_VERIFIED

Password Value Exposed:
NO / YES / NOT_VERIFIED

Reset Token Value Exposed:
NO / YES / NOT_VERIFIED

No Silent Rerun:
PASS / FAIL

Source DB Integrity After:
PASS / FAIL

Execution Review:
<path / NONE>

Performance Interpretation:
NOT_PERFORMED

Task 2:
NOT_STARTED

Workflow State:
EXECUTION_REVIEW_REQUIRED / <actual blocker>

Final Checkpoint:
EXECUTION_REVIEW_REQUIRED / <actual blocker>

Next Allowed Action:
Student Human Review of production AUTH_HEAVY / SPIKE run-002 execution evidence.

NO TASK 2.
NO AUTOMATIC RUN-003.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.