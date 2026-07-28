# BÁO CÁO KẾT QUẢ KIỂM THỬ

## 1. Tổng quan Test Run
- **Môi trường**: PostgreSQL Serverless (Neon) / Node.js (Jest & Supertest)
- **Tổng số test**: 8 test cases
- **Pass / Fail**: 6 Pass / 2 Fail (Có phát hiện lỗi từ Database Schema & SP/Function)

## 2. Danh sách Lỗi Phát hiện

1. **`fn_calculate_discount`**
   - **Expected**: Với giảm giá phần trăm, hàm trả về kết quả không vượt quá `order_amount` (hoặc bị giới hạn < 100%).
   - **Actual**: Test case truyền vào `150` phần trăm. Kết quả trả về `300` lớn hơn `order_amount` là `200`.
   - **Root cause**: Logic trong hàm tính toán giảm giá `(value / 100) * order_amount` không có kiểm tra giới hạn chặn `value <= 100`.
   - **Fix đề xuất**: Thêm rẽ nhánh kiểm tra `IF value > 100 THEN RETURN order_amount;` hoặc báo lỗi.

2. **`sp_process_checkout`**
   - **Dữ liệu trước giao dịch**: `stock` của sản phẩm 1 là 10.
   - **Dữ liệu sau giao dịch**: Do sản phẩm 3 hết hàng, procedure ném ra Exception. Tuy nhiên `stock` của sản phẩm 1 bị trừ xuống còn 9 (không bị rollback).
   - **Root cause**: Trong vòng lặp `FOR`, procedure đã gọi `COMMIT;` trước khi `RAISE EXCEPTION`. Điều này phá vỡ tính nguyên tử (Atomicity) của transaction.
   - **Fix đề xuất**: Xóa các câu lệnh `COMMIT;` bên trong vòng lặp và trước Exception. PostgreSQL mặc định sẽ tự rollback mọi thay đổi nếu có lỗi chưa được bắt.

3. **`trg_prevent_negative_stock`**
   - **Tình trạng**: [Đạt - Bắt được lỗi chặn do constraint]
   - **Giải thích**: Tuy trigger `check_stock_before_update` chỉ gọi `RAISE NOTICE` chứ không ném exception. Tuy nhiên, bảng `products` có cài đặt constraint `CHECK (stock >= 0)`. Do đó, cập nhật tồn kho âm vẫn bị database từ chối.
   - **Root cause (Trigger logic)**: Thiếu lệnh `RAISE EXCEPTION` để ngăn chặn trực tiếp từ trigger.
   - **Fix đề xuất**: Sửa thành `RAISE EXCEPTION 'Stock cannot be negative';`

## 3. Kết quả Hiệu năng

- **Trước index**: Execution Time ~0.080 ms; Scan: Seq Scan trên orders; Buffers: shared hit=2
- **Sau index**: Execution Time ~0.075 ms; Scan: Seq Scan trên orders (vẫn chọn Seq Scan); Buffers: shared hit=2
- **Nhận xét về PostgreSQL planner**:
  Với khoảng 200 bản ghi, PostgreSQL nhận thấy kích thước bảng quá nhỏ, việc đọc toàn bộ dữ liệu qua Seq Scan tuần tự sẽ tối ưu hơn so với việc tốn thêm chi phí tra cứu trong cấu trúc cây Index (Index Scan). Planner luôn tính toán cost (chi phí) để lựa chọn phương án ít tốn CPU/I/O nhất. 

## 4. Nhật ký MCP
- **Prompt**: "Liệt kê danh sách bảng, khóa ngoại, ràng buộc, trigger, function và stored procedure trong schema hiện tại. Với mỗi đối tượng, nêu tên, bảng liên quan và mục đích chính."
- **Tóm tắt phản hồi**: (AI MCP phân tích schema từ Neon và trả về danh sách các bảng như `users`, `orders`, `products`, `coupons` cùng các trigger, function hiện hành).
- **Cách kiểm chứng**: So sánh chéo kết quả AI cung cấp với script thiết lập DB ban đầu. Ngoài ra, việc thiết lập bộ test suite `db-tests.test.js` đã chứng minh thực tế những lỗ hổng logic mà AI trích xuất có tồn tại.

## 5. Kết luận và Khuyến nghị
- Schema cơ sở dữ liệu đã bao phủ đầy đủ các ràng buộc (Foreign Key, Check Constraint, UNIQUE) nhưng vẫn tồn tại lỗi ở tầng Logic (Stored Procedures/Functions).
- Cần chú ý cẩn trọng việc lạm dụng `COMMIT` trong vòng lặp vòng (sp_process_checkout), tránh phá vỡ giao dịch và mất tính nhất quán dữ liệu (ACID).
- Luôn sử dụng Parameterized Query trên API Backend để chống lại các lỗ hổng SQL Injection tiềm tàng.
