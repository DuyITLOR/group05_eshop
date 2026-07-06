# Agent Skills – HW02 Domain Testing (10 điểm)

Bộ Agent Skill tự động hóa quy trình kiểm thử cho HW02, tái sử dụng được trên mọi feature.

## Danh sách skill

| Skill | Vai trò | Output |
|-------|---------|--------|
| [`domain-testing`](domain-testing/SKILL.md) | Áp dụng kỹ thuật Domain Testing từng bước (biến → domain → phân vùng → điểm đại diện → test case) | `test-cases/feature-X/domain-testing.md` |
| [`boundary-value-analysis`](boundary-value-analysis/SKILL.md) | Áp dụng BVA từng bước (chọn biến có thứ tự → biên → min±1/max±1 → test case) | `test-cases/feature-X/boundary-value-analysis.md` |
| [`ai-audit-logger`](ai-audit-logger/SKILL.md) | Tự ghi log mỗi phiên AI (tool/date/prompt/output/review) | `ai-audit/ai-audit-report.md` |
| [`report-writer`](report-writer/SKILL.md) | Tổng hợp test case → báo cáo chính + summary + PDF | `report/main-report.md`, `README.md` |

## Quy trình dùng (end-to-end cho 1 feature)
1. `domain-testing` → thiết kế test case phân vùng
2. `boundary-value-analysis` → thiết kế test case biên
3. (chạy test, tìm bug, file GitHub Issue)
4. `report-writer` → ráp báo cáo + cập nhật summary
5. `ai-audit-logger` → chạy xuyên suốt, ghi log sau mỗi phiên AI

## Cách dùng trong Claude Code
Mỗi thư mục con là một Agent Skill (có `SKILL.md` với frontmatter `name`/`description`).
Có thể copy vào `.claude/skills/` để Claude tự gọi, hoặc tham chiếu trực tiếp.

## Video demo
- `domain-testing` + `boundary-value-analysis` end-to-end: <link YouTube>
