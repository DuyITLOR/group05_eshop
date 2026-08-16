# Task 3 — Continuous Performance Testing Proposal

## 1. Xác minh yêu cầu Task 3 (Task 3 Requirement Verification)

`TASK3_REQUIREMENT_VERIFICATION: PARTIAL`

Repository hiện không chứa đề HW05, rubric, hay tài liệu CI/CD độc lập nêu rõ deliverable bắt buộc của Task 3. Nguồn có thể kiểm tra trực tiếp gồm workflow nội bộ, các artifact Task 1/2 đã hoàn thành, `README.md` và cấu hình repository; workflow chỉ liệt kê `Task 3` như một hạng mục submission, không yêu cầu CI YAML hay scheduled execution.

Yêu cầu hiện tại cung cấp phạm vi `PROPOSAL / DESIGN` và cấm implementation khi chưa có yêu cầu authoritative. Vì vậy deliverable khả dụng được xác định là:

`TASK3_REQUIRED_DELIVERABLE: PROPOSAL_ONLY — docs/performance-analysis/task3-continuous-performance-testing-proposal.md`

Giới hạn: nếu đề HW05/rubric authoritative xuất hiện sau này và yêu cầu CI configuration, scheduled execution hoặc threshold enforcement, Student phải review lại proposal trước khi tạo implementation. Tài liệu này không suy ra yêu cầu đó từ workflow nội bộ.

## 2. Mục tiêu

Continuous Performance Testing nhằm phát hiện sớm thay đổi bất lợi về latency/error trên các luồng đã được đo, giữ baseline và evidence có thể đối chiếu, đồng thời tránh chạy workload đắt tiền cho mọi thay đổi nhỏ. Nó không bảo đảm performance production, không chứng minh capacity, SLA, business correctness hoặc root cause.

Mục tiêu vận hành là:

- tái dùng đúng ba production scenario đã hoàn thành với identity rõ ràng;
- chạy tier nhẹ khi thay đổi có liên quan, còn workload đầy đủ theo cadence hợp lý;
- giữ raw JTL, cấu hình và bối cảnh runtime để một kết quả có thể review lại;
- phân loại failure trước khi gọi đó là performance regression;
- giữ Human Review cho ngưỡng, root cause, optimization và issue chính thức.

## 3. Tài sản hiệu năng HW05 hiện có (Existing HW05 Performance Assets)

| Nhóm / Scenario          | Endpoint                  | Approved JMX                              | Successful run | Primary Listener      | CSV                                         |
| ------------------------ | ------------------------- | ----------------------------------------- | -------------- | --------------------- | ------------------------------------------- |
| `READ_HEAVY / LOAD`      | `GET /api/orders/:id`     | `test-plans/23127107_Load_20260812.jmx`   | `run-002`      | `Summary Report`      | `test-data/read-heavy-orders.csv`           |
| `AUTH_HEAVY / SPIKE`     | `GET /api/users/me`       | `test-plans/23127107_Spike_20260816.jmx`  | `run-003`      | `Response Time Graph` | `test-data/auth-heavy-users-me.csv`         |
| `TRANSACTIONAL / STRESS` | `POST /api/admin/coupons` | `test-plans/23127107_Stress_20260816.jmx` | `run-001`      | `Aggregate Report`    | `test-data/transactional-admin-coupons.csv` |

Supporting Endurance dùng `GET /api/orders/:id`, profile `60s ramp-up + 600s soak + 60s ramp-down`, và phải luôn được gắn nhãn `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT`. Nó không phải scenario production thứ tư và không được gộp vào final set ba JMX/JTL/HTML.

Các JMX và CSV trên là approved artifacts. Proposal không sửa chúng và không tạo CI profile mới. Mọi profile rút gọn được đề cập dưới đây chỉ là `CI_SUPPORTING_PROFILE` ở mức khái niệm, cần một Human decision riêng trước khi tồn tại thành file.

## 4. Chiến lược continuous testing

Áp dụng ba tier theo chi phí và rủi ro thay đổi. Chạy tuần tự trong isolated runtime để tránh các scenario chia sẻ database state hoặc tài nguyên máy chạy. Tier nhanh chỉ là tín hiệu sớm; tier scheduled và full validation mới dùng production workload khi thay đổi/cadence biện minh được.

1. `FAST_PERFORMANCE_CHECK`: xác nhận nhanh endpoint path, assertion, timer/preflight và evidence pipeline không bị hỏng sau thay đổi backend liên quan.
2. `WEEKLY_SCHEDULED_VALIDATION`: chạy lại ba production scenario theo lịch tuần trên runtime deterministic để phát hiện trend/candidate regression; có thể kích hoạt thủ công khi cần.
3. `FULL_PERFORMANCE_VALIDATION`: chạy ba JMX production đã approved khi release candidate, thay đổi backend/database/auth đáng kể, hoặc Student kích hoạt thủ công.

Không tier nào được diễn giải như production capacity proof.

## 5. Test tiers

| Tier                          | Trigger                                                                                                        | Scenario / profile                                                       | Expected runtime                                                                                                | Mục đích                                                       | Artifacts                                                             | Failure / warning policy                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `FAST_PERFORMANCE_CHECK`      | PR có backend endpoint, auth, database hoặc performance tooling liên quan; merge vào main                      | Representative `SUPPORTING_CI_PROFILE`, không phải JMX production bị sửa | Mục tiêu dưới 5 phút gồm setup/preflight; thời lượng workload phải được phê duyệt riêng                         | Early regression signal, không đo capacity                     | JTL nếu chạy, concise metadata, JMeter log, preflight và summary      | `NON_BLOCKING` ban đầu; integrity/functional/preflight failure được report rõ, guardrail deviation là `WARNING`                               |
| `WEEKLY_SCHEDULED_VALIDATION` | Weekly schedule hoặc manual scheduled validation                                                               | Ba approved production JMX: LOAD, SPIKE, STRESS, chạy tuần tự            | Planned workload tổng khoảng 333 giây; thời gian job thực tế gồm seed/report/upload phải được metadata ghi nhận | So sánh với baseline tương đương và giữ trend evidence         | Raw JTL, HTML, resource files, metadata, JMeter logs, analyzer output | `FAIL` cho evidence/preflight/tooling/functional failure; p95/error guardrail vượt là `PERFORMANCE_REGRESSION_CANDIDATE`/`WARNING` chờ review |
| `FULL_PERFORMANCE_VALIDATION` | Release candidate, major backend change, database/schema change, authentication change, hoặc manual validation | Ba approved production JMX với CSV/Think Time/concurrency giữ nguyên     | Cùng profile approved, cộng setup/cleanup/report; không ước lượng thành SLA                                     | Tạo benchmark/release evidence có review và baseline candidate | Full artifact bundle cùng config identity, commit, branch, timestamp  | Không promote kết quả thành release conclusion tự động; issue/release decision cần Human Review                                               |

`HARD_FAILURE_THRESHOLD` trong proposal này chỉ áp dụng cho điều kiện validity: preflight fail, secret absent, isolated runtime/seed fail, JTL không parse được, assertion/functional failure được xác minh, evidence thiếu hoặc configuration identity không khớp. Đây không phải latency SLA.

`WARNING_THRESHOLD` áp dụng cho p95/error guardrail Task 2 trên một run comparable. Warning tạo triage và có thể yêu cầu rerun xác minh; chưa tự động là `PERFORMANCE_REGRESSION` hay block release. Student có thể thay đổi policy sau Human Review, nhưng không được đổi threshold ngầm trong pipeline.

### Traceability — Student Human Review quyết định

| Nội dung                | Original AI Proposal                                          | Student Decision | Final Proposal                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fast tier               | `CI_SUPPORTING_PROFILE` và fast check theo thay đổi liên quan | `MODIFY`         | `SUPPORTING_CI_PROFILE` riêng, chỉ backend-relevant, workload ngắn, `NON_BLOCKING` ban đầu                                                                                      |
| Scheduled tier          | Nightly ba scenario production                                | `MODIFY`         | `WEEKLY_SCHEDULED_VALIDATION` tuần tự `LOAD -> SPIKE -> STRESS`; manual scheduled validation được phép                                                                          |
| Full validation         | Release/major backend, database, auth hoặc manual             | `APPROVE`        | Giữ nguyên; không chạy full STRESS mỗi commit                                                                                                                                   |
| Endurance               | Weekly, pre-release hoặc manual                               | `MODIFY`         | Pre-release/manual, optional weekly khi runner time cho phép                                                                                                                    |
| Threshold policy        | Integrity fail là hard fail; performance guardrail là warning | `MODIFY`         | `WARNING_THRESHOLD` cho percentile/resource drift; `HARD_FAILURE_THRESHOLD` chỉ cho functional failure hoặc guardrail violation đã được Student approve sau valid comparability |
| Regression/issue policy | Candidate -> triage -> Human Review                           | `MODIFY`         | Bắt buộc integrity, comparability và repeat/verify trước Human confirmation                                                                                                     |

## 6. Ma trận trigger (Trigger Matrix)

| Trigger                                            | Performance tier                                                                    | Scenario                                                    | Lý do                                                   | Expected cost  | Blocking / Non-blocking                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- | -------------- | ------------------------------------------------------------------------ |
| PR chỉ chạm frontend                               | `NONE`                                                                              | None                                                        | Không có bằng chứng endpoint/runtime hiệu năng thay đổi | Thấp           | `NON_BLOCKING`                                                           |
| PR chạm backend endpoint                           | `FAST_PERFORMANCE_CHECK`                                                            | Representative supporting profile của endpoint bị ảnh hưởng | Early regression signal                                 | Thấp           | `NON_BLOCKING` ban đầu                                                   |
| PR chạm database/schema                            | `FAST_PERFORMANCE_CHECK` + full validation khi performance-sensitive/before release | Supporting profile + data setup validation                  | Schema/seed có thể làm baseline không comparable        | Thấp trong PR  | Fast `NON_BLOCKING`; full validation required theo trigger               |
| PR chạm auth/secret middleware                     | `FAST_PERFORMANCE_CHECK` + full validation trước release/khi scenario liên quan     | AUTH supporting profile và auth preflight                   | Bảo vệ token boundary/fail-closed behavior              | Thấp           | `NON_BLOCKING` ban đầu                                                   |
| Merge vào main                                     | `FAST_PERFORMANCE_CHECK`                                                            | Supporting profile theo backend impact                      | Tín hiệu sớm, không thay full validation                | Thấp           | `NON_BLOCKING` ban đầu                                                   |
| Weekly schedule                                    | `WEEKLY_SCHEDULED_VALIDATION`                                                       | LOAD + SPIKE + STRESS approved profiles                     | Trend/regression evidence phù hợp coursework cost       | Trung bình     | `NON_BLOCKING` / reporting; evidence failure `FAIL`, guardrail `WARNING` |
| Release candidate / major backend, DB, auth change | `FULL_PERFORMANCE_VALIDATION`                                                       | Ba approved production JMX                                  | So sánh release candidate với baseline comparable       | Trung bình     | Human review required trước kết luận release                             |
| Manual performance validation                      | `FULL_PERFORMANCE_VALIDATION`; Endurance khi có lý do                               | Ba production JMX; Endurance tách riêng                     | Điều tra/release readiness đã được Human authorize      | Trung bình/cao | Theo Human-approved run policy                                           |

## 7. Cô lập môi trường (Environment Isolation)

Mọi traffic mutating, đặc biệt STRESS, phải duy trì `DISPOSABLE_BACKEND_RUNTIME_COPY`. Continuous job không được dùng trực tiếp `backend/database.sqlite`.

Pipeline tương lai phải:

1. tạo runtime/backend copy và disposable database mới;
2. seed deterministic state đúng identity của scenario;
3. ghi source DB hash trước, trong preflight và sau cleanup khi applicable;
4. khởi động backend riêng, xác định backend PID và kiểm tra health/preflight;
5. ngăn concurrent mutating order/coupon workflow trong cùng runtime;
6. xóa temporary runtime, database copy và property sau upload evidence.

Nếu setup, seed, cleanup, source-integrity hoặc preflight fail, result là `ENVIRONMENT_FAILURE` hoặc `DATA_STATE_FAILURE`; không chạy JMeter và không tạo performance conclusion.

## 8. Dữ liệu kiểm thử và secrets (Test Data and Secrets)

### Dữ liệu deterministic

CSV version-controlled được tái dùng theo đúng scenario:

- `test-data/read-heavy-orders.csv` cho `GET /api/orders/:id`;
- `test-data/auth-heavy-users-me.csv` cho `GET /api/users/me`;
- `test-data/transactional-admin-coupons.csv` cho `POST /api/admin/coupons`.

CSV hash, schema, number of rows, seed identity và JMX hash phải nằm trong execution metadata. Điều này cho phép từ chối so sánh khi workload/data thay đổi thay vì diễn giải chênh lệch là regression.

STRESS phải giữ uniqueness strategy đã approved: `external run tag + thread + iteration`. Không tái dùng coupon code theo cách làm hỏng success path hoặc làm CSV-only values trở thành data contamination. Mỗi runtime mới vẫn cần seed/reset và preflight cho data state.

### Secret strategy

Chuỗi secret hợp lệ theo proposal là:

`CI secret -> temporary runtime property -> JMeter external property`

JWT, password và `Authorization` header chứa secret không được nằm trong JMX, CSV, raw JTL, log công khai hay repository. Property thiếu/rỗng phải fail closed trước workload. Log/upload cần redaction hoặc allowlist để không lưu response body/command line mang secret.

## 9. Resource Monitoring

Mỗi scheduled/full job cần lưu tối thiểu: backend PID, timestamp CPU, RSS/memory, `resource-monitor.csv`, resource summary, hardware/runtime context, JMeter log và execution metadata. Monitor bắt đầu trước JMeter, bao phủ workload/recovery và dừng sau process completion.

Các quan sát CPU/RSS là correlation context. Chúng không tự chứng minh CPU, SQLite hay memory là root cause; mọi causal claim cần evidence bổ sung và Human/engineering review.

## 10. Quản lý baseline (Baseline Management)

Baseline hợp lệ là `latest Student-approved successful benchmark` cho cùng scenario hoặc explicit `release baseline` đã được Student chọn. Mỗi baseline phải lưu:

- endpoint, group, scenario và run identity;
- JMX SHA-256, CSV SHA-256, Think Time, concurrency/stage profile;
- source revision/commit SHA, branch, timestamp;
- JMeter/runtime/hardware context, seed/data identity và analyzer version;
- raw JTL hash cùng các artifact evidence liên quan.

Chỉ so sánh p95/error của current run với baseline khi endpoint, scenario, JMX/workload, CSV/data, environment, runtime config, Think Time và concurrency profile đủ tương đương. Nếu một điều kiện không đạt, job phải trả `NON_COMPARABLE_RUN`, preserve artifacts và yêu cầu Human review thay vì trả `PERFORMANCE_REGRESSION`.

## 11. Guardrail regression (Threshold / Regression Guardrails)

Task 2 đã Student-review ba ngưỡng sau. Trong Task 3, chúng chỉ được gắn nhãn `COURSEWORK_REGRESSION_GUARDRAIL`, không phải official SLA, production SLA, capacity target hay instructor requirement.

| Scenario | p95 guardrail | Error-rate guardrail | Điều kiện áp dụng                                                    |
| -------- | ------------: | -------------------: | -------------------------------------------------------------------- |
| `LOAD`   |     `<= 5 ms` |            `<= 0.5%` | Cùng LOAD JMX/window profile, CSV, timer và environment comparable   |
| `SPIKE`  |     `<= 6 ms` |            `<= 0.5%` | Cùng SPIKE stage mapping/profile; phải giữ limitation stage coverage |
| `STRESS` |    `<= 16 ms` |            `<= 0.5%` | Cùng STRESS stage/data-state; giữ `STATE_GROWTH_CONFOUND`            |

Pipeline không dùng một extreme `max` sample làm failure. Nó ưu tiên error rate và p95; p99/resource stability là triage context, không có ngưỡng mới được bịa. Atypical run cần stable runner, hardware class nhất quán, warm-up khi profile yêu cầu, workload nền tối thiểu, metadata đầy đủ và có thể rerun xác minh trước khi upgrade classification.

## 12. Lưu giữ artifacts (Artifact Retention)

Với run tạo workload, CI artifact storage (không phải Git) nên lưu raw JTL immutable, HTML dashboard, execution metadata, `resource-monitor.csv`, resource summary, hardware/runtime context, JMeter logs, analyzer output, JMX/CSV identity hashes, commit SHA, branch và timestamp. Retention period phụ thuộc CI quota/course policy và phải được cấu hình rõ khi implementation được approve.

Repository chỉ nên giữ approved, curated artifacts theo workflow HW05; không commit generated CI artifacts của mọi run. Evidence thiếu làm result là `EVIDENCE_FAILURE`, không phải performance pass.

## 13. Phân loại failure và triage

1. Kiểm tra configuration identity, secret/preflight, seed, disposable runtime và evidence presence.
2. Nếu request/assertion có lỗi xác minh được, phân loại `FUNCTIONAL_FAILURE`; không gọi performance regression.
3. Nếu CI/runtime/tool khác expected (backend chết, JMeter/plugin/parser/monitor lỗi), phân loại `ENVIRONMENT_FAILURE`, `TEST_TOOLING_FAILURE` hoặc `EVIDENCE_FAILURE`.
4. Nếu CSV/seed/quota/state không đúng, phân loại `DATA_STATE_FAILURE`.
5. Chỉ khi raw JTL valid, baseline comparable và p95/error vượt guardrail mới tạo `PERFORMANCE_REGRESSION_CANDIDATE`.
6. Triage rerun/stable-run, kiểm tra environment metadata và Human Review. Chỉ sau đó mới có thể ghi `PERFORMANCE_REGRESSION`.

## 14. Chính sách tạo performance issue

Formal performance issue chỉ được tạo khi có vi phạm guardrail tái lập được, comparable workload, raw JTL valid/immutable, environment valid, artifacts đủ và Human/engineering review đồng ý. Một slow sample, một environment failure, correlation CPU/RSS, hoặc alternative explanation chưa kiểm tra không đủ để tạo defect.

Known HW05 context được giữ đúng nhóm:

| Context                                                                        | Classification                                           | Boundary                                                                     |
| ------------------------------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `GET /api/users/me` trả full user record/sensitive fields theo source hiện tại | `SECURITY`                                               | Không được chuyển thành latency defect nếu chưa có benchmark proving benefit |
| `POST /api/admin/coupons` thiếu server-side admin role check                   | `SECURITY` / `CORRECTNESS`                               | Không phải measured STRESS latency issue                                     |
| STRESS state growth                                                            | `PERFORMANCE_RISK` / `STATE_GROWTH_CONFOUND: DOCUMENTED` | Là confound cho comparability, không chứng minh bottleneck                   |
| Potential write contention                                                     | `UNVERIFIED_PERFORMANCE_HYPOTHESIS`                      | Không gọi SQLite bottleneck nếu không có evidence trực tiếp                  |

## 15. AI-assisted analysis

AI có thể parse/tóm tắt JTL, phát hiện non-comparability, so sánh metric có traceability, draft triage hoặc performance issue. AI output phải giữ fact/assumption/recommendation tách biệt, liên kết raw artifacts, và không được chứa secrets.

Bài học Task 2 được giữ nguyên: AI có thể over-classify evidence là `DIRECT`. Vì vậy AI không tự tuyên bố root cause, capacity, SLA pass/fail, causal resource attribution hay performance regression cuối cùng.

## 16. Human-in-the-loop governance

Human Review bắt buộc trước khi:

- thay đổi baseline, threshold, workload/profile hoặc retention policy;
- xác nhận `PERFORMANCE_REGRESSION` từ candidate;
- chấp nhận/triển khai optimization recommendation;
- tạo formal performance issue hoặc kết luận release/production readiness;
- tạo bất kỳ `CI_SUPPORTING_PROFILE`, CI YAML, automation script hoặc scheduled execution mới.

AI chỉ có thể đề xuất `PASS`, `WARNING`, `FAIL` ở evidence pipeline theo rule deterministic; mọi kết luận hiệu năng có ảnh hưởng cao vẫn cần Student/engineering decision được ghi lại.

## 17. Chiến lược Endurance

Supporting Endurance có profile `60s + 600s + 60s`, nên không chạy trên mọi PR hay merge. Student đã chọn pre-release validation, manual endurance validation, và optional weekly execution khi runner time cho phép. Lý do là chi phí runtime/evidence cao hơn và nó không thay thế ba production scenario.

Endurance phải tiếp tục dùng isolated disposable runtime, deterministic fixtures, full resource monitor và separate artifact identity. Nó được so sánh với baseline endurance riêng; không được trộn p95/throughput với LOAD/SPIKE/STRESS production matrix.

## 18. Rủi ro và giới hạn

- Không có assignment rubric/CI requirement authoritative trong repository; Task 3 scope hiện là `PARTIAL` verification.
- Local/CI noise, hardware khác nhau, background load và seed state có thể làm metrics không comparable.
- `0%` JTL error không chứng minh business/auth correctness.
- Resource correlation không chứng minh root cause.
- CI artifact retention có giới hạn platform/quota cần được Student quyết định khi implementation được approve.
- No CI platform/config hiện hữu; không được ghi GitHub Actions như existing system.

## 19. Pipeline được đề xuất (Proposed Pipeline)

`PROPOSED_PLATFORM: GitHub Actions`, nhưng chỉ là candidate vì repository không có `.github/workflows/`, GitLab CI hay pipeline configuration hiện hữu. Nếu project chọn platform khác, flow logic vẫn giữ platform-neutral.

```text
Checkout pinned source revision
        |
Install Node/JMeter/plugin dependencies with verified versions
        |
Prepare DISPOSABLE_BACKEND_RUNTIME_COPY and deterministic seed
        |
Inject CI secret into temporary external runtime property
        |
Start backend, verify health and scenario-specific preflight
        |
Start backend PID/CPU/RSS resource monitor
        |
Run selected approved JMX or approved CI_SUPPORTING_PROFILE
        |
Preserve raw JTL and generate HTML only after run completes
        |
Validate JTL/config identity and analyze coursework guardrails
        |
Upload evidence bundle to CI artifact storage
        |
Cleanup temporary property, backend runtime and disposable database
        |
Report PASS / WARNING / FAIL with classification and Human-review link
```

Không step nào ở trên được implement trong interaction này. Nếu requirement authoritative sau đó bắt buộc CI, checkpoint tiếp theo phải là Human approval của proposal/platform/threshold policy trước implementation.

## 20. Human Review

Review Status: `FINALIZED`

Student Decision: `MODIFIED_AND_APPROVED`

Approval Scope: `TASK3_CONTINUOUS_PERFORMANCE_TESTING_PROPOSAL`

Requirement Decision: `MODIFIED_AND_APPROVED`; `PARTIAL` limitation preserved.

Tier Strategy Decision: `MODIFIED_AND_APPROVED`; fast supporting profile, weekly scheduled validation and Endurance cadence are finalized above.

Threshold Strategy Decision: `MODIFIED_AND_APPROVED`; values remain `COURSEWORK_REGRESSION_GUARDRAIL` only.

Issue Policy Decision: `MODIFIED_AND_APPROVED`; repeatable comparable evidence and Human confirmation are required.

AI Governance Decision: `APPROVED`.

Implementation Required: `NO`

Implementation: `NOT_STARTED`

CHECKPOINT: `TASK3_COMPLETE_FINALIZATION_READY`

Next Allowed Action: Dedicated AI Audit for the Task 3 proposal plus Human Review before final bug/performance-finding and report packaging.
