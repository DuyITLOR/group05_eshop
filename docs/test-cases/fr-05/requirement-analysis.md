# FR-05 — Requirement Analysis

## Status

`TEST_CASE_DESIGN_REVIEW_REQUIRED`

Feature: `FR-05` — Product listing and search  
Actor: Public user  
Automation Target: Playwright web frontend

## Source Classification

| Source ID | Source | Source Type | Authority | Related Requirement | Notes |
| --- | --- | --- | --- | --- | --- |
| SRC-01 | `README.md`, FR-05 | Functional requirement | `AUTHORITATIVE` | FR05-R01–R08 | Nguồn chính cho listing, product fields, search, loading, empty state và home-page h1. |
| SRC-02 | `README.md`, FR-21 | Global UI requirement | `AUTHORITATIVE` | FR05-R03B, FR05-R03C, FR05-R08 | Xác nhận ký hiệu `₫`, thousand grouping và one-h1 rule. |
| SRC-03 | `README.md`, FR-24 | Global feedback/accessibility requirement | `AUTHORITATIVE` | FR05-R02C, FR05-R07A–C | Xác nhận alt không rỗng và empty state có illustration/icon cùng friendly message. |
| SRC-04 | `README.md`, SEC-04 | Security requirement | `AUTHORITATIVE` | FR05-R05 | User input phải được escape, không dùng direct `innerHTML`. |
| SRC-05 | `api_specification.md`, section 3.1 | API contract | `SUPPORTING` | FR05-R01, FR05-R04 | `GET /api/products`; optional `?search=keyword` tìm theo product name. |
| SRC-06 | `frontend-web/src/pages/Home.jsx` | Source code | `IMPLEMENTATION_ONLY` | All | Chỉ dùng cho feasibility, locator và discrepancy discovery. |
| SRC-07 | `frontend-web/src/App.jsx` | Source code | `IMPLEMENTATION_ONLY` | FR05-R08 | Xác nhận `/` render `Home` trong `<main>`. |
| SRC-08 | `backend/database.js` | Seed source | `IMPLEMENTATION_ONLY` | Data support | Cung cấp năm seed products ổn định; không định nghĩa Expected Result. |
| SRC-09 | `backend/server.js` | Source code | `IMPLEMENTATION_ONLY` | FR05-R04 | Current API implementation searches `products.name`; không dùng để suy diễn partial/case/trim semantics. |

Không phát hiện nguồn requirement khác trực tiếp áp dụng cho FR-05. Skill/example files và artifact của workflow cũ không được dùng làm requirement source.

## Requirements Extracted

| Requirement ID | Requirement Statement | Source | Testable | Notes |
| --- | --- | --- | --- | --- |
| FR05-R01 | Home page hiển thị toàn bộ controlled product catalog dưới dạng grid. | SRC-01, SRC-05 | Yes | Hai atomic cases: catalog visibility/count và computed grid layout; không suy diễn production completeness, viewport hoặc column count. |
| FR05-R02A | Mỗi product hiển thị image element. | SRC-01 | Yes | Tách khỏi alt và ratio theo Atomic Test Objective Rule. |
| FR05-R02B | Product image có standard ratio. | SRC-01 | Not yet | Không có ratio, dimension hay tolerance. |
| FR05-R02C | Product image có descriptive, non-empty `alt`. | SRC-01, SRC-03 | Partially | Non-empty objective; semantic descriptiveness thiếu approved oracle. |
| FR05-R03A | Mỗi product hiển thị name. | SRC-01 | Yes | Atomic name objective. |
| FR05-R03B | Price dùng ký hiệu `₫`. | SRC-01, SRC-02 | Yes | Tách khỏi grouping. |
| FR05-R03C | Price có thousand grouping. | SRC-01, SRC-02 | Yes | Exact separator/locale không được quy định. |
| FR05-R04 | Search target là product name. | SRC-01, SRC-05 | Yes | Không suy diễn partial/case/trim/prefix/debounce. |
| FR05-R05 | Search keyword được hiển thị như safe text, không render/execute HTML. | SRC-01, SRC-04 | Yes | Tách plain text, formatting markup và executable markup. |
| FR05-R06 | UI có observable loading state trong lúc product data đang tải. | SRC-01 | Yes | Exact component/copy không được quy định. |
| FR05-R07A | No-result search có observable empty state. | SRC-01 | Yes | Không assert exact copy. |
| FR05-R07B | Empty state có icon hoặc illustration. | SRC-03 | Yes | Hình thức cụ thể không được quy định. |
| FR05-R07C | Empty state có friendly non-empty message. | SRC-03 | Yes | Exact message không được quy định. |
| FR05-R08 | Home page có đúng một semantic `<h1>`. | SRC-01, SRC-02 | Yes | Scope chỉ home page. |

IDs trên là `INTERNAL_TRACEABILITY_ID` dùng cho test design.

## Existing Seed Data Relevant to FR-05

| Product | Price | Description relevance | Supported Objectives |
| --- | ---: | --- | --- |
| `iPhone 15 Pro Max` | 30000000 | Unique exact name | Complete listing, name/image/alt/price, exact-name search. |
| `Samsung Galaxy S24 Ultra` | 28000000 | Description contains `xuất sắc` | Listing and description-only search oracle. |
| `MacBook Pro M3` | 45000000 | Unique exact name | Listing and product-field checks. |
| `Tai nghe AirPods Pro 2` | 6000000 | Description contains `xuất sắc` | Listing and description-only search oracle. |
| `Bàn phím cơ Keychron Q1` | 4000000 | Unique exact name | Listing and product-field checks. |

Verified facts: all five names exclude `xuất sắc`; two descriptions contain it. Existing prices support `₫` and grouping checks but do not establish arbitrary boundary values. No database record is created or modified.

## Requirement Gaps

| Gap ID | Missing Information | Why It Matters | Affected Behavior | Question |
| --- | --- | --- | --- | --- |
| GAP-01 | Exact standard image ratio/dimensions/tolerance | Không thể tạo objective ratio oracle. | FR05-R02B | Ratio và tolerance được phê duyệt là gì? |
| GAP-02 | Approved semantic alt convention | Non-empty tự động được; “descriptive” cần oracle/human judgement. | FR05-R02C | Alt nên khớp product name hay convention nào? |
| GAP-03 | Exact grouping locale/separator | Không được assert dấu `.` hay `,` cụ thể. | FR05-R03C | Locale chuẩn là gì? |
| GAP-04 | Search matching semantics | Không được test partial/case/trim/prefix. | FR05-R04 | Matching rule chính xác là gì? |
| GAP-05 | Search trigger/timing contract | Không được suy diễn debounce/Enter/button requirement. | FR05-R04 | Trigger nào là contract? |
| GAP-06 | Loading-state component/copy/locator contract | Objective có source nhưng current automation locator không đủ. | FR05-R06 | Observable contract nào được phê duyệt? |
| GAP-07 | Empty-state region/copy/icon locator contract | Objective có source nhưng current automation locator không đủ. | FR05-R07A–C | Empty-state semantic/locator contract nào được phê duyệt? |

Open Requirement Gaps: **7**. Test Cases Classified as `NEEDS_CLARIFICATION`: **0**. Hai metric này không đồng nhất: case có thể giữ expected result ở mức source-supported mà không áp đặt phần còn thiếu.

## Implementation Discrepancies Observed

| Area | Current Observation | Requirement Boundary |
| --- | --- | --- |
| Product alt | `Home.jsx` renders `alt=""`. | Preserve non-empty/descriptive requirement. |
| Price | UI renders localized number followed by `VND`. | Preserve `₫` requirement. |
| Loading state | No loading state is implemented. | Requirement is confirmed; implementation is missing/nonconforming. |
| Empty state | No empty-state UI for empty product results. | Requirements FR05-R07A–C remain confirmed. |
| Keyword rendering | Uses `dangerouslySetInnerHTML`. | Preserve safe-text and no-execution expectations. |
| Semantic heading | A second `<h1>` appears when products exist. | Preserve exactly-one-h1 expectation. |
| Locator support | Grid/card/image/price/keyword region lack stable test IDs/semantic contracts. | Feasibility risk only; does not redefine requirements. |

No SUT, database, service, browser, or downstream automation artifact was modified or executed.
