Status: `READY_FOR_EXECUTION`

- Frontend: `HEALTHY` at `http://localhost:5173`; existing PID `29712` reused.
- Backend: isolated runtime `HEALTHY` at `http://localhost:3000`; PID `34568`.
- Backend DB resolution: `path.resolve(__dirname, 'database.sqlite')`; isolated backend therefore runs from its own runtime directory.
- Workspace DB: protected at `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite`. Initial hash was unavailable due to the healthy process lock; post-replacement baseline and final hash both equal `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.
- Isolated DB: `.runtime/fr-09/fr09-readiness-20260810T051450780+0700/backend/database.sqlite`; required schema and seed oracles verified.
- Authentication: HTTP `200`; JWT received but not persisted; user identity present; credentials remain runtime-only.
- Stateful fixtures: isolation guards verified; no TC-010/TC-014/TC-015 mutation executed; `coupon_usage` remains `0`.
- Seed oracles: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED` present; Keychron price `4000000`; `FR09-NOT-FOUND-7F3C` absent.
- Playwright collection: `48` definitions — Chromium `16`, Firefox `16`, WebKit `16`; no missing or duplicate IDs.
- Collection-only HTML shell: created under ignored `.runtime/`; it contains no executed-test result and is not execution evidence.
- Evidence config: `screenshot=only-on-failure`, `trace=retain-on-failure`, `video=off`, `retries=0`, FR-09 `workers=1`.
- TC-012: `NEEDS_MORE_EVIDENCE`.
- TC-013: `NEEDS_MORE_EVIDENCE`.
- Browser execution performed: `NO`.
- Product-defect classification performed: `NO`.
- AI Audit: `A-012`, `PENDING_HUMAN_REVIEW`; Verdict unset; Approval Status `PENDING`.

Readiness report: [fr-09-execution-readiness.md](<D:/Workspace/HCMUS/Software Testing/Homework/group05_eshop/docs/execution-readiness/fr-09-execution-readiness.md>)

Files created:

- `docs/execution-readiness/fr-09-execution-readiness.md`
- `docs/ai-audit/interactions/A-012-prompt.md`
- `docs/ai-audit/interactions/A-012-output.md`

Files modified:

- `.gitignore`
- `playwright.config.js`
- `docs/ai-audit/AI_AUDIT_LOG.md`

Current Checkpoint: `CHECKPOINT: FR09_EXECUTION_READINESS_REVIEW_REQUIRED`

<oai-mem-citation>
<citation_entries>
MEMORY.md:47-48|note=[Applied HW04 execution and audit boundaries]
MEMORY.md:52-52|note=[Preserved append-only audit and separate approval semantics]
</citation_entries>
<rollout_ids>
019fe23c-2d5c-75d2-9290-22492e866f3e
</rollout_ids>
</oai-mem-citation>
