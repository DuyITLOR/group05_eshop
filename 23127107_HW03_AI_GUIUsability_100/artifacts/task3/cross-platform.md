# Task 3 — Cross-Platform Test Filtering Analysis

## Mục tiêu

Phân tích 60 checklist item của Task 1 và xác định tập con tối thiểu cần test lại trên Firefox (Windows) và Android (Chrome) trong bối cảnh cross-browser / cross-platform GUI testing. Việc test lại **toàn bộ** 60 item là không cần thiết vì nhiều item kiểm tra hành vi logic (backend-driven) hoặc yêu cầu công cụ đặc biệt (screen reader, DevTools) — những thứ không thay đổi giữa các browser engine.

---

## Nguyên tắc lọc

Cross-platform GUI testing tập trung vào **rendering**, **layout**, **interaction** và **platform-specific behavior** — KHÔNG phải kiểm tra lại logic nghiệp vụ (business logic) hay API response. Các tiêu chí loại bỏ:

| Ký hiệu | Tiêu chí loại bỏ                       | Giải thích                                                                                                                                |
| ------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **E1**  | **Backend-driven logic**               | Kết quả chỉ phụ thuộc API response, không phụ thuộc browser engine. Nếu Chrome gọi API đúng → Firefox cũng gọi API đúng.                  |
| **E2**  | **Mocked/controlled state**            | Test yêu cầu mock network (throttle, error 500, empty response) — kết quả phụ thuộc mock setup, không phụ thuộc browser.                  |
| **E3**  | **Screen reader / Accessibility Tree** | Yêu cầu công cụ chuyên dụng (NVDA, VoiceOver, Accessibility Inspector). Đây là accessibility testing, không phải cross-browser rendering. |
| **E4**  | **Duplicated coverage**                | Đã được bao phủ bởi một test case khác trong cùng nhóm.                                                                                   |
| **E5**  | **Non-visual / semantic-only**         | Kiểm tra programmatic name, ARIA attribute — không thay đổi giữa browser.                                                                 |

---

## Phân tích chi tiết 60 Checklist Items

### ✅ GIỮ LẠI — Test trên Cross-Platform (21 items)

| Checklist ID | Tên                                   | Lý do giữ                                                           | Nhóm UC |
| ------------ | ------------------------------------- | ------------------------------------------------------------------- | ------- |
| **GUI-001**  | Page heading                          | Rendering heading text, font                                        | UC-06   |
| **GUI-002**  | Sidebar/main overlap                  | Layout engine khác nhau có thể gây overlap                          | UC-06   |
| **GUI-003**  | Table header                          | Rendering table header columns                                      | UC-06   |
| **GUI-004**  | Table row alignment                   | Cell alignment cross-browser                                        | UC-06   |
| **GUI-006**  | Long owner name                       | Text wrapping/truncation khác giữa Gecko vs Blink                   | UC-07   |
| **GUI-008**  | Address variants                      | Long text handling, empty fallback rendering                        | UC-08   |
| **GUI-009**  | HTML-like address                     | XSS/escape rendering — bug đã phát hiện, cần verify cross-browser   | UC-09   |
| **GUI-010**  | Status badge labels                   | Badge rendering, color, label text                                  | UC-10   |
| **GUI-011**  | Table responsive (1024×768, 768×1024) | **Rủi ro cao**: responsive layout khác nhau giữa engine             | UC-13   |
| **GUI-014**  | Email input label                     | Form element rendering                                              | UC-01   |
| **GUI-015**  | Password masking                      | Input type=password behavior                                        | UC-01   |
| **GUI-019**  | Empty form validation                 | Browser native validation vs custom JS — **khác nhau giữa browser** | UC-16   |
| **GUI-020**  | Xác nhận button visibility            | Button rendering trong pending row                                  | UC-10   |
| **GUI-022**  | Giao hàng button visibility           | Button rendering trong confirmed row                                | UC-10   |
| **GUI-027**  | Default Dashboard view                | Post-login routing + rendering                                      | UC-03   |
| **GUI-028**  | Sidebar navigation to Orders          | Click/navigation behavior                                           | UC-05   |
| **GUI-029**  | Sidebar selected state                | CSS :active/:focus styling cross-browser                            | UC-05   |
| **GUI-039**  | Sidebar narrow viewport               | **Rủi ro cao**: responsive sidebar behavior                         | UC-13   |
| **GUI-044**  | Login error feedback                  | Alert/message rendering cross-browser                               | UC-16   |
| **GUI-046**  | Pending→Confirmed feedback            | Representative mutation, status badge update rendering              | UC-15   |
| **GUI-057**  | Zoom 200% reflow                      | **Rủi ro rất cao**: zoom behavior khác Blink vs Gecko vs mobile     | UC-14   |

### ❌ LOẠI BỎ — Không cần test cross-platform (39 items)

| Checklist ID | Tên                                               | Lý do loại                                                                                    | Tiêu chí                  |
| ------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| **GUI-005**  | ID cell format                                    | Giá trị text thuần, không phụ thuộc browser rendering                                         | E1                        |
| **GUI-007**  | Tổng tiền format                                  | Number formatting bằng JS — không phụ thuộc engine                                            | E1                        |
| **GUI-012**  | Revenue card                                      | Backend logic (doubled revenue bug) — E1, không liên quan cross-browser                       | E1                        |
| **GUI-013**  | Order count card                                  | Giá trị số từ API — đọc đúng trên mọi browser                                                 | E1                        |
| **GUI-016**  | Email input giữ value                             | Standard input behavior, không khác giữa browser                                              | E4 (đã cover bởi GUI-014) |
| **GUI-017**  | Login button single submit                        | Race condition/double-click — logic JS, không phải rendering                                  | E1                        |
| **GUI-018**  | Form submit bằng Enter                            | Standard form behavior — tất cả browser đều hỗ trợ Enter submit                               | E4                        |
| **GUI-021**  | Hủy button pending                                | Đã cover bởi GUI-020 (cùng row, cùng rendering context)                                       | E4                        |
| **GUI-023**  | Hủy button confirmed                              | Đã cover bởi GUI-022                                                                          | E4                        |
| **GUI-024**  | Hoàn thành button shipping                        | Tương tự GUI-020/GUI-022 — chỉ khác label text                                                | E4                        |
| **GUI-025**  | Action buttons keyboard                           | Keyboard accessibility — cần test riêng, nhưng đã biết Failed từ Task 1                       | E3+E5                     |
| **GUI-026**  | Action pending state                              | Double-request prevention — JS logic, không phải rendering                                    | E2                        |
| **GUI-030**  | Sidebar Dashboard item                            | Ngược lại GUI-028, cùng cơ chế — đã cover                                                     | E4                        |
| **GUI-031**  | Dashboard selected state round trip               | Cùng cơ chế CSS với GUI-029                                                                   | E4                        |
| **GUI-032**  | Sidebar label mapping                             | Text matching — không phụ thuộc browser                                                       | E1                        |
| **GUI-033**  | Sidebar keyboard navigation                       | Đã biết Failed (tabIndex -1) từ Task 1 — bug không phụ thuộc browser                          | E5                        |
| **GUI-034**  | Focus indicator                                   | Cần keyboard + visual inspection — đã biết Failed                                             | E3+E5                     |
| **GUI-035**  | Keyboard focus order                              | Cần keyboard traversal — đã biết partially failed                                             | E3                        |
| **GUI-036**  | Logout                                            | Backend-driven (clear token → redirect) — không phải rendering                                | E1                        |
| **GUI-037**  | Session boundary (token expired)                  | Backend logic — same JS code on all browsers                                                  | E1                        |
| **GUI-038**  | View/focus after update                           | Focus management — JS logic, không phải rendering difference                                  | E1+E5                     |
| **GUI-040**  | Initial data loading                              | **Mocked** delayed response — kết quả phụ thuộc mock, không phụ thuộc browser                 | E2                        |
| **GUI-041**  | Empty order table                                 | **Mocked** empty response                                                                     | E2                        |
| **GUI-042**  | Data-fetch error feedback                         | **Mocked** 500 error                                                                          | E2                        |
| **GUI-043**  | Unauthorized feedback                             | Backend 401/403 handling — JS logic                                                           | E1                        |
| **GUI-045**  | Non-admin rejection                               | Backend role check — JS logic                                                                 | E1                        |
| **GUI-047**  | Pending→Canceled feedback                         | Cùng cơ chế rendering với GUI-046, chỉ khác status value                                      | E4                        |
| **GUI-048**  | Confirmed→Shipping feedback                       | Cùng cơ chế rendering với GUI-046                                                             | E4                        |
| **GUI-049**  | Confirmed→Canceled feedback                       | Cùng cơ chế rendering với GUI-046                                                             | E4                        |
| **GUI-050**  | Shipping→Delivered feedback                       | Cùng cơ chế rendering với GUI-046                                                             | E4                        |
| **GUI-051**  | Final-state no action                             | Đã cover bởi GUI-010 (badge labels) + GUI-020/022 (button visibility logic)                   | E4                        |
| **GUI-052**  | Dashboard delta after update                      | Backend-driven revenue calculation — đã biết bug, không phải rendering                        | E1                        |
| **GUI-053**  | Table semantics (screen reader)                   | Accessibility Tree inspection — không phải cross-browser rendering                            | E3                        |
| **GUI-054**  | Repeated action button names                      | Accessible name — programmatic, không phải visual rendering                                   | E5                        |
| **GUI-055**  | Dynamic state announcements                       | Screen reader live region — accessibility tool required                                       | E3                        |
| **GUI-056**  | Focus recovery                                    | Focus management JS logic — không phụ thuộc browser engine                                    | E5                        |
| **GUI-058**  | Narrow viewport with long data (320×800, 375×812) | Đã cover bởi GUI-011 (responsive) + GUI-006/008 (long data) — mobile width là Android concern | E4                        |
| **GUI-059**  | Update server error                               | **Mocked** update 500                                                                         | E2                        |
| **GUI-060**  | Success persistence after refresh                 | Backend data persistence — JS fetch logic                                                     | E1                        |

---

## Tổng kết phân loại

| Nhóm                                    | Số lượng | Tỷ lệ |
| --------------------------------------- | -------- | ----- |
| ✅ **Giữ lại cho cross-platform**       | **21**   | 35%   |
| ❌ Loại bỏ — Backend logic (E1)         | 15       | 25%   |
| ❌ Loại bỏ — Mocked state (E2)          | 5        | 8%    |
| ❌ Loại bỏ — Screen reader/A11y (E3/E5) | 8        | 13%   |
| ❌ Loại bỏ — Duplicated coverage (E4)   | 11       | 18%   |
| **Tổng**                                | **60**   | 100%  |

---

## Gộp 21 items thành Use Cases cho Cross-Platform

| UC ID     | Tên                              | Checklist IDs đã lọc               | Số items | Platform risk             |
| --------- | -------------------------------- | ---------------------------------- | -------- | ------------------------- |
| **UC-01** | Login Page Rendering             | GUI-014, GUI-015                   | 2        | Medium                    |
| **UC-03** | Login → Dashboard                | GUI-027                            | 1        | Low                       |
| **UC-05** | Dashboard → Orders Navigation    | GUI-028, GUI-029                   | 2        | Medium                    |
| **UC-06** | Orders Table Structure           | GUI-001, GUI-002, GUI-003, GUI-004 | 4        | Medium                    |
| **UC-07** | Long Owner Name                  | GUI-006                            | 1        | High (text wrapping)      |
| **UC-08** | Address Variants                 | GUI-008                            | 1        | High (text wrapping)      |
| **UC-09** | HTML-like Address (XSS)          | GUI-009                            | 1        | High (known bug)          |
| **UC-10** | Status Badge + Action Visibility | GUI-010, GUI-020, GUI-022          | 3        | Medium                    |
| **UC-13** | Responsive Layout                | GUI-011, GUI-039                   | 2        | **Very High**             |
| **UC-14** | Zoom 200%                        | GUI-057                            | 1        | **Very High**             |
| **UC-15** | Representative Mutation          | GUI-046                            | 1        | Low                       |
| **UC-16** | Empty Form + Error               | GUI-019, GUI-044                   | 2        | High (browser validation) |

**Tổng: 12 Use Cases covering 21 checklist items** (giảm 65% so với 60 items gốc)

---

## Phân bổ theo Platform

### Firefox (Windows) — 12 UCs, 21 items

Tất cả 12 UC trên đều cần chạy trên Firefox vì Firefox dùng Gecko engine (khác Blink của Chrome).

### Android (Chrome) — 8 UCs, 15 items (ưu tiên mobile-risk)

Trên Android Chrome (cùng Blink engine với desktop Chrome), chỉ cần tập trung vào **mobile-specific risks**:

| UC ID     | Lý do cần test trên Android                        |
| --------- | -------------------------------------------------- |
| **UC-01** | Touch input, viewport nhỏ, keyboard ảo             |
| **UC-03** | Login flow trên mobile                             |
| **UC-05** | Sidebar behavior trên mobile (hamburger? overlap?) |
| **UC-06** | Table rendering trên màn hình nhỏ                  |
| **UC-07** | Long text wrapping trên viewport hẹp               |
| **UC-08** | Long address trên viewport hẹp                     |
| **UC-10** | Touch target size cho action buttons               |
| **UC-13** | **Critical**: Responsive layout trên real device   |

> [!NOTE]
> Android Chrome dùng cùng Blink engine với desktop Chrome, nên **rendering bugs** sẽ giống nhau. Chỉ cần focus vào **viewport size**, **touch interaction**, và **responsive breakpoint** differences.

---

## Tổng kết

| Metric                          | Giá trị                |
| ------------------------------- | ---------------------- |
| Task 1 total items              | 60                     |
| Cross-platform items (filtered) | **21**                 |
| Giảm                            | **65%**                |
| Firefox UCs                     | 12                     |
| Android UCs                     | 8                      |
| Estimated effort savings        | ~60-70% thời gian test |

---

---

# Draft kết quả cũ - không dùng cho bài nộp

Dựa trên danh sách 12 Use Cases (lọc từ 60 items gốc), phần dưới đây là bảng nháp cũ. Nó có các trạng thái mâu thuẫn với phần ghi chú và không phân biệt được lỗi SUT chung với khác biệt nền tảng. Bảng này được giữ lại để truy vết; chỉ dùng phần **Kết quả thực thi đã rà soát** ở cuối file cho bài nộp.

_Ghi chú: Kết quả hiển thị bên dưới dựa trên đánh giá rủi ro và các lỗi đã biết từ Task 1. Các ô "Pending" là phần bạn (người test) sẽ cập nhật sau khi đối chiếu với ảnh chụp màn hình._

## Bảng so sánh 3 nền tảng

| UC ID     | Tên Use Case                  | Chrome (Windows) | Firefox (Windows) | Safari (iOS) | So sánh / Ghi chú                                                                                  |
| --------- | ----------------------------- | ---------------- | ----------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| **UC-01** | Login Page Rendering          | Passed           | Pass              | Pass         | Form hiển thị tốt trên các nền tảng, layout không vỡ. Chờ xác nhận Safari.                         |
| **UC-03** | Login → Dashboard             | Passed           | Pass              | Failed       | Điều hướng mượt mà, layout tổng quan ổn định.                                                      |
| **UC-05** | Dashboard → Orders Navigation | Passed           | Pass              | Failed       | Chuyển trang thành công, sidebar hover/active state có thể khác nhẹ về CSS mặc định.               |
| **UC-06** | Orders Table Structure        | Failed           | Failed            | Failed       | Rendering table chuẩn trên Desktop. Safari di động cần cuộn ngang (horizontal scroll).             |
| **UC-07** | Long Owner Name               | Failed           | Failed            | Failed       | Text wrapping hoạt động ổn định giữa Blink và Gecko.                                               |
| **UC-08** | Address Variants              | Failed           | Failed            | Failed       | Xử lý text dài và empty fallback đồng nhất.                                                        |
| **UC-09** | HTML-like Address (XSS)       | Failed           | Failed            | Failed       | Lỗi bảo mật hiển thị thẻ HTML trực tiếp (phát hiện từ Task 1). Bị trên cả Chrome và Firefox.       |
| **UC-10** | Status Badge + Action Vis.    | Passed           | Passed            | Passed       | Badge color và nút bấm hiển thị đồng nhất. Touch target trên Safari cần kiểm tra.                  |
| **UC-13** | Responsive Layout             | Passed           | Passed            | Passed       | Hoạt động tốt khi thu nhỏ cửa sổ. Đặc biệt quan trọng để verify trên màn hình thật của Safari iOS. |
| **UC-14** | Zoom 200%                     | Failed           | Failed            | Failed       | Cơ chế zoom browser trên PC. Safari iOS dùng pinch-zoom nên không so sánh chung.                   |
| **UC-15** | Representative Mutation       | Passed           | Passed            | Passed       | API call và cập nhật DOM (Pending -> Confirmed). Behavior giống nhau do dùng chung logic.          |
| **UC-16** | Empty Form + Error Feedback   | Passed           | Passed            | Passed       | Browser native validation popup có thể khác biệt xíu về UI, nhưng chức năng đều chặn submit.       |

## Nhận xét so sánh Cross-Platform (Dự kiến)

1. **Chrome vs Firefox (Desktop)**:
   - **Đồng nhất cao**: Hầu hết các UI layout (CSS Flexbox/Grid) và behavior đều hoạt động tương đương trên Blink (Chrome) và Gecko (Firefox).
   - **Điểm yếu chung**: Lỗi XSS (UC-09) xảy ra ở cả hai trình duyệt do đây là lỗi thiếu escape đầu ra từ mã nguồn React, không phụ thuộc engine.
2. **Desktop vs Mobile (Safari iOS)**:
   - **Tương tác**: Trải nghiệm sử dụng bảng (Table) trên UC-06 và UC-10 sẽ khác biệt lớn nhất do giới hạn màn hình nhỏ, đòi hỏi phải cuộn ngang và kích thước điểm chạm (touch target) phải đủ lớn.
   - **Responsive (UC-13)**: Việc ẩn/hiện sidebar dạng hamburger menu trên Safari iOS là rủi ro chính cần verify qua ảnh chụp thực tế.

## Minh chứng (Evidence)

Dưới đây là các ảnh chụp màn hình chứng minh kết quả thực thi trên 3 nền tảng.

### UC-01: Login Page Rendering

| Chrome                                                                                                                                          | Firefox                                                                                                                                            | Safari                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC-01.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-01.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-01.jpg) |

### UC-16: Empty Form + Error Feedback

| Chrome                                                                                                                                                    | Firefox                                                                                                                                                      | Safari                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-U16-login-empty.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-U16-login-empty.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-16.jpg) |

### UC-03: Login → Dashboard

| Chrome                                                                                                                                          | Firefox                                                                                                                                            | Safari                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chorme-UC-03.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-03.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-03.jpg) |

### UC-05, UC-06, UC-07: Navigation, Table Structure, Long Owner Name

| Chrome                                                                                                                                             | Firefox                                                                                                                                                  | Safari                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC-5-6-7.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-05-06-07.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-05-06-07.jpg) |

### UC-08: Address Variants

| Chrome                                                                                                                                         | Firefox                                                                                                                                           | Safari                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC08.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC08.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-08.jpg) |

### UC-09: HTML-like Address (XSS)

| Chrome                                                                                                                                          | Firefox                                                                                                                                           | Safari                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC-09.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC09.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-09.jpg) |

### UC-10: Status Badge + Action Vis.

| Chrome                                                                                                                                              | Firefox                                                                                                                                                 | Safari                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC10-15_1.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-10-15_1.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-10-15_1.jpg) |

### UC-13: Responsive Layout

| Chrome                                                                                                                                          | Firefox                                                                                                                                            | Safari                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC-13.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-13.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-13.jpg) |

### UC-14: Zoom 200%

| Chrome                                                                                                                                                  | Firefox                                                                                                                                                    | Safari                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC14-zoom-200.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC14-zoom-200.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-14.jpg) |

### UC-15: Representative Mutation

| Chrome                                                                                                                                            | Firefox                                                                                                                                              | Safari                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Chrome](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/chrome-windows/chrome-UC-15_2.png) | ![Firefox](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/firefox-windows/firefox-UC-15_2.png) | ![Safari](file:///d:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task3/evidence/Safari-iphone/safari-UC-15_2.jpg) |

---

# Kết quả thực thi đã rà soát - Task 3

## Phạm vi và phương pháp

Task 3 kiểm tra giao diện Admin Order Management tại `localhost:5174` trên ba nền tảng có evidence sẵn: Chrome trên Windows, Firefox trên Windows và Safari trên iPhone qua URL tunnel. Mỗi nhóm ảnh có overlay `23127107@student.hcmus.edu.vn`; các use case được lấy từ 21 checklist item đã lọc ở phần đầu tài liệu.

`Passed` hoặc `Failed` dưới đây mô tả kết quả quan sát từ evidence hiện có. `N/A` nghĩa là phép kiểm không tương đương giữa nền tảng, không phải Passed. Những kết luận này cần sinh viên Human Review trước khi đưa vào báo cáo cuối.

## Nền tảng và bằng chứng nhận diện

| Platform ID | Nền tảng quan sát được | URL quan sát được                  | Identity overlay | Giới hạn metadata                                                 |
| ----------- | ---------------------- | ---------------------------------- | ---------------- | ----------------------------------------------------------------- |
| CP-01       | Chrome trên Windows    | `http://localhost:5174`            | Có               | Phiên bản Chrome/Windows không được ghi trong ảnh.                |
| CP-02       | Firefox trên Windows   | `http://localhost:5174`            | Có               | Phiên bản Firefox/Windows không được ghi trong ảnh.               |
| CP-03       | Safari trên iPhone     | `5z41m4sp-5174.asse.devtunnels.ms` | Có               | Ảnh cho thấy Safari/iPhone nhưng chưa nêu model và phiên bản iOS. |

## Ma trận kết quả

| UC ID | Use case                         | Chrome Windows | Firefox Windows | Safari iPhone | Kết luận quan sát                                                                                                           |
| ----- | -------------------------------- | -------------- | --------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| UC-01 | Login page rendering             | Passed         | Passed          | Passed        | Login form hiển thị và có thể nhận biết trên cả ba nền tảng.                                                                |
| UC-03 | Login → Dashboard                | Passed         | Passed          | Passed        | Evidence hiển thị trạng thái sau đăng nhập/điều hướng; không có khác biệt platform-specific được quan sát.                  |
| UC-05 | Dashboard → Orders navigation    | Passed         | Passed          | Passed        | Orders view và item `Đơn hàng` đang active được quan sát trên cả ba nền tảng.                                               |
| UC-06 | Orders table structure           | Failed         | Failed          | Failed        | Bảng rộng hơn viewport và cần cuộn ngang; trên iPhone nội dung bị giới hạn rõ rệt.                                          |
| UC-07 | Long owner name                  | Failed         | Failed          | Failed        | Dữ liệu owner dài làm kéo rộng/cắt bố cục bảng, không phải khác biệt riêng một browser.                                     |
| UC-08 | Address variants                 | Failed         | Failed          | Failed        | Address dài/biến thể fallback làm layout bảng quá rộng trên cả ba nền tảng.                                                 |
| UC-09 | HTML-like address                | Failed         | Failed          | Failed        | Evidence và kết quả Task 1 cho thấy lỗi hiển thị dữ liệu HTML-like là lỗi SUT chung, không phải lỗi engine riêng.           |
| UC-10 | Status badge + action visibility | Passed         | Passed          | Passed        | Badge trạng thái và action button vẫn nhận biết được ở evidence hiện có.                                                    |
| UC-13 | Responsive layout                | Failed         | Failed          | Failed        | Ở width hẹp, sidebar giữ chiều rộng lớn và bảng bị cắt/overflow; evidence có trên Chrome, Firefox và Safari iPhone.         |
| UC-14 | Zoom 200%                        | Failed         | Failed          | N/A           | Chrome và Firefox có overflow ở 200%; pinch zoom của Safari iPhone không tương đương browser zoom desktop.                  |
| UC-15 | Representative mutation          | Passed         | Passed          | Passed        | Evidence hậu cập nhật hiển thị trạng thái/action tương ứng trên ba nền tảng.                                                |
| UC-16 | Empty form + error feedback      | Passed         | Passed          | Passed        | Cả ba nền tảng đều hiển thị phản hồi lỗi; hình thức alert/native prompt khác nhau theo browser là khác biệt chấp nhận được. |

## Kết luận so sánh

- Có ba nền tảng được bao phủ bằng evidence: Chrome/Windows, Firefox/Windows và Safari/iPhone.
- Không thấy lỗi chỉ xuất hiện trên một browser trong phạm vi use case đã chạy. Các lỗi UC-06, UC-07, UC-08, UC-09 và UC-13 lặp lại trên nhiều nền tảng, nên được phân loại là lỗi SUT chung.
- Khác biệt có chủ ý/không so sánh trực tiếp: UI alert hoặc validation native của browser và cơ chế Safari pinch zoom so với desktop browser zoom.
- Không tuyên bố Task 3 hoàn toàn rubric-complete cho đến khi bổ sung metadata rõ ràng về phiên bản browser/OS và model/phiên bản iOS cho CP-03 vào evidence hoặc session note.

## Evidence index

| Evidence group                            | Chrome Windows                                                                                                                                 | Firefox Windows                                                                                                                                      | Safari iPhone                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Login rendering (UC-01)                   | [chrome-UC-01.png](./evidence/chrome-windows/chrome-UC-01.png)                                                                                 | [firefox-UC-01.png](./evidence/firefox-windows/firefox-UC-01.png)                                                                                    | [safari-UC-01.jpg](./evidence/Safari-iphone/safari-UC-01.jpg)                                                                              |
| Login error (UC-16)                       | [chrome-U16-login-empty.png](./evidence/chrome-windows/chrome-U16-login-empty.png)                                                             | [firefox-U16-login-empty.png](./evidence/firefox-windows/firefox-U16-login-empty.png)                                                                | [safari-UC-16.jpg](./evidence/Safari-iphone/safari-UC-16.jpg)                                                                              |
| Navigation and long data (UC-03/05/06/07) | [chorme-UC-03.png](./evidence/chrome-windows/chorme-UC-03.png), [chrome-UC-5-6-7.png](./evidence/chrome-windows/chrome-UC-5-6-7.png)           | [firefox-UC-03.png](./evidence/firefox-windows/firefox-UC-03.png), [firefox-UC-05-06-07.png](./evidence/firefox-windows/firefox-UC-05-06-07.png)     | [safari-UC-03.jpg](./evidence/Safari-iphone/safari-UC-03.jpg), [safari-UC-05-06-07.jpg](./evidence/Safari-iphone/safari-UC-05-06-07.jpg)   |
| Address / HTML-like (UC-08/09)            | [chrome-UC08.png](./evidence/chrome-windows/chrome-UC08.png), [chrome-UC-09.png](./evidence/chrome-windows/chrome-UC-09.png)                   | [firefox-UC08.png](./evidence/firefox-windows/firefox-UC08.png), [firefox-UC09.png](./evidence/firefox-windows/firefox-UC09.png)                     | [safari-UC-08.jpg](./evidence/Safari-iphone/safari-UC-08.jpg), [safari-UC-09.jpg](./evidence/Safari-iphone/safari-UC-09.jpg)               |
| Status / mutation (UC-10/15)              | [chrome-UC10-15_1.png](./evidence/chrome-windows/chrome-UC10-15_1.png), [chrome-UC-15_2.png](./evidence/chrome-windows/chrome-UC-15_2.png)     | [firefox-UC-10-15_1.png](./evidence/firefox-windows/firefox-UC-10-15_1.png), [firefox-UC-15_2.png](./evidence/firefox-windows/firefox-UC-15_2.png)   | [safari-UC-10-15_1.jpg](./evidence/Safari-iphone/safari-UC-10-15_1.jpg), [safari-UC-15_2.jpg](./evidence/Safari-iphone/safari-UC-15_2.jpg) |
| Responsive / zoom (UC-13/14)              | [chrome-UC-13.png](./evidence/chrome-windows/chrome-UC-13.png), [chrome-UC14-zoom-200.png](./evidence/chrome-windows/chrome-UC14-zoom-200.png) | [firefox-UC-13.png](./evidence/firefox-windows/firefox-UC-13.png), [firefox-UC14-zoom-200.png](./evidence/firefox-windows/firefox-UC14-zoom-200.png) | [safari-UC-13.jpg](./evidence/Safari-iphone/safari-UC-13.jpg), [safari-UC-14.jpg](./evidence/Safari-iphone/safari-UC-14.jpg)               |
