# HW03 AI Audit Log

Tài liệu này lưu các interaction AI liên quan đến HW03 theo thứ tự thời gian và theo nguyên tắc append-only.

## Quy tắc Human Review

Mọi interaction mới phải bắt đầu với `Review status: Pending`. Chỉ sinh viên mới được xác nhận đã rà soát, ghi chỉnh sửa và chấp nhận artifact.

## Interactions

---

## HW03-AI-20260730-001

- Date and time: 2026-07-30 19:09:07
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: Agent Skill Creation
- Related task: Agent Skill
- Status: Completed

### User Prompt

`````text
Hãy sử dụng `$skill-creator` để tạo một Agent Skill dạng Markdown có tên `log-ai-audit`.

Mục tiêu của skill là tự động ghi lại các tương tác AI liên quan đến bài HW03, giúp sinh viên không phải sao chép thủ công prompt và output từ cửa sổ chat sang báo cáo AI Audit.

## 1. Phạm vi tạo file

Tạo:

./agent-skills/log-ai-audit/SKILL.md

Đồng thời khởi tạo tệp nhật ký:

./docs/ai-audit/AI_AUDIT_LOG.md

Chỉ tạo file Markdown.

Không tạo:

- script
- chương trình Python
- chương trình shell
- README
- agents/openai.yaml
- assets
- file cấu hình
- hook tự động
- bất kỳ file không phải Markdown nào

Skill phải hoạt động bằng cách hướng dẫn Codex đọc và cập nhật tệp Markdown.

## 2. Yêu cầu đối với SKILL.md

File phải có YAML frontmatter chỉ gồm:

---
name: log-ai-audit
description: <mô tả đầy đủ chức năng và điều kiện kích hoạt>
---

Không thêm trường YAML nào khác.

Phần `description` phải giúp skill được kích hoạt khi Codex thực hiện bất kỳ công việc nào liên quan đến HW03, bao gồm:

- phân tích đề bài
- lựa chọn phạm vi
- thiết kế prompt
- tạo hoặc chỉnh sửa Agent Skill
- tạo GUI checklist
- phản biện checklist
- ghi kết quả kiểm thử
- tạo bug report
- lập kế hoạch usability evaluation
- chuẩn bị usability session
- phân tích SUS hoặc UEQ-S
- viết báo cáo
- kiểm tra bài nộp
- chỉnh sửa các artifact của bài

Nội dung SKILL.md phải viết bằng tiếng Việt và sử dụng câu mệnh lệnh.

## 3. Quy trình hoạt động của skill

Hướng dẫn Codex thực hiện quy trình sau cho mỗi yêu cầu của người dùng:

### Bước 1 - Xác định tương tác cần ghi

Mỗi tin nhắn mới của người dùng được tính là một AI interaction mới.

Một interaction có thể gồm nhiều thao tác đọc file, chỉnh sửa file hoặc chạy công cụ nhưng chỉ tạo một bản ghi audit.

Không ghi mỗi tool call thành một interaction riêng.

Các câu hỏi, prompt dùng để:

- lập kế hoạch
- yêu cầu AI tư vấn
- yêu cầu AI tạo skill
- yêu cầu AI kiểm tra bài
- yêu cầu AI chỉnh sửa file

đều phải được ghi nhận.

### Bước 2 - Tạo mã interaction

Tạo ID theo định dạng:

HW03-AI-YYYYMMDD-NNN

Trong đó:

- YYYYMMDD là ngày tại múi giờ Asia/Ho_Chi_Minh
- NNN là số thứ tự trong ngày, bắt đầu từ 001

Không tái sử dụng ID đã tồn tại.

### Bước 3 - Ghi prompt

Ghi nguyên văn yêu cầu của người dùng vào phần `User Prompt`.

Không tự sửa chính tả, tóm tắt hoặc viết lại prompt.

Nếu prompt chứa thông tin nhạy cảm như:

- mật khẩu
- token
- API key
- thông tin liên hệ chưa che
- dữ liệu cá nhân của người tham gia

hãy thay phần nhạy cảm bằng `[REDACTED]` và ghi chú rằng nội dung đã được che vì lý do riêng tư.

### Bước 4 - Thực hiện công việc

Thực hiện yêu cầu của người dùng bình thường.

Theo dõi:

- file đã đọc
- file đã tạo
- file đã chỉnh sửa
- quyết định quan trọng
- validation đã thực hiện
- lỗi hoặc giới hạn gặp phải

Không ghi các suy luận nội bộ hoặc chain-of-thought.

### Bước 5 - Chuẩn bị AI output

Trước khi gửi câu trả lời cuối cùng:

1. Soạn trước nội dung câu trả lời cuối cùng.
2. Ghi chính nội dung đó vào phần `AI Output`.
3. Cập nhật danh sách artifact.
4. Lưu bản ghi vào `AI_AUDIT_LOG.md`.
5. Sau đó gửi cho người dùng đúng nội dung câu trả lời đã ghi.

Nếu AI tạo một tệp dài, không cần sao chép toàn bộ nội dung tệp vào nhật ký. Thay vào đó, ghi:

- đường dẫn tệp
- loại artifact
- mô tả nội dung
- trạng thái validation
- tên phiên bản hoặc checksum nếu có

Nhưng câu trả lời văn bản cuối cùng của AI vẫn phải được ghi nguyên văn.

Nếu yêu cầu thất bại, vẫn phải ghi interaction và mô tả lỗi trong AI Output.

### Bước 6 - Để sinh viên rà soát

Mỗi interaction phải có phần `Human Review` với trạng thái mặc định:

Pending

Không tự đổi thành Reviewed, Accepted hoặc Corrected.

Chỉ sinh viên mới được xác nhận đã rà soát và ghi nội dung chỉnh sửa.

## 4. Cấu trúc mỗi bản ghi audit

Mỗi interaction trong `AI_AUDIT_LOG.md` phải theo mẫu:

---

## HW03-AI-YYYYMMDD-NNN

- Date and time:
- Timezone: Asia/Ho_Chi_Minh
- AI tool:
- Model:
- Task category:
- Related task: Task 1 / Task 2 / Task 3 / Agent Skill / Report / Other
- Status: Completed / Partially completed / Blocked / Failed

### User Prompt

```text
Nội dung prompt nguyên văn
````

### AI Output

```text
Nội dung câu trả lời cuối cùng nguyên văn
```

### Files and Artifacts

| Path | Action                | Description | Validation                |
| ---- | --------------------- | ----------- | ------------------------- |
| ...  | Created/Modified/Read | ...         | Passed/Failed/Not checked |

### Important Decisions

* Chỉ ghi các quyết định và giả định ảnh hưởng đến kết quả.
* Không ghi chain-of-thought.

### Human Review

* Review status: Pending
* Reviewed by:
* Review date:
* Corrections made:
* Accepted artifacts:

---

Nếu tên model không được hệ thống cung cấp, ghi:

`Not exposed by the current environment`

Không được tự đoán tên model.

## 5. Quy tắc cập nhật tệp

* Giữ `AI_AUDIT_LOG.md` theo kiểu append-only.
* Không xóa hoặc sửa bản ghi cũ nếu người dùng không yêu cầu.
* Nếu cần sửa bản ghi, thêm phần `Correction` và giữ lại nội dung trước đó.
* Đọc các ID hiện có trước khi tạo ID mới.
* Không tạo hai bản ghi cho cùng một prompt.
* Không coi thao tác cập nhật AI Audit là một interaction mới.
* Bảo toàn các thay đổi không liên quan trong tệp.
* Không ghi dữ liệu riêng tư chưa được che.
* Không ghi thông tin đăng nhập hoặc secret.

## 6. Chế độ backfill

Skill phải hỗ trợ chế độ backfill khi người dùng cung cấp:

* nội dung chat đã xuất
* tệp Markdown chứa lịch sử chat
* prompt và output cũ

Trong chế độ này:

* chuyển từng cặp prompt/output thành một interaction
* ghi rõ `Entry mode: Backfilled`
* không tuyên bố lịch sử đầy đủ nếu dữ liệu đầu vào không đầy đủ
* không tự tái tạo output bị thiếu
* sử dụng `[MISSING OUTPUT]` nếu không có output gốc

## 7. Xuất AI Audit Report

Khi người dùng yêu cầu tạo AI Audit Report:

* đọc toàn bộ nhật ký
* sắp xếp interaction theo thời gian
* giữ nguyên prompt và output
* tạo báo cáo Markdown riêng
* không đưa secret hoặc dữ liệu cá nhân chưa che vào báo cáo
* liệt kê interaction chưa được Human Review xác nhận
* không tự xác nhận thay cho sinh viên

## 8. Khởi tạo nhật ký

Tạo `./docs/ai-audit/AI_AUDIT_LOG.md` với:

* tiêu đề tài liệu
* mô tả ngắn
* quy tắc trạng thái Human Review
* khu vực chứa các interaction

Không thêm dữ liệu mẫu có thể bị hiểu nhầm là interaction thật.

## 9. Ghi nhận chính prompt hiện tại

Prompt đang yêu cầu tạo `log-ai-audit` cũng là một lần sử dụng AI.

Vì skill chưa tồn tại trước interaction này, hãy thực hiện bootstrap audit:

1. Tạo skill.
2. Tạo nhật ký.
3. Tạo interaction đầu tiên cho chính prompt này.
4. Ghi prompt hiện tại nguyên văn.
5. Soạn trước câu trả lời cuối cùng.
6. Ghi câu trả lời đó vào AI Output.
7. Ghi các file đã tạo và validation.
8. Sau đó gửi đúng câu trả lời đã ghi cho người dùng.

Đặt `Task category` là:

Agent Skill Creation

Đặt `Related task` là:

Agent Skill

Đặt Human Review là:

Pending

## 10. Kiểm tra sau khi tạo

Sau khi hoàn thành:

1. Kiểm tra YAML frontmatter.
2. Kiểm tra tên thư mục khớp với `name`.
3. Kiểm tra chỉ có file Markdown.
4. Kiểm tra nhật ký chứa interaction bootstrap.
5. Kiểm tra prompt bootstrap được lưu nguyên văn.
6. Kiểm tra AI Output trong log giống câu trả lời cuối cùng.
7. Chạy `quick_validate.py` nếu có.
8. Nếu không có công cụ validation, kiểm tra thủ công và ghi rõ.
9. Báo đường dẫn của skill và nhật ký.
`````

### AI Output

```text
Đã tạo và kiểm tra xong skill `log-ai-audit`.

- Skill: [agent-skills/log-ai-audit/SKILL.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\agent-skills\log-ai-audit\SKILL.md:1>)
- Nhật ký: [docs/ai-audit/AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>)
- Bootstrap: `HW03-AI-20260730-001`, `Human Review: Pending`
- Validation: `quick_validate.py` trả về `Skill is valid!`; thư mục skill chỉ có `SKILL.md`; không có tệp non-Markdown trong hai phạm vi được tạo; prompt và AI Output bootstrap đã được đối chiếu nguyên văn.

Bộ khởi tạo mặc định không được chạy vì nó bắt buộc tạo `agents/openai.yaml`, trái với yêu cầu chỉ tạo Markdown. Mình không chạm vào các thay đổi có sẵn, không liên quan trong repo.
```

### Important Decisions

- Coi nội dung nguyên văn trong tệp đính kèm là prompt bootstrap cần lưu.
- Không chạy bộ khởi tạo vì công cụ đó bắt buộc tạo `agents/openai.yaml`, trái với phạm vi chỉ Markdown.
- Dùng hàng rào năm dấu backtick cho `User Prompt` để giữ nguyên các hàng rào Markdown nằm bên trong prompt.
- Không chạm vào các thay đổi không liên quan đã tồn tại trong repo.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Yêu cầu bootstrap được đáp ứng đúng phạm vi: skill có YAML frontmatter phù hợp, thư mục `log-ai-audit` chỉ chứa `SKILL.md`, prompt và AI Output được lưu trong interaction đầu tiên, và không có scaffold non-Markdown trong thư mục skill. Kiểm tra hiện tại vẫn xác nhận cấu trúc một-file-Markdown này.
- Student fix: Không cần sửa artifact. Giữ nguyên entry lịch sử và tiếp tục không ghi secret hoặc dữ liệu participant chưa che vào audit.

---

---

## HW03-AI-20260801-003

- Date and time: 2026-08-01 16:54:27
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: Usability Evaluation Planning
- Related task: Task 2
- Status: Completed

### User Prompt

```text
Dùng $log-ai-audit, sau đó dùng $run-usability-evaluation-workflow với
phase plan cho luồng mua hàng đã chọn.

Tạo research objectives, target-user profile, success criteria, task
scenario theo mục tiêu, pilot plan, consent requirements và evidence plan.
Không viết hướng dẫn từng bước cho người tham gia.
```

### AI Output

```text
Đã hoàn tất phase `plan`: [usability-plan.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task2\usability-plan.md>).

Kế hoạch bao gồm:

- Flow: tài khoản đã đăng nhập → Product Search → Product Detail → Add to Cart → Apply Coupon → Checkout → Order Confirmation.
- 5 research objectives, 10 research questions và ma trận traceability đến success criteria/evidence.
- Target-user profile với một pilot riêng `P00` và đúng bảy participant thật `P01–P07`, đều ngoài lớp HW03.
- 8 success criteria định lượng về completion, sản phẩm/số lượng, coupon/tổng tiền, thời gian, trợ giúp, nhận biết confirmation, SUS và blocker.
- Chọn SUS làm instrument sau phiên; không trộn với UEQ-S.
- Pilot plan, consent requirements, môi trường/fixture tách biệt theo phiên và evidence/privacy plan.

Task scenario chỉ giao mục tiêu mua 1 `iPhone 15 Pro Max`, dùng `SAVE10` và nhận biết đơn đã được ghi nhận. Scenario không chứa numbered steps, tên control, route hoặc chỉ dẫn thao tác giao diện.

Ranh giới hiện tại:

- Chưa tuyển participant, lấy consent, chạy pilot/session, tạo recording, thu SUS response, tính score hoặc tạo finding.
- Không có participant/evidence giả và không có thông tin liên hệ trong artifact.
- Ba quyết định còn để sinh viên điền trước phase `prepare`: retention/deletion date, withdrawal deadline/contact và compensation.
- Ghi chú scope cũ từng chọn Admin Category Management cho usability; prompt hiện tại được coi là xác nhận dùng luồng mua hàng cho artifact mới. Kế hoạch yêu cầu sinh viên xác nhận lại tính không trùng với thành viên nhóm trước khi tuyển mẫu.

Đã đối chiếu rubric Task 2 ở trang 5–6 của PDF tiếng Việt và capability thực của EShop. Validation: 240 dòng, 5 objectives, 10 questions, 8 criteria, scenario không có hướng dẫn từng bước, SHA-256 `4078C76A8BE684E7B9E3F5DC16D070AF17A5023A3D07272F20D878D742616B96`.

AI Audit đã được append với ID `HW03-AI-20260801-003`: [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md>). `Human Review` của interaction và plan vẫn là `Pending`; chỉ chuyển sang phase `prepare` sau khi bạn xác nhận các điểm còn mở.
```

### Important Decisions

- Interpreted the current explicit shopping-flow prompt as the plan's selected flow, while preserving a required Human Review checkpoint because an older group-scope note selected Admin Category Management.
- Started from an already authenticated account to keep registration/login/password recovery outside the chosen task.
- Chose SUS because the plan needs a single standard post-session instrument for overall perceived usability; did not mix it with UEQ-S.
- Used `P00` as a separate pilot and reserved `P01`-`P07` for seven real main sessions.
- Wrote one goal-based participant scenario and excluded UI steps, control names, routes, and completion instructions.
- Required isolated test accounts or verified reset because coupon usage and order state can contaminate later sessions; no fixture was created in phase `plan`.
- Kept contact, consent, recordings and raw responses private and out of AI prompts/Git; only anonymized participant codes belong in analysis artifacts.
- Did not create participant identities, consent, recordings, observations, SUS responses, scores or findings.
- Did not start or modify the SUT.
- Did not record chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Kế hoạch có đủ research objectives, target-user profile, success criteria, scenario theo mục tiêu, pilot, consent và evidence plan; scenario không hướng dẫn thao tác UI và không tạo participant data, consent, recording, SUS response hoặc finding giả. AI Output phản ánh phase `plan` tại thời điểm ghi; artifact đã được tiếp tục cập nhật ở phase sau nên coupon/checksum lịch sử không dùng để mô tả bản hiện tại.
- Student fix: Không sửa entry lịch sử. Trước `P00`, tiếp tục xác minh private storage, fixture/reset, browser baseline, phạm vi consent/recording của từng participant và tính không trùng luồng trong nhóm.

---

---

## HW03-AI-20260801-002

- Date and time: 2026-08-01 16:10:56
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: Playwright-Supported GUI Checklist Execution
- Related task: Task 1
- Status: Partially completed - Human Review Pending

### User Prompt

```text
`$run-gui-checklist-workflow` để viết và chạy Playwright nhằm hỗ trợ thực thi
Task 1 GUI Checklist.

Playwright chỉ là công cụ thực thi nội bộ. Báo cáo Task 1 cuối cùng phải tập
trung vào checklist, kết quả quan sát và bug, không biến thành báo cáo
automation.

## Nguyên tắc minh bạch

- Không tuyên bố rằng các test được thực hiện thủ công nếu chúng được chạy
  bằng Playwright.
- Ghi đầy đủ việc Codex tạo và chạy Playwright trong AI Audit Report.
- Không xóa, sửa hoặc làm sai lệch AI Audit để che giấu phương pháp.
- Không tự đánh giá phần cảm quan thay cho sinh viên.
- Sinh viên phải Human Review mọi kết quả trước khi đưa vào báo cáo cuối.

## Artifact đầu vào

Đọc:

- `artifacts/task1/gui-scope.md`
- `artifacts/task1/gui-checklist.md`
- `artifacts/task1/gui-checklist-critique.md`
- `artifacts/task1/gui-checklist-reviewed.md`
- toàn bộ file trong `artifacts/task1/setup/`

Không sửa các artifact đầu vào.

## Runtime và fixture

Sử dụng runtime và fixture đã được xác minh trong setup artifacts.

Chỉ truy cập:

- `http://localhost:3000`
- `http://localhost:5174`

Không truy cập dịch vụ bên ngoài.

## Kết quả kỹ thuật nội bộ

Được phép tạo nội bộ:

- Playwright configuration
- Playwright test files
- JSON results
- HTML report
- traces
- debug logs

Lưu chúng trong:

`tools/playwright/`
`artifacts/internal/playwright/`

Các file này dùng để chạy, debug và Human Review; không tự động chèn toàn
bộ nội dung kỹ thuật vào main report.

## Kết quả dùng cho bài nộp

Tạo:

- `artifacts/task1/gui-execution.md`
- `artifacts/task1/manual-verification-guide.md`
- `artifacts/task1/gui-test-summary.md`
- `artifacts/task1/suspected-defects.md`

### gui-execution.md

Giữ đúng cấu trúc checklist chính thức và chỉ ghi:

- Checklist ID
- Actual Result
- Status
- Notes
- Evidence

Không thêm vào bảng cuối các cột:

- Playwright Test ID
- Automation Status
- Locator
- Assertion
- Test File
- Mock Type

Đối với item có kết quả khách quan đã chạy thành công:

- ghi kết quả quan sát thực tế;
- dùng Passed hoặc Failed sau khi đã loại trừ lỗi fixture và test code.

Đối với item cần cảm quan:

- không tự kết luận;
- ghi `Pending Human Review` trong bản làm việc;
- đưa hướng dẫn vào `manual-verification-guide.md`.

Trước khi xuất checklist cuối, mọi item hợp lệ phải được sinh viên xác nhận
thành Passed hoặc Failed.

## Phân biệt kết quả

Không ghi product Failed nếu nguyên nhân là:

- locator sai;
- credential sai;
- test data sai;
- runtime không hoạt động;
- timeout môi trường;
- script lỗi;
- fixture chưa reset.

Ghi các trường hợp này vào internal Playwright report, không đưa chúng vào
danh sách bug sản phẩm.

## Mocking

Có thể dùng mock để tạo loading, empty hoặc server-error state.

Trong kết quả nội bộ phải ghi rõ mocked hay real backend.

Trong main report, mô tả trạng thái kiểm thử và kết quả quan sát; không
tuyên bố backend thật trả lỗi nếu lỗi được tạo bằng mock.

## Human Review

Sau khi chạy xong:

1. Liệt kê các item có kết quả khách quan.
2. Liệt kê các item cần sinh viên xem screenshot hoặc chạy thủ công.
3. Liệt kê suspected defects.
4. Chưa tạo GitHub Issue.
5. Chờ sinh viên xác nhận.
6. Chỉ sau khi xác nhận mới tạo bản checklist final.

## Cách viết phương pháp trong main report

Tạo một đoạn ngắn, không quá 3 câu:

“Các kiểm tra có tiêu chí khách quan và lặp lại được được hỗ trợ thực thi
bằng browser automation. Các tiêu chí mang tính cảm quan hoặc yêu cầu đánh
giá trực quan được sinh viên thực hiện và xác nhận thủ công. Mọi kết quả do
AI/công cụ tạo ra đều được Human Review trước khi đưa vào báo cáo.”

Không đưa chi tiết source code hoặc cấu hình automation vào phần Task 1.

## AI Audit

AI Audit phải giữ nguyên:

- prompt;
- output;
- file kỹ thuật được tạo;
- command đã chạy;
- kết quả validation;
- Human Review: Pending.

Không bỏ qua interaction chỉ vì artifact kỹ thuật không xuất hiện trong main
report.
```

### AI Output

```text
Đã hoàn tất lượt chạy hỗ trợ Task 1, nhưng đây **chưa phải checklist final** vì `Human Review` vẫn là `Pending`.

Các artifact dùng cho bài nộp:

- [gui-execution.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-execution.md>) — đúng 60 ID và đúng 5 cột yêu cầu.
- [manual-verification-guide.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\manual-verification-guide.md>) — hướng dẫn 12 mục cần sinh viên xác nhận.
- [gui-test-summary.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-test-summary.md>) — danh sách đầy đủ 48 mục khách quan và đoạn phương pháp 3 câu.
- [suspected-defects.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\suspected-defects.md>) — 13 nhóm suspected defect, tất cả chờ xác nhận.

Kết quả làm việc: 27 `Passed`, 21 `Failed`, 12 `Pending Human Review`. Các mục cần sinh viên xem/chạy thủ công là `GUI-006, GUI-008, GUI-011, GUI-039, GUI-043, GUI-044, GUI-046, GUI-048, GUI-050, GUI-053, GUI-057, GUI-058`.

13 nhóm suspected defect gồm: render địa chỉ dạng HTML; doanh thu Dashboard bị nhân đôi; thiếu label/required ở Login; gửi request trùng khi double-click; sidebar không truy cập được bằng bàn phím; thiếu loading state; thiếu empty state; thiếu fetch-error/recovery state; đơn đã hủy vẫn có action chuyển sang đã giao; mất focus sau cập nhật; accessible name của action thiếu ngữ cảnh đơn; thiếu live region; và lỗi cập nhật không gắn với dòng đơn cụ thể.

Ranh giới xác minh:

- Playwright runner cuối: 4/4 scenario passed trong 14,2 giây với Playwright 1.61.1 và Chromium 149.0.7827.55. Đây là trạng thái runner, không phải 60/60 product checks Passed.
- Hai lỗi locator/script trong các lượt đầu được ghi riêng là lỗi test code, đã sửa và **không** bị ghi thành product defect.
- Mock được dùng minh bạch cho `GUI-017, GUI-019, GUI-026, GUI-040, GUI-041, GUI-042, GUI-055, GUI-059`; báo cáo không tuyên bố backend thật trả delay/error này.
- Có 32 screenshot evidence; không có mục `Failed` nào thiếu evidence. Xem [run-log.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\internal\playwright\run-log.md>), [checklist-results.json](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\internal\playwright\checklist-results.json>) và [HTML report](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\internal\playwright\html-report\index.html>).
- Backend/Admin vẫn đang chạy ở localhost. Fixture sau transition hiện là `#1 confirmed, #2 canceled, #3 shipping, #4 canceled, #5 delivered, #6 delivered, #7 canceled`; mình không tự chạy lại suite hoặc rollback database.
- Không tạo GitHub Issue và không tạo checklist final.

AI Audit đã được append dưới ID `HW03-AI-20260801-002`: [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md>). Bước tiếp theo là sinh viên Human Review 12 mục pending và xác nhận/reject các suspected defect trước khi đổi mọi trạng thái hợp lệ thành `Passed` hoặc `Failed`.

```

### Important Decisions

- Treated Playwright as internal execution support and kept source/configuration details out of the Task 1 checklist table.
- Used only the already-running localhost backend/Admin and installed Playwright offline from the local npm/browser cache.
- Kept initial locator/selector failures in the internal log and did not classify them as product failures.
- Used controlled route mocks only for explicitly declared loading, empty, error, and delayed-response observations; did not claim the real backend produced those responses.
- Corrected GUI-038 and GUI-056 after reviewing the recorded active element, and moved GUI-046/048/050 to Pending Human Review because feedback sufficiency is a student judgment.
- Did not assign subjective visual/accessibility conclusions to the student.
- Did not rerun the consumptive transition suite after the valid run, did not stop services, and did not restore the database without separate rollback approval.
- Did not create GitHub Issues or a final checklist.
- Preserved all pre-existing workspace changes and did not modify the specified input/setup artifacts in this interaction.
- Did not record chain-of-thought.

### Human Review

- Verdict: Valid
- Reasoning: Output phân biệt đúng trạng thái Playwright runner với kết quả product checklist, ghi rõ controlled mock, tách lỗi locator khỏi product defect và không biến 12 mục chủ quan thành kết luận của AI. Số liệu `27 Passed / 21 Failed / 12 Pending Human Review` là snapshot của lượt chạy này, không phải trạng thái cuối hiện tại.
- Student fix: Đã hoàn tất review 12 mục pending ở bước sau; `gui-execution.md` hiện có `32 Passed / 28 Failed / 0 Pending Human Review`. Giữ entry này làm lịch sử, không viết lại số liệu cũ.

---

---

## HW03-AI-20260730-002

- Date and time: 2026-07-30 20:33:16
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: Agent Skill Creation
- Related task: Agent Skill
- Status: Completed

### User Prompt

```text
Hãy dùng `$log-ai-audit` để ghi lại toàn bộ interaction này, sau đó dùng `$skill-creator` để tạo ba Agent Skill còn lại phục vụ bài HW03.

Toàn bộ quá trình tạo ba skill trong yêu cầu này chỉ được tính là một AI interaction. Không tạo một audit entry riêng cho từng skill.

## 1. Kiểm tra trước khi bắt đầu

Làm việc tại thư mục gốc của repository hiện tại.

Kiểm tra các file sau:

- `./agent-skills/log-ai-audit/SKILL.md`
- `./docs/ai-audit/AI_AUDIT_LOG.md`

Nếu `log-ai-audit` chưa tồn tại:

1. Không tạo ba skill còn lại.
2. Dừng công việc.
3. Thông báo rằng cần tạo AI Audit Skill trước.

Nếu đã tồn tại:

1. Kích hoạt `$log-ai-audit`.
2. Tạo một audit ID cho toàn bộ interaction.
3. Ghi nguyên văn prompt này.
4. Sau đó mới bắt đầu tạo skill.

## 2. Các skill cần tạo

Tạo đúng ba skill:

1. `run-gui-checklist-workflow`
2. `run-usability-evaluation-workflow`
3. `validate-hw03-deliverables`

Cấu trúc cuối cùng:

agent-skills/
├── log-ai-audit/
│   └── SKILL.md
├── run-gui-checklist-workflow/
│   └── SKILL.md
├── run-usability-evaluation-workflow/
│   └── SKILL.md
└── validate-hw03-deliverables/
    └── SKILL.md

Không sửa `log-ai-audit` trừ khi phát hiện lỗi khiến việc ghi interaction hiện tại không thể thực hiện.

## 3. Ràng buộc về định dạng

Mỗi skill chỉ được chứa:

`<skill-name>/SKILL.md`

Chỉ tạo file Markdown.

Không tạo:

- README.md
- scripts
- assets
- references
- agents/openai.yaml
- file YAML riêng
- file JSON
- mã nguồn Python hoặc shell
- dữ liệu kiểm thử mẫu
- bằng chứng giả

Nếu dùng `init_skill.py` và công cụ này tạo thêm file tùy chọn, hãy loại bỏ các file tùy chọn trước khi hoàn thành. Thư mục cuối cùng của mỗi skill chỉ được chứa `SKILL.md`.

Mỗi `SKILL.md` phải có YAML frontmatter chỉ gồm:

---
name: <skill-name>
description: <mô tả>
---

Không thêm trường YAML khác.

Các yêu cầu chung:

- Viết nội dung bằng tiếng Việt.
- Sử dụng câu mệnh lệnh.
- Giữ nguyên thuật ngữ GUI, SUT, FR, IA, SUS, UEQ-S, Passed và Failed khi phù hợp.
- Đặt toàn bộ điều kiện kích hoạt skill trong trường `description`.
- Viết `description` đủ rõ để Codex tự nhận biết khi nào cần dùng skill.
- Giữ mỗi file dưới 400 dòng nếu có thể.
- Không phụ thuộc vào nội dung của cuộc trò chuyện hiện tại.
- Một Codex mới phải có thể đọc `SKILL.md` và thực hiện đúng quy trình.
- Không hardcode hoàn toàn cho một màn hình hoặc flow.
- Sử dụng phạm vi bài hiện tại làm ví dụ mặc định nhưng vẫn cho phép tái sử dụng.
- Không để TODO, placeholder vô nghĩa hoặc nội dung mẫu chưa hoàn thiện.

Mỗi SKILL.md phải có các phần:

1. Mục tiêu
2. Đầu vào bắt buộc
3. Kiểm tra đầu vào
4. Các phase được hỗ trợ
5. Quy trình thực hiện
6. Định dạng artifact đầu ra
7. Quy tắc đặt tên và traceability
8. Quy tắc bảo vệ bằng chứng
9. Stop conditions
10. Quy trình dành cho demo video
11. Kiểm tra trước khi kết thúc

## 4. Skill `run-gui-checklist-workflow`

### Phạm vi mặc định

- Primary screen: Admin Order Management
- Supporting screens:
  - Admin Dashboard
  - Order Detail
  - Update Order Status

Skill phải tái sử dụng được với màn hình khác khi người dùng cung cấp scope mới.

### Mục tiêu

Thực hiện quy trình GUI checklist đầu-cuối trong một skill duy nhất:

scope
→ generate
→ critique
→ execute
→ bugs
→ summary

Cho phép người dùng chạy một phase riêng hoặc toàn bộ các phase hợp lệ theo thứ tự.

### Phase `scope`

Thực hiện:

- Xác định user role.
- Xác định primary screen và supporting screens.
- Xác định component.
- Xác định user action.
- Xác định precondition.
- Xác định test data.
- Xác định trạng thái:
  - normal
  - loading
  - empty
  - error
  - success
  - disabled
- Ánh xạ FR và IA.
- Cảnh báo nếu phạm vi quá nhỏ để tạo hơn 40 mục có ý nghĩa.
- Không suy đoán tính năng chưa được xác nhận.

Đầu ra mặc định:

`artifacts/task1/gui-scope.md`

### Phase `generate`

Tạo khoảng 48-55 checklist item ban đầu.

Bao phủ đầy đủ:

- IA-01: General UI standards
- IA-02: Forms
- IA-03: Navigation
- IA-04: Feedback / state

Mỗi item phải:

- cụ thể
- có thể quan sát
- có expected result rõ ràng
- không trùng lặp
- gắn với một screen/component
- có precondition khi cần

Sử dụng các cột:

- Checklist ID
- Interface Aspect
- Screen
- Component
- Preconditions
- Test Item
- Test Steps
- Expected Result
- Actual Result
- Status
- Notes
- Evidence
- Source

Quy tắc:

- Dùng ID dạng `GUI-001`.
- Đặt `Source` là `AI-generated`.
- Để trống Actual Result, Status, Notes và Evidence.
- Không tự đánh dấu Passed hoặc Failed.

Đầu ra mặc định:

`artifacts/task1/gui-checklist.md`

### Phase `critique`

Kiểm tra:

- checklist item trùng lặp
- item quá chung chung
- item không thể quan sát
- expected result không rõ
- thiếu coverage
- mất cân bằng giữa IA-01 đến IA-04

Tìm những khoảng trống thường bị AI bỏ qua:

- accessibility
- keyboard navigation
- focus visibility
- screen-reader label
- responsive layout
- localization
- RTL
- dark mode
- loading state
- empty state
- validation error
- server error
- success feedback
- disabled state
- destructive-action confirmation
- status consistency

Đề xuất item bổ sung và lý do AI có thể đã bỏ sót.

Không tự gắn `Student-added`.

Chỉ gắn `Student-added` sau khi người dùng xác nhận đã tự rà soát và chấp nhận item.

Đầu ra mặc định:

`artifacts/task1/gui-checklist-critique.md`

### Phase `execute`

Chỉ ghi kết quả từ quan sát thật do người dùng cung cấp.

Các trạng thái hợp lệ:

- Passed
- Failed
- Blocked
- Not Run

Không suy đoán trạng thái.

Nếu thiếu quan sát:

- dùng Not Run; hoặc
- dùng Blocked nếu có nguyên nhân chặn rõ ràng.

Với Failed, yêu cầu:

- Actual Result
- Notes
- môi trường kiểm thử
- Evidence
- lý do không đạt

Chỉ yêu cầu screenshot cho Failed item.

Không sửa Test Item hoặc Expected Result trong lúc ghi execution result.

Đầu ra mặc định:

`artifacts/task1/gui-execution.md`

### Phase `bugs`

Chỉ xử lý Failed item đã được xác minh.

Tạo bug-report draft gồm:

- Bug ID
- Title
- Related Checklist IDs
- Environment
- Preconditions
- Steps to Reproduce
- Expected Result
- Actual Result
- Severity
- Priority
- Reproducibility
- Evidence
- GitHub Issue Status

Dùng Bug ID dạng `BUG-001`.

Nhóm các Failed item có cùng nguyên nhân để tránh issue trùng.

Không tự đăng GitHub Issue.

Không bịa URL, screenshot hoặc kết quả tái hiện.

Đầu ra mặc định:

`artifacts/task1/bug-reports.md`

### Phase `summary`

Tổng hợp:

- số checklist item
- số item theo từng IA
- Passed
- Failed
- Blocked
- Not Run
- số bug duy nhất
- số Failed item chưa có screenshot
- coverage theo screen

Đầu ra:

`artifacts/task1/gui-test-summary.md`

### Chế độ demo video

Bổ sung workflow giúp người dùng trình diễn:

1. Hiển thị phạm vi.
2. Chạy scope.
3. Chạy generate.
4. Hiển thị checklist và thống kê IA.
5. Chạy critique.
6. Yêu cầu người dùng xác nhận phần human review.
7. Nhận kết quả kiểm thử thật đã chuẩn bị.
8. Chạy execute.
9. Chạy bugs.
10. Chạy summary.
11. Hiển thị danh sách artifact được tạo.

Không yêu cầu thực thi trực tiếp toàn bộ hơn 40 item trong lúc quay video. Cho phép sử dụng execution artifact thật đã chuẩn bị trước, nhưng phải kiểm tra tính xác thực và không được tự tạo kết quả.

## 5. Skill `run-usability-evaluation-workflow`

### Luồng mặc định

Product Search
→ Product Detail
→ Add to Cart
→ Apply Coupon
→ Checkout
→ Order Confirmation

Bắt đầu từ tài khoản đã đăng nhập để tránh trùng với các flow đăng ký, đăng nhập hoặc quên mật khẩu của thành viên khác.

Skill phải tái sử dụng được với flow khác.

### Mục tiêu

Thực hiện quy trình usability evaluation đầu-cuối:

plan
→ prepare
→ record
→ analyze
→ report

### Phase `plan`

Tạo:

- research objectives
- research questions
- target-user profile
- participant criteria
- exclusion criteria
- success criteria
- task scenario
- pilot plan
- consent requirements
- test environment
- evidence plan
- research risks

Task scenario phải:

- theo mục tiêu
- có bối cảnh thực tế
- không liệt kê từng bước giao diện
- không tiết lộ chính xác cách hoàn thành

Đầu ra:

`artifacts/task2/usability-plan.md`

### Phase `prepare`

Tạo session kit gồm:

- introduction
- consent statement
- câu “chúng tôi kiểm thử sản phẩm, không kiểm thử bạn”
- think-aloud instruction
- task scenario
- moderator script
- neutral intervention rules
- observation template
- SUS hoặc UEQ-S instrument section
- open-ended probe questions
- closing script

Probe questions phải bao phủ tối thiểu:

- clarity
- error recovery
- speed
- trust

Không tạo câu hỏi dẫn dắt.

Đầu ra:

`artifacts/task2/moderator-session-kit.md`

### Phase `record`

Tạo cấu trúc ghi chép P01-P07.

Chỉ ghi dữ liệu thật do người dùng cung cấp.

Ghi:

- participant code
- eligibility
- session date
- start/end time
- completion status
- completion time
- errors
- hesitations
- backtracking
- requests for help
- moderator interventions
- notable statements
- friction points
- emotional signals
- SUS/UEQ-S responses
- recording/evidence references

Phân biệt:

- None observed
- Not observed
- Not recorded
- Missing

Không tự điền dữ liệu còn thiếu.

Không hiển thị thông tin liên hệ chưa che trong artifact phân tích.

Đầu ra:

`artifacts/task2/session-observations.md`

### Phase `analyze`

Chỉ phân tích dữ liệu thật được cung cấp.

Kiểm tra đủ 7 người tham gia.

Nếu chưa đủ 7 người:

- vẫn có thể phân tích tạm thời khi người dùng yêu cầu
- đánh dấu rõ `Provisional`
- không tuyên bố Task 2 đã hoàn thành

Nếu dùng SUS:

- item lẻ: response - 1
- item chẵn: 5 - response
- cộng điểm đóng góp
- nhân tổng với 2.5

Nếu dùng UEQ-S:

- dùng đúng thang và công thức UEQ-S
- không trộn với SUS
- ghi rõ cách chuyển đổi thang điểm

Tạo:

- điểm từng participant
- điểm tổng hợp
- completion rate
- completion time
- error count
- help-request count
- pain-point groups
- isolated bugs
- systemic design issues
- severity-ranked findings
- traceability đến participant code và evidence

Severity:

- Critical
- Major
- Moderate
- Minor

Không đưa ra số liệu nếu đầu vào không đủ.

Đầu ra:

- `artifacts/task2/usability-scores.md`
- `artifacts/task2/severity-findings.md`

### Phase `report`

Tạo báo cáo gồm:

- objectives
- methodology
- participant profile đã ẩn danh
- task scenario
- pilot changes
- quantitative results
- qualitative findings
- bugs
- systemic issues
- severity
- limitations
- recommendations
- evidence references

Không bịa dữ liệu để hoàn thiện báo cáo.

Dùng `[MISSING: ...]` cho nội dung bắt buộc còn thiếu.

Đầu ra:

`artifacts/task2/usability-report.md`

### Quy tắc bằng chứng

Cấm:

- tạo người tham gia giả
- tạo tên hoặc thông tin liên hệ giả
- tạo SUS/UEQ-S response giả
- tạo recording giả
- tạo phát biểu giả
- mạo danh participant
- dùng dữ liệu DEMO_ONLY làm bằng chứng thật

Nếu dùng dữ liệu thử skill:

- gắn nhãn `DEMO_ONLY`
- lưu tách khỏi artifact thật
- không đưa vào report chính
- cảnh báo rõ không hợp lệ để nộp bài

### Chế độ demo video

Hướng dẫn người dùng trình diễn:

1. Hiển thị flow.
2. Chạy plan.
3. Chạy prepare.
4. Hiển thị session kit.
5. Nạp dữ liệu thật đã ẩn danh.
6. Chạy analyze.
7. Hiển thị điểm và findings.
8. Chạy report.
9. Hiển thị traceability.
10. Hiển thị artifact list.

Không để lộ tên, số điện thoại, Zalo, email, giọng nói hoặc video của participant khi chưa có sự đồng ý.

## 6. Skill `validate-hw03-deliverables`

### Mục tiêu

Kiểm tra artifact của HW03 mà không tự sửa hoặc tạo bằng chứng còn thiếu.

### Phạm vi kiểm tra

Kiểm tra tối thiểu:

#### Task 1

- hơn 40 checklist item
- đủ IA-01 đến IA-04
- primary screen rõ ràng
- checklist đã được human review
- Passed/Failed/Blocked/Not Run hợp lệ
- Failed item có Notes
- Failed item có screenshot
- bug report có traceability
- GitHub Issue evidence

#### Task 2

- một end-to-end flow
- pilot session
- đủ 7 người tham gia thật
- participant ở ngoài lớp HW03
- thông tin liên hệ đã che
- consent
- observation notes
- SUS hoặc UEQ-S
- recording/evidence reference
- severity-ranked findings
- bug screenshots
- traceability đến P01-P07

#### Các phần khác

- AI Audit Report
- Human Review của AI interaction
- AI Critique 200-300 từ
- Git commit log
- main report Markdown + PDF
- Excel checklist
- cross-platform evidence
- README self-assessment
- test summary
- Agent Skill files
- demo video links
- đúng định dạng tên ZIP

### Quy tắc validation

Sử dụng trạng thái:

- Pass
- Fail
- Warning
- Not Checked
- Present but Unverified

Không đánh dấu Pass chỉ vì thấy tên file.

Phải đọc hoặc kiểm tra nội dung tương ứng.

Không tự tạo file hoặc dữ liệu để biến Fail thành Pass.

Không tự sửa bằng chứng người tham gia.

Không suy đoán GitHub Issue hoặc screenshot tồn tại.

### Đầu ra

Tạo:

`artifacts/validation/hw03-compliance-report.md`

Bảng báo cáo gồm:

- Requirement ID
- Requirement
- Status
- Evidence
- Problem
- Required Action

Thêm phần tổng hợp:

- Blocking problems
- Warnings
- Missing artifacts
- Unverified evidence
- Ready/Not Ready conclusion

Kết luận `Ready` chỉ được dùng nếu không còn blocking problem.

### Chế độ demo video

Cho phép người dùng:

1. Chạy validation lần đầu.
2. Xem Fail và Warning.
3. Sửa artifact thật.
4. Chạy lại validation.
5. So sánh trước và sau.

Không tự sửa lỗi chỉ để tạo kết quả đẹp cho video.

## 7. Hợp đồng dữ liệu giữa các skill

Đảm bảo các skill sử dụng thống nhất:

### Task 1

- `gui-scope.md`
- `gui-checklist.md`
- `gui-checklist-critique.md`
- `gui-execution.md`
- `bug-reports.md`
- `gui-test-summary.md`

### Task 2

- `usability-plan.md`
- `moderator-session-kit.md`
- `session-observations.md`
- `usability-scores.md`
- `severity-findings.md`
- `usability-report.md`

### Validation

- `hw03-compliance-report.md`

`validate-hw03-deliverables` phải hiểu các tên artifact này nhưng vẫn cho phép người dùng cung cấp đường dẫn khác.

Không ghi đè nội dung do sinh viên chỉnh sửa mà không đọc và bảo toàn nội dung hiện có.

## 8. Quy tắc dành cho AI Audit

Toàn bộ phiên tạo ba skill là một interaction.

Audit entry phải ghi:

- prompt nguyên văn
- câu trả lời cuối cùng
- ba SKILL.md được tạo
- file nào được đọc
- validation đã chạy
- lỗi hoặc giới hạn
- Human Review: Pending

Không tạo audit entry riêng cho:

- từng file
- từng tool call
- từng bước validation
- việc cập nhật chính AI audit log

Trước khi trả lời người dùng:

1. Soạn câu trả lời cuối cùng.
2. Ghi cùng câu trả lời đó vào AI Output.
3. Cập nhật artifact list.
4. Lưu audit log.
5. Sau đó trả lời bằng đúng nội dung đã ghi.

## 9. Validation sau khi tạo

Sau khi tạo ba skill:

1. Liệt kê các đường dẫn.
2. Kiểm tra mỗi thư mục chỉ có SKILL.md.
3. Kiểm tra YAML frontmatter.
4. Kiểm tra trường name khớp tên thư mục.
5. Kiểm tra description chứa điều kiện kích hoạt.
6. Kiểm tra không có TODO.
7. Kiểm tra không có file ngoài Markdown.
8. Kiểm tra các phase có đầu vào và đầu ra rõ ràng.
9. Kiểm tra ba skill dùng cùng artifact contract.
10. Kiểm tra mọi quy tắc chống bịa bằng chứng.
11. Kiểm tra demo workflow đủ rõ để quay video.
12. Chạy `quick_validate.py` nếu có.
13. Nếu validation thất bại, sửa và chạy lại.
14. Không báo hoàn thành khi còn lỗi validation.

Đọc lại mỗi skill như một Codex mới không có lịch sử cuộc trò chuyện. Sửa mọi phần phụ thuộc vào ngữ cảnh hiện tại.

## 10. Câu trả lời cuối cùng

Cung cấp bảng:

| Skill | Path | Main phases | Validation |
|---|---|---|---|

Sau bảng, ghi:

- Audit interaction ID
- Audit log path
- Các giới hạn còn lại
- Bước tiếp theo để bắt đầu demo

Không dán toàn bộ nội dung ba SKILL.md vào câu trả lời nếu các file đã được tạo thành công.
```

### AI Output

```text
Đã tạo và kiểm tra xong ba Agent Skill cho HW03.

| Skill | Path | Main phases | Validation |
| --- | --- | --- | --- |
| `run-gui-checklist-workflow` | [SKILL.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\agent-skills\run-gui-checklist-workflow\SKILL.md:1>) | `scope → generate → critique → execute → bugs → summary` | Passed — `Skill is valid!`; 1 Markdown file, 187 dòng |
| `run-usability-evaluation-workflow` | [SKILL.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\agent-skills\run-usability-evaluation-workflow\SKILL.md:1>) | `plan → prepare → record → analyze → report` | Passed — `Skill is valid!`; 1 Markdown file, 179 dòng |
| `validate-hw03-deliverables` | [SKILL.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\agent-skills\validate-hw03-deliverables\SKILL.md:1>) | `discover → validate-task1 → validate-task2 → validate-other → conclude` | Passed — `Skill is valid!`; 1 Markdown file, 180 dòng |

- Audit interaction ID: `HW03-AI-20260730-002`
- Audit log path: [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>)
- Các giới hạn còn lại: Chưa forward-test ba skill trên artifact HW03 thực và không tạo dữ liệu kiểm thử hoặc bằng chứng; `Human Review` của interaction vẫn là `Pending`.
- Bước tiếp theo để bắt đầu demo: gọi `$run-gui-checklist-workflow` với `phase: scope` và cung cấp phạm vi đã xác nhận; sau đó chạy lần lượt các phase còn lại bằng artifact thật.

```

### Important Decisions

- Gộp toàn bộ quá trình tạo và validation ba skill vào một audit entry.
- Dùng đúng phạm vi mặc định trong prompt nhưng cho phép người dùng thay screen, flow và đường dẫn artifact.
- Giữ hợp đồng 13 tên artifact giống nhau trong cả ba skill.
- Xóa metadata scaffold để mỗi thư mục cuối cùng chỉ chứa `SKILL.md`.
- Một lệnh xóa metadata đệ quy ban đầu bị policy chặn trước khi thực thi; chuyển sang bản vá xóa đúng ba tệp và xóa thư mục rỗng.
- Không forward-test bằng subagent và không tạo dữ liệu hoặc bằng chứng demo.
- Không chạm vào các thay đổi không liên quan đã tồn tại trong repo.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Ba skill tồn tại đúng tên, mỗi thư mục chỉ có một `SKILL.md`; kiểm tra hiện tại xác nhận số dòng lần lượt là 187, 179 và 180, phù hợp AI Output. Các skill giữ ranh giới không tự tạo test evidence hoặc dữ liệu usability.
- Student fix: Không cần sửa. Forward-test đã được thực hiện qua các interaction Task 1 và Task 2 về sau; không backfill kết quả đó vào entry tạo skill.

---

---

## HW03-AI-20260731-001

- Date and time: 2026-07-31 00:12:02
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: GUI Scope Analysis
- Related task: Task 1
- Status: Completed

### User Prompt

```text
Dùng $log-ai-audit để ghi lại interaction này, sau đó dùng
$run-gui-checklist-workflow với phase scope.

Primary screen là Admin Order Management. Supporting screens gồm
Admin Dashboard, Order Detail và Update Order Status.

Hãy đọc đặc tả SUT, xác định component, user action, trạng thái giao diện,
precondition, test data và ánh xạ FR/IA. Không suy đoán chức năng không
được xác nhận.
```

### AI Output

```text
Đã hoàn tất phase `scope` và tạo [gui-scope.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-scope.md:1>).

Kết quả chính:

- Xác nhận `Admin Order Management` là tab Đơn hàng và `Admin Dashboard` là tab riêng trong Web Admin.
- `Order Detail` không tồn tại như màn hình riêng; phạm vi chỉ dùng row-level order summary. `Update Order Status` là nhóm action inline trong bảng.
- Ánh xạ 24 scope points qua FR-10, FR-12, FR-13, FR-18 và IA-01..IA-04, bao gồm normal, loading, empty, error, success, disabled/final-state boundaries.
- Ghi 4 chênh lệch đặc tả–mã thành `RISK-01..04`; chưa gắn Passed/Failed vì chưa chạy SUT.
- Scope đủ rộng để tạo hơn 40 checklist item có ý nghĩa mà không tạo màn hình hoặc chức năng giả.
- Validation: 148 dòng, 24 scope rows, 4 risk rows, không có credential/TODO; SHA-256 `5465806ADA48C4011013DADBBDACF3504175D65C76588DB071DD3F84E8047815`.
- Audit interaction ID: `HW03-AI-20260731-001`; [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>).

`Human Review` vẫn là `Pending`. Trước phase `generate`, hãy xác nhận checkout SUT và hai quyết định ranh giới về `Order Detail`/`Update Order Status`.
```

### Important Decisions

- Chọn checkout `Hcmus-Software_Testing-eshop-sut` vì repository hiện tại không chứa mã SUT và checkout này có đồng thời FR/API/frontend khớp phạm vi.
- Không dùng scope HW03 cũ trong memory để ghi đè phạm vi Admin Order Management mà người dùng chỉ định ở interaction hiện tại.
- Không coi `Order Detail` hoặc `Update Order Status` là màn hình riêng khi frontend chỉ có order row và inline action.
- Ghi chênh lệch đặc tả–mã thành risk cho phase sau, không biến phân tích tĩnh thành Passed/Failed.
- Không ghi credential đọc được từ tài liệu seed vào artifact hoặc AI Output.
- Không chạy SUT vì phase `scope` chỉ yêu cầu phân tích đặc tả/mã và chưa cần execution evidence.
- Không chạm vào các thay đổi không liên quan đã tồn tại trong repo.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: `gui-scope.md` xác định đúng Admin Order Management là primary screen, Dashboard là supporting screen, Order Detail ở mức row summary và status update là inline action. Kiểm tra hiện tại xác nhận 24 scope rows và 4 risk IDs; entry không suy diễn phân tích tĩnh thành Passed/Failed.
- Student fix: Các quyết định ranh giới đã được sinh viên xác nhận ở interaction `HW03-AI-20260801-001`; không cần sửa entry scope lịch sử.

---

---

## HW03-AI-20260731-002

- Date and time: 2026-07-31 01:00:09
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: GUI Checklist Generation
- Related task: Task 1
- Status: Completed

### User Prompt

```text
Dùng $log-ai-audit, sau đó dùng $run-gui-checklist-workflow với phase
generate dựa trên artifacts/task1/gui-scope.md.

Tạo khoảng 48-55 checklist item, bao phủ IA-01 đến IA-04. Chưa điền
Actual Result, Status, Notes hoặc Evidence.
```

### AI Output

```text
Đã hoàn tất phase `generate` và tạo [gui-checklist.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-checklist.md:1>).

- Tổng cộng: 52 item, ID liên tục `GUI-001..GUI-052`.
- Phân bố: IA-01 = 13, IA-02 = 13, IA-03 = 13, IA-04 = 13.
- Mỗi item có Screen, Component, Preconditions, Test Item, Test Steps và Expected Result cụ thể.
- `Actual Result`, `Status`, `Notes`, `Evidence` đều để trống trong cả 52 item.
- `Source` của mọi item là `AI-generated`; chưa gắn `Student-added`, Passed hoặc Failed.
- Validation: 52 ID duy nhất, đúng 13 cột, không có lỗi cấu trúc; SHA-256 `01037E34CB65549D0A6764E2A8163BE4A9E641217BD42042B3979D2C136EF16D`.
- Audit interaction ID: `HW03-AI-20260731-002`; [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>).

`Human Review` vẫn là `Pending`. Bước tiếp theo phù hợp là chạy phase `critique` để tìm item trùng, mơ hồ hoặc thiếu coverage trước khi thực thi.
```

### Important Decisions

- Dùng yêu cầu trực tiếp chạy phase `generate` làm chỉ dẫn tiếp tục từ scope hiện có nhưng không tự đổi `Human review` của scope thành Accepted.
- Chọn 52 item để nằm trong khoảng 48–55 và phân bố đều 13 item cho mỗi IA.
- Giữ `Order Detail` ở mức row-level summary và `Update Order Status` ở mức inline action, không tạo màn hình giả.
- Chuyển bốn risk trong scope thành checklist candidate có Expected Result, không ghi kết quả thực thi.
- Không tạo item cho search, sort, filter, pagination, modal detail hoặc confirmation dialog chưa được xác nhận.
- Không chạy SUT và không điền Actual Result, Status, Notes hoặc Evidence.
- Lệnh validation đầu tiên lỗi cú pháp nội suy PowerShell trước khi chạy; đã sửa validator và chạy lại thành công, không làm thay đổi artifact.
- Không chạm vào các thay đổi không liên quan trong repo.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Checklist gốc có 52 ID duy nhất `GUI-001..GUI-052`, phân bố đều IA-01..IA-04, đủ 13 cột, toàn bộ result/status/evidence để trống và Source là `AI-generated`. Nội dung không thêm search, filter, sort, pagination hoặc modal chưa được SUT xác nhận.
- Student fix: Không sửa checklist gốc. Phần critique và các mục được sinh viên chấp nhận đã được xử lý trong derivative `gui-checklist-reviewed.md`.

---

---

## HW03-AI-20260731-003

- Date and time: 2026-07-31 01:08:17
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: GUI Checklist Critique
- Related task: Task 1
- Status: Completed

### User Prompt

```text
Dùng $log-ai-audit, sau đó dùng $run-gui-checklist-workflow với phase
critique để phản biện checklist hiện tại.

Phát hiện mục trùng lặp, chung chung, không quan sát được và các khoảng
trống về accessibility, responsive, RTL, dark mode, loading, empty,
error, success và confirmation state.
```

### AI Output

```text
Đã hoàn tất phase `critique` và tạo [gui-checklist-critique.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-checklist-critique.md:1>).

- Không có item trùng hoàn toàn; phát hiện 6 cụm chồng lấn/gần trùng và đề xuất cách tách mục tiêu.
- Xác định 10 item còn dùng tiêu chí định tính hoặc khó đo.
- Chỉ ra 8 item/cụm cần Network panel, API mock, token hoặc dataset fixture để kết luận; không biến quan sát UI thành khẳng định backend.
- Lập ma trận gap cho accessibility, responsive, RTL, dark mode, loading, empty, error, success, disabled, confirmation và status consistency.
- Đề xuất 18 candidate `CRIT-001..CRIT-018`; tất cả vẫn là `AI-generated`, chưa thêm vào checklist và chưa gắn `Student-added`.
- RTL, dark mode và confirmation được giữ ở dạng `Conditional` vì scope chưa xác nhận hỗ trợ; không suy đoán thành yêu cầu bắt buộc.
- Checklist gốc không bị sửa; không điền Actual Result, Status, Notes, Evidence và không tạo Passed/Failed.
- Validation: 137 dòng, 6 overlap rows, 18 candidate rows, không có nhãn Student-added/Passed/Failed; SHA-256 `AEF59AA2F0ACB6203A218717F5720015CD743F37164BC04DC57511A3936DCE10`.
- Audit interaction ID: `HW03-AI-20260731-003`; [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>).

`Human Review` vẫn là `Pending`. Cần xác nhận candidate nào được chấp nhận và RTL/dark mode/confirmation là yêu cầu, exploratory check hay `Not Applicable` trước khi sửa checklist.

```

### Important Decisions

- Phân biệt trùng hoàn toàn với chồng lấn hợp lý giữa IA-02 action availability và IA-04 post-response feedback.
- Không sửa checklist gốc vì người dùng chỉ yêu cầu phản biện.
- Không tự gắn đề xuất AI là `Student-added` và không tự coi Human Review đã hoàn tất.
- Không bắt buộc RTL, dark mode hoặc confirmation khi scope/SUT chưa xác nhận; giữ chúng ở dạng conditional để Human Review quyết định.
- Với assertions về request, payload, token và dữ liệu nguồn, yêu cầu instrumentation hoặc thu hẹp Expected Result về UI có thể quan sát.
- Không chạy SUT, không tạo execution evidence và không đánh Passed/Failed.
- Không chạm vào các thay đổi không liên quan trong repo.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Critique phân biệt hợp lý giữa trùng hoàn toàn và overlap, ghi 6 overlap rows, 10 mục khó đo và 18 candidate `CRIT-001..CRIT-018`, đồng thời giữ RTL/dark mode/confirmation ở trạng thái conditional. Không có candidate nào bị gắn `Student-added` hoặc Passed/Failed trước quyết định của sinh viên.
- Student fix: Đã chấp nhận `CRIT-001..CRIT-006`, `CRIT-016` và `CRIT-017` ở interaction sau; tám mục này đã được đưa vào `gui-checklist-reviewed.md` dưới Source `Student-added`.

---

---

## HW03-AI-20260801-001

- Date and time: 2026-08-01 14:03:30
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: GPT-5
- Task category: Human-reviewed GUI Checklist Revision
- Related task: Task 1
- Status: Completed

### User Prompt

```text
Dùng $log-ai-audit để ghi interaction này, sau đó dùng
$run-gui-checklist-workflow ở phase critique.

Tôi đã thực hiện Human Review và xác nhận:

1. Admin Order Management là primary screen.
2. Admin Dashboard là supporting screen.
3. Order Detail chỉ là row-level order summary.
4. Update Order Status là inline action group.
5. Không thêm search, filter, sort, pagination hoặc modal vì SUT không
   xác nhận các chức năng đó.
6. RTL, dark mode và cancel confirmation là Not Applicable hoặc
   Conditional, không đánh Failed.
7. Tôi chấp nhận thêm các candidate CRIT-001, CRIT-002, CRIT-003,
   CRIT-004, CRIT-005, CRIT-006, CRIT-016 và CRIT-017.

Hãy:

- Giữ nguyên gui-checklist.md làm AI-generated artifact.
- Tạo gui-checklist-reviewed.md.
- Áp dụng các chỉnh sửa OV-01 đến OV-06.
- Làm chặt các item mơ hồ được critique liệt kê.
- Thêm GUI-053 đến GUI-060.
- Đặt Source của các mục mới là Student-added.
- Thêm lý do AI bỏ sót cho từng mục mới.
- Để trống Actual Result, Status, Notes và Evidence.
- Đổi Human Review thành Reviewed.
- Không tự chạy SUT và không tự kết luận Passed/Failed.
```

### AI Output

```text
Đã hoàn tất bản checklist sau Human Review: [gui-checklist-reviewed.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-checklist-reviewed.md:1>).

- Có 60 item tuần tự `GUI-001..GUI-060`, không trùng hoặc thiếu ID.
- Đã áp dụng `OV-01..OV-06` và làm chặt 10 item mơ hồ được critique xác định.
- `GUI-001..GUI-052` giữ Source `AI-generated`; `GUI-053..GUI-060` có Source `Student-added` và ánh xạ đúng tám candidate đã được bạn chấp nhận.
- Đã thêm bảng lý do AI bỏ sót riêng cho từng mục mới.
- Phân bố IA: IA-01 = 16, IA-02 = 14, IA-03 = 14, IA-04 = 16.
- Cả 60 item đều có đúng 13 cột; Actual Result, Status, Notes và Evidence đều trống.
- RTL, dark mode và cancel confirmation được ghi là `Not Applicable`/`Conditional`; không thêm search, filter, sort, pagination hoặc modal.
- [gui-checklist-critique.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task1\gui-checklist-critique.md:1>) đã được cập nhật thành `Reviewed` và ghi lại Human Review Resolution.
- `gui-checklist.md` không bị thay đổi trong interaction này; SHA-256 vẫn là `5974964F2B7A492247D3785C0E9019EA9D5B75A0C3A9D2967F7CF07A8FCD13B1`.
- Không chạy SUT, không tạo execution evidence và không kết luận Passed/Failed.

Validation của bản reviewed: SHA-256 `3C0DDC6816BA58A6E5515E3461C8FB168F73326694BC01ADBD7B5DB3FD20CA0F`. Audit interaction ID: `HW03-AI-20260801-001`; [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md:1>).

Lưu ý: trạng thái Human Review của checklist/critique là `Reviewed` theo xác nhận của bạn; bản ghi audit mới vẫn là `Pending` theo quy tắc audit riêng.

```

### Important Decisions

- Dùng xác nhận rõ ràng của người dùng để chuyển trạng thái checklist/critique thành `Reviewed` và gắn tám item được chấp nhận là `Student-added`.
- Giữ audit entry mới ở `Pending` theo hợp đồng riêng của `log-ai-audit`; không nhầm với trạng thái review của artifact.
- Không sửa `gui-checklist.md`; mọi thay đổi OV, measurability và candidate nằm trong `gui-checklist-reviewed.md`.
- Không thêm capability chưa xác nhận; RTL, dark mode và cancel confirmation chỉ là Not Applicable hoặc Conditional.
- Không chạy SUT, không điền bốn cột kết quả và không đánh Passed/Failed.
- Không chạm các thay đổi workspace không liên quan.
- Không ghi chain-of-thought.

### Human Review

- Verdict: VALID
- Reasoning: Prompt chứa quyết định Human Review rõ ràng của sinh viên. Bản derivative hiện có 60 ID duy nhất, 8 mục `Student-added`, giữ 52 mục gốc là `AI-generated`, và vẫn để trống Actual Result/Status/Notes/Evidence; checklist gốc còn nguyên 52 mục và hash hiện tại khớp hash được nêu trong output này.
- Student fix: Không cần sửa. Chỉ dùng `gui-checklist-reviewed.md` cho bước execute và giữ `gui-checklist.md` làm AI-generated artifact ban đầu.

---

---

## Correction - Audit ordering for HW03-AI-20260801-002 and HW03-AI-20260801-003

- Correction date and time: 2026-08-01 16:57:03
- Timezone: Asia/Ho_Chi_Minh
- Correction type: Physical entry ordering
- Review status: Pending

The append patch for interactions `HW03-AI-20260801-002` and `HW03-AI-20260801-003` matched an earlier repeated `Human Review` block, so those two complete entries were inserted before older records instead of at physical EOF. No existing audit entry was deleted, moved, rewritten, or concealed after discovery. This correction is appended at physical EOF; chronological export must order interactions by their ID/date metadata, with `001` before `002` before `003`.

### Corrected AI Output for HW03-AI-20260801-003

```text
Đã hoàn tất phase `plan`: [usability-plan.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\artifacts\task2\usability-plan.md>).

Kế hoạch bao gồm:

- Flow: tài khoản đã đăng nhập → Product Search → Product Detail → Add to Cart → Apply Coupon → Checkout → Order Confirmation.
- 5 research objectives, 10 research questions và ma trận traceability đến success criteria/evidence.
- Target-user profile với một pilot riêng `P00` và đúng bảy participant thật `P01–P07`, đều ngoài lớp HW03.
- 8 success criteria định lượng về completion, sản phẩm/số lượng, coupon/tổng tiền, thời gian, trợ giúp, nhận biết confirmation, SUS và blocker.
- Chọn SUS làm instrument sau phiên; không trộn với UEQ-S.
- Pilot plan, consent requirements, môi trường/fixture tách biệt theo phiên và evidence/privacy plan.

Task scenario chỉ giao mục tiêu mua 1 điện thoại, dùng `SAVE10` và nhận biết đơn đã được ghi nhận. Scenario không chứa numbered steps, tên control, route hoặc chỉ dẫn thao tác giao diện.

Ranh giới hiện tại:

- Chưa tuyển participant, lấy consent, chạy pilot/session, tạo recording, thu SUS response, tính score hoặc tạo finding.
- Không có participant/evidence giả và không có thông tin liên hệ trong artifact.
- Ba quyết định còn để sinh viên điền trước phase `prepare`: retention/deletion date, withdrawal deadline/contact và compensation.
- Ghi chú scope cũ từng chọn Admin Category Management cho usability; prompt hiện tại được coi là xác nhận dùng luồng mua hàng cho artifact mới. Kế hoạch yêu cầu sinh viên xác nhận lại tính không trùng với thành viên nhóm trước khi tuyển mẫu.

Đã đối chiếu rubric Task 2 ở trang 5–6 của PDF tiếng Việt và capability thực của EShop. Validation: 240 dòng, 5 objectives, 10 questions, 8 criteria, scenario không có hướng dẫn từng bước, SHA-256 `4078C76A8BE684E7B9E3F5DC16D070AF17A5023A3D07272F20D878D742616B96`.

AI Audit entry dùng ID `HW03-AI-20260801-003`: [AI_AUDIT_LOG.md](<D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW\docs\ai-audit\AI_AUDIT_LOG.md>). Một correction về thứ tự vật lý của entry `002`/`003` đã được append ở cuối file; không nội dung audit cũ nào bị di chuyển, xóa hoặc viết lại. `Human Review` của interaction và plan vẫn là `Pending`; chỉ chuyển sang phase `prepare` sau khi bạn xác nhận các điểm còn mở.

```

### Human Review

- Verdict: VALID
- Reasoning: Correction mô tả minh bạch lỗi thứ tự vật lý của entry `002`/`003`, không che giấu hoặc viết lại nội dung cũ, và chỉ dẫn đúng rằng bản export theo thời gian phải sắp xếp bằng ID/date metadata thay vì vị trí trong file.
- Student fix: Không cần sửa nội dung cũ. Khi xuất AI Audit Report, sắp xếp `HW03-AI-20260801-001`, `002`, `003` theo metadata.

---

---

## HW03-AI-20260802-001

- Date and time: 2026-08-02 15:23:39
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: Not exposed by the current environment
- Task category: Bug Report Files
- Related task: Task 1
- Status: Completed

### User Prompt

````text
Hãy dùng `$log-ai-audit` để ghi lại toàn bộ interaction này.

Tôi đã hoàn thành Human Review cho GUI checklist và xác nhận chuyển các
suspected defects hợp lệ thành các file bug report chính thức.

Đây là bước tạo BUG REPORT FILES, chưa phải bước đăng GitHub Issues.

Không thay đổi database.
Không sửa source code SUT.
Không tự đăng GitHub Issue.
Không tự sửa ảnh evidence.

## 1. Artifact đầu vào

Đọc đầy đủ:

- `artifacts/task1/gui-scope.md`
- `artifacts/task1/gui-checklist-reviewed.md`
- `artifacts/task1/gui-execution.md`
- `artifacts/task1/suspected-defects.md`
- toàn bộ evidence trong:
  `artifacts/task1/evidence/`

`gui-execution.md` là nguồn kết quả checklist cuối cùng.

Human Review đã hoàn tất:

- Passed: 32
- Failed: 28
- Pending Human Review: 0

Không thay đổi trạng thái checklist nếu không có mâu thuẫn bằng chứng rõ ràng.

## 2. Quyết định Human Review của tôi

Áp dụng các quyết định sau.

### 2.1. Xác nhận là bug hợp lệ

Xác nhận các nhóm sau:

- SUSPECT-001: HTML-like shipping address rendered as markup
- SUSPECT-002: Dashboard delivered revenue is doubled
- SUSPECT-005: Sidebar navigation is not keyboard reachable
- SUSPECT-006: Initial data fetch has no loading distinction
- SUSPECT-007: Empty Orders response has no empty-state message
- SUSPECT-009: Canceled orders expose an invalid delivered transition
- SUSPECT-010: Focus is lost after inline status update
- SUSPECT-013: Status-update error feedback lacks affected-order context

### 2.2. Tách SUSPECT-003 thành hai bug

Tạo hai bug riêng:

1. Email input has no persistent visible label
   - Related checklist: GUI-014

2. Login form submits when required fields are empty
   - Related checklist: GUI-019

Không gộp accessibility label và required-field validation vào một bug.

### 2.3. Tách SUSPECT-004 thành hai bug

Tạo hai bug riêng:

1. Login action allows duplicate submissions while pending
   - Related checklist: GUI-017

2. Order status action allows duplicate update requests while pending
   - Related checklist: GUI-026

Hai bug thuộc hai chức năng và có mức ảnh hưởng khác nhau.

### 2.4. Gộp SUSPECT-008 và SUSPECT-012

Tạo một bug:

`Data-fetch failure provides neither visible nor assistive-technology feedback`

Related checklist:

- GUI-042
- GUI-055

Mô tả phải phân biệt:

- không có visible error/recovery message;
- không có `role="alert"`, `role="status"` hoặc `aria-live`.

Không tạo hai bug riêng cho cùng trạng thái fetch 500.

### 2.5. Giữ SUSPECT-011 nhưng đổi cách diễn đạt

Tên bug đề xuất:

`Repeated row-action accessible names lack independent order context`

Related checklist:

- GUI-054

Không khẳng định tuyệt đối rằng screen reader không thể xác định row.

Chỉ kết luận rằng các tên như `Hủy`, `Giao hàng`, `Xác nhận` bị lặp lại và
không tự chứa order ID hoặc order context khi được đọc hoặc liệt kê độc lập.

### 2.6. Bổ sung bug session expiry

Tạo bug:

`Expired session redirects to Login without explaining the re-authentication reason`

Related checklist:

- GUI-043

### 2.7. GUI-057 không tạo bug riêng

GUI-057 Failed do cùng nguyên nhân với sidebar navigation không keyboard
accessible.

Thêm GUI-057 vào bug sidebar:

- GUI-033
- GUI-034
- GUI-035
- GUI-057

Ghi rõ:

- reflow và horizontal scrolling ở 200% vẫn hoạt động;
- action trong bảng vẫn có thể focus và kích hoạt;
- phần không đạt là sidebar navigation không thể nhận keyboard focus ở cả
  100% và 200%.

### 2.8. Responsive defects

Kiểm tra các evidence của:

- GUI-006
- GUI-008
- GUI-011
- GUI-039
- GUI-058

Chỉ tạo bug responsive khi evidence cho thấy một lỗi cụ thể như:

- nội dung tràn sang cell khác;
- sidebar che main content;
- action không thể truy cập;
- cell bị chồng lấn;
- nội dung quan trọng bị cắt và không có cơ chế đọc đầy đủ;
- horizontal scrolling không thể sử dụng thực tế.

Không tạo bug chỉ vì checklist có status Failed.

Nếu evidence chưa xác định chính xác biểu hiện, tạo:

`artifacts/task1/bug-reports/needs-more-evidence.md`

và ghi rõ cần chụp hoặc kiểm tra thêm gì.

## 3. Thư mục đầu ra

Tạo cấu trúc:

`artifacts/task1/bug-reports/`

Bao gồm:

- `README.md`
- `bug-report-summary.md`
- một file Markdown cho mỗi bug đã xác nhận
- `needs-more-evidence.md` nếu cần

Tên file:

`BUG-001-<short-kebab-case-title>.md`

Ví dụ:

- `BUG-001-html-like-address-rendered-as-markup.md`
- `BUG-002-dashboard-delivered-revenue-doubled.md`

Không sử dụng SUSPECT ID làm Bug ID cuối cùng.

## 4. Format bắt buộc cho từng bug report

Mỗi file phải theo bố cục dưới đây và sẵn sàng để copy vào GitHub Issue.

# [BUG][<Module>] <Tiêu đề lỗi>

## Found by Test Case

Liệt kê đầy đủ checklist ID, ví dụ:

- GUI-012
- GUI-052

## Requirement liên quan

Chỉ sử dụng requirement đã được xác nhận trong `gui-scope.md`.

Các requirement có thể liên quan trong phạm vi này gồm:

- FR-10: Order state machine
- FR-12: Access control
- FR-13: Admin Dashboard
- FR-18: Admin xem và cập nhật đơn hàng

Không tự bịa requirement ID.

Ghi thêm scope IDs phù hợp nếu hữu ích.

## Severity / Priority

Ghi theo format:

`<Severity> / <Priority>`

Giá trị hợp lệ:

Severity:

- Critical
- High
- Medium
- Low

Priority:

- P1
- P2
- P3
- P4

Thêm một đoạn ngắn giải thích tại sao chọn severity và priority.

Không sử dụng Critical/P1 chỉ vì checklist Failed.

Gợi ý:

- Sai doanh thu: High / P1 hoặc P2
- Canceled vẫn có thể chuyển Delivered: High / P1
- Duplicate status update: High / P2
- Render markup từ address: High / P2
- Duplicate login: Medium / P2
- Keyboard navigation: Medium / P2
- Loading/empty/error feedback: Medium / P2 hoặc P3
- Thiếu label/accessibility context: Medium / P2 hoặc P3
- Session-expiry explanation: Low hoặc Medium / P3

Agent phải đưa ra lý do, không áp dụng máy móc.

## Environment

Ghi đầy đủ:

- SUT: EShop
- Module:
- Browser:
- Browser version nếu xác định được
- OS:
- Viewport:
- Zoom nếu liên quan
- Admin URL: `http://localhost:5174`
- Backend URL: `http://localhost:3000`
- Dataset/fixture:
- Execution date:
- SUT commit nếu có trong setup artifacts

Không ghi PID vì PID chỉ có giá trị trong một phiên runtime.

## Preconditions

Liệt kê trạng thái cần có trước khi tái hiện, ví dụ:

- Backend và Web Admin đang chạy.
- Admin đã đăng nhập.
- Có order với status cụ thể.
- Có shipping address HTML-like.
- Response được delayed hoặc mocked theo cách kiểm soát.
- Database đang ở baseline nào.

## Steps to reproduce

Viết từng bước đánh số.

Các bước phải:

- đủ rõ để người khác tái hiện;
- tập trung vào hành vi người dùng hoặc điều kiện GUI;
- không phụ thuộc vào source code nội bộ;
- ghi rõ khi dùng controlled mock;
- không tuyên bố backend thật trả 500 khi lỗi được tạo bằng mock.

Ví dụ đối với mocked state:

1. Đăng nhập Web Admin bằng tài khoản admin hợp lệ.
2. Mở Dashboard hoặc Đơn hàng.
3. Dùng network interception để trả HTTP 500 cho request lấy danh sách đơn.
4. Quan sát nội dung Dashboard và vùng feedback.

Ví dụ đối với bug thật:

1. Đăng nhập Web Admin.
2. Mở tab Đơn hàng.
3. Tìm order có trạng thái `canceled`.
4. Quan sát cột Hành động.

## Expected result

Mô tả chính xác hành vi mong đợi.

Không viết chung chung như:

- hoạt động đúng;
- hiển thị hợp lý;
- thân thiện với người dùng.

## Actual result

Mô tả đúng điều đã quan sát.

Ưu tiên số liệu cụ thể, ví dụ:

- expected revenue: 500.000 ₫;
- displayed revenue: 1.000.000 ₫;
- double click tạo 2 requests;
- `document.activeElement` trở thành `BODY`;
- canceled row hiển thị `Đánh dấu Đã giao`.

Không ghi suy luận chưa được evidence hỗ trợ.

## Reproducibility

Ghi:

- Always
- Intermittent
- One controlled run only
- Requires mocked condition

Thêm số lần tái hiện nếu có evidence.

## Impact

Giải thích ảnh hưởng đối với:

- admin;
- dữ liệu;
- accessibility;
- khả năng hoàn thành task;
- khả năng hiểu trạng thái;
- rủi ro duplicate request;
- rủi ro sai quyết định kinh doanh.

## Evidence

Nhúng ảnh bằng Markdown theo format:

```markdown
![<mô tả evidence>](<relative-path>)
```

Ví dụ:

```markdown
![Dashboard revenue mismatch](../../internal/playwright/evidence/GUI-012-observed.png)
```

Với nhiều evidence, đặt caption riêng cho từng ảnh.

Không chỉ ghi đường dẫn dạng plain text.

Không dùng ảnh Passed không liên quan.

Không chỉnh sửa nội dung ảnh bằng AI.

### Execution notes

Ghi rõ một trong các loại:

- Live SUT
- Controlled mocked response
- Manual accessibility review
- Manual visual and keyboard review

Đối với mocked condition, phải ghi:

> Mock chỉ được dùng để tạo trạng thái đầu vào có kiểm soát. Kết luận bug dựa
> trên phản hồi của GUI, không phải tuyên bố rằng backend thật đã trả lỗi này.

### Related checklist result

Tạo bảng:

| Checklist ID | Status | Actual Result |
| ------------ | ------ | ------------- |

Lấy dữ liệu từ `gui-execution.md`.

### Suggested labels

Đề xuất labels theo format GitHub:

- `type:bug`
- `status:new`
- `found-by:gui-checklist`
- `module:<module>`
- `severity:<level>`
- `priority:<level>`
- `accessibility` nếu liên quan
- `responsive` nếu liên quan

Chỉ đề xuất label; không tự tạo label hoặc GitHub Issue.

### Human confirmation

Ghi:

- Confirmed by student
- Confirmation date
- Evidence reviewed
- GitHub issue: Not created

## 5. Tiêu chuẩn tiêu đề

Tiêu đề phải theo format:

`[BUG][<Module>] <Mô tả ngắn, cụ thể>`

Ví dụ:

- `[BUG][Admin Dashboard] Delivered revenue is calculated twice`
- `[BUG][Admin Orders] Canceled order still exposes delivered action`
- `[BUG][Admin Login] Empty required fields still trigger login request`
- `[BUG][Admin Navigation] Sidebar items are not keyboard reachable`

Không dùng tiêu đề mơ hồ như:

- UI lỗi
- Accessibility issue
- Button không hoạt động
- Có vấn đề responsive

## 6. Danh sách bug report dự kiến

Tạo ít nhất các bug sau, trừ khi evidence đầu vào mâu thuẫn rõ ràng:

1. HTML-like shipping address is interpreted as markup.
2. Dashboard delivered revenue is calculated twice.
3. Email field has no persistent visible label.
4. Login submits when required fields are empty.
5. Login allows duplicate submissions while request is pending.
6. Status update allows duplicate requests while request is pending.
7. Sidebar navigation is not keyboard reachable.
8. Initial data loading is indistinguishable from zero data.
9. Empty Orders response has no empty-state message.
10. Data-fetch failure has neither visible nor accessible feedback.
11. Canceled orders expose an invalid delivered action.
12. Focus is lost after inline status update.
13. Repeated row-action names lack independent order context.
14. Status-update failure message lacks affected-order context.
15. Expired session redirects to Login without explaining why.

Bug responsive chỉ thêm sau khi evidence cho thấy biểu hiện cụ thể.

## 7. Bug report summary

Tạo:

`artifacts/task1/bug-reports/bug-report-summary.md`

Bảng gồm:

| Bug ID | Title | Checklist IDs | Module |
| Severity | Priority | Reproducibility |
| Evidence | Human Confirmation | GitHub Issue |

Thêm thống kê:

- tổng số bug;
- số Critical/High/Medium/Low;
- số P1/P2/P3/P4;
- số bug từ Live SUT;
- số bug từ controlled mocked conditions;
- số accessibility bug;
- số responsive bug;
- số bug chưa đủ evidence.

## 8. README

Tạo:

`artifacts/task1/bug-reports/README.md`

Bao gồm:

- mục đích thư mục;
- nguồn dữ liệu;
- quy tắc phân biệt GUI bug và automation error;
- quy tắc đối với mocked states;
- quy tắc evidence;
- cách copy file thành GitHub Issue;
- trạng thái GitHub Issues hiện tại.

## 9. Kiểm tra chất lượng bắt buộc

Trước khi hoàn tất:

1. Mỗi bug phải có ít nhất một checklist ID.
2. Mỗi checklist ID phải tồn tại trong `gui-execution.md`.
3. Mỗi evidence path phải tồn tại.
4. Không có credential hoặc token trong file.
5. Không có secret trong screenshot caption.
6. Không gọi mocked backend failure là real backend failure.
7. Không tạo hai bug cho cùng root cause nếu đã quyết định merge.
8. Không gộp các lỗi có root cause hoặc cách sửa khác nhau.
9. Severity và priority phải có lý do.
10. Actual Result phải khớp evidence.
11. Không có câu `Student must judge` hoặc `Pending Human Review`.
12. Mọi bug report phải ghi `Confirmed by student`.
13. Không tự tạo GitHub Issue.
14. Không sửa `gui-execution.md`.
15. Không sửa evidence gốc.

Tạo thêm:

`artifacts/task1/bug-reports/validation-report.md`

Bảng:

| Check | Result | Details |

## 10. Kết quả cuối phiên

Trình bày:

1. Tổng số bug report đã tạo.
2. File được tạo.
3. Bug nào được tách.
4. Bug nào được gộp.
5. Bug nào chưa đủ evidence.
6. Severity/Priority summary.
7. Evidence path validation.
8. Những GitHub Issue nào sẵn sàng để đăng.
9. Xác nhận chưa có GitHub Issue nào được tạo.

Ghi toàn bộ interaction vào AI Audit.

Human Review của interaction này vẫn là `Pending` cho tới khi tôi đọc các
file bug report được tạo.

````

### AI Output

```text
Đã tạo 15 bug report chính thức, sẵn sàng để bạn copy thành GitHub Issue sau này. Tất cả nằm trong [artifacts/task1/bug-reports](D:/Workspace/HCMUS/Software%20Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW/artifacts/task1/bug-reports).

Các file chính: [README.md](D:/Workspace/HCMUS/Software%20Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW/artifacts/task1/bug-reports/README.md), [bug-report-summary.md](D:/Workspace/HCMUS/Software%20Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW/artifacts/task1/bug-reports/bug-report-summary.md), [validation-report.md](D:/Workspace/HCMUS/Software%20Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW/artifacts/task1/bug-reports/validation-report.md), và 15 file BUG-001 đến BUG-015.

- Đã tách SUSPECT-003 thành 2 bug (label Email; submit khi rỗng) và SUSPECT-004 thành 2 bug (duplicate login; duplicate update).
- Đã gộp GUI-042 + GUI-055 thành BUG-010; GUI-057 được gộp vào BUG-007 sidebar.
- Không tạo bug responsive riêng. Năm mục GUI-006, GUI-008, GUI-011, GUI-039 và GUI-058 được ghi trong [needs-more-evidence.md](D:/Workspace/HCMUS/Software%20Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW/artifacts/task1/bug-reports/needs-more-evidence.md), vì ảnh hiện có chưa chứng minh được hành vi cuộn hay action là không thể sử dụng.
- Severity: High 4, Medium 10, Low 1. Priority: P1 2, P2 8, P3 5.
- Validation đã Passed: 15 report đủ section, toàn bộ checklist ID tồn tại, mọi evidence link hợp lệ; 32 file evidence đã được hash-checked.
- Cả 15 report đều sẵn sàng để đăng Issue, nhưng chưa có GitHub Issue, label hoặc remote action nào được tạo.

AI Audit đã được append với ID `HW03-AI-20260802-001`; Human Review của interaction này vẫn là `Pending`.
```

### Important Decisions

- Used the student’s explicit confirmation and required split/merge decisions to create 15 confirmed reports.
- Treated controlled mocks only as controlled input states; no report claims that the real backend returned a mocked error.
- Did not create a standalone responsive defect because the available screenshots did not prove unusable scrolling, clipping without an alternative, or inaccessible actions.
- Did not run Playwright, access or restart the SUT, change the database, modify SUT source, edit evidence, or create GitHub Issues.
- Commands used for local artifact generation/validation: node tools/playwright/scripts/generate-task1-bug-reports.cjs; Get-FileHash artifacts/internal/playwright/evidence/\*.png -Algorithm SHA256.
- No credentials, tokens, or secret values were written to reports or the audit entry.

### Human Review

- Verdict: VALID
- Reasoning: Prompt ghi rõ sinh viên đã hoàn tất Human Review với `32 Passed / 28 Failed / 0 Pending`. Artifact hiện có đúng 15 bug report đánh số, summary `High 4 / Medium 10 / Low 1`, priority `P1 2 / P2 8 / P3 5`, 32 ảnh evidence và validation report Passed. Tuy nhiên audit entry bị thiếu heading/bảng `Files and Artifacts` hoàn chỉnh và còn một table row rời ngay sau `AI Output`.
- Student fix: Không sửa hoặc xóa phần cũ vì audit append-only. Cần append một `Correction` riêng để khôi phục bảng `Files and Artifacts` đầy đủ cho interaction này trước khi xuất report cuối.

---

---

## HW03-AI-20260802-002

- Date and time: 2026-08-02
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Codex
- Model: Not exposed by the current environment
- Task category: Usability evaluation preparation
- Related task: Task 2
- Status: Partially completed

### User Prompt

```text
hãy dùng [log-ai-audit](HW3/HW/agent-skills/log-ai-audit/), sau đó dùng [run-usability-evaluation-workflow](HW3/HW/agent-skills/run-usability-evaluation-workflow/) để tiếp tục công việc task 2 giúp tôi với.
```

### AI Output

```text
Đã tiếp tục Task 2 ở phase `prepare`.

Đã tạo [moderator-session-kit.md](D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/HW3/HW/artifacts/task2/moderator-session-kit.md) với coupon `VIP100`, gồm: consent/opening script, think-aloud reminder, scenario không chỉ dẫn thao tác UI, quy tắc moderator trung lập, mẫu quan sát trống, post-task probes, SUS form và closing/after-session checklist.

Validation đã đạt: đủ các section bắt buộc, không còn `SAVE10`, không có PII hay response participant được điền sẵn. Chưa có participant, consent, recording, observation, SUS score hoặc finding nào được tạo.

Để bắt đầu phiên `P00`/`P01`–`P07`, bạn vẫn cần chốt retention/deletion date, withdrawal contact/deadline, compensation và xác minh fixture/reset + consent thực tế. AI Audit đã được append với ID `HW03-AI-20260802-002`; Human Review vẫn là `Pending`.
```

### Important Decisions

- Continued at phase `prepare` because the existing Task 2 plan defines the purchase flow, research goal, target users, success criteria and evidence plan.
- Created only moderator/preparation material and empty templates; no participant evidence, consent, response, score or finding was fabricated.
- Actual data collection remains blocked until the plan's missing consent-retention decisions and verified fixture/reset conditions are completed.

### Human Review

- Verdict: VALID
- Reasoning: `moderator-session-kit.md` có đủ consent/opening script, think-aloud reminder, scenario không chỉ dẫn UI, neutral moderator rules, observation template trống, post-task probes, SUS form và closing checklist; không có participant response, SUS score hoặc finding giả. So với artifact hiện tại, câu AI Output nói retention/deletion date, withdrawal deadline/contact và compensation vẫn chưa chốt đã lỗi thời: kế hoạch hiện ghi giữ dữ liệu đến 28/08/2026, deadline 28/08/2026, moderator/student là contact và không compensation.
- Student fix: Giữ nguyên AI Output lịch sử; khi làm report cuối, ghi trạng thái hiện tại và các blocker còn thật sự mở: private-storage check, fixture/reset verification, browser baseline, xác nhận luồng không trùng và phạm vi consent/recording theo từng phiên trước `P00`.

---

## HW03-AI-20260803-001

- Date and time: 2026-08-03 05:07 (Asia/Ho_Chi_Minh)
- Timezone: Asia/Ho_Chi_Minh
- AI tool: Antigravity IDE
- Model: Claude Opus 4.6 (Thinking)
- Task category: Cross-platform test filtering analysis
- Related task: Task 3
- Status: Completed

### User Prompt

```text
sử dụng @[## Xuất AI Audit Report], Hãy giúp tôi lọc lại các test cần thiết để test trong môi trường cross-flatform. Do tôi tin rằng việc phải test lại toàn bộ tất cả các test là không cần thiết.Hãy phân tích lý do vì sao lại lại loại bỏ và tổng kế lại xem chúng ta sẽ test bao nhiêu test
```

### AI Output

```text
Tôi đã phân tích 60 checklist items từ Task 1 và lọc xuống còn 21 items cần thiết cho cross-platform testing, giảm 65% effort.
Sử dụng 5 tiêu chí loại bỏ:
- E1: Backend-driven logic (15 items loại)
- E2: Mocked/controlled state (5 items loại)
- E3: Screen reader / Accessibility Tree (8 items loại)
- E4: Duplicated coverage (11 items loại)
- E5: Non-visual / semantic-only (đã gộp vào E3)
Kết quả: 12 Use Cases, 21 items cho Firefox; 8 Use Cases, 15 items cho Android.
Chi tiết phân tích được xuất tại artifact: cross-platform-filtering-analysis.md
```

### Important Decisions

- Quyết định giữ GUI-009 (HTML-like address) vì đây là known bug từ Task 1 cần verify cross-browser.
- Quyết định giữ GUI-057 (Zoom 200%) vì zoom behavior khác biệt đáng kể giữa Gecko và Blink.
- Quyết định loại bỏ GUI-047 đến GUI-050 (các status transition khác) vì cùng cơ chế rendering với GUI-046, chỉ giữ một representative mutation.
- Quyết định loại bỏ tất cả mocked test (GUI-040, 041, 042, 059) vì kết quả phụ thuộc mock setup, không phụ thuộc browser engine.

### Human Review

- Verdict: VALID
- Reasoning: AI Output đã cung cấp phân tích chi tiết và hợp lý về việc lọc các test cần thiết cho cross-platform testing. Các quyết định giữ lại hoặc loại bỏ các checklist items đều có cơ sở rõ ràng.
- Student fix:Tiến thu kiểm tra lại tài liệu và bắt đầu chạy test

---

## Summary & Conclusion

### AI Accuracy Ratio

- **Total AI Artifacts generated:** 11
- **VALID:** 11 (100%)
- **INVALID:** 0 (0%)
- **INCOMPLETE:** 0 (0%)

**Prepared by:** Nguyễn Huy Quân

**Signature:** Nguyễn Huy Quân
