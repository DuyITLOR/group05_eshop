---
name: generate-test-cases-from-requirements
description: Phân tích requirement, thiết kế test conditions và sinh test cases có cấu trúc để sinh viên review trước khi chuyển sang automation.
---

# generate-test-cases-from-requirements

## 1. Skill Name
`generate-test-cases-from-requirements`

## 2. Purpose
Skill này dùng để đọc requirement hoặc specification của một feature, phân tích phạm vi chức năng, thiết kế test conditions và sinh test cases có cấu trúc để sinh viên review trước khi chuyển sang automation.

## 3. Scope
Skill chỉ thực hiện **test analysis** và **test design**.
Skill không được sinh Playwright code hoặc chạy test.

## 4. When to Use
Sử dụng khi cần tạo test cases từ requirement gốc cho một chức năng cụ thể nhằm đảm bảo bao phủ đầy đủ các case hợp lệ, không hợp lệ và biên.

## 5. When Not to Use
- Không sử dụng để sinh code Playwright (spec, Page Objects, fixtures).
- Không sử dụng để chạy tests.
- Không sử dụng để tạo HTML reports, screenshots, traces hoặc báo cáo lỗi (bug reports).

## 6. Required Inputs
- Feature ID
- Feature Name
- Requirement Source (file, thư mục, user story, use case, v.v.)
- Actor / User Role
- Minimum Test Case Count
- Output Directory

## 7. Optional Inputs
- Existing Test Cases
- Existing Test Conditions
- Requirement IDs
- Acceptance Criteria
- Business Rules
- API Documentation
- UI Screenshots
- DOM Notes
- Database Schema
- State Diagram
- Data Dictionary
- Existing Bug Reports
- Scope Exclusions
- Preferred Test Case Template
- Priority Rules
- Automation Target
- Supported User Roles
- Related Feature IDs
- Test Case ID Prefix
- Output Language
- Approved Requirement Version

## 8. Language Rules
- Ngôn ngữ chính: **tiếng Việt**.
- Hướng dẫn trong `SKILL.md` viết bằng tiếng Việt.
- Phân tích requirement, test steps, expected results, review notes, explanations viết bằng tiếng Việt.
- Thuật ngữ kỹ thuật, enum, status, checkpoint, file name, command giữ nguyên tiếng Anh.
- Heading và field name trong template giữ tiếng Anh.
- Các giá trị không dịch: `POSITIVE`, `NEGATIVE`, `EDGE`, `HIGH`, `MEDIUM`, `LOW`, `AUTOMATION_SUITABLE`, `AUTOMATION_POSSIBLE_WITH_SETUP`, `MANUAL_RECOMMENDED`, `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION`, `NEEDS_CLARIFICATION`, `FULLY_COVERED`, `PARTIALLY_COVERED`, `NOT_COVERED`.

## 9. Source Priority
Ưu tiên theo thứ tự:
1. Functional Requirement / specification chính thức.
2. Acceptance Criteria đã phê duyệt.
3. User Story / Use Case đã phê duyệt.
4. Tài liệu thiết kế test trước đó.
5. API contract / data dictionary.
6. State diagram / workflow document.
7. README / tài liệu vận hành.
8. Source code (chỉ dùng làm implementation reference).

Phân loại nguồn: `AUTHORITATIVE`, `SUPPORTING`, `IMPLEMENTATION_ONLY`, `UNCERTAIN`.
Nếu mâu thuẫn, trả về `REQUIREMENT_CONFLICT_DETECTED` (kèm Conflict ID, Feature, Source A, Source B, Conflicting Information, Affected Requirements, Affected Test Cases, Question).

## 10. Pre-flight Validation
1. Kiểm tra Feature ID và Feature Name.
2. Kiểm tra Requirement Source.
3. Kiểm tra Actor / User Role.
4. Kiểm tra Minimum Test Case Count (>0).
5. Kiểm tra Output Directory.
6. Phát hiện nhiều version, source conflict, empty template.
7. Đánh giá tính khả thi để viết Expected Result (không tự bịa thông tin).
Trả về `PARTIAL_REQUIREMENT_ANALYSIS` nếu thiếu sót, hoặc `REQUIREMENT_INFORMATION_INSUFFICIENT` nếu không thể tạo test case.

## 11. Source Discovery
Tạo danh sách các nguồn (Source ID, Source, Source Type, Authority, Related Requirement, Notes) và Requirement Gap Table (Gap ID, Missing Information, Why It Matters, Affected Behavior, Question).

## 12. Requirement Extraction
Trích xuất Actor, Permissions, Preconditions, Trigger, Main Flow, Alternative Flows, Validation Rules, Business Rules, v.v.
Tạo bảng trích xuất: Requirement ID, Requirement Statement, Source, Testable, Notes. (ID nội bộ đánh dấu `INTERNAL_TRACEABILITY_ID`).

## 13. Test Condition Design
Thiết kế dựa trên luồng và kỹ thuật: `EQUIVALENCE_PARTITIONING`, `BOUNDARY_VALUE_ANALYSIS`, `DECISION_TABLE`, `STATE_TRANSITION`, `USE_CASE_TESTING`, `ERROR_GUESSING`, `ROLE_PERMISSION_TESTING`, `CRUD_COVERAGE`, `PAIRWISE_CANDIDATE`, `OTHER`.
Mỗi condition: Test Condition ID, Requirement ID, Description, Test Technique, Priority, Source Reference.

## 14. Test Case Generation
Sinh test cases theo loại: `POSITIVE`, `NEGATIVE`, `EDGE`.
Expected Result phải cụ thể, kiểm chứng được và có source. Không dùng "System works correctly" hay tự bịa error message. ID prefix theo đúng định dạng (VD: `FR05-TC-001`).

## 15. Test Case Quality Review
Kiểm tra duplicate, steps không khớp, expected result mơ hồ, thiếu references. Recommendation: `KEEP`, `MERGE`, `REMOVE`, `SPLIT`, `REWRITE`, `NEEDS_HUMAN_DECISION`.

## 16. Automation Suitability
Phân loại: `AUTOMATION_SUITABLE`, `AUTOMATION_POSSIBLE_WITH_SETUP`, `MANUAL_RECOMMENDED`, `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION`, `NEEDS_CLARIFICATION`.

## 17. Assertion Candidates
Đề xuất assertion logic: `URL_OR_NAVIGATION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE`, `COUNT`, `ENABLED_OR_DISABLED_STATE`, `API_RESPONSE`, `PERSISTENCE`, `STATE_TRANSITION`, `CALCULATION`, `PERMISSION`, `ATTRIBUTE_OR_CLASS`.

## 18. Requirement Coverage
Lập Requirement Coverage Matrix, phân loại `FULLY_COVERED`, `PARTIALLY_COVERED`, `NOT_COVERED`, `NEEDS_CLARIFICATION`.

## 19. Scope Review
Đảm bảo test case đúng feature, đúng quyền (admin/customer), không lọt ranh giới e2e.

## 20. Human-Review Checkpoints
Dừng tại: `CHECKPOINT: TEST_CASE_DESIGN_REVIEW_REQUIRED`. Cung cấp summary. Chỉ đi tiếp khi `APPROVE TEST CASE DESIGN`, `REQUEST TEST CASE CHANGES`, `REJECT TEST CASE DESIGN`.

## 21. Status and Error Handling
Trạng thái bắt buộc:
`REQUIREMENT_SOURCE_NOT_FOUND`, `REQUIREMENT_SOURCE_UNREADABLE`, `REQUIREMENT_CONFLICT_DETECTED`, `REQUIREMENT_INFORMATION_INSUFFICIENT`, `INVALID_FEATURE_ID`, `INVALID_MINIMUM_TEST_CASE_COUNT`, `OUTPUT_PATH_INVALID`, `PARTIAL_REQUIREMENT_ANALYSIS`, `MINIMUM_TEST_CASE_COUNT_NOT_REACHED`, `DUPLICATE_TEST_CASES_DETECTED`, `OUT_OF_SCOPE_CASES_DETECTED`, `TEST_CASE_DESIGN_INCOMPLETE`, `TEST_CASE_DESIGN_REVIEW_REQUIRED`, `TEST_CASE_DESIGN_APPROVED`, `TEST_CASE_DESIGN_REJECTED`.

## 22. Safety Rules
- Không tự bịa requirement, result, error message, permission, limit.
- Không sửa requirement gốc.
- Không chạy SUT, automation, gọi API, sửa DB.
- Không tự phê duyệt.

## 23. Output
Thư mục: `docs/test-cases/<feature-id>/`
- `requirement-analysis.md`
- `test-cases.md`
- `requirement-coverage.md`
- `review-notes.md`

## 24. Acceptance Criteria
Hoàn thành khi tạo đúng 1 skill, tuân thủ convention, ngôn ngữ chính xác, không sinh Playwright code, có requirement coverage, automation suitability, assertion candidates. Không tự bịa dữ liệu.

## 25. Invocation Example
```text
$generate-test-cases-from-requirements

Feature ID: FR-05
Feature Name: Product listing and search

Requirement Source:
- docs/requirements/fr-05.md
- docs/hw02/fr-05-existing-test-cases.md

Actor / User Role: Public user
Minimum Test Case Count: 12
Output Directory: docs/test-cases/fr-05/
Automation Target: Playwright web frontend
Test Case ID Prefix: FR05
```

## 26. Output Summary Example
```text
Status: TEST_CASE_DESIGN_REVIEW_REQUIRED

Feature:
FR-05 — Product listing and search

Sources:
- AUTHORITATIVE: 2
- SUPPORTING: 1
- IMPLEMENTATION_ONLY: 1

Requirements Extracted: 8

Test Cases:
- Total: 14
- POSITIVE: 5
- NEGATIVE: 5
- EDGE: 4

Automation Suitability:
- AUTOMATION_SUITABLE: 10
- AUTOMATION_POSSIBLE_WITH_SETUP: 3
- NEEDS_CLARIFICATION: 1

Coverage:
- FULLY_COVERED: 6
- PARTIALLY_COVERED: 1
- NEEDS_CLARIFICATION: 1

Review Findings:
- Duplicate Candidates: 1
- Out-of-Scope Candidates: 0

Checkpoint:
CHECKPOINT: TEST_CASE_DESIGN_REVIEW_REQUIRED
```

## 27. Related Skills
Output `APPROVED` của skill này có thể dùng làm input cho automation workflow. Không sinh automation code, không gọi skill khác, không tạo circular dependency.
