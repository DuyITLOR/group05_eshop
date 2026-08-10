[generate-test-cases-from-requirements](agent-skills/generate-test-cases-from-requirements/) 
[log-ai-audit](agent-skills/log-ai-audit/) 

Feature ID:
FR-05

Feature Name:
Product listing and search

Actor / User Role:
Public user

Minimum Test Case Count:
12

Minimum Automation Candidate Count:
12

Target Test Case Count:
14-16

Automation Target:
Playwright web frontend

Test Case ID Prefix:
FR05

Output Directory:
docs/test-cases/fr-05/

==================================================
WORKFLOW CONTEXT
==================================================

This is a CLEAN RESTART of the FR-05 HW04 workflow.

Previous FR-05 test cases, automation plans, test data, Playwright scripts,
automation reviews, gaps, and execution artifacts from the earlier attempt
must NOT be treated as approved input.

Design FR-05 again from the confirmed requirement sources.

Do not copy the previous test-case structure merely because it already exists.

Existing implementation and seed data may be inspected only as permitted by
the skill:

- implementation reference;
- automation-feasibility analysis;
- existing stable data discovery;
- discrepancy discovery.

They must not redefine the requirements or Expected Results.

==================================================
REQUIREMENT SOURCES
==================================================

Inspect the current repository and classify the relevant sources.

Expected primary sources include, where present:

1. README.md
   - FR-05 — Product listing and search
   - related confirmed global/UI requirements
   - SEC-04 if applicable to displayed user input

2. api_specification.md
   - product-list/search API contract

3. Relevant source/seed files
   - IMPLEMENTATION_ONLY
   - may be used to understand existing seed data and current implementation
   - must NOT override authoritative requirements

If other repository documents contain confirmed requirements directly
applicable to FR-05, include them and classify their authority.

Do not silently use unrelated feature requirements.

==================================================
DATA POLICY
==================================================

Prefer data in this order:

1. Existing verified project seed data
2. Existing stable project test data
3. External controlled JSON/CSV input data
4. New controlled fixtures only when genuinely required and explicitly
   approved

Important:

- Do not create artificial database records simply to make a test automatable.
- Do not invent placeholder products if existing seed products satisfy the
  same objective.
- Do not choose arbitrary boundary values merely to increase test count.
- A boundary test must have a confirmed requirement/technical basis.

Inspect existing project seed data and document which FR-05 objectives it can
legitimately support.

==================================================
ATOMIC TEST OBJECTIVE POLICY
==================================================

Apply the skill's Atomic Test Objective Rule strictly.

Prefer one independently verifiable primary behavior per test case.

If multiple requirement clauses:

- can fail independently;
- need different assertion patterns;
- have different setup/data dependencies;
- or have different automation feasibility;

they should normally be split into separate cases.

Examples of the type of distinction to consider, ONLY if supported by the
actual requirements:

- product image existence vs alt attribute requirement;
- currency symbol vs numeric grouping;
- search-target behavior vs empty-state presentation;
- safe text rendering vs executable markup protection.

These examples are not permission to invent requirements.

Every split must trace to an actual confirmed requirement clause.

Do not split cases merely to reach the minimum count.

==================================================
SEARCH REQUIREMENTS
==================================================

Do not invent search semantics.

Do not assume any of the following unless a confirmed source specifies them:

- partial matching;
- case-insensitive matching;
- trimming;
- debounce;
- prefix matching;
- URL synchronization;
- pagination;
- sorting;
- filtering.

If search is specified only as search by product name, test only behavior that
can be derived from that requirement.

==================================================
IMPLEMENTATION DISCREPANCIES
==================================================

You may inspect the implementation to identify discrepancies.

If implementation violates a confirmed requirement:

- keep the requirement-based Expected Result;
- record the discrepancy;
- do not rewrite the test to match current behavior;
- do not classify the requirement itself as unclear.

Examples may include missing UI state, unsafe rendering, incorrect semantic
markup, or missing accessibility attributes, but report only what is actually
found.

==================================================
TEST CASE DESIGN REQUIREMENTS
==================================================

Generate a test suite that provides legitimate FR-05 coverage across
appropriate categories such as:

- POSITIVE
- NEGATIVE
- EDGE

Each test case must include:

- Test Case ID
- Feature ID
- Requirement ID
- Objective
- Actor
- Preconditions
- Test Data
- Steps
- Expected Result
- Test Type
- Priority
- Automation Suitability
- Assertion Candidates
- Automation Risks
- Dependencies
- Notes

Expected Results must be source-supported and objectively verifiable.

Do not use vague wording such as:

"System works correctly"

Do not invent exact UI copy unless the source defines it.

==================================================
AUTOMATION FEASIBILITY
==================================================

For every generated case classify:

- AUTOMATION_SUITABLE
- AUTOMATION_POSSIBLE_WITH_SETUP
- MANUAL_RECOMMENDED
- NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION
- NEEDS_CLARIFICATION

Then calculate:

Automation Candidate Count

Only count:

- AUTOMATION_SUITABLE
- AUTOMATION_POSSIBLE_WITH_SETUP

Do not count a case merely because one minor assertion can be automated if
its primary objective cannot be verified.

Before requesting human approval, verify:

Total Test Cases >= 12

AND

Automation Candidate Count >= 12

Target:
14-16 legitimate test cases when supported by requirements.

Do not create duplicate or unsupported cases solely to reach the target.

If fewer than 12 legitimate automation candidates can be designed from the
confirmed requirements:

return:

MINIMUM_AUTOMATION_CANDIDATE_COUNT_NOT_REACHED

Explain exactly why.

Do NOT fabricate additional cases.

==================================================
REQUIREMENT COVERAGE
==================================================

Create/update:

docs/test-cases/fr-05/requirement-analysis.md
docs/test-cases/fr-05/test-cases.md
docs/test-cases/fr-05/requirement-coverage.md
docs/test-cases/fr-05/review-notes.md

The coverage matrix must clearly distinguish:

- FULLY_COVERED
- PARTIALLY_COVERED
- NOT_COVERED
- NEEDS_CLARIFICATION

Also distinguish:

Open Requirement Gaps

from:

Test Cases Classified as NEEDS_CLARIFICATION

Do not merge those metrics.

==================================================
CLEAN-RESTART SAFETY
==================================================

Do NOT:

- generate Playwright scripts;
- create playwright.config.*;
- create test-data JSON/CSV yet;
- create automation plans;
- run Playwright;
- run browsers;
- run the SUT solely for execution;
- modify SUT source code;
- modify database records;
- generate execution evidence;
- generate HTML reports;
- create fake PASS/FAIL results;
- automatically approve the test design.

If old FR-05 artifacts already exist, replace/rebuild only the test-design
artifacts within:

docs/test-cases/fr-05/

Do not modify downstream automation artifacts in this phase.

==================================================
FINAL QUALITY GATE
==================================================

Before stopping, report:

1. Sources Reviewed
2. Requirements Extracted
3. Requirement Gaps
4. Existing Seed Data Relevant to FR-05
5. Total Test Conditions
6. Total Test Cases
7. Positive / Negative / Edge Counts
8. Automation Suitability Breakdown
9. Automation Candidate Count
10. Minimum Automation Candidate Count
11. Requirement Coverage Summary
12. Split / Merge / Rewrite Decisions
13. Implementation Discrepancies Observed
14. Files Created
15. Files Modified
16. Current Checkpoint

Only if both minimum gates pass, stop at:

CHECKPOINT: TEST_CASE_DESIGN_REVIEW_REQUIRED

Do not proceed to automation planning.

Wait for human review.
