# Hướng dẫn chạy Spike Test JMeter

Test plan: `test-plans/23127340_Spike_20260816.jmx`  
Test data: `test-data/accounts_spike.csv` (1.000 users)  
Workflow: Login -> Products -> Add Cart -> Get Cart -> Checkout -> Order Detail  

## 1. Cấu hình mặc định

| Giai đoạn          |  Thời gian |     Tổng VU |
| -------------------- | ----------: | -----------: |
| Baseline             | 00:00-01:00 |          100 |
| Tăng đột ngột    | 01:00-01:10 | 100 -> 1.000 |
| Giữ đỉnh          | 01:10-02:40 |        1.000 |
| Giảm tải           | 02:40-02:50 | 1.000 -> 100 |
| Theo dõi phục hồi | 02:50-04:50 |          100 |
| Kết thúc baseline  | 04:50-05:00 |     100 -> 0 |

- **Think-time:** Ngẫu nhiên 1-3 giây trước mỗi bước sau Login (Uniform Random Timer: Constant 1000ms + Random 2000ms).
- **Report view:** `View Results Tree - All Samples`, luôn bật và hiển thị toàn bộ sample thành công lẫn thất bại.
- **Base URL:** `http://localhost:3000`
- **Plugin:** Ultimate Thread Group từ plugin **Custom Thread Groups** (`jmeter-plugins-casutg`).

Ultimate Thread Group dùng hai dòng cộng dồn: 100 VU nền chạy xuyên suốt và 900 VU bổ sung bắt đầu ở giây 60. Vì vậy đỉnh là 1.000 VU, không phải 1.100 VU.

Các giá trị trong bảng đã được cấu hình trực tiếp tại Ultimate Thread Group, Loop Controller, HTTP Request Defaults và preprocessor đọc CSV. Test plan chính thức không dùng `-J...` để thay đổi load profile.

## 2. Chuẩn bị backend và tài khoản

Mở PowerShell tại thư mục gốc repository `D:\group05_eshop`.

Nếu đây là lần đầu thiết lập project, cài dependency cho backend (1 dòng):

```powershell
cd backend; npm install; cd ..
```

Không cần chạy riêng `node database.js`. Backend hiện reset/seed database khi `server.js` khởi động.

Khởi động backend trong một terminal riêng:

```powershell
node backend\server.js
```

Backend chạy logic reset/seed database khi khởi động, vì vậy phải đợi backend khởi động xong rồi mới tạo tài khoản performance test. Không chạy lại hoặc restart backend sau bước chuẩn bị user nếu chưa chạy lại script.

Giữ terminal backend mở. Trong terminal khác, tạo/cập nhật 1.000 tài khoản Spike Test, tái tạo 1.000 dòng dữ liệu CSV và xóa trạng thái lockout:

```powershell
node HW\week09\TheDat\scripts\prepare-spike-users.js
```

Sau đó kiểm tra API:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products
```

Kết quả mong đợi là HTTP `200` và danh sách sản phẩm JSON.

Xác định PID backend đang giữ port 3000 để theo dõi đúng tiến trình trong Task Manager:

```powershell
"PID: $((Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess)"
```

## 3. Chuẩn bị lần Spike Test chính thức

Trước khi chạy:

- Restart backend để xóa cart đang lưu trong RAM, sau đó luôn chạy lại `prepare-spike-users.js` vì backend reset bảng users khi khởi động.
- Ghi commit SHA, số order hiện tại và thời gian bắt đầu.
- Mở Task Manager/Resource Monitor.
- Hiển thị tiến trình backend `node` và JMeter để chụp cùng một khung hình.
- Đảm bảo tên `.jmx` có ngày chạy thật. Nếu chạy ngày khác 2026-08-16, sao chép/đổi tên file theo `23127340_Spike_YYYYMMDD.jmx`.
- Dùng tên output mới; JMeter yêu cầu thư mục HTML Report chưa tồn tại hoặc đang trống.
- `View Results Tree` luôn được bật trong lần chạy chính thức.

## 4. Chạy Spike Test chính thức

Lệnh 1 dòng dưới đây tự dùng cấu hình đã lưu trong `.jmx`: 100 VU baseline, tăng vọt 1.000 VU, giữ đỉnh 90 giây và phục hồi về 100 VU (paste 1 lần chạy ngay):

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"; $jtl = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.jtl"; $report = "HW/week09/TheDat/results/spike/23127340_Spike_${stamp}_html"; $jmeterLog = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.log"; New-Item -ItemType Directory -Force "HW/week09/TheDat/results/spike" | Out-Null; jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Spike_20260816.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Tổng profile kéo dài khoảng 300 giây (5 phút). Không đóng terminal backend hoặc terminal JMeter giữa chừng.

Timestamp trong tên `$jtl`, `$jmeterLog` và `$report` giúp mỗi lần chạy có bộ artifact riêng, không ghi đè bằng chứng cũ.

## 5. Kiểm tra kết quả

Mở HTML Report mới nhất (1 dòng, chạy an toàn kể cả khi mở terminal mới):

```powershell
$targetReport = if ($report -and (Test-Path "$report\index.html")) { "$report\index.html" } else { (Get-ChildItem -Directory "HW/week09/TheDat/results/spike/*_html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName + "\index.html" }; Invoke-Item $targetReport
```

Thống kê Success/Fail từ raw `.jtl` mới nhất (1 dòng):

```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "HW/week09/TheDat/results/spike/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Group-Object success | Select-Object Name,Count
```

Thống kê chi tiết lỗi theo label, mã lỗi và thông điệp lỗi (1 dòng):

```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "HW/week09/TheDat/results/spike/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Where-Object { $_.success -eq 'false' } | Group-Object label,responseCode,failureMessage | Sort-Object Count -Descending | Select-Object Count,Name
```

Ghi vào report và đánh giá theo 3 phase:

- **Baseline (00:00 - 01:00):** Throughput, latency p95 và error rate ở mức 100 VU.
- **Spike (01:00 - 02:50):** Đỉnh p95, tỷ lệ lỗi, mức tụt throughput và CPU/RAM backend khi chạm 1.000 VU.
- **Recovery (02:50 - 05:00):** Thời gian latency và error rate phục hồi trở lại mức ban đầu sau khi giảm về 100 VU.

## 6. Artifact phải giữ lại

- `23127340_Spike_YYYYMMDD.jmx`.
- `accounts_spike.csv` đã dùng.
- Raw `.jtl` đầy đủ.
- JMeter execution log `.log`.
- Toàn bộ thư mục HTML Report.
- Screenshot JMeter/tool và resource monitor trong cùng khung hình (ở 3 mốc: Baseline, Spike Peak và Recovery).
- Backend log.
- Hardware screenshot/specification.
- Ghi chú reset cart/account lockout và số order trước/sau.

## 7. Lỗi thường gặp

### `CannotResolveClassException: UltimateThreadGroup`
Cài plugin **Custom Thread Groups** bằng JMeter Plugins Manager rồi khởi động lại JMeter.

### `CSV has ... accounts but VU ... needs a row`
CSV cần đủ 1.000 tài khoản cho 1.000 VU. Chạy lại `node HW\week09\TheDat\scripts\prepare-spike-users.js`.

### Login trả `401` hoặc `403`
- Chạy lại `prepare-spike-users.js` sau khi khởi động backend.
- Script chuẩn bị user cũng tự động reset `login_attempts = 0` và `locked_until = NULL` cho 1.000 accounts.

### Mở HTML Report bị trắng trơn / thiếu CSS
Tái sinh lại report từ file JTL bằng lệnh 1 dòng:
```powershell
$latestJtl = (Get-ChildItem "HW/week09/TheDat/results/spike/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName; $reportFolder = $latestJtl -replace '\.jtl$', '_regenerated_html'; jmeter -g $latestJtl -o $reportFolder; Invoke-Item "$reportFolder\index.html"
```
