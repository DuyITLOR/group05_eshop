---
name: Decision table & Pairwise testing
description: Tạo test design bằng phương pháp decision table & Pairwise testing
---

# Decision table & Pairwise testing

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Kiểm tra xem nếu chức năng đó không thể dùng phương pháp decision table testing => Báo không thể áp dụng được + lý do => Kết thúc cuộc trò chuyện

## Các bước thực hiện

### Bước 1: Xác định điều kiện & kết quả
1. **Điều kiện (Conditions)**: Liệt kê tất cả các điều kiện ảnh hưởng đến kết quả, cùng các giá trị có thể có (thường là True/False, hoặc nhiều loại giá trị)
2. **Kết quả (Actions)**: Liệt kê tất cả các kết quả/hành động có thể xảy ra

### Bước 2: Xây dựng Decision Table đầy đủ
1. Tổng số rules (cột) = Tích số lượng giá trị của tất cả các điều kiện
2. Liệt kê tất cả tổ hợp điều kiện theo thuật toán phân bổ đều (xem template)
3. Xác định kết quả cho mỗi tổ hợp điều kiện dựa trên đặc tả
4. Đánh dấu các tổ hợp không thể xảy ra trong thực tế là **Impossible**

### Bước 3: Rút gọn Decision Table
1. **Loại bỏ** các rules đánh dấu Impossible
2. **Gộp** các rules có cùng kết quả: nếu hai rules chỉ khác nhau ở 1 điều kiện mà kết quả giống nhau, gộp thành 1 rule với điều kiện đó là "don't care" (ký hiệu `-`)
3. Đánh số lại các rules sau khi rút gọn

### Bước 4: Pairwise Testing (nếu cần)

> **Khi nào cần áp dụng Pairwise?**
> Sau khi rút gọn Decision Table ở Bước 3, kiểm tra xem trong bảng rút gọn có rule nào chứa ký hiệu `-` (don't care) hay không.
> - Nếu **KHÔNG có** dấu `-` nào → **KHÔNG cần** Pairwise. Giữ nguyên kết quả từ Bước 3.
> - Nếu **CÓ** dấu `-` → **CẦN** áp dụng Pairwise để mở rộng các ô `-` thành giá trị cụ thể.

**Quy trình Pairwise:**
1. Tìm tất cả các rules có chứa `-` trong bảng rút gọn
2. Liệt kê tất cả các **cặp điều kiện** có thể (pairs) từ các điều kiện trong rule đó
3. Với mỗi rule có `-`, tạo ra **tập con test case nhỏ nhất** sao cho mọi cặp giá trị giữa 2 điều kiện bất kỳ đều xuất hiện ít nhất 1 lần
4. Thay thế rule gốc (có `-`) bằng tập test case pairwise vừa tạo
5. Các rules không có `-` thì giữ nguyên

## Kết quả trả về
Trả về 1 file markdown có tên `DTT-<function>.md` trong thư mục `tests/test-design/`

## Sử dụng template
Làm theo template tại `.agents/skills/Decision table & Parwise Testing/resources/DTT_template.md`
Mẫu tham khảo tại `.agents/skills/Decision table & Parwise Testing/examples/DTT-FR09.md`

## Lưu ý:
1. ID của mỗi test case phải là duy nhất và theo mẫu như sau: `<function>-DTT-<sequence>`

Trong đó:
- `<function>` là mã function cần test (VD: FR01, FR02, FR09)
- `<sequence>` là số thứ tự của test case (bắt đầu từ 01)

Ví dụ: `FR09-DTT-01`, `FR09-DTT-02`, `FR02-DTT-01`, ...

2. Mỗi tổ hợp điều kiện phải được xác định kết quả dựa trên đặc tả trong README.md
3. Nếu một tổ hợp điều kiện không thể xảy ra trong thực tế, đánh dấu là Impossible và loại bỏ khi rút gọn
4. Khi có nhiều kết quả đồng thời xảy ra cho 1 rule, đánh dấu X ở tất cả các hàng kết quả tương ứng
5. Pairwise chỉ áp dụng cho các rules có dấu `-`. Nếu bảng rút gọn không có `-` nào thì bỏ qua Bước 4
