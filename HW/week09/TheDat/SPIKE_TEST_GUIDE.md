# Hướng dẫn chạy Spike Test

## Artifact

- Test plan: `test-plans/23127340_Spike_20260816.jmx`
- Dữ liệu test: `test-data/accounts_spike.csv`
- Script chuẩn bị tài khoản: `scripts/prepare-spike-users.js`
- Report view riêng: `View Results Tree - All Samples` luôn bật và hiển thị cả sample thành công lẫn thất bại.

## Lịch Spike Test

| Giai đoạn          |  Thời gian |     Tổng VU |
| -------------------- | ----------: | -----------: |
| Baseline             | 00:00-01:00 |          100 |
| Tăng đột ngột    | 01:00-01:10 | 100 -> 1.000 |
| Giữ đỉnh          | 01:10-02:40 |        1.000 |
| Giảm tải           | 02:40-02:50 | 1.000 -> 100 |
| Theo dõi phục hồi | 02:50-04:50 |          100 |
| Kết thúc baseline  | 04:50-05:00 |     100 -> 0 |

Ultimate Thread Group dùng hai dòng cộng dồn: 100 VU nền chạy xuyên suốt và 900 VU bổ sung bắt đầu ở giây 60. Vì vậy đỉnh là 1.000 VU, không phải 1.100 VU.

## Trước mỗi lần chạy

1. Khởi động lại backend để xóa cart lưu trong RAM và đợi thông báo database đã reset/seed xong.
2. Sau khi backend đã chạy, chuẩn bị/reset 1.000 tài khoản Spike:

```powershell
node HW/week09/TheDat/scripts/prepare-spike-users.js
```

3. Xác nhận script báo 1.000 user và CSV có 1.000 dòng dữ liệu. Không restart backend sau bước này vì backend sẽ reset bảng users.
4. Kiểm tra backend và xác định PID đang giữ port 3000:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products
"PID: $((Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess)"
```

Kết quả API mong đợi là HTTP `200`. Dùng PID vừa hiển thị để chọn đúng tiến trình `node` trong Task Manager.

5. Giữ `View Results Tree` luôn bật và không chọn `Log/Display Only -> Errors`.

Theo quyết định human review, listener hiển thị toàn bộ success/error trong lần chạy Spike 1.000 VU; không disable hoặc chuyển sang chế độ Errors Only.

## Chạy chính thức bằng non-GUI

Chạy từ thư mục gốc repository:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.jtl"
$report = "HW/week09/TheDat/results/spike/23127340_Spike_${stamp}_html"
$jmeterLog = "HW/week09/TheDat/results/spike/23127340_Spike_$stamp.log"
New-Item -ItemType Directory -Force "HW/week09/TheDat/results/spike" | Out-Null
jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Spike_20260816.jmx" -l $jtl -j $jmeterLog -e -o $report
```

Luôn dùng tên output mới. Không ghi nối vào JTL cũ và không dùng lại thư mục HTML đã tồn tại.

## Bằng chứng cần chụp

- Baseline: terminal JMeter và CPU/RAM backend ở khoảng giây 30-50.
- Spike: terminal JMeter và CPU/RAM backend trong khoảng giây 80-140.
- Recovery: terminal JMeter và CPU/RAM backend trong khoảng giây 200-270.
- Kết thúc: terminal có dòng `end of run`.
- Ảnh hoặc lệnh chứng minh PID đang giữ cổng 3000.
- Raw `.jtl`, JMeter execution log `.log` và toàn bộ thư mục HTML Report của đúng lần chạy.

## Phân tích kết quả

Tách raw JTL thành ba phase baseline, spike và recovery. Báo cáo riêng E2E transaction và request con; không cộng transaction cha và sampler con như cùng một loại request.

Đánh giá:

- Peak p95 và error rate trong phase spike.
- Mức suy giảm throughput/latency so với baseline.
- Thời gian latency và error rate trở lại gần baseline sau khi giảm còn 100 VU.
- Backend còn hoạt động hay không và CPU/RAM có trở lại ổn định hay không.
