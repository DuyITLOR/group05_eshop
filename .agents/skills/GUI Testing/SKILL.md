---
name: GUI Testing
description: Thực hiện kiểm thử giao diện (GUI Testing) bao gồm tạo Checklist UI, phân tích kết quả test và xuất file Bug Report riêng lẻ.
---

# Hướng dẫn thực hiện GUI Testing

Khi người dùng yêu cầu thực hiện GUI Testing cho một chức năng, trang web hoặc UI component nào đó, hãy tuân thủ 3 bước tiêu chuẩn sau:

## Bước 1: Khởi tạo GUI Checklist
Tạo một file Markdown để ghi nhận danh sách kiểm tra (ví dụ: `ShoppingCart_GUI_Checklist.md`).
Sử dụng template chuẩn tại: `resources/GUI_Checklist_Template.md`
Template này bao gồm đầy đủ các mục:
- **Test Target & Environment**
- **GUI Checklist & Results** (chia thành 4 nhóm IA01 đến IA04)
- **Test Summary**

## Bước 2: Tiến hành Test và Điền kết quả
1. Kiểm tra từng tiêu chí trong Checklist bằng cách:
   - Tìm và phân tích mã nguồn UI (VD: soi mã nguồn `.jsx`, `.html` để tìm thẻ `<h1>`, kiểm tra class màu sắc như `text-red-500`, kiểm tra text tĩnh/động).
   - Hoặc truy cập ứng dụng (nếu có hướng dẫn sử dụng browser).
2. Thay đổi trạng thái ở cột `Results` thành `Passed` hoặc `Failed`.
3. Giải thích ngắn gọn ở cột `Notes` (VD: "Đang dùng H2 thay vì H1").
4. Cập nhật kết quả vào bảng **Test Summary**.

## Bước 3: Tạo Bug Reports cho các mục Failed
Đối với mỗi Test Case có kết quả `Failed`, hãy tạo **MỘT FILE RIÊNG BIỆT** trong thư mục chứa báo cáo lỗi (ví dụ: `bug reports/`).
- **Tên file:** Trùng với ID của test case (VD: `GUI-CART-001.md`).
- **Nội dung:** Bắt buộc tuân theo định dạng từ template chuẩn tại `resources/Bug_Report_Template.md`. Chú ý đánh giá đúng `Severity` (Minor / Major / Critical) và `Priority` (Low / Medium / High) cho từng bug.
