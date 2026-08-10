# HW04 — Bug Report Standard

> Áp dụng cho defect report Markdown trong `docs/defects/<feature>/`.
>
> Mục tiêu: giữ format nhất quán giữa FR-05, FR-09 và FR-17; trace được từ Requirement → Test Case → Execution → Defect → GitHub Issue.

---

## 1. Naming Convention

### Defect ID

Không dùng Test Case ID làm Defect ID.

Dùng:

```text
FRXX-BUG-NNN
```

Ví dụ:

```text
FR05-BUG-001
FR09-BUG-002
FR17-BUG-003
```

### File name

```text
<DefectID>-<short-kebab-title>.md
```

Ví dụ:

```text
FR05-BUG-001-empty-image-alt.md
```

### Screenshot name

```text
docs/defects/<feature>/screenshots/<DefectID>.png
```

Ví dụ:

```text
docs/defects/fr-05/screenshots/FR05-BUG-001.png
```

### GitHub Issue draft

```text
docs/defects/<feature>/github-issues/<DefectID>.md
```

---

## 2. Bug Title Convention

```text
[HW04][BUG][<Feature ID>][<Module>] <Mô tả ngắn lỗi>
```

Ví dụ:

```text
[HW04][BUG][FR-05][Product Listing] Product image sử dụng alt rỗng
```

Title phải:

- mô tả đúng observed defect;
- không nhét severity/priority vào title;
- không suy diễn root cause;
- không nói rộng hơn evidence thực tế.

---

## 3. Severity / Priority Convention

Severity đánh giá **mức độ ảnh hưởng của defect**.

Priority đánh giá **mức độ ưu tiên xử lý**.

Allowed values:

```text
Severity: Critical | High | Medium | Low
Priority: P1 | P2 | P3 | P4
```

Mỗi report phải có `Reason` giải thích ngắn vì sao chọn severity/priority.

Không suy ra severity tự động chỉ từ category.

---

## 4. Hashtag Taxonomy

Mỗi Bug Report phải chứa đầy đủ hashtags liên quan.

### Assignment

```text
#HW04
```

### Type

```text
#BUG
```

### Feature

```text
#FR05
#FR09
#FR17
```

### Module

```text
#ProductListing
#DiscountCoupon
#CouponManagement
```

### Severity

```text
#SeverityCritical
#SeverityHigh
#SeverityMedium
#SeverityLow
```

### Priority

```text
#PriorityP1
#PriorityP2
#PriorityP3
#PriorityP4
```

### Browser

Chỉ thêm browser mà defect đã được reproduce:

```text
#Chromium
#Firefox
#WebKit
```

### Category

Chọn category có evidence:

```text
#Functional
#Security
#Accessibility
#UI
#Validation
#DataIntegrity
#CrossBrowser
```

Không tạo hashtag tùy ý nếu taxonomy hiện tại đã có category phù hợp.

---

## 5. Suggested GitHub Labels

Hashtags trong report và GitHub Labels là hai thứ riêng biệt.

Suggested labels nên dùng dạng:

```text
bug
hw04
fr-05
severity:medium
priority:p2
accessibility
cross-browser
```

Chỉ **suggest** label trong draft nếu issue chưa được publish.

---

# 6. Standard Bug Report Template

```markdown
# [HW04][BUG][FR-XX][Module Name] Bug title

## Found by Test Case

- `FRXX-TC-XXX`

## Related Requirements

- `FR-XX`
- `FRXX-RXX`
- `<global/security/accessibility requirement nếu có>`

## Severity / Priority

**Severity:** `Medium`  
**Priority:** `P2`

**Reason:**  
Giải thích ngắn 1–2 câu dựa trên impact thực tế.

## Environment

- **SUT:** EShop
- **Feature:** `FR-XX — Feature Name`
- **Module:** `Module Name`
- **Browser(s):**
  - Chromium
  - Firefox
  - WebKit
- **OS:** `<actual execution OS>`
- **Viewport:** `<actual viewport hoặc NOT_RECORDED>`
- **Zoom:** `<actual zoom hoặc NOT_RECORDED>`
- **Frontend URL:** `<actual frontend URL>`
- **Backend URL:** `<actual backend URL>`
- **Dataset / Fixture:** `<dataset ID / verified seed state>`
- **Execution Date:** `<YYYY-MM-DD>`
- **SUT Commit:** `<commit SHA hoặc NOT_RECORDED_AT_EXECUTION>`
- **Run ID(s):**
  - Chromium: `<run-id hoặc N/A>`
  - Firefox: `<run-id hoặc N/A>`
  - WebKit: `<run-id hoặc N/A>`

Không fabricate field chưa được ghi nhận. Dùng `NOT_RECORDED` / `N/A` khi cần.

## Preconditions

1. ...
2. ...

## Steps to Reproduce

1. ...
2. ...
3. ...

## Expected Result

...

## Actual Result

...

## Reproducibility

`Always | Intermittent | Browser-specific`

Mô tả ngắn browser coverage thực tế.

## Impact

Mô tả ảnh hưởng thực tế tới user / accessibility / security / business flow.

Không mở rộng impact ngoài evidence.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` | `<run-id>` | `<report/screenshot/trace>` |
| Firefox | `FAILED` | `<run-id>` | `<report/screenshot/trace>` |
| WebKit | `FAILED` | `<run-id>` | `<report/screenshot/trace>` |

Chỉ giữ các browser thực sự đã chạy.

## Evidence

### Screenshot

![Bug evidence](./screenshots/FRXX-BUG-NNN.png)

### Automation Evidence

- **HTML Report(s):**
  - `<path>`
- **Trace:** `<path hoặc N/A>`
- **Error Context:** `<path hoặc N/A>`
- **Execution Record(s):**
  - `<path>`
- **Cross-Browser Summary:** `<path hoặc N/A>`

## Technical Observation

> Optional. Chỉ dùng khi có runtime/DOM/source evidence rõ ràng.

Ví dụ:

```html
<img src="..." alt="">
```

Không biến observation thành root-cause claim nếu chưa xác minh.

## Discovery and Confirmation

- **Initial Discovery:** `<run-id / execution record>`
- **Final Confirmation:** `<browser coverage / rerun evidence>`

## Recommended Next Step

Mô tả hướng xử lý ở mức requirement/behavior.

Không sửa SUT trong bug report.

## Status

`OPEN`

## Hashtags

`#HW04` `#BUG` `#FRXX` `#ModuleName` `#SeverityMedium` `#PriorityP2` `#Chromium` `#Firefox` `#WebKit` `#Category` `#CrossBrowser`

## Suggested GitHub Labels

- `bug`
- `hw04`
- `fr-xx`
- `severity:medium`
- `priority:p2`
- `<category>`
- `cross-browser`
```

---

## 7. Evidence Rules

1. Screenshot phải hỗ trợ trực tiếp cho defect claim.
2. Screenshot không được dùng một mình để chứng minh invisible DOM semantics.
3. Với accessibility/DOM/security defect, pair screenshot với runtime/DOM evidence.
4. Không dùng screenshot từ unrelated run nếu đã có screenshot của chính failure run.
5. Với FR-09/FR-17, ưu tiên `screenshot: 'only-on-failure'` và `trace: 'retain-on-failure'`.
6. Sau triage: `PRODUCT_DEFECT` → promote/copy screenshot vào `docs/defects/<feature>/screenshots/`; `AUTOMATION_DEFECT` → không promote thành product defect evidence.
7. Không rerun full suite chỉ để lấy screenshot nếu failure artifact đã đủ.

---

## 8. Traceability Rule

Một defect report hợp lệ phải trace được tối thiểu:

```text
Requirement
→ Test Case
→ Browser Run
→ Failure Evidence
→ Human Triage
→ Defect ID
→ Screenshot / Runtime Evidence
→ GitHub Issue Draft
```

`AUTOMATION_DEFECT` không được tạo thành product Bug Report.

---

## 9. FR-05 Migration Mapping

| New Defect ID | Found by Test Case | Short Name |
| --- | --- | --- |
| `FR05-BUG-001` | `FR05-TC-004` | Empty product image alt |
| `FR05-BUG-002` | `FR05-TC-005` | Wrong currency symbol |
| `FR05-BUG-003` | `FR05-TC-011` | Unsafe formatting markup |
| `FR05-BUG-004` | `FR05-TC-012` | Reflected event-handler execution |
| `FR05-BUG-005` | `FR05-TC-014` | Multiple semantic h1 |

`FR05-TC-006` không có Defect ID vì đó là `AUTOMATION_DEFECT` đã được sửa và verify.
