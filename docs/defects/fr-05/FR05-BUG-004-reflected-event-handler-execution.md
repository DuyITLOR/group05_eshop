# [HW04][BUG][FR-05][Product Listing] Event-handler markup được thực thi khi phản chiếu search input

## Found by Test Case

`FR05-TC-012` — event-handler markup trong search input không được thực thi hoặc tạo executable DOM.

## Related Requirements

`FR05-R05`; `SEC-04` — reflected input phải là safe text, không tạo input-derived `img[onerror]` và không mở dialog.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `High` |
| Priority | `P1` |
| Reason | Cả ba browser đều chứng minh reflected event-handler markup được thực thi, tạo `img[onerror]` và real dialog; safe rendering/security boundary bị vi phạm trực tiếp. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-05 — Product listing and search |
| Module | Product Listing |
| Browser(s) | Chromium, Firefox, WebKit |
| OS | `NOT_RECORDED_AT_EXECUTION` |
| Viewport | `NOT_RECORDED_AT_EXECUTION` |
| Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR05-DATA-006` với `FR05-SETUP-002` controlled empty `GET /api/products` search response |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |
| Run IDs | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z`; `FR-05-firefox-2026-08-09T19-58-55-6329954Z`; `FR-05-webkit-2026-08-09T20-00-12-2824300Z` |

## Preconditions

Public home page khả dụng; controlled search response là empty product array; dialog observer được attach trước khi submit.

## Steps to Reproduce

1. Mở public home page.
2. Attach dialog observer.
3. Submit `<img src=x onerror=alert('FR05-XSS')>` làm search keyword.
4. Dismiss các dialog đã capture một cách an toàn và kiểm tra reflected-keyword DOM.

## Expected Result

Event-handler input không được thực thi, không mở dialog, không tạo input-derived `img[onerror]`; reflected input vẫn là safe text.

## Actual Result

Reflected event-handler markup đã được thực thi. Chromium capture hai dialog `FR05-XSS`, Firefox capture hai, WebKit capture một; mỗi browser đều có một `img[onerror]`. Literal safe-text assertion FAILED.

## Reproducibility

`Always`

Điều kiện thực thi đã được reproduce trên Chromium, Firefox và WebKit. Dialog count khác nhau theo browser, nhưng mọi browser đều capture ít nhất một dialog và một `img[onerror]`.

## Impact

Search input chứa event-handler markup được phản chiếu thành executable DOM. Report này chỉ mô tả dialog và DOM behavior đã được chứng minh; không khẳng định remote code execution, data theft, account takeover hoặc broader system compromise.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT`; 2 dialog, `img[onerror]` count 1 | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md`; `docs/execution-results/fr-05-cross-browser-summary.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT`; 2 dialog, `img[onerror]` count 1 | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `docs/execution-results/fr-05-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT`; 1 dialog, `img[onerror]` count 1 | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` | `docs/execution-results/fr-05-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-05/screenshots/FR05-BUG-004.png` cho thấy reflected DOM sau khi dialog được dismiss. Screenshot đơn lẻ không thể chứng minh dialog execution; runtime evidence cung cấp bằng chứng đó.

### Automation Evidence

- `docs/defects/fr-05/runtime-evidence.md` ghi nhận narrow Chromium dialog messages `FR05-XSS`, `FR05-XSS` và `img[onerror]` count `1`.
- Browser comparison có thẩm quyền: `docs/execution-results/fr-05-cross-browser-summary.md` ghi nhận Chromium `2`, Firefox `2`, WebKit `1` dialog và count `1` ở mọi browser.
- HTML reports: `html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/`, `html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/`, `html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/`.

## Technical Observation

Reflected input quan sát được tạo `img` element có `onerror` attribute và trigger dialog event. Root cause chưa được điều tra độc lập.

## Discovery and Confirmation

Phân loại: `PRODUCT_DEFECT`. Lỗi được phát hiện ban đầu tại `FR-05-chromium-2026-08-09T19-14-10-0306495Z`; xác nhận cuối dùng corrected Chromium baseline cùng Firefox và WebKit. Dialog count khác nhau theo browser là biến thiên evidence, không phải automation defect.

## Recommended Next Step

Áp dụng safe-rendering/security correction đã được phê duyệt cho reflected input, sau đó rerun focused security assertions.

## Status

`OPEN`

## Hashtags

#HW04 #BUG #FR05 #ProductListing #SeverityHigh #PriorityP1 #Chromium #Firefox #WebKit #CrossBrowser #Security #Validation

## Suggested GitHub Labels

`bug`, `hw04`, `fr-05`, `severity:high`, `priority:p1`, `security`, `validation`, `cross-browser`
