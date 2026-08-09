# FR-05 Final Feature Summary

## Feature

FR-05 — Product listing and search

## Approved Scope and Automation

| Metric | Result |
| --- | --- |
| Approved Test Cases | 17 |
| Automated | 13 |
| Blocked by Implementation | 4 (`FR05-TC-009`, `FR05-TC-013`, `FR05-TC-015`, `FR05-TC-016`) |
| Browsers | Chromium, Firefox, WebKit |
| External data | Approved `test-data/fr-05.json`; 13/13 candidates covered; 5 verified seed products reused; no new records. |
| Assertion-pattern coverage | COUNT, TEXT_OR_VALUE, ATTRIBUTE_OR_CLASS, VISIBILITY_OR_HIDDEN_STATE, DIALOG, and related approved assertions. |

## Final Corrected Result

| Browser | Total | Passed | Failed |
| --- | ---: | ---: | ---: |
| Chromium | 13 | 8 | 5 |
| Firefox | 13 | 8 | 5 |
| WebKit | 13 | 8 | 5 |

Năm failure giống nhau trên ba browser đã được xác nhận là `PRODUCT_DEFECT`: `FR05-TC-004`, `FR05-TC-005`, `FR05-TC-011`, `FR05-TC-012` và `FR05-TC-014`.

## TC-006 Automation-Defect History

- Original Chromium: FAILED because the grouping helper consumed trailing whitespace before the currency suffix.
- Human triage: `AUTOMATION_DEFECT`.
- Correction: helper extraction was constrained to complete, consistently separated numeric groups.
- Verification: PASSED on Chromium, Firefox, and WebKit.
- Final status: `CROSS_BROWSER_VERIFIED_PASS`.

Automation defects found during development: 1. Automation defects remaining: 0.

## Defect Evidence

Năm HW04 defect report đã chuẩn hoá, mỗi lỗi dùng một screenshot có sẵn, cùng năm GitHub Issue draft chưa publish được lưu tại `docs/defects/fr-05/`.

| Defect ID | Found by Test Case | Defect report | Screenshot | GitHub Issue draft |
| --- | --- | --- | --- | --- |
| `FR05-BUG-001` | `FR05-TC-004` | `docs/defects/fr-05/FR05-BUG-001-empty-image-alt.md` | `docs/defects/fr-05/screenshots/FR05-BUG-001.png` | `docs/defects/fr-05/github-issues/FR05-BUG-001.md` |
| `FR05-BUG-002` | `FR05-TC-005` | `docs/defects/fr-05/FR05-BUG-002-wrong-currency-symbol.md` | `docs/defects/fr-05/screenshots/FR05-BUG-002.png` | `docs/defects/fr-05/github-issues/FR05-BUG-002.md` |
| `FR05-BUG-003` | `FR05-TC-011` | `docs/defects/fr-05/FR05-BUG-003-unsafe-formatting-markup.md` | `docs/defects/fr-05/screenshots/FR05-BUG-003.png` | `docs/defects/fr-05/github-issues/FR05-BUG-003.md` |
| `FR05-BUG-004` | `FR05-TC-012` | `docs/defects/fr-05/FR05-BUG-004-reflected-event-handler-execution.md` | `docs/defects/fr-05/screenshots/FR05-BUG-004.png` | `docs/defects/fr-05/github-issues/FR05-BUG-004.md` |
| `FR05-BUG-005` | `FR05-TC-014` | `docs/defects/fr-05/FR05-BUG-005-multiple-h1.md` | `docs/defects/fr-05/screenshots/FR05-BUG-005.png` | `docs/defects/fr-05/github-issues/FR05-BUG-005.md` |

Runtime evidence bổ sung cho screenshot đối với DOM semantics không nhìn thấy trực tiếp, dialog execution và heading count. `FR05-BUG-004` chỉ ghi nhận reflected `img[onerror]` execution và dialog đã được chứng minh: Chromium 2, Firefox 2, WebKit 1; không khẳng định broader compromise.

## HTML Reports

The corrected Chromium, Firefox, and WebKit reports were independently rendered and visibly contain `FR-05`, `Run by: 23127107`, ISO timestamp, Run ID, and browser project identity.

## Human Review and Audit

`FR05-REV-006` is `RUNTIME_VERIFIED_MULTI_BROWSER`. The automation review, execution records, defect reports, screenshots, and AI audit trail are preserved.

## GitHub Issue Publication

Năm GitHub Issue-ready draft đã được chuẩn bị tại `docs/defects/fr-05/github-issues/`. Publication Status: `NOT_PUBLISHED`; không có GitHub Issue bên ngoài nào đã được publish.

## Traceability Result

`PASS_WITH_REMAINING_IMPLEMENTATION_GAPS` — approved requirement-based design, 13 scripts, external JSON data, multi-browser execution, independent HTML reports, human-reviewed automation, gap documentation, confirmed defect reports, screenshot evidence và audit entries đều có thể trace. Bốn approved case vẫn bị block do thiếu observable SUT behavior.

## Current Checkpoint

CHECKPOINT: FR05_FINAL_REVIEW_REQUIRED
