# AI Audit Report

> Mandatory appendix for AI-assisted coursework.
> This Markdown format is adapted from the FIT@HCMUS **AI Audit Report — 5-section Template per Artifact**.

---

## 1. Student Information

| Field                  | Value                       |
| ---------------------- | --------------------------- |
| Student name (printed) |                             |
| Student ID             |                             |
| Class / Cohort         |                             |
| Assignment ID          |                             |
| Assignment date        |                             |
| AI tool(s) used        |                             |
| AI assistance declared | [ ] Yes &nbsp;&nbsp; [ ] No |

Student Information is intentionally left blank for student completion.

---

## 2. Instructions

- Add one audit entry for each AI-generated artifact or meaningful prompt-output interaction.
- Preserve verbatim prompts and AI outputs in `docs/ai-audit/interactions/` when long.
- Assign `VALID`, `INVALID`, or `INCOMPLETE` only after human review.
- Record Student Fix and verification separately from the AI verdict.
- Do not remove or rewrite historical entries.

---

## 3. Audit Entries — Five Sections per Artifact

<!-- AUDIT_ENTRIES_START -->

### Artifact A-001 — FR-05 clean-restart requirement analysis and test-case design

#### (1) Prompt + Tool

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| Tool             | Codex                                     |
| Model            | GPT-5                                     |
| Date and Time    | 2026-08-09 23:26:56 +07:00                |
| Workflow Stage   | Requirement analysis and test-case design |
| Feature / Task   | FR-05 — Product listing and search        |
| Related Artifact | `docs/test-cases/fr-05/`                  |

**Verbatim Prompt**

[interactions/A-001-prompt.md](interactions/A-001-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-001-output.md](interactions/A-001-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
Status: TEST_CASE_DESIGN_REVIEW_REQUIRED
Test Cases: 16
Automation Candidate Count: 12
```

#### (3) Verdict

| Field         | Value                                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                        |
| Verdict       | `INCOMPLETE`                                                                       |
| Verdict Scope | FR-05 requirement analysis and test-case design generated before human corrections |

#### (4) Reasoning

**Review Notes**

- Requirement analysis bám đúng các authoritative/supporting sources và không dùng implementation để thay đổi Expected Result.
- Test design đã loại bỏ arbitrary boundary data và ưu tiên existing verified seed data.
- Các behavior có automation feasibility khác nhau nhìn chung đã được tách hợp lý.
- `FR05-TC-001` vẫn kết hợp catalog completeness và grid layout dù hai behavior có thể fail độc lập; cần split theo Atomic Test Objective Rule.
- `FR05-TC-006` nên đổi từ `EDGE` sang `POSITIVE` vì case hiện dùng normal existing seed prices và không còn kiểm tra boundary.
- Sau các chỉnh sửa trên, automation candidate count dự kiến tăng từ 12 lên ít nhất 13, tạo buffer tốt hơn trước automation planning.

#### (5) Student Fix

| Field               | Value                       |
| ------------------- | --------------------------- |
| Student Decision    | `MODIFIED`                  |
| Change Illustration | See **Changes Made** below. |
| Verification Method | `REVIEW`                    |
| Verification Result | `PASSED`                    |
| Final File          | `docs/test-cases/fr-05/`    |
| Approval Status     | `APPROVED`                  |

**Changes Made**

- Split catalog completeness/count from grid-layout verification.
- Added `FR05-TC-017` for the independent grid-layout objective.
- Reclassified `FR05-TC-006` from `EDGE` to `POSITIVE`.
- Recalculated test-case and automation-feasibility statistics.
- Final corrected design contains 18 test conditions, 17 test cases, and 13 automation candidates.

**Correction Notes**

The original AI output required human-directed corrections, therefore the original verdict remains `INCOMPLETE`. The corrected artifact was reviewed again and approved for downstream automation planning.

**Human Decision Evidence**

`APPROVE TEST CASE DESIGN`

### Artifact A-002 — FR-05 Playwright automation plan

#### (1) Prompt + Tool

| Field            | Value                                            |
| ---------------- | ------------------------------------------------ |
| Tool             | Codex                                            |
| Model            | gpt-5.6-sol                                      |
| Date and Time    | 2026-08-09T17:20:32.949Z                         |
| Workflow Stage   | Automation planning; before human approval       |
| Feature / Task   | FR-05 — Product listing and search               |
| Related Artifact | `docs/automation-plans/fr-05-automation-plan.md` |

**Verbatim Prompt**

[interactions/A-002-prompt.md](interactions/A-002-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-002-output.md](interactions/A-002-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. **Approved Test Cases Received:** **17**

2. **Automation Minimum Pre-check Result:** `PASS`

3. **Automation Candidate Count:** **13**, đạt minimum **12**

21. **Current Checkpoint:** `CHECKPOINT: AUTOMATION_PLAN_REVIEW_REQUIRED`
```

#### (3) Verdict

| Field         | Value                                                              |
| ------------- | ------------------------------------------------------------------ |
| Review Status | `FINALIZED`                                                        |
| Verdict       | `INCOMPLETE`                                                       |
| Verdict Scope | FR-05 Playwright automation plan before human-directed corrections |

#### (4) Reasoning

**Review Notes**

The original AI-generated automation plan required human-directed corrections, therefore the original verdict remains `INCOMPLETE`.

After correction and human review, the final plan contains:

- 17 approved test cases
- 13 automation candidates
- 2 `READY_FOR_AUTOMATION`
- 11 `READY_WITH_SETUP`
- 4 `BLOCKED_BY_IMPLEMENTATION`
- Automation Minimum Pre-check: `PASS`

#### (5) Student Fix

| Field               | Value                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------- |
| Student Decision    | `MODIFIED`                                                                            |
| Change Illustration | Original plan required human correction for TC-006 grouping and TC-008 result oracle. |
| Correction Notes    | See **Changes Made** below.                                                           |
| Verification Method | `REVIEW`                                                                              |
| Verification Result | `PASSED`                                                                              |
| Final File          | `docs/automation-plans/fr-05-automation-plan.md`                                      |
| Approval Status     | `APPROVED`                                                                            |

**Changes Made**

- Strengthened `FR05-TC-008` so the primary result oracle is product result `COUNT = 0`.
- Kept description-only search behavior independent from empty-state presentation.
- Strengthened `FR05-TC-006` thousand-grouping validation.
- Restricted accepted thousand grouping separators to conventional grouping characters.
- Required separator consistency and rejected raw digits, letters, hyphens, and mixed separators.
- Revalidated all 17 approved test cases.
- Confirmed 13 legitimate automation candidates remain.

**Human Decision Evidence**

`APPROVE AUTOMATION PLAN`

### Artifact A-003 — FR-05 external test-data preparation

#### (1) Prompt + Tool

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Tool             | Codex                                                            |
| Model            | gpt-5.6-sol                                                      |
| Date and Time    | 2026-08-09T17:54:52.588Z                                         |
| Workflow Stage   | Test Data Design / Preparation; before human approval            |
| Feature / Task   | FR-05 — Product listing and search                               |
| Related Artifact | `test-data/fr-05.json`; `docs/test-data/fr-05-test-data-plan.md` |

**Verbatim Prompt**

[interactions/A-003-prompt.md](interactions/A-003-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-003-output.md](interactions/A-003-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. **Test Data File:** [fr-05.json](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/test-data/fr-05.json>)

2. **Test Data Plan File:** [fr-05-test-data-plan.md](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/test-data/fr-05-test-data-plan.md>)

3. **Total Datasets:** 8 logical datasets — 7 data datasets và 1 environment setup dataset.

13. **Current Checkpoint:** `CHECKPOINT: TEST_DATA_REVIEW_REQUIRED`
```

#### (3) Verdict

| Field         | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                           |
| Verdict       | `INCOMPLETE`                                                          |
| Verdict Scope | FR-05 external test-data preparation before human-directed correction |

#### (4) Reasoning

**Review Notes**

The original AI output required one human-directed test-setup correction, therefore its verdict remains `INCOMPLETE`.

The corrected data package contains:

- 9 logical datasets
- 7 data datasets
- 2 setup datasets
- 13/13 automation candidates covered
- 5 verified seed products reused
- 0 new database records
- 4 `BLOCKED_BY_IMPLEMENTATION` cases preserved

#### (5) Student Fix

| Field               | Value                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `MODIFIED`                                                                                                            |
| Change Illustration | Original output contained safe-rendering input strings but not the shared controlled empty-response setup.            |
| Changes Made        | See **Changes Made** below.                                                                                           |
| Correction Notes    | The original AI output required one human-directed test-setup correction, therefore its verdict remains `INCOMPLETE`. |
| Verification Method | `REVIEW`                                                                                                              |
| Verification Result | `PASSED`                                                                                                              |
| Final File          | `test-data/fr-05.json`; `docs/test-data/fr-05-test-data-plan.md`                                                      |
| Approval Status     | `APPROVED`                                                                                                            |

**Changes Made**

- Added `FR05-SETUP-002` as a reusable controlled empty product-search response setup.
- Mapped the setup to `FR05-TC-010`, `FR05-TC-011` and `FR05-TC-012`.
- Externalized `GET /api/products` `responseBody []` instead of leaving the future response fixture inline.
- Preserved host/base URL as runtime configuration.
- Revalidated all 13 automation candidates.
- Preserved all four `BLOCKED_BY_IMPLEMENTATION` cases.

**Human Decision Evidence**

`APPROVE TEST DATA`

### Artifact A-004 — FR-05 Playwright script generation and AI-generated code review

#### (1) Prompt + Tool

| Field            | Value                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                                                      |
| Model            | gpt-5.6-sol                                                                                                                |
| Date and Time    | 2026-08-09T18:24:06.1289590Z                                                                                               |
| Workflow Stage   | Playwright script generation and AI-generated code review; before human automation review                                  |
| Feature / Task   | FR-05 — Product listing and search                                                                                         |
| Related Artifact | `tests/fr-05/`; `playwright.config.js`; `docs/automation-reviews/fr-05-ai-review.md`; `docs/gaps/fr-05-automation-gaps.md` |

**Verbatim Prompt**

[interactions/A-004-prompt.md](interactions/A-004-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-004-output.md](interactions/A-004-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. **Test Scripts Created:** [fr-05.spec.js](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/tests/fr-05/fr-05.spec.js>)

2. **Automation Script Count:** 13 Playwright tests.

18. **Current Checkpoint:** `CHECKPOINT: AUTOMATION_REVIEW_REQUIRED`
```

#### (3) Verdict

| Field         | Value                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                                    |
| Verdict       | `INCOMPLETE`                                                                                   |
| Verdict Scope | FR-05 Playwright script generation and AI-generated code review before human automation review |

#### (4) Reasoning

**Review Notes**

The original FR-05 Playwright script-generation and AI code-review output required human-directed corrections, therefore its verdict remains `INCOMPLETE`.

The corrected automation artifact was statically reviewed and approved. The corrections addressed data traceability, visible HTML reporter identity, accepted locator-risk classification, and execution-readiness boundaries. Runtime Playwright execution remains unverified, and `FR05-REV-006` remains `NEEDS_MORE_EVIDENCE` until multi-browser execution.

#### (5) Student Fix

| Field               | Value                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Student Decision    | `MODIFIED`                                                                                                                                       |
| Change Illustration | Human review corrected TC-002 dataset traceability and strengthened visible HTML report identity while preserving the approved automation scope. |
| Changes Made        | See **Changes Made** below.                                                                                                                      |
| Correction Notes    | The original AI output required human-directed corrections, therefore its verdict remains `INCOMPLETE`.                                          |
| Verification Method | `STATIC_REVIEW`                                                                                                                                  |
| Verification Result | `PASSED`                                                                                                                                         |
| Final File          | `tests/fr-05/`; `playwright.config.js`; `docs/automation-reviews/fr-05-ai-review.md`; `docs/gaps/fr-05-automation-gaps.md`                       |
| Approval Status     | `APPROVED`                                                                                                                                       |

**Changes Made**

- Preserved explicit controlled-route cleanup introduced during generation.
- Corrected `FR05-TC-002` data traceability so it consumes `FR05-DATA-001`.
- Preserved `FR05-DATA-002` exclusively for `FR05-TC-007`.
- Added a runtime-derived visible HTML reporter title containing Feature ID, `Run by: <StudentID>`, ISO timestamp, and Run ID.
- Preserved the existing reporter metadata.
- Classified locator risks as accepted documented risks.
- Deferred Playwright dependency/browser installation to Execution Readiness.
- Preserved multi-browser dialog timing as `NEEDS_MORE_EVIDENCE`.

**Human Decision Evidence**

`APPROVE AUTOMATION REVIEW FIXES`

### Artifact A-005 — FR-05 Execution Readiness

#### (1) Prompt + Tool

| Field            | Value                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                        |
| Model            | GPT-5                                                                                        |
| Date and Time    | 2026-08-10T01:57:18.0306121+07:00                                                            |
| Workflow Stage   | Execution readiness; before multi-browser execution                                          |
| Feature / Task   | FR-05 — Product listing and search                                                           |
| Related Artifact | `docs/execution-readiness/fr-05-execution-readiness.md`; `package.json`; `package-lock.json` |

**Verbatim Prompt**

[interactions/A-005-prompt.md](interactions/A-005-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-005-output.md](interactions/A-005-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. **Execution Readiness Result:** `READY_FOR_EXECUTION`

13. **Test Discovery Result:** `PASS` — `--list` exited `0`, collected one spec and 39 project-test combinations. No tests were executed and no HTML report was generated.

21. **Current Checkpoint:** `CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED`
```

#### (3) Verdict

| Field         | Value                                 |
| ------------- | ------------------------------------- |
| Review Status | `FINALIZED`                           |
| Verdict       | `VALID`                               |
| Verdict Scope | FR-05 Execution Readiness preparation |

#### (4) Reasoning

**Review Notes**

Human review confirmed that the execution-readiness preparation correctly installed and resolved Playwright, verified all three browser binaries, accepted the Student ID and SUT base URL, discovered the approved tests under each browser project, preserved retries and reporter identity, and did not execute runtime tests. Runtime SUT availability and seed-state verification remain execution preconditions.

#### (5) Student Fix

| Field               | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                                   |
| Change Illustration | No human-directed correction was required.                                                   |
| Changes Made        | No human-directed correction was required.                                                   |
| Correction Notes    | Human review accepted the readiness preparation as produced.                                 |
| Verification Method | `REVIEW`                                                                                     |
| Verification Result | `PASSED`                                                                                     |
| Final File          | `docs/execution-readiness/fr-05-execution-readiness.md`; `package.json`; `package-lock.json` |
| Approval Status     | `APPROVED`                                                                                   |

**Verification Notes**

- `@playwright/test` `1.62.1` installed.
- `chromium`, `firefox` and `webkit` installed.
- `STUDENT_ID=23127107` accepted.
- `SUT_BASE_URL=http://localhost:5173` resolved.
- 13 approved FR-05 Test Case IDs discovered.
- 13 tests discovered under each browser project.
- 39 total project-test combinations.
- Four implementation-blocked IDs absent.
- `retries` remains `0`.
- HTML reporter identity strategy retained.
- No runtime test execution occurred during readiness.

Execution remains subject to runtime SUT availability and seed-state verification immediately before the approved browser run.

**Human Decision Evidence**

`APPROVE EXECUTION READINESS`

### Artifact A-006 — FR-05 Chromium execution and initial failure triage

#### (1) Prompt + Tool

| Field            | Value                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                             |
| Model            | GPT-5                                                                                             |
| Date and Time    | 2026-08-09T19:20:49.2608303Z                                                                      |
| Workflow Stage   | Chromium runtime execution before human execution review                                          |
| Feature / Task   | FR-05 — Product listing and search                                                                |
| Related Artifact | `docs/execution-results/fr-05-chromium-execution.md`; Chromium HTML report; `test-results/fr-05/` |

**Verbatim Prompt**

[interactions/A-006-prompt.md](interactions/A-006-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-006-output.md](interactions/A-006-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. **Chromium Execution Status:** `COMPLETED_WITH_FAILURES` — 13 tests completed in 13.5s; Playwright exit code `1` reflects test assertion failures, not an interrupted run.

14. **Report Identity Verification:** `PASS` — the real rendered report title/body contains `FR-05`, `Run by: 23127107`, `2026-08-09T19:14:10.0306495Z`, Run ID, and `Project: chromium`.

21. **Current Checkpoint:** `CHECKPOINT: CHROMIUM_EXECUTION_REVIEW_REQUIRED`
```

#### (3) Verdict

| Field         | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Review Status | `FINALIZED`                                                  |
| Verdict       | `VALID`                                                      |
| Verdict Scope | Original FR-05 Chromium execution and initial failure triage |

#### (4) Reasoning

**Review Notes**

Human review confirmed that the original Chromium execution record accurately preserved all 13 approved test results, the six initial classifications, rendered report identity evidence, Chromium dialog/DOM evidence for TC-012, and the documented backend-startup database side effect. No environment failure occurred. The TC-006 automation correction remains a separate follow-up before later cross-browser execution.

#### (5) Student Fix

| Field               | Value                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                |
| Change Illustration | No correction to the original Chromium execution record was required.     |
| Changes Made        | No correction to the original Chromium execution record was required.     |
| Correction Notes    | Human review accepted the original Chromium execution and initial triage. |
| Verification Method | `REVIEW`                                                                  |
| Verification Result | `PASSED`                                                                  |
| Final File          | `docs/execution-results/fr-05-chromium-execution.md`                      |
| Approval Status     | `APPROVED`                                                                |

**Verification Notes**

- Chromium execution completed all 13 approved automated tests.
- 7 tests passed and 6 tests failed.
- `FR05-TC-004` is `PRODUCT_DEFECT`.
- `FR05-TC-005` is `PRODUCT_DEFECT`.
- `FR05-TC-006` is `AUTOMATION_DEFECT`.
- `FR05-TC-011` is `PRODUCT_DEFECT`.
- `FR05-TC-012` is `PRODUCT_DEFECT`.
- `FR05-TC-014` is `PRODUCT_DEFECT`.
- HTML report identity verification passed.
- `FR05-TC-012` captured real Chromium dialog and executable DOM evidence.
- No environment failure occurred.
- `backend/database.sqlite` modification is a documented normal SUT startup side effect and is not classified as an automation defect.

`APPROVE CHROMIUM EXECUTION TRIAGE`

### Artifact A-007 — FR-05 runtime automation correction for FR05-TC-006 and Chromium verification

#### (1) Prompt + Tool

| Field            | Value                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                                                                                                        |
| Model            | GPT-5                                                                                                                                                                        |
| Date and Time    | 2026-08-09T19:45:07.9247710Z                                                                                                                                                 |
| Workflow Stage   | Runtime automation correction after Chromium failure triage                                                                                                                  |
| Feature / Task   | FR-05 — Product listing and search                                                                                                                                           |
| Related Artifact | `tests/fr-05/helpers/fr-05-helpers.js`; `docs/automation-reviews/fr-05-ai-review.md`; `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md`; Chromium HTML report |

**Verbatim Prompt**

[interactions/A-007-prompt.md](interactions/A-007-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-007-output.md](interactions/A-007-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
11. FR05-TC-006 Result

PASSED — it no longer fails due to the grouping-helper logic.

18. Current Checkpoint

CHECKPOINT: TC006_CORRECTION_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                         |
| ------------- | ----------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                   |
| Verdict       | `VALID`                                                                       |
| Verdict Scope | FR-05 runtime automation correction for FR05-TC-006 and Chromium verification |

#### (4) Reasoning

**Review Notes**

Human review confirmed the TC-006 automation correction without changing the approved Expected Result or introducing a VND-specific special case. Five approved grouping formats passed static verification, five invalid/raw/mixed formats were rejected, runtime seed state matched the approved oracle, Chromium rerun completed all 13 tests with 8 passed and 5 failed, TC-006 changed from FAILED to PASSED, no unrelated regression occurred, the five remaining failures remained the previously confirmed PRODUCT_DEFECT cases, HTML report identity passed, and original Chromium evidence remained preserved. The original prompt and full AI output remain preserved externally.

#### (5) Student Fix

| Field               | Value                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Student Decision    | `ACCEPTED`                                                                                                                                             |
| Change Illustration | No additional human-directed correction was required after the A-007 output.                                                                           |
| Changes Made        | No additional human-directed correction was required after the A-007 output.                                                                           |
| Correction Notes    | Human review confirmed the TC-006 correction and Chromium verification as recorded in the final files.                                                 |
| Verification Method | `STATIC_REVIEW_AND_RUNTIME_RERUN`                                                                                                                      |
| Verification Result | `PASSED`                                                                                                                                               |
| Final File          | `tests/fr-05/helpers/fr-05-helpers.js`; `docs/automation-reviews/fr-05-ai-review.md`; `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md` |
| Approval Status     | `APPROVED`                                                                                                                                             |

**Verification Notes**

- `FR05-TC-006` passed after the helper correction.
- Chromium rerun recorded 8 passed and 5 failed tests.
- The remaining five failures are the previously confirmed PRODUCT_DEFECT cases: `FR05-TC-004`, `FR05-TC-005`, `FR05-TC-011`, `FR05-TC-012`, and `FR05-TC-014`.
- HTML report identity verification passed.
- Firefox and WebKit were not run.

**Human Decision Evidence**

`APPROVE TC006 AUTOMATION CORRECTION`

### Artifact A-008 — FR-05 Firefox/WebKit execution and cross-browser comparison

#### (1) Prompt + Tool

| Field            | Value                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                                                                                                                                                                       |
| Model            | GPT-5                                                                                                                                                                                                                                       |
| Date and Time    | 2026-08-09T20:03:43.0434782Z                                                                                                                                                                                                                |
| Workflow Stage   | Remaining multi-browser execution before final defect reporting                                                                                                                                                                             |
| Feature / Task   | FR-05 — Product listing and search                                                                                                                                                                                                          |
| Related Artifact | `docs/execution-results/fr-05-firefox-execution.md`; `docs/execution-results/fr-05-webkit-execution.md`; `docs/execution-results/fr-05-cross-browser-summary.md`; Firefox/WebKit HTML reports; `docs/automation-reviews/fr-05-ai-review.md` |

**Verbatim Prompt**

[interactions/A-008-prompt.md](interactions/A-008-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-008-output.md](interactions/A-008-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
17. Chromium / Firefox / WebKit Comparison

Each engine completed 13 tests with 8 passed and 5 failed. FR05-TC-006 passed across all three.

24. Current Checkpoint

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| Review Status | `FINALIZED`                                                 |
| Verdict       | `VALID`                                                     |
| Verdict Scope | FR-05 Firefox/WebKit execution and cross-browser comparison |

#### (4) Reasoning

**Review Notes**

Human review accepted the cross-browser execution record. Firefox and WebKit each completed 13 tests with 8 passed and 5 failed; the five failures matched the approved Chromium baseline PRODUCT_DEFECT cases; TC-006 passed across all three engines; no new AUTOMATION_DEFECT or ENVIRONMENT_FAILURE was found; all three HTML reports passed identity verification; and FR05-REV-006 reached RUNTIME_VERIFIED_MULTI_BROWSER. The original prompt and full AI output remain preserved externally.

#### (5) Student Fix

| Field               | Value                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                                                                                                                                                     |
| Change Illustration | No human-directed correction was required.                                                                                                                                                                     |
| Changes Made        | No human-directed correction was required.                                                                                                                                                                     |
| Correction Notes    | Human review confirmed the final cross-browser execution and comparison evidence, including the browser-specific TC-012 dialog count.                                                                          |
| Verification Method | `MULTI_BROWSER_RUNTIME_REVIEW`                                                                                                                                                                                 |
| Verification Result | `PASSED`                                                                                                                                                                                                       |
| Final File          | `docs/execution-results/fr-05-firefox-execution.md`; `docs/execution-results/fr-05-webkit-execution.md`; `docs/execution-results/fr-05-cross-browser-summary.md`; `docs/automation-reviews/fr-05-ai-review.md` |
| Approval Status     | `APPROVED`                                                                                                                                                                                                     |

**Verification Notes**

- Firefox: 13 total, 8 passed, 5 failed.
- WebKit: 13 total, 8 passed, 5 failed.
- `FR05-TC-006` passed on Chromium, Firefox, and WebKit.
- The five remaining failures are the same confirmed `PRODUCT_DEFECT` cases on all engines.
- `FR05-REV-006` is `RUNTIME_VERIFIED_MULTI_BROWSER`.
- HTML report identity verification passed independently for all three engines.

**Human Decision Evidence**

`APPROVE CROSS BROWSER EXECUTION`

### Artifact A-009 — FR-05 final defect reporting and feature closure preparation

#### (1) Prompt + Tool

| Field            | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Tool             | Codex                                                                  |
| Model            | GPT-5                                                                  |
| Date and Time    | 2026-08-09T20:23:46.0596808Z                                           |
| Workflow Stage   | Final FR-05 review before GitHub issue publication / feature closure   |
| Feature / Task   | FR-05 — Product listing and search                                     |
| Related Artifact | `docs/defects/fr-05/`; `docs/execution-results/fr-05-final-summary.md` |

**Verbatim Prompt**

[interactions/A-009-prompt.md](interactions/A-009-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-009-output.md](interactions/A-009-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
1. Confirmed Defects

Exactly five confirmed PRODUCT_DEFECT records were created: FR05-TC-004, FR05-TC-005, FR05-TC-011, FR05-TC-012, and FR05-TC-014. No defect record was created for FR05-TC-006.

17. Current Checkpoint

CHECKPOINT: FR05_FINAL_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                                                                      |
| Verdict       | `INCOMPLETE`                                                                                                                     |
| Verdict Scope | Original FR-05 final defect reporting and feature-closure bundle before human-directed defect-format and language normalization. |

#### (4) Reasoning

**Review Notes**

- Original A-009 xác định đúng năm confirmed `PRODUCT_DEFECT` cases, tạo defect reports, screenshots, GitHub Issue drafts và final FR-05 summary.
- Các defect report ban đầu dùng Test Case ID làm Defect ID, chưa tuân theo HW04 Bug Report Standard về structure, filenames, screenshots, GitHub Issue drafts, hashtags, labels và ngôn ngữ mô tả.
- Điều này làm bundle chưa sẵn sàng để handoff theo standard, nhưng không làm thay đổi execution evidence hoặc product-defect classification đã được xác nhận.
- AI có thể bỏ sót vì output ban đầu tập trung vào việc ghi nhận defect evidence và chưa áp dụng đầy đủ standard hoá Defect ID/bug-report format ở bước final handoff.
- Human-directed correction đã chuẩn hoá bundle mà không rerun browser/test, recapture screenshot hoặc thay đổi SUT.
- Nguồn đánh giá: human review và final bundle tại `docs/defects/fr-05/` cùng `docs/execution-results/fr-05-final-summary.md`.

#### (5) Student Fix

| Field               | Value                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| Student Decision    | `MODIFIED`                                                             |
| Change Illustration | See **Change Illustration** below.                                     |
| Changes Made        | See **Changes Made** below.                                            |
| Correction Notes    | See **Correction Notes** below.                                        |
| Verification Method | `REVIEW`                                                               |
| Verification Result | `PASSED`                                                               |
| Final File          | `docs/defects/fr-05/`; `docs/execution-results/fr-05-final-summary.md` |
| Approval Status     | `APPROVED`                                                             |

**Changes Made**

- Introduced independent Defect IDs: `FR05-BUG-001` through `FR05-BUG-005`, mapped respectively to `FR05-TC-004`, `FR05-TC-005`, `FR05-TC-011`, `FR05-TC-012`, and `FR05-TC-014`.
- Preserved `FR05-TC-006` as corrected `AUTOMATION_DEFECT` history without assigning a `PRODUCT_DEFECT` ID.
- Standardized titles, report/draft structures, filenames, screenshots, hashtags, and Suggested GitHub Labels according to the approved HW04 Bug Report Standard.
- Normalized descriptive Bug Report content to Vietnamese while retaining English standardized headings, technical identifiers, hashtags, labels, statuses, run IDs, and evidence paths.
- Preserved cross-browser traceability, `NOT_PUBLISHED` GitHub status, and all approved execution evidence.

**Change Illustration**

Original style used `FR05-TC-005` as the Defect ID and an English description. The corrected bundle uses `FR05-BUG-002`, identifies `FR05-TC-005` under **Found by Test Case**, uses the standardized title prefix with Vietnamese description, and preserves the same price evidence and requirement semantics.

**Correction Notes**

The original AI-generated A-009 artifact required human-directed documentation corrections. Its original verdict remains `INCOMPLETE`; the corrected final bundle was reviewed and approved.

**Human Decision Evidence**

`APPROVE FR05 FINAL DEFECT BUNDLE AFTER FORMAT AND LANGUAGE NORMALIZATION`

### Artifact A-010 — FR-09 Test Design Bundle

#### (1) Prompt + Tool

| Field            | Value                                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| Tool             | Codex                                                                          |
| Model            | GPT-5                                                                          |
| Date and Time    | 2026-08-09T21:11:31.2308622Z                                                   |
| Workflow Stage   | FR-09 compressed requirement analysis and test-case design before human review |
| Feature / Task   | FR-09 — Discount coupons                                                       |
| Related Artifact | `docs/test-cases/fr-09/`                                                       |

**Verbatim Prompt**

[interactions/A-010-prompt.md](interactions/A-010-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-010-output.md](interactions/A-010-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
6. Total Test Cases

16.

13. Automation Candidate Count

16.

22. Current Checkpoint

CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                                       |
| Verdict       | `INCOMPLETE`                                                                                      |
| Verdict Scope | Original FR-09 Test Design Bundle before human-directed correction of usage-limit test isolation. |

#### (4) Reasoning

**Review Notes**

The original AI output correctly extracted the FR-09 five-condition model, created 16 atomic conditions and 16 frontend-oriented test cases, preserved the authoritative Expected Results, and kept implementation discrepancies separate from requirements.

Human review identified one failure-attribution ambiguity: FR09-TC-014 and FR09-TC-015 used total 300000 while the implementation uses `total > min_order_amount` instead of the authoritative `total >= min_order_amount`. At the exact minimum, C3 could reject before the usage-limit condition C5 was meaningfully isolated. The original output also listed setup/reset protocol as an open gap; human review approved constrained isolated DB/transaction and controlled frontend-cart setup strategies for the relevant cases. The original verdict therefore remains `INCOMPLETE` because the pre-correction output required these changes.

#### (5) Student Fix

| Field               | Value                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `MODIFIED`                                                                                                       |
| Changes Made        | See **Changes Made** below.                                                                                      |
| Change Illustration | Usage-limit cases changed from exact-minimum total 300000 to existing verified seed total 4000000 to isolate C5. |
| Correction Notes    | The original AI output required human-directed correction; its Verdict remains `INCOMPLETE`.                     |
| Verification Method | `STATIC_DESIGN_REVIEW`                                                                                           |
| Verification Result | `PASSED`                                                                                                         |
| Final File          | `docs/test-cases/fr-09/`                                                                                         |
| Approval Status     | `APPROVED`                                                                                                       |

**Changes Made**

- Updated FR09-TC-014 to use `SAVE10`, usage `1/1`, existing Keychron seed total `4000000`, with C5 false and unchanged payable total `4000000` on rejection.
- Updated FR09-TC-015 to use `VIP100`, usage `1/2`, existing Keychron seed total `4000000`, with `discount_amount = 100000` and `final_amount = 3900000`.
- Recorded the `APPROVED_WITH_CONSTRAINTS` isolated test DB/transaction fixture strategy for FR09-TC-010, FR09-TC-014 and FR09-TC-015.
- Recorded the `APPROVED_WITH_CONSTRAINTS` controlled frontend cart fixture strategy for approved requirement-supported boundary totals, while preferring existing seed data for normal scenarios.
- Preserved all seven unresolved requirement gaps: exact UI copy, expiry timezone, fractional rounding, usage increment timing, coupon normalization, stacking/removal/replacement and network recovery.
- Revalidated 16 test conditions, 16 test cases, 6 `POSITIVE`, 5 `NEGATIVE`, 5 `EDGE`, 16 automation candidates, 12 `FULLY_COVERED` atomic requirements and 3 stateful cases.
- Confirmed no new product/database record, test-order dependency, SUT execution or browser execution was introduced.

**Human Decision Evidence**

`APPROVE FR09 TEST DESIGN BUNDLE AFTER C5 ISOLATION CORRECTION`

### Artifact A-011 — FR-09 Automation Build Bundle

#### (1) Prompt + Tool

| Field            | Value                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tool             | Codex                                                                                                                                                                                |
| Model            | GPT-5                                                                                                                                                                                |
| Date and Time    | 2026-08-10T04:55:39.0839947+07:00                                                                                                                                                    |
| Workflow Stage   | FR-09 compressed automation implementation before execution readiness                                                                                                                |
| Feature / Task   | FR-09 — Discount coupons                                                                                                                                                             |
| Related Artifact | `tests/fr-09/`<br>`test-data/fr-09.json`<br>`docs/automation-plans/fr-09-automation-plan.md`<br>`docs/automation-reviews/fr-09-ai-review.md`<br>`docs/gaps/fr-09-automation-gaps.md` |

**Verbatim Prompt**

[interactions/A-011-prompt.md](interactions/A-011-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-011-output.md](interactions/A-011-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
Approved Test Case Count: 16
Implemented Playwright Test Count: 16
Browser Execution Performed: NO
Current Checkpoint: CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                                                                   |
| Verdict       | `INCOMPLETE`                                                                                                                  |
| Verdict Scope | Original FR-09 Automation Build Bundle before human-directed traceability, negative-oracle and runtime-stability corrections. |

#### (4) Reasoning

**Review Notes**

The original build correctly retained 16 approved IDs, external datasets, isolated-DB safeguards and failure-evidence configuration. Human review found three material limitations: TC-014/TC-015 could let the known C3 `>` discrepancy mask C5 usage boundaries; generic rejection depended on an unspecified error-region presentation; and TC-013 evaluated access immediately after navigation. These issues matter because they can create ambiguous failure attribution or false automation failures. The human-review instructions supplied for this artifact define the corrected requirement-preserving boundaries and static verification evidence.

#### (5) Student Fix

| Field               | Value                                                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `MODIFIED`                                                                                                                                                                                                                                                                                                      |
| Changes Made        | TC-014/TC-015 retain total `4000000` as a C3-positive control while preserving C5 max/max−1 boundaries; generic rejection now asserts only coupon amounts absent and payable unchanged; TC-013 now waits for the EShop shell and `main` before mechanism-neutral access evaluation.                             |
| Change Illustration | Before: C5 could be masked by the known C3 implementation discrepancy, negative outcomes depended on error CSS, and direct-route visibility was evaluated immediately. After: C5 isolation uses seed total `4000000`, error presentation is optional evidence, and TC-013 uses a deterministic render boundary. |
| Correction Notes    | The original A-011 output was materially useful but required human-directed changes before execution readiness. The original Verdict remains `INCOMPLETE`; the corrected automation build is approved.                                                                                                          |
| Verification Method | `STATIC_REVIEW`                                                                                                                                                                                                                                                                                                 |
| Verification Result | `PASSED`                                                                                                                                                                                                                                                                                                        |
| Final File          | `tests/fr-09/`<br>`test-data/fr-09.json`<br>`docs/automation-plans/fr-09-automation-plan.md`<br>`docs/automation-reviews/fr-09-ai-review.md`<br>`docs/gaps/fr-09-automation-gaps.md`<br>`docs/test-cases/fr-09/`                                                                                                |
| Approval Status     | `APPROVED`                                                                                                                                                                                                                                                                                                      |

**Human Decision Evidence**

`APPROVE FR09 AUTOMATION BUILD AFTER HUMAN CORRECTIONS`

### Artifact A-012 — FR-09 Execution Readiness

#### (1) Prompt + Tool

| Field            | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| Tool             | Codex                                                               |
| Model            | GPT-5                                                               |
| Date and Time    | 2026-08-10T05:21:00.6489333+07:00                                   |
| Workflow Stage   | FR-09 runtime/isolation verification before multi-browser execution |
| Feature / Task   | FR-09 — Discount coupons — Execution Readiness                      |
| Related Artifact | `docs/execution-readiness/fr-09-execution-readiness.md`             |

**Verbatim Prompt**

[interactions/A-012-prompt.md](interactions/A-012-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-012-output.md](interactions/A-012-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
Status: READY_FOR_EXECUTION
Playwright collection: 48 definitions
Browser execution performed: NO
Current Checkpoint: CHECKPOINT: FR09_EXECUTION_READINESS_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                                                                                                                                       |
| Verdict       | `VALID`                                                                                                                                                                           |
| Verdict Scope | FR-09 Execution Readiness including isolated backend/database preparation, authentication readiness, seed verification, Playwright collection and failure-evidence configuration. |

#### (4) Reasoning

**Review Notes**

Human review confirmed the isolated backend/database procedure, workspace-DB protection, runtime-only authentication readiness, coupon/product seed oracles, stateful-fixture safety and 48 project-test collection. Evidence configuration preserves `only-on-failure` screenshots, `retain-on-failure` traces, video off, zero retries and one FR-09 worker. TC-012 and TC-013 remain `NEEDS_MORE_EVIDENCE`; no browser execution or `PRODUCT_DEFECT` classification is claimed. The review instructions supplied for A-012 are the evaluation source.

#### (5) Student Fix

| Field               | Value                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                                                                                                    |
| Changes Made        | No human-directed correction was required.                                                                                                                    |
| Change Illustration | `N/A` — execution-readiness artifact was accepted as generated.                                                                                               |
| Correction Notes    | The readiness output is valid for its scope only. Browser execution, failure classification and runtime evaluation of TC-012/TC-013 remain subsequent phases. |
| Verification Method | `STATIC_AND_RUNTIME_READINESS_REVIEW`                                                                                                                         |
| Verification Result | `PASSED`                                                                                                                                                      |
| Final File          | `docs/execution-readiness/fr-09-execution-readiness.md`                                                                                                       |
| Approval Status     | `APPROVED`                                                                                                                                                    |

**Human Decision Evidence**

`APPROVE FR09 EXECUTION READINESS`

### Artifact A-013 — FR-09 Multi-Browser Execution and Failure Triage

#### (1) Prompt + Tool

| Field            | Value                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                                                                                                                                                                                               |
| Model            | GPT-5                                                                                                                                                                                                                                                               |
| Date and Time    | 2026-08-10T05:44:21.2752065+07:00                                                                                                                                                                                                                                   |
| Workflow Stage   | FR-09 adaptive Chromium/Firefox/WebKit execution before final defect review                                                                                                                                                                                         |
| Feature / Task   | FR-09 — Multi-Browser Execution and Failure Triage                                                                                                                                                                                                                  |
| Related Artifact | `docs/execution-results/fr-09-chromium-execution.md`; `docs/execution-results/fr-09-firefox-execution.md`; `docs/execution-results/fr-09-webkit-execution.md`; `docs/execution-results/fr-09-cross-browser-summary.md`; `docs/defects/fr-09/candidate-screenshots/` |

**Verbatim Prompt**

[interactions/A-013-prompt.md](interactions/A-013-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-013-output.md](interactions/A-013-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
Execution Status: COMPLETED_WITH_PRODUCT_DEFECT_CANDIDATES
Chromium: 16 total, 10 passed, 6 failed
Firefox: 16 total, 10 passed, 6 failed
WebKit: 16 total, 10 passed, 6 failed
Current Checkpoint: CHECKPOINT: FR09_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Review Status | `FINALIZED`                                                                                                                                                        |
| Verdict       | `VALID`                                                                                                                                                            |
| Verdict Scope | FR-09 Chromium, Firefox and WebKit execution, runtime failure triage, failure-evidence preservation, database-isolation verification and cross-browser comparison. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận Chromium, Firefox và WebKit đều hoàn tất `16 / 10 / 6 / 0` (Total / Passed / Failed / Skipped). Sáu Test Case IDs `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013` và `FR09-TC-016` tái hiện trên cả ba engines, được chấp nhận là `PRODUCT_DEFECT_CANDIDATE` với confidence `HIGH`. Không còn `AUTOMATION_DEFECT`, `ENVIRONMENT_FAILURE` hoặc `NEEDS_MORE_EVIDENCE`.

Runtime review đã giải quyết trạng thái `NEEDS_MORE_EVIDENCE` trước đây của `FR09-TC-012` và `FR09-TC-013`: context chưa xác thực không inject JWT nhưng vẫn tạo cart, tới Checkout và dùng coupon được; shell/`main` render gate ổn định trong khi coupon controls vẫn usable. Review cũng xác nhận 18 original failure screenshots, 18 traces, sáu Chromium candidate screenshots copy byte-for-byte không recapture, rendered HTML identity cho ba browser, cleanup `coupon_usage = 0`, isolated backend khỏe và workspace DB SHA-256 không đổi. Human review instructions là evaluation source cho verdict này. Chưa gán final `FR09-BUG-xxx`.

#### (5) Student Fix

| Field               | Value                                                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                                                                                                                                                                                                          |
| Changes Made        | Không có human-directed correction cho A-013 execution result hoặc failure classifications ban đầu.                                                                                                                                                                 |
| Change Illustration | `N/A` — original multi-browser execution record được chấp nhận as-is.                                                                                                                                                                                               |
| Correction Notes    | Sáu failure vẫn là execution-level `PRODUCT_DEFECT_CANDIDATE`; verdict này không tạo final Bug ID.                                                                                                                                                                  |
| Verification Method | `MULTI_BROWSER_RUNTIME_REVIEW`                                                                                                                                                                                                                                      |
| Verification Result | `PASSED`                                                                                                                                                                                                                                                            |
| Final File          | `docs/execution-results/fr-09-chromium-execution.md`; `docs/execution-results/fr-09-firefox-execution.md`; `docs/execution-results/fr-09-webkit-execution.md`; `docs/execution-results/fr-09-cross-browser-summary.md`; `docs/defects/fr-09/candidate-screenshots/` |
| Approval Status     | `APPROVED`                                                                                                                                                                                                                                                          |

**Human Decision Evidence**

`APPROVE FR09 CROSS BROWSER EXECUTION`

### Artifact A-014 — FR-09 Final Defect Reporting and Feature Completion Bundle

#### (1) Prompt + Tool

| Field            | Value                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                    |
| Model            | GPT-5                                                                                    |
| Date and Time    | 2026-08-10T06:14:56.1126884+07:00                                                        |
| Workflow Stage   | FR-09 confirmed defect documentation before GitHub Issue publication and feature closure |
| Feature / Task   | FR-09 — Final Defect Reporting and Feature Completion Bundle                             |
| Related Artifact | `docs/defects/fr-09/`; `docs/execution-results/fr-09-final-summary.md`                   |

**Verbatim Prompt**

[interactions/A-014-prompt.md](interactions/A-014-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-014-output.md](interactions/A-014-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
Confirmed Failed Test Cases: 6
Confirmed Underlying Defect Count: 5
Browser Execution Performed: NO
GitHub Publication Status: NOT_PUBLISHED
Current Checkpoint: CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED
```

#### (3) Verdict

| Field         | Value                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Review Status | `FINALIZED`                                                                                                                                      |
| Verdict       | `VALID`                                                                                                                                          |
| Verdict Scope | FR-09 final defect reporting, defect deduplication, screenshot promotion, GitHub Issue draft preparation and final feature traceability summary. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận 16 approved Test Cases và 16 implemented Playwright tests, không có approved test bị blocked. Chromium, Firefox và WebKit đều hoàn tất 16 tests với 10 passed, 6 failed, 0 skipped; cùng sáu Test Case IDs `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013`, `FR09-TC-016` fail trên cả ba engines.

Human review chấp nhận deduplication thành năm product defects: `FR09-BUG-001` từ TC-002/TC-003, `FR09-BUG-002` từ TC-006, `FR09-BUG-003` từ TC-012, `FR09-BUG-004` từ TC-013 và `FR09-BUG-005` từ TC-016. Năm standardized Bug Reports, năm unpublished GitHub Issue drafts và năm promoted screenshots được xác nhận. Screenshots promoted là byte-identical copies của Chromium failure evidence; sáu candidates, 18 original failure screenshots, 18 traces đều còn nguyên và không có ảnh nào được recapture.

TC-012 và TC-013 là `RUNTIME_VERIFIED_MULTI_BROWSER`; không còn `AUTOMATION_DEFECT`, `NEEDS_MORE_EVIDENCE` hoặc `ENVIRONMENT_FAILURE`. `PASS_WITH_OPEN_REQUIREMENT_GAPS` vẫn đúng vì bảy documented requirement gaps là documentation boundaries, không invalidates approved FR-09 automation scope. Human review instructions supplied cho A-014 là evaluation source.

#### (5) Student Fix

| Field               | Value                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                                                                                       |
| Changes Made        | Không có human-directed correction nào được yêu cầu.                                                                             |
| Change Illustration | `N/A` — original final defect reporting and feature completion bundle được accepted as-is.                                       |
| Correction Notes    | Human review chấp nhận defect mapping, evidence-promotion policy, unpublished GitHub Issue drafts và final traceability summary. |
| Verification Method | `FINAL_ARTIFACT_REVIEW`                                                                                                          |
| Verification Result | `PASSED`                                                                                                                         |
| Final File          | `docs/defects/fr-09/`; `docs/execution-results/fr-09-final-summary.md`                                                           |
| Approval Status     | `APPROVED`                                                                                                                       |

**Verification Notes**

- 16 approved Test Cases, 16 scripts, 0 blocked cases.
- Chromium, Firefox và WebKit đều `16 total / 10 passed / 6 failed`.
- Có năm Bug Reports, năm GitHub Issue drafts `NOT_PUBLISHED`, năm promoted screenshots, sáu candidate screenshots, 18 original screenshots và 18 traces.
- Không có browser execution trong finalization; tests, approved test data, Playwright config, SUT source và database không bị finalization sửa.
- Workspace DB protection và final traceability result được human review xác nhận.

**Human Decision Evidence**

`APPROVE FR09 FINAL DEFECT BUNDLE`

### Artifact A-015 — FR-17 Test Design Bundle and Initial Demo Candidate Analysis

#### (1) Prompt + Tool

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| Tool             | Codex                                                        |
| Model            | GPT-5                                                        |
| Date and Time    | 2026-08-10T06:47:14.3334053+07:00                            |
| Workflow Stage   | FR-17 compressed requirement/test design before human review |
| Feature / Task   | FR-17 — Coupon management                                    |
| Related Artifact | `docs/test-cases/fr-17/`; `docs/demo/fr-17-demo-plan.md`     |

**Verbatim Prompt**

[interactions/A-015-prompt.md](interactions/A-015-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-015-output.md](interactions/A-015-output.md) |

**Verbatim AI Output or Labelled Excerpt**

```text
8. **Total Test Cases:** 16 unique IDs (`FR17-TC-001`–`FR17-TC-016`).
14. **Automation Candidate Count:** 16.
18. **Requirement Coverage Result:** `PASS_WITH_OPEN_REQUIREMENT_GAPS`; 16 `FULLY_COVERED`, 0 `PARTIALLY_COVERED`, 0 `NOT_COVERED`, 0 `NEEDS_CLARIFICATION`.
24. **Current Checkpoint:** `CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`.
```

#### (3) Verdict

| Field         | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                   |
| Verdict       | `INCOMPLETE`                                                  |
| Verdict Scope | FR-17 Test Design Bundle and Initial Demo Candidate Analysis. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận original design có một functional-partition coverage weakness: `FR17-TC-003` chỉ chứng minh type selector expose/select `percent` và `fixed`, trong khi only `fixed` was submitted through Coupon Management CREATE. Vì vậy SUT có thể allow selecting `percent` nhưng reject its CREATE flow mà suite không phát hiện.

Human-directed correction đổi TC-003 thành isolated valid `percent` CREATE Web Admin UI case, dùng external test-owned data, primary assertions trên created list row/type/value, rồi cleanup ngoài primary objective. TC-004 giữ valid `fixed` CREATE với approved lower valid numeric controls. Requirement traceability FR17-R02/FR17-R06, state isolation và demo mapping được update; không invent third type, percent maximum hoặc `UPDATE` behavior. Human review supplied là evaluation source; no SUT/browser/Playwright execution hoặc database mutation was performed.

#### (5) Student Fix

| Field               | Value                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Student Decision    | `MODIFIED`                                                                                                                                                                                             |
| Changes Made        | TC-003 became isolated valid `percent` CREATE; TC-004 preserved valid `fixed` CREATE; FR17-R02/FR17-R06 traceability, state inventory and demo mapping were updated without increasing the test count. |
| Change Illustration | Original TC-003 inspected/selects the type control only; corrected TC-003 submits a valid owned percent coupon and verifies its observable list state.                                                 |
| Correction Notes    | Both authoritative valid type partitions are now exercised through actual CREATE behavior. No arbitrary third type, percent upper boundary or `UPDATE` behavior was introduced.                        |
| Verification Method | `STATIC_REVIEW`                                                                                                                                                                                        |
| Verification Result | `PASSED`                                                                                                                                                                                               |
| Final File          | `docs/test-cases/fr-17/`; `docs/demo/fr-17-demo-plan.md`                                                                                                                                               |
| Approval Status     | `APPROVED`                                                                                                                                                                                             |

**Verification Notes**

- 16 unique Test Conditions; 16 unique Test Cases.
- `POSITIVE`: 5; `NEGATIVE`: 8; `EDGE`: 3.
- Automation Candidate Count: 16 (`AUTOMATION_SUITABLE`: 1; `AUTOMATION_POSSIBLE_WITH_SETUP`: 15).
- Stateful Test Count: 12; Read-Only Test Count: 4.
- `FR17-TC-003` now verifies valid `percent` CREATE through Web Admin UI with owned external data and observable Coupon Management list state.
- `FR17-TC-004` remains valid `fixed` CREATE using `discount_value = 1`, `min_order_amount = 0`, `max_uses_per_user = 1`.
- `FR17-R02` and `FR17-R06` are `FULLY_COVERED`; `UPDATE` remains `NOT_IN_DETAILED_REQUIREMENT_SCOPE`; coverage result is `PASS_WITH_OPEN_REQUIREMENT_GAPS`.
- Demo candidates: TC-004 `PRIMARY_DEMO_CANDIDATE`; TC-003 and TC-014 `SECONDARY_DEMO_CANDIDATE`. Final selection remains `PENDING` until runtime execution evidence exists.
- No SUT, browser or Playwright execution and no database mutation occurred.

**Human Decision Evidence**

`APPROVE FR17 TEST DESIGN AFTER TC003 PERCENT CREATE CORRECTION`

-

### Artifact A-016 — FR-17 Automation Build Bundle and Demo Automation Preparation

#### (1) Prompt + Tool

| Field         | Value        |
| ------------- | ------------ |
| Tool          | Codex        |
| Model         | GPT-5        |
| Date and Time | Exit code: 0 |

Wall time: 0.2 seconds
Output:
2026-08-10T07:45:10.7122705+07:00 |
| Workflow Stage | FR-17 Playwright automation generation before execution readiness and human review |
| Feature / Task | FR-17 — Coupon management |
| Related Artifact | `test-data/fr-17.json`; `tests/fr-17/`; `docs/automation-plans/fr-17-automation-plan.md`; `docs/automation-reviews/fr-17-ai-review.md`; `docs/gaps/fr-17-automation-gaps.md`; `docs/demo/fr-17-demo-plan.md` |

**Verbatim Prompt**

[interactions/A-016-prompt.md](interactions/A-016-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-016-output.md](interactions/A-016-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Build Status: `BUILT_PENDING_HUMAN_REVIEW`; Implemented Playwright Tests: `16`; Current Checkpoint: `CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED`.

#### (3) Verdict

| Field         | Value                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| Review Status | `FINALIZED`                                                               |
| Verdict       | `INCOMPLETE`                                                              |
| Verdict Scope | FR-17 Playwright Automation Build Bundle and Demo Automation Preparation. |

#### (4) Reasoning

**Review Notes**

Human review found three AI-generated automation issues in the original FR-17 bundle. First, `getCouponRow()` composed `filter({ has })` through the ancestor coupon table rather than relative to each candidate row. This could miss valid rows and false-fail list/create/delete assertions, including `FR17-TC-004 @demo`. Second, `FR17-TC-005` used an absent-controlled-code rejection path incompatible with the approved duplicate `SAVE10` oracle. Third, TC-002 accepted any associated text containing `*` without proving that the indicator was visible.

Human-directed corrections use a row-relative exact-code filter; a duplicate-specific oracle that keeps `SAVE10` at exactly one and preserves the total count; and a visible associated label/visible `aria-labelledby` indicator assertion that excludes plain `aria-label` and hidden text. The isolated baseline guard now requires exactly the four approved seed records, and the demo command is PowerShell-compatible. Human review supplied the evaluation source. No browser/SUT runtime execution or database mutation occurred.

#### (5) Student Fix

| Field               | Value                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Student Decision    | `MODIFIED`                                                                                                                                                                           |
| Changes Made        | Corrected the relative row locator, TC-005 duplicate-code oracle, TC-002 visible-indicator assertion, exact four-record baseline guard, and Windows demo draft command.              |
| Change Illustration | Original `getCouponRow()` scoped the inner `has` locator through the coupon table; corrected implementation evaluates exact code text relative to each coupon row.                   |
| Correction Notes    | `FR17-TC-003` remains valid percent CREATE; `FR17-TC-004` remains valid fixed CREATE, `PRIMARY_DEMO_CANDIDATE`, and the sole `@demo` test.                                           |
| Verification Method | `STATIC_REVIEW`                                                                                                                                                                      |
| Verification Result | `PASSED`                                                                                                                                                                             |
| Final File          | `tests/fr-17/`; `docs/automation-plans/fr-17-automation-plan.md`; `docs/automation-reviews/fr-17-ai-review.md`; `docs/gaps/fr-17-automation-gaps.md`; `docs/demo/fr-17-demo-plan.md` |
| Approval Status     | `APPROVED`                                                                                                                                                                           |

**Verification Notes**

- Approved Test Cases: 16; implemented Playwright tests: 16; no missing or duplicate Test Case ID.
- External data remains in `test-data/fr-17.json`; stateful automation count is 12 and read-only automation count is 4.
- TC-005 now asserts total coupon count remains at baseline and `SAVE10` remains exactly once. TC-002 requires an actual visible required-field indicator.
- Workspace DB guard and deterministic, test-owned stateful cleanup remain enabled.
- Screenshot: `only-on-failure`; trace: `retain-on-failure`; video: `off`; retries: `0`; future FR-17 workers: `1`.
- Primary `DEMO_FIX_CANDIDATE`: FR-17 getCouponRow relative-locator correction; Type: `TEST_SCRIPT_CORRECTION`; Runtime Verification: `PENDING`.
- No browser execution, SUT runtime execution, or database mutation occurred.

**Human Decision Evidence**

`APPROVE FR17 AUTOMATION BUILD AFTER HUMAN-DIRECTED SCRIPT CORRECTIONS`

-

### Artifact A-017 — FR-17 Execution Readiness and Demo Runtime Preparation

#### (1) Prompt + Tool

| Field            | Value                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Tool             | Codex                                                                                                                           |
| Model            | GPT-5                                                                                                                           |
| Date and Time    | 2026-08-10T08:30:35.2002362+07:00                                                                                               |
| Workflow Stage   | FR-17 isolated runtime and Playwright collection verification before multi-browser execution                                    |
| Feature / Task   | FR-17 — Coupon management                                                                                                       |
| Related Artifact | `docs/execution-readiness/fr-17-execution-readiness.md`; `tests/fr-17/`; `test-data/fr-17.json`; `docs/demo/fr-17-demo-plan.md` |

**Verbatim Prompt**

[interactions/A-017-prompt.md](interactions/A-017-prompt.md)

#### (2) AI Output

| Field                       | Value                                                        |
| --------------------------- | ------------------------------------------------------------ |
| Output Storage              | `EXTERNAL_FILE`                                              |
| Full Output / Evidence Path | [interactions/A-017-output.md](interactions/A-017-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Readiness Status: `READY_FOR_EXECUTION`; Total Project-Test Definitions: `48`; Current Checkpoint: `CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED`.

#### (3) Verdict

| Field         | Value                                            |
| ------------- | ------------------------------------------------ |
| Review Status | `FINALIZED`                                      |
| Verdict       | `VALID`                                          |
| Verdict Scope | FR-17 Execution Readiness and Demo Runtime Preparation. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận readiness `READY_FOR_EXECUTION`: Web Admin tại `http://localhost:5174` và isolated backend tại `http://localhost:3000` đều healthy. Backend sử dụng isolated directory/database của run `fr17-readiness-20260810T082458317+0700`; workspace `backend/database.sqlite` bị cấm cho fixtures và SHA-256 vẫn là `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.

Baseline isolated chính xác gồm bốn coupons `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; required schema, admin/non-admin authentication và không lưu credentials/password/JWT đều đã được review. Playwright collection xác nhận `16` tests mỗi browser (`48` project-test definitions), không missing/duplicate IDs. `FR17-TC-004` là `@demo` duy nhất với `3` project-test definitions; demo command collection pass. `FR-17 getCouponRow relative-locator correction` được static-wired, còn runtime verification `PENDING` đúng phạm vi readiness.

Human review cũng xác nhận `workers = 1`, `retries = 0`, screenshot `only-on-failure`, trace `retain-on-failure`, video `off` và HTML report identity readiness pass. Không có FR-17 browser/business-test execution hay database business mutation. Human review instructions là evaluation source cho verdict này.

#### (5) Student Fix

| Field               | Value                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| Student Decision    | `ACCEPTED`                                                            |
| Changes Made        | Không có human-directed correction được yêu cầu.                      |
| Change Illustration | `N/A` — original readiness record được chấp nhận as-is.              |
| Correction Notes    | `DEMO_FIX` runtime verification vẫn `PENDING` cho tới execution.     |
| Verification Method | `STATIC_AND_RUNTIME_READINESS_REVIEW`                                 |
| Verification Result | `PASSED`                                                              |
| Final File          | `docs/execution-readiness/fr-17-execution-readiness.md`              |
| Approval Status     | `APPROVED`                                                            |

**Human Decision Evidence**

`APPROVE FR17 EXECUTION READINESS`

### Artifact A-018 — FR-17 Cross-Browser Execution, Failure Triage and Demo Fix Runtime Verification

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool | Codex |
| Model | GPT-5 |
| Date and Time | 2026-08-10T08:51:36.9311488+07:00 |
| Workflow Stage | FR-17 approved automation execution on Chromium, Firefox and WebKit before final defect documentation |
| Feature / Task | FR-17 — Coupon management |
| Related Artifact | `docs/execution-results/fr-17-chromium-execution.md`; `docs/execution-results/fr-17-cross-browser-summary.md`; `docs/defects/fr-17/candidate-screenshots/`; `docs/demo/fr-17-demo-plan.md` |

**Verbatim Prompt**

[interactions/A-018-prompt.md](interactions/A-018-prompt.md)

#### (2) AI Output

| Field | Value |
| --- | --- |
| Output Storage | `EXTERNAL_FILE` |
| Full Output / Evidence Path | [interactions/A-018-output.md](interactions/A-018-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Execution Status: `STOPPED_AT_CHROMIUM_AUTOMATION_DEFECT_GATE`; Chromium: `16 / 13 / 3 / 0`; Automation Defect: `FR17-TC-003`; Current Checkpoint: `CHECKPOINT: FR17_CHROMIUM_AUTOMATION_REVIEW_REQUIRED`.

#### (3) Verdict

| Field | Value |
| --- | --- |
| Review Status | `FINALIZED` |
| Verdict | `VALID` |
| Verdict Scope | FR-17 Chromium execution, runtime failure triage, evidence preservation, database-safety verification and adaptive execution gate decision. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận Chromium hoàn tất `16 / 13 / 3 / 0`; accepted failure classifications là `FR17-TC-002` và `FR17-TC-016` `PRODUCT_DEFECT_CANDIDATE`, cùng `FR17-TC-003` `AUTOMATION_DEFECT`. TC-002 đã reach Coupon Management rồi mới thiếu visible required-field indicator. TC-003 tạo thành công valid percent coupon, nhưng AI-generated assertion bổ sung locale-dependent cho min-order nằm ngoài primary approved verification scope nên tạo false failure. TC-016 đã runtime-verify valid non-admin identity và authorization boundary fail không có automation/environment setup failure.

Chromium automation-defect gate vì vậy chặn Firefox/WebKit đúng quy định. Human review cũng xác nhận không có automatic correction/rerun, hai candidate screenshots, ba original screenshots, ba traces, `PASS_RENDERED` HTML report, isolated DB cleanup/baseline và workspace DB protection. TC-004 `@demo` PASS trên Chromium và corrected `getCouponRow` path được exercised; `DEMO_FIX` chỉ `PARTIALLY_VERIFIED` vì cross-browser execution bị chặn. Human review instructions là evaluation source cho verdict này.

#### (5) Student Fix

| Field | Value |
| --- | --- |
| Student Decision | `ACCEPTED` |
| Changes Made | Không có correction cho original A-018 execution result hoặc failure classification. |
| Change Illustration | `N/A` — original Chromium result, triage và adaptive gate decision được chấp nhận as-is. |
| Correction Notes | Multi-browser verification vẫn pending vì Firefox/WebKit bị chặn đúng bởi `AUTOMATION_DEFECT` gate. |
| Verification Method | `RUNTIME_EXECUTION_REVIEW` |
| Verification Result | `PASSED` |
| Final File | `docs/execution-results/fr-17-chromium-execution.md`; `docs/execution-results/fr-17-cross-browser-summary.md`; `docs/defects/fr-17/candidate-screenshots/`; `docs/demo/fr-17-demo-plan.md` |
| Approval Status | `APPROVED` |

**Verification Notes**

- Candidate product screenshots preserved: `2`; original Chromium failure screenshots: `3`; trace evidence: `3`.
- Chromium HTML report: `PASS_RENDERED`; isolated DB cleanup: `PASS`; final baseline: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`.
- Workspace DB SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` (`PASS`).
- `FR17-TC-004 @demo` PASSes on Chromium and `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM` is `YES`; `DEMO_FIX Runtime Verification` is `PARTIALLY_VERIFIED`.
- The earlier `npx.cmd EINVAL` launcher diagnostic started no browser and is excluded from business execution metrics.

**Human Decision Evidence**

`APPROVE FR17 CHROMIUM EXECUTION AND AUTOMATION DEFECT GATE`

### Artifact A-019 — FR-17 TC-003 Runtime Automation Defect Correction

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool | Codex |
| Model | GPT-5 |
| Date and Time | 2026-08-10T09:07:57.7939103+07:00 |
| Workflow Stage | Human-directed correction after Chromium automation-defect gate and before corrected multi-browser execution |
| Feature / Task | FR-17 — Coupon management |
| Related Artifact | `tests/fr-17/`; `docs/automation-reviews/fr-17-ai-review.md`; `docs/demo/fr-17-demo-plan.md`; `docs/execution-results/fr-17-chromium-execution.md` |

**Verbatim Prompt**

[interactions/A-019-prompt.md](interactions/A-019-prompt.md)

#### (2) AI Output

| Field | Value |
| --- | --- |
| Output Storage | `EXTERNAL_FILE` |
| Full Output / Evidence Path | [interactions/A-019-output.md](interactions/A-019-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Correction Status: `CORRECTED_PENDING_HUMAN_REVIEW`; Affected Test Case: `FR17-TC-003`; Browser Execution: `NO`; Current Checkpoint: `CHECKPOINT: FR17_TC003_AUTOMATION_CORRECTION_REVIEW_REQUIRED`.

#### (3) Verdict

| Field | Value |
| --- | --- |
| Review Status | `FINALIZED` |
| Verdict | `VALID` |
| Verdict Scope | FR-17 TC-003 runtime automation-defect correction after the Chromium automation-defect gate. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận correction giữ nguyên approved TC-003 business objective: row owned tồn tại đúng một lần, visible, đúng `percent` type và submitted `discount_value`. Generic helper cũ đã assert min-order display qua `Number(...).toLocaleString()` sau khi create thành công, dù assertion này không thuộc primary Expected Result; correction loại bỏ false-failure oracle đó.

TC-004 vẫn là `PRIMARY_DEMO_CANDIDATE` và sole `@demo`, giữ các lower-bound checks `discount_value=1`, `min_order_amount=0`, `max_uses_per_user=1`. Primary `getCouponRow` relative-locator fix vẫn `PARTIALLY_VERIFIED` trên Chromium; TC-003 assertion-scope/locale-independence là secondary correction riêng, runtime `PENDING`. Human review xác nhận 16 unique Playwright tests, A-018 evidence manifest/workspace DB hash không đổi, và phase không chạy browser hay business DB mutation. Human review instructions là evaluation source cho verdict này.

#### (5) Student Fix

| Field | Value |
| --- | --- |
| Student Decision | `ACCEPTED` |
| Changes Made | Không có additional human-directed correction cho A-019 correction output. |
| Change Illustration | `N/A` — TC-003 core/boundary split được chấp nhận as-is. |
| Correction Notes | Runtime verification của secondary correction vẫn pending cho tới approved corrected execution. |
| Verification Method | `STATIC_REVIEW` |
| Verification Result | `PASSED` |
| Final File | `tests/fr-17/helpers/coupon-ui.js`; `tests/fr-17/fr-17.spec.js`; `docs/automation-reviews/fr-17-ai-review.md`; `docs/automation-plans/fr-17-automation-plan.md`; `docs/gaps/fr-17-automation-gaps.md`; `docs/demo/fr-17-demo-plan.md` |
| Approval Status | `APPROVED` |

**Verification Notes**

- `FR17-TC-003` no longer uses min-order, max-use or expiry display as PASS/FAIL oracles; no affected row assertion uses `Number(...).toLocaleString()`.
- A-018 aggregate evidence manifest remains `4A7CBF716A12EBC41F2C888A016988FE13366199346895F2F44B4A1FEE60DAF3`; workspace DB SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.
- No browser execution and no database business mutation occurred during correction.

**Human Decision Evidence**

`APPROVE FR17 TC003 AUTOMATION CORRECTION`

### Artifact A-020 — FR-17 Corrected Cross-Browser Execution and Demo Runtime Verification

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool | Codex |
| Model | GPT-5 |
| Date and Time | 2026-08-10T09:31:21.0679012+07:00 |
| Workflow Stage | FR-17 corrected Chromium execution followed by Firefox/WebKit after approved TC-003 automation correction |
| Feature / Task | FR-17 — Coupon management |
| Related Artifact | `docs/execution-results/fr-17-chromium-execution.md`; `docs/execution-results/fr-17-chromium-corrected-execution.md`; `docs/execution-results/fr-17-firefox-execution.md`; `docs/execution-results/fr-17-webkit-execution.md`; `docs/execution-results/fr-17-cross-browser-summary.md`; `docs/defects/fr-17/candidate-screenshots/`; `docs/demo/fr-17-demo-plan.md` |

**Verbatim Prompt**

[interactions/A-020-prompt.md](interactions/A-020-prompt.md)

#### (2) AI Output

| Field | Value |
| --- | --- |
| Output Storage | `EXTERNAL_FILE` |
| Full Output / Evidence Path | [interactions/A-020-output.md](interactions/A-020-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Execution Status: `COMPLETED_CORRECTED_MULTI_BROWSER_EXECUTION_WITH_PRODUCT_DEFECT_CANDIDATES`; final failure-set comparison: `PARTIALLY_OVERLAPPING`; Current Checkpoint: `CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED`.

#### (3) Verdict

| Field | Value |
| --- | --- |
| Review Status | `FINALIZED` |
| Verdict | `VALID` |
| Verdict Scope | FR-17 corrected Chromium, Firefox and WebKit execution, runtime failure triage, correction verification, evidence preservation, database safety and demo runtime verification. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận historical Chromium run `fr17-chromium-20260810T084402107+0700` được preserve unchanged và historical `FR17-TC-003` automation failure không được tính vào final product metrics. Corrected Chromium, Firefox và WebKit đều được review theo actual runtime evidence; không có human-directed correction nào cần thiết cho A-020 execution result, failure classification hoặc cross-browser comparison.

Final failure set là `PARTIALLY_OVERLAPPING`: `FR17-TC-002` và `FR17-TC-016` reproduce trên cả ba engines; `FR17-TC-008` và `FR17-TC-011` chỉ reproduce trên corrected Chromium, trong khi Firefox/WebKit pass. Review không suy luận backend root cause độc lập trình duyệt cho TC-008/TC-011 chỉ từ static implementation observations.

`FR17-TC-003 assertion-scope / locale-independence correction` và primary `getCouponRow` relative-locator `DEMO_FIX` đều `VERIFIED_MULTI_BROWSER`. `FR17-TC-004 @demo` pass trên Chromium, Firefox và WebKit, nên `FR17-TC-004` là Primary Demo Test với Demo Runtime Status `VERIFIED_MULTI_BROWSER`.

#### (5) Student Fix

| Field | Value |
| --- | --- |
| Student Decision | `ACCEPTED` |
| Changes Made | Không có human-directed correction nào cần thiết cho A-020 execution result, failure classifications hoặc cross-browser comparison. |
| Change Illustration | `N/A` — corrected multi-browser execution result được chấp nhận as-is. |
| Correction Notes | Historical A-018 evidence, original A-020 prompt/output và final corrected execution evidence được preserve. |
| Verification Method | `CORRECTED_MULTI_BROWSER_RUNTIME_REVIEW` |
| Verification Result | `PASSED` |
| Final File | `docs/execution-results/fr-17-chromium-corrected-execution.md`; `docs/execution-results/fr-17-firefox-execution.md`; `docs/execution-results/fr-17-webkit-execution.md`; `docs/execution-results/fr-17-cross-browser-summary.md`; `docs/defects/fr-17/candidate-screenshots/`; `docs/demo/fr-17-demo-plan.md` |
| Approval Status | `APPROVED` |

**Verification Notes**

- Corrected Chromium `fr17-chromium-corrected-20260810T092053847+0700`: `16 total / 12 passed / 4 failed / 0 skipped`; accepted product candidates are `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`.
- Firefox `fr17-firefox-20260810T092258944+0700` và WebKit `fr17-webkit-20260810T092419436+0700`: mỗi run `16 total / 14 passed / 2 failed / 0 skipped`; accepted product candidates là `FR17-TC-002`, `FR17-TC-016`.
- Remaining `AUTOMATION_DEFECT`, `NEEDS_MORE_EVIDENCE` và `ENVIRONMENT_FAILURE`: None.
- `FR17-TC-003` passes on Chromium, Firefox và WebKit; secondary correction is `VERIFIED_MULTI_BROWSER`.
- `FR17-TC-004 @demo` passes on all three engines; primary demo test is `FR17-TC-004`, Demo Runtime Status và primary `DEMO_FIX` Runtime Verification đều `VERIFIED_MULTI_BROWSER`.
- Chromium, Firefox và WebKit HTML reports are `PASS_RENDERED`, each visibly showing `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID và browser identity.
- Isolated DB cleanup is `PASS`: exact baseline `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; owned FR17 residue `0`. Workspace DB protection is `PASS` with SHA-256 `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.
- Original A-018 historical evidence preservation và candidate screenshot preservation are `PASS`. No test code, Playwright config, SUT source hoặc workspace database was modified during A-020 execution.

**Human Decision Evidence**

`APPROVE FR17 CORRECTED MULTI BROWSER EXECUTION`

### Artifact A-021 — FR-17 Final Defect Reporting, Feature Completion and Demo Readiness Bundle

#### (1) Prompt + Tool

| Field | Value |
| --- | --- |
| Tool | Codex |
| Model | GPT-5 |
| Date and Time | 2026-08-10T09:49:25.7457840+07:00 |
| Workflow Stage | FR-17 confirmed defect documentation and recording preparation before final human review |
| Feature / Task | FR-17 — Coupon management |
| Related Artifact | `docs/defects/fr-17/`; `docs/execution-results/fr-17-final-summary.md`; `docs/demo/fr-17-demo-plan.md`; `docs/demo/fr-17-demo-checklist.md` |

**Verbatim Prompt**

[interactions/A-021-prompt.md](interactions/A-021-prompt.md)

#### (2) AI Output

| Field | Value |
| --- | --- |
| Output Storage | `EXTERNAL_FILE` |
| Full Output / Evidence Path | [interactions/A-021-output.md](interactions/A-021-output.md) |

**Verbatim AI Output or Labelled Excerpt**

Finalization Status: `COMPLETED_PENDING_HUMAN_REVIEW`; confirmed underlying defect count: `4`; recording status: `NOT_RECORDED`; GitHub publication status: `NOT_PUBLISHED`; Current Checkpoint: `CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED`.

#### (3) Verdict

| Field | Value |
| --- | --- |
| Review Status | `FINALIZED` |
| Verdict | `VALID` |
| Verdict Scope | FR-17 final defect reporting, evidence promotion, final feature traceability, demo preparation and recording readiness. |

#### (4) Reasoning

**Review Notes**

Human review xác nhận A-021 finalization output hợp lệ và không cần human-directed correction. Final corrected execution gồm `48` project-test combinations: Chromium `16 total / 12 passed / 4 failed / 0 skipped`, Firefox `16 / 14 / 2 / 0`, WebKit `16 / 14 / 2 / 0`; tổng cộng `40 passed / 8 failed / 0 skipped`.

Bốn confirmed failed Test Case IDs được deduplicate đúng thành bốn product defects: `FR17-BUG-001 <- FR17-TC-002`, `FR17-BUG-002 <- FR17-TC-008`, `FR17-BUG-003 <- FR17-TC-011`, `FR17-BUG-004 <- FR17-TC-016`. Historical `FR17-TC-003` không được đưa vào product-defect mapping vì automation defect ban đầu đã được sửa và verified multi-browser. `FR17-BUG-001` và `FR17-BUG-004` là `CROSS_BROWSER`; `FR17-BUG-002` và `FR17-BUG-003` là `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR`, không suy luận universal backend root cause từ static observations.

Human review cũng xác nhận bốn standardized Bug Reports, bốn GitHub Issue drafts, promoted screenshots byte/hash-identical với approved candidate sources, và original execution evidence được preserve. Remaining `AUTOMATION_DEFECT`, `NEEDS_MORE_EVIDENCE`, `ENVIRONMENT_FAILURE` đều bằng `0`. Final traceability là `PASS_WITH_OPEN_REQUIREMENT_GAPS`; `11` requirement gaps tiếp tục là documentation boundaries, không bị chuyển thành invented requirements. `FR17-TC-004 @demo`, primary `getCouponRow` `DEMO_FIX`, và secondary `FR17-TC-003` runtime correction đều `VERIFIED_MULTI_BROWSER`. Demo Recording Checklist là `READY`; recording vẫn `NOT_RECORDED` và GitHub publication vẫn `NOT_PUBLISHED`.

#### (5) Student Fix

| Field | Value |
| --- | --- |
| Student Decision | `ACCEPTED` |
| Changes Made | Không có human-directed correction nào cần thiết cho A-021 finalization output. |
| Change Illustration | `N/A` — final defect, evidence, traceability và demo-readiness bundle được chấp nhận as-is. |
| Correction Notes | Original verbatim A-021 prompt/output và execution evidence được preserve unchanged. |
| Verification Method | `FINAL_ARTIFACT_AND_DEMO_READINESS_REVIEW` |
| Verification Result | `PASSED` |
| Final File | `docs/defects/fr-17/`; `docs/execution-results/fr-17-final-summary.md`; `docs/demo/fr-17-demo-plan.md`; `docs/demo/fr-17-demo-checklist.md` |
| Approval Status | `APPROVED` |

**Verification Notes**

- Approved Test Cases: `16`; Automated Test Cases: `16`; Blocked: `0`.
- Final project-test metrics: `48 total / 40 passed / 8 failed / 0 skipped`.
- Confirmed failed Test Case IDs: `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`; confirmed underlying product defects: `4`.
- Final mapping: `FR17-BUG-001 <- FR17-TC-002`, `FR17-BUG-002 <- FR17-TC-008`, `FR17-BUG-003 <- FR17-TC-011`, `FR17-BUG-004 <- FR17-TC-016`.
- Cross-browser result: `FR17-BUG-001` and `FR17-BUG-004` are `CROSS_BROWSER`; `FR17-BUG-002` and `FR17-BUG-003` are `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR`.
- Four Bug Reports and four GitHub Issue drafts exist; `GitHub Publication Status: NOT_PUBLISHED`.
- Screenshot promotion is `PASS`; four promoted screenshots are byte/hash-identical to approved candidate sources, and original execution evidence remains preserved.
- Remaining `AUTOMATION_DEFECT`, `NEEDS_MORE_EVIDENCE`, and `ENVIRONMENT_FAILURE`: `0`.
- Final Traceability: `PASS_WITH_OPEN_REQUIREMENT_GAPS`; the existing `11` requirement gaps remain open.
- Primary Demo Test: `FR17-TC-004`; Demo Tag: `@demo`; Demo Runtime Status: `VERIFIED_MULTI_BROWSER`.
- Primary `DEMO_FIX` (`getCouponRow` relative-locator correction) and secondary `FR17-TC-003` assertion-scope/locale-independence correction are `VERIFIED_MULTI_BROWSER`.
- Demo Recording Checklist: `READY`; Recording Status: `NOT_RECORDED`.
- Feature Status: `FR17_COMPLETE`; Can Begin Recording: `YES`.
- No browser execution or database mutation occurred during A-021 finalization; workspace database protection was preserved.

**Human Decision Evidence**

`APPROVE FR17 FINAL DEFECT AND DEMO READINESS BUNDLE`

<!-- AUDIT_ENTRIES_END -->

## 4. Summary of AI Accuracy

<!-- AUDIT_SUMMARY_START -->

| Metric                               | Count | Percentage |
| ------------------------------------ | ----: | ---------: |
| Total AI-generated artifacts audited |    21 |    100.00% |
| VALID — correct, accepted as-is      |    12 |     57.14% |
| INVALID — wrong, rejected            |     0 |      0.00% |
| INCOMPLETE — acceptable after edits  |     9 |     42.86% |

**Calculation rule**

```text
Percentage = verdict count / total finalized artifacts × 100
```

Entries with `PENDING_HUMAN_REVIEW` are excluded from finalized verdict totals.

<!-- AUDIT_SUMMARY_END -->

---

## 5. Conclusion — When Should AI Be Used or Not?

Write **80–150 words** after audit entries and human review exist.

> Write the conclusion here.

---

## 6. Mandatory Disclosure

Replace the bracketed parts before submission:

> “[Test cases / script / dataset / report] was initially generated by [AI tool name]; I reviewed and modified [section X], added [edge cases Y, Z]; [section W] was written entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category.”

---

## 7. Student Confirmation

| Field                  | Value                               |
| ---------------------- | ----------------------------------- |
| Student name (printed) |                                     |
| Student ID             |                                     |
| Class / Cohort         |                                     |
| Course                 | CS423 / CSC13003 — Software Testing |
| Instructor             |                                     |
| Date                   |                                     |
| Signature              |                                     |

---

## 8. References

- FIT@HCMUS. _AI Audit Report — 5-section Template per Artifact_.
- ISTQB. _Foundation Level Syllabus_, latest applicable version.
- Course slides and technical sources cited in individual audit entries.
