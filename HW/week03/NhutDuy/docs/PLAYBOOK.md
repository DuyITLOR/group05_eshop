# HW02 – Playbook thực hiện các Pool (B, C, D)

> Quy trình lặp lại đúng như đã làm cho **Pool A (FR-01)**: gồm **prompt copy-dán** + **việc review thủ công** ở mỗi bước.
> Sinh viên: Lê Nhựt Duy – 23127178

---

## Sơ đồ quy trình (lặp cho mỗi pool)

```
Đọc spec → Domain Testing → BVA → Bug report → GitHub Issues → Gộp main-report → Screenshot → Commit nhỏ → Push
```

---

## Cheat-sheet 3 pool còn lại

> Đọc lại đúng mục FR trong `group05_eshop/README.md` để xác nhận rule trước khi làm — bảng dưới chỉ là điểm khởi đầu.

| | Feature B | Feature C | Feature D |
|---|-----------|-----------|-----------|
| FR / Mã | FR-07 Giỏ hàng | FR-15 Product CRUD | D7 Mobile Profile |
| Module / TC prefix | `CART` / `TC-CART-###` | `PRODUCT` / `TC-PRODUCT-###` | `PROFILE` / `TC-PROFILE-###` |
| Biến chính | product id, **quantity**, price | name, **price**, description, category_id, imageUrl | name, **phone**, shipping_address |
| Rule có biên (cho BVA) | quantity ≥ 1 (số nguyên dương) | price ≥ 0; tên độ dài | phone: bắt đầu `0`, **10–11 số** |
| Bug nghi ngờ (cần kiểm chứng) | price trả string với id chẵn; cart in-memory | mass-update khi sửa; price string id chẵn | **đổi được `role`** / sửa hồ sơ người khác (authz bypass) |

---

## Bước 1 — Domain Testing

**Prompt:**
> `/domain-testing` Làm domain testing cho **Feature B (FR-07 Giỏ hàng)**. Đọc spec trong `group05_eshop/README.md` (mục FR-07) + `api_specification.md` + source code thật. Expected phải bám SRS, không đoán. Module = `CART`, mã `TC-CART-###`.

**Review thủ công:**
- Biến đã đủ chưa? (vd quantity, id, ràng buộc tồn kho?)
- Phân vùng **rời nhau & phủ kín**? Có thiếu vùng invalid nào (số âm, 0, chữ, rất lớn)?
- **Tự chạy 2–3 test case trên SUT** để xác nhận Actual mình ghi là đúng (đừng tin AI 100%).

## Bước 2 — Boundary Value Analysis

**Prompt:**
> `/boundary-value-analysis` cho **Feature B (FR-07)**. Tái dùng biên từ domain-testing, nối tiếp mã TC-CART. Nêu rõ inclusive/exclusive.

**Review thủ công:** biên min/max đúng chưa? `≥` hay `>`? Có biên ẩn (tồn kho, max quantity) không?

## Bước 3 — Bug report

**Prompt:**
> Dựa trên domain-testing + BVA của Feature B, viết bug report các lỗi tìm được vào `bug-report.md`, **đúng template** `.github/ISSUE_TEMPLATE/bug_report.md` (Found by / Requirement / Severity-Priority / Environment / Steps / Expected / Actual / Evidence).

**Review thủ công:** mỗi bug **tự tái hiện lại** trên SUT để chắc là thật; severity/priority hợp lý?

## Bước 4 — Tạo GitHub Issues

**Prompt:**
> Tạo GitHub Issues cho bug Feature B trên `DuyITLOR/group05_eshop` (dùng token keychain như Feature A), đúng template + label, rồi điền số `#` ngược vào bug-report / traceability / main-report.

**Review thủ công:** mở GitHub xem issue đúng format; **kéo-thả ảnh** vào mục `## Evidence`.

## Bước 5 — Gộp vào main-report + cập nhật summary

**Prompt:**
> `/report-writer` Gộp domain + BVA của Feature B vào `main-report.md` (mục B.0–B.4, tự chứa), cập nhật **README test summary** (cộng dồn TC/bug) + traceability + test-run.

**Review thủ công:** số liệu README cộng dồn đúng cả A+B chưa? Self-assessment cập nhật.

## Bước 6 — Commit nhỏ + Push

**Prompt:**
> Commit Feature B theo từng commit nhỏ (author DuyITLOR, không Co-Authored-By), rồi push.

**Review thủ công:** `git log` thấy commit rõ ràng; GitHub nhận đủ.

---

## Nguyên tắc xuyên suốt (để được điểm cao + đúng đề)

1. **AI-First nhưng có kỷ luật:** đi từng bước qua skill, **không** dùng 1 prompt chung "tìm hết bug giùm".
2. **Human review là bắt buộc** (đề chấm phần này): luôn **tự chạy lại** vài case + tái hiện bug; chủ động sửa chỗ AI sai (vd bắt được lỗi TC-002 ở Pool A).
3. **Audit tự động:** AI tự ghi log mỗi lượt chat — bạn chỉ cần điền "Human review" cuối cùng.
4. **Mỗi bước = 1 commit nhỏ** (Mục 12 của đề).
5. **Pool D là Mobile** (React Native, `frontend-mobile/App.js`) → test trên Expo, screenshot từ app/emulator.

---

## Checklist hoàn thành 1 pool (đánh dấu khi xong)

- [ ] `test-cases/feature-X/domain-testing.md`
- [ ] `test-cases/feature-X/boundary-value-analysis.md`
- [ ] Bug ghi trong `bug-report.md` (đúng template)
- [ ] GitHub Issues đã tạo + **đính ảnh** + điền số `#`
- [ ] Mục X.0–X.4 trong `main-report.md` (tự chứa)
- [ ] README test summary + self-assessment cập nhật (cộng dồn)
- [ ] Traceability + test-run cập nhật
- [ ] Commit nhỏ từng bước + push
- [ ] Human review đã điền trong AI audit

---

## Trước khi nộp (toàn bài, làm 1 lần ở cuối)

- [ ] Xuất **PDF**: `main-report`, `ai-critique`, `ai-audit-report`
- [ ] Viết **AI Critique** 200–300 từ (`ai-audit/ai-critique.md`)
- [ ] Điền hết **Human review** + khai báo AI trong audit
- [ ] `git-log/commit-log.txt` xuất bản cuối
- [ ] Điền link video demo Agent Skill (YouTube) vào README
- [ ] Đặt tên zip: `23127178_HW02_AI_DomainTesting_<điểm 3 số>.zip`
- [ ] Kiểm tra đủ file bắt buộc (Mục 14 của đề)
