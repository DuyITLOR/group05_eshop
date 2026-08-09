# FR-05 — Chromium Execution and Initial Failure Triage

## Run Metadata

| Field                  | Value                                                                  |
| ---------------------- | ---------------------------------------------------------------------- |
| Feature                | `FR-05 — Product listing and search`                                   |
| Browser                | `chromium` only                                                        |
| Student ID             | `23127107`                                                             |
| Run ID                 | `FR-05-chromium-2026-08-09T19-14-10-0306495Z`                          |
| ISO Timestamp          | `2026-08-09T19:14:10.0306495Z`                                         |
| SUT Base URL           | `http://localhost:5173`                                                |
| Playwright Command     | `npx.cmd playwright test tests/fr-05/fr-05.spec.js --project=chromium` |
| Retries                | `0`                                                                    |
| Execution Exit Code    | `1`                                                                    |
| Runtime Test Execution | `EXECUTED`                                                             |

Only Chromium was executed. Firefox and WebKit were not executed in this phase.

## Runtime Gates

| Gate                    | Result | Evidence                                                                                                                                              |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend startup         | `PASS` | `node server.js` started a Node listener at `http://localhost:3000`; API check returned HTTP `200`.                                                   |
| Frontend startup        | `PASS` | `npm.cmd run dev` started Vite at `http://localhost:5173`; availability check returned HTTP `200`.                                                    |
| Runtime seed state      | `PASS` | `GET http://localhost:3000/api/products` returned HTTP `200`, five products, and an exact name/raw-price/image-URL match with `test-data/fr-05.json`. |
| Approved test inventory | `PASS` | 13 tests executed; no implementation-blocked case was present.                                                                                        |

Observed SUT startup behavior: the documented backend command imports `database.js`, whose normal initialization code drops and recreates tables before inserting seed data. No separate reset or seed command was issued by this execution. Git now reports `backend/database.sqlite` as modified by that normal startup path. The post-start API catalog matched the approved controlled oracle exactly; this startup side effect must be considered before later runs because it mutates the SUT database.

## Execution Summary

| Metric            | Result |
| ----------------- | -----: |
| Total             |     13 |
| Passed            |      7 |
| Failed            |      6 |
| Skipped           |      0 |
| Interrupted       |      0 |
| Reported Duration |  13.5s |

Passed Test Case IDs: `FR05-TC-001`, `FR05-TC-002`, `FR05-TC-003`, `FR05-TC-007`, `FR05-TC-008`, `FR05-TC-010`, `FR05-TC-017`.

Failed Test Case IDs: `FR05-TC-004`, `FR05-TC-005`, `FR05-TC-006`, `FR05-TC-011`, `FR05-TC-012`, `FR05-TC-014`.

## Per-Test Results

| Test Case ID  | Result   | Failure Summary                                                                                                                     | Initial Classification | Evidence                                                                                                                       |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `FR05-TC-001` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-002` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-003` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-004` | `FAILED` | First product image resolved with `alt=""`; expected non-empty `alt`.                                                               | `PRODUCT_DEFECT`       | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-a8439-ent-non-empty-alt-attribute-chromium/error-context.md` |
| `FR05-TC-005` | `FAILED` | Price text was `30,000,000 VND`; required symbol `₫` was absent.                                                                    | `PRODUCT_DEFECT`       | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-624c7-quired-dong-currency-symbol-chromium/error-context.md` |
| `FR05-TC-006` | `FAILED` | Helper selected `30,000,000 ` including a trailing space before `VND`; the numeric display itself uses conventional comma grouping. | `AUTOMATION_DEFECT`    | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-0bd6b-ventional-thousand-grouping-chromium/error-context.md` |
| `FR05-TC-007` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-008` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-010` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |
| `FR05-TC-011` | `FAILED` | Formatting markup was interpreted, leaving `FR05 HTML Keyword` rather than the literal `<b>…</b>` input.                            | `PRODUCT_DEFECT`       | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-71191-markup-as-literal-safe-text-chromium/error-context.md` |
| `FR05-TC-012` | `FAILED` | Dialog observer captured `FR05-XSS` twice; literal markup was not retained; one `img[onerror]` existed.                             | `PRODUCT_DEFECT`       | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-3d0cc-nt-handler-markup-execution-chromium/error-context.md` |
| `FR05-TC-014` | `FAILED` | `getByRole('heading', { level: 1 })` resolved two headings; expected exactly one.                                                   | `PRODUCT_DEFECT`       | HTML report entry; `test-results/fr-05/fr-05-fr-05-FR-05---Produc-186ce-ide-exactly-one-semantic-h1-chromium/error-context.md` |
| `FR05-TC-017` | `PASSED` | —                                                                                                                                   | —                      | Chromium HTML report entry                                                                                                     |

## Failure Triage

| Test Case ID  | Initial Classification | Confidence | Reasoning                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FR05-TC-004` | `PRODUCT_DEFECT`       | `HIGH`     | The approved non-empty-alt expectation was directly asserted against an existing product image; runtime evidence received `alt=""`.                                                                                                                                         |
| `FR05-TC-005` | `PRODUCT_DEFECT`       | `HIGH`     | The price locator resolved the expected card price exactly, but its rendered text uses `VND` instead of the approved `₫` symbol.                                                                                                                                            |
| `FR05-TC-006` | `AUTOMATION_DEFECT`    | `HIGH`     | The approved grouping objective is satisfied by `30,000,000`. The helper's allowed normal-space separator includes the trailing space before `VND`, so its token regex captures `30,000,000 ` and rejects it. This is independent of the currency-symbol failure in TC-005. |
| `FR05-TC-011` | `PRODUCT_DEFECT`       | `HIGH`     | The reflected region rendered the markup's text content rather than the literal input string, which violates the approved safe-text expectation.                                                                                                                            |
| `FR05-TC-012` | `PRODUCT_DEFECT`       | `HIGH`     | Chromium captured two actual dialog events, the literal-text assertion failed, and the DOM contained one `img[onerror]`; this is direct runtime evidence of executable reflected markup.                                                                                    |
| `FR05-TC-014` | `PRODUCT_DEFECT`       | `HIGH`     | The role-based semantic heading count is objective and resolved two `<h1>` headings rather than one.                                                                                                                                                                        |

No test or SUT correction was applied in this phase. The `AUTOMATION_DEFECT` classification for TC-006 requires separate human review before any helper change.

## Reporter Verification

| Check                      | Result | Evidence                                                                             |
| -------------------------- | ------ | ------------------------------------------------------------------------------------ |
| HTML report generated      | `PASS` | `html-reports/fr-05/FR-05-chromium-2026-08-09T19-14-10-0306495Z/index.html` exists.  |
| Visible student identity   | `PASS` | Rendered HTML report title/body contains `Run by: 23127107`.                         |
| Feature traceability       | `PASS` | Rendered title/body contains `FR-05`.                                                |
| Browser traceability       | `PASS` | Rendered body contains `Project: chromium` and each report entry carries `chromium`. |
| Run identity and timestamp | `PASS` | Rendered title/body contains Run ID and `2026-08-09T19:14:10.0306495Z`.              |

Verification served the generated report locally and inspected it in Chromium headless. The report displayed `All 13`, `Passed 7`, `Failed 6`, `Project: chromium`, and the full configured title. This was report inspection only, not a second FR-05 test run.

## FR05-REV-006 Chromium Evidence

| Item                     | Chromium Evidence                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| Dialog observer active   | `YES` — TC-012 registered `page.on('dialog', listener)` before navigation/search.           |
| Dialog events captured   | `YES` — two messages: `FR05-XSS`, `FR05-XSS`.                                               |
| Literal text assertion   | `FAILED` — reflected region was `Kết quả tìm kiếm cho:` without the expected literal input. |
| `img[onerror]` assertion | `FAILED` — expected `0`, received `1`.                                                      |

This resolves only Chromium evidence for `FR05-REV-006`. Firefox and WebKit evidence remains pending.

## Evidence Paths

- HTML report: `html-reports/fr-05/FR-05-chromium-2026-08-09T19-14-10-0306495Z/index.html`
- Playwright console log: `docs/execution-results/process-logs/FR-05-chromium-2026-08-09T19-14-10-0306495Z/playwright.chromium.log`
- Backend startup logs: `docs/execution-results/process-logs/FR-05-chromium-2026-08-09T19-14-10-0306495Z/backend.stdout.log` and `backend.stderr.log`
- Frontend startup logs: `docs/execution-results/process-logs/FR-05-chromium-2026-08-09T19-14-10-0306495Z/frontend.stdout.log` and `frontend.stderr.log`
- Playwright failure contexts: `test-results/fr-05/**/error-context.md`
- Last-run metadata: `test-results/fr-05/.last-run.json`

No trace, video or screenshot artifact was generated by the approved Playwright configuration.

## Remaining Cross-Browser Work

- Do not run Firefox or WebKit until the Chromium execution and initial triage receive human review.
- Review `FR05-TC-006` as a proposed `AUTOMATION_DEFECT` before modifying the helper.
- Review the five proposed `PRODUCT_DEFECT` classifications before changing the SUT or creating issue records.
- Decide how later SUT startup should isolate or preserve database state, because the documented backend startup performs its own drop/create/seed initialization.

## Current Checkpoint

`CHECKPOINT: CHROMIUM_EXECUTION_REVIEW_REQUIRED`
