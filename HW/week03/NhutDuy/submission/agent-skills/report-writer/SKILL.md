---
name: report-writer
description: Assemble the HW02 main report from per-feature domain-testing and BVA outputs. Use after test cases are designed to produce the structured Markdown report (and prep for PDF), plus update the README test-summary table. Aggregates test counts and bug links.
---

# Report Writer Skill

Turn the raw per-feature test artifacts into the final HW02 deliverable report, matching
the structure the rubric grades (each feature = Domain + Boundary, 25/25/25/15 pts).

## When to use
- After `domain-testing` and `boundary-value-analysis` have produced test cases for one
  or more features.
- When the student asks to "write the report", "update the summary", or "build the PDF".

## Inputs
- `test-cases/feature-<A..D>/domain-testing.md` and `boundary-value-analysis.md`.
- `bug-report/bug-report.md` (for bug links + counts).
- Feature selection (which FR maps to A/B/C/D).

## Procedure

### Step 1 — Build each feature section in `report/main-report.md`
For every selected feature, assemble in this order:
1. **Feature description** — FR id, inputs, outputs, business rules.
2. **Domain Testing** — partition table + test-case table + step-by-step explanation
   (pull from `domain-testing.md`).
3. **Boundary Value Analysis** — boundary table + test-case table + explanation
   (pull from `boundary-value-analysis.md`).
4. **AI Gap Analysis** — test cases/bugs the AI missed + WHY (prompt quality / AI limits /
   feature complexity). This section is required by the rubric.
5. **Bugs found** — table linking to GitHub Issues (from `bug-report.md`).

### Step 2 — Aggregate the test summary
Count across all features: TC designed, executed, passed, failed, not-executed; bug count.
Update the **Test Summary Report** table in `README.md`.

| Metric | Value |
|--------|-------|
| Features | 4 |
| TC designed / executed / passed / failed / not-executed | … |
| Bugs | … |

### Step 3 — Fill the self-assessment table
Update the self-assessed grade column in `README.md` (and the zip filename suffix).

### Step 4 — Export to PDF
The submission needs Markdown **and** PDF. Produce the PDF from `report/main-report.md`
(and `ai-audit/*.md`) — e.g. via a Markdown-to-PDF tool — and place alongside the `.md`.

### Step 5 — Consistency & review checkpoint
Verify: every TC ID is unique; every bug in the report has a matching GitHub Issue +
screenshot; counts in README match the actual tables; explanations are present for each
technique. Ask the student to do a final read.

## Output
- `report/main-report.md` (+ exported `report/main-report.pdf`).
- Updated `README.md` (summary + self-assessment).

## Rules
- Do not leave placeholder `<...>` text in the final report.
- Every claim/expected result must trace back to the spec or an observed bug.
- Keep prose explanations — the rubric grades the reasoning, not only the tables.
