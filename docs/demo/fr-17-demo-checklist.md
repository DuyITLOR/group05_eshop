# FR-17 Demo Recording Readiness Checklist

## Recording Status

`NOT_RECORDED`

Checklist này dùng ngay trước và trong recording. Các checkbox được để trống để người ghi hình xác nhận trực tiếp; artifact readiness bên dưới đã được chuẩn bị nhưng không đồng nghĩa video đã tồn tại.

Kịch bản quay tích hợp Task 2 và Agent Skill: [HW04-FR17-VIDEO-SCRIPT.md](HW04-FR17-VIDEO-SCRIPT.md).

## Identity and Source Preparation

- [ ] Recording software ready.
- [ ] Video duration plan is at least 5 minutes.
- [ ] YouTube visibility will be `Unlisted`.
- [ ] Vietnamese narration outline is ready.
- [ ] `whoami` command ready.
- [ ] `hostname` command ready.
- [ ] README FR-17 requirement section ready to show.
- [ ] Agent Skill file path `agent-skills/playwright-feature-workflow/SKILL.md` ready.
- [ ] A-016 original generated output `docs/ai-audit/interactions/A-016-output.md` ready for script-fix evidence.
- [ ] Corrected `getCouponRow` implementation ready.
- [ ] `FR17-TC-004 @demo` test ready.
- [ ] `test-data/fr-17.json` ready.
- [ ] `agent-skills/playwright-feature-workflow/SKILL.md` invocation/checkpoint flow is ready to demonstrate end to end.

## Runtime and Safety Preparation

- [ ] Isolated Web Admin/backend runtime plan documented.
- [ ] Demo runtime credentials available privately.
- [ ] PowerShell demo environment commands prepared.
- [ ] Workspace `backend/database.sqlite` protection check prepared.
- [ ] Isolated exact four-seed baseline check prepared.
- [ ] Cleanup check prepared for the test-owned coupon.
- [ ] No secret values will be shown or persisted in recording artifacts.

## Previously Verified Automation Evidence

- [ ] `@demo` collection previously verified as 3 project definitions.
- [ ] TC-004 previously verified on Chromium.
- [ ] TC-004 previously verified on Firefox.
- [ ] TC-004 previously verified on WebKit.
- [ ] Primary DEMO_FIX verified multi-browser.
- [ ] Secondary TC-003 correction verified multi-browser.
- [ ] Final three-browser HTML reports ready.
- [ ] FR-17 cross-browser summary ready.
- [ ] Four Bug Report evidence packages ready.
- [ ] AI Audit entries A-016 through A-020 ready.
- [ ] GitHub Issues publication status known: `NOT_PUBLISHED`.

## Prepared PowerShell Command

```powershell
$env:FEATURE_ID = 'FR-17'
$env:STUDENT_ID = '23127107'

# Set privately at runtime; never write secret values into this file:
# SUT_API_BASE_URL
# FR17_ADMIN_BASE_URL
# FR17_TEST_ADMIN_EMAIL
# FR17_TEST_ADMIN_PASSWORD
# FR17_TEST_USER_EMAIL
# FR17_TEST_USER_PASSWORD
# FR17_ISOLATED_DB
# FR17_TEST_DB_PATH
# FR17_RUN_ID
# RUN_ID
# RUN_TIMESTAMP

npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo"
```

Command Status: `READY_NOT_EXECUTED`.

## Recording Notes

- Recording run chỉ là demonstration run.
- Authoritative full submission evidence vẫn là archived final corrected Chromium, Firefox và WebKit runs.
- Không rerun defect hoặc recapture screenshot chỉ để phục vụ video.
- Không claim video exists cho tới khi recording thực sự hoàn tất.

## Mandatory Recording Evidence

- [ ] Show face-cam, or visibly run both `whoami` and `hostname` in the terminal.
- [ ] Show the external JSON data used by `FR17-TC-004`.
- [ ] Run the selected automation end to end.
- [ ] Show evidence for Chromium, Firefox and WebKit execution; do not imply a single-project demo is the archived full multi-browser run.
- [ ] Open the generated Playwright HTML report and visibly show `Run by: 23127107`, ISO timestamp, Run ID and browser identity.
- [ ] Explain the original AI-generated `getCouponRow` locator defect.
- [ ] Show the corrected row-relative exact-code locator and explain why it prevents false failures.
- [ ] Show Agent Skill usage on a complete feature: invocation, human-review checkpoint, generated/modified artifact and final evidence.
- [ ] Verify the recording is at least 5 minutes, narrated in Vietnamese and uploaded as `Unlisted`.
- [ ] Add the final YouTube URL to `README.md`, the main report and submission checklist.

Current checkpoint: `CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED`.
