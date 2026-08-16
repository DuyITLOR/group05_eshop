Resume HW05 Task 1 at:

TEST_DATA_REVIEW_REQUIRED

Production Scenario:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Listener:

Response Time Graph

Approved Design:

docs/performance-design/spike-users-me-design.md

Data Candidate Review:

docs/test-data-reviews/spike-users-me-data-candidates.md

==================================================
1. STUDENT DATA DECISION
==================================================

Student Data Decision:

APPROVE_DATA

Approval Scope:

AUTH_HEAVY_SPIKE_DATASET

Candidate Rows:

1

CSV Strategy:

TRACEABILITY_ONLY

DATA_DRIVEN_FIT:

RISK_ACCEPTED

Student Notes:

- The verified candidate identity is accepted as source/runtime-backed.
- The dedicated CSV is intentionally assertion/traceability-driven because
  `GET /api/users/me` has no business request path/query/body input.
- JWT must remain outside the CSV through temporary external property
  `hw05.auth_token`.
- The approved CSV must not contain credentials, JWT, password,
  reset_token or other sensitive values.
- `DATA_DRIVEN_FIT: RISK` remains documented and is not silently upgraded
  to REQUEST_DRIVEN.
- Current implementation exposing sensitive user field names through
  `SELECT *` remains an IMPLEMENTATION_SPEC_CONFLICT and is not treated as
  a performance-plan requirement.

==================================================
2. FINALIZE DATA HUMAN REVIEW
==================================================

Update:

docs/test-data-reviews/spike-users-me-data-candidates.md

Student Human Review section.

Set:

Status:
FINALIZED

Student Data Decision:
APPROVE_DATA

Approval Scope:
AUTH_HEAVY_SPIKE_DATASET

Candidate Rows:
1

CSV Strategy:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

Final CSV:
APPROVED_FOR_CREATION

Do not remove:

DATA_DRIVEN_FIT: RISK

or existing:

IMPLEMENTATION_SPEC_CONFLICT

items.

==================================================
3. CREATE FINAL CSV
==================================================

Create exactly:

test-data/auth-heavy-users-me.csv

Header:

expected_user_id,expected_email,expected_name,auth_case,iteration_key

Create exactly one primary measured row:

2,test@eshop.com,Test User,authenticated_success,auth-users-me-success-001

Requirements:

- UTF-8
- comma delimiter
- exactly one header
- exactly one data row
- no JWT
- no password
- no reset_token
- no credential
- no hidden test data

Column semantics:

expected_user_id:
ASSERTION_DRIVEN

expected_email:
ASSERTION_DRIVEN

expected_name:
ASSERTION_DRIVEN

auth_case:
TRACE_ONLY

iteration_key:
TRACE_ONLY

REQUEST_DRIVEN columns:
NONE

==================================================
4. GENERATE JMETER PLAN
==================================================

Invoke:

$jmeter-plan-builder

Generate production AUTH_HEAVY / SPIKE JMeter plan.

Required filename:

test-plans/23127107_Spike_20260816.jmx

Use current execution/design date:

2026-08-16

Do not use the previous LOAD date.

==================================================
5. SPIKE PROFILE
==================================================

Preserve the Human-approved profile exactly:

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

Scenario classification:

SPIKE

Do not convert it into:

LOAD
STRESS

or gradual capacity progression.

==================================================
6. JMETER THREAD MODEL
==================================================

Implement the approved aggregate concurrency profile using the safest
JMeter structure supported by the current environment.

The resulting aggregate VU timeline must match the approved profile.

If core Thread Groups cannot represent the abrupt profile faithfully,
use an already-installed supported component only if dependency is
verified.

Do not silently introduce an unverified plugin dependency.

Document exact Thread Group/component mapping in generation summary.

==================================================
7. THINK TIME
==================================================

Use:

Uniform Random Timer

Offset:
250 ms

Random Maximum:
250 ms

Effective range:
250-500 ms

Ensure Timer scope applies to the measured `/api/users/me` sampler.

==================================================
8. HTTP REQUEST
==================================================

Measured request:

GET /api/users/me

Use current approved baseUrl/property strategy.

Do not add setup login into measured Thread Groups.

Login/token provisioning is pre-execution setup only.

==================================================
9. AUTH TOKEN HANDLING
==================================================

Measured request header:

Authorization: Bearer ${__P(hw05.auth_token,)}

Do not embed a real JWT anywhere in JMX.

Add fail-closed behavior before measured traffic if:

hw05.auth_token

is missing or blank.

Do not print the token in:

stdout
stderr
Assertion messages
JMeter variables dump
evidence
audit

==================================================
10. CSV DATA CONFIG
==================================================

Bind:

test-data/auth-heavy-users-me.csv

Use exact columns:

expected_user_id
expected_email
expected_name
auth_case
iteration_key

The CSV does NOT drive URL/header/body.

It drives:

Assertions
Traceability

Preserve:

CSV_MODE:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

Configure safe repeated use for the single successful identity.

Document:

recycle
stopThread
sharing mode

and rationale.

==================================================
11. ASSERTIONS
==================================================

Create meaningful assertions for every measured sample.

Require:

HTTP response code == 200

valid JSON object

response.id == expected_user_id

response.email == expected_email

response.name == expected_name

response must not contain a top-level error condition indicating request
failure.

401:
FAIL

403:
FAIL

5xx:
FAIL

Do NOT assert sensitive response values.

Do NOT persist or print:

password
reset_token

Even though current implementation returns those field names.

==================================================
12. SECURITY / IMPLEMENTATION CONFLICT
==================================================

Preserve explicitly:

IMPLEMENTATION_SPEC_CONFLICT

Current handler returns the full selected user object and runtime
verification observed field names including:

password
reset_token

The performance plan must not store those sensitive values in:

CSV
logs
Assertion failure text
reports
audit

Do not attempt to fix application source in this interaction.

==================================================
13. LISTENER
==================================================

Use exactly the approved primary Listener:

Response Time Graph

Do not add:

Summary Report
Aggregate Report
View Results Tree

to the production SPIKE plan unless a non-primary listener is technically
required and explicitly justified.

Preserve project mapping:

READ_HEAVY / LOAD:
Summary Report

AUTH_HEAVY / SPIKE:
Response Time Graph

TRANSACTIONAL / STRESS:
Aggregate Report

==================================================
14. EXECUTION EVIDENCE PREPARATION
==================================================

Prepare the plan so later execution can reuse the proven production
evidence strategy from LOAD:

- disposable runtime;
- setup-only token provision;
- `/api/users/me` preflight;
- source DB integrity;
- resource monitor;
- backend PID;
- execution metadata;
- JMeter logs;
- raw JTL;
- HTML dashboard;
- cleanup.

Do NOT execute these steps now.

==================================================
15. GENERATION SUMMARY
==================================================

Create:

docs/jmeter-generation/23127107-spike-generation-summary.md

Document at minimum:

- scenario identity;
- approved profile;
- exact JMeter component mapping;
- Timer;
- CSV mapping;
- auth externalization;
- Assertions;
- Listener;
- plugin/dependency status;
- DATA_DRIVEN_FIT risk;
- implementation/spec conflict;
- secret handling;
- execution prerequisites.

==================================================
16. AI STATIC PLAN REVIEW
==================================================

After JMX generation invoke:

$perf-plan-reviewer

Review:

docs/performance-design/spike-users-me-design.md
docs/test-data-reviews/spike-users-me-data-candidates.md
test-data/auth-heavy-users-me.csv
test-plans/23127107_Spike_20260816.jmx
docs/jmeter-generation/23127107-spike-generation-summary.md

Inspect current relevant application/source documentation where needed.

==================================================
17. PLAN REVIEW CHECKS
==================================================

The reviewer must verify at minimum:

- filename convention;
- XML/hashTree structure;
- enabled components;
- aggregate SPIKE profile fidelity;
- total scheduled window;
- Think Time;
- endpoint/method;
- CSV schema and binding;
- DATA_DRIVEN_FIT disclosure;
- token externalization;
- fail-closed missing-token behavior;
- Assertions;
- sensitive field handling;
- Response Time Graph Listener;
- plugin/dependency availability;
- source/runtime assumptions;
- implementation/spec conflict preservation;
- HW05 scenario/listener mapping.

==================================================
18. REVIEW ARTIFACT
==================================================

Create:

docs/performance-reviews/spike-users-me-jmeter-ai-review.md

Include:

Critical
High
Medium
Low
Info

and:

Execution Readiness

Do not self-approve.

Student Human Review must remain required.

==================================================
19. WORKFLOW
==================================================

If generation and static review complete:

update:

docs/workflow/hw05-performance-workflow-status.md

to the canonical equivalent of:

HUMAN_PLAN_REVIEW_REQUIRED

Do not execute JMeter.

==================================================
20. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

The Human-approved design/data work and JMeter generation/review will be
audited in dedicated audit interactions separately.

==================================================
21. TASK BOUNDARY
==================================================

Do NOT start:

Task 2

Do NOT analyze the previous LOAD JTL.

We are finishing Task 1 first.

==================================================
22. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

==================================================
23. FINAL OUTPUT
==================================================

Return:

AUTH_HEAVY SPIKE — DATA APPROVAL + JMETER GENERATION

Data Decision:
APPROVE_DATA

Approval Scope:
AUTH_HEAVY_SPIKE_DATASET

Final CSV:
test-data/auth-heavy-users-me.csv

CSV Rows:
1

CSV Status:
PASS / FAIL

CSV Mode:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

JMX:
test-plans/23127107_Spike_20260816.jmx

JMX Generation:
PASS / FAIL

Filename:
PASS / FAIL

SPIKE Profile:
PASS / FAIL

Think Time:
PASS / FAIL

Authentication:
PASS / FAIL

Auth Secret Externalized:
PASS / FAIL

Assertions:
PASS / FAIL

Sensitive Value Exposure:
PASS / FAIL

Listener:
Response Time Graph

Generation Summary:
docs/jmeter-generation/23127107-spike-generation-summary.md

Plan Review:
docs/performance-reviews/spike-users-me-jmeter-ai-review.md

Critical:
<number>

High:
<number>

Medium:
<number>

Low:
<number>

Info:
<number>

Execution Readiness:
<actual>

Workflow State:
HUMAN_PLAN_REVIEW_REQUIRED / <actual blocker>

Next Allowed Action:
Student Human Review of AUTH_HEAVY / SPIKE JMeter plan.

NO JMETER.
NO JTL.
NO TASK 2.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.