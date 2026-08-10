$playwright-feature-workflow

Workflow Mode:
CORRECT_RUNTIME_AUTOMATION_DEFECT

Feature ID:
FR-17

Feature Name:
Coupon management

Student ID:
23127107

Source Execution Artifact:
A-018

Current Checkpoint:
CHECKPOINT: FR17_CHROMIUM_AUTOMATION_REVIEW_REQUIRED

==================================================
HUMAN REVIEW DECISION
==================================================

Human review accepts the A-018 Chromium execution and triage.

Confirmed Chromium automation defect:

FR17-TC-003

Do NOT change the approved Test Case.

Do NOT change the SUT.

Do NOT execute any browser during this correction phase.

Do NOT rerun Chromium yet.

Correct only the generated automation so the implementation matches the
approved TC-003 objective.

==================================================
DEFECT
==================================================

FR17-TC-003 successfully exercised the required business behavior:

- valid percent coupon was submitted;
- the owned coupon was created successfully;
- the runtime reached the created-row verification.

The false failure came from the generic generated
expectOwnedCouponRow() helper asserting an additional min-order display value.

That assertion is:

1. outside TC-003's primary approved verification scope; and
2. locale-dependent because the expected monetary display was generated with
   Node-side Number(...).toLocaleString().

The approved TC-003 Expected Result requires:

- exactly one controlled owned coupon exists;
- code is observable;
- type is `percent`;
- submitted discount_value is observable correctly.

TC-003 does NOT require min_order_amount display formatting to be its PASS/FAIL
oracle.

==================================================
CORRECTION STRATEGY
==================================================

Refactor the created-coupon row assertion so each Test Case asserts only the
fields required by its approved objective.

Do NOT weaken FR17-TC-004.

Preferred design:

Create a core owned-row assertion that verifies:

- exact owned row count = 1;
- row visible;
- expected coupon type;
- expected discount value.

Then allow TC-004 to perform its additional approved lower-bound assertions
separately or through explicit optional assertions.

Conceptually:

expectOwnedCouponCore(page, coupon)

and, where appropriate:

expectOwnedCouponBoundaryValues(page, coupon)

Equivalent maintainable naming is acceptable.

==================================================
FR17-TC-003 REQUIRED ASSERTIONS
==================================================

FR17-TC-003 must verify:

- owned code row exists exactly once;
- row is visible;
- displayed coupon type corresponds to `percent`;
- submitted discount_value is displayed correctly.

Do NOT require for TC-003:

- min_order_amount formatted display;
- max_uses_per_user formatted display;
- expiry display;
- unrelated fields not present in its approved primary Expected Result.

Its external business input values still remain valid setup inputs.

They are not removed from test-data/fr-17.json.

==================================================
FR17-TC-004 PRESERVATION
==================================================

FR17-TC-004 remains:

PRIMARY_DEMO_CANDIDATE
@demo

Its approved objective includes the valid fixed CREATE at lower valid
boundaries:

discount_value = 1
min_order_amount = 0
max_uses_per_user = 1

Preserve requirement-relevant assertions for those values.

Do not weaken TC-004 merely to share TC-003's smaller assertion set.

The existing successful Chromium TC-004 result must remain explainable after
the refactor.

==================================================
LOCALE-INDEPENDENT ASSERTION POLICY
==================================================

Avoid Node-locale-dependent business assertions where the requirement does not
define locale formatting.

Do not use:

Number(value).toLocaleString()

as an authoritative Expected Result unless the formatting requirement is
explicitly defined and the locale is controlled.

For numeric display assertions required by an approved Test Case, prefer a
requirement-faithful strategy based on the observable semantic value rather
than an environment-dependent thousands separator.

If the current TC-004 values are 0 and 1 and therefore unambiguous across
supported formatting, document that fact rather than generalizing locale
format rules.

Do NOT invent a currency-formatting requirement for FR-17.

==================================================
DO NOT MODIFY PRODUCT CANDIDATES
==================================================

Do not alter or weaken:

FR17-TC-002

FR17-TC-016

Their A-018 classifications remain:

PRODUCT_DEFECT_CANDIDATE

Do not modify their screenshots, traces or original execution evidence.

==================================================
EVIDENCE PRESERVATION
==================================================

Do not modify:

A-018 Chromium HTML report

A-018 test-results directory

A-018 screenshots

A-018 traces

A-018 candidate screenshots

docs/execution-results/fr-17-chromium-execution.md

The original failed execution is immutable evidence of the automation defect.

Do not delete it after correction.

==================================================
STATIC VALIDATION
==================================================

After correction verify:

1. Exactly 16 FR17 Test Case IDs remain.
2. No duplicate IDs.
3. FR17-TC-003 still implements valid percent CREATE.
4. TC-003 verifies code/type/discount value.
5. TC-003 no longer fails on an out-of-scope min-order display assertion.
6. No locale-dependent min-order formatting oracle remains in TC-003.
7. TC-004 remains @demo.
8. TC-004 retains its approved lower-bound verification.
9. TC-005 duplicate oracle remains corrected.
10. TC-002 visible-indicator correction remains intact.
11. getCouponRow relative-locator correction remains intact.
12. workspace DB guard remains intact.
13. no waitForTimeout() added.
14. no force:true added.
15. no credentials added.
16. no browser execution occurred.
17. no DB business mutation occurred.
18. A-018 execution evidence remains unchanged.

==================================================
DEMO FIX HISTORY
==================================================

Do not replace the primary existing demo script-fix story:

FR-17 getCouponRow relative-locator correction

Keep:

DEMO_FIX Candidate:
FR-17 getCouponRow relative-locator correction

Type:
TEST_SCRIPT_CORRECTION

Runtime Verification:
PARTIALLY_VERIFIED

Chromium verification:
VERIFIED

Also record this new runtime-discovered correction separately:

Secondary Runtime Automation Correction:
FR17-TC-003 assertion-scope / locale-independence correction

Type:
TEST_SCRIPT_CORRECTION

This correction does not replace the primary demo story.

==================================================
FILES ALLOWED TO MODIFY
==================================================

Modify only as necessary:

tests/fr-17/helpers/coupon-ui.js
tests/fr-17/fr-17.spec.js

docs/automation-reviews/fr-17-ai-review.md
docs/automation-plans/fr-17-automation-plan.md
docs/gaps/fr-17-automation-gaps.md
docs/demo/fr-17-demo-plan.md

Do NOT modify:

approved FR-17 test design
test-data/fr-17.json
unless absolutely required for a clerical non-business correction

playwright.config.js

SUT source

backend/database.sqlite

A-018 execution artifacts

==================================================
RETURN
==================================================

Return:

1. Correction Status
2. Affected Test Case
3. Original False-Failure Cause
4. Corrected TC-003 Assertion Scope
5. TC-004 Preservation Result
6. Locale-Independent Assertion Result
7. Primary DEMO_FIX Candidate
8. Secondary Runtime Automation Correction
9. Total Playwright Tests
10. Missing IDs
11. Duplicate IDs
12. Static Validation Result
13. Browser Execution Performed
14. Database Mutation Performed
15. A-018 Evidence Preservation
16. Files Modified
17. AI Audit Artifact
18. Current Checkpoint

Expected:

Correction Status:
CORRECTED_PENDING_HUMAN_REVIEW

Affected Test Case:
FR17-TC-003

Browser Execution Performed:
NO

Database Mutation Performed:
NO

A-018 Evidence Preservation:
PASS

Stop at:

CHECKPOINT: FR17_TC003_AUTOMATION_CORRECTION_REVIEW_REQUIRED

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After correction use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next sequential Artifact ID.

Expected:

A-019

If the actual sequence differs, use the actual next ID.

Artifact:
FR-17 TC-003 Runtime Automation Defect Correction

Workflow Stage:
Human-directed correction after Chromium automation-defect gate and before
corrected multi-browser execution

Related Artifacts:

tests/fr-17/
docs/automation-reviews/fr-17-ai-review.md
docs/demo/fr-17-demo-plan.md
docs/execution-results/fr-17-chromium-execution.md

Preserve exact prompt and original output.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.
