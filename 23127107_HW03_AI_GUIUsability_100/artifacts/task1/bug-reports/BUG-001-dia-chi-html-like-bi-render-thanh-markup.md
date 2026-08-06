# [BUG][Admin Orders] Địa chỉ HTML-like bị render thành markup

## Found by Test Case

- GUI-009

## Related Requirements

FR-18; SCOPE-12

## Severity / Priority

High / P2

Địa chỉ từ dữ liệu đơn hàng bị diễn dịch thành markup thay vì văn bản an toàn; có ảnh hưởng trực tiếp đến tính toàn vẹn giao diện và cách trình bày dữ liệu.

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

Địa chỉ `<b>Địa chỉ thử</b>`

## Steps to Reproduce

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ khi cần.
2. Mở Đơn hàng và quan sát ô địa chỉ.
3. Quan sát hành vi giao diện.

## Expected Result

Địa chỉ phải hiển thị là văn bản nguyên dạng.

## Actual Result

Ô địa chỉ tạo một phần tử `<b>` thật.

## Reproducibility

Luôn tái hiện được (quan sát trên Live SUT).

## Impact

Nội dung địa chỉ không tin cậy bị diễn dịch thành markup.

## Evidence

![Địa chỉ HTML-like được render thành phần tử `<b>`](../evidence/GUI-009-observed.png)

## Execution Notes

Live SUT
## Related Checklist Result

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |
| GUI-009 | Failed | Địa chỉ HTML-like tạo một phần tử `<b>` thật trong ô địa chỉ. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:admin-orders`
- `severity:high`
- `priority:p2`

## Human Confirmation

- Confirmed by student: Yes
- Confirmation date: 2026-08-02
- Evidence reviewed: GUI-009-observed.png
- GitHub issue: Not created
