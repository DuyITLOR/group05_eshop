---
name: Boundary Value Analysis
description: Tạo test design bằng phương pháp Boundary Value Analysis(BVA)
---

# Boundary Value Analysis

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.

Khi tạo test design bằng phương pháp Boundary Value Analysis làm theo các bước này:

## 1. Xác định miền giá trị input hợp lệ
Xác định các thuộc tính biên (độ dài chuỗi, giá trị số, số lượng ký tự...) và miền giá trị hợp lệ `[Min, Max]`.

## 2. Thiết kế các test case (Lựa chọn 2-Point hoặc 3-Point BVA)
Lựa chọn áp dụng **2-Point BVA** hoặc **3-Point BVA** cho các biên của miền giá trị. Trong tài liệu test design bắt buộc phải **giải thích rõ lý do áp dụng**:

- **2-Point BVA**:
  - Các điểm biên kiểm thử: `{Min-1, Min}` cho biên dưới và `{Max, Max+1}` cho biên trên.
  - *Lý do áp dụng*: Phù hợp khi cần tối ưu số lượng test case, tiết kiệm thời gian/chi phí kiểm thử mà vẫn đảm bảo độ bao phủ các lỗi biên chuẩn (off-by-one errors) tại 2 phía của ranh giới hợp lệ.
- **3-Point BVA**:
  - Các điểm biên kiểm thử: `{Min-1, Min, Min+1}` cho biên dưới và `{Max-1, Max, Max+1}` cho biên trên.
  - *Lý do áp dụng*: Phù hợp với các chức năng có rủi ro cao, các thuật toán/ràng buộc dữ liệu phức tạp, cần kiểm tra sâu và toàn diện 3 điểm xung quanh ranh giới biên để phát hiện sớm lỗi ở cả bên trong lẫn bên ngoài khoảng hợp lệ.

## 3. Quy định về Expected Output trong BVA
- **Chỉ kiểm tra logic xử lý giá trị biên của dữ liệu đầu vào & đầu ra**: Expected Output chỉ tập trung vào logic kiểm soát dữ liệu, phản hồi nghiệp vụ (thông báo lỗi/thành công nghiệp vụ), kết quả sinh dữ liệu hoặc cập nhật CSDL.
- **TUYỆT ĐỐI KHÔNG kiểm tra yếu tố giao diện (UI)**: Không đưa các kiểm tra UI (như chỉ báo bước "Bước 1/2", hiển thị/màu sắc/vị trí nút bấm "Quay lại đăng nhập", layout...) vào Expected Output của test design BVA.

## Kết quả trả về
Trả về 1 file markdown có tên `BVA-<function>.md` trong thư mục `tests/test-design/`

## Sử dụng template
Làm theo template tại `.agents/skills/Boundary Value Analysis/resources/BVA_template.md`
Mẫu tham khảo tại `.agents/skills/Boundary Value Analysis/examples/BVA-FR03.md`

## Lưu ý về ID test case:
ID của mỗi test case phải là duy nhất và theo mẫu như sau:
- `<function>-<boundary>-<sequence>`

Trong đó:
- `<function>` là mã function cần test (VD: FR01, FR02, FR03)
- `<boundary>` là loại biên: 
  - `MINM`: biên dưới - 1
  - `MIN`: biên dưới
  - `MINP`: biên dưới + 1 (dành cho 3-Point BVA)
  - `MAXM`: biên trên - 1 (dành cho 3-Point BVA)
  - `MAX`: biên trên
  - `MAXP`: biên trên + 1
- `<sequence>` là số thứ tự của test case (bắt đầu từ 1)

Ví dụ: `FR01-MINM-01`, `FR01-MIN-01`, `FR01-MINP-01`, `FR01-MAXM-01`, `FR01-MAX-01`, `FR01-MAXP-01`, ...
