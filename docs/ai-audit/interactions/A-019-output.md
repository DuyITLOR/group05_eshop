1. Correction Status: `CORRECTED_PENDING_HUMAN_REVIEW`

2. Affected Test Case: `FR17-TC-003`

3. Original False-Failure Cause: Generic `expectOwnedCouponRow()` asserted locale-dependent min-order display through `Number(...).toLocaleString()`, outside TC-003's primary approved scope, after valid percent CREATE had already succeeded.

4. Corrected TC-003 Assertion Scope: exact owned-row count `1`; row visible; displayed type corresponds to `percent`; submitted `discount_value` displayed correctly. Min-order, max-use and expiry display are not TC-003 PASS/FAIL oracles.

5. TC-004 Preservation Result: `PASS` — remains the sole `@demo` test and still verifies fixed `discount_value=1`, `min_order_amount=0` and `max_uses_per_user=1` through core plus explicit boundary assertions.

6. Locale-Independent Assertion Result: `PASS` — no `toLocaleString()` remains in the FR-17 row assertion path. TC-004's single-digit `0` and `1` values are asserted directly without inventing a general currency-formatting rule.

7. Primary DEMO_FIX Candidate: `FR-17 getCouponRow relative-locator correction`; Type `TEST_SCRIPT_CORRECTION`; Runtime Verification `PARTIALLY_VERIFIED`; Chromium `VERIFIED`.

8. Secondary Runtime Automation Correction: `FR17-TC-003 assertion-scope / locale-independence correction`; Type `TEST_SCRIPT_CORRECTION`; runtime verification not executed pending human review.

9. Total Playwright Tests: `16`

10. Missing IDs: None

11. Duplicate IDs: None

12. Static Validation Result: `PASS` — syntax, ID inventory, TC-003/TC-004 wiring, TC-005 duplicate oracle, TC-002 visible-indicator logic, relative `getCouponRow`, workspace DB guard and prohibited-shortcut checks all passed.

13. Browser Execution Performed: `NO`

14. Database Mutation Performed: `NO`

15. A-018 Evidence Preservation: `PASS` — 43 immutable files retained aggregate manifest SHA-256 `4A7CBF716A12EBC41F2C888A016988FE13366199346895F2F44B4A1FEE60DAF3`; workspace DB SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.

16. Files Modified: `tests/fr-17/helpers/coupon-ui.js`; `tests/fr-17/fr-17.spec.js`; `docs/automation-reviews/fr-17-ai-review.md`; `docs/automation-plans/fr-17-automation-plan.md`; `docs/gaps/fr-17-automation-gaps.md`; `docs/demo/fr-17-demo-plan.md`; `docs/ai-audit/AI_AUDIT_LOG.md`. Approved test design, test data, Playwright config, SUT and A-018 execution artifacts were not modified.

17. AI Audit Artifact: `A-019` — `PENDING_HUMAN_REVIEW`; Verdict unset; Approval Status `PENDING`. Verbatim evidence: `docs/ai-audit/interactions/A-019-prompt.md` and `A-019-output.md`.

18. Current Checkpoint: `CHECKPOINT: FR17_TC003_AUTOMATION_CORRECTION_REVIEW_REQUIRED`

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-52|note=[Applied HW04 correction gates and append-only audit constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
