1. Finalization Status: `COMPLETED_PENDING_HUMAN_REVIEW`.

2. Confirmed Failed Test Cases: `4` — `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`.

3. Confirmed Underlying Defect Count: `4`.

4. Defect ID Mapping: `FR17-BUG-001 ← FR17-TC-002`; `FR17-BUG-002 ← FR17-TC-008`; `FR17-BUG-003 ← FR17-TC-011`; `FR17-BUG-004 ← FR17-TC-016`. Historical `FR17-TC-003` remains an automation-correction record and has no Product Bug ID.

5. Bug Reports Created: `4` — `FR17-BUG-001-required-field-indicators.md`, `FR17-BUG-002-zero-discount-value.md`, `FR17-BUG-003-negative-minimum-order.md`, `FR17-BUG-004-non-admin-coupon-management-access.md`.

6. Screenshot Promotion Result: `PASS` — four promoted PNG files are byte/hash-identical to their candidate sources. BUG-001/004 use the first A-018 Chromium captures; BUG-002/003 use the first corrected-Chromium captures.

7. Original Evidence Preservation: `PASS` — historical/corrected browser reports, results, screenshots, traces, execution records and A-016/A-018/A-019/A-020 interaction evidence remain unchanged.

8. GitHub Issue Drafts Created: `4` under `docs/defects/fr-17/github-issues/`; no issue was published.

9. Severity / Priority Summary: `FR17-BUG-001 Low/P3`; `FR17-BUG-002 Medium/P2`; `FR17-BUG-003 Medium/P2`; `FR17-BUG-004 High/P1`.

10. Cross-Browser Defect Summary: `FR17-BUG-001` and `FR17-BUG-004` are `CROSS_BROWSER`; `FR17-BUG-002` and `FR17-BUG-003` are `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR`. No universal backend root cause was claimed for BUG-002/003.

11. Final Automation Metrics: `48` project-test combinations — `40 passed / 8 failed / 0 skipped`. Chromium `16/12/4/0`; Firefox `16/14/2/0`; WebKit `16/14/2/0`.

12. Remaining Automation Defects: `0`.

13. Needs More Evidence: `0`.

14. Final Traceability Result: `PASS_WITH_OPEN_REQUIREMENT_GAPS` — all four defect chains are complete; the existing `11` requirement gaps remain open.

15. Primary Demo Test: `FR17-TC-004`.

16. Demo Runtime Status: `VERIFIED_MULTI_BROWSER`.

17. Primary DEMO_FIX: FR-17 `getCouponRow` relative-locator correction (`TEST_SCRIPT_CORRECTION`).

18. Primary DEMO_FIX Runtime Verification: `VERIFIED_MULTI_BROWSER`.

19. Secondary Runtime Correction: `FR17-TC-003 assertion-scope / locale-independence correction` — `VERIFIED_MULTI_BROWSER`.

20. Demo Recording Checklist: created at `docs/demo/fr-17-demo-checklist.md`; command status `READY_NOT_EXECUTED`.

21. Recording Status: `NOT_RECORDED`.

22. GitHub Publication Status: `NOT_PUBLISHED`.

23. Browser Execution Performed: `NO`.

24. Database Mutation Performed: `NO`; workspace DB SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.

25. Files Created: 4 promoted screenshots, screenshot promotion manifest, 4 standardized Bug Reports, 4 GitHub Issue drafts, `fr-17-final-summary.md`, `fr-17-demo-checklist.md`, and A-021 prompt/output evidence (`17` files total).

26. Files Modified: `docs/demo/fr-17-demo-plan.md` and `docs/ai-audit/AI_AUDIT_LOG.md`. Tests, test data, Playwright config, SUT, databases and runtime evidence were not modified.

27. AI Audit Artifact: `A-021` — `PENDING_HUMAN_REVIEW`; Verdict unset; Approval Status `PENDING`. Finalized summary remains `20` artifacts (`11 VALID`, `0 INVALID`, `9 INCOMPLETE`); pending A-021 is excluded.

28. Current Checkpoint: `CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-52|note=[Applied HW04 finalization, evidence, demo, and audit constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
