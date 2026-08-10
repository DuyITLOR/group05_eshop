$playwright-feature-workflow

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
AUTOMATION_BUILD_BUNDLE

Feature ID:
FR-09

Feature Name:
Discount coupons

Student ID:
23127107

Automation Target:
Playwright web frontend

Approved Test Design Directory:
docs/test-cases/fr-09/

Approved Test Cases:
FR09-TC-001 through FR09-TC-016

Expected Automation Script Count:
16

Minimum Required Automation Script Count:
12

SUT Frontend:
http://localhost:5173

SUT Backend:
http://localhost:3000

Primary Content Language:
Vietnamese

Standard headings / field names / IDs / enums / commands:
English where appropriate

==================================================
CURRENT APPROVED DESIGN STATE
==================================================

Human-approved FR-09 Test Design Bundle contains:

Test Conditions:
16

Test Cases:
16

POSITIVE:
6

NEGATIVE:
5

EDGE:
5

Automation Candidates:
16

AUTOMATION_SUITABLE:
1

AUTOMATION_POSSIBLE_WITH_SETUP:
15

Atomic Requirements:
12

Coverage:
12 / 12 FULLY_COVERED

Stateful cases:

- FR09-TC-010
- FR09-TC-014
- FR09-TC-015

Existing reusable coupons:

- SAVE10
- BIGBUY
- VIP100
- EXPIRED

Existing reusable seed product:

Bàn phím cơ Keychron Q1

Verified normal total:

4000000

==================================================
IMPORTANT HUMAN CORRECTIONS ALREADY APPROVED
==================================================

Preserve these exact approved corrections.

FR09-TC-014:

Coupon:
SAVE10

usage_count:
1

max_uses_per_user:
1

total:
4000000

Expected:
REJECT

Original payable total remains:
4000000

Primary isolated false condition:
C5

--------------------------------------------------

FR09-TC-015:

Coupon:
VIP100

usage_count:
1

max_uses_per_user:
2

total:
4000000

Expected:
ACCEPT

discount_amount:
100000

final_amount:
3900000

Primary isolated condition:
C5=true

Do NOT revert either case back to total 300000.

==================================================
HUMAN-APPROVED SETUP POLICIES
==================================================

1. Isolated test DB / transaction fixture

APPROVED_WITH_CONSTRAINTS

May be used for:

- FR09-TC-010
- FR09-TC-014
- FR09-TC-015

Constraints:

- test-only isolated state;
- deterministic setup;
- independent per test;
- rollback/cleanup after each test;
- do not depend on test order;
- do not mutate unrelated business data;
- do not modify authoritative requirement semantics.

2. Controlled frontend cart fixture

APPROVED_WITH_CONSTRAINTS

May be used only for explicit requirement-supported boundary totals where
existing product data cannot naturally create the required total.

Approved boundary totals currently include:

299999
300000
500001
100001

Do not create artificial product rows in the database merely to manufacture
these totals.

Prefer existing seed total 4000000 for normal and non-boundary scenarios.

==================================================
OPEN REQUIREMENT GAPS
==================================================

Do NOT invent behavior for:

- exact success/error UI copy;
- expiry timezone;
- fractional percent rounding;
- coupon usage increment timing;
- empty coupon input;
- trimming;
- case sensitivity;
- coupon stacking;
- coupon replacement;
- coupon removal;
- network recovery.

Do not create extra tests for these behaviors.

Do not hardcode current implementation behavior as Expected Result.

==================================================
SOURCE PRECEDENCE
==================================================

Expected Result source precedence remains:

1. README.md FR-09
2. directly applicable README.md FR-08 requirements
3. approved API specification as SUPPORTING
4. implementation as IMPLEMENTATION_ONLY

Known implementation discrepancies must NOT weaken assertions.

Known discrepancies include:

- apply-coupon endpoint missing JWT enforcement;
- frontend/body-supplied user_id;
- usage-check bypass when identity is absent;
- `>` instead of `>=`;
- incorrect percent formula;
- unguarded Checkout route;
- editable checkout total;
- non-atomic usage recording.

Automation is allowed to reveal these as PRODUCT_DEFECT.

==================================================
PHASE GOAL
==================================================

In this ONE interaction perform:

1. Automation implementation plan
2. External JSON test data design
3. Fixture/setup implementation
4. Helper implementation
5. Playwright script generation
6. Screenshot/trace-on-failure configuration
7. AI static review
8. Automation gap analysis
9. Static validation
10. AI Audit CREATE_ENTRY

Do NOT execute the actual FR-09 browser suite.

Do NOT classify runtime PRODUCT_DEFECT results yet.

Do NOT create bug reports yet.

Stop at:

CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED

==================================================
1. REUSE EXISTING FR-05 INFRASTRUCTURE
==================================================

Inspect the approved existing Playwright infrastructure before creating new
files.

Reuse where appropriate:

- playwright.config.js
- package.json
- package-lock.json
- existing reporter logic
- Student ID / Run ID / timestamp report strategy
- safe utility patterns
- test project names:
  chromium
  firefox
  webkit

Do not duplicate generic helpers unnecessarily.

However FR-09 feature-specific helpers should remain scoped under:

tests/fr-09/helpers/

unless they are genuinely reusable and moving them is justified.

Do not modify FR-05 tests.

==================================================
2. TARGET FILE STRUCTURE
==================================================

Preferred structure:

tests/fr-09/
  fr-09.spec.js
  helpers/
    fr-09-helpers.js
  fixtures/
    fr-09-fixtures.js

test-data/
  fr-09.json

docs/automation-plans/
  fr-09-automation-plan.md

docs/automation-reviews/
  fr-09-ai-review.md

docs/gaps/
  fr-09-automation-gaps.md

Do not create unnecessary files.

If existing repository conventions use equivalent directories, follow the
existing convention and explain deviations.

==================================================
3. EXTERNAL DATA REQUIREMENT
==================================================

All reusable test data must come from:

test-data/fr-09.json

Do NOT use inline arrays as the primary data source for reusable test data.

The external JSON should include traceable logical datasets for:

- SAVE10
- BIGBUY
- VIP100
- EXPIRED
- normal total 4000000
- below-minimum total 299999
- exact-minimum total 300000
- above-minimum total 500001
- expiration-isolation total 100001
- absent coupon code
- inactive coupon controlled state
- usage=max controlled state
- usage=max−1 controlled state

Each dataset should have a stable Data ID such as:

FR09-DATA-001

or equivalent.

Do not store secrets or real credentials in JSON.

Do not store JWT tokens in source-controlled JSON.

==================================================
4. AUTHENTICATION STRATEGY
==================================================

FR-09 UI tests require valid authenticated browser state for most cases.

Inspect the current application authentication flow and existing seed
capabilities.

Implement the narrowest deterministic test fixture that establishes a valid
authenticated customer session.

Requirements:

- do not hardcode secrets into test files;
- do not fabricate authentication semantics;
- preserve valid JWT requirement;
- each test must be independently reproducible;
- unauthenticated tests must use fresh isolated context;
- authenticated and unauthenticated state must not leak between tests.

If repository seed credentials already exist and are intended for local test
use, reference them through an approved fixture/environment strategy rather
than duplicating them throughout tests.

Document the exact approach.

==================================================
5. CART / CHECKOUT SETUP STRATEGY
==================================================

Most tests should reach Checkout through UI-driven user behavior when
practical.

For normal 4000000 scenarios:

prefer the existing seed product:

Bàn phím cơ Keychron Q1

and create the cart state deterministically.

For explicit boundary totals:

299999
300000
500001
100001

a controlled frontend/cart fixture is allowed.

The controlled fixture must:

- avoid database product creation;
- be scoped to the test;
- preserve UI-driven coupon application/assertions;
- avoid bypassing the feature under test;
- be cleaned after each test.

Do not convert FR-09 tests into API-only tests.

==================================================
6. ISOLATED DB FIXTURE STRATEGY
==================================================

Required for:

FR09-TC-010
FR09-TC-014
FR09-TC-015

Implement a deterministic test-only setup strategy for:

Inactive coupon:
is_active = 0

Usage=max:
SAVE10 usage_count = 1

Usage=max−1:
VIP100 usage_count = 1

Requirements:

- setup must target only isolated test data/state;
- record original state where applicable;
- restore/rollback after each test;
- cleanup should run even when assertion fails;
- no dependency between TC-010, TC-014, TC-015;
- no test may rely on another test having run previously.

If safe transactional isolation is impossible with current architecture,
do NOT fake it.

Instead mark the affected test:

BLOCKED_BY_SETUP

and explain precisely why.

However first attempt a legitimate isolated test fixture consistent with the
human-approved setup strategy.

==================================================
7. TEST SCRIPT INVENTORY
==================================================

Generate exactly one Playwright test for each approved case where feasible:

FR09-TC-001
FR09-TC-002
FR09-TC-003
FR09-TC-004
FR09-TC-005
FR09-TC-006
FR09-TC-007
FR09-TC-008
FR09-TC-009
FR09-TC-010
FR09-TC-011
FR09-TC-012
FR09-TC-013
FR09-TC-014
FR09-TC-015
FR09-TC-016

Target:

16 real Playwright tests.

Minimum:

12 real Playwright tests.

Do not create placeholder tests.

Do not use test.skip to artificially inflate the count.

If a case cannot legitimately be implemented, classify it in the automation
gap file instead.

==================================================
8. TEST TITLE TRACEABILITY
==================================================

Every Playwright test title must start with the Test Case ID.

Example:

test('FR09-TC-002 percent discount_amount ...', async ({ page }) => {
  ...
});

This must allow direct traceability from:

Test Case
→ Playwright test
→ HTML report
→ execution result
→ future defect report

==================================================
9. UI-DRIVEN ASSERTION POLICY
==================================================

Primary test behavior must occur through the web UI.

Allowed support mechanisms:

- fixture setup;
- database isolation;
- network interception for approved controlled frontend state;
- deterministic auth setup;
- runtime DOM observation.

Do not make a pure API request and call that the FR-09 UI test.

The user-visible coupon flow must be exercised.

==================================================
10. ASSERTION PATTERNS
==================================================

Use at least 3 distinct assertion patterns across the FR-09 suite.

Prefer natural patterns from the approved cases, including:

TEXT_OR_VALUE
VISIBILITY_OR_HIDDEN_STATE
ENABLED_OR_DISABLED_STATE
STATE_TRANSITION
CALCULATION
PERMISSION
URL_OR_NAVIGATION
ATTRIBUTE_OR_CLASS
COUNT

Do not add meaningless assertions just to increase pattern count.

Numeric coupon assertions must compare normalized numeric values, not merely
substring text.

==================================================
11. AMOUNT PARSING
==================================================

Create a reusable safe numeric parser/helper for displayed monetary values.

It must handle the application's actual grouping/unit presentation without
weakening the numeric oracle.

The helper should extract the numeric value and compare it to expected
discount/final amount.

Do not reuse FR-05's grouping assertion blindly if FR-09 needs a different
purpose.

For FR-09:

numeric semantic value is primary.

Examples:

400000
3600000
50000
3950000
30000
270000
100000
3900000

Do not accept a wrong numeric value just because formatting looks valid.

==================================================
12. REJECTION ASSERTION STRATEGY
==================================================

Exact rejection message copy is an open requirement gap.

Therefore negative cases should assert observable rejection state using
approved behavior such as:

- coupon not applied;
- discount amount absent/not activated;
- payable total unchanged;
- success state absent;
- access denied/not usable.

Do not assert an exact Vietnamese error string unless another authoritative
source defines it.

Do not make rejection assertions so broad that any broken page could pass.

==================================================
13. FR09-TC-012 JWT TEST
==================================================

FR09-TC-012 specifically tests coupon application without valid JWT.

Keep it distinct from TC-013.

TC-012 objective:

apply-coupon authorization boundary.

TC-013 objective:

Checkout access prerequisite.

For TC-012:

- establish controlled Checkout state without valid JWT;
- attempt coupon application through UI;
- assert coupon does not become applied;
- assert coupon-derived discount/final state does not activate;
- preserve original payable total.

Do not silently reinterpret current backend's user_id behavior as conforming.

==================================================
14. FR09-TC-013 CHECKOUT AUTH TEST
==================================================

Use a fresh unauthenticated browser context.

Directly access:

/checkout

Expected Result:

User cannot proceed with functional Checkout/coupon workflow.

Do not hardcode a specific redirect destination unless requirement or existing
approved navigation contract defines it.

A conforming denial could be represented through navigation/access state.

Assertion must be strict enough to distinguish usable Checkout from denied
Checkout.

==================================================
15. FR09-TC-016 TRUSTED TOTAL TEST
==================================================

The authoritative requirement states that checkout total is calculated from
cart and cannot be directly edited.

Expected total:

4000000

The test should verify:

- displayed checkout total corresponds to cart-derived total;
- user cannot directly modify the trusted total.

Do NOT adopt the current editable input as Expected Result.

This case may legitimately fail during execution as PRODUCT_DEFECT.

==================================================
16. FAILURE EVIDENCE POLICY
==================================================

This is mandatory for FR-09 and future features.

Configure Playwright so failed tests automatically retain evidence.

Required baseline:

screenshot:
only-on-failure

trace:
retain-on-failure

If existing config already has a stronger compatible evidence policy, reuse it.

Do not enable unnecessary full video recording unless already required.

The goal is to preserve:

Test Case ID
Run ID
Browser
Failure
Screenshot
Trace
HTML report

from the original execution.

==================================================
17. SCREENSHOT PROMOTION POLICY
==================================================

Do NOT manually copy screenshots into docs/defects/ during this BUILD phase.

Document the future execution rule:

If a failure is triaged as:

PRODUCT_DEFECT

then promote/copy the original failure screenshot into:

docs/defects/fr-09/screenshots/<DefectID>.png

after human-approved defect classification.

If:

AUTOMATION_DEFECT

do NOT promote it as product defect evidence.

Do not assign Defect IDs during build.

==================================================
18. HTML REPORT IDENTITY
==================================================

Reuse the existing approved report identity strategy.

Future FR-09 execution reports must visibly include:

FR-09

Run by:
23127107

ISO timestamp

Run ID

browser project identity

Do not execute reports now.

Static review should verify the infrastructure can support FR-09.

==================================================
19. AUTOMATION PLAN
==================================================

Create:

docs/automation-plans/fr-09-automation-plan.md

Include:

- approved inventory;
- Test Case → Data ID mapping;
- Test Case → fixture/setup mapping;
- Test Case → assertion mapping;
- Test Case → helper mapping;
- test isolation classification;
- expected automation status;
- known implementation risks;
- screenshot/trace policy;
- future execution strategy.

Allowed automation statuses:

READY_FOR_AUTOMATION
READY_WITH_SETUP
BLOCKED_BY_SETUP
BLOCKED_BY_IMPLEMENTATION

Do not mark a test blocked merely because it is expected to reveal a product
defect.

Expected product failure is still executable automation.

==================================================
20. AI STATIC REVIEW
==================================================

Create:

docs/automation-reviews/fr-09-ai-review.md

Review:

- all 16 approved IDs represented;
- no duplicate test objective;
- no inline-array data source replacing external JSON;
- no unsupported expected behavior;
- no API-only test;
- deterministic auth handling;
- deterministic cart state;
- deterministic DB fixture isolation;
- cleanup safety;
- monetary parsing;
- negative assertion strength;
- Test Case ID title traceability;
- minimum script count;
- screenshot configuration;
- trace configuration;
- HTML report compatibility;
- known implementation discrepancies not hidden.

Use review IDs:

FR09-AUTO-REV-001
FR09-AUTO-REV-002
...

If a correction is applied during generation, record:

Finding
Decision
Applied Correction

Do not self-approve the artifact.

==================================================
21. AUTOMATION GAP REPORT
==================================================

Create:

docs/gaps/fr-09-automation-gaps.md

Include only genuine remaining gaps.

Possible classifications:

REQUIREMENT_GAP
BLOCKED_BY_SETUP
BLOCKED_BY_IMPLEMENTATION
DOCUMENTED_RISK
DEFERRED_REQUIREMENT

Do not list a known product defect as an automation gap merely because the test
is expected to fail.

Preserve all existing FR-09 requirement gaps that remain relevant.

==================================================
22. STATIC VALIDATION
==================================================

Perform only non-runtime/static validation.

Allowed examples:

- syntax validation;
- import resolution;
- JSON parsing;
- duplicate Test Case ID detection;
- test-title inventory;
- static script count;
- config review.

Do NOT launch Chromium, Firefox or WebKit.

Do NOT execute FR-09 tests against the SUT.

Do NOT mutate runtime database state merely for validation.

If `playwright test --list` can be performed without starting browsers/SUT,
it may be used only as a collection check.

If there is any risk of runtime setup hooks mutating state during collection,
do not use `--list`; use static inspection instead.

==================================================
23. REQUIRED BUILD GATES
==================================================

Before returning verify:

Approved Test Cases:
16

Playwright scripts:
target 16

Minimum actual scripts:
12

External data:
PASS

At least 3 assertion patterns:
PASS

Test Case ID title traceability:
PASS

No placeholder tests:
PASS

No test-order dependency:
PASS

Screenshot-on-failure:
CONFIGURED

Trace-on-failure:
CONFIGURED

No browser execution:
PASS

If actual implemented script count < 12:

return:

MINIMUM_AUTOMATION_SCRIPT_COUNT_NOT_REACHED

Do not proceed to readiness.

==================================================
24. OUTPUT FILES
==================================================

Expected created/modified files should be limited to the automation build
scope, such as:

tests/fr-09/fr-09.spec.js
tests/fr-09/helpers/fr-09-helpers.js
tests/fr-09/fixtures/fr-09-fixtures.js
test-data/fr-09.json
docs/automation-plans/fr-09-automation-plan.md
docs/automation-reviews/fr-09-ai-review.md
docs/gaps/fr-09-automation-gaps.md

playwright.config.js

only if evidence/report configuration genuinely requires modification.

package.json/package-lock.json

only if a legitimate dependency is required.

Do not modify FR-05 test logic.

==================================================
25. RETURN SUMMARY
==================================================

Return:

1. Approved Test Case Count
2. Implemented Playwright Test Count
3. READY_FOR_AUTOMATION Count
4. READY_WITH_SETUP Count
5. BLOCKED_BY_SETUP Count
6. BLOCKED_BY_IMPLEMENTATION Count
7. External Data Sets
8. Auth Fixture Strategy
9. Cart Fixture Strategy
10. DB Isolation Strategy
11. Stateful Tests
12. Assertion Patterns
13. Screenshot Policy
14. Trace Policy
15. HTML Report Compatibility
16. Static Validation Result
17. Automation Review Findings
18. Remaining Automation Gaps
19. Files Created
20. Files Modified
21. Browser Execution Performed
22. Current Checkpoint

Expected:

Browser Execution Performed:
NO

Stop at:

CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After completing the original Automation Build Bundle output, immediately use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected next Artifact ID:

A-011

If audit sequence differs, use the actual next sequential ID.

Artifact:

FR-09 Automation Build Bundle

Workflow Stage:

FR-09 compressed automation implementation before execution readiness

Feature / Task:

FR-09 — Discount coupons

Related Artifact:

- tests/fr-09/
- test-data/fr-09.json
- docs/automation-plans/fr-09-automation-plan.md
- docs/automation-reviews/fr-09-ai-review.md
- docs/gaps/fr-09-automation-gaps.md

==================================================
AUDIT CONTENT RULES
==================================================

Preserve the exact verbatim prompt.

Store:

docs/ai-audit/interactions/<Artifact-ID>-prompt.md

Preserve the original AI output before human correction.

Store:

docs/ai-audit/interactions/<Artifact-ID>-output.md

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do not UPDATE_REVIEW.

Do not self-approve.

==================================================
AUDIT FAILURE POLICY
==================================================

If CREATE_ENTRY fails:

- preserve valid automation artifacts;
- report the audit failure;
- do not fabricate the audit entry;
- remain at the human-review checkpoint.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED
