# Hướng dẫn chạy Stress Test

## Artifact

- Test plan: `test-plans/23127340_Stress_20260816.jmx`
- Dữ liệu test: `test-data/accounts_stress.csv`
- Script chuẩn bị tài khoản: `scripts/prepare-stress-users.js`
- Listener theo yêu cầu: `Aggregate Report - All Samples`, luôn bật

## Lịch Stress Test

| Giai đoạn | Thời gian đã chạy | VU mục tiêu |
| ----------- | --------------------: | ------------: |
| Ramp        |           00:00-01:00 |      0 -> 500 |
| Giữ tải   |           01:00-03:00 |           500 |
| Ramp        |           03:00-04:00 |    500 -> 650 |
| Giữ tải   |           04:00-06:00 |           650 |
| Ramp        |           06:00-07:00 |    650 -> 800 |
| Giữ tải   |           07:00-09:00 |           800 |
| Ramp        |           09:00-10:00 |  800 -> 1.000 |
| Giữ tải   |           10:00-12:00 |         1.000 |
| Ramp-down   |           12:00-13:00 |    1.000 -> 0 |

Các dòng trong Ultimate Thread Group là những nhóm user được cộng dồn. Nhóm đã khởi động trước đó tiếp tục hoạt động đến giai đoạn ramp-down chung, nhờ vậy tạo đúng số VU mục tiêu trong bảng.

`Aggregate Report` luôn được bật và nhận tất cả sample thành công lẫn thất bại trong lần chạy chính thức. Không disable listener hoặc bật bộ lọc chỉ lỗi.

## Trước mỗi lần chạy chính thức

1. Khởi động lại backend để xóa cart đang lưu trong RAM.
2. Đợi backend báo database đã khởi tạo, sau đó tạo/reset tài khoản Stress:

```powershell
node HW/week09/TheDat/scripts/prepare-stress-users.js
```

3. Xác nhận script báo đã chuẩn bị 1.000 user và 1.000 dòng tài khoản CSV. Không restart backend sau bước này vì backend sẽ reset bảng users.
4. Kiểm tra backend và xác định PID đang giữ port 3000:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products
"PID: $((Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess)"
```

Kết quả API mong đợi là HTTP `200`. Dùng PID vừa hiển thị để chọn đúng tiến trình `node` trong Task Manager.

## Chạy non-GUI

Chạy từ thư mục gốc repository:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.jtl"
$report = "HW/week09/TheDat/results/stress/23127340_Stress_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/stress" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Stress_20260816.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Luôn dùng tên output mới cho từng lần chạy. Không ghi nối vào JTL cũ và không dùng lại thư mục HTML đã có dữ liệu.

## Theo dõi và điều kiện dừng

Trong khi chạy non-GUI, theo dõi JMeter summariser trong terminal cùng PID, CPU và RAM của backend trong Task Manager. Sau khi chạy, dùng raw JTL, HTML Report và Aggregate Report để tính p95, error rate, throughput và xác định bậc giữ tải ổn định cuối cùng cùng bậc lỗi đầu tiên.

Các tiêu chí đánh giá sau khi chạy:

- Error rate lớn hơn 5%.
- p95 lớn hơn 5 giây trong một giai đoạn giữ tải.
- Backend bị crash.
- Máy bắt đầu dùng swap hoặc không phản hồi.

Trong lúc chạy, chỉ dừng sớm khi backend crash, timeout/lỗi diễn ra liên tục hoặc máy bắt đầu dùng swap/không phản hồi. Dùng `shutdown.cmd` trong thư mục `bin` của JMeter để dừng có kiểm soát. Không gọi `shutdown.exe` của Windows.

Nếu có thể, chụp bằng chứng tại bậc ổn định cao nhất và bậc lỗi đầu tiên. Giữ JMX, raw `.jtl`, JMeter execution log `.log`, toàn bộ thư mục HTML Report, ảnh, ghi chú reset và thông số phần cứng.

## Phân tích theo giai đoạn

Trong Task 2, tính metric riêng cho từng khoảng giữ tải. Loại các khoảng ramp khi xác định breaking point. Báo cáo E2E transaction riêng với các request con.
