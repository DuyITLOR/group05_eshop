---
name: hw05-performance-workflow
description: Điều phối workflow performance testing HW05 bằng tiếng Việt qua perf-scenario-designer, jmeter-plan-builder, perf-plan-reviewer và jtl-performance-analyzer. Dùng để xác định state, enforce Human Review và Real Execution gate, kiểm tra mapping HW05, resume workflow và chỉ ra next allowed action; không thay thế logic chuyên sâu hoặc chạy JMeter.
---

# hw05-performance-workflow

Là Orchestrator của workflow HW05, không phải một skill làm tất cả. Nó xác định state, kiểm tra prerequisite, gọi **một** skill con phù hợp, xác minh output, duy trì state Markdown, enforce gate và trả `NEXT_ALLOWED_ACTION` rõ ràng.

| Nhiệm vụ                                         | Skill sở hữu                |
| ------------------------------------------------ | --------------------------- |
| Phân tích endpoint và thiết kế workload          | `$perf-scenario-designer`   |
| Tạo JMX/CSV/summary từ design approved           | `$jmeter-plan-builder`      |
| Review độc lập JMX/CSV/summary                   | `$perf-plan-reviewer`       |
| Tính metric JTL và AI/misinterpretation analysis | `$jtl-performance-analyzer` |
| Audit interaction theo convention                | `$log-ai-audit`             |

Không duplicate parser JTL, XML/JMX validation, workload design, JMeter generation hay plan-review logic trong skill này. Không sửa skill con để orchestration dễ hơn; mismatch thực tế phải trả `INTEGRATION_CONFLICT` với artifact/field bị lệch.

## Modes và input

### `ENDPOINT`

Input tối thiểu: Endpoint, HTTP method, Endpoint group (`READ_HEAVY`/`AUTH_HEAVY`/`TRANSACTIONAL`) và Scenario (`LOAD`/`STRESS`/`SPIKE`). Dùng cho một endpoint group hoặc demo resumable.

### `HW05_PROJECT`

Input là ba mapping endpoint group/scenario hoặc evidence repository đủ để resolve chúng. Theo dõi global compliance và dashboard ba group; không bắt buộc chạy ba workflow cùng một invocation.

### `DEMO`

Là `ENDPOINT` có output step rõ cho video. Không bypass Human Review/Real Execution và hỗ trợ resume sau khi Student chạy JMeter thật.

Không bịa Student ID, execution date, endpoint, method, group, scenario, JTL path, hardware/resource evidence, approval hay audit status. Thiếu input chỉ dùng ở phase sau không block phase hiện tại; thiếu input bắt buộc phase hiện tại trả `NEEDS_CLARIFICATION`.

## Workflow phase, status và source evidence

Workflow phase canonical:

```text
ENDPOINT_SELECTED
PERFORMANCE_DESIGN_CREATED
HUMAN_DESIGN_REVIEW_REQUIRED
DESIGN_APPROVED
JMETER_PLAN_CREATED
JMETER_AI_REVIEW_CREATED
HUMAN_PLAN_REVIEW_REQUIRED
PLAN_APPROVED
REAL_EXECUTION_REQUIRED
REAL_EXECUTION_COMPLETE
RAW_JTL_AVAILABLE
AI_ANALYSIS_CREATED
HUMAN_ANALYSIS_REVIEW_REQUIRED
ENDPOINT_WORKFLOW_COMPLETE
```

Artifact status chỉ dùng: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETE`, `PENDING_REVIEW`, `APPROVED`, `MODIFIED_AND_APPROVED`, `REJECTED`, `BLOCKED`, `NEEDS_CLARIFICATION`, `NOT_APPLICABLE`. Staleness riêng dùng `CURRENT`, `STALE`, `UNKNOWN`.

Source evidence priority: actual artifact and Human Decision -> approved design -> reviewed plan -> execution metadata/raw JTL -> source/config -> AI interpretation. File name không đủ chứng minh execution hoặc approval.

## State artifact

Khi runtime cần theo dõi state, tạo/cập nhật idempotently `docs/workflow/hw05-performance-workflow-status.md` (không tạo file này trong build-only validation). Giữ Human Decision nguyên văn và path artifact; không rewrite history/approval để đơn giản hóa.

### Canonical snapshot và semantics `UPSERT / REPLACE`

> **Workflow state là canonical snapshot, không phải append-only log.** Khi cập nhật một logical field, table row, blocker hoặc action đã tồn tại, phải thay thế current value trong đúng owning section; field chưa có mới được insert đúng một lần. Xóa current value đã stale/resolved. Không giữ history bằng cách duplicate current fields; Git history là transition history mặc định.

Áp dụng deterministic theo thứ tự sau:

1. Đọc toàn bộ state hiện tại và xác định owning section bằng Markdown heading path, ví dụ `## TRANSACTIONAL / STRESS > ### Design`. Không globally replace các key phổ biến như `Status`, `Student Decision` hoặc `Fingerprint`.
2. Resolve canonical value từ actual evidence và role-based authority. Nếu cùng logical scope đã có duplicate/conflicting values, xóa mọi occurrence của field đó trong scope rồi ghi đúng một canonical value; không mặc định chọn dòng cuối chỉ vì nó được append sau.
3. Scalar field dùng key `(heading path, field name)`. Các sub-block có key riêng, ví dụ `(### JMeter Plan > Builder Prerequisites, Student ID)` khác `(## Metadata, Student ID)`.
4. `Endpoint Mapping` dùng logical row key `(Group, Endpoint, Scenario)`: update `Phase`/`Status` của row hiện có, insert khi key chưa tồn tại, và không append row duplicate.
5. `Global Compliance` dùng logical row key `Requirement`: update `Status`/`Evidence` của row hiện có, insert khi requirement chưa tồn tại, và không giữ row stale cùng key.
6. `Current Workflow State` có đúng một phase. `Current Blocker` có đúng một blocker trực tiếp ngăn `Next Allowed Action`, hoặc `NONE`. Khi prerequisite/blocker được resolve, remove blocker cũ trước khi ghi blocker mới. Secondary conditions tiếp tục ở owning section như `Global Compliance` hoặc `Audit`; không chiếm `Current Blocker` nếu không chặn phase hiện tại.
7. `Next Allowed Action` có đúng một legal action trực tiếp. Khi state/blocker đổi, replace action cũ; không nối action mới sau action đã stale.
8. Preserve nguyên văn Human Decision (`MODIFIED_AND_APPROVED` không collapse thành `APPROVED`), Human Review Scope và final endpoint selection. Chỉ thay fingerprint/hash khi actual evidence được verify là đã thay đổi; repair documentation không làm fingerprint runtime đổi.
9. Sau UPSERT, validate uniqueness của mọi key/row ở trên. Nếu validation fail, không ghi partial state; trả `STALE_STATE_APPEND` hoặc `CANONICAL_STATE_VALIDATION_FAILED` với field/section bị lỗi.
10. Nếu canonical semantic state sau update giống trước update, đây là no-op: không rewrite file, không đổi `Last Updated`, không tăng kích thước file. Repeated resume với cùng evidence phải cho nội dung byte-for-byte không đổi.

Pseudo-behavior bắt buộc:

```text
read existing canonical snapshot
resolve next state from actual evidence
upsert scalar by (section path, field)
upsert table row by logical key
remove resolved blocker and stale next action
validate exactly one canonical value per logical key
if semantic state unchanged: do not write
else: write one normalized current snapshot
```

```markdown
# HW05 Performance Workflow Status

## Metadata

- Student ID:
- Last Updated:
- Workflow Mode: `ENDPOINT` / `HW05_PROJECT` / `DEMO`
- CORE_PERFORMANCE_WORKFLOW:
- HW05_SUBMISSION_READINESS:

## Endpoint Mapping

| Group | Endpoint | Scenario | Phase | Status |
| ----- | -------- | -------- | ----- | ------ |

## <GROUP> / <SCENARIO>

### Design

Status: `...`
Artifact:
Human Review:
Fingerprint: `CURRENT` / `STALE` / `UNKNOWN`

### JMeter Plan

Status: `...`
JMX:
CSV:
Generation Summary:
Fingerprint:

### Plan Review

Status: `...`
Review Artifact:
Open Critical/High Findings:
Student Decision:
Fingerprint:

### Execution

Status: `...`
Raw JTL:
HTML Report:
Resource Evidence:
Execution Metadata:

### Analysis

Status: `...`
Metrics:
AI Analysis:
Human Review:

## Endurance / Soak

Status: `NOT_STARTED`
Duration:
Raw JTL:
Resource Evidence:
Threshold:

## Global Compliance

| Requirement        | Status | Evidence |
| ------------------ | ------ | -------- |
| 3 groups assigned  |        |          |
| 3 scenarios unique |        |          |
| Separate CSV       |        |          |
| Distinct listeners |        |          |

## Submission Readiness (read-only)

| Item                                                            | Status | Evidence |
| --------------------------------------------------------------- | ------ | -------- |
| Main report MD/PDF                                              |        |          |
| 3 plans / 3 CSV / 3 raw JTL / 3 HTML reports                    |        |          |
| Resource and hardware evidence                                  |        |          |
| Endurance, demo, Task 3, AI Critique, AI Audit, Git log, README |        |          |

## Current Workflow State

## Current Blocker

## Next Allowed Action
```

`CORE_PERFORMANCE_WORKFLOW: COMPLETE` does not imply `HW05_SUBMISSION_READINESS: READY`. Track submission items read-only; never generate fake missing evidence.

## State resolution and delegation

At each invocation inspect state file if present, then artifact paths and Human Decisions. Do not restart a valid workflow or duplicate artifact.

| Prerequisite/evidence                                                    | Current phase                    | Next allowed action                                            |
| ------------------------------------------------------------------------ | -------------------------------- | -------------------------------------------------------------- |
| Endpoint context valid, design absent                                    | `ENDPOINT_SELECTED`              | Call `$perf-scenario-designer`.                                |
| Design artifact exists, decision not `APPROVED`/`MODIFIED_AND_APPROVED`  | `HUMAN_DESIGN_REVIEW_REQUIRED`   | `CHECKPOINT: PERFORMANCE_DESIGN_REVIEW_REQUIRED`.              |
| Design approval valid, JMX/CSV/summary absent                            | `DESIGN_APPROVED`                | Call `$jmeter-plan-builder`; require Student ID/date only now. |
| JMX + dedicated CSV + summary exist, review absent                       | `JMETER_PLAN_CREATED`            | Call `$perf-plan-reviewer`.                                    |
| Review exists, decision not approved or unresolved CRITICAL/HIGH finding | `HUMAN_PLAN_REVIEW_REQUIRED`     | `CHECKPOINT: JMETER_AI_REVIEW_REQUIRED`.                       |
| Plan review approved, no valid raw JTL                                   | `REAL_EXECUTION_REQUIRED`        | Stop at real execution barrier.                                |
| Non-empty, basic-parseable real JTL exists                               | `RAW_JTL_AVAILABLE`              | Call `$jtl-performance-analyzer`.                              |
| Metrics + AI analysis exist, analysis decision not approved              | `HUMAN_ANALYSIS_REVIEW_REQUIRED` | `CHECKPOINT: AI_PERFORMANCE_ANALYSIS_REVIEW_REQUIRED`.         |
| All mandatory artifacts/reviews valid                                    | `ENDPOINT_WORKFLOW_COMPLETE`     | Mark endpoint core workflow complete.                          |

If an expected artifact is missing/invalid, set `BLOCKED` with one relevant blocker: `ENDPOINT_NOT_SELECTED`, `GROUP_MAPPING_INVALID`, `DESIGN_NOT_FOUND`, `DESIGN_NOT_APPROVED`, `JMETER_PLAN_NOT_FOUND`, `PLAN_REVIEW_NOT_FOUND`, `PLAN_NOT_APPROVED`, `DATA_BLOCKER`, `LISTENER_CONFLICT`, `DEPENDENCY_MISSING`, `RAW_JTL_NOT_FOUND`, `RAW_JTL_INVALID`, `ANALYSIS_NOT_REVIEWED`, or `HARDWARE_EVIDENCE_MISSING`.

After one skill child completes, verify its actual output path/status before transition. A child `BLOCKED_BY_DATA` becomes parent `BLOCKED`/`DATA_BLOCKER`; do not call reviewer on missing JMX or analyzer on invalid JTL.

## Human Review gates

Accept only exact preserved decisions `APPROVED` or `MODIFIED_AND_APPROVED` for the relevant phase. `PENDING`, `NOT_REVIEWED`, `REJECTED`, a status from another artifact, or a mere file timestamp are not approval.

Never transition:

```text
PENDING_REVIEW -> APPROVED
REAL_EXECUTION_REQUIRED -> REAL_EXECUTION_COMPLETE
```

without real Human Decision or evidence. Preserve `MODIFIED_AND_APPROVED`, do not collapse it to `APPROVED`.

## Real Execution barrier

When plan is approved, stop exactly at:

```text
CHECKPOINT: REAL_EXECUTION_REQUIRED

Expected Real Evidence:
- raw JTL;
- HTML report if current HW05 requirement calls for it;
- resource monitor/hardware evidence if required;
- execution metadata.
```

The orchestrator never calls JMeter, creates production JTL/HTML report/screenshot/CPU-RAM data or marks execution complete. Raw JTL/demo/hardware evidence must come from real execution. Synthetic fixture is allowed only build-time isolated validation and must never enter production workflow state.

On resume, inspect raw JTL existence, non-zero size, basic parser-compatible structure and scenario context if available. A filename such as `load.jtl` alone is insufficient. If valid, set `REAL_EXECUTION_COMPLETE` and `RAW_JTL_AVAILABLE`; otherwise retain `REAL_EXECUTION_REQUIRED`/`RAW_JTL_INVALID`.

## Global HW05 validation (`HW05_PROJECT`)

Build a group -> scenario -> CSV -> Listener matrix from actual design/plan artifacts. Enforce three distinct entries:

```text
READ_HEAVY, AUTH_HEAVY, TRANSACTIONAL
LOAD, STRESS, SPIKE
```

| Check                                     | Failure                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| Each group maps once                      | `GLOBAL_MAPPING: FAIL` for duplicate/missing group.                                   |
| Each scenario maps once                   | `GLOBAL_MAPPING: FAIL` for duplicate/missing scenario.                                |
| Primary CSV is distinct per group         | `CSV_SEPARATION: FAIL` with `CSV_DUPLICATION`, `CSV_MISSING` or `CSV_GROUP_MISMATCH`. |
| Primary Listener is distinct per scenario | `LISTENER_UNIQUENESS: FAIL` with `GLOBAL_LISTENER_CONFLICT`.                          |

Missing other-scenario artifacts are `NEEDS_CLARIFICATION`, not evidence of passing uniqueness. Endpoint ownership only checks an explicit repository record; otherwise `ENDPOINT_OWNERSHIP: NOT_VERIFIABLE`.

Project core workflow is complete only when all three endpoint groups are `ENDPOINT_WORKFLOW_COMPLETE` and global mapping/CSV/Listener checks PASS. This still is not full HW05 submission completion.

## Stale artifacts, resume and idempotency

Do not regenerate a valid artifact by default. Regenerate only after user request, material source/design change, rejection or invalid artifact.

Mỗi resume phải dùng `UPSERT / REPLACE` theo section-aware rules ở trên. Cấm append current-state field để preserve transition. Trước khi write, kiểm tra old prerequisite/blocker/action đã được resolve và loại khỏi current snapshot; sau khi write, kiểm tra lại duplicate scalar keys, duplicate Endpoint Mapping keys và duplicate Global Compliance requirements đều bằng `0`.

When available, state file records a source fingerprint/hash or source reference at generation/review time. Detect:

```text
Design changed after JMX -> JMX: STALE, Plan Review: STALE, Execution: BLOCKED
JMX changed after plan review -> Plan Review: STALE, Execution: BLOCKED
```

If no reliable fingerprint/reference exists, set staleness `UNKNOWN`, ask for targeted review and do not assert currentness. Resume begins at the first missing/stale/unreviewed phase, never reruns earlier valid child skills.

Carry forward `CRITICAL`/`HIGH` open findings from plan review into state. `Execution Ready: NO` persists until Student documents a resolving decision and a current review proves the relevant blocker is addressed.

## Audit coordination

Find `$log-ai-audit` before workflow. Áp dụng `AUDIT_SCOPE` trước khi audit: chỉ interaction trực tiếp tạo/phân tích/review/sửa artifact hoặc kết quả HW05 là `INCLUDED_HW05_ARTIFACT_INTERACTION`; development, repair, smoke/contract test và synthetic fixture của Agent Skill là `EXCLUDED_AGENT_SKILL_DEVELOPMENT`, không có Artifact ID. Subskills already own audit for their meaningful generated artifact; orchestrator records only status/path and must not create a second entry. Khi subskill đã audit đúng artifact, ghi `AUDIT_STATUS: DUPLICATE_AUDIT_ENTRY_PREVENTED`. If a subskill did not audit and project contract requires it, orchestrator invokes audit only with actual verbatim prompt/output/timestamp. Missing exact content yields `AUDIT_STATUS: BLOCKED_OR_INCOMPLETE` hoặc `BACKFILL_GAP`, never a fabricated entry.

Do not audit execution, screenshot, raw JTL or resource data as AI-created. No automatic Git commit/push; optionally state `COMMIT_STATUS: PENDING`.

## Runtime summary

Return only the next legal path:

```text
HW05 PERFORMANCE WORKFLOW

Endpoint: <resolved or NOT_PROVIDED>
Scenario: <resolved or NOT_PROVIDED>
Current State: <phase>
Completed: <short artifact list>
Pending: <short item>
Blocker: <one relevant blocker or NONE>
Next Allowed Action: <one action>
```

In `HW05_PROJECT`, use a concise dashboard Group/Scenario/Design/JMX/Review/Execution/Analysis followed by one global priority. In `DEMO`, annotate `DEMO STEP n/7` but stop at each real Human Review/Execution checkpoint.

## Integration validation during build

Validate the actual child contracts, not an idealized duplicate:

- `$perf-scenario-designer`: design path `docs/performance-design/`, Human Review `PENDING`/`NOT_REVIEWED`, checkpoint design review.
- `$jmeter-plan-builder`: accepts approved design, requires Student ID/date for JMX, emits JMX + group CSV + generation summary, ends plan review checkpoint.
- `$perf-plan-reviewer`: requires approved design/JMX/CSV/summary, emits `docs/performance-reviews/`, finding status `OPEN`, ends plan Human Review checkpoint.
- `$jtl-performance-analyzer`: requires raw real JTL at runtime, emits `docs/performance-analysis/`, preserves raw data, ends analysis Human Review checkpoint.
- `$log-ai-audit`: append-only, verbatim data, no duplicate artifact entry.

If child artifact/status differs materially, report exact `INTEGRATION_CONFLICT` instead of changing child semantics.

## Static/dry build tests

Do not call child skill runtime, JMeter or real execution. Use isolated mock state only; do not write production state file/JTL/HTML/CPU/RAM evidence.

| Test                                                             | Expected state/action                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A New `GET /api/categories`, `READ_HEAVY`, `LOAD`, no design     | `ENDPOINT_SELECTED`; call designer only.                                       |
| B Design `NOT_REVIEWED`                                          | `HUMAN_DESIGN_REVIEW_REQUIRED`; builder not called.                            |
| C Design approved, no JMX                                        | call builder.                                                                  |
| D JMX + CSV + summary, no review                                 | call reviewer.                                                                 |
| E Review `NOT_REVIEWED`                                          | `HUMAN_PLAN_REVIEW_REQUIRED`; execution blocked.                               |
| F Plan approved, no JTL                                          | `CHECKPOINT: REAL_EXECUTION_REQUIRED`; no JMeter run.                          |
| G Empty JTL                                                      | `RAW_JTL_INVALID`; no execution complete.                                      |
| H Synthetic `TEST-ONLY` JTL                                      | analyzer integration can dry-validate, never production state.                 |
| I Metrics + analysis, decision `NOT_REVIEWED`                    | `CHECKPOINT: AI_PERFORMANCE_ANALYSIS_REVIEW_REQUIRED`.                         |
| J Isolated all-production-like mock states approved              | transition logic reaches `ENDPOINT_WORKFLOW_COMPLETE`, no fabricated evidence. |
| K Two groups map `LOAD`                                          | `GLOBAL_MAPPING: FAIL`.                                                        |
| L Two groups use `common.csv`                                    | `CSV_SEPARATION: FAIL`.                                                        |
| M Load/Stress use `Summary Report`                               | `LISTENER_UNIQUENESS: FAIL`.                                                   |
| N Design changed after JMX                                       | JMX/review `STALE`, execution blocked.                                         |
| O Resume at real-execution phase with valid real-like test state | resume JTL/analyzer phase; no designer/builder/reviewer rerun.                 |
| P/Q No fake evidence/audit duplicate                             | `NO_FAKE_EVIDENCE_CHECK: PASS`; no second audit entry.                         |

### Regression idempotency bắt buộc

Các case này chỉ dùng state synthetic trong bộ nhớ hoặc thư mục tạm; actual state file là read-only baseline trừ khi phát hiện inconsistency thật.

| Case                       | Transition                                                    | Expected                                                                                            |
| -------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| A Same state twice         | Apply cùng Student ID/date, phase, blocker và action hai lần. | Semantic content và bytes không đổi; không duplicate field/row/action.                              |
| B Resolve Student info     | `NOT_PROVIDED`/`MISSING` -> actual ID/date `PROVIDED`.        | Giá trị cũ và clarification blocker/action bị remove.                                               |
| C New dependency blocker   | Student info đã resolve; builder trả `DEPENDENCY_MISSING`.    | JMeter Plan `BLOCKED`, đúng một current blocker và action cài/verify plugin.                        |
| D Resolve dependency       | Plugin được verify và builder có actual result mới.           | `DEPENDENCY_MISSING` bị remove; status/blocker/action phản ánh actual result mới.                   |
| E Endpoint table upsert    | Cùng `(Group, Endpoint, Scenario)` đổi phase/status.          | Một row duy nhất với phase/status mới.                                                              |
| F Section status           | Design/JMeter Plan/Plan Review có status khác nhau.           | Section-aware update preserve cả ba; không global replace.                                          |
| G Global Compliance upsert | Cùng requirement đổi `NEEDS_CLARIFICATION` -> `PASS`.         | Một row duy nhất với `PASS`.                                                                        |
| H Current file baseline    | Lint actual state hiện tại.                                   | Đúng một value cho metadata/prerequisite/state/blocker/action và một row cho mỗi logical table key. |
| I Repeated resume          | Apply cùng evidence ba lần.                                   | Run 1/2/3 byte-for-byte giống nhau; file không tăng kích thước.                                     |

Build mode never waits for Human Review, creates a `SKILL_IMPLEMENTATION_REVIEW_REQUIRED` checkpoint, commits, pushes, runs production workflow or runs JMeter. Runtime behavior retains all four required checkpoints.

## Contract sửa chữa ưu tiên

Phần này thay thế wording mâu thuẫn trước đó. Áp dụng role-based authority: Human Decision cho approval state; actual artifact cho existence/status; approved design cho intended config; source/runtime config cho current SUT behavior; API specification cho documented contract; HW05 Requirements cho compliance; AI analysis chỉ interpretation. Source/spec/design conflict là `IMPLEMENTATION_CONFLICT` hoặc `IMPLEMENTATION_SPEC_CONFLICT`, không dùng priority mơ hồ để silently chọn một bên.

`RAW_JTL_AVAILABLE` và `REAL_EXECUTION_EVIDENCE_COMPLETE` là hai state riêng. Khi Student chạy thật, Required Per-Run Evidence là raw JTL, HTML report folder, screenshot/evidence JMeter/tool cùng backend resource monitor, execution metadata. Required Project-Level Evidence là hardware report/spec. JTL valid cho phép analyzer chạy ngay, nhưng HTML/resource/metadata thiếu tạo `Execution Status: PARTIAL_EVIDENCE`, `REAL_EXECUTION_EVIDENCE_COMPLETE: NO`, và không được `ENDPOINT_WORKFLOW_COMPLETE`. Hardware thiếu project-wide giữ `HW05_SUBMISSION_READINESS: NOT_READY` và hạn chế conclusion hardware/endurance.

`CHECKPOINT: REAL_EXECUTION_REQUIRED` phải liệt kê toàn bộ evidence mandatory trên, không ghi “if current requirement calls for it”. Chỉ JTL + HTML + resource evidence + execution metadata valid mới `REAL_EXECUTION_EVIDENCE_COMPLETE: YES`.

Endurance/Soak là additional requirement, không phải scenario thứ tư trong mapping Load/Stress/Spike. Track `ENDURANCE_STATUS`: `NOT_STARTED`, `EXECUTION_REQUIRED`, `RAW_JTL_AVAILABLE`, `EVIDENCE_PARTIAL`, `ANALYSIS_REQUIRED`, `HUMAN_REVIEW_REQUIRED`, `COMPLETE`; record duration, sustained load, raw JTL, resource evidence, analyzer output, candidate stable RPS, hardware ceiling nếu evidence support và Human Review. Duration < 10 minutes là `ENDURANCE_DURATION_RISK`; 10-15 phút với real metadata mới pass duration. Dùng `$jtl-performance-analyzer` `ENDURANCE`, không tự chạy test.
