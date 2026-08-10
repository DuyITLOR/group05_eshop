$playwright-feature-workflow

Workflow Mode:
CORRECTED_ADAPTIVE_MULTI_BROWSER_EXECUTION

Feature ID:
FR-17

Feature Name:
Coupon management

Student ID:
23127107

Approved Test Count:
16

Current Checkpoint:
CHECKPOINT: FR17_TC003_AUTOMATION_CORRECTION_REVIEW_REQUIRED

Preconditions:

A-018 must be FINALIZED and accepted as the original Chromium execution that
stopped at the automation-defect gate.

A-019 must be FINALIZED with:

Verdict:
VALID

Student Decision:
ACCEPTED

Verification Result:
PASSED

Approval Status:
APPROVED

If these conditions are not satisfied, STOP.

==================================================
PURPOSE
==================================================

Execute the corrected FR-17 suite.

Required sequence:

1. revalidate the approved isolated runtime;
2. run corrected Chromium full suite;
3. triage;
4. verify isolated DB cleanup;
5. if no AUTOMATION_DEFECT or ENVIRONMENT_FAILURE, run Firefox full suite;
6. triage;
7. verify cleanup;
8. if gate remains clear, run WebKit full suite;
9. triage;
10. verify final cleanup;
11. compare cross-browser results;
12. runtime-verify both FR-17 script corrections;
13. update demo runtime status;
14. create corrected execution documentation;
15. create AI Audit entry.

Do NOT:

- overwrite A-018 evidence;
- delete the original failed Chromium run;
- modify tests during this execution;
- weaken assertions;
- rerun solely for screenshots;
- assign final FR17-BUG IDs;
- create final Bug Reports.

Stop at:

CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED

==================================================
1. PRESERVE ORIGINAL A-018 HISTORY
==================================================

Original Chromium run:

fr17-chromium-20260810T084402107+0700

must remain immutable.

It documents:

13 passed
3 failed

FR17-TC-002:
PRODUCT_DEFECT_CANDIDATE

FR17-TC-003:
AUTOMATION_DEFECT

FR17-TC-016:
PRODUCT_DEFECT_CANDIDATE

Do not replace, rewrite or delete:

- original HTML report;
- original test-results;
- original screenshots;
- original traces;
- original execution record;
- original candidate screenshots;
- A-018 prompt/output.

The corrected run is a NEW execution.

==================================================
2. VERIFIED RUNTIME
==================================================

Expected Web Admin:

http://localhost:5174

Readiness-owned expected Web Admin PID:
21808

Expected isolated backend:

http://localhost:3000

Readiness-owned expected backend PID:
34940

Expected isolated backend directory:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend

Expected isolated database:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend\database.sqlite

Workspace forbidden DB:

D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite

Expected workspace DB SHA-256:

2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02

==================================================
3. RUNTIME REVALIDATION
==================================================

Before corrected Chromium verify:

- Web Admin healthy;
- isolated backend healthy;
- PIDs/path still correspond to the approved runtime where verifiable;
- isolated database exists;
- target DB is not workspace DB;
- exact isolated coupon baseline count = 4;
- exact code set:
  SAVE10
  BIGBUY
  VIP100
  EXPIRED
- no FR17-owned residue;
- Admin login still verifies role=admin;
- non-admin login still verifies role!=admin;
- workspace DB hash remains unchanged.

If runtime identity/path cannot be safely proven:

STOP with:

FR17_RUNTIME_REVALIDATION_REQUIRED

Never silently start/use the workspace backend.

==================================================
4. CORRECTIONS THAT MUST BE PRESENT
==================================================

Before browser execution statically verify all prior corrections remain wired:

Primary script correction:

getCouponRow relative-locator correction

Secondary runtime correction:

FR17-TC-003 assertion-scope / locale-independence correction

Also verify:

- TC-005 duplicate oracle remains corrected;
- TC-002 visible-indicator assertion remains corrected;
- TC-004 remains sole @demo;
- workspace DB guard remains intact.

If any correction is missing:

STOP.

==================================================
5. CORRECTED CHROMIUM FULL RUN
==================================================

Create a new unique corrected Chromium Run ID.

Do NOT reuse:

fr17-chromium-20260810T084402107+0700

Use distinct:

HTML report directory
test-results directory
RUN_ID
RUN_TIMESTAMP
FR17_RUN_ID

Run:

npx.cmd playwright test tests/fr-17/fr-17.spec.js --project=chromium

Expected:
16 tests

workers:
1

retries:
0

screenshot:
only-on-failure

trace:
retain-on-failure

video:
off

Immediately save raw run metadata after completion.

==================================================
6. CORRECTED CHROMIUM TRIAGE
==================================================

Classify each failed Test Case as exactly one:

PRODUCT_DEFECT_CANDIDATE
AUTOMATION_DEFECT
ENVIRONMENT_FAILURE
NEEDS_MORE_EVIDENCE

Specifically verify:

FR17-TC-003

The previous automation defect is considered runtime corrected only if:

- valid percent create succeeds;
- owned row is found;
- type assertion succeeds;
- discount value assertion succeeds;
- cleanup succeeds;
- no removed out-of-scope locale assertion causes failure.

If TC-003 passes:

record:

TC003_RUNTIME_CORRECTION_VERIFIED_CHROMIUM

Do not automatically classify any other failure from prior history.

Use new runtime evidence.

==================================================
7. TC-002 AND TC-016
==================================================

The original Chromium run produced product defect candidates for:

FR17-TC-002
FR17-TC-016

Treat these as prior evidence, not predetermined outcomes.

During corrected Chromium:

evaluate them again using the unchanged approved assertions.

If reproduced with trustworthy setup/assertions:

PRODUCT_DEFECT_CANDIDATE

If not reproduced:

record the actual new behavior.

Do not force consistency with A-018.

==================================================
8. ORIGINAL CANDIDATE SCREENSHOTS
==================================================

Existing A-018 Chromium candidate screenshots for TC-002 and TC-016 are the
first original product-candidate failure captures.

Do NOT overwrite them if the same candidates reproduce.

Preserve new corrected Chromium failure screenshots in the corrected
run-specific test-results directory.

Update the candidate manifest to reference additional reproduction evidence
without replacing the first-run primary candidate screenshot.

If a NEW Product Defect Candidate appears:

copy its original first-failure screenshot byte-for-byte into the candidate
directory under its Test Case ID.

No Bug IDs yet.

==================================================
9. CORRECTED CHROMIUM DATABASE GATE
==================================================

After Chromium require:

coupon count = 4

exact codes:
SAVE10
BIGBUY
VIP100
EXPIRED

no owned FR17 residue

workspace DB hash unchanged

If cleanup fails:

AUTOMATION_DEFECT

STOP.

If any AUTOMATION_DEFECT or ENVIRONMENT_FAILURE remains:

do NOT run Firefox.

Stop at:

CHECKPOINT: FR17_CORRECTED_CHROMIUM_AUTOMATION_REVIEW_REQUIRED

==================================================
10. FIREFOX FULL RUN
==================================================

Only after corrected Chromium clears automation/environment gates:

run all 16 tests on:

firefox

Use a unique Firefox Run ID and independent report/results directories.

Immediately save execution metadata.

Apply identical triage.

Verify TC-003 correction independently.

If TC-003 passes:

TC003_RUNTIME_CORRECTION_VERIFIED_FIREFOX

Verify TC-004 @demo independently.

==================================================
11. POST-FIREFOX GATE
==================================================

Require:

exact isolated baseline restored

workspace DB hash unchanged

no AUTOMATION_DEFECT

no ENVIRONMENT_FAILURE

Only then run WebKit.

==================================================
12. WEBKIT FULL RUN
==================================================

Run all 16 tests on:

webkit

Use unique run/report/result paths.

Apply identical classification rules.

If TC-003 passes:

TC003_RUNTIME_CORRECTION_VERIFIED_WEBKIT

Verify TC-004 @demo independently.

==================================================
13. FINAL DB SAFETY
==================================================

After WebKit require:

isolated coupon count:
4

exact code set:
SAVE10
BIGBUY
VIP100
EXPIRED

FR17-owned residue:
None

workspace DB hash:
unchanged

isolated backend:
healthy

==================================================
14. PRIMARY DEMO FIX VERIFICATION
==================================================

Primary DEMO_FIX:

FR-17 getCouponRow relative-locator correction

Type:
TEST_SCRIPT_CORRECTION

For each browser, verification requires TC-004 to:

- complete setup;
- create valid fixed coupon;
- use corrected getCouponRow path;
- find the exact owned row;
- pass row assertions;
- pass approved boundary assertions;
- clean up successfully.

Record:

DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM
DEMO_FIX_RUNTIME_VERIFIED_FIREFOX
DEMO_FIX_RUNTIME_VERIFIED_WEBKIT

If all three pass:

DEMO_FIX Runtime Verification:
VERIFIED_MULTI_BROWSER

Otherwise report exact partial state.

==================================================
15. SECONDARY TC-003 CORRECTION VERIFICATION
==================================================

Secondary Runtime Automation Correction:

FR17-TC-003 assertion-scope / locale-independence correction

If TC-003 passes all three browsers after the approved correction:

Secondary Correction Runtime Verification:
VERIFIED_MULTI_BROWSER

If not:

PARTIALLY_VERIFIED
or
NOT_VERIFIED

with exact browser evidence.

==================================================
16. FINAL DEMO TEST SELECTION
==================================================

If FR17-TC-004 passes all three browsers with:

setup PASS
primary assertions PASS
cleanup PASS

then update:

Primary Demo Test:
FR17-TC-004

Final Selected Demo Test:
FR17-TC-004

Demo Runtime Status:
VERIFIED_MULTI_BROWSER

Demo Recording Command Status:
READY_AFTER_FINAL_FEATURE_REVIEW

Do NOT run the separate @demo recording command now.

If TC-004 does not pass all three:

Final Selected Demo Test:
PENDING_HUMAN_REVIEW

Do not automatically move the @demo tag.

==================================================
17. HTML REPORT VERIFICATION
==================================================

For corrected/final Chromium, Firefox and WebKit reports verify rendered
content shows:

FR-17
Run by: 23127107
ISO timestamp
Run ID
browser identity

Use:

PASS_RENDERED

only after actual verification.

==================================================
18. EXECUTION DOCUMENTS
==================================================

Do NOT overwrite the historical A-018 Chromium execution record.

Create corrected/final execution records with clear naming, for example:

docs/execution-results/fr-17-chromium-corrected-execution.md

docs/execution-results/fr-17-firefox-execution.md

docs/execution-results/fr-17-webkit-execution.md

Update/create:

docs/execution-results/fr-17-cross-browser-summary.md

The cross-browser summary must clearly distinguish:

Original Chromium automation-defect run

from:

Final corrected Chromium run

The final cross-browser metrics must use the corrected Chromium run together
with Firefox and WebKit.

==================================================
19. CROSS-BROWSER SUMMARY
==================================================

Report final per-browser:

total
passed
failed
skipped
duration
Run ID
failed IDs
classifications
HTML report verification
screenshot count
trace count
DB cleanup

Compare the FINAL failure sets using:

IDENTICAL
PARTIALLY_OVERLAPPING
BROWSER_SPECIFIC

Do not count the historical TC-003 automation failure as a final product
failure.

==================================================
20. NO TEST MODIFICATION
==================================================

During this execution phase:

do not modify tests.

If any new AUTOMATION_DEFECT occurs:

STOP.

Do not repair and rerun automatically.

==================================================
21. AI AUDIT
==================================================

After completed corrected execution use:

$log-ai-audit

Operation:
CREATE_ENTRY

Use the next valid sequential ID.

Expected if no intervening artifact exists:

A-020

Artifact:

FR-17 Corrected Cross-Browser Execution and Demo Runtime Verification

Workflow Stage:

FR-17 corrected Chromium execution followed by Firefox/WebKit after approved
TC-003 automation correction

Feature / Task:

FR-17 — Coupon management

Related Artifacts:

docs/execution-results/fr-17-chromium-execution.md
docs/execution-results/fr-17-chromium-corrected-execution.md
docs/execution-results/fr-17-firefox-execution.md
docs/execution-results/fr-17-webkit-execution.md
docs/execution-results/fr-17-cross-browser-summary.md
docs/defects/fr-17/candidate-screenshots/
docs/demo/fr-17-demo-plan.md

Preserve exact prompt/output.

Set:

Review Status:
PENDING_HUMAN_REVIEW

Verdict:
unset

Approval Status:
PENDING

Do NOT UPDATE_REVIEW.

==================================================
22. RETURN
==================================================

Return:

1. Execution Status
2. Original Chromium Historical Run
3. Corrected Chromium Run ID
4. Corrected Chromium Total / Passed / Failed / Skipped
5. Corrected Chromium Failed IDs
6. Corrected Chromium Classifications
7. TC-003 Corrected Chromium Result
8. Firefox Run ID
9. Firefox Total / Passed / Failed / Skipped
10. Firefox Failed IDs
11. Firefox Classifications
12. TC-003 Firefox Result
13. WebKit Run ID
14. WebKit Total / Passed / Failed / Skipped
15. WebKit Failed IDs
16. WebKit Classifications
17. TC-003 WebKit Result
18. Final Product Defect Candidate IDs
19. Remaining Automation Defect IDs
20. Needs More Evidence IDs
21. Environment Failure IDs
22. Candidate Screenshot Preservation Result
23. Original Historical Evidence Preservation
24. Final HTML Report Verification
25. Isolated DB Cleanup Result
26. Workspace DB Protection Result
27. TC-004 Chromium Result
28. TC-004 Firefox Result
29. TC-004 WebKit Result
30. Final Demo Test
31. Demo Runtime Status
32. Primary DEMO_FIX Runtime Verification
33. Secondary TC-003 Correction Runtime Verification
34. Final Cross-Browser Failure Set Result
35. Files Created
36. Files Modified
37. AI Audit Artifact
38. Current Checkpoint

If successful:

Remaining Automation Defect IDs:
None

Environment Failure IDs:
None

Current Checkpoint:

CHECKPOINT: FR17_CORRECTED_CROSS_BROWSER_EXECUTION_REVIEW_REQUIRED
