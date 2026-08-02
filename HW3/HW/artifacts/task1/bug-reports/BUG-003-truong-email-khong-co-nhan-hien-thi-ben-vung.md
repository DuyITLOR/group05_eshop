# [BUG][Admin Login] Trường Email không có nhãn hiển thị bền vững

## Found by Test Case

- GUI-014

## Related Requirements

FR-12; SCOPE-01

## Severity / Priority

Medium / P3

Thiếu nhãn hiển thị bền vững làm giảm khả năng hiểu và khả năng tiếp cận của form đăng nhập.

## Environment

- SUT: EShop
- Module: Admin Login
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

Web Admin ở màn hình Login.

## Steps to Reproduce

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ khi cần.
2. Quan sát trường Email trước và sau khi nhập dữ liệu.
3. Quan sát hành vi giao diện.

## Expected Result

Phải có nhãn Email hiển thị bền vững.

## Actual Result

Không có label hiển thị; chỉ có placeholder.

## Reproducibility

Luôn tái hiện được (quan sát trên Live SUT).

## Impact

Người dùng có thể mất ngữ cảnh trường nhập.

## Evidence

![Form Login không có nhãn Email bền vững](../evidence/GUI-014-observed.png)

## Execution Notes

Live SUT
## Related Checklist Result

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |
| GUI-014 | Failed | Trường Email hiển thị nhưng form có 0 label hiển thị. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:admin-login`
- `severity:medium`
- `priority:p3`

## Human Confirmation

- Confirmed by student: Yes
- Confirmation date: 2026-08-02
- Evidence reviewed: GUI-014-observed.png
- GitHub issue: Not created
