# FR-05 — Execution Readiness Report

## Status

| Field                  | Value                                             |
| ---------------------- | ------------------------------------------------- |
| Feature                | `FR-05 — Product listing and search`              |
| Workflow Phase         | `EXECUTION_READINESS`                             |
| Readiness Result       | `READY_FOR_EXECUTION`                             |
| Student ID             | `23127107`                                        |
| Target Browsers        | `chromium`, `firefox`, `webkit`                   |
| Runtime Test Execution | `NOT_EXECUTED`                                    |
| Current Checkpoint     | `CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED` |

Readiness chỉ xác nhận môi trường, dependency, browser binaries, configuration và test discovery. Không có FR-05 test nào được chạy và không có runtime `PASS`/`FAIL` nào được tạo.

## Environment

| Item                       | Observed Value                                                                                                               | Status      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| OS                         | Microsoft Windows 11 Home Single Language, 64-bit, version `10.0.26200`, build `26200`                                       | `AVAILABLE` |
| Node.js                    | `v22.18.0`                                                                                                                   | `AVAILABLE` |
| Package Manager            | npm `10.9.3`, invoked as `npm.cmd` because PowerShell blocks `npm.ps1`                                                       | `AVAILABLE` |
| Package-manager convention | Repository setup guide uses npm; root Playwright runner therefore uses npm without changing app-level manifests or lockfiles | `CONFIRMED` |
| Playwright Test            | `@playwright/test@1.62.1`                                                                                                    | `AVAILABLE` |
| Dependency resolution      | `node_modules/@playwright/test/package.json` under repository root                                                           | `CONFIRMED` |

Subprojects contain mixed historical npm/pnpm lockfiles, but none declares a `packageManager` field. The documented SUT setup uses npm. Root automation setup is isolated from frontend/backend manifests.

## Dependency Readiness

| Item                     | Result      | Evidence                                                                           |
| ------------------------ | ----------- | ---------------------------------------------------------------------------------- |
| Root `package.json`      | `CREATED`   | Minimal private Playwright test manifest; existing app manifests unchanged.        |
| Root lockfile            | `CREATED`   | npm generated `package-lock.json`.                                                 |
| `@playwright/test`       | `INSTALLED` | Version `1.62.1`; `npm.cmd list @playwright/test --depth=0` resolved successfully. |
| npm audit during install | `PASS`      | npm reported `0 vulnerabilities` for the root test package at installation time.   |
| Playwright CLI           | `AVAILABLE` | `npx.cmd playwright --version` returned `Version 1.62.1`.                          |

Environment preparation commands used:

```powershell
npm.cmd install --save-dev @playwright/test
npx.cmd playwright install chromium firefox webkit
```

## Browser Readiness

| Project    | Required Engine         | Installed Binary                                       | Status      |
| ---------- | ----------------------- | ------------------------------------------------------ | ----------- |
| `chromium` | `browserName: chromium` | Playwright Chromium revision `1234`; executable exists | `INSTALLED` |
| `firefox`  | `browserName: firefox`  | Playwright Firefox revision `1538`; executable exists  | `INSTALLED` |
| `webkit`   | `browserName: webkit`   | Playwright WebKit revision `2336`; executable exists   | `INSTALLED` |

The local Playwright browser cache also contains an unrelated older Playwright reference from another workspace. Dependency resolution and all three binaries used for this repository were verified against the root `playwright-core` reference for version `1.62.1`.

## Runtime Inputs

| Input          | Resolved Value / Strategy                                                                         | Status                              |
| -------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `STUDENT_ID`   | `23127107`                                                                                        | `CONFIRMED`                         |
| `SUT_BASE_URL` | `http://localhost:5173`                                                                           | `RESOLVED_FROM_REPOSITORY_EVIDENCE` |
| Run ID         | `${Feature ID}-${ISO timestamp with colon/period replaced by hyphen}` unless `RUN_ID` is supplied | `CONFIGURED`                        |
| Timestamp      | `RUN_TIMESTAMP` when supplied; otherwise `new Date().toISOString()` during config evaluation      | `CONFIGURED`                        |

The readiness-only config evaluation generated `2026-08-09T18:55:04.853Z`. This is readiness evidence only and is not a test-run timestamp.

## Student ID and Reporter Identity Validation

With `STUDENT_ID=23127107` and the resolved `SUT_BASE_URL`, config evaluation produced the title pattern:

```text
FR-05 | Run by: 23127107 | <ISO timestamp> | <Run ID>
```

The evaluated metadata retained:

- `Feature ID: FR-05`
- `Run by: 23127107`
- `ISO timestamp`
- `Run ID`

The HTML reporter remains configured with `open: never`. Rendered HTML report validation is `NOT_EXECUTED` and is deferred until approved test execution.

## Project Configuration Validation

| Project    | Explicit Mapping        | Retries | Result        |
| ---------- | ----------------------- | ------: | ------------- |
| `chromium` | `browserName: chromium` |       0 | `PASS_STATIC` |
| `firefox`  | `browserName: firefox`  |       0 | `PASS_STATIC` |
| `webkit`   | `browserName: webkit`   |       0 | `PASS_STATIC` |

Project names were not used as the sole proof of browser selection; the evaluated `browserName` values are distinct and unchanged.

## Test Discovery

Discovery used only the non-executing command below, with required runtime environment values supplied. The CLI reporter was overridden to `list` so discovery did not generate an HTML report.

```powershell
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5173'
npx.cmd playwright test tests/fr-05/fr-05.spec.js --list --reporter=list
```

| Check                            | Result                                          |
| -------------------------------- | ----------------------------------------------- |
| Discovery exit code              | `0`                                             |
| Spec files collected             | `1`                                             |
| Unique FR-05 Test Case IDs       | `13`                                            |
| Project-test combinations        | `39`                                            |
| `chromium`                       | `13` definitions, `13` unique IDs, no duplicate |
| `firefox`                        | `13` definitions, `13` unique IDs, no duplicate |
| `webkit`                         | `13` definitions, `13` unique IDs, no duplicate |
| Blocked IDs discovered           | `0`                                             |
| HTML report created by discovery | `NO`                                            |
| Runtime tests executed           | `NO`                                            |

Discovered IDs:

- `FR05-TC-001`
- `FR05-TC-002`
- `FR05-TC-003`
- `FR05-TC-004`
- `FR05-TC-005`
- `FR05-TC-006`
- `FR05-TC-007`
- `FR05-TC-008`
- `FR05-TC-010`
- `FR05-TC-011`
- `FR05-TC-012`
- `FR05-TC-014`
- `FR05-TC-017`

Confirmed absent blocked IDs:

- `FR05-TC-009`
- `FR05-TC-013`
- `FR05-TC-015`
- `FR05-TC-016`

## SUT Readiness

Repository evidence establishes these local endpoints:

| Component    | Working Directory | Start Command     | Expected URL            | Current Availability                 |
| ------------ | ----------------- | ----------------- | ----------------------- | ------------------------------------ |
| Backend API  | `backend/`        | `node server.js`  | `http://localhost:3000` | `NOT_RUNNING` during readiness check |
| Frontend Web | `frontend-web/`   | `npm.cmd run dev` | `http://localhost:5173` | `NOT_RUNNING` during readiness check |

The stopped SUT is not classified as an automation defect. Both processes must be started and kept running before multi-browser execution. No SUT process was started in this phase.

## Seed-State Runtime Precondition

The approved controlled oracle requires exactly these five products:

1. `iPhone 15 Pro Max`
2. `Samsung Galaxy S24 Ultra`
3. `MacBook Pro M3`
4. `Tai nghe AirPods Pro 2`
5. `Bàn phím cơ Keychron Q1`

The current `backend/database.sqlite` was opened in read-only mode and contains exactly these five records with the approved names, prices, descriptions and image URLs. No database write, reset or reseed occurred.

Immediately before execution:

1. Start the backend and frontend using the documented commands.
2. Perform a non-mutating `GET http://localhost:3000/api/products` availability/data check.
3. Confirm result count `5` and compare the complete name/price/image set with `test-data/fr-05.json`.
4. Stop if the runtime API catalog differs; do not reseed or mutate data automatically.

## Remaining Runtime Risks

| Risk                                         | Current Status                       | Required Follow-up                                                                              |
| -------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `FR05-REV-006` dialog timing across engines  | `NEEDS_MORE_EVIDENCE`                | Evaluate only during approved Chromium/Firefox/WebKit execution.                                |
| Rendered HTML report identity                | `NOT_EXECUTED`                       | Inspect the actual report for visible `Run by: 23127107`, ISO timestamp, Feature ID and Run ID. |
| Runtime SUT availability                     | `NOT_RUNNING`                        | Start backend and frontend before execution and confirm both URLs.                              |
| Runtime seed state                           | `READ_ONLY_DB_CONFIRMED_API_PENDING` | Confirm the five-product catalog through `GET /api/products` immediately before execution.      |
| Product defects anticipated by static review | `NOT_EXECUTED`                       | Do not classify until real execution evidence exists.                                           |

## Readiness Decision

All mandatory execution-readiness criteria are satisfied:

- Playwright dependency and CLI are available.
- Chromium, Firefox and WebKit binaries are installed.
- `SUT_BASE_URL` is resolved from repository evidence.
- `STUDENT_ID=23127107` is accepted by the config.
- All 13 approved IDs are discovered once per project.
- No blocked ID is discovered.
- No automation-code correction is required.

Overall result: `READY_FOR_EXECUTION`.

Execution remains gated by human review at:

`CHECKPOINT: EXECUTION_READINESS_REVIEW_REQUIRED`
