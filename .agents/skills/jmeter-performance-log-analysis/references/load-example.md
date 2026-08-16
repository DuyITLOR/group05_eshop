# Ví dụ Load Test: workflow mua hàng có xác thực (Bài mẫu E-Shop TheDat)

Chỉ dùng làm ví dụ cấu trúc và quy trình. Không tái sử dụng các giá trị đo được làm threshold cho hệ thống khác.

## 1. Scenario

- **Công cụ:** Apache JMeter 5.6.3 với Ultimate Thread Group (`kg.apc.jmeter.threads.UltimateThreadGroup` từ plugin `jmeter-plugins-casutg`).
- **Workflow (6 bước):** `01 POST Login` -> `02 GET Products` -> `03 POST Add Cart` -> `04 GET Cart` -> `05 POST Checkout` -> `06 GET Order Detail`.
- **Lịch tải:** 500 Virtual Users (VU), initial delay 0s, ramp-up 120s, hold 300s, ramp-down 60s. Tổng thời gian profile: ~480s (~8 phút).
- **Think time:** Uniform Random Timer (constant offset 1000 ms + random delay tối đa 2000 ms, tức 1–3s) trước mỗi bước sau Login.
- **Dữ liệu test:** `test-data/accounts_load.csv` gồm 500 dòng độc lập cho 500 VU. Mỗi dòng chứa 7 trường: `email,password,productId,productName,price,quantity,shippingAddress`.
- **Cơ chế nạp CSV:** Nạp 1 lần cho từng thread bằng JSR223 PreProcessor dựa trên `ctx.getThreadNum()`, resolve đường dẫn tương đối qua `FileServer.getFileServer().getBaseDir()`.
- **Output:** File log JTL riêng, thư mục HTML Report, log engine JMeter `.log` và ảnh Resource Monitor (PID Node.js backend port 3000).

## 2. Correlation và assertion

- `01 POST Login`: Gửi JSON `email`, `password`. JSON Extractor trích xuất `token` (`$.token`) và `user_id` (`$.user.id`). Response Assertion kiểm tra HTTP 200 và JWT token hợp lệ.
- `02 GET Products`: Trích xuất `product_id`, `product_name`, `price` từ danh sách. Assertion kiểm tra danh sách sản phẩm trả về thành công.
- `03 POST Add Cart`: Gửi `productId`, `quantity`. Assertion kiểm tra thông báo thêm giỏ hàng thành công.
- `04 GET Cart`: Kiểm tra giỏ hàng có chứa đúng `productId`, `quantity` và `price` đã chọn.
- `05 POST Checkout`: Gửi thông tin giỏ hàng và `shippingAddress`. Trích xuất `order_id` (`$.order.id`) và `order_total`. Assertion kiểm tra HTTP 200/201 và đơn hàng tạo thành công.
- `06 GET Order Detail`: Gọi API `/api/orders/${order_id}`. Assertion kiểm tra chi tiết đơn hàng, danh sách item và tổng tiền khớp dữ liệu đặt mua.

Với workflow phụ thuộc, `ThreadGroup.on_sample_error` được đặt thành `startnextloop` để bỏ qua các request sau nếu một bước bị lỗi.

## 3. Lệnh thực thi 1 dòng (Single-line Commands)

Mọi thao tác được thực hiện từ thư mục gốc repository bằng các lệnh 1 dòng:

### Cài đặt & Chuẩn bị môi trường:
```powershell
cd backend; npm install; cd ..
```

### Khởi động backend (terminal 1):
```powershell
node backend\server.js
```

### Chuẩn bị 500 user, reset lockout và tái tạo CSV (terminal 2):
```powershell
node HW\week09\TheDat\scripts\prepare-load-users.js
```

### Health check & lấy PID:
```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/products
"PID: $((Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess)"
```

### Lệnh chạy Load Test chính thức (JMeter CLI 1 dòng):
```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"; $jtl = "HW/week09/TheDat/results/load/23127340_Load_$stamp.jtl"; $report = "HW/week09/TheDat/results/load/23127340_Load_${stamp}_html"; $log = "HW/week09/TheDat/results/load/23127340_Load_$stamp.log"; New-Item -ItemType Directory -Force "HW/week09/TheDat/results/load" | Out-Null; jmeter -n -t "HW/week09/TheDat/test-plans/23127340_Load_20260816.jmx" -l $jtl -j $log -e -o $report
```

### Mở HTML Report mới nhất (1 dòng):
```powershell
$targetReport = if ($report -and (Test-Path "$report\index.html")) { "$report\index.html" } else { (Get-ChildItem -Directory "HW/week09/TheDat/results/load/*_html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName + "\index.html" }; Invoke-Item $targetReport
```

### Phân tích nhanh lỗi từ raw JTL (1 dòng):
```powershell
$targetJtl = if ($jtl -and (Test-Path $jtl)) { $jtl } else { (Get-ChildItem "HW/week09/TheDat/results/load/*.jtl" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName }; $data = Import-Csv $targetJtl; $data | Group-Object success | Select-Object Name,Count; $data | Where-Object { $_.success -eq 'false' } | Group-Object label,responseCode,failureMessage | Sort-Object Count -Descending | Select-Object Count,Name
```

## 4. Bài học từ review

- **Backend Startup Reset:** Do backend tự reset DB khi khởi động, luôn chạy `prepare-load-users.js` SAU KHI backend đã bật xong.
- **Xóa Account Lockout:** Script chuẩn bị user phải reset cả `login_attempts = 0` và `locked_until = NULL` để đảm bảo 500 VU không bị chặn login từ các run trước.
- **Đường dẫn CSV:** Resolve tương đối từ vị trí file `.jmx` thông qua `FileServer.getFileServer().getBaseDir()` để chạy bằng JMeter GUI lẫn CLI đều chính xác.
- **Lệnh 1 dòng:** Luôn format câu lệnh PowerShell trên 1 dòng nối nhau bằng `;` để tránh lỗi enter sớm hoặc mất biến `$jtl`/`$report` giữa các phiên terminal.
- **Tách riêng E2E Transaction:** Khi tổng hợp metric, không cộng gộp mẫu của sampler cha `E2E Purchase Workflow` với 6 sampler con.
