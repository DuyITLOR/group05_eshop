$playwright-feature-workflow

Workflow Mode:
FINALIZE

Phase:
FINAL_DEFECT_AND_DEMO_READINESS_BUNDLE

Feature ID:
FR-17

Feature Name:
Coupon management

Student ID:
23127107

Primary Demo Feature:
YES

Current Checkpoint:
CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

Precondition:

A-020 must already be FINALIZED with:

Verdict:
VALID

Student Decision:
ACCEPTED

Verification Result:
PASSED

Approval Status:
APPROVED

If not, STOP.

==================================================
PURPOSE
==================================================

Complete FR-17 without executing any browser.

Perform:

1. confirm final product-defect mapping;
2. promote existing first-failure screenshots;
3. create standardized Bug Reports;
4. create GitHub Issue drafts;
5. create final FR-17 feature summary;
6. finalize demo plan;
7. create demo-recording readiness checklist;
8. preserve AI correction history;
9. create AI Audit A-021.

Do NOT:

- execute Playwright;
- open Chromium/Firefox/WebKit for reproduction;
- rerun any defect;
- recapture screenshots;
- modify tests;
- modify approved test data;
- modify SUT;
- modify databases;
- publish GitHub Issues yet.

Stop at:

CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED

==================================================
1. FINAL EXECUTION BASIS
==================================================

Use the FINAL corrected execution set:

Corrected Chromium:

fr17-chromium-corrected-20260810T092053847+0700

16 total
12 passed
4 failed

Firefox:

fr17-firefox-20260810T092258944+0700

16 total
14 passed
2 failed

WebKit:

fr17-webkit-20260810T092419436+0700

16 total
14 passed
2 failed

Historical Chromium:

fr17-chromium-20260810T084402107+0700

must remain preserved as automation-defect history and must NOT be used as
the final Chromium metrics.

==================================================
2. FINAL DEFECT MAPPING
==================================================

Create exactly four final underlying product defects.

--------------------------------------------------
FR17-BUG-001
--------------------------------------------------

Found by:

FR17-TC-002

Defect:

Required Coupon Management fields do not display the required visible `*`
indicator beside their field labels.

Requirement:

all required fields must have a visible `*` indicator beside the label.

Browser Coverage:

Chromium:
FAIL / reproduced

Firefox:
FAIL / reproduced

WebKit:
FAIL / reproduced

This is:
CROSS_BROWSER

--------------------------------------------------
FR17-BUG-002
--------------------------------------------------

Found by:

FR17-TC-008

Defect:

Coupon with:

discount_value = 0

is accepted/created during the corrected Chromium execution although the
authoritative requirement requires:

discount_value > 0

Browser Coverage:

Chromium:
FAIL / reproduced

Firefox:
PASS

WebKit:
PASS

This is currently:
CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR

Do NOT claim the backend universally lacks validation.

Do NOT state a server-side root cause unless directly demonstrated by the
runtime evidence.

The report may describe implementation inspection separately under:

Technical Observation

but clearly label it non-causal unless proven.

--------------------------------------------------
FR17-BUG-003
--------------------------------------------------

Found by:

FR17-TC-011

Defect:

Coupon with:

min_order_amount = -1

is accepted/created during the corrected Chromium execution although the
requirement requires:

min_order_amount >= 0

Browser Coverage:

Chromium:
FAIL / reproduced

Firefox:
PASS

WebKit:
PASS

This is currently:
CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR

Apply the same causal-language restriction as FR17-BUG-002.

--------------------------------------------------
FR17-BUG-004
--------------------------------------------------

Found by:

FR17-TC-016

Defect:

A valid authenticated non-admin user can obtain usable Coupon Management
functionality.

Requirement:

Coupon Management is restricted to role = admin.

Browser Coverage:

Chromium:
FAIL / reproduced

Firefox:
FAIL / reproduced

WebKit:
FAIL / reproduced

This is:
CROSS_BROWSER

Do not overstate privilege impact beyond the runtime operations actually
demonstrated.

==================================================
3. DO NOT CREATE A BUG FOR TC-003
==================================================

FR17-TC-003 historical failure was:

AUTOMATION_DEFECT

It was corrected and passed on:

Chromium
Firefox
WebKit

Do not create a product Bug ID for it.

Preserve its history as:

Secondary Runtime Automation Correction

VERIFIED_MULTI_BROWSER

==================================================
4. SCREENSHOT PROMOTION
==================================================

Do NOT recapture screenshots.

Use existing candidate screenshots.

For FR17-BUG-001:

use the preserved FIRST product-candidate Chromium screenshot from A-018
TC-002.

For FR17-BUG-004:

use the preserved FIRST product-candidate Chromium screenshot from A-018
TC-016.

For FR17-BUG-002:

use the first corrected-Chromium TC-008 candidate screenshot.

For FR17-BUG-003:

use the first corrected-Chromium TC-011 candidate screenshot.

Promote/copy byte-identically to:

docs/defects/fr-17/screenshots/FR17-BUG-001.png
docs/defects/fr-17/screenshots/FR17-BUG-002.png
docs/defects/fr-17/screenshots/FR17-BUG-003.png
docs/defects/fr-17/screenshots/FR17-BUG-004.png

Record:

- source Test Case;
- source Run ID;
- source browser;
- original path;
- promoted path;
- byte/hash identity verification.

Do not delete candidate copies or original run evidence.

==================================================
5. BUG REPORT FILES
==================================================

Create:

docs/defects/fr-17/FR17-BUG-001-required-field-indicators.md

docs/defects/fr-17/FR17-BUG-002-zero-discount-value.md

docs/defects/fr-17/FR17-BUG-003-negative-minimum-order.md

docs/defects/fr-17/FR17-BUG-004-non-admin-coupon-management-access.md

==================================================
6. LANGUAGE STANDARD
==================================================

Use:

English standardized headings / field names

Vietnamese descriptive prose

Technical terms may remain English.

Title format:

[HW04][BUG][FR-17][Coupon Management] <Vietnamese bug description>

Suggested title concepts:

FR17-BUG-001:
[HW04][BUG][FR-17][Coupon Management] Required coupon fields không hiển thị ký hiệu *

FR17-BUG-002:
[HW04][BUG][FR-17][Coupon Management] Chromium chấp nhận coupon có discount_value bằng 0

FR17-BUG-003:
[HW04][BUG][FR-17][Coupon Management] Chromium chấp nhận min_order_amount âm

FR17-BUG-004:
[HW04][BUG][FR-17][Coupon Management] Non-admin vẫn truy cập được Coupon Management

==================================================
7. REQUIRED REPORT STRUCTURE
==================================================

Every Bug Report must contain in this order:

# <Bug Title>

## Found by Test Case

## Related Requirements

## Severity / Priority

## Reason

## Environment

## Preconditions

## Steps to Reproduce

## Expected Result

## Actual Result

## Reproducibility

## Impact

## Cross-Browser Result

## Evidence

### Screenshot

### Automation Evidence

## Technical Observation

## Discovery and Confirmation

## Recommended Next Step

## Status

## Hashtags

## Suggested GitHub Labels

==================================================
8. ENVIRONMENT ACCURACY
==================================================

Use only values actually recorded.

Do not fabricate:

browser versions
OS build
device details

If unavailable:

NOT_RECORDED

For browser-specific BUG-002 and BUG-003, clearly show:

Chromium:
FAIL

Firefox:
PASS

WebKit:
PASS

Do not label them cross-browser defects.

==================================================
9. CROSS-BROWSER TABLES
==================================================

Every Bug Report must contain:

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |

Use final run IDs:

Chromium:
fr17-chromium-corrected-20260810T092053847+0700

Firefox:
fr17-firefox-20260810T092258944+0700

WebKit:
fr17-webkit-20260810T092419436+0700

For BUG-001 and BUG-004:

FAIL on all three.

For BUG-002 and BUG-003:

Chromium FAIL
Firefox PASS
WebKit PASS

==================================================
10. SEVERITY / PRIORITY
==================================================

Use only:

Severity:
Critical
High
Medium
Low

Priority:
P1
P2
P3
P4

Reason must be Vietnamese.

Do not assign all defects the same values automatically.

Evaluate based on observed impact.

Suggested starting points, subject to evidence review:

FR17-BUG-001:
Low or Medium / P3

FR17-BUG-002:
Medium / P2

FR17-BUG-003:
Medium / P2

FR17-BUG-004:
High / P1

Do not mechanically copy these if evidence supports a more appropriate level.

==================================================
11. HASHTAGS
==================================================

Base:

#HW04
#BUG
#FR17
#CouponManagement

Add relevant:

#Chromium
#Firefox
#WebKit
#CrossBrowser

Severity:
#SeverityCritical
#SeverityHigh
#SeverityMedium
#SeverityLow

Priority:
#PriorityP1
#PriorityP2
#PriorityP3
#PriorityP4

Categories where supported:

#Functional
#Security
#Authentication
#Authorization
#Validation
#UI
#Accessibility
#DataIntegrity
#CrossBrowser

For BUG-002 and BUG-003:

do NOT add #CrossBrowser merely because all three browsers were tested.

Use browser tags to describe coverage accurately.

==================================================
12. GITHUB LABELS
==================================================

Each report must include Suggested GitHub Labels.

Use English label tokens such as:

bug
hw04
fr-17
severity:<level>
priority:<level>
coupon-management

plus evidence-supported categories:

validation
ui
security
authorization
accessibility
cross-browser

Suggested labels are not applied labels.

==================================================
13. GITHUB ISSUE DRAFTS
==================================================

Create exactly four:

docs/defects/fr-17/github-issues/FR17-BUG-001.md
docs/defects/fr-17/github-issues/FR17-BUG-002.md
docs/defects/fr-17/github-issues/FR17-BUG-003.md
docs/defects/fr-17/github-issues/FR17-BUG-004.md

Use:

# Title
# Body

Body structure:

## Found by Test Case
## Related Requirements
## Severity / Priority
## Environment
## Preconditions
## Steps to Reproduce
## Expected Result
## Actual Result
## Reproducibility
## Impact
## Browser Coverage
## Evidence
### Screenshot
### Automation Evidence
## Technical Observation
## Status
## Hashtags
## Suggested GitHub Labels

GitHub Publication Status:

NOT_PUBLISHED

Do NOT publish during this phase.

==================================================
14. FINAL FEATURE SUMMARY
==================================================

Create:

docs/execution-results/fr-17-final-summary.md

Include:

Approved Test Cases:
16

Automated:
16

Blocked:
0

Final Chromium:
16 total
12 passed
4 failed
0 skipped

Final Firefox:
16 total
14 passed
2 failed
0 skipped

Final WebKit:
16 total
14 passed
2 failed
0 skipped

Final Project-Test Combinations:
48

Final Passed:
40

Final Failed:
8

Final Skipped:
0

Confirmed Failed Test Case IDs:

FR17-TC-002
FR17-TC-008
FR17-TC-011
FR17-TC-016

Confirmed Underlying Product Defects:
4

Remaining Automation Defects:
0

Needs More Evidence:
0

Environment Failures:
0

Cross-Browser Failure Set:
PARTIALLY_OVERLAPPING

Explain:

TC-002 and TC-016 reproduce across all engines.

TC-008 and TC-011 reproduce on corrected Chromium but pass Firefox/WebKit.

Historical TC-003 failure was an automation defect, was corrected, and is
excluded from final product metrics.

==================================================
15. AI/HUMAN CORRECTION HISTORY
==================================================

The final summary must preserve the important automation history:

Primary genuine AI-generated script correction:

getCouponRow relative-locator correction

Original issue:
incorrect Playwright filter({ has }) composition

Human correction:
row-relative exact-code locator

Runtime Verification:
VERIFIED_MULTI_BROWSER

Secondary Runtime Automation Correction:

FR17-TC-003 assertion-scope / locale-independence correction

Runtime Verification:
VERIFIED_MULTI_BROWSER

Do not rewrite history to imply the AI generated the final scripts correctly
on the first attempt.

==================================================
16. DEMO PLAN FINALIZATION
==================================================

Update:

docs/demo/fr-17-demo-plan.md

Set:

Primary Demo Feature:
FR-17

Primary Demo Test:
FR17-TC-004

Final Selected Demo Test:
FR17-TC-004

Demo Tag:
@demo

Demo Runtime Status:
VERIFIED_MULTI_BROWSER

Primary DEMO_FIX:
FR-17 getCouponRow relative-locator correction

DEMO_FIX Type:
TEST_SCRIPT_CORRECTION

DEMO_FIX Runtime Verification:
VERIFIED_MULTI_BROWSER

Secondary Runtime Correction:
FR17-TC-003 assertion-scope / locale-independence correction

Secondary Runtime Correction Verification:
VERIFIED_MULTI_BROWSER

Demo Recording Command Status:
READY

No recording execution has occurred.

==================================================
17. DEMO RECORDING CHECKLIST
==================================================

Create:

docs/demo/fr-17-demo-checklist.md

Include clear checkboxes for:

[ ] Recording software ready

[ ] `whoami` command ready

[ ] `hostname` command ready

[ ] README FR-17 requirement section ready to show

[ ] Agent Skill file path ready

[ ] A-016 original generated output ready for script-fix evidence

[ ] Corrected getCouponRow implementation ready

[ ] TC-004 @demo test ready

[ ] test-data/fr-17.json ready

[ ] isolated Web Admin/backend runtime plan documented

[ ] demo runtime credentials available privately

[ ] PowerShell demo environment commands prepared

[ ] `@demo` collection previously verified as 3 project definitions

[ ] TC-004 previously verified on Chromium

[ ] TC-004 previously verified on Firefox

[ ] TC-004 previously verified on WebKit

[ ] primary DEMO_FIX verified multi-browser

[ ] final three-browser HTML reports ready

[ ] FR-17 cross-browser summary ready

[ ] Bug Report evidence ready

[ ] AI Audit entries ready

[ ] GitHub Issues publication status known

Also include:

Recording Status:
NOT_RECORDED

Do not claim the video exists.

==================================================
18. DEMO COMMAND PREPARATION
==================================================

Prepare the command in the checklist/plan, but do NOT execute it.

Windows / PowerShell concept:

$env:FEATURE_ID = 'FR-17'
$env:STUDENT_ID = '23127107'

# runtime-only environment variables are set privately:
# SUT_API_BASE_URL
# FR17_ADMIN_BASE_URL
# FR17_TEST_ADMIN_EMAIL
# FR17_TEST_ADMIN_PASSWORD
# FR17_TEST_USER_EMAIL
# FR17_TEST_USER_PASSWORD
# FR17_ISOLATED_DB
# FR17_TEST_DB_PATH
# FR17_RUN_ID
# RUN_ID
# RUN_TIMESTAMP

npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo"

Do not write secret values.

Do not execute this command in finalization.

==================================================
19. DEMO REPORT NOTE
==================================================

The later recording run is a DEMONSTRATION run.

The authoritative full feature submission evidence remains the archived final:

corrected Chromium
Firefox
WebKit

runs.

The recording does not replace the complete feature execution evidence.

==================================================
20. EVIDENCE IMMUTABILITY
==================================================

Do not modify:

historical Chromium A-018 evidence

corrected Chromium evidence

Firefox evidence

WebKit evidence

original screenshots

original traces

HTML reports

A-016/A-018/A-019/A-020 verbatim interaction files

Candidate screenshot promotion creates derivative copies only.

==================================================
21. DO NOT CHANGE
==================================================

Do not modify:

tests/fr-17/**
test-data/fr-17.json
playwright.config.js
approved test design
SUT source
backend/database.sqlite
runtime execution results
historical execution records

==================================================
22. FINAL TRACEABILITY
==================================================

Verify:

Requirement
→ Test Case
→ external data
→ Playwright test
→ browser run
→ assertion result
→ failure classification
→ final Defect ID
→ screenshot
→ Bug Report
→ GitHub Issue draft

for all four defects.

Use:

PASS
PASS_WITH_OPEN_REQUIREMENT_GAPS
FAIL

Do not close the existing 11 requirement gaps artificially.

Expected:

PASS_WITH_OPEN_REQUIREMENT_GAPS

==================================================
23. AI AUDIT
==================================================

After completion use:

$log-ai-audit

Operation:
CREATE_ENTRY

Use the next valid sequential Artifact ID.

Expected if no intervening artifact exists:

A-021

Artifact:

FR-17 Final Defect Reporting, Feature Completion and Demo Readiness Bundle

Workflow Stage:

FR-17 confirmed defect documentation and recording preparation before final
human review

Feature / Task:

FR-17 — Coupon management

Related Artifacts:

docs/defects/fr-17/
docs/execution-results/fr-17-final-summary.md
docs/demo/fr-17-demo-plan.md
docs/demo/fr-17-demo-checklist.md

Preserve exact prompt and original output.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.

==================================================
24. RETURN
==================================================

Return:

1. Finalization Status
2. Confirmed Failed Test Cases
3. Confirmed Underlying Defect Count
4. Defect ID Mapping
5. Bug Reports Created
6. Screenshot Promotion Result
7. Original Evidence Preservation
8. GitHub Issue Drafts Created
9. Severity / Priority Summary
10. Cross-Browser Defect Summary
11. Final Automation Metrics
12. Remaining Automation Defects
13. Needs More Evidence
14. Final Traceability Result
15. Primary Demo Test
16. Demo Runtime Status
17. Primary DEMO_FIX
18. Primary DEMO_FIX Runtime Verification
19. Secondary Runtime Correction
20. Demo Recording Checklist
21. Recording Status
22. GitHub Publication Status
23. Browser Execution Performed
24. Database Mutation Performed
25. Files Created
26. Files Modified
27. AI Audit Artifact
28. Current Checkpoint

Expected:

Finalization Status:
COMPLETED_PENDING_HUMAN_REVIEW

Confirmed Failed Test Cases:
4

Confirmed Underlying Defect Count:
4

Remaining Automation Defects:
0

Needs More Evidence:
0

Primary Demo Test:
FR17-TC-004

Demo Runtime Status:
VERIFIED_MULTI_BROWSER

Primary DEMO_FIX Runtime Verification:
VERIFIED_MULTI_BROWSER

Recording Status:
NOT_RECORDED

GitHub Publication Status:
NOT_PUBLISHED

Browser Execution Performed:
NO

Database Mutation Performed:
NO

Stop at:

CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED
