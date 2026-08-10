1. Execution Status: `STOPPED_AT_CHROMIUM_AUTOMATION_DEFECT_GATE`. Chromium business run completed once; the earlier `npx.cmd EINVAL` launcher diagnostic started no browser and is excluded from metrics.

2. Chromium Run ID: `fr17-chromium-20260810T084402107+0700`

3. Chromium Total / Passed / Failed / Skipped: `16 / 13 / 3 / 0`

4. Chromium Failed IDs: `FR17-TC-002`, `FR17-TC-003`, `FR17-TC-016`

5. Chromium Failure Classifications: `FR17-TC-002 → PRODUCT_DEFECT_CANDIDATE`; `FR17-TC-003 → AUTOMATION_DEFECT`; `FR17-TC-016 → PRODUCT_DEFECT_CANDIDATE`

6. Firefox Execution Status: `NOT_EXECUTED_BLOCKED_BY_CHROMIUM_AUTOMATION_DEFECT`

7. Firefox Run ID: N/A

8. Firefox Total / Passed / Failed / Skipped: N/A — not executed

9. Firefox Failed IDs: None — not executed

10. Firefox Failure Classifications: None — not executed

11. WebKit Execution Status: `NOT_EXECUTED_BLOCKED_BY_CHROMIUM_AUTOMATION_DEFECT`

12. WebKit Run ID: N/A

13. WebKit Total / Passed / Failed / Skipped: N/A — not executed

14. WebKit Failed IDs: None — not executed

15. WebKit Failure Classifications: None — not executed

16. Product Defect Candidate IDs: `FR17-TC-002`, `FR17-TC-016`

17. Automation Defect IDs: `FR17-TC-003` — locale-dependent and out-of-primary-scope min-order display assertion caused a false failure after successful percent create.

18. Needs More Evidence IDs: None

19. Environment Failure IDs: None

20. Candidate Screenshots Preserved: `2` byte-identical Chromium copies for TC-002 and TC-016.

21. Original Failure Screenshots Preserved: `3`

22. Trace Evidence Preserved: `3`

23. HTML Report Verification: Chromium `PASS_RENDERED`; Firefox/WebKit `NOT_GENERATED`.

24. Isolated DB Cleanup Result: `PASS` — exactly four records remain: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; no FR17-owned residue.

25. Workspace DB Protection Result: `PASS` — SHA-256 remains `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.

26. TC-004 Chromium Result: `PASS` — setup, corrected row-locator assertions and cleanup passed.

27. TC-004 Firefox Result: `NOT_EXECUTED_BLOCKED_BY_GATE`

28. TC-004 WebKit Result: `NOT_EXECUTED_BLOCKED_BY_GATE`

29. Final Demo Test Status: `PENDING_HUMAN_REVIEW`

30. DEMO_FIX Candidate: `FR-17 getCouponRow relative-locator correction` — `TEST_SCRIPT_CORRECTION`

31. DEMO_FIX Runtime Verification: `PARTIALLY_VERIFIED` — `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM`; multi-browser verification is not claimed.

32. Cross-Browser Failure Set Result: `NOT_AVAILABLE_EXECUTION_STOPPED_AT_CHROMIUM_GATE`

33. Files Created: `docs/execution-results/fr-17-chromium-execution.md`; `docs/execution-results/fr-17-cross-browser-summary.md`; `docs/defects/fr-17/candidate-screenshots/README.md`; two candidate PNG copies; Chromium HTML/result evidence directories; runtime launcher/logs; `docs/ai-audit/interactions/A-018-prompt.md`; `docs/ai-audit/interactions/A-018-output.md`.

34. Files Modified: `docs/demo/fr-17-demo-plan.md`; `docs/ai-audit/AI_AUDIT_LOG.md`; isolated runtime DB was exercised and restored to its exact logical baseline. Test code, SUT source and workspace DB were not modified.

35. AI Audit Artifact: `A-018` — `PENDING_HUMAN_REVIEW`; Verdict unset; Approval Status `PENDING`.

36. Current Checkpoint: `CHECKPOINT: FR17_CHROMIUM_AUTOMATION_REVIEW_REQUIRED`

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-52|note=[Applied HW04 audit workflow and append-only evidence constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
