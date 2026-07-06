# Bug ID: `FR10-bug-02`

## Bug description:
Hệ thống cho phép người dùng (User) tự ý hủy đơn hàng khi đơn hàng đã chuyển sang trạng thái đang giao hàng (`shipping`). Đặc tả FR-10 quy định rõ: khi đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy, chỉ Admin mới có thể thao tác.

## Test case coverage: 
- `TC-FR10-07` (Người dùng tự hủy đơn hàng thất bại khi đơn hàng đang ở trạng thái shipping — Use Case Testing EF2)

## Preconditions: 
1. Người dùng đã đăng nhập bằng tài khoản User thường (`test@eshop.com` / `Test1234!`).
2. Đã có một đơn hàng của User này đang ở trạng thái `shipping`.

## Test steps: 
1. Sử dụng tài khoản User gửi yêu cầu hủy đơn hàng qua API `PUT /api/orders/:id/cancel` hoặc bấm nút Hủy đơn hàng trên giao diện (nếu có).
2. Kiểm tra trạng thái đơn hàng.

## Expected results: 
1. Hệ thống chặn yêu cầu hủy đơn hàng từ User thường, trả về mã lỗi HTTP 400 Bad Request kèm thông điệp lỗi phù hợp.
2. Trạng thái đơn hàng trong DB giữ nguyên là `shipping`.

## Actual results: 
1. Hệ thống cho phép hủy thành công với mã phản hồi HTTP 200 OK và thông báo `Order canceled successfully`.
2. Trạng thái đơn hàng bị cập nhật sang `canceled` trái phép.

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `HW/week05/Dat/bugs/FR10/images/FR10-bug-02.png`
- ![Mô tả ảnh](./images/FR10-bug-02.png)
