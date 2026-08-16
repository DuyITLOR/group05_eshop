Resume HW05 production READ_HEAVY / LOAD workflow at:

EVIDENCE_FAILURE_REVIEW_REQUIRED

Current workflow:

REAL_EXECUTION_REQUIRED
BLOCKED:
EVIDENCE_FAILURE

Failed attempt:

results/23127107_Load_20260812/run-001/

Run classification:

FAILED_PRE_EXECUTION_ATTEMPT

IMPORTANT:

JMeter was NOT run.
No raw JTL exists.
No HTML dashboard exists.
No performance result exists.

Do NOT rerun the Load test in this interaction.

==================================================
1. PRESERVE RUN-001
==================================================

Treat:

results/23127107_Load_20260812/run-001/

as immutable failed pre-execution evidence.

Do not:

- delete it;
- overwrite it;
- rename it into a successful run;
- generate fake JTL/HTML;
- replace its stderr evidence.

Preserve:

resource-monitor-stderr.log

and all other attempt evidence.

==================================================
2. READ FAILURE EVIDENCE
==================================================

Read fully:

docs/performance-executions/load-order-detail-run-001-execution-review.md

results/23127107_Load_20260812/run-001/evidence/resource-monitor-stderr.log

Also inspect the scripts used by this attempt:

scripts/performance/load-order-detail-execute.js

scripts/performance/monitor-load-resources.ps1

scripts/performance/run-approved-load-jmeter.ps1

and any launcher/helper invoked by them.

Do not infer root cause only from the workflow summary.

==================================================
3. RECONSTRUCT FAILURE SEQUENCE
==================================================

Produce exact sequence:

1. disposable runtime creation
2. fixture insertion
3. token provisioning
4. /users/me verification
5. order smoke verification
6. source DB integrity check
7. monitor startup attempt
8. monitor failure
9. JMeter prevented from starting
10. cleanup

For each step:

PASS / FAIL / NOT_REACHED

Use evidence.

==================================================
4. CLASSIFY ROOT CAUSE
==================================================

Determine the actual cause of resource-monitor failure.

Possible categories include, but are not limited to:

MONITOR_SCRIPT_DEFECT
POWERSHELL_EXECUTION_FAILURE
PROCESS_PID_RESOLUTION_FAILURE
PERMISSION_FAILURE
COMMAND_NOT_FOUND
OUTPUT_PATH_FAILURE
PROCESS_EXITED_EARLY
ENVIRONMENT_CONFIGURATION_FAILURE
OTHER_EVIDENCE_FAILURE

Do not select a category without evidence.

Return:

ROOT_CAUSE_CATEGORY:
<actual>

ROOT_CAUSE:
<specific explanation>

ROOT_CAUSE_EVIDENCE:
<file / line / stderr content>

==================================================
5. DETERMINE WHETHER PERFORMANCE ARTIFACTS ARE INVALID
==================================================

Check whether this failure requires changing:

test-plans/23127107_Load_20260812.jmx
test-data/read-heavy-orders.csv
docs/performance-design/load-order-detail-design.md

Expected unless evidence proves otherwise:

JMX_CHANGE_REQUIRED:
NO

CSV_CHANGE_REQUIRED:
NO

DESIGN_CHANGE_REQUIRED:
NO

This is expected to be an execution-evidence tooling issue,
not a workload-design issue.

Do not modify approved JMX/CSV just to solve monitor failure.

==================================================
6. REVIEW RESOURCE MONITOR IMPLEMENTATION
==================================================

Inspect:

scripts/performance/monitor-load-resources.ps1

Check:

- parameter binding;
- PID argument;
- process lookup;
- PowerShell syntax;
- output file handling;
- directory existence;
- sampling interval;
- timestamp generation;
- CPU calculation;
- memory calculation;
- process termination behavior;
- error handling;
- exit code;
- Windows compatibility.

If another script launches it, inspect exact invocation and quoting.

Pay special attention to:

paths containing spaces

because repository/runtime path contains Windows directories that may
require correct PowerShell/process quoting.

Do not assume this is the issue unless evidence supports it.

==================================================
7. PROPOSE MINIMAL REMEDIATION
==================================================

If root cause is understood, propose the smallest safe fix.

Allowed remediation scope:

execution/resource-monitor tooling only.

Prefer changing only:

scripts/performance/monitor-load-resources.ps1

and/or:

scripts/performance/load-order-detail-execute.js
scripts/performance/run-approved-load-jmeter.ps1

if required.

Do not change:

backend/server.js
backend/database.js
approved JMX
approved CSV
approved workload
fixture values

unless the actual root cause proves they are involved.

==================================================
8. NO REAL LOAD RERUN YET
==================================================

Do NOT run:

test-plans/23127107_Load_20260812.jmx

in this interaction.

Do not create:

run-002

yet.

Human must review the remediation first.

==================================================
9. SAFE MONITOR-ONLY VALIDATION
==================================================

After implementing the minimal monitor fix, you MAY perform a
MONITOR-ONLY validation if it does not execute JMeter.

This validation may:

- start/reuse a harmless disposable backend process;
- start the resource monitor;
- collect a few samples;
- stop the monitor;
- verify CSV structure/output.

It must NOT:

- execute the Load JMX;
- create performance JTL;
- be represented as production performance evidence.

Classify any monitor-only output:

DIAGNOSTIC_ONLY

Do not place it in the successful production run directory.

Use a temp/diagnostic path.

==================================================
10. REMEDIATION RESULT
==================================================

Return:

MONITOR_REMEDIATION:
PASS / FAIL / NOT_IMPLEMENTED

MONITOR_ONLY_VALIDATION:
PASS / FAIL / NOT_RUN

If PASS:

the next real attempt must use a NEW run identity.

Do NOT overwrite run-001.

Recommended:

run-002

with documented reason:

RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE

==================================================
11. UPDATE EXECUTION REVIEW
==================================================

Update:

docs/performance-executions/load-order-detail-run-001-execution-review.md

Human Review section:

Student Decision:
MODIFIED_AND_APPROVED

only if the root cause/remediation is fully supported.

Record:

Run-001:
PRESERVED_FAILED_PRE_EXECUTION_ATTEMPT

Failure Classification:
EVIDENCE_FAILURE

JMeter Executed:
NO

Performance Evidence:
NONE

Rerun Required:
YES

Rerun Authorization:
PENDING until remediation validation PASS

If remediation is not proven:

Student Decision:
NOT_YET_APPROVED

and stop.

==================================================
12. WORKFLOW
==================================================

If root cause is fixed and monitor-only validation PASS:

Workflow State:

REAL_EXECUTION_REQUIRED

with:

RETRY_AUTHORIZATION_REQUIRED

or exact canonical equivalent supported by workflow.

Next Allowed Action:

Student approval for one new real Load attempt using run-002.

Do not perform the new run here.

==================================================
13. AUDIT
==================================================

Do not finalize A-017 automatically before Human Review evidence exists.

This interaction itself is substantive HW05 execution remediation and
may be audited according to current audit scope.

If a new audit entry is created for remediation:

keep:

Review Status:
PENDING_HUMAN_REVIEW

Do not audit Agent Skill implementation.

==================================================
14. GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

==================================================
15. FINAL OUTPUT
==================================================

Return:

READ_HEAVY LOAD — RUN-001 FAILURE TRIAGE

Run:
run-001

Run Classification:
FAILED_PRE_EXECUTION_ATTEMPT

JMeter Executed:
NO

Performance Result:
NONE

Failure Category:
EVIDENCE_FAILURE

Root Cause Category:
<actual>

Root Cause:
<actual>

JMX Change Required:
YES / NO

CSV Change Required:
YES / NO

Design Change Required:
YES / NO

Monitor Tooling Change Required:
YES / NO

Files Modified:
<list>

Monitor Remediation:
PASS / FAIL / NOT_IMPLEMENTED

Monitor-only Validation:
PASS / FAIL / NOT_RUN

Run-001 Preserved:
PASS / FAIL

Silent Rerun:
NO

New Run Identity Recommended:
run-002 / NONE

Retry Reason:
RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE / NONE

Workflow State:
<actual>

Final Checkpoint:
RETRY_REVIEW_REQUIRED / EVIDENCE_FAILURE_REVIEW_REQUIRED

Next Allowed Action:
Student review remediation and authorize/reject a new Load execution attempt.

NO JMETER.
NO JTL.
NO PERFORMANCE ANALYSIS.
NO COMMIT.
NO PUSH.