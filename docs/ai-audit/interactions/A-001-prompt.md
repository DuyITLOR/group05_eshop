Bạn đang làm việc trong repository HW05 – Performance Testing.

NHIỆM VỤ
========

Thực hiện một REPAIR + INTEGRATION PASS trên bộ Agent Skill HW05 hiện có.

KHÔNG build lại toàn bộ từ đầu.
KHÔNG tạo một architecture mới.
KHÔNG tạo thêm skill mới trừ khi thật sự không thể giải quyết bằng
các skill hiện có.

Mục tiêu là sửa các lỗi/contract mismatch đã được phát hiện trong:

- $perf-scenario-designer
- $jmeter-plan-builder
- $perf-plan-reviewer
- $jtl-performance-analyzer
- $hw05-performance-workflow
- analyze_jtl.py

Ngôn ngữ chính của SKILL.md, report và user-facing output:
TIẾNG VIỆT.

Technical identifiers có thể giữ tiếng Anh.

FAST REPAIR MODE:

- sửa;
- validate;
- chạy static/synthetic tests;
- KHÔNG chờ Human Review cho chính implementation;
- KHÔNG commit;
- KHÔNG push;
- KHÔNG chạy JMeter thật;
- KHÔNG tạo production JTL;
- KHÔNG tạo execution evidence giả.

==================================================
1. INSPECT ACTUAL REPOSITORY TRƯỚC KHI SỬA
==================================================

Trước khi chỉnh:

1. Tìm các skill theo frontmatter `name`, không dựa vào filename bên ngoài.

Phải tìm:

perf-scenario-designer
jmeter-plan-builder
perf-plan-reviewer
jtl-performance-analyzer
hw05-performance-workflow

2. Tìm parser thực tế:

analyze_jtl.py

3. Tìm:

$log-ai-audit

hoặc audit mechanism tương đương.

4. Đọc đầy đủ contract hiện tại của 5 skill.

5. Xác định actual paths, convention và integration chain.

6. Không assume nội dung hiện tại giống prompt cũ.
Actual repository là source để patch.

7. Trước khi sửa, tạo internal issue matrix:

ISSUE
AFFECTED FILE
CURRENT BEHAVIOR
EXPECTED BEHAVIOR
PATCH REQUIRED

Không cần tạo production artifact cho issue matrix nếu không có
repository convention.

==================================================
2. PHẠM VI SỬA
==================================================

Phải xử lý tối thiểu các vấn đề sau:

A. Think Time contract mismatch.

B. Data-driven CSV risk với endpoint không có input thật.

C. Source/spec/design authority inconsistency giữa các skill.

D. analyze_jtl.py:
   - median;
   - p50;
   - window throughput;
   - stage throughput;
   - partial success classification;
   - invalid elapsed status;
   - stage-map validation;
   - stage mapping coverage;
   - relative time-window labels.

E. $jtl-performance-analyzer documentation phải khớp parser mới.

F. Task 2 optimization recommendations:
   - AI propose optimization;
   - validate against source/config;
   - classify FEASIBLE / HALLUCINATED.

G. $hw05-performance-workflow Real Execution gate phải enforce
   đầy đủ execution evidence của HW05.

H. Endurance/Soak tracking phải đủ để không bị bỏ quên requirement.

I. Các integration test của cả bộ 5 skill.

==================================================
3. FIX A — THINK TIME CONTRACT
==================================================

Hiện tại designer có thể đề xuất Think Time dạng range như:

500-1000 ms

trong khi builder yêu cầu approved design phải mô tả rõ cách map
range sang JMeter Timer.

Sửa contract để designer output rõ ràng.

Performance Scenario Design phải có:

Think Time:
<value/range>

Think Time Justification:
...

JMeter Timer Mapping:
- Timer Type:
- Lower Bound:
- Upper Bound:
- JMeter Parameters:
- Mapping Status:

Canonical mapping:

Think Time = 0
→ Timer Type: NONE

Think Time fixed = X ms
→ Timer Type: Constant Timer
→ Delay: X ms

Think Time range = L-U ms
→ Timer Type: Uniform Random Timer
→ Constant Delay Offset: L ms
→ Random Delay Maximum: U-L ms

Ví dụ:

Think Time:
500-1000 ms

JMeter Timer Mapping:
Timer Type: Uniform Random Timer
Constant Delay Offset: 500 ms
Random Delay Maximum: 500 ms
Resulting Range: 500-1000 ms

Builder phải consume đúng contract này.

Reviewer phải verify:

- Timer Type;
- lower/upper;
- offset;
- random range;
- enabled state;
- scope.

Không để flow:

designer creates valid range
→ Human approves
→ builder returns NEEDS_CLARIFICATION

chỉ vì contract giữa hai skill không khớp.

Nếu design cũ không có mapping:
→ backward compatibility:
   NEEDS_CLARIFICATION
   không silently invent mapping sau approval.

==================================================
4. FIX B — DATA-DRIVEN CSV FIT
==================================================

HW05 yêu cầu test plan data-driven và mỗi endpoint group có CSV riêng.

Hiện tại designer có thể đề xuất trace-only field như:

request_label
iteration_key

cho endpoint không có input.

Không được trình bày trường hợp này như một fully data-driven request.

Thêm field:

DATA_DRIVEN_FIT:
PASS
RISK
BLOCKED

Rules:

PASS
----
CSV variable thực sự drive một phần request/workflow, ví dụ:

- path parameter;
- query;
- request body;
- account;
- product ID;
- coupon;
- order ID;
- credential;
- workflow input.

RISK
----
CSV riêng tồn tại nhưng chỉ dùng traceability và không thay đổi
HTTP request/business workflow.

Output phải nói rõ:

CSV_MODE:
TRACEABILITY_ONLY

HW05_DATA_DRIVEN_RISK:
YES

Recommendation:
Nếu có endpoint/workflow phù hợp hơn có input thật,
cân nhắc đổi endpoint trước khi final selection.

BLOCKED
-------
Không thể thiết kế CSV input hợp lý và requirement không thể
được đáp ứng theo interpretation hiện tại.

Builder không được ghi:

Data-driven request: PASS

nếu CSV chỉ TRACEABILITY_ONLY.

Reviewer phải flag:

DATA_DRIVEN_FIT_RISK

thay vì giả vờ requirement chắc chắn PASS.

Không tự đổi endpoint.
Student quyết định.

==================================================
5. FIX C — THỐNG NHẤT AUTHORITY MODEL
==================================================

Không dùng một source-priority list đơn giản cho mọi loại câu hỏi.

Thay bằng ROLE-BASED AUTHORITY MODEL:

A. HW05 Requirements
→ authority cho assignment compliance.

B. Approved Performance Scenario Design
→ authority cho intended TEST CONFIGURATION.

C. Actual Source Code / Runtime Config
→ authority cho CURRENT SUT IMPLEMENTATION BEHAVIOR.

D. API Specification
→ authority cho DOCUMENTED API CONTRACT.

E. Other docs
→ supporting evidence.

Ví dụ:

Approved Design says:
POST /api/foo with field A

Actual Source says:
field B

API Specification says:
field A

Không silently chọn một bên.

Phải report:

IMPLEMENTATION_CONFLICT

Design:
...

Current Implementation:
...

Documented Contract:
...

Impact:
...

Required Resolution:
Human Review / design update / implementation clarification.

Nếu Source khác API Specification:

IMPLEMENTATION_SPEC_CONFLICT

Current behavior FACT:
source/config evidence

Documented behavior FACT:
API specification evidence

Không nói spec hoặc source "sai" nếu chưa có Human Review.

Apply authority model này nhất quán tối thiểu trong:

- perf-scenario-designer
- jmeter-plan-builder
- perf-plan-reviewer
- hw05-performance-workflow

Analyzer sử dụng model này khi cần giải thích error/optimization.

==================================================
6. FIX D1 — STATISTICAL MEDIAN VS P50
==================================================

Sửa analyze_jtl.py.

Hiện tại không được gọi nearest-rank p50 là statistical median.

Output response-time phải tách:

median
p50_nearest_rank
p90
p95
p99

Median:

- odd n:
  middle value.

- even n:
  arithmetic mean của hai middle values.

Có thể dùng Python standard library hoặc implementation deterministic.

Percentile:

p50_nearest_rank
p90
p95
p99

tiếp tục dùng:

nearest-rank
rank = ceil(p / 100 * n)

Ví dụ bắt buộc:

values:
[100, 200]

Expected:

median:
150

p50_nearest_rank:
100

Không được output:

p50_median = 100

và gọi đó là median.

Cập nhật SKILL.md, metrics report template và calculation notes
để phản ánh distinction này.

==================================================
7. FIX D2 — SUCCESS CLASSIFICATION
==================================================

Nếu `success` không xác định được cho tất cả samples:

canonical:

successful_samples:
NOT_COMPUTABLE

failed_samples:
NOT_COMPUTABLE

error_rate_percent:
NOT_COMPUTABLE

Có thể bổ sung:

observed_successful_samples
observed_failed_samples

để giữ dữ liệu quan sát được.

Ví dụ:

sample 1:
success=true

sample 2:
success missing

Expected:

observed_successful_samples:
1

observed_failed_samples:
0

successful_samples:
NOT_COMPUTABLE

failed_samples:
NOT_COMPUTABLE

error_rate_percent:
NOT_COMPUTABLE

analysis_status:
PARTIAL

Không output count incomplete như thể toàn bộ classification đã biết.

==================================================
8. FIX D3 — INVALID ELAPSED
==================================================

Nếu có bất kỳ sample nào có elapsed không parse được hoặc invalid:

invalid_elapsed_samples > 0

thì analysis không được giữ:

COMPLETE

nếu latency metrics chỉ cover subset.

Expected:

analysis_status:
PARTIAL

Bổ sung nếu hợp lý:

response_time_samples
response_time_coverage_percent

Ví dụ:

100 samples
99 elapsed valid

Coverage:
99%

Không bịa latency cho sample invalid.

Nếu không có elapsed hợp lệ nào:
→ BLOCKED.

==================================================
9. FIX D4 — THROUGHPUT SCOPE
==================================================

Không dùng một denominator giống nhau cho:

overall
window
stage

mà không xét semantics.

### Overall

Giữ method hiện tại nếu đó là contract được lựa chọn,
nhưng document rõ.

Nếu thay method:
→ update SKILL.md + tests + calculation notes nhất quán.

Không silently thay formula.

### Time Window

Windows phải anchor tương đối theo run start, không dùng epoch bucket
khó đọc như:

1723410000-1723410060s_epoch_bucket

Output nên:

0-60s
60-120s
120-180s

hoặc equivalent relative labels.

Window throughput phải dùng observation duration của window,
không dùng khoảng cách giữa sample đầu và sample cuối trong bucket
nếu điều đó làm denominator không đại diện cho window.

Preferred rule:

For complete configured window:
samples / window duration

For final partial window:
samples / actual observed intersection between run duration and window.

Document exact behavior.

### Stage

Stage có explicit:

start_ms
end_ms

Stage throughput phải dùng:

stage_samples /
((end_ms - start_ms) / 1000)

Không dùng:

max(sample_timestamp) - min(sample_timestamp)

làm stage duration.

Ví dụ:

Stage:
10 seconds

Samples:
2

Expected stage throughput:
0.2 RPS

dù hai samples nằm gần nhau trong stage.

==================================================
10. FIX D5 — STAGE MAP VALIDATION
==================================================

load_stage_map phải validate:

1. Stage name:
   - non-empty;
   - unique.

2. start_ms/end_ms:
   - numeric;
   - end > start.

3. Ordering:
   - sort deterministic hoặc reject unordered input,
     nhưng behavior phải document.

4. Overlap:
   - overlapping stage ranges phải bị reject.

Ví dụ invalid:

Stage A:
0-5000

Stage B:
4000-6000

Expected:

BLOCKED

Reason:
STAGE_MAP_OVERLAP

Duplicate name:

Stage A
Stage A

Expected:

BLOCKED

Reason:
DUPLICATE_STAGE_NAME

Không silently overwrite dictionary entry.

==================================================
11. FIX D6 — STAGE MAPPING COVERAGE
==================================================

Khi stage map được cung cấp:

report:

timestamped_samples
mapped_samples
unmapped_samples
mapping_coverage_percent

Ví dụ:

100 timestamped samples
95 mapped

coverage:
95%

stage_mapping_status:
PARTIAL

Không giả vờ stage analysis cover toàn run.

Nếu stage mapping cố ý chỉ cover một region,
report phải nêu scope rõ.

Nếu workflow dùng stage metrics để suy degradation:
low/partial coverage phải trở thành limitation.

==================================================
12. FIX D7 — RELATIVE TIME WINDOWS
==================================================

Không hiển thị epoch bucket làm primary report label.

Primary output:

Window 0:
0-60s

Window 1:
60-120s

...

Có thể giữ absolute start/end timestamp trong metadata nếu cần traceability:

absolute_start_ms
absolute_end_ms

Nhưng report Human Review phải ưu tiên relative timeline.

==================================================
13. PARSER IMMUTABILITY
==================================================

Giữ nguyên:

raw JTL immutable.

Phải vẫn:

- SHA-256 before;
- SHA-256 after;
- raw_unchanged.

Không overwrite raw JTL.

Không tạo production data trong synthetic validation.

==================================================
14. UPDATE $jtl-performance-analyzer CONTRACT
==================================================

Sau khi sửa parser:

Update SKILL.md để không còn contract cũ mâu thuẫn.

Phải document đúng:

- `median`;
- `p50_nearest_rank`;
- p90/p95/p99;
- success partial behavior;
- elapsed coverage;
- window throughput;
- stage throughput;
- stage validation;
- mapping coverage;
- relative time windows.

Không để:

SKILL.md nói A
analyze_jtl.py làm B.

==================================================
15. FIX E — TASK 2 OPTIMIZATION RECOMMENDATIONS
==================================================

Mở rộng $jtl-performance-analyzer.

HW05 Task 2 không chỉ cần:

- AI analysis;
- threshold;
- misinterpretation hunt;

mà còn cần AI propose optimization và Student đánh giá recommendation.

Không tạo skill mới.

Thêm section:

## Optimization Recommendations

AI có thể đề xuất, ví dụ:

- database index;
- connection pool;
- SQLite WAL;
- query optimization;
- caching;
- request batching;
- application configuration;

NHƯNG recommendation phải được validate với source/config.

Mỗi recommendation có:

Recommendation ID:
O-001

AI Recommendation:
...

Observed Evidence:
...

Relevant Source/Config Evidence:
...

Technology Applicability:
SUPPORTED / NOT_SUPPORTED / NOT_VERIFIED

Final Classification:
FEASIBLE / HALLUCINATED / NEEDS_MORE_EVIDENCE

Reason:
...

Expected Benefit:
...

Benefit Proven:
YES / NO

Confidence:
LOW / MEDIUM / HIGH

Student Decision:
NOT_REVIEWED

==================================================
16. OPTIMIZATION CLASSIFICATION RULES
==================================================

FEASIBLE
--------

Chỉ dùng khi recommendation thật sự applicable với current stack/code.

Ví dụ:

AI:
Enable SQLite WAL.

Actual repository:
SQLite is actually used.

Classification:
FEASIBLE

Nhưng:

Benefit Proven:
NO

nếu chưa có experiment chứng minh cải thiện.

Quan trọng:

FEASIBLE != PROVEN ROOT CAUSE
FEASIBLE != GUARANTEED IMPROVEMENT

HALLUCINATED
------------

Ví dụ:

AI:
Increase PostgreSQL max_connections.

Repository:
Không có PostgreSQL; SUT dùng SQLite.

Classification:
HALLUCINATED

NEEDS_MORE_EVIDENCE
-------------------

Dùng tạm khi không đủ source/config để quyết định.

Nhưng trước khi Task 2 được xem là final:
Student phải review và resolve recommendation theo rubric phù hợp.

Không bịa optimization chỉ để có nội dung.

==================================================
17. MISINTERPRETATION VS OPTIMIZATION
==================================================

Không trộn:

MISINTERPRETATION
với
OPTIMIZATION VALIDATION.

Report structure:

Evidence Metrics
↓
AI Interpretation
↓
Claim Verification
↓
Misinterpretation Findings
↓
Optimization Recommendations
↓
Optimization Feasibility Review
↓
Human Review

==================================================
18. UPDATE ANALYSIS HUMAN REVIEW CHECKPOINT
==================================================

Checkpoint phải yêu cầu Student review:

- metric interpretation;
- threshold recommendations;
- misinterpretation findings;
- performance/functional issue candidates;
- optimization recommendations;
- FEASIBLE/HALLUCINATED classification;
- unsupported claims.

Không tự approve.

==================================================
19. FIX F — REAL EXECUTION EVIDENCE MODEL
==================================================

Sửa $hw05-performance-workflow.

Hiện tại raw JTL hợp lệ không được phép tự động đồng nghĩa với
toàn bộ execution evidence complete.

Tách:

RAW_JTL_AVAILABLE

và:

REAL_EXECUTION_EVIDENCE_COMPLETE

Một scenario run của HW05 phải theo dõi tối thiểu:

Raw JTL:
REQUIRED

HTML Report Folder:
REQUIRED

Resource Monitor Evidence:
REQUIRED

Execution Metadata:
REQUIRED

Hardware Evidence:
có thể là PROJECT-LEVEL evidence dùng chung,
không nhất thiết duplicate cho mỗi scenario.

==================================================
20. EXECUTION STATE TRANSITIONS
==================================================

Sau khi Student chạy thật:

CASE A:

Raw JTL:
VALID

HTML:
MISSING

Resource Evidence:
MISSING

Expected:

RAW_JTL_AVAILABLE:
YES

REAL_EXECUTION_EVIDENCE_COMPLETE:
NO

Execution Status:
PARTIAL_EVIDENCE

Analyzer:
MAY_RUN using raw JTL

Endpoint Workflow:
NOT_COMPLETE

Không đánh dấu full execution evidence complete.

CASE B:

JTL + HTML + resource evidence + execution metadata:
VALID

Expected:

REAL_EXECUTION_EVIDENCE_COMPLETE:
YES

CASE C:

Hardware evidence missing project-wide:

Scenario analysis vẫn có thể chạy,
nhưng:

HW05_SUBMISSION_READINESS:
NOT_READY

và hardware/endurance conclusions bị hạn chế.

==================================================
21. KHÔNG BLOCK ANALYZER VÔ LÝ
==================================================

Raw JTL hợp lệ vẫn đủ để gọi:

$jtl-performance-analyzer

dù screenshot/HTML report chưa có.

Mục đích:

không trì hoãn Task 2 analysis.

Nhưng:

ENDPOINT_WORKFLOW_COMPLETE

không được đạt nếu mandatory execution evidence còn thiếu.

==================================================
22. REAL EXECUTION CHECKPOINT
==================================================

Update checkpoint:

CHECKPOINT: REAL_EXECUTION_REQUIRED

Required Per-Run Evidence:
- raw JTL;
- HTML report folder;
- screenshot/evidence showing JMeter/tool with backend resource monitor;
- execution metadata.

Required Project-Level Evidence:
- hardware report/spec evidence.

Không viết:

"if current requirement calls for it"

với JTL/HTML/resource evidence của HW05 hiện tại.

Đây là mandatory evidence model của homework này.

==================================================
23. FIX G — ENDURANCE / SOAK TRACKING
==================================================

Không tạo scenario thứ tư trong mapping:

LOAD
STRESS
SPIKE

vẫn giữ nguyên.

Endurance là additional execution requirement.

Orchestrator phải track riêng:

ENDURANCE_STATUS

Suggested states:

NOT_STARTED
EXECUTION_REQUIRED
RAW_JTL_AVAILABLE
EVIDENCE_PARTIAL
ANALYSIS_REQUIRED
HUMAN_REVIEW_REQUIRED
COMPLETE

Theo dõi:

- duration;
- sustained load;
- raw JTL;
- resource evidence;
- analyzer output;
- candidate stable RPS;
- memory/resource ceiling nếu evidence hỗ trợ;
- Human Review.

==================================================
24. ENDURANCE DURATION
==================================================

HW05 yêu cầu short endurance/soak khoảng 10-15 phút.

Orchestrator phải verify execution metadata cho duration.

Nếu:

duration < 10 minutes

→ ENDURANCE_DURATION_RISK

không tự gọi requirement complete.

Không tự kéo dài hoặc chạy test.

==================================================
25. ENDURANCE ANALYZER
==================================================

Dùng:

$jtl-performance-analyzer
Scenario/MODE:
ENDURANCE

Không tạo analyzer mới.

Nếu resource evidence không có:

được phép kết luận application-side JTL stability,
nhưng không được kết luận hardware maximum/memory ceiling.

Nếu resource evidence có:

có thể correlate:

throughput
p95/p99
error rate
CPU
memory

nhưng chỉ dựa trên evidence thật.

==================================================
26. SOURCE AUTHORITY UPDATE TRONG ORCHESTRATOR
==================================================

Orchestrator không được dùng source-priority mơ hồ.

Dùng role-based model ở Section 5.

Human Decision:
authority cho approval state.

Actual artifacts:
authority cho artifact existence/status.

Approved design:
authority cho intended test config.

Source/config:
authority cho current SUT behavior.

API spec:
documented contract.

HW05:
assignment compliance.

AI analysis:
interpretation only.

==================================================
27. PERF-PLAN-REVIEWER PATCH
==================================================

Reviewer hiện khá ổn.

Không rewrite toàn bộ.

Chỉ patch tối thiểu:

1. Authority model đồng bộ.

2. Think Time mapping mới.

3. DATA_DRIVEN_FIT:
   - PASS
   - RISK
   - BLOCKED.

4. Nếu trace-only CSV:
   flag DATA_DRIVEN_FIT_RISK.

5. Không tự fabricate finding.

6. Không đổi severity model nếu không cần.

==================================================
28. PERF-SCENARIO-DESIGNER PATCH
==================================================

Không rewrite workload architecture.

Patch:

1. Think Time mapping explicit.

2. Data-driven fit.

3. Authority model.

4. Output template fields mới.

5. Smoke tests update.

Giữ:

FACT
ASSUMPTION
RECOMMENDATION

và Human Review checkpoint.

==================================================
29. JMETER-PLAN-BUILDER PATCH
==================================================

Patch:

1. Consume approved Timer mapping.

2. Authority model.

3. Data-driven fit semantics.

4. Nếu CSV_MODE=TRACEABILITY_ONLY:
   không ghi fully data-driven PASS.

5. Không silently alter approved design.

6. Không chạy JMeter.

7. Không tạo fake evidence.

==================================================
30. ANALYZE_JTL.PY TEST SUITE
==================================================

Sau patch, bắt buộc chạy tests.

Nếu repository đã có test framework:
→ dùng convention hiện tại.

Nếu không:
→ tạo temporary TEST-ONLY fixtures/scripts,
run tests rồi cleanup nếu appropriate.

Không cần introduce heavyweight dependency.

Python standard library ưu tiên.

==================================================
31. TEST 1 — COMPILE
==================================================

Run:

python -m py_compile <actual analyze_jtl.py path>

Expected:
PASS

==================================================
32. TEST 2 — MEDIAN
==================================================

Input elapsed:

100
200

Expected:

median:
150

p50_nearest_rank:
100

==================================================
33. TEST 3 — ODD MEDIAN
==================================================

Input:

100
200
300

Expected:

median:
200

p50_nearest_rank:
200

==================================================
34. TEST 4 — SUCCESS PARTIAL
==================================================

2 samples:

1:
success=true

2:
success missing

Expected:

observed_successful_samples:
1

successful_samples:
NOT_COMPUTABLE

failed_samples:
NOT_COMPUTABLE

error_rate_percent:
NOT_COMPUTABLE

analysis_status:
PARTIAL

==================================================
35. TEST 5 — INVALID ELAPSED
==================================================

Samples:

100
invalid
300

Expected:

response_time_samples:
2

invalid_elapsed_samples:
1

analysis_status:
PARTIAL

Latency metrics chỉ dùng 2 valid samples.

==================================================
36. TEST 6 — ERROR RATE
==================================================

100 samples:

95 success
5 failure

Expected:

error_rate:
5%

classification complete:
true.

==================================================
37. TEST 7 — STAGE THROUGHPUT
==================================================

Stage:

start_ms:
0

end_ms:
10000

samples mapped:
2

Expected:

stage duration:
10 sec

stage throughput:
0.2 RPS

Không phụ thuộc khoảng cách timestamp giữa hai samples.

==================================================
38. TEST 8 — DUPLICATE STAGE NAME
==================================================

Stage map:

A
A

Expected:

BLOCKED

Reason:
DUPLICATE_STAGE_NAME

==================================================
39. TEST 9 — OVERLAPPING STAGE
==================================================

A:
0-5000

B:
4000-6000

Expected:

BLOCKED

Reason:
STAGE_MAP_OVERLAP

==================================================
40. TEST 10 — STAGE COVERAGE
==================================================

100 timestamped samples.

90 inside stage map.

Expected:

mapped_samples:
90

unmapped_samples:
10

mapping_coverage_percent:
90

stage_mapping_status:
PARTIAL

==================================================
41. TEST 11 — RELATIVE WINDOWS
==================================================

Run start:
T0

Window:
60 seconds

Expected primary labels:

0-60s
60-120s

Không dùng epoch bucket làm primary label.

==================================================
42. TEST 12 — WINDOW THROUGHPUT
==================================================

Tạo synthetic run có một complete 60-second observation window.

2 samples nằm trong window đó.

Expected:

window throughput:
2 / 60
= approximately 0.033333 RPS

Không dùng sample-first to sample-last spacing làm denominator
cho complete window.

==================================================
43. TEST 13 — RAW IMMUTABILITY
==================================================

Hash raw fixture before/after.

Expected:

raw_unchanged:
true

==================================================
44. TEST 14 — MISINTERPRETATION
==================================================

Computed:

mean:
320 ms

p95:
680 ms

Mock AI claim:

p95 = 320 ms

Expected:

METRIC_TYPE_CONFUSION

Correct:
680 ms

==================================================
45. TEST 15 — OPTIMIZATION FEASIBLE
==================================================

Synthetic/mock repository evidence:

SUT:
SQLite

AI recommendation:
Enable SQLite WAL

Expected:

Technology Applicability:
SUPPORTED

Classification:
FEASIBLE

Benefit Proven:
NO

trừ khi benchmark evidence chứng minh.

==================================================
46. TEST 16 — OPTIMIZATION HALLUCINATED
==================================================

Synthetic/mock repository evidence:

SUT:
SQLite only

AI recommendation:
Increase PostgreSQL max_connections

Expected:

Technology Applicability:
NOT_SUPPORTED

Classification:
HALLUCINATED

==================================================
47. TEST 17 — NO FAKE OPTIMIZATION ERROR
==================================================

Recommendation thực sự applicable và supported.

Expected:
Không cố classify HALLUCINATED chỉ để "đủ Task 2".

==================================================
48. INTEGRATION TEST — THINK TIME
==================================================

Designer output:

Think Time:
500-1000 ms

Timer Mapping:
Uniform Random Timer
Offset:
500
Random Maximum:
500

Human Decision:
APPROVED

Expected builder:

không NEEDS_CLARIFICATION.

Expected generated plan model:

Uniform Random Timer
500 + random up to 500

Expected reviewer:
Think Time mapping PASS.

==================================================
49. INTEGRATION TEST — TRACE-ONLY CSV
==================================================

Endpoint:
GET /api/categories

Không có dynamic request parameter.

Designer proposes:
request_label only.

Expected:

DATA_DRIVEN_FIT:
RISK

CSV_MODE:
TRACEABILITY_ONLY

Builder:
không ghi data-driven fully PASS.

Reviewer:
DATA_DRIVEN_FIT_RISK.

Không tự đổi endpoint.

==================================================
50. INTEGRATION TEST — EXECUTION EVIDENCE
==================================================

State:

JTL:
VALID

HTML:
MISSING

Resource Evidence:
MISSING

Expected:

RAW_JTL_AVAILABLE:
YES

Analyzer:
ALLOWED

REAL_EXECUTION_EVIDENCE_COMPLETE:
NO

ENDPOINT_WORKFLOW_COMPLETE:
NO

==================================================
51. INTEGRATION TEST — FULL EXECUTION EVIDENCE
==================================================

State:

JTL:
VALID

HTML folder:
VALID

Resource Evidence:
VALID

Execution Metadata:
VALID

Expected:

REAL_EXECUTION_EVIDENCE_COMPLETE:
YES

==================================================
52. INTEGRATION TEST — ENDURANCE
==================================================

Endurance execution:

Duration:
12 minutes

JTL:
VALID

Resource evidence:
VALID

Expected:

duration requirement:
PASS

Analyzer:
ENDURANCE mode allowed.

Hardware threshold:
only derived when evidence supports it.

==================================================
53. NO REAL JMETER EXECUTION
==================================================

Trong toàn bộ repair:

KHÔNG chạy:

jmeter -n
jmeter -t
jmeter -g

hoặc equivalent performance execution.

Không tạo:

production .jtl
production HTML report
fake resource evidence
fake hardware evidence.

Synthetic JTL phải ở temporary/test fixture path và ghi TEST-ONLY.

==================================================
54. DO NOT MODIFY RAW STUDENT ARTIFACTS
==================================================

Không sửa:

- real raw JTL;
- screenshots;
- hardware evidence;
- existing Student Decision;
- approved design content

ngoài các SKILL/template contract nếu task hiện tại chỉ sửa skill.

Không overwrite Human Review decisions.

==================================================
55. AUDIT POLICY
==================================================

Nếu repository convention yêu cầu AI Audit cho việc sửa skill:

dùng $log-ai-audit theo actual contract.

Không tạo duplicate entry.

Không block toàn bộ repair chỉ vì audit cần Student Information
trừ khi repository contract thực sự yêu cầu stop.

Không bịa audit fields.

==================================================
56. REGRESSION CHECK
==================================================

Sau patch, verify các behavior cũ vẫn giữ:

$perf-scenario-designer:
- no JMX execution;
- Human Review gate.

$jmeter-plan-builder:
- design approval required;
- filename convention;
- no JTL generation.

$perf-plan-reviewer:
- review-only;
- no fake finding;
- no execution.

$jtl-performance-analyzer:
- real JTL only at runtime;
- deterministic metrics;
- raw immutable;
- Human Review required.

$hw05-performance-workflow:
- resumable;
- idempotent;
- no Human Review bypass;
- no real execution bypass;
- no commit/push.

==================================================
57. DO NOT OVER-ENGINEER
==================================================

Không:

- thêm database;
- thêm service mới;
- thêm dependency lớn;
- tạo skill thứ 6;
- rewrite 5 SKILL.md hoàn toàn nếu patch nhỏ đủ;
- đổi naming convention không cần thiết.

Ưu tiên:

minimal coherent patch
+
strong tests
+
contract consistency.

==================================================
58. BUILD / REPAIR OUTPUT
==================================================

Sau khi hoàn thành, KHÔNG chờ tôi review.

Chỉ báo cáo:

REPAIR SUMMARY

Modified:
- <path>
- ...

Think Time Contract:
PASS / FAIL

Data-driven Fit:
PASS / FAIL

Authority Model Consistency:
PASS / FAIL

analyze_jtl.py:
- Compile: PASS / FAIL
- Median: PASS / FAIL
- Success Partial: PASS / FAIL
- Invalid Elapsed: PASS / FAIL
- Window Throughput: PASS / FAIL
- Stage Throughput: PASS / FAIL
- Stage Validation: PASS / FAIL
- Stage Coverage: PASS / FAIL
- Relative Windows: PASS / FAIL
- Raw Immutability: PASS / FAIL

Task 2:
- Misinterpretation Hunt: PASS / FAIL
- Optimization Proposal: PASS / FAIL
- Feasible/Hallucinated Validation: PASS / FAIL

Workflow:
- Raw JTL Gate: PASS / FAIL
- HTML Evidence Gate: PASS / FAIL
- Resource Evidence Gate: PASS / FAIL
- Partial Execution Evidence State: PASS / FAIL
- Endurance Tracking: PASS / FAIL
- Resume/Idempotency Regression: PASS / FAIL

Integration:
$perf-scenario-designer -> $jmeter-plan-builder:
PASS / FAIL

$jmeter-plan-builder -> $perf-plan-reviewer:
PASS / FAIL

REAL EXECUTION -> $jtl-performance-analyzer:
PASS / FAIL

$jtl-performance-analyzer -> $hw05-performance-workflow:
PASS / FAIL

No Fake Evidence:
PASS / FAIL

AI Audit:
PASS / NOT_REQUIRED / BLOCKED

Nếu tất cả critical tests PASS:

REPAIR_STATUS: COMPLETE
HW05_SKILL_SUITE_STATUS: READY_FOR_CONTROLLED_INTEGRATION_TEST
READY_FOR_NEXT_ACTION: YES

Nếu còn critical blocker:

REPAIR_STATUS: BLOCKED
HW05_SKILL_SUITE_STATUS: NOT_READY
BLOCKER:
<exact issue>

KHÔNG COMMIT.
KHÔNG PUSH.
KHÔNG CHỜ HUMAN REVIEW CHO IMPLEMENTATION.