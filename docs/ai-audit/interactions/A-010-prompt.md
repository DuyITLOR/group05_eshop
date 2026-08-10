$generate-test-cases-from-requirements

Workflow Mode:
COMPRESSED_FEATURE_WORKFLOW

Phase:
TEST_DESIGN_BUNDLE

Feature ID:
FR-09

Feature Name:
Discount coupons

Actor / User Role:
Authenticated customer at Checkout

Minimum Test Case Count:
12

Minimum Automation Candidate Count:
13

Target Test Case Count:
16-18

Automation Target:
Playwright web frontend

Output Language:
Vietnamese main content with English standardized headings / field names /
technical identifiers / enums / statuses.

Repository Root:
.

Output Directory:
docs/test-cases/fr-09/

Student ID:
23127107

==================================================
COMPRESSED WORKFLOW PURPOSE
==================================================

This is FR-09 Test Design Bundle.

Perform in ONE interaction:

1. Requirement analysis
2. Requirement-gap analysis
3. Atomic test-condition design
4. Test-case design
5. Automation-feasibility classification
6. Requirement coverage matrix
7. Static design review
8. AI Audit CREATE_ENTRY

Do NOT create:

- automation plan
- external JSON test data
- Playwright scripts
- helpers
- browser execution
- HTML reports
- screenshots
- defect reports

Stop at one human checkpoint:

CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED

==================================================
1. AUTHORITATIVE SOURCES
==================================================

Inspect the current repository versions of:

README.md

Primary authoritative requirement:

FR-09 — Discount coupons

FR-09 states that at Checkout the coupon is valid only when ALL five
conditions are satisfied:

C1:
Coupon exists and is active:
is_active = 1

C2:
Coupon is not expired:
current date/time must be before expired_at

C3:
Order total meets minimum:
total >= min_order_amount

C4:
User is authenticated:
valid JWT Token

C5:
Per-user usage count has not reached the maximum:
user usage count < max_uses_per_user

Approved formulas:

percent:

discount_amount = total * discount_value / 100

fixed:

discount_amount = discount_value

final_amount:

final_amount = total - discount_amount

Approved sample coupons include:

SAVE10
- type: percent
- discount_value: 10%
- min_order_amount: 300000
- expired_at: 2099-12-31
- max_uses_per_user: 1

BIGBUY
- type: fixed
- discount_value: 50000
- min_order_amount: 500000
- expired_at: 2099-12-31
- max_uses_per_user: 1

VIP100
- type: fixed
- discount_value: 100000
- min_order_amount: 300000
- expired_at: 2099-12-31
- max_uses_per_user: 2

EXPIRED
- type: percent
- discount_value: 20%
- min_order_amount: 100000
- expired_at: 2020-01-01
- max_uses_per_user: 1

Also inspect only directly relevant supporting requirements such as:

FR-08 — Checkout

Use FR-08 only where it directly supports:

- checkout authentication prerequisite;
- checkout total context.

Inspect relevant global UI requirements only if they directly apply to the
FR-09 Checkout coupon UI.

Do not add unrelated global requirements merely to inflate case count.

==================================================
2. SUPPORTING SOURCE
==================================================

Inspect:

api_specification.md

Relevant section:

5.1 — Apply coupon

Supporting endpoint:

POST /api/apply-coupon

The API documentation describes a response containing:

discount_amount
final_amount

and an example body containing:

code
total_amount
user_id

Treat this source as:

SUPPORTING

not AUTHORITATIVE.

If API documentation or current implementation differs from the
authoritative FR-09 business rules, preserve FR-09 Expected Results and
record the discrepancy.

Do not silently replace the valid-JWT requirement with user_id merely because
the API example contains user_id.

==================================================
3. IMPLEMENTATION INSPECTION
==================================================

Inspect current implementation only for:

- Checkout coupon UI availability;
- actual route/page;
- locator feasibility;
- current coupon application flow;
- current authentication mechanism;
- current seed coupons;
- current user/coupon-usage data;
- deterministic data/setup feasibility;
- potential implementation discrepancies.

Potential implementation sources may include:

frontend-web/
backend/server.js
backend/database.js
backend/database.sqlite

Classify them as:

IMPLEMENTATION_ONLY

They must NOT define Expected Result.

Do NOT execute the SUT.

Do NOT mutate the database.

Do NOT create coupon usage records.

==================================================
4. SOURCE PRECEDENCE
==================================================

Use:

1. README.md FR-09 authoritative business rules
2. directly applicable authoritative related requirements
3. approved API contract as supporting context
4. implementation only for feasibility/discrepancy discovery

If requirement sources conflict, return:

REQUIREMENT_CONFLICT_DETECTED

with:

- Conflict ID
- Source A
- Source B
- conflicting information
- affected requirement
- affected test cases
- question

Do not resolve conflicts by guessing.

==================================================
5. ATOMIC REQUIREMENT EXTRACTION
==================================================

Decompose FR-09 into atomic internal Requirement IDs.

At minimum examine independently:

- coupon existence;
- active status;
- expiration;
- minimum-order rule;
- authentication;
- per-user usage limit;
- percent discount calculation;
- fixed discount calculation;
- final amount calculation.

Split objectives when they can fail independently.

Example:

"percent discount_amount is correct"

and

"final_amount after percent discount is correct"

may be independent objectives if one calculation can be wrong while the
other appears correct.

Do not split wording merely to increase test count.

==================================================
6. FIVE-CONDITION DECISION MODEL
==================================================

Create a requirement-level decision model for:

C1
C2
C3
C4
C5

The valid coupon path requires:

C1 = true
C2 = true
C3 = true
C4 = true
C5 = true

Design negative coverage so each individual condition can be shown to reject
application while the other necessary conditions are controlled as valid
where feasible.

Examples of legitimate categories include:

- coupon does not exist;
- coupon exists but inactive;
- coupon expired;
- total below minimum;
- invalid/missing authentication;
- usage count already at limit.

Do not assume all combinations of the five Boolean conditions need separate
cases.

Use Decision Table Testing to select meaningful non-redundant combinations.

==================================================
7. BOUNDARY VALUE RULES
==================================================

FR-09 explicitly defines these numeric boundaries:

minimum order:

total >= min_order_amount

usage limit:

usage_count < max_uses_per_user

Therefore legitimate boundary analysis may include:

Minimum order:
- just below min_order_amount
- exactly min_order_amount
- above min_order_amount when useful

Usage:
- max_uses_per_user - 1
- max_uses_per_user

Only create boundary cases where required test state can realistically be
controlled.

Do not invent unrelated boundaries for:

- coupon-code length
- discount_value limits
- total maximum
- case sensitivity
- whitespace trimming
- percentage <= 100

unless another authoritative source explicitly defines them.

==================================================
8. FORMULA COVERAGE
==================================================

Ensure independent coverage of:

PERCENT coupon calculation

and

FIXED coupon calculation.

Use authoritative/sample coupon values where suitable.

For example, if supported by the verified state:

SAVE10 at total 300000:

discount_amount = 30000
final_amount = 270000

BIGBUY at total 500000:

discount_amount = 50000
final_amount = 450000

These are examples derived directly from the documented formulas and sample
coupon values.

Recalculate from the current authoritative requirement rather than blindly
copying these examples.

Do not invent rounding semantics if the formula does not require rounding for
the selected deterministic data.

==================================================
9. SAMPLE COUPON DATA POLICY
==================================================

Prefer existing documented coupons:

SAVE10
BIGBUY
VIP100
EXPIRED

Inspect current seed implementation to verify which actually exist.

If an authoritative sample coupon is missing from implementation:

record:

IMPLEMENTATION_DISCREPANCY

Do not change the requirement.

Do not automatically insert the coupon.

For cases that require a state not provided by an existing seed, such as:

- inactive coupon;
- exact usage count at limit;
- exact usage count immediately below limit;

identify a realistic future controlled setup path.

Classify such cases:

AUTOMATION_POSSIBLE_WITH_SETUP

only if the setup is realistic and does not require inventing new business
semantics.

Do not create/mutate the state during this phase.

==================================================
10. STATEFUL TEST ISOLATION
==================================================

FR-09 has stateful behavior because coupon usage is per user.

During design explicitly identify which cases are:

READ_ONLY

versus:

STATEFUL_SETUP_REQUIRED

Avoid a design where one test must run before another.

Future automation must be independently reproducible.

Do not design test-order dependency such as:

TC-X applies coupon once,
then TC-Y assumes TC-X already consumed a usage.

Each case must have an explicit independent precondition/setup strategy.

==================================================
11. CHECKOUT VS APPLY-COUPON BOUNDARY
==================================================

FR-09 belongs to the Checkout UI.

Automation target is:

web frontend

not API-only testing.

Test cases must describe user-observable Checkout coupon behavior.

API interception/setup may later support deterministic automation, but do not
turn the suite into pure POST /api/apply-coupon tests.

Where a business rule is only observable through API response in the current
implementation, record that implementation/automation limitation explicitly.

Do not weaken the UI scope simply because the API is easier to test.

==================================================
12. UNDOCUMENTED BEHAVIORS
==================================================

Do NOT invent test expectations for:

- coupon code case sensitivity;
- leading/trailing whitespace;
- empty coupon input behavior;
- multiple coupons / stacking;
- replacing an already-applied coupon;
- removing a coupon;
- percent discount maximum 100%;
- fixed discount larger than order total;
- coupon message exact text;
- coupon input maximum length;
- Enter vs button trigger;
- network error handling.

Unless another authoritative source explicitly defines one of these behaviors,
record it as a requirement gap instead of creating an Expected Result.

==================================================
13. TEST CASE COUNT
==================================================

Minimum Test Case Count:

12

Target:

16-18

However quantity must come from legitimate atomic business objectives and
boundaries.

Do NOT fabricate duplicates merely to reach the target.

==================================================
14. AUTOMATION FEASIBILITY GATE
==================================================

Minimum Automation Candidate Count:

13

Only these classifications count:

AUTOMATION_SUITABLE
AUTOMATION_POSSIBLE_WITH_SETUP

These do NOT count:

MANUAL_RECOMMENDED
NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION
NEEDS_CLARIFICATION

For every proposed test case independently assess:

- objective assertability;
- deterministic data;
- authentication setup;
- cart/order total setup;
- coupon seed/state;
- usage-count setup;
- UI locator path;
- cleanup/isolation;
- unresolved requirement dependency.

Do not mark a case automatable merely because an API endpoint exists.

If fewer than 13 legitimate automation candidates exist:

do NOT inflate the count.

Return:

MINIMUM_AUTOMATION_CANDIDATE_COUNT_NOT_REACHED

and explain the missing setup/requirements.

==================================================
15. TEST TECHNIQUES
==================================================

Use techniques where justified, including:

USE_CASE_TESTING
DECISION_TABLE
EQUIVALENCE_PARTITIONING
BOUNDARY_VALUE_ANALYSIS
STATE_TRANSITION
ERROR_GUESSING

Do not label a normal sample-value case as EDGE merely to diversify types.

Expected suite should naturally contain:

POSITIVE
NEGATIVE
EDGE

where supported.

==================================================
16. REQUIRED TEST CASE SCHEMA
==================================================

Every test case must contain:

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
| Notes | |

Use:

FR09-TC-001
FR09-TC-002
...

Use separate:

FR09-TCND-...

for Test Conditions.

==================================================
17. LANGUAGE POLICY
==================================================

Primary content:

Vietnamese

Keep standardized headings/field names in English.

Keep technical terms, filenames, IDs, enums, statuses and commands in English
where appropriate.

Examples:

Expected Result
Automation Suitability
Decision Table
JWT
discount_amount
final_amount
AUTOMATION_POSSIBLE_WITH_SETUP

Do not translate IDs/status tokens.

==================================================
18. OUTPUT FILES
==================================================

Create/update only:

docs/test-cases/fr-09/requirement-analysis.md
docs/test-cases/fr-09/test-cases.md
docs/test-cases/fr-09/requirement-coverage.md
docs/test-cases/fr-09/review-notes.md

Do not create downstream automation artifacts.

==================================================
19. REQUIREMENT COVERAGE
==================================================

Coverage matrix must show:

- Requirement ID
- Requirement
- Covered By
- Coverage Status
- Rationale

Use:

FULLY_COVERED
PARTIALLY_COVERED
NOT_COVERED
NEEDS_CLARIFICATION

Explicitly show all extracted FR-09 atomic requirements.

Do not hide requirement gaps just because minimum automation count passes.

==================================================
20. STATIC DESIGN REVIEW
==================================================

Before returning perform a self-review for:

- duplicate test objectives;
- split/merge opportunities;
- invented business rules;
- invalid boundary cases;
- accidental API-only tests;
- test-order dependency;
- impossible data setup;
- missing cleanup/isolation;
- requirement-to-test traceability;
- minimum test count;
- minimum automation candidate count.

Create a Review History section.

If you corrected a direct consistency issue during generation, record it.

Do not self-approve the design.

==================================================
21. REQUIRED SUMMARY
==================================================

Return:

1. Requirement Sources
2. Extracted Atomic Requirements
3. Requirement Gaps
4. Implementation Discrepancies
5. Test Conditions
6. Total Test Cases
7. POSITIVE Count
8. NEGATIVE Count
9. EDGE Count
10. Automation Suitable Count
11. Automation Possible With Setup Count
12. Not Automatable Count
13. Automation Candidate Count
14. Minimum Automation Candidate Result
15. Requirement Coverage Summary
16. Stateful Cases
17. Existing Coupon Data Reused
18. Future Controlled Setup Needed
19. Duplicate / Out-of-Scope Check
20. Files Created
21. Files Modified
22. Current Checkpoint

==================================================
22. CHECKPOINT
==================================================

Only if:

Test Case Count >= 12

AND

Automation Candidate Count >= 13

stop at:

CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED

Do NOT auto-approve.

If either minimum is not satisfied, return the appropriate gate failure
instead.

==================================================
AI AUDIT — CREATE ENTRY
==================================================

After the FR-09 Test Design Bundle output has been completed, immediately use:

$log-ai-audit

Operation:
CREATE_ENTRY

Create the next valid sequential Artifact ID.

Expected next Artifact ID if A-009 is already finalized:

A-010

If repository audit sequence differs, use the actual next valid sequential ID
instead of fabricating A-010.

Artifact:

FR-09 Test Design Bundle

Workflow Stage:

FR-09 compressed requirement analysis and test-case design before human review

Feature / Task:

FR-09 — Discount coupons

Related Artifact:

docs/test-cases/fr-09/

==================================================
AUDIT CONTENT RULES
==================================================

Preserve the EXACT verbatim prompt from this interaction.

Store it at:

docs/ai-audit/interactions/<Artifact-ID>-prompt.md

Preserve the ORIGINAL AI output before any later human correction.

Store it at:

docs/ai-audit/interactions/<Artifact-ID>-output.md

Do not paraphrase either.

Do not reconstruct missing content.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset until human review

Output Storage:
EXTERNAL_FILE

Do NOT perform UPDATE_REVIEW.

==================================================
AUDIT FAILURE POLICY
==================================================

If CREATE_ENTRY fails:

- preserve the FR-09 design artifacts;
- report the audit error separately;
- do not fabricate an audit entry;
- remain at the design human-review checkpoint.

==================================================
FINAL CHECKPOINT
==================================================

CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED
