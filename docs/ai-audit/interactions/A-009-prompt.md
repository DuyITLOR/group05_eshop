$playwright-feature-workflow

Workflow Mode:
FINALIZE

Feature ID:
FR-05

Feature Name:
Product listing and search

Student ID:
23127107

SUT Base URL:
http://localhost:5173

Cross-Browser Summary:
docs/execution-results/fr-05-cross-browser-summary.md

Chromium Evidence:
docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md

Firefox Evidence:
docs/execution-results/fr-05-firefox-execution.md

WebKit Evidence:
docs/execution-results/fr-05-webkit-execution.md

Approved Test Cases:
docs/test-cases/fr-05/test-cases.md

Automation Review:
docs/automation-reviews/fr-05-ai-review.md

Automation Gaps:
docs/gaps/fr-05-automation-gaps.md

==================================================
APPROVED CROSS-BROWSER RESULT
==================================================

All three engines:

Total: 13
Passed: 8
Failed: 5

Confirmed PRODUCT_DEFECT:

- FR05-TC-004
- FR05-TC-005
- FR05-TC-011
- FR05-TC-012
- FR05-TC-014

No remaining AUTOMATION_DEFECT.

No ENVIRONMENT_FAILURE.

FR05-TC-006:
CROSS_BROWSER_VERIFIED_PASS

==================================================
CURRENT GOAL
==================================================

Perform only the FR-05 FINAL DEFECT AND FEATURE BUNDLE:

1. Create defect Markdown reports.
2. Capture screenshot evidence for each confirmed product defect.
3. Prepare GitHub Issue-ready content.
4. Create final FR-05 automation summary.
5. Validate submission traceability for FR-05.
6. Create AI Audit A-009.

Do not fix the SUT.

Do not weaken tests.

Do not rerun the entire three-browser suite.

Stop at:

CHECKPOINT: FR05_FINAL_REVIEW_REQUIRED

==================================================
1. DEFECT INVENTORY
==================================================

Create exactly five confirmed product-defect records:

FR05-TC-004
Product image alt attribute is empty.

FR05-TC-005
Price uses VND instead of required ₫ symbol.

FR05-TC-011
Formatting markup is interpreted instead of displayed as literal safe text.

FR05-TC-012
Event-handler markup executes through reflected search input.

FR05-TC-014
Home page exposes two semantic h1 elements instead of exactly one.

Do not create a defect for FR05-TC-006.

FR05-TC-006 was an AUTOMATION_DEFECT and has already been corrected and
verified across all three engines.

==================================================
2. DEFECT REPORT FILES
==================================================

Create:

docs/defects/fr-05/

Use one Markdown file per confirmed defect.

Suggested names:

FR05-TC-004-empty-image-alt.md
FR05-TC-005-wrong-currency-symbol.md
FR05-TC-011-unsafe-formatting-markup.md
FR05-TC-012-reflected-xss-execution.md
FR05-TC-014-multiple-h1.md

Each defect report must contain:

- Defect ID
- Related Test Case ID
- Feature
- Title
- Severity
- Priority
- Environment
- Browsers Reproduced
- Preconditions
- Steps to Reproduce
- Expected Result
- Actual Result
- Cross-Browser Result
- Evidence
- Screenshot Path
- Related HTML Report Paths
- Requirement Reference
- Initial Discovery Run
- Final Confirmation
- Status

Do not invent severity mechanically.

Assign severity based on user/security/accessibility/functional impact and
explain it.

==================================================
3. SCREENSHOT EVIDENCE
==================================================

The previous approved executions generated failure contexts but no standalone
screenshots.

Capture screenshot evidence specifically for defect reporting.

Use Chromium as the primary screenshot browser unless a browser-specific
difference requires otherwise.

Do NOT rerun the full suite merely to get screenshots.

Reproduce each defect using the narrowest legitimate UI flow required.

Capture one clear screenshot per defect at minimum.

Store under:

docs/defects/fr-05/screenshots/

Suggested files:

FR05-TC-004.png
FR05-TC-005.png
FR05-TC-011.png
FR05-TC-012.png
FR05-TC-014.png

For FR05-TC-012:

- preserve safe handling of the dialog;
- capture visible DOM evidence after the dialog is dismissed;
- do not remove or neutralize the defect before capture.

Do not modify SUT data.

Do not modify source code.

==================================================
4. SCREENSHOT VALIDITY
==================================================

A screenshot must visibly support the defect claim.

For defects not fully provable from pixels alone, pair screenshot with runtime
evidence.

Examples:

FR05-TC-004:
Screenshot plus DOM/runtime evidence for alt="".

FR05-TC-014:
Screenshot plus semantic heading count evidence.

FR05-TC-012:
Screenshot plus dialog/img[onerror] runtime evidence.

Do not claim a screenshot alone proves invisible DOM semantics.

==================================================
5. GITHUB ISSUE PREPARATION
==================================================

Prepare GitHub Issue-ready content for all five defects.

Create:

docs/defects/fr-05/github-issues/

One Markdown draft per defect.

Each draft should include:

Title

Body:
- Summary
- Environment
- Steps to Reproduce
- Expected Result
- Actual Result
- Browser Coverage
- Evidence
- Screenshot
- Related Test Case
- Requirement

Do not publish GitHub Issues yet unless explicit human authorization to
perform the external write already exists.

Stop for human review before issue publication.

==================================================
6. SECURITY DEFECT HANDLING
==================================================

FR05-TC-012 is security-relevant.

Describe only the demonstrated behavior:

- reflected event-handler markup creates executable img[onerror];
- real FR05-XSS dialogs were captured;
- Chromium: 2
- Firefox: 2
- WebKit: 1

Do not exaggerate beyond observed evidence.

Do not claim broader compromise, data theft, account takeover, or remote code
execution.

==================================================
7. FINAL FEATURE SUMMARY
==================================================

Create:

docs/execution-results/fr-05-final-summary.md

Include:

Feature:
FR-05

Approved Test Cases:
17

Automated:
13

Blocked by Implementation:
4

Browsers:
Chromium
Firefox
WebKit

Final corrected result per browser:

13 total
8 passed
5 failed

Confirmed Product Defects:
5

Automation Defects Found During Development:
1

Automation Defects Remaining:
0

Document the FR05-TC-006 history:

Original Chromium:
FAILED due to automation helper defect.

Human triage:
AUTOMATION_DEFECT.

Correction:
Grouping helper fixed.

Verification:
PASSED on Chromium, Firefox and WebKit.

This is important AI/human review evidence.

Also summarize:

- external data usage
- assertion-pattern coverage
- HTML report identity verification
- automation gaps
- defect evidence
- GitHub issue publication status

==================================================
8. FINAL TRACEABILITY CHECK
==================================================

Verify FR-05 has:

- approved requirement-based test design
- >=12 automation scripts
- external JSON data
- >=3 assertion patterns
- Chromium execution
- Firefox execution
- WebKit execution
- independent HTML reports
- visible Run by: 23127107
- human-reviewed AI automation
- automation gap documentation
- confirmed defect documentation
- screenshot evidence
- AI audit trail

Do not claim GitHub Issue publication until publication actually occurs.

==================================================
9. DO NOT MODIFY
==================================================

Do not modify:

- approved tests
- helpers
- Playwright config
- test data
- SUT source
- database source

Screenshot capture may use runtime browser interaction only.

==================================================
10. RETURN
==================================================

Return:

1. Confirmed Defects
2. Defect Reports Created
3. Screenshot Evidence Created
4. GitHub Issue Drafts Created
5. Security Defect Summary
6. Final FR-05 Automation Result
7. Automated Test Count
8. Blocked Test Count
9. Product Defect Count
10. Remaining Automation Defect Count
11. Three-Browser Coverage
12. HTML Report Verification
13. Final Traceability Result
14. Files Created
15. Files Modified
16. GitHub Publication Status
17. Current Checkpoint

Stop at:

CHECKPOINT: FR05_FINAL_REVIEW_REQUIRED

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After producing the final defect/feature bundle use:

$log-ai-audit

Operation:
CREATE_ENTRY

Expected Artifact ID:
A-009

Artifact:
FR-05 final defect reporting and feature completion bundle

Workflow Stage:
Final FR-05 review before GitHub issue publication / feature closure

Related artifacts:
- docs/defects/fr-05/
- docs/execution-results/fr-05-final-summary.md

Preserve exact verbatim prompt and original AI output.

Store:

docs/ai-audit/interactions/A-009-prompt.md
docs/ai-audit/interactions/A-009-output.md

Review Status:
PENDING_HUMAN_REVIEW

Do not finalize Verdict.
Do not UPDATE_REVIEW.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: FR05_FINAL_REVIEW_REQUIRED