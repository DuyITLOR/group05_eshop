---
name: Usability Evaluation
description: Thực hiện kiểm thử tính khả dụng (Usability Testing) bao gồm thiết kế kịch bản E2E mục tiêu (Task Scenario), ghi nhận nhật ký quan sát thao tác (Think-Aloud Protocol), thu thập đánh giá định lượng thang đo SUS (System Usability Scale 10 câu), tính điểm quy đổi SUS chuẩn Bangor/Sauro và tổng hợp báo cáo UX.
---

# Hướng dẫn Kỹ năng Kiểm thử Tính khả dụng (Usability Evaluation Skill)

Kỹ năng này hướng dẫn AI Agent thực hiện toàn bộ quy trình **Usability Evaluation (Kiểm thử tính khả dụng)** cho một hệ thống phần mềm (SUT), từ khâu lập kịch bản nhiệm vụ, điều phối kiểm thử với người dùng thực tế, tính toán chỉ số định lượng SUS đến tổng hợp báo cáo lỗi UX.

---

## 🔄 Quy trình Tương tác 2 Pha (Interactive 2-Phase Execution Flow)

Khi người dùng yêu cầu thực hiện Usability Evaluation cho một hệ thống hoặc luồng tính năng mới, Agent **BẮT BUỘC** phải tuân theo quy trình tương tác 2 Pha như sau:

```
┌────────────────────────────────────────────────────────────────────────┐
│  PHA 1: KHỞI TẠO & TẠO BIỂU MẪU (SETUP & PREPARATION - MANDATORY)      │
│  Agent thực hiện tự động và TẠO NGAY 2 FILE BIỂU MẪU:                   │
│  1. task_scenario.md (Kịch bản nhiệm vụ E2E dạng mục tiêu)             │
│  2. participant_session_template.md (Phiếu thu thập dữ liệu 1 ND)      │
│  ➔ Sau đó DỪNG LẠI và nhắn User mang phiếu đi test với người dùng      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                    (Chờ User cung cấp dữ liệu trả lời)
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│  PHA 2: XỬ LÝ & ĐIỀN DỮ LIỆU TỰ ĐỘNG (DATA INGESTION & REPORTING)     │
│  Khi User đưa thông tin/file trả lời của 7 người dùng:                 │
│  - Tự động che 4 số giữa SĐT/Zalo để bảo mật thông tin                │
│  - Điền nhật ký quan sát thao tác vào (observation_notes.md)           │
│  - Tính toán điểm SUS chuẩn Bangor/Sauro & điền bảng (SUS_response.md) │
│  - Xuất báo cáo tổng hợp lỗi UX & đề xuất cải tiến                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 📌 Chi tiết nhiệm vụ bắt buộc trong PHA 1:

Trong **Pha 1**, Agent không chỉ tư vấn mà phải **TẠO TRỰC TIẾP 2 FILE HỒ SƠ KIỂM THỬ**:

1. **File 1 — `task_scenario.md`**: 
   * Chứa kịch bản nhiệm vụ E2E thực tế cho người dùng.
   * Tuân thủ quy tắc: Hướng tới mục tiêu nghiệp vụ (*Goal-oriented*), **KHÔNG cung cấp hướng dẫn click bấm từng bước**.
2. **File 2 — `participant_session_template.md`**:
   * Chứa mẫu thu thập thông tin người dùng, nhật ký quan sát 4 Task (*Time, Think-Aloud, Friction Points, Errors*), 10 câu hỏi SUS tích chọn (Likert 1-5), 4 câu hỏi đào sâu (*Clarity, Error Recovery, Speed, Trust*) và bảng tính điểm cho **1 phiên test duy nhất**.
   * **Thông tin liên hệ (Zalo/Phone)**: Để trống hoàn toàn `____________________` (không che số) để User thu thập thông tin thực tế khi phỏng vấn.

---

## 📋 Quy trình Thực hiện 5 Bước (Usability Testing Workflow)

```
┌─────────────────────────────────┐
│ 1. Thiết kế E2E Task Scenario  │ (Mục tiêu nghiệp vụ, KHÔNG chỉ dẫn click-by-click)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│ 2. Chuẩn bị Phiếu thu thập     │ (Thông tin ND, Nhật ký thao tác, 10 câu SUS, Probe Qs)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│ 3. Ghi nhận Nhật ký Quan sát    │ (Think-Aloud, đo thời gian, che 4 số giữa sĐT bảo mật)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│ 4. Khảo sát & Tính điểm SUS     │ (Công thức lẻ/chẵn, thang Bangor/Sauro 0-100)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│ 5. Tổng hợp Báo cáo & Lỗi UX   │ (Thống kê Mean/Median, phân loại lỗi Blocker/Major/Minor)
└─────────────────────────────────┘
```

---

### Bước 1: Thiết kế Kịch bản Nhiệm vụ E2E (Task Scenario Design)

* **Nguyên tắc cốt lõi**: Cung cấp cho người dùng một **Mục tiêu Nghiệp vụ Thực tế (Goal-oriented Scenario)**, tuyệt đối **KHÔNG cung cấp chỉ dẫn bấm nút từng bước (No step-by-step instructions)** để quan sát hành vi tự nhiên của người dùng.
* **Cấu trúc Kịch bản**:
  1. **Bối cảnh (Context/Role)**: Đặt người dùng vào vai trò thực tế (ví dụ: Admin mới tiếp quản shop).
  2. **Nhiệm vụ (Goals)**: Chuỗi thao tác khép kín liên kết dữ liệu với nhau (Ví dụ: Đăng nhập ➔ Tạo danh mục mới ➔ Tạo sản phẩm thuộc danh mục đó ➔ Tạo mã giảm giá áp dụng cho sản phẩm).
  3. **Thông tin đầu vào (Test Data)**: Cung cấp tham số dữ liệu mẫu (tên, giá tiền, % giảm, hạn dùng...).

---

### Bước 2: Chuẩn bị Phiếu thu thập cho từng Người dùng (Participant Session Record)

Tạo file mẫu `participant_session_template.md` (Tham khảo `resources/participant_session_template.md`):
* **Thông tin người dùng**: Họ tên, Số điện thoại/Zalo (để trống không che số để lưu thông tin thực), Nghề nghiệp, Trình duyệt/Thiết bị.
* **Bảng nhật ký thao tác**: Theo dõi từng Task, thời gian (giây), trạng thái (Tự hoàn thành / Cần hỗ trợ / Thất bại), câu phát biểu *Think-Aloud*, điểm ngập ngừng và lỗi thao tác.
* **Khảo sát SUS 10 câu**: Thang đo Likert 5 mức độ (1: Rất không đồng ý ➔ 5: Rất đồng ý).
* **Câu hỏi đào sâu (Probe Questions)**: 4 khía cạnh: Độ rõ ràng (Clarity), Phục hồi lỗi (Error Recovery), Tốc độ (Speed), Tin tưởng (Trust).

---

### Bước 3: Thu thập Nhật ký Quan sát & Điền Dữ liệu (Observation Notes & Privacy)

Khi nhận dữ liệu từ các phiên test thực tế ở Pha 2 để tổng hợp vào file báo cáo chung (Tham khảo `examples/observation_notes.md`):
* **Bảo mật thông tin cá nhân**: **Bắt buộc che 4 số điện thoại/Zalo ở giữa** (Ví dụ: `0912****56`) trong tất cả các tài liệu báo cáo công khai/nộp bài.
* **Ghi nhận bằng chứng**:
  * Phát biểu của người dùng (Quotes).
  * Thời gian hoàn thành từng Task.
  * Các điểm tắc nghẽn (Friction points) và lỗi thao tác.

---

### Bước 4: Khảo sát & Tính toán Điểm SUS (System Usability Scale Evaluation)

Tự động trích xuất điểm câu trả lời và áp dụng công thức quy đổi điểm SUS chuẩn quốc tế (Tham khảo `examples/SUS_response.md`):

1. **Công thức quy đổi**:
   * Gọi $S_{\text{lẻ}}$ là tổng điểm 5 câu tích cực (Q1, Q3, Q5, Q7, Q9):
     $$\text{Score}_{\text{tích cực}} = S_{\text{lẻ}} - 5$$
   * Gọi $S_{\text{chẵn}}$ là tổng điểm 5 câu tiêu cực (Q2, Q4, Q6, Q8, Q10):
     $$\text{Score}_{\text{tiêu cực}} = 25 - S_{\text{chẵn}}$$
   * Tổng điểm SUS (Thang điểm 0 - 100):
     $$\text{SUS Score} = \left( \text{Score}_{\text{tích cực}} + \text{Score}_{\text{tiêu cực}} \right) \times 2.5$$

2. **Thước đo đánh giá Bangor et al. (2008) & Sauro**:
   * **Acceptability Range**:
     * $< 50$: Không thể chấp nhận (Not Acceptable)
     * $50 - 70$: Vùng biên (Marginal Low: 50–62, Marginal High: 62–70)
     * $> 70$: Chấp nhận được (Acceptable)
   * **Grade Scale**: Grade A ($90-100$), Grade B ($80-90$), Grade C ($70-80$), Grade D ($60-70$), Grade F ($0-60$).
   * **Adjective Rating**: Worst Imaginable ($\approx 25$), Poor ($\approx 38-39$), OK ($\approx 52$), Good ($\approx 72-73$), Excellent ($\approx 85.5$), Best Imaginable ($100$).

---

### Bước 5: Báo cáo Thống kê & Phân tích Lỗi UX (Synthesize & Bug Reporting)

* **Thống kê điểm SUS**: Tính điểm Trung bình (Mean), Trung vị (Median), Max, Min và Tỷ lệ đạt chuẩn ($>70$).
* **Phân loại lỗi UX**:
  * 🔴 **Blocker / Major**: Lỗi làm tắc nghẽn người dùng, không thể hoàn thành nhiệm vụ (Ví dụ: Thiếu thanh tìm kiếm sản phẩm).
  * 🟠 **Moderate**: Lỗi làm giảm trải nghiệm (Ví dụ: Thiếu Toast notification thông báo thành công).
  * 🟡 **Minor**: Lỗi giao diện nhỏ, thao tác không mượt.
* **Đề xuất cải tiến**: Đưa ra giải pháp UI/UX cụ thể cho từng lỗi phát hiện.

---

## 📁 Tài nguyên Đi kèm (Skill Resources & Examples)

* **Mẫu tài nguyên (Resources)**:
  * `resources/task_scenario_template.md`: Mẫu thiết kế kịch bản nhiệm vụ E2E.
  * `resources/participant_session_template.md`: Mẫu phiếu thu thập dữ liệu phiên test cho 1 người dùng.
  * `resources/observation_notes_template.md`: Mẫu bảng tổng hợp nhật ký quan sát 7 người dùng (che 4 số ĐT).
  * `resources/SUS_response_template.md`: Mẫu bảng tính toán quy đổi điểm SUS và thống kê 7 người dùng.

* **Ví dụ mẫu (Examples)**:
  * `examples/task_scenario.md`: Kịch bản E2E hoàn chỉnh cho Admin EShop.
  * `examples/observation_notes.md`: Nhật ký quan sát mẫu của 7 người dùng (đã che 4 số ĐT).
  * `examples/SUS_response.md`: Bảng tính toán điểm SUS và thống kê mẫu của 7 người dùng.
