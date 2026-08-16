---
name: jmeter-performance-log-analysis
description: Thiết kế, human review, thực thi và phân tích kiểm thử hiệu năng Apache JMeter cho một nhóm API. Dùng khi tạo hoặc sửa test plan .jmx cho Load, Stress, Spike hoặc Endurance theo style E2E chuẩn hóa và bắt buộc dùng Ultimate Thread Group; tạo test guide/runbook Markdown có lệnh chạy và checklist bằng chứng; kiểm tra xác thực, correlation, assertion, timer, lịch thread và dữ liệu test; chạy JMeter non-GUI để sinh .jtl và HTML Report; phân tích raw JTL, percentile, throughput, lỗi, từng phase và bằng chứng tài nguyên; hoặc kiểm chứng nhận định do AI tạo bằng log có thể tái tính.
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
- Student ID, ngày tạo và business goal dùng để đặt tên test plan/artifact nếu có.
- Vị trí, quy ước tên và ngôn ngữ của test guide nếu người dùng hoặc đề bài có yêu cầu.
- `.jmx`, `.jtl`, HTML Report, backend log và ảnh hiện có khi review một lần chạy.

Không dùng giá trị trong ví dụ làm threshold cho hệ thống khác. Chỉ đọc [references/load-example.md](references/load-example.md) khi cần một ví dụ JMeter cụ thể. Đọc [references/jmx-style.md](references/jmx-style.md) trước khi tạo hoặc tái cấu trúc `.jmx`. Luôn đọc [references/review-checklist.md](references/review-checklist.md) trước khi chốt test plan hoặc kết quả phân tích. Đọc [references/test-guide-template.md](references/test-guide-template.md) khi tạo hoặc cập nhật test guide.

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

Ghi trực tiếp VU, initial delay, ramp-up, hold, ramp-down, loop, think time và đường dẫn CSV vào `.jmx`. Không dùng `${__P(...)}`, `-J...`, file property ngoài hoặc biến môi trường để thay đổi các giá trị này.

Dùng `kg.apc.jmeter.threads.UltimateThreadGroup` cho mọi test plan Load, Stress, Spike, Endurance và bản smoke. Không tạo hoặc fallback sang Thread Group thường. Nếu plugin Ultimate Thread Group chưa có, báo thiếu dependency và hướng dẫn cài plugin trước khi chạy.

### 3. Tạo JMX theo style E2E chuẩn hóa

Dùng cấu trúc trong [references/jmx-style.md](references/jmx-style.md) làm mặc định khi người dùng không chỉ định style khác. Giữ các đặc điểm cốt lõi:

- Đặt cấu hình dùng chung trước Thread Group; gom workflow vào một Transaction Controller cha có sample E2E.
- Dùng đúng một Ultimate Thread Group cho lịch tải của scenario; không dùng Thread Group thường.
- Đánh số request theo thứ tự business workflow bằng dạng `NN METHOD Tên hành động`.
- Dùng dữ liệu riêng, xác định cho từng VU khi workflow làm thay đổi trạng thái.
- Ghi literal đường dẫn CSV tương đối vào `.jmx` và resolve từ thư mục JMX; không truyền CSV path qua property dòng lệnh.
- Extract biến động bằng PostProcessor, dùng giá trị mặc định rõ ràng và assert biến trước request phụ thuộc.
- Kết hợp assertion HTTP với business assertion kiểm tra cấu trúc và tính toàn vẹn dữ liệu.
- Đặt think time ngẫu nhiên tại bước hành vi phù hợp; không gắn timer tùy tiện chỉ để giống file mẫu.
- Lưu transaction cha và sampler con trong JTL nhưng không lưu response body thành công theo mặc định.

Điều chỉnh workload, endpoint, CSV schema, response field, expected status, timer và listener theo API cùng rubric thực tế. Không sao chép `500 VU`, `localhost:3000`, workflow mua hàng hoặc thông báo response của file mẫu sang bài khác. Sau khi sinh XML, kiểm tra tính hợp lệ, cặp phần tử `hashTree`, khả năng mở bằng JMeter đúng phiên bản/plugin và đối chiếu từng node theo checklist style.

### 4. Human review test plan

Đối chiếu `.jmx` với đặc tả API và response API thực tế. Kiểm tra:

- Lịch thread, loop, timer, timeout và hành động khi sampler lỗi.
- Ultimate Thread Group cùng plugin tương ứng được nhận diện trong GUI và non-GUI.
- Đường dẫn CSV trong cả GUI và CLI.
- Xác thực, header, request body, extractor và assertion.
- Cách xử lý lỗi dây chuyền trong workflow phụ thuộc.
- Reset dữ liệu, login lockout, database tăng dần và cô lập tài khoản.
- Transaction Controller cha so với sampler con trong report.

Không sửa cấu hình đang đúng chỉ để tuyên bố AI có lỗi. Ghi rõ mục đã xác minh và giữ nguyên; với lỗi thật, lưu bằng chứng trước/sau khi sửa.

### 5. Smoke test do agent thực hiện

Agent tự chạy smoke test khi backend, plugin và dữ liệu test sẵn sàng; không yêu cầu người dùng chạy bước này. Nếu môi trường chưa sẵn sàng, bỏ qua và báo rõ `SMOKE-NOT-RUN`, không tuyên bố test plan đã được thực thi.

- Giữ nguyên `.jmx` chính thức. Tạo bản sao `<scenario>_smoke.jmx` cạnh file chính để đường dẫn CSV tương đối không thay đổi.
- Giữ Ultimate Thread Group trong bản smoke và ghi cứng workload nhỏ, thường là 1 VU và một vòng E2E hoặc lịch ngắn. Không chuyển sang Thread Group thường và không dùng `${__P(...)}`, `-J...` hay property ngoài.
- Dùng JTL, HTML Report và log riêng có chữ `smoke`; không trộn với output chính thức.
- Chỉ xác minh test plan mở/chạy được, CSV đọc được, workflow hoàn tất, correlation và assertion hoạt động.
- Không dùng latency, throughput, error rate hay CPU/RAM của smoke làm kết quả performance.
- Reset/seed lại trạng thái bị thay đổi sau smoke trước lần chạy chính thức.
- Đọc và ghi nhớ trạng thái cùng lỗi kỹ thuật cần báo, sau đó xóa `<scenario>_smoke.jmx`, JTL, HTML Report và log smoke dù run pass hay fail.
- Trước khi xóa, resolve và kiểm tra từng đường dẫn đúng là artifact smoke do agent vừa tạo; không dùng glob rộng và không xóa `.jmx` hay kết quả chính thức.
- Xác nhận không còn artifact smoke trong workspace. Chỉ báo `SMOKE-PASS` hoặc `SMOKE-FAIL` trong phản hồi; người dùng chỉ cần chạy scenario chính thức.

### 6. Tạo test guide có thể thực thi

Tạo một guide Markdown cho mỗi scenario khi tạo/sửa test plan hoặc khi người dùng yêu cầu hướng dẫn chạy. Đặt guide cạnh test plan hoặc tại vị trí đề bài quy định; ưu tiên tên `<SCENARIO>_TEST_GUIDE.md` khi chưa có quy ước khác.

Dùng cấu trúc trong [references/test-guide-template.md](references/test-guide-template.md) và tuân thủ các nguyên tắc:

- Lấy VU, ramp-up, hold, ramp-down, loop, timer, listener, CSV và URL từ `.jmx` cuối cùng; không sao chép số liệu từ guide mẫu.
- Đọc script, manifest và tài liệu dự án để ghi đúng lệnh cài đặt, khởi động, reset/seed, chuẩn bị tài khoản và health check.
- Ghi đường dẫn tương đối chính xác tới `.jmx`, CSV, script, thư mục JTL, HTML Report, log và ảnh bằng chứng.
- Cung cấp lệnh non-GUI dạng **1 dòng duy nhất (single-line)** nối bằng dấu chấm phẩy `;` trong PowerShell để người dùng paste trực tiếp vào Terminal mà không bị lỗi ngắt dòng/enter sớm. Tự động sinh timestamp, tạo thư mục output và không ghi đè run cũ. Không thêm `-J...` cho workload hoặc CSV vì các giá trị đã được ghi trực tiếp trong `.jmx`.
- Chỉ ghi tiêu chí chấp nhận khi đến từ đề bài, người dùng hoặc baseline đã xác minh; nếu thiếu thì để trống hoặc đánh dấu `TODO`, không tự đặt threshold.
- Nêu rõ bằng chứng cần chụp trong từng phase, cách xác định PID sở hữu cổng backend và cách kiểm tra raw JTL sau run (cũng cung cấp dạng 1 dòng tự tìm file mới nhất).
- Bao gồm artifact cần giữ lại và lỗi thường gặp phù hợp với plugin, dữ liệu và môi trường của project.
- Không tuyên bố một lệnh đã chạy hoặc kết quả đã pass chỉ vì guide được tạo.

Cập nhật guide sau mọi thay đổi ảnh hưởng đến workload, listener, property, CSV, lệnh chuẩn bị hoặc output. Đối chiếu lại guide với `.jmx` cuối cùng trước khi bàn giao.

### 7. Thực thi có thể tái tạo

Khởi động backend, reset/seed dữ liệu, health check rồi chạy JMeter non-GUI. Luôn dùng lệnh 1 dòng duy nhất để paste vào PowerShell an toàn:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"; $jtl = "results/run_$stamp.jtl"; $report = "results/run_${stamp}_html"; $log = "results/run_$stamp.log"; New-Item -ItemType Directory -Force "results" | Out-Null; jmeter -n -t "test-plans/scenario.jmx" -l $jtl -j $log -e -o $report
```

Đây là lần chạy chính thức do người dùng thực hiện hoặc yêu cầu agent thực hiện; không phải smoke test nội bộ ở bước 5.

Chụp bằng chứng trong phase quan trọng, không chỉ sau khi kết thúc:

- Terminal JMeter hoặc màn hình công cụ.
- PID, CPU và RAM của backend.
- Bằng chứng PID sở hữu cổng backend khi có nhiều tiến trình cùng loại.
- Màn hình hoàn tất có `end of run`.

Giữ raw `.jtl`, toàn bộ thư mục HTML, test plan, metadata môi trường và ảnh. Không ghi nhiều lần chạy vào cùng JTL nếu đề bài không yêu cầu và không có tài liệu giải thích.

### 8. Kiểm tra và phân tích log

Kiểm tra chất lượng dữ liệu trước:

- Xác nhận khoảng timestamp, label, số sample, thread name, success và response code.
- Phát hiện log cũ/log nối thêm và chọn đúng run hoặc phase.
- Tách E2E transaction khỏi request; không cộng sample cha và con như cùng một đơn vị.
- So sánh JTL với `statistics.json` của HTML và giải thích khác biệt listener/summariser.

Mở HTML report mới nhất (1 dòng, an toàn khi mở terminal mới):

```powershell
$targetReport = if ($report -and (Test-Path "$report\index.html")) { "$report\index.html" } else { (Get-ChildItem -Directory "results/*_html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName + "\index.html" }; Invoke-Item $targetReport
```

Thống kê nhanh lỗi từ file JTL mới nhất (1 dòng, an toàn khi mở terminal mới):

```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "results/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Group-Object success | Select-Object Name,Count; $data | Where-Object { $_.success -eq 'false' } | Group-Object label,responseCode,failureMessage | Sort-Object Count -Descending | Select-Object Count,Name
```

Chạy công cụ đi kèm để kiểm tra độc lập:

```powershell
python -X utf8 scripts/analyze_jtl.py path/to/results.jtl --json-output analysis.json
```

Chỉ dùng `--latest-segment` sau khi xác minh khoảng trống được báo thật sự ngăn cách các run. Dùng `--start-ms` và `--end-ms` cho phase steady-state đã biết. Script dùng nearest-rank; nếu thuật toán khác nhau, dùng HTML Report làm số JMeter chính thức và ghi rõ phương pháp đối chiếu.

Chỉ phân tích sample count, error rate, percentile latency, throughput, nhóm lỗi, breaking point, recovery và endurance stability trên đúng label và phase.

### 9. Kiểm chứng nhận định AI

Với mỗi nhận định quan trọng, lưu:

- Nhận định và artifact nguồn.
- Phép tính có thể tái tạo hoặc field trong report.
- Scenario, label, loại sample, khoảng timestamp, đơn vị và sample count.
- Trạng thái: `VERIFIED-BY-STUDENT`, `CORRECTED-BY-STUDENT` hoặc `REJECTED-BY-STUDENT`.

Chỉ phân loại đề xuất tối ưu là khả thi, có điều kiện, thiếu bằng chứng hoặc hallucinated sau khi kiểm tra log và source/database liên quan. Không tuyên bố phần trăm cải thiện nếu chưa có hai lần chạy before/after có thể so sánh.

## Tiêu chí hoàn thành

Chỉ hoàn tất khi:

- Các scenario chính dùng dữ liệu có thể tái tạo và backend health check pass trước khi tạo tải.
- Test plan tuân thủ style E2E chuẩn hóa hoặc ghi rõ lý do phải khác; request được đánh số, correlation được bảo vệ và business assertion bao phủ workflow.
- VU, toàn bộ lịch thời gian, think time và CSV path được ghi trực tiếp trong mỗi `.jmx`; không dùng `${__P(...)}`, `-J...` hoặc property ngoài.
- Mọi `.jmx` chính thức và smoke đều dùng Ultimate Thread Group; không có Thread Group thường hoặc fallback âm thầm.
- Agent đã báo `SMOKE-PASS`, `SMOKE-FAIL` hoặc `SMOKE-NOT-RUN`; người dùng không phải tự chạy smoke test.
- Không còn bản JMX, JTL, HTML Report hoặc log smoke sau khi agent đã đọc kết quả; artifact chính thức vẫn nguyên vẹn.
- Mỗi scenario có test guide khớp `.jmx` cuối cùng; lệnh, đường dẫn và dependency đã được đối chiếu với project, còn dữ kiện thiếu được để trống hoặc đánh dấu `TODO`.
- Mỗi run có JTL và HTML Report riêng.
- Bằng chứng bao phủ phase đang tạo tải và thời điểm hoàn tất.
- Metric nêu rõ scenario, label, đơn vị, khoảng thời gian và sample count.
- Threshold đến từ Stress/Endurance quan sát được, không lấy từ ví dụ hoặc AI đoán.
- Human review chấp nhận, sửa hoặc bác bỏ rõ từng nhận định AI quan trọng.
