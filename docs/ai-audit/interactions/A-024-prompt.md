Resume HW05 Task 1 from:

REAL_EXECUTION_REQUIRED

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

JMeter:

D:\Tools\apache-jmeter-5.6.3

Required Plugins:

jpgc-graphs-basic=2.0
jpgc-casutg=3.1.1

==================================================
1. EXECUTION POLICY
==================================================

This interaction performs the first REAL production execution for:

AUTH_HEAVY / SPIKE

Use run identity:

run-001

Run exactly ONE measured SPIKE workload if and only if every mandatory
preflight check passes.

Do not redesign the workload.

Do not modify the approved JMX or CSV.

No silent rerun.

If run-001 fails:

preserve it and stop for Student Human Review.

Do NOT automatically create run-002.

==================================================
2. RESULT DIRECTORY
==================================================

Use:

results/23127107_Spike_20260816/run-001/

Expected structure:

raw/
html/
evidence/

Before execution, check whether run-001 already contains real execution
evidence.

If it does:

STOP.

Return:

RUN_ID_COLLISION

Do not overwrite existing evidence.

==================================================
3. VERIFY APPROVED ARTIFACT INTEGRITY
==================================================

Before runtime setup verify:

test-plans/23127107_Spike_20260816.jmx

test-data/auth-heavy-users-me.csv

exist and match the Human-approved plan/data.

Expected CSV:

expected_user_id,expected_email,expected_name,auth_case,iteration_key
2,test@eshop.com,Test User,authenticated_success,auth-users-me-success-001

Do not change:

CSV_MODE:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

==================================================
4. VERIFY JMETER DEPENDENCIES
==================================================

Verify local JMeter:

5.6.3

Verify:

jpgc-graphs-basic=2.0

Listener:

jp@gc - Response Times Over Time

Verify:

jpgc-casutg=3.1.1

Ultimate Thread Group must remain loadable.

If required plugin/class resolution fails:

STOP BEFORE JMETER.

Classification:

ENVIRONMENT_FAILURE

==================================================
5. SOURCE DATABASE INTEGRITY — BEFORE
==================================================

Calculate SHA-256 of:

backend/database.sqlite

Record:

SOURCE_DB_SHA256_BEFORE:
<actual>

The production source DB must not be used as mutable execution state.

==================================================
6. CREATE FRESH DISPOSABLE RUNTIME
==================================================

Use the already approved:

DISPOSABLE_BACKEND_RUNTIME_COPY

strategy.

Create a fresh copied backend runtime outside the repository or in the
approved disposable location.

Do not reuse:

- READ_HEAVY runtime;
- previous AUTH_HEAVY data-verification runtime;
- tmp diagnostic state.

Verify runtime database path is NOT:

backend/database.sqlite

If isolation cannot be proven:

STOP.

Do not run JMeter.

==================================================
7. START ISOLATED BACKEND
==================================================

Start the copied backend.

Wait until initialization completes.

Verify seeded authenticated identity exists:

id:
2

name:
Test User

email:
test@eshop.com

Do not persist password or other credentials in execution evidence.

==================================================
8. TEMPORARY TOKEN PROVISION
==================================================

Perform setup-only authentication against the disposable backend.

Token generation/login is NOT measured SPIKE traffic.

Obtain a temporary JWT.

Do not print it.

Do not store it in:

Git
CSV
JMX
audit
execution review
stdout/stderr

Create a temporary external JMeter properties file containing:

hw05.auth_token=<secret>

Apply restrictive file permissions where supported.

==================================================
9. SUCCESS-PATH IDENTITY PREFLIGHT
==================================================

Using the temporary token call:

GET /api/users/me

Require:

HTTP 200

response.id == 2

response.email == test@eshop.com

response.name == Test User

Do NOT save the complete response body.

The current implementation may expose fields such as:

password
reset_token

Do not record their values anywhere.

Evidence should contain only required non-sensitive verification facts.

==================================================
10. FAIL-CLOSED TOKEN PREFLIGHT
==================================================

R-001 requires missing/blank token behavior to be verified before real
execution.

Perform this OUTSIDE measured traffic.

Verify a request without a valid token does NOT succeed.

Expected current behavior:

missing token -> 401

or the exact source-backed fail-closed behavior.

Record only:

FAIL_CLOSED_TOKEN_CHECK:
PASS / FAIL

Do not include the failed request in SPIKE measurements.

If fail-closed behavior is unexpectedly broken:

STOP.

Do not run JMeter.

==================================================
11. SOURCE DB INTEGRITY — BEFORE JMETER
==================================================

Recalculate SHA-256 of:

backend/database.sqlite

Require equality with:

SOURCE_DB_SHA256_BEFORE

If changed:

STOP.

Classification:

DATA_STATE_FAILURE

JMeter:
NOT_RUN

==================================================
12. RESOURCE MONITOR
==================================================

Reuse the proven resource-monitor implementation from the successful
READ_HEAVY execution if compatible.

Inspect it before use.

Do not reintroduce the previously fixed Windows CIM permission failure.

If a scenario-specific wrapper is required, create execution tooling under:

scripts/performance/

with clear AUTH_HEAVY / SPIKE naming.

Application source must not be modified.

Before JMeter starts require:

- backend PID resolved;
- monitor process started;
- monitor remains alive;
- output artifact exists;
- at least one valid sample is captured;
- no fatal monitor stderr.

If monitor initialization fails:

STOP BEFORE JMETER.

Classification:

EVIDENCE_FAILURE

==================================================
13. EXECUTION METADATA
==================================================

Before measured execution record non-secret metadata including:

Run:
run-001

Scenario:
SPIKE

Group:
AUTH_HEAVY

Endpoint:
GET /api/users/me

JMX path

CSV path

backend PID

monitor PID

JMeter version

plugin versions

execution timestamp

source DB integrity result

preflight result

Do not record JWT.

==================================================
14. EXECUTE EXACT APPROVED SPIKE
==================================================

Only if all mandatory preflight checks PASS.

Run exactly:

test-plans/23127107_Spike_20260816.jmx

with:

test-data/auth-heavy-users-me.csv

and external:

hw05.auth_token

Approved aggregate profile:

Baseline:
5 VUs for 20 seconds

Spike:
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

Run exactly once.

==================================================
15. RAW JTL
==================================================

Write immutable raw JTL to:

results/23127107_Spike_20260816/run-001/raw/23127107_Spike_20260816_run-001.jtl

After execution calculate:

SHA-256

Record:

RAW_JTL_SHA256:
<actual>

Do not:

- normalize;
- rewrite;
- sort;
- sanitize;
- manually edit

the raw JTL.

If sensitive response bodies are being persisted unexpectedly:

preserve evidence safely,
stop,
and report:

SENSITIVE_EVIDENCE_RISK

Do not silently alter historical evidence.

==================================================
16. HTML REPORT
==================================================

Generate JMeter HTML dashboard from the SAME raw JTL.

Expected:

results/23127107_Spike_20260816/run-001/html/index.html

Do not execute another SPIKE workload merely to create HTML.

Verify the dashboard is readable.

==================================================
17. RESPONSE TIME GRAPH EVIDENCE
==================================================

The approved primary Listener is:

jp@gc - Response Times Over Time

Preserve the JMX configuration proving the Listener is present.

If the execution workflow/export mechanism produces a response-time graph
artifact without requiring a second workload, preserve it as supporting
evidence.

Do not run another workload merely to obtain a screenshot/graph.

Do not fabricate Listener output.

==================================================
18. RESOURCE EVIDENCE
==================================================

Preserve actual run evidence under:

results/23127107_Spike_20260816/run-001/evidence/

Include where actually produced:

preflight.json
postflight.json
execution-start.json
execution-metadata.json
hardware-context.json
resource-monitor.csv
resource-summary.json
backend.pid
resource-monitor.pid
jmeter stdout/stderr
backend stdout/stderr
monitor stdout/stderr

Use actual filenames if existing tooling differs.

Do not fabricate missing evidence.

==================================================
19. EXECUTION FACTS
==================================================

From real evidence compute factual values only:

Total Samples
Successful Samples
Failed Samples
actual execution/orchestration duration
JMeter exit status

Do NOT yet interpret:

p50
p90
p95
p99
throughput quality
capacity
SLA
bottleneck
regression
production readiness

Those belong to Task 2.

==================================================
20. SENSITIVE RESPONSE SAFETY REVIEW
==================================================

Because current `/api/users/me` implementation uses `SELECT *`, inspect
execution configuration/evidence for accidental exposure of sensitive
values.

Do not persist full response bodies.

Verify:

PASSWORD_VALUE_EXPOSED:
NO

RESET_TOKEN_VALUE_EXPOSED:
NO

JWT_EXPOSED:
NO

If any sensitive value appears in an artifact intended for Git:

STOP.

Report exact artifact path without echoing the secret value.

==================================================
21. FAILURE RULE
==================================================

If run-001 fails at any stage, preserve all evidence.

Classify accurately:

ENVIRONMENT_FAILURE
DATA_STATE_FAILURE
EVIDENCE_FAILURE
JMETER_FAILURE
SUT_FAILURE
SENSITIVE_EVIDENCE_RISK

Do NOT automatically rerun.

Do NOT create run-002.

Return to Student Human Review.

==================================================
22. CLEANUP
==================================================

After execution/evidence capture:

- stop resource monitor;
- stop disposable backend;
- remove temporary token properties file;
- remove secret material;
- delete disposable runtime according to approved strategy.

Do not delete:

results/23127107_Spike_20260816/run-001/

==================================================
23. SOURCE DB INTEGRITY — AFTER CLEANUP
==================================================

Recalculate:

backend/database.sqlite

SHA-256.

Compare against:

SOURCE_DB_SHA256_BEFORE

Require:

SOURCE_DB_INTEGRITY_AFTER:
PASS

==================================================
24. EXECUTION REVIEW ARTIFACT
==================================================

Create:

docs/performance-executions/spike-users-me-run-001-execution-review.md

Include:

- run identity;
- approved JMX/CSV;
- dependency verification;
- disposable runtime result;
- successful identity preflight;
- fail-closed token preflight;
- resource-monitor result;
- JMeter execution result;
- raw JTL path/hash;
- HTML path;
- evidence inventory;
- factual sample counts;
- sensitive-value exposure checks;
- cleanup result;
- source DB integrity;
- no-silent-rerun statement.

Human Review section:

Status:
PENDING

Student Decision:
NOT_REVIEWED

Performance Interpretation:
NOT_PERFORMED

==================================================
25. WORKFLOW
==================================================

If the real execution completes and required evidence is present:

transition:

REAL_EXECUTION_REQUIRED

to:

EXECUTION_REVIEW_REQUIRED

If execution fails:

transition to the appropriate Human failure-review checkpoint.

Do not start Task 2.

==================================================
26. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

The production SPIKE execution will receive its dedicated audit handling
after Student Human Execution Review.

Do not create/update an audit entry now.

==================================================
27. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

Wait for Student Human Execution Review.

==================================================
28. FINAL OUTPUT
==================================================

Return:

PRODUCTION AUTH_HEAVY SPIKE — RUN-001

Run:
run-001

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

Plugin Verification:
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
Student Human Review of production AUTH_HEAVY / SPIKE run-001 execution evidence.

NO TASK 2 ANALYSIS.
NO AUTOMATIC RERUN.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.