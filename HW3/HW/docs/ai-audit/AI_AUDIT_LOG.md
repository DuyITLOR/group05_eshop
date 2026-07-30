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

<oai-mem-citation>
<citation_entries>
MEMORY.md:28-30|note=[HW03 workspace scope and repo specific context]
MEMORY.md:1170-1178|note=[skill validation convention and pruning extra scaffold artifacts]
</citation_entries>
<rollout_ids>
019fa4ab-bd98-7690-ad69-07883231cda0
019f368d-d709-70c3-bd9b-0f7d123ebbc8
</rollout_ids>
</oai-mem-citation>
```

### Files and Artifacts

| Path | Action | Description | Validation |
| --- | --- | --- | --- |
| `C:\Users\nguye\.codex\skills\.system\skill-creator\SKILL.md` | Read | Quy trình tạo và kiểm tra Agent Skill | Passed |
| `C:\Users\nguye\.codex\attachments\7c64b46c-b5a0-4da0-9169-ba4d5b0b096d\pasted-text.txt` | Read | Prompt nguồn cho yêu cầu và bản ghi bootstrap | Passed - SHA-256 `697CDCE1F7F475BD21079CD04A7D4D82A4DAE64838ABE65D2EB1955C4DD258DD` |
| `C:\Users\nguye\.codex\memories\MEMORY.md` | Read | Ngữ cảnh HW03 và quy ước validation skill trước đây | Passed |
| `agent-skills/log-ai-audit/SKILL.md` | Created | Agent Skill tiếng Việt hướng dẫn ghi audit bằng Markdown | Passed - `quick_validate.py`: `Skill is valid!` |
| `docs/ai-audit/AI_AUDIT_LOG.md` | Created/Modified | Nhật ký AI Audit và interaction bootstrap đầu tiên | Passed |

### Important Decisions

- Coi nội dung nguyên văn trong tệp đính kèm là prompt bootstrap cần lưu.
- Không chạy bộ khởi tạo vì công cụ đó bắt buộc tạo `agents/openai.yaml`, trái với phạm vi chỉ Markdown.
- Dùng hàng rào năm dấu backtick cho `User Prompt` để giữ nguyên các hàng rào Markdown nằm bên trong prompt.
- Không chạm vào các thay đổi không liên quan đã tồn tại trong repo.
- Không ghi chain-of-thought.

### Human Review

- Review status: Pending
- Reviewed by:
- Review date:
- Corrections made:
- Accepted artifacts:

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

````text
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
````

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

<oai-mem-citation>
<citation_entries>
MEMORY.md:79-94|note=[HW03 evidence boundaries and remaining human evidence requirements]
MEMORY.md:1205-1212|note=[skill validation and scaffold cleanup convention]
</citation_entries>
<rollout_ids>
019fa4ab-bd98-7690-ad69-07883231cda0
019fa9b6-27d2-7c80-9cec-d313cf6f2a08
019f368d-d709-70c3-bd9b-0f7d123ebbc8
</rollout_ids>
</oai-mem-citation>
```

### Files and Artifacts

| Path | Action | Description | Validation |
| --- | --- | --- | --- |
| `C:\Users\nguye\.codex\attachments\491a276f-6ab1-463c-b372-df8b97d5b683\pasted-text.txt` | Read | Prompt nguồn của interaction | Passed - SHA-256 `C01C99ECD5570525649DBF30D605E213A45BACC91AB3CA6D45118EEF891E99CB` |
| `agent-skills/log-ai-audit/SKILL.md` | Read | Quy trình ghi một audit interaction | Passed |
| `C:\Users\nguye\.codex\skills\.system\skill-creator\SKILL.md` | Read | Quy trình khởi tạo, viết và validate skill | Passed |
| `C:\Users\nguye\.codex\memories\MEMORY.md` | Read | Ranh giới bằng chứng HW03 và quy ước validation skill | Passed |
| `agent-skills/run-gui-checklist-workflow/SKILL.md` | Created | Workflow GUI checklist đầu-cuối | Passed - `quick_validate.py`; 187 dòng; SHA-256 `9B43E94651A4EBE6B7282BA2D1F8D782694CD5040900AADDBC25097996F118B7` |
| `agent-skills/run-usability-evaluation-workflow/SKILL.md` | Created | Workflow usability evaluation đầu-cuối | Passed - `quick_validate.py`; 179 dòng; SHA-256 `3FCD386AF455269FF4A74BB2DA3878DEE8B8DF9FA8CB84C1588DAF26C49E121F` |
| `agent-skills/validate-hw03-deliverables/SKILL.md` | Created | Validator read-only cho deliverable HW03 | Passed - `quick_validate.py`; 180 dòng; SHA-256 `3A64FBC70D376212C2D2CC990754F91439589DF6AFCCBB50CEFBB9F3C8BF18D3` |
| `agent-skills/*/agents/openai.yaml` | Created/Deleted | Metadata tùy chọn do scaffold tạo đã được loại bỏ theo ràng buộc chỉ Markdown | Passed - không còn thư mục `agents` |
| `docs/ai-audit/AI_AUDIT_LOG.md` | Read/Modified | Thêm duy nhất interaction `HW03-AI-20260730-002` | Passed |

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

- Review status: Pending
- Reviewed by:
- Review date:
- Corrections made:
- Accepted artifacts:

---
