---
name: Playwright Test Runner & Bug Reporter
description: Chạy bộ automation test Playwright trên 3 trình duyệt (Chromium, Firefox, WebKit), thu thập kết quả HTML Report, tự động phân tích test case bị FAIL, tạo file Markdown RTM (rtm.md), Bug Report và hiển thị bản xem trước để người dùng xác nhận trước khi đẩy Issue lên GitHub.
---

# Playwright Test Runner & Bug Reporter Skill

Skill này hướng dẫn Agent cách thực thi bộ test suite Playwright trên đa trình duyệt, tổng hợp báo cáo HTML, phân tích các test case bị lỗi (FAIL), tự động tạo file ma trận truy xuất nguồn gốc độc lập (**`rtm.md`**), tạo báo cáo lỗi **Markdown Bug Report**, và thực hiện quy trình duyệt an toàn trước khi đẩy **GitHub Issues**.

---

## 1. Yêu cầu tuân thủ & Luồng làm việc (Workflow Overview)

Quy trình thực thi gồm 4 giai đoạn chính:

```mermaid
graph TD
    A[Giai đoạn 1: Thực thi Test 3 Browsers] --> B[Giai đoạn 2: Phân tích & Tạo file rtm.md + Test Summary]
    B --> C{Có Test Case FAILED?}
    C -- Không --> D[Hoàn tất - Không có Bug]
    C -- Có --> E[Giai đoạn 3: Tạo Markdown Bug Report với Severity & Priority]
    E --> F[Giai đoạn 4: Trình bày Bug & Chờ User Duyệt]
    F -- User Đồng Ý --> G[Đẩy Issue lên GitHub]
    F -- User Từ Chối/Sửa --> H[Cập nhật/Bỏ qua GitHub Issue]
```

---

## 2. Giai đoạn 1: Thực thi Test Suite (Execution)

1. Agent chuyển vào thư mục dự án `playwright/`.
2. Chạy lệnh kiểm thử trên cả **3 trình duyệt** (Chromium, Firefox, WebKit):
   ```bash
   npx playwright test --project=chromium --project=firefox --project=webkit
   ```
3. Đảm bảo Playwright tự động xuất file HTML Report tại `playwright/playwright-report/index.html` và lưu trữ hình ảnh/trace lỗi trong `playwright/test-results/`.

---

## 3. Giai đoạn 2: Tạo File Ma Trận RTM Độc Lập (`rtm.md`) & Test Summary

Agent đọc kết quả hiển thị từ Terminal log và sinh ra file RTM độc lập tại:
`playwright/reports/rtm.md` (đồng thời tạo bản sao tại thư mục nộp bài `25127340_HW04_AI_Automation_100/rtm.md` nếu có).

### Cấu trúc file `playwright/reports/rtm.md`:

```markdown
# 🗺️ Requirements Traceability Matrix (RTM)

**MSSV (Run by):** 23127340  
**Ngày thực thi:** <Date_Time>  
**Browsers Tested:** Chromium, Firefox, WebKit  

---

### 📊 Test Execution Summary
- **Total Features:** <Total_Features>
- **Total Test Cases:** <Total_Cases>
- **Total Browser Runs:** <Total_Runs>
- **Passed:** <Passed_Count> | **Failed:** <Failed_Count> | **Skipped:** <Skipped_Count>

---

### 📋 Detailed Traceability Matrix

| Requirement ID | Feature Name | Test Case ID | Test Type | Automation Script | Chromium | Firefox | WebKit | Linked Bug ID |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| FR-03 | Forgot Password | TC_FR03_01 | Positive | `tests/FR03.spec.js` | ✅ PASS | ✅ PASS | ✅ PASS | N/A |
| FR-03 | Forgot Password | TC_FR03_02 | Negative | `tests/FR03.spec.js` | ❌ FAIL | ❌ FAIL | ❌ FAIL | `BUG-FR03-01` |
| FR-03 | Forgot Password | TC_FR03_03 | Edge Case | `tests/FR03.spec.js` | ✅ PASS | ✅ PASS | ✅ PASS | N/A |
```

> **Lưu ý Reference:** Trong các file `README.md` và `main_report.md`, nhúng bảng RTM hoặc trỏ link reference tới file này:
> `👉 Xem chi tiết [Requirements Traceability Matrix (RTM)](rtm.md)`

---

## 4. Giai đoạn 3: Tạo File Báo Cáo Lỗi (Markdown Bug Report)

Nếu phát hiện có ít nhất 1 test case bị **FAILED**, Agent sẽ đọc thông tin lỗi chi tiết trong log và thư mục `test-results/`, sau đó tạo file Markdown báo cáo lỗi tại:
`playwright/reports/bug_report_<Feature_ID>.md` (Ví dụ: `playwright/reports/bug_report_FR03.md`).

### Mẫu cấu trúc File Bug Report (`bug_report_<Feature_ID>.md`):

```markdown
# 🐛 Báo Cáo Lỗi Kiểm Thử (Bug Report) - Feature <Feature_ID>

**Ngày tạo:** <Date_Time>  
**Người thực hiện:** 23127340  

---

## [BUG-01] <Tóm tắt tiêu đề lỗi ngắn gọn>

- **Bug ID:** BUG-<Feature_ID>-01
- **Test Case liên quan:** <TC_ID> (<Mô tả test case>)
- **Trình duyệt bị lỗi:** Chromium / Firefox / WebKit
- **Severity (Mức độ nghiêm trọng kỹ thuật):** Critical / Major / Minor / Low
- **Priority (Mức độ ưu tiên xử lý kinh doanh):** P1 (High) / P2 (Medium) / P3 (Low)
- **Trạng thái:** New

### 1. Các bước tái hiện (Steps to Reproduce)
1. Truy cập trang `<URL>`
2. Nhập dữ liệu đầu vào: `<Input_Data>`
3. Nhấn nút `<Button_Name>`

### 2. Kết quả thực tế (Actual Result)
`<Mô tả lỗi thực tế hoặc Error Message từ Playwright log>`

### 3. Kết quả kỳ vọng (Expected Result)
`<Mô tả kết quả đúng theo yêu cầu đặc tả>`

### 4. Bằng chứng lỗi (Evidence Screenshot)
![Bug Evidence](../../test-results/<folder-name>/test-failed-1.png)
```

---

## 5. Giai đoạn 4: Quy Trình An Toàn Đẩy GitHub Issues (Human-in-the-Loop)

⚠️ **QUY TẮC AN TOÀN TUYỆT ĐỐI:** Agent **KHÔNG BẤT KỲ LÚC NÀO** tự ý gọi công cụ đẩy Issue lên GitHub mà chưa có sự đồng ý rõ ràng của người dùng!

### Các bước thực hiện:

1. **Bước 1 (Hiển thị xem trước):** Agent hiển thị tóm tắt danh sách các Bug tìm được lên cửa sổ chat theo dạng:
   > 📢 **Phát hiện <X> lỗi trong quá trình chạy test:**
   > - **Bug 1:** `[FR-03][BUG-01] Nút Quên mật khẩu không phản hồi khi bấm`
   >   - **Severity:** Major | **Priority:** P1 (High)
   >   - **Trình duyệt bị lỗi:** Firefox
   >   - **Báo cáo RTM đã tạo tại:** `playwright/reports/rtm.md`
   >   - **Bug Report đã tạo tại:** `playwright/reports/bug_report_FR03.md`
   > 
   > ❓ **Bạn có muốn tôi tự động tạo GitHub Issue cho <X> lỗi này lên repository không?** (Hãy trả lời 'Đồng ý' hoặc 'Không').

2. **Bước 2 (Xử lý phản hồi của User):**
   - **Trường hợp A (User đồng ý / Approve):** Agent sử dụng GitHub tool để tạo Issue chính thức cho từng bug, kèm nội dung Markdown (gồm Severity & Priority) và link ảnh screenshot. Sau đó thông báo lại link các GitHub Issues đã tạo.
   - **Trường hợp B (User từ chối / Muốn chỉnh sửa):** Agent chỉ lưu file Markdown cục bộ mà KHÔNG thực hiện tạo GitHub Issue.
