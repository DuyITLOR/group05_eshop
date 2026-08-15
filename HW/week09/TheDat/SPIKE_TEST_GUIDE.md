# Hướng dẫn chạy Spike Test

## Artifact

- Test plan: `test-plans/23127340_Spike_20260815.jmx`
- Dữ liệu test: `test-data/accounts_spike.csv`
- Script chuẩn bị tài khoản: `scripts/prepare-spike-users.js`
- Report view riêng: `View Results Tree` được bật và cấu hình `Errors` only khi chạy chính thức.

## Lịch Spike Test

| Giai đoạn | Thời gian | Tổng VU |
|---|---:|---:|
| Baseline | 00:00-01:00 | 10 |
| Tăng đột ngột | 01:00-01:10 | 10 -> 120 |
| Giữ đỉnh | 01:10-02:40 | 120 |
| Giảm tải | 02:40-02:50 | 120 -> 10 |
| Theo dõi phục hồi | 02:50-04:50 | 10 |
| Kết thúc baseline | 04:50-05:00 | 10 -> 0 |

Ultimate Thread Group dùng hai dòng cộng dồn: 10 VU nền chạy xuyên suốt và 110 VU bổ sung bắt đầu ở giây 60. Vì vậy đỉnh là 120 VU, không phải 130 VU.

## Trước mỗi lần chạy

1. Khởi động lại backend để xóa cart lưu trong RAM.
2. Chuẩn bị/reset 120 tài khoản Spike:

```powershell
node HW/week09/TheDat/scripts/prepare-spike-users.js
```

3. Smoke test với 1 VU, 1 loop; tạm bỏ chọn `Errors` trong `View Results Tree` để kiểm tra cả request thành công, response, correlation và assertion.
4. Trả lại lịch Spike chuẩn và chọn lại `Log/Display Only -> Errors` trước khi chạy chính thức để giảm lượng dữ liệu listener giữ trong RAM.

## Chạy chính thức bằng non-GUI

Chạy từ thư mục gốc repository:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.jtl"
$report = "HW/week09/TheDat/results/spike/23127340_Spike_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/spike" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Spike_20260815.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Luôn dùng tên output mới. Không ghi nối vào JTL cũ và không dùng lại thư mục HTML đã tồn tại.

## Bằng chứng cần chụp

- Baseline: terminal JMeter và CPU/RAM backend ở khoảng giây 30-50.
- Spike: terminal JMeter và CPU/RAM backend trong khoảng giây 80-140.
- Recovery: terminal JMeter và CPU/RAM backend trong khoảng giây 200-270.
- Kết thúc: terminal có dòng `end of run`.
- Ảnh hoặc lệnh chứng minh PID đang giữ cổng 3000.

## Phân tích kết quả

Tách raw JTL thành ba phase baseline, spike và recovery. Báo cáo riêng E2E transaction và request con; không cộng transaction cha và sampler con như cùng một loại request.

Đánh giá:

- Peak p95 và error rate trong phase spike.
- Mức suy giảm throughput/latency so với baseline.
- Thời gian latency và error rate trở lại gần baseline sau khi giảm còn 10 VU.
- Backend còn hoạt động hay không và CPU/RAM có trở lại ổn định hay không.
