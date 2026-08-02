# [BUG][Admin Session] Session hết hạn chuyển về Login mà không có giải thích

## Found by Test Case

- GUI-043

## Related Requirements

FR-12; SCOPE-04

## Severity / Priority

Low / P3

Người dùng bị chuyển về Login mà không được giải thích lý do cần xác thực lại.

## Environment

- SUT: EShop
- Module: Admin Session
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

Admin session bị từ chối và data request trả 403.

## Steps to Reproduce

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ khi cần.
2. Mở Web Admin với session bị từ chối.
3. Quan sát hành vi giao diện.

## Expected Result

Login view phải giải thích cần xác thực lại.

## Actual Result

UI trở về Login sau 403 nhưng không có giải thích session-expired.

## Reproducibility

Cần điều kiện mock; một controlled run.

## Impact

Admin không hiểu nguyên nhân workflow bị gián đoạn.

## Evidence

![Login sau session bị từ chối không có giải thích](../evidence/GUI-043-manual-review.png)

## Execution Notes

Manual visual and keyboard review
## Related Checklist Result

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |
| GUI-043 | Failed | UI quay về Admin Login sau 403, không có giải thích session-expired riêng. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:admin-session`
- `severity:low`
- `priority:p3`

## Human Confirmation

- Confirmed by student: Yes
- Confirmation date: 2026-08-02
- Evidence reviewed: GUI-043-manual-review.png
- GitHub issue: Not created
