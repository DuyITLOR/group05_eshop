Resume HW05 production READ_HEAVY / LOAD workflow at:

PERFORMANCE_DESIGN_REVIEW_REQUIRED

Endpoint:
GET /api/orders/:id

Group:
READ_HEAVY

Scenario:
LOAD

Design:
docs/performance-design/load-order-detail-design.md

Student Decision:
MODIFIED_AND_APPROVED

==================================================

1. HUMAN REVIEW DECISION
   ==================================================

Record:

Student Decision:
MODIFIED_AND_APPROVED

Approval Scope:
READ_HEAVY_LOAD_DESIGN

Student Notes:

* Approve READ_HEAVY / LOAD classification.
* Approve workload 0 -> 5 -> 10 VUs over 120 seconds.
* Approve Uniform Random Timer 500-1000 ms.
* Approve Summary Report.
* Approve request-driven order_id CSV design.
* Approve current implementation/spec conflict documentation.

However:

The current candidate order IDs 2 and 3 MUST NOT be treated as
deterministic final production data.

==================================================
2. HUMAN-IDENTIFIED AI DESIGN ISSUE
===================================

Human Review identified:

AI_DESIGN_FINDING:
NON_DETERMINISTIC_ORDER_SNAPSHOT

Evidence:

backend/database.js initialization:

* drops the orders table;
* recreates the orders table;
* seeds users/products/categories/coupons;
* does NOT seed deterministic orders.

Therefore:

Current SQLite order IDs 2 and 3 are snapshot-derived only.

They may disappear after backend/database initialization.

Do not copy them directly into the final production CSV based only on
their current existence.

Record this as a Human correction in the design.

==================================================
3. PATCH DESIGN DATA STATUS
===========================

Update:

docs/performance-design/load-order-detail-design.md

Set design-level Human Review:

Status:
REVIEWED

Student Decision:
MODIFIED_AND_APPROVED

Data Status:

NEEDS_DETERMINISTIC_FIXTURE_SETUP

Candidate rows 2 and 3:

SNAPSHOT_REFERENCE_ONLY

Do not classify them as approved production rows.

==================================================
4. PRESERVE AUTHENTICATION CONFLICT
===================================

Current implementation evidence:

GET /api/orders/:id

does not attach authenticateToken and does not enforce owner scoping.

Nearby routes such as:

GET /api/orders/my-orders

and:

PUT /api/orders/:id/cancel

do use authentication / owner filtering.

Keep:

IMPLEMENTATION_SPEC_CONFLICT

Design decision:

The future Load plan may send an externalized Bearer token to remain
contract-compliant as a client request.

But:

* do not claim the current handler validates that token;
* do not claim the Load test measures JWT verification;
* do not claim owner authorization is covered.

This scenario measures current order-detail lookup behavior.

==================================================
5. DESIGN DETERMINISTIC FIXTURE STRATEGY
========================================

Before building the JMX, propose a deterministic test-data setup for the
READ_HEAVY Load plan.

Requirements:

* isolated database only;
* no shared/production-like database mutation;
* setup occurs outside measured workload;
* deterministic success-path orders;
* owned by the dedicated test user;
* stable expected fields;
* cleanup or database restore after execution;
* no dependency on historical orders left by previous manual tests.

Do NOT use checkout as part of the measured workload.

Prefer an explicit isolated fixture/setup mechanism.

Possible implementation may use a repository-local fixture/setup script
against the isolated test DB if consistent with repository conventions.

Do not fabricate implementation if another canonical fixture mechanism
already exists.

Inspect repository first.

==================================================
6. FIXTURE DATA REQUIREMENTS
============================

Propose at least 2 deterministic success-path order records.

Each must define:

order_id
user_id
total_amount
status
shipping_address
created_at or assertion treatment
order_case
iteration_key

Prefer explicit stable order IDs if safe with the SQLite schema and
isolated database strategy.

Avoid values likely to collide with normal seeded/runtime IDs.

Example IDs MUST NOT be blindly invented and committed without checking
actual schema/setup behavior.

All values require source/setup evidence.

==================================================
7. CREATED_AT ASSERTION
=======================

Review whether exact created_at should be asserted.

Because created_at defaults to CURRENT_TIMESTAMP:

if deterministic fixture setup does not supply an explicit timestamp:

do NOT require exact created_at equality.

Instead assert:

* field exists;
* value has expected type/non-empty semantics.

If fixture explicitly provides deterministic created_at:

document it.

==================================================
8. AUTH TOKEN STRATEGY
======================

Keep token outside repository.

Expected JMeter concept:

Authorization:
Bearer ${__P(hw05.auth_token,)}

Do not store a real token in:

* design;
* CSV;
* JMX;
* logs;
* audit.

Propose exact preflight mechanism that verifies:

* runtime property exists;
* token is valid;
* token represents dedicated test user;

without printing the token.

Remember:

token validity is a contract/setup control.

The current GET /api/orders/:id implementation itself does not verify it.

==================================================
9. CREATE TEST-DATA PROPOSAL
============================

Create:

docs/test-data-reviews/load-order-detail-data-candidates.md

Include:

# Load Order Detail — Deterministic Test Data Proposal

## Human Finding

NON_DETERMINISTIC_ORDER_SNAPSHOT

## Database Initialization Evidence

Explain why historical order IDs cannot be trusted after restart.

## Fixture Setup Strategy

...

## Proposed Deterministic Orders

| order_id | user_id | total_amount | status | shipping_address | order_case | iteration_key | evidence |

## CSV Proposal

Expected final path:

test-data/read-heavy-orders.csv

Schema:

order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key

## Runtime / Preflight Strategy

...

## Cleanup / Restore Strategy

...

==================================================
10. DO NOT CREATE FINAL CSV YET
===============================

This step is proposal-only.

Do NOT populate:

test-data/read-heavy-orders.csv

until Student Human Review.

Do NOT generate JMX.

==================================================
11. RESULT CLASSIFICATION
=========================

Return:

DETERMINISTIC_FIXTURE_STRATEGY:
PROPOSED / BLOCKED

DATA_CANDIDATES:
FOUND / NOT_FOUND

SOURCE_BACKED:
YES / PARTIAL / NO

ISOLATED_DB:
PASS / NEEDS_SETUP / BLOCKED

DATA_DRIVEN_FIT:
PASS

AUTH_TOKEN_STRATEGY:
PASS / FINDING

CURRENT ORDER IDS 2/3:
SNAPSHOT_REFERENCE_ONLY

DESIGN HUMAN DECISION:
MODIFIED_AND_APPROVED

CURRENT DATA STATUS:
NEEDS_DETERMINISTIC_FIXTURE_SETUP

==================================================
12. WORKFLOW
============

Do not move to JMeter builder yet.

Next checkpoint:

TEST_DATA_REVIEW_REQUIRED

Next Allowed Action:

Student Human Review of deterministic Load order fixture/data proposal.

==================================================
13. AUDIT
=========

Use $log-ai-audit for this substantive HW05 design correction and
test-data proposal.

Record the Human-identified AI mistake:

The AI initially treated current SQLite order rows as candidate Load data
without fully accounting for backend initialization dropping/recreating
the orders table with no deterministic order seed.

Do not audit Agent Skill implementation.

Do not finalize audit.

==================================================
14. GIT
=======

DO NOT COMMIT.
DO NOT PUSH.

==================================================
15. SAFETY
==========

NO JMETER.
NO JMX.
NO JTL.
NO REAL LOAD EXECUTION.
NO FINAL CSV BEFORE HUMAN REVIEW.
NO SECRET TOKEN IN REPOSITORY.

Final checkpoint:

TEST_DATA_REVIEW_REQUIRED
