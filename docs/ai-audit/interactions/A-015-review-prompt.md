## PROMPT A — Continue READ_HEAVY / LOAD workflow

Resume HW05 READ_HEAVY / LOAD workflow from:

TEST_DATA_FINAL_APPROVAL_REQUIRED

Endpoint:
GET /api/orders/:id

Scenario:
LOAD

Design:
docs/performance-design/load-order-detail-design.md

Data Proposal:
docs/test-data-reviews/load-order-detail-data-candidates.md

Fixture Tooling:
scripts/performance/load-order-detail-runtime.js
scripts/performance/load-order-detail-setup.js

Student Decision:
APPROVE_DATA

Approval Scope:
READ_HEAVY_LOAD_DETERMINISTIC_DATASET

Student Notes:

* Approved deterministic fixture order IDs `2312710701` and `2312710702`.
* Approved the disposable backend runtime-copy isolation strategy.
* Runtime fixture verification passed for both rows.
* Source `backend/database.sqlite` remained unchanged.
* Token provisioning and `/api/users/me` identity verification passed.
* No token/Authorization secret was exposed.
* Both `GET /api/orders/:id` smoke checks passed.
* These rows may now be used as the final READ_HEAVY request-driven dataset.

==================================================

1. RECORD FINAL DATA APPROVAL
   ==================================================

Update:

docs/test-data-reviews/load-order-detail-data-candidates.md

Human Review:

Status:
REVIEWED

Student Decision:
APPROVE_DATA

Approval Status:
APPROVED

Data Classification:
HUMAN_APPROVED_DETERMINISTIC_FIXTURE

Runtime Verification:
PASS

Isolation Strategy:
DISPOSABLE_BACKEND_RUNTIME_COPY

Source DB Integrity:
PASS

Keep historical IDs:

2
3

classified only as:

SNAPSHOT_REFERENCE_ONLY

Do not reintroduce them into final CSV.

==================================================
2. CREATE FINAL READ_HEAVY CSV
==============================

Create:

test-data/read-heavy-orders.csv

Exact schema:

order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key

Populate exactly these approved rows:

2312710701,2,pending,30000000,deterministic_success_a,load-order-a
2312710702,2,pending,28000000,deterministic_success_b,load-order-b

Do not add:

* historical rows;
* negative cases;
* 401 cases;
* 403 cases;
* 404 cases;
* foreign-owner rows.

Primary dataset remains:

SUCCESS_PATH_ONLY

Verify:

CSV_ROWS:
2

CSV_MODE:
REQUEST_DRIVEN

DATA_DRIVEN_FIT:
PASS

Recycle on EOF:
true

Stop thread on EOF:
false

Sharing Mode:
shareMode.all

==================================================
3. AUTH TOKEN HANDLING
======================

The JMX must NOT contain a real JWT.

Use:

Authorization:
Bearer ${__P(hw05.auth_token,)}

The runtime token is provided externally.

Do not embed secret values in:

* JMX;
* CSV;
* design;
* generation summary;
* logs;
* audit.

Document a fail-closed preflight requirement if:

hw05.auth_token

is missing.

==================================================
4. INVOKE $jmeter-plan-builder
==============================

Generate the production Load JMeter plan from the approved design and CSV.

Expected filename:

test-plans/23127107_Load_20260812.jmx

Filename rule:

{StudentID}*{ScenarioType}*{YYYYMMDD}.jmx

Expected:

Student ID:
23127107

Scenario:
Load

Date:
20260812

Filename Validation:
PASS

==================================================
5. WORKLOAD MAPPING
===================

Generate exactly the approved Load profile:

Phase 1:
0 -> 5 VUs
10 seconds

Phase 2:
hold 5 VUs
30 seconds

Phase 3:
5 -> 10 VUs
20 seconds

Phase 4:
hold 10 VUs
60 seconds

Total planned duration:
120 seconds

Do not change workload values without returning to Human Review.

==================================================
6. THINK TIME
=============

Use:

Uniform Random Timer

Constant Delay Offset:
500 ms

Random Delay Maximum:
500 ms

Effective range:
500-1000 ms

Mapping:
PASS

==================================================
7. HTTP REQUEST
===============

Request:

GET /api/orders/${order_id}

Use current configured base URL pattern.

Request body:
NONE

Use Header Manager:

Authorization:
Bearer ${__P(hw05.auth_token,)}

Do not claim that current handler enforces JWT authentication.

Preserve:

IMPLEMENTATION_SPEC_CONFLICT

in generation/review documentation.

==================================================
8. ASSERTIONS
=============

Primary sample must require:

HTTP:
200

JSON object valid.

Expected fields:

id
user_id
total_amount
status
shipping_address
created_at

Verify:

id == ${order_id}

user_id == ${expected_user_id}

status == ${expected_status}

total_amount == ${expected_total_amount}

created_at:
exists and non-empty string

Response:
must not contain error field.

HTTP 401 / 403 / 404:
FAIL

Do not add them as valid alternate outcomes.

==================================================
9. LISTENER
===========

Use exactly:

Summary Report

Do not add:

Aggregate Report
Response Time Graph
View Results Tree

to this production Load plan.

Project listener mapping remains:

LOAD:
Summary Report

SPIKE:
Response Time Graph

STRESS:
Aggregate Report

==================================================
10. PRE-EXECUTION CONTROL
=========================

Generation must document mandatory preflight:

* disposable backend runtime exists;
* fixture setup PASS;
* source database integrity PASS;
* exactly two approved fixture rows;
* runtime auth-token property present;
* `/api/users/me` returns user ID 2;
* both order smoke requests return expected fields;
* no concurrent checkout/cancel/admin-order mutation.

Do not execute preflight as part of the measured Load sampler.

==================================================
11. GENERATION SUMMARY
======================

Create:

docs/jmeter-generation/23127107-load-generation-summary.md

Include:

* design mapping;
* workload;
* timer;
* listener;
* CSV;
* assertion strategy;
* secret handling;
* fixture strategy;
* source DB immutability;
* IMPLEMENTATION_SPEC_CONFLICT;
* JMX filename validation;
* pre-execution requirements.

==================================================
12. RUN $perf-plan-reviewer
===========================

After JMX generation, perform independent static review.

Review:

* JMX structure;
* CSV binding;
* field mappings;
* request URL;
* Authorization property usage;
* Timer mapping;
* Load schedule;
* assertions;
* listener uniqueness;
* CSV uniqueness;
* secret exposure;
* fixture/preflight dependency;
* filename convention.

Create:

docs/performance-reviews/load-order-detail-jmeter-ai-review.md

Do not self-approve the plan.

==================================================
13. REVIEW CLASSIFICATION
=========================

Report findings as:

Critical
High
Medium
Low
Info

Any real token found in repository artifact:

CRITICAL

Any request using wrong order field / wrong URL:

HIGH

Any workload/timer deviation from approved design:

HIGH

Missing fixture/preflight enforcement documentation:

at least MEDIUM or according to reviewer contract.

==================================================
14. WORKFLOW
============

If builder + reviewer complete:

Workflow State:

HUMAN_PLAN_REVIEW_REQUIRED

Do not transition to real execution.

Do not run JMeter.

==================================================
15. SAFETY
==========

NO REAL LOAD EXECUTION.
NO JTL.
NO HTML EXECUTION DASHBOARD.
NO PERFORMANCE RESULT.
NO CAPACITY CLAIM.
NO SLA CLAIM.
NO COMMIT.
NO PUSH.

==================================================
16. FINAL OUTPUT
================

Return:

READ_HEAVY LOAD — JMETER GENERATION

DATA_APPROVAL:
APPROVED

CSV:
test-data/read-heavy-orders.csv

CSV_ROWS:
2

CSV_STATUS:
PASS / FAIL

JMX:
test-plans/23127107_Load_20260812.jmx

JMX_GENERATION:
PASS / FAIL

FILENAME:
PASS / FAIL

LOAD_PROFILE:
PASS / FAIL

THINK_TIME:
PASS / FAIL

AUTH_SECRET_EXTERNALIZED:
PASS / FAIL

ASSERTIONS:
PASS / FAIL

LISTENER:
Summary Report

GENERATION_SUMMARY: <path>

PLAN_REVIEW: <path>

CRITICAL: <count>

HIGH: <count>

MEDIUM: <count>

LOW: <count>

EXECUTION_READINESS:
READY / CONDITIONALLY_READY / NOT_READY

WORKFLOW_STATE:
HUMAN_PLAN_REVIEW_REQUIRED

NEXT_ALLOWED_ACTION:
Student Human Review of the READ_HEAVY / LOAD JMeter plan.

NO JMETER EXECUTION.
NO JTL.
NO COMMIT.
NO PUSH.

==================================================
PROMPT B — UPDATE AI AUDIT FOR THIS HUMAN DECISION
==================================================

Invoke:

$log-ai-audit

Operation:

UPDATE_REVIEW

Target the audit entry corresponding to the deterministic READ_HEAVY
fixture implementation / data proposal Human Review.

Inspect:

docs/ai-audit/AI_AUDIT_LOG.md

and the current interaction files.

Do NOT create a duplicate Artifact ID.

The interaction being reviewed produced/updated:

docs/test-data-reviews/load-order-detail-data-candidates.md

scripts/performance/load-order-detail-runtime.js

scripts/performance/load-order-detail-setup.js

docs/performance-design/load-order-detail-design.md

and verified the disposable runtime fixture.

==================================================
AUDIT HUMAN DECISION
====================

Human Decision:

APPROVE_DATA

Decision Scope:

READ_HEAVY_LOAD_DETERMINISTIC_DATASET

==================================================
EXPECTED VERDICT LOGIC
======================

The original fixture implementation interaction followed a prior
Student `MODIFY_DATA` correction and successfully implemented the
replacement disposable-runtime strategy.

If the implementation output itself required no further correction
before this approval:

Verdict:
VALID

Student Decision:
ACCEPTED_AS_IS

If actual audit evidence shows additional Student correction was required
inside this same interaction:

use:
INCOMPLETE
+
MODIFIED

Do not force VALID without checking evidence.

==================================================
SECTION (3) FORMAT
==================

Use:

#### (3) Verdict

| Field         | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Review Status | `FINALIZED`                                            |
| Verdict       | `<actual verdict>`                                     |
| Verdict Scope | `READ_HEAVY_LOAD_DETERMINISTIC_FIXTURE_IMPLEMENTATION` |

==================================================
SECTION (4) FORMAT
==================

Keep:

**Evaluation Sources**

if already present.

Then:

**Review Notes**

Write primarily in Vietnamese.

Include factual points:

* Disposable backend runtime-copy strategy đã được implement thay cho
  unsupported DB-path injection assumption.
* Production source không bị sửa.
* `backend/database.sqlite` giữ nguyên SHA-256 trước/sau setup.
* Hai deterministic fixtures `2312710701` và `2312710702` được insert
  và verify thành công trong isolated runtime.
* `/api/users/me` preflight xác nhận dedicated user ID `2`.
* Hai order-detail smoke request đều PASS.
* Token được externalize và không bị ghi vào artifact/audit/log.
* Không có JMeter Load execution trong interaction này.
* Student phê duyệt dataset để chuyển sang final CSV/JMX generation.

If Verdict is VALID, explicitly explain:

Artifact interaction không cần Human correction thêm sau runtime
verification, vì vậy original AI output trong scope này được chấp nhận
as-is.

==================================================
SECTION (5) FORMAT
==================

If VALID:

#### (5) Student Fix

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Student Decision    | `ACCEPTED_AS_IS`                                              |
| Change Illustration | No additional change required after runtime verification.     |
| Verification Method | `EXECUTION_EVIDENCE_REVIEW`                                   |
| Verification Result | `PASSED`                                                      |
| Final File          | `docs/test-data-reviews/load-order-detail-data-candidates.md` |
| Approval Status     | `APPROVED`                                                    |

**Changes Made**

* Không cần chỉnh sửa thêm đối với verified fixture implementation.
* Student phê duyệt chính xác hai deterministic fixture rows cho final
  READ_HEAVY dataset.
* Dataset được phép chuyển sang bước CSV/JMX generation.

**Correction Notes**

Interaction này là implementation của Human-directed `MODIFY_DATA`
decision trước đó. Runtime evidence xác nhận isolation, source database
immutability, fixture correctness và secret handling đều PASS. Không cần
correction thêm tại checkpoint này.

**Human Decision Evidence**

`APPROVE_DATA`

==================================================
AUDIT STYLE
===========

Main explanatory language:
Vietnamese

Keep English:

* headings;
* field labels;
* enums;
* technical identifiers;
* paths.

==================================================
AUDIT SCOPE
===========

This interaction IS substantive HW05 test setup/data work.

Include it.

Do NOT audit unrelated Agent Skill implementation or repair.

Do not expose secret token.

==================================================
SUMMARY
=======

Recalculate audit summary after finalizing the entry.

Pending entries are excluded.

Ensure:

VALID + INVALID + INCOMPLETE = total finalized

Summary arithmetic:
PASS

==================================================
GIT
===

DO NOT COMMIT AUDIT.

Audit remains for the final dedicated audit commit.

DO NOT PUSH.

==================================================
RETURN
======

AUDIT UPDATE

Artifact ID: <actual existing ID>

Review Status:
FINALIZED / <actual>

Verdict:
VALID / INCOMPLETE / INVALID

Student Decision: <actual>

Human Decision Evidence:
APPROVE_DATA

Verification Result:
PASSED / <actual>

Approval Status:
APPROVED

Audit Summary:
PASS / FAIL

Duplicate Artifact Created:
NO

Secret Exposed:
NO

Git:
NOT_COMMITTED
