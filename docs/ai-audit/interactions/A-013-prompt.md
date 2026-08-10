$playwright-feature-workflow

Workflow Mode:
MULTI_BROWSER_EXECUTION

Feature ID:
FR-09

Feature Name:
Discount coupons

Student ID:
23127107

Approved Test Count:
16

Current Readiness:
READY_FOR_EXECUTION

Readiness Report:
docs/execution-readiness/fr-09-execution-readiness.md

Automation Plan:
docs/automation-plans/fr-09-automation-plan.md

Automation Review:
docs/automation-reviews/fr-09-ai-review.md

Automation Gaps:
docs/gaps/fr-09-automation-gaps.md

Test Spec:
tests/fr-09/fr-09.spec.js

External Data:
test-data/fr-09.json

==================================================
PURPOSE
==================================================

Execute FR-09 on:

1. Chromium
2. Firefox
3. WebKit

Use adaptive execution:

Chromium
→ triage
→ STOP if automation/environment blocker exists
→ otherwise Firefox
→ triage
→ STOP if automation/environment blocker exists
→ otherwise WebKit
→ cross-browser comparison

The goal is to preserve real original failure evidence during the FIRST
execution.

Do NOT rerun a browser merely to obtain screenshots.

==================================================
1. PRE-EXECUTION SAFETY GATE
==================================================

Before Chromium execution verify:

Frontend:
http://localhost:5173

Expected reused frontend PID:
29712

Backend:
http://localhost:3000

Expected isolated backend PID:
34568

Expected isolated database:

.runtime/fr-09/fr09-readiness-20260810T051450780+0700/backend/database.sqlite

Verify the current actual absolute path before running.

Required environment:

FR09_ISOLATED_DB=true

FR09_TEST_DB_PATH=<exact isolated DB absolute path>

SUT_API_BASE_URL=http://localhost:3000

Runtime-only:

FR09_TEST_USER_EMAIL
FR09_TEST_USER_PASSWORD

Do not print:

- password
- JWT
- sensitive credential values

If isolated backend is no longer healthy:

STOP.

Do not automatically start the workspace backend.

Return:

ENVIRONMENT_FAILURE

with the exact reason.

==================================================
2. WORKSPACE DATABASE PROTECTION
==================================================

The forbidden database remains:

backend/database.sqlite

Before Chromium, record a workspace DB hash if available.

Do not mutate it.

Do not restart the workspace backend.

After every browser run, verify that the workspace DB remains unchanged.

If workspace DB modification is detected:

STOP immediately.

Classify:

ENVIRONMENT_FAILURE

Do not continue to another browser.

==================================================
3. ISOLATED STATE BASELINE
==================================================

Before each browser run verify:

- isolated database exists;
- required coupons exist;
- reserved absent coupon remains absent;
- Keychron price remains 4000000;
- coupon_usage baseline is 0 unless exact approved fixture state is currently
  being temporarily installed by a test.

After each browser run verify fixture cleanup.

Expected persistent post-run state:

coupon_usage:
0 rows

Temporary state created by:

TC-010
TC-014
TC-015

must be restored/deleted by fixture cleanup.

If cleanup fails:

classify:

AUTOMATION_DEFECT

and STOP before the next browser.

Do not manually hide cleanup failure by resetting rows and continuing.

==================================================
4. FAILURE EVIDENCE POLICY
==================================================

Current Playwright policy already provides:

screenshot:
only-on-failure

trace:
retain-on-failure

video:
off

Every failed test must retain its ORIGINAL:

- Playwright failure screenshot;
- trace;
- HTML report entry;
- test-results artifact;
- error message.

Do not recreate a screenshot after the failure merely to make it look better.

Do not delete the original screenshot.

==================================================
5. DEFECT SCREENSHOT POLICY
==================================================

This workflow intentionally captures bug screenshots DURING execution.

For each failure classified after triage as:

PRODUCT_DEFECT_CANDIDATE

preserve the original Playwright failure screenshot.

Also create a persistent evidence copy under:

docs/defects/fr-09/candidate-screenshots/

Use Test Case ID because final Defect ID has not yet been human-approved.

Examples:

docs/defects/fr-09/candidate-screenshots/FR09-TC-002.png

docs/defects/fr-09/candidate-screenshots/FR09-TC-006.png

The persistent candidate screenshot must be copied from the ORIGINAL failed
run artifact.

Do not recapture the UI.

Do not assign:

FR09-BUG-xxx

during this execution phase.

Final Defect IDs are assigned only after human review.

If one Test Case fails on several browsers:

use Chromium as the primary candidate screenshot when Chromium already
provides clear evidence.

Preserve Firefox/WebKit original screenshots in their run-specific result
directories.

If a defect is browser-specific, preserve the relevant browser screenshot
and document this explicitly.

AUTOMATION_DEFECT screenshots must NOT be promoted into product-defect
candidate evidence.

==================================================
6. TRIAGE CLASSIFICATIONS
==================================================

Every failed test must receive exactly one execution-level classification:

PRODUCT_DEFECT_CANDIDATE

AUTOMATION_DEFECT

ENVIRONMENT_FAILURE

NEEDS_MORE_EVIDENCE

Do not assign final Bug IDs.

Do not classify based only on expected known implementation discrepancies.

Use actual runtime evidence.

==================================================
7. TRIAGE RULE
==================================================

PRODUCT_DEFECT_CANDIDATE requires:

- test objective is authoritative;
- setup/precondition succeeded;
- intended condition was actually reached;
- assertion correctly represents Expected Result;
- failure is caused by observable SUT behavior;
- no more plausible automation/setup failure exists.

AUTOMATION_DEFECT includes:

- wrong locator;
- bad parser;
- incorrect fixture;
- incorrect expected calculation introduced by automation;
- cart setup failure;
- navigation helper failure;
- cleanup failure;
- race/timing problem;
- assertion stronger than requirement.

ENVIRONMENT_FAILURE includes:

- backend unavailable;
- frontend unavailable;
- credential setup unavailable;
- isolated DB unavailable;
- browser executable failure;
- workspace DB safety violation.

NEEDS_MORE_EVIDENCE means the current evidence cannot safely distinguish
product from automation behavior.

Do not force a classification.

==================================================
8. KNOWN IMPLEMENTATION DISCREPANCIES
==================================================

The build phase documented possible discrepancies such as:

- missing JWT enforcement;
- body-supplied user_id;
- usage-check bypass;
- minimum comparison using > instead of >=;
- incorrect percent formula;
- unguarded Checkout route;
- editable Checkout total;
- non-atomic usage recording.

These are hypotheses/context only.

Do NOT automatically mark matching failures PRODUCT_DEFECT.

Require actual runtime evidence from the approved Test Case.

==================================================
9. TC-012 SPECIAL TRIAGE
==================================================

FR09-TC-012 currently has:

NEEDS_MORE_EVIDENCE

because automation uses same-document navigation to preserve in-memory cart
without JWT.

Before interpreting its business assertion:

verify that:

- cart was successfully created through UI;
- intended total remains 4000000;
- no JWT was injected;
- same-document navigation reached Checkout;
- coupon attempt actually occurred.

If the setup/navigation mechanism fails before the business condition is
reached:

AUTOMATION_DEFECT

or:

NEEDS_MORE_EVIDENCE

Do NOT call it PRODUCT_DEFECT.

If setup succeeds and unauthenticated coupon functionality is genuinely
accepted against authoritative C4:

PRODUCT_DEFECT_CANDIDATE

may be appropriate.

==================================================
10. TC-013 SPECIAL TRIAGE
==================================================

FR09-TC-013 also currently has:

NEEDS_MORE_EVIDENCE

Verify the web-first render gate succeeds.

Authoritative behavior is mechanism-neutral:

unauthenticated user must not have usable Checkout coupon functionality.

Do not require:

- one redirect URL;
- exact denial text;
- one particular DOM state.

If a functional unauthenticated coupon flow is genuinely usable after stable
render:

PRODUCT_DEFECT_CANDIDATE

may be appropriate.

If the render/navigation test itself is unstable:

AUTOMATION_DEFECT

or:

NEEDS_MORE_EVIDENCE.

==================================================
11. CHROMIUM EXECUTION
==================================================

Generate a unique:

RUN_TIMESTAMP

RUN_ID

Example naming:

FR-09-chromium-<timestamp>

Set:

FEATURE_ID=FR-09
STUDENT_ID=23127107
BROWSER_PROJECT=chromium

Use separate:

HTML_REPORT_DIR

TEST_RESULTS_DIR

Run:

npx.cmd playwright test tests/fr-09/fr-09.spec.js --project=chromium

Expected inventory:

16 tests

Do not expect a particular PASS/FAIL count.

Record reality.

Create:

docs/execution-results/fr-09-chromium-execution.md

Include:

- Run ID
- ISO timestamp
- Student ID
- browser
- total
- passed
- failed
- skipped
- each failed Test Case ID
- failure assertion/evidence
- classification
- screenshot path
- trace path
- HTML report path
- isolated DB cleanup result
- workspace DB protection result

==================================================
12. CHROMIUM STOP GATE
==================================================

After Chromium triage:

If ANY high-confidence:

AUTOMATION_DEFECT

or:

ENVIRONMENT_FAILURE

exists:

STOP.

Do NOT execute Firefox or WebKit.

Return:

CHECKPOINT: FR09_CHROMIUM_AUTOMATION_REVIEW_REQUIRED

Preserve all evidence.

If failures consist only of:

PRODUCT_DEFECT_CANDIDATE

and/or cases that can safely remain:

NEEDS_MORE_EVIDENCE

without invalidating the suite infrastructure,

continue to Firefox.

==================================================
13. FIREFOX EXECUTION
==================================================

Only if Chromium gate passes.

Generate a new unique:

RUN_TIMESTAMP
RUN_ID

Set:

BROWSER_PROJECT=firefox

Use completely separate:

HTML_REPORT_DIR
TEST_RESULTS_DIR

Run all 16 tests.

Create:

docs/execution-results/fr-09-firefox-execution.md

Perform the same triage and state/database checks.

If a NEW AUTOMATION_DEFECT or ENVIRONMENT_FAILURE appears:

STOP before WebKit.

Return:

CHECKPOINT: FR09_FIREFOX_AUTOMATION_REVIEW_REQUIRED

Otherwise continue.

==================================================
14. WEBKIT EXECUTION
==================================================

Only if Chromium and Firefox gates pass.

Generate a new unique:

RUN_TIMESTAMP
RUN_ID

Set:

BROWSER_PROJECT=webkit

Use separate:

HTML_REPORT_DIR
TEST_RESULTS_DIR

Run all 16 tests.

Create:

docs/execution-results/fr-09-webkit-execution.md

Perform the same triage and state/database checks.

==================================================
15. HTML REPORT IDENTITY
==================================================

For every actual browser run verify the rendered HTML report visibly contains:

FR-09

Run by: 23127107

ISO timestamp

Run ID

Browser identity

Do not infer this only from config.

Verify rendered report output.

==================================================
16. CROSS-BROWSER SUMMARY
==================================================

If all three browsers complete, create:

docs/execution-results/fr-09-cross-browser-summary.md

Include:

| Test Case ID | Chromium | Firefox | WebKit | Triage Summary |
| --- | --- | --- | --- | --- |

For all 16 Test Case IDs.

Also include:

- browser totals;
- pass/fail counts;
- consistent failures;
- browser-specific failures;
- PRODUCT_DEFECT_CANDIDATE IDs;
- AUTOMATION_DEFECT IDs;
- NEEDS_MORE_EVIDENCE IDs;
- ENVIRONMENT_FAILURE IDs;
- TC-012 final runtime evidence status;
- TC-013 final runtime evidence status;
- isolated DB cleanup status;
- workspace DB protection status.

Do not assign final Defect IDs.

==================================================
17. SCREENSHOT MANIFEST
==================================================

Create:

docs/defects/fr-09/candidate-screenshots/README.md

For each candidate screenshot record:

| Test Case ID | Primary Browser | Source Run ID | Original Screenshot | Persistent Candidate Screenshot | Classification |
| --- | --- | --- | --- | --- | --- |

Only PRODUCT_DEFECT_CANDIDATE belongs in this manifest.

Do not include AUTOMATION_DEFECT screenshots as product evidence.

==================================================
18. DO NOT CREATE FINAL BUG REPORTS YET
==================================================

Do NOT yet create:

FR09-BUG-001
FR09-BUG-002
...

Do NOT create final Bug Reports.

Do NOT publish GitHub Issues.

The next human review determines which PRODUCT_DEFECT_CANDIDATE failures
become confirmed product defects.

This avoids generating Bug Reports for automation failures.

==================================================
19. EXECUTION LANGUAGE POLICY
==================================================

Use Vietnamese for explanatory prose.

Keep standardized headings, IDs, statuses, paths, technical terms and table
field names in English where appropriate.

==================================================
20. AI AUDIT
==================================================

After the execution output use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next sequential Artifact ID.

Expected if A-012 is finalized:

A-013

Artifact:
FR-09 Multi-Browser Execution and Failure Triage

Workflow Stage:
FR-09 adaptive Chromium/Firefox/WebKit execution before final defect review

Related Artifacts:

docs/execution-results/fr-09-chromium-execution.md
docs/execution-results/fr-09-firefox-execution.md
docs/execution-results/fr-09-webkit-execution.md
docs/execution-results/fr-09-cross-browser-summary.md
docs/defects/fr-09/candidate-screenshots/

Preserve exact verbatim prompt and original output.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.

If execution stops after Chromium or Firefox, still create A-013 using only
the artifacts that actually exist.

Do not fabricate missing browser results.

==================================================
21. RETURN
==================================================

Return:

1. Execution Status
2. Chromium Run ID
3. Chromium Total / Passed / Failed
4. Chromium Failed IDs
5. Chromium Failure Classifications
6. Firefox Execution Status
7. Firefox Run ID
8. Firefox Total / Passed / Failed
9. Firefox Failed IDs
10. Firefox Failure Classifications
11. WebKit Execution Status
12. WebKit Run ID
13. WebKit Total / Passed / Failed
14. WebKit Failed IDs
15. WebKit Failure Classifications
16. TC-012 Runtime Status
17. TC-013 Runtime Status
18. Product Defect Candidate IDs
19. Automation Defect IDs
20. Needs More Evidence IDs
21. Environment Failure IDs
22. Candidate Screenshots Preserved
23. Trace Evidence Preserved
24. HTML Report Verification
25. Isolated DB Cleanup Result
26. Workspace DB Protection Result
27. Files Created
28. Files Modified
29. AI Audit Artifact
30. Current Checkpoint

==================================================
FINAL CHECKPOINT
==================================================

If all three browsers complete without automation/environment blocker:

CHECKPOINT: FR09_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

Otherwise stop at the browser-specific review checkpoint described above.
