# EP-[ID]: Test Design — [Tên chức năng]

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** [Mã chức năng (VD: FR-03)] ([Tên chức năng])

---

## 1. Xác định miền giá trị Input & Output

### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng]

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| [Tên input 1] | [Tổng số miền] | [Mã miền hợp lệ (VD: E1)]: [Mô tả miền hợp lệ] | [Mã miền không hợp lệ (VD: E2)]: [Mô tả miền không hợp lệ 1]<br>[Mã miền không hợp lệ (VD: E3)]: [Mô tả miền không hợp lệ 2] |
| | | | [Mã miền không hợp lệ (VD: E4)]: [Mô tả miền không hợp lệ 3] |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| [Tên output 1] | [Tổng số miền] | [Mã miền hợp lệ (VD: O1)]: [Mô tả miền hợp lệ] | [Mã miền không hợp lệ (VD: O2)]: [Mô tả miền không hợp lệ] |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng] (Input)

| ID | Test Objective | [Tên cột Input 1] | [Tên cột Output 1] | [Tên cột Output 2] |
|---|---|---|---|---|
| [ID_V01 (VD: FR03_EP_V01)] | [Mục tiêu kiểm thử] | [Giá trị đại diện] ([ID miền]) | [Kết quả mong đợi] ([ID miền]) | [Kết quả mong đợi] |

#### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng] (Output)

| ID | Test Objective | [Tên cột Input 1] | [Tên cột Output 1] | [Tên cột Output 2] |
|---|---|---|---|---|
| [ID_V02] | [Mục tiêu kiểm thử miền output] | [Giá trị đại diện] | [Kết quả mong đợi] ([ID miền]) | [Kết quả mong đợi] |

---

### 2.2. Test case cho miền không hợp lệ

#### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng] (Input)

| ID | Test Objective | [Tên cột Input 1] | [Tên cột Output 1] | [Tên cột Output 2] |
|---|---|---|---|---|
| [ID_IV01 (VD: FR03_EP_IV01)] | [Mục tiêu kiểm thử input sai] | [Giá trị đại diện sai] ([ID miền sai]) | [Kết quả mong đợi] ([ID miền]) | [Kết quả mong đợi] |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng]

| ID | Test Objective (gộp) | [Tên cột Input 1] | Expected Output |
|---|---|---|---|
| [ID_V01] | Gộp: [ID_V01, ID_V02, ...]<br>- [Mục tiêu kiểm thử 1]<br>- [Mục tiêu kiểm thử 2] | [Giá trị đại diện] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng]

| ID | Test Objective | [Tên cột Input 1] | Expected Output |
|---|---|---|---|
| [ID_IV01] | [Mục tiêu kiểm thử] | [Giá trị đại diện sai] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
