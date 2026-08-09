# FR-05 Cross-Browser Execution Summary

## Scope and Baseline

The approved corrected Chromium rerun is the baseline. Firefox and WebKit were executed afterward against the same healthy SUT and approved five-product seed oracle.

| Browser | Run ID | ISO timestamp | Total | Passed | Failed | Skipped |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| Chromium | FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z | 2026-08-09T19:40:49.6875324Z | 13 | 8 | 5 | 0 |
| Firefox | FR-05-firefox-2026-08-09T19-58-55-6329954Z | 2026-08-09T19:58:55.6271287Z | 13 | 8 | 5 | 0 |
| WebKit | FR-05-webkit-2026-08-09T20-00-12-2824300Z | 2026-08-09T20:00:12.2824300Z | 13 | 8 | 5 | 0 |

Student ID: 23127107

Seed-state result: PASS — GET /api/products matched the approved five-product oracle before Firefox execution; no reset, manual seed, or SUT change was performed.

## Per-Test Comparison

| Test Case ID | Chromium | Firefox | WebKit | Final Classification |
| --- | --- | --- | --- | --- |
| FR05-TC-001 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-002 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-003 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-004 | FAILED | FAILED | FAILED | PRODUCT_DEFECT |
| FR05-TC-005 | FAILED | FAILED | FAILED | PRODUCT_DEFECT |
| FR05-TC-006 | PASSED | PASSED | PASSED | CONSISTENT_PASS — corrected automation remains valid across engines |
| FR05-TC-007 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-008 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-010 | PASSED | PASSED | PASSED | CONSISTENT_PASS |
| FR05-TC-011 | FAILED | FAILED | FAILED | PRODUCT_DEFECT |
| FR05-TC-012 | FAILED | FAILED | FAILED | PRODUCT_DEFECT — browser-specific dialog count documented below |
| FR05-TC-014 | FAILED | FAILED | FAILED | PRODUCT_DEFECT |
| FR05-TC-017 | PASSED | PASSED | PASSED | CONSISTENT_PASS |

## Defect and Automation Comparison

- New AUTOMATION_DEFECT: none.
- ENVIRONMENT_FAILURE: none.
- Consistent PRODUCT_DEFECT cases: FR05-TC-004, FR05-TC-005, FR05-TC-011, FR05-TC-012, and FR05-TC-014.
- FR05-TC-006: passed on Chromium, Firefox, and WebKit; the approved grouping-helper correction is cross-browser validated.

## FR05-TC-012 and FR05-REV-006 Evidence

| Engine | Dialog observer active | Dialog count | Dialog messages | Literal-text result | img[onerror] result |
| --- | --- | ---: | --- | --- | --- |
| Chromium | Yes | 2 | FR05-XSS; FR05-XSS | FAILED — markup was not literal text | FAILED — count 1 |
| Firefox | Yes | 2 | FR05-XSS; FR05-XSS | FAILED — markup was not literal text | FAILED — count 1 |
| WebKit | Yes | 1 | FR05-XSS | FAILED — markup was not literal text | FAILED — count 1 |

FR05-REV-006 outcome: RUNTIME_VERIFIED_MULTI_BROWSER. The observer reliably captured real dialog execution in every engine. The count difference is browser-specific product-defect evidence; it does not indicate missing synchronization or a new automation defect.

## HTML Report Verification

All three independently rendered reports visibly contain FR-05, Run by: 23127107, the run-specific ISO timestamp, Run ID, and their browser project identity.

| Browser | HTML report path | Identity verification |
| --- | --- | --- |
| Chromium | html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/ | PASS |
| Firefox | html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/ | PASS |
| WebKit | html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/ | PASS |

## Evidence Paths

- Chromium record: docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md
- Firefox record: docs/execution-results/fr-05-firefox-execution.md
- WebKit record: docs/execution-results/fr-05-webkit-execution.md
- Firefox log and metadata: docs/execution-results/process-logs/FR-05-firefox-2026-08-09T19-58-55-6329954Z/
- WebKit log and metadata: docs/execution-results/process-logs/FR-05-webkit-2026-08-09T20-00-12-2824300Z/
- Raw result archives: test-results/fr-05-runs/

## Current Checkpoint

CHECKPOINT: CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
