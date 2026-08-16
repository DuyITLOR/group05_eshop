# Template test guide JMeter

Dùng reference này để tạo runbook Markdown cho từng scenario. Giữ các phần có liên quan tới project và bỏ phần không áp dụng. Thay placeholder bằng dữ kiện đã xác minh; nếu chưa có dữ kiện, để trống hoặc ghi `TODO: ...`.

## Quy tắc tạo guide

- Đọc `.jmx` cuối cùng và các CSV/script được tham chiếu trước khi viết.
- Không lấy VU, thời lượng, URL, threshold hay plugin từ một guide mẫu khác.
- Xác nhận VU, lịch thời gian, think time và đường dẫn CSV đã được ghi trực tiếp trong `.jmx`; không hướng dẫn override bằng `-J...`.
- Dùng đường dẫn tương đối tính từ working directory được ghi trong guide.
- Dùng output mới theo timestamp cho mỗi run; không tái sử dụng JTL hoặc thư mục HTML cũ.
- **Bắt buộc định dạng toàn bộ câu lệnh ở dạng 1 dòng duy nhất (single-line command)** bằng cách nối bằng dấu chấm phẩy `;` trong PowerShell để người dùng paste trực tiếp vào Terminal an toàn, không bị ngắt dòng hoặc enter sớm.
- Lệnh mở Report và phân tích raw JTL phải có cơ chế tự động tìm file/folder mới nhất để tránh lỗi biến rỗng (`$jtl is null`) khi người dùng mở terminal mới.
- Gắn mọi tiêu chí pass/fail với nguồn: đề bài, yêu cầu người dùng hoặc baseline đã xác minh.
- Viết theo ngôn ngữ người dùng yêu cầu và dùng cùng tên label/scenario trong `.jmx`.

## Khung nội dung

# Hướng dẫn chạy {Scenario} Test JMeter

- **Test plan:** `{path/to/scenario.jmx}`
- **Dữ liệu test:** `{path/to/data.csv}` / `{không sử dụng}`
- **Workflow:** `{Request A -> Request B -> ...}`
- **Working directory:** `{path dùng để chạy các lệnh bên dưới}`

## 1. Cấu hình mặc định

| Hạng mục | Giá trị đã xác minh |
|---|---:|
| Virtual users / threads | `{...}` |
| Initial delay | `{...}` |
| Ramp-up | `{...}` |
| Hold / steady state | `{...}` |
| Ramp-down | `{...}` |
| Loop count | `{...}` |
| Think time | `{...}` |
| Base URL | `{...}` |
| Listener bắt buộc | `{...}` |

### Dependency và plugin

- JMeter: `{version hoặc TODO}`
- Java: `{version hoặc TODO}`
- Plugin: `Ultimate Thread Group (bắt buộc)`
- Cách kiểm tra/cài plugin: `{lệnh hoặc thao tác đã xác minh}`
- Workload và CSV path: `Cố định trực tiếp trong JMX; không dùng -J`

> Lưu ý: `{nêu listener nặng, giá trị cố định, giới hạn CSV hoặc ràng buộc quan trọng}`

## 2. Chuẩn bị backend và dữ liệu test

### 2.1. Cài đặt và khởi động

Lệnh cài đặt backend (1 dòng):
```powershell
{INSTALL_COMMAND}
```

Khởi động backend (terminal riêng, 1 dòng):
```powershell
{START_COMMAND}
```

### 2.2. Reset/seed và chuẩn bị tài khoản

Lệnh chuẩn bị dữ liệu test / tài khoản / xóa lockout (terminal khác, 1 dòng):
```powershell
{RESET_OR_SEED_AND_PREPARE_COMMAND}
```

Ghi rõ tác động của lệnh reset/seed tới tài khoản, cart, order, login lockout và dữ liệu dùng chung.

### 2.3. Health check

```powershell
{HEALTH_CHECK_COMMAND}
```

Kết quả mong đợi: `{status/body đã xác minh}`.

### 2.4. Xác định tiến trình backend

Lấy PID backend đang chiếm port (1 dòng):
```powershell
{COMMAND_FIND_PID_BY_PORT}
```

## 3. Chuẩn bị lần chạy chính thức

- [ ] Backend vừa được khởi động/reset theo đúng thứ tự.
- [ ] Health check pass.
- [ ] Tài khoản và CSV đủ dữ liệu cho workload.
- [ ] Đã ghi commit SHA, thời điểm bắt đầu, cấu hình máy và phiên bản công cụ.
- [ ] Đã xác định đúng PID sở hữu cổng backend.
- [ ] Đã chuẩn bị màn hình theo dõi CPU/RAM và công cụ tạo tải trong cùng frame nếu đề bài yêu cầu.
- [ ] Đường dẫn JTL, HTML Report, JMeter log và ảnh là mới.

Quy ước tên artifact: `{StudentID}_{Scenario}_{YYYYMMDD_HHmmss}_{Artifact}`.

## 4. Chạy test chính thức

Lệnh chạy JMeter chính thức (1 dòng duy nhất, tự động tạo timestamp, thư mục output và log):

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"; $jtl = "{results/path}/{scenario}_$stamp.jtl"; $report = "{results/path}/{scenario}_${stamp}_html"; $log = "{results/path}/{scenario}_$stamp.log"; New-Item -ItemType Directory -Force "{results/path}" | Out-Null; jmeter -n -t "{path/to/scenario.jmx}" -l $jtl -j $log -e -o $report
```

Không thêm tham số `-J...` cho VU, thời gian hoặc CSV. Lệnh trên chạy cấu hình chính thức đã ghi trong `.jmx`. Smoke test kỹ thuật do agent tự thực hiện rồi xóa toàn bộ artifact smoke; người dùng không phải chạy hoặc lưu smoke. Ghi thời lượng dự kiến: `{...}`.

### Bằng chứng cần thu thập

| Thời điểm/phase | Nội dung phải thấy |
|---|---|
| Trước run | `{cấu hình workload, health check, PID}` |
| Ramp-up / phase tăng tải | `{JMeter + CPU/RAM backend + số thread/tải}` |
| Hold / peak / spike | `{JMeter + CPU/RAM backend + mốc thời gian}` |
| Recovery / ramp-down | `{tải giảm và tài nguyên phục hồi nếu áp dụng}` |
| Kết thúc | `{end of run, exit code, đường dẫn artifact}` |

## 5. Kiểm tra kết quả

Mở HTML Report mới nhất (1 dòng, an toàn khi mở terminal mới):
```powershell
$targetReport = if ($report -and (Test-Path "$report\index.html")) { "$report\index.html" } else { (Get-ChildItem -Directory "{results/path}/*_html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName + "\index.html" }; Invoke-Item $targetReport
```

Thống kê Success / Error từ file raw JTL mới nhất (1 dòng, an toàn khi mở terminal mới):
```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "{results/path}/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Group-Object success | Select-Object Name,Count
```

Thống kê chi tiết mã lỗi & thông điệp lỗi (1 dòng):
```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "{results/path}/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Where-Object { $_.success -eq 'false' } | Group-Object label,responseCode,failureMessage | Sort-Object Count -Descending | Select-Object Count,Name
```

Báo cáo tối thiểu:

- Scenario và khoảng timestamp được phân tích.
- E2E transaction cha: sample count, error rate, average, p90, p95, p99, throughput.
- Request con: báo cáo riêng, không dùng request cuối để kết luận E2E hoàn tất.
- Breaking point, recovery hoặc endurance trend theo đúng loại scenario.
- CPU/RAM backend từ bằng chứng đã thu thập; nếu không có chuỗi quan sát thì ghi rõ giới hạn dữ liệu.

### Tiêu chí chấp nhận

- Error rate: `{TODO hoặc nguồn + threshold}`
- Latency percentile: `{TODO hoặc nguồn + threshold}`
- Throughput: `{TODO hoặc nguồn + threshold}`
- Tài nguyên/recovery: `{TODO hoặc nguồn + threshold}`

## 6. Artifact phải giữ lại

- `{scenario}.jmx`
- `{test-data.csv nếu có}`
- `{run}.jtl`
- `{run}_html/`
- `{run}.log`
- `{ảnh/video bằng chứng}`
- `{metadata môi trường và ghi chú run}`
- `{test guide này}`

## 7. Lỗi thường gặp

### `{Plugin/thread group không được nhận diện}`

- Dấu hiệu: `{...}`
- Cách kiểm tra: `{...}`
- Cách xử lý đã xác minh: `{...}`

### `{CSV thiếu dòng, sai path hoặc dữ liệu bị dùng chung}`

- Dấu hiệu: `{...}`
- Cách kiểm tra: `{...}`
- Cách xử lý đã xác minh: `{...}`

### `{401/403, token/correlation hoặc lockout}`

- Dấu hiệu: `{...}`
- Cách kiểm tra: `{...}`
- Cách xử lý đã xác minh: `{...}`

### `{HTML output đã tồn tại hoặc JTL bị nối thêm}`

- Dùng timestamp mới và xác minh output chưa tồn tại trước run.

### `{Cảnh báo môi trường không làm fail run}`

- Ghi rõ cách phân biệt warning với lỗi thực tế; không kết luận chỉ dựa vào một dòng cảnh báo.

## Checklist review guide

- [ ] Bảng workload khớp `.jmx` cuối cùng.
- [ ] Test plan và bản smoke dùng Ultimate Thread Group; guide không hướng dẫn fallback sang Thread Group thường.
- [ ] Lệnh chuẩn bị và health check tồn tại trong project hoặc đã được người dùng xác nhận.
- [ ] Mọi path được tính từ working directory đã nêu.
- [ ] **Mọi câu lệnh thực thi (CLI run, report, jtl analysis) được trình bày dạng 1 dòng duy nhất để paste an toàn.**
- [ ] Lệnh CLI chính thức dùng output mới và không có `-J` cho workload/CSV.
- [ ] Lệnh phân tích JTL / mở report có fallback tự tìm file mới nhất, không gây lỗi rỗng khi paste vào terminal mới.
- [ ] Guide ghi rõ smoke test do agent thực hiện và cleanup; người dùng chỉ chạy scenario chính thức, không lưu artifact smoke.
- [ ] Bằng chứng bao phủ phase quan trọng của đúng scenario.
- [ ] Metric E2E transaction cha và request con được tách riêng.
- [ ] Tiêu chí chấp nhận có nguồn; dữ kiện thiếu không bị bịa.
- [ ] Danh sách artifact đủ để tái phân tích và kiểm chứng lần chạy.
