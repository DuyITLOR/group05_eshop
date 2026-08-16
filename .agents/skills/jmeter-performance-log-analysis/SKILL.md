---
name: jmeter-performance-log-analysis
description: Thiết kế, human review, thực thi và phân tích kiểm thử hiệu năng Apache JMeter cho một nhóm API. Dùng khi tạo hoặc sửa test plan .jmx cho Load, Stress, Spike hoặc Endurance; kiểm tra xác thực, correlation, assertion, timer, lịch thread và dữ liệu test; chạy JMeter non-GUI để sinh .jtl và HTML Report; phân tích raw JTL, percentile, throughput, lỗi, từng phase và bằng chứng tài nguyên; hoặc kiểm chứng nhận định do AI tạo bằng log có thể tái tính.
---

# Kiểm thử hiệu năng và phân tích log JMeter

## Mục tiêu

Tạo test plan JMeter có thể tái sử dụng và phân tích dựa trên bằng chứng, không bịa metric. Xem mọi kết quả AI là bản nháp cho đến khi raw `.jtl`, HTML Report, hành vi API và tài nguyên quan sát được xác nhận kết luận đó.

## Đầu vào

Chỉ tìm hoặc yêu cầu những đầu vào cần thiết:

- Đặc tả API, workflow endpoint, quy tắc xác thực và response mong đợi.
- Hướng dẫn chạy backend/frontend và tài khoản test xác định.
- Giới hạn phần cứng và runtime.
- Yêu cầu scenario: lịch VU, thời lượng, think time, loại report và tiêu chí chấp nhận.
- `.jmx`, `.jtl`, HTML Report, backend log và ảnh hiện có khi review một lần chạy.

Không dùng giá trị trong ví dụ làm threshold cho hệ thống khác. Chỉ đọc [references/load-example.md](references/load-example.md) khi cần một ví dụ JMeter cụ thể. Luôn đọc [references/review-checklist.md](references/review-checklist.md) trước khi chốt test plan hoặc kết quả phân tích.

## Quy trình

### 1. Mô hình hóa nhóm endpoint

Xác định một business workflow theo đúng thứ tự phụ thuộc. Ghi cho từng request:

- Method, URL, header, body và status mong đợi.
- Biến đầu vào cần dùng và biến được tạo ra.
- Business assertion chứng minh thành công, không chỉ kiểm tra HTTP `200`.
- Ảnh hưởng của lỗi đến request phía sau.

Dùng extractor cho token và ID. Assert mọi giá trị correlation trước khi dùng. Dùng tài khoản riêng hoặc được cô lập khi cart, order hay lockout có thể gây nhiễu giữa các virtual user.

### 2. Thiết kế scenario

Tạo test plan riêng cho Load, Stress và Spike khi rubric yêu cầu artifact độc lập. Thêm Endurance khi cần tìm ngưỡng phần cứng có thể duy trì.

- **Load:** ramp đến mức đồng thời dự kiến, giữ đủ lâu để quan sát steady state rồi ramp-down.
- **Stress:** tăng tải theo bậc đến khi vi phạm tiêu chí ổn định; ghi bậc lỗi đầu tiên.
- **Spike:** thay đổi tải đột ngột rồi đo mức suy giảm và thời gian phục hồi.
- **Endurance:** duy trì một mức tải đã kiểm chứng và theo dõi latency, lỗi, throughput, CPU cùng xu hướng RAM.

Dùng think time thực tế. Ưu tiên timer ngẫu nhiên để mô phỏng hành vi người dùng; chỉ dùng timer cố định khi chủ ý tạo nhịp đều. Khi test plan hoặc yêu cầu bài tập quy định listener phải luôn bật và hiển thị toàn bộ sample, giữ nguyên cấu hình đó cho lần chạy chính thức.

### 3. Human review test plan

Đối chiếu `.jmx` với đặc tả API và response API thực tế. Kiểm tra:

- Lịch thread, loop, timer, timeout và hành động khi sampler lỗi.
- Đường dẫn CSV trong cả GUI và CLI.
- Xác thực, header, request body, extractor và assertion.
- Cách xử lý lỗi dây chuyền trong workflow phụ thuộc.
- Reset dữ liệu, login lockout, database tăng dần và cô lập tài khoản.
- Transaction Controller cha so với sampler con trong report.

Không sửa cấu hình đang đúng chỉ để tuyên bố AI có lỗi. Ghi rõ mục đã xác minh và giữ nguyên; với lỗi thật, lưu bằng chứng trước/sau khi sửa.

### 4. Thực thi có thể tái tạo

Khởi động backend, reset/seed dữ liệu, health check rồi chạy JMeter non-GUI. Luôn tạo đường dẫn output mới:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "results/run_$stamp.jtl"
$report = "results/run_${stamp}_html"
jmeter -n -t "test-plans/scenario.jmx" -l $jtl -e -o $report
```

Chụp bằng chứng trong phase quan trọng, không chỉ sau khi kết thúc:

- Terminal JMeter hoặc màn hình công cụ.
- PID, CPU và RAM của backend.
- Bằng chứng PID sở hữu cổng backend khi có nhiều tiến trình cùng loại.
- Màn hình hoàn tất có `end of run`.

Giữ raw `.jtl`, toàn bộ thư mục HTML, test plan, metadata môi trường và ảnh. Không ghi nhiều lần chạy vào cùng JTL nếu đề bài không yêu cầu và không có tài liệu giải thích.

### 5. Kiểm tra và phân tích log

Kiểm tra chất lượng dữ liệu trước:

- Xác nhận khoảng timestamp, label, số sample, thread name, success và response code.
- Phát hiện log cũ/log nối thêm và chọn đúng run hoặc phase.
- Tách E2E transaction khỏi request; không cộng sample cha và con như cùng một đơn vị.
- So sánh JTL với `statistics.json` của HTML và giải thích khác biệt listener/summariser.

Chạy công cụ đi kèm để kiểm tra độc lập:

```powershell
python -X utf8 scripts/analyze_jtl.py path/to/results.jtl --json-output analysis.json
```

Chỉ dùng `--latest-segment` sau khi xác minh khoảng trống được báo thật sự ngăn cách các run. Dùng `--start-ms` và `--end-ms` cho phase steady-state đã biết. Script dùng nearest-rank; nếu thuật toán khác nhau, dùng HTML Report làm số JMeter chính thức và ghi rõ phương pháp đối chiếu.

Chỉ phân tích sample count, error rate, percentile latency, throughput, nhóm lỗi, breaking point, recovery và endurance stability trên đúng label và phase.

### 6. Kiểm chứng nhận định AI

Với mỗi nhận định quan trọng, lưu:

- Nhận định và artifact nguồn.
- Phép tính có thể tái tạo hoặc field trong report.
- Scenario, label, loại sample, khoảng timestamp, đơn vị và sample count.
- Trạng thái: `VERIFIED-BY-STUDENT`, `CORRECTED-BY-STUDENT` hoặc `REJECTED-BY-STUDENT`.

Chỉ phân loại đề xuất tối ưu là khả thi, có điều kiện, thiếu bằng chứng hoặc hallucinated sau khi kiểm tra log và source/database liên quan. Không tuyên bố phần trăm cải thiện nếu chưa có hai lần chạy before/after có thể so sánh.

## Tiêu chí hoàn thành

Chỉ hoàn tất khi:

- Các scenario chính dùng dữ liệu có thể tái tạo và backend health check pass trước khi tạo tải.
- Mỗi run có JTL và HTML Report riêng.
- Bằng chứng bao phủ phase đang tạo tải và thời điểm hoàn tất.
- Metric nêu rõ scenario, label, đơn vị, khoảng thời gian và sample count.
- Threshold đến từ Stress/Endurance quan sát được, không lấy từ ví dụ hoặc AI đoán.
- Human review chấp nhận, sửa hoặc bác bỏ rõ từng nhận định AI quan trọng.
