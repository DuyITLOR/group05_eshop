# Bug ID: `FR10-bug-02`

## Bug description:
Hệ thống cho phép User tự ý hủy đơn hàng khi đã chuyển sang trạng thái đang giao hàng (`shipping`). Trái ngược với đặc tả (khi đơn hàng đã ở trạng thái shipping, User không được phép tự hủy — chỉ Admin mới có thể thao tác).

## Test case coverage: 
- `TC-FR10-12` (Chặn User/Admin hủy đơn hàng khi đã đi giao — State Transition Testing FR10-STT-12)

## Preconditions: 
1. Đăng nhập tài khoản User test (`test@eshop.com` / `Test1234!`).
2. Có sẵn một đơn hàng test của User này ở trạng thái `shipping`.

## Test steps: 
1. Gửi yêu cầu hủy đơn hàng qua endpoint `PUT /api/orders/:id/cancel` với header Authorization hợp lệ của User.

## Expected results: 
1. Hệ thống từ chối yêu cầu, trả về HTTP status 400 Bad Request.
2. Response body chứa thông báo lỗi về việc không thể hủy đơn hàng đang giao.
3. Trạng thái đơn hàng trong DB giữ nguyên là `shipping`.

## Actual results: 
1. Yêu cầu thành công với mã phản hồi HTTP 200 OK.
2. Trạng thái đơn hàng được chuyển sang `canceled` thành công.
3. Response body: `{"message":"Order canceled successfully"}`.

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `HW/week05/Dat/State Transition Testing/bugs/FR10/images/FR10-bug-02.png`
- ![Mô tả ảnh](./images/FR10-bug-02.png)
