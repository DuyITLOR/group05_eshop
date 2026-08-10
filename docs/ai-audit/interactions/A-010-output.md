1. Requirement Sources

2 `AUTHORITATIVE` (`README.md` FR-09 và phần FR-08 trực tiếp liên quan), 1 `SUPPORTING` (`api_specification.md` 5.1), 4 `IMPLEMENTATION_ONLY` source groups.

2. Extracted Atomic Requirements

12 `INTERNAL_TRACEABILITY_ID`: coupon UI; existence; active status; expiry; minimum total; valid JWT; per-user usage limit; percent discount; fixed discount; final amount; Checkout authentication; trusted checkout total.

3. Requirement Gaps

8 open gaps: exact UI copy, expiry timezone, percent rounding, usage increment timing, input normalization, stacking/remove/replace, network recovery và setup/reset protocol.

4. Implementation Discrepancies

8 observations, gồm missing JWT enforcement, user-supplied `user_id`, usage-check bypass, `>` thay vì `>=`, percent formula sai, unguarded Checkout route, editable total và non-atomic usage recording.

5. Test Conditions

16 atomic test conditions.

6. Total Test Cases

16.

7. POSITIVE Count

6.

8. NEGATIVE Count

5.

9. EDGE Count

5.

10. Automation Suitable Count

1.

11. Automation Possible With Setup Count

15.

12. Not Automatable Count

0.

13. Automation Candidate Count

16.

14. Minimum Automation Candidate Result

`PASS` — 16 >= 13; Test Case Count cũng `PASS` — 16 >= 12.

15. Requirement Coverage Summary

12 `FULLY_COVERED`, 0 `PARTIALLY_COVERED`, 0 `NOT_COVERED`, 0 `NEEDS_CLARIFICATION`. Open gaps vẫn được giữ riêng và không biến thành invented cases.

16. Stateful Cases

3 `STATEFUL_SETUP_REQUIRED`: `FR09-TC-010`, `FR09-TC-014`, `FR09-TC-015`. Không có test-order dependency.

17. Existing Coupon Data Reused

`SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; existing 4000000-price seed product cho formula cases; read-only SQLite snapshot xác nhận `coupon_usage` hiện rỗng.

18. Future Controlled Setup Needed

Auth fixture, UI cart setup, controlled boundary totals, isolated inactive coupon fixture, isolated usage-count fixtures/rollback và observable applied/rejected UI contract.

19. Duplicate / Out-of-Scope Check

0 duplicate, 0 API-only, 0 unsupported-behavior cases, 0 test-order dependency; không chạy SUT hoặc mutate database.

20. Files Created

- `docs/test-cases/fr-09/requirement-analysis.md`
- `docs/test-cases/fr-09/test-cases.md`
- `docs/test-cases/fr-09/requirement-coverage.md`
- `docs/test-cases/fr-09/review-notes.md`
- `docs/ai-audit/interactions/A-010-prompt.md`
- `docs/ai-audit/interactions/A-010-output.md`

21. Files Modified

`docs/ai-audit/AI_AUDIT_LOG.md`

22. Current Checkpoint

`CHECKPOINT: FR09_TEST_DESIGN_BUNDLE_REVIEW_REQUIRED`

AI Audit: `A-010` được ghi với `PENDING_HUMAN_REVIEW`; Verdict chưa được đặt. Audit summary vẫn dựa trên 9 finalized artifacts trước đó.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-50|note=[Applied HW04 feature scope, audit, and minimum coverage boundaries]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
</rollout_ids>
</oai-mem-citation>
