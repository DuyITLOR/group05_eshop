# HW04 Submission Validation Report

## Validation Context

| Field | Value |
| --- | --- |
| Validation Mode | `PRE_SUBMISSION` |
| Repository Root | `D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop` |
| Submission Root | Repository-root layout; final ZIP not assembled |
| Student ID | `23127107` from approved HTML-report identity evidence |
| Self-Assessed Grade | `MISSING - STUDENT DECISION REQUIRED` |
| Expected Features | Pool A `FR-05`; Pool B `FR-09`; Pool C `FR-17` |
| Expected Browsers | Chromium, Firefox, WebKit |
| Public Repository Candidate | `https://github.com/DuyITLOR/group05_eshop` |
| Overall Status | `BLOCKED` |

This was a read-only evidence validation. It did not execute Playwright, start the SUT, edit HTML reports, publish GitHub Issues, create a video, rewrite Git history, or fabricate missing evidence.

## Artifact Discovery

| Artifact ID | Artifact Type | Detected Path | Readable | Candidate Status | Notes |
| --- | --- | --- | --- | --- | --- |
| ART-001 | Main Report Markdown | `docs/report/HW04_MAIN_REPORT.md` | Yes | `PRIMARY` | AI-assisted draft; student review required. |
| ART-002 | Main Report PDF | `output/pdf/23127107_HW04_Main_Report.pdf` | Yes | `PRIMARY` | A4, rendered and visually inspected. |
| ART-003 | AI Audit Markdown | `docs/ai-audit/AI_AUDIT_LOG.md` | Yes | `PRIMARY` | 21 finalized entries; student-owned completion fields remain. |
| ART-004 | AI Audit PDF | `output/pdf/23127107_HW04_AI_Audit_Report.pdf` | Yes | `PRIMARY` | A4, rendered and visually inspected; mirrors current incomplete student fields. |
| ART-005 | AI Critique Markdown | `docs/ai-critique/AI_CRITIQUE.md` | Yes | `PRIMARY` | 300 whitespace-separated words; student review required. |
| ART-006 | AI Critique PDF | `output/pdf/23127107_HW04_AI_Critique.pdf` | Yes | `PRIMARY` | A4, rendered and visually inspected. |
| ART-007 | Git Commit Log | `docs/git/GIT_COMMIT_LOG.txt` | Yes | `PRIMARY` | Matches current local HEAD at generation time. |
| ART-008 | Test Scripts | `tests/fr-05/`, `tests/fr-09/`, `tests/fr-17/` | Yes | `PRIMARY` | 45 unique automated Test Case IDs. |
| ART-009 | Test Data | `test-data/fr-05.json`, `fr-09.json`, `fr-17.json` | Yes | `PRIMARY` | External JSON. |
| ART-010 | HTML Reports | `html-reports/fr-05/`, `fr-09/`, `fr-17/` | Yes | `PRIMARY` | Nine final run directories plus historical evidence. |
| ART-011 | Bug Reports | `docs/defects/fr-05/`, `fr-09/`, `fr-17/` | Yes | `PRIMARY` | 14 standardized local reports and promoted screenshots. |
| ART-012 | GitHub Issue Drafts | Feature-specific `github-issues/` directories | Yes | `PRIMARY` | Publication status is `NOT_PUBLISHED`. |
| ART-013 | Demo Video | Not detected | No | `MISSING` | No URL or recording evidence. |
| ART-014 | Agent Skills | `agent-skills/` | Yes | `PRIMARY` | Four readable skills; demo evidence missing. |
| ART-015 | README | `README.md` | Yes | `PRIMARY` | Summary and self-assessment structure present; final values pending. |
| ART-016 | ZIP Package | Not detected | No | `MISSING` | Acceptable only while in `PRE_SUBMISSION`; cannot be final without remaining artifacts. |

## Validation Findings

| Validation ID | Requirement | Status | Evidence | Actual Result | Expected Result | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- |
| VAL-001 | Feature Selection | `PASS` | Main report and three feature directories | Exactly FR-05, FR-09, FR-17 from Pools A/B/C. | Exactly three web features, one per pool. | None. |
| VAL-002 | Test Case Validation | `PASS` | Approved design/final summaries | 17/16/16 approved; 13/16/16 automated. | At least 12 meaningful cases per feature. | Preserve four FR-05 implementation gaps. |
| VAL-003 | Data-Driven Validation | `PASS` | `test-data/*.json` and specs | External JSON is used; no large inline scenario arrays detected in approved design. | Separate CSV/JSON files. | None. |
| VAL-004 | Automation Script Validation | `PASS` | `tests/fr-05`, `fr-09`, `fr-17` | 45 unique approved Test Case IDs implemented. | At least 36 total and 12 per feature. | None. |
| VAL-005 | Assertion Pattern Validation | `PASS` | Final feature summaries and specs | More than three distinct patterns per suite. | At least three distinct patterns. | None. |
| VAL-006 | Multi-Browser Execution | `PASS` | Final execution summaries and HTML run directories | Nine final runs; 135 project-test combinations. | Three browsers for every feature. | Preserve final run identity. |
| VAL-007 | HTML Report Validation | `PASS` | Approved rendered-report reviews A-008/A-013/A-020 | Feature ID, Run by ID, ISO timestamp, Run ID, browser identity were visually verified. | Readable HTML reports with required identity. | Reinspect after packaging; never edit reports during validation. |
| VAL-008 | Execution Evidence | `PASS` | Execution records, screenshots and traces | 94 passed, 41 failed, 0 skipped combinations. | Real attributable evidence. | None. |
| VAL-009 | Human Review and Gap Analysis | `PASS` | Automation reviews and gap files | AI misses, corrections, risks and verification are documented. | Critical review and unautomated-case explanation. | Log the report-generation interaction. |
| VAL-010 | AI Audit Report | `BLOCKED` | `AI_AUDIT_LOG.md` and PDF | Entries finalized; Student Information, conclusion/disclosure and confirmation are incomplete. | Markdown/PDF with no unresolved mandatory student fields. | Student completes and confirms; regenerate PDF. |
| VAL-011 | AI Critique | `WARNING` | `AI_CRITIQUE.md` and PDF | 300 words by whitespace token count; AI-assisted draft. | Student-owned 200-300-word critique answering all prompts. | Student reviews, edits if needed and rechecks word count. |
| VAL-012 | Git Commit History | `PASS` | Actual HEAD history in `GIT_COMMIT_LOG.txt` | 8 strict valid test-script commits. | At least 8 valid test-script commits; the distinct-day condition was removed per the instructor update reported by the student on 2026-08-10. | Preserve actual timestamps and regenerate the log before packaging. |
| VAL-013 | Main Report | `WARNING` | Main report Markdown/PDF | Required automation/review/gap/result sections exist. | Final student-reviewed Markdown/PDF. | Student reviews and re-exports. |
| VAL-014 | README | `WARNING` | Root `README.md` | Evidence totals included; video URL and self-assessment are pending. | Complete self-assessment and test summary. | Add verified final values. |
| VAL-015 | Demo Video | `BLOCKED` | Demo plan/checklist only | `NOT_RECORDED`; no YouTube URL. | Unlisted, >=5 minutes, Vietnamese narration, authorship, script, multi-browser, report, AI fix. | Record and manually verify. |
| VAL-016 | Agent Skills | `BLOCKED` | Four `SKILL.md` files; no video URL | Skill files exist but end-to-end skill demonstration evidence is missing. | Skill plus demonstration video. | Include complete skill workflow in demo or publish a separate skill video. |
| VAL-017 | Bug Reports | `PASS` locally | 14 reports and promoted screenshots | Standardized local bundles exist. | Confirmed defects documented with screenshots. | None locally. |
| VAL-018 | GitHub Issues | `BLOCKED` | 14 local drafts; final summaries | Publication status `NOT_PUBLISHED`. | Confirmed bugs logged on GitHub Issues with screenshots. | Publish reviewed drafts and attach promoted evidence. |
| VAL-019 | Git Commit Log | `PASS` | `docs/git/GIT_COMMIT_LOG.txt` | Hash/date/message and strict count are present and match local history. | Readable text-based log. | Regenerate after future legitimate commits. |
| VAL-020 | Public Repository Link | `BLOCKED` | `origin` plus `git ls-remote` check | Base remote exists; local `HW04/Quan` branch was not confirmed remotely. | Publicly accessible submitted artifacts and reports. | Push intended branch and verify anonymous access. |
| VAL-021 | ZIP Package | `WARNING` | No ZIP | Not created in PRE_SUBMISSION. | Correctly named complete ZIP in FINAL_SUBMISSION. | Resolve blockers, choose grade, then package. |
| VAL-022 | Placeholder / Broken References | `WARNING` | Audit and README scan | Student-owned placeholders/pending values remain intentionally visible. | No unresolved mandatory placeholders in final package. | Complete student fields and rerun link scan. |
| VAL-023 | Summary Consistency | `PASS` | README, main report, final summaries | 3 features; 45 automated; 135 executed; 94 passed; 41 failed; 14 bugs. | All summary surfaces agree. | Recalculate after any rerun. |
| VAL-024 | Missing Required Documents | `BLOCKED` | Artifact inventory | Real video/link and completed student confirmation are missing; public issue publication/history threshold also fail. | Every mandatory document/evidence present. | Follow priority actions below. |

## AI Critique Word Count Method

The text between `## Critique` and `## Word Count` was split on whitespace. Current count: `300`. Vietnamese word segmentation can differ from whitespace tokenization, so the method is recorded explicitly and must be rerun after any student edit.

## Git History Validation

| Commit | Author Date | Message | Test Script Files Changed | Valid | Reason |
| --- | --- | --- | --- | --- | --- |
| `1250ccb` | `2026-08-10T07:14:14+07:00` | implement Playwright automation for FR-09 | `tests/fr-09/fr-09.spec.js` | Yes | Changes a `.spec.js` file. |
| `3748dab` | `2026-08-10T01:51:24+07:00` | generate reviewed Playwright automation for FR-05 | `tests/fr-05/fr-05.spec.js` | Yes | Changes a `.spec.js` file. |
| `1651397` | `2026-08-10T11:04:32+07:00` | add catalog and percent coupon coverage | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-001 through TC-003 to the FR-17 spec. |
| `ef701a7` | `2026-08-10T11:04:52+07:00` | cover fixed creation and duplicate rejection | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-004 and TC-005. |
| `da55b74` | `2026-08-10T11:04:52+07:00` | cover required code and discount validation | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-006 through TC-008. |
| `717b351` | `2026-08-10T11:05:09+07:00` | cover expiry and minimum order validation | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-009 through TC-011. |
| `3e3dc5e` | `2026-08-10T11:05:10+07:00` | cover usage limits and owned coupon deletion | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-012 through TC-014. |
| `d08e0a7` | `2026-08-10T11:05:10+07:00` | cover unauthenticated and non-admin access | `tests/fr-17/fr-17.spec.js` | Yes | Adds TC-015 and TC-016. |

Strict result: `8 / 8` valid commits. Helper/docs/data/config/evidence-only commits are not counted. The distinct-day condition is excluded based on the instructor update reported by the student on 2026-08-10.

## Overall Result

### PASS

- Three required feature pools are represented.
- Each feature has at least 12 automated Test Case IDs.
- External JSON data, assertion-pattern diversity, nine final browser runs and HTML reports exist.
- Human reviews, automation corrections, gap analysis, 14 local bug reports and evidence are traceable.

### WARNING

- Main Report and AI Critique are AI-assisted drafts requiring student review.
- Final self-assessed grade and ZIP are intentionally pending.

### BLOCKED

- Demo video and Agent Skill demonstration evidence are missing.
- Fourteen confirmed defects remain unpublished on GitHub Issues.
- The submitted branch is not confirmed on the remote.
- AI Audit student-owned completion fields remain incomplete.

## Priority Actions

1. `P0_BLOCKING` - Complete the AI Audit student fields and regenerate its PDF.
2. `P0_BLOCKING` - Publish the intended branch and verify public access.
3. `P0_BLOCKING` - Publish the 14 reviewed GitHub Issues with promoted screenshots.
4. `P0_BLOCKING` - Record and publish the real unlisted demo with all authorship/automation/skill evidence.
5. `P0_BLOCKING` - Address the Git-history shortfall only through legitimate future test-script work; do not backdate or fabricate commits.
6. `P1_HIGH` - Review/approve the Main Report and AI Critique, then regenerate PDFs.
7. `P1_HIGH` - Choose the three-digit self-assessed grade and create/inspect the final ZIP.

## Can Submit

`NO`
