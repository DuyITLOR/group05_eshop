$playwright-feature-workflow

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
EXECUTION_READINESS

Feature ID:
FR-17

Feature Name:
Coupon management

Student ID:
23127107

Primary Demo Feature:
YES

Approved Test Count:
16

Current Checkpoint:
CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED

Precondition:

A-016 must already be FINALIZED with:

Verdict:
INCOMPLETE

Student Decision:
MODIFIED

Verification Result:
PASSED

Approval Status:
APPROVED

If A-016 is not finalized accordingly, STOP.

==================================================
PURPOSE
==================================================

Prepare and verify FR-17 runtime execution readiness.

This phase may:

- inspect/start/reuse required local SUT processes;
- create a run-specific isolated backend copy;
- verify isolated SQLite state;
- perform controlled login/auth readiness checks;
- verify Playwright test collection;
- verify report/config/evidence policy.

This phase must NOT:

- execute any FR17-TC-xxx browser test;
- execute Chromium/Firefox/WebKit test runs;
- mutate coupon state for business-test execution;
- generate product defect verdicts;
- create Bug Reports;
- assign FR17-BUG IDs;
- runtime-verify the demo script fix by executing TC-004.

Stop at:

CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED

==================================================
1. RUNTIME TARGETS
==================================================

Verify/reuse the project Web Admin and backend runtime.

Expected Web Admin target:

http://localhost:5174

Expected backend target:

http://localhost:3000

Do not blindly restart a healthy frontend.

For every relevant process record:

- URL
- HTTP health/result
- PID
- whether reused or started by this readiness phase

Do not kill unrelated processes.

==================================================
2. ISOLATED BACKEND ARCHITECTURE
==================================================

FR-17 stateful tests must never use the workspace database:

backend/database.sqlite

Reuse the proven isolation architecture:

create a run-specific runtime directory under:

.runtime/fr-17/

Example concept:

.runtime/fr-17/<readiness-run-id>/backend/

Copy the backend into that run-specific directory.

The backend must run from the copied backend directory so its relative:

database.sqlite

resolves to the isolated copy.

Do NOT assume FR17_TEST_DB_PATH changes backend DB resolution.

FR17_TEST_DB_PATH is a fixture safety/verification value only.

==================================================
3. WORKSPACE DB PROTECTION
==================================================

Resolve the workspace DB absolute path:

backend/database.sqlite

Before readiness:

attempt to record SHA-256 if the file is readable.

If temporarily locked, document:

HASH_NOT_AVAILABLE_BEFORE_RUNTIME

rather than invent a value.

After isolated runtime preparation, verify the workspace DB has not changed.

If a before hash exists:

after hash must be identical.

Do not knowingly run destructive backend initialization against the workspace
database.

==================================================
4. ISOLATED DB PATH
==================================================

Record exact:

- isolated backend directory;
- isolated database.sqlite path;
- workspace database.sqlite forbidden path.

The isolated DB must:

- exist;
- resolve outside the workspace backend database;
- be served by the isolated backend process;
- satisfy the FR17 fixture safety guard.

Set readiness/runtime variables conceptually including:

FR17_ISOLATED_DB=true

FR17_TEST_DB_PATH=<exact isolated database path>

FR17_RUN_ID=<readiness run ID>

Do not persist secrets.

==================================================
5. BACKEND STARTUP BEHAVIOR
==================================================

Inspect/confirm current backend database startup behavior before launch.

If backend startup initializes/drops/recreates/seeds its local database,
document this explicitly.

This is acceptable only because the process is launched from the isolated
backend copy.

Do not launch the copied backend until its path has been verified as isolated.

==================================================
6. EXACT COUPON BASELINE
==================================================

Verify the isolated coupons table baseline.

Expected exact coupon record count:

4

Expected exact code set:

SAVE10
BIGBUY
VIP100
EXPIRED

Verify:

- no additional coupon records exist;
- no missing expected seed exists.

Record relevant values if useful for traceability, but do not expose unrelated
sensitive information.

This readiness check is read-only after initialization.

==================================================
7. REQUIRED SCHEMA
==================================================

Verify required database structures needed by FR-17.

At minimum confirm relevant tables/columns exist for:

coupons

and authentication/user-role setup as required.

Confirm coupon fields required by fixtures exist:

code
type
discount_value
min_order_amount
expired_at
max_uses_per_user

Do not modify schema.

==================================================
8. ADMIN AUTH READINESS
==================================================

Runtime-only required credentials:

FR17_TEST_ADMIN_EMAIL
FR17_TEST_ADMIN_PASSWORD

Supporting backend URL:

SUT_API_BASE_URL

Perform a controlled login readiness check.

Requirements:

- login succeeds;
- token/JWT is returned;
- returned user identity exists;
- returned role is exactly:
  admin

Do NOT print:

password
JWT

Do NOT persist the token to source-controlled files.

Record only safe metadata such as:

HTTP status
role verification result
identity presence

==================================================
9. NON-ADMIN AUTH READINESS
==================================================

Runtime-only:

FR17_TEST_USER_EMAIL
FR17_TEST_USER_PASSWORD

Perform controlled login readiness verification.

Requirements:

- login succeeds;
- valid token returned;
- identity exists;
- role is NOT admin.

Prefer expected current seed role:

user

but the authorization fixture requirement is fundamentally:

role != admin

Do not print or persist JWT/password.

==================================================
10. WEB ADMIN READINESS
==================================================

Verify the Web Admin endpoint is healthy.

Do not execute FR17-TC-001 or any browser test.

Do not use Playwright browser navigation for business execution.

If a simple HTTP availability check is possible, use it.

Record:

FR17_ADMIN_BASE_URL

for future execution.

Expected:

http://localhost:5174

unless current repository/runtime proves another configured URL.

==================================================
11. RUNTIME ENVIRONMENT INVENTORY
==================================================

Verify all future variables required by the suite are resolvable:

FEATURE_ID=FR-17

STUDENT_ID=23127107

SUT_API_BASE_URL

FR17_ADMIN_BASE_URL

FR17_TEST_ADMIN_EMAIL

FR17_TEST_ADMIN_PASSWORD

FR17_TEST_USER_EMAIL

FR17_TEST_USER_PASSWORD

FR17_RUN_ID

FR17_ISOLATED_DB=true

FR17_TEST_DB_PATH

Do not write secret values into Markdown.

Use statuses:

PRESENT
MISSING

for secret variables.

==================================================
12. PLAYWRIGHT CONFIG READINESS
==================================================

Verify statically:

Projects:

chromium
firefox
webkit

For FEATURE_ID=FR-17:

workers = 1

retries = 0

screenshot = only-on-failure

trace = retain-on-failure

video = off

Verify FR-17 behavior does not break FR-05/FR-09 configuration.

==================================================
13. TEST COLLECTION
==================================================

Use collection-only Playwright validation.

Windows / PowerShell environment:

use:

npx.cmd

Run a command equivalent to:

npx.cmd playwright test tests/fr-17/fr-17.spec.js --list

with FEATURE_ID=FR-17 configured.

This MUST NOT launch browsers.

Expected collection:

16 FR-17 tests
×
3 browser projects
=
48 project-test definitions

Verify:

- exactly 16 unique FR17-TC IDs;
- no missing IDs;
- no duplicate IDs;
- Chromium collects 16;
- Firefox collects 16;
- WebKit collects 16.

If collection differs, STOP readiness.

==================================================
14. DEMO TEST COLLECTION
==================================================

Validate collection only for:

@demo

Use a command equivalent to:

npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo" --list

Expected:

FR17-TC-004

and exactly:

1 Test Case
×
3 projects
=
3 collected project-test definitions

No browser may launch.

Record:

Demo Command Collection:
PASS | FAIL

Do NOT mark runtime demo verification PASS.

Keep:

Demo Runtime Status:
NOT_EXECUTED

==================================================
15. DEMO SCRIPT FIX READINESS
==================================================

The primary preserved demo script correction is:

FR-17 getCouponRow relative-locator correction

Type:

TEST_SCRIPT_CORRECTION

Readiness must statically confirm the corrected helper is the version imported
by:

FR17-TC-004 @demo

Do NOT execute TC-004.

Record:

DEMO_FIX Static Wiring:
VERIFIED

DEMO_FIX Runtime Verification:
PENDING

This runtime verification must happen naturally during the approved
three-browser execution.

==================================================
16. LOCATOR STATIC CHECK
==================================================

Confirm corrected getCouponRow uses valid row-relative `has` composition.

Confirm:

- row scope originates from coupon table rows;
- inner exact-code locator is relative to each row;
- no ancestor-table locator is embedded as the `has` target;
- no positional nth() fallback was introduced.

Do not open a browser.

==================================================
17. TC-005 STATIC CHECK
==================================================

Verify generated code now satisfies:

Before duplicate attempt:
SAVE10 count = 1

After:
SAVE10 count = 1

Total coupon count unchanged.

Ensure no code path expects:

SAVE10 count = 0

==================================================
18. TC-002 STATIC CHECK
==================================================

Verify the implementation requires:

- associated visible field label/labelled element;
- visible text includes `*`.

Ensure:

plain aria-label text alone
or
hidden associated text

cannot create a false PASS.

Do not weaken the requirement.

==================================================
19. STATEFUL FIXTURE GUARDS
==================================================

Validate the direct fixture guards without mutating data.

Confirm:

- FR17_ISOLATED_DB=true required;
- FR17_TEST_DB_PATH required;
- path must exist;
- workspace database path rejected;
- exact four-seed baseline can be checked;
- owned cleanup targets exact controlled code;
- TC-014 inserts only controlled data.

Do not run INSERT/DELETE operations in readiness.

==================================================
20. TEST-ORDER SAFETY
==================================================

Statically verify:

TC-003 does not create state consumed by TC-004.

TC-004 does not create state consumed by TC-014.

TC-014 receives its own setup.

TC-005 never deletes SAVE10.

TC-006–013 cleanup only their own potential invalid residues.

No test-order dependency.

==================================================
21. REPORT IDENTITY READINESS
==================================================

Verify current HTML reporter configuration can produce visible identity
metadata containing:

FR-17

Run by: 23127107

ISO timestamp

Run ID

browser identity

Do not generate execution HTML reports yet.

If report title/environment metadata requires runtime environment variables,
document exact variables that execution must set.

==================================================
22. FUTURE EXECUTION DIRECTORY PLAN
==================================================

Prepare but do not populate browser-run evidence directories.

Future execution should use distinct paths per browser/run, such as:

html-reports/fr-17/<run-id>/

test-results/fr-17/<run-id>/

Do not overwrite FR-05/FR-09 evidence.

Do not create fake HTML results.

==================================================
23. FAILURE EVIDENCE POLICY
==================================================

Verify configuration supports:

screenshot:
only-on-failure

trace:
retain-on-failure

video:
off

During future A-018:

original failure screenshot and trace are authoritative execution evidence.

Do not plan reruns solely for screenshot collection.

Candidate screenshots will only be promoted after human defect review.

==================================================
24. READINESS DOCUMENT
==================================================

Create:

docs/execution-readiness/fr-17-execution-readiness.md

Include:

- readiness timestamp/run ID;
- process inventory;
- frontend status;
- isolated backend status;
- isolated backend directory;
- isolated DB path;
- workspace forbidden DB path;
- workspace DB protection result;
- backend DB resolution behavior;
- schema result;
- exact coupon baseline result;
- admin auth result;
- non-admin auth result;
- secret environment presence status;
- Playwright collection result;
- per-browser collected count;
- @demo collection result;
- DEMO_FIX static wiring;
- report identity readiness;
- evidence policy;
- unresolved runtime-only risks;
- cleanup instructions.

==================================================
25. CLEANUP POLICY
==================================================

Do not automatically destroy the isolated backend after successful readiness.

The intent is to reuse the same verified isolated runtime for A-018 if safe.

Record:

- isolated backend PID;
- isolated backend path;
- isolated DB path.

Before later execution:

verify the same PID/path is still active.

After FR-17 execution is complete:

only stop a process if its PID still matches the readiness-owned isolated
backend process.

Do not automatically restart the workspace backend afterward if doing so would
reset its database.

==================================================
26. READINESS GATES
==================================================

READY_FOR_EXECUTION only if all mandatory gates pass:

- A-016 approved;
- Web Admin healthy;
- isolated backend healthy;
- isolated DB path safe;
- workspace DB protected;
- exact coupon seed baseline PASS;
- required schema PASS;
- Admin auth PASS;
- non-admin auth PASS;
- 48 project-test definitions collected;
- exactly 16 unique FR17-TC IDs;
- 3 @demo project-test definitions collected;
- FR17-TC-004 is sole @demo;
- DEMO_FIX corrected helper statically wired;
- workers=1;
- evidence policy correct;
- report identity configuration ready.

If any mandatory runtime/setup issue exists:

return:

NOT_READY_FOR_EXECUTION

Do not attempt browser tests.

==================================================
27. NO PRODUCT DEFECT CLASSIFICATION
==================================================

Even though source inspection suggests potential implementation
discrepancies, do not classify any:

PRODUCT_DEFECT

in readiness.

Examples still requiring runtime evidence include:

- missing visible required `*`;
- invalid coupon validation;
- non-admin authorization.

Keep them:

IMPLEMENTATION_ONLY
or
RUNTIME_VERIFICATION_REQUIRED

until A-018.

==================================================
28. RETURN
==================================================

Return:

1. Readiness Status
2. Web Admin Status
3. Web Admin URL
4. Web Admin PID
5. Backend Status
6. Backend PID
7. Isolated Backend Directory
8. Isolated DB Path
9. Workspace DB Forbidden Path
10. Workspace DB Protection Result
11. Exact Coupon Baseline Result
12. Required Schema Result
13. Admin Auth Result
14. Non-Admin Auth Result
15. Runtime Environment Result
16. Total Test Case IDs
17. Chromium Collected
18. Firefox Collected
19. WebKit Collected
20. Total Project-Test Definitions
21. Demo Test ID
22. Demo Project-Test Definitions
23. Demo Command Collection Result
24. DEMO_FIX Candidate
25. DEMO_FIX Static Wiring
26. DEMO_FIX Runtime Verification
27. Workers Result
28. Evidence Policy Result
29. Report Identity Readiness
30. Browser Execution Performed
31. Database Business Mutation Performed
32. Readiness Document
33. AI Audit Artifact
34. Current Checkpoint

Expected if healthy:

Readiness Status:
READY_FOR_EXECUTION

Total Test Case IDs:
16

Chromium Collected:
16

Firefox Collected:
16

WebKit Collected:
16

Total Project-Test Definitions:
48

Demo Test ID:
FR17-TC-004

Demo Project-Test Definitions:
3

Demo Command Collection Result:
PASS

DEMO_FIX Static Wiring:
VERIFIED

DEMO_FIX Runtime Verification:
PENDING

Browser Execution Performed:
NO

Database Business Mutation Performed:
NO

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After readiness completion use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected if A-016 is finalized and no intervening artifact exists:

A-017

If sequence differs, use actual next ID.

Artifact:
FR-17 Execution Readiness and Demo Runtime Preparation

Workflow Stage:
FR-17 isolated runtime and Playwright collection verification before
multi-browser execution

Feature / Task:
FR-17 — Coupon management

Related Artifacts:

docs/execution-readiness/fr-17-execution-readiness.md
tests/fr-17/
test-data/fr-17.json
docs/demo/fr-17-demo-plan.md

Preserve exact prompt:

docs/ai-audit/interactions/<Artifact-ID>-prompt.md

Preserve original output:

docs/ai-audit/interactions/<Artifact-ID>-output.md

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

CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED

