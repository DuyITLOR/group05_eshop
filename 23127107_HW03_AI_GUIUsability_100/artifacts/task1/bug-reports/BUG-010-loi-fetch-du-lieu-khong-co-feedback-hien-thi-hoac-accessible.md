# [BUG][Admin Dashboard and Orders] Lỗi fetch dữ liệu không có feedback hiển thị hoặc accessible

## Found by Test Case

- GUI-042
- GUI-055

## Related Requirements

FR-13, FR-18; SCOPE-05, SCOPE-08, SCOPE-21

## Severity / Priority

Medium / P2

Lỗi fetch không có feedback hiển thị lẫn live-region, ảnh hưởng cả admin và người dùng assistive technology.

## Environment

- SUT: EShop
- Module: Admin Dashboard and Orders
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

Orders fetch được mock trả HTTP 500.

## Steps to Reproduce

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ khi cần.
2. Mở Dashboard/Orders và kiểm tra error message cùng aria-live/role.
3. Quan sát hành vi giao diện.

## Expected Result

Phải có error/recovery message và live-region phù hợp.

## Actual Result

Không có error/recovery message, role=alert, role=status hay aria-live; Dashboard vẫn là 0.

## Reproducibility

Cần điều kiện mock; một controlled run.

## Impact

Admin và người dùng assistive technology không nhận được feedback lỗi.

## Evidence

![Fetch failure không có visible recovery feedback](../evidence/GUI-042-observed.png)

![Không có live-region semantics cho fetch failure](../evidence/GUI-055-observed.png)

## Execution Notes

Controlled mocked response
> Mock chỉ được dùng để tạo trạng thái đầu vào có kiểm soát. Kết luận bug dựa trên phản hồi của GUI, không phải tuyên bố rằng backend thật đã trả lỗi này.

## Related Checklist Result

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |
| GUI-042 | Failed | Mocked fetch 500 tạo 0 visible error/recovery message; Dashboard vẫn hiển thị nội dung 0. |
| GUI-055 | Failed | Không tìm thấy dynamic live-region/status element sau mocked fetch error (count 0). |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:admin-dashboard-and-orders`
- `severity:medium`
- `priority:p2`

## Human Confirmation

- Confirmed by student: Yes
- Confirmation date: 2026-08-02
- Evidence reviewed: GUI-042-observed.png, GUI-055-observed.png
- GitHub issue: Not created
