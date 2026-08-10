$playwright-feature-workflow

Workflow Mode:
GENERATE_ONLY

Feature ID:
FR-05

Feature Name:
Product listing and search

Approved Test Case File:
docs/test-cases/fr-05/test-cases.md

Approved Automation Plan:
docs/automation-plans/fr-05-automation-plan.md

Approved Test Data:
test-data/fr-05.json

Test Data Plan:
docs/test-data/fr-05-test-data-plan.md

Requirement / Expected Result Sources:
- README.md — FR-05
- README.md — FR-21
- README.md — FR-24
- README.md — SEC-04
- api_specification.md — section 3.1

Minimum Automation Script Count:
12

Repository Root:
.

Test Directory:
tests/

Test Data Directory:
test-data/

Target Browsers:
- chromium
- firefox
- webkit

==================================================
APPROVED WORKFLOW STATE
==================================================

TEST_CASE_DESIGN_APPROVED
AUTOMATION_PLAN_APPROVED
TEST_DATA_APPROVED

Approved inventory:

- Total Test Cases: 17
- Automation Candidates: 13
- Minimum Automation Script Count: 12

READY_FOR_AUTOMATION:
- FR05-TC-002
- FR05-TC-014

READY_WITH_SETUP:
- FR05-TC-001
- FR05-TC-003
- FR05-TC-004
- FR05-TC-005
- FR05-TC-006
- FR05-TC-007
- FR05-TC-008
- FR05-TC-010
- FR05-TC-011
- FR05-TC-012
- FR05-TC-017

BLOCKED_BY_IMPLEMENTATION:
- FR05-TC-009
- FR05-TC-013
- FR05-TC-015
- FR05-TC-016

==================================================
CURRENT GOAL
==================================================

Perform only:

1. Playwright infrastructure preparation required for FR-05
2. FR-05 script generation
3. Static validation
4. AI-generated code review
5. Automation gap documentation
6. AI Audit CREATE_ENTRY for this interaction

Do NOT execute Playwright.

Do NOT run browsers.

Do NOT create runtime PASS/FAIL results.

Do NOT create execution evidence.

Stop at:

CHECKPOINT: AUTOMATION_REVIEW_REQUIRED

==================================================
1. PRE-GENERATION VALIDATION
==================================================

Before writing code, independently validate:

- approved test-case file exists;
- automation plan is approved;
- test data is approved;
- JSON parses successfully;
- 13 approved automation candidates remain traceable;
- all Test Case IDs are unique;
- every candidate has required data/setup;
- minimum automation script count is 12.

Do not silently repair approved upstream artifacts.

If fewer than 12 legitimate scripts can now be generated, stop with:

AUTOMATION_MINIMUM_NOT_MET

Do not fabricate extra tests.

==================================================
2. REPOSITORY INSPECTION
==================================================

Inspect existing repository infrastructure:

- package.json
- playwright.config.*
- tests/
- helpers/
- fixtures/
- reporters/
- existing Playwright dependencies

Reuse existing valid infrastructure where possible.

If Playwright config does not exist, create only the minimum configuration
required for future FR-05 execution.

Do not install packages.

Do not run npx playwright install.

Do not start the SUT.

==================================================
3. PLAYWRIGHT CONFIGURATION
==================================================

If a Playwright config must be created or updated, explicitly configure
distinct browser engines.

Required projects:

chromium:
browserName: 'chromium'

firefox:
browserName: 'firefox'

webkit:
browserName: 'webkit'

Project names alone are NOT sufficient.

Prepare HTML reporting for future execution.

Do not fabricate Student ID.

Student ID may be supplied later through environment/runtime configuration.

Prepare future report metadata strategy for:

Run by: <StudentID>
ISO timestamp
Feature ID
Browser
Run ID

Do not create fake HTML reports in this phase.

==================================================
4. SCRIPT GENERATION TARGET
==================================================

Generate one legitimate Playwright test for each of the 13 approved
automation candidates.

Expected target:

13 Playwright tests

Minimum required:

12 Playwright tests

Test names must contain exact Test Case IDs.

Example:

test('FR05-TC-007 - Search exact known product name', async ({ page }) => {
  ...
});

Do not generate scripts for the four implementation-blocked cases merely to
increase the count.

Do not use:

test.skip()

or empty placeholder tests to count blocked cases as automated.

==================================================
5. EXTERNAL DATA
==================================================

Read:

test-data/fr-05.json

Do not duplicate seed products or input datasets as inline arrays in the
spec.

Use external data for:

- seed catalog
- names
- raw prices
- image URLs
- exact-name search
- description-only keyword
- safe-rendering inputs
- grouping configuration
- controlled response setup

FR05-SETUP-002 must drive the controlled empty product-search response for:

- FR05-TC-010
- FR05-TC-011
- FR05-TC-012

Do not inline responseBody [] if it is already externally defined.

==================================================
6. HELPERS
==================================================

Create only helpers that provide real reuse.

Candidate helpers include:

- loadFr05Data()
- openHome()
- submitSearch()
- getProductCardByName()
- getProductListing()
- getKeywordRegion()
- assertThousandsGrouped()
- controlledProductSearchResponse()
- dialog observer

Avoid over-abstraction.

Do not hide assertions inside excessively generic helpers when doing so harms
traceability to Test Case IDs.

==================================================
7. LOCATOR RULES
==================================================

Use approved locator priority:

1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. getByTestId()
6. stable CSS
7. XPath only as last resort

Do not invent data-testid values.

Do not modify SUT source code merely to improve testability.

Do not use absolute XPath.

Avoid fragile nth() unless there is no legitimate alternative and the risk is
explicitly documented.

==================================================
8. TEST-SPECIFIC REQUIREMENTS
==================================================

FR05-TC-001
- Verify all five controlled seed products.
- Verify expected product count = 5.
- Do NOT assert grid layout here.

FR05-TC-002
- Verify known product name visibility.

FR05-TC-003
- Verify each controlled product has the associated image element.
- Do not require external image network success as the oracle.

FR05-TC-004
- Verify alt attribute exists.
- Verify trimmed alt is non-empty.
- Do not claim semantic descriptiveness is fully proven.

FR05-TC-005
- Verify required `₫` symbol.
- Preserve assertion even though current SUT may display `VND`.

FR05-TC-006
- Use existing raw seed prices only.
- Validate thousand grouping using approved conventional separators:
  `.`
  `,`
  regular space
  U+00A0
  U+202F
- Require the same separator consistently between groups.
- Reject uninterrupted raw digits.
- Reject hyphens, letters and mixed separators.
- Do not hardcode one locale.

FR05-TC-007
- Search exact:
  iPhone 15 Pro Max
- Verify expected product result.

FR05-TC-008
- Search:
  xuất sắc
- Primary oracle:
  product result COUNT = 0
- Supporting assertions may verify Samsung and AirPods are absent.
- Do not depend on empty-state UI.

FR05-TC-010
- Verify plain reflected keyword is safe text.

FR05-TC-011
- Use FR05-SETUP-002.
- Verify formatting markup remains literal safe text.
- Verify input-derived `<b>` count = 0 within the scoped keyword region.

FR05-TC-012
- Use FR05-SETUP-002.
- Attach dialog observation before submitting input.
- Verify no input-triggered dialog/execution.
- Verify no input-derived `img[onerror]`.
- Preserve failure visibility if current SUT is unsafe.

FR05-TC-014
- Verify exactly one semantic home-page `<h1>`.
- Do not weaken the count because current implementation may contain two.

FR05-TC-017
- Verify listing computed style:
  display === 'grid'
- Do not assert Tailwind class.
- Do not assert viewport.
- Do not assert exact column count.

==================================================
9. BLOCKED CASES
==================================================

Do NOT generate fake automation for:

FR05-TC-009
FR05-TC-013
FR05-TC-015
FR05-TC-016

Create/update:

docs/gaps/fr-05-automation-gaps.md

For each case record:

- Test Case ID
- Status
- Requirement Status
- Implementation Status
- Reason
- Attempted Approach
- Remaining Blocker
- Recommended Next Step

Use:

BLOCKED_BY_IMPLEMENTATION

where appropriate.

Do not use BLOCKED_BY_REQUIREMENT.

==================================================
10. ASSERTION REQUIREMENTS
==================================================

The generated 13-test suite must use at least three distinct assertion
patterns.

Expected applicable patterns include:

TEXT_OR_VALUE
VISIBILITY_OR_HIDDEN_STATE
COUNT
ATTRIBUTE_OR_CLASS
DIALOG

Do not include STATE_TRANSITION merely to increase assertion-pattern count
because TC-013 is blocked.

Prefer Playwright web-first assertions.

Do not weaken Expected Results to make the current SUT pass.

==================================================
11. PROHIBITED SHORTCUTS
==================================================

Do not use:

- waitForTimeout() as normal synchronization
- arbitrary timeout inflation
- force: true without documented necessity
- catch blocks that swallow assertion/test failures
- test.skip() to hide blocked/product-defect cases
- test.fail() to make failures look intentional
- retries as a substitute for fixing automation
- hardcoded credentials
- production data
- inline data-driven product arrays

==================================================
12. STATIC VALIDATION
==================================================

Do NOT execute Playwright tests.

Static validation may include:

- JavaScript/TypeScript syntax validation
- JSON parsing
- import/path validation where possible without execution
- counting generated Playwright tests
- checking unique Test Case IDs
- searching for prohibited patterns

Verify:

- Automation Script Count >= 12
- target should be 13
- no duplicate Test Case IDs
- no blocked Test Case was falsely scripted
- all test data comes from external JSON where required
- no runtime result is claimed

==================================================
13. AI-GENERATED CODE REVIEW
==================================================

Create/update:

docs/automation-reviews/fr-05-ai-review.md

Review:

- spec files
- helper files
- playwright.config.*
- reporter configuration
- test-data integration

Use:

| Review ID | Test Case ID | File / Section | Problem | Risk | Recommended Correction | Why AI Missed It | Human Decision | Verification |

Review at least:

- fragile selectors
- ancestor/common-parent coupling
- weak assertions
- missing assertions
- partial Expected Result coverage
- inline/hardcoded datasets
- shared mutable state
- test-order dependency
- missing cleanup
- waitForTimeout()
- force: true
- retries
- swallowed errors
- unstable nth()
- over-abstraction
- incorrect browserName mapping
- missing HTML reporter
- missing metadata strategy
- automation script count
- blocked-case handling

For findings that require human review:

Human Decision:
PENDING_HUMAN_REVIEW

Verification:
NOT_EXECUTED

Do not automatically fix review findings after writing the review unless the
finding is a direct syntax/consistency defect required to complete generation.
Document any such correction explicitly.

==================================================
14. EXPECTED OUTPUT
==================================================

Expected files may include:

playwright.config.js

tests/fr-05/fr-05.spec.js

tests/fr-05/helpers/
or another minimal repository-consistent helper location

docs/automation-reviews/fr-05-ai-review.md

docs/gaps/fr-05-automation-gaps.md

Do not modify:

- approved test cases
- approved automation plan
- approved test data
- SUT source
- database

==================================================
15. REQUIRED CHECKPOINT
==================================================

After generation and static AI review, stop at:

CHECKPOINT: AUTOMATION_REVIEW_REQUIRED

Do NOT execute Playwright.

Return:

1. Test Scripts Created
2. Automation Script Count
3. Test Case IDs Implemented
4. Minimum Automation Script Count
5. Minimum Result
6. Blocked Test Cases
7. External Test Data Used
8. Helpers Created
9. Assertion Patterns Used
10. Browser Project Configuration
11. Reporter Preparation
12. Locator Risks
13. AI Code Review Findings
14. Automation Gaps
15. Static Validation Result
16. Files Created
17. Files Modified
18. Current Checkpoint

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After the main Script Generation + AI Code Review output has been completed,
immediately use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected next ID:
A-004

This audit entry represents:

FR-05 Playwright script generation and AI-generated code review

Workflow Stage:
Playwright script generation and AI-generated code review; before human
automation review

Feature / Task:
FR-05 — Product listing and search

Related Artifact:
- tests/fr-05/
- playwright.config.js
- docs/automation-reviews/fr-05-ai-review.md
- docs/gaps/fr-05-automation-gaps.md

==================================================
AUDIT CONTENT RULES
==================================================

Preserve the EXACT verbatim prompt from this interaction.

Store it at:

docs/ai-audit/interactions/A-004-prompt.md

Preserve the ORIGINAL AI output from this interaction before any future
human-directed correction.

Store it at:

docs/ai-audit/interactions/A-004-output.md

Do not paraphrase either file.

Do not reconstruct missing content.

If exact content is unavailable, return the appropriate audit error instead
of fabricating it.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
Do not finalize yet.

Output Storage:
EXTERNAL_FILE

Do not perform UPDATE_REVIEW yet.

Human review at:

CHECKPOINT: AUTOMATION_REVIEW_REQUIRED

will determine the final verdict and Student Fix later.

==================================================
AUDIT FAILURE POLICY
==================================================

If CREATE_ENTRY fails:

- report the audit failure separately;
- do not delete or alter the generated scripts/review/gap artifacts;
- do not fabricate A-004;
- keep the main workflow at:
  CHECKPOINT: AUTOMATION_REVIEW_REQUIRED

==================================================
FINAL RESPONSE
==================================================

Return the main workflow result first.

Then return:

AI Audit:
- Status
- Artifact ID
- Prompt Evidence Path
- Output Evidence Path
- Review Status
- Required User Action

Do not continue to execution.