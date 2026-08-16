Resume HW05 production-matrix workflow at:

PRODUCTION_MATRIX_REVIEW_REQUIRED

Student Decision:
MODIFIED_AND_APPROVED

Apply the following Human Review decisions.

==================================================
1. KEEP ENDPOINT / SCENARIO MAPPING
==================================================

Approve:

READ_HEAVY:
GET /api/products?search={search_term}

Scenario:
LOAD

AUTH_HEAVY:
POST /api/login

Scenario:
SPIKE

TRANSACTIONAL:
POST /api/checkout

Scenario:
STRESS

Reasons:

- product search is a read-heavy query workload;
- login exercises authentication/account logic;
- checkout is the stronger final transactional workflow because it
  represents the actual checkout/order transaction rather than the
  controlled apply-coupon read-oriented handler;
- LOAD/STRESS/SPIKE remain one-to-one across the three groups.

==================================================
2. MODIFY SPIKE LISTENER
==================================================

REJECT:

SPIKE Listener:
View Results Tree

Reason:

Apache JMeter best practice states View Results Tree must not be used
during a load/performance test because it consumes significant CPU and
memory and is intended for functional debugging/validation.

Replace with:

SPIKE Listener:
Response Time Graph

Final listener matrix:

LOAD:
Summary Report

STRESS:
Aggregate Report

SPIKE:
Response Time Graph

Listener Uniqueness:
PASS

Document that all three are distinct built-in JMeter listener/report types.

Do not add View Results Tree to the production Spike execution plan.

==================================================
3. ENDPOINT OWNERSHIP MUST NOT BE FABRICATED
==================================================

HW05 additionally requires that no two group members test the same
endpoint/workflow.

Do not confuse this with internal matrix uniqueness.

Record separately:

Internal Group Mapping:
PASS

Internal Scenario Mapping:
PASS

Endpoint Ownership Across Group Members:
NOT_VERIFIABLE

unless an explicit repository/group assignment record proves ownership.

Do not mark endpoint ownership PASS merely because this student's three
rows are distinct.

Human confirmation is required before production execution if no
ownership artifact exists.

==================================================
4. APPLY-COUPON DECISION
==================================================

Keep:

POST /api/apply-coupon
TRANSACTIONAL
STRESS

as:

CONTROLLED_INTEGRATION_TEST_ONLY

Final HW05 selection:
NO

Do not delete its existing:

- design;
- JMX;
- CSV;
- raw JTL;
- HTML report;
- resource evidence;
- Human Reviews.

Classify them as:

CONTROLLED_INTEGRATION_EVIDENCE

Existing Stress Evidence Reusable:
PARTIAL

Reusable aspects may include:

- validated JMeter environment;
- Custom Thread Groups dependency;
- evidence-capture workflow;
- resource-monitoring approach;
- execution directory convention;
- review workflow.

Do NOT reuse apply-coupon response metrics as evidence for checkout
performance.

==================================================
5. PATCH PROPOSAL
==================================================

Update:

docs/performance-design/hw05-production-matrix-proposal.md

Human Review:

Status:
REVIEWED

Student Decision:
MODIFIED_AND_APPROVED

Student Notes:

- Approved the proposed production endpoints and scenario mapping.
- Replaced Spike View Results Tree with Response Time Graph because
  View Results Tree is inappropriate for real load generation.
- Internal group/scenario/listener/CSV uniqueness is accepted.
- Cross-member endpoint ownership remains NOT_VERIFIABLE until supported
  by explicit group assignment evidence or Student confirmation.
- POST /api/apply-coupon remains controlled integration evidence only.
- Final production transactional Stress endpoint is POST /api/checkout.

==================================================
6. FINAL MATRIX
==================================================

Expected:

READ_HEAVY:
GET /api/products?search={search_term}
LOAD
Summary Report

AUTH_HEAVY:
POST /api/login
SPIKE
Response Time Graph

TRANSACTIONAL:
POST /api/checkout
STRESS
Aggregate Report

Group Mapping:
PASS

Scenario Mapping:
PASS

Listener Uniqueness:
PASS

CSV Separation:
PASS

Endpoint Ownership:
NOT_VERIFIABLE unless explicit evidence exists.

==================================================
7. NEXT PRODUCTION SCENARIO
==================================================

After patching the matrix:

Do NOT generate all three plans at once.

The next production scenario should be:

READ_HEAVY
GET /api/products?search={search_term}
LOAD
Summary Report

Invoke $perf-scenario-designer for this production scenario only.

Create a NEW production design artifact.

Do NOT promote or overwrite:

docs/performance-design/load-categories-design.md

because that file is an old dry-run/smoke artifact.

The new design must inspect actual:

backend/server.js
backend/database.js
api_specification.md
README.md

and determine:

- exact search query semantics;
- actual success response;
- available deterministic search terms;
- CSV request-driving fields;
- Think Time;
- Load VUs/ramp/duration;
- assertions;
- endpoint risks;
- hardware assumptions.

CSV should be separate for READ_HEAVY.

Do not create actual JMX yet.

Stop at:

PERFORMANCE_DESIGN_REVIEW_REQUIRED

==================================================
8. AUTH / CHECKOUT ARE NOT STARTED YET
==================================================

Do not generate:

SPIKE login design
STRESS checkout design

in this invocation.

They will be handled sequentially after Human Review.

==================================================
9. AUDIT
==================================================

Use $log-ai-audit for the substantive production-matrix modification
and new READ_HEAVY/LOAD design according to current scope.

Do not finalize audit.
Do not commit audit.

==================================================
10. SAFETY
==================================================

NO JMETER EXECUTION.
NO JMX GENERATION.
NO JTL.
NO HTML EXECUTION REPORT.
NO COMMIT.
NO PUSH.

==================================================
11. FINAL OUTPUT
==================================================

Return:

PRODUCTION MATRIX HUMAN REVIEW

Decision:
MODIFIED_AND_APPROVED

READ_HEAVY:
GET /api/products?search={search_term}

AUTH_HEAVY:
POST /api/login

TRANSACTIONAL:
POST /api/checkout

LOAD Listener:
Summary Report

SPIKE Listener:
Response Time Graph

STRESS Listener:
Aggregate Report

Internal Mapping:
PASS

Listener Uniqueness:
PASS

CSV Separation:
PASS

Endpoint Ownership:
PASS / NOT_VERIFIABLE

Apply Coupon:
CONTROLLED_INTEGRATION_TEST_ONLY

Then:

READ_HEAVY LOAD DESIGN

Design:
<path>

Data-driven Fit:
PASS / RISK / BLOCKED

Design Status:
PENDING_HUMAN_REVIEW

Final Checkpoint:
PERFORMANCE_DESIGN_REVIEW_REQUIRED

Next Allowed Action:
Student review the production READ_HEAVY / LOAD design.

NO JMETER EXECUTION.
NO JMX.
NO COMMIT.
NO PUSH.