HW05 PRODUCTION MATRIX PROPOSAL

Candidate Endpoints Reviewed: 11

READ_HEAVY: `GET /api/products?search={search_term}`

AUTH_HEAVY: `POST /api/login`

TRANSACTIONAL: `POST /api/checkout`

LOAD:
`READ_HEAVY` + `GET /api/products?search={search_term}`

STRESS:
`TRANSACTIONAL` + `POST /api/checkout`

SPIKE:
`AUTH_HEAVY` + `POST /api/login`

LOAD Listener: `Summary Report`

STRESS Listener: `Aggregate Report`

SPIKE Listener: `View Results Tree`

Group Uniqueness:
PASS

Scenario Uniqueness:
PASS

Listener Uniqueness:
PASS

CSV Uniqueness:
PASS

READ_HEAVY Data-driven Fit:
PASS

AUTH_HEAVY Data-driven Fit:
PASS

TRANSACTIONAL Data-driven Fit:
PASS

Apply Coupon:
KEEP_AS_CONTROLLED_ONLY

Existing Stress Evidence Reusable:
PARTIAL

Proposal Artifact:
docs/performance-design/hw05-production-matrix-proposal.md

Final Checkpoint:
PRODUCTION_MATRIX_REVIEW_REQUIRED

Next Allowed Action:
Student Human Review of the proposed final Task 1 matrix.

NO JMETER EXECUTION.
NO JMX GENERATION.
NO COMMIT.
NO PUSH.

<oai-mem-citation>
<citation_entries>
MEMORY.md:1466-1469|note=[preserved controlled Stress state and evidence scope]
</citation_entries>
<rollout_ids>
019ff18e-7c64-7d42-85bc-896431439201
</rollout_ids>
</oai-mem-citation>
