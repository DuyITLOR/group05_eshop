$playwright-feature-workflow

Workflow Mode:
EXECUTE

Feature ID:
FR-05

Feature Name:
Product listing and search

Student ID:
23127107

SUT Base URL:
http://localhost:5173

Approved Test File:
tests/fr-05/fr-05.spec.js

Helper File:
tests/fr-05/helpers/fr-05-helpers.js

Approved Test Data:
test-data/fr-05.json

Chromium Baseline:
docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md

Automation Review:
docs/automation-reviews/fr-05-ai-review.md

==================================================
APPROVED STATE
==================================================

Chromium corrected baseline is approved.

Approved Chromium result:

Total: 13
Passed: 8
Failed: 5

Confirmed remaining PRODUCT_DEFECT cases:

- FR05-TC-004
- FR05-TC-005
- FR05-TC-011
- FR05-TC-012
- FR05-TC-014

FR05-TC-006 automation correction:
APPROVED_AND_RUNTIME_VERIFIED_CHROMIUM

No known automation defect remains before cross-browser execution.

==================================================
CURRENT GOAL
==================================================

Complete the remaining FR-05 browser executions.

Execution order:

1. Firefox
2. Triage Firefox
3. If no new AUTOMATION_DEFECT or ENVIRONMENT_FAILURE blocks continuation:
   run WebKit
4. Triage WebKit
5. Compare Chromium / Firefox / WebKit
6. Verify three independent HTML reports
7. Update FR05-REV-006 cross-browser evidence
8. Create execution documentation
9. Create AI Audit A-008

Do not rerun Chromium.

Do not modify tests during this task.

Do not modify the SUT.

==================================================
1. SUT HEALTH
==================================================

Check whether the existing backend/frontend processes are still healthy.

Expected:

Backend:
http://localhost:3000

Frontend:
http://localhost:5173

If healthy:
REUSE processes.

Do not restart unnecessarily.

If restart is required:
use only documented startup commands.

Remember that normal backend startup may recreate/seed database.sqlite.

Do not manually seed/reset the database.

==================================================
2. SEED-STATE GATE
==================================================

Before Firefox execution perform:

GET http://localhost:3000/api/products

Verify exact approved five-product oracle from:

test-data/fr-05.json

If mismatch:

STOP:
SEED_STATE_MISMATCH

Do not run Firefox or WebKit.

==================================================
3. FIREFOX RUN
==================================================

Generate a unique:

RUN_TIMESTAMP
RUN_ID

Run only:

tests/fr-05/fr-05.spec.js

with:

--project=firefox

Retries:
0

Generate and preserve an independent HTML report directory.

Record:

- total
- passed
- failed
- skipped
- duration
- failed Test Case IDs
- evidence

Verify rendered report visibly includes:

Run by: 23127107
FR-05
Firefox project identity
Run ID
ISO timestamp

==================================================
4. FIREFOX TRIAGE GATE
==================================================

Classify every Firefox failure:

PRODUCT_DEFECT
AUTOMATION_DEFECT
ENVIRONMENT_FAILURE
NEEDS_HUMAN_REVIEW

Compare with Chromium baseline.

Pay particular attention to:

FR05-TC-006
- must remain valid after the grouping-helper fix.

FR05-TC-012
- record dialog observer evidence;
- record dialog messages;
- record literal safe-text assertion;
- record img[onerror] assertion.

If a NEW high-confidence AUTOMATION_DEFECT is found:

STOP after preserving Firefox evidence.

Do NOT run WebKit.

Return:

CROSS_BROWSER_AUTOMATION_REVIEW_REQUIRED

Do not fix the test automatically.

==================================================
5. WEBKIT RUN
==================================================

Only if Firefox introduces no blocking automation defect/environment failure:

Generate a NEW unique:

RUN_TIMESTAMP
RUN_ID

Run:

tests/fr-05/fr-05.spec.js

with:

--project=webkit

Retries:
0

Generate a separate HTML report.

Do not overwrite Chromium or Firefox evidence.

Verify report identity:

Run by: 23127107
FR-05
WebKit project identity
Run ID
ISO timestamp

==================================================
6. WEBKIT TRIAGE
==================================================

Classify all failures using the same categories.

Pay particular attention to:

FR05-TC-006
FR05-TC-012

Do not weaken assertions to make browsers agree.

Browser-specific behavior must be preserved as evidence.

==================================================
7. EXPECTED COMPARISON
==================================================

Do not fabricate these results.

However, if the SUT behaves consistently across engines, the expected
pattern is:

13 total
8 passed
5 failed

with the five confirmed product-defect cases:

FR05-TC-004
FR05-TC-005
FR05-TC-011
FR05-TC-012
FR05-TC-014

TC-006 should pass.

Any deviation must be investigated and documented.

==================================================
8. FR05-REV-006 FINAL EVIDENCE
==================================================

Update:

docs/automation-reviews/fr-05-ai-review.md

For FR05-REV-006 record evidence independently for:

- Chromium
- Firefox
- WebKit

Include:

dialog observer active
dialog count
dialog messages
literal-text result
img[onerror] result

If evidence across all three engines is sufficient:

Verification:
RUNTIME_VERIFIED_MULTI_BROWSER

Resolve the prior:

NEEDS_MORE_EVIDENCE

appropriately.

Do not erase the historical review state.

==================================================
9. EXECUTION DOCUMENTS
==================================================

Create:

docs/execution-results/fr-05-firefox-execution.md

docs/execution-results/fr-05-webkit-execution.md

docs/execution-results/fr-05-cross-browser-summary.md

Cross-browser summary must include:

| Test Case ID | Chromium | Firefox | WebKit | Final Classification |

Use the APPROVED corrected Chromium rerun as the Chromium baseline.

Also include:

- report paths
- Run IDs
- timestamps
- Student ID
- seed-state result
- automation-defect comparison
- product-defect consistency
- browser-specific differences
- FR05-REV-006 outcome

==================================================
10. EVIDENCE PRESERVATION
==================================================

Preserve independently:

Chromium original run
Chromium corrected rerun
Firefox run
WebKit run

Do not overwrite:

html-reports/
test-results archived runs
process logs
execution records

==================================================
11. NO CODE CHANGES
==================================================

Do NOT modify:

tests/fr-05/fr-05.spec.js
tests/fr-05/helpers/fr-05-helpers.js
playwright.config.js
test-data/fr-05.json
SUT source
database source

If automation correction appears necessary:

preserve evidence and stop.

==================================================
12. RETURN
==================================================

Return:

1. Firefox Execution Status
2. Firefox Run ID
3. Firefox Total / Passed / Failed
4. Firefox Failed IDs
5. Firefox Failure Classifications
6. Firefox Report Path
7. Firefox Report Identity Verification
8. Firefox TC-012 Dialog Evidence
9. WebKit Execution Status
10. WebKit Run ID
11. WebKit Total / Passed / Failed
12. WebKit Failed IDs
13. WebKit Failure Classifications
14. WebKit Report Path
15. WebKit Report Identity Verification
16. WebKit TC-012 Dialog Evidence
17. Chromium / Firefox / WebKit Comparison
18. New Automation Defects
19. Confirmed Product Defects
20. FR05-REV-006 Final Status
21. Evidence Paths
22. Files Created
23. Files Modified
24. Current Checkpoint

Stop at:

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After cross-browser execution use:

$log-ai-audit

Operation:
CREATE_ENTRY

Expected Artifact ID:
A-008

Artifact:
FR-05 Firefox/WebKit execution and cross-browser comparison

Workflow Stage:
Remaining multi-browser execution before final defect reporting

Related artifacts:
- docs/execution-results/fr-05-firefox-execution.md
- docs/execution-results/fr-05-webkit-execution.md
- docs/execution-results/fr-05-cross-browser-summary.md
- Firefox HTML report
- WebKit HTML report
- docs/automation-reviews/fr-05-ai-review.md

Preserve exact verbatim prompt and original AI output.

Store:

docs/ai-audit/interactions/A-008-prompt.md
docs/ai-audit/interactions/A-008-output.md

Review Status:
PENDING_HUMAN_REVIEW

Do not finalize Verdict.
Do not UPDATE_REVIEW.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED