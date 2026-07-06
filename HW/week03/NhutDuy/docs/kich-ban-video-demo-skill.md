# Kịch bản quay video demo Agent Skill — HW02

> Mục tiêu (đề Mục 7): quay video **end-to-end** cách dùng Agent Skill `/domain-testing` + `/boundary-value-analysis` trên **1 feature hoàn chỉnh**. Thời lượng ~**5–7 phút**. Upload YouTube (Unlisted) → dán link vào `README.md`.
> Feature demo chọn: **Feature C – FR-15 Quản lý sản phẩm** (giàu cả Domain lẫn BVA).

---

## 0. Chuẩn bị trước khi bấm REC
- [ ] Mở **VS Code + Claude Code** tại thư mục repo HW02.
- [ ] Chạy SUT: mở terminal → `cd group05_eshop && ./start-all.sh` (cần Admin `http://localhost:5174`).
- [ ] Mở sẵn các tab: `.claude/skills/domain-testing/SKILL.md`, `test-cases/feature-C/domain-testing.md`, `report/main-report.md`.
- [ ] Mở sẵn trình duyệt tab Admin `:5174` (đăng nhập `admin@eshop.com` / `Admin123!`) và tab GitHub Issues của repo nhóm.
- [ ] Công cụ quay: **Cmd + Shift + 5** (QuickTime) hoặc OBS. Bật **mic**, nói tiếng Việt rõ ràng, tốc độ vừa.
- [ ] Skill có thể ghi đè file → quay xong chạy `git checkout test-cases/feature-C/` để khôi phục bản đã commit.

---

## 1. Kịch bản chi tiết (đọc cột "Lời nói" nguyên văn)

| # | Thời gian | Màn hình / Thao tác | Lời nói (đọc nguyên văn) |
|---|-----------|------------------------|------------------------------|
| 1 | 0:00–0:30 | Hiện màn VS Code + tên repo | "Xin chào thầy/cô. Em là **Lê Nhựt Duy, MSSV 23127178**. Trong video này em demo hai Agent Skill em tự xây cho HW02 là `/domain-testing` và `/boundary-value-analysis`, và cách em dùng chúng **end-to-end** cho **Feature C – Quản lý sản phẩm (FR-15)**." |
| 2 | 0:30–1:15 | Mở thư mục `.claude/skills/`, mở `domain-testing/SKILL.md`, cuộn qua 7 bước | "Mỗi skill là một file `SKILL.md` hướng dẫn AI làm **đúng từng bước như học trên lớp**, chứ không phải một prompt chung chung. Skill domain-testing đi qua: xác định **Input và Output**, miền giá trị, phân vùng tương đương, điểm đại diện, thiết kế test case theo nguyên tắc **cô lập lỗi**, và **rút gọn test case trùng**. Skill boundary-value-analysis thì làm BVA với 3-point: B trừ 1, B, B cộng 1." |
| 3 | 1:15–3:00 | Quay sang Claude Code, **dán Prompt 1** (mục 2 bên dưới), Enter. Vừa chạy vừa cuộn output. Sau đó mở `test-cases/feature-C/domain-testing.md` | "Bây giờ em gọi skill domain-testing cho Feature C. Skill yêu cầu AI **đọc đặc tả FR-15 và source code thật**, rồi làm từng bước: đây là **biến đầu vào** — tên, giá, danh mục; đây là **miền giá trị và Output**; đây là **phân vùng tương đương** hợp lệ và không hợp lệ; và đây là **bảng test case single-fault** — mỗi ca chỉ thả một biến sang vùng sai, các biến khác giữ hợp lệ. Expected đều bám đặc tả." |
| 4 | 3:00–4:00 | **Dán Prompt 2** (BVA), Enter. Mở `test-cases/feature-C/boundary-value-analysis.md`, chỉ vào bảng "Sinh giá trị biên" | "Tiếp theo là BVA. Skill chọn đúng hai biến có biên số thật là **độ dài tên (1–255)** và **giá (lớn hơn 0)**, xác định **cận trên/dưới** và **inclusive hay exclusive**, rồi sinh các giá trị biên: 0, 1, 2 … 254, 255, 256. Test case tại biên phát hiện hai lỗi: tên 256 ký tự vẫn lưu, và giá 0 vẫn lưu." |
| 5 | 4:00–5:00 | Chuyển sang trình duyệt Admin `:5174`. Thao tác thật: bấm **Sửa** 1 sản phẩm → đổi tên → **Lưu** → cho thấy **tất cả** sản phẩm đổi tên. Rồi mở **GitHub Issue #79** | "Và đây là bug thật mà test case phát hiện — lỗi **mass-update**: em chỉ sửa tên một sản phẩm, nhưng **toàn bộ** sản phẩm đều bị đổi tên theo. Lỗi này em đã báo lên GitHub Issue số 79, có đầy đủ steps, expected, actual và ảnh bằng chứng." |
| 6 | 5:00–5:45 | Mở `test-cases/test-summary/traceability-matrix.md` rồi `ai-audit/ai-audit-report.md` | "Mọi thứ đều **truy vết được**: bảng traceability nối **Requirement ↔ Test Case ↔ Bug Issue**. Và skill thứ ba — `ai-audit-logger` — **tự động ghi lại** mỗi phiên làm việc với AI vào file AI Audit Report này." |
| 7 | 5:45–6:00 | Quay lại VS Code, hiện cây thư mục 4 feature | "Nhờ bộ Agent Skill này, em áp dụng lại **đúng một quy trình** cho cả bốn feature A, B, C, D chỉ bằng cách gọi skill. Em cảm ơn thầy/cô đã xem." |

---

## 2. Các prompt copy-paste sẵn (gõ trong Claude Code khi quay)

**Prompt 1 — Domain Testing:**
```
/domain-testing Làm domain testing cho Feature C (FR-15 Quản lý sản phẩm).
Đọc spec FR-15 trong group05_eshop/README.md + source frontend-admin/App.jsx và backend/server.js.
Áp dụng đúng các bước: xác định Input & Output, miền giá trị, phân vùng tương đương,
điểm đại diện, test case single-fault, và rút gọn TC trùng. Module = PRODUCT, mã TC-PRODUCT-###.
```

**Prompt 2 — Boundary Value Analysis:**
```
/boundary-value-analysis Làm BVA cho Feature C (FR-15).
Biến có biên: name.length (1–255, inclusive) và price (> 0, cận dưới exclusive).
Sinh 3-point (B-1, B, B+1) tại mỗi cận và thiết kế test case biên.
```

> Nếu sợ skill chạy lâu / ghi đè khi đang quay: chỉ cần **gõ prompt cho thấy skill nhận lệnh**, rồi **mở file kết quả đã commit** (`test-cases/feature-C/domain-testing.md`, `boundary-value-analysis.md`) và **giải thích** — vẫn thể hiện được "dùng skill end-to-end".

---

## 3. Sau khi quay
1. (Nếu skill đã ghi đè file) chạy: `git checkout test-cases/feature-C/`
2. Upload video lên **YouTube** → đặt chế độ **Unlisted (Không công khai)**.
3. Mở `README.md` → thay `<điền link YouTube>` bằng link video.
4. Commit: `git add README.md && git commit -m "docs(readme): thêm link video demo Agent Skill"` → push.

---

## 4. Mẹo nói trôi chảy
- Nói **chậm, rõ**, mỗi cảnh dừng 1 nhịp trước khi chuyển.
- Không cần đọc y nguyên — hiểu ý rồi nói tự nhiên cũng được.
- Phóng to chữ VS Code (Cmd +) để người xem đọc được bảng test case.
- Tổng 6 phút là vừa; nếu quá 7 phút thì rút gọn cảnh 6.
