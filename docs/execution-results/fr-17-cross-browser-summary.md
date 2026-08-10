# FR-17 Corrected Adaptive Multi-Browser Execution Summary

## Execution Status

`COMPLETED_CORRECTED_MULTI_BROWSER_EXECUTION_WITH_PRODUCT_DEFECT_CANDIDATES`

### Historical Run Kept Separate

| Field | Value |
| --- | --- |
| Historical Run ID | `fr17-chromium-20260810T084402107+0700` |
| Historical Result | `16 total / 13 passed / 3 failed / 0 skipped` |
| Historical Failed IDs | `FR17-TC-002`, `FR17-TC-003`, `FR17-TC-016` |
| Historical Automation Defect | `FR17-TC-003` |
| Historical Record | `docs/execution-results/fr-17-chromium-execution.md` — unchanged |
| Preservation | `PASS` — A-018 prompt/output, report/results, raw logs, record và original TC-002/TC-016 candidate screenshots retained |

Historical TC-003 failure không được tính vào final product-failure metrics.

## Final Corrected Execution Metrics

| Browser | Run ID | Timestamp | Duration | Total | Passed | Failed | Skipped | Failed IDs | Classification | HTML Report | Screenshots / Traces | DB Cleanup |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | --- |
| Chromium | `fr17-chromium-corrected-20260810T092053847+0700` | `2026-08-10T09:20:53.8479796+07:00` | `33.5s` | 16 | 12 | 4 | 0 | `TC-002`, `TC-008`, `TC-011`, `TC-016` | 4 × `PRODUCT_DEFECT_CANDIDATE` | `PASS_RENDERED` | `4 / 4` | `PASS` |
| Firefox | `fr17-firefox-20260810T092258944+0700` | `2026-08-10T09:22:58.9445917+07:00` | `30.8s` | 16 | 14 | 2 | 0 | `TC-002`, `TC-016` | 2 × `PRODUCT_DEFECT_CANDIDATE` | `PASS_RENDERED` | `2 / 2` | `PASS` |
| WebKit | `fr17-webkit-20260810T092419436+0700` | `2026-08-10T09:24:19.4360346+07:00` | `33.4s` | 16 | 14 | 2 | 0 | `TC-002`, `TC-016` | 2 × `PRODUCT_DEFECT_CANDIDATE` | `PASS_RENDERED` | `2 / 2` | `PASS` |

## Final Failure-Set Comparison

Result: `PARTIALLY_OVERLAPPING`

| Scope | Test Case IDs | Runtime Meaning |
| --- | --- | --- |
| Reproduced on all three engines | `FR17-TC-002`, `FR17-TC-016` | Stable cross-browser product defect candidates |
| Chromium-only final failures | `FR17-TC-008`, `FR17-TC-011` | Chromium accepted invalid numeric boundary records; Firefox/WebKit rejected them |
| Historical-only automation failure | `FR17-TC-003` | Corrected and PASS on all three engines; excluded from final failure set |

Final candidate union: `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`.

## Correction and Demo Runtime Verification

| Field | Chromium | Firefox | WebKit | Final Status |
| --- | --- | --- | --- | --- |
| TC-003 assertion-scope / locale-independence correction | `PASS` | `PASS` | `PASS` | `VERIFIED_MULTI_BROWSER` |
| TC-004 @demo overall | `PASS` | `PASS` | `PASS` | `VERIFIED_MULTI_BROWSER` |
| Primary `getCouponRow` DEMO_FIX | `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM` | `DEMO_FIX_RUNTIME_VERIFIED_FIREFOX` | `DEMO_FIX_RUNTIME_VERIFIED_WEBKIT` | `VERIFIED_MULTI_BROWSER` |

`FR17-TC-004` is the final selected demo test. Separate `--grep @demo` recording command was not executed; its status is `READY_AFTER_FINAL_FEATURE_REVIEW`.

## Final Safety and Evidence Status

| Field | Result |
| --- | --- |
| Product Defect Candidate IDs | `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016` |
| Remaining `AUTOMATION_DEFECT` | None |
| Remaining `NEEDS_MORE_EVIDENCE` | None |
| `ENVIRONMENT_FAILURE` | None |
| Isolated DB Final State | `PASS` — 4 coupons, exact set `BIGBUY`, `EXPIRED`, `SAVE10`, `VIP100`; no FR17-owned residue |
| Isolated Backend | `HEALTHY` — HTTP `200`, PID `34940` |
| Workspace DB Protection | `PASS` — SHA-256 `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Test Modification During Execution | `NO` — spec/helper hashes unchanged across all three runs |
| Candidate Screenshots | 4 byte-identical copies; original TC-002/TC-016 A-018 copies unchanged; new TC-008/TC-011 copied from corrected Chromium originals |
| Final Bug IDs | Not assigned in this phase |
| Current Checkpoint | `CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED` |

Không sửa SUT, approved Test Cases, Expected Results, test data hoặc automation code trong execution phase.
