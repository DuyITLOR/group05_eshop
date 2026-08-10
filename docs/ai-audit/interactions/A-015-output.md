Đã hoàn tất FR-17 Test Design Bundle và initial demo-candidate analysis bằng static review; không chạy SUT, browser, Playwright hoặc thay đổi database.

1. **Authoritative Requirement Sources:** `README.md` FR-17 (`AUTHORITATIVE`), FR-12 và FR-22 (`AUTHORITATIVE_CROSS_FEATURE`); SEC-02/SEC-03 (`SUPPORTING_REQUIREMENT`). `api_specification.md` là `SUPPORTING_CONTRACT`; frontend/backend/schema/seed là `IMPLEMENTATION_ONLY`.
2. **Detailed FR-17 Operations:** `VIEW`, `CREATE`, `DELETE`.
3. **Explicitly Out-of-Scope Operations:** `UPDATE` = `NOT_IN_DETAILED_REQUIREMENT_SCOPE`; không thiết kế activation/deactivation, filtering, pagination, code normalization, percent-max, future-expiry, stacking hay delete-dialog semantics.
4. **Extracted Atomic Requirements:** 16.
5. **Requirement Gaps:** 11 open documentation boundaries; 0 test case `NEEDS_CLARIFICATION`.
6. **Implementation Discrepancies:** 8 static observations, gồm thiếu server-side admin role guard, thiếu backend validation cho required/domain/numeric constraints, silent max-use default và thiếu required-field `*` indicators.
7. **Test Conditions:** 16 unique IDs (`FR17-TCND-001`–`FR17-TCND-016`).
8. **Total Test Cases:** 16 unique IDs (`FR17-TC-001`–`FR17-TC-016`).
9. **POSITIVE Count:** 5.
10. **NEGATIVE Count:** 8.
11. **EDGE Count:** 3.
12. **Automation Suitable Count:** 1.
13. **Automation Possible With Setup Count:** 15.
14. **Automation Candidate Count:** 16.
15. **Minimum Automation Candidate Result:** `PASS` — 16 >= 12; test-case gate cũng `PASS` — 16 >= 12.
16. **Stateful Test Count:** 11 — 1 `STATEFUL_CREATE_CLEANUP`, 10 `STATEFUL_SETUP_REQUIRED`.
17. **Read-Only Test Count:** 5.
18. **Requirement Coverage Result:** `PASS_WITH_OPEN_REQUIREMENT_GAPS`; 16 `FULLY_COVERED`, 0 `PARTIALLY_COVERED`, 0 `NOT_COVERED`, 0 `NEEDS_CLARIFICATION`.
19. **Primary Demo Candidates:** `FR17-TC-004` là `PRIMARY_DEMO_CANDIDATE`; `FR17-TC-001` và `FR17-TC-014` là `SECONDARY_DEMO_CANDIDATE`.
20. **Demo Candidate Rationale:** TC-004 có visible Admin form interaction, deterministic code-count transition 0 → 1, external-data path và cleanup tách khỏi primary objective. TC-001 là fallback read-only rõ ràng; TC-014 chứng minh DELETE bằng owned isolated record.
21. **Demo Plan Status:** `PENDING_HUMAN_REVIEW`; `Automation Build Status: NOT_BUILT`; `Runtime Status: NOT_EXECUTED`; `Final Selected Demo Test: PENDING`; `AI Fix Candidate: PENDING_REAL_HUMAN_REVIEW`. Audit A-015 được ghi với `Review Status: PENDING_HUMAN_REVIEW`, Verdict unset và `Approval Status: PENDING`.
22. **Files Created:** `docs/test-cases/fr-17/requirement-analysis.md`; `docs/test-cases/fr-17/test-cases.md`; `docs/test-cases/fr-17/requirement-coverage.md`; `docs/test-cases/fr-17/review-notes.md`; `docs/demo/fr-17-demo-plan.md`; `docs/ai-audit/interactions/A-015-prompt.md`; `docs/ai-audit/interactions/A-015-output.md`.
23. **Files Modified:** `docs/ai-audit/AI_AUDIT_LOG.md` — appended A-015 only; finalized audit summary remains 14 artifacts: 7 `VALID`, 0 `INVALID`, 7 `INCOMPLETE` because pending A-015 is excluded.
24. **Current Checkpoint:** `CHECKPOINT: FR17_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`.

Required user action: review the bundle and return an approval or requested corrections. Chưa được proceed sang test data, automation build hoặc execution.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-50|note=[Applied HW04 feature scope and test-design boundaries]
MEMORY.md:52-52|note=[Preserved append-only audit and verbatim interaction evidence]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
</rollout_ids>
</oai-mem-citation>
