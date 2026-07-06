# HW02 – Domain Testing on EShop

- **Sinh viên:** Lê Nhựt Duy – **MSSV:** 23127178
- **Môn:** Kiểm thử phần mềm (QA/QC)
- **SUT:** EShop – https://github.com/ttbhanh/eshop-sut
- **Repo bug (Issues nhóm):** https://github.com/DuyITLOR/group05_eshop/issues — A: #17–#22 · B: #51–#56 · C: #78–#81 · D: #82–#85
- **Video demo Agent Skill:** https://youtu.be/xmMnlSHMLy8

---

## 1. Feature đã chọn (1 feature / pool)

| Pool | Feature | Mã | Trạng thái |
|------|---------|----|-----------|
| A | Account registration | FR-01 | Hoàn chỉnh (Domain + BVA) |
| B | Shopping cart | FR-07 | Hoàn chỉnh (Domain + BVA) |
| C | Product management (CRUD) | FR-15 | Hoàn chỉnh (Domain + BVA) |
| D | **Mobile App** – Hồ sơ cá nhân | D7 (≈ FR-04) | Hoàn chỉnh (Domain + BVA) |

> *Feature D thuộc **Pool D — Mobile App**: kiểm thử màn **Hồ sơ cá nhân trên app mobile** (React Native/Expo), áp dụng nghiệp vụ FR-04 (Personal profile management). Mã nhóm: D7.*

## 2. Bảng tự đánh giá (Self-Assessment)

> **Điểm tự chấm: 100/100** — đã hoàn thành đầy đủ cả 4 Feature (Domain + BVA), Agent Skills + video demo, và toàn bộ tài liệu bắt buộc (Markdown + PDF). **Đuôi tên file zip = Tổng điểm** → `..._100.zip`.

| No. | Tiêu chí | Điểm tối đa | Điểm tự chấm |
|-----|----------|-------------|------------------------|
| 1 | Feature A (Domain + Boundary) | 25 | 25 |
| 2 | Feature B (Domain + Boundary) | 25 | 25 |
| 3 | Feature C (Domain + Boundary) | 25 | 25 |
| 4 | Feature D (Mobile, Domain + Boundary) | 15 | 15 |
| 5 | Agent Skills | 10 | 10 |
| | **Tổng** | **100** | **100** |

## 3. Test Summary Report

> Đã hoàn thành **cả 4 Feature**: A (FR-01) · B (FR-07) · C (FR-15) · D (FR-04 Mobile).

| Chỉ số | Feature A | Feature B | Feature C | Feature D | **Tổng** |
|--------|-----------|-----------|-----------|-----------|----------|
| Test case **designed** | 37 | 14 | 20 | 13 | **84** |
| Test case **executed** | 37 | 14 | 20 | 13 | **84** |
| **Passed** | 17 | 5 | 12 | 7 | **41** |
| **Failed** | 20 | 9 | 8 | 6 | **43** |
| **Not yet executed** | 0 | 0 | 0 | 0 | **0** |
| Số **bug** phát hiện | 6 (A1–A6) | 6 (B1–B6) | 4 (C1–C4) | 4 (D1–D4) | **20** |

> Số feature đã chọn / đã hoàn thành: **4 / 4** (A, B, C, D).
> *Ghi chú:* "Passed" của A gồm pass thật + pass nhờ HTML `required` + "Pass\*" (đúng kết quả sai lý do — BUG-A1). **Actual của Feature B/C/D là đối chiếu source — cần chạy UI/app xác nhận.** Chi tiết: [report/main-report.md](report/main-report.md).

## 4. Cấu trúc thư mục

```
report/        – Báo cáo chính: Domain Testing + BVA (md + pdf)
test-cases/    – Bộ test case theo từng feature + test-run + traceability
bug-report/    – Báo cáo bug + screenshots
ai-audit/      – AI Audit Report + AI Critique (md + pdf)
.claude/skills – Agent Skills: domain-testing, boundary-value-analysis, ai-audit-logger, report-writer
git-log/       – Git commit log (text)
assets/        – Tài liệu hỗ trợ khác
```

## 5. Liên kết nhanh

- [Báo cáo chính (Domain + BVA)](report/main-report.md)
- [Feature A – Domain Testing](test-cases/feature-A/domain-testing.md) · [Feature A – BVA](test-cases/feature-A/boundary-value-analysis.md)
- [Feature B – Domain Testing](test-cases/feature-B/domain-testing.md) · [Feature B – BVA](test-cases/feature-B/boundary-value-analysis.md)
- [Feature C – Domain Testing](test-cases/feature-C/domain-testing.md) · [Feature C – BVA](test-cases/feature-C/boundary-value-analysis.md)
- [Feature D – Domain Testing](test-cases/feature-D/domain-testing.md) · [Feature D – BVA](test-cases/feature-D/boundary-value-analysis.md)
- [Báo cáo bug](bug-report/bug-report.md)
- [Traceability matrix](test-cases/test-summary/traceability-matrix.md)
- Test run: [Register](test-cases/test-runs/sprint-1-register-test-run.md) · [Cart](test-cases/test-runs/sprint-1-cart-test-run.md) · [Product](test-cases/test-runs/sprint-1-product-test-run.md) · [Profile](test-cases/test-runs/sprint-1-profile-test-run.md)
- [AI Audit Report](ai-audit/ai-audit-report.md) · [AI Critique](ai-audit/ai-critique.md)
