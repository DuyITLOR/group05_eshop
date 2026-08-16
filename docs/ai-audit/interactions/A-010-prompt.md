Bạn đang làm việc trong repository HW05 – Performance Testing.

# NHIỆM VỤ

Thiết kế và đề xuất FINAL PRODUCTION MATRIX cho Task 1 của HW05.

KHÔNG generate JMX trong bước này.
KHÔNG chạy JMeter.
KHÔNG tạo JTL.
KHÔNG sửa production CSV.
KHÔNG commit.
KHÔNG push.

Mục tiêu là chốt:

* READ_HEAVY endpoint;
* AUTH_HEAVY endpoint;
* TRANSACTIONAL endpoint;

và map chính xác 1-to-1 với:

* LOAD;
* STRESS;
* SPIKE;

đồng thời đảm bảo:

* mỗi endpoint group được dùng đúng một lần;
* mỗi scenario được dùng đúng một lần;
* mỗi production plan có CSV riêng;
* ba production plans dùng ba listener/report view khác nhau.

==================================================

1. ĐỌC ACTUAL REQUIREMENTS VÀ REPOSITORY
   ==================================================

Trước khi đề xuất:

Đọc:

* HW05 assignment requirements;
* api_specification.md;
* backend/server.js;
* backend/database.js;
* README.md;
* current production performance artifacts;
* workflow state hiện tại.

Đặc biệt đọc:

docs/performance-design/stress-apply-coupon-design.md
docs/performance-reviews/stress-apply-coupon-jmeter-ai-review.md
docs/performance-executions/stress-apply-coupon-run-001-execution-review.md

và current workflow state.

Không assume endpoint từ tên route.

Phải đọc implementation thực tế để hiểu:

* read behavior;
* authentication behavior;
* state mutation;
* request input;
* business logic;
* data dependencies;
* expected success path.

==================================================
2. DRY-RUN ARTIFACT POLICY
==========================

Hiện repository có thể có:

docs/performance-design/load-categories-design.md

docs/performance-design/spike-forgot-password-design.md

Đây là:

DRY_RUN / SMOKE / NON_PRODUCTION artifacts.

Có thể đọc để lấy context,
nhưng KHÔNG được dùng làm:

* production endpoint approval;
* global uniqueness evidence;
* final HW05 matrix evidence;
* Human Review evidence.

Không tự promote chúng thành production artifacts.

==================================================
3. CURRENT CONTROLLED STRESS EVIDENCE
=====================================

Đã có một controlled real run cho:

Endpoint:
POST /api/apply-coupon

Group:
TRANSACTIONAL

Scenario:
STRESS

Listener:
Aggregate Report

Real execution:
COMPLETE

Raw JTL:
AVAILABLE

Human Execution Review:
APPROVED

IMPORTANT:

Run này hiện vẫn là:

CONTROLLED_INTEGRATION_TEST

và:

FINAL_HW05_TRANSACTIONAL_SELECTION:
NOT_YET_APPROVED

Không tự động coi nó là final production TRANSACTIONAL endpoint.

==================================================
4. EVALUATE WHETHER APPLY-COUPON IS SUITABLE
============================================

Đánh giá nghiêm túc:

POST /api/apply-coupon

có phù hợp làm FINAL TRANSACTIONAL endpoint hay không.

Current implementation evidence phải được ưu tiên cho current behavior.

Xem xét:

* handler có mutate state hay chỉ đọc;
* business transaction semantics;
* quota/state dependency;
* data-driven fit;
* deterministic repeatability;
* suitability cho Stress testing;
* risk khi reuse data;
* usefulness của performance result;
* HW05 interpretation của "transactional".

Nếu handler hiện tại chỉ đọc coupon/coupon_usage và không mutate state:

phải flag:

TRANSACTIONAL_SEMANTICS_RISK

Không tự REJECT chỉ vì vậy.

So sánh với actual alternative endpoints trong repository có
state mutation thật nếu tồn tại.

Ví dụ chỉ khi source thực sự có:

* create/update operation;
* order creation;
* coupon usage mutation;
* checkout mutation;
* other transaction-like endpoint.

Không invent candidate.

==================================================
5. DISCOVER ENDPOINT CANDIDATES
===============================

Tìm candidate cho ba group:

READ_HEAVY
AUTH_HEAVY
TRANSACTIONAL

Đối với mỗi candidate ghi:

Endpoint:
Method:
Group Candidate:
Current Behavior:
Authentication:
State Mutation:
Input Fields:
Data-driven Fit:
Success-path Stability:
Reset/Isolation Need:
Likely Listener Fit:
Scenario Suitability:
Implementation/Spec Conflicts:
Risks:

Không chọn endpoint chỉ vì tên nghe phù hợp.

==================================================
6. READ_HEAVY EVALUATION
========================

READ_HEAVY nên ưu tiên endpoint có:

* chủ yếu read/query;
* ít hoặc không mutate state;
* deterministic;
* dễ lặp lại;
* request-driving input nếu có;
* useful latency/throughput interpretation.

Nếu endpoint không có request input thật và CSV chỉ trace-only:

DATA_DRIVEN_FIT:
RISK

Không giả PASS.

==================================================
7. AUTH_HEAVY EVALUATION
========================

AUTH_HEAVY phải thực sự có authentication-related workload.

Xác minh actual source:

* credential validation;
* token generation/verification;
* OTP/reset flow;
* auth middleware;
* account lookup;
* password hashing/comparison;

hoặc equivalent.

Không gán AUTH_HEAVY chỉ vì endpoint nằm gần auth code.

Phải đánh giá:

* safe reusable credentials;
* account lock/state mutation;
* rate-limit risk;
* data isolation;
* repeatability;
* CSV suitability.

==================================================
8. TRANSACTIONAL EVALUATION
===========================

TRANSACTIONAL nên ưu tiên workflow/endpoint có meaningful business
transaction hoặc state-changing behavior nếu repository có candidate
phù hợp.

Đánh giá:

* INSERT / UPDATE / DELETE;
* transactional consistency;
* rollback/reset requirements;
* unique data requirements;
* concurrency conflicts;
* repeatability;
* cleanup strategy;
* business value của performance test.

Nếu candidate mutate state:

phải nêu rõ:

DATA_RESET_STRATEGY:
...

ISOLATION_STRATEGY:
...

Không chọn candidate không thể safely execute repeatedly.

==================================================
9. SCENARIO MAPPING
===================

Phải map:

READ_HEAVY
AUTH_HEAVY
TRANSACTIONAL

với đúng một trong:

LOAD
STRESS
SPIKE

Mỗi scenario chỉ được dùng một lần.

Không assume:

TRANSACTIONAL -> STRESS

chỉ vì controlled run hiện tại đã làm vậy.

Đánh giá toàn bộ matrix.

Tuy nhiên controlled Stress evidence đã có giá trị thực,
nên nếu POST /api/apply-coupon đủ phù hợp làm final transactional endpoint:

ưu tiên reuse:

TRANSACTIONAL -> STRESS

để tránh chạy lại không cần thiết.

Không rerun chỉ để đổi label.

Nếu apply-coupon KHÔNG đủ phù hợp:

report rõ:

CONTROLLED_RUN_RETAINED_AS:
INTEGRATION_EVIDENCE_ONLY

và chọn final production transactional mapping khác.

==================================================
10. LISTENER UNIQUENESS
=======================

Existing controlled Stress listener:

Aggregate Report

Nếu Stress run được promote thành final production scenario:

Stress Listener:
Aggregate Report

Hai production plans còn lại phải dùng listener/report views khác.

Đề xuất 2 listener khác từ actual JMeter-supported options.

Không dùng cùng một listener hai lần.

Phải giải thích vì sao listener phù hợp với scenario.

Output:

LOAD Listener:
...

STRESS Listener:
...

SPIKE Listener:
...

GLOBAL_LISTENER_UNIQUENESS:
PASS / NEEDS_CLARIFICATION

==================================================
11. CSV MATRIX
==============

Mỗi endpoint group phải có CSV riêng.

Propose canonical files:

READ_HEAVY:
test-data/<...>.csv

AUTH_HEAVY:
test-data/<...>.csv

TRANSACTIONAL:
test-data/<...>.csv

Đối với từng CSV:

CSV_MODE:
REQUEST_DRIVEN / TRACEABILITY_ONLY

DATA_DRIVEN_FIT:
PASS / RISK / BLOCKED

Request-driving fields:
...

Trace-only fields:
...

Không tạo actual rows ở bước này.

==================================================
12. RECOMMENDED FINAL MATRIX
============================

Tạo proposal dạng:

| Group | Endpoint | Scenario | Listener | CSV | Data-driven Fit | State Mutation | Recommendation |
| ----- | -------- | -------- | -------- | --- | --------------- | -------------- | -------------- |

Phải có đúng 3 rows:

READ_HEAVY
AUTH_HEAVY
TRANSACTIONAL

Scenario uniqueness:
PASS / FAIL

Group uniqueness:
PASS / FAIL

Listener uniqueness:
PASS / FAIL

CSV uniqueness:
PASS / FAIL

==================================================
13. APPLY-COUPON PROMOTION DECISION
===================================

Đưa ra recommendation riêng:

APPLY_COUPON_FINAL_RECOMMENDATION:

PROMOTE_TO_FINAL
hoặc
KEEP_AS_CONTROLLED_ONLY
hoặc
NEEDS_HUMAN_DECISION

Kèm:

Reasons For:

* ...

Reasons Against:

* ...

Migration Cost if Rejected:

* ...

Reusable Existing Evidence:

* design;
* JMX;
* CSV;
* JTL;
* HTML;
* resource evidence;
* execution review.

Không gọi controlled evidence "wasted"
nếu endpoint không được chọn final.

==================================================
14. DO NOT CREATE PRODUCTION DESIGNS YET
========================================

Bước này chỉ chọn matrix.

KHÔNG gọi:

$perf-scenario-designer
$jmeter-plan-builder
$perf-plan-reviewer

cho production LOAD/SPIKE ở bước này.

Sau Human Review matrix mới bắt đầu scenario tiếp theo.

==================================================
15. OUTPUT ARTIFACT
===================

Create:

docs/performance-design/hw05-production-matrix-proposal.md

Nội dung:

1. Requirement constraints
2. Endpoint candidates
3. Candidate comparison
4. Apply-coupon suitability analysis
5. Recommended 3x3 mapping
6. Listener strategy
7. CSV strategy
8. Risks / implementation conflicts
9. Existing Stress evidence reuse
10. Human Review

Human Review:

Status:
PENDING

Student Decision:
NOT_REVIEWED

Possible:
APPROVED
MODIFIED_AND_APPROVED
REJECTED

==================================================
16. WORKFLOW
============

Không phá current Stress evidence state.

Nếu workflow hỗ trợ global matrix state:

update canonically để thể hiện:

PRODUCTION_MATRIX_REVIEW_REQUIRED

Không xóa:

RAW_JTL_AVAILABLE

của controlled Stress run.

Nếu workflow không support global matrix state:
không invent state enum;
chỉ record next global action trong appropriate section.

==================================================
17. AUDIT
=========

Đây là substantive HW05 assignment interaction.

Use $log-ai-audit theo current scope.

Không audit Agent Skill implementation.

Không finalize audit.
Không commit audit.

==================================================
18. GIT
=======

KHÔNG COMMIT.
KHÔNG PUSH.

==================================================
19. FINAL OUTPUT
================

Return:

HW05 PRODUCTION MATRIX PROPOSAL

Candidate Endpoints Reviewed: <count>

READ_HEAVY: <endpoint>

AUTH_HEAVY: <endpoint>

TRANSACTIONAL: <endpoint>

LOAD:
<group + endpoint>

STRESS:
<group + endpoint>

SPIKE:
<group + endpoint>

LOAD Listener: <listener>

STRESS Listener: <listener>

SPIKE Listener: <listener>

Group Uniqueness:
PASS / FAIL

Scenario Uniqueness:
PASS / FAIL

Listener Uniqueness:
PASS / FAIL

CSV Uniqueness:
PASS / FAIL

READ_HEAVY Data-driven Fit:
PASS / RISK / BLOCKED

AUTH_HEAVY Data-driven Fit:
PASS / RISK / BLOCKED

TRANSACTIONAL Data-driven Fit:
PASS / RISK / BLOCKED

Apply Coupon:
PROMOTE_TO_FINAL / KEEP_AS_CONTROLLED_ONLY / NEEDS_HUMAN_DECISION

Existing Stress Evidence Reusable:
YES / PARTIAL / NO

Proposal Artifact:
docs/performance-design/hw05-production-matrix-proposal.md

Final Checkpoint:
PRODUCTION_MATRIX_REVIEW_REQUIRED

Next Allowed Action:
Student Human Review of the proposed final Task 1 matrix.

NO JMETER EXECUTION.
NO JMX GENERATION.
NO COMMIT.
NO PUSH.
