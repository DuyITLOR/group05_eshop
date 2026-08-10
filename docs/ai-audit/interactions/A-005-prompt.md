$playwright-feature-workflow

Workflow Mode:
FULL_WORKFLOW

Feature ID:
FR-05

Feature Name:
Product listing and search

Repository Root:
.

Approved Test Case File:
docs/test-cases/fr-05/test-cases.md

Approved Automation Plan:
docs/automation-plans/fr-05-automation-plan.md

Approved Test Data:
test-data/fr-05.json

Approved Automation Files:
- tests/fr-05/fr-05.spec.js
- tests/fr-05/helpers/fr-05-helpers.js
- playwright.config.js

Automation Review:
docs/automation-reviews/fr-05-ai-review.md

Automation Gaps:
docs/gaps/fr-05-automation-gaps.md

Student ID:
23127107

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
AUTOMATION_REVIEW_APPROVED

A-004:
FINALIZED

Approved automation inventory:

- 13 legitimate Playwright tests
- Minimum required: 12
- 4 BLOCKED_BY_IMPLEMENTATION cases excluded
- Chromium / Firefox / WebKit projects statically configured
- Runtime execution: NOT_EXECUTED

==================================================
CURRENT GOAL
==================================================

Perform ONLY:

EXECUTION READINESS

This phase may:

- inspect the local Node.js / package-manager environment;
- prepare the repository package manifest if required;
- install @playwright/test;
- install required Playwright browser binaries;
- validate Playwright CLI availability;
- resolve runtime SUT configuration;
- validate Student ID configuration;
- collect tests using Playwright --list;
- verify browser/project discovery;
- verify reporter/runtime metadata preparation;
- create an execution-readiness report;
- create AI Audit entry A-005.

Do NOT execute the FR-05 tests.

Do NOT launch a test browser through `playwright test`.

Do NOT create PASS/FAIL test results.

Do NOT generate HTML execution reports.

Do NOT modify the SUT or database.

Stop at:

CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED

==================================================
1. PRE-READINESS VALIDATION
==================================================

Before changing the environment verify:

- playwright.config.js exists;
- tests/fr-05/fr-05.spec.js exists;
- helper file exists;
- test-data/fr-05.json parses successfully;
- 13 approved test IDs remain present;
- four BLOCKED_BY_IMPLEMENTATION test IDs remain absent;
- Student ID is:

23127107

Do not redesign or regenerate tests.

If an approved automation artifact is missing, stop with:

EXECUTION_READINESS_INPUT_MISSING

==================================================
2. NODE AND PACKAGE MANAGER DISCOVERY
==================================================

Inspect:

- node --version
- npm --version
- repository package manifests
- lockfiles
- existing package-manager convention

Determine whether the repository uses:

- npm
- pnpm
- yarn
- another existing Node package-manager workflow

Reuse the existing repository convention when clearly established.

Do not replace an existing package manager.

Do not delete or regenerate unrelated package manifests or lockfiles.

==================================================
3. ROOT PLAYWRIGHT PACKAGE SETUP
==================================================

The Playwright config and tests live at repository root.

Inspect whether a root package.json already exists.

If a suitable root package.json exists:

- preserve unrelated scripts/dependencies;
- add only the minimum Playwright testing dependency/setup required.

If no root package.json exists:

- create a minimal root testing package manifest;
- do not modify frontend/backend package manifests merely to host the
  Playwright runner;
- use the package manager selected from repository inspection.

Install the appropriate Playwright Test dependency using the selected package
manager.

For npm this is logically equivalent to:

npm install --save-dev @playwright/test

Do not arbitrarily pin an old Playwright version.

Record the actual installed version.

Do not modify FR-05 test logic during dependency installation.

==================================================
4. PLAYWRIGHT BROWSER INSTALLATION
==================================================

Install the browser binaries required by the approved projects:

- chromium
- firefox
- webkit

For an npm/npx environment this is logically equivalent to:

npx playwright install chromium firefox webkit

Do not install unrelated branded browser channels.

Do not switch Chromium to installed Google Chrome.

Do not change the approved browserName mappings.

If browser installation fails:

- preserve successful environment changes;
- record the exact failure;
- classify readiness as BLOCKED_BY_ENVIRONMENT;
- do not execute tests.

==================================================
5. PLAYWRIGHT CLI VALIDATION
==================================================

Verify Playwright CLI availability.

Record:

- Playwright version
- dependency resolution path where appropriate
- installation success/failure

A lightweight version command is allowed.

Do not execute the FR-05 suite.

==================================================
6. SUT BASE URL RESOLUTION
==================================================

Resolve the public frontend Base URL from repository evidence.

Inspect appropriate sources such as:

- README.md
- frontend package scripts
- Vite configuration
- environment files/templates
- existing documented local URLs

Do not guess the SUT Base URL.

Do not infer a port only because it is common for Vite.

If one deterministic local URL can be established, record it as:

SUT_BASE_URL

If repository evidence conflicts or is insufficient, stop readiness approval
with:

SUT_BASE_URL_REQUIRED

and report the conflicting candidates.

Do not modify frontend source to force a particular port.

==================================================
7. STUDENT ID / REPORT IDENTITY VALIDATION
==================================================

Runtime Student ID is:

23127107

Validate that the approved config can receive:

STUDENT_ID=23127107

Verify statically/evaluatively that the configured HTML reporter title would
be formed as:

FR-05 | Run by: 23127107 | <ISO timestamp> | <Run ID>

Do not fabricate an execution timestamp.

A timestamp generated while evaluating config may be recorded only as
readiness evidence, not as a test-run timestamp.

Verify that metadata retains:

- Feature ID
- Student ID
- ISO timestamp
- Run ID

Rendered HTML report verification is still deferred until actual execution.

==================================================
8. SAFE TEST DISCOVERY
==================================================

Use Playwright test discovery only.

Allowed command:

playwright test --list

or the selected package-manager equivalent.

This operation must collect tests without executing them.

Supply required runtime environment values while collecting the list:

STUDENT_ID=23127107
SUT_BASE_URL=<resolved value>

Validate that:

- all 13 FR-05 Test Case IDs are discovered;
- each Test Case ID is represented under chromium;
- each Test Case ID is represented under firefox;
- each Test Case ID is represented under webkit;
- no blocked test ID is discovered;
- no duplicate test definition exists within a project.

Do not interpret discovery as test PASS.

Do not generate an HTML report from --list.

==================================================
9. PROJECT CONFIGURATION VALIDATION
==================================================

Verify the final Playwright configuration still maps:

chromium:
browserName: chromium

firefox:
browserName: firefox

webkit:
browserName: webkit

Do not accept project names alone as proof of engine selection.

Verify:

retries = 0

or equivalent approved no-retry behavior.

Verify the HTML reporter remains configured.

Do not modify approved project mappings unless an actual configuration defect
is discovered.

If a configuration defect is discovered:

- record it;
- do not silently redesign the automation;
- stop for human review if correction changes previously approved behavior.

==================================================
10. RUNTIME PRECONDITIONS
==================================================

Record readiness for the verified seed state.

The future execution requires the application database to expose the approved
five-product controlled seed catalog.

Do not reset or reseed the database automatically in this phase.

Do not add products.

Do not delete products.

Do not mutate business data.

Document how the seed state will be confirmed immediately before execution.

==================================================
11. SUT PROCESS READINESS
==================================================

Inspect and document the exact commands required to start:

- backend
- frontend

Do not invent commands.

If the SUT is already running, a simple non-mutating availability/HTTP check
may be performed.

If the SUT is not running:

- do not treat that alone as an automation defect;
- record the exact startup commands for the execution phase.

Do not perform business actions against the SUT.

Do not run FR-05 Playwright tests.

==================================================
12. EXECUTION READINESS REPORT
==================================================

Create:

docs/execution-readiness/fr-05-execution-readiness.md

Include:

Environment
- OS
- Node version
- package manager
- Playwright version

Dependency Readiness
- @playwright/test status
- root package manifest status
- lockfile status

Browser Readiness
- chromium installation status
- firefox installation status
- webkit installation status

Runtime Inputs
- STUDENT_ID
- SUT_BASE_URL
- run-id strategy
- timestamp strategy

Test Discovery
- FR-05 test count
- Test Case IDs
- project/browser discovery
- blocked IDs absent

Reporter Readiness
- HTML reporter status
- visible Run by strategy
- metadata status
- rendered-report verification status

SUT Readiness
- frontend start command
- backend start command
- expected local URLs
- seed-state precondition

Remaining Risks
- FR05-REV-006 dialog timing
- rendered HTML report inspection
- seed-state runtime confirmation
- any newly discovered environment blocker

Do not put fabricated runtime PASS/FAIL test results in this report.

==================================================
13. ALLOWED FILE CHANGES
==================================================

Files that may be created/modified if required:

- package.json
- package-lock.json / appropriate package-manager lockfile
- docs/execution-readiness/fr-05-execution-readiness.md
- docs/ai-audit/*

playwright.config.js may only be modified if an objective readiness defect is
found and the correction does not weaken approved behavior.

Do NOT modify:

- tests/fr-05/fr-05.spec.js
- tests/fr-05/helpers/fr-05-helpers.js
- test-data/fr-05.json
- approved test cases
- approved automation plan
- SUT source
- database

If test/helper modification appears necessary:

stop and report:

AUTOMATION_CORRECTION_REQUIRED

==================================================
14. READINESS RESULT
==================================================

Classify overall readiness as exactly one of:

READY_FOR_EXECUTION
BLOCKED_BY_ENVIRONMENT
SUT_BASE_URL_REQUIRED
AUTOMATION_CORRECTION_REQUIRED
EXECUTION_READINESS_INPUT_MISSING

READY_FOR_EXECUTION requires:

- Playwright dependency available;
- Chromium installed;
- Firefox installed;
- WebKit installed;
- SUT Base URL resolved;
- STUDENT_ID = 23127107 accepted;
- 13 approved tests successfully discovered;
- all three projects successfully discovered;
- no blocked IDs discovered;
- no unresolved automation-code correction required.

==================================================
15. DO NOT EXECUTE
==================================================

Explicitly prohibited in this phase:

playwright test
playwright test --project=chromium
playwright test --project=firefox
playwright test --project=webkit

unless the command includes --list and therefore performs discovery only.

Do not use:

--headed
--ui
--debug

Do not generate:

- HTML test execution reports
- screenshots
- traces
- videos
- runtime test result files

==================================================
16. RETURN
==================================================

Return:

1. Execution Readiness Result
2. Node Version
3. Package Manager
4. Playwright Version
5. Playwright Dependency Status
6. Chromium Installation Status
7. Firefox Installation Status
8. WebKit Installation Status
9. Student ID Validation
10. Resolved SUT Base URL
11. Backend Start Command
12. Frontend Start Command
13. Test Discovery Result
14. Discovered FR-05 Test Cases
15. Browser Project Discovery
16. Reporter Readiness
17. Seed-State Runtime Precondition
18. Remaining Runtime Risks
19. Files Created
20. Files Modified
21. Current Checkpoint

Stop at:

CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED

Do not continue to multi-browser execution.

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After completing the Execution Readiness artifact, immediately use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected next ID:
A-005

This audit entry represents:

FR-05 Execution Readiness

Workflow Stage:
Execution readiness; before multi-browser execution

Feature / Task:
FR-05 — Product listing and search

Related Artifact:
docs/execution-readiness/fr-05-execution-readiness.md

Additional related files may include:

- package.json
- package lockfile

==================================================
AUDIT CONTENT RULES
==================================================

Preserve the EXACT verbatim prompt from this interaction.

Store:

docs/ai-audit/interactions/A-005-prompt.md

Preserve the ORIGINAL AI output from this interaction.

Store:

docs/ai-audit/interactions/A-005-output.md

Do not paraphrase.

Do not reconstruct missing prompt/output content.

If exact evidence is unavailable, report the audit failure instead of
fabricating it.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
Do not finalize yet.

Output Storage:
EXTERNAL_FILE

Do not perform UPDATE_REVIEW yet.

==================================================
AUDIT FAILURE POLICY
==================================================

If audit creation fails:

- keep the Execution Readiness artifact;
- report audit failure separately;
- do not fabricate A-005;
- keep checkpoint:

CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED

==================================================
FINAL RESPONSE
==================================================

Return the Execution Readiness result first.

Then return:

AI Audit:
- Status
- Artifact ID
- Prompt Evidence Path
- Output Evidence Path
- Review Status
- Required User Action

Do not proceed to execution.