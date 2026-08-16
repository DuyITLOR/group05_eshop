Resume HW05 production workflow after Human Review of the ownership-safe matrix.

Student Decision:
MODIFIED_AND_APPROVED

Student has manually confirmed that the following three workflows are
NOT assigned to another group member:

READ_HEAVY:
GET /api/orders/:id

AUTH_HEAVY:
GET /api/users/me

TRANSACTIONAL:
POST /api/admin/coupons

Set:

CROSS_MEMBER_OWNERSHIP:
PASS_BY_STUDENT_CONFIRMATION

Do not infer ownership from repository evidence.

==================================================
FINAL PRODUCTION MATRIX
==================================================

READ_HEAVY:
GET /api/orders/:id
Scenario: LOAD
Listener: Summary Report

AUTH_HEAVY:
GET /api/users/me
Scenario: SPIKE
Listener: Response Time Graph

TRANSACTIONAL:
POST /api/admin/coupons
Scenario: STRESS
Listener: Aggregate Report

Group Uniqueness:
PASS

Scenario Uniqueness:
PASS

Listener Uniqueness:
PASS

CSV Separation:
PASS

==================================================
HUMAN REVIEW NOTES
==================================================

Record:

- /api/users/me is accepted as AUTH_HEAVY because the workload exercises
  authenticated request processing, JWT verification, and user identity
  lookup.

- Do not claim this endpoint exercises login credential validation,
  password hashing, or account lockout.

- POST /api/admin/coupons is accepted as the stronger state-changing
  TRANSACTIONAL endpoint.

- Its future Stress design MUST include:
  isolated database execution,
  unique coupon codes,
  deterministic pre-state,
  explicit cleanup/restore,
  and protection against dataset exhaustion/duplicate-code failures.

- Preserve the current implementation/documentation discrepancy around
  server-side admin-role authorization. Do not silently alter the SUT
  or the test plan to hide it.

- POST /api/apply-coupon remains CONTROLLED_INTEGRATION_TEST_ONLY.

==================================================
PATCH MATRIX
==================================================

Update:

docs/performance-design/hw05-production-matrix-proposal.md

Human Review:

Status:
REVIEWED

Student Decision:
MODIFIED_AND_APPROVED

Cross-member Ownership:
PASS_BY_STUDENT_CONFIRMATION

Do not delete previous rejected matrix revisions.

==================================================
NEXT SCENARIO — READ_HEAVY LOAD ONLY
==================================================

Invoke:

$perf-scenario-designer

for:

Endpoint:
GET /api/orders/:id

Group:
READ_HEAVY

Scenario:
LOAD

Listener:
Summary Report

Create a NEW production design artifact, for example:

docs/performance-design/load-order-detail-design.md

Inspect actual:

backend/server.js
backend/database.js
api_specification.md
README.md

The design must determine:

- actual authentication middleware;
- whether an order is scoped to the authenticated owner;
- exact route/path parameter semantics;
- actual response contract;
- deterministic order IDs;
- whether multiple order IDs can be safely reused;
- data-driven CSV fields;
- primary success-path rows;
- no intentional 401/403/404 in measured primary workload;
- Think Time and exact JMeter Timer mapping;
- realistic LOAD VUs/ramp/hold;
- Summary Report;
- assertions;
- preflight requirements;
- dataset/state assumptions.

CSV must be separate for READ_HEAVY.

Do NOT create actual CSV rows yet unless the designer contract explicitly
allows proposal-only candidate data.

Do NOT generate JMX.

==================================================
IMPORTANT LOAD DESIGN RULES
==================================================

Because GET /api/orders/:id requires authentication according to the API
contract:

- identify how JWT/token data will be supplied;
- do not hard-code secret tokens into committed JMX/design artifacts;
- propose secure/externalized token handling;
- verify whether order ID must belong to the authenticated user;
- distinguish request-driving order_id from authentication setup data.

Primary measured workload must target deterministic successful reads.

Do not mix expected 401/403/404 responses into the main measured Load
dataset.

==================================================
AUDIT
==================================================

Use $log-ai-audit for substantive HW05 matrix/design interactions.

Do not finalize audit.
Audit remains committed only at the end of the assignment.

==================================================
GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

==================================================
FINAL OUTPUT
==================================================

Return:

PRODUCTION MATRIX:
MODIFIED_AND_APPROVED

Cross-member Ownership:
PASS_BY_STUDENT_CONFIRMATION

READ_HEAVY LOAD DESIGN

Endpoint:
GET /api/orders/:id

Design:
<path>

Authentication:
<summary>

Data-driven Fit:
PASS / RISK / BLOCKED

Data Status:
<status>

Workload:
<summary>

Think Time:
<summary>

Listener:
Summary Report

Design Status:
PENDING_HUMAN_REVIEW

Final Checkpoint:
PERFORMANCE_DESIGN_REVIEW_REQUIRED

Next Allowed Action:
Student Human Review of the READ_HEAVY / LOAD design.

NO JMX.
NO JMETER.
NO JTL.
NO COMMIT.
NO PUSH.