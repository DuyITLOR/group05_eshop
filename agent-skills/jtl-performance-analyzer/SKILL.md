---
name: jtl-performance-analyzer
description: Phân tích JMeter JTL từ real execution bằng tiếng Việt, dùng parser deterministic để tạo metric evidence, phân tích Load/Stress/Spike/Endurance và kiểm tra AI misinterpretation. Dùng sau khi có raw `.jtl` thật; không dùng để chạy JMeter, tạo JTL, sửa raw evidence hoặc tự phê duyệt kết luận hiệu năng.
---

# jtl-performance-analyzer

Phân tích hiệu năng theo chuỗi bắt buộc:

```text
RAW JTL -> METRIC CALCULATION -> EVIDENCE -> AI INTERPRETATION -> STUDENT REVIEW
```

Chỉ dùng raw JTL từ **REAL EXECUTION** cho runtime. Không tạo/sửa JTL, không chạy JMeter, không tạo HTML report/screenshot/CPU-RAM evidence giả và không kết luận performance PASS/FAIL. Synthetic fixture chỉ dùng test build, phải `TEST-ONLY` và được xóa sau validation.

## Input contract và status

Input tối thiểu: đường dẫn raw `.jtl`. Khuyến nghị thêm: `Scenario` (`LOAD`, `STRESS`, `SPIKE`, `ENDURANCE`), endpoint/workflow, group, approved design, execution start/end, stage timeline, HTML report/resource log thực, và AI analysis cần verify.

| Điều kiện | Status |
|---|---|
| Raw JTL không tồn tại | `BLOCKED`, `RAW_JTL_NOT_FOUND` |
| JTL rỗng, không parse được, zero sample hoặc thiếu elapsed/response-time | `BLOCKED` với reason parser trả về |
| Timestamp/success/stage context thiếu nhưng core latency còn tính được | `PARTIAL` hoặc `NEEDS_CLARIFICATION`; metric không đủ ghi `NOT_COMPUTABLE` |
| Core metrics có evidence | `COMPLETE` |

Không thay raw input bằng synthetic data khi runtime bị block.

## Source of truth và evidence

Thứ tự ưu tiên: raw `.jtl` -> execution metadata thực -> approved design -> reviewed JMX -> API/source để giải thích error -> resource evidence riêng -> AI interpretation.

AI interpretation không phải source of truth cho metric. Mỗi conclusion quan trọng phải được phân loại:

- **FACT**: raw field/artifact tồn tại.
- **DERIVED_METRIC**: script deterministic đã tính từ raw JTL.
- **INFERENCE**: diễn giải dựa trên evidence, ví dụ candidate degradation region.
- **RECOMMENDATION**: threshold/next action do AI đề xuất, yêu cầu Student Review.

Không suy ra CPU/RAM, database bottleneck, hardware limit, application success hoặc success criterion nếu evidence không hỗ trợ.

## Parser deterministic bắt buộc

Dùng [analyze_jtl.py](scripts/analyze_jtl.py), Python standard library, để parse streaming CSV/XML JTL. Không tự tính percentiles bằng LLM reasoning hoặc copy toàn bộ JTL lớn vào context.

```powershell
python agent-skills/jtl-performance-analyzer/scripts/analyze_jtl.py <raw.jtl> `
  --output docs/performance-analysis/<scenario>-metrics.json `
  --window-seconds 60
```

Tùy chọn stage map là JSON array riêng với timestamp epoch milliseconds thực:

```json
[
  {"name":"Stage 1","start_ms":1723410000000,"end_ms":1723410060000}
]
```

```powershell
python agent-skills/jtl-performance-analyzer/scripts/analyze_jtl.py <raw.jtl> `
  --stage-map <stage-map.json> `
  --output docs/performance-analysis/<scenario>-metrics.json
```

Script nhận CSV có header JMeter chuẩn hoặc XML JTL (`sample`/`httpSample`), đọc `elapsed`/`t` theo milliseconds, `timeStamp`/`ts`, `success`/`s`, label, response code và error message khi có. Script không ghi raw JTL; report SHA-256 trước/sau (`raw_unchanged`) để traceability.

### Method metric cố định

- Total samples: tất cả sample parse được.
- Success/failure/error rate: chỉ tính khi `success` xác định được cho **mọi** sample; field thiếu/không parse được -> `NOT_COMPUTABLE`.
- Response time: `elapsed` (CSV) hoặc `t` (XML), đơn vị `ms`.
- Min/max/mean/median p50/p90/p95/p99: dùng **nearest-rank**, `rank = ceil(p / 100 * n)`, one-based, không interpolation.
- Throughput/RPS: `total samples / (max timestamp - min timestamp in seconds)`; timestamp thiếu, chỉ một mốc hoặc duration `0` -> `NOT_COMPUTABLE`.
- Per-label, error response code/error type, time window và stage (khi mapping được cung cấp) tính bằng cùng method.
- Filtering/warm-up mặc định `none`; không tự loại outlier hay 30 giây đầu. Post-warm-up chỉ là supplemental view khi approved design định nghĩa filter rõ và report phải giữ `FULL_RUN_METRICS`.

Nếu HTML JMeter report khác metric script, ghi `PERCENTILE_METHOD_DIFFERENCE` hoặc scope/filter difference cần investigation; không tự coi bên nào sai.

## Raw integrity, privacy và JTL lớn

Raw JTL là immutable evidence. Không xóa row, reorder/normalize rồi overwrite, sửa success/elapsed/timestamp hoặc redact raw file. Derived JSON/Markdown là artifact mới; không thay thế raw evidence.

Không copy token, credential, email hay request payload không cần thiết vào report. Dẫn source bằng path, label, time window, count/hash; redact chỉ trong derived report khi cần share. Parser stream JTL và chỉ giữ aggregate/response-time values cần cho exact percentile, không đưa raw hàng trăm nghìn rows vào LLM context.

## Phân tích scenario

### `LOAD`

Từ evidence table phân tích throughput, error rate, mean, p95, p99, latency/error trend theo time window và sự ổn định tải duy trì. `Error Rate = 0%` không đủ để nói system tốt nếu tail latency suy giảm. Không đặt threshold không có approved requirement/baseline.

### `STRESS`

Chỉ map timestamp sang stage khi approved design/execution metadata có timeline thực và stage map khớp run. Nếu không, ghi `STAGE_MAPPING: UNVERIFIED`.

Với mỗi stage, report samples, error rate, throughput, mean, p95, p99. Candidate breakpoint cần nhiều tín hiệu như p95/p99 jump, error growth, throughput flattening/decline hoặc timeout/5xx growth. Kết luận là `CANDIDATE_BREAKPOINT`/`INFERENCE`, không phải `ABSOLUTE_SYSTEM_LIMIT`.

### `SPIKE`

Chỉ tạo `PRE_SPIKE`, `SPIKE`, `POST_SPIKE/RECOVERY` khi phase timeline có evidence. So sánh throughput/error rate/p95/p99 giữa phase. Không có mapping rõ -> `SPIKE_PHASE_MAPPING: NEEDS_CLARIFICATION`.

`RECOVERY_OBSERVED` chỉ dùng khi post-spike có evidence gần baseline theo tolerance đã định nghĩa. Không nói `FULLY_RECOVERED` nếu tolerance không có.

### `ENDURANCE`

Chia time window phù hợp duration (không hard-code 1 phút), xem throughput/p95/p99/error-rate drift và failure growth theo thời gian. Có thể nói `APPLICATION-SIDE STABILITY OBSERVED AT X RPS` khi JTL hỗ trợ; không kết luận hardware maximum nếu không có resource evidence/duration/context phù hợp.

## Error, assertion và issue candidates

Tạo breakdown theo response code và error message khi JTL chứa fields đó. Không coi HTTP `200` là application success nếu assertion/business evidence không chứng minh; standard JTL thường chỉ đủ `transport/assertion` success, nên application semantics có thể `NOT_AVAILABLE`.

Có thể flag:

- `PERFORMANCE_ISSUE_CANDIDATE`: error-rate growth, tail-latency degradation, throughput collapse, timeout surge hoặc recovery không quan sát được.
- `FUNCTIONAL_ISSUE_CANDIDATE`: 5xx, unexpected auth error, assertion/business regression.

Mỗi candidate phải nêu alternatives: test-data, auth expiry, expected lockout hoặc plan defect. Không tạo GitHub issue hay gọi product bug trước Human Triage.

CPU/Memory khi không có resource log luôn ghi:

```text
CPU: NOT_AVAILABLE
Memory: NOT_AVAILABLE
Hardware Resource Conclusion: NOT_SUPPORTED_BY_CURRENT_EVIDENCE
```

## Misinterpretation hunt

Khi có AI analysis bên ngoài, preserve original output. Extract claim measurable rồi đối chiếu with derived metrics; không overwrite/paraphrase source AI output.

| Type | Khi nào dùng |
|---|---|
| `METRIC_VALUE_ERROR` | Numeric value khác metric thực. |
| `METRIC_TYPE_CONFUSION` | Mean bị gọi p95, v.v. |
| `PERCENTILE_CONFUSION` | Nhầm p90/p95/p99. |
| `THROUGHPUT_CONFUSION` | Nhầm sample count với RPS. |
| `ERROR_RATE_CONFUSION` | Sai denominator/success field. |
| `UNIT_ERROR` | Nhầm ms và seconds. |
| `GLOBAL_VS_LABEL_CONFUSION` | Global metric gán cho endpoint/label. |
| `STAGE_CONFUSION` | Metric stage này gán stage khác. |
| `UNSUPPORTED_CAUSAL_CLAIM` | Kết luận root cause không có evidence. |
| `UNSUPPORTED_HARDWARE_CLAIM` | Nói CPU/RAM không có resource log. |
| `THRESHOLD_AS_REQUIREMENT` | AI recommendation bị gọi system requirement. |

Tạo Claim Verification table:

| Claim ID | AI Claim | Type | Actual Evidence | Verdict | Correct Value |
|---|---|---|---|---|---|

Verdict là `SUPPORTED`, `PARTIALLY_SUPPORTED`, `MISINTERPRETED`, `UNSUPPORTED` hoặc `NOT_VERIFIABLE`. Không có error thực -> `Misinterpretations Found: 0` là hợp lệ. Self-check của skill không thay Student Human Review.

## Output artifacts

Ưu tiên convention repository. Khi chưa có, tạo trong `docs/performance-analysis/`:

```text
<scenario>-metrics.json
<scenario>-metrics.md
<scenario>-ai-analysis.md
```

`metrics.json` là output trực tiếp của parser. Markdown không được tính lại số bằng LLM; chuyển chính xác từ JSON.

### Metrics report

```markdown
# Chỉ số hiệu năng (Performance Metrics)

## Nguồn
- JTL:
- SHA-256 trước/sau:
- Raw unchanged:
- Scenario / Endpoint / Group:
- Samples / Time range:

## Overall Metrics
| Metric | Value |
|---|---:|
| Samples | |
| Success / Failed / Error Rate | |
| Min / Max / Mean | |
| Median / p50_nearest_rank / p90 / p95 / p99 | |
| Throughput | |

## Errors
Response code/error-type breakdown từ raw JTL.

## Per-label Metrics
...

## Time-window / Stage Metrics
... hoặc `NOT_COMPUTABLE` / `UNVERIFIED`.

## Calculation Notes
- Percentile method:
- Unit:
- Filtering / warm-up:
- Limitations:
```

### AI analysis report

```markdown
# AI Performance Analysis

## 1. Metadata
- Scenario / Endpoint / JTL:
- Analysis Status:

## 2. Evidence Summary
FACT và DERIVED_METRIC từ metrics artifact.

## 3. AI Interpretation
INFERENCE có source metric/time window/stage rõ ràng.

## 4. Proposed Thresholds
AI_RECOMMENDATION, basis, confidence và `Student Review: REQUIRED`.

## 5. Claim Verification
...

## 6. Misinterpretation Findings
M-001: Type, claim, correct value, raw evidence, impact, `Status: OPEN`.

## 7. Unsupported Claims / Issue Candidates
...

## 8. Limitations
Resource/stage/application semantics unavailable.

## 9. Human Review
Student Decision: `NOT_REVIEWED`

Student Corrections: `PENDING`
```

Numeric performance threshold chỉ là `AI_RECOMMENDATION`, never requirement, cần basis evidence/confidence. Khi baseline không đủ, không đề xuất numeric threshold hoặc ghi confidence `LOW`.

## Runtime checkpoint và audit

Sau metric/analysis artifact, dùng `$log-ai-audit` nếu tồn tại; preserve exact prompt/output/timestamp/input/generated artifact theo contract audit. Audit thiếu Student Information phải report status audit, không bịa entry.

Kết thúc runtime bằng:

```text
CHECKPOINT: AI_PERFORMANCE_ANALYSIS_REVIEW_REQUIRED

Human Review Required For:
- metric interpretation;
- proposed thresholds;
- misinterpretation findings;
- issue candidates;
- unsupported claims.

Student must choose:
APPROVED, MODIFIED_AND_APPROVED, or REJECTED.
```

## Integration và static build validation

Integration chain bắt buộc:

```text
$perf-scenario-designer -> scenario/workload context
$jmeter-plan-builder -> JMX/CSV metadata
$perf-plan-reviewer -> reviewed plan/status
REAL EXECUTION -> raw JTL -> $jtl-performance-analyzer
```

Contract mismatch ghi `INTEGRATION_STATUS: FAIL`, không rewrite skill upstream. Skill này không bypass real execution bằng cách tạo JTL.

Build smoke test dùng **temporary TEST-ONLY fixtures** với script, rồi xác minh hash raw before/after và cleanup. Test:

1. 100 successful samples, response times known: count/min/max/mean/median/p90/p95/p99 deterministic, error `0%`.
2. 95 success/5 failure: error rate `5%`, không phải `95%`.
3. `1000 ms` chuyển đúng `1.000 s` nếu trình bày seconds.
4. Mean `320 ms`, p95 `680 ms`, mock claim `p95=320`: `METRIC_TYPE_CONFUSION`.
5. Timestamp/sample known: throughput/RPS deterministic, không nhầm sample count.
6. JTL-only claim CPU `95%`: `UNSUPPORTED_HARDWARE_CLAIM`, CPU `NOT_AVAILABLE`.
7. Synthetic stage/phase map: Stress candidate degradation is inference; Spike reports separate phases.
8. Claims đúng: `Misinterpretations Found: 0`.
9. Invalid JTL lacking elapsed: `BLOCKED`/no invented metric.
10. Raw fixture hash unchanged; no production JTL/JMeter/HTML/metric evidence.

`NO_FAKE_EVIDENCE_CHECK: PASS` chỉ khi fixtures marked TEST-ONLY, cleaned, và không có raw execution artifact fabricated.

## Contract sửa chữa ưu tiên

Phần này thay thế mọi câu trước đó mâu thuẫn. Áp dụng role-based authority: raw JTL/execution metadata cho observed metrics; approved design cho intended config; source/runtime config cho current behavior; API specification cho documented contract; HW05 Requirements cho assignment compliance; AI chỉ interpretation. Source/spec khác nhau phải ghi `IMPLEMENTATION_SPEC_CONFLICT`; design/current/documented behavior khác nhau phải ghi `IMPLEMENTATION_CONFLICT` với Impact và Required Resolution, không silently chọn bên nào.

Parser report `median` statistical (even `n` là mean hai middle values) tách với `p50_nearest_rank`; p50/p90/p95/p99 dùng nearest-rank `ceil(p/100*n)`, no interpolation. Success missing ở bất kỳ sample làm `successful_samples`, `failed_samples`, `error_rate_percent` thành `NOT_COMPUTABLE`, đồng thời giữ `observed_successful_samples`/`observed_failed_samples`. Elapsed invalid tạo `response_time_coverage_percent` và `PARTIAL`; zero elapsed valid là `BLOCKED`.

Overall throughput dùng full run duration. Window primary label tương đối (`0-60s`), full window dùng configured duration và final partial dùng observed run intersection. Stage throughput luôn `stage samples / ((end_ms-start_ms)/1000)`. Stage map sort deterministic, reject `DUPLICATE_STAGE_NAME`/`STAGE_MAP_OVERLAP`, và report timestamped/mapped/unmapped/coverage/status; coverage partial là limitation cho inference.

Thêm `## Optimization Recommendations` vào AI report sau Misinterpretation Findings. Mỗi `O-001` gồm AI Recommendation, Observed Evidence, Relevant Source/Config Evidence, Technology Applicability (`SUPPORTED`/`NOT_SUPPORTED`/`NOT_VERIFIED`), Classification (`FEASIBLE`/`HALLUCINATED`/`NEEDS_MORE_EVIDENCE`), Reason, Expected Benefit, `Benefit Proven: YES/NO`, Confidence, Student Decision. `FEASIBLE` không chứng minh root cause/benefit; PostgreSQL tuning cho SQLite-only SUT là `HALLUCINATED`. Human Review checkpoint phải bao gồm optimization và classification này.
