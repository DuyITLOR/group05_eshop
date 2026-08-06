# [BUG][Admin Orders] Thông báo lỗi cập nhật trạng thái không nêu đơn bị ảnh hưởng

## Found by Test Case

- GUI-059

## Related Requirements

FR-10, FR-18; SCOPE-21

## Severity / Priority

Medium / P2

Thông báo update failure không xác định order bị ảnh hưởng, gây khó retry khi có nhiều thao tác.

## Environment

- SUT: EShop
- Module: Admin Orders
- Browser: Playwright Chromium (không ghi nhận browser version)
- OS: Windows 11 Home Single Language, build 26200
- Viewport: 1440 x 900
- Zoom: 100%
- Admin URL: `http://localhost:5174`
- Backend URL: `http://localhost:3000`
- Dataset/fixture: fixture 7 đơn hàng thật khi áp dụng; controlled response khi nêu bên dưới
- Ngày thực thi: 2026-08-01
- SUT commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## Preconditions

Status update của một row được mock HTTP 500.

## Steps to Reproduce

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ khi cần.
2. Kích hoạt action và đọc alert lỗi.
3. Quan sát hành vi giao diện.

## Expected Result

Feedback phải xác định order bị ảnh hưởng hoặc có row context tương đương.

## Actual Result

Badge cũ vẫn giữ, nhưng native alert không có row/order context.

## Reproducibility

Cần điều kiện mock; một controlled run.

## Impact

Admin không biết đơn nào cần retry.

## Evidence

![Update failure alert không có order context](../evidence/GUI-059-observed.png)

## Execution Notes

Controlled mocked response
> Mock chỉ được dùng để tạo trạng thái đầu vào có kiểm soát. Kết luận bug dựa trên phản hồi của GUI, không phải tuyên bố rằng backend thật đã trả lỗi này.

## Related Checklist Result

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |
| GUI-059 | Failed | Mocked update 500 giữ nguyên badge cũ và hiển thị native alert không có row/order context. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:admin-orders`
- `severity:medium`
- `priority:p2`

## Human Confirmation

- Confirmed by student: Yes
- Confirmation date: 2026-08-02
- Evidence reviewed: GUI-059-observed.png
- GitHub issue: Not created
