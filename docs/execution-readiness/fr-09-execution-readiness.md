# FR-09 — Execution Readiness Report

## 1. Readiness Status

| Field | Value |
| --- | --- |
| Feature | `FR-09 — Discount coupons` |
| Workflow Mode | `EXECUTION_READINESS` |
| Readiness Status | `READY_FOR_EXECUTION` |
| Student ID | `23127107` |
| Approved Test Count | `16` |
| Implemented Playwright Test Count | `16` |
| Runtime Test Execution | `NOT_EXECUTED` |

Readiness chỉ thực hiện health checks, isolated-runtime preparation, read-only seed/schema verification, authentication readiness và Playwright collection. Không có browser nào được khởi động và không có test result `PASS`/`FAIL` nào được tạo.

## 2. Frontend Status

| Item | Result |
| --- | --- |
| URL | `http://localhost:5173` |
| HTTP status | `200` |
| Existing PID | `29712` |
| Action | `REUSED_HEALTHY_PROCESS` |

Frontend khỏe nên không được restart hoặc rebuild trong readiness.

## 3. Backend Status

| Item | Result |
| --- | --- |
| Target API | `http://localhost:3000` |
| Original workspace-backend PID | `28292` |
| Original process start time | `2026-08-10T02:14:10.0866883+07:00` |
| Original health | `HEALTHY_BEFORE_CONTROLLED_REPLACEMENT` |
| Replacement reason | Port `3000` bắt buộc phải phục vụ isolated FR-09 database. |
| Isolated backend PID | `34568` |
| Isolated health | `HEALTHY` — `/api/products` trả về 5 products. |

Chỉ PID đang sở hữu port `3000` được dừng. Frontend và các process khác không bị thay đổi.

## 4. Backend DB Path Resolution

`backend/database.js` resolve SQLite bằng:

```js
path.resolve(__dirname, 'database.sqlite')
```

Backend không đọc `FR09_TEST_DB_PATH` để chọn database. Biến này chỉ được FR-09 Playwright fixture sử dụng. Vì vậy isolated backend phải chạy từ backend directory riêng; `database.sqlite` được tạo cạnh runtime `database.js`.

Khi khởi động, `initDatabase()` drop/create tables và seed lại categories, coupons, users, products và orders. Hành vi này chỉ xảy ra trong isolated runtime copy.

## 5. Workspace DB Protection

| Item | Result |
| --- | --- |
| Forbidden workspace DB | `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite` |
| Initial hash attempt | `HASH_NOT_AVAILABLE_DUE_FILE_LOCK` |
| Action on initial lock | Không terminate healthy backend chỉ để lấy hash. |
| Baseline hash after controlled port replacement | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Final readiness hash | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Protection result | `PASS` — hash không đổi trong phần readiness còn lại. |

Runtime path được kiểm tra khác workspace path bằng absolute, case-insensitive comparison trước startup. `.runtime/` đã được thêm vào `.gitignore`.

## 6. Isolated Runtime Backend Path

```text
D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-09\fr09-readiness-20260810T051450780+0700\backend
```

Runtime chứa các backend files tối thiểu cần thiết và sử dụng dependency từ existing workspace installation. Backend stdout/stderr nằm trong cùng ignored runtime directory.

## 7. Isolated SQLite Path

```text
D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-09\fr09-readiness-20260810T051450780+0700\backend\database.sqlite
```

| Check | Result |
| --- | --- |
| File exists | `PASS` |
| Different from workspace DB | `PASS` |
| Backend-created and seeded | `PASS` |
| Schema: `coupons`, `coupon_usage`, `users` | `PASS` |

## 8. Authentication Status

| Input / Evidence | Status |
| --- | --- |
| `SUT_API_BASE_URL` | `CONFIGURED` as `http://localhost:3000` |
| `FR09_TEST_USER_EMAIL` | `CONFIGURED_RUNTIME_ONLY` |
| `FR09_TEST_USER_PASSWORD` | `CONFIGURED_RUNTIME_ONLY` |
| `POST /api/login` | HTTP `200` |
| JWT | `RECEIVED_NOT_PERSISTED` |
| User identity | `RECEIVED` |

Password, email value và JWT không được ghi vào source, Markdown, JSON test data hoặc AI audit evidence. Future execution shell phải cung cấp lại hai credential variables bằng runtime-only mechanism.

## 9. Coupon Seed Verification

| Coupon | Verification |
| --- | --- |
| `SAVE10` | `PRESENT` — percent 10, minimum 300000, active, max use 1 |
| `BIGBUY` | `PRESENT` — fixed 50000, minimum 500000, active, max use 1 |
| `VIP100` | `PRESENT` — fixed 100000, minimum 300000, active, max use 2 |
| `EXPIRED` | `PRESENT` — percent 20, expired at 2020-01-01 |

## 10. Product Seed Verification

| Product | Expected Price | Actual Price | Result |
| --- | ---: | ---: | --- |
| `Bàn phím cơ Keychron Q1` | 4000000 | 4000000 | `PASS` |

## 11. Reserved Absent-Code Verification

| Coupon Code | Matching Rows | Result |
| --- | ---: | --- |
| `FR09-NOT-FOUND-7F3C` | 0 | `PASS` |

Không insert reserved code trong readiness.

## 12. Stateful Fixture Safety

| Guard | Result |
| --- | --- |
| Requires `FR09_ISOLATED_DB=true` | `PASS_STATIC` |
| Requires `FR09_TEST_DB_PATH` | `PASS_STATIC` |
| Rejects absolute workspace DB path | `PASS_STATIC` |
| Requires isolated DB file to exist | `PASS_STATIC` |
| Runtime path points to isolated copy | `PASS` |
| Required schema exists | `PASS` |
| TC-010/TC-014/TC-015 fixture mutation executed | `NO` |
| `coupon_usage` rows after readiness | 0 |

Isolated backend startup created/seeded its own DB, và login readiness chỉ xác nhận account response. Không install inactive coupon, không set usage count và không pre-consume coupon usage.

## 13. Playwright Collection Result

Collection-only command:

```powershell
npx.cmd playwright test tests/fr-09/fr-09.spec.js --list
```

| Check | Result |
| --- | --- |
| Exit code | `0` |
| Spec files | 1 |
| Unique approved IDs per project | 16 |
| Project-test combinations | 48 |
| Missing IDs | 0 |
| Duplicate IDs | 0 |
| Browser execution | `NO` |
| Collection-only HTML shell | `CREATED_IN_IGNORED_RUNTIME`; không chứa execution results và không phải submission evidence. |

## 14. Chromium Count

`16` collected definitions, IDs `FR09-TC-001` through `FR09-TC-016`.

## 15. Firefox Count

`16` collected definitions, IDs `FR09-TC-001` through `FR09-TC-016`.

## 16. WebKit Count

`16` collected definitions, IDs `FR09-TC-001` through `FR09-TC-016`.

All required browser executables exist in the local Playwright cache. No executable was launched.

## 17. HTML Report Identity Verification

Static config evaluation produced a title with all required components:

```text
FR-09 | Run by: 23127107 | 2026-08-10T05:14:50.780+07:00 | fr09-readiness-20260810T051450780+0700 | Browser: readiness
```

`HTML_REPORT_DIR` supports a separate report directory per run. `TEST_RESULTS_DIR` now supports a separate Playwright artifact directory per run. Metadata retains Feature ID, student identity, ISO timestamp, Run ID and browser project.

## 18. Screenshot Policy

`screenshot: 'only-on-failure'` — `PASS_STATIC`.

Future failures retain the original Playwright screenshot, HTML report entry and test-result artifact. A screenshot may be promoted to `docs/defects/fr-09/screenshots/<DefectID>.png` only after human-approved `PRODUCT_DEFECT` classification. Readiness assigns no Defect ID.

## 19. Trace Policy

| Policy | Value |
| --- | --- |
| Trace | `retain-on-failure` |
| Video | `off` |
| Retries | 0 |
| FR-09 workers | 1 |

Do not rerun the full suite only to recreate a screenshot. Original screenshot, trace, HTML entry and test-results directory must be preserved from each future run.

## 20. TC-012 Runtime Risk

`NEEDS_MORE_EVIDENCE` — same-document navigation phải được xác nhận giữ in-memory cart trên Chromium, Firefox và WebKit. Readiness không phân loại behavior này là product defect.

## 21. TC-013 Runtime Risk

`NEEDS_MORE_EVIDENCE` — direct unauthenticated Checkout có thể thể hiện denial bằng redirect, unavailable controls hoặc disabled action tùy engine/runtime. Web-first app-render gate đã có nhưng cross-browser behavior chưa được chạy.

## 22. Execution Command Template

Trước mỗi command, `FR09_TEST_USER_EMAIL` và `FR09_TEST_USER_PASSWORD` phải được cung cấp từ runtime-only shell/secret mechanism. Các template dưới đây không chứa credential values.

### Chromium

```powershell
if (-not $env:FR09_TEST_USER_EMAIL -or -not $env:FR09_TEST_USER_PASSWORD) { throw 'Runtime-only FR-09 credentials are required.' }
$env:FEATURE_ID = 'FR-09'
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5173'
$env:SUT_API_BASE_URL = 'http://localhost:3000'
$env:FR09_ISOLATED_DB = 'true'
$env:FR09_TEST_DB_PATH = 'D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-09\fr09-readiness-20260810T051450780+0700\backend\database.sqlite'
$env:BROWSER_PROJECT = 'chromium'
$env:RUN_TIMESTAMP = (Get-Date).ToUniversalTime().ToString('o')
$env:RUN_ID = "FR09-chromium-$($env:RUN_TIMESTAMP -replace '[:.]','-')"
$env:HTML_REPORT_DIR = "html-reports/fr-09/$($env:RUN_ID)"
$env:TEST_RESULTS_DIR = "test-results/fr-09/$($env:RUN_ID)"
npx.cmd playwright test tests/fr-09/fr-09.spec.js --project=chromium
```

### Firefox

```powershell
if (-not $env:FR09_TEST_USER_EMAIL -or -not $env:FR09_TEST_USER_PASSWORD) { throw 'Runtime-only FR-09 credentials are required.' }
$env:FEATURE_ID = 'FR-09'
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5173'
$env:SUT_API_BASE_URL = 'http://localhost:3000'
$env:FR09_ISOLATED_DB = 'true'
$env:FR09_TEST_DB_PATH = 'D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-09\fr09-readiness-20260810T051450780+0700\backend\database.sqlite'
$env:BROWSER_PROJECT = 'firefox'
$env:RUN_TIMESTAMP = (Get-Date).ToUniversalTime().ToString('o')
$env:RUN_ID = "FR09-firefox-$($env:RUN_TIMESTAMP -replace '[:.]','-')"
$env:HTML_REPORT_DIR = "html-reports/fr-09/$($env:RUN_ID)"
$env:TEST_RESULTS_DIR = "test-results/fr-09/$($env:RUN_ID)"
npx.cmd playwright test tests/fr-09/fr-09.spec.js --project=firefox
```

### WebKit

```powershell
if (-not $env:FR09_TEST_USER_EMAIL -or -not $env:FR09_TEST_USER_PASSWORD) { throw 'Runtime-only FR-09 credentials are required.' }
$env:FEATURE_ID = 'FR-09'
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5173'
$env:SUT_API_BASE_URL = 'http://localhost:3000'
$env:FR09_ISOLATED_DB = 'true'
$env:FR09_TEST_DB_PATH = 'D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-09\fr09-readiness-20260810T051450780+0700\backend\database.sqlite'
$env:BROWSER_PROJECT = 'webkit'
$env:RUN_TIMESTAMP = (Get-Date).ToUniversalTime().ToString('o')
$env:RUN_ID = "FR09-webkit-$($env:RUN_TIMESTAMP -replace '[:.]','-')"
$env:HTML_REPORT_DIR = "html-reports/fr-09/$($env:RUN_ID)"
$env:TEST_RESULTS_DIR = "test-results/fr-09/$($env:RUN_ID)"
npx.cmd playwright test tests/fr-09/fr-09.spec.js --project=webkit
```

Các commands trên chỉ là templates và chưa được chạy.

## 23. Cleanup / Restore Procedure

1. Trước execution, xác nhận port `3000` vẫn thuộc PID `34568`, `/api/products` khỏe và isolated DB path ở trên còn tồn tại.
2. Test runner phải đặt `FR09_ISOLATED_DB=true` và exact isolated `FR09_TEST_DB_PATH`; không dùng workspace DB.
3. Sau execution/evidence review, chỉ stop backend nếu port `3000` vẫn thuộc recorded isolated PID. Không stop PID khác theo port assumption.
4. Chỉ xóa run-specific `.runtime/fr-09/fr09-readiness-20260810T051450780+0700/` sau khi không còn cần isolated state/logs. Đây là disposable ignored runtime data.
5. Workspace backend không được restart tự động: startup của nó drop/create/seed `backend/database.sqlite`. Việc restore workspace backend cần explicit human approval và phải kiểm tra đúng working directory/process owner trước khi start.
6. Frontend PID `29712` được reuse và không cần restore.

## 24. Current Checkpoint

`CHECKPOINT: FR09_EXECUTION_READINESS_REVIEW_REQUIRED`
