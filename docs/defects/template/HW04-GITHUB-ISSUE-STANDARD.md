# HW04 — GitHub Issue Draft Standard

> Áp dụng cho `docs/defects/<feature>/github-issues/<DefectID>.md`.
>
> Draft phải đủ để copy/publish thành GitHub Issue sau human review.

---

## 1. Title

```text
[HW04][BUG][<Feature ID>][<Module>] <Bug title>
```

Ví dụ:

```text
[HW04][BUG][FR-05][Product Listing] Product image sử dụng alt rỗng
```

---

## 2. Standard Draft Template

```markdown
# Title

[HW04][BUG][FR-XX][Module Name] Bug title

# Body

## Found by Test Case

- `FRXX-TC-XXX`

## Related Requirements

- `FR-XX`
- `FRXX-RXX`
- `<related global/security/accessibility requirement>`

## Severity / Priority

**Severity:** `Medium`  
**Priority:** `P2`

**Reason:**  
...

## Environment

- **SUT:** EShop
- **Feature:** `FR-XX — Feature Name`
- **Module:** `Module Name`
- **Browser(s):** Chromium, Firefox, WebKit
- **OS:** `<actual OS>`
- **Viewport:** `<actual viewport hoặc NOT_RECORDED>`
- **Zoom:** `<actual zoom hoặc NOT_RECORDED>`
- **Frontend URL:** `<actual URL>`
- **Backend URL:** `<actual URL>`
- **Dataset / Fixture:** `<dataset / seed>`
- **Execution Date:** `<YYYY-MM-DD>`
- **SUT Commit:** `<SHA hoặc NOT_RECORDED_AT_EXECUTION>`
- **Run ID(s):**
  - Chromium: `<run-id>`
  - Firefox: `<run-id>`
  - WebKit: `<run-id>`

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

...

## Impact

...

## Browser Coverage

| Browser | Result | Run ID |
| --- | --- | --- |
| Chromium | `FAILED` | `<run-id>` |
| Firefox | `FAILED` | `<run-id>` |
| WebKit | `FAILED` | `<run-id>` |

## Evidence

### Screenshot

![Bug evidence](../screenshots/FRXX-BUG-NNN.png)

### Automation Evidence

- HTML report(s): `<path>`
- Execution record(s): `<path>`
- Cross-browser summary: `<path>`
- Trace / Error Context: `<path hoặc N/A>`

## Technical Observation

Optional; evidence-only, no unverified root-cause claim.

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

## 3. Publishing Rules

- Draft ≠ published issue.
- Không ghi issue number trước khi GitHub thực sự tạo issue.
- Không claim label đã được applied nếu mới chỉ là suggestion.
- Không publish nếu human review chưa approve.
- Nếu issue là security-relevant, mô tả đúng evidence thực tế; không phóng đại impact.
- Screenshot phải dùng relative path trong draft/repository; khi publish cần bảo đảm attachment/rendering hoạt động trên GitHub.
