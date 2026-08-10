$playwright-feature-workflow

Workflow Mode:
FULL_WORKFLOW

Feature ID:
FR-05

Feature Name:
Product listing and search

Approved Test Case File:
docs/test-cases/fr-05/test-cases.md

Approved Automation Plan:
docs/automation-plans/fr-05-automation-plan.md

Requirement / Expected Result Sources:
- README.md — FR-05
- README.md — FR-21
- README.md — FR-24
- README.md — SEC-04
- api_specification.md — section 3.1

Minimum Automation Script Count:
12

Test Data Format:
JSON

Repository Root:
.

Test Data Directory:
test-data/

==================================================
CURRENT WORKFLOW STATE
==================================================

TEST_CASE_DESIGN_APPROVED
AUTOMATION_PLAN_APPROVED

Approved inventory:

- Total Test Cases: 17
- Automation Candidates: 13
- Minimum Automation Script Count: 12

Automation readiness:

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

Perform ONLY the Test Data Design / Preparation phase.

Do not generate Playwright scripts.

Do not create playwright.config.*

Do not run Playwright.

Do not run browsers.

Do not create execution reports or evidence.

Stop at:

CHECKPOINT: TEST_DATA_REVIEW_REQUIRED

==================================================
1. TEST DATA POLICY
==================================================

Use this priority:

1. Existing verified project seed data
2. Existing stable project test data
3. External controlled JSON input data
4. New controlled fixtures only if genuinely necessary and explicitly
   approved

For FR-05, prefer the existing five verified seed products.

Do NOT create new product/database records.

Do NOT create artificial price-boundary products.

Do NOT mutate shared database data.

==================================================
2. VERIFIED SEED DATA
==================================================

Verify the current repository seed source before writing JSON.

Expected verified products include:

- iPhone 15 Pro Max
- Samsung Galaxy S24 Ultra
- MacBook Pro M3
- Tai nghe AirPods Pro 2
- Bàn phím cơ Keychron Q1

Use actual current repository values for:

- names
- raw prices
- descriptions
- image URLs

Do not invent missing fields.

Verify that:

xuất sắc

appears in relevant descriptions and does not appear in the verified product
names before using it for FR05-TC-008.

==================================================
3. EXTERNAL JSON
==================================================

Create:

test-data/fr-05.json

Use a clear schema that separates reusable seed data from input-only search
datasets.

The JSON should support the 13 automation candidates.

Suggested logical categories:

seedCatalog
searchInputs
safeRenderingInputs

Do not copy large datasets inline into future Playwright specs.

Every dataset must be traceable to one or more Test Case IDs.

==================================================
4. REQUIRED DATA MAPPING
==================================================

Prepare data for:

FR05-TC-001
- complete five-product seed manifest
- expected count

FR05-TC-002
- known product name

FR05-TC-003
- product names
- image URLs

FR05-TC-004
- product/image mapping
- expectation that alt must be present and non-empty
- do not invent semantic alt text

FR05-TC-005
- names
- raw prices
- expected currency requirement `₫`

FR05-TC-006
- existing raw seed prices
- grouping validation configuration only if needed
- do not encode one mandatory locale separator

FR05-TC-007
- exact known product name:
  iPhone 15 Pro Max

FR05-TC-008
- description-only keyword:
  xuất sắc
- expected product result count:
  0
- excluded product names:
  Samsung Galaxy S24 Ultra
  Tai nghe AirPods Pro 2

FR05-TC-010
- plain reflected keyword

FR05-TC-011
- formatting-markup keyword

FR05-TC-012
- event-handler markup keyword

FR05-TC-014
- no business test data required
- seeded non-empty catalog may be recorded only as environment/setup

FR05-TC-017
- two or more existing seed product names sufficient to locate independent
  product cards and identify their listing parent

==================================================
5. BLOCKED CASES
==================================================

Do not manufacture data in an attempt to unblock:

FR05-TC-009
FR05-TC-013
FR05-TC-015
FR05-TC-016

Their blockers are implementation-related, not data-related.

Input-only data such as a no-result keyword may still be stored if it is
shared/reusable for future execution, but doing so must NOT change their
Automation Status.

Do not claim that the cases become automatable merely because data exists.

==================================================
6. THOUSAND-GROUPING DATA
==================================================

Do not create arbitrary price boundaries.

Use only existing raw seed prices.

The approved plan allows conventional separators:

- `.`
- `,`
- regular space
- U+00A0
- U+202F

The future assertion must require consistent grouping.

Do not store a single expected separator as the oracle because locale is not
confirmed.

==================================================
7. SAFE-RENDERING INPUTS
==================================================

Store the exact approved input-only strings for the safe-rendering cases.

Include:

Plain text input

Formatting markup input:
<b>FR05 HTML Keyword</b>

Event-handler input:
<img src=x onerror=alert('FR05-XSS')>

These values are test inputs only.

Do not execute them during this phase.

Do not claim security PASS/FAIL.

==================================================
8. TRACEABILITY
==================================================

Create a traceability table in:

docs/test-data/fr-05-test-data-plan.md

Use:

| Dataset ID | Test Case IDs | Purpose | Source | Isolation Strategy |

Also document for each dataset:

- setup requirement
- cleanup requirement
- data sensitivity
- deterministic status
- source/generation rule

==================================================
9. DATA QUALITY CHECK
==================================================

Verify:

- all 13 automation candidates have required data/setup information;
- no unused artificial dataset exists;
- no inline data-driven array will be required later;
- no credential or secret is stored;
- no product/database record was added;
- all existing seed values match the current repository;
- Test Case IDs are traceable;
- blocked implementation cases remain blocked;
- no Expected Result was altered.

==================================================
10. OUTPUT
==================================================

Create/update only:

test-data/fr-05.json
docs/test-data/fr-05-test-data-plan.md

Do not modify:

- approved test cases;
- approved automation plan;
- SUT;
- database;
- Playwright scripts;
- Playwright config.

==================================================
CHECKPOINT
==================================================

After preparation, stop at:

CHECKPOINT: TEST_DATA_REVIEW_REQUIRED

Return:

1. Test Data File
2. Test Data Plan File
3. Total Datasets
4. Automation Candidates Covered
5. Existing Seed Data Reused
6. Input-Only Data Added
7. Blocked Cases Preserved
8. Data Isolation Strategy
9. Data Risks
10. Unresolved Data Questions
11. Files Created
12. Files Modified
13. Current Checkpoint

Do not proceed to script generation.

Wait for:

APPROVE TEST DATA