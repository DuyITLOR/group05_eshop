# Test Environment — Gate A Snapshot

Only values obtained from system/repository commands or the reviewed checklist are filled. Runtime-only fields remain explicit placeholders.

| Field | Value | Evidence |
| --- | --- | --- |
| OS | Microsoft Windows 11 Home Single Language, version `10.0.26200`, build `26200`, AMD64 | `Get-CimInstance Win32_OperatingSystem`; `$env:PROCESSOR_ARCHITECTURE` on 2026-08-01 |
| Node.js | `v22.18.0` | `node --version` on 2026-08-01 |
| Package manager | npm `10.9.3` | `npm.cmd --version` on 2026-08-01 |
| Chromium | `[MISSING: Playwright-bundled Chromium version; Playwright/Chromium command not installed or located in Gate A]` | `Get-Command chromium, chromium-browser, playwright` returned not found |
| Available Chromium-based browser | Microsoft Edge `150.0.4078.105` | File version of `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| Default viewport | `1440 x 900` | `artifacts/task1/gui-checklist-reviewed.md:40` |
| Responsive viewports | `1024 x 768`; `768 x 1024`; `320 x 800`; `375 x 812`; plus `1280 x 720` at 200% zoom | `artifacts/task1/gui-checklist-reviewed.md:50,96-97` |
| Backend origin | `http://localhost:3000` | `backend/server.js:7-9,570-572` |
| Admin origin | `http://localhost:5174` | `frontend-admin/vite.config.js:5-10` |
| Backend runtime | Ready; `GET /api/products` returned HTTP 200; listener PID `13096` | Gate C verification on 2026-08-01 |
| Admin runtime | Ready; `/` and `/src/App.jsx` returned HTTP 200; listener PID `11996` | Gate C verification on 2026-08-01 |
| Login availability | Seeded admin and non-admin login APIs returned expected roles and non-empty tokens | Gate C API verification; credentials/tokens not retained |
| Dashboard/Orders availability | Runtime Admin asset contains Dashboard count logic, Orders view condition/table mapping, and Admin Orders API reference; authenticated Orders API is reachable | Gate C runtime asset/API verification; not a GUI checklist result |
| SUT commit | `85af3ba875c88283615e22cb108f13e2fccaf0e9` | `git -C <SUT> rev-parse HEAD` on 2026-08-01 |
| SUT worktree | Dirty: tracked `backend/database.sqlite` modified; untracked files/directories also present | `git -C <SUT> status --short --branch` on 2026-08-01 |
| Assignment commit | `e771b1002115f87a5ea7c6b1fbbf21aaef3be93b` | `git -C <assignment> rev-parse HEAD` on 2026-08-01 |
| Assignment worktree | Dirty before Gate A; existing user changes preserved | `git -C <assignment> status --short --branch` on 2026-08-01 |
| Database baseline | B1 backup `database-20260801-152104.sqlite.backup`; source/backup both 36,864 bytes and SHA-256 `315A36C1DBD2CD4D3F773D8DEA5AE89A213A543FEB2936B9CC359A1D35C74EAF`. Active B2 fixture: 7 orders, expected delivered revenue `500000` | B1 filesystem evidence plus authenticated B2 API read-back on 2026-08-01 |
| Test date | `2026-08-01` | System session date |

## Compatibility note

The installed Node `v22.18.0` satisfies Vite 8's locked engine requirement `^20.19.0 || >=22.12.0` and sqlite3's `>=20.17.0`. This is a static compatibility check only; dependencies were not installed and the SUT was not started.

Microsoft Edge is Chromium-based, but it is not evidence of a Playwright-managed Chromium installation. Gate D must record the actual Playwright and browser versions after installation is separately authorized.
