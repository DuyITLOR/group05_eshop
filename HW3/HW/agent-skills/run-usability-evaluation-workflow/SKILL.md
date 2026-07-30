---
name: run-usability-evaluation-workflow
description: Thực hiện hoặc tiếp tục usability evaluation của HW03 theo các phase plan, prepare, record, analyze và report; sử dụng khi Codex cần lập kế hoạch nghiên cứu, soạn moderator session kit, ghi dữ liệu P01–P07, tính SUS hoặc UEQ-S từ dữ liệu thật, phân tích completion và severity findings, viết usability report, chuẩn bị demo video, hoặc làm việc với artifact Task 2 cho flow Product Search đến Order Confirmation hay flow khác do người dùng xác nhận.
---

# Chạy quy trình usability evaluation

## Mục tiêu

- Thực hiện chuỗi `plan → prepare → record → analyze → report`.
- Bắt đầu flow mặc định từ tài khoản đã đăng nhập: `Product Search → Product Detail → Add to Cart → Apply Coupon → Checkout → Order Confirmation`.
- Tránh trùng flow đăng ký, đăng nhập hoặc quên mật khẩu khi dùng phạm vi mặc định.
- Thay flow mặc định bằng flow khác do người dùng xác nhận.
- Phân tích duy nhất dữ liệu participant thật, đã ẩn danh và có nguồn.

## Đầu vào bắt buộc

- Nhận phase cần chạy hoặc yêu cầu chạy toàn bộ workflow.
- Nhận flow, SUT, research goal và phạm vi người dùng.
- Nhận yêu cầu bài, participant criteria, consent requirements, môi trường và evidence plan cho `plan`.
- Nhận usability plan đã xác nhận cho `prepare`.
- Nhận dữ liệu session thật đã ẩn danh cho `record`.
- Nhận observation, response SUS hoặc UEQ-S và evidence reference cho `analyze`.
- Nhận kết quả định lượng, finding và limitation cho `report`.
- Nhận đường dẫn artifact tùy chỉnh nếu không dùng mặc định.

## Kiểm tra đầu vào

1. Xác nhận phase thuộc `plan`, `prepare`, `record`, `analyze`, `report`.
2. Đọc artifact hiện có trước khi tạo hoặc chỉnh sửa.
3. Kiểm tra flow là end-to-end, có điểm bắt đầu và kết quả cuối.
4. Kiểm tra participant dùng mã P01–P07 và không lộ thông tin liên hệ.
5. Kiểm tra consent, eligibility, session date, thời gian, response và evidence đến từ dữ liệu thật.
6. Phân biệt `None observed`, `Not observed`, `Not recorded`, `Missing`.
7. Xác định dùng SUS hay UEQ-S; không trộn hai công cụ.
8. Dừng phân tích số liệu khi đầu vào không đủ để tính hợp lệ.

## Các phase được hỗ trợ

| Phase | Phụ thuộc tối thiểu | Đầu ra mặc định |
| --- | --- | --- |
| `plan` | Flow và research goal | `artifacts/task2/usability-plan.md` |
| `prepare` | Usability plan | `artifacts/task2/moderator-session-kit.md` |
| `record` | Session thật đã ẩn danh | `artifacts/task2/session-observations.md` |
| `analyze` | Observation và instrument response thật | `artifacts/task2/usability-scores.md`, `artifacts/task2/severity-findings.md` |
| `report` | Plan, observation, score và finding | `artifacts/task2/usability-report.md` |

## Quy trình thực hiện

### Phase `plan`

1. Xác định research objectives và research questions.
2. Xác định target-user profile, participant criteria và exclusion criteria.
3. Xác định success criteria.
4. Viết task scenario theo mục tiêu và bối cảnh thực tế.
5. Không liệt kê từng bước giao diện hoặc tiết lộ cách hoàn thành.
6. Lập pilot plan, consent requirements, test environment, evidence plan và research risks.
7. Ghi phạm vi chưa xác nhận và assumption ảnh hưởng đến nghiên cứu.

### Phase `prepare`

1. Soạn introduction và consent statement.
2. Nói rõ: “chúng tôi kiểm thử sản phẩm, không kiểm thử bạn”.
3. Soạn think-aloud instruction và task scenario.
4. Soạn moderator script và neutral intervention rules.
5. Tạo observation template.
6. Thêm đúng instrument section cho SUS hoặc UEQ-S đã chọn.
7. Soạn probe question mở về clarity, error recovery, speed và trust.
8. Tránh câu hỏi dẫn dắt.
9. Soạn closing script.

### Phase `record`

1. Tạo cấu trúc P01–P07 nhưng không tự điền dữ liệu còn thiếu.
2. Ghi participant code, eligibility, session date, start/end time, completion status và completion time.
3. Ghi errors, hesitations, backtracking, requests for help và moderator interventions.
4. Ghi notable statements, friction points và emotional signals đúng theo quan sát.
5. Ghi response SUS hoặc UEQ-S và recording/evidence references.
6. Dùng chính xác `None observed`, `Not observed`, `Not recorded` hoặc `Missing`.
7. Không đưa tên, số điện thoại, Zalo, email hoặc định danh chưa che vào artifact phân tích.

### Phase `analyze`

1. Kiểm tra đủ 7 participant thật.
2. Cho phép phân tích tạm thời khi người dùng yêu cầu và chưa đủ 7 participant.
3. Gắn nhãn `Provisional` cho phân tích tạm thời và không tuyên bố Task 2 hoàn thành.
4. Tính SUS theo từng participant: item lẻ bằng `response - 1`, item chẵn bằng `5 - response`, cộng đóng góp rồi nhân `2.5`.
5. Kiểm tra đủ 10 response hợp lệ trước khi tính SUS.
6. Dùng đúng thang và công thức UEQ-S khi chọn UEQ-S; ghi rõ cách chuyển đổi thang.
7. Không trộn điểm UEQ-S với SUS.
8. Tính điểm từng participant, điểm tổng hợp, completion rate, completion time, error count và help-request count khi dữ liệu đủ.
9. Nhóm pain point, tách isolated bugs khỏi systemic design issues.
10. Xếp severity thành `Critical`, `Major`, `Moderate`, `Minor`.
11. Ánh xạ finding đến participant code và evidence.
12. Không đưa ra số liệu khi mẫu hoặc response không đủ.

### Phase `report`

1. Tổng hợp objectives, methodology và participant profile đã ẩn danh.
2. Trình bày task scenario và pilot changes.
3. Trình bày quantitative results và qualitative findings.
4. Tách bugs khỏi systemic issues.
5. Trình bày severity, limitations, recommendations và evidence references.
6. Dùng `[MISSING: mô tả nội dung]` cho phần bắt buộc còn thiếu.
7. Không bịa dữ liệu để làm báo cáo có vẻ hoàn chỉnh.

## Định dạng artifact đầu ra

### Session observations

Tổ chức từng participant theo mã P01–P07 và giữ các trường: eligibility, session date, start/end time, completion, time, errors, hesitations, backtracking, help, interventions, statements, friction, emotional signals, instrument responses, evidence references.

### Scores và findings

- Trình bày công thức, dữ liệu đầu vào, điểm từng participant và tổng hợp có thể tái kiểm tra.
- Dùng bảng finding gồm `Finding ID`, `Description`, `Severity`, `Participant Codes`, `Evidence`, `Recommendation`, `Verification Status`.

### Hợp đồng artifact chung

- Nhận biết Task 1: `gui-scope.md`, `gui-checklist.md`, `gui-checklist-critique.md`, `gui-execution.md`, `bug-reports.md`, `gui-test-summary.md`.
- Dùng Task 2: `usability-plan.md`, `moderator-session-kit.md`, `session-observations.md`, `usability-scores.md`, `severity-findings.md`, `usability-report.md`.
- Nhận biết validation: `hw03-compliance-report.md`.
- Cho phép đường dẫn khác khi người dùng cung cấp rõ ràng.
- Không ghi đè nội dung sinh viên đã sửa trước khi đọc và bảo toàn phần không liên quan.

## Quy tắc đặt tên và traceability

- Dùng P01–P07 cho participant đã ẩn danh.
- Dùng `US-FINDING-NNN` cho finding và không tái sử dụng ID.
- Ánh xạ plan đến flow, research question và success criteria.
- Ánh xạ observation đến participant code và evidence.
- Ánh xạ score đến response gốc có thể kiểm tra.
- Ánh xạ report finding đến participant code, evidence và artifact score.
- Dùng đường dẫn tương đối từ repository root khi có thể.

## Quy tắc bảo vệ bằng chứng

- Không tạo participant, tên, thông tin liên hệ, SUS/UEQ-S response, recording hoặc phát biểu giả.
- Không mạo danh participant hoặc tự xác nhận consent.
- Không dùng dữ liệu `DEMO_ONLY` làm bằng chứng thật.
- Gắn nhãn `DEMO_ONLY`, lưu tách khỏi artifact thật và không đưa vào report chính.
- Không dùng category smoke test, automation observation hoặc dữ liệu kỹ thuật thay cho usability session thật.
- Không để lộ tên, số điện thoại, Zalo, email, giọng nói hoặc video khi chưa có sự đồng ý.
- Không đưa dữ liệu riêng tư chưa che vào AI prompt hoặc artifact phân tích.

## Stop conditions

- Dừng `prepare` khi chưa có flow và research goal đủ rõ.
- Dừng `record` nếu người dùng chưa cung cấp dữ liệu session thật; chỉ tạo cấu trúc trống khi được yêu cầu.
- Dừng tính điểm khi response thiếu, ngoài thang hoặc không rõ instrument.
- Đánh dấu `Provisional` và không tuyên bố hoàn thành khi chưa đủ 7 participant thật.
- Dừng `report` khỏi kết luận đầy đủ khi thiếu pilot, consent, observation, score hoặc evidence.
- Dừng trước khi xử lý dữ liệu nhận dạng chưa che; yêu cầu người dùng ẩn danh.

## Quy trình dành cho demo video

1. Hiển thị flow và mục tiêu.
2. Chạy `plan`.
3. Chạy `prepare`.
4. Hiển thị moderator session kit.
5. Nạp dữ liệu thật đã ẩn danh.
6. Kiểm tra consent và evidence reference mà không để lộ dữ liệu riêng tư.
7. Chạy `analyze`.
8. Hiển thị điểm và severity findings.
9. Chạy `report`.
10. Hiển thị traceability và danh sách artifact.
11. Không phát giọng nói hoặc video participant nếu chưa có sự đồng ý.

## Kiểm tra trước khi kết thúc

- Kiểm tra flow là end-to-end và không tiết lộ cách hoàn thành trong task scenario.
- Kiểm tra pilot và đủ P01–P07 cho kết luận hoàn chỉnh.
- Kiểm tra instrument, công thức và score có thể tái tính.
- Kiểm tra probe question không dẫn dắt.
- Kiểm tra severity và traceability đến evidence.
- Kiểm tra mọi dữ liệu phân tích đã ẩn danh.
- Kiểm tra không có participant hoặc bằng chứng giả.
- Kiểm tra artifact được ghi đúng đường dẫn và nội dung sinh viên được bảo toàn.
- Báo rõ trạng thái `Provisional`, dữ liệu thiếu, validation và bước tiếp theo.
