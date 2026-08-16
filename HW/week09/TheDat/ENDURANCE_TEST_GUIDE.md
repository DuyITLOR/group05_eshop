# Hướng dẫn chạy Endurance Test 500 VU

## Cấu hình

- Test plan: `test-plans/23127340_Endurance_20260815.jmx`
- Dữ liệu: `test-data/accounts_endurance.csv`
- Script chuẩn bị: `scripts/prepare-endurance-users.js`
- Ramp-up: 120 giây
- Giữ 500 VU: 600 giây (10 phút)
- Ramp-down: 60 giây
- Tổng thời gian: 780 giây (13 phút)
- Listener: `Aggregate Report - All Samples`, luôn bật

500 VU là mức tải cần kiểm chứng, chưa được gọi là giới hạn tối đa trước khi có kết quả thực nghiệm.

## Chuẩn bị

Khởi động lại backend để xóa cart trong RAM, đợi database reset/seed xong, sau đó chạy từ thư mục gốc repository:

```powershell
node HW/week09/TheDat/scripts/prepare-endurance-users.js
```

Script phải báo có 500 tài khoản và CSV phải có 500 dòng dữ liệu. Không restart backend sau bước này vì backend sẽ reset bảng users. Chạy smoke 1 VU × 1 loop trước lần chạy chính thức.

## Chạy non-GUI

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/endurance/23127340_Endurance_$stamp.jtl"
$report = "HW/week09/TheDat/results/endurance/23127340_Endurance_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/endurance/23127340_Endurance_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/endurance" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Endurance_20260815.jmx" -l $jtl -j $jmeterLog -e -o $report
```

`Aggregate Report - All Samples` luôn được bật và nhận tất cả sample thành công lẫn thất bại trong smoke test và full Endurance 500 VU. Không disable listener hoặc bật bộ lọc chỉ lỗi. Raw JTL và HTML Report vẫn là artifact chính dùng để phân tích.

## Bằng chứng cần lưu

- PID sở hữu port 3000.
- Terminal JMeter và CPU/RAM của đúng tiến trình backend trong giai đoạn giữ 500 VU.
- Ảnh kết thúc có `end of run`.
- Raw `.jtl`, `.log` và toàn bộ thư mục HTML Report.

## Kết luận threshold

Báo cáo riêng giai đoạn giữ tải từ giây 120 đến giây 720:

- Error rate.
- p95 E2E và p95 từng API.
- Throughput/RPS ổn định.
- CPU và RAM cao nhất; RAM có tăng liên tục hay không.

Nếu 500 VU vẫn ổn định, kết luận hệ thống chịu được **ít nhất 500 VU** trong 10 phút. Không gọi đó là giới hạn tối đa nếu chưa kiểm tra tải cao hơn.
