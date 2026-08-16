Resume HW05 Task 1 at:

RETRY_REVIEW_REQUIRED

Production Scenario:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Failed Attempt:

results/23127107_Spike_20260816/run-002/

Run Classification:

FAILED_PRE_EXECUTION_ATTEMPT

Failure Classification:

EVIDENCE_FAILURE

Observed Failure:

The resource monitor successfully wrote at least one sample, but the
execution wrapper failed while parsing/validating the resource-monitor
CSV before JMeter execution.

JMeter Workload Executed:

NO

Raw JTL:

NONE

HTML Report:

NONE

Performance Result:

NONE

No Silent Rerun:

PASS

==================================================
1. PRESERVE RUN-002
==================================================

Treat:

results/23127107_Spike_20260816/run-002/

as immutable failed pre-execution evidence.

Do NOT:

- delete it;
- overwrite it;
- rename it;
- create JTL/HTML retroactively;
- reinterpret it as successful performance execution;
- reuse run-002 for another attempt.

Preserve:

Run:
run-002

Classification:
FAILED_PRE_EXECUTION_ATTEMPT

Failure:
EVIDENCE_FAILURE

JMeter Executed:
NO

Performance Result:
NONE

==================================================
2. READ ACTUAL FAILURE EVIDENCE
==================================================

Read fully:

docs/performance-executions/spike-users-me-run-002-execution-review.md

scripts/performance/auth-heavy-spike-execute.js

Also inspect all actual files under:

results/23127107_Spike_20260816/run-002/evidence/

Pay particular attention to:

resource-monitor CSV
resource-monitor stdout/stderr
execution metadata
preflight/postflight
any parser/validation logs

Do not infer root cause only from the summary.

==================================================
3. INSPECT THE ACTUAL MONITOR CSV
==================================================

Inspect the exact resource-monitor output file produced by run-002.

Determine:

- exact filename;
- encoding;
- delimiter;
- header names;
- column order;
- number of rows;
- quoting behavior;
- line endings;
- first valid data row;
- whether PowerShell emitted type/meta/header lines;
- whether locale-specific formatting affects numbers;
- whether empty/null fields exist;
- whether trailing newline/BOM exists.

Do NOT modify the historical run-002 CSV.

Record factual schema:

RESOURCE_CSV_HEADER:
<actual>

RESOURCE_CSV_ROWS:
<actual>

RESOURCE_CSV_ENCODING:
<actual>

==================================================
4. INSPECT PARSER IMPLEMENTATION
==================================================

Locate the exact parser/validation logic in:

scripts/performance/auth-heavy-spike-execute.js

Determine what it expected versus what the monitor actually produced.

Check specifically for:

- hard-coded delimiter assumptions;
- exact header/string matching;
- BOM handling;
- CRLF handling;
- blank-line handling;
- CSV quoting;
- PowerShell CSV format assumptions;
- number parsing;
- timestamp parsing;
- locale decimal separator;
- column renaming;
- object/property casing;
- parser library behavior;
- minimum-row/sample validation;
- asynchronous file flush/timing;
- reading the CSV before the first sample was fully flushed.

Do not assume any one cause without evidence.

==================================================
5. ROOT CAUSE
==================================================

Classify the actual root cause using an evidence-backed category such as:

CSV_SCHEMA_MISMATCH
CSV_HEADER_PARSE_FAILURE
CSV_ENCODING_FAILURE
CSV_BOM_FAILURE
CSV_DELIMITER_FAILURE
CSV_QUOTING_FAILURE
CSV_FLUSH_TIMING_FAILURE
CSV_NUMBER_PARSE_FAILURE
PARSER_IMPLEMENTATION_DEFECT
OTHER_EVIDENCE_PARSER_FAILURE

Return:

ROOT_CAUSE_CATEGORY:
<actual>

ROOT_CAUSE:
<specific explanation>

EXPECTED_FORMAT:
<actual parser expectation>

ACTUAL_FORMAT:
<actual monitor output>

ROOT_CAUSE_EVIDENCE:
<file/code/log evidence>

==================================================
6. CHECK APPROVED ARTIFACT IMPACT
==================================================

Determine whether this failure requires changes to:

test-plans/23127107_Spike_20260816.jmx
test-data/auth-heavy-users-me.csv
docs/performance-design/spike-users-me-design.md

Expected unless evidence proves otherwise:

JMX_CHANGE_REQUIRED:
NO

CSV_TEST_DATA_CHANGE_REQUIRED:
NO

DESIGN_CHANGE_REQUIRED:
NO

This blocker is expected to belong only to execution/evidence tooling.

Do not modify approved JMX/CSV/design merely to bypass the parser.

==================================================
7. MINIMAL REMEDIATION
==================================================

If root cause is confirmed, implement the smallest safe correction.

Preferred scope:

scripts/performance/auth-heavy-spike-execute.js

Only modify:

resource-monitor parser/validation logic

or another execution helper if evidence proves that is required.

Do NOT modify:

backend/server.js
backend/database.js
approved SPIKE JMX
approved AUTH_HEAVY CSV
approved workload
approved Listener
approved Timer

Do not weaken validation into unconditional success.

The evidence guard must continue to fail closed when monitor evidence is
actually malformed or missing.

==================================================
8. PARSER DIAGNOSTIC USING PRESERVED COPY
==================================================

After remediation, validate the parser against a COPY of the existing
run-002 resource-monitor CSV or a diagnostic fixture derived from its
non-sensitive structure.

Do NOT alter historical run-002 evidence.

Classification:

DIAGNOSTIC_ONLY

Verify that the corrected parser can:

- detect the header;
- parse the first valid sample;
- read expected CPU/memory/process/timestamp fields where present;
- reject malformed input;
- distinguish empty/no-sample evidence from valid evidence.

Do NOT run JMeter.

==================================================
9. OPTIONAL MONITOR + PARSER PIPELINE CHECK
==================================================

If necessary to prove the fix end-to-end, perform a short diagnostic-only
resource monitor run against a harmless process or disposable backend.

Allowed:

- start monitor;
- collect a few samples;
- stop monitor;
- parse the generated CSV;
- verify continuity/schema.

Do NOT:

- provision measured SPIKE workload;
- execute JMX;
- create JTL;
- create HTML report.

Store diagnostic output outside production run directories, for example:

tmp/hw05-spike-monitor-parser-diagnostic-<id>/

Classification:

DIAGNOSTIC_ONLY

==================================================
10. UPDATE RUN-002 REVIEW
==================================================

Update:

docs/performance-executions/spike-users-me-run-002-execution-review.md

Preserve historical facts:

Run:
run-002

JMeter Executed:
NO

Raw JTL:
NONE

HTML:
NONE

Performance Result:
NONE

Failure Classification:
EVIDENCE_FAILURE

No Silent Rerun:
PASS

Add:

Root Cause
Parser Remediation
Diagnostic Validation

If remediation and diagnostic validation PASS, record:

Student Decision:
MODIFIED_AND_APPROVED

Decision Scope:
AUTH_HEAVY_SPIKE_RUN_002_EVIDENCE_PARSER_REMEDIATION

Important:

This approves the remediation only.

It does NOT approve run-002 as a successful performance execution.

==================================================
11. RETRY POLICY
==================================================

If all are true:

ROOT_CAUSE_CONFIRMED:
YES

PARSER_REMEDIATION:
PASS

PARSER_DIAGNOSTIC:
PASS

MONITOR_PARSER_PIPELINE:
PASS or NOT_REQUIRED_WITH_JUSTIFICATION

then recommend:

New Run Identity:
run-003

Retry Reason:

RETRY_AFTER_PRE_EXECUTION_EVIDENCE_PARSER_FAILURE

Do NOT execute run-003 in this interaction.

Do NOT automatically create production run-003 evidence.

==================================================
12. WORKFLOW
==================================================

If remediation validation succeeds:

Workflow State:

REAL_EXECUTION_REQUIRED

with:

RETRY_AUTHORIZATION_REQUIRED

Final Checkpoint:

RETRY_REVIEW_REQUIRED

Next Allowed Action:

Student authorize/reject exactly one new production SPIKE attempt using
run-003.

If remediation is not proven:

remain at:

RETRY_REVIEW_REQUIRED

==================================================
13. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

Audit for run-002 failure/remediation will be handled separately after
Student review.

Do not create a new audit entry now.

==================================================
14. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

==================================================
15. FINAL OUTPUT
==================================================

Return:

AUTH_HEAVY SPIKE — RUN-002 EVIDENCE FAILURE TRIAGE

Run:
run-002

Run Classification:
FAILED_PRE_EXECUTION_ATTEMPT

Failure Classification:
EVIDENCE_FAILURE

JMeter Workload Executed:
NO

Performance Result:
NONE

Resource Monitor Produced Sample:
YES / NO

Resource CSV:
<path>

Resource CSV Rows:
<actual>

Root Cause Category:
<actual>

Root Cause:
<actual>

Expected Format:
<actual>

Actual Format:
<actual>

JMX Change Required:
YES / NO

Test Data CSV Change Required:
YES / NO

Design Change Required:
YES / NO

Execution Tooling Change Required:
YES / NO

Files Modified:
<actual>

Parser Remediation:
PASS / FAIL / NOT_IMPLEMENTED

Parser Diagnostic:
PASS / FAIL / NOT_RUN

Monitor-Parser Pipeline Diagnostic:
PASS / FAIL / NOT_REQUIRED / NOT_RUN

run-002 Preserved:
PASS / FAIL

No Silent Rerun:
PASS / FAIL

New Run Identity Recommended:
run-003 / NONE

Retry Reason:
RETRY_AFTER_PRE_EXECUTION_EVIDENCE_PARSER_FAILURE / NONE

Student Decision:
MODIFIED_AND_APPROVED / NOT_YET_APPROVED

Workflow State:
<actual>

Final Checkpoint:
RETRY_REVIEW_REQUIRED

Next Allowed Action:
Student review remediation and authorize/reject one new SPIKE attempt.

NO JMETER WORKLOAD.
NO JTL.
NO TASK 2.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.