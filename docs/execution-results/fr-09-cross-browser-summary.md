# FR-09 Cross-Browser Execution Summary

## Browser Totals

| Browser | Run ID | Total | Passed | Failed | Skipped | HTML Identity |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | 16 | 10 | 6 | 0 | `PASS_RENDERED` |
| Firefox | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | 16 | 10 | 6 | 0 | `PASS_RENDERED` |
| WebKit | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | 16 | 10 | 6 | 0 | `PASS_RENDERED` |
| **Total combinations** | — | **48** | **30** | **18** | **0** | — |

## Test Case Matrix

| Test Case ID | Chromium | Firefox | WebKit | Triage Summary |
| --- | --- | --- | --- | --- |
| `FR09-TC-001` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-002` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — percent discount formula |
| `FR09-TC-003` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — percent final amount |
| `FR09-TC-004` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-005` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-006` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — exact-minimum acceptance |
| `FR09-TC-007` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-008` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-009` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-010` | `PASS` | `PASS` | `PASS` | Pass nhất quán; isolated inactive-coupon cleanup thành công |
| `FR09-TC-011` | `PASS` | `PASS` | `PASS` | Pass nhất quán |
| `FR09-TC-012` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — coupon applied without JWT |
| `FR09-TC-013` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — unauthenticated functional Checkout controls |
| `FR09-TC-014` | `PASS` | `PASS` | `PASS` | Pass nhất quán; max-usage fixture cleanup thành công |
| `FR09-TC-015` | `PASS` | `PASS` | `PASS` | Pass nhất quán; max−1 fixture cleanup thành công |
| `FR09-TC-016` | `FAIL` | `FAIL` | `FAIL` | `PRODUCT_DEFECT_CANDIDATE` — editable Checkout total |

## Triage Summary

| Classification | Test Case IDs | Count |
| --- | --- | ---: |
| `PRODUCT_DEFECT_CANDIDATE` | FR09-TC-002, FR09-TC-003, FR09-TC-006, FR09-TC-012, FR09-TC-013, FR09-TC-016 | 6 |
| `AUTOMATION_DEFECT` | None | 0 |
| `NEEDS_MORE_EVIDENCE` | None sau runtime evidence | 0 |
| `ENVIRONMENT_FAILURE` | None | 0 |

Sáu failures nhất quán trên cả ba engines; không quan sát thấy browser-specific failure. Đây là execution-level candidates, chưa phải final confirmed defects, và chưa gán `FR09-BUG-xxx` ID.

## Special Runtime Risks Resolved for Review

- `FR09-TC-012`: same-document navigation giữ nguyên cart 4000000, không inject JWT, đã tới Checkout và coupon attempt được chấp nhận trên mọi engine. Runtime status: `PRODUCT_DEFECT_CANDIDATE`.
- `FR09-TC-013`: web-first shell/`main` render gate thành công trên mọi engine và unauthenticated coupon controls vẫn visible/enabled. Runtime status: `PRODUCT_DEFECT_CANDIDATE`.

## Evidence and State Integrity

| Check | Chromium | Firefox | WebKit | Overall |
| --- | --- | --- | --- | --- |
| Original failure screenshots | 6 | 6 | 6 | giữ lại 18 |
| Failure traces | 6 | 6 | 6 | giữ lại 18 |
| HTML report identity | `PASS` | `PASS` | `PASS` | Required identity được render rõ ràng |
| `coupon_usage` post-run | 0 | 0 | 0 | `PASS` |
| Workspace DB SHA-256 | unchanged | unchanged | unchanged | `PASS` |
| Isolated backend PID | 34568 | 34568 | 34568 | `HEALTHY` |

Chromium originals là primary persistent candidate screenshots vì đã cung cấp evidence rõ ràng. Firefox và WebKit originals vẫn nằm trong các run-specific result directories.

## Current Checkpoint

`CHECKPOINT: FR09_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED`
