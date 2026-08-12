---
name: log-ai-audit
description: Tạo và duy trì AI Audit Report theo FIT@HCMUS 5-section Template per Artifact, lưu verbatim prompt/output, human verdict, student fix và verification mà không sửa các artifact kiểm thử khác.
---

# log-ai-audit

## 1. Skill Name

`log-ai-audit`

## 2. Primary Objective

Tạo và duy trì:
`docs/ai-audit/AI_AUDIT_LOG.md`

theo FIT@HCMUS 5-section Template per Artifact.

Skill phải:

- dùng Markdown;
- giữ exact English section headings/field names/status labels;
- lưu verbatim prompts và AI outputs;
- một entry cho mỗi AI-generated artifact hoặc meaningful prompt-output interaction;
- lưu human verdict riêng với Student Fix;
- tự tính summary;
- không fabricate audit data.

## 3. Scope

Skill chỉ được đọc/ghi trong:

- `docs/ai-audit/`
- `docs/ai-audit/interactions/`

Template source có thể đọc từ:

- `templates/AI_Audit_Report_Template_EN.md`

Template chỉ được sửa khi user explicitly authorizes template modification.

Skill **không được sửa**:

- test cases;
- automation plans;
- test data;
- Playwright scripts;
- SUT source;
- Git history;
- unrelated docs.

## 4. Recommended Workflow Position

Nên initialize audit **trước artifact AI đầu tiên** của project/workflow.

Recommended order:

1. `INITIALIZE_AUDIT`
2. `CREATE_ENTRY`
3. Human review
4. `UPDATE_REVIEW`
5. Optional `ADD_CORRECTION_NOTE`
6. `FINALIZE_AUDIT`

Audit failure không được tự động sửa hoặc thay đổi artifact kiểm thử.

## 5. Required Structural Markers

Current-format audit log phải chứa:

```text
<!-- AUDIT_ENTRIES_START -->
<!-- AUDIT_ENTRIES_END -->
<!-- AUDIT_SUMMARY_START -->
<!-- AUDIT_SUMMARY_END -->
```

Markers phải:

- tồn tại đúng cặp;
- đúng thứ tự;
- không duplicate.

## 6. Initialization Behavior

Operation:
`INITIALIZE_AUDIT`

Nếu log chưa tồn tại:

1. đọc template;
2. request missing Student Information;
3. nếu thiếu:
   `AUDIT_INITIALIZATION_INFORMATION_REQUIRED`
4. tạo log;
5. preserve all markers;
6. không tạo fake artifact entry;
7. return:
   `AUDIT_LOG_INITIALIZED`

Nếu log đã tồn tại:

- không duplicate header;
- không duplicate Student Information;
- validate markers;
- không rewrite lịch sử.

## 7. Existing Log Classification

Khi log tồn tại, classify:

### Current format + markers valid

Tiếp tục bình thường.

### Current format nhưng marker bị thiếu/hỏng

Return:
`AUDIT_MARKER_MISSING`

Không append mù.

Tạo repair plan nhưng không sửa cho tới khi user approve:
`APPROVE AUDIT MARKER REPAIR`

### Legacy format

Nếu structure khác template hiện tại:
`LEGACY_AUDIT_FORMAT_DETECTED`

Không rewrite.

Tạo migration plan và chờ:
`APPROVE AI AUDIT FORMAT MIGRATION`

Missing marker **không đồng nghĩa** legacy format.

## 8. Supported Operations

### `INITIALIZE_AUDIT`

Khởi tạo hoặc validate current log.

### `CREATE_ENTRY`

- next unique Artifact ID;
- insert trước `AUDIT_ENTRIES_END`;
- preserve prompt/output;
- default Review Status:
  `PENDING_HUMAN_REVIEW`
- recalculates summary only from finalized entries.

### `UPDATE_REVIEW`

Update:

- Verdict
- Verdict Scope
- Reasoning
- Student Fix
- Verification
- Approval Status

Không alter original prompt/output.

### `ADD_CORRECTION_NOTE`

Append timestamped note.
Không xóa verdict/fix cũ.

### `ATTACH_EXTERNAL_OUTPUT`

Store long output ở:

- `docs/ai-audit/interactions/<artifact-id>-prompt.md`
- `docs/ai-audit/interactions/<artifact-id>-output.md`

Verify file tồn tại.

### `REPAIR_MARKERS`

Chỉ sau:
`APPROVE AUDIT MARKER REPAIR`

Rules:

- backup log first trong `docs/ai-audit/backups/`;
- repair markers tối thiểu;
- không rewrite entries;
- không renumber Artifact IDs;
- validate structure sau repair.

### `FINALIZE_AUDIT`

Validate toàn bộ document.

## 9. Required Artifact Entry Format

### (1) Prompt + Tool

Exact labels:

- Tool
- Model
- Date and Time
- Workflow Stage
- Feature / Task
- Related Artifact
- Verbatim Prompt

### (2) AI Output

Exact labels:

- Output Storage
- Full Output / Evidence Path
- Verbatim AI Output or Labelled Excerpt

Output Storage:

- `INLINE`
- `EXTERNAL_FILE`
- `SCREENSHOT_REFERENCE`

### (3) Verdict

Verdict:

- `VALID`
- `INVALID`
- `INCOMPLETE`

Before final human review:

- Review Status = `PENDING_HUMAN_REVIEW`
- Verdict blank hoặc pending theo template convention.

### (4) Reasoning

Exact labels:

- Review Notes

Reasoning phải nêu:

- AI làm đúng gì;
- sai/thiếu/fragile/unsupported gì;
- vì sao quan trọng;
- vì sao AI có thể bỏ sót;
- source nào support verdict.

Không bịa citation/ISTQB/RFC/execution result.

Không có evaluation source:
`AUDIT_REASONING_SOURCE_REQUIRED`

### (5) Student Fix

Exact labels:

- Student Decision
- Changes Made
- Change Illustration
- Correction Notes
- Verification Method
- Verification Result
- Final File
- Approval Status

Student Decision:

- `ACCEPTED_AS_IS`
- `MODIFIED`
- `REJECTED`

Verification Result:

- `PASSED`
- `FAILED`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`

Approval Status:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `DEFERRED`

## 10. Verdict Semantics

Verdict đánh giá **AI output tại thời điểm review**, không phải trạng thái cuối của artifact sau khi sửa.

Ví dụ:

- AI output ban đầu thiếu/sai một phần → `INCOMPLETE`
- Student sửa → `Student Decision: MODIFIED`
- Review lại đạt → `Verification Result: PASSED`
- Final artifact approved → `Approval Status: APPROVED`

Không đổi `INCOMPLETE` thành `VALID` chỉ vì correction sau đó đã pass.

Nếu output ban đầu đúng và accepted as-is:

- Verdict `VALID`
- Student Decision `ACCEPTED_AS_IS`

Nếu output sai và bị reject:

- Verdict `INVALID`
- Student Decision `REJECTED`

## 11. Verbatim Content Rules

Prompt/output phải giữ nguyên:

- không paraphrase;
- không translate;
- không sửa spelling;
- không shorten nếu chưa lưu full external copy.

Main log có thể chứa excerpt nếu:

- full prompt/output đã lưu external;
- exact path được ghi rõ.

Không overwrite rejected/old AI output.

## 12. Artifact ID Rules

- sequential: `A-001`, `A-002`, ...
- không reuse;
- không renumber historical entries;
- duplicate → `DUPLICATE_ARTIFACT_ID`

Một revision có thể:

- update cùng artifact nếu là correction trực tiếp của chính output đó; hoặc
- tạo artifact mới nếu là meaningful new prompt-output interaction độc lập.

Không tạo artifact giả chỉ để tăng số lượng audit.

## 13. Summary Calculation

Summary:

| Metric                               | Count | Percentage |
| ------------------------------------ | ----: | ---------: |
| Total AI-generated artifacts audited |     N |       100% |
| VALID — correct, accepted as-is      |     N |         N% |
| INVALID — wrong, rejected            |     N |         N% |
| INCOMPLETE — acceptable after edits  |     N |         N% |

Formula:
`Percentage = verdict count / total finalized artifacts × 100`

Rules:

- chỉ finalized verdicts;
- exclude `PENDING_HUMAN_REVIEW`;
- round 2 decimals;
- total 0 → `0%`;
- không hardcode.

Update content giữa:
`AUDIT_SUMMARY_START`
và
`AUDIT_SUMMARY_END`

## 14. Conclusion Rules

Chỉ generate/rewrite khi:

- `FINALIZE_AUDIT`; hoặc
- user explicitly requests.

Length:
80–150 words.

Phải cover:

- AI strengths;
- AI weaknesses;
- recurring patterns;
- recommendations.

## 15. Mandatory Disclosure

Preserve template disclosure text.

Không tự fill bracketed placeholders.

Finalization phải detect unresolved placeholders.

## 16. Marker Repair Policy

Khi `AUDIT_MARKER_MISSING`:

1. không append;
2. inspect current structure;
3. distinguish marker damage vs legacy format;
4. produce exact repair plan;
5. wait for approval;
6. backup;
7. minimal repair;
8. validate;
9. continue requested audit operation nếu user vẫn muốn.

Không để audit-marker issue tự động sửa test/automation artifacts.

`Can Continue` field phải chỉ rõ:

- audit operation có bị block không;
- unrelated automation workflow có thể tiếp tục hay không.

## 17. Finalization Checks

`FINALIZE_AUDIT` kiểm tra:

- Student Information;
- required headings;
- all markers;
- sequential unique IDs;
- pending entries;
- invalid verdict/status;
- missing evaluation source;
- missing Student Fix;
- summary accuracy;
- unresolved placeholders;
- broken external file refs;
- conclusion length;
- disclosure;
- confirmation;
- references.

Nếu fail:
`AUDIT_FINALIZATION_BLOCKED`

## 18. Required Status Response Shape

Mỗi status response phải có:

- Status
- Artifact ID (nếu applicable)
- Description
- Affected File
- Required User Action
- Can Continue

## 19. Supported Statuses

- `EXISTING_SKILL_NOT_FOUND`
- `AUDIT_INITIALIZATION_INFORMATION_REQUIRED`
- `AUDIT_LOG_NOT_FOUND`
- `AUDIT_LOG_INITIALIZED`
- `AUDIT_ENTRY_RECORDED`
- `AUDIT_ENTRY_UPDATED`
- `AUDIT_ENTRY_NOT_FOUND`
- `DUPLICATE_ARTIFACT_ID`
- `AUDIT_ENTRY_INCOMPLETE`
- `AUDIT_REVIEW_PENDING`
- `AUDIT_REASONING_SOURCE_REQUIRED`
- `PROMPT_CONTENT_MISSING`
- `AI_OUTPUT_CONTENT_MISSING`
- `INVALID_TIMESTAMP`
- `INVALID_VERDICT`
- `INVALID_VERIFICATION_RESULT`
- `INVALID_APPROVAL_STATUS`
- `EXTERNAL_OUTPUT_FILE_MISSING`
- `AUDIT_MARKER_MISSING`
- `AUDIT_MARKER_REPAIR_REQUIRED`
- `AUDIT_MARKERS_REPAIRED`
- `AUDIT_SUMMARY_UPDATED`
- `LEGACY_AUDIT_FORMAT_DETECTED`
- `AUDIT_FINALIZATION_BLOCKED`
- `AUDIT_FINALIZED`

## 20. Safety Rules

Skill không được:

- fabricate prompt;
- fabricate AI output;
- fabricate timestamp;
- fabricate verdict;
- fabricate evaluation source;
- fabricate execution evidence;
- fabricate Student Fix;
- alter historical entry để che sai;
- overwrite legacy log chưa approve;
- repair marker chưa approve;
- remove rejected output;
- store secrets;
- sửa files ngoài `docs/ai-audit/`;
- sửa test cases;
- sửa test data;
- sửa automation scripts;
- sửa SUT;
- commit/rewrite Git history.

## 21. Acceptance Criteria

Skill hợp lệ khi:

- current-format log có markers đúng;
- verbatim prompt/output được preserve;
- verdict semantics đúng;
- Student Fix tách khỏi verdict;
- summary chỉ tính finalized entries;
- marker damage và legacy format được phân biệt;
- có backup trước marker repair;
- không sửa artifact ngoài audit scope;
- finalization detect pending/missing fields;
- không fabricate.

## 22. Example — Modified Artifact

```text
Verdict: INCOMPLETE

Student Decision: MODIFIED
Verification Method: REVIEW
Verification Result: PASSED
Approval Status: APPROVED
```

Ý nghĩa:
AI output ban đầu cần chỉnh sửa, student đã sửa và final artifact đã được verify/approve.

## 23. Related Skills

Có thể audit outputs từ:

- `generate-test-cases-from-requirements`
- `playwright-feature-workflow`
- `validate-hw04-submission`

Skill không gọi tự động các skill khác.
