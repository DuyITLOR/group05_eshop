# Hướng dẫn chạy Stress Test

## Artifact

- Test plan: `test-plans/23127340_Stress_20260815.jmx`
- Dữ liệu test: `test-data/accounts_stress.csv`
- Script chuẩn bị tài khoản: `scripts/prepare-stress-users.js`
- Listener theo yêu cầu: Aggregate Report

## Lịch Stress Test

| Giai đoạn | Thời gian đã chạy | VU mục tiêu |
|---|---:|---:|
| Ramp | 00:00-00:30 | 0 -> 20 |
| Giữ tải | 00:30-02:30 | 20 |
| Ramp | 02:30-03:00 | 20 -> 40 |
| Giữ tải | 03:00-05:00 | 40 |
| Ramp | 05:00-05:30 | 40 -> 80 |
| Giữ tải | 05:30-07:30 | 80 |
| Ramp | 07:30-08:00 | 80 -> 120 |
| Giữ tải | 08:00-10:00 | 120 |
| Ramp | 10:00-10:30 | 120 -> 160 |
| Giữ tải | 10:30-12:30 | 160 |
| Ramp-down | 12:30-13:00 | 160 -> 0 |

Các dòng trong Ultimate Thread Group là những nhóm user được cộng dồn. Nhóm đã khởi động trước đó tiếp tục hoạt động đến giai đoạn ramp-down chung, nhờ vậy tạo đúng số VU mục tiêu trong bảng.

## Trước mỗi lần chạy chính thức

1. Khởi động lại backend để xóa cart đang lưu trong RAM.
2. Đợi backend báo database đã khởi tạo, sau đó tạo/reset tài khoản Stress:

```powershell
node HW/week09/TheDat/scripts/prepare-stress-users.js
```

3. Xác nhận script báo đã chuẩn bị 160 user và 160 dòng tài khoản CSV.
4. Smoke test toàn bộ workflow trước khi chạy Stress chính thức.

## Chạy non-GUI

Chạy từ thư mục gốc repository:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.jtl"
$report = "HW/week09/TheDat/results/stress/23127340_Stress_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/stress/23127340_Stress_$stamp.log"
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Stress_20260815.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Luôn dùng tên output mới cho từng lần chạy. Không ghi nối vào JTL cũ và không dùng lại thư mục HTML đã có dữ liệu.

## Theo dõi và điều kiện dừng

Theo dõi Aggregate Report/raw JTL cùng PID, CPU và RAM của backend. Ghi lại bậc giữ tải ổn định cuối cùng và bậc đầu tiên vi phạm một trong các tiêu chí đã công bố:

- Error rate lớn hơn 5%.
- p95 lớn hơn 5 giây liên tục.
- Backend bị crash.
- Máy bắt đầu dùng swap hoặc không phản hồi.

Nếu điều kiện dừng xảy ra liên tục, dùng `shutdown.cmd` trong thư mục `bin` của JMeter để dừng có kiểm soát. Không gọi `shutdown.exe` của Windows.

Nếu có thể, chụp bằng chứng tại bậc ổn định cao nhất và bậc lỗi đầu tiên. Giữ JMX, raw JTL, JMeter log, toàn bộ thư mục HTML, ảnh, ghi chú reset và thông số phần cứng.

## Phân tích theo giai đoạn

Trong Task 2, tính metric riêng cho từng khoảng giữ tải. Loại các khoảng ramp khi xác định breaking point. Báo cáo E2E transaction riêng với các request con.

