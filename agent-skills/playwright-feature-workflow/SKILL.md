---
name: playwright-feature-workflow
description: Nhận test cases đã duyệt, lập kế hoạch automation, chuẩn bị test data, sinh Playwright scripts, review, chạy test trên nhiều browser, lưu evidence và phân tích lỗi.
---

# playwright-feature-workflow

## 1. Skill Name
`playwright-feature-workflow`

## 2. Purpose
Nhận một bộ test cases đã được con người phê duyệt, lập kế hoạch automation, chuẩn bị external test data, sinh Playwright scripts, review code do AI tạo, chạy một feature trên nhiều browser, lưu execution evidence thật và phân tích failures. Xử lý **một feature trong mỗi lần sử dụng**.

## 3. Scope
Skill chỉ hỗ trợ tạo automation plan, sinh test data (JSON/CSV), sinh code Playwright, review code, chạy test, lưu evidence, và phân tích lỗi cho một feature tại một thời điểm.
Không cài đặt package, không sửa source code của SUT, không tự sửa Playwright scripts hiện có nếu chưa có phê duyệt, không tự bịa thông tin.

## 4. When to Use
Khi đã có test cases được approved cho một feature và cần chuyển đổi sang automation test scripts hoàn chỉnh, chạy test, và lấy báo cáo kết quả.

## 5. When Not to Use
- Không dùng để viết test cases từ requirement (dùng `generate-test-cases-from-requirements`).
- Không dùng để cài đặt môi trường.
- Không dùng khi chưa có test cases được phê duyệt.
- Không dùng để tự động sửa lỗi của ứng dụng (SUT).

## 6. Required Inputs
- Workflow Mode
- Feature ID
- Feature Name
- Approved Test Case File
- Requirement / Expected Result Source
- SUT Base URL
- Student ID
- Target Browsers
- Test Data Format (JSON, CSV)
- Repository Root
- Test Directory
- Test Data Directory
- Report Output Directory

## 7. Optional Inputs
- Existing Playwright Configuration
- Existing Spec Files
- Existing Page Objects
- Existing Fixtures
- Authentication Setup
- Storage State
- Allowed API Endpoints
- API Setup Helpers
- Database Reset Instructions
- Seed Data Instructions
- Existing Test Data Files
- Selector Documentation
- Existing Test IDs
- UI Screenshots
- DOM Snapshots
- Environment Variables
- Browser-Specific Constraints
- Parallel Execution Preference
- Retry Policy
- Trace Policy
- Screenshot Policy
- Video Policy
- Reporter Configuration
- Existing HTML Reports
- Existing Automation Review
- Cleanup Strategy
- Allowed Source-Code Modification Policy

## 8. Language Rules
Ngôn ngữ chính: **tiếng Việt**. Hướng dẫn, automation plan, review notes, failure analysis, gap analysis viết bằng tiếng Việt. Code, file names, commands, enums, statuses, checkpoints giữ tiếng Anh. Template field names và report table headers bằng tiếng Anh, nội dung điền ưu tiên tiếng Việt. HTML report metadata phải chứa `Run by: <StudentID>`. Các classification/status được liệt kê giữ nguyên tiếng Anh.

## 9. Workflow Modes
- `PLAN_ONLY`: Chỉ tạo automation plan. Không sinh code, không chạy.
- `GENERATE_ONLY`: Sinh code dựa trên plan và data đã approved. Không chạy.
- `REVIEW_ONLY`: Review scripts hiện có. Không tự sửa.
- `EXECUTE`: Chạy target browsers từ scripts đã approved. Lưu evidence.
- `FULL_WORKFLOW`: Thực hiện toàn bộ phases và dừng tại từng checkpoint.

## 10. Pre-flight Validation
Kiểm tra toàn bộ input, approval evidence, requirement source, Playwright installation/version, binaries, SUT accessibility, directories, test data format... Không tiếp tục nếu thiếu thông tin quan trọng. Cảnh báo nguy cơ ghi đè.

## 11. Test Case Intake
Đọc approved test-case file. Tạo inventory. Kiểm tra ID duy nhất, expected result rõ, automation suitability... Nếu không thấy approval, trả về `TEST_CASE_APPROVAL_NOT_FOUND`.

## 12. Automation Planning
Tạo mapping: Test Case ID, Automation Status, Setup, Test Data, Locator Strategy, Assertion Strategy, Cleanup, Risks. Automation Status có thể là `READY_FOR_AUTOMATION`, `READY_WITH_SETUP`, `BLOCKED_BY_DATA`, `BLOCKED_BY_REQUIREMENT`, `MANUAL_ONLY`, `OUT_OF_SCOPE`. Phân tích rủi ro, cô lập test, v.v.
Checkpoint: `CHECKPOINT: AUTOMATION_PLAN_REVIEW_REQUIRED`.

## 13. Test Data Design
Sinh dữ liệu dạng external JSON hoặc CSV. Ghi rõ Test Case ID truy ngược, Setup/Cleanup requirement, Data Sensitivity. Không lưu secret thật. Không dùng inline collections. Có strategy cho unique data.
Checkpoint: `CHECKPOINT: TEST_DATA_REVIEW_REQUIRED`.

## 14. Script Generation
Sinh Playwright scripts sau approval. Test name chứa Test Case ID. Đọc external data. Không hardcode array. Không sửa SUT source code. Không dùng catch nuốt lỗi. Không dùng `waitForTimeout()` làm mặc định. Setup và cleanup rõ ràng.

## 15. Locator Strategy
Ưu tiên: `getByRole()`, `getByLabel()`, `getByPlaceholder()`, `getByText()`, `getByTestId()`, Stable CSS, XPath (cuối cùng). Không tự bịa locator, không dùng absolute XPath, tránh dependency. Thiếu thông tin trả về `LOCATOR_INFORMATION_INSUFFICIENT`.

## 16. Assertion Strategy
Ít nhất 3 assertion patterns: `URL_OR_NAVIGATION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE`, `COUNT`, `ENABLED_OR_DISABLED_STATE`, `ATTRIBUTE_OR_CLASS`, `API_RESPONSE`, `PERSISTENCE`, `STATE_TRANSITION`, `CALCULATION`, `PERMISSION`, `DOWNLOAD_OR_FILE`, `DIALOG`, `TOAST_OR_NOTIFICATION`.
Kiểm tra expected result, không chỉ kiểm tra element tồn tại.

## 17. AI-Generated Code Review
Review các rủi ro: Fragile Selectors, Absolute XPath, Weak Assertions, Hardcoded Test Data, `waitForTimeout()`, Thiếu Setup/Cleanup... Tạo bảng review với Human Decision: `APPROVED`, `REJECTED`, `MODIFIED`, `DEFERRED`, `NEEDS_MORE_EVIDENCE`.
Checkpoint: `CHECKPOINT: AUTOMATION_REVIEW_REQUIRED`.

## 18. Human-Review Checkpoints
Tồn tại các checkpoint:
- `CHECKPOINT: AUTOMATION_PLAN_REVIEW_REQUIRED`
- `CHECKPOINT: TEST_DATA_REVIEW_REQUIRED`
- `CHECKPOINT: AUTOMATION_REVIEW_REQUIRED`
- `CHECKPOINT: FAILURE_CLASSIFICATION_REVIEW_REQUIRED`

## 19. Execution Readiness
Kiểm tra script compile, test data tồn tại, target browsers, SUT health, ISO timestamp strategy, report metadata. Tạo execution plan (Run ID, Feature, Browser, Command, Report Path, Evidence Path).

## 20. Multi-Browser Execution
Chạy trên `chromium`, `firefox`, `webkit` hoặc browsers do người dùng khai báo. Ghi log: ID, Command, Timestamp, Duration, Passed, Failed, Skipped... Không tạo kết quả giả, không ghi đè evidence cũ mà không archive. Rerun phải tạo Run ID mới.

## 21. HTML Report Validation
Kiểm tra HTML report: đọc được, không rỗng, liên kết Feature ID, chứa `Run by: <StudentID>` và ISO timestamp. Báo lỗi `REPORT_METADATA_MISSING` nếu thiếu.

## 22. Failure Triage
Phân loại: `AUTOMATION_DEFECT`, `TEST_DATA_DEFECT`, `ENVIRONMENT_ISSUE`, `PRODUCT_DEFECT_CANDIDATE`, `UNDETERMINED`. Kiểm tra kỹ logic trước khi đánh giá là product defect. Tạo bảng triage với Confidence (`HIGH`, `MEDIUM`, `LOW`).
Checkpoint: `CHECKPOINT: FAILURE_CLASSIFICATION_REVIEW_REQUIRED`.

## 23. Automation Gap Analysis
Ghi nhận các case chưa automation: `NOT_IMPLEMENTED`, `BLOCKED_BY_REQUIREMENT`, `BLOCKED_BY_DATA`, `BLOCKED_BY_ENVIRONMENT`, `MANUAL_RECOMMENDED`, `DEFERRED`, `OUT_OF_SCOPE`. Không xóa case khỏi summary.

## 24. Status and Error Handling
Các trạng thái: `APPROVED_TEST_CASE_FILE_NOT_FOUND`, `TEST_CASE_APPROVAL_NOT_FOUND`, `REQUIREMENT_SOURCE_NOT_FOUND`, `UNRESOLVED_CLARIFICATION`, `STUDENT_ID_MISSING`, `INVALID_TEST_DATA_FORMAT`, `PLAYWRIGHT_NOT_INSTALLED`, `PLAYWRIGHT_CONFIG_NOT_FOUND`, `BROWSER_PROJECT_NOT_FOUND`, `BROWSER_BINARY_NOT_AVAILABLE`, `SUT_UNREACHABLE`, `OUTPUT_PATH_INVALID`, `AUTOMATION_PLAN_REVIEW_REQUIRED`, `AUTOMATION_PLAN_NOT_APPROVED`, `TEST_DATA_REVIEW_REQUIRED`, `TEST_DATA_NOT_APPROVED`, `LOCATOR_INFORMATION_INSUFFICIENT`, `AUTOMATION_REVIEW_REQUIRED`, `AUTOMATION_REVIEW_NOT_APPROVED`, `EXECUTION_NOT_READY`, `EXECUTION_FAILED`, `REPORT_NOT_GENERATED`, `REPORT_UNREADABLE`, `REPORT_METADATA_MISSING`, `FAILURE_CLASSIFICATION_REVIEW_REQUIRED`, `FAILURE_CLASSIFICATION_PENDING`, `AUTOMATION_GAPS_REMAIN`, `WORKFLOW_COMPLETED_WITH_WARNINGS`, `WORKFLOW_COMPLETED`.

## 25. Safety Rules
Không tự bịa locator, data rule, expected result. Không dùng production data. Không lưu secret. Không tạo fake evidence, sửa metadata report giả. Không tự commit, sửa Git history. Không tự approve.

## 26. Output
Code: `tests/<feature-id>/<feature-id>.spec.ts`, `test-data/<feature-id>.[json|csv]`.
Documentation (`docs/automation-plans/`, `docs/automation-reviews/`, `docs/run-logs/`, `docs/failure-analysis/`, `docs/gaps/`). Evidence (`html-reports/...`, `test-results/...`).

## 27. Acceptance Criteria
Chỉ 1 skill mới được tạo. Tuân thủ convention, không sửa file ngoài. Hướng dẫn tiếng Việt, labels/code tiếng Anh. Chỉ xử lý 1 feature, có workflow modes. Require external data, locator/assertion strategy, code review, multi-browser. Check metadata, triages failures. Đầy đủ checkpoints.

## 28. Invocation Example
```text
$playwright-feature-workflow

Workflow Mode: FULL_WORKFLOW
Feature ID: FR-05
Feature Name: Product listing and search

Approved Test Case File:
docs/test-cases/fr-05/test-cases.md

Requirement Source:
docs/requirements/fr-05.md

SUT Base URL:
http://localhost:3000

Student ID:
<provided-at-runtime>

Target Browsers:
- chromium
- firefox
- webkit

Test Data Format:
JSON

Repository Root:
.

Test Directory:
tests/

Test Data Directory:
test-data/

Report Output Directory:
html-reports/
```

## 29. Execution Summary Example
```text
Status: WORKFLOW_COMPLETED_WITH_WARNINGS

Feature:
FR-05 — Product listing and search

Test Cases:
- Received: 14
- Approved: 14
- Automated: 12
- Not Automated: 2

Test Data:
- Format: JSON
- Records: 12

Assertion Patterns:
- URL_OR_NAVIGATION
- TEXT_OR_VALUE
- COUNT
- VISIBILITY_OR_HIDDEN_STATE

Browser Runs:
- Chromium: completed
- Firefox: completed
- WebKit: completed

Executions:
- Total: 36
- Passed: 34
- Failed: 2
- Skipped: 0

Failure Classification:
- AUTOMATION_DEFECT: 1
- PRODUCT_DEFECT_CANDIDATE: 0
- UNDETERMINED: 1

Pending:
CHECKPOINT: FAILURE_CLASSIFICATION_REVIEW_REQUIRED
```

## 30. Related Skills
Có thể nhận approved output từ `generate-test-cases-from-requirements`. Output có thể kiểm tra bởi `validate-hw04-submission`. Không gọi tự động skill khác. Không sửa requirement. Không tự validate toàn bộ submission.
