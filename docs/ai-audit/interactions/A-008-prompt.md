Resume the approved HW05 controlled Stress workflow.

Current State:
REAL_EXECUTION_REQUIRED

Approved plan:
test-plans/23127107_Stress_20260812.jmx

CSV:
test-data/transactional.csv

Scenario:
STRESS

Endpoint:
POST /api/apply-coupon

Student ID:
23127107

Execution plan date / filename identity:
20260812

The Human Plan Review is APPROVED.

==================================================
1. PERFORM MANDATORY READ-ONLY PREFLIGHT
==================================================

Before running JMeter, inspect the CURRENT runtime/database state.

Do not mutate data during preflight.

Verify:

Coupon:
SAVE10

Required:
- coupon exists;
- active = true / 1;
- expiry is still valid;
- min_order_amount = 300000;
- max_uses_per_user = 1.

Verify users:

user_id = 1
user_id = 2

For both:

coupon_usage for SAVE10 must remain:

usage < max_uses_per_user

Expected approved request rows:

SAVE10,500000,1
SAVE10,500000,2

Verify:

500000 > 300000

Return:

PREFLIGHT_COUPON:
PASS / FAIL

PREFLIGHT_USER_1:
PASS / FAIL

PREFLIGHT_USER_2:
PASS / FAIL

PREFLIGHT_QUOTA:
PASS / FAIL

If any required preflight check FAILS:

DO NOT RUN JMETER.

Update workflow with the actual runtime blocker and STOP.

==================================================
2. VERIFY EXECUTION ENVIRONMENT
==================================================

Before the workload:

Verify backend is running at the base URL configured by the JMX.

Verify JMeter:

5.6.3

Verify:

Custom Thread Groups / Ultimate Thread Group available.

Verify output paths do not overwrite previous raw evidence.

Do not edit the approved JMX or CSV silently.

If a configuration change is required:
STOP and return to Human Review.

==================================================
3. RESOURCE MONITORING
==================================================

Prepare backend/system resource monitoring required by HW05.

Capture at minimum during the real run:

- CPU usage;
- memory/RAM usage;
- backend/process resource behavior.

Record hardware/runtime context sufficient to interpret the run.

Do not fabricate observations.

Preserve screenshot/evidence paths.

==================================================
4. RUN THE APPROVED STRESS PLAN
==================================================

ONLY if preflight PASS.

Execute the approved JMeter plan without modifying its workload:

Target profile:

0 -> 5 VUs / 15s
hold 5 / 45s

5 -> 10 / 15s
hold 10 / 45s

10 -> 20 / 15s
hold 20 / 45s

20 -> 30 / 15s
hold 30 / 45s

30 -> 5 / 15s
hold 5 / 60s

Total:
315 seconds

Think Time:
Constant Timer 1000 ms

Do not change:
- VUs;
- duration;
- CSV;
- assertions;
- endpoint;
- listener;
- authentication behavior.

==================================================
5. RAW JTL
==================================================

Generate a RAW JTL for this execution.

Use the repository's canonical result path if one exists.

The raw JTL is immutable execution evidence.

After creation:

calculate SHA-256.

Do not edit, normalize, clean, or rewrite the JTL.

Record:

RAW_JTL:
<path>

RAW_JTL_SHA256:
<hash>

==================================================
6. HTML REPORT
==================================================

Generate the JMeter HTML dashboard from the SAME raw JTL.

Do not run a second workload merely to create the HTML report.

Record:

HTML_REPORT:
<path>

Verify the report is readable.

==================================================
7. EXECUTION EVIDENCE
==================================================

Preserve evidence for:

- JMeter execution;
- resource monitoring;
- relevant backend/runtime state;
- execution completion.

Use stable repository paths.

Do not create fake screenshots.

If screenshot capture fails:
report EVIDENCE_GAP instead of recreating a fake run.

==================================================
8. EXECUTION RESULT
==================================================

After the run, record only directly observable facts.

At minimum:

- total samples;
- successful/failed samples if computable;
- JTL path;
- HTML report path;
- execution duration;
- resource evidence paths;
- whether JMeter completed normally.

Do NOT yet perform full Task 2 AI JTL interpretation.

This step is Task 1 execution/evidence collection.

Do not claim:
- capacity;
- SLA compliance;
- acceptable p95;
- maximum stable RPS

unless separately supported later.

==================================================
9. FAILURE HANDLING
==================================================

If the execution encounters:

ENVIRONMENT_FAILURE
JMETER_FAILURE
SUT_FAILURE
DATA_STATE_FAILURE
EVIDENCE_FAILURE

preserve the original evidence.

Do not silently rerun.

Stop for Human Review and report the classification.

A rerun requires an explicit reason.

==================================================
10. WORKFLOW
==================================================

If execution completes with required raw evidence:

update workflow canonically from:

REAL_EXECUTION_REQUIRED

to the actual post-execution Human Review checkpoint.

Do NOT enter Task 2 automatically.

Expected next checkpoint should be equivalent to:

EXECUTION_REVIEW_REQUIRED

or the canonical state in the current workflow contract.

==================================================
11. AUDIT
==================================================

This is a substantive HW05 interaction.

Use $log-ai-audit according to the current audit scope.

Do not finalize audit.
Do not commit audit separately now.

==================================================
12. GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

Execution evidence must be Human-reviewed first.

==================================================
13. FINAL OUTPUT
==================================================

Return:

CONTROLLED STRESS EXECUTION

Preflight:
PASS / FAIL

Coupon:
PASS / FAIL

User 1 Quota:
PASS / FAIL

User 2 Quota:
PASS / FAIL

JMeter:
PASS / FAIL / NOT_RUN

Execution:
COMPLETE / FAILED / NOT_RUN

Raw JTL:
<path or NONE>

Raw JTL SHA-256:
<hash or NONE>

HTML Report:
<path or NONE>

Resource Evidence:
<paths or NONE>

Total Samples:
<number / NOT_COMPUTABLE>

Successful Samples:
<number / NOT_COMPUTABLE>

Failed Samples:
<number / NOT_COMPUTABLE>

Execution Evidence Completeness:
COMPLETE / PARTIAL / FAIL

Workflow State:
<actual state>

Final Checkpoint:
EXECUTION_REVIEW_REQUIRED / <actual blocker>

Next Allowed Action:
Student Human Review of the controlled Stress execution.

NO TASK 2 ANALYSIS YET.
NO SILENT RERUN.
NO COMMIT.
NO PUSH.