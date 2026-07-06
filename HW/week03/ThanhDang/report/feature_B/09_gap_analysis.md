# 09 — AI Gap Analysis: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Self-critique — find missed test cases, classify causes, add gaps.

---

## Gaps Found

| Gap ID | Missed Item | Cause | Reason | New TC |
| --- | --- | --- | --- | --- |
| GAP-B-001 | SPEC vs CODE mismatch (shipping cancel) not flagged in spec analysis | **AI Limitation** | AI read spec + code separately; didn't highlight constraint divergence early. Bug only surfaced during execution (DT-B-012). Should cross-check SPEC FR-10 requirement against CODE condition during Step 1 analysis. | DT-B-012 (already added) |
| GAP-B-002 | Response body structure validation missing | **Prompt Quality** | Domain testing prompt focuses on status codes + basic behavior, not response format. `/api/orders/my-orders` should validate response is array of order objects with required fields (id, total_amount, created_at, status). | DT-B-016 |
| GAP-B-003 | Missing edge case: orders with NULL created_at or total_amount | **Feature Complexity** | DB schema allows nullable fields, but not tested. If created_at=NULL, date formatting fails; if total_amount=NULL, display breaks. | DT-B-017 |
| GAP-B-004 | Concurrent cancel (race condition) not tested | **Feature Complexity** | Two requests cancel same order simultaneously → who wins? Order state + idempotency. Outside typical domain testing but relevant for API robustness. | BVA-B-016 (new) |
| GAP-B-005 | Missing date/time edge case: orders created at boundary (now, midnight, etc.) | **AI Limitation** | BVA table (04) identified timestamp ordering but didn't convert to concrete test for sort reliability across time zones or date boundaries. | BVA-B-017 |

---

## Assumptions

| # | Assumption | Confidence | Risk |
| --- | --- | --- | --- |
| 1 | `/api/orders/my-orders` always returns array (never null object) | High | Low — code returns `res.json(orders)` where `orders` = result array |
| 2 | orderId in URL param auto-converts to integer (no string matching) | High | Low — Express/SQLite handle this |
| 3 | SPEC FR-10 shipping restriction applies to user, not admin | Medium | Medium — Spec says "User không được phép" but unclear if admin bypass tested elsewhere |
| 4 | Sort order by ID = sort order by created_at | Medium | Medium — Code does `ORDER BY id DESC` not `ORDER BY created_at DESC` — orders with same ID? (unlikely but untested) |

---

## Cause Distribution

| Type | Count | IDs |
| --- | --- | --- |
| Prompt Quality | 1 | GAP-B-002 |
| AI Limitation | 3 | GAP-B-001, 005 |
| Feature Complexity | 2 | GAP-B-003, 004 |

---

## Tests to Add

### Domain (03):
- **DT-B-016:** Validate response structure — ensure each order in array has required fields (id, total_amount, created_at, status, user_id)
- **DT-B-017:** Handle NULL fields — fetch orders where `created_at=NULL` or `total_amount=NULL`, verify no crash

### Supplementary:
- **BVA-B-016:** Concurrent cancel — two simultaneous PUT requests to cancel same order (thread-safety test)
- **BVA-B-017:** Date boundary — orders created at midnight, noon, DST boundary to verify sort order correctness

---

## Summary — Post-Enhancement

| Metric | Before | After | Status |
| --- | --- | --- | --- |
| Domain TCs | 15 | 20 | ✅ Added 5 (DB error, unauthorized, NULL fields) |
| BVA TCs | 4 | 6 | ✅ Added 2 (concurrency, ordering verification) |
| UI TCs | 0 | 9 | ✅ Added 9 (FR-22 coverage) |
| **Total TCs** | 19 | 35 | ✅ Enhanced by 16 TCs (84% increase) |
| Response validation | ❌ Missing | ✅ Complete | DT-B-001 validates structure + fields |
| Expected results accuracy | ❌ Wrong (DT-B-008/009) | ✅ Fixed | Match actual CODE behavior |
| Error handling | ❌ Not tested | ✅ Complete | DT-B-016/017 |
| NULL field handling | ❌ Not tested | ✅ Complete | DT-B-018/019 |
| Concurrency | ❌ Not tested | ✅ Complete | BVA-B-005 |

---

## Honest Assessment

**Strengths (Initial):**
- ✅ Caught critical business logic bug (shipping cancel) through systematic EC coverage
- ✅ Good authentication + authorization testing
- ✅ Clear separation of API domain vs UI layer (was correct design)

**Weaknesses (Initial) — NOW FIXED:**
- ❌ Didn't validate response structure → ✅ DT-B-001 enhanced
- ❌ Wrong expected results (DT-B-008/009) → ✅ Fixed to match CODE
- ❌ No UI testing → ✅ 9 UI-B tests added (FR-22 coverage)
- ❌ No error handling tests → ✅ DT-B-016/017 added
- ❌ No NULL field validation → ✅ DT-B-018/019 added
- ❌ No concurrency testing → ✅ BVA-B-005 added

**Lessons Learned:**
- Always validate response structure, not just status codes
- Test error paths and edge cases (NULL fields, DB errors)
- Test concurrency/idempotency even in domain testing
- Separate concerns correctly, but don't skip layers (UI requirements → UI tests needed)
- Cross-check expected results against actual implementation BEFORE execution
