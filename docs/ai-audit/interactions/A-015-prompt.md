$generate-test-cases-from-requirements

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
TEST_DESIGN_BUNDLE

Feature ID:
FR-17

Feature Name:
Coupon management (CRUD)

Student ID:
23127107

Actor / User Role:
Admin

Automation Target:
Playwright Web Admin

Minimum Test Case Count:
12

Minimum Automation Candidate Count:
12

Target Test Case Count:
14-16

Primary Demo Feature:
YES

Repository Root:
.

Output Directory:
docs/test-cases/fr-17/

Output Language:
Vietnamese main content with English standardized headings / field names /
technical identifiers / enums / statuses.

==================================================
PURPOSE
==================================================

This is the final HW04 feature and the PRIMARY DEMO FEATURE.

Perform in ONE interaction:

1. Requirement analysis
2. Requirement-gap analysis
3. Atomic test-condition design
4. Test-case design
5. Automation-feasibility classification
6. Requirement coverage matrix
7. Static design review
8. Initial demo-candidate analysis
9. AI Audit CREATE_ENTRY

Do NOT create Playwright scripts yet.

Do NOT execute browsers.

Do NOT create final defect reports.

Stop at:

CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED

==================================================
1. AUTHORITATIVE SCOPE
==================================================

Inspect the repository authoritative requirements for:

FR-17 — Coupon management (CRUD)

Treat the detailed behavior as authoritative.

The feature title contains "CRUD", but do NOT infer unsupported operations
from the acronym.

From the detailed requirement, independently verify which operations are
actually defined.

Expected primary scope to verify from the repository:

- View coupon list
- Add coupon
- Delete coupon

Do NOT add Update/edit behavior unless an authoritative requirement explicitly
defines it.

Also inspect directly applicable authorization requirements for Admin access.

Do not add unrelated Admin/global requirements merely to inflate coverage.

==================================================
2. REQUIRED COUPON FIELDS
==================================================

Extract and verify authoritative constraints for fields including:

code
type
discount_value
expired_at
min_order_amount
max_uses_per_user

Expected constraints to verify from source include concepts such as:

- code is unique
- type is percent or fixed
- discount_value > 0
- expired_at required
- min_order_amount >= 0
- max_uses_per_user >= 1

Do not trust this prompt as a replacement for repository evidence.

Confirm each rule against the authoritative source before using it as an
Expected Result.

==================================================
3. SUPPORTING API CONTRACT
==================================================

Inspect the current API specification for relevant FR-17/Admin Coupon
endpoints.

Expected operations to verify include:

GET coupon list
POST create coupon
DELETE coupon

If no Update endpoint exists, record that as supporting evidence that Update
automation must not be invented.

API specification is SUPPORTING context.

Expected Results remain requirement-driven.

==================================================
4. ADMIN AUTHORIZATION
==================================================

Inspect authoritative Admin access requirements.

Design independent coverage where supported for:

- valid authenticated Admin
- unauthenticated access
- authenticated non-admin access

Do not invent exact redirect URL or exact denial message unless explicitly
defined.

Use mechanism-neutral expected behavior:

unauthorized actors must not obtain usable Coupon Management functionality.

==================================================
5. IMPLEMENTATION INSPECTION
==================================================

Inspect the current Admin frontend/backend implementation only for:

- Coupon Management route
- current form fields
- current list/table
- Create behavior
- Delete behavior
- authentication mechanism
- Admin/non-admin setup feasibility
- locator feasibility
- current seed coupons
- current database behavior
- deterministic cleanup feasibility
- implementation discrepancies

Classify implementation observations as:

IMPLEMENTATION_ONLY

They must not redefine Expected Result.

Do NOT execute the SUT.

Do NOT mutate database state.

==================================================
6. OUT-OF-SCOPE / REQUIREMENT GAPS
==================================================

Do NOT invent expectations for:

- Update/Edit coupon
- activate/deactivate coupon
- percent discount maximum of 100
- coupon-code maximum length
- code case sensitivity
- whitespace trimming
- search/filter/sort
- pagination
- delete confirmation dialog
- exact success/error message
- expired_at must be future
- fixed discount <= order total
- stacking/replacement/removal behavior

unless an authoritative requirement explicitly defines one.

If observable in implementation but unsupported by requirements:

record:

REQUIREMENT_GAP

or:

IMPLEMENTATION_ONLY

Do not create an authoritative Expected Result from it.

==================================================
7. TEST DESIGN TARGET
==================================================

Aim for approximately 14-16 legitimate cases.

A healthy design may naturally cover areas such as:

VIEW:
- Admin can view coupon management/list
- relevant coupon data is displayed

CREATE:
- valid percent coupon
- valid fixed coupon
- duplicate code rejection
- missing required fields
- discount_value lower boundary
- min_order_amount lower boundary
- max_uses_per_user lower boundary

DELETE:
- delete an existing controlled coupon
- deleted coupon no longer appears

AUTHORIZATION:
- unauthenticated user
- non-admin authenticated user

This is guidance only.

Derive final cases from requirements.

Do not create duplicate cases simply to reach the target count.

==================================================
8. BOUNDARY VALUE ANALYSIS
==================================================

Only use BVA where an authoritative mathematical boundary exists.

Legitimate examples if confirmed:

discount_value > 0

Possible:
0
positive value

min_order_amount >= 0

Possible:
0
negative value if accepted input/state can be meaningfully exercised

max_uses_per_user >= 1

Possible:
1
0

Do NOT create arbitrary:

99 / 100 / 101 percent

unless a requirement defines 100 as a boundary.

==================================================
9. CREATE / DELETE STATE ISOLATION
==================================================

FR-17 is stateful.

Explicitly classify each test as:

READ_ONLY

or

STATEFUL_SETUP_REQUIRED

or

STATEFUL_CREATE_CLEANUP

Every stateful case must be independently reproducible.

Do NOT design:

TC-X creates a coupon
then
TC-Y assumes TC-X already created it.

No test-order dependency.

Created test coupons must use uniquely owned automation data and have an
explicit cleanup strategy.

Do not mutate documented seed coupons for destructive tests unless
authoritatively necessary and safely isolated.

==================================================
10. DATABASE SAFETY STRATEGY
==================================================

The future automation must NOT mutate the shared workspace:

backend/database.sqlite

State-changing FR-17 automation should use a run-specific isolated backend /
SQLite copy similar to the approved FR-09 isolation strategy.

At design time record this only as the future setup strategy.

Do NOT create or start the isolated backend now.

==================================================
11. DATA-DRIVEN AUTOMATION
==================================================

Future automation must use external:

test-data/fr-17.json

Do not create the JSON file in this phase.

For every test requiring business data, identify what external dataset will
be needed.

Avoid hardcoding data-driven arrays directly in future Playwright tests.

==================================================
12. DEMO-CANDIDATE DESIGN
==================================================

FR-17 is the primary Task 2 + Agent Skill demo feature.

Identify 2-3 DEMO_CANDIDATE test cases from the approved design.

A good demo candidate should:

- be requirement-supported;
- have visible Admin UI interaction;
- be deterministic;
- complete quickly;
- avoid destructive shared state;
- have straightforward cleanup;
- work on Chromium, Firefox and WebKit;
- show meaningful assertions;
- use external data.

Preferred candidate category:

Create a valid coupon through Admin UI and verify it appears in the coupon
list.

However:

Do NOT force this candidate if repository implementation makes another
approved case substantially safer or clearer.

Do NOT add a test solely for demo purposes.

A demo candidate must already be a legitimate approved FR-17 test.

==================================================
13. DEMO FLOW ATOMICITY
==================================================

If Create is selected as the future demo objective:

Primary objective:

Admin creates a valid coupon and the newly created coupon becomes observable
in Coupon Management.

Cleanup may delete the created coupon after assertions.

Cleanup is NOT a second test objective.

Do not turn the demo case into:

Create + full Delete feature validation

unless the requirement/test design explicitly makes that a combined
end-to-end objective.

The formal Delete requirement should retain its own independent Test Case.

==================================================
14. AI-FIX POLICY FOR DEMO
==================================================

Do not manufacture an AI error merely for the demo.

During later Automation Build / Review:

If a genuine AI-generated automation problem occurs, preserve it as a
potential FR-17 demo correction story.

Examples of legitimate future corrections could include:

- unsupported requirement invented;
- unsafe database fixture;
- test-order dependency;
- over-constrained locator;
- incorrect boundary;
- wrong assertion;
- cleanup bug.

If FR-17 produces no genuine useful correction, the already real FR-05
TC-006 automation-helper correction may be used as the Task 2 AI-fix story.

Record this policy in review-notes only.

==================================================
15. TEST TECHNIQUES
==================================================

Use only where justified:

USE_CASE_TESTING
EQUIVALENCE_PARTITIONING
BOUNDARY_VALUE_ANALYSIS
STATE_TRANSITION
DECISION_TABLE
ERROR_GUESSING

Do not classify a normal value as EDGE merely for distribution.

Expected suite should naturally contain:

POSITIVE
NEGATIVE
EDGE

where supported.

==================================================
16. AUTOMATION FEASIBILITY
==================================================

For every Test Case classify:

AUTOMATION_SUITABLE

AUTOMATION_POSSIBLE_WITH_SETUP

MANUAL_RECOMMENDED

NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION

NEEDS_CLARIFICATION

Minimum counted automation candidates:

12

Only count:

AUTOMATION_SUITABLE
AUTOMATION_POSSIBLE_WITH_SETUP

Assess:

- Admin auth setup
- non-admin auth setup
- data setup
- isolated DB need
- UI locator
- create/delete cleanup
- deterministic assertions
- test independence
- requirement clarity

Do not mark a case automatable solely because an API endpoint exists.

Automation target remains Admin UI.

==================================================
17. TEST CASE SCHEMA
==================================================

Every Test Case must include:

| Field | Value |
| --- | --- |
| Test Case ID | |
| Feature ID | |
| Requirement ID | |
| Objective | |
| Actor | |
| Preconditions | |
| Test Data | |
| Steps | |
| Expected Result | |
| Test Type | |
| Test Technique | |
| Priority | |
| Automation Suitability | |
| Assertion Candidates | |
| Automation Risks | |
| Dependencies | |
| Cleanup / Isolation | |
| Demo Suitability | |
| Notes | |

Use:

FR17-TC-001
FR17-TC-002
...

Use:

FR17-TCND-...

for Test Conditions.

Demo Suitability allowed values:

PRIMARY_DEMO_CANDIDATE

SECONDARY_DEMO_CANDIDATE

NOT_RECOMMENDED_FOR_DEMO

==================================================
18. REQUIREMENT COVERAGE
==================================================

Create a complete coverage matrix.

Use:

FULLY_COVERED
PARTIALLY_COVERED
NOT_COVERED
NEEDS_CLARIFICATION

Explicitly distinguish:

Feature title says CRUD

versus

detailed authoritative operations actually specified.

If Update is not specified:

record it as:

NOT_IN_DETAILED_REQUIREMENT_SCOPE

Do not count missing Update automation as a coverage gap.

==================================================
19. STATIC REVIEW
==================================================

Before returning review for:

- invented Update behavior;
- invented percent <= 100 rule;
- duplicate cases;
- incorrect boundary values;
- destructive seed-data assumptions;
- test-order dependencies;
- cases that are API-only rather than Admin UI;
- insufficient cleanup/isolation;
- weak authorization coverage;
- missing requirement traceability;
- minimum test count;
- minimum automation candidate count;
- demo candidate legitimacy.

Create a Review History.

Do not self-approve.

==================================================
20. OUTPUT FILES
==================================================

Create/update only:

docs/test-cases/fr-17/requirement-analysis.md

docs/test-cases/fr-17/test-cases.md

docs/test-cases/fr-17/requirement-coverage.md

docs/test-cases/fr-17/review-notes.md

Also create:

docs/demo/fr-17-demo-plan.md

But at this phase the demo plan contains DESIGN-ONLY information:

- Primary Demo Feature: FR-17
- Candidate Test Case IDs
- Candidate rationale
- expected high-level UI flow
- automation not yet built
- runtime status NOT_EXECUTED
- final selected demo test PENDING
- AI Fix Candidate PENDING_REAL_HUMAN_REVIEW
- fallback genuine correction: FR-05 TC-006

Do NOT create recording commands yet.

==================================================
21. SUMMARY
==================================================

Return:

1. Authoritative Requirement Sources
2. Detailed FR-17 Operations
3. Explicitly Out-of-Scope Operations
4. Extracted Atomic Requirements
5. Requirement Gaps
6. Implementation Discrepancies
7. Test Conditions
8. Total Test Cases
9. POSITIVE Count
10. NEGATIVE Count
11. EDGE Count
12. Automation Suitable Count
13. Automation Possible With Setup Count
14. Automation Candidate Count
15. Minimum Automation Candidate Result
16. Stateful Test Count
17. Read-Only Test Count
18. Requirement Coverage Result
19. Primary Demo Candidates
20. Demo Candidate Rationale
21. Demo Plan Status
22. Files Created
23. Files Modified
24. Current Checkpoint

==================================================
22. GATES
==================================================

Proceed to human review only if:

Total Test Cases >= 12

AND

Automation Candidate Count >= 12

AND

no unsupported Update behavior is treated as authoritative coverage.

If minimum automation count fails, return:

MINIMUM_AUTOMATION_CANDIDATE_COUNT_NOT_REACHED

Do not inflate count.

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After producing the Test Design Bundle, immediately use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected next ID:

A-015

If the repository audit sequence differs, use the actual next sequential ID.

Artifact:

FR-17 Test Design Bundle and Initial Demo Candidate Analysis

Workflow Stage:

FR-17 compressed requirement/test design before human review

Feature / Task:

FR-17 — Coupon management

Related Artifacts:

docs/test-cases/fr-17/
docs/demo/fr-17-demo-plan.md

Preserve the EXACT verbatim prompt.

Store:

docs/ai-audit/interactions/<Artifact-ID>-prompt.md

Preserve the ORIGINAL AI output.

Store:

docs/ai-audit/interactions/<Artifact-ID>-output.md

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED
