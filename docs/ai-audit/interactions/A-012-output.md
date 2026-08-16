HW05 PRODUCTION MATRIX — OWNERSHIP RESELECTION

Previous Matrix:
REJECTED

Reason:
ENDPOINT_OWNERSHIP_CONFLICT

Hard-excluded Workflows:
5

Remaining Candidates Reviewed:
25

READ_HEAVY:
GET /api/orders/:id

AUTH_HEAVY:
GET /api/users/me

TRANSACTIONAL:
POST /api/admin/coupons

LOAD:
READ_HEAVY + GET /api/orders/:id

SPIKE:
AUTH_HEAVY + GET /api/users/me

STRESS:
TRANSACTIONAL + POST /api/admin/coupons

LOAD Listener:
Summary Report

SPIKE Listener:
Response Time Graph

STRESS Listener:
Aggregate Report

Group Uniqueness:
PASS

Scenario Uniqueness:
PASS

Listener Uniqueness:
PASS

CSV Uniqueness:
PASS

Hard Exclusion Check:
PASS

Cross-member Ownership:
NOT_VERIFIABLE

READ_HEAVY Data-driven Fit:
PASS

AUTH_HEAVY Data-driven Fit:
PASS

TRANSACTIONAL Data-driven Fit:
PASS

Apply Coupon:
KEEP_CONTROLLED_ONLY

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

<oai-mem-citation>
<citation_entries>
MEMORY.md:1466-1469|note=[preserved controlled Stress state and immutable evidence]
</citation_entries>
<rollout_ids>
019ff18e-7c64-7d42-85bc-896431439201
</rollout_ids>
</oai-mem-citation>
