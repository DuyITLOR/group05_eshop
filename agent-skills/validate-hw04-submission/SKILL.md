---
name: validate-hw04-submission
description: A read-only validator for HW04 automation testing submissions.
---

# validate-hw04-submission

## 1. Skill Name
`validate-hw04-submission`

## 2. Purpose
The skill must inspect an HW04 repository and submission package, validate the available evidence against the assignment requirements, and generate a Markdown validation report.

## 3. Scope
The skill is a **read-only validator**. It must not repair, fabricate, replace, or silently complete missing deliverables. It does not modify test scripts, run Playwright, install packages, or create missing evidence.

## 4. When to Use
Use this skill to evaluate the completeness and correctness of an HW04 submission against the assignment rubric. It can be used before submission (to find missing work) or right at submission to ensure all mandatory deliverables are present.

## 5. When Not to Use
Do not use this skill to write test cases, automate tests, run Playwright, or fix code. Do not use it to alter Git history or fabricate evidence.

## 6. Required Inputs
- Validation Mode
- Repository Root
- Submission Root
- Student ID
- Self-Assessed Grade
- Expected Feature List (supports Pool, Feature ID, Feature Name)
- Expected Browser List
- Validation Output Path

## 7. Optional Inputs
- GitHub Repository URL
- YouTube Demo URL
- Agent Skill Demo URL
- ZIP File Path
- README Path
- Main Report Paths
- AI Audit Report Paths
- AI Critique Paths
- Git Commit Log Path
- Bug Report Directory
- HTML Report Directories
- Test Case Directories
- Test Data Directories
- Test Script Directories
- Agent Skill Root
- Custom Directory Mapping
- Minimum Test Cases per Feature
- Minimum Valid Commits
- Minimum Distinct Commit Days
- Allowed Test Script Extensions
- Required Report Metadata Pattern
- Report Timestamp Pattern
- Manual Verification Notes

## 8. Validation Modes
### `PRE_SUBMISSION`
Use while the student is still preparing the assignment.
- A ZIP file may not exist yet.
- Missing final packaging should normally be `WARNING`, not automatically `BLOCKED`.
- Focus on identifying missing work and recommended next actions.

### `FINAL_SUBMISSION`
Use immediately before submission.
- The ZIP file is mandatory.
- All required deliverables must be present.
- Missing mandatory deliverables must be `BLOCKED`.
- The final overall status cannot be `PASS` while mandatory evidence remains `NOT_VERIFIED`.

## 9. Default HW04 Requirements

### 10.1 Feature Selection
- Exactly three web features.
- One feature from Pool A.
- One feature from Pool B.
- One feature from Pool C.
- Pool D mobile is not counted for HW04 web automation.
- Feature declarations must be consistent across README, Main Report, test case files, automation scripts, and execution reports.

### 10.2 Test Cases
- At least 12 test cases per feature.
- At least 36 test cases across the three features.
- Positive, Negative, and Edge coverage must be evaluated.
- Test Case IDs must be unique.
- Test cases must contain meaningful Expected Results.
- Duplicate or artificially split cases must not be counted merely to reach the minimum.
- Approved test cases must map to automation scripts or a documented automation gap.

### 10.3 Data-Driven Testing
- Test data must be stored in external `.json` or `.csv` files.
- Data-driven arrays or object collections embedded in test scripts are not accepted.
- Test scripts must actually read the external data files.
- Test data records should be traceable to Test Case IDs.
- Secrets and credentials must not be committed in plain text.

### 10.4 Assertions
- At least three distinct assertion patterns must be present.
- Repeating the same assertion type does not create a new pattern.
- Assertions must verify business outcomes, not only element existence.
- Recognized categories may include: `URL_OR_NAVIGATION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE`, `COUNT`, `ENABLED_OR_DISABLED_STATE`, `ATTRIBUTE_OR_CLASS`, `API_RESPONSE`, `PERSISTENCE`, `STATE_TRANSITION`, `CALCULATION`, `PERMISSION`, `DOWNLOAD_OR_FILE`, `DIALOG`, `TOAST_OR_NOTIFICATION`.

### 10.5 Multi-Browser Execution
- Every feature must run on at least three browsers (e.g., Chromium, Firefox, WebKit or Chrome, Edge, Firefox).
- At least nine feature-browser runs are required (3 features × 3 browsers).
- Browser configuration alone is not execution evidence.
- A run must have verifiable report or execution-log evidence.

### 10.6 HTML Reports
- Allure or Playwright HTML Reporter is accepted.
- Reports must be readable and non-empty.
- Reports must contain: `Run by: <StudentID>`
- Reports or report metadata must contain an ISO timestamp (e.g., `YYYY-MM-DDTHH:mm:ssZ`, `YYYY-MM-DDTHH:mm:ss+07:00`, `YYYY-MM-DDTHH:mm:ss.sssZ`).
- Reports must be traceable to the correct feature and browser.
- A report filename alone is not sufficient evidence.
- Do not alter reports to insert missing metadata during validation.

### 10.7 Human Review and Gap Analysis
The assignment evidence must identify:
- what AI generated;
- what the AI got wrong or missed;
- the risks;
- the student's correction;
- the verification after correction;
- why the AI may have missed the issue.
Relevant issues may include: fragile selectors, weak or missing assertions, missing edge cases, hardcoded data, flaky waits, test-order dependencies, browser-specific failures, missing setup or cleanup, incorrect expected results.
Unautomated cases must include: Test Case ID, reason, attempted approach, remaining blocker, recommended next action.
A generic statement such as "The AI output was reviewed" is not enough for `PASS`.

### 10.8 Demo Video
Validate when evidence is accessible:
- YouTube link exists.
- Video duration is at least five minutes.
- Visibility is Unlisted.
- Narration is in Vietnamese.
- At least one automation script is demonstrated end to end.
- Multi-browser execution is shown.
- The generated HTML report is shown.
- At least one correction to an AI-generated script is explained.
- Authorship evidence is shown through face-cam or terminal commands `whoami` and `hostname`.
If the video cannot be opened or inspected, use `NOT_VERIFIED` for the affected items and generate a manual checklist.

### 10.9 Agent Skill
Validate:
- Agent Skill directory exists.
- `SKILL.md` exists and is readable.
- The skill defines purpose, inputs, workflow, human-review checkpoints, outputs, acceptance criteria.
- Demonstration evidence or a video link exists.
- Do not grade quality merely by counting the number of skills.

### 10.10 AI Audit Report
Validate both Markdown and PDF versions. The AI Audit Report should use the five-section artifact format: Prompt + Tool, AI Output, Verdict, Reasoning, Student Fix.
Validate:
- Student Information section.
- Verbatim prompt.
- Verbatim AI output or a valid reference to the full output.
- Final verdict values: `VALID`, `INVALID`, `INCOMPLETE`.
- Real evaluation sources in Reasoning.
- Student Decision and verification in Student Fix.
- Accuracy summary.
- Conclusion section.
- Mandatory Disclosure.
- Student Confirmation.
- References.
- No unresolved placeholders.
- Pending entries are not incorrectly counted in finalized verdict totals.
Do not modify the audit log during validation.

### 10.11 AI Critique
Validate:
- Markdown file exists.
- PDF file exists.
- Length is 200–300 words.
- The critique addresses where AI was wrong/biased/incomplete, why it failed, what principle was learned.
- The critique is related to actual automation work.
The validation report must record the word-count method. For Vietnamese content, clearly state whether the count is approximate.

### 10.12 Git History
Validate:
- Public repository link is declared.
- At least eight valid commits.
- Valid commits occur across at least four distinct days.
- Only commits that modify test-script files count (default extensions: `.spec.ts`, `.spec.js`).
Do not count commits that only modify README, PDF, Markdown reports, configuration, test data, documentation, or HTML reports.
For every commit, report: Commit Hash, Author Date, Commit Message, Test Script Files Changed, Valid, Reason.
Do not rewrite Git history or recommend fake/backdated commits.

### 10.13 Main Report
Validate both Markdown and PDF versions. Expected content includes: feature selection, AI-first process, automation process, data-driven approach, assertion patterns, multi-browser results, HTML report references, human review, gap analysis, failure or bug analysis, referenced links.

### 10.14 Git Commit Log
Validate:
- a text-based file exists;
- the file is readable;
- commit hash, date, and message are present;
- the content is consistent with the actual Git history.
If inconsistent, return `GIT_LOG_MISMATCH_DETECTED`.

### 10.15 Bug Reports
If no confirmed product bug exists, use `NOT_APPLICABLE` for GitHub Issue requirements and validate that the report explicitly states no confirmed product defect was found.
If a confirmed bug exists, validate: Bug ID, Title, Environment, Browser, Preconditions, Steps to Reproduce, Actual Result, Expected Result, Severity or Priority, Screenshot, Related Test Case ID, GitHub Issue Link, Failure Evidence.
Do not classify a failed test as a product defect without supporting analysis.

### 10.16 README
Validate that README contains: Self-Assessment Table, Number of Features, Number of Test Cases Automated, Number of Test Cases Executed, Number Passed, Number Failed, Number Skipped (when applicable), Number of Browser Runs, Number of Bugs, Demo Video Link, Public GitHub Repository Link, Report locations or viewing instructions.
Compare README totals with evidence-derived totals. If inconsistent, return `SUMMARY_MISMATCH_DETECTED`.

### 10.17 ZIP Package
Required filename: `<StudentID>_HW04_AI_Automation_<SelfAssessedGrade>.zip`
Validate:
- Student ID matches.
- `HW04_AI_Automation` is exact.
- Self-Assessed Grade contains exactly three digits (000-100).
- ZIP exists in `FINAL_SUBMISSION` mode.
- ZIP can be opened when tools allow.
- Required deliverables are present.
- No unnecessary nested ZIP exists.

### 10.18 Missing Required Documents
The skill must treat missing mandatory documents seriously. Required deliverables include: Main Report (Markdown/PDF), Public GitHub Repository Link, Automation Scripts, Test Data Files, Multi-Browser HTML Reports, Demo Video Link, AI Critique (Markdown/PDF), AI Audit Report (Markdown/PDF), Git Commit Log, README, Agent Skills, Agent Skill Demonstration Evidence, Bug Report and GitHub Issues when confirmed bugs exist, Supporting Evidence as applicable.

### 10.19 Placeholder and Broken Reference Detection
Search for unresolved placeholders (e.g., `TODO`, `TBD`, `FIXME`, `lorem ipsum`, `<StudentID>`, `<FeatureID>`, `<SelfAssessedGrade>`, `<fill here>`, `example.com`, `INSERT_LINK_HERE`, `VIDEO_LINK`, `GITHUB_LINK`).
Detect empty Markdown headings, missing local files, broken relative links, missing screenshots, missing report links, missing video links, invalid evidence paths. Do not repair them automatically.

## 10. Validation Statuses
- `PASS`: The requirement is supported by clear, readable, and relevant evidence.
- `WARNING`: The artifact exists but is incomplete, inconsistent, risky, or requires attention.
- `BLOCKED`: A mandatory requirement is missing or a clear violation is detected.
- `NOT_VERIFIED`: The available tools or evidence cannot confirm the requirement.
- `NOT_APPLICABLE`: The requirement does not apply.
Do not use a filename, README claim, or folder name alone as sufficient evidence for `PASS`.

## 11. Evidence Rules
Every validation item must contain:
- Validation ID
- Requirement
- Status
- Evidence
- Actual Result
- Expected Result
- Recommended Action
Evidence may be a file path, file-content excerpt, test-script reference, Test Case ID, Git commit hash, HTML report metadata, execution log, screenshot path, video metadata, URL, or an explicit statement that no evidence was available.
Do not use vague evidence (e.g., "The files look correct."). Do not expose passwords, tokens, or unnecessary personal information.

## 12. Pre-flight Validation
Before validating a submission, the skill must:
1. Verify Repository Root exists.
2. Verify Submission Root exists.
3. Validate Student ID.
4. Validate Self-Assessed Grade.
5. Validate Expected Feature List.
6. Validate Expected Browser List.
7. Validate Validation Output Path.
8. Detect repository directory mappings.
9. Build an artifact inventory.
10. Detect multiple candidates for the same deliverable.
11. Detect unreadable files.
12. Avoid selecting among conflicting candidates without evidence.
When multiple candidates are found, return `MULTIPLE_CANDIDATES_FOUND` with candidate paths, artifact type, likely relevance, and required user decision.

## 13. Artifact Discovery
Create a table:
| Artifact ID | Artifact Type | Detected Path | Readable | Candidate Status | Notes |
|---|---|---|---|---|---|

Candidate Status values: `PRIMARY`, `ALTERNATIVE`, `UNCERTAIN`, `MISSING`. Do not create missing artifacts.

## 14. Validation Workflow
1. Perform Pre-flight Validation.
2. Build Artifact Inventory.
3. Execute all Validation Groups.
4. Compile tables and findings.
5. Determine Overall Status.
6. Generate Validation Report.

## 15. Validation Groups
1. Artifact Discovery
2. Feature Selection
3. Test Case Validation
4. Data-Driven Validation
5. Automation Script Validation
6. Assertion Pattern Validation
7. Multi-Browser Execution
8. HTML Report Validation
9. Execution Evidence
10. Human Review and Gap Analysis
11. AI Audit Report
12. AI Critique
13. Git Commit History
14. Main Report
15. README
16. Demo Video
17. Agent Skills
18. Bug Reports
19. Git Commit Log
20. ZIP Package
21. Placeholder and Broken References
22. Summary Consistency
23. Missing Required Documents

## 16. Overall Status Rules
- `BLOCKED`: At least one mandatory requirement is clearly missing or violated.
- `WARNING`: No confirmed blocking issue exists, but artifacts are incomplete, totals are inconsistent, risks remain, or ZIP is missing in `PRE_SUBMISSION`.
- `NOT_VERIFIED`: Mandatory evidence cannot be inspected (e.g., video unplayable, repository private).
- `PASS`: Every mandatory requirement is supported by evidence, no `BLOCKED` items exist, no mandatory item is `NOT_VERIFIED`, and warnings do not affect validity.

## 17. Error Handling
Support these error statuses:
`REPOSITORY_ROOT_NOT_FOUND`, `SUBMISSION_ROOT_NOT_FOUND`, `STUDENT_ID_MISSING`, `INVALID_SELF_ASSESSED_GRADE`, `FEATURE_LIST_MISSING`, `BROWSER_LIST_MISSING`, `VALIDATION_OUTPUT_INVALID`, `MULTIPLE_CANDIDATES_FOUND`, `REQUIRED_DELIVERABLE_MISSING`, `TEST_CASE_COUNT_INSUFFICIENT`, `DUPLICATE_TEST_CASES_DETECTED`, `INLINE_TEST_DATA_DETECTED`, `ASSERTION_PATTERN_COUNT_INSUFFICIENT`, `BROWSER_EXECUTION_EVIDENCE_MISSING`, `HTML_REPORT_UNREADABLE`, `HTML_REPORT_METADATA_MISSING`, `AI_AUDIT_FORMAT_INVALID`, `AI_AUDIT_REVIEW_PENDING`, `AI_CRITIQUE_WORD_COUNT_INVALID`, `GIT_HISTORY_UNAVAILABLE`, `GIT_COMMIT_COUNT_INSUFFICIENT`, `GIT_COMMIT_DAY_COUNT_INSUFFICIENT`, `GIT_LOG_MISMATCH_DETECTED`, `VIDEO_NOT_ACCESSIBLE`, `SUMMARY_MISMATCH_DETECTED`, `ZIP_NOT_FOUND`, `ZIP_UNREADABLE`, `BROKEN_REFERENCE_DETECTED`, `VALIDATION_INCOMPLETE`.
Every error response must include: Status, Description, Affected Validation Groups, Evidence, Required User Action, Can Continue.

## 18. Safety Rules
The skill must never:
- create missing deliverables
- modify test scripts, test data, HTML reports, AI Audit Report, AI Critique, README, or Git history
- create or backdate commits
- fabricate execution evidence, screenshots, bugs, GitHub Issues, or video verification
- change `NOT_VERIFIED` to `PASS` without evidence
- expose secrets in the validation report.

## 19. Output
Default output: `docs/validation/HW04_SUBMISSION_VALIDATION.md`
If a report already exists: do not silently overwrite it; create a timestamped version (e.g., `docs/validation/HW04_SUBMISSION_VALIDATION_<ISO_TIMESTAMP>.md`) or request explicit overwrite approval. The generated report must be in English.

## 20. Acceptance Criteria
The skill is complete when all prompt requirements are met: exactly one skill created, follows convention, read-only, supports both modes, 5 statuses defined, all validation groups included, required data checks included.

## 21. Invocation Example
```text
$validate-hw04-submission

Validation Mode: PRE_SUBMISSION
Repository Root: .
Submission Root: submission/
Student ID: <provided-at-runtime>
Self-Assessed Grade: 090

Expected Features:
- Pool: A
  Feature ID: FR-05
  Feature Name: Product listing and search
- Pool: B
  Feature ID: FR-09
  Feature Name: Discount coupons
- Pool: C
  Feature ID: FR-17
  Feature Name: Coupon management (CRUD)

Expected Browsers:
- chromium
- firefox
- webkit

Validation Output Path:
docs/validation/HW04_SUBMISSION_VALIDATION.md
```

## 22. Validation Summary Example
```text
Overall Status: BLOCKED

PASS:
- Three expected features were declared.
- FR-05 contains 12 valid test cases.
- FR-09 contains 14 valid test cases.
- FR-17 contains 13 valid test cases.
- External JSON test data is used.
- Four assertion patterns were detected.

WARNING:
- Two tests contain waitForTimeout().
- README execution totals do not match report-derived totals.

BLOCKED:
- FR-17 has no Firefox execution evidence.
- AI Critique PDF is missing.
- Only six valid test-script commits were found.

NOT_VERIFIED:
- YouTube duration.
- Unlisted visibility.
- Vietnamese narration.
- Face-cam or whoami/hostname evidence.

Recommended Next Actions:
1. P0_BLOCKING — Run FR-17 on Firefox and archive its HTML report.
2. P0_BLOCKING — Export AI Critique to PDF.
3. P0_BLOCKING — Review the remaining legitimate test-script work; do not fabricate or backdate commits.
4. P1_HIGH — Reconcile README totals with evidence-derived totals.
```

## 23. Related Skills
This skill is normally used after test-case design and automation work. It may inspect outputs produced by other skills, but it does not call or modify other skills. It does not repair failed validation items. It only creates a validation report when invoked.
