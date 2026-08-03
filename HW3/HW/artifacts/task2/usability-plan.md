# Kế hoạch usability test - Luồng mua hàng EShop

## 1. Thông tin chung

| Thuộc tính             | Nội dung                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase                  | `plan`                                                                                                                                                                    |
| SUT                    | EShop Frontend Web và Backend API cục bộ                                                                                                                                  |
| Researcher / moderator | `Nguyễn Huy Quân` — `23127107`                                                                                                                                            |
| Luồng đánh giá         | Product Search → Product Detail → Add to Cart → Apply Coupon → Checkout → Order Confirmation                                                                              |
| Mục tiêu nghiên cứu    | Đánh giá liệu người mua hàng mục tiêu có thể tự hoàn tất mua một sản phẩm, hiểu giá và coupon, đồng thời nhận biết đơn đã được ghi nhận mà không cần hướng dẫn giao diện. |
| Instrument sau phiên   | SUS gồm 10 câu chuẩn; không trộn với UEQ-S.                                                                                                                               |
| Trạng thái             | Draft — Pending Student Human Review                                                                                                                                      |

Phạm vi gồm tìm sản phẩm, xem chi tiết, thêm vào giỏ, áp dụng coupon, kiểm tra tổng tiền, checkout và nhận biết xác nhận đơn. Ngoài phạm vi: đăng ký/đăng nhập, hồ sơ, lịch sử đơn, Admin, thanh toán thật, Task 1 GUI checklist và Task 3 cross-platform.

Kế hoạch chỉ định hướng việc chuẩn bị và thực hiện nghiên cứu. Sinh viên xác nhận đã nhận được đồng ý tham gia từ bảy người dự kiến `P01`–`P07`; hồ sơ consent theo từng người và phạm vi recording/audio/quote phải được lưu riêng tư trước phiên tương ứng. Chưa có pilot, recording, observation, SUS response, score hoặc finding nào được tạo từ kế hoạch này.

## 2. Mục tiêu

### Research objectives và research questions

| ID    | Research objective                                                       | Research questions                                                                              |
| ----- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| RO-01 | Đánh giá khả năng định hướng từ danh sách đến đúng sản phẩm và giỏ hàng. | Participant có tự tìm, mở đúng sản phẩm và nhận biết sản phẩm/số lượng đã thêm không?           |
| RO-02 | Đánh giá mức dễ hiểu của thông tin sản phẩm, giá, coupon và tổng tiền.   | Họ có phân biệt giá gốc, khoản giảm và tổng cuối; feedback coupon có đủ rõ để tiếp tục không?   |
| RO-03 | Đánh giá khả năng checkout và nhận biết kết quả cuối.                    | Họ có tự hoàn tất đơn và hiểu dấu hiệu xác nhận rằng đơn đã được ghi nhận không?                |
| RO-04 | Xác định trở ngại, do dự, quay lui và khả năng tự khôi phục.             | Trở ngại xuất hiện ở đâu, participant tự khôi phục thế nào, khi nào họ cần trợ giúp hoặc từ bỏ? |
| RO-05 | Đo perceived usability và lý do về clarity, recovery, speed và trust.    | Điểm SUS của từng người/toàn mẫu là bao nhiêu; chủ đề định tính nào lặp lại?                    |

### Target-user profile

Người trưởng thành đọc hiểu tiếng Việt, sử dụng web và đã từng mua hoặc cân nhắc mua hàng trực tuyến trong 6 tháng gần đây. Mẫu cần có mức kinh nghiệm thương mại điện tử đa dạng, không yêu cầu kiến thức kỹ thuật.

- Từ 18 tuổi và có khả năng tự cung cấp informed consent.
- Có thể tham gia phiên moderated usability test và đồng ý ghi màn hình; audio là lựa chọn riêng, không bắt buộc.
- Loại trừ người dưới 18 tuổi hoặc người có quan hệ khiến họ không thể tự nguyện từ chối/dừng phiên.

### Success criteria

Các ngưỡng này được chốt trước khi chạy `P01`; chỉ được thay đổi sau pilot, có lý do và change log.

| ID    | Tiêu chí                      | Ngưỡng thành công cấp nghiên cứu                                                           |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| SC-01 | Hoàn thành độc lập end-to-end | Ít nhất 6/7 đạt màn hình xác nhận đúng mà không nhận hướng dẫn giao diện.                  |
| SC-02 | Đúng sản phẩm và số lượng     | 7/7 đơn hoàn tất có đúng sản phẩm điện thoại.                                              |
| SC-03 | Hiểu coupon và tổng tiền      | Ít nhất 6/7 tự áp dụng `VIP100` và diễn giải đúng giá gốc, giảm 100.000 VND.               |
| SC-04 | Thời gian hoàn thành          | Median không quá 5 phút, tính từ lúc đọc xong scenario đến khi tuyên bố hoàn tất.          |
| SC-05 | Nhu cầu trợ giúp              | Không quá 1/7 cần moderator intervention mang tính giúp tiếp tục.                          |
| SC-06 | Nhận biết kết quả cuối        | Ít nhất 6/7 hiểu đơn đã được ghi nhận, không chỉ hiểu coupon đã áp dụng.                   |
| SC-07 | Perceived usability           | Mean SUS của bảy response hợp lệ đạt ít nhất 70/100; vẫn báo cáo từng điểm và độ phân tán. |
| SC-08 | Blocker                       | Không có vấn đề `Critical` chặn hoàn thành trong phiên chính thức.                         |

## 3. Task scenario

### Bối cảnh bắt đầu

Moderator chuẩn bị sẵn một tài khoản test đã đăng nhập, ở danh sách sản phẩm với giỏ hàng trống. Tài khoản không chứa dữ liệu cá nhân hoặc phương thức thanh toán thật.

### Nội dung giao cho participant

> Bạn đang chuẩn bị mua một chiếc điện thoại mới để phục vụ công việc. Bạn đã có sẵn tài khoản EShop và đang đăng nhập. Hãy hoàn tất việc mua một thiết bị và tận dụng mã giảm giá `VIP100`.

Scenario chỉ nêu bối cảnh, mục tiêu và coupon. Nó không nêu control, đường dẫn, thứ tự màn hình hoặc thao tác phải làm.

## 4. Điều kiện và tiêu chí

### Start state

| Thành phần | Điều kiện                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Runtime    | Frontend Web cục bộ dự kiến `http://localhost:5173`; Backend API `http://localhost:3000`.              |
| Thiết bị   | Một desktop browser nhất quán cho mọi phiên; ghi browser, OS, version và viewport thực tế trước `P00`. |
| Privacy    | Chỉ dùng dữ liệu test giả; không nhập mật khẩu, địa chỉ hoặc thanh toán thật của participant.          |

Preflight trước mỗi phiên phải kiểm tra runtime, product fixture, coupon fixture, trạng thái giỏ và recording. Lỗi runtime, fixture hoặc reset phải ghi là session infrastructure issue, không phải participant failure hoặc usability finding.

### Thành công

`Completed independently` khi participant đạt end state, đúng sản phẩm/số lượng/coupon và không nhận intervention hướng dẫn UI. `Completed with assistance` khi đạt end state sau intervention giúp tiếp tục.

### Thất bại

`Not completed` khi không đạt end state, tạo đơn sai hoặc participant dừng/bỏ cuộc. Các chỉ dấu cần quan sát gồm error, hesitation (không thao tác ít nhất 5 giây hoặc nói rõ không chắc chắn), backtracking, help request và moderator intervention; chỉ ghi cảm xúc khi có phát ngôn hoặc biểu hiện quan sát trực tiếp.

## 5. Dữ liệu cần thu thập

| Dữ liệu/evidence       | Nội dung tối thiểu                                                                     | Vị trí lưu trữ đề xuất                                                     |
| ---------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Consent record         | Lựa chọn screen/audio/quote/contact và thời điểm đồng ý                                | `artifacts/task2/private/consent/` — private, không commit                 |
| Contact register       | Họ tên và liên hệ xác minh thật của `P01`–`P07`                                        | `artifacts/task2/private/contact-register.*` — private                     |
| Screen recording       | Toàn task, start/end state và timestamp                                                | `artifacts/task2/private/recordings/Pxx/` — private; audio chỉ khi consent |
| Structured observation | Completion, time, errors, hesitation, backtracking, help, intervention và mốc evidence | `artifacts/task2/session-observations.md`                                  |
| SUS response           | Đủ 10 response 1–5 do participant tự cung cấp                                          | `artifacts/task2/private/responses/` và bản ẩn danh để tính điểm           |
| Post-task probes       | Clarity, recovery, speed, trust và nhận biết confirmation                              | Observation note có timestamp                                              |
| Pilot change log       | Vấn đề, quyết định và phiên bản trước/sau                                              | `artifacts/task2/pilot-change-log.md`                                      |

Quy ước đặt tên: `Pxx_YYYYMMDD_<evidence-type>`. Không tải recording, audio, contact hoặc dữ liệu raw lên Git/AI prompt. Dùng `None observed`, `Not observed`, `Not recorded` hoặc `Missing` thay vì suy đoán; recording hỏng là evidence gap, không tái dựng từ trí nhớ.

## 6. Quy trình điều phối

### Pilot plan

- Tuyển `P00` theo cùng tiêu chí với mẫu chính, chạy sau preflight và consent, trước `P01`.
- Dùng đúng scenario, quy ước đo lường và SUS dự kiến; không đưa kết quả `P00` vào thống kê chính.
- Kiểm tra scenario có được hiểu như mục tiêu, fixture/reset ổn định, thời lượng task khoảng 5 phút, recording/notes đủ tái dựng hành vi và moderator giữ trung lập.
- Chỉ điều chỉnh scenario, threshold, fixture, moderator wording hoặc evidence process nếu pilot có lý do; ghi ngày, lý do và thay đổi vào pilot change log. Nếu scenario/mục tiêu đổi đáng kể, chạy pilot lại với người khác.

### Điều phối phiên chính

Moderator giải thích đây là kiểm thử sản phẩm chứ không phải kiểm tra participant, mời participant nói ra suy nghĩ nếu họ thoải mái và theo dõi mà không hướng dẫn đường đi trên UI. Mọi intervention phải được ghi nhận cùng lý do và timestamp; không can thiệp để nâng completion rate.

Sau task, thu SUS và dùng câu hỏi mở về clarity, recovery, speed, trust và ý nghĩa của trạng thái xác nhận. Không đưa hướng dẫn từng bước cho participant ở bất kỳ thời điểm nào.

## 7. Checklist trước và sau phiên

### Trước phiên

- [ ] Xác nhận eligibility, consent và các lựa chọn recording/audio/quote.
- [ ] Xác nhận account, product `iPhone 15 Pro Max`, coupon `VIP100`, cart/order state và reset mechanism.
- [ ] Ghi browser/OS/version/viewport; kiểm tra recording, timestamp và nơi lưu private.
- [ ] Xác nhận không có dữ liệu thật của participant trong SUT.

### Sau phiên

- [ ] Ghi completion status, thời gian, error, hesitation, backtracking, help và intervention cùng timestamp.
- [ ] Thu đủ 10 phản hồi SUS hoặc ghi `Missing`; không tự điền thay participant.
- [ ] Ghi post-task probes và evidence reference; ẩn danh mọi trích dẫn.
- [ ] Reset/isolated-cleanup fixture theo cơ chế đã xác minh; không xóa raw data trái với consent.
- [ ] Cập nhật issue hạ tầng riêng nếu runtime/fixture/recording lỗi.

## 8. Trạng thái thực hiện

| Hạng mục                             | Trạng thái                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Plan                                 | Created                                                                                                         |
| Consent `P01`–`P07`                  | Sinh viên xác nhận đã nhận được đồng ý tham gia; cần lưu riêng lựa chọn recording/audio/quote trước từng phiên. |
| Pilot `P00`                          | Do không đủ khả năng nên sẽ tự động test và thay đổi dựa vào P01                                                |
| Main sessions `P01`–`P07`            | Đang thực hiện                                                                                                  |
| SUS calculation, findings and report | Not started                                                                                                     |
