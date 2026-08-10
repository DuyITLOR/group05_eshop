# FR-09 Automation Gaps and Documented Risks

## Status Summary

Không approved test case nào bị bỏ hoặc blocked. 16/16 cases có executable Playwright scripts và đã chạy trên Chromium, Firefox, WebKit. Bảy requirement gaps bên dưới vẫn mở; runtime-readiness risks đã được giải quyết trong approved execution.

## Requirement Gaps

| Gap ID | Classification | Affected Test Cases | Reason | Current Automation Boundary | Recommended Next Step |
| --- | --- | --- | --- | --- | --- |
| FR09-GAP-001 | `REQUIREMENT_GAP` | All apply outcomes | Exact success/error UI copy chưa được định nghĩa. | Assert applied/rejected state và amounts, không assert exact copy. | Chỉ thêm copy assertion khi authoritative UI contract được approve. |
| FR09-GAP-002 | `DEFERRED_REQUIREMENT` | Expiry boundary | Expiry timezone chưa được định nghĩa. | Dùng documented past/future partitions; không test exact timestamp boundary. | Xác nhận timezone/parsing policy. |
| FR09-GAP-003 | `DEFERRED_REQUIREMENT` | Percent calculations | Fractional percent rounding chưa được định nghĩa. | Dùng integer-result datasets. | Xác nhận round/floor/decimal policy trước fractional cases. |
| FR09-GAP-004 | `DEFERRED_REQUIREMENT` | TC-014, TC-015 | Usage increment timing chưa được định nghĩa. | Test exact pre-state only; không complete Checkout hoặc assert persistence transition. | Xác nhận consume point và transaction semantics. |
| FR09-GAP-005 | `REQUIREMENT_GAP` | Coupon input | Empty input, trimming và case sensitivity chưa được định nghĩa. | Không tạo/assert các behavior này. | Bổ sung normalization/input-validation contract nếu cần coverage. |
| FR09-GAP-006 | `REQUIREMENT_GAP` | Coupon lifecycle | Stacking, replacement và removal chưa được định nghĩa. | Mỗi test apply tối đa một coupon. | Bổ sung lifecycle rules trước khi tạo cases. |
| FR09-GAP-007 | `REQUIREMENT_GAP` | Apply error handling | Network recovery chưa được định nghĩa. | Không intercept network failure như một business case. | Xác nhận retry/recovery/presentation contract. |

## Runtime Readiness Risks

| Gap ID | Classification | Affected Test Cases | Reason | Attempted Approach | Remaining Blocker | Recommended Next Step |
| --- | --- | --- | --- | --- | --- | --- |
| FR09-RISK-001 | `DOCUMENTED_RISK` | TC-001–012, 014–016 | Auth credentials không được source control. | Environment-only API login fixture đã implement. | Runtime values chưa được supplied/verified trong build phase. | Execution Readiness xác nhận local test-user credentials và JWT response. |
| FR09-RISK-002 | `DOCUMENTED_RISK` | TC-010, 014, 015 | Stateful setup phải chạy trên DB copy mà backend thực sự đang dùng. | Fixture có path/confirmation guards, exact-row mutation và restoration. | Run-specific backend copy/start procedure chưa được runtime-verified. | Readiness tạo backend copy, start tại port 3000, set matching `FR09_TEST_DB_PATH`, verify workspace DB hash unchanged. |
| FR09-RISK-003 | `DOCUMENTED_RISK` | TC-012 | Same-document navigation giữ in-memory cart nhưng cần browser evidence. | History API navigation fixture đã implement. | Chromium/Firefox/WebKit behavior chưa chạy. | Verify during approved multi-browser execution; classify automation defect before product defect if setup fails. |
| FR09-RISK-004 | `DOCUMENTED_RISK` | TC-013 | Direct-route denial may be represented by redirect, unavailable controls or disabled action across engines. | Existing EShop shell link and `main` provide a deterministic render gate before mechanism-neutral usability evaluation. | Cross-browser access behavior has not run. | Keep `NEEDS_MORE_EVIDENCE` until approved Chromium/Firefox/WebKit execution. |

Error-region presentation is `OPTIONAL_EVIDENCE_LOCATOR` only. Generic negative correctness does not depend on its presence, selector or exact copy, so it is not an automation gap.

## Known Product Discrepancies Not Classified as Automation Gaps

- Missing JWT enforcement/body-supplied `user_id`.
- Usage-check bypass without identity.
- `>` instead of `>=` for minimum total.
- Incorrect percent formula.
- Unguarded Checkout route.
- Editable checkout total.
- Non-atomic usage recording.

Automation giữ authoritative assertions. Approved runtime execution đã xác nhận năm underlying `PRODUCT_DEFECT` IDs; mapping final nằm tại `docs/execution-results/fr-09-final-summary.md`.

## Screenshot Promotion Rule

After future human-approved failure classification only, promote the original Playwright failure screenshot to `docs/defects/fr-09/screenshots/<DefectID>.png` for `PRODUCT_DEFECT`. Do not promote `AUTOMATION_DEFECT` evidence.

## Runtime Risk Resolution

| Risk ID | Final Status | Evidence |
| --- | --- | --- |
| `FR09-RISK-001` | `RESOLVED` — runtime-only auth inputs/JWT readiness verified without source-controlled secrets. | `docs/execution-readiness/fr-09-execution-readiness.md` |
| `FR09-RISK-002` | `RESOLVED` — isolated backend DB verified; cleanup passed; workspace DB hash unchanged. | `docs/execution-results/fr-09-cross-browser-summary.md` |
| `FR09-RISK-003` | `RESOLVED` — TC-012 setup worked on all three engines; product defect confirmed. | `docs/defects/fr-09/FR09-BUG-003-missing-coupon-authentication.md` |
| `FR09-RISK-004` | `RESOLVED` — TC-013 deterministic render gate worked on all three engines; product defect confirmed. | `docs/defects/fr-09/FR09-BUG-004-unguarded-checkout-coupon-flow.md` |

Remaining automation defects: 0. Remaining `NEEDS_MORE_EVIDENCE`: 0. Open requirement gaps: 7.

## Current Checkpoint

`CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED`
