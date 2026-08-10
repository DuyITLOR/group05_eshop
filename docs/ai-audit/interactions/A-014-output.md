1. Confirmed Failed Test Cases: **6** — `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013`, `FR09-TC-016`.
2. Confirmed Underlying Defect Count: **5**.
3. Defect ID Mapping: `FR09-BUG-001` ← TC-002 + TC-003; `FR09-BUG-002` ← TC-006; `FR09-BUG-003` ← TC-012; `FR09-BUG-004` ← TC-013; `FR09-BUG-005` ← TC-016.
4. Bug Reports Created: **5** — [FR09-BUG-001](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/FR09-BUG-001-percent-calculation.md>), [FR09-BUG-002](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/FR09-BUG-002-minimum-boundary.md>), [FR09-BUG-003](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/FR09-BUG-003-missing-coupon-authentication.md>), [FR09-BUG-004](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/FR09-BUG-004-unguarded-checkout-coupon-flow.md>), [FR09-BUG-005](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/FR09-BUG-005-editable-checkout-total.md>).
5. Screenshot Promotion Result: `PASS` — 5/5 promoted screenshots byte-identical với Chromium candidate sources. `FR09-BUG-001` chọn TC-002 làm primary; ảnh TC-002/TC-003 giống nhau và đều được bảo toàn.
6. Original Screenshot Preservation Result: `PASS` — giữ nguyên 6 candidate screenshots, 18 original failure screenshots và 18 traces; không recapture hoặc xóa evidence.
7. GitHub Issue Drafts Created: **5** tại [github-issues](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/defects/fr-09/github-issues/>); không publish.
8. Severity / Priority Summary: BUG-001 `High/P1`; BUG-002 `Medium/P2`; BUG-003 `High/P1`; BUG-004 `Medium/P2`; BUG-005 `High/P1`. Security/financial impact chỉ mô tả phạm vi runtime đã chứng minh.
9. Hashtag Summary: mọi report/draft có `#HW04 #BUG #FR09 #DiscountCoupon`, đủ `#Chromium #Firefox #WebKit #CrossBrowser`, severity/priority tag tương ứng và evidence-supported category tags.
10. Three-Browser Evidence Summary: Chromium `16/10/6/0`, Firefox `16/10/6/0`, WebKit `16/10/6/0`; cùng sáu failed IDs và năm underlying defects trên cả ba engines.
11. Final Automation Result: 16 approved, 16 automated, 0 blocked; 48 project-test combinations, 30 passed, 18 failed, 0 skipped. Chi tiết tại [final summary](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/execution-results/fr-09-final-summary.md>).
12. Remaining Automation Defects: **0**.
13. Remaining Needs More Evidence: **0** — TC-012 và TC-013 đã `RUNTIME_VERIFIED_MULTI_BROWSER`.
14. Final Traceability Result: `PASS_WITH_OPEN_REQUIREMENT_GAPS` — toàn bộ test/data/execution/defect/evidence mapping đầy đủ; 7 documented requirement gaps vẫn mở nhưng không block approved automation.
15. GitHub Publication Status: `NOT_PUBLISHED`.
16. Files Created: **18** — 5 Bug Reports, 5 promoted PNGs, 5 GitHub Issue drafts, `fr-09-final-summary.md`, `A-014-prompt.md`, `A-014-output.md`.
17. Files Modified: **4** — candidate screenshot manifest, `fr-09-ai-review.md`, `fr-09-automation-gaps.md`, `AI_AUDIT_LOG.md`. Không sửa tests, test data, Playwright config, SUT, database hoặc original execution evidence.
18. Browser Execution Performed: `NO` — không chạy Playwright, không mở browser và không reproduce defect trong finalization.
19. AI Audit Artifact: `A-014` — `Review Status: PENDING_HUMAN_REVIEW`, Verdict unset, `Approval Status: PENDING`; finalized audit summary vẫn là 13 artifacts (`VALID: 6`, `INVALID: 0`, `INCOMPLETE: 7`).
20. Current Checkpoint: `CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-50|note=[Applied HW04 feature scope and three-browser evidence requirements]
MEMORY.md:52-52|note=[Preserved append-only audit and verbatim interaction evidence]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
</rollout_ids>
</oai-mem-citation>
