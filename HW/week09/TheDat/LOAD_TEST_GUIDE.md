# Hướng dẫn chạy Load Test JMeter

Test plan: `test-plans/23127340_Load_20260816.jmx`
Test data: `test-data/accounts_load.csv`
Workflow: Login -> Products -> Add Cart -> Get Cart -> Checkout -> Order Detail

## 1. Cấu hình mặc định

| Tham số      |                                            Giá trị |
| ------------- | ---------------------------------------------------: |
| Virtual users |                                                  500 |
| Initial delay |                                              0 giây |
| Ramp-up       |                                            120 giây |
| Hold load     |                                            300 giây |
| Ramp-down     |                                             60 giây |
| Think-time    | Ngẫu nhiên 1-3 giây trước mỗi bước sau Login |
| Report view   |             Summary Report - All Samples, luôn bật |
| Base URL      |                            `http://localhost:3000` |

Test plan dùng Ultimate Thread Group từ plugin **Custom Thread Groups**. Máy cần JMeter 5.6.3 và plugin `jmeter-plugins-casutg`.

`Summary Report` luôn được bật và nhận tất cả sample thành công lẫn thất bại trong lần chạy chính thức. Không disable listener hoặc bật bộ lọc chỉ lỗi.

Các giá trị trong bảng đã được cấu hình trực tiếp tại Ultimate Thread Group, Loop Controller, HTTP Request Defaults và preprocessor đọc CSV. Test plan chính thức không dùng `-Jusers`, `-JrampUp`, v.v. để thay đổi load profile.

## 2. Chuẩn bị backend và tài khoản

Mở PowerShell tại thư mục gốc repository `D:\group05_eshop`.

Nếu đây là lần đầu thiết lập project, cài dependency cho backend:

```powershell
cd backend
npm install
cd ..
```

Không cần chạy riêng `node database.js`. Backend hiện reset/seed database khi `server.js` khởi động.

Khởi động backend trong một terminal riêng:

```powershell
node backend\server.js
```

Backend hiện chạy logic reset/seed database khi khởi động, vì vậy phải đợi backend khởi động xong rồi mới tạo tài khoản performance test. Không chạy lại hoặc restart backend sau bước chuẩn bị user nếu chưa chạy lại script.

Giữ terminal backend mở. Trong terminal khác, tạo/cập nhật 500 tài khoản Load Test, tái tạo 500 dòng dữ liệu CSV và xóa trạng thái lockout:

```powershell
node HW\week09\TheDat\scripts\prepare-load-users.js
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

## 3. Chuẩn bị lần Load Test chính thức

Trước khi chạy:

- Restart backend để xóa cart đang lưu trong RAM, sau đó luôn chạy lại `prepare-load-users.js` vì backend reset bảng users khi khởi động.
- Ghi commit SHA, số order hiện tại và thời gian bắt đầu.
- Mở Task Manager/Resource Monitor.
- Hiển thị tiến trình backend `node` và JMeter để chụp cùng một khung hình.
- Đảm bảo tên `.jmx` có ngày chạy thật. Nếu chạy ngày khác 2026-08-16, sao chép/đổi tên file theo `23127340_Load_YYYYMMDD.jmx`.
- Dùng tên output mới; JMeter yêu cầu thư mục HTML Report chưa tồn tại hoặc đang trống.

## 4. Chạy Load Test chính thức

Lệnh dưới đây tự dùng cấu hình đã lưu trong `.jmx`: 500 VU, ramp-up 120 giây, hold 300 giây và ramp-down 60 giây.

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/load/23127340_Load_$stamp.jtl"
$report = "HW/week09/TheDat/results/load/23127340_Load_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/load/23127340_Load_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/load" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Load_20260816.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Tổng profile kéo dài khoảng 480 giây. Không đóng terminal backend hoặc terminal JMeter giữa chừng.

Timestamp trong tên `$jtl`, `$jmeterLog` và `$report` giúp mỗi lần chạy có bộ artifact riêng, không ghi đè bằng chứng cũ.

## 5. Kiểm tra kết quả

Mở HTML Report:

```powershell
Invoke-Item "$report\index.html"
```

Thống kê lỗi từ raw `.jtl`:

```powershell
$data = Import-Csv $jtl
$data | Group-Object success | Select-Object Name,Count
$data | Where-Object success -eq 'false' |
  Group-Object label,responseCode,failureMessage |
  Sort-Object Count -Descending |
  Select-Object Count,Name
```

Ghi vào report:

- Sample count của từng request và E2E transaction.
- Average, median, p90, p95, p99, min và max.
- Error count và error rate.
- Throughput; ghi rõ request/s hay transaction/s.
- CPU/RAM trung bình và peak của backend.
- Số order trước/sau run.
- Timestamp của lỗi hoặc resource peak đáng chú ý.

Tiêu chí khởi điểm trong `plan.md`:

- Error rate dưới 1%.
- p95 dưới 2 giây.
- Throughput ổn định.
- CPU/RAM không tăng mất kiểm soát.

Chỉ kết luận Pass/Fail từ số đo thật. Không gộp `E2E Purchase Workflow` với sáu request khi tính tổng sample/throughput.

## 6. Artifact phải giữ lại

- `23127340_Load_YYYYMMDD.jmx`.
- `accounts_load.csv` đã dùng.
- Raw `.jtl` đầy đủ.
- JMeter execution log `.log`.
- Toàn bộ thư mục HTML Report.
- Screenshot JMeter/tool và resource monitor trong cùng khung hình.
- Backend log.
- Hardware screenshot/specification.
- Ghi chú reset cart/account lockout và số order trước/sau.
- AI Audit và bảng human verification cho test plan.

## 7. Lỗi thường gặp

### `CannotResolveClassException: UltimateThreadGroup`

Cài plugin **Custom Thread Groups** bằng JMeter Plugins Manager rồi khởi động lại JMeter. File plugin tương ứng thường có tên `jmeter-plugins-casutg-*.jar` trong `lib/ext`.

### `CSV has ... accounts but VU ... needs a row`

CSV có ít hơn 500 tài khoản hoặc số VU trong JMX lớn hơn số dòng CSV. Chạy lại script chuẩn bị tài khoản, thêm CSV row tương ứng hoặc giảm số VU. Mỗi VU cần một dòng riêng.

### Login trả `401` hoặc `403`

- Chạy lại `prepare-load-users.js` sau khi seed database.
- Kiểm tra backend đang dùng đúng `backend/database.sqlite`.
- Không sửa email/password trong CSV mà không cập nhật database.
- Script chuẩn bị user cũng reset `login_attempts` và `locked_until` của 500 load users.

### JMeter không tìm thấy CSV

Đường dẫn CSV được cấu hình trực tiếp là `HW/week09/TheDat/test-data/accounts_load.csv`. Chạy JMeter từ thư mục gốc repository `D:\group05_eshop`. Nếu repository được chuyển sang thư mục khác, giữ nguyên đường dẫn tương đối hoặc cập nhật trực tiếp preprocessor trong `.jmx`.

### Không tạo được HTML Report

Dùng một tên thư mục output mới. Không trỏ `-o` vào thư mục report cũ có dữ liệu.

### Có cảnh báo Windows Registry/Java Preferences

Nếu test vẫn báo `Created the tree successfully`, tạo `.jtl` và hoàn tất workflow thì cảnh báo Java Preferences không phải lỗi của SUT. Lưu console log và đánh giá dựa trên sample/error thực tế.
