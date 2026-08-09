# FR-05 Chromium Rerun After TC-006 Fix

## Run Identity

| Field | Value |
| --- | --- |
| Feature | FR-05 — Product listing and search |
| Browser project | chromium only |
| Run ID | FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z |
| ISO timestamp | 2026-08-09T19:40:49.6875324Z |
| Student ID | 23127107 |
| SUT base URL | http://localhost:5173 |
| Command | npx.cmd playwright test tests/fr-05/fr-05.spec.js --project=chromium |
| Runtime process decision | REUSED_HEALTHY_SUT — frontend port 5173 and backend port 3000 were already listening and healthy; no service restart or manual database change was performed. |

## Preconditions and Runtime Gate

- The helper correction was limited to tests/fr-05/helpers/fr-05-helpers.js.
- Static helper verification accepted 5 required conventional grouping forms and rejected 5 invalid/raw/mixed forms.
- GET /api/products returned the approved five-product FR05-DATA-001 seed catalog before execution.
- The 13 approved candidate test IDs were unchanged.
- The previous raw test-results/fr-05 directory was archived to test-results/fr-05-runs/FR-05-chromium-2026-08-09T19-14-10-0306495Z before this rerun, preserving the prior run evidence.

## Result Summary

| Metric | Previous Chromium Run | TC-006 Correction Rerun |
| --- | ---: | ---: |
| Run ID | FR-05-chromium-2026-08-09T19-14-10-0306495Z | FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z |
| Total | 13 | 13 |
| Passed | 7 | 8 |
| Failed | 6 | 5 |
| Skipped | 0 | 0 |
| TC-006 | FAILED — AUTOMATION_DEFECT | PASSED |

## TC-006 Correction Outcome

FR05-TC-006 passed in Chromium after the helper stopped including outer whitespace before the currency suffix in the numeric candidate. The product assertion was not changed: the test still requires conventional, consistent thousand grouping and rejects raw digits, hyphens, letters and mixed separators. The production display remains 30,000,000 VND; this test does not alter the independently failing required dong-symbol assertion in FR05-TC-005.

## Remaining Failures

The rerun has exactly the five previously established product-defect test failures. No failure is reported as a new runtime PASS/FAIL outside the captured execution output.

| Test Case ID | Runtime observation | Classification |
| --- | --- | --- |
| FR05-TC-004 | Product image alt attribute is empty. | PRODUCT_DEFECT |
| FR05-TC-005 | Price text uses VND rather than required ₫. | PRODUCT_DEFECT |
| FR05-TC-011 | Reflected formatting markup is rendered instead of remaining literal text. | PRODUCT_DEFECT |
| FR05-TC-012 | Reflected event-handler markup creates img[onerror] and real Chromium dialog evidence. | PRODUCT_DEFECT |
| FR05-TC-014 | Home page has two h1 elements rather than exactly one. | PRODUCT_DEFECT |

## Regression Comparison

- No unrelated previously-passing test regressed.
- The pass set from the previous run was retained; FR05-TC-006 is the sole changed test outcome.
- The original Chromium execution record and original HTML report remain unchanged.

## HTML Report Identity Verification

The generated HTML report was rendered using Chromium from a temporary local static server. Its visible document title is:

FR-05 | Run by: 23127107 | 2026-08-09T19:40:49.6875324Z | FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z

Verification result: PASS. The report contains the feature ID, Student ID, ISO timestamp and unique Run ID.

## Evidence Paths

- HTML report: html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/
- Playwright output log: docs/execution-results/process-logs/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/playwright.chromium.log
- Run metadata: docs/execution-results/process-logs/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/run-metadata.json
- Rerun raw results: test-results/fr-05-runs/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/
- Archived previous raw results: test-results/fr-05-runs/FR-05-chromium-2026-08-09T19-14-10-0306495Z/

## Cross-Browser Readiness

The TC-006 automation correction is ready for subsequent human review. Firefox and WebKit were not run in this task.

## Current Checkpoint

CHECKPOINT: TC006_CORRECTION_REVIEW_REQUIRED
