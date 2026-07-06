# AI Critique (200–300 từ, bắt buộc)

> Trả lời: AI sai/thiên lệch/thiếu sót ở đâu? Vì sao không bắt được? Nguyên tắc rút ra khi cộng tác với AI?

Trong bài này tôi dùng Claude Code như một trợ lý có kỷ luật, dẫn nó qua **từng bước** của Domain Testing và BVA thay vì ra một prompt chung chung. Dù vậy, AI vẫn mắc nhiều lỗi mà chỉ con người mới phát hiện được.

**Thứ nhất — sai kết quả Pass/Fail do không hiểu validate phía client.** Ở Feature A, AI gán các test case "trường rỗng" là *Fail*, nhưng khi tôi chạy thật trên trình duyệt thì thuộc tính HTML `required` đã chặn submit, nên đúng ra phải là *Pass*; lỗi backend không validate chỉ lộ khi gọi thẳng API. AI suy từ source nên không lường được tầng validate của trình duyệt.

**Thứ hai — nhầm phạm vi (scope) giữa các FR.** AI ban đầu xếp ô "Số lượng" và lỗi "bấm 2 lần" vào FR-07 (Giỏ hàng), trong khi chúng thuộc FR-06 (trang chi tiết). Tôi phải yêu cầu loại BUG-B7 ra khỏi Feature B.

**Thứ ba — BVA chưa đủ điểm biên.** AI sinh đủ 6 giá trị biên ở bước "generate" nhưng lại quên test `min+1` và `max−1` cho `name.length` của Feature C; tôi phải bổ sung.

**Thứ tư — cột "Actual" chỉ là dự đoán từ code.** AI không tự chạy được app/API, nên mọi Actual đều cần tôi xác minh thật (chụp màn hình, gọi API bằng file `.rest`); có chỗ đúng, nhưng phải kiểm mới chắc.

**Nguyên tắc rút ra:** AI rất mạnh để *liệt kê có hệ thống* và *đọc source nhanh*, nhưng yếu ở **đối chiếu đặc tả (scope)** và **không phân biệt được hành vi thực tế với phỏng đoán**. Vì vậy mỗi đầu ra của AI phải được con người neo vào SRS và **xác minh trên hệ thống thật** — AI là trợ lý, không phải nguồn chân lý.
