# HW04 Video Demo Script - FR-17 with Agent Skill

## 1. Mục tiêu video

Kịch bản này gộp hai yêu cầu vào một video YouTube `Unlisted` dài khoảng `7-8 phút`:

1. **Task 2 demo:** chạy một Playwright automation script end to end trên Chromium, Firefox và WebKit; mở generated HTML report; giải thích một correction đối với AI-generated script.
2. **Agent Skill demo:** cho thấy end-to-end cách `playwright-feature-workflow` được dùng cho một complete feature: approved input -> plan/data/script -> human checkpoint -> execution/triage -> corrected multi-browser evidence -> final traceability.

Primary feature: `FR-17 - Coupon management`.

Primary demo test: `FR17-TC-004 @demo`.

Primary script correction: `getCouponRow` row-relative exact-code locator.

Recording status: `SCRIPT_READY - NOT_RECORDED`.

## 2. Rubric coverage map

| HW04 requirement                             | Scene covering it                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Video `Unlisted`, at least 5 minutes         | Upload/final-check section; planned duration 7-8 minutes                                                    |
| Vietnamese narration                         | Exact Vietnamese narration is provided for every scene                                                      |
| One automation script end to end             | Scenes 6-7 run `FR17-TC-004 @demo`                                                                          |
| Multi-browser run                            | One command collects/runs the tagged test on `chromium`, `firefox`, `webkit`                                |
| Generated HTML report                        | Scene 8 opens the new run-specific Playwright report                                                        |
| Explain at least one AI-generated script fix | Scene 5 explains the `getCouponRow` locator defect and correction                                           |
| Authorship evidence                          | Scene 1 visibly runs both `whoami` and `hostname`                                                           |
| Agent Skill end-to-end demonstration         | Scenes 3-4 show skill definition, actual A-016 interaction, checkpoints and A-017-A-021 downstream evidence |

## 3. Pre-recording preparation - do not record yet

### 3.1 Runtime safety

- Use the approved isolated FR-17 backend/database only.
- Never set `FR17_TEST_DB_PATH` to workspace `backend/database.sqlite`.
- Reverify Web Admin, isolated backend, exact four-coupon seed baseline and workspace DB protection immediately before the recording run.
- Load credentials into environment variables privately before recording. Do not type, display, print or persist passwords/JWT values in the video.
- Keep `workers=1`, `retries=0`, `screenshot=only-on-failure`, `trace=retain-on-failure`, `video=off`.
- The recording run is a new demonstration run. It does not replace archived A-020 corrected cross-browser evidence.

Required runtime-only variables:

```text
SUT_API_BASE_URL
FR17_ADMIN_BASE_URL
FR17_TEST_ADMIN_EMAIL
FR17_TEST_ADMIN_PASSWORD
FR17_TEST_USER_EMAIL
FR17_TEST_USER_PASSWORD
FR17_ISOLATED_DB
FR17_TEST_DB_PATH
```

Set these values before recording, then clear the terminal screen. During recording, only show whether each variable exists - never show its value.

### 3.2 Open these tabs before recording

1. `2026.HW04.Automation Testing_En.pdf` - Task 2 and Agent Skill requirements.
2. `agent-skills/playwright-feature-workflow/SKILL.md` - sections 2, 6, 12-22 and 25.
3. `docs/ai-audit/interactions/A-016-prompt.md` - actual skill-driven automation-build prompt.
4. `docs/ai-audit/interactions/A-016-output.md` - original AI build output and checkpoint.
5. `docs/ai-audit/AI_AUDIT_LOG.md` - A-016 human review and A-020/A-021 final verification.
6. `docs/automation-reviews/fr-17-ai-review.md` - `FR17-REV-012` original locator finding.
7. `test-data/fr-17.json` - `FR17-DATA-004`.
8. `tests/fr-17/fr-17.spec.js` - `FR17-TC-004 @demo`.
9. `tests/fr-17/helpers/coupon-ui.js` - `getCouponRow`, `expectOwnedCouponCore`, `expectOwnedCouponBoundaryValues`.
10. A PowerShell terminal in the repository root.

### 3.3 Recording layout

- Recommended resolution: `1920x1080`.
- Terminal/editor font size: at least `18px`.
- Zoom source files so Test Case ID, dataset ID, checkpoint and code lines remain readable.
- Close notifications and any tab containing personal credentials.
- Keep the terminal visible continuously during the actual multi-browser command; do not cut away while the run is in progress.

## 4. Timeline overview

| Time           | Scene                               | Main evidence                                                 |
| -------------- | ----------------------------------- | ------------------------------------------------------------- |
| `00:00-00:35`  | Identity and introduction           | `whoami`, `hostname`, student ID, FR-17 scope                 |
| `00:35-01:05`  | Rubric requirements                 | PDF Task 2 and Agent Skill sections                           |
| `01:05-02:05`  | Explain the Agent Skill             | Purpose, inputs, checkpoints, multi-browser/report validation |
| `02:05-03:05`  | Show actual end-to-end skill usage  | A-016 prompt/output; A-017-A-021 artifact chain               |
| `03:05-04:15`  | Explain the AI-generated script fix | A-016 human review and corrected `getCouponRow`               |
| `04:15-04:55`  | Show external data and test oracle  | `FR17-DATA-004`; `FR17-TC-004 @demo`                          |
| `04:55-06:35+` | Execute multi-browser demo          | One test on Chromium/Firefox/WebKit; duration may extend      |
| `06:35-07:20`  | Open HTML report                    | Feature ID, Run by, ISO timestamp, Run ID, projects/result    |
| `07:20-07:50`  | Summary and disclosure              | cleanup, archived evidence boundary, conclusion               |

If execution takes longer, keep recording and continue narration. Do not speed through or remove the browser-project output needed to prove the run.

## 5. Detailed recording script

### Scene 1 - `00:00-00:35` - Identity and introduction

**On screen**

Open PowerShell at repository root and run:

```powershell
Clear-Host
whoami
hostname
git branch --show-current
```

Then open `README.md` at the HW04 Submission Summary.

**Exact narration**

> Xin chào thầy cô. Em thực hiện bài HW04 Automation Testing với Student ID 23127107. Trên màn hình là kết quả hai lệnh whoami và hostname để xác nhận người thực hiện video. Feature em chọn để demo là FR-17 Coupon management thuộc Pool C. Video này vừa trình bày một Playwright test chạy end to end trên ba browser, vừa cho thấy cách em đã dùng Agent Skill playwright-feature-workflow và human review để hoàn thiện feature.

### Scene 2 - `00:35-01:05` - Show the requirements

**On screen**

Open the assignment PDF at Task 2 and Agent Skill. Highlight:

- at least 5 minutes;
- Vietnamese narration;
- multi-browser run and HTML report;
- explain one AI-generated script fix;
- face-cam or `whoami` and `hostname`;
- Agent Skill demonstrated end to end on a complete feature.

**Exact narration**

> Theo yêu cầu HW04, video phải dài ít nhất năm phút, thuyết minh bằng tiếng Việt, thể hiện multi-browser execution, HTML report và ít nhất một correction đối với AI-generated script. Phần Agent Skill yêu cầu cho thấy workflow được dùng end to end trên một feature hoàn chỉnh. Vì vậy em lồng hai phần này trong cùng flow FR-17, thay vì chỉ chạy một test mà không giải thích quá trình tạo và review automation.

### Scene 3 - `01:05-02:05` - Explain `playwright-feature-workflow`

**On screen**

Open `agent-skills/playwright-feature-workflow/SKILL.md`. Show these sections briefly:

- `Purpose`: one feature per invocation;
- `Required Inputs`;
- `Automation Planning` and `Test Data Design`;
- `AI-Generated Code Review`;
- `Human-Review Checkpoints`;
- `Multi-Browser Execution`, `HTML Report Validation`, `Failure Triage`;
- `Safety Rules`.

**Exact narration**

> Skill này nhận approved test cases của một feature, sau đó điều phối automation planning, external JSON data, Playwright script generation, AI code review, execution readiness, multi-browser execution và failure triage. Điểm quan trọng là skill không tự approve. Nó dừng tại các checkpoint như Automation Plan Review, Test Data Review, Automation Review và Failure Classification Review. Skill cũng cấm bịa locator, sửa SUT, lưu secret hoặc tạo fake execution evidence. Như vậy AI tạo draft và hỗ trợ workflow, còn em chịu trách nhiệm review oracle, correction và quyết định cuối.

### Scene 4 - `02:05-03:05` - Show actual skill usage on FR-17

**On screen**

1. Open `docs/ai-audit/interactions/A-016-prompt.md` and show the feature header, approved inputs and required checkpoint.
2. Open `A-016-output.md` and show:
   - `BUILT_PENDING_HUMAN_REVIEW`;
   - 16 approved/implemented tests;
   - external dataset and isolated DB strategy;
   - the original `DEMO_FIX_CANDIDATE: NO` conclusion;
   - `CHECKPOINT: FR17_AUTOMATION_BUILD_REVIEW_REQUIRED`.
3. Open `docs/ai-audit/AI_AUDIT_LOG.md` and quickly show the artifact chain:
   - A-016: automation build;
   - A-017: execution readiness;
   - A-018: Chromium gate;
   - A-019: runtime automation correction;
   - A-020: corrected multi-browser execution;
   - A-021: final defect/demo readiness.

**Exact narration**

> Đây là interaction thật đã dùng skill cho FR-17. A-016 nhận approved design và sinh automation bundle gồm 16 tests, external data, fixtures, review và gap artifacts. Output dừng ở checkpoint yêu cầu human review, chưa tự tuyên bố code đúng hoặc tự chạy browser. Output ban đầu còn kết luận chưa có demo-fix candidate cho FR-17; human review sau đó mới phát hiện locator defect thật. A-017 kiểm tra execution readiness; A-018 chạy Chromium và kích hoạt automation-defect gate; A-019 sửa automation defect; A-020 xác nhận corrected execution trên Chromium, Firefox và WebKit; A-021 hoàn tất defect traceability và demo readiness. Chuỗi artifact này chứng minh skill được dùng trên toàn bộ một feature, không chỉ là một file script rời rạc.

### Scene 5 - `03:05-04:15` - Explain the genuine AI-generated script fix

**On screen**

1. In `docs/automation-reviews/fr-17-ai-review.md`, show `FR17-REV-012`, then show the corresponding A-016 human-review notes in `AI_AUDIT_LOG.md`.
2. Open `tests/fr-17/helpers/coupon-ui.js` at:

```javascript
function getCouponRow(page, code) {
  return getCouponRows(page).filter({
    has: page.getByText(code, { exact: true }),
  });
}
```

3. Show `expectOwnedCouponCore()` and how TC-004 consumes the returned row.
4. Optionally show A-020 evidence that TC-004 and the locator correction passed on all three engines.

**Exact narration**

> Human review phát hiện helper getCouponRow do AI tạo ban đầu kết hợp filter has với locator đã bị scope qua ancestor coupon table. Cách đó có thể bỏ sót row hợp lệ và tạo false failure cho nhiều cases, trong đó có TC-004 dùng cho demo. Correction giữ outer locator là từng tbody row và tìm exact coupon code tương đối với mỗi candidate row. Em không dùng nth hoặc generated class để che vấn đề. Sau correction, TC-004 đã chạy PASS trên Chromium, Firefox và WebKit. Đây là một test-script correction thực sự, không phải sửa Expected Result hoặc sửa SUT để làm test pass.

**Important wording**

Do not say “AI generated the correct locator immediately.” The audit verdict for A-016 is `INCOMPLETE` because human-directed correction was required.

### Scene 6 - `04:15-04:55` - Show data-driven input and the test oracle

**On screen**

Open `test-data/fr-17.json` at `FR17-DATA-004`, then `tests/fr-17/fr-17.spec.js` at `FR17-TC-004 @demo`.

Point to:

- `type = fixed`;
- `discountValue = 1`;
- `minOrderAmount = 0`;
- `maxUsesPerUser = 1`;
- row count starts at zero;
- valid POST response;
- exact owned row/type/value/boundary assertions;
- cleanup in `finally`.

**Exact narration**

> TC-004 không hardcode data-driven array trong spec. Test đọc FR17-DATA-004 từ external JSON. Đây là valid fixed coupon ở các lower valid boundaries: discount value bằng một, minimum order bằng không và maximum uses bằng một. Oracle kiểm tra owned code chưa tồn tại, create request thành công, exact row xuất hiện với đúng type và values, sau đó finally chỉ xóa test-owned record. Isolated DB fixture xác nhận exact seed baseline nên test không phụ thuộc thứ tự và không làm thay đổi workspace database.

### Scene 7 - `04:55-06:35+` - Run the tagged test on all three browsers

**On screen**

The runtime-only secrets and isolated DB path must already be configured privately. Run this safe preparation block; it prints only presence flags for sensitive inputs:

```powershell
$requiredRuntimeInputs = @(
  'SUT_API_BASE_URL',
  'FR17_ADMIN_BASE_URL',
  'FR17_TEST_ADMIN_EMAIL',
  'FR17_TEST_ADMIN_PASSWORD',
  'FR17_TEST_USER_EMAIL',
  'FR17_TEST_USER_PASSWORD',
  'FR17_ISOLATED_DB',
  'FR17_TEST_DB_PATH'
)

$requiredRuntimeInputs | ForEach-Object {
  '{0} configured: {1}' -f $_, (Test-Path -LiteralPath "Env:$($_)")
}

$runTimestamp = [DateTimeOffset]::UtcNow.ToString('o')
$safeStamp = [DateTimeOffset]::UtcNow.ToString('yyyyMMddTHHmmssfffZ')
$env:FEATURE_ID = 'FR-17'
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5174'
$env:FR17_ADMIN_BASE_URL = 'http://localhost:5174'
$env:FR17_ISOLATED_DB = 'true'
$env:RUN_TIMESTAMP = $runTimestamp
$env:RUN_ID = "fr17-video-demo-$safeStamp"
$env:FR17_RUN_ID = $env:RUN_ID
$env:BROWSER_PROJECT = 'chromium-firefox-webkit'
$env:HTML_REPORT_DIR = "html-reports/fr-17/$($env:RUN_ID)"
$env:TEST_RESULTS_DIR = "test-results/fr-17/$($env:RUN_ID)"

npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo" --headed
```

Because the command does not specify `--project`, Playwright uses all three configured projects. FR-17 uses one worker, so the three project-test definitions run deterministically.

**Narration before pressing Enter**

> Lệnh này lọc đúng FR17-TC-004 bằng tag demo và không chỉ định một project riêng, nên Playwright chạy Chromium, Firefox và WebKit. Em tạo Run ID và ISO timestamp mới để report của recording không ghi đè archived evidence. Các dòng configured chỉ xác nhận biến môi trường tồn tại, không in secret values. Đây là demonstration run mới; final submitted metrics vẫn tham chiếu các archived full-feature runs đã được human review.

**Narration while browsers run**

> Trước mỗi project, fixture xác nhận isolated database và admin identity. Test tạo một code unique thuộc ownership của run hiện tại, nên dữ liệu của Chromium, Firefox và WebKit không va chạm nhau. Sau assertion, finally cleanup record ngay cả khi test fail. Trên giao diện, chúng ta có thể thấy form được điền, coupon được submit và exact row được tìm lại bằng corrected locator.

**After the command finishes**

- Read the actual terminal summary aloud.
- If it shows `3 passed`, state exactly `3 passed`.
- If any project fails, do not say the suite passed and do not hide the failure. Stop, inspect the actual evidence and record a new take only after a legitimate environment/automation correction has been reviewed.

### Scene 8 - `06:35-07:20` - Open and explain the HTML report

**On screen**

Run:

```powershell
npx.cmd playwright show-report $env:HTML_REPORT_DIR
```

In the report, visibly show:

- title contains `FR-17`;
- `Run by: 23127107`;
- ISO timestamp;
- recording Run ID;
- Chromium, Firefox and WebKit project results;
- `FR17-TC-004 @demo` result.

**Exact narration**

> Đây là Playwright HTML report được tạo từ chính recording run. Phần title hiển thị Feature ID FR-17, Run by 23127107, ISO timestamp và Run ID riêng. Bên trong report có kết quả của ba browser projects và test name chứa approved Test Case ID FR17-TC-004. Report này là evidence thật do Playwright tạo; em không chỉnh HTML hoặc chèn metadata sau execution.

### Scene 9 - `07:20-07:50` - Final summary

**On screen**

Open `docs/execution-results/fr-17-final-summary.md` at Demo Readiness and `docs/demo/fr-17-demo-checklist.md`.

**Exact narration**

> Tóm lại, Agent Skill đã hỗ trợ toàn bộ FR-17 từ approved inputs, automation build, checkpoints, execution readiness, failure triage đến corrected multi-browser evidence. Human review phát hiện và sửa locator defect thay vì điều chỉnh Expected Result cho phù hợp implementation. TC-004 sử dụng external data, isolated setup, assertions và deterministic cleanup; recording run vừa cho thấy test chạy trên ba browser và HTML report có identity. Sau khi kết thúc, em sẽ upload video ở chế độ Unlisted và cập nhật link vào README và main report.

## 6. What must remain visible in the final cut

- Real `whoami` output.
- Real `hostname` output.
- Assignment video requirements.
- `playwright-feature-workflow/SKILL.md` purpose/checkpoints.
- Actual A-016 prompt/output and human-review trail.
- Original issue description and corrected `getCouponRow` code.
- External `FR17-DATA-004` values.
- `FR17-TC-004 @demo` test block and cleanup.
- Uninterrupted final multi-browser command output.
- New Playwright HTML report with identity and timestamp.
- Vietnamese narration throughout the meaningful content.

## 7. Statements to avoid

Do not say:

- “AI generated everything correctly on the first attempt.”
- “The recording run replaces the full corrected execution evidence.”
- “The test passed” before reading the actual terminal/report result.
- “No product defects exist” - FR-17 has four confirmed defects.
- “All FR-17 behavior is cross-browser identical” - TC-008 and TC-011 were Chromium-specific observed behavior in approved final runs.
- “The workspace database is used for demo.”
- “GitHub Issues are published” while their status remains `NOT_PUBLISHED`.

## 8. Failure and recovery rules

If runtime preparation fails:

1. Stop before running Playwright.
2. Do not switch to workspace `backend/database.sqlite`.
3. Recreate/reverify the isolated runtime outside the recording.
4. Confirm exact four-seed baseline and runtime-only credentials.
5. Start a new recording take with a new Run ID.

If the test fails:

1. Preserve the generated report, screenshot and trace.
2. Do not use `force: true`, retries or `test.fail()` to make the video green.
3. Classify the failure using the same automation/product/environment boundary.
4. Apply corrections only after review, then use a new Run ID for a new take.

## 9. Post-recording checklist

- [ ] Duration is at least 5 minutes.
- [ ] Narration is in Vietnamese and audible.
- [ ] `whoami` and `hostname` are readable.
- [ ] No credentials, JWT, email password or private data are visible.
- [ ] Multi-browser command and actual result are visible.
- [ ] HTML report identity and ISO timestamp are readable.
- [ ] Agent Skill input, checkpoints and full FR-17 artifact chain are shown.
- [ ] `getCouponRow` correction is explained accurately.
- [ ] Video is uploaded as `Unlisted`.
- [ ] YouTube URL is added to `README.md`, `docs/report/HW04_MAIN_REPORT.md` and the submission checklist.
- [ ] Final link is tested in a signed-out/incognito browser.

## 10. Suggested YouTube metadata

**Title**

```text
23127107 - HW04 Automation Testing - FR-17 Playwright and Agent Skill Demo
```

**Description**

```text
HW04 Automation Testing demo for FR-17 Coupon management.

Contents:
- playwright-feature-workflow Agent Skill
- human review of an AI-generated locator defect
- external JSON test data
- FR17-TC-004 end-to-end execution
- Chromium, Firefox and WebKit
- Playwright HTML report

Student ID: 23127107
Repository: https://github.com/DuyITLOR/group05_eshop
```

YouTube visibility must be set to `Unlisted`, not `Public` or `Private`.
