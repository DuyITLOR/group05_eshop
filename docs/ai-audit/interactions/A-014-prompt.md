$playwright-feature-workflow

Workflow Mode:
FINALIZE

Feature ID:
FR-09

Feature Name:
Discount coupons

Student ID:
23127107

Current Checkpoint:
CHECKPOINT: FR09_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

Cross-Browser Summary:
docs/execution-results/fr-09-cross-browser-summary.md

Chromium Execution:
docs/execution-results/fr-09-chromium-execution.md

Firefox Execution:
docs/execution-results/fr-09-firefox-execution.md

WebKit Execution:
docs/execution-results/fr-09-webkit-execution.md

Candidate Screenshot Manifest:
docs/defects/fr-09/candidate-screenshots/README.md

Automation Review:
docs/automation-reviews/fr-09-ai-review.md

Automation Gaps:
docs/gaps/fr-09-automation-gaps.md

==================================================
HUMAN-APPROVED EXECUTION RESULT
==================================================

All three browsers:

16 total
10 passed
6 failed

Confirmed PRODUCT_DEFECT Test Case IDs:

FR09-TC-002
FR09-TC-003
FR09-TC-006
FR09-TC-012
FR09-TC-013
FR09-TC-016

No remaining:

AUTOMATION_DEFECT
ENVIRONMENT_FAILURE
NEEDS_MORE_EVIDENCE

==================================================
DEFECT DEDUPLICATION
==================================================

Do NOT create one Bug Report per failed Test Case automatically.

Create exactly five underlying Defect IDs using this human-approved mapping.

--------------------------------------------------
FR09-BUG-001
--------------------------------------------------

Found by Test Cases:

FR09-TC-002
FR09-TC-003

Defect:

Percent coupon calculation is incorrect.

Requirement scope:

percent:
discount_amount = total * discount_value / 100

final_amount:
final_amount = total - discount_amount

TC-002 and TC-003 represent two independently asserted consequences of the
same underlying percent-calculation defect.

Create ONE Bug Report containing both Test Case IDs.

--------------------------------------------------
FR09-BUG-002
--------------------------------------------------

Found by:

FR09-TC-006

Defect:

Coupon is rejected when total equals min_order_amount.

Authoritative boundary:

total >= min_order_amount

Do not describe the implementation operator as the root cause unless runtime
or inspected implementation evidence supports that observation.

--------------------------------------------------
FR09-BUG-003
--------------------------------------------------

Found by:

FR09-TC-012

Defect:

Unauthenticated user can apply a coupon without a valid JWT.

Keep this distinct from FR09-BUG-004.

This defect concerns the coupon-application authentication/business-rule
boundary.

--------------------------------------------------
FR09-BUG-004
--------------------------------------------------

Found by:

FR09-TC-013

Defect:

Unauthenticated user can access usable Checkout coupon functionality.

Keep this distinct from FR09-BUG-003.

This defect concerns Checkout/UI access control.

--------------------------------------------------
FR09-BUG-005
--------------------------------------------------

Found by:

FR09-TC-016

Defect:

Checkout total can be edited directly by the user.

Requirement boundary:

Checkout must use the trusted/derived order total rather than an editable
user-controlled value.

==================================================
SCREENSHOT POLICY
==================================================

DO NOT execute Playwright.

DO NOT open Chromium, Firefox or WebKit.

DO NOT reproduce any defect again.

Use the existing candidate screenshots copied from the actual Chromium
failure run.

Promote/rename them to:

docs/defects/fr-09/screenshots/FR09-BUG-001.png
docs/defects/fr-09/screenshots/FR09-BUG-002.png
docs/defects/fr-09/screenshots/FR09-BUG-003.png
docs/defects/fr-09/screenshots/FR09-BUG-004.png
docs/defects/fr-09/screenshots/FR09-BUG-005.png

For FR09-BUG-001:

TC-002 and TC-003 are one underlying defect.

Select the clearer Chromium screenshot as the primary screenshot.

Preserve both original TC-002 and TC-003 screenshots in their execution
artifact locations.

Do not delete candidate evidence.

Record the selected source Test Case / source Run ID.

==================================================
BUG REPORT LANGUAGE STANDARD
==================================================

Primary descriptive language:

VIETNAMESE

Standardized headings / field names:

ENGLISH

Keep technical identifiers/terms in English where useful.

Bug title format:

[HW04][BUG][FR-09][Discount Coupon] <Vietnamese bug description>

Examples:

[HW04][BUG][FR-09][Discount Coupon] Percent coupon tính sai discount và final amount

[HW04][BUG][FR-09][Discount Coupon] Coupon bị từ chối khi total bằng minimum amount

[HW04][BUG][FR-09][Discount Coupon] User chưa đăng nhập vẫn có thể apply coupon

[HW04][BUG][FR-09][Discount Coupon] User chưa đăng nhập vẫn sử dụng được Checkout coupon flow

[HW04][BUG][FR-09][Discount Coupon] Checkout total có thể chỉnh sửa trực tiếp

==================================================
REQUIRED BUG REPORT STRUCTURE
==================================================

Create:

docs/defects/fr-09/FR09-BUG-001-percent-calculation.md
docs/defects/fr-09/FR09-BUG-002-minimum-boundary.md
docs/defects/fr-09/FR09-BUG-003-missing-coupon-authentication.md
docs/defects/fr-09/FR09-BUG-004-unguarded-checkout-coupon-flow.md
docs/defects/fr-09/FR09-BUG-005-editable-checkout-total.md

Each report must contain in this order:

# [HW04][BUG][FR-09][Discount Coupon] <Vietnamese bug title>

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
CONTENT LANGUAGE
==================================================

Headings remain English.

Actual explanations must be Vietnamese.

Examples:

## Actual Result

Coupon `SAVE10` trả về discount amount không đúng với công thức phần trăm
được định nghĩa trong FR-09.

Technical terms may remain English:

JWT
discount_amount
final_amount
DOM
Playwright
runtime
browser
trace
HTML report
API
Checkout
coupon
payload
requirement
test case

==================================================
SEVERITY / PRIORITY
==================================================

Use only:

Severity:
Critical | High | Medium | Low

Priority:
P1 | P2 | P3 | P4

Write Reason in Vietnamese.

Do NOT assign all five defects the same severity/priority automatically.

Security/authentication defects should be evaluated based only on demonstrated
impact.

Do not exaggerate beyond evidence.

==================================================
HASHTAGS
==================================================

Every report and GitHub Issue draft must contain relevant standardized
hashtags.

Base:

#HW04
#BUG
#FR09
#DiscountCoupon

Browser:

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

Category options:

#Functional
#Security
#Authentication
#Authorization
#Validation
#DataIntegrity
#UI
#CrossBrowser

Choose only evidence-supported categories.

==================================================
GITHUB ISSUE DRAFTS
==================================================

Create exactly five:

docs/defects/fr-09/github-issues/FR09-BUG-001.md
docs/defects/fr-09/github-issues/FR09-BUG-002.md
docs/defects/fr-09/github-issues/FR09-BUG-003.md
docs/defects/fr-09/github-issues/FR09-BUG-004.md
docs/defects/fr-09/github-issues/FR09-BUG-005.md

Use the same Vietnamese-body / English-heading policy.

Include:

# Title
# Body

and inside Body:

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

Do NOT publish GitHub Issues.

Publication Status:

NOT_PUBLISHED

==================================================
CROSS-BROWSER EVIDENCE
==================================================

Every defect reproduced on:

Chromium
Firefox
WebKit

Each report must contain:

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |

Use actual run IDs:

Chromium:
FR-09-chromium-2026-08-09T22-35-59-4764573Z

Firefox:
FR-09-firefox-2026-08-09T22-38-41-6269203Z

WebKit:
FR-09-webkit-2026-08-09T22-41-12-8688590Z

Do not fabricate browser versions if they were not recorded.

==================================================
FINAL FEATURE SUMMARY
==================================================

Create:

docs/execution-results/fr-09-final-summary.md

Include:

Approved Test Cases:
16

Automated:
16

Blocked:
0

Browsers:
Chromium
Firefox
WebKit

Each browser:

16 total
10 passed
6 failed

Failed Test Cases:
6

Confirmed Underlying Product Defects:
5

Remaining Automation Defects:
0

Remaining Needs More Evidence:
0

Environment Failures:
0

Explain that:

TC-002 and TC-003 map to the same underlying percent-calculation defect.

Document screenshot policy:

- screenshots originated from the first actual failed execution;
- no defect was rerun solely for evidence capture;
- Chromium primary screenshots were promoted only after human defect review;
- Firefox/WebKit originals remain preserved.

Also summarize:

- external JSON usage;
- assertion-pattern coverage;
- isolated DB strategy;
- workspace DB protection;
- HTML report identity;
- requirement gaps;
- GitHub publication status.

==================================================
DO NOT CHANGE
==================================================

Do not modify:

tests/fr-09/**
test-data/fr-09.json
playwright.config.js
SUT source
backend/database.sqlite
approved Test Cases
original execution records
original HTML reports
original traces
original screenshots
A-013 verbatim prompt/output

==================================================
AI AUDIT
==================================================

After completion use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next sequential Artifact ID.

Expected if A-013 is finalized:

A-014

Artifact:
FR-09 Final Defect Reporting and Feature Completion Bundle

Workflow Stage:
FR-09 confirmed defect documentation before GitHub Issue publication and
feature closure

Related Artifacts:

docs/defects/fr-09/
docs/execution-results/fr-09-final-summary.md

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
RETURN
==================================================

Return:

1. Confirmed Failed Test Cases
2. Confirmed Underlying Defect Count
3. Defect ID Mapping
4. Bug Reports Created
5. Screenshot Promotion Result
6. Original Screenshot Preservation Result
7. GitHub Issue Drafts Created
8. Severity / Priority Summary
9. Hashtag Summary
10. Three-Browser Evidence Summary
11. Final Automation Result
12. Remaining Automation Defects
13. Remaining Needs More Evidence
14. Final Traceability Result
15. GitHub Publication Status
16. Files Created
17. Files Modified
18. Browser Execution Performed
19. AI Audit Artifact
20. Current Checkpoint

Expected:

Confirmed Failed Test Cases:
6

Confirmed Underlying Defect Count:
5

Browser Execution Performed:
NO

GitHub Publication Status:
NOT_PUBLISHED

Stop at:

CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED