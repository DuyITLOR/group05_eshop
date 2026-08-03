# Moderator Session Kit - EShop Purchase Flow

## 1. Artifact status

| Field           | Value                                    |
| --------------- | ---------------------------------------- |
| Workflow phase  | `prepare`                                |
| Based on        | `artifacts/task2/usability-plan.md`      |
| Scenario coupon | `VIP100`                                 |
| Instrument      | SUS (10 items)                           |
| Status          | Draft — not approved for data collection |

This kit is a moderator aid. It does not contain participant data and must not be used to create consent, recordings, observations or SUS responses on a participant's behalf.

## 2. Before the session

Complete the pre-session checklist in `usability-plan.md` and confirm the following before recording:

- [ ] The participant meets the eligibility criteria. The student reports that consent to participate has been obtained from the seven main participants; confirm consent again with the current participant before recording.
- [ ] Consent choices for screen recording, audio recording and anonymized quotes are recorded privately.
- [ ] The participant is told that raw private data will be retained through 28/08/2026 and that no compensation is offered; the moderator/student is the withdrawal contact. Withdrawal deadline: end of 28/08/2026.
- [ ] The test account, empty cart, product fixture and coupon `VIP100` have been preflighted. The reset mechanism is reported as automatic and must be verified before `P00`.
- [ ] The moderator has checked that no real personal, address or payment data will be entered.
- [ ] Recording and timestamp capture work; private storage is available and access restricted.

If a fixture, runtime or recording check fails, pause the session. Record it as an infrastructure issue; do not count it as participant failure.

## 3. Opening and consent script

Read or adapt the following in a neutral tone:

> Cảm ơn bạn đã tham gia. Hôm nay chúng tôi đánh giá sản phẩm EShop, không đánh giá kỹ năng của bạn. Bạn có thể dừng bất cứ lúc nào, bỏ qua bất kỳ câu hỏi nào và không có câu trả lời đúng hay sai. Trong khi thực hiện, nếu bạn cảm thấy thoải mái, hãy nói ra điều bạn đang nghĩ hoặc đang tìm kiếm.

> Trước khi bắt đầu, tôi sẽ xác nhận lại các lựa chọn đồng ý của bạn về ghi màn hình, ghi âm (nếu có) và việc sử dụng trích dẫn đã ẩn danh. Chúng tôi chỉ dùng dữ liệu test; vui lòng không nhập mật khẩu, địa chỉ hoặc thông tin thanh toán thật.

Ask the participant to confirm their choices privately. Do not record or store contact details in this file.

## 4. Think-aloud reminder

> Trong lúc làm, bạn có thể nói ra điều bạn đang chú ý, điều bạn mong đợi sẽ xảy ra, hoặc điều khiến bạn phân vân. Nếu bạn im lặng, tôi có thể nhắc: “Bạn có thể nói điều bạn đang nghĩ nếu thấy thoải mái.” Bạn không cần giải thích mọi thao tác.

## 5. Task scenario

Show or read only this scenario; do not add interface directions.

> Bạn đang chuẩn bị mua một chiếc điện thoại mới để phục vụ công việc. Do bạn đã tiết kiệm trong một thời gian nên ngân sách của bạn là khoảng 30 triệu đồng. Bạn đã có sẵn tài khoản EShop và đang đăng nhập. Hãy hoàn tất việc mua một thiết bị và tận dụng mã giảm giá `VIP100`.

## 6. Neutral moderator rules

| Situation                                     | Neutral response                                                                                                             |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Participant is silent                         | “Bạn có thể nói điều bạn đang nghĩ nếu thấy thoải mái.”                                                                      |
| Participant asks what to click                | “Bạn mong đợi có thể làm gì ở đây?”                                                                                          |
| Participant asks whether an action is correct | “Bạn sẽ kỳ vọng điều gì xảy ra nếu chọn cách đó?”                                                                            |
| Participant appears stuck                     | “Bạn muốn tiếp tục thêm một chút, hay muốn dừng task?”                                                                       |
| Technical failure occurs                      | Pause the session; record the observed failure and whether it was a fixture/runtime/recording issue. Do not coach around it. |

Do not name a control, navigation path, order of actions, expected product, expected total or expected confirmation state beyond what the scenario already states. Log every intervention with timestamp and reason.

## 7. During-task observation template

Create one private observation record per `P00` or `P01`–`P07`. Do not fill fields without real, consented session evidence.

| Field                    | Record                                                                            |
| ------------------------ | --------------------------------------------------------------------------------- |
| Participant code         | `[Pxx]`                                                                           |
| Eligibility confirmed    | `[Yes / No / Missing]`                                                            |
| Consent record reference | `[private reference]`                                                             |
| Session date             | `[YYYY-MM-DD / Missing]`                                                          |
| Browser / OS / viewport  | `[record actual environment]`                                                     |
| Task start / end         | `[timestamps / Not recorded]`                                                     |
| Completion status        | `[Completed independently / Completed with assistance / Not completed / Missing]` |
| Completion time          | `[duration / Not recorded]`                                                       |
| Errors                   | `[count + timestamped note / None observed / Not recorded]`                       |
| Hesitations              | `[count + timestamped note / None observed / Not recorded]`                       |
| Backtracking             | `[count + timestamped note / None observed / Not recorded]`                       |
| Help requests            | `[count + timestamped note / None observed / Not recorded]`                       |
| Moderator interventions  | `[timestamp, reason, exact neutral wording / None]`                               |
| Notable statements       | `[timestamped anonymized quote / Not recorded]`                                   |
| Friction points          | `[observation + timestamp / None observed]`                                       |
| Emotional signals        | `[directly observed/spoken evidence only / Not observed]`                         |
| Evidence references      | `[private recording/note references]`                                             |

## 8. Post-task probes

Ask the four open questions after the participant stops or declares completion. These are neutral prompts: do not add examples, suggest an answer or ask a question that is not relevant to what was observed.

| Category       | Open question                                                                     |
| -------------- | --------------------------------------------------------------------------------- |
| Clarity        | “Phần nào của luồng mua hàng rõ ràng hoặc khó hiểu với bạn, và vì sao?”           |
| Clarity        | “Có thông tin nào bạn muốn được hiển thị rõ hơn trước khi tiếp tục không?”        |
| Error recovery | “Khi gặp một điều không như bạn mong đợi, bạn đã làm gì để tiếp tục?”             |
| Error recovery | “Hệ thống có giúp bạn hiểu cách xử lý vấn đề đó không? Vì sao?”                   |
| Speed          | “Bạn cảm nhận thế nào về tốc độ thực hiện luồng mua hàng này?”                    |
| Speed          | “Có thời điểm nào bạn phải chờ hoặc không chắc hệ thống đang xử lý gì không?”     |
| Trust          | “Điều gì khiến bạn tin tưởng hoặc chưa tin tưởng rằng đơn hàng đã được ghi nhận?” |
| Trust          | “Bạn cần thấy thêm thông tin gì để tự tin rằng đơn hàng đã hoàn tất?”             |

Record answers only when the participant provides them. Do not paraphrase an answer as a quote or turn a participant's answer into a usability finding before analysis across the real, anonymized sessions.

## 9. SUS form

After the probes, ask the participant to answer each item from 1 (strongly disagree) to 5 (strongly agree). Do not explain an item in a way that suggests a score.

| #   | SUS statement                                                                      | Response (1–5) |
| --- | ---------------------------------------------------------------------------------- | -------------- |
| 1   | Tôi nghĩ rằng tôi muốn sử dụng hệ thống này thường xuyên.                          | `[Missing]`    |
| 2   | Tôi thấy hệ thống này không cần thiết phức tạp.                                    | `[Missing]`    |
| 3   | Tôi thấy hệ thống này dễ sử dụng.                                                  | `[Missing]`    |
| 4   | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của một người kỹ thuật để sử dụng hệ thống này. | `[Missing]`    |
| 5   | Tôi thấy các chức năng trong hệ thống được tích hợp tốt.                           | `[Missing]`    |
| 6   | Tôi thấy có quá nhiều điểm không nhất quán trong hệ thống này.                     | `[Missing]`    |
| 7   | Tôi nghĩ rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh.        | `[Missing]`    |
| 8   | Tôi thấy hệ thống này rất cồng kềnh khi sử dụng.                                   | `[Missing]`    |
| 9   | Tôi cảm thấy tự tin khi sử dụng hệ thống này.                                      | `[Missing]`    |
| 10  | Tôi cần học rất nhiều trước khi có thể sử dụng hệ thống này.                       | `[Missing]`    |

Only calculate SUS when all ten valid responses are available. For a complete response: odd item contribution = response − 1; even item contribution = 5 − response; sum contributions and multiply by 2.5.

## 10. Closing script

> Cảm ơn bạn đã tham gia. Phản hồi của bạn giúp chúng tôi hiểu sản phẩm rõ hơn. Chúng tôi sẽ xử lý dữ liệu theo các lựa chọn đồng ý của bạn. Nếu bạn muốn rút dữ liệu, hãy sử dụng thông tin liên hệ và thời hạn đã được thông báo trước phiên.

## 11. After the session

- [ ] Stop and securely save recordings according to the participant's consent scope.
- [ ] Complete the private observation record using only session evidence.
- [ ] Mark missing or unrecorded data explicitly; do not infer it later.
- [ ] Reset test fixture only through the verified process.
- [ ] Keep raw consent/contact/recording data private and out of Git.
- [ ] Do not calculate study-wide results or findings until real, anonymized `P01`–`P07` data is available.

## 12. Handoff conditions

The workflow may move to `record` only after a real session is completed and its data is anonymized. The workflow may move to a complete `analyze`/`report` only after consented data from all seven main participants, valid SUS responses and evidence references are available.
