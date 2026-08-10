# HW04 - Automation Testing Main Report

## 1. Thông tin bài làm

| Trường                                   | Giá trị                                     |
| ---------------------------------------- | ------------------------------------------- |
| Assignment                               | `HW04-AI - Automation Testing`              |
| Student ID dùng trong execution evidence | `23127107`                                  |
| Student name / Class                     | Nguyễn Huy Quân                             |
| SUT                                      | EShop web frontend và Web Admin             |
| Automation framework                     | Playwright `1.62.1`                         |
| Browser engines                          | Chromium, Firefox, WebKit                   |
| Public repository                        | <https://github.com/DuyITLOR/group05_eshop> |
| Working branch                           | `HW04/Quan`                                 |
| Report status                            | `PRE_SUBMISSION - STUDENT_REVIEW_REQUIRED`  |

Report này tổng hợp evidence đã được human review trong repository. Các con số execution bên dưới lấy từ archived Playwright runs; quá trình lập report không chạy lại browser, không sửa SUT và không tạo PASS/FAIL giả.

## 2. Feature selection

Ba web features được chọn đúng một feature từ mỗi Pool A, B và C:

| Pool | Feature ID | Feature name               |
| ---- | ---------- | -------------------------- |
| A    | `FR-05`    | Product listing and search |
| B    | `FR-09`    | Discount coupons           |
| C    | `FR-17`    | Coupon management (CRUD)   |

Mỗi feature có requirement analysis, approved test cases, automation plan, external JSON data, Playwright scripts, AI code review, execution evidence, defect analysis và final traceability summary.

## 3. AI-first workflow và human review

Workflow được thực hiện theo từng checkpoint thay vì dùng một prompt chung:

1. Requirement analysis và atomic test-case design.
2. Human review test design.
3. Automation planning và locator/assertion strategy.
4. Human review automation plan.
5. External test-data preparation.
6. Human review test data.
7. Playwright script generation.
8. AI-generated code review và human correction.
9. Execution readiness.
10. Chromium gate, failure triage và automation correction khi cần.
11. Firefox/WebKit execution và cross-browser comparison.
12. Final defect reporting, screenshot promotion và traceability review.

Toàn bộ 21 meaningful AI interactions đã được ghi tại [AI_AUDIT_LOG.md](../ai-audit/AI_AUDIT_LOG.md). Verbatim prompts và outputs được lưu riêng tại `docs/ai-audit/interactions/`. Finalized audit summary hiện có `12 VALID`, `0 INVALID` và `9 INCOMPLETE`; `INCOMPLETE` biểu thị output ban đầu chỉ được chấp nhận sau human-directed edits, không phải artifact cuối bị bỏ dở.

## 4. Task 1 - AI-generated automation scripts

### 4.1 Tổng quan automation

| Metric                               | FR-05 | FR-09 | FR-17 |                   Tổng |
| ------------------------------------ | ----: | ----: | ----: | ---------------------: |
| Approved Test Cases                  |    17 |    16 |    16 |                     49 |
| Automated Test Cases                 |    13 |    16 |    16 |                     45 |
| Blocked approved cases               |     4 |     0 |     0 |                      4 |
| Browser projects                     |     3 |     3 |     3 | 9 feature-browser runs |
| Project-test combinations executed   |    39 |    48 |    48 |                    135 |
| Passed combinations                  |    24 |    30 |    40 |                     94 |
| Failed combinations                  |    15 |    18 |     8 |                     41 |
| Skipped combinations                 |     0 |     0 |     0 |                      0 |
| Confirmed underlying product defects |     5 |     5 |     4 |                     14 |

`Automated Test Cases` là số Test Case IDs duy nhất. `Project-test combinations` là mỗi Test Case ID chạy trên một browser project. Tách hai metric này tránh trình bày sai `45` test logic thành `135` test cases.

### 4.2 Data-driven testing

Không có data-driven array/object lớn được nhúng trực tiếp trong spec. Mỗi feature đọc external JSON:

- [FR-05 test data](../../test-data/fr-05.json): controlled five-product seed catalog, search inputs và controlled response setup.
- [FR-09 test data](../../test-data/fr-09.json): coupon scenarios, calculation boundaries và isolated state setup.
- [FR-17 test data](../../test-data/fr-17.json): CREATE/validation/permission datasets và isolated cleanup ownership.

Runtime credentials và JWT không được lưu trong JSON. FR-09 và FR-17 stateful tests dùng isolated database/runtime guards; test-owned state được cleanup độc lập, không phụ thuộc test order.

### 4.3 Assertion patterns

Suite dùng nhiều hơn ba assertion patterns bắt buộc:

| Feature | Assertion patterns tiêu biểu                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-05   | `COUNT`, `TEXT_OR_VALUE`, `ATTRIBUTE_OR_CLASS`, `VISIBILITY_OR_HIDDEN_STATE`, `DIALOG`                                                           |
| FR-09   | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `PERMISSION`, `URL_OR_NAVIGATION` |
| FR-17   | `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION`, `PERMISSION`, `ATTRIBUTE_OR_CLASS`                                   |

Các assertions giữ nguyên requirement oracle ngay cả khi SUT hiện tại fail. Suite không dùng `test.skip()` hoặc `test.fail()` để làm kết quả đẹp hơn, không dùng `waitForTimeout()` làm synchronization bình thường và giữ `retries=0`.

## 5. Feature A - FR-05 Product listing and search

### 5.1 Scope và kết quả

FR-05 có 17 approved cases; 13 cases được automate và 4 cases bị `BLOCKED_BY_IMPLEMENTATION` do SUT thiếu observable loading/empty-state behavior. Final corrected result giống nhau trên ba engines:

| Browser  | Total | Passed | Failed |
| -------- | ----: | -----: | -----: |
| Chromium |    13 |      8 |      5 |
| Firefox  |    13 |      8 |      5 |
| WebKit   |    13 |      8 |      5 |

Failed IDs: `FR05-TC-004`, `FR05-TC-005`, `FR05-TC-011`, `FR05-TC-012`, `FR05-TC-014`. Chúng map tới năm defects: empty image alt, wrong currency symbol, unsafe formatting markup, reflected event-handler execution và multiple semantic `h1`.

### 5.2 Human review và correction

AI-generated code ban đầu có các vấn đề đáng chú ý:

- Dataset của TC-002 bị coupling nhầm với search dataset; human review đưa case về `FR05-DATA-001`.
- HTML reporter metadata chưa chứng minh identity hiển thị; config được bổ sung visible title chứa Feature ID, `Run by: 23127107`, ISO timestamp và Run ID.
- Thousand-grouping helper của TC-006 lấy cả trailing whitespace trước currency suffix, tạo false failure. Helper được sửa để chỉ nhận complete numeric groups với conventional consistent separator. TC-006 sau đó PASS trên cả ba engines.
- DOM thiếu semantic card/price/keyword anchors, nên một số ancestor-scoped locators được chấp nhận như documented locator risk, không được mô tả là ideal selector.

### 5.3 Automation gaps

`FR05-TC-009`, `FR05-TC-013`, `FR05-TC-015`, `FR05-TC-016` vẫn block vì UI không cung cấp empty-state/loading-state region, icon/message hoặc stable observable locator. Approved Expected Results không bị sửa để khớp implementation.

Chi tiết: [FR-05 final summary](../execution-results/fr-05-final-summary.md), [AI review](../automation-reviews/fr-05-ai-review.md), [gap report](../gaps/fr-05-automation-gaps.md).

## 6. Feature B - FR-09 Discount coupons

### 6.1 Scope và kết quả

Toàn bộ 16 approved cases được automate và chạy trên ba engines:

| Browser  | Total | Passed | Failed | Skipped |
| -------- | ----: | -----: | -----: | ------: |
| Chromium |    16 |     10 |      6 |       0 |
| Firefox  |    16 |     10 |      6 |       0 |
| WebKit   |    16 |     10 |      6 |       0 |

Sáu failed Test Case IDs là `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013`, `FR09-TC-016`. TC-002 và TC-003 là hai observable consequences của cùng percent-calculation root defect, nên sáu failures được deduplicate thành năm product defects.

### 6.2 Human review và correction

- TC-014/TC-015 ban đầu dùng exact minimum total, khiến known C3 discrepancy có thể mask C5 usage-limit objective. Human review chuyển control total sang existing seed `4000000`, giữ C5 boundaries độc lập.
- Generic rejection helper ban đầu phụ thuộc một error-region CSS/copy không được requirement quy định. Correction chỉ assert business outcomes: discount/final lines absent và payable total unchanged.
- TC-013 được thêm deterministic web-first EShop shell/main render gate trước mechanism-neutral authorization assertion.
- Stateful cases dùng isolated test DB/transaction setup, cleanup sau mỗi test và fail-closed guard chống trỏ vào workspace database.

Bảy requirement gaps về exact copy, timezone, rounding, usage increment timing, input normalization, stacking lifecycle và network recovery vẫn mở; chúng không bị biến thành unsupported assertions.

Chi tiết: [FR-09 final summary](../execution-results/fr-09-final-summary.md), [AI review](../automation-reviews/fr-09-ai-review.md), [gap report](../gaps/fr-09-automation-gaps.md).

## 7. Feature C - FR-17 Coupon management

### 7.1 Scope và kết quả

Toàn bộ 16 approved cases được automate. Final corrected runs:

| Browser  | Total | Passed | Failed | Skipped |
| -------- | ----: | -----: | -----: | ------: |
| Chromium |    16 |     12 |      4 |       0 |
| Firefox  |    16 |     14 |      2 |       0 |
| WebKit   |    16 |     14 |      2 |       0 |

Bốn confirmed Test Case IDs map một-một tới bốn defects: missing visible required indicators, zero discount accepted, negative minimum order accepted và non-admin Coupon Management access. Hai validation defects chỉ được quan sát trên corrected Chromium; report không suy luận universal backend cause chỉ từ static implementation.

### 7.2 Human review và correction

- `getCouponRow()` ban đầu kết hợp `filter({ has })` với locator đã scope qua ancestor table, có thể miss row hợp lệ. Correction dùng exact code text relative to mỗi candidate row; đây là primary demo fix và đã `VERIFIED_MULTI_BROWSER`.
- TC-005 generic rejection oracle ban đầu có thể đòi existing `SAVE10` biến mất. Correction giữ baseline count và xác nhận `SAVE10` vẫn đúng một lần.
- TC-002 ban đầu chấp nhận hidden/aria-only `*`; correction yêu cầu visible associated label/labelled element.
- Historical TC-003 Chromium failure là automation defect: valid percent coupon đã create thành công nhưng helper assert thêm locale-dependent min-order display ngoài primary scope. Assertion được giới hạn về exact owned row, percent type và submitted discount value; correction PASS trên ba engines.

Chi tiết: [FR-17 final summary](../execution-results/fr-17-final-summary.md), [AI review](../automation-reviews/fr-17-ai-review.md), [gap report](../gaps/fr-17-automation-gaps.md).

## 8. Multi-browser HTML reports

Chín final feature-browser reports được lưu trong `html-reports/`. Human execution reviews đã render và xác nhận từng report hiển thị Feature ID, `Run by: 23127107`, ISO timestamp, Run ID và browser identity.

| Feature | Chromium                                                      | Firefox                                      | WebKit                                      |
| ------- | ------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| FR-05   | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` |
| FR-09   | `FR-09-chromium-2026-08-09T22-35-59-4764573Z`                 | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` |
| FR-17   | `fr17-chromium-corrected-20260810T092053847+0700`             | `fr17-firefox-20260810T092258944+0700`       | `fr17-webkit-20260810T092419436+0700`       |

Historical/diagnostic reports được preserve nhưng không cộng thêm vào nine-run minimum hoặc final aggregate.

## 9. Defect reporting và GitHub Issues

Repository có 14 standardized Markdown Bug Reports, 14 promoted screenshots và 14 GitHub Issue-ready drafts:

| Feature | Confirmed defects | Local report directory | GitHub publication |
| ------- | ----------------: | ---------------------- | ------------------ |
| FR-05   |                 5 | `docs/defects/fr-05/`  | `NOT_PUBLISHED`    |
| FR-09   |                 5 | `docs/defects/fr-09/`  | `NOT_PUBLISHED`    |
| FR-17   |                 4 | `docs/defects/fr-17/`  | `NOT_PUBLISHED`    |

Screenshot promotion dùng bản sao byte/hash-identical từ actual failure evidence; không recapture chỉ để làm đẹp report. Tuy nhiên rubric yêu cầu bugs được log trên GitHub Issues page và attach screenshot. Vì issue drafts chưa publish, mục này vẫn là pre-submission blocker và cần sinh viên thực hiện trên public repository.

## 10. Task 2 - Demo video

Primary demo là `FR17-TC-004 @demo`: admin tạo valid fixed coupon với external data, row count chuyển `0 -> 1`, row được verify và test-owned record được cleanup về exact seed baseline. Primary AI-generated script fix để thuyết minh là `getCouponRow` relative-locator correction.

Kịch bản quay tích hợp Task 2 và Agent Skill có tại [HW04-FR17-VIDEO-SCRIPT.md](../demo/HW04-FR17-VIDEO-SCRIPT.md); recording checklist có tại [fr-17-demo-checklist.md](../demo/fr-17-demo-checklist.md). Video phải:

- unlisted YouTube, tối thiểu 5 phút, narration tiếng Việt;
- cho thấy end-to-end automation, multi-browser execution và generated HTML report;
- giải thích ít nhất một AI-generated script correction;
- chứng minh authorship bằng face-cam hoặc terminal chạy `whoami` và `hostname`;
- trình bày cách Agent Skill được dùng cho một complete feature nếu dùng cùng video làm Agent Skill demonstration.

Current recording status: `NOT_RECORDED`. Không có YouTube URL tại thời điểm report được tạo.

## 11. Agent Skills

Bốn repo-local skills có `SKILL.md`:

- `generate-test-cases-from-requirements`
- `playwright-feature-workflow`
- `log-ai-audit`
- `validate-hw04-submission`

Core reusable workflow là `playwright-feature-workflow`, hỗ trợ data-driven planning, automation review gates, multi-browser execution, triage và finalization. `log-ai-audit` giữ verbatim interaction evidence; validator chỉ kiểm tra read-only và không tự chứng minh correctness. Agent Skill demonstration video vẫn chưa tồn tại; có thể tích hợp vào video FR-17 nếu flow ghi hình cho thấy skill prompt/checkpoint, generated artifact, correction và execution/report end to end.

## 12. AI Audit và AI Critique

- AI Audit Markdown: [AI_AUDIT_LOG.md](../ai-audit/AI_AUDIT_LOG.md)
- AI Critique Markdown: [AI_CRITIQUE.md](../ai-critique/AI_CRITIQUE.md)
- PDF exports: `output/pdf/`

AI Audit Student Information, Student Confirmation và bất kỳ statement mang tính xác nhận cá nhân phải được sinh viên hoàn tất. Main report/critique được AI hỗ trợ nên sinh viên phải đọc, sửa nếu cần và log interaction này trước khi nộp.

## 13. Git commit history

Actual branch log được xuất tại [GIT_COMMIT_LOG.txt](../git/GIT_COMMIT_LOG.txt). Pre-submission validation xác nhận `8/8` commits trên current branch thực sự thay đổi `.spec.js`: hai commits FR-05/FR-09 và sáu commits chức năng bổ sung dần 16 Test Case IDs của FR-17. Documentation/config/data/helper-only commits không được tính thay cho test-script commits. Theo cập nhật của giảng viên do sinh viên cung cấp ngày 2026-08-10, tiêu chí phân bố commit theo nhiều ngày đã được loại bỏ; báo cáo chỉ đánh giá minimum `8` test-script commits. Không có commit nào được backdate hoặc tạo rỗng.

## 14. Self-assessment

| No. | Criteria                   | Maximum | Self-Assessed Grade |
| --- | -------------------------- | ------: | ------------------: |
| 1   | Task 1 - Feature A (FR-05) |      25 |                  25 |
| 1   | Task 1 - Feature B (FR-09) |      25 |                  25 |
| 1   | Task 1 - Feature C (FR-17) |      25 |                  25 |
| 2   | Task 2 - Demo video        |      15 |                  15 |
| 3   | Agent Skills               |      10 |                  10 |
|     | **Total**                  | **100** |                 100 |

Không tạo ZIP trước khi có three-digit `SelfAssessedGrade`, final video URL, public branch, published issues và student confirmation. Filename cuối phải theo dạng `23127107_HW04_AI_Automation_NNN.zip`, trong đó `NNN` là điểm tự đánh giá từ `000` đến `100`.

## 15. Submission readiness

Đã có evidence mạnh cho test design, external data, 45 automated tests, 135 executed combinations, nine final HTML reports, human review/corrections, 14 confirmed defects, screenshots và audit history. Bài vẫn chưa thể gọi là submission-ready vì các mục bắt buộc sau cần người dùng hoàn tất:

1. Review/approve main report và AI Critique; tạo audit entry cho interaction lập report.
2. Điền Student Information, AI Audit conclusion/disclosure/confirmation bằng thông tin cá nhân đã xác nhận.
3. Push branch/artifacts lên public GitHub repository.
4. Publish 14 GitHub Issues và attach đúng promoted screenshot.
5. Record/publish unlisted demo video và Agent Skill demonstration evidence.
6. Regenerate Git commit log sau final artifact commits và xác nhận minimum `8/8` test-script commits vẫn giữ `PASS`.
7. Chọn self-assessed grade, export final PDFs sau review và tạo ZIP đúng tên.

Checklist chi tiết: [HW04_SUBMISSION_CHECKLIST.md](../submission/HW04_SUBMISSION_CHECKLIST.md).

## 16. Kết luận

Automation scope đã hoàn thành ở mức kỹ thuật có traceability: ba features từ ba pools, external data, multi-browser Playwright runs, HTML reports, human-reviewed corrections và confirmed defect evidence. Điểm quan trọng nhất trong quá trình là phân biệt product defect với automation defect: TC-006 của FR-05 và TC-003 của FR-17 chỉ được kết luận sau targeted correction và cross-browser rerun. Phần còn lại trước khi nộp chủ yếu là attributable human evidence và publication: video, identity/confirmation, public GitHub branch/issues, valid commit history và final package.
