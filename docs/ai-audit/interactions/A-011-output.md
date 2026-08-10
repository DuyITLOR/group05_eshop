1. **Approved Test Case Count:** 16.

2. **Implemented Playwright Test Count:** 16 unique tests, `FR09-TC-001` through `FR09-TC-016`; minimum `16 >= 12` — `PASS`.

3. **READY_FOR_AUTOMATION Count:** 1 — `FR09-TC-013`.

4. **READY_WITH_SETUP Count:** 15.

5. **BLOCKED_BY_SETUP Count:** 0.

6. **BLOCKED_BY_IMPLEMENTATION Count:** 0. Expected product failures remain executable tests.

7. **External Data Sets:** 13 logical datasets in `test-data/fr-09.json`: four documented coupons, existing Keychron cart/total, four approved boundary totals, absent code, inactive state and two usage-limit states.

8. **Auth Fixture Strategy:** Runtime-only `SUT_API_BASE_URL`, `FR09_TEST_USER_EMAIL` and `FR09_TEST_USER_PASSWORD`; login API returns JWT/user identity, token is injected into a fresh browser page. No credential or JWT is source-controlled.

9. **Cart Fixture Strategy:** Normal total `4000000` uses `Bàn phím cơ Keychron Q1` through Home/Cart UI. Totals `299999`, `300000`, `500001`, `100001` use scoped frontend product interception, with UI-driven add-to-cart and coupon application; no database product is created.

10. **DB Isolation Strategy:** TC-010/014/015 require a run-specific backend/SQLite copy. The fixture rejects workspace `backend/database.sqlite`, requires `FR09_ISOLATED_DB=true`, mutates only owned rows and restores exact prior usage state in `finally`. FR-09 config uses one worker to prevent DB overlap without serial-suite skip propagation.

11. **Stateful Tests:** 3 — `FR09-TC-010`, `FR09-TC-014`, `FR09-TC-015`. TC-014 keeps total `4000000`; TC-015 asserts `100000` discount and `3900000` final amount.

12. **Assertion Patterns:** `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `TEXT_OR_VALUE`, `STATE_TRANSITION`, `CALCULATION`, `PERMISSION`, `URL_OR_NAVIGATION`, `COUNT`.

13. **Screenshot Policy:** `only-on-failure` — configured.

14. **Trace Policy:** `retain-on-failure` — configured. Video remains off.

15. **HTML Report Compatibility:** `PASS`. Config supports visible `FR-09`, `Run by: 23127107`, ISO timestamp, Run ID and browser identity while preserving three explicit browser engines.

16. **Static Validation Result:** `PASS` — JavaScript syntax, imports, JSON parsing, 5 monetary parser formats, 16/16 sequential ID traceability, dataset mapping, config identity and prohibited-shortcut scans passed. Workspace DB hash was unavailable because the file was already locked; no DB fixture/mutation command was invoked.

17. **Automation Review Findings:** 10 findings recorded: 9 `MODIFIED`, 1 locator risk `NEEDS_MORE_EVIDENCE`; TC-012 same-document navigation also remains runtime evidence-sensitive. The artifact is not self-approved.

18. **Remaining Automation Gaps:** 7 preserved requirement gaps and 4 documented runtime-readiness risks. No approved test is unimplemented or blocked. Known implementation discrepancies were not mislabeled as automation gaps.

19. **Files Created:**

    - [fr-09.spec.js](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/tests/fr-09/fr-09.spec.js)
    - [fr-09-helpers.js](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/tests/fr-09/helpers/fr-09-helpers.js)
    - [fr-09-fixtures.js](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/tests/fr-09/fixtures/fr-09-fixtures.js)
    - [fr-09.json](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/test-data/fr-09.json)
    - [fr-09-automation-plan.md](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/docs/automation-plans/fr-09-automation-plan.md)
    - [fr-09-ai-review.md](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/docs/automation-reviews/fr-09-ai-review.md)
    - [fr-09-automation-gaps.md](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/docs/gaps/fr-09-automation-gaps.md)
    - `docs/ai-audit/interactions/A-011-prompt.md`
    - `docs/ai-audit/interactions/A-011-output.md`

20. **Files Modified:**

    - [playwright.config.js](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/playwright.config.js)
    - [AI_AUDIT_LOG.md](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/docs/ai-audit/AI_AUDIT_LOG.md)

21. **Browser Execution Performed:** `NO`. Không chạy Playwright suite, Chromium, Firefox, WebKit hoặc tạo runtime report/evidence.

22. **Current Checkpoint:** `CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED`

AI Audit: `A-011` được tạo với `PENDING_HUMAN_REVIEW`, Verdict unset và Approval Status `PENDING`. Audit summary vẫn tính 10 finalized artifacts: 4 `VALID`, 0 `INVALID`, 6 `INCOMPLETE`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-48|note=[Applied HW04 automation and audit workflow boundaries]
MEMORY.md:50-50|note=[Kept FR-09 as the approved Pool B feature]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
</rollout_ids>
</oai-mem-citation>
