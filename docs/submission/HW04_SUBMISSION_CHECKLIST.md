# HW04 Pre-Submission Checklist

## Validation Context

| Field | Value |
| --- | --- |
| Validation Mode | `PRE_SUBMISSION` |
| Repository Root | `D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop` |
| Student ID used by HTML reports | `23127107` |
| Expected Features | `FR-05`, `FR-09`, `FR-17` |
| Expected Browsers | Chromium, Firefox, WebKit |
| Public repository candidate | <https://github.com/DuyITLOR/group05_eshop> |
| Current local branch | `HW04/Quan` |
| Overall Status | `BLOCKED` |

`BLOCKED` không phủ nhận automation evidence đã có. Nó cho biết package chưa thỏa tất cả mandatory submission items, đặc biệt video, public publication, Git history và student-owned confirmation.

## Artifact Inventory

| Artifact | Detected Path | Status | Notes |
| --- | --- | --- | --- |
| Main Report Markdown | `docs/report/HW04_MAIN_REPORT.md` | `PASS` | Student review required. |
| Main Report PDF | `output/pdf/23127107_HW04_Main_Report.pdf` | `PASS` sau render verification | Regenerate after report edits. |
| AI Audit Markdown | `docs/ai-audit/AI_AUDIT_LOG.md` | `WARNING` | 21 finalized entries; student-owned fields remain incomplete. |
| AI Audit PDF | `output/pdf/23127107_HW04_AI_Audit_Report.pdf` | `PASS` sau render verification | Regenerate after student completes audit fields. |
| AI Critique Markdown | `docs/ai-critique/AI_CRITIQUE.md` | `WARNING` | 200-300-word draft; student review required. |
| AI Critique PDF | `output/pdf/23127107_HW04_AI_Critique.pdf` | `PASS` sau render verification | Regenerate after critique edits. |
| Git Commit Log | `docs/git/GIT_COMMIT_LOG.txt` | `PASS` | Actual local history contains 8 valid commits that modify `.spec.js`. |
| Test Scripts | `tests/fr-05/`, `tests/fr-09/`, `tests/fr-17/` | `PASS` | 45 automated Test Case IDs. |
| External Test Data | `test-data/fr-05.json`, `fr-09.json`, `fr-17.json` | `PASS` | External JSON used. |
| HTML Reports | `html-reports/fr-05/`, `fr-09/`, `fr-17/` | `PASS` | Nine final feature-browser reports plus preserved history. |
| Bug Reports | `docs/defects/fr-05/`, `fr-09/`, `fr-17/` | `PASS` locally | 14 standardized reports and screenshots. |
| GitHub Issues | Local drafts under each `github-issues/` | `BLOCKED` | Publication status `NOT_PUBLISHED`. |
| Demo Video | No URL | `BLOCKED` | Must be real, unlisted, >=5 minutes and narrated in Vietnamese. |
| Agent Skill | `agent-skills/` | `PASS` for files | Skill demonstration video evidence remains missing. |
| README Summary | `README.md` | `WARNING` | Summary present; final video link and self-assessment pending. |
| ZIP Package | Not created | `WARNING` in PRE_SUBMISSION | Do not create before blockers are resolved. |

## Rubric Validation

| ID | Requirement | Status | Evidence / Actual Result | Required Action |
| --- | --- | --- | --- | --- |
| HW04-VAL-001 | Exactly 3 web features, one each Pool A/B/C | `PASS` | FR-05, FR-09, FR-17. | None. |
| HW04-VAL-002 | At least 12 automated cases per feature | `PASS` | 13, 16, 16. | Keep four FR-05 blocked cases documented. |
| HW04-VAL-003 | External CSV/JSON test data | `PASS` | Three external JSON files consumed by specs. | None. |
| HW04-VAL-004 | At least 3 assertion patterns | `PASS` | Each feature documents more than three patterns. | None. |
| HW04-VAL-005 | Three browsers per feature | `PASS` | Nine final runs; 135 project-test combinations. | Preserve report directories. |
| HW04-VAL-006 | HTML report identity and ISO timestamp | `PASS` by approved rendered-report reviews | Final reports show Feature ID, `Run by: 23127107`, timestamp, Run ID, browser. | Recheck after packaging, do not edit reports. |
| HW04-VAL-007 | Human review and AI corrections | `PASS` | Automation reviews and A-001-A-021 approvals. | Log/report this current interaction separately. |
| HW04-VAL-008 | Unautomated cases explained | `PASS` | Four FR-05 implementation gaps have reason/attempt/blocker/next step. | None. |
| HW04-VAL-009 | Confirmed bug reports and screenshots | `PASS` locally | 14 defects with promoted screenshots. | None locally. |
| HW04-VAL-010 | Bugs logged on GitHub Issues | `BLOCKED` | 14 local issue drafts, zero published issues. | Publish each reviewed draft and attach its promoted screenshot. |
| HW04-VAL-011 | Main report Markdown + PDF | `WARNING` | Files created; student review and final re-export pending. | Review and approve. |
| HW04-VAL-012 | AI Audit Markdown + PDF | `BLOCKED` | PDF exists, but Student Information, conclusion/disclosure/confirmation are not final. | Student completes and signs; regenerate PDF. |
| HW04-VAL-013 | AI Critique 200-300 words, Markdown + PDF | `WARNING` | Draft and PDF exist. | Student reviews wording; rerun word count and PDF export. |
| HW04-VAL-014 | Public GitHub repository link | `BLOCKED` | Base remote exists; `git ls-remote` did not confirm local branch `HW04/Quan`. | Commit intended artifacts and push the branch; verify public access. |
| HW04-VAL-015 | At least 8 test-script commits | `PASS` | Current branch has 8 valid commits that modify `.spec.js`. The distinct-day condition was removed per the instructor update reported by the student on 2026-08-10. | Preserve actual timestamps; regenerate the commit log before packaging. |
| HW04-VAL-016 | Git commit log text file | `PASS` | Actual local log exported with strict validation. | Regenerate after legitimate commits. |
| HW04-VAL-017 | Demo video >=5 minutes, unlisted, Vietnamese | `BLOCKED` | `NOT_RECORDED`; no URL. | Record and verify manually. |
| HW04-VAL-018 | Video shows script, multi-browser, HTML report, AI fix | `BLOCKED` | Recording checklist only. | Follow FR-17 demo guide during real recording. |
| HW04-VAL-019 | Video authorship: face-cam or whoami/hostname | `BLOCKED` | No real recording. | Show face-cam or execute both commands on screen. |
| HW04-VAL-020 | Agent Skill + end-to-end skill demo | `BLOCKED` | Skill files exist; demonstration evidence missing. | Include skill invocation/checkpoints in the video or publish a separate skill demo. |
| HW04-VAL-021 | README self-assessment and test summary | `WARNING` | Evidence-derived metrics included; grade/video URL pending. | Student chooses grade and inserts verified URL. |
| HW04-VAL-022 | ZIP correct filename and contents | `WARNING` | Not required yet in PRE_SUBMISSION; filename depends on grade. | Create only after every mandatory artifact is final. |

## Evidence-Derived Summary

| Metric | Value |
| --- | ---: |
| Features | 3 |
| Approved Test Cases | 49 |
| Automated Test Cases | 45 |
| Blocked Approved Cases | 4 |
| Final Browser Runs | 9 |
| Project-Test Combinations Executed | 135 |
| Passed | 94 |
| Failed | 41 |
| Skipped | 0 |
| Confirmed Underlying Product Defects | 14 |
| Published GitHub Issues | 0 |

## Required Human Actions in Order

1. Review `HW04_MAIN_REPORT.md` and `AI_CRITIQUE.md`; correct any statement that does not reflect the student's work.
2. Complete AI Audit Student Information, conclusion, disclosure and Student Confirmation; log the report-generation interaction.
3. Commit only intended artifacts while preserving unrelated user changes and the workspace database.
4. Push `HW04/Quan` and verify the public URL without authentication.
5. Publish 14 GitHub Issues from reviewed drafts and attach promoted screenshots.
6. Record the real unlisted YouTube video; verify duration, Vietnamese narration, authorship evidence, multi-browser/report view and AI fix explanation.
7. Ensure the video also demonstrates the Agent Skill end to end, or publish a separate Agent Skill demo link.
8. Re-export all three PDFs and rerun link/word-count/report checks.
9. Select a three-digit self-assessed grade and create `23127107_HW04_AI_Automation_<grade>.zip`.
10. Inspect the ZIP contents and open all PDFs/HTML reports before Moodle upload.
