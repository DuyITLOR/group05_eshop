# Hướng dẫn chạy Load Test JMeter

Test plan: `test-plans/23127340_Load_20260815.jmx`
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
| Report view   |                                       Summary Report |
| Base URL      |                            `http://localhost:3000` |

Test plan dùng Ultimate Thread Group từ plugin **Custom Thread Groups**. Máy cần JMeter 5.6.3 và plugin `jmeter-plugins-casutg`.

Các giá trị trong bảng đã được cấu hình trực tiếp tại Ultimate Thread Group, Loop Controller, HTTP Request Defaults và preprocessor đọc CSV. Test plan chính thức không dùng `-Jusers`, `-JrampUp`, v.v. để thay đổi load profile.

## 2. Chuẩn bị backend và tài khoản

Mở PowerShell tại thư mục gốc repository `D:\group05_eshop`.

Nếu đây là lần đầu hoặc muốn reset toàn bộ database:

```powershell
cd backend
npm install
node database.js
cd ..
```

Không chạy `node database.js` trước mỗi test nếu muốn giữ dữ liệu cũ, vì lệnh này xóa và seed lại các bảng.

Tạo/cập nhật 500 tài khoản Load Test, tái tạo 500 dòng dữ liệu CSV và xóa trạng thái lockout của các tài khoản này:

```powershell
node HW\week09\TheDat\scripts\prepare-load-users.js
```

Khởi động backend trong một terminal riêng:

```powershell
node backend\server.js
```

Giữ terminal này mở. Trong terminal khác, kiểm tra API:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products
```

Kết quả mong đợi là HTTP `200` và danh sách sản phẩm JSON.

## 3. Chạy smoke test trước

Smoke test chỉ dùng 1 VU và 1 vòng để xác nhận CSV, JWT, request body, assertions và `orderId`. Vì test plan chính thức dùng giá trị trực tiếp, không dùng `-J...` để đổi profile. Khi cần smoke test lại, tạo một bản sao `.jmx`, đặt Ultimate Thread Group thành 1 VU, ramp-up 1 giây, hold 30 giây, ramp-down 1 giây và Loop Controller thành 1; không lưu đè lên file Load chính thức.

Chạy bản sao smoke bằng lệnh tương tự Load Test, nhưng truyền đường dẫn bản sao tại `-t` và dùng output có tiền tố `smoke_`.

Kiểm tra nhanh raw result:

```powershell
Import-Csv $jtl | Group-Object label | Select-Object Name,Count
Import-Csv $jtl | Where-Object success -eq 'false' | Select-Object label,responseCode,failureMessage
```

Smoke test hợp lệ khi sáu HTTP request đều xuất hiện và không có dòng `success=false`:

1. `01 POST Login`
2. `02 GET Products`
3. `03 POST Add to Cart`
4. `04 GET Cart`
5. `05 POST Checkout`
6. `06 GET Order Detail`

Raw `.jtl` còn có `E2E Purchase Workflow` là Transaction Controller. Phân tích request và E2E riêng để không đếm đôi sample.

## 4. Chuẩn bị lần Load Test chính thức

Trước khi chạy:

- Restart backend để xóa cart đang lưu trong RAM.
- Nếu vừa chạy lại `node database.js`, phải chạy lại `prepare-load-users.js`.
- Ghi commit SHA, số order hiện tại và thời gian bắt đầu.
- Mở Task Manager/Resource Monitor.
- Hiển thị tiến trình backend `node` và JMeter để chụp cùng một khung hình.
- Đảm bảo tên `.jmx` có ngày chạy thật. Nếu chạy ngày khác 2026-08-15, sao chép/đổi tên file theo `23127340_Load_YYYYMMDD.jmx`.
- Dùng tên output mới; JMeter yêu cầu thư mục HTML Report chưa tồn tại hoặc đang trống.

## 5. Chạy Load Test chính thức

Lệnh dưới đây tự dùng cấu hình đã lưu trong `.jmx`: 500 VU, ramp-up 120 giây, hold 300 giây và ramp-down 60 giây.

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/load/23127340_Load_$stamp.jtl"
$report = "HW/week09/TheDat/results/load/23127340_Load_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/load/23127340_Load_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/load" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Load_20260815.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Tổng profile kéo dài khoảng 480 giây. Không đóng terminal backend hoặc terminal JMeter giữa chừng.

Timestamp trong tên `$jtl`, `$jmeterLog` và `$report` giúp mỗi lần chạy có bộ artifact riêng, không ghi đè bằng chứng cũ.

## 6. Kiểm tra kết quả

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

## 7. Artifact phải giữ lại

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

## 8. Lỗi thường gặp

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
