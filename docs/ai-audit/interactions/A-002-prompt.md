Bạn đang làm việc trong repository HW05 – Performance Testing.

# NHIỆM VỤ

Tiếp tục CONTROLLED INTEGRATION TEST hiện tại cho:

Endpoint:
POST /api/apply-coupon

Endpoint Group:
TRANSACTIONAL

Scenario:
STRESS

Workflow hiện tại đang ở:

HUMAN_DESIGN_REVIEW_REQUIRED

Design artifact hiện tại:

docs/performance-design/stress-apply-coupon-design.md

Workflow state:

docs/workflow/hw05-performance-workflow-status.md

Human Review đã được thực hiện ngoài agent.

Quyết định của Student cho CONTROLLED INTEGRATION TEST này:

Student Decision:
MODIFIED_AND_APPROVED

QUAN TRỌNG:

Quyết định trên CHỈ áp dụng cho controlled integration test hiện tại.

Nó KHÔNG có nghĩa:

POST /api/apply-coupon

đã được phê duyệt cuối cùng làm TRANSACTIONAL endpoint cho submission HW05.

Final endpoint selection vẫn:

FINAL_HW05_TRANSACTIONAL_SELECTION:
NOT_YET_APPROVED

==================================================

1. ĐỌC ACTUAL ARTIFACT TRƯỚC KHI SỬA
   ==================================================

Trước khi patch:

1. Đọc đầy đủ:

docs/performance-design/stress-apply-coupon-design.md

2. Đọc:

docs/workflow/hw05-performance-workflow-status.md

3. Đọc actual contracts của:

$perf-scenario-designer
$jmeter-plan-builder
$perf-plan-reviewer
$hw05-performance-workflow
$log-ai-audit

4. Đọc lại evidence liên quan:

* api_specification.md
* backend/server.js
* backend/database.js
* README.md

5. Không regenerate design từ đầu.

6. Không thay workload, API contract hoặc finding đã đúng nếu không
   nằm trong các modification bên dưới.

Mục tiêu là:

MINIMAL HUMAN-APPROVED PATCH

==================================================
2. MODIFICATION A — GLOBAL UNIQUENESS EVIDENCE
==============================================

Hiện design đang dùng dry-run evidence để ghi:

Group uniqueness:
PASS

Scenario uniqueness:
PASS

Listener uniqueness:
PASS

Điều này không được coi là production HW05 evidence.

Sửa:

Group uniqueness:
NEEDS_CLARIFICATION

Evidence:
Chưa có đủ production designs của READ_HEAVY và AUTH_HEAVY để
chứng minh uniqueness toàn project.

Scenario uniqueness:
NEEDS_CLARIFICATION

Evidence:
Chưa có đủ ba production scenario designs.
Dry-run/smoke-test artifacts không phải project-level evidence.

Listener uniqueness:
NEEDS_CLARIFICATION

Evidence:
Aggregate Report phù hợp với STRESS design hiện tại, nhưng uniqueness
toàn HW05 chỉ được PASS sau khi đối chiếu production LOAD và SPIKE
designs.

QUAN TRỌNG:

Không đổi:

Endpoint group assigned:
PASS

Scenario assigned:
PASS

Separate CSV:
PASS

Data-driven fit:
PASS

vì các check này được support trực tiếp bởi design hiện tại.

==================================================
3. MODIFICATION B — PRIMARY STRESS DATASET
==========================================

Primary measured Stress workload phải ưu tiên SUCCESS PATH.

Không trộn intentional negative/boundary rows vào primary performance
dataset nếu điều đó làm error rate/p95 khó diễn giải.

Sửa Test Data Strategy để ghi rõ:

Primary Stress Dataset:
SUCCESS_PATH_ONLY

Primary rows phải được kỳ vọng:

HTTP 200

và business success theo current implementation.

Các case như:

* invalid coupon;
* inactive coupon;
* expired coupon;
* usage exhausted;
* below/equal minimum boundary khi semantics đang conflict;

không được đưa vào primary measured Stress dataset.

Nếu cần kiểm tra các case đó:

* dùng sampler/run riêng;
* hoặc label riêng ngoài primary measured workload;
* không trộn chúng vào success-path error-rate interpretation.

CSV vẫn giữ các request-driving fields:

code
total_amount
user_id

iteration_key có thể giữ cho traceability nếu cần.

coupon_case chỉ giữ nếu các values trong primary dataset đều đại diện
cho valid-success variants.

Không dùng coupon_case để trộn:

VALID
INVALID
EXPIRED
BELOW_MINIMUM

trong cùng measured Stress workload.

==================================================
4. MODIFICATION C — DATA REUSE / RESET SEMANTICS
================================================

Current source evidence cho thấy:

POST /api/apply-coupon

không INSERT hoặc UPDATE coupon_usage.

POST /api/coupon-usage

là endpoint riêng mới mutate usage.

Vì controlled integration scope hiện tại chỉ test:

POST /api/apply-coupon

sửa data strategy thành:

For apply-coupon-only workload:

* Request này không tự tăng coupon usage.
* Không cần reset coupon_usage giữa mỗi iteration chỉ vì apply-coupon.
* Có thể reuse valid coupon/user combination nếu existing database state
  vẫn cho business success.
* Trước run phải xác minh selected user/coupon hiện chưa vượt quota.
* Unique/reset/isolation strategy trở thành mandatory nếu workflow sau này
  mở rộng sang /api/coupon-usage hoặc checkout/state mutation.

Không nói handler apply-coupon tự consume quota nếu source không chứng minh.

Giữ:

Data status:
NEEDS_DATA_SETUP

cho tới khi CSV/data thật được chuẩn bị.

==================================================
5. MODIFICATION D — AUTHENTICATION CONFLICT
===========================================

Human Review decision:

Controlled integration test sẽ test CURRENT IMPLEMENTED HANDLER behavior.

Nếu current:

POST /api/apply-coupon

không gắn authenticateToken hoặc equivalent authentication middleware:

KHÔNG tự thêm JWT authentication vào JMeter plan.

Sửa design để ghi rõ:

AUTHENTICATION_TEST_DECISION:
CURRENT_IMPLEMENTATION_BEHAVIOR

Current Handler:
No JWT enforced by current implementation evidence.

README / supporting documentation:
describes authentication expectation around coupon/checkout flow.

Classification:
IMPLEMENTATION_DOCUMENTATION_DISCREPANCY

JMeter Design Decision:
Do not add authentication not enforced by current handler.

Không xóa discrepancy khỏi report.

Không nói README sai hoặc source đúng tuyệt đối.

Giữ discrepancy cho:

Human Review
AI Critique
implementation discrepancy evidence

sau này nếu phù hợp.

==================================================
6. MODIFICATION E — MINIMUM AMOUNT BOUNDARY
===========================================

Current evidence cho thấy:

source:
total_amount > min_order_amount

supporting README/documentation:

> = semantics

Không resolve functional discrepancy này trong primary Stress workload.

Sửa design:

PRIMARY_STRESS_DATA_RULE:

total_amount phải được chọn rõ ràng lớn hơn min_order_amount.

Không sử dụng:

total_amount == min_order_amount

trong primary measured dataset.

Boundary:

total_amount == min_order_amount

được giữ ngoài primary Stress workload và có thể kiểm thử riêng.

Classification:

IMPLEMENTATION_DOCUMENTATION_DISCREPANCY

Không silently chọn `>=` làm current behavior.

Không thay code SUT.

==================================================
7. MODIFICATION F — EXPLICIT STRESS TIMELINE
============================================

Thay workload stage description mơ hồ bằng timeline deterministic sau:

## Stage 1

Ramp:
0 -> 5 VUs

Ramp Duration:
15 seconds

Hold:
5 VUs for 45 seconds

## Stage 2

Ramp:
5 -> 10 VUs

Ramp Duration:
15 seconds

Hold:
10 VUs for 45 seconds

## Stage 3

Ramp:
10 -> 20 VUs

Ramp Duration:
15 seconds

Hold:
20 VUs for 45 seconds

## Stage 4

Ramp:
20 -> 30 VUs

Ramp Duration:
15 seconds

Hold:
30 VUs for 45 seconds

## Recovery

Ramp:
30 -> 5 VUs

Ramp Duration:
15 seconds

Hold:
5 VUs for 60 seconds

Planned Total Duration:

75 seconds ramp
+
180 seconds stress hold
+
60 seconds recovery hold

=
315 seconds
≈ 5 minutes 15 seconds

Giữ Think Time:

1000 ms

Giữ JMeter Timer Mapping:

Timer Type:
Constant Timer

Delay:
1000 ms

Mapping Status:
PASS

Các con số workload vẫn phải giữ classification:

RECOMMENDATION

vì chưa có hardware baseline/SLA.

Không biến 30 VUs thành claimed capacity.

==================================================
8. UPDATE ASSERTION STRATEGY
============================

Primary measured workload:

Expected HTTP status:
200

Expected business response:
success: true

Expected fields nếu current source/spec support:

coupon_id
discount_amount
final_amount
message

Không biến exact discount numeric calculation thành Assertion nếu
calculation semantics chưa được Human Review đầy đủ.

Negative/boundary outcomes:

400
404

được document nhưng không dùng làm expected outcome trong primary
success-path Stress dataset.

==================================================
9. UPDATE OPEN QUESTIONS
========================

Sau modifications, Open Questions nên phản ánh:

1. Có giữ POST /api/apply-coupon làm final HW05 TRANSACTIONAL endpoint
   hay chuyển sang endpoint có actual state mutation?

2. Production LOAD và SPIKE designs nào sẽ được chọn để xác minh:

   * group uniqueness;
   * scenario uniqueness;
   * Listener uniqueness?

3. Dataset coupon/user thật nào sẽ được chuẩn bị trước execution?

4. Có SLA/p95/error budget chính thức hay không?

Không giữ câu hỏi đã được Human Review resolve trong prompt này dưới
dạng unresolved nếu decision đã rõ.

==================================================
10. UPDATE HUMAN REVIEW SECTION
===============================

Sửa Section:

## 13. Human Review

thành:

Status:
REVIEWED

Student Decision:
MODIFIED_AND_APPROVED

Student Notes:

* Corrected project-level group/scenario/listener uniqueness from PASS
  to NEEDS_CLARIFICATION because dry-run artifacts are not production
  HW05 evidence.

* Primary Stress workload uses success-path data only; intentional
  400/404 and boundary cases are excluded from the measured workload.

* For apply-coupon-only scope, coupon_usage reset is not required
  between iterations because the current handler does not mutate usage.

* Current implemented authentication behavior will be tested; JWT will
  not be added when the current handler does not enforce it. The
  documentation/implementation discrepancy remains recorded.

* total_amount == min_order_amount is excluded from the primary Stress
  dataset because source/documentation boundary semantics conflict.

* Stress timeline was made explicit for deterministic JMeter generation.

* Approval applies only to the controlled integration test.
  Final use of POST /api/apply-coupon as the HW05 TRANSACTIONAL endpoint
  remains subject to endpoint-selection review.

Human Review Scope:
CONTROLLED_INTEGRATION_TEST

Final HW05 Transactional Endpoint:
NOT_YET_APPROVED

==================================================
11. PRESERVE TRACEABILITY
=========================

Không xóa FACT/ASSUMPTION/RECOMMENDATION hiện có nếu chúng vẫn đúng.

Không rewrite toàn bộ file.

Patch minimum necessary sections.

Sau patch:

verify design vẫn có đủ required sections của
$perf-scenario-designer.

==================================================
12. AUDIT
=========

Audit hiện tại đang:

AUDIT_INITIALIZATION_INFORMATION_REQUIRED

vì chưa có Student Information.

Không bịa Student Information.

Không fabricate audit entry.

Nếu repository đã có Student Information đáng tin cậy sau lần trước:
→ dùng actual audit contract.

Nếu vẫn thiếu:
→ giữ audit status BLOCKED/INITIALIZATION_REQUIRED.

Audit blocker KHÔNG được silently bypass,
nhưng cũng không được thay thế bằng dữ liệu giả.

==================================================
13. RESUME ORCHESTRATOR
=======================

Sau khi patch design thành công:

Resume:

$hw05-performance-workflow

Không restart workflow từ đầu.

Expected state transition:

HUMAN_DESIGN_REVIEW_REQUIRED
↓
MODIFIED_AND_APPROVED
↓
DESIGN_APPROVED

Sau đó kiểm tra prerequisite cho:

$jmeter-plan-builder

==================================================
14. STUDENT ID / EXECUTION DATE GATE
====================================

$jmeter-plan-builder yêu cầu Student ID và Execution Date thật.

Nếu repository có Student ID từ evidence đáng tin cậy:
→ có thể sử dụng.

Nếu không:
→ NEEDS_CLARIFICATION.

Không bịa.

Execution Date:
phải dùng actual user-provided/approved execution date theo builder
contract.

Không tự suy từ example filename.

Nếu thiếu required data:

DỪNG tại builder prerequisite gate
và chỉ báo thiếu field.

==================================================
15. BUILD JMETER PLAN NẾU PREREQUISITE ĐỦ
=========================================

Nếu:

Design:
MODIFIED_AND_APPROVED

Student ID:
AVAILABLE

Execution Date:
AVAILABLE

thì gọi:

$jmeter-plan-builder

Expected inputs:

Endpoint:
POST /api/apply-coupon

Group:
TRANSACTIONAL

Scenario:
STRESS

Design:
docs/performance-design/stress-apply-coupon-design.md

Builder phải preserve:

* explicit Stress timeline;
* Constant Timer 1000 ms;
* REQUEST_DRIVEN CSV;
* code;
* total_amount;
* user_id;
* success-path dataset semantics;
* current handler authentication decision;
* Aggregate Report;
* approved Assertions.

Không chạy JMeter.

Không tạo JTL.

==================================================
16. RUN PLAN REVIEW
===================

Nếu builder tạo thành công:

* JMX;
* transactional CSV/schema/artifact;
* generation summary;

thì gọi:

$perf-plan-reviewer

Review phải kiểm tra tối thiểu:

* Design fidelity;
* Stress stage mapping;
* Think Time mapping;
* CSV binding;
* REQUEST_DRIVEN;
* current auth handling;
* API contract;
* assertions;
* Listener;
* dependencies;
* filename;
* data safety;
* HW05 compliance;
* execution readiness.

Không tự sửa reviewer findings.

==================================================
17. HUMAN PLAN REVIEW GATE
==========================

Sau `$perf-plan-reviewer`:

DỪNG.

Không tự approve plan.

Không chạy JMeter.

Không đi qua Real Execution barrier.

Expected final checkpoint:

CHECKPOINT:
JMETER_AI_REVIEW_REQUIRED

Nếu plan/reviewer hoàn toàn chưa thể tạo do missing Student ID/date/data:

dừng tại blocker thật tương ứng.

==================================================
18. ABSOLUTE SAFETY RULES
=========================

Trong invocation này:

KHÔNG:

* chạy JMeter;
* tạo raw JTL;
* tạo execution HTML report;
* tạo screenshot;
* tạo CPU/RAM evidence;
* tạo hardware evidence;
* commit;
* push;
* fabricate Student approval ngoài decision được ghi rõ trong prompt này;
* fabricate audit information;
* fabricate CSV production rows nếu actual test data chưa được cung cấp;
* đổi final HW05 endpoint selection.

Có thể tạo:

* patched Performance Design;
* JMX nếu prerequisites đủ;
* CSV schema/template theo builder contract;
* generation summary;
* AI plan review;
* workflow state update;
* AI Audit entry nếu đủ actual information.

==================================================
19. FINAL OUTPUT
================

Báo cáo ngắn gọn:

CONTROLLED INTEGRATION TEST — CONTINUATION

Design Patch:
PASS / FAIL

Human Decision Recorded:
MODIFIED_AND_APPROVED

Design Scope:
CONTROLLED_INTEGRATION_TEST

Final HW05 Transactional Selection:
NOT_YET_APPROVED

Global Uniqueness:
PASS / NEEDS_CLARIFICATION / FAIL

Primary Dataset:
SUCCESS_PATH_ONLY / FAIL

DATA_DRIVEN_FIT:
PASS / RISK / BLOCKED

Auth Decision:
CURRENT_IMPLEMENTATION_BEHAVIOR / BLOCKED

Boundary Isolation:
PASS / FAIL

Stress Timeline:
PASS / FAIL

Think Time Mapping:
PASS / FAIL

Audit:
PASS / AUDIT_INITIALIZATION_INFORMATION_REQUIRED / FAIL

Workflow State:
...

JMeter Builder:
COMPLETE / BLOCKED / NOT_REACHED

Generated JMX: <path or NONE>

CSV:
<path/schema or NONE>

Generation Summary: <path or NONE>

Plan Reviewer:
COMPLETE / BLOCKED / NOT_REACHED

Review Artifact: <path or NONE>

Open Critical Findings: <count or UNKNOWN>

Open High Findings: <count or UNKNOWN>

Final Checkpoint:
JMETER_AI_REVIEW_REQUIRED
hoặc actual blocker nếu chưa tới được checkpoint.

Next Allowed Action: <exactly one next legal action>

KHÔNG COMMIT.
KHÔNG PUSH.
KHÔNG RUN JMETER.
