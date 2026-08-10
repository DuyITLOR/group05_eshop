# FR-17 Corrected Chromium Execution — Coupon management

## Saved Raw Execution Outcome

| Field | Value |
| --- | --- |
| Execution Status | `COMPLETED_WITH_TEST_FAILURES` |
| Browser | `chromium` |
| Run ID | `fr17-chromium-corrected-20260810T092053847+0700` |
| Run Timestamp | `2026-08-10T09:20:53.8479796+07:00` |
| Completed At | `2026-08-10T09:21:28.0090641+07:00` |
| Playwright Duration | `33.5s` |
| Total | `16` |
| Passed | `12` |
| Failed | `4` |
| Skipped | `0` |
| Failed Test Case IDs | `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016` |
| HTML Report Directory | `html-reports/fr-17/fr17-chromium-corrected-20260810T092053847+0700/` |
| Playwright Result Directory | `test-results/fr-17/fr17-chromium-corrected-20260810T092053847+0700/` |
| Raw Stdout | `.runtime/fr-17/execution-logs/fr17-chromium-corrected-20260810T092053847+0700.stdout.log` |
| Raw Stderr | `.runtime/fr-17/execution-logs/fr17-chromium-corrected-20260810T092053847+0700.stderr.log` — `0` bytes |
| Retry Policy | `0` |
| Video | `off` |

Raw outcome này được lưu ngay sau khi browser command hoàn tất và trước khi hoàn tất failure triage. Nội dung triage, database/report gates và adaptive gate decision sẽ được bổ sung sau static/runtime evidence review của chính run này.

## Failure Evidence and Triage

| Test Case ID | Observed Runtime Behavior | Original Run-Specific Evidence | Classification | Confidence | Reasoning |
| --- | --- | --- | --- | --- | --- |
| `FR17-TC-002` | Coupon Management form được mở đúng, nhưng required field `code` không có visible associated label/labelled element chứa `*`. | `test-results/fr-17/fr17-chromium-corrected-20260810T092053847+0700/fr-17-fr-17-FR-17---Coupon-6a3de-ssociated-visible-indicator-chromium/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Unchanged approved assertion tái hiện trực tiếp FR17-R16; auth, page và field resolution đều thành công. |
| `FR17-TC-008` | SUT tạo row có owned code dù submitted `discount_value=0`; cleanup sau assertion phục hồi baseline. | `test-results/fr-17/fr17-chromium-corrected-20260810T092053847+0700/fr-17-fr-17-FR-17---Coupon-a8cda-ount-value-zero-is-rejected-chromium/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Approved oracle yêu cầu reject, code absent và count không tăng. Exact owned-row locator quan sát record mới; đây không phải locator/setup failure. |
| `FR17-TC-011` | SUT tạo row có owned code dù submitted `min_order_amount=-1`; cleanup sau assertion phục hồi baseline. | `test-results/fr-17/fr17-chromium-corrected-20260810T092053847+0700/fr-17-fr-17-FR-17---Coupon-ab930-nt-negative-one-is-rejected-chromium/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Approved lower-bound oracle yêu cầu reject. Exact owned-row evidence xác nhận nonconforming create trên Chromium. |
| `FR17-TC-016` | Fresh non-admin session vẫn thấy một usable `Mã Giảm Giá` control. | `test-results/fr-17/fr17-chromium-corrected-20260810T092053847+0700/fr-17-fr-17-FR-17---Coupon-16fc0--Coupon-Management-controls-chromium/` | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Runtime auth đã xác nhận role khác admin; unchanged authorization assertion tái hiện FR17-R15 discrepancy. |

Mỗi evidence directory chứa `test-failed-1.png`, `trace.zip` và `error-context.md`. TC-008 và TC-011 là candidate mới của corrected Chromium run; việc hai case này PASS trên Firefox/WebKit được giữ nguyên trong final cross-browser comparison.

## Correction and Demo Verification

| Field | Result |
| --- | --- |
| TC-003 Valid Percent CREATE | `PASS` |
| TC-003 Exact Owned Row | `PASS` |
| TC-003 Percent Type | `PASS` |
| TC-003 Submitted Discount Value | `PASS` |
| TC-003 Cleanup | `PASS` |
| Removed Out-of-Scope Locale Assertion | Không gây failure |
| TC-003 Runtime Correction | `TC003_RUNTIME_CORRECTION_VERIFIED_CHROMIUM` |
| TC-004 Setup / Create / Row / Boundary / Cleanup | `PASS` |
| Corrected `getCouponRow` Path Exercised | `YES` |
| Primary DEMO_FIX | `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM` |

## Database, Report and Integrity Gates

| Gate | Result |
| --- | --- |
| Isolated Coupon Count | `PASS` — `4` |
| Exact Code Set | `PASS` — `BIGBUY`, `EXPIRED`, `SAVE10`, `VIP100` |
| FR17-Owned Residue | `0` |
| Workspace DB SHA-256 | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` — `PASS` |
| HTML Report | `PASS_RENDERED` — visible `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID và `chromium` |
| Original Failure Screenshots / Traces | `4 / 4` |
| Test Spec SHA-256 | `56CCE230A3D26C0BF2A006BCE4DECC5B492D335D895C1ED0D33285627DBDB9B0` — unchanged |
| UI Helper SHA-256 | `7610B881E6F2B049BE7426C9B04E585CBBF9FD750111F5AA4CE60AE5C28371DB` — unchanged |
| `AUTOMATION_DEFECT` | None |
| `ENVIRONMENT_FAILURE` | None |

Adaptive post-Chromium gate: `PASS`; Firefox execution was permitted. Historical A-018 run/evidence was not overwritten.
