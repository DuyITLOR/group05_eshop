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

Đối với mỗi Test Case có kết quả `Failed`, hãy thực hiện các bước sau:

1. **Tạo File Báo cáo Lỗi (Bug Report File)**:
   - Tạo **MỘT FILE RIÊNG BIỆT** trong thư mục chứa báo cáo lỗi (ví dụ: `bug reports/`).
   - **Tên file:** Trùng với ID của test case (VD: `GUI-CART-001.md`).
   - **Nội dung:** Bắt buộc tuân theo định dạng từ template chuẩn tại `resources/Bug_Report_Template.md`. Chú ý đánh giá đúng `Severity` (Minor / Major / Critical) và `Priority` (Low / Medium / High) cho từng bug.

2. **Chụp Ảnh Màn hình minh họa lỗi (Bug Screenshot)**:
   - Sử dụng công cụ tự động hóa trình duyệt (Playwright / Puppeteer) hoặc công cụ chụp ảnh màn hình để chụp hình ảnh thực tế chứng minh bug trên ứng dụng.
   - Lưu ảnh vào thư mục `images` cùng cấp với thư mục báo cáo lỗi (ví dụ: `bug reports/images/<Bug_ID>.png`).
   - Nhúng ảnh vào file bug report bằng cú pháp markdown: `![Mô tả](images/<Bug_ID>.png)`.

3. **Tự động tạo Issue trên GitHub từ Bug Report**:
   - **Định dạng Tiêu đề Issue (Title)**:
     Format: `[HW03][BUG][screen: <screen>] [<Bug_ID>] <Short Bug Description>`
     *(ví dụ: `[HW03][BUG][screen: cart] [GUI-CART-001] Sử dụng sai thẻ tiêu đề (Heading) cho trang Giỏ hàng`)*
   - **Quy đổi Đường dẫn Hình ảnh (Image URL)**:
     Chuyển đổi các đường dẫn ảnh tương đối (`images/<filename>.png` hoặc `./images/...`) thành URL Raw trên GitHub của branch đang làm việc:
     `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path_to_bug_reports>/images/<filename>`
     *(ví dụ: `https://raw.githubusercontent.com/DuyITLOR/group05_eshop/HW02/Dat/HW/week07/The%20Dat/GUI_checklist/bug%20reports/images/GUI-CART-001.png`)*
   - **Gán Labels Chuẩn**:
     `type: bug`, `found-by: gui-checklist`, `severity: ...`, `priority: ...`, `gui`.
   - **Gửi Yêu cầu Đăng Issue**:
     Sử dụng GitHub REST API (`POST /repos/{owner}/{repo}/issues`) hoặc công cụ điều khiển GitHub để đăng Issue lên repository.

