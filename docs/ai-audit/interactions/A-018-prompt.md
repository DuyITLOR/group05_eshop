$playwright-feature-workflow

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
ADAPTIVE_MULTI_BROWSER_EXECUTION

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
CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED

Precondition:

A-017 must already be FINALIZED with:

Verdict:
VALID

Student Decision:
ACCEPTED

Verification Result:
PASSED

Approval Status:
APPROVED

Readiness Status:
READY_FOR_EXECUTION

If not, STOP.

==================================================
PURPOSE
==================================================

Execute the complete approved FR-17 Playwright suite across:

1. Chromium
2. Firefox
3. WebKit

using adaptive failure triage.

Perform:

- runtime preflight;
- Chromium execution;
- Chromium triage;
- evidence preservation;
- isolated DB verification;
- Firefox execution if gate permits;
- Firefox triage;
- evidence preservation;
- isolated DB verification;
- WebKit execution if gate permits;
- WebKit triage;
- evidence preservation;
- cross-browser comparison;
- DEMO_FIX runtime verification;
- demo candidate runtime assessment;
- rendered HTML report verification;
- execution documentation;
- AI Audit CREATE_ENTRY.

Do NOT:

- modify SUT source;
- change approved Test Cases;
- weaken assertions to obtain PASS;
- rerun failures merely for screenshots;
- assign FR17-BUG IDs;
- create final Bug Reports;
- publish GitHub Issues.

Stop at:

CHECKPOINT: FR17_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

==================================================
1. READINESS RUNTIME TO REUSE
==================================================

Reuse the verified readiness runtime if still valid.

Web Admin:

URL:
http://localhost:5174

Expected PID:
21808

Isolated Backend:

URL:
http://localhost:3000

Expected PID:
34940

Expected Isolated Backend Directory:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend

Expected Isolated DB:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend\database.sqlite

Workspace Forbidden DB:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite

Expected Workspace DB SHA-256:

2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02

==================================================
2. PRE-EXECUTION GATE
==================================================

Before running any browser test verify:

- Web Admin URL is healthy;
- if PID can be verified, it remains PID 21808;
- backend URL is healthy;
- backend is still the isolated backend;
- if PID can be verified, it remains PID 34940;
- isolated backend directory still exists;
- isolated database still exists;
- isolated DB path is not workspace DB;
- exact coupon baseline is still exactly four records:
  SAVE10
  BIGBUY
  VIP100
  EXPIRED
- no extra coupon record exists;
- Admin runtime credentials are present;
- non-admin runtime credentials are present;
- Admin login still verifies role=admin;
- non-admin login still verifies role!=admin;
- workspace database hash remains unchanged.

If the readiness-owned isolated backend is gone or another process has
replaced it:

STOP.

Do not silently use the workspace backend.

Return:

FR17_RUNTIME_REVALIDATION_REQUIRED

==================================================
3. EXECUTION ENVIRONMENT
==================================================

Use runtime-only values for:

FEATURE_ID=FR-17

STUDENT_ID=23127107

SUT_API_BASE_URL=http://localhost:3000

FR17_ADMIN_BASE_URL=http://localhost:5174

FR17_TEST_ADMIN_EMAIL
FR17_TEST_ADMIN_PASSWORD

FR17_TEST_USER_EMAIL
FR17_TEST_USER_PASSWORD

FR17_ISOLATED_DB=true

FR17_TEST_DB_PATH=
D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend\database.sqlite

Do not print secret values.

Do not persist JWTs.

For every browser create a unique:

FR17_RUN_ID
RUN_ID
RUN_TIMESTAMP

Use ISO-derived values.

==================================================
4. SAVE-FIRST EXECUTION POLICY
==================================================

After each browser command finishes, immediately preserve:

- Run ID
- timestamp
- raw execution outcome
- total
- passed
- failed
- skipped
- HTML report directory
- Playwright result directory
- original screenshot paths
- trace paths

before performing lengthy triage.

Do not keep critical execution information only in terminal context.

==================================================
5. DISTINCT RUN DIRECTORIES
==================================================

Every browser requires separate immutable output paths.

Conceptually:

html-reports/fr-17/<browser-run-id>/

test-results/fr-17/<browser-run-id>/

Never reuse a prior browser directory.

Never overwrite FR-05 or FR-09 evidence.

==================================================
6. CHROMIUM EXECUTION
==================================================

Run only Chromium first.

Use Windows-compatible:

npx.cmd

Execute:

tests/fr-17/fr-17.spec.js

project:

chromium

Expected test count:

16

Do not enable retries.

Do not enable video.

Do not use headed mode solely for evidence.

After completion create:

docs/execution-results/fr-17-chromium-execution.md

==================================================
7. FAILURE CLASSIFICATION
==================================================

Classify every failed Test Case into exactly one:

PRODUCT_DEFECT_CANDIDATE

AUTOMATION_DEFECT

ENVIRONMENT_FAILURE

NEEDS_MORE_EVIDENCE

Do not classify from source-code suspicion alone.

Use actual runtime evidence.

For every classification record:

- Test Case ID;
- failure phase;
- Expected Result;
- observed runtime behavior;
- assertion/error;
- screenshot path;
- trace path;
- classification;
- confidence;
- reasoning.

==================================================
8. AUTOMATION-DEFECT GATE
==================================================

If Chromium contains any:

AUTOMATION_DEFECT

or:

ENVIRONMENT_FAILURE

do NOT run Firefox.

Stop at:

CHECKPOINT: FR17_CHROMIUM_AUTOMATION_REVIEW_REQUIRED

Do not automatically repair and rerun.

Human review is required.

==================================================
9. PRODUCT DEFECT CANDIDATE POLICY
==================================================

A runtime assertion failure may be:

PRODUCT_DEFECT_CANDIDATE

only when:

- setup completed correctly;
- isolation is valid;
- required UI was reached;
- locator/assertion behavior is trustworthy;
- failure reflects an approved requirement;
- cleanup did not invalidate the result.

Do not assign final:

FR17-BUG-xxx

during execution.

==================================================
10. TC-002 SPECIAL TRIAGE
==================================================

FR17-TC-002 checks visible required-field `*` indicators.

Static implementation inspection suggested this requirement may currently be
missing.

Do NOT auto-classify based on that inspection.

At runtime verify:

- Coupon Management reached successfully;
- each target field was resolved correctly;
- requirement-aware visible-label association logic executed;
- missing visible `*` is the actual reason for failure.

If so:

PRODUCT_DEFECT_CANDIDATE

If field identity/association cannot be established due an automation
implementation problem:

AUTOMATION_DEFECT

Keep the distinction explicit.

==================================================
11. TC-003 / TC-004 VALID CREATE
==================================================

For both valid CREATE tests verify runtime evidence shows:

- isolated baseline established;
- owned code absent initially;
- form values filled;
- successful business create;
- corrected getCouponRow locates exact owned row;
- submitted values observable;
- cleanup exact owned code succeeds.

Do not classify an HTTP/UI failure automatically.

Triage the actual boundary.

==================================================
12. TC-004 DEMO TEST
==================================================

FR17-TC-004 is:

PRIMARY_DEMO_CANDIDATE

and:

@demo

Record separately for every browser:

TC-004 Setup:
PASS | FAIL

TC-004 Primary Assertion:
PASS | FAIL

TC-004 Cleanup:
PASS | FAIL

TC-004 Overall:
PASS | FAIL

This test is also the runtime exercise for the preserved:

getCouponRow relative-locator correction.

==================================================
13. DEMO_FIX RUNTIME VERIFICATION
==================================================

Preserved correction:

FR-17 getCouponRow relative-locator correction

Type:

TEST_SCRIPT_CORRECTION

The original AI-generated locator was corrected before runtime.

Do not claim runtime verification merely because the browser suite launched.

For a browser, DEMO_FIX verification requires at least:

- TC-004 successfully creates its owned coupon;
- TC-004 uses the corrected getCouponRow path;
- owned row is found;
- row assertions succeed;
- failure is not hidden by another locator path.

If TC-004 PASSes through those assertions:

record:

DEMO_FIX_RUNTIME_VERIFIED_<BROWSER>

If TC-004 PASSes on:

Chromium
Firefox
WebKit

record:

DEMO_FIX Runtime Verification:
VERIFIED_MULTI_BROWSER

If TC-004 fails for an unrelated product defect before exercising the row
assertion:

do NOT claim full runtime verification.

Use:

PARTIALLY_VERIFIED
or
NOT_VERIFIED

with reasoning.

==================================================
14. TC-005 DUPLICATE CODE
==================================================

Runtime oracle must remain:

Before:
SAVE10 = 1

After:
SAVE10 = 1

Total coupon count:
unchanged

Never expect SAVE10 count=0.

If the test failure comes from the corrected test logic itself, classify:

AUTOMATION_DEFECT

If the SUT actually creates/duplicates a second SAVE10 despite correct setup,
classify using requirement evidence.

==================================================
15. TC-006 THROUGH TC-013
==================================================

For negative create tests:

Accept any conforming rejection mechanism.

A test may PASS when:

- browser native validation blocks submit;

or:

- backend/UI rejects submit;

provided the invalid business record is not created.

Do not require POST occurrence unless that Test Case explicitly requires it.

If the current SUT creates an invalid record:

- capture the original failure;
- classify only after confirming assertion/setup correctness;
- cleanup the exact residue in finally;
- do not let the invalid residue contaminate the next Test Case.

==================================================
16. TC-014 DELETE
==================================================

Confirm:

fixture inserts exactly one owned coupon

then UI:

1 -> 0

Seed coupons must remain intact.

If setup record does not appear because the browser is connected to a
different DB/backend:

ENVIRONMENT_FAILURE

or:

AUTOMATION_DEFECT

depending the evidence.

Do not misclassify isolation mismatch as a product Delete defect.

==================================================
17. TC-015 UNAUTHENTICATED
==================================================

Use fresh context.

No JWT.

Evaluate mechanism-neutral requirement:

unauthenticated actor must not obtain usable Coupon Management functionality.

Do not require exact redirect URL.

==================================================
18. TC-016 NON-ADMIN
==================================================

Confirm runtime setup proves:

valid token exists

role != admin

no Admin token contamination

Then evaluate:

non-admin actor must not obtain usable Coupon Management functionality.

Static source suggested missing server-side role protection.

Do NOT auto-classify from source.

Runtime evidence decides.

==================================================
19. CHROMIUM FAILURE SCREENSHOT PRESERVATION
==================================================

Playwright configuration already captures original failure screenshots.

Do not recapture them.

For Chromium failures classified:

PRODUCT_DEFECT_CANDIDATE

copy the original screenshot byte-for-byte into:

docs/defects/fr-17/candidate-screenshots/<TestCaseID>.png

Create/update:

docs/defects/fr-17/candidate-screenshots/README.md

Record:

Test Case ID
source Run ID
source browser
original screenshot path
candidate screenshot path
classification
hash/byte-identity result if practical

Do not assign Bug IDs.

Do not copy screenshots for:

AUTOMATION_DEFECT

ENVIRONMENT_FAILURE

unless explicitly retained only as automation diagnostic evidence outside the
product candidate directory.

==================================================
20. POST-CHROMIUM DATABASE GATE
==================================================

After Chromium verify exact isolated coupon baseline is restored:

Count:
4

Codes:
SAVE10
BIGBUY
VIP100
EXPIRED

No FR17-owned residue.

If baseline is not restored:

classify cleanup problem as:

AUTOMATION_DEFECT

and STOP.

Also verify workspace DB SHA-256 is still:

2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02

Any workspace DB change:

STOP IMMEDIATELY.

==================================================
21. FIREFOX EXECUTION
==================================================

Proceed only if Chromium contains:

no AUTOMATION_DEFECT

and:

no ENVIRONMENT_FAILURE

and isolated DB baseline/workspace protection pass.

Run all 16 tests using:

project=firefox

Create independent Run ID/results/report.

Create:

docs/execution-results/fr-17-firefox-execution.md

Apply the same failure triage.

Do not automatically copy duplicate candidate screenshots when the same
product candidate already has a Chromium primary screenshot.

Preserve Firefox originals in the run-specific evidence.

If Firefox reveals a browser-specific candidate not present in Chromium,
record it explicitly and preserve its original failure screenshot.

==================================================
22. POST-FIREFOX GATE
==================================================

Again verify:

exact isolated baseline:
4 records

exact code set:
SAVE10
BIGBUY
VIP100
EXPIRED

workspace DB hash:
unchanged

No automation/environment blocker.

Only then proceed to WebKit.

==================================================
23. WEBKIT EXECUTION
==================================================

Run all 16 tests using:

project=webkit

Create independent Run ID/results/report.

Create:

docs/execution-results/fr-17-webkit-execution.md

Apply identical classification rules.

Preserve all original screenshots/traces.

==================================================
24. FINAL DATABASE SAFETY
==================================================

After WebKit verify:

isolated baseline count:
4

exact seed code set:
PASS

FR17-owned residue:
None

workspace DB hash:
unchanged

isolated backend:
still healthy

Record the final safety state.

==================================================
25. HTML REPORT VERIFICATION
==================================================

For each browser HTML report verify the rendered report visibly contains:

FR-17

Run by: 23127107

ISO timestamp

Run ID

browser identity

Use:

PASS_RENDERED

only after actual rendered/report content verification.

Do not infer it only from config.

Record result independently for:

Chromium
Firefox
WebKit

==================================================
26. CROSS-BROWSER SUMMARY
==================================================

Create:

docs/execution-results/fr-17-cross-browser-summary.md

Include:

per-browser:

- Run ID;
- timestamp;
- duration;
- total;
- passed;
- failed;
- skipped;
- failed Test Case IDs;
- failure classifications;
- screenshot count;
- trace count;
- HTML report verification;
- DB cleanup result.

Compare failure sets:

IDENTICAL

PARTIALLY_OVERLAPPING

BROWSER_SPECIFIC

Do not deduplicate into final Bug IDs yet.

==================================================
27. DEMO PLAN RUNTIME UPDATE
==================================================

Update:

docs/demo/fr-17-demo-plan.md

Record actual TC-004 result for:

Chromium
Firefox
WebKit

If TC-004 passes all three and the corrected row locator is actually
exercised:

Primary Demo Test:
FR17-TC-004

Final Selected Demo Test:
FR17-TC-004

Demo Test Runtime Status:
VERIFIED_MULTI_BROWSER

DEMO_FIX Runtime Verification:
VERIFIED_MULTI_BROWSER

Do not run the separate --grep @demo recording command now.

That command remains for later video recording.

If TC-004 does not pass cleanly on all three:

Final Selected Demo Test:
PENDING_HUMAN_REVIEW

Do not automatically move @demo to another test.

==================================================
28. ORIGINAL EVIDENCE IMMUTABILITY
==================================================

Never modify:

original failure screenshots
trace.zip files
HTML execution reports
raw Playwright result directories

Candidate screenshot copies are derivative references only.

No recapture.

No rerun solely for screenshots.

==================================================
29. NO AUTOMATIC TEST FIXING
==================================================

If an AUTOMATION_DEFECT appears:

do not modify the test during this phase.

Do not silently fix then rerun.

Stop for human review.

This preserves the AI-first/human-review audit trail.

==================================================
30. EXECUTION RESULT FILES
==================================================

Expected:

docs/execution-results/fr-17-chromium-execution.md

docs/execution-results/fr-17-firefox-execution.md

docs/execution-results/fr-17-webkit-execution.md

docs/execution-results/fr-17-cross-browser-summary.md

docs/defects/fr-17/candidate-screenshots/README.md
if product candidates exist

No final Bug Report files yet.

==================================================
31. EXPECTED TERMINAL STATE
==================================================

Do not leave an execution command running before returning.

If execution hangs beyond a reasonable test timeout:

diagnose the specific command/test.

Do not terminate the verified isolated backend unless execution safety
requires it.

Keep the isolated backend available for final review if healthy.

==================================================
32. AI AUDIT
==================================================

After execution use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected if no intervening artifact exists:

A-018

Artifact:

FR-17 Cross-Browser Execution, Failure Triage and Demo Fix Runtime Verification

Workflow Stage:

FR-17 approved automation execution on Chromium, Firefox and WebKit before
final defect documentation

Feature / Task:

FR-17 — Coupon management

Related Artifacts:

docs/execution-results/fr-17-chromium-execution.md

docs/execution-results/fr-17-firefox-execution.md

docs/execution-results/fr-17-webkit-execution.md

docs/execution-results/fr-17-cross-browser-summary.md

docs/defects/fr-17/candidate-screenshots/

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
33. RETURN
==================================================

Return:

1. Execution Status
2. Chromium Run ID
3. Chromium Total / Passed / Failed / Skipped
4. Chromium Failed IDs
5. Chromium Failure Classifications
6. Firefox Execution Status
7. Firefox Run ID
8. Firefox Total / Passed / Failed / Skipped
9. Firefox Failed IDs
10. Firefox Failure Classifications
11. WebKit Execution Status
12. WebKit Run ID
13. WebKit Total / Passed / Failed / Skipped
14. WebKit Failed IDs
15. WebKit Failure Classifications
16. Product Defect Candidate IDs
17. Automation Defect IDs
18. Needs More Evidence IDs
19. Environment Failure IDs
20. Candidate Screenshots Preserved
21. Original Failure Screenshots Preserved
22. Trace Evidence Preserved
23. HTML Report Verification
24. Isolated DB Cleanup Result
25. Workspace DB Protection Result
26. TC-004 Chromium Result
27. TC-004 Firefox Result
28. TC-004 WebKit Result
29. Final Demo Test Status
30. DEMO_FIX Candidate
31. DEMO_FIX Runtime Verification
32. Cross-Browser Failure Set Result
33. Files Created
34. Files Modified
35. AI Audit Artifact
36. Current Checkpoint

If all three browsers complete without automation/environment blockers:

CHECKPOINT: FR17_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
