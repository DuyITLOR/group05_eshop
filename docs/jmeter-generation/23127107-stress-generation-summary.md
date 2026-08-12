# Tóm tắt tạo JMeter Plan (JMeter Plan Generation Summary)

## 1. Input Design

- Design file: `docs/performance-design/stress-apply-coupon-design.md`
- Approval status: `MODIFIED_AND_APPROVED`
- Human Review Scope: `CONTROLLED_INTEGRATION_TEST`
- Final HW05 Transactional Endpoint: `NOT_YET_APPROVED`
- Endpoint / Group / Scenario: `POST /api/apply-coupon` / `TRANSACTIONAL` / `STRESS`
- Student ID / Execution Date: `23127107` / `2026-08-12`

## 2. Artifacts đã tạo

- JMX: `test-plans/23127107_Stress_20260812.jmx`
- CSV: `test-data/transactional.csv`
- CSV Status: `TEMPLATE_ONLY`
- CSV chỉ có header; không có production row do chưa có Student approval cho dữ liệu thực thi.

## 3. Mapping workload

- Threads/VUs: target total concurrency `5 -> 10 -> 20 -> 30 -> 5 VUs`; không diễn giải thành số thread mới ở từng stage.
- Ramp-up: bốn ramp tăng `15 giây` và một recovery ramp `15 giây`.
- Duration: `315 giây`.
- Think Time: `1000 ms`.
- JMeter Timer Mapping: `Constant Timer`, Delay `1000 ms`, enabled trong scope Ultimate Thread Group; `PASS`.

### Ultimate Thread Group cohort schedule

| Cohort | Threads | Initial Delay | Startup | Hold | Shutdown | Kết thúc |
|---|---:|---:|---:|---:|---:|---:|
| A | 5 | 0s | 15s | 300s | 0s | 315s |
| B | 5 | 60s | 15s | 165s | 15s | 255s |
| C | 10 | 120s | 15s | 105s | 15s | 255s |
| D | 10 | 180s | 15s | 45s | 15s | 255s |

Mapping aggregate:

| Khoảng thời gian | Target total concurrency |
|---|---|
| 0-15s | `0 -> 5` |
| 15-60s | `5` |
| 60-75s | `5 -> 10` |
| 75-120s | `10` |
| 120-135s | `10 -> 20` |
| 135-180s | `20` |
| 180-195s | `20 -> 30` |
| 195-240s | `30` |
| 240-255s | `30 -> 5` |
| 255-315s | `5` |

- `WORKLOAD_MAPPING: PASS`. Mỗi cohort kết thúc tại `Initial Delay + Startup + Hold + Shutdown`; B/C/D cùng ramp down trong 240-255s, A duy trì 5 VUs tới 315s.
- Đây là `RECOMMENDATION`, không phải claimed capacity của hệ thống hay phần cứng.

## 4. Cấu hình request

- Method / Route: `POST /api/apply-coupon`.
- Base URL: `${baseUrl}` với default có evidence `${__P(baseUrl,http://localhost:3000)}`; có thể override bằng JMeter property.
- Headers: `Content-Type: application/json`; không có `Authorization`.
- Authentication: `CURRENT_IMPLEMENTATION_BEHAVIOR`; current handler không enforce JWT.
- `IMPLEMENTATION_DOCUMENTATION_DISCREPANCY`: README yêu cầu JWT quanh coupon/checkout, nhưng current apply-coupon handler không gắn middleware authentication.
- JSON body:

```json
{
  "code": "${code}",
  "total_amount": ${total_amount},
  "user_id": ${user_id}
}
```

- `total_amount` và `user_id` giữ numeric semantics; `coupon_case` và `iteration_key` không được gửi vào request.
- Boundary discrepancy được giữ lại: source dùng `total_amount > min_order_amount`, README dùng `>=`; primary dataset phải chọn giá trị rõ ràng lớn hơn threshold.

## 5. Assertions

- Response Assertion: HTTP status bằng `200`.
- JSONPath Assertion: `$.success` bằng `true`.
- JSONPath existence Assertions: `$.coupon_id`, `$.discount_amount`, `$.final_amount`, `$.message`.
- Không có exact numeric discount Assertion.
- Không có intentional `400`/`404` flow trong primary sampler.

## 6. Listener

- Listener: `Aggregate Report`.
- Global Listener Uniqueness: `NEEDS_CLARIFICATION`; production LOAD/SPIKE artifacts chưa đủ để kết luận toàn project.

## 7. Kiểm tra dependency

- JMeter: `5.6.3`, path `D:\Tools\apache-jmeter-5.6.3`.
- Student GUI verification: `PASS`; `jp@gc - Ultimate Thread Group` xuất hiện và mở được.
- Plugins Manager: `jmeter-plugins-manager-1.12.jar` (`AVAILABLE`).
- Custom Thread Groups: `jmeter-plugins-casutg-3.1.1.jar` (`INSTALLED`).
- Component: `kg.apc.jmeter.threads.UltimateThreadGroup` và `kg.apc.jmeter.threads.UltimateThreadGroupGui` có trong plugin jar.
- Static schema evidence: class constants xác nhận `ultimatethreadgroupdata` và năm field theo thứ tự Threads, Initial Delay, Startup, Hold, Shutdown.
- `PLUGIN_CHECK: PASS`
- `DEPENDENCY_STATUS: VERIFIED`

## 8. An toàn dữ liệu

- CSV_MODE: `REQUEST_DRIVEN`
- DATA_DRIVEN_FIT: `PASS`
- Primary Dataset: `SUCCESS_PATH_ONLY`
- CSV schema: `code,total_amount,user_id,coupon_case,iteration_key`
- Data status: `NEEDS_DATA_SETUP`
- DATA_RISK: `HIGH` trước execution vì CSV chưa có Student-approved row.
- Current repository evidence có data candidate `code=SAVE10`, `total_amount=500000`, `user_id=1`: API specification dùng đúng request này; current SQLite có active `SAVE10`, user `1`, và không có row trong `coupon_usage` tại thời điểm kiểm tra. Đây chỉ là `DATA_CANDIDATE`, không phải Student-approved production row và không được ghi vào CSV.
- Handler apply-coupon chỉ đọc coupon/usage và không tự consume quota; database state vẫn phải được re-check trước run.

## 9. Tuân thủ HW05

| Check | Status | Evidence |
|---|---|---|
| Filename convention | PASS | `23127107_Stress_20260812.jmx` khớp regex. |
| Separate CSV | PASS | `test-data/transactional.csv` dành riêng cho `TRANSACTIONAL`. |
| Listener unique | NEEDS_CLARIFICATION | `Aggregate Report`; thiếu production LOAD/SPIKE evidence. |
| Data-driven request | PASS | `${code}`, `${total_amount}`, `${user_id}` drive JSON body. |
| Assertions implemented | PASS | HTTP 200, business success và required field existence. |
| Design parameters preserved | PASS | Exact target profile, 315s, Constant Timer 1000ms. |

## 10. Execution readiness

`NOT_READY`

Reasons:

- CSV là `TEMPLATE_ONLY`, chưa có Student-approved success-path row.
- Chưa có hardware baseline/SLA.
- Plan chỉ được static review; JMeter workload chưa được chạy.

## 11. Human Review

Status: `PENDING`

Student Decision: `NOT_REVIEWED`

CHECKPOINT: JMETER_PLAN_REVIEW_REQUIRED

Execution: `NOT_STARTED`
