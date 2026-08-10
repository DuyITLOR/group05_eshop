# FR-17 Firefox Execution — Coupon management

## Saved Raw Execution Outcome

| Field | Value |
| --- | --- |
| Execution Status | `COMPLETED_WITH_TEST_FAILURES` |
| Browser | `firefox` |
| Run ID | `fr17-firefox-20260810T092258944+0700` |
| Run Timestamp | `2026-08-10T09:22:58.9445917+07:00` |
| Completed At | `2026-08-10T09:23:36.9963953+07:00` |
| Playwright Duration | `30.8s` |
| Total | `16` |
| Passed | `14` |
| Failed | `2` |
| Skipped | `0` |
| Failed Test Case IDs | `FR17-TC-002`, `FR17-TC-016` |
| HTML Report Directory | `html-reports/fr-17/fr17-firefox-20260810T092258944+0700/` |
| Playwright Result Directory | `test-results/fr-17/fr17-firefox-20260810T092258944+0700/` |
| Raw Stdout | `.runtime/fr-17/execution-logs/fr17-firefox-20260810T092258944+0700.stdout.log` |
| Raw Stderr | `.runtime/fr-17/execution-logs/fr17-firefox-20260810T092258944+0700.stderr.log` — `0` bytes |
| Retry Policy | `0` |
| Video | `off` |

Raw outcome này được lưu ngay sau khi browser command hoàn tất và trước khi hoàn tất failure triage. Nội dung triage, database/report gates và adaptive gate decision sẽ được bổ sung sau static/runtime evidence review của chính run này.

## Failure Evidence and Triage

| Test Case ID | Observed Runtime Behavior | Original Run-Specific Evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `FR17-TC-002` | Form được mở đúng nhưng required field `code` không có visible associated `*` indicator. | `test-results/fr-17/fr17-firefox-20260810T092258944+0700/fr-17-fr-17-FR-17---Coupon-6a3de-ssociated-visible-indicator-firefox/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` |
| `FR17-TC-016` | Runtime-verified non-admin session vẫn có một usable `Mã Giảm Giá` control. | `test-results/fr-17/fr17-firefox-20260810T092258944+0700/fr-17-fr-17-FR-17---Coupon-16fc0--Coupon-Management-controls-firefox/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` |

Mỗi evidence directory chứa `test-failed-1.png`, `trace.zip` và `error-context.md`. TC-008 và TC-011 PASS trên Firefox; không ép kết quả này khớp Chromium.

## Correction, Demo and Safety Gates

| Field | Result |
| --- | --- |
| TC-003 Valid Percent CREATE / Exact Row / Type / Discount / Cleanup | `PASS` |
| TC-003 Runtime Correction | `TC003_RUNTIME_CORRECTION_VERIFIED_FIREFOX` |
| TC-004 Setup / Create / Row / Boundary / Cleanup | `PASS` |
| Primary DEMO_FIX | `DEMO_FIX_RUNTIME_VERIFIED_FIREFOX` |
| Isolated Coupon Baseline | `PASS` — exactly `BIGBUY`, `EXPIRED`, `SAVE10`, `VIP100` |
| FR17-Owned Residue | `0` |
| Workspace DB SHA-256 | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` — `PASS` |
| HTML Report | `PASS_RENDERED` — visible `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID và `firefox` |
| Original Failure Screenshots / Traces | `2 / 2` |
| Test / Helper Hashes | unchanged |
| `AUTOMATION_DEFECT` / `ENVIRONMENT_FAILURE` | None / None |

Post-Firefox gate: `PASS`; WebKit execution was permitted.
