# FR-05 Firefox Execution

## Run Identity

| Field | Value |
| --- | --- |
| Feature | FR-05 — Product listing and search |
| Browser project | firefox |
| Run ID | FR-05-firefox-2026-08-09T19-58-55-6329954Z |
| ISO timestamp | 2026-08-09T19:58:55.6271287Z |
| Student ID | 23127107 |
| SUT base URL | http://localhost:5173 |
| Command | npx.cmd playwright test tests/fr-05/fr-05.spec.js --project=firefox --output test-results/fr-05-runs/FR-05-firefox-2026-08-09T19-58-55-6329954Z |
| SUT process decision | REUSED_HEALTHY_SUT |

## Runtime Gates

- Frontend at port 5173 and backend at port 3000 were healthy and reused.
- GET /api/products matched the approved five-product oracle in test-data/fr-05.json.
- The approved inventory remained 13 Test Case IDs.

## Result Summary

| Total | Passed | Failed | Skipped | Duration |
| ---: | ---: | ---: | ---: | --- |
| 13 | 8 | 5 | 0 | 28.9s |

| Failed Test Case ID | Classification | Evidence |
| --- | --- | --- |
| FR05-TC-004 | PRODUCT_DEFECT | Product image alt attribute is empty. |
| FR05-TC-005 | PRODUCT_DEFECT | Price displays VND rather than required ₫. |
| FR05-TC-011 | PRODUCT_DEFECT | Formatting markup is rendered, not retained as literal text. |
| FR05-TC-012 | PRODUCT_DEFECT | Reflected event-handler markup executes and creates img[onerror]. |
| FR05-TC-014 | PRODUCT_DEFECT | Home page exposes two h1 elements rather than exactly one. |

No AUTOMATION_DEFECT or ENVIRONMENT_FAILURE was observed. FR05-TC-006 passed with the corrected thousand-grouping helper.

## FR05-TC-012 Dialog Evidence

| Evidence | Firefox Result |
| --- | --- |
| Dialog observer active | Yes; the observer captured dialogs before disposal. |
| Dialog count | 2 |
| Dialog messages | FR05-XSS; FR05-XSS |
| Literal safe-text assertion | Failed; received text was Kết quả tìm kiếm cho: without the literal markup payload. |
| img[onerror] assertion | Failed; received count was 1 instead of 0. |

This is PRODUCT_DEFECT evidence, not an automation timing defect: the dialog observer successfully captured the executable payload.

## HTML Report Identity Verification

PASS — the Firefox-rendered report visibly contains FR-05, Run by: 23127107, ISO timestamp 2026-08-09T19:58:55.6271287Z, Run ID FR-05-firefox-2026-08-09T19-58-55-6329954Z, and Firefox project identity.

## Evidence Paths

- HTML report: html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/
- Raw results: test-results/fr-05-runs/FR-05-firefox-2026-08-09T19-58-55-6329954Z/
- Playwright log: docs/execution-results/process-logs/FR-05-firefox-2026-08-09T19-58-55-6329954Z/playwright.firefox.log
- Run metadata: docs/execution-results/process-logs/FR-05-firefox-2026-08-09T19-58-55-6329954Z/run-metadata.json

## Current Checkpoint

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
