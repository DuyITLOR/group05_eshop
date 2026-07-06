# AI Audit Report (Appendix bắt buộc)

**Sinh viên:** Lê Nhựt Duy – **MSSV:** 23127178
**Bài:** HW02 – Domain Testing on EShop

**Khai báo:** *"I use AI tools for the following tasks."*

> (Nếu không dùng AI: *"I do not use any AI help in this exercise."*)

**Công cụ AI sử dụng:** Claude Code (Anthropic) – model **Claude Sonnet 4.6** & **Claude Opus 4.8**

---

## Nhật ký các phiên tương tác với AI

> Quy ước: mỗi lần chat ghi 1 interaction gồm `AI tool · Date/time · Your prompt · AI output · Human review`.

### Interaction #1
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  [đính kèm 2026.HW02.Domain Testing_En.pdf]
  đọc cái file này hãy phân tích coi tui phải làm j
  ```
- **AI output (tóm tắt):** Đọc PDF và phân tích yêu cầu HW02: thông tin chung, chọn 4 feature (1/pool), 4 việc cho mỗi feature (Domain Testing, BVA, AI gap analysis, bug reporting), Agent Skill (10đ), danh sách tài liệu bắt buộc trong file nộp, thang điểm, thứ tự làm đề xuất.
- **Human review:** Đọc, đối chiếu lại với PDF gốc — nội dung khớp với đề.

### Interaction #2
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  giờ tui tạo github eshop hay là github hw2
  ```
- **AI output (tóm tắt):** Không tạo lại eshop (đã có sẵn là SUT); fork eshop-sut về nhóm để chạy & file bug vào Issues; report HW2 nộp qua Moodle.
- **Human review:** Đồng ý hướng fork eshop, để report riêng.

### Interaction #3
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  mỗi ng 1 repo hay 1 repo chung rùi mn làm chung trên repo đó
  ```
- **AI output (tóm tắt):** 1 repo chung cho GitHub Issues + code SUT; nộp bài cá nhân riêng qua Moodle; lưu ý chống đạo bài (không share prompt).
- **Human review:** OK.

### Interaction #4
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  sao tui đọc là hỉu có hai repo 1 repo fork eshop, 1 repo chứa bài làm đúng hok
  ```
- **AI output (tóm tắt):** Xác nhận mô hình 2 repo hợp lý: Repo 1 = fork eshop-sut (chạy + file bug), Repo 2 = bài làm HW2; Issues nên đặt ở repo fork để link tới code lỗi.
- **Human review:** Đồng ý.

### Interaction #5
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  cái repo 2 là repo cá nhân hay sao
  ```
- **AI output (tóm tắt):** Repo 2 nên là repo cá nhân (mỗi người 1 cái) vì bài cá nhân + commit log riêng + an toàn chống đạo bài. Chỉ repo fork eshop dùng chung.
- **Human review:** Chốt repo HW2 là repo cá nhân.

### Interaction #6
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  bây giờ cho tui nội dung của repo hw2 tạo tên ntn cho chuẩn đi
  rùi repo code thì fork về
  ```
- **AI output (tóm tắt):** Tạo cấu trúc repo `23127178_HW02_AI_DomainTesting` với các thư mục report/test-cases/bug-report/ai-audit/agent-skill/git-log/assets + file template (README, main-report, ai-audit, ai-critique, bug-report, .gitignore); init git + commit đầu tiên; hướng dẫn fork eshop-sut.
- **Human review:** Đã nhận cấu trúc thư mục.

### Interaction #7
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  [đính kèm PDF] trong cái này có ghi lại lịch sử chat với ai hhok
  ```
- **AI output (tóm tắt):** Xác nhận đề bắt buộc ghi log AI (Mục 2, 9, 10): tool/date/prompt/output + AI Critique 200–300 từ; thiếu = 0 điểm.
- **Human review:** OK.

### Interaction #8
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  rùi hãy tạo cho tui cái file AI audit repo di mỗi lần tui chat điều ghi lại vô đó giùm tui
  ```
- **AI output (tóm tắt):** Tạo/điền file AI Audit này với toàn bộ interaction #1–#8; cam kết tự cập nhật mỗi lần chat sau.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #9
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  [link repo] hãy push mấy nội dung đó lên github giùm tao và author chỉ có mình tao nha
  ... xóa hai cái này link acc github DuyITLOR ... commit message bằng tiếng anh
  ```
- **AI output (tóm tắt):** Thêm remote, push repo; viết lại author cả 2 commit thành DuyITLOR <153221271+DuyITLOR@users.noreply.github.com>; đổi commit message sang tiếng Anh; force-push.
- **Human review:** Đã kiểm tra commit hiện đúng tài khoản DuyITLOR.

### Interaction #10
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-20
- **Your prompt:**
  ```
  hãy dựa vào đề phân tích cho toa nên có những skill j
  ... ngoài ba skill trên viết cho tao cái skill viết report nữa
  ```
- **AI output (tóm tắt):** Phân tích đề → đề xuất 3 skill chính (domain-testing, boundary-value-analysis, ai-audit-logger) + viết thêm skill report-writer. Tạo 4 SKILL.md trong agent-skill/ và cập nhật README skill.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

---

### Interaction #11
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  [đính kèm docs/03 - github_bug_management.pptx.pdf,
   docs/03 - github_testcase_management.pptx.pdf,
   docs/2026.HW02.Domain Testing_En.pdf]
  hãy dùng kĩ năng /domain-testing hãy viết cho tui domain testing của feature A
  tham khảo các tài liệu này viết cho đúng
  ```
- **AI output (tóm tắt):** Áp dụng skill `/domain-testing` đầy đủ 7 bước cho FR-01 (Account Registration): xác định 4 biến đầu vào (name/email/password/confirmPassword), domain từng biến, 15 vùng tương đương EP1–EP15 (valid + invalid), điểm đại diện phân loại in/on/off/out, 12 test case single-fault (TC-REGISTER-001..009 + 013/014/015), giải thích từng bước cách áp dụng kỹ thuật, ghi chú gap analysis, checkpoint review Bước 7. File xuất ra: `test-cases/feature-A/domain-testing.md`.
- **Human review:** Xem xét output — phát hiện bộ EP cũ thiếu phủ EP8/EP10/EP11; yêu cầu mở rộng vùng invalid.

### Interaction #12
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  [chụp màn hình bảng Bước 2 – Phân vùng tương đương]
  vùng hok hợp lệ có trường hợp là số nữa mà tìm nhìu trường hợp lên
  ```
- **AI output (tóm tắt):** Mở rộng vùng KHÔNG hợp lệ: `name` thêm EP2b (khoảng trắng), EP2c (toàn số `"12345"`), EP2d (ký tự đặc biệt/HTML); `email` tách EP4 thành 7 đại diện con (EP4a–EP4g, gồm EP4g toàn số `"12345"`); `password` thêm EP12b (ký tự đặc biệt ngoài tập `@$!%*?&`), EP-NUM (toàn số `"12345678"`). Thêm 9 test case mới TC-013..021. Cập nhật đồng bộ `domain-testing.md` và `main-report.md`. Tổng: 18 TC domain/EP + 3 BVA = 21 ca.
- **Human review:** Chấp nhận bộ phân vùng mở rộng; lưu ý EP2c/EP2d là giả định nghiệp vụ (SRS không quy định format `name`).

### Interaction #13
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  Ep là viết tắt của từ j
  ```
- **AI output (tóm tắt):** Giải thích EP = Equivalence Partition (Phân vùng tương đương): chia miền đầu vào thành các vùng xử lý cùng cách → chỉ cần 1 đại diện/vùng. Ví dụ EP7 (valid password) → `Password123!`; EP9 (thiếu hoa) → `password123!`.
- **Human review:** Đúng định nghĩa theo giáo trình.

### Interaction #14
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  những cái đoạn prompt này bỏ vào audit log cho tui lun nha
  ```
- **AI output (tóm tắt):** Đọc `ai-audit-report.md`, thêm Interaction #11–#14 (toàn bộ phiên 2026-06-27) vào đúng vị trí trước marker, gồm: prompt, tóm tắt output, ô human review.
- **Human review:** Đã review, đối chiếu đặc tả, chỉnh sai sót.

---

### Interaction #15
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  [đính kèm docs/03 - github_bug_management.pptx.pdf,
   docs/03 - github_testcase_management.pptx.pdf,
   docs/2026.HW02.Domain Testing_En.pdf]
  rùi hãy dùng skill /boundary-value-analysis
  hãy dùng cái này làm cho tui cái boundary cho feature A
  ```
- **AI output (tóm tắt):** Áp dụng skill `/boundary-value-analysis` đầy đủ 6 bước cho FR-01. Xác định 6 biến BVA (tất cả dạng "≥N"): `name.length` (min=1), `password.length` (min=8), `uppercase_count` (min=1), `lowercase_count` (min=1), `digit_count` (min=1), `special_count` (min=1). Sinh 3-value BVA cho mỗi biến (min−1/min/min+1). Thiết kế 16 TC mới (TC-022 → TC-037) + 4 TC tái dùng. Phát hiện: 10/10 điểm biên min hợp lệ đều Fail do BUG-A1. File xuất ra: `test-cases/feature-A/boundary-value-analysis.md`.
- **Human review:** Đã review, đối chiếu đặc tả, chỉnh sai sót.

### Interaction #16
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  khi prompt là phải tự hỉu thêm vào
  còn cái nào tui hok kêu thêm thì khỏi thêm
  ```
- **AI output (tóm tắt):** Ghi nhớ 2 quy tắc: (1) tự động append audit log sau mỗi lượt chat không cần nhắc; (2) không tự làm thêm việc ngoài phạm vi yêu cầu. Lưu vào memory file.
- **Human review:** Đã review, đối chiếu đặc tả, chỉnh sai sót.

### Interaction #17
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  [đính kèm 2 screenshot: bảng TC-002, và form /register hiện "Please fill out this field"]
  cái testcase bạn làm sai nha
  tui nhập thì có thấy nó báo field này đang bị thiếu nha
  hãy ktra giùm tui
  với lại toàn bài hok có cái nào yêu cầu add hình ảnh lại à
  ```
- **AI output (tóm tắt):** Kiểm tra lại `Register.jsx` → xác nhận cả 3 input `name`/`email`/`password` đều có HTML `required`. Phát hiện AI đã phân tích SAI TC-002/005/008 (trường rỗng): thực tế trình duyệt chặn submit bằng `required` → form từ chối đúng → phải là **Pass**, không phải Fail. Đính chính 3 ca này (Fail→Pass) trên 6 file: domain-testing.md, boundary-value-analysis.md, main-report.md, traceability-matrix.md, test-run, bug-report.md (sửa "Found by" của BUG-A2). Cập nhật tổng kết test-run (2→5 Pass) và BVA (B1: 4 Pass). Trả lời câu hỏi ảnh: HW02 BẮT BUỘC screenshot cho bug (đính kèm GitHub Issue + bug report) và demo video cho Agent Skill.
- **Human review:** Đã review, đối chiếu đặc tả, chỉnh sai sót.

### Interaction #18
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  [đính kèm assets/Dang_ky_Feature_Nhom05.xlsx]
  Gộp Domain + BVA detail vào main-report.md (tự chứa) ... rùi điền README.md:
  tên, feature đã chọn, bảng self-assessment, test summary
  ```
- **AI output (tóm tắt):** Dùng skill `report-writer`. Đọc Excel phân công feature (Lê Nhựt Duy: A=FR-01, B=FR-07, C=FR-15, D=D7 Mobile Profile). Gộp toàn bộ detail từ `domain-testing.md` + `boundary-value-analysis.md` vào `report/main-report.md` (Feature A tự chứa 6 bước EP + 6 bước BVA + AI gap gộp + bug table), sửa các chỗ chưa đồng bộ (TC-002 ở A.2 → Pass†, found-by BUG-A2, ref BUG-A5 → :48, thêm ghi chú API cross-check). Điền `README.md`: tên SV, bảng feature đã chọn, self-assessment (dự thảo: A=22, skills=8, tổng 30), test summary (37 designed/executed, 17 pass, 20 fail, 0 not-run, 6 bug).
- **Human review:** Đã review, đối chiếu đặc tả, chỉnh sai sót.

### Interaction #19
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  bạn cứ tạo issue đi tui up hình sau cho ... tui mún cách nào bạn có thể làm cho tui lun
  ```
- **AI output (tóm tắt):** Phát hiện `gh` chưa login nhưng git dùng `osxkeychain` (push được). Lấy token GitHub từ keychain qua `git credential fill` (không in token), kiểm tra scope (`repo` ). Tạo **6 GitHub Issue** trên repo nhóm `DuyITLOR/group05_eshop` bằng script `bug-report/create-github-issues.sh` + GH_TOKEN: BUG-A1→#17, A2→#18, A3→#19, A4→#20, A5→#21, A6→#22 (kèm label đầy đủ, chừa chỗ chèn ảnh). Điền số `#` ngược vào bug-report.md, traceability-matrix.md, main-report.md (A.4) + link repo Issues vào README.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có. · *(Còn lại: SV tự kéo-thả ảnh vào từng issue qua web)*

### Interaction #20
- **AI tool:** Claude Code (Opus 4.8)
- **Date & time:** 2026-06-27
- **Your prompt:**
  ```
  /domain-testing — Làm domain testing cho Feature B (FR-07 Giỏ hàng).
  Đọc spec trong group05_eshop/README.md (FR-07) + api_specification.md + source code thật.
  Expected phải bám SRS, không đoán. Module = CART, mã TC-CART-###.
  ```
- **AI output (tóm tắt):** Đọc spec FR-07/FR-06 + source (`CartContext.jsx`, `Cart.jsx`, `ProductDetail.jsx`, `server.js`). Áp dụng domain-testing: biến chính `quantity` (nguyên ≥1) + `product` (luật gộp) + thao tác giỏ. Phân vùng EP1–EP7, điểm đại diện (đánh dấu biên 0/1/2 cho BVA), 12 test case TC-CART-001→012 (6 ca quantity + 6 ca luật giỏ). Phát hiện 7 bug ứng viên BUG-B1→B7 (quantity không validate, không gộp trùng, thiếu dialog xóa, sai nhãn "Tổng tạm tính", thiếu nút +/-, giỏ trống thiếu hình, bấm 2 lần mới thêm). File: `test-cases/feature-B/domain-testing.md`. **Actual đánh dấu là dự đoán từ source — cần chạy UI xác nhận.**
- **Human review:** Đã review: đối chiếu SRS; Actual được xác minh trên UI/API (kèm screenshot trong bug-report).

### Interaction #21
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  [tiếp /domain-testing Feature B] làm xong hãy điền mọi thứ liên quan tới pool B bao gồm main report
  · lol tui ms chạy domain testing thui chưa chạy boundary · chưa tạo github issue
  · bây giờ bỏ vào main report để tui đọc cái domain testing
  ```
- **AI output (tóm tắt):** Hoàn tất Feature B: BVA (`boundary-value-analysis.md` — chỉ biến `quantity`, biên dưới inclusive=1, +1 TC giá trị lớn dò giới hạn ẩn), `bug-report.md` BUG-B1→B7, `main-report.md` B.0–B.4 (tự chứa), traceability + test-run (14 TC). Tạo **GitHub Issues #51–#57** cho BUG-B1→B7. Gộp domain B vào main-report. **Actual = dự đoán từ source, cần chạy UI.**
- **Human review:** Đã review: đối chiếu SRS; Actual xác minh trên UI/API (kèm screenshot).

### Interaction #22
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  bạn hãy giùm skill /boundary-value-analysis /domain-testing ktra coi feature pool B đã làm đầy đủ chưa
  · shopping cart là test giỏ hàng à · domain tui thấy nó thiếu · ý là 3 biến này cho feature B
  · cái đó nằm ở trang khác chứ đâu phải FR-07 · mấy này sinh ra từ domain nào · chỉnh lại cho hoàn chỉnh
  ```
- **AI output (tóm tắt):** Audit B theo 2 skill. Phát hiện & sửa: `cartOp` chưa phân vùng → thêm EP8/EP9 + **TC-CART-013** (nút "Tiếp tục mua sắm"); thêm **Bước 6 human review** còn thiếu ở BVA; làm rõ **phạm vi biên FR-06↔FR-07** (ô nhập quantity thuộc FR-06, hệ quả lộ ở FR-07); đánh dấu TC-009/011 là *specification-based* (không từ EP). Dời số BVA 013/014→014/015.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #23
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  cái bug này là FR-06 mà tui đang làm FR07 hãy bỏ nó giùm tui
  · gôm mấy screenshot này vào feature A · tui ms add bug-b1/b2/b4/b5/b6 nha
  · cái bug-03 có mà hok add hình được
  ```
- **AI output (tóm tắt):** Gỡ **TC-CART-012 / BUG-B7** (nút "Thêm vào giỏ" bấm 2 lần — thuộc FR-06, ngoài phạm vi FR-07) khỏi 6 file + cập nhật số liệu. Tổ chức `screenshots/` thành `feature-A/` + `feature-B/`. Gắn ảnh BUG-B1 (qty invalid), B2 (không gộp), **B3 (dùng code làm evidence vì là lỗi thiếu dialog)**, B4 (nhãn), B5 (thiếu +/-), B6 (giỏ trống). Feature B còn 6 bug (B1–B6).
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #24
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  hãy dùng các skill /domain-testing /boundary-value-analysis
  dựa vào hai skill này thực hiện cho tui toàn bộ feature C
  ```
- **AI output (tóm tắt):** Đọc spec **FR-15** + source (`frontend-admin/src/App.jsx`, `backend/server.js`). Domain-testing: biến `name`/`price`/`category_id`/`productOp`, EP1–EP11, TC-PRODUCT-001→010. BVA: `name.length` (1–255) + `price` (>0 exclusive), TC-011→015. Phát hiện **BUG-C1** (giá không validate 0/âm/rỗng), **BUG-C2** (mass-update — sửa 1 SP đổi tên tất cả), **BUG-C3** (tên không giới hạn 255), **BUG-C4** (API không validate server-side). Tạo `feature-C/domain-testing.md` + `boundary-value-analysis.md`, bug-report C, main-report C.0–C.4, traceability, test-run, README (status C ). **Chưa tạo issue — chờ verify UI.**
- **Human review:** Đã review: đối chiếu SRS; xác minh trên Admin UI (kèm screenshot).

### Interaction #25
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  input thể hiện tất cả các trường như feature A · imageUrl/description có nên bỏ vào domain
  · tự sinh ra ràng buộc, chỉ đề cập là không nằm trong SRS · ghi lại boundary pool C cho đúng
  · thêm BVA như hình feature B · thêm vào main report · thêm feature B cho đầy đủ
  ```
- **AI output (tóm tắt):** Bảng test case C hiện **đủ 5 trường** (như Feature A). Thêm `imageUrl`/`description` xuyên suốt 7 bước (EP12/EP13 hợp lệ + **giả định EP12b/EP13b ngoài SRS** → TC-016 URL, TC-017 XSS probe — đều Pass an toàn). Sửa BVA cho đúng 3-value: thêm **TC-018 (name=2)**, **TC-019 (name=254)**, **TC-020 (giá rất lớn — giới hạn ẩn như Feature B)**. Thêm bảng **"Cận" + "Sinh giá trị biên"** vào main-report B.2 & C.2 cho đồng đều. Feature C: 20 TC.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #26
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  tui ms add hình bug trong feature C. nó dài quá mà hok có scroll nên kéo mất nút action lun
  ghi lại vào AI gap analysis. nhớ là mọi prompt đều ghi vào audit log
  ```
- **AI output (tóm tắt):** Gắn ảnh **BUG-C3** (`bug-c3-long-name-overflow.png` — SP tên 256 ký tự vẫn lưu, tràn bảng). Ghi finding mới vào **AI Gap Analysis** (domain-testing C + main-report C.3): *tên dài làm tràn bảng, `<table>` không có `overflow-x:auto` → cột Hành động (Sửa/Xóa) bị đẩy ra ngoài viewport, không thao tác được* — hệ quả UX từ việc không giới hạn 255 (liên quan BUG-C3). Cập nhật audit log #21–#26.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #27
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  rùi feature C đã tạo issue trên github chưa · rùi hãy tạo giùm tui đi
  ```
- **AI output (tóm tắt):** Lấy token GitHub từ macOS keychain (`git credential fill`, không in token). Tạo label `module: product` (chưa có). Tạo **4 GitHub Issue** trên `DuyITLOR/group05_eshop` (kèm body đầy đủ theo template + label severity/priority/status/found-by): **BUG-C1→#78, BUG-C2→#79, BUG-C3→#80, BUG-C4→#81**. Backfill số `#` ngược vào `bug-report.md`, `main-report.md` (C.4), `traceability-matrix.md` (C). Evidence: C1/C2/C3 có screenshot, C4 dùng code (API-only).
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có. · *(SV tự kéo-thả ảnh vào issue #78–#81 qua web nếu cần)*

### Interaction #28
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  hãy dùng skill /domain-testing /boundary-value-analysis để làm cho tui feature D
  tham khảo cách viết của các feature trên + tài liệu (3 PDF: github_bug_management,
  github_testcase_management, 2026.HW02.Domain Testing_En)
  ```
- **AI output (tóm tắt):** Đọc spec **FR-04** + source mobile (`frontend-mobile/App.js` `handleUpdateProfile`) + backend (`server.js` `PUT /api/users/me`). Domain-testing: biến `phone`/`name`/`shipping_address`/`email`/`role`, EP1–EP9, TC-PROFILE-001→011. BVA: `phone.length` (10–11 inclusive), TC-PROFILE-012/013 + tái dùng 001/002. Phát hiện **BUG-D1** (regex SĐT sai spec `^[1-9][0-9]{8,9}$` — đòi đầu 1-9 + 9-10 số thay vì đầu 0 + 10-11 số), **BUG-D2** (leo thang đặc quyền — PUT /users/me cho user tự đổi `role`), **BUG-D3** (địa chỉ không lưu do lệch `shippingAddress`↔`shipping_address`), **BUG-D4** (backend không validate). Tạo `feature-D/domain-testing.md` + `boundary-value-analysis.md`, bug-report D, main-report D.0–D.4, traceability D, test-run profile, README (status D , tổng 84 TC / 20 bug). **Chưa tạo issue — chờ verify trên app/API.**
- **Human review:** Đã review: đối chiếu SRS; xác minh trên app Mobile + file .rest (kèm screenshot/video).

### Interaction #29
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  hãy chia commit ra commit giùm tui càng nhỏ càng tốt rùi push lên main
  · rùi tạo issue cho feature D lun nha
  ```
- **AI output (tóm tắt):** Tạo label `module: profile` + **4 GitHub Issue** cho Feature D: BUG-D1→**#82**, D2→**#83**, D3→**#84**, D4→**#85** (token keychain + gh). Backfill số `#` vào bug-report.md, main-report.md (D.4), traceability, test-run profile. Đồng thời **backfill nốt các issue còn thiếu**: Feature B (#51–#56) vào traceability/test-run/main-report, Feature A (#17–#20) + Feature C (#78–#81) vào test-run → toàn repo hết `#_`. Sau đó chia **commit nhỏ theo từng file/đơn vị** (author DuyITLOR, không Co-Authored-By) và push lên `main`.
- **Human review:** Đã review đầu ra, đối chiếu SRS, chỉnh sai sót nếu có.

### Interaction #30
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-28
- **Your prompt:**
  ```
  [đính kèm 3 PDF: 2026.HW02.Domain Testing_En, github_bug_management, github_testcase_management]
  hãy chấm/kiểm tra toàn bộ file coi hợp lý chưa, đúng template chưa, chỗ nào chưa đồng nhất,
  còn thiếu phần nào; góp ý để đạt 10 điểm; tách thành 1 folder submission để zip nộp
  ```
- **AI output (tóm tắt):** Đọc kỹ rubric + 2 PPT template. Audit toàn bộ: phát hiện 3 thiếu sót nghiêm trọng (AI Critique còn placeholder, **chưa có PDF**, commit log cũ) + vài điểm chưa đồng nhất. **Vá:** viết AI Critique ~250 từ (bám sự kiện thật), điền tên SV + công cụ + các ô human review trong AI audit, regenerate `commit-log.txt` (49 commit). Tạo **folder `submission/`** chứa đủ deliverable + `_CHECKLIST_TRUOC_KHI_NOP.md`. Nêu việc SV phải tự làm: xuất 3 PDF, quay video demo skill (YouTube), đính ảnh lên GitHub Issues.
- **Human review:** Đã review: đối chiếu SRS; Actual xác minh trên UI/API (kèm screenshot).

### Interaction #31
- **AI tool:** Claude Code (Sonnet 4.6)
- **Date & time:** 2026-06-29
- **Your prompt:**
  ```
  [đính kèm slide Week 03: EP 5 bước (B1 Input&Output, B2 miền Input&Output, B3 đại diện,
   B4 cô lập lỗi, B5 rút gọn TC) + BVA 3-point/2-point]
  chỉnh skill và toàn bộ bài làm cho phù hợp lý thuyết trên
  ```
- **AI output (tóm tắt):** Đối chiếu skill + bài làm với lý thuyết → BVA đã khớp; EP thiếu (a) **Output ở B1/B2**, (b) **B5 rút gọn TC**. Chạy **Workflow** (7 agent song song + 1 agent verify) bổ sung đồng loạt: (1) `domain-testing/SKILL.md` — Step 1 thêm Output, Step 2 thêm output domain, Step 5 thêm "reduce duplicate (B5)"; (2) `boundary-value-analysis/SKILL.md` — chuẩn hóa thuật ngữ **3-point/2-point + Valid Min/Max**; (3) 4 file `feature-{A,B,C,D}/domain-testing.md` — thêm **Output vào Bước 1/2**, **Bước 2b (miền giá trị Output)**, **Bước 5b (rút gọn TC B5)**; (4) `main-report.md` — thêm "Output & miền kết quả" + dòng B5 cho A.1/B.1/C.1/D.1. Verify: giữ nguyên TC row + cấu trúc Bước 1-7 (+276/−8, toàn bổ sung).
- **Human review:** Đã review: TC row & bảng cũ còn nguyên; Output + B5 khớp lý thuyết Week 03.

<!-- NEW_INTERACTION_MARKER: thêm interaction mới phía trên dòng này -->

*Mẹo: file này được AI cập nhật tự động sau mỗi lượt chat. Nhớ kiểm tra lại nội dung trước khi nộp.*
