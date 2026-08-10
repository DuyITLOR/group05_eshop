$playwright-feature-workflow

Workflow Mode:
EXECUTION_READINESS

Feature ID:
FR-09

Feature Name:
Discount coupons

Student ID:
23127107

Approved Test Count:
16

Implemented Playwright Test Count:
16

Current Automation:
tests/fr-09/fr-09.spec.js

External Data:
test-data/fr-09.json

Automation Plan:
docs/automation-plans/fr-09-automation-plan.md

Automation Review:
docs/automation-reviews/fr-09-ai-review.md

Automation Gaps:
docs/gaps/fr-09-automation-gaps.md

==================================================
PURPOSE
==================================================

Perform only FR-09 execution-readiness preparation.

Do NOT execute the FR-09 test suite.

Do NOT classify PRODUCT_DEFECT.

Do NOT create defect reports.

Do NOT publish GitHub Issues.

The goal is to prove that the environment is safe and deterministic enough
for the next approved multi-browser execution.

Stop at:

CHECKPOINT: FR09_EXECUTION_READINESS_REVIEW_REQUIRED

==================================================
1. EXISTING SUT SAFETY
==================================================

Inspect current frontend/backend processes first.

Do not restart a healthy process unnecessarily.

Important:

FR-09 stateful cases TC-010, TC-014 and TC-015 MUST NOT mutate:

backend/database.sqlite

or any other shared/workspace database.

The normal workspace DB is forbidden for FR-09 stateful execution.

Record its absolute path.

If readable, record a pre-readiness hash.

If hashing is unavailable because of a file lock, record:

HASH_NOT_AVAILABLE_DUE_FILE_LOCK

Do not terminate a healthy process merely to obtain a hash.

==================================================
2. VERIFY BACKEND DB PATH BEHAVIOR
==================================================

Inspect the backend implementation to determine exactly how SQLite path is
resolved when server.js starts.

Do not assume.

Determine whether the backend uses:

- __dirname-relative database.sqlite;
- process.cwd()-relative database.sqlite;
- explicit environment path;
- another mechanism.

Record the result.

The isolated-backend procedure must follow the implementation actually used.

==================================================
3. CREATE RUN-SPECIFIC ISOLATED BACKEND COPY
==================================================

Create a disposable runtime directory such as:

.runtime/fr-09/<readiness-id>/backend/

or another ignored/non-source-controlled runtime location.

Copy only what is necessary to start the backend safely.

The isolated backend must use its own:

database.sqlite

Do not point it to:

backend/database.sqlite

Set:

FR09_ISOLATED_DB=true

FR09_TEST_DB_PATH=<absolute isolated SQLite path>

Before starting the backend, verify:

FR09_TEST_DB_PATH != absolute workspace backend/database.sqlite

If the backend startup initializes/seeds its own SQLite database, document
that behavior.

Do not manually edit the workspace database.

==================================================
4. BACKEND STARTUP
==================================================

Start or validate the isolated backend according to the verified database
path behavior.

Target API:

http://localhost:3000

If port 3000 is already owned by the workspace backend and isolated FR-09
execution requires that port:

do NOT kill it blindly.

First identify the process.

Perform only a controlled replacement if required for the isolated runtime.

Record:

- original process state;
- isolated process PID;
- isolated backend path;
- isolated SQLite path.

The next execution phase must be able to restore/reuse the correct process
state safely.

==================================================
5. FRONTEND
==================================================

Use:

http://localhost:5173

Prefer reusing the existing healthy frontend.

Do not rebuild/restart it unnecessarily.

Verify frontend health only.

==================================================
6. AUTH CREDENTIAL READINESS
==================================================

FR-09 requires:

SUT_API_BASE_URL
FR09_TEST_USER_EMAIL
FR09_TEST_USER_PASSWORD

Credentials must remain runtime-only.

Do NOT write password or JWT into:

- source files;
- Markdown documents;
- JSON test data;
- AI audit logs.

Verify that the supplied/runtime test account can authenticate through:

POST /api/login

Verify only:

- HTTP success;
- JWT/token exists;
- user identity exists.

In readiness output redact secret values.

Example:

FR09_TEST_USER_EMAIL:
CONFIGURED

FR09_TEST_USER_PASSWORD:
CONFIGURED

JWT:
RECEIVED_NOT_PERSISTED

Do not print the password or token.

==================================================
7. STATEFUL FIXTURE SAFETY CHECK
==================================================

Statically/runtime-safely verify the guards for:

TC-010
TC-014
TC-015

Required:

FR09_ISOLATED_DB=true

FR09_TEST_DB_PATH points to isolated copy.

Fixture must reject the workspace DB path.

Verify the isolated DB contains the expected schema needed for:

coupons
coupon_usage
users

Do not execute the actual test mutations.

Do not pre-consume coupon usage.

==================================================
8. SEED ORACLES
==================================================

Verify only the required seed/readiness assumptions:

Coupons:

SAVE10
BIGBUY
VIP100
EXPIRED

Existing cart product:

Bàn phím cơ Keychron Q1
price = 4000000

Reserved absent coupon:

FR09-NOT-FOUND-7F3C

The reserved absent code must remain absent.

Do not insert it.

If an authoritative documented coupon is missing, stop with:

READINESS_BLOCKED_BY_SEED_STATE

==================================================
9. PLAYWRIGHT COLLECTION
==================================================

Set readiness environment:

FEATURE_ID=FR-09
STUDENT_ID=23127107
SUT_BASE_URL=http://localhost:5173
SUT_API_BASE_URL=http://localhost:3000

plus runtime auth/isolation variables.

Run collection only:

playwright test tests/fr-09/fr-09.spec.js --list

This is permitted in readiness.

Expected:

16 tests × 3 browser projects = 48 collected project-test combinations.

Verify:

Chromium: 16
Firefox: 16
WebKit: 16

No missing or duplicate FR09-TC IDs.

Do not execute tests.

==================================================
10. REPORT / EVIDENCE CONFIGURATION
==================================================

Verify:

FEATURE_ID:
FR-09

Student identity:
Run by: 23127107

HTML report title supports:

FR-09
Run by: 23127107
ISO timestamp
Run ID
browser project

Verify:

screenshot:
only-on-failure

trace:
retain-on-failure

video:
off

retries:
0

workers:
1 for FR-09

==================================================
11. FUTURE FAILURE-EVIDENCE POLICY
==================================================

Confirm that during execution every failure will retain:

- original Playwright screenshot;
- trace;
- HTML report entry;
- test result artifact.

Do not assign Defect IDs in readiness.

During execution:

PRODUCT_DEFECT candidates retain their original failure screenshot.

After human approval, promote that same screenshot to:

docs/defects/fr-09/screenshots/<DefectID>.png

Do not rerun the full suite only to obtain screenshots.

==================================================
12. TC-012 / TC-013 RUNTIME RISKS
==================================================

Preserve:

TC-012:
NEEDS_MORE_EVIDENCE

for same-document cart-preserving navigation.

TC-013:
NEEDS_MORE_EVIDENCE

for direct unauthenticated Checkout behavior across engines.

Readiness does not convert these into product defects.

They must be evaluated during browser execution.

==================================================
13. READINESS RESULT
==================================================

Return READY_FOR_EXECUTION only if all of these pass:

- frontend healthy;
- isolated backend is usable;
- isolated SQLite path verified;
- workspace DB protected;
- authentication readiness passes;
- required coupons present;
- reserved absent coupon remains absent;
- Keychron seed product matches expected price;
- 48 project-test combinations collect;
- report identity configuration valid;
- screenshot/trace evidence policy valid.

Otherwise return:

BLOCKED_FOR_EXECUTION

with exact blocker.

==================================================
14. OUTPUT
==================================================

Create:

docs/execution-readiness/fr-09-execution-readiness.md

Include:

1. Readiness Status
2. Frontend Status
3. Backend Status
4. Backend DB Path Resolution
5. Workspace DB Protection
6. Isolated Runtime Backend Path
7. Isolated SQLite Path
8. Authentication Status
9. Coupon Seed Verification
10. Product Seed Verification
11. Reserved Absent-Code Verification
12. Stateful Fixture Safety
13. Playwright Collection Result
14. Chromium Count
15. Firefox Count
16. WebKit Count
17. HTML Report Identity Verification
18. Screenshot Policy
19. Trace Policy
20. TC-012 Runtime Risk
21. TC-013 Runtime Risk
22. Execution Command Template
23. Cleanup / Restore Procedure
24. Current Checkpoint

Do not include credentials or JWT values.

==================================================
15. EXECUTION COMMAND TEMPLATE
==================================================

Prepare but DO NOT run browser commands.

Create safe command templates for separate runs:

Chromium
Firefox
WebKit

Each future run must have:

unique ISO RUN_TIMESTAMP
unique RUN_ID
FEATURE_ID=FR-09
STUDENT_ID=23127107
correct BROWSER_PROJECT

and separate:

HTML report path
test-results path

Do not execute them.

==================================================
16. AI AUDIT
==================================================

After readiness output use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected if A-011 is finalized and no other entry exists:

A-012

Artifact:
FR-09 Execution Readiness

Workflow Stage:
FR-09 runtime/isolation verification before multi-browser execution

Related Artifact:
docs/execution-readiness/fr-09-execution-readiness.md

Preserve exact verbatim prompt and original output.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: FR09_EXECUTION_READINESS_REVIEW_REQUIRED
