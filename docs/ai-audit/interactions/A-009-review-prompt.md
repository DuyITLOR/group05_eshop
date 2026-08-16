Record the Student Human Review decision for the controlled Stress
run-001 execution evidence.

Student Decision:
APPROVED

Student Decision Scope:
CONTROLLED_STRESS_EXECUTION_EVIDENCE

Student Notes:
- Raw JTL integrity and SHA-256 are accepted.
- Total samples 4191, successful 4191, failed 0 are accepted as
  execution facts only.
- HTML report and resource-monitoring evidence are accepted.
- Approved workload traceability is accepted.
- No silent rerun occurred.
- This approval confirms execution/evidence integrity only.
- No SLA, capacity, p95, throughput-quality, bottleneck, or performance
  conclusion is made at this checkpoint.
- Performance interpretation belongs to Task 2.

Update:
docs/performance-executions/stress-apply-coupon-run-001-evidence-review.md

Update workflow state canonically from:
EXECUTION_REVIEW_REQUIRED

to the appropriate approved post-execution state.

Do not modify:
- raw JTL;
- HTML report;
- resource-monitoring evidence;
- approved JMX;
- approved CSV.

Use $log-ai-audit according to current HW05 audit scope,
but do not finalize the audit.

DO NOT RUN JMETER.
DO NOT PERFORM TASK 2 ANALYSIS.
DO NOT COMMIT.
DO NOT PUSH.

Return:

HUMAN_EXECUTION_DECISION:
APPROVED

RUN:
run-001

EXECUTION_EVIDENCE:
APPROVED

RAW_JTL_IMMUTABLE:
PASS

NO_RERUN_REQUIRED:
YES

PERFORMANCE_INTERPRETATION:
NOT_PERFORMED

WORKFLOW_STATE:
<actual new state>

NEXT_ALLOWED_ACTION:
<actual next action>
