Resume HW05 Task 1 at:

HUMAN_DESIGN_REVIEW_REQUIRED

Production Scenario:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Listener:

Response Time Graph

Design:

docs/performance-design/spike-users-me-design.md

==================================================
1. STUDENT HUMAN DECISION
==================================================

Student Decision:

APPROVED

Approval Scope:

AUTH_HEAVY_SPIKE_DESIGN

Profile Decision:

APPROVED

Data Strategy Decision:

APPROVED

Student Notes:

- `GET /api/users/me` is accepted as AUTH_HEAVY because the measured
  request exercises authenticated Bearer/JWT verification plus the
  authenticated user lookup confirmed by current implementation.
- This scenario does NOT represent login/password hashing, credential
  verification, account lockout, or authentication token issuance.
- The proposed workload is accepted as a true SPIKE profile.
- The dedicated AUTH_HEAVY CSV strategy is accepted.
- The existing implementation/specification conflicts must remain visible.
- No capacity, SLA, or production-readiness claim is approved.

==================================================
2. APPROVE SPIKE PROFILE
==================================================

Approve exactly:

Baseline:
5 VUs for 20 seconds

Spike ramp:
5 -> 25 VUs in 3 seconds

Spike hold:
25 VUs for 20 seconds

Recovery:
25 -> 5 VUs in 5 seconds

Recovery hold:
5 VUs for 20 seconds

Total planned window:
68 seconds

Classification:

SPIKE

Do not alter the profile in this interaction unless an independently
verified technical impossibility is discovered.

==================================================
3. APPROVE THINK TIME
==================================================

Approve:

Uniform Random Timer

Offset:
250 ms

Random Maximum:
250 ms

Effective range:
250-500 ms

Do not silently replace this with the READ_HEAVY Load Timer.

==================================================
4. PRESERVE LISTENER MAPPING
==================================================

Approve:

AUTH_HEAVY / SPIKE:
Response Time Graph

Preserve project mapping:

READ_HEAVY / LOAD:
Summary Report

AUTH_HEAVY / SPIKE:
Response Time Graph

TRANSACTIONAL / STRESS:
Aggregate Report

Final project-level listener uniqueness will be verified after all three
production JMX files exist.

==================================================
5. PRESERVE AUTH STRATEGY
==================================================

Approve external token strategy.

Measured request will use the canonical equivalent of:

Authorization: Bearer ${__P(hw05.auth_token,)}

Token must be provisioned outside measured SPIKE traffic.

Missing token must fail closed.

Do not place real JWT values in:

JMX
CSV
Git
design
audit
logs

==================================================
6. RECORD HUMAN DESIGN REVIEW
==================================================

Update:

docs/performance-design/spike-users-me-design.md

Human Review section.

Set:

Review Status:
FINALIZED

Student Decision:
APPROVED

Approval Scope:
AUTH_HEAVY_SPIKE_DESIGN

Profile Decision:
APPROVED

Data Strategy Decision:
APPROVED

JMX:
NOT_CREATED

Execution:
NOT_RUN

Do not remove or downgrade documented:

IMPLEMENTATION_SPEC_CONFLICT

items.

==================================================
7. BEGIN TEST-DATA VERIFICATION
==================================================

After recording design approval, perform source/runtime-backed test-data
verification for the dedicated AUTH_HEAVY dataset.

Do NOT create final CSV yet.

Proposed final CSV path:

test-data/auth-heavy-users-me.csv

Proposed schema:

expected_user_id,expected_email,expected_name,auth_case,iteration_key

==================================================
8. VERIFY SEEDED USER
==================================================

Inspect current source and, where necessary, an isolated runtime to verify
the exact successful authenticated user intended for this scenario.

At minimum determine source-backed:

expected_user_id
expected_email
expected_name

Do not guess values.

Do not copy stale values from earlier artifacts without verification.

Do not expose password or JWT secrets in the review artifact.

==================================================
9. VERIFY RESPONSE CONTRACT
==================================================

Verify the actual successful response from:

GET /api/users/me

Confirm which fields are actually returned.

Only retain CSV assertion fields that can be reliably asserted from the
current implementation.

If the route does not return one of:

id
email
name

do not keep that field merely because it was proposed earlier.

Record any difference between:

DOCUMENTED_CONTRACT

and:

CURRENT_IMPLEMENTATION

as:

IMPLEMENTATION_SPEC_CONFLICT

==================================================
10. DATA COLUMN SEMANTICS
==================================================

For each proposed CSV column classify it explicitly as:

REQUEST_DRIVEN

ASSERTION_DRIVEN

or:

TRACE_ONLY

Expected likely semantics, subject to verification:

expected_user_id:
ASSERTION_DRIVEN

expected_email:
ASSERTION_DRIVEN if response contains source-backed email

expected_name:
ASSERTION_DRIVEN if response contains source-backed name

auth_case:
TRACE_ONLY

iteration_key:
TRACE_ONLY

Do not invent REQUEST_DRIVEN fields for an endpoint that needs no business
request parameters.

==================================================
11. PRIMARY DATASET
==================================================

Design only the successful authenticated measured dataset.

Expected:

SUCCESS_PATH_ONLY

Do not mix into primary SPIKE traffic:

missing token
invalid token
expired token
401
403

unless actual source verification reveals a reason that requires
reconsideration.

==================================================
12. DATA CANDIDATE ARTIFACT
==================================================

Create:

docs/test-data-reviews/spike-users-me-data-candidates.md

Include:

- verified seeded identity;
- source/evidence used;
- response-field verification;
- proposed CSV rows;
- column semantics;
- token handling boundary;
- implementation/spec conflicts;
- limitations;
- Student Human Review section.

Do NOT create final CSV yet.

==================================================
13. RUNTIME ISOLATION
==================================================

Verify:

DISPOSABLE_BACKEND_RUNTIME_COPY

remains compatible with `/api/users/me`.

Do not mutate:

backend/database.sqlite

If runtime verification is needed, use only disposable runtime state.

After any verification, confirm source DB integrity remains unchanged.

==================================================
14. WORKFLOW
==================================================

Update:

docs/workflow/hw05-performance-workflow-status.md

from:

HUMAN_DESIGN_REVIEW_REQUIRED

to the canonical equivalent of:

TEST_DATA_REVIEW_REQUIRED

after the data candidate artifact is complete.

Do not generate JMX.

Do not execute JMeter.

Do not start Task 2.

==================================================
15. AI AUDIT
==================================================

Do NOT modify:

docs/ai-audit/

in this interaction.

The AUTH_HEAVY design Human Review will receive its dedicated audit update
in a separate interaction.

Do not create a new audit entry here.

==================================================
16. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

==================================================
17. FINAL OUTPUT
==================================================

Return:

AUTH_HEAVY SPIKE — HUMAN DESIGN REVIEW + DATA VERIFICATION

Student Decision:
APPROVED

Approval Scope:
AUTH_HEAVY_SPIKE_DESIGN

Profile Decision:
APPROVED

Data Strategy Decision:
APPROVED

Approved SPIKE Profile:
5 VUs / 20s -> 25 VUs in 3s -> 25 VUs / 20s ->
5 VUs in 5s -> 5 VUs / 20s

Approved Think Time:
250-500 ms

Listener:
Response Time Graph

Seeded User Verification:
PASS / PARTIAL / FAIL

Response Contract Verification:
PASS / PARTIAL / FAIL

Runtime Isolation:
PASS / FAIL

Source DB Integrity:
PASS / FAIL / NOT_REQUIRED

Data Candidates:
FOUND / PARTIAL / NOT_FOUND

Proposed CSV:
test-data/auth-heavy-users-me.csv

Final CSV:
NOT_CREATED

JMX:
NOT_CREATED

Execution:
NOT_RUN

Data Review:
docs/test-data-reviews/spike-users-me-data-candidates.md

Workflow State:
TEST_DATA_REVIEW_REQUIRED / <actual>

Next Allowed Action:
Student Human Review of the verified AUTH_HEAVY / SPIKE dataset.

NO JMX.
NO JMETER.
NO JTL.
NO TASK 2.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.