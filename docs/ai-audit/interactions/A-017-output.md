1. **Readiness Status:** `READY_FOR_EXECUTION`.
2. **Web Admin Status:** `HEALTHY`; started by readiness.
3. **Web Admin URL:** `http://localhost:5174`.
4. **Web Admin PID:** `21808`.
5. **Backend Status:** `HEALTHY_ISOLATED`; started from the FR-17 run-specific backend copy.
6. **Backend PID:** `34940`.
7. **Isolated Backend Directory:** `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend`.
8. **Isolated DB Path:** `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend\database.sqlite`.
9. **Workspace DB Forbidden Path:** `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite`.
10. **Workspace DB Protection Result:** `PASS`; before/final SHA-256 remained `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.
11. **Exact Coupon Baseline Result:** `PASS` — exactly 4 records: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`.
12. **Required Schema Result:** `PASS` — `coupons`/`users` and all fixture/auth columns are present.
13. **Admin Auth Result:** `PASS` — HTTP 200, token and identity returned, role exactly `admin`.
14. **Non-Admin Auth Result:** `PASS` — HTTP 200, token and identity returned, role `user` and not `admin`.
15. **Runtime Environment Result:** `PASS`; all 11 required variables were resolvable during readiness, with credentials kept runtime-only and omitted from artifacts.
16. **Total Test Case IDs:** 16.
17. **Chromium Collected:** 16.
18. **Firefox Collected:** 16.
19. **WebKit Collected:** 16.
20. **Total Project-Test Definitions:** 48.
21. **Demo Test ID:** `FR17-TC-004`.
22. **Demo Project-Test Definitions:** 3.
23. **Demo Command Collection Result:** `PASS`.
24. **DEMO_FIX Candidate:** `FR-17 getCouponRow relative-locator correction`.
25. **DEMO_FIX Static Wiring:** `VERIFIED`.
26. **DEMO_FIX Runtime Verification:** `PENDING`.
27. **Workers Result:** `PASS` — FR-17 uses `workers=1`.
28. **Evidence Policy Result:** `PASS` — screenshot `only-on-failure`, trace `retain-on-failure`, video `off`, retries `0`; no FR-17 evidence directory was generated.
29. **Report Identity Readiness:** `PASS` — config supports `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID and browser identity.
30. **Browser Execution Performed:** `NO`.
31. **Database Business Mutation Performed:** `NO`.
32. **Readiness Document:** `docs/execution-readiness/fr-17-execution-readiness.md`.
33. **AI Audit Artifact:** `A-017` created with `PENDING_HUMAN_REVIEW`; Verdict unset and Approval Status `PENDING`.
34. **Current Checkpoint:** `CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-52|note=[Used HW04 runtime and append-only audit constraints]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
019fe45b-dd94-73f1-9ca6-0c6a8d4e32cd
</rollout_ids>
</oai-mem-citation>
