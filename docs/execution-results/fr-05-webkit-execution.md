# FR-05 WebKit Execution

## Run Identity

| Field | Value |
| --- | --- |
| Feature | FR-05 — Product listing and search |
| Browser project | webkit |
| Run ID | FR-05-webkit-2026-08-09T20-00-12-2824300Z |
| ISO timestamp | 2026-08-09T20:00:12.2824300Z |
| Student ID | 23127107 |
| SUT base URL | http://localhost:5173 |
| Command | npx.cmd playwright test tests/fr-05/fr-05.spec.js --project=webkit --output test-results/fr-05-runs/FR-05-webkit-2026-08-09T20-00-12-2824300Z |
| SUT process decision | REUSED_HEALTHY_SUT |

## Runtime Gates

- Firefox triage had no new AUTOMATION_DEFECT or ENVIRONMENT_FAILURE, so WebKit execution was permitted.
- The existing healthy frontend/backend processes were reused.
- The Firefox seed gate had already confirmed the approved five-product oracle; no database reset or manual seed operation was performed.
- The approved inventory remained 13 Test Case IDs.

## Result Summary

| Total | Passed | Failed | Skipped | Duration |
| ---: | ---: | ---: | ---: | --- |
| 13 | 8 | 5 | 0 | 14.0s |

| Failed Test Case ID | Classification | Evidence |
| --- | --- | --- |
| FR05-TC-004 | PRODUCT_DEFECT | Product image alt attribute is empty. |
| FR05-TC-005 | PRODUCT_DEFECT | Price displays VND rather than required ₫. |
| FR05-TC-011 | PRODUCT_DEFECT | Formatting markup is rendered, not retained as literal text. |
| FR05-TC-012 | PRODUCT_DEFECT | Reflected event-handler markup executes and creates img[onerror]. |
| FR05-TC-014 | PRODUCT_DEFECT | Home page exposes two h1 elements rather than exactly one. |

No AUTOMATION_DEFECT or ENVIRONMENT_FAILURE was observed. FR05-TC-006 passed with the corrected thousand-grouping helper.

## FR05-TC-012 Dialog Evidence

| Evidence | WebKit Result |
| --- | --- |
| Dialog observer active | Yes; the observer captured a dialog before disposal. |
| Dialog count | 1 |
| Dialog messages | FR05-XSS |
| Literal safe-text assertion | Failed; received text was Kết quả tìm kiếm cho: without the literal markup payload. |
| img[onerror] assertion | Failed; received count was 1 instead of 0. |

The single dialog count differs from Chromium and Firefox, which each recorded two dialogs. All engines nevertheless provide direct evidence of the same executable-markup PRODUCT_DEFECT; this is not an automation blocker.

## HTML Report Identity Verification

PASS — the WebKit-rendered report visibly contains FR-05, Run by: 23127107, ISO timestamp 2026-08-09T20:00:12.2824300Z, Run ID FR-05-webkit-2026-08-09T20-00-12-2824300Z, and WebKit project identity.

## Evidence Paths

- HTML report: html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/
- Raw results: test-results/fr-05-runs/FR-05-webkit-2026-08-09T20-00-12-2824300Z/
- Playwright log: docs/execution-results/process-logs/FR-05-webkit-2026-08-09T20-00-12-2824300Z/playwright.webkit.log
- Run metadata: docs/execution-results/process-logs/FR-05-webkit-2026-08-09T20-00-12-2824300Z/run-metadata.json

## Current Checkpoint

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
