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

Approved Test File:
tests/fr-05/fr-05.spec.js

Approved Test Data:
test-data/fr-05.json

Execution Readiness:
docs/execution-readiness/fr-05-execution-readiness.md

Automation Review:
docs/automation-reviews/fr-05-ai-review.md

Automation Gaps:
docs/gaps/fr-05-automation-gaps.md

==================================================
APPROVED STATE
==================================================

TEST_CASE_DESIGN_APPROVED
AUTOMATION_PLAN_APPROVED
TEST_DATA_APPROVED
AUTOMATION_REVIEW_APPROVED
EXECUTION_READINESS_APPROVED

Execution-readiness result:

READY_FOR_EXECUTION

Approved automated scripts:

13

Target for this phase:

chromium only

Do NOT execute firefox or webkit yet.

==================================================
CURRENT GOAL
==================================================

Perform:

1. Runtime SUT startup/readiness
2. Runtime seed-state verification
3. Chromium FR-05 execution
4. HTML report generation
5. Report identity verification
6. Failure triage
7. Evidence preservation
8. Execution result documentation
9. AI Audit CREATE_ENTRY

Stop at:

CHECKPOINT: CHROMIUM_EXECUTION_REVIEW_REQUIRED

==================================================
1. START SUT
==================================================

Start and keep running:

Backend:
working directory:
backend/

command:
node server.js

Expected URL:
http://localhost:3000

Frontend:
working directory:
frontend-web/

command:
npm.cmd run dev

Expected URL:
http://localhost:5173

Do not modify source code merely to start the application.

Wait using process/HTTP readiness checks.

Do not use arbitrary fixed sleeps as the primary readiness mechanism.

If either component cannot start:

stop with:

SUT_STARTUP_FAILED

Do not execute Playwright tests.

==================================================
2. RUNTIME SEED-STATE GATE
==================================================

Before Playwright execution perform a non-mutating:

GET http://localhost:3000/api/products

Verify against:

test-data/fr-05.json
seedCatalog

Confirm:

- response success;
- product count = 5;
- all five expected product names exist;
- names, raw prices and image URLs match the approved manifest.

Do not mutate or reseed the database.

If runtime catalog differs:

stop with:

SEED_STATE_MISMATCH

Do not execute Playwright.

==================================================
3. RUNTIME METADATA
==================================================

For this Chromium run generate one real execution timestamp:

RUN_TIMESTAMP=<current ISO timestamp>

Generate a unique Run ID derived from:

FR-05
chromium
execution timestamp

Use:

STUDENT_ID=23127107
SUT_BASE_URL=http://localhost:5173

Do not reuse the readiness timestamp.

Preserve these exact values in the execution record.

==================================================
4. CHROMIUM EXECUTION
==================================================

Execute only:

tests/fr-05/fr-05.spec.js

under:

--project=chromium

Use the approved Playwright configuration.

Do not enable retries.

Do not use:

--update-snapshots
--headed
--ui
--debug

unless explicitly required later by human review.

Do not run firefox.

Do not run webkit.

Allow requirement/product failures to remain visible.

Do not use test.fail(), test.skip(), catch-based failure swallowing or
assertion weakening.

==================================================
5. REPORT GENERATION
==================================================

Generate the configured HTML report.

Preserve the report directory for this run.

Verify the rendered HTML report visibly contains:

Run by: 23127107

Also verify traceability for:

- FR-05
- Chromium project
- execution timestamp / run identity

Do not assume static configuration is sufficient.

Inspect the real rendered report.

If the required student identity is not visibly rendered:

classify:

REPORT_IDENTITY_DEFECT

Do not silently accept the report.

==================================================
6. CAPTURE EXECUTION RESULTS
==================================================

Record:

- total tests
- passed
- failed
- skipped
- interrupted
- duration
- exact failed Test Case IDs

Expected total:

13

No blocked implementation case should appear.

Do not classify every failed test as an automation defect.

==================================================
7. FAILURE TRIAGE
==================================================

For each failed test classify initially as one of:

PRODUCT_DEFECT
AUTOMATION_DEFECT
ENVIRONMENT_FAILURE
NEEDS_HUMAN_REVIEW

Base classification on:

- requirement / approved Expected Result;
- Playwright failure message;
- locator/assertion behavior;
- current SUT behavior;
- available evidence.

Do not change tests during this phase.

If a test failure appears caused by locator/helper/test logic:

AUTOMATION_DEFECT

If the automation correctly observes behavior that violates the confirmed
requirement:

PRODUCT_DEFECT

If evidence is insufficient:

NEEDS_HUMAN_REVIEW

==================================================
8. EXPECTED DEFECT REVIEW
==================================================

Pay particular attention to the statically anticipated discrepancies:

FR05-TC-004
- product image alt currently expected to be empty.

FR05-TC-005
- current UI expected to use VND instead of ₫.

FR05-TC-011
FR05-TC-012
- current reflected input implementation uses dangerouslySetInnerHTML.

FR05-TC-014
- current non-empty home may contain two h1 elements.

Do not automatically mark these as product defects solely from static
inspection.

Use the actual runtime failure/evidence.

==================================================
9. FR05-TC-012 DIALOG EVIDENCE
==================================================

FR05-REV-006 requires runtime evidence.

For Chromium record whether:

- dialog observer was active;
- any dialog event was captured;
- literal text assertion result;
- img[onerror] assertion result.

This resolves Chromium evidence only.

Firefox/WebKit evidence remains pending.

==================================================
10. EVIDENCE
==================================================

Preserve useful evidence produced by Playwright/configuration.

For failures preserve available:

- HTML report entry
- error message
- stack trace
- screenshot if Playwright generated one
- trace if configured/generated

Do not manufacture screenshots or evidence for passed tests unless required.

Do not modify SUT to improve screenshots.

==================================================
11. EXECUTION DOCUMENT
==================================================

Create:

docs/execution-results/fr-05-chromium-execution.md

Include:

Run Metadata
- Feature
- Browser
- Student ID
- Run ID
- ISO timestamp
- SUT Base URL

Runtime Gates
- backend availability
- frontend availability
- seed-state result

Execution Summary
- total
- passed
- failed
- skipped
- duration

Per-Test Results

| Test Case ID | Result | Failure Summary | Initial Classification | Evidence |

Failure Triage

Reporter Verification

FR05-REV-006 Chromium Evidence

Remaining Cross-Browser Work

Current Checkpoint

==================================================
12. DO NOT FIX YET
==================================================

This is extremely important.

Do not modify:

- tests
- helpers
- playwright.config.js
- test data
- SUT
- database

even if failures are found.

First preserve the original Chromium execution result.

Automation corrections require separate human review.

==================================================
13. RETURN
==================================================

Return:

1. Chromium Execution Status
2. SUT Startup Result
3. Runtime Seed-State Result
4. Student ID
5. Run ID
6. ISO Timestamp
7. Total Tests
8. Passed
9. Failed
10. Skipped
11. Failed Test Case IDs
12. Initial Failure Classifications
13. HTML Report Path
14. Report Identity Verification
15. FR05-TC-012 Dialog Evidence
16. Automation Defects Suspected
17. Product Defects Suspected
18. Evidence Paths
19. Files Created
20. Files Modified
21. Current Checkpoint

Stop at:

CHECKPOINT: CHROMIUM_EXECUTION_REVIEW_REQUIRED

Do not continue to Firefox or WebKit.

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After preserving the original Chromium execution result use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next sequential Artifact ID.

Expected next ID:
A-006

Artifact:
FR-05 Chromium execution and initial failure triage

Workflow Stage:
Chromium runtime execution before human execution review

Feature / Task:
FR-05 — Product listing and search

Related artifacts:
- docs/execution-results/fr-05-chromium-execution.md
- Chromium HTML report
- generated execution evidence

Preserve the exact verbatim prompt.

Store:

docs/ai-audit/interactions/A-006-prompt.md

Preserve the original execution output before human corrections.

Store:

docs/ai-audit/interactions/A-006-output.md

Review Status:
PENDING_HUMAN_REVIEW

Do not finalize Verdict.

Do not UPDATE_REVIEW.

If audit creation fails, retain all execution results and report the audit
failure separately.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: CHROMIUM_EXECUTION_REVIEW_REQUIRED