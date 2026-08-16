Bạn đang làm việc trong repository HW05 – Performance Testing.

NHIỆM VỤ
========

REVISE FINAL PRODUCTION MATRIX vì Human Review phát hiện
ENDPOINT_OWNERSHIP_CONFLICT.

KHÔNG generate JMX.
KHÔNG chạy JMeter.
KHÔNG tạo JTL.
KHÔNG commit.
KHÔNG push.

==================================================
1. HUMAN DECISION
==================================================

Current READ_HEAVY design:

docs/performance-design/load-products-search-design.md

Student Decision:

REJECTED

Reason:

ENDPOINT_OWNERSHIP_CONFLICT

The design itself is not rejected because of workload quality.
It is rejected because the selected endpoint cannot be used by this
student in final HW05 production testing.

Record this Human Review in the design.

Do not delete the design.

Classify it as:

NON_PRODUCTION_DUE_TO_OWNERSHIP_CONFLICT

Do not generate a JMX from it.

==================================================
2. HARD ENDPOINT EXCLUSION LIST
==================================================

The following endpoints/workflows are already reserved/used by another
group member and MUST NOT be selected for this student's final HW05
production matrix:

- POST /api/login
- GET /api/products?search=...
- product detail endpoint/workflow
- cart endpoint/workflow
- POST /api/checkout or checkout workflow

Treat these as HARD EXCLUSIONS.

Do not recommend them as backup options.

Do not mark ownership PASS for them.

==================================================
3. CURRENT MATRIX IS INVALID
==================================================

Current proposed final matrix:

READ_HEAVY:
GET /api/products?search={search_term}

AUTH_HEAVY:
POST /api/login

TRANSACTIONAL:
POST /api/checkout

is invalid for final submission because all three selected workflows
conflict with the ownership exclusion set.

Set:

PRODUCTION_MATRIX_STATUS:
REQUIRES_RESELECTION

Do not preserve these endpoints merely to reuse work.

==================================================
4. PRESERVE SCENARIO / LISTENER STRUCTURE IF POSSIBLE
==================================================

Preferred scenario structure may remain:

READ_HEAVY -> LOAD
AUTH_HEAVY -> SPIKE
TRANSACTIONAL -> STRESS

Preferred listener structure may remain:

LOAD -> Summary Report
SPIKE -> Response Time Graph
STRESS -> Aggregate Report

BUT:

Do not force these mappings if actual remaining endpoints make another
1-to-1 mapping materially safer or more appropriate.

Requirements remain:

- exactly one READ_HEAVY;
- exactly one AUTH_HEAVY;
- exactly one TRANSACTIONAL;
- exactly one LOAD;
- exactly one STRESS;
- exactly one SPIKE;
- three distinct listeners;
- three separate CSV files;
- no cross-member endpoint/workflow duplication.

==================================================
5. RE-INSPECT ALL ACTUAL ROUTES
==================================================

Read actual:

backend/server.js
backend/database.js
api_specification.md
README.md

Enumerate every remaining viable endpoint/workflow after applying the
hard exclusion list.

For every candidate report:

Endpoint:
Method:
Endpoint Group Candidate:
Current Implementation Behavior:
Authentication:
State Mutation:
Input Fields:
CSV_MODE:
DATA_DRIVEN_FIT:
Success-path Repeatability:
Reset Requirement:
Isolation Requirement:
Scenario Fit:
Listener Fit:
Implementation/Documentation Conflict:
Ownership Status:
Risk:

Do not select by route name alone.

==================================================
6. READ_HEAVY SELECTION
==================================================

Find a READ_HEAVY endpoint/workflow NOT in the exclusion list.

Prefer:

- actual DB/read operation;
- repeatable workload;
- request-driving CSV data;
- deterministic success path;
- no state mutation;
- meaningful latency/throughput behavior.

If all remaining READ_HEAVY candidates have only TRACEABILITY_ONLY CSV:

report DATA_DRIVEN_FIT risk honestly.

Do not fall back to products search.

==================================================
7. AUTH_HEAVY SELECTION
==================================================

Find an AUTH_HEAVY endpoint/workflow NOT equal to login.

Inspect actual alternatives such as, only if source supports them:

- registration/authentication-related validation;
- forgot-password;
- OTP verification;
- password reset;
- authenticated identity/profile endpoint;
- token-verification-heavy workflow;
- other authentication-related route.

Do NOT automatically select one of these examples.

Choose only actual repository routes whose implementation truly performs
authentication/security/account work.

Analyze state mutation carefully.

Forgot-password/OTP/email-dependent workflow must not be selected if
it cannot be executed deterministically and safely under Load/Spike.

==================================================
8. TRANSACTIONAL SELECTION
==================================================

Find a TRANSACTIONAL endpoint/workflow NOT equal to:

- checkout;
- cart;
- product detail.

Re-evaluate existing:

POST /api/apply-coupon

but remember current controlled evidence found:

- it reads coupon state;
- it does not itself mutate coupon_usage.

Therefore:

TRANSACTIONAL_SEMANTICS_RISK:
YES

unless actual current source has changed.

Inspect stronger alternatives, especially actual state-mutating routes,
if present.

Candidate must be repeatable with a safe reset/isolation strategy.

Do not choose a transactional endpoint merely because it is POST.

==================================================
9. CONTROLLED APPLY-COUPON RUN
==================================================

Preserve all existing controlled evidence for:

POST /api/apply-coupon

Do not delete or rerun it.

Current classification:

CONTROLLED_INTEGRATION_EVIDENCE

If apply-coupon becomes the best remaining final transactional candidate
despite semantic risk:

return:

APPLY_COUPON_FINAL_RECOMMENDATION:
NEEDS_HUMAN_DECISION

and explain the trade-off.

Do NOT automatically promote it.

==================================================
10. OWNERSHIP CHECK
==================================================

For every proposed endpoint:

Ownership against hard exclusion list:
MUST PASS

If repository contains additional explicit assignment evidence:
inspect it.

Output separately:

HARD_EXCLUSION_CHECK:
PASS / FAIL

CROSS_MEMBER_OWNERSHIP:
PASS / NOT_VERIFIABLE

An endpoint not appearing in the known exclusion list may still remain
NOT_VERIFIABLE if no full group assignment record exists.

Do not confuse these two concepts.

==================================================
11. CREATE REVISED MATRIX PROPOSAL
==================================================

Update or create:

docs/performance-design/hw05-production-matrix-proposal.md

Preserve previous rejected matrix/history rather than silently hiding it.

Add a revision:

Revision Reason:
ENDPOINT_OWNERSHIP_CONFLICT

Previous Matrix:
REJECTED_FOR_FINAL_PRODUCTION

Then propose:

| Group | Endpoint | Scenario | Listener | CSV | Data-driven Fit | State Mutation | Ownership | Recommendation |

Exactly three final candidate rows.

==================================================
12. DO NOT DESIGN NEXT SCENARIO YET
==================================================

Unlike the previous invocation:

DO NOT call $perf-scenario-designer yet.

First stop at the revised matrix Human Review.

We need to approve endpoint ownership before spending work on another
scenario design.

==================================================
13. AUDIT
==================================================

This is a substantive HW05 matrix revision.

Use $log-ai-audit according to current HW05 audit scope.

Do not finalize audit.
Do not commit audit.

==================================================
14. GIT
==================================================

DO NOT COMMIT.
DO NOT PUSH.

==================================================
15. FINAL OUTPUT
==================================================

Return:

HW05 PRODUCTION MATRIX — OWNERSHIP RESELECTION

Previous Matrix:
REJECTED

Reason:
ENDPOINT_OWNERSHIP_CONFLICT

Hard-excluded Workflows:
5

Remaining Candidates Reviewed:
<count>

READ_HEAVY:
<endpoint>

AUTH_HEAVY:
<endpoint>

TRANSACTIONAL:
<endpoint>

LOAD:
<group + endpoint>

SPIKE:
<group + endpoint>

STRESS:
<group + endpoint>

LOAD Listener:
<listener>

SPIKE Listener:
<listener>

STRESS Listener:
<listener>

Group Uniqueness:
PASS / FAIL

Scenario Uniqueness:
PASS / FAIL

Listener Uniqueness:
PASS / FAIL

CSV Uniqueness:
PASS / FAIL

Hard Exclusion Check:
PASS / FAIL

Cross-member Ownership:
PASS / NOT_VERIFIABLE

READ_HEAVY Data-driven Fit:
PASS / RISK / BLOCKED

AUTH_HEAVY Data-driven Fit:
PASS / RISK / BLOCKED

TRANSACTIONAL Data-driven Fit:
PASS / RISK / BLOCKED

Apply Coupon:
KEEP_CONTROLLED_ONLY / NEEDS_HUMAN_DECISION

Proposal Artifact:
docs/performance-design/hw05-production-matrix-proposal.md

Final Checkpoint:
PRODUCTION_MATRIX_REVIEW_REQUIRED

Next Allowed Action:
Student Human Review of the ownership-safe revised matrix.

NO JMETER.
NO JMX.
NO JTL.
NO COMMIT.
NO PUSH.