# GUI Checklist Critique — Admin Order Management

## Metadata

- Phase: `critique`
- Checklist được phản biện: `artifacts/task1/gui-checklist.md`
- Scope đối chiếu: `artifacts/task1/gui-scope.md`
- Checklist hiện tại: 52 item, `GUI-001`–`GUI-052`
- Phương pháp: static review; chưa chạy SUT
- Checklist gốc: không chỉnh sửa
- Actual Result / Status / Notes / Evidence: không điền
- Nguồn nội dung phản biện: `AI-generated`
- Human review: `Pending`

## 1. Kết luận nhanh

Checklist cân bằng về số lượng, mỗi IA có 13 item. Tuy nhiên, cân bằng số học chưa đồng nghĩa với cân bằng chiều sâu: accessibility và responsive mới được bao phủ một phần; RTL và dark mode hoàn toàn vắng mặt; confirmation cho hành động hủy chưa có nhưng cũng chưa được đặc tả xác nhận.

| Nhóm kiểm tra | Kết quả critique |
| --- | --- |
| Trùng hoàn toàn | Không phát hiện |
| Chồng lấn hoặc gần trùng | 6 cụm |
| Tiêu chí chung chung hoặc khó đo | 10 item |
| Cần instrumentation/test fixture để kết luận | 8 item hoặc cụm |
| Accessibility | Có keyboard/focus/accessible name cơ bản; thiếu semantics, live announcement, focus recovery, zoom/reflow và action name theo order |
| Responsive | Có kiểm tra chung; thiếu viewport cụ thể, zoom, nội dung dài, touch target và orientation |
| RTL | Không có; chỉ nên bổ sung dạng conditional/exploratory nếu SUT có yêu cầu hỗ trợ |
| Dark mode | Không có; chỉ nên áp dụng nếu SUT hoặc hệ điều hành/theme của sản phẩm hỗ trợ |
| Loading | Có initial và action pending; thiếu per-row isolation, timeout và thông báo cho assistive technology |
| Empty | Có empty order list; thiếu zero-state Dashboard |
| Error | Có fetch/auth/login error; thiếu update-status server error gắn với đúng row và bảo toàn trạng thái trước đó |
| Success | Có đủ năm transition; thiếu live announcement, focus preservation và xử lý response muộn/lặp |
| Confirmation | Không có; destructive confirmation cho `Hủy` là đề xuất conditional vì scope chưa xác nhận dialog |

## 2. Cụm chồng lấn hoặc gần trùng

| Cụm | Item | Nhận xét | Đề nghị |
| --- | --- | --- | --- |
| OV-01 | `GUI-027`, `GUI-031` | Cả hai cùng kiểm tra Dashboard và selected state. `GUI-027` còn kiểm tra default landing, nhưng Expected Result lặp phần lớn `GUI-031`. | Giữ `GUI-027` chỉ cho default landing sau login; giữ `GUI-031` cho selected state sau khi quay lại Dashboard. |
| OV-02 | `GUI-028`, `GUI-029` | Cùng thao tác mở Orders; một item kiểm tra nội dung, một item kiểm tra selected state. Đây là chồng lấn bước, chưa phải trùng mục tiêu. | Giữ cả hai nhưng ghi rõ `GUI-028` chỉ kiểm tra view transition, `GUI-029` chỉ kiểm tra duy nhất một navigation item được chọn. |
| OV-03 | `GUI-030`, `GUI-031` | Cùng thao tác quay lại Dashboard và quan sát sidebar. | Giữ `GUI-030` cho content transition; dùng `GUI-031` cho selected-state persistence sau round trip. |
| OV-04 | `GUI-012`, `GUI-052` | Đều đối chiếu doanh thu Dashboard. `GUI-012` là baseline; `GUI-052` là delta sau transition. | Giữ `GUI-012` cho phép tính tại baseline; rút `GUI-052` còn kiểm tra delta và refresh sau update. |
| OV-05 | `GUI-013`, `GUI-052` | Đều đối chiếu tổng số order. | Giữ `GUI-013` cho baseline; trong `GUI-052` chỉ xác minh count không đổi sau status-only update. |
| OV-06 | `GUI-020`–`GUI-024`, `GUI-046`–`GUI-050` | Các cặp dùng cùng transition. IA-02 đang trộn khả dụng/tên/đúng row với payload và kết quả; IA-04 kiểm tra feedback sau response. | IA-02 chỉ kiểm tra action availability, name và row context; IA-04 kiểm tra badge/action/feedback sau response. Nếu cần xác minh payload, nêu rõ Network/API evidence. |

## 3. Item còn chung chung hoặc khó đo

| Item | Cụm từ yếu | Vấn đề quan sát | Cách làm chặt |
| --- | --- | --- | --- |
| `GUI-001` | “rõ, nổi bật” | Phụ thuộc cảm nhận người kiểm thử. | Kiểm tra có đúng một heading chính, tên đúng, không bị cắt ở viewport đã định. |
| `GUI-002` | “vùng cuộn vẫn sử dụng được” | Không nêu viewport, phần tử cuộn hoặc tiêu chí che khuất. | Chỉ định kích thước viewport và yêu cầu sidebar không che table/scrollbar/focused control. |
| `GUI-006` | “không làm dữ liệu cột khác bị hiểu nhầm” | Không xác định wrap, truncate hay full-value access. | Dùng tên dài cụ thể; yêu cầu không tràn sang cell khác và full value vẫn truy cập được. |
| `GUI-010` | “badge nhất quán” | Không nêu nhãn, phân biệt phi màu hay contrast. | Liệt kê năm nhãn; yêu cầu text/icon hoặc shape phân biệt trạng thái, không chỉ màu. |
| `GUI-011` | “nội dung quan trọng”, “cơ chế cuộn rõ” | Không có breakpoint hoặc điều kiện mất nội dung. | Kiểm tra ở 320 px, 375 px và 200% zoom; mọi field/action vẫn truy cập được bằng scroll. |
| `GUI-014` | “tên trường không biến mất gây mất ngữ cảnh” | Trộn visible label và accessible name. | Kiểm tra label hiển thị bền vững và programmatic accessible name là “Email”. |
| `GUI-032` | “tên gọi dễ hiểu” | Chủ quan. | Xác minh mapping cụ thể: `Dashboard` → heading Dashboard; `Đơn hàng` → `Quản lý Đơn hàng`. |
| `GUI-034` | “không chỉ dựa vào thay đổi rất nhỏ” | Không có tiêu chí visibility. | Focus indicator phải nhìn thấy ở từng control, không bị clip; kiểm tra cả 200% zoom và theme được hỗ trợ. |
| `GUI-038` | “nhận biết được row vừa thay đổi” | Không nói tín hiệu nào và focus ở đâu. | Yêu cầu row ID giữ nguyên, badge/action đổi đúng row và focus được giữ hoặc chuyển đến feedback tương ứng. |
| `GUI-042` | “cách thử lại phù hợp” | Giả định có retry control chưa được xác nhận. | Yêu cầu recovery instruction; chỉ yêu cầu Retry button nếu đặc tả hoặc runtime xác nhận có control đó. |

## 4. Item không thể kết luận chỉ bằng quan sát giao diện

| Item | Tuyên bố cần bằng chứng bổ sung | Instrumentation/test fixture cần có |
| --- | --- | --- |
| `GUI-005`–`GUI-008`, `GUI-012`, `GUI-013` | Giá trị “khớp dữ liệu nguồn” | Dataset/API/DB fixture có expected value đã biết. |
| `GUI-017` | Một thao tác tạo đúng một request | Network panel, API mock hoặc server log; response được làm chậm. |
| `GUI-020`–`GUI-024` | “chỉ gửi” đúng transition cho đúng order | Network request/response hoặc API spy. UI outcome riêng được kiểm ở `GUI-046`–`GUI-050`. |
| `GUI-026` | Không tạo request trùng | Network inspection trong lúc response bị trì hoãn. |
| `GUI-037` | Token hết hạn/không hợp lệ | Token controllable hoặc API mock trả 401/403. |
| `GUI-040`, `GUI-042`, `GUI-043` | Loading và các nhánh lỗi mạng/auth | Network throttling/routing hoặc mock response xác định. |
| `GUI-045` | Không lưu phiên admin | Kiểm tra storage/session và request sau login; không chỉ nhìn màn hình. |
| `GUI-052` | Revenue tăng đúng delta sau delivered | Dataset baseline, transition response và expected total độc lập. |

Các item này vẫn có thể giữ, nhưng Test Steps hoặc Evidence guidance phải nói rõ cách tạo trạng thái và cách quan sát. Nếu bài chỉ cho phép black-box UI không có Network/API evidence, Expected Result cần giới hạn ở hành vi UI nhìn thấy.

## 5. Ma trận khoảng trống coverage

| Chủ đề | Coverage hiện có | Khoảng trống | Mức ưu tiên |
| --- | --- | --- | --- |
| Accessibility semantics | `GUI-003`, `GUI-014`, `GUI-015`, `GUI-025` | Table header association; semantic navigation controls; unique action name kèm order ID | Cao |
| Keyboard và focus | `GUI-018`, `GUI-025`, `GUI-033`–`GUI-035` | Focus sau error/success/session expiry; focus không mất khi row re-render | Cao |
| Screen reader feedback | Accessible name cơ bản | Không có live announcement cho loading, error, success và status update | Cao |
| Contrast và zoom | Phi màu ở `GUI-010`; focus ở `GUI-034` | Contrast badge/text/focus/error; 200% zoom/reflow | Cao |
| Responsive | `GUI-011`, `GUI-039` | Viewport cụ thể, long content, table association khi cuộn, orientation và touch target | Cao |
| RTL | Không có | Layout direction, table alignment/order, currency/status, focus order, clipping | Conditional |
| Dark mode | Không có | Contrast và nhận diện các state trong dark theme | Conditional |
| Loading | `GUI-040`, `GUI-026` | Per-row isolation, `aria-busy`/announcement, timeout/recovery, stale data boundary | Cao |
| Empty | `GUI-041`, final action area ở `GUI-051` | Dashboard với dataset zero; phân biệt zero hợp lệ với loading/error | Trung bình |
| Validation error | `GUI-019`, `GUI-044`, `GUI-045` | Error association với field, announcement và focus vào field lỗi | Cao |
| Server/update error | `GUI-042` chỉ fetch chung | Status update thất bại phải giữ badge/action cũ, nêu đúng order và cho phép recovery | Cao |
| Success | `GUI-046`–`GUI-050`, `GUI-052` | Announcement, focus preservation, response muộn/lặp và action ở row khác vẫn dùng được | Cao |
| Disabled/final | `GUI-026`, `GUI-051` | Disabled name/state được assistive technology nhận biết; chỉ row đang xử lý bị khóa | Cao |
| Confirmation | Không có | Hủy là destructive action nhưng scope chưa xác nhận confirmation UI | Conditional |
| Status consistency | `GUI-010`, `GUI-046`–`GUI-052` | Cùng order/status sau refresh hoặc chuyển qua Dashboard rồi quay lại Orders | Cao |

## 6. Candidate bổ sung cho Human Review

Các candidate dưới đây vẫn là `AI-generated`. Chúng chưa được thêm vào checklist và không được gắn `Student-added` cho đến khi người dùng tự rà soát, chỉnh sửa và xác nhận chấp nhận.

| Candidate | Chủ đề | Test Item / Expected Result đề xuất | Vì sao checklist AI ban đầu bỏ sót |
| --- | --- | --- | --- |
| `CRIT-001` | Table semantics | Screen reader xác định được header của từng cell và điều hướng row/column mà không mất order context. | AI tập trung vào alignment thị giác ở `GUI-003`/`GUI-004`. |
| `CRIT-002` | Repeated action names | Mỗi action có accessible name gồm action và order ID, ví dụ “Hủy đơn 42”, để các button lặp không mơ hồ. | `GUI-025` chỉ yêu cầu tên action, chưa phân biệt các row. |
| `CRIT-003` | Live announcements | Loading, fetch error, login error và status success/error được thông báo bằng live region phù hợp mà không cần chuyển focus tùy tiện. | Checklist kiểm feedback thị giác nhưng chưa kiểm screen reader động. |
| `CRIT-004` | Focus recovery | Sau login validation/error, session expiry và status update, focus đến vị trí xử lý hợp lý hoặc được giữ ở row liên quan; không rơi về đầu document. | Các item keyboard hiện tại chỉ kiểm tra khả năng đi tới control. |
| `CRIT-005` | Zoom/reflow | Ở 200% zoom, heading, navigation, table data và action vẫn đọc/vận hành được; không có content/action bị che. | Responsive ban đầu không định lượng zoom. |
| `CRIT-006` | Narrow viewport | Ở 320 px và 375 px với tên/address/amount dài, không có cell hoặc action chồng lấn; mọi giá trị vẫn truy cập được. | `GUI-011`/`GUI-039` dùng “hẹp” nhưng không có breakpoint. |
| `CRIT-007` | Table horizontal scroll | Khi cuộn ngang, user vẫn xác định được action thuộc order nào và header thuộc cột nào; keyboard focus không bị che. | Checklist chỉ yêu cầu có cuộn ngang. |
| `CRIT-008` | Touch target | Sidebar và status actions có vùng chạm đủ tách biệt, không kích hoạt nhầm action kế bên ở viewport cảm ứng. | AI ưu tiên mouse/keyboard desktop. |
| `CRIT-009` | RTL layout | **Conditional:** nếu SUT hỗ trợ locale RTL, sidebar, content, table và alignment đổi hướng mà không clip/overlap. | Không có yêu cầu locale/RTL trong scope nguồn. |
| `CRIT-010` | RTL reading/focus order | **Conditional:** trong RTL, visual order, DOM/reading order và keyboard focus order vẫn logic; tiền tệ, ID và status không bị đảo nghĩa. | Scope không xác nhận RTL; không nên biến thành yêu cầu bắt buộc. |
| `CRIT-011` | Dark-mode contrast | **Conditional:** nếu có dark theme hoặc theo system theme, text, header, badge và focus indicator đạt khả năng phân biệt tương đương light theme. | Scope không xác nhận dark mode. |
| `CRIT-012` | Dark-mode states | **Conditional:** loading, empty, error, success, disabled và confirmation vẫn nhìn thấy rõ trong dark theme. | AI chưa lập ma trận state theo theme. |
| `CRIT-013` | Per-row loading | Khi update một order, chỉ row/action liên quan ở pending state; action khác không bị khóa nếu không có ràng buộc được xác nhận. | `GUI-026` chỉ kiểm duplicate trên cùng order. |
| `CRIT-014` | Loading timeout | Khi update hoặc fetch bị treo/quá thời gian, loading không kéo dài vô hạn và UI cung cấp recovery instruction mà không giả dữ liệu rỗng/thành công. | `GUI-040` chỉ kiểm trước khi response về. |
| `CRIT-015` | Dashboard zero state | Với zero orders, cards hiển thị giá trị zero hợp lệ và phân biệt được với loading/error; không xuất hiện NaN hoặc undefined. | `GUI-041` chỉ bao phủ empty Orders table. |
| `CRIT-016` | Update server error | Khi status update trả lỗi, đúng row hiển thị feedback; badge/action cũ được giữ, row khác không đổi và user có thể thử lại an toàn. | `GUI-042` chỉ kiểm lỗi tải dữ liệu chung. |
| `CRIT-017` | Success persistence | Sau success, focus/order context được giữ; refresh hoặc chuyển Dashboard → Orders vẫn hiển thị status mới nhất, không hồi lại status cũ. | Các item success chỉ quan sát ngay sau response. |
| `CRIT-018` | Cancel confirmation | **Conditional:** nếu Human Review xác nhận cần confirmation cho `Hủy`, dialog nêu order ID/current status, có Confirm/Cancel, giữ focus trong dialog, trả focus đúng chỗ; Cancel không gửi request hay đổi trạng thái. | Scope chủ động không suy đoán confirmation dialog, nên AI không tạo item. |

## 7. Các chỉnh sửa ưu tiên cho checklist hiện tại

1. Tách mục tiêu của các cụm `OV-01`–`OV-06`, tránh một transition bị kiểm hai lần với cùng Expected Result.
2. Thay từ định tính bằng viewport, zoom, trạng thái focus, label hoặc thay đổi UI có thể quan sát.
3. Ghi rõ instrumentation cho các tuyên bố về request count, payload, token và dữ liệu nguồn.
4. Bổ sung trước hết `CRIT-001`–`CRIT-007`, `CRIT-013`–`CRIT-017`; đây là gap trực tiếp trong phạm vi hiện có.
5. Giữ `CRIT-009`–`CRIT-012` và `CRIT-018` ở trạng thái conditional cho đến khi xác nhận capability/yêu cầu sản phẩm. Nếu SUT không hỗ trợ, ghi `Not Applicable` có lý do trong kế hoạch, không đánh Failed.

## 8. Quyết định cần Human Review

- Xác nhận merge/narrow sáu cụm overlap.
- Xác nhận có cho phép dùng Network panel/API mock/test fixture làm evidence hay chỉ kiểm black-box UI.
- Chọn candidate accessibility, responsive và state coverage để sinh viên tự chỉnh và đưa vào checklist.
- Xác nhận RTL, dark mode và confirmation là yêu cầu thực, exploratory check hay `Not Applicable`.
- Sau khi người dùng tự rà soát và chấp nhận, chỉ các item do người dùng xác nhận mới có thể được đánh dấu `Student-added`.

Không có item nào được đánh Passed/Failed và không có runtime evidence được tạo trong phase này.
