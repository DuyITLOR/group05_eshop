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

Target Browser:
chromium

Current Checkpoint:
CHROMIUM_EXECUTION_REVIEW_APPROVED

Original Chromium Execution:
docs/execution-results/fr-05-chromium-execution.md

Approved Test File:
tests/fr-05/fr-05.spec.js

Helper File:
tests/fr-05/helpers/fr-05-helpers.js

Approved Test Data:
test-data/fr-05.json

Automation Review:
docs/automation-reviews/fr-05-ai-review.md

==================================================
HUMAN TRIAGE DECISION
==================================================

The original Chromium run is accepted as valid evidence.

Original result:

Total: 13
Passed: 7
Failed: 6

Confirmed classifications:

PRODUCT_DEFECT:
- FR05-TC-004
- FR05-TC-005
- FR05-TC-011
- FR05-TC-012
- FR05-TC-014

AUTOMATION_DEFECT:
- FR05-TC-006

The original Chromium execution artifacts MUST be preserved unchanged.

==================================================
CURRENT GOAL
==================================================

Perform ONLY:

1. Correct the FR05-TC-006 automation defect
2. Static review of that correction
3. Re-run Chromium only
4. Verify FR05-TC-006 runtime behavior
5. Preserve a NEW Chromium HTML report/run
6. Compare original vs corrected run
7. Update automation-review documentation
8. CREATE AI Audit A-007

Do NOT modify the SUT.

Do NOT modify requirements.

Do NOT modify approved Expected Results.

Do NOT run Firefox.

Do NOT run WebKit.

==================================================
1. FR05-TC-006 DEFECT
==================================================

Confirmed automation defect:

The SUT displays a valid grouped price such as:

30,000,000 VND

The current grouping helper incorrectly captures:

30,000,000<space>

because the regular space is an allowed grouping separator and the extraction
logic consumes the trailing separator before the currency suffix.

The numeric grouping itself is valid.

==================================================
2. REQUIRED CORRECTION
==================================================

Correct only the price-grouping automation logic.

The helper must:

- isolate the grouped numeric price from surrounding currency/content;
- ignore outer/trailing whitespace that is not between digit groups;
- preserve internal grouping spaces when they are valid separators;
- support only the already approved separators:
  .
  ,
  regular space
  U+00A0
  U+202F
- require one consistent separator within the number;
- reject raw uninterrupted digits;
- reject hyphens;
- reject letters as grouping separators;
- reject mixed separators;
- verify that removing the grouping separator yields the expected raw price.

Do NOT special-case:

VND

as the only suffix.

TC-006 is intentionally independent from TC-005 currency-symbol validation.

Therefore:

30,000,000 VND

must satisfy the grouping assertion even though TC-005 correctly fails
because the required currency symbol is ₫.

Do not weaken TC-005.

==================================================
3. SCOPE OF CODE CHANGE
==================================================

Prefer changing only:

tests/fr-05/helpers/fr-05-helpers.js

Modify:

tests/fr-05/fr-05.spec.js

only if genuinely required to correctly call the helper.

Do NOT modify:

- test-data/fr-05.json
- approved test cases
- automation plan
- SUT source
- database source
- playwright browser mappings
- unrelated tests

==================================================
4. STATIC REGRESSION CHECK
==================================================

Before runtime rerun, verify helper behavior with representative strings.

Must accept:

30,000,000 VND
30.000.000 ₫
30 000 000 VND
30\u00A0000\u00A0000 ₫
30\u202F000\u202F000 ₫

Must reject:

30000000
30-000-000
30x000x000
30,000.000
30,000 000

For every accepted example, normalized digits must equal:

30000000

Do not alter approved JSON grouping configuration.

==================================================
5. AUTOMATION REVIEW UPDATE
==================================================

Update:

docs/automation-reviews/fr-05-ai-review.md

Add the next Review ID for the runtime-discovered TC-006 issue.

Record:

Test Case ID:
FR05-TC-006

Problem:
Grouping helper consumed trailing whitespace before the currency suffix.

Risk:
False failure despite valid thousand grouping.

Human Decision:
MODIFIED

Before rerun:
Verification: STATIC_REVIEW_PASSED

After successful Chromium rerun:
Verification: RUNTIME_VERIFIED_CHROMIUM

Do not remove the historical original failure.

==================================================
6. SUT PROCESS POLICY
==================================================

First determine whether the previously started backend/frontend processes are
still healthy.

If both are still running and healthy:

REUSE them.

Do not restart them unnecessarily.

If startup is required:

use the documented commands.

Record that backend startup may normally recreate/reseed database.sqlite.

Do not issue a separate seed/reset command.

Do not modify database records manually.

Do not stage or commit backend/database.sqlite.

==================================================
7. SEED GATE
==================================================

Before rerun perform the same non-mutating:

GET http://localhost:3000/api/products

Confirm the approved five-product oracle.

If it differs:

stop with:

SEED_STATE_MISMATCH

==================================================
8. NEW CHROMIUM RUN
==================================================

Generate a NEW:

RUN_TIMESTAMP
RUN_ID

Do not overwrite or reuse:

FR-05-chromium-2026-08-09T19-14-10-0306495Z

Run:

tests/fr-05/fr-05.spec.js

with:

--project=chromium

retries = 0

Generate a separate HTML report directory.

==================================================
9. EXPECTED REGRESSION BEHAVIOR
==================================================

Do not force these results, but compare actual runtime behavior against the
human-approved triage.

Expected if only the automation defect is corrected and the SUT is unchanged:

FR05-TC-006:
PASSED

Previously confirmed product defects may remain FAILED:

FR05-TC-004
FR05-TC-005
FR05-TC-011
FR05-TC-012
FR05-TC-014

Do not weaken any of their assertions to improve pass count.

Expected overall pattern:

Total: 13
Passed: 8
Failed: 5

This is an expectation for comparison, NOT a result to fabricate.

==================================================
10. TC-012 EVIDENCE
==================================================

Continue preserving TC-012 runtime evidence.

Do not change its assertions.

The second Chromium run may provide additional evidence, but the original
Chromium evidence remains valid and must not be overwritten.

==================================================
11. RESULT DOCUMENT
==================================================

Create:

docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md

Include:

- new Run ID
- new ISO timestamp
- SUT process reuse/restart status
- seed-state result
- code correction summary
- static helper verification
- total/pass/fail
- FR05-TC-006 before/after comparison
- product-defect regression results
- HTML report identity verification
- evidence paths
- remaining Firefox/WebKit work

Do not rewrite the original:

docs/execution-results/fr-05-chromium-execution.md

==================================================
12. SUCCESS GATE
==================================================

The correction is accepted for cross-browser execution only if:

- FR05-TC-006 no longer fails due to grouping-helper logic;
- no previously passing unrelated test regresses because of the correction;
- the 13-test inventory remains unchanged;
- no product-defect assertion was weakened;
- HTML report identity still passes.

If TC-006 still fails due to automation logic:

stop with:

AUTOMATION_CORRECTION_STILL_FAILING

Do not run Firefox/WebKit.

==================================================
13. RETURN
==================================================

Return:

1. Correction Status
2. Files Modified
3. Static Helper Verification
4. SUT Reused or Restarted
5. Runtime Seed-State
6. New Chromium Run ID
7. New ISO Timestamp
8. Total Tests
9. Passed
10. Failed
11. FR05-TC-006 Result
12. Previously Confirmed Product Defect Results
13. Unexpected Regressions
14. HTML Report Path
15. Report Identity Verification
16. Evidence Paths
17. Cross-Browser Readiness
18. Current Checkpoint

Stop at:

CHECKPOINT: TC006_CORRECTION_REVIEW_REQUIRED

Do not run Firefox or WebKit.

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After correction and Chromium verification use:

$log-ai-audit

Operation:
CREATE_ENTRY

Expected next Artifact ID:
A-007

Artifact:
FR-05 runtime automation correction for FR05-TC-006 and Chromium verification

Workflow Stage:
Runtime automation correction after Chromium failure triage

Related artifacts:
- tests/fr-05/helpers/fr-05-helpers.js
- docs/automation-reviews/fr-05-ai-review.md
- docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md
- new Chromium HTML report

Preserve the exact verbatim prompt and original AI output.

Store:

docs/ai-audit/interactions/A-007-prompt.md
docs/ai-audit/interactions/A-007-output.md

Review Status:
PENDING_HUMAN_REVIEW

Do not finalize Verdict.

Do not UPDATE_REVIEW.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: TC006_CORRECTION_REVIEW_REQUIRED