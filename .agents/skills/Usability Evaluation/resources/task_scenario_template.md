# Kịch bản Nhiệm vụ Kiểm thử Tính khả dụng (Usability Task Scenario Template)

**Hệ thống kiểm thử (SUT)**: [Tên Hệ thống]  
**Phạm vi (Scope)**: [Các màn hình / Phân hệ kiểm thử]  
**Luồng End-to-End (E2E Flow)**: [Tóm tắt luồng E2E]  

---

## 1. Mục tiêu Kiểm thử (Usability Objectives)

Buổi kiểm thử hướng tới các mục tiêu cụ thể sau:
* **Khả năng hoàn thành nhiệm vụ (Task Completion Rate)**: Đánh giá tỷ lệ người dùng hoàn thành trọn vẹn luồng công việc mà không cần trợ giúp.
* **Điểm nghẽn điều hướng (Navigation Bottlenecks)**: Xác định các vị trí người dùng bị khựng lại hoặc mất thời gian tìm kiếm trên giao diện.
* **Phản hồi hệ thống (Feedback & State)**: Đánh giá tính rõ ràng của các thông báo lỗi và thông báo trạng thái thành công.
* **Mức độ tự tin & Tin tưởng (User Confidence & Trust)**: Đánh giá cảm nhận độ dễ sử dụng và sự tự tin của người dùng.

---

## 2. Kịch bản Nhiệm vụ cho Người tham gia (Participant Task Scenario)

> ⚠️ **Lưu ý dành cho Người điều phối (Moderator)**:  
> Tuân thủ nghiêm ngặt nguyên tắc: **Cung cấp cho người tham gia một mục tiêu nghiệp vụ thực tế (Goal-oriented Scenario), KHÔNG cung cấp hướng dẫn chi tiết từng bước click/bấm (No step-by-step instructions).**

### 📋 Bối cảnh & Mục tiêu (Given to Participant)

> **Bối cảnh**:  
> [Mô tả bối cảnh tình huống thực tế cho người dùng]
> 
> **Nhiệm vụ của bạn**:
> 1. [Nhiệm vụ 1]
> 2. [Nhiệm vụ 2]
> 3. [Nhiệm vụ 3]

---

## 3. Thông tin Cung cấp cho Người tham gia (Test Environment & Data)

* **URL Hệ thống**: [Link URL]
* **Tài khoản đăng nhập**: [Username / Password]
* **Dữ liệu mẫu cần nhập**: [Các tham số dữ liệu mẫu]

---

## 4. Quá trình điều phối

1. **Thiết lập tâm lý (Set the stage)**: Nhắc người dùng "Kiểm thử sản phẩm, không phải kiểm thử bạn", áp dụng **Think-Aloud Protocol**.
2. **Quan sát trung lập (Observe neutrally)**: Không nhắc bài, không dẫn dắt.
3. **Ghi nhận bằng chứng (Capture evidence)**: Ghi hình, ghi chép lỗi và điểm nghẽn.

---

## 5. Công cụ Đánh giá sau Phiên kiểm thử

* **Đánh giá Định lượng**: Thang đo **SUS (System Usability Scale 10 câu)**.
* **Đánh giá Định tính**: Phỏng vấn đào sâu theo 4 khía cạnh (*Clarity, Error Recovery, Speed, Trust*).
