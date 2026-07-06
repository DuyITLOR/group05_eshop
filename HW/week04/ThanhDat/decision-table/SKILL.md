---
name: decision-table
description: Sinh test case bằng kỹ thuật Decision Table Testing (bảng quyết định) cho bất kỳ feature/function nào. Dùng khi hành vi của hệ thống phụ thuộc vào sự kết hợp đồng thời nhiều điều kiện đầu vào. Skill dẫn qua từng bước: xác định điều kiện → liệt kê hành động → xây bảng quyết định → rút gọn → thiết kế test case → xuất report.
---

# Decision Table Testing — Sinh test case theo bảng quyết định

## Mục tiêu

Áp dụng kỹ thuật **Decision Table Testing** để thiết kế bộ test case bao phủ mọi **tổ hợp điều kiện quan trọng** của một feature, kèm giải thích chi tiết từng bước.

> **Khi nào dùng Decision Table?**
> Khi hành vi của hệ thống phụ thuộc vào **sự kết hợp đồng thời** nhiều điều kiện — ví dụ: "phải có A VÀ B thì mới được C", hoặc logic `if-else if` lồng nhau. Đây là điểm mạnh mà ECP và BVA không bắt được đầy đủ.

## Cơ sở lý thuyết

- **ISTQB FL Syllabus §4.4 — Decision Table Testing**: mỗi cột (rule) là một tổ hợp điều kiện → hành động; mỗi rule cần ít nhất 1 test case.
- **Cấu trúc bảng:**
  - **Conditions:** các biến đầu vào ảnh hưởng đến hành vi. Dạng **Y/N** (*limited entry*) hoặc giá trị cụ thể (*extended entry*).
  - **Actions:** kết quả/phản hồi của hệ thống.
  - **Rules:** mỗi cột = 1 tổ hợp điều kiện → tập hành động tương ứng.
  - **Don't care (-):** điều kiện không ảnh hưởng đến hành động trong rule đó → dùng để **rút gọn** (merge) các rule.
- **Số rule tối đa:** N điều kiện nhị phân → tối đa 2ᴺ rule. Sau rút gọn thường còn ít hơn.

---

## QUY TRÌNH 8 BƯỚC

Nếu người dùng chưa chỉ rõ feature/function cần test, hỏi trước. Sau đó thực hiện tuần tự và trình bày kết quả từng bước.

### Bước 0 — Xác định phạm vi & thu thập thông tin

Xác định rõ:
- Feature/function cần test là gì?
- Nguồn thông tin: spec, tài liệu yêu cầu, code, mô tả của người dùng.
- Ghi rõ ở đầu report: tên feature, nguồn đã dùng.

Nếu người dùng mô tả trực tiếp logic nghiệp vụ thì dùng đó làm nguồn — không cần đọc file.

### Bước 1 — Xác định Conditions (điều kiện)

Liệt kê tất cả các **điều kiện đầu vào** ảnh hưởng đến hành vi. Mỗi điều kiện:
- Có thể đánh giá rõ ràng: **Y/N** hoặc một tập giá trị hữu hạn.
- Kết hợp với điều kiện khác tạo ra hành vi khác nhau.

Gán mã: `C1`, `C2`, `C3`...

> Gợi ý nhận diện: các câu `if`, `&&`, `||`, guard clause trong code; các trường `role`, `status`, `flag`, `required` trong spec; điều kiện enable/disable trên UI.

### Bước 2 — Xác định Actions (hành động)

Liệt kê tất cả các **kết quả có thể xảy ra** tương ứng với từng tổ hợp điều kiện.

Gán mã: `A1`, `A2`, `A3`...

### Bước 3 — Xây dựng Decision Table đầy đủ

Tạo bảng với tất cả tổ hợp điều kiện:

| | R1 | R2 | R3 | ... |
|---|---|---|---|---|
| **C1** | Y | Y | N | ... |
| **C2** | Y | N | Y | ... |
| **A1** | ✓ | ✗ | ✗ | ... |
| **A2** | ✗ | ✓ | ✓ | ... |

Với N ≤ 4: liệt kê đầy đủ 2ᴺ rule. Với N > 4: tập trung vào các tổ hợp **có ý nghĩa nghiệp vụ**, ghi rõ lý do bỏ qua tổ hợp nào.

Đánh dấu và giải thích các **impossible rule** (tổ hợp không thể xảy ra trong thực tế).

### Bước 4 — Rút gọn bảng

Gộp các rule có **cùng tập hành động** và chỉ khác nhau ở điều kiện không ảnh hưởng → thay bằng **"-" (don't care)**:

- Ghi rõ rule nào được gộp và tại sao.
- Nếu không rút gọn được → ghi "Không rút gọn — mọi điều kiện đều phân biệt hành động".

### Bước 5 — Thiết kế test case

- Mỗi rule sau rút gọn → ít nhất **1 test case**.
- Với điều kiện "don't care (-)": chọn giá trị cụ thể khi tạo test data và ghi rõ lựa chọn đó.
- Ghi rõ mỗi test case **phủ rule nào**.

### Bước 6 — Xuất test case theo format chuẩn

Xem [references/output-format.md](references/output-format.md). Mã: `TC-<MODULE>-<NNN>`. Technique ghi: `Decision Table Testing`.

### Bước 7 — Bảng truy vết Rule ↔ Test Case

| Rule | Tóm tắt tổ hợp | Test case |
|------|----------------|-----------|
| R1 | C1=Y, C2=Y | TC-XXX-001 |
| R2 | C1=Y, C2=N | TC-XXX-002 |

### Bước 8 — Nghi vấn bug

- Tổ hợp mà spec và code xử lý **khác nhau**.
- **Missing rule**: tổ hợp hợp lệ nhưng hệ thống không xử lý.
- Logic `AND`/`OR` bị nhầm.
- Impossible rule đã loại — giải thích lý do.

---

## Output

Hỏi người dùng muốn lưu report ở đâu nếu chưa rõ. Nếu không yêu cầu cụ thể, in trực tiếp ra hội thoại.

Cấu trúc report:
1. Thông tin feature + nguồn (Bước 0)
2. Danh sách Conditions & Actions (Bước 1–2)
3. Decision Table đầy đủ (Bước 3)
4. Decision Table sau rút gọn (Bước 4)
5. Bộ test case (Bước 5–6)
6. Truy vết Rule ↔ Test Case (Bước 7)
7. Nghi vấn bug & impossible rules (Bước 8)

## Nguyên tắc

- **Không bịa logic**: mọi điều kiện và hành động phải dẫn từ nguồn thực tế hoặc mô tả của người dùng; nếu không chắc, hỏi lại.
- **Ghi rõ impossible rules**: không bỏ im lặng — giải thích tại sao loại.
- **Bám format**: mã `TC-<MODULE>-<NNN>`, technique ghi đúng `Decision Table Testing`.
