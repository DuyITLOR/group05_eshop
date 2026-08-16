Bạn đang làm việc trong repository HW05 – Performance Testing.

NHIỆM VỤ
========

RESUME workflow hiện tại để resolve DATA_BLOCKER / finding R-001
cho controlled Stress plan:

POST /api/apply-coupon
TRANSACTIONAL
STRESS

Current workflow state:

HUMAN_PLAN_REVIEW_REQUIRED

Current blocker:

DATA_BLOCKER

Current artifacts:

Design:
docs/performance-design/stress-apply-coupon-design.md

JMX:
test-plans/23127107_Stress_20260812.jmx

CSV:
test-data/transactional.csv

Generation Summary:
docs/jmeter-generation/23127107-stress-generation-summary.md

AI Review:
docs/performance-reviews/stress-apply-coupon-jmeter-ai-review.md

Student ID:
23127107

Execution Date:
2026-08-12

KHÔNG chạy JMeter.
KHÔNG tạo JTL.
KHÔNG tạo execution evidence.
KHÔNG commit.
KHÔNG push.

==================================================
1. READ REVIEW FINDINGS FIRST
==================================================

Đọc đầy đủ:

docs/performance-reviews/stress-apply-coupon-jmeter-ai-review.md

Đặc biệt tìm:

R-001

và tất cả finding liên quan:

- DATA_STRATEGY;
- DATA_BINDING;
- DATA_EXHAUSTION;
- BUSINESS_STATE;
- EXECUTION_READINESS.

Không assume R-001 chỉ là "CSV trống".

Report chính xác:

R-001:
- Severity:
- Category:
- Problem:
- Evidence:
- Proposed Fix:
- Why it blocks execution:

==================================================
2. INSPECT ACTUAL DATA SOURCES
==================================================

Đọc:

backend/database.js
backend/server.js
api_specification.md

và các seed/config liên quan.

Tìm actual deterministic data candidates cho:

POST /api/apply-coupon

Không invent data.

Xác minh tối thiểu:

Coupon:
- code;
- active state;
- discount type;
- discount value;
- min_order_amount;
- expiry;
- max_uses_per_user nếu có.

User:
- actual user_id tồn tại;
- current usage/quota evidence nếu source/seed cho phép xác minh.

Current handler:
- exact conditions để trả HTTP 200;
- exact conditions để trả 400/404;
- whether apply-coupon mutates usage;
- current `>` vs `>=` behavior.

==================================================
3. SUCCESS-PATH-ONLY RULE
==================================================

Primary Stress CSV phải chỉ chứa rows được kỳ vọng:

HTTP 200

và:

success: true

theo CURRENT IMPLEMENTATION.

Không đưa intentional negative cases vào measured Stress dataset.

Loại khỏi primary CSV:

- invalid coupon;
- inactive coupon;
- expired coupon;
- exhausted quota;
- total dưới threshold;
- equality boundary nếu source/documentation conflict;
- user/coupon combination không đủ evidence.

==================================================
4. TOTAL AMOUNT SAFETY
==================================================

Current approved design yêu cầu:

total_amount > min_order_amount

Không dùng:

total_amount == min_order_amount

Chọn amount rõ ràng vượt threshold.

Không chọn giá trị quá sát boundary nếu không có lý do.

Mỗi proposed row phải giải thích:

Coupon min:
...

Chosen total:
...

Why success expected:
...

==================================================
5. USER / QUOTA SAFETY
==================================================

Current apply-coupon handler không tự mutate coupon_usage.

Tuy nhiên existing DB state vẫn có thể khiến user vượt quota.

Đối với từng candidate:

User ID:
...

Existing usage evidence:
...

max_uses_per_user:
...

Expected quota result:
PASS / NOT_VERIFIABLE

Nếu quota không verify được:

không gọi row đó EXECUTION_READY.

Có thể:

DATA_CANDIDATE_STATUS:
NEEDS_RUNTIME_PRECHECK

==================================================
6. PROPOSE DATASET
==================================================

Không sửa CSV ngay trước Human Review.

Trước tiên tạo proposed dataset report.

Nếu repository chưa có convention, dùng:

docs/test-data-reviews/
stress-apply-coupon-data-candidates.md

Report:

# Stress Apply Coupon — Test Data Candidates

## R-001

Finding:
...

## Source Evidence

...

## Proposed Success-path Rows

| Row | code | total_amount | user_id | coupon_case | iteration_key | Expected | Evidence |
|---|---|---:|---:|---|---|---|---|

Chỉ dùng actual values từ repository/SUT evidence.

`coupon_case` nên là success variant, ví dụ canonical value
phù hợp repository convention.

`iteration_key` có thể dùng deterministic label.

==================================================
7. DATASET SIZE / REUSE
==================================================

Đánh giá xem Stress workload có cần nhiều unique rows hay không.

Approved workload:

5 -> 10 -> 20 -> 30 VUs
315 seconds
Think Time 1000 ms

Nhưng apply-coupon-only handler hiện không mutate usage.

Do đó:

Không mặc định cần một unique row cho mỗi request.

Phân tích:

- CSV recycle policy;
- sharing mode;
- reuse safety;
- existing state dependency.

Nếu cùng valid row có thể reuse an toàn theo handler:

ghi:

ROW_REUSE:
SUPPORTED

Evidence:
...

Nếu không chắc:

ROW_REUSE:
NEEDS_REVIEW

Không invent requirement hàng trăm unique users/coupons.

==================================================
8. CSV EXECUTION STRATEGY
==================================================

Đề xuất JMeter CSV Data Set Config semantics:

Recycle on EOF:
<recommended>

Stop thread on EOF:
<recommended>

Sharing mode:
<recommended>

Mỗi recommendation phải có rationale dựa trên:

- dataset size;
- concurrency;
- handler read-only behavior;
- quota dependency.

Không sửa JMX ở bước này.

Nếu JMX hiện đã chứa config khác:
report mismatch để Human Review.

==================================================
9. CHECK REQUEST TYPE BINDING
==================================================

Verify JMX request body đang dùng đúng:

code
total_amount
user_id

và:

coupon_case
iteration_key

không bị gửi vào HTTP JSON.

Check numeric/string semantics.

Nếu phát hiện mismatch:
tạo additional finding.

Không auto-fix.

==================================================
10. DATA CANDIDATE VERDICT
==================================================

Sau analysis:

DATA_CANDIDATES:
FOUND / NOT_FOUND

R-001 Resolution Proposal:
READY_FOR_HUMAN_APPROVAL
hoặc:
STILL_BLOCKED

Không tự ghi:

R-001 FIXED

chưa có Student approval.

==================================================
11. HUMAN REVIEW CHECKPOINT
==================================================

DỪNG sau proposed dataset report.

Không populate production CSV trước khi Student review.

Output:

CHECKPOINT:
TEST_DATA_REVIEW_REQUIRED

Student must choose:

APPROVE_DATA
MODIFY_DATA
REJECT_DATA

Nếu APPROVE_DATA sau này:
→ populate transactional.csv
→ rerun static reviewer
→ resolve R-001
→ update plan Human Review.

==================================================
12. AI AUDIT
==================================================

Đây là HW05 artifact interaction thật.

Nếu $log-ai-audit đang active:

ghi interaction này theo current audit scope.

Không audit Agent Skill implementation.

Không để audit làm thay đổi performance workflow decision.

Không finalize audit.

==================================================
13. GIT
==================================================

KHÔNG COMMIT.
KHÔNG PUSH.

==================================================
14. FINAL OUTPUT
==================================================

Return:

TEST DATA REVIEW — APPLY COUPON STRESS

R-001:
<summary>

Data Candidates:
FOUND / NOT_FOUND

Candidate Count:
<number>

All Candidates Source-backed:
YES / NO

Success-path-only:
PASS / FAIL

Boundary Isolation:
PASS / FAIL

Quota Verification:
PASS / PARTIAL / FAIL

Row Reuse:
SUPPORTED / NEEDS_REVIEW / UNSAFE

CSV Binding:
PASS / FINDING

CSV Runtime Strategy:
PROPOSED

Proposal Artifact:
<path>

Current CSV:
TEMPLATE_ONLY

R-001:
READY_FOR_HUMAN_APPROVAL / STILL_BLOCKED

Workflow State:
HUMAN_PLAN_REVIEW_REQUIRED

Final Checkpoint:
TEST_DATA_REVIEW_REQUIRED

Next Allowed Action:
Student approve/modify/reject proposed dataset.

NO JMETER EXECUTION.
NO JTL.
NO COMMIT.
NO PUSH.