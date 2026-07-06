# UCT-[ID]: Test Design — [Tên chức năng]

**Phương pháp:** Use Case Testing  
**Yêu cầu tham chiếu:** [Mã chức năng (VD: FR-10)] ([Tên chức năng])

---

## 1. Use Case Specification

### Use Case Name
[Tên use case — VD: Quản lý trạng thái đơn hàng]

### Use Case ID
UC-[Mã chức năng] (VD: UC-FR10)

### Actor(s)
| Actor | Vai trò |
|---|---|
| [Tên actor 1] | [Mô tả vai trò] |
| [Tên actor 2] | [Mô tả vai trò] |

### Description
[Mô tả ngắn gọn mục đích của use case — use case này cho phép ai làm gì]

### Preconditions
1. [Điều kiện tiên quyết 1]
2. [Điều kiện tiên quyết 2]

### Postconditions
**Thành công:**
1. [Trạng thái hệ thống sau khi use case kết thúc thành công 1]
2. [Trạng thái hệ thống sau khi use case kết thúc thành công 2]

**Thất bại:**
1. [Trạng thái hệ thống khi use case thất bại 1]

---

### Main Flow (Basic Flow)

Luồng chính mô tả chuỗi bước thực hiện khi mọi điều kiện đều thỏa mãn, dẫn đến kết quả thành công.

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| S1 | [Actor] | [Hành động của actor] |
| S2 | System | [Phản hồi của hệ thống] |
| S3 | [Actor] | [Hành động tiếp theo] |
| S4 | System | [Phản hồi tiếp theo] |
| ... | ... | ... |

**Kết quả:** [Mô tả kết quả thành công của Main Flow]

---

### Alternative Flows

Các luồng thay thế — nhánh rẽ hợp lệ từ Main Flow, vẫn dẫn đến kết quả thành công nhưng theo cách khác.

#### AF1: [Tên Alternative Flow 1]

**Điểm rẽ:** Tại bước S[x] của Main Flow  
**Điều kiện:** [Điều kiện để đi vào nhánh này]

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| AF1.1 | [Actor] | [Hành động] |
| AF1.2 | System | [Phản hồi] |
| ... | ... | ... |

**Kết quả:** [Mô tả kết quả — thường quay lại Main Flow hoặc kết thúc thành công]

---

### Exception Flows

Các luồng ngoại lệ — trường hợp lỗi hoặc vi phạm điều kiện, dẫn đến kết quả thất bại hoặc bị chặn.

#### EF1: [Tên Exception Flow 1]

**Điểm rẽ:** Tại Precondition / Tại bước S[x] của Main Flow  
**Điều kiện lỗi:** [Điều kiện gây ra lỗi]

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| EF1.1 | [Actor] | [Hành động gây lỗi] |
| EF1.2 | System | [Phản hồi lỗi của hệ thống] |

**Kết quả:** [Mô tả kết quả — thông báo lỗi, chặn hành động, v.v.]

---

## 2. Scenario Matrix (Danh sách Test Cases)

Mỗi scenario là một đường đi (path) qua Use Case (bao gồm Main Flow, Alternative Flow hoặc Exception Flow) và tương ứng với 1 Test Case cuối cùng.

| ID | Scenario / Test Case Name | Path | Expected Result |
|---|---|---|---|
| [function]-UCT-01 | [Main Flow — tên scenario] | Main Flow: S1 → S2 → ... → Sn | [Kết quả thành công] |
| [function]-UCT-02 | [Alternative Flow 1 — tên scenario] | Main Flow: S1 → ... → S[x] → AF1 | [Kết quả thành công (cách khác)] |
| [function]-UCT-03 | [Exception Flow 1 — tên scenario] | EF1 (tại Precondition) hoặc Main Flow: S1 → ... → S[x] → EF1 | [Kết quả thất bại] |
| ... | ... | ... | ... |

=> Tổng số test case: **[N]**
