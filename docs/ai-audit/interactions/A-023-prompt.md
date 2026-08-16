Resume HW05 Task 1 from:

BLOCKED / DEPENDENCY_MISSING

Production Scenario:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Approved Listener:

jp@gc - Response Times Over Time

Required Plugin:

jpgc-graphs-basic

Required Plugin Version:

2.0

Local JMeter:

D:\Tools\apache-jmeter-5.6.3

==================================================
1. HUMAN-RESOLVED DEPENDENCY
==================================================

The Student manually installed the required JMeter plugin outside the
previous restricted agent network environment.

Verified local command:

PluginsManagerCMD.bat status

reported:

jpgc-graphs-basic=2.0

Existing relevant plugins also include:

jpgc-casutg=3.1.1
jpgc-plugins-manager=1.12

JMeter version:

5.6.3

Treat the previous network-install blocker as resolved only after
independently verifying the local installation.

Do NOT attempt to download/reinstall the plugin unless verification fails.

==================================================
2. VERIFY LOCAL PLUGIN
==================================================

Inspect:

D:\Tools\apache-jmeter-5.6.3

Verify:

Plugin ID:
jpgc-graphs-basic

Plugin Version:
2.0

Required Listener:

jp@gc - Response Times Over Time

Required GUI class:

kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui

Verify at minimum:

- plugin JAR exists;
- class is present/resolvable;
- JMeter 5.6.3 can load the required component;
- no relevant missing dependency is reported.

Use local static inspection/component parsing where possible.

Do NOT execute the SPIKE workload.

Return internally:

PLUGIN_STATUS:
PASS / FAIL

LISTENER_CLASS:
PASS / FAIL

If either fails:

STOP.

Keep:

JMX:
NOT_CREATED

Do not substitute another Listener.

==================================================
3. RESUME APPROVED DATA STATE
==================================================

Existing Human-approved dataset:

test-data/auth-heavy-users-me.csv

Expected exact header:

expected_user_id,expected_email,expected_name,auth_case,iteration_key

Expected exact row:

2,test@eshop.com,Test User,authenticated_success,auth-users-me-success-001

Preserve:

CSV_MODE:
TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
RISK_ACCEPTED

Do not change the CSV unless integrity verification fails.

==================================================
4. RESUME JMETER PLAN BUILDER
==================================================

If plugin verification PASS, invoke:

$jmeter-plan-builder

Generate:

test-plans/23127107_Spike_20260816.jmx

Use the already Human-approved:

docs/performance-design/spike-users-me-design.md

and:

docs/test-data-reviews/spike-users-me-data-candidates.md

Do not redo scenario/data design.

==================================================
5. SPIKE PROFILE
==================================================

Materialize exactly:

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

Scenario:

SPIKE

Ultimate Thread Group may be used because:

jpgc-casutg=3.1.1

is already installed.

Verify the resulting aggregate concurrency timeline matches the approved
profile.

Do not approximate it as a gradual Load/Stress test.

==================================================
6. THINK TIME
==================================================

Use:

Uniform Random Timer

Offset:
250 ms

Random Maximum:
250 ms

Effective range:
250-500 ms

Apply it to the measured `/api/users/me` sampler.

==================================================
7. HTTP REQUEST
==================================================

Measured request:

GET /api/users/me

Do not include setup login in measured samples.

Authentication header:

Authorization: Bearer ${__P(hw05.auth_token,)}

==================================================
8. SECRET HANDLING
==================================================

Never embed a real token.

Require fail-closed behavior if:

hw05.auth_token

is missing or blank.

Do not log or persist real JWT values in:

JMX
CSV
reports
assertion text
stdout
stderr
audit

==================================================
9. CSV CONFIG
==================================================

Bind:

test-data/auth-heavy-users-me.csv

Columns:

expected_user_id
expected_email
expected_name
auth_case
iteration_key

Use:

expected_user_id
expected_email
expected_name

for assertion values.

Use:

auth_case
iteration_key

for traceability only.

REQUEST_DRIVEN columns:

NONE

Document recycle/stopThread/sharing-mode configuration.

==================================================
10. ASSERTIONS
==================================================

Require every measured sample to satisfy:

HTTP status == 200

valid JSON object

response.id == expected_user_id

response.email == expected_email

response.name == expected_name

401:
FAIL

403:
FAIL

5xx:
FAIL

Do not assert or expose:

password
reset_token

Current implementation/specification conflict concerning sensitive user
fields must remain documented.

==================================================
11. LISTENER
==================================================

Use exactly:

jp@gc - Response Times Over Time

Semantic project mapping:

AUTH_HEAVY / SPIKE
-> Response Time Graph

Do not substitute:

Graph Results
Summary Report
Aggregate Report
View Results Tree

Do not add the LOAD/STRESS primary listeners to this plan.

==================================================
12. PLUGIN / DEPENDENCY DOCUMENTATION
==================================================

Record in generation summary:

JMeter:
5.6.3

Plugin:
jpgc-graphs-basic=2.0

Listener:
jp@gc - Response Times Over Time

Listener GUI class:
kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui

Custom Thread Groups:
jpgc-casutg=3.1.1

Previous dependency blocker:

RESOLVED_BY_STUDENT_LOCAL_INSTALLATION

No plugin installation should be represented as AI-generated assignment
evidence.

==================================================
13. GENERATION SUMMARY
==================================================

Create:

docs/jmeter-generation/23127107-spike-generation-summary.md

Include:

- dependency resolution;
- JMeter/plugin versions;
- Listener class verification;
- JMX filename;
- exact SPIKE profile mapping;
- Timer;
- CSV configuration;
- DATA_DRIVEN_FIT disclosure;
- token externalization;
- assertions;
- sensitive-field handling;
- execution prerequisites.

==================================================
14. STATIC PLAN REVIEW
==================================================

After successful generation invoke:

$perf-plan-reviewer

Review:

docs/performance-design/spike-users-me-design.md
docs/test-data-reviews/spike-users-me-data-candidates.md
test-data/auth-heavy-users-me.csv
test-plans/23127107_Spike_20260816.jmx
docs/jmeter-generation/23127107-spike-generation-summary.md

Create:

docs/performance-reviews/spike-users-me-jmeter-ai-review.md

Verify at minimum:

- filename;
- XML/hashTree integrity;
- enabled components;
- Ultimate Thread Group mapping;
- aggregate SPIKE profile;
- 68-second planned window;
- Timer 250-500ms;
- method/endpoint;
- CSV schema;
- TRACEABILITY_ONLY semantics;
- token externalization;
- fail-closed token guard;
- identity assertions;
- sensitive-value safety;
- Response Times Over Time Listener;
- plugin/class resolution;
- HW05 Listener uniqueness;
- implementation/spec conflicts.

==================================================
15. PLAN REVIEW OUTPUT
==================================================

Report:

Critical
High
Medium
Low
Info

Execution Readiness

Do not self-approve.

Human Plan Review remains mandatory.

==================================================
16. WORKFLOW
==================================================

If:

PLUGIN_STATUS == PASS
LISTENER_CLASS == PASS
JMX_GENERATION == PASS
STATIC_REVIEW == COMPLETE

transition:

BLOCKED / DEPENDENCY_MISSING

to:

HUMAN_PLAN_REVIEW_REQUIRED

or the exact canonical equivalent.

If generation/review fails:

preserve the actual blocker.

==================================================
17. EXECUTION BOUNDARY
==================================================

DO NOT run JMeter.

DO NOT create JTL.

DO NOT create performance execution results.

DO NOT start Task 2.

==================================================
18. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

Do not audit the manual plugin installation.

The completed JMX generation/static review will be handled through a
separate audit step after Student Human Plan Review.

==================================================
19. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

==================================================
20. FINAL OUTPUT
==================================================

Return:

AUTH_HEAVY SPIKE — JMETER GENERATION RESUME

Previous Blocker:
DEPENDENCY_MISSING

Plugin:
jpgc-graphs-basic

Plugin Version:
2.0

Plugin Verification:
PASS / FAIL

Listener:
jp@gc - Response Times Over Time

Listener Class Verification:
PASS / FAIL

Custom Thread Groups:
PASS / FAIL

Final CSV:
test-data/auth-heavy-users-me.csv

CSV Status:
PASS / FAIL

JMX:
test-plans/23127107_Spike_20260816.jmx / NOT_CREATED

JMX Generation:
PASS / FAIL

Filename:
PASS / FAIL

SPIKE Profile:
PASS / FAIL / NOT_MATERIALIZED

Think Time:
PASS / FAIL / NOT_MATERIALIZED

Authentication:
PASS / FAIL / NOT_MATERIALIZED

Auth Secret Externalized:
PASS / FAIL / NOT_MATERIALIZED

Assertions:
PASS / FAIL / NOT_MATERIALIZED

Sensitive Value Exposure:
PASS / FAIL

Generation Summary:
<path / NOT_CREATED>

Plan Review:
<path / BLOCKED>

Critical:
<number / N/A>

High:
<number / N/A>

Medium:
<number / N/A>

Low:
<number / N/A>

Info:
<number / N/A>

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