$playwright-feature-workflow

Workflow Mode:
PLAN_ONLY

Feature ID:
FR-05

Feature Name:
Product listing and search

Approved Test Case File:
docs/test-cases/fr-05/test-cases.md

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

Test Data Format:
JSON

Target Browsers:
- chromium
- firefox
- webkit

==================================================
APPROVAL EVIDENCE
==================================================

Test-case design status:

TEST_CASE_DESIGN_APPROVED

Human Decision:

APPROVE TEST CASE DESIGN

Current approved design:

- Test Conditions: 18
- Test Cases: 17
- Automation Candidates: 13
- Minimum Automation Script Count: 12

Do not reopen or redesign the approved test cases during this phase.

==================================================
CURRENT GOAL
==================================================

Perform only:

AUTOMATION PLANNING

Do not create test data yet.

Do not generate Playwright scripts.

Do not run Playwright.

Do not run browsers.

Do not modify the SUT.

Do not modify the database.

Stop at:

CHECKPOINT: AUTOMATION_PLAN_REVIEW_REQUIRED

==================================================
1. AUTOMATION MINIMUM PRE-CHECK
==================================================

Before creating the plan, perform the skill's Automation Minimum Pre-check.

Verify the approved test cases independently.

Confirm whether at least 12 approved cases remain legitimate automation
candidates.

Do not assume the number 13 is correct merely because the upstream document
states it.

For every candidate verify:

- primary objective is independently automatable;
- Expected Result is objectively assertable;
- necessary setup has a realistic path;
- the case is not duplicate;
- the case does not depend on an unresolved requirement for its primary objective.

If fewer than 12 legitimate candidates remain, stop with:

AUTOMATION_MINIMUM_PRECHECK_FAILED

Do not create an automation plan.

==================================================
2. SOURCE PRECEDENCE
==================================================

Use:

1. Approved authoritative requirements
2. Approved test-case design
3. Supporting API contract
4. Current implementation

Implementation may be inspected only for:

- automation feasibility;
- locator discovery;
- existing seed-data discovery;
- setup strategy;
- discrepancy discovery.

Do not alter Expected Results to match implementation.

==================================================
3. DATA POLICY
==================================================

Prefer:

1. Existing verified project seed data
2. Existing stable project test data
3. External controlled JSON data
4. New controlled fixture only when genuinely necessary and later approved

Do not create database records in PLAN_ONLY.

Do not propose artificial products if existing seed products already satisfy
the test objective.

Identify which approved cases can reuse the existing five verified seed
products.

==================================================
4. AUTOMATION STATUS
==================================================

For every one of the 17 approved test cases assign exactly one appropriate
Automation Status:

- READY_FOR_AUTOMATION
- READY_WITH_SETUP
- BLOCKED_BY_DATA
- BLOCKED_BY_REQUIREMENT
- BLOCKED_BY_IMPLEMENTATION
- BLOCKED_BY_ENVIRONMENT
- MANUAL_ONLY
- OUT_OF_SCOPE

Use status semantics strictly.

BLOCKED_BY_REQUIREMENT:
Requirement / Expected Result itself is insufficient.

BLOCKED_BY_IMPLEMENTATION:
Requirement is confirmed, but the current SUT lacks the observable behavior
or contract required for automation.

Do not use BLOCKED_BY_REQUIREMENT merely because the implementation is
missing something.

==================================================
5. AUTOMATION PLAN PER TEST CASE
==================================================

For every approved Test Case ID document:

- Test Case ID
- Automation Status
- Requirement Status
- Implementation Status
- Setup
- Test Data
- Data Source
- Locator Strategy
- Assertion Strategy
- Cleanup
- Risks
- Dependencies
- Automation Boundary

No approved case may disappear from the inventory.

==================================================
6. LOCATOR STRATEGY
==================================================

Inspect the actual frontend implementation.

Prefer:

1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. getByTestId()
6. stable CSS
7. XPath only as a last resort

Do not invent test IDs.

Do not modify the SUT to add test IDs during PLAN_ONLY.

If a stable locator does not exist, record the locator risk.

Do not automatically block a case solely because the best locator requires
review if a realistic stable strategy can still be prepared.

==================================================
7. ASSERTION STRATEGY
==================================================

Map approved Expected Results to Playwright assertion patterns.

Examples supported by the workflow include:

- TEXT_OR_VALUE
- VISIBILITY_OR_HIDDEN_STATE
- COUNT
- ATTRIBUTE_OR_CLASS
- STATE_TRANSITION
- DIALOG

FR-05 must eventually use at least three distinct assertion patterns.

Do not weaken assertions because the current implementation is expected to
fail.

==================================================
8. SPECIAL FR-05 REVIEW POINTS
==================================================

Pay particular attention to:

FR05-TC-001
- complete controlled catalog visibility/count only;
- do not reintroduce grid-layout assertion.

FR05-TC-004
- objective automation covers present/non-empty alt;
- semantic descriptiveness remains outside objective automated proof unless
  an approved convention exists.

FR05-TC-006
- uses existing seed prices;
- do not introduce arbitrary price boundaries;
- do not assume a specific thousand separator if the requirement does not
  define one.

FR05-TC-008
- description-only keyword search behavior must remain independent from
  empty-state presentation.

FR05-TC-009 / 015 / 016
- requirement is confirmed;
- distinguish missing SUT empty-state implementation from requirement gaps.

FR05-TC-013
- loading requirement is confirmed;
- distinguish implementation blocker from requirement blocker.

FR05-TC-014
- verify exactly one semantic h1;
- do not weaken because current SUT may contain more than one.

FR05-TC-017
- verify computed layout behavior without depending on Tailwind class,
  viewport, or exact column count;
- identify a realistic listing-container locator strategy.

==================================================
9. IMPLEMENTATION DISCREPANCIES
==================================================

Record implementation discrepancies separately from automation readiness.

Do not classify an expected product defect as an automation defect.

No execution result may be claimed in PLAN_ONLY.

==================================================
10. OUTPUT
==================================================

Create/update:

docs/automation-plans/fr-05-automation-plan.md

Do not create:

- JSON/CSV test data
- .spec.js
- .spec.ts
- playwright.config.*
- reporters
- HTML reports
- screenshots
- traces
- execution logs

==================================================
11. READINESS SUMMARY
==================================================

Report:

1. Approved Test Cases Received
2. Automation Minimum Pre-check Result
3. Automation Candidate Count
4. READY_FOR_AUTOMATION
5. READY_WITH_SETUP
6. BLOCKED_BY_DATA
7. BLOCKED_BY_REQUIREMENT
8. BLOCKED_BY_IMPLEMENTATION
9. BLOCKED_BY_ENVIRONMENT
10. MANUAL_ONLY
11. OUT_OF_SCOPE
12. Existing Seed Data Reuse
13. Required Future Test Data
14. Required Helpers
15. Locator Risks
16. Assertion Patterns Planned
17. Implementation Discrepancies
18. Open Questions
19. Files Created
20. Files Modified
21. Current Checkpoint

==================================================
CHECKPOINT
==================================================

Only if the Automation Minimum Pre-check passes, create the plan and stop at:

CHECKPOINT: AUTOMATION_PLAN_REVIEW_REQUIRED

Do not proceed to Test Data Preparation.

Wait for human review.