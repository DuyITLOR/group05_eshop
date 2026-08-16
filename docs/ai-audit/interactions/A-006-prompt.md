Resume the current controlled Stress workflow.

Student Decision:
APPROVE_DATA

Approved proposal:
docs/test-data-reviews/stress-apply-coupon-data-candidates.md

Populate:

test-data/transactional.csv

with exactly the two approved rows from the proposal.

Do not invent or modify candidate values.

Preserve schema:

code,total_amount,user_id,coupon_case,iteration_key

After populating CSV:

1. Verify exactly 2 data rows exist.
2. Verify both rows remain SUCCESS_PATH_ONLY.
3. Verify total_amount > min_order_amount.
4. Verify request-driving fields are code, total_amount, user_id.
5. Preserve:
   Recycle on EOF = true
   Stop thread on EOF = false
   Sharing mode = shareMode.all
6. Record that a read-only quota/coupon runtime precheck is mandatory
   immediately before real execution.
7. Re-run $perf-plan-reviewer against the updated JMX + CSV.
8. Resolve R-001 only if reviewer evidence supports resolution.
9. Do not auto-approve the overall JMeter plan.
10. Stop at HUMAN_PLAN_REVIEW_REQUIRED.

Update workflow state canonically.

Use $log-ai-audit for this HW05 artifact interaction according to the
current audit scope, but do not finalize the audit.

DO NOT RUN JMETER.
DO NOT CREATE JTL.
DO NOT CREATE EXECUTION EVIDENCE.
DO NOT COMMIT.
DO NOT PUSH.

Return:

DATA_APPLY_RESULT:
PASS / FAIL

CSV_ROWS:
2 / FAIL

R-001:
RESOLVED / OPEN

REVIEWER:
COMPLETE / BLOCKED

CRITICAL:
<count>

HIGH:
<count>

MEDIUM:
<count>

LOW:
<count>

EXECUTION_READINESS:
READY / CONDITIONALLY_READY / NOT_READY

REQUIRED_RUNTIME_PRECHECK:
YES

WORKFLOW_STATE:
HUMAN_PLAN_REVIEW_REQUIRED

NEXT_ALLOWED_ACTION:
Student review and approve/modify/reject the JMeter plan.
