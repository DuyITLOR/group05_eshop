1. **Build Status:** `BUILT_PENDING_HUMAN_REVIEW`.
2. **Approved Test Cases:** 16 (`FR17-TC-001`–`FR17-TC-016`).
3. **Implemented Playwright Tests:** 16.
4. **Missing Test Case IDs:** None.
5. **Duplicate Test Case IDs:** None.
6. **External Dataset Count:** 15 logical datasets in `test-data/fr-17.json`.
7. **Stateful Automation Count:** 12 (`FR17-TC-003`–`FR17-TC-014`).
8. **Read-Only Automation Count:** 4 (`FR17-TC-001`, `FR17-TC-002`, `FR17-TC-015`, `FR17-TC-016`).
9. **Admin Auth Strategy:** Runtime-only API login, verified `admin` role, then fresh browser `adminToken` state.
10. **Non-Admin Auth Strategy:** Runtime-only API login, verified role is not `admin`, then an otherwise fresh browser `adminToken` state.
11. **Isolated DB Strategy:** Future stateful execution must launch from a run-specific copied backend directory with its own `database.sqlite`; direct fixtures require `FR17_ISOLATED_DB=true` and an existing `FR17_TEST_DB_PATH`.
12. **Workspace DB Guard:** Direct SQLite helpers resolve and explicitly reject the workspace `backend/database.sqlite`; they fail closed with `AUTOMATION_SETUP_OR_CLEANUP_RISK`.
13. **Cleanup Strategy:** Exact owned-code cleanup runs in `finally`; TC-014 only inserts/deletes an owned isolated record; seed coupons are never deletion targets.
14. **Assertion Patterns:** `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION`, `ATTRIBUTE_OR_SEMANTIC_STATE`.
15. **Primary Demo Test:** `FR17-TC-004`.
16. **Demo Tag:** `@demo`.
17. **Secondary Demo Candidates:** `FR17-TC-003`, `FR17-TC-014`.
18. **Demo Command Status:** `DRAFT_NOT_RUNTIME_VERIFIED` — `FEATURE_ID=FR-17 playwright test tests/fr-17 --grep "@demo"` was not run.
19. **DEMO_FIX_CANDIDATE:** `NO`; fallback genuine script correction remains FR-05 TC-006.
20. **Static Validation Result:** `PASSED` — JavaScript syntax, JSON parse, side-effect-free helper imports, 16 unique title IDs, data coverage and policy scans passed.
21. **Browser Execution Performed:** `NO`.
22. **Database Mutation Performed:** `NO`.
23. **Automation Plan:** Created at `docs/automation-plans/fr-17-automation-plan.md`.
24. **AI Review:** Created at `docs/automation-reviews/fr-17-ai-review.md`; runtime matters remain `NEEDS_MORE_EVIDENCE`.
25. **Automation Gaps:** Created at `docs/gaps/fr-17-automation-gaps.md`; 11 approved requirement gaps remain separate from automation risks.
26. **Files Created:** `test-data/fr-17.json`; `tests/fr-17/`; FR-17 automation plan, review, gaps; A-016 verbatim interaction files.
27. **Files Modified:** `playwright.config.js`; `docs/demo/fr-17-demo-plan.md`; `docs/ai-audit/AI_AUDIT_LOG.md`.
28. **AI Audit Artifact:** `A-016` created with `PENDING_HUMAN_REVIEW`; no Verdict has been assigned.
29. **Current Checkpoint:** `CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-50|note=[Used HW04 scope and workflow constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
