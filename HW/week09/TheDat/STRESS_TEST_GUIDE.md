# Hướng dẫn chạy Stress Test JMeter

Test plan: `test-plans/23127340_Stress_20260816.jmx`  
Test data: `test-data/accounts_stress.csv` (1.000 users)  
Workflow: Login -> Products -> Add Cart -> Get Cart -> Checkout -> Order Detail  

## 1. Cấu hình mặc định

| Giai đoạn | Thời gian đã chạy | VU mục tiêu |
| ----------- | --------------------: | ------------: |
| Ramp 1      |           00:00-01:00 |      0 -> 500 |
| Giữ tải 1 |           01:00-03:00 |           500 |
| Ramp 2      |           03:00-04:00 |    500 -> 650 |
| Giữ tải 2 |           04:00-06:00 |           650 |
| Ramp 3      |           06:00-07:00 |    650 -> 800 |
| Giữ tải 3 |           07:00-09:00 |           800 |
| Ramp 4      |           09:00-10:00 |  800 -> 1.000 |
| Giữ tải 4 |           10:00-12:00 |         1.000 |
| Ramp-down   |           12:00-13:00 |    1.000 -> 0 |

- **Think-time:** Ngẫu nhiên 1-3 giây trước mỗi bước sau Login (Uniform Random Timer: Constant 1000ms + Random 2000ms).
- **Report view:** `Aggregate Report - All Samples`, luôn bật và nhận tất cả sample thành công lẫn thất bại.
- **Base URL:** `http://localhost:3000`
- **Plugin:** Ultimate Thread Group từ plugin **Custom Thread Groups** (`jmeter-plugins-casutg`).

Các dòng trong Ultimate Thread Group là những nhóm user được cộng dồn (500 + 150 + 150 + 200 VU). Nhóm đã khởi động trước tiếp tục hoạt động đến giai đoạn ramp-down chung ở phút thứ 12.

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

Giữ terminal backend mở. Trong terminal khác, tạo/cập nhật 1.000 tài khoản Stress Test, tái tạo 1.000 dòng dữ liệu CSV và xóa trạng thái lockout:

```powershell
node HW\week09\TheDat\scripts\prepare-stress-users.js
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

## 3. Chuẩn bị lần Stress Test chính thức

Trước khi chạy:

- Restart backend để xóa cart đang lưu trong RAM, sau đó luôn chạy lại `prepare-stress-users.js` vì backend reset bảng users khi khởi động.
- Ghi commit SHA, số order hiện tại và thời gian bắt đầu.
- Mở Task Manager/Resource Monitor.
- Hiển thị tiến trình backend `node` và JMeter để chụp cùng một khung hình.
- Đảm bảo tên `.jmx` có ngày chạy thật. Nếu chạy ngày khác 2026-08-16, sao chép/đổi tên file theo `23127340_Stress_YYYYMMDD.jmx`.
- Dùng tên output mới; JMeter yêu cầu thư mục HTML Report chưa tồn tại hoặc đang trống.
- `Aggregate Report` luôn được bật trong lần chạy chính thức.

## 4. Chạy Stress Test chính thức

Lệnh 1 dòng dưới đây tự dùng cấu hình đã lưu trong `.jmx`: 4 bậc tải (500 -> 650 -> 800 -> 1.000 VU) và ramp-down (paste 1 lần chạy ngay):

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"; $jtl = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.jtl"; $report = "HW/week09/TheDat/results/stress/23127340_Stress_${stamp}_html"; $jmeterLog = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.log"; New-Item -ItemType Directory -Force "HW/week09/TheDat/results/stress" | Out-Null; jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Stress_20260816.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Tổng profile kéo dài khoảng 780 giây (13 phút). Không đóng terminal backend hoặc terminal JMeter giữa chừng.

Timestamp trong tên `$jtl`, `$jmeterLog` và `$report` giúp mỗi lần chạy có bộ artifact riêng, không ghi đè bằng chứng cũ.

## 5. Kiểm tra kết quả

Mở HTML Report mới nhất (1 dòng, chạy an toàn kể cả khi mở terminal mới):

```powershell
$targetReport = if ($report -and (Test-Path "$report\index.html")) { "$report\index.html" } else { (Get-ChildItem -Directory "HW/week09/TheDat/results/stress/*_html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName + "\index.html" }; Invoke-Item $targetReport
```

Thống kê Success/Fail từ raw `.jtl` mới nhất (1 dòng):

```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "HW/week09/TheDat/results/stress/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Group-Object success | Select-Object Name,Count
```

Thống kê chi tiết lỗi theo label, mã lỗi và thông điệp lỗi (1 dòng):

```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "HW/week09/TheDat/results/stress/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Where-Object { $_.success -eq 'false' } | Group-Object label,responseCode,failureMessage | Sort-Object Count -Descending | Select-Object Count,Name
```

Đánh giá breaking point và phân tích theo từng giai đoạn giữ tải:

- **Bậc 500 VU (01:00 - 03:00):** Baseline ổn định.
- **Bậc 650 VU (04:00 - 06:00):** Tải tăng bậc 1.
- **Bậc 800 VU (07:00 - 09:00):** Tải tăng bậc 2.
- **Bậc 1.000 VU (10:00 - 12:00):** Tải cực đại.
- **Xác định Breaking Point:** Bậc tải đầu tiên vi phạm tiêu chuẩn (Error Rate > 5%, p95 > 5s, hoặc backend crash/swap).

## 6. Artifact phải giữ lại

- `23127340_Stress_YYYYMMDD.jmx`.
- `accounts_stress.csv` đã dùng.
- Raw `.jtl` đầy đủ.
- JMeter execution log `.log`.
- Toàn bộ thư mục HTML Report.
- Screenshot JMeter/tool và resource monitor trong cùng khung hình tại từng bậc tải.
- Backend log.
- Hardware screenshot/specification.
- Ghi chú reset cart/account lockout và số order trước/sau.

## 7. Lỗi thường gặp

### `CannotResolveClassException: UltimateThreadGroup`
Cài plugin **Custom Thread Groups** bằng JMeter Plugins Manager rồi khởi động lại JMeter.

### `CSV has ... accounts but VU ... needs a row`
CSV cần đủ 1.000 tài khoản cho 1.000 VU. Chạy lại `node HW\week09\TheDat\scripts\prepare-stress-users.js`.

### Login trả `401` hoặc `403`
- Chạy lại `prepare-stress-users.js` sau khi khởi động backend.
- Script chuẩn bị user tự động reset `login_attempts = 0` và `locked_until = NULL` cho 1.000 accounts.

### Mở HTML Report bị trắng trơn / thiếu CSS
Tái sinh lại report từ file JTL bằng lệnh 1 dòng:
```powershell
$latestJtl = (Get-ChildItem "HW/week09/TheDat/results/stress/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName; $reportFolder = $latestJtl -replace '\.jtl$', '_regenerated_html'; jmeter -g $latestJtl -o $reportFolder; Invoke-Item "$reportFolder\index.html"
```
