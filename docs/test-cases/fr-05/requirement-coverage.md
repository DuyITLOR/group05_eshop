# FR-05 — Requirement Coverage Matrix

| Requirement ID | Requirement | Covered By | Coverage Status | Rationale |
| --- | --- | --- | --- | --- |
| FR05-R01 | Complete controlled catalog appears as grid. | FR05-TC-001, FR05-TC-017 | `FULLY_COVERED` | TC-001 covers catalog visibility/count; TC-017 independently covers computed grid layout without assuming columns/classes. |
| FR05-R02A | Each product has an image. | FR05-TC-003 | `FULLY_COVERED` | Image existence is atomic and objective. |
| FR05-R02B | Product image has standard ratio. | — | `NEEDS_CLARIFICATION` | No ratio/dimension/tolerance. |
| FR05-R02C | Image alt is descriptive and non-empty. | FR05-TC-004 | `PARTIALLY_COVERED` | Non-empty is objective; semantic descriptiveness lacks approved oracle. |
| FR05-R03A | Each product shows its name. | FR05-TC-002 | `FULLY_COVERED` | Seed names provide deterministic oracle. |
| FR05-R03B | Price uses `₫`. | FR05-TC-005 | `FULLY_COVERED` | Unit assertion separated from grouping. |
| FR05-R03C | Price uses thousand grouping. | FR05-TC-006 | `FULLY_COVERED` | Existing seed prices support grouping without invented boundaries. |
| FR05-R04 | Search targets product name. | FR05-TC-007, FR05-TC-008 | `FULLY_COVERED` | Exact known-name positive plus description-only exclusion; no extra matching semantics. |
| FR05-R05 | Display search input safely. | FR05-TC-010, FR05-TC-011, FR05-TC-012 | `FULLY_COVERED` | Plain text, formatting markup and executable markup are atomic cases. |
| FR05-R06 | Observable loading state while loading. | FR05-TC-013 | `FULLY_COVERED` | Design covers state transition; current automation information is insufficient. |
| FR05-R07A | Observable empty state for no results. | FR05-TC-009 | `FULLY_COVERED` | No exact message is invented. |
| FR05-R07B | Empty state has icon/illustration. | FR05-TC-015 | `FULLY_COVERED` | Atomic presentation requirement. |
| FR05-R07C | Empty state has friendly message. | FR05-TC-016 | `FULLY_COVERED` | Asserts non-empty human-facing message, not exact copy. |
| FR05-R08 | Home has exactly one `<h1>`. | FR05-TC-014 | `FULLY_COVERED` | Exact semantic count. |
| SEC-04 | Displayed user input is escaped; no direct innerHTML behavior. | FR05-TC-010–012 | `FULLY_COVERED` | Safe rendering/no execution. |

## Coverage Summary

| Status | Count |
| --- | ---: |
| `FULLY_COVERED` | 13 |
| `PARTIALLY_COVERED` | 1 |
| `NOT_COVERED` | 0 |
| `NEEDS_CLARIFICATION` | 1 |

Open Requirement Gaps: **7**  
Test Cases Classified as `NEEDS_CLARIFICATION`: **0**

No test case was added for pagination, filtering, sorting, partial/case-insensitive/prefix/trim search, debounce, URL synchronization, or an invented image ratio.
