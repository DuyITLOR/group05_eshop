Bạn đang làm việc trong repository HW05 – Performance Testing.

# NHIỆM VỤ

RESUME CONTROLLED INTEGRATION TEST hiện tại sau khi Student đã
xác minh thủ công JMeter dependency.

KHÔNG restart workflow.
KHÔNG chạy lại $perf-scenario-designer.
KHÔNG regenerate approved design.

Current context:

Student ID:
23127107

Execution Date:
2026-08-12

Endpoint:
POST /api/apply-coupon

Group:
TRANSACTIONAL

Scenario:
STRESS

Design:
docs/performance-design/stress-apply-coupon-design.md

Workflow State:
docs/workflow/hw05-performance-workflow-status.md

Human Decision:
MODIFIED_AND_APPROVED

Human Review Scope:
CONTROLLED_INTEGRATION_TEST

Final HW05 Transactional Endpoint:
NOT_YET_APPROVED

Current expected state:

DESIGN_APPROVED

Previous blocker:

DEPENDENCY_MISSING

==================================================

1. NEW DEPENDENCY EVIDENCE FROM STUDENT
   ==================================================

Student đã manually verify trên máy:

JMeter:
Apache JMeter 5.6.3

JMETER_HOME:
D:\Tools\apache-jmeter-5.6.3

JMeter Plugins Manager:
AVAILABLE

Installed plugin:
Custom Thread Groups

GUI verification:

Test Plan
→ Add
→ Threads (Users)
→ jp@gc - Ultimate Thread Group

Ultimate Thread Group đã xuất hiện và component mở thành công trong GUI.

Treat this as:

STUDENT_RUNTIME_VERIFICATION:
PASS

CUSTOM_THREAD_GROUPS:
INSTALLED

ULTIMATE_THREAD_GROUP:
AVAILABLE

Previous:

DEPENDENCY_MISSING

phải được re-evaluate.

==================================================
2. VERIFY DEPENDENCY STATICALLY
===============================

Trước khi resume builder:

Inspect actual JMeter installation without executing a performance test.

Kiểm tra:

D:\Tools\apache-jmeter-5.6.3\lib\ext

và các plugin metadata/files liên quan nếu accessible.

Mục tiêu:

* xác nhận Custom Thread Groups artifact tồn tại;
* nếu có thể xác định actual plugin version thì record;
* xác nhận Ultimate Thread Group class/component evidence.

KHÔNG chạy performance test.

Không cần gọi:

jmeter -n
jmeter -t
jmeter -g

Student GUI verification đã là supporting runtime evidence.

Nếu static inventory và Student verification nhất quán:

PLUGIN_CHECK:
PASS

DEPENDENCY_STATUS:
VERIFIED

Nếu static inventory không tìm được artifact nhưng GUI verification rõ ràng:

không quay lại `DEPENDENCY_MISSING` ngay.

Thay vào đó:

DEPENDENCY_STATUS:
HUMAN_VERIFIED

STATIC_PLUGIN_PATH:
NOT_RESOLVED

và tiếp tục nếu actual $jmeter-plan-builder contract cho phép.

Không phủ nhận GUI evidence chỉ vì filename jar khác expectation.

==================================================
3. UPDATE WORKFLOW STATE CANONICALLY
====================================

Dùng UPSERT_REPLACE semantics của $hw05-performance-workflow.

Remove stale current blocker:

DEPENDENCY_MISSING

nếu dependency đã verified.

Không append state thứ hai.

Current Workflow State vẫn bắt đầu từ:

DESIGN_APPROVED

Update Builder Result theo actual new run.

Giữ:

Audit:
AUDIT_INITIALIZATION_INFORMATION_REQUIRED

Global Listener Uniqueness:
NEEDS_CLARIFICATION

Final HW05 Transactional Endpoint:
NOT_YET_APPROVED

Các trạng thái này không phải current blocker trực tiếp của builder
trừ khi child skill contract thật sự yêu cầu.

==================================================
4. RESUME $jmeter-plan-builder
==============================

Gọi:

$jmeter-plan-builder

với:

Student ID:
23127107

Execution Date:
2026-08-12

Endpoint:
POST /api/apply-coupon

Group:
TRANSACTIONAL

Scenario:
STRESS

Approved Design:
docs/performance-design/stress-apply-coupon-design.md

Expected JMX filename:

23127107_Stress_20260812.jmx

==================================================
5. APPROVED STRESS PROFILE
==========================

Preserve exact approved profile:

Stage 1:
Ramp 0 -> 5 VUs: 15s
Hold 5 VUs: 45s

Stage 2:
Ramp 5 -> 10 VUs: 15s
Hold 10 VUs: 45s

Stage 3:
Ramp 10 -> 20 VUs: 15s
Hold 20 VUs: 45s

Stage 4:
Ramp 20 -> 30 VUs: 15s
Hold 30 VUs: 45s

Recovery:
Ramp 30 -> 5 VUs: 15s
Hold 5 VUs: 60s

Planned Total Duration:
315 seconds

Do not reinterpret this as:

5 threads
then 10 NEW threads
then 20 NEW threads
then 30 NEW threads.

The numbers above are TARGET TOTAL CONCURRENCY.

==================================================
6. ULTIMATE THREAD GROUP SCHEDULE DERIVATION
============================================

Ultimate Thread Group schedule records represent cohorts.

Derive an additive cohort schedule that reproduces the approved
target-concurrency profile exactly.

A candidate schedule to VERIFY is:

Cohort A:
Start Threads Count: 5
Initial Delay: 0s
Startup Time: 15s
Hold Load For: 300s
Shutdown Time: 0s

Cohort B:
Start Threads Count: 5
Initial Delay: 60s
Startup Time: 15s
Hold Load For: 165s
Shutdown Time: 15s

Cohort C:
Start Threads Count: 10
Initial Delay: 120s
Startup Time: 15s
Hold Load For: 105s
Shutdown Time: 15s

Cohort D:
Start Threads Count: 10
Initial Delay: 180s
Startup Time: 15s
Hold Load For: 45s
Shutdown Time: 15s

Expected aggregate profile:

0-15:
0 -> 5

15-60:
5

60-75:
5 -> 10

75-120:
10

120-135:
10 -> 20

135-180:
20

180-195:
20 -> 30

195-240:
30

240-255:
30 -> 5

255-315:
5

IMPORTANT:

Không blindly copy candidate schedule.

Builder phải verify nó theo actual Ultimate Thread Group semantics
và installed component schema.

Nếu một field/value như Shutdown Time = 0 không hợp lệ với actual
component:

derive equivalent valid schedule.

Generation Summary phải document final schedule và chứng minh nó map
đúng approved target profile.

Nếu exact profile không thể biểu diễn:

STATUS:
BLOCKED

REASON:
WORKLOAD_MAPPING_NOT_EXACT

Không silently alter workload.

==================================================
7. THINK TIME
=============

Approved:

Think Time:
1000 ms

Timer:
Constant Timer

Delay:
1000 ms

Mapping Status:
PASS

Builder phải generate đúng:

Constant Timer = 1000 ms

Reviewer sau đó phải verify:

* enabled;
* correct scope;
* correct value.

==================================================
8. DATA CONTRACT
================

Approved CSV:

test-data/transactional.csv

Schema:

code,total_amount,user_id,coupon_case,iteration_key

CSV_MODE:
REQUEST_DRIVEN

DATA_DRIVEN_FIT:
PASS

Primary Dataset:
SUCCESS_PATH_ONLY

Request-driving:

code
total_amount
user_id

Trace-only:

coupon_case
iteration_key

Do not send trace-only columns in request JSON.

==================================================
9. DATA SETUP — DO NOT FABRICATE
================================

Previous workflow state says:

Data status:
NEEDS_DATA_SETUP

No Student-approved production coupon/user rows existed at that time.

Re-inspect actual:

backend/database.js
current seed/config
actual repository test-data if any

Only use values that are verifiably present in repository/SUT evidence.

Do NOT invent:

* coupon codes;
* user IDs;
* quota state;
* account state;
* credentials;
* tokens.

If repository contains real deterministic seed records suitable for
success-path testing:

extract them as:

DATA_CANDIDATES

with exact source evidence.

Do not automatically call candidate rows Student-approved.

If builder contract permits creating a template-only CSV:

create:

test-data/transactional.csv

with header/schema only and mark:

CSV_STATUS:
TEMPLATE_ONLY

EXECUTION_READY:
NO

If builder requires actual approved rows before any production JMX:

stop with:

STATUS:
BLOCKED_BY_DATA

or actual canonical blocker.

Do not weaken child skill contract merely to reach reviewer.

==================================================
10. SUCCESS-PATH DATA RULE
==========================

Primary measured rows must target:

HTTP:
200

Business response:
success: true

Use:

total_amount > min_order_amount

clearly above boundary.

Exclude primary rows representing:

* invalid coupon;
* inactive coupon;
* expired coupon;
* exhausted quota;
* below minimum;
* total_amount == min_order_amount.

Do not contaminate primary Stress error-rate/p95 with intentional
business rejection rows.

==================================================
11. AUTHENTICATION
==================

Approved decision:

AUTHENTICATION_TEST_DECISION:
CURRENT_IMPLEMENTATION_BEHAVIOR

If current handler still does not enforce JWT:

do not add:

Authorization: Bearer ...

Keep:

IMPLEMENTATION_DOCUMENTATION_DISCREPANCY

between current handler and supporting README/documentation.

Do not silently fix SUT behavior in JMeter.

==================================================
12. REQUEST BODY
================

Generate parameterized JSON according to actual API/source.

Expected conceptual form:

{
"code": "${code}",
"total_amount": <numeric variable>,
"user_id": <numeric/type according to actual contract>
}

Preserve actual types.

Do not quote numeric fields merely for convenience if current API/source
requires numbers.

Do not include:

coupon_case
iteration_key

in JSON body.

==================================================
13. ASSERTIONS
==============

Primary success sampler:

Expected HTTP:
200

Business success:

success: true

Expected fields if actual current source/spec supports:

coupon_id
discount_amount
final_amount
message

Do not add exact numeric discount assertion unless approved design/source
provides sufficiently reviewed calculation semantics.

Intentional 400/404 flows are not part of primary Stress dataset.

==================================================
14. LISTENER
============

Approved primary Listener:

Aggregate Report

Do not replace it.

Global uniqueness remains:

NEEDS_CLARIFICATION

until real production LOAD and SPIKE designs exist.

Generation summary:

Listener:
Aggregate Report

Global Listener Uniqueness:
NEEDS_CLARIFICATION

==================================================
15. STATIC JMX VALIDATION
=========================

If builder is allowed to generate artifacts, validate:

* filename;
* XML well-formedness;
* Ultimate Thread Group class/component;
* each schedule record;
* aggregate concurrency timeline;
* 315s profile;
* Constant Timer 1000ms;
* CSV path/schema;
* variable binding;
* HTTP method/path;
* JSON body/types;
* authentication;
* assertions;
* Listener;
* unresolved placeholders;
* secrets;
* plugin dependency.

Do not run actual workload.

==================================================
16. EXPECTED BUILDER OUTPUT
===========================

If all builder gates pass:

JMX:

test-plans/23127107_Stress_20260812.jmx

CSV:

test-data/transactional.csv

Generation Summary:

docs/jmeter-generation/23127107-stress-generation-summary.md

or actual canonical repository paths.

Builder must report:

DEPENDENCY_STATUS:
VERIFIED or HUMAN_VERIFIED

WORKLOAD_MAPPING:
PASS

EXECUTION_READY:
READY / NO / CONDITIONAL according to data status.

==================================================
17. IF DATA BLOCKS BUILDER
==========================

If dependency is resolved but data is now the only blocker:

update workflow canonically:

Current Blocker:
DATA_BLOCKER

or actual canonical equivalent.

Next Allowed Action:
Review/approve verified success-path test-data candidates.

Do NOT keep:

DEPENDENCY_MISSING

as stale current blocker.

Do NOT call plan reviewer if valid JMX does not exist.

Then STOP.

==================================================
18. IF BUILDER COMPLETES
========================

If JMX + CSV/template + generation summary are valid under builder
contract:

call:

$perf-plan-reviewer

Do not ask me before invoking reviewer.

==================================================
19. REVIEWER FOCUS
==================

Reviewer must independently verify:

### Dependency

* Ultimate Thread Group available.
* actual plugin evidence.
* correct component/class.

### Workload

* target concurrency, not cumulative misinterpretation;
* exact approved timeline;
* correct recovery ramp;
* 315 sec.

### Think Time

* Constant Timer 1000ms.

### CSV

* REQUEST_DRIVEN;
* success-path-only;
* correct request variables;
* no fabricated data;
* template/data readiness status.

### Request

* POST /api/apply-coupon;
* correct JSON types.

### Authentication

* current implementation behavior;
* no unsupported JWT.

### Assertions

* HTTP 200;
* business success;
* supported fields only.

### Listener

* Aggregate Report;
* global uniqueness still needs production evidence.

### Structure

* valid JMX;
* Ultimate Thread Group XML/hashTree/component integrity.

### Readiness

* distinguish plan correctness from data/execution readiness.

==================================================
20. REVIEWER MUST NOT AUTO-FIX
==============================

Reviewer:

* REVIEW ONLY;
* no JMX modification;
* no CSV modification;
* no Student approval;
* no JMeter execution.

All findings:

Status:
OPEN

Student Decision:
NOT_REVIEWED

==================================================
21. WORKFLOW TRANSITIONS
========================

Use canonical UPSERT_REPLACE state semantics.

Possible path A:

DEPENDENCY RESOLVED
↓
DATA_BLOCKER
↓
STOP

Possible path B:

DEPENDENCY RESOLVED
↓
JMETER_PLAN_CREATED
↓
JMETER_AI_REVIEW_CREATED
↓
HUMAN_PLAN_REVIEW_REQUIRED
↓
STOP

Never retain resolved `DEPENDENCY_MISSING`.

==================================================
22. AUDIT
=========

Current audit state:

AUDIT_INITIALIZATION_INFORMATION_REQUIRED

Do not invent Student Information.

If audit still cannot initialize:

preserve exact blocker.

Audit blocker does not permit fake entry.

Do not duplicate audit if child skill already records one.

==================================================
23. ABSOLUTE NO-EXECUTION RULE
==============================

DO NOT:

* start JMeter workload;
* run JMeter CLI workload;
* hit backend for performance execution;
* create real JTL;
* create HTML execution report;
* create screenshots as execution evidence;
* create CPU/RAM evidence.

Dependency inspection/static validation only.

==================================================
24. GIT
=======

DO NOT COMMIT.
DO NOT PUSH.

I will commit at the next reviewed checkpoint.

==================================================
25. FINAL OUTPUT
================

Return:

CONTROLLED INTEGRATION TEST — DEPENDENCY RESUME

JMeter:
5.6.3 / FAIL

Custom Thread Groups:
VERIFIED / HUMAN_VERIFIED / FAIL

Ultimate Thread Group:
AVAILABLE / FAIL

Previous Dependency Blocker:
RESOLVED / STILL_BLOCKED

Workflow State Before:
DESIGN_APPROVED

Builder:
COMPLETE / BLOCKED

Current Blocker:
NONE / DATA_BLOCKER / DEPENDENCY_MISSING / <actual>

JMX: <path or NONE>

Filename:
PASS / FAIL / NOT_REACHED

Ultimate Thread Group Mapping:
PASS / FAIL / NOT_REACHED

Stress Profile:
PASS / FAIL / NOT_REACHED

Total Duration:
315s / FAIL / NOT_REACHED

Think Time:
PASS / FAIL / NOT_REACHED

CSV: <path or NONE>

CSV Status:
READY / TEMPLATE_ONLY / BLOCKED_BY_DATA / NOT_CREATED

Data Candidates:
FOUND / NOT_FOUND / NOT_CHECKED

Authentication:
PASS / FINDING / NOT_REACHED

Generation Summary: <path or NONE>

Plan Reviewer:
COMPLETE / NOT_REACHED / BLOCKED

Review Artifact: <path or NONE>

Findings:
Critical:
High:
Medium:
Low:
Info:

Execution Readiness:
READY / CONDITIONALLY_READY / NOT_READY / NOT_REACHED

Audit:
PASS / AUDIT_INITIALIZATION_INFORMATION_REQUIRED / FAIL

Workflow State After:
...

Final Checkpoint:
JMETER_AI_REVIEW_REQUIRED
hoặc actual blocker.

Next Allowed Action: <exactly one action>

NO JMETER EXECUTION.
NO JTL.
NO FAKE EVIDENCE.
NO COMMIT.
NO PUSH.
