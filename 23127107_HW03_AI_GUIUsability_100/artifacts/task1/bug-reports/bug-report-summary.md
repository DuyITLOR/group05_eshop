# Tổng hợp Bug Report

| Bug ID | Tiêu đề | Checklist IDs | Module | Severity | Priority | Xác nhận sinh viên | GitHub Issue |
| ------ | ------- | ------------- | ------ | -------- | -------- | ------------------ | ------------ |
| BUG-001 | Địa chỉ HTML-like bị render thành markup | GUI-009 | Admin Orders | High | P2 | Đã xác nhận | Chưa tạo |
| BUG-002 | Doanh thu đã giao trên Dashboard bị tính gấp đôi | GUI-012, GUI-052 | Admin Dashboard | High | P1 | Đã xác nhận | Chưa tạo |
| BUG-003 | Trường Email không có nhãn hiển thị bền vững | GUI-014 | Admin Login | Medium | P3 | Đã xác nhận | Chưa tạo |
| BUG-004 | Trường bắt buộc rỗng vẫn gửi request đăng nhập | GUI-019 | Admin Login | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-005 | Đăng nhập cho phép gửi trùng khi request đang pending | GUI-017 | Admin Login | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-006 | Cập nhật trạng thái cho phép gửi request trùng khi pending | GUI-026 | Admin Orders | High | P2 | Đã xác nhận | Chưa tạo |
| BUG-007 | Điều hướng sidebar không thể truy cập bằng bàn phím | GUI-033, GUI-034, GUI-035, GUI-057 | Admin Navigation | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-008 | Loading dữ liệu ban đầu không phân biệt được với dữ liệu bằng 0 | GUI-040 | Admin Dashboard | Medium | P3 | Đã xác nhận | Chưa tạo |
| BUG-009 | Response Orders rỗng không có empty-state message | GUI-041 | Admin Orders | Medium | P3 | Đã xác nhận | Chưa tạo |
| BUG-010 | Lỗi fetch dữ liệu không có feedback hiển thị hoặc accessible | GUI-042, GUI-055 | Admin Dashboard and Orders | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-011 | Đơn đã hủy vẫn có action chuyển sang đã giao | GUI-047, GUI-049, GUI-051 | Admin Orders | High | P1 | Đã xác nhận | Chưa tạo |
| BUG-012 | Focus bị mất sau khi cập nhật trạng thái inline | GUI-038, GUI-056 | Admin Orders | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-013 | Tên accessible của row action lặp không có ngữ cảnh đơn hàng độc lập | GUI-054 | Admin Orders | Medium | P3 | Đã xác nhận | Chưa tạo |
| BUG-014 | Thông báo lỗi cập nhật trạng thái không nêu đơn bị ảnh hưởng | GUI-059 | Admin Orders | Medium | P2 | Đã xác nhận | Chưa tạo |
| BUG-015 | Session hết hạn chuyển về Login mà không có giải thích | GUI-043 | Admin Session | Low | P3 | Đã xác nhận | Chưa tạo |
| BUG-016 | Trường tổng thanh toán cho phép chỉnh sửa tùy ý — lỗi bảo mật nghiêm trọng | FIND-02 (Task 2) | Checkout | Critical | P0 | Pending | Chưa tạo |
| BUG-017 | Không có phản hồi tức thời sau khi thêm sản phẩm vào giỏ hàng | FIND-01 (Task 2) | Cart | High | P1 | Pending | Chưa tạo |
| BUG-018 | Giỏ hàng không được xóa sau khi thanh toán thành công | FIND-04 (Task 2) | Cart / Checkout | High | P1 | Pending | Chưa tạo |
| BUG-019 | Thêm cùng một sản phẩm nhiều lần tạo ra nhiều dòng riêng biệt | FIND-05 (Task 2) | Cart | Medium | P2 | Pending | Chưa tạo |

## Thống kê

- Tổng bug đã xác nhận: 15 (Task 1) + 4 mới (Task 2) = **19 bug**.
- Bug Task 1 — Severity: Critical 0; High 4; Medium 10; Low 1.
- Bug Task 2 — Severity: Critical 1 (BUG-016); High 2 (BUG-017, BUG-018); Medium 1 (BUG-019).
- Tổng hợp — Severity: Critical 1; High 6; Medium 11; Low 1.
- Priority tổng: P0 1; P1 4; P2 9; P3 5; P4 0.
- Bug từ Task 1 (Live SUT/manual GUI checklist): 15.
- Bug từ Task 2 (Usability test): 4.
- Accessibility bug: 5; Responsive bug: 0; Security bug: 1.

