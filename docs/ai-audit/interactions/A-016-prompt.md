$playwright-feature-workflow

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
AUTOMATION_BUILD_BUNDLE

Feature ID:
FR-17

Feature Name:
Coupon management

Student ID:
23127107

Primary Demo Feature:
YES

Approved Test Case Count:
16

Approved Test Cases:
FR17-TC-001
FR17-TC-002
FR17-TC-003
FR17-TC-004
FR17-TC-005
FR17-TC-006
FR17-TC-007
FR17-TC-008
FR17-TC-009
FR17-TC-010
FR17-TC-011
FR17-TC-012
FR17-TC-013
FR17-TC-014
FR17-TC-015
FR17-TC-016

Approved Design Sources:

docs/test-cases/fr-17/requirement-analysis.md
docs/test-cases/fr-17/test-cases.md
docs/test-cases/fr-17/requirement-coverage.md
docs/test-cases/fr-17/review-notes.md
docs/demo/fr-17-demo-plan.md

Current Checkpoint:
CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED

Precondition:

A-015 must already be FINALIZED with:

Verdict:
INCOMPLETE

Student Decision:
MODIFIED

Verification Result:
PASSED

Approval Status:
APPROVED

If A-015 is not finalized exactly as approved, STOP.

==================================================
PURPOSE
==================================================

Build the complete FR-17 Playwright automation bundle in one interaction.

Perform:

1. Inspect current Playwright infrastructure.
2. Inspect current Web Admin implementation.
3. Design external FR-17 test data.
4. Implement all approved FR-17 Test Cases.
5. Implement reusable helpers/fixtures.
6. Implement safe isolated-state guards.
7. Prepare deterministic Admin/non-admin authentication setup.
8. Prepare demo-tagged automation.
9. Perform static validation only.
10. Generate automation plan.
11. Generate AI automation review.
12. Generate automation-gap analysis.
13. Update FR-17 demo plan.
14. Create AI Audit A-016.

Do NOT:

- execute Chromium;
- execute Firefox;
- execute WebKit;
- start the SUT;
- start an isolated backend;
- mutate any SQLite database;
- create runtime evidence;
- create Bug Reports;
- assign FR17-BUG IDs.

Stop at:

CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED

==================================================
1. SOURCE OF TRUTH
==================================================

The approved FR-17 Test Design Bundle is authoritative for automation scope.

Implement exactly:

FR17-TC-001 through FR17-TC-016

Do not:

- add TC-017;
- remove an approved case silently;
- redesign Expected Results;
- reintroduce the original pre-correction TC-003 selector-only objective;
- invent Update;
- invent activation/deactivation;
- invent percent <= 100;
- invent exact error messages;
- invent future-expiry validation;
- invent delete-confirmation semantics.

If implementation prevents an approved case from being automated exactly,
record the issue rather than rewriting the requirement.

==================================================
2. APPROVED TYPE PARTITIONS
==================================================

This human-approved correction is mandatory.

FR17-TC-003:

Actual valid `percent` coupon CREATE through Web Admin UI.

It must:

- use test-owned unique external data;
- select type `percent`;
- submit valid values;
- verify exactly one controlled code appears;
- verify displayed/stored type is `percent`;
- verify the submitted discount value is observable;
- perform cleanup only after primary assertions.

FR17-TC-004:

Actual valid `fixed` coupon CREATE through Web Admin UI.

Keep approved lower valid controls:

discount_value = 1
min_order_amount = 0
max_uses_per_user = 1

Do not merge TC-003 and TC-004.

==================================================
3. EXTERNAL TEST DATA
==================================================

Create:

test-data/fr-17.json

All business test values must come from external JSON.

Do not place business-data arrays inline in the Playwright spec.

The JSON should contain logical datasets for at least:

- verified seed coupon oracle;
- required coupon fields;
- allowed type values;
- valid percent create;
- valid fixed lower-bound create;
- duplicate SAVE10 case;
- missing code;
- missing discount_value;
- discount_value = 0;
- missing expired_at;
- missing min_order_amount;
- min_order_amount = -1;
- missing max_uses_per_user;
- max_uses_per_user = 0;
- controlled delete setup record;
- authorization setup descriptors if useful.

Do NOT store:

admin email
admin password
user email
user password
JWT

in source-controlled JSON.

Use runtime-only environment variables for credentials.

==================================================
4. UNIQUE OWNED DATA
==================================================

Do not rely on one hardcoded reusable mutable coupon code across runs.

External JSON may contain stable prefixes such as:

FR17-PERCENT
FR17-FIXED
FR17-MISSING-CODE
FR17-DISCOUNT-ZERO
FR17-MIN-NEGATIVE
FR17-MAX-ZERO
FR17-DELETE

Generate the final owned code using deterministic runtime metadata such as:

Test Case ID
+
sanitized Run ID / run suffix

The resulting code must:

- be unique for the run;
- be attributable to one Test Case;
- never collide with documented seed coupons;
- be easy to cleanup.

Do not use random behavior when deterministic run metadata is available.

==================================================
5. AUTHENTICATION
==================================================

Use the current approved project authentication mechanism.

Runtime-only environment variables should include clear equivalents of:

SUT_API_BASE_URL

FR17_ADMIN_BASE_URL

FR17_TEST_ADMIN_EMAIL
FR17_TEST_ADMIN_PASSWORD

FR17_TEST_USER_EMAIL
FR17_TEST_USER_PASSWORD

If an existing project-wide environment naming convention already exists,
reuse it instead of inventing duplicates.

Never:

- print passwords;
- persist JWT;
- store credentials in Markdown;
- write secrets to AI Audit artifacts.

Admin setup must verify the authenticated user role is actually:

admin

before using the session.

Non-admin setup must verify the authenticated identity is not:

admin

before using that token/session.

==================================================
6. WEB ADMIN TARGET
==================================================

The automation target remains the actual Web Admin UI.

Supporting APIs may be used only for controlled setup such as:

- login;
- identity verification;
- deterministic fixture preparation where necessary.

Do NOT replace approved UI objectives with direct API assertions.

CREATE must occur through UI for:

FR17-TC-003
FR17-TC-004
FR17-TC-005
FR17-TC-006
FR17-TC-007
FR17-TC-008
FR17-TC-009
FR17-TC-010
FR17-TC-011
FR17-TC-012
FR17-TC-013

DELETE must occur through UI for:

FR17-TC-014

==================================================
7. ISOLATED DATABASE SAFETY
==================================================

FR-17 contains 12 stateful Test Cases.

The future runtime must NOT mutate:

backend/database.sqlite

Reuse the proven FR-09 architectural fact:

the backend resolves `database.sqlite` relative to its own backend directory.

Therefore future FR-17 execution must run the backend from a run-specific
copied backend directory whose own:

database.sqlite

is the isolated database.

Do not assume an environment variable alone changes the backend SQLite path
unless source code proves it.

Build fixtures/guards to require an explicit isolation signal such as:

FR17_ISOLATED_DB=true

and an isolated DB path metadata variable such as:

FR17_TEST_DB_PATH

Before any stateful fixture mutates data, fail closed unless:

- isolation flag is true;
- target DB path is resolved;
- target DB exists;
- target DB is NOT the workspace backend/database.sqlite.

The DB path variable is a fixture safety/verification input.

It is NOT permission to assume the backend reads that variable itself.

==================================================
8. WORKSPACE DATABASE FORBIDDEN PATH
==================================================

Resolve the absolute workspace database path.

Every direct SQLite helper must explicitly refuse to operate when its resolved
target equals the workspace database.

Fail with a clear automation setup error.

Never silently fall back to:

backend/database.sqlite

==================================================
9. STATEFUL CLEANUP MODEL
==================================================

Do not make tests depend on test order.

Preferred owned-row model:

FR17-TC-003:
create unique owned percent coupon through UI
→ assert
→ cleanup exact owned code

FR17-TC-004:
create unique owned fixed coupon through UI
→ assert
→ cleanup exact owned code

FR17-TC-005:
use verified SAVE10 only as duplicate oracle
→ never delete/modify SAVE10

FR17-TC-006–013:
use unique controlled code
→ attempt invalid create through UI
→ requirement assertion
→ unconditional cleanup of that exact controlled code if a nonconforming SUT
  created it

FR17-TC-014:
direct fixture setup inserts exactly one owned valid coupon
→ UI performs Delete
→ assert count 1 -> 0
→ unconditional residue cleanup

Cleanup must run in:

finally

or equivalent deterministic teardown.

Cleanup failure must be surfaced as:

AUTOMATION_SETUP_OR_CLEANUP_RISK

not hidden.

==================================================
10. BASELINE SEED PROTECTION
==================================================

Known expected seed codes:

SAVE10
BIGBUY
VIP100
EXPIRED

Do not modify/delete these seeds.

Provide a reusable baseline verification helper.

At minimum it should be able to verify the expected seed code set before
stateful execution when invoked during readiness/runtime.

Do not run it against the database in this build phase.

==================================================
11. TC-001 — COMPLETE LIST
==================================================

Implement requirement-driven assertions:

- expected count;
- complete expected code set.

Avoid relying on row ordering unless requirement defines order.

Use set-equivalent comparison where appropriate.

==================================================
12. TC-002 — REQUIRED FIELD INDICATORS
==================================================

Requirement:

all six required coupon fields must have visible `*` indicators beside their
labels.

Do NOT weaken the test because the current implementation may use
placeholders instead of proper labels.

Implement a robust field-to-label association check using available DOM
semantics where possible:

- explicit label `for`;
- wrapping label;
- accessible association;
- equivalent deterministic relationship.

If no qualifying field label/indicator exists, the requirement assertion must
fail.

Do not classify missing labels as an automation defect merely because the
current implementation lacks them.

Avoid styling assertions.

==================================================
13. TC-003 / TC-004 CREATE ASSERTIONS
==================================================

After UI submission, use observable business state.

Prefer:

- row/code count;
- row visibility;
- row-scoped submitted values;
- type/value assertions.

Do not require exact success alert text.

Do not use fixed sleeps.

Use Playwright web-first assertions.

==================================================
14. NEGATIVE CREATE ASSERTION MODEL
==================================================

For TC-005 through TC-013, the authoritative business oracle is:

the invalid create must not result in a new unauthorized/invalid coupon
record.

Build a reusable mechanism-neutral rejection helper.

It must not require:

- one specific CSS error container;
- exact error text;
- one specific browser-native validation mechanism;
- one specific network response shape

unless required by the approved Test Case.

It may observe optional error/UI evidence, but PASS/FAIL must be based on the
approved business outcome.

For unique controlled-code cases:

- controlled code remains absent;
- total/controlled count does not gain the invalid record.

For duplicate SAVE10:

- SAVE10 count remains exactly 1.

==================================================
15. NATIVE FORM VALIDATION
==================================================

Some invalid cases may be blocked by browser-native validation before a POST
request occurs.

The tests must accept any conforming rejection mechanism.

Do not require that a POST happens.

Synchronize using observable UI/business state.

No:

waitForTimeout(...)

as the primary synchronization strategy.

==================================================
16. TC-014 DELETE
==================================================

Fixture:

insert exactly one owned valid coupon into isolated DB.

UI test:

- locate exact owned code row;
- scope Delete action to that row;
- trigger Delete;
- assert owned-code count transitions 1 -> 0;
- verify baseline seed codes remain present where practical.

Do not assert a confirmation dialog.

Do not delete a seed coupon.

==================================================
17. TC-015 UNAUTHENTICATED
==================================================

Use a fresh browser context/page with:

- no JWT;
- no Admin storage;
- no inherited auth state.

Use a web-first render/access gate.

Expected:

the unauthenticated actor must not obtain usable Coupon Management
list/create/delete controls.

Keep the assertion mechanism-neutral.

Do not hardcode an exact redirect URL unless authoritative source requires it.

Do not call Admin create/delete API directly as the test objective.

==================================================
18. TC-016 NON-ADMIN
==================================================

Obtain a valid controlled non-admin identity through approved runtime auth
setup.

Verify role before browser injection.

The page must contain only the non-admin session.

Expected:

non-admin actor must not obtain usable Coupon Management controls.

Do not accidentally inject or retain an Admin token.

Keep no exact redirect-copy assumption.

==================================================
19. LOCATOR STRATEGY
==================================================

Prefer in order:

1. getByRole
2. getByLabel
3. getByPlaceholder when the current UI provides no label
4. deterministic form/table scoping
5. exact row scoping by controlled coupon code

Avoid:

- generated CSS classes;
- broad nth-child chains;
- positional Delete buttons without row scoping;
- fragile global text selectors when duplicate text exists.

Document unavoidable locator risks in the AI review.

==================================================
20. ASSERTION PATTERNS
==================================================

The suite must clearly use at least three assertion patterns.

Aim to demonstrate:

VISIBILITY_OR_HIDDEN_STATE
COUNT
TEXT_OR_VALUE
STATE_TRANSITION
ENABLED_OR_DISABLED_STATE
ATTRIBUTE_OR_SEMANTIC_STATE

Use only where meaningful.

Document the final assertion-pattern inventory.

==================================================
21. PLAYWRIGHT CONFIGURATION
==================================================

Inspect current:

playwright.config.js

Reuse the existing cross-browser/report infrastructure whenever possible.

Required future behavior:

Chromium
Firefox
WebKit

screenshot:
only-on-failure

trace:
retain-on-failure

video:
off

retries:
0

Because FR-17 is stateful, future FR-17 execution must use:

workers:
1

If current config already supports these requirements, do not modify it.

If FR-17 requires a minimal config change, make only the smallest necessary
change and document exactly why.

Do not break FR-05 or FR-09.

==================================================
22. TEST FILE ORGANIZATION
==================================================

Use:

tests/fr-17/

Prefer a maintainable layout such as:

tests/fr-17/fr-17.spec.js

tests/fr-17/helpers/
    auth.js
    coupon-ui.js
    coupon-data.js
    db-fixture.js
    runtime-guard.js

Exact helper split may vary if repository conventions suggest a cleaner
structure.

Do not over-engineer.

There must be exactly one implemented Playwright test for each approved ID:

FR17-TC-001
...
FR17-TC-016

No missing IDs.

No duplicate IDs.

==================================================
23. DEMO TAGGING
==================================================

FR17-TC-004 remains:

PRIMARY_DEMO_CANDIDATE

Tag its Playwright title with:

@demo

Example concept:

FR17-TC-004 @demo ...

FR17-TC-003 and FR17-TC-014 remain documented fallback candidates.

Do not tag multiple tests with `@demo` unless there is a strong technical
reason.

The intent is that later:

--grep "@demo"

collects one Test Case per browser project.

Runtime selection remains provisional until Phase 4.

If TC-004 later proves unsuitable at runtime, the human reviewer may move the
tag to an approved fallback.

==================================================
24. DEMO FLOW
==================================================

FR17-TC-004 future demo:

Admin authenticated
→ Coupon Management
→ fill valid fixed coupon
→ submit
→ verify exact owned coupon appears
→ verify submitted values
→ cleanup after assertions

Cleanup is infrastructure, not a second business objective.

Do not add extra UI behavior merely for video appearance.

==================================================
25. DEMO PLAN UPDATE
==================================================

Update:

docs/demo/fr-17-demo-plan.md

Set:

Automation Build Status:
BUILT_PENDING_HUMAN_REVIEW

Runtime Status:
NOT_EXECUTED

Primary Demo Candidate:
FR17-TC-004

Demo Tag:
@demo

Secondary Candidates:
FR17-TC-003
FR17-TC-014

Final Selected Demo Test:
PENDING_RUNTIME_VERIFICATION

AI Fix Candidate:
PENDING_REAL_HUMAN_REVIEW

Fallback Genuine Script Fix:
FR-05 TC-006 automation-helper correction

Also record:

- spec path;
- external data path;
- high-level demo flow;
- expected three browser projects;
- draft grep command.

The demo command is:

DRAFT_NOT_RUNTIME_VERIFIED

Do not execute it now.

==================================================
26. AI-FIX PRESERVATION
==================================================

During this build/review, if the AI discovers or creates a genuine automation
problem requiring correction, preserve it in the AI review.

Do NOT proactively fix a meaningful generated mistake and erase its history
before human review.

Instead record:

DEMO_FIX_CANDIDATE:
YES | NO

If YES include:

- original generated behavior;
- why it is wrong;
- affected Test Case(s);
- proposed correction;
- whether it is a TEST_SCRIPT correction.

Do NOT manufacture an error.

Task 2 specifically benefits from a genuine AI-generated script correction.

==================================================
27. STATIC VALIDATION ONLY
==================================================

Allowed:

- inspect files;
- syntax validation;
- static imports where side-effect-free;
- duplicate Test Case ID detection;
- JSON parse validation;
- grep/search;
- static config inspection.

Do NOT:

- run Playwright browser tests;
- use `--headed`;
- start frontend/backend;
- call live localhost endpoints;
- connect to/mutate SQLite;
- execute database fixture setup;
- generate HTML runtime reports.

If using any command to validate imports, first prove module top-level code has
no database/network side effects.

==================================================
28. BUILD QUALITY GATES
==================================================

Before returning verify:

- exactly 16 approved Test Case IDs implemented;
- exactly 16 Playwright tests;
- no missing ID;
- no duplicate ID;
- no invented requirement;
- external JSON is valid;
- no business-data arrays improperly hardcoded;
- no credentials committed;
- stateful helpers fail closed outside isolated DB;
- workspace database is explicitly forbidden;
- all stateful cleanup is deterministic;
- TC-003 is percent CREATE;
- TC-004 is fixed CREATE and tagged @demo;
- TC-014 deletes only owned data;
- TC-015 is fresh unauthenticated;
- TC-016 proves controlled non-admin identity;
- >=3 assertion patterns exist;
- screenshot/trace/video policy is compatible;
- FR-17 future workers=1;
- no browser execution occurred;
- no database mutation occurred.

==================================================
29. AUTOMATION PLAN
==================================================

Create:

docs/automation-plans/fr-17-automation-plan.md

Include:

- approved scope;
- Test Case -> automation mapping;
- data mapping;
- auth strategy;
- isolated DB architecture;
- workspace DB guard;
- locator strategy;
- assertion patterns;
- cleanup strategy;
- browser strategy;
- report/evidence strategy;
- demo strategy;
- known risks.

==================================================
30. AI AUTOMATION REVIEW
==================================================

Create:

docs/automation-reviews/fr-17-ai-review.md

Review every implemented Test Case for:

- requirement fidelity;
- objective fidelity;
- false-positive risk;
- false-negative risk;
- locator robustness;
- state isolation;
- cleanup;
- browser independence;
- data independence;
- authorization correctness;
- demo suitability.

Use finding statuses such as:

PASS
REVIEW_REQUIRED
NEEDS_MORE_EVIDENCE
IMPLEMENTATION_RISK
AUTOMATION_RISK

Do not issue PRODUCT_DEFECT verdicts from static inspection.

If genuine generated script correction is needed, clearly mark:

DEMO_FIX_CANDIDATE: YES

but leave human approval pending.

==================================================
31. AUTOMATION GAPS
==================================================

Create:

docs/gaps/fr-17-automation-gaps.md

Separate:

REQUIREMENT_GAP
IMPLEMENTATION_ONLY
AUTOMATION_RISK
RUNTIME_VERIFICATION_REQUIRED

Preserve the approved 11 requirement gaps.

Do not turn them into invented tests.

==================================================
32. FILES
==================================================

Expected new/updated artifacts:

test-data/fr-17.json

tests/fr-17/**

docs/automation-plans/fr-17-automation-plan.md

docs/automation-reviews/fr-17-ai-review.md

docs/gaps/fr-17-automation-gaps.md

docs/demo/fr-17-demo-plan.md

playwright.config.js
ONLY if minimally required

Do not modify:

approved FR-17 Test Case design files

unless a purely clerical traceability reference must be added.

Any substantive design change requires human review and must stop.

Do not modify:

SUT source
backend/database.sqlite
FR-05 tests/data
FR-09 tests/data
original execution evidence

==================================================
33. RETURN SUMMARY
==================================================

Return:

1. Build Status
2. Approved Test Cases
3. Implemented Playwright Tests
4. Missing Test Case IDs
5. Duplicate Test Case IDs
6. External Dataset Count
7. Stateful Automation Count
8. Read-Only Automation Count
9. Admin Auth Strategy
10. Non-Admin Auth Strategy
11. Isolated DB Strategy
12. Workspace DB Guard
13. Cleanup Strategy
14. Assertion Patterns
15. Primary Demo Test
16. Demo Tag
17. Secondary Demo Candidates
18. Demo Command Status
19. DEMO_FIX_CANDIDATE
20. Static Validation Result
21. Browser Execution Performed
22. Database Mutation Performed
23. Automation Plan
24. AI Review
25. Automation Gaps
26. Files Created
27. Files Modified
28. AI Audit Artifact
29. Current Checkpoint

Expected:

Approved Test Cases:
16

Implemented Playwright Tests:
16

Missing Test Case IDs:
None

Duplicate Test Case IDs:
None

Primary Demo Test:
FR17-TC-004

Demo Tag:
@demo

Demo Command Status:
DRAFT_NOT_RUNTIME_VERIFIED

Browser Execution Performed:
NO

Database Mutation Performed:
NO

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After producing the bundle use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected if A-015 was finalized and no other audit entry was added:

A-016

If sequence differs, use the actual next ID.

Artifact:
FR-17 Automation Build Bundle and Demo Automation Preparation

Workflow Stage:
FR-17 Playwright automation generation before execution readiness and human review

Feature / Task:
FR-17 — Coupon management

Related Artifacts:

test-data/fr-17.json
tests/fr-17/
docs/automation-plans/fr-17-automation-plan.md
docs/automation-reviews/fr-17-ai-review.md
docs/gaps/fr-17-automation-gaps.md
docs/demo/fr-17-demo-plan.md

Preserve exact verbatim prompt in:

docs/ai-audit/interactions/<Artifact-ID>-prompt.md

Preserve original AI output in:

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

CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED

