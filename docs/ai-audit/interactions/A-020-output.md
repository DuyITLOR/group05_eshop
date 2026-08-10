1. Execution Status: `COMPLETED_CORRECTED_MULTI_BROWSER_EXECUTION_WITH_PRODUCT_DEFECT_CANDIDATES`.

2. Original Chromium Historical Run: `fr17-chromium-20260810T084402107+0700` — preserved unchanged (`16 total / 13 passed / 3 failed`); historical TC-003 automation failure is excluded from final metrics.

3. Corrected Chromium Run ID: `fr17-chromium-corrected-20260810T092053847+0700`.

4. Corrected Chromium Total / Passed / Failed / Skipped: `16 / 12 / 4 / 0` (`33.5s`).

5. Corrected Chromium Failed IDs: `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`.

6. Corrected Chromium Classifications: all four are `PRODUCT_DEFECT_CANDIDATE` with `HIGH` confidence.

7. TC-003 Corrected Chromium Result: `PASS` — `TC003_RUNTIME_CORRECTION_VERIFIED_CHROMIUM`; valid percent create, exact row, type, discount and cleanup passed.

8. Firefox Run ID: `fr17-firefox-20260810T092258944+0700`.

9. Firefox Total / Passed / Failed / Skipped: `16 / 14 / 2 / 0` (`30.8s`).

10. Firefox Failed IDs: `FR17-TC-002`, `FR17-TC-016`.

11. Firefox Classifications: both are `PRODUCT_DEFECT_CANDIDATE` with `HIGH` confidence.

12. TC-003 Firefox Result: `PASS` — `TC003_RUNTIME_CORRECTION_VERIFIED_FIREFOX`.

13. WebKit Run ID: `fr17-webkit-20260810T092419436+0700`.

14. WebKit Total / Passed / Failed / Skipped: `16 / 14 / 2 / 0` (`33.4s`).

15. WebKit Failed IDs: `FR17-TC-002`, `FR17-TC-016`.

16. WebKit Classifications: both are `PRODUCT_DEFECT_CANDIDATE` with `HIGH` confidence.

17. TC-003 WebKit Result: `PASS` — `TC003_RUNTIME_CORRECTION_VERIFIED_WEBKIT`.

18. Final Product Defect Candidate IDs: `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016`.

19. Remaining Automation Defect IDs: None.

20. Needs More Evidence IDs: None.

21. Environment Failure IDs: None.

22. Candidate Screenshot Preservation Result: `PASS` — primary A-018 TC-002/TC-016 files were not overwritten; corrected reproduction paths were added. New TC-008/TC-011 screenshots were copied byte-for-byte from their first corrected Chromium failures.

23. Original Historical Evidence Preservation: `PASS` — the 43-file A-018 set remains present; A-018 prompt, output, execution record and primary screenshot hashes remain unchanged.

24. Final HTML Report Verification: Chromium, Firefox and WebKit are all `PASS_RENDERED`; each visibly includes `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID and browser identity.

25. Isolated DB Cleanup Result: `PASS` — final count `4`, exact codes `BIGBUY`, `EXPIRED`, `SAVE10`, `VIP100`, FR17-owned residue `0`; isolated backend remains HTTP `200` on PID `34940`.

26. Workspace DB Protection Result: `PASS` — SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.

27. TC-004 Chromium Result: `PASS` — setup, create, corrected row lookup, assertions, approved boundaries and cleanup passed.

28. TC-004 Firefox Result: `PASS` with the same complete demo flow.

29. TC-004 WebKit Result: `PASS` with the same complete demo flow.

30. Final Demo Test: `FR17-TC-004`.

31. Demo Runtime Status: `VERIFIED_MULTI_BROWSER`; recording command is `READY_AFTER_FINAL_FEATURE_REVIEW` and was not executed.

32. Primary DEMO_FIX: FR-17 `getCouponRow` relative-locator correction — `TEST_SCRIPT_CORRECTION`, `VERIFIED_MULTI_BROWSER`.

33. Secondary Runtime Correction: `FR17-TC-003 assertion-scope / locale-independence correction` — `VERIFIED_MULTI_BROWSER`.

34. Final Failure Set Result: `PARTIALLY_OVERLAPPING` — TC-002/TC-016 reproduce on all engines; TC-008/TC-011 fail only on corrected Chromium and pass on Firefox/WebKit.

35. Files Created: corrected Chromium, Firefox and WebKit execution records; three run-specific HTML/result directories and six raw logs; candidate screenshots `FR17-TC-008.png` and `FR17-TC-011.png`; A-020 prompt/output evidence.

36. Files Modified: `docs/execution-results/fr-17-cross-browser-summary.md`, `docs/defects/fr-17/candidate-screenshots/README.md`, `docs/demo/fr-17-demo-plan.md`, and `docs/ai-audit/AI_AUDIT_LOG.md`. Tests, config, SUT and databases were not modified by this execution phase.

37. AI Audit Artifact: `A-020` — `PENDING_HUMAN_REVIEW`; Verdict unset; Approval Status `PENDING`. Finalized audit summary remains `19` artifacts: `10 VALID`, `0 INVALID`, `9 INCOMPLETE`; pending A-020 is excluded.

38. Current Checkpoint: `CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-52|note=[Applied HW04 execution gates and append-only audit constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
