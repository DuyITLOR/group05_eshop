Resume HW05 Task 1.

We are intentionally finishing ALL Task 1 production execution work
before starting Task 2 analysis.

Current completed production scenario:

READ_HEAVY
GET /api/orders/:id
Scenario: LOAD
Listener: Summary Report
Status: COMPLETE
Approved run: run-002
Raw JTL: AVAILABLE

Do NOT start Task 2.

==================================================
NEXT PRODUCTION SCENARIO
==================================================

Group:

AUTH_HEAVY

Endpoint:

GET /api/users/me

Scenario:

SPIKE

Listener:

Response Time Graph

This mapping has already been Human-approved at project-matrix level.

==================================================
1. USE PERF SCENARIO DESIGNER
==================================================

Invoke:

$perf-scenario-designer

Create the production design for:

AUTH_HEAVY / SPIKE / GET /api/users/me

This interaction is DESIGN ONLY.

Do NOT:

- generate JMX;
- execute JMeter;
- create JTL;
- create HTML report;
- perform performance analysis;
- perform optimization;
- start Task 2.

==================================================
2. VERIFY AUTHORITATIVE IMPLEMENTATION
==================================================

Inspect current repository sources before designing.

At minimum inspect:

backend/server.js
backend/database.js
api_specification.md
README.md

and relevant existing HW05 project-matrix/workflow artifacts.

Verify from source:

- exact route;
- HTTP method;
- authentication middleware;
- expected success response;
- seeded user availability;
- current implementation behavior;
- any implementation/specification discrepancies.

Do not rely only on earlier notes if repository source differs.

==================================================
3. AUTH_HEAVY JUSTIFICATION
==================================================

Document why:

GET /api/users/me

is classified as:

AUTH_HEAVY

Base the justification on actual implementation.

Expected conceptual basis, only if source confirms it:

Bearer JWT verification
+
authenticated identity lookup

Do NOT describe this endpoint as login/password-hashing workload.

Do NOT claim password hashing, credential validation or account-lockout
logic is measured unless the route actually performs those operations.

==================================================
4. SPIKE DESIGN GOAL
==================================================

Design a true SPIKE workload.

The goal is to observe system behavior when authenticated traffic rises
very rapidly from a stable baseline to a substantially higher concurrent
load, remains briefly at the spike level, and then returns toward baseline.

Do NOT reuse the READ_HEAVY LOAD shape.

Do NOT convert the scenario into gradual Load or Stress testing.

==================================================
5. PROPOSE SPIKE PROFILE
==================================================

Propose a concrete SPIKE profile suitable for this local HW05 environment.

The profile must include:

- baseline VUs;
- baseline duration;
- spike ramp duration;
- spike VUs;
- spike hold duration;
- recovery/ramp-down behavior;
- total duration;
- expected concurrency timeline.

Prefer a short, clearly visible spike rather than a gradual progression.

Do not make unsupported capacity claims.

The profile is:

AI_PROPOSED

until Student Human Review.

Provide rationale for:

- why the baseline is large enough to establish normal behavior;
- why the spike is abrupt;
- why the spike level is materially larger than baseline;
- why the total duration is reasonable for a student-local environment.

==================================================
6. THINK TIME
==================================================

Propose realistic Think Time.

Use an appropriate JMeter Timer.

Document:

Timer Type
Minimum / Offset
Random component
Effective range
Scope

Do not silently reuse the LOAD Timer unless justified.

The Think Time must remain Human-reviewable.

==================================================
7. AUTHENTICATION STRATEGY
==================================================

The measured endpoint requires authenticated traffic if current source
confirms this.

Do NOT place a real JWT in:

- Git;
- JMX;
- CSV;
- audit;
- design examples.

Design token handling using an external property such as:

hw05.auth_token

Expected request header pattern:

Authorization: Bearer ${__P(hw05.auth_token,)}

if technically appropriate.

Require fail-closed behavior when token is missing.

Do not print token values.

==================================================
8. TOKEN PROVISIONING
==================================================

Token generation/login must happen OUTSIDE the measured SPIKE workload.

Design a preflight strategy that:

1. starts the approved disposable backend runtime if isolation is needed;
2. provisions or verifies a dedicated seeded user;
3. performs setup-only authentication;
4. extracts a temporary token;
5. verifies `/api/users/me`;
6. stores token only in temporary external properties;
7. deletes secret material after execution.

Login/setup traffic must NOT be counted as SPIKE samples for `/api/users/me`.

==================================================
9. DATA-DRIVEN REQUIREMENT
==================================================

HW05 requires a separate CSV for each endpoint group.

Propose a dedicated AUTH_HEAVY CSV.

Recommended path:

test-data/auth-heavy-users-me.csv

Do NOT create the final CSV yet.

Design the smallest meaningful schema based on actual endpoint behavior.

Because `/api/users/me` may not require request-specific business data,
the CSV may contain assertion/trace-driving fields rather than fake
request parameters.

Possible fields only if justified by source:

expected_user_id
expected_email
expected_name
auth_case
iteration_key

Do not invent values before verifying seeded data.

Explain clearly:

REQUEST_DRIVEN
ASSERTION_DRIVEN
TRACE_ONLY

semantics for each column.

==================================================
10. PRIMARY DATASET
==================================================

Primary measured SPIKE dataset should exercise the successful
authenticated path.

Do not mix negative cases such as:

401 missing token
403 authorization failure
invalid JWT
expired JWT

into the primary measured spike unless explicitly justified.

Negative/auth-failure testing may be documented separately but should not
distort the production SPIKE workload.

==================================================
11. ASSERTION DESIGN
==================================================

Design meaningful assertions for the measured request.

At minimum consider:

HTTP status exact success
valid JSON
required response fields
expected authenticated user identity
non-error response

Use exact field/value assertions only where source-backed data exists.

A response with:

401
403
500

must not be treated as successful performance traffic.

Do not make assertions so weak that any HTTP response becomes PASS.

==================================================
12. IMPLEMENTATION / SPEC CONFLICTS
==================================================

If current source and documentation differ:

record:

IMPLEMENTATION_SPEC_CONFLICT

Do not silently reconcile them.

The performance plan should measure actual current implementation while
keeping documented-contract discrepancies visible.

==================================================
13. SPIKE-SPECIFIC OBSERVABILITY
==================================================

Design the scenario so later analysis can distinguish:

baseline behavior
spike transition
spike plateau
recovery

Where practical, preserve timing/profile information that allows Task 2
to segment the raw JTL by spike stage.

Do not perform that analysis now.

==================================================
14. LISTENER
==================================================

Primary required listener:

Response Time Graph

It must remain distinct from:

READ_HEAVY / LOAD:
Summary Report

TRANSACTIONAL / STRESS:
Aggregate Report

Do not add unnecessary GUI listeners.

Document that final project-level listener uniqueness must be rechecked
after all three production JMX files exist.

==================================================
15. ENVIRONMENT / RESOURCE EVIDENCE
==================================================

Reuse the proven execution-evidence strategy conceptually:

- backend PID;
- CPU;
- memory;
- timestamps;
- hardware/runtime context;
- JMeter logs;
- preflight/postflight;
- resource monitor continuity.

The remediated resource monitor from READ_HEAVY may be reused if
compatible.

Do not execute it in this design interaction.

==================================================
16. ISOLATION STRATEGY
==================================================

Determine whether `/api/users/me` can safely use the existing approved
DISPOSABLE_BACKEND_RUNTIME_COPY strategy.

Prefer reuse if compatible because it already protects:

backend/database.sqlite

from execution-side mutation.

Verify rather than assume.

Document:

Runtime Isolation:
<strategy>

Source Database Mutation Risk:
<assessment>

==================================================
17. FILE OUTPUT
==================================================

Create a clean production design artifact:

docs/performance-design/spike-users-me-design.md

Do NOT reuse or overwrite the old unrelated:

docs/performance-design/spike-forgot-password-design.md

That old file is not the production AUTH_HEAVY scenario.

Main narrative:
Vietnamese

Technical headings, identifiers, enums and paths:
English where appropriate.

Recommended structure:

# AUTH_HEAVY SPIKE — GET /api/users/me

## 1. Scenario Identity
## 2. Source Verification
## 3. AUTH_HEAVY Classification
## 4. SPIKE Objective
## 5. Proposed Workload Profile
## 6. Think Time
## 7. Authentication Strategy
## 8. Test Data Strategy
## 9. Assertions
## 10. Listener
## 11. Runtime Isolation and Preflight
## 12. Resource Evidence Strategy
## 13. Risks / Implementation-Spec Conflicts
## 14. Assumptions and Limitations
## 15. Student Human Review

==================================================
18. HUMAN REVIEW CHECKPOINT
==================================================

Do not self-approve the proposed SPIKE profile.

At the end record:

Review Status:
PENDING_HUMAN_REVIEW

Student Decision:
NOT_REVIEWED

Profile Decision:
NOT_REVIEWED

Data Decision:
NOT_REVIEWED

JMX:
NOT_CREATED

Execution:
NOT_RUN

==================================================
19. WORKFLOW
==================================================

Update:

docs/workflow/hw05-performance-workflow-status.md

to represent that AUTH_HEAVY / SPIKE production design now requires
Student Human Review.

Use the workflow's canonical equivalent of:

PERFORMANCE_DESIGN_REVIEW_REQUIRED

Do not disturb the already-completed READ_HEAVY / LOAD evidence.

Do not mark Task 1 complete.

==================================================
20. AI AUDIT
==================================================

DO NOT modify:

docs/ai-audit/

in this interaction.

The design interaction will receive a dedicated audit step separately
after Student Human Review.

Do not create or update an audit entry now.

==================================================
21. GIT
==================================================

DO NOT COMMIT.

DO NOT PUSH.

Wait for Student Human Review of the SPIKE design.

==================================================
22. FINAL OUTPUT
==================================================

Return:

AUTH_HEAVY SPIKE — DESIGN

Endpoint:
GET /api/users/me

Group:
AUTH_HEAVY

Scenario:
SPIKE

Listener:
Response Time Graph

Source Verification:
PASS / PARTIAL / FAIL

Authentication Verified:
PASS / FAIL

AUTH_HEAVY Classification:
SUPPORTED / NOT_SUPPORTED

Proposed SPIKE Profile:
<concise timeline>

Proposed Think Time:
<actual>

Token Strategy:
<actual>

Runtime Isolation:
<actual>

CSV Proposal:
<path>

CSV Schema:
<actual>

Primary Dataset:
SUCCESS_PATH_ONLY / <actual>

Assertions:
<summary>

Implementation-Spec Conflicts:
<number>

Resource Evidence Strategy:
DEFINED / PARTIAL

Design:
docs/performance-design/spike-users-me-design.md

JMX:
NOT_CREATED

Execution:
NOT_RUN

Human Review:
PENDING

Workflow State:
PERFORMANCE_DESIGN_REVIEW_REQUIRED / <actual>

Next Allowed Action:
Student Human Review of AUTH_HEAVY / SPIKE design, proposed profile and
test-data strategy.

NO JMX.
NO JMETER.
NO JTL.
NO TASK 2.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.