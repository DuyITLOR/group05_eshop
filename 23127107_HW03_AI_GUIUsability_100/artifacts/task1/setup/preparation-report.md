# Gate A Preparation Report

## Readiness summary

| Check | Status | Evidence | Missing Information | Required Action |
| --- | --- | --- | --- | --- |
| Assignment repository write access | Ready | Gate A documents and safe examples created under assignment repository | None | Keep all future test artifacts in assignment repository |
| SUT repository read access | Ready | README, setup guide, manifests, tracked locks, API spec, backend, database, frontend Admin config/source read successfully | None | Continue read-only until an approval explicitly allows DB mutation |
| Four Task 1 input artifacts | Ready | `gui-scope.md`, `gui-checklist.md`, `gui-checklist-critique.md`, and official `gui-checklist-reviewed.md` read fully | None | Do not edit them; execute the reviewed 60-item version later |
| Scope boundary | Ready | Reviewed checklist metadata and review boundary | None | Keep only Admin Login boundary, Dashboard, Orders, row summary, inline status update |
| Package manager and lockfiles | Ready | npm guide plus tracked npm lockfiles | None | Use `npm.cmd ci` if installation is later authorized |
| Node compatibility | Ready | Local Node `v22.18.0`; Vite locked engine `^20.19.0 || >=22.12.0` | Repository guide's Node >=18 statement is stale | Use the effective locked dependency range |
| Install/start commands | Ready | Existing dependencies were sufficient; `node server.js` and `npm.cmd run dev` started successfully | None for current session | Keep recorded service PIDs for later controlled shutdown |
| Backend origin and Admin origin | Ready | Backend `/api/products` and Admin `/` returned HTTP 200; listeners on ports 3000/5174 | Browser-rendered GUI not evaluated | Keep services running for the approved next phase only |
| Required SUT environment variables | Ready | No environment templates; no `process.env` configuration found for in-scope runtime | None | Keep Playwright-only variables in ignored local file |
| Dedicated backend health endpoint | Missing | No `/health`; public `GET /api/products` returned HTTP 200 | Dedicated endpoint absent | Continue using `/api/products` only as a liveness probe |
| Authentication contract | Ready | Seeded admin/non-admin login returned expected roles and non-empty tokens | Browser form behavior not evaluated | Keep GUI behavior for Gate D |
| Order list/update contract | Ready | Authenticated list and valid status updates succeeded during fixture preparation | Invalid/error paths not executed | Preserve error paths for mock/GUI execution |
| Allowed/final status contract | Ready | README FR-10 plus backend transition source | Runtime behavior unverified | Preserve canceled → delivered discrepancy as test target only |
| Database type/path/schema | Ready | SQLite `backend/database.sqlite`; users/orders schema and API read-back verified | None for fixture preparation | Do not restart backend because it would reset the active fixture |
| Existing reset/seed behavior | Ready | Backend startup reset produced an empty Orders API before B2 | Restore procedure remains unexecuted | Keep verified B1 backup for rollback |
| Current database backup | Ready | `.local-db-backups/database-20260801-152104.sqlite.backup`; source and backup are 36,864 bytes with matching SHA-256 `315A36C1DBD2CD4D3F773D8DEA5AE89A213A543FEB2936B9CC359A1D35C74EAF` | None for B1 | Keep backup local and do not commit it |
| Real account readiness | Ready | Admin/non-admin seed logins verified; long-name user registered/logged in | Credentials intentionally not retained in tracked files | Admin credentials must remain local for Gate D |
| Seven-order real fixture | Ready | IDs 1–7 mapped with exact statuses/amounts; 2 distinct owners | None while backend remains running | Do not rerun fixture creation |
| Empty/loading/error fixture | Ready | Mock plan mapped to GUI-017,026,037,040–043,055,059 | Playwright implementation absent by design | Implement only in a separate Gate D prompt |
| Database baseline | Ready | API read-back count 7; expected delivered revenue `500000`; status/variant mapping stored | Active DB hash unavailable while SQLite file is locked | Use API baseline during execution; verify restore hash later |
| Chromium version | Missing | Chromium/Playwright commands not found; Edge version recorded separately | Playwright-managed browser version | Install and record only in Gate D |
| GUI execution evidence | Not Applicable | Gate A prohibition | All Actual Result/Status/Evidence cells remain blank | Do not execute in this interaction |
| Human accessibility/visual judgments | Needs Human Input | TD-18 mapping | Real evaluator observations | Collect during approved execution; do not fabricate |
| GitHub issues | Not Applicable | Gate A prohibition | None | Create only from later confirmed, student-reviewed defects |
| Gate order compatibility | Ready | User approved `B1-C-B2`; sequence completed through B2 | None | Do not restart services |
| SUT database write/rollback permission | Needs Permission | Fixture writes were approved and completed | Permission to stop backend and restore original DB is still pending | Obtain rollback approval after testing |

## Exact proposed Gate B/C mutation plan

This section is the approved plan. B1, Gate C, and B2 have been executed; Gate D and rollback have not.

### Assignment files changed in B1 or planned for later gates

- `artifacts/task1/setup/test-data-map.md`: B1 backup and B2 runtime fixture fields updated; only restore verification remains missing.
- `artifacts/task1/setup/test-environment.md`: B1 filesystem baseline updated; service/browser values remain pending.
- `artifacts/task1/setup/preparation-report.md`: B1 status/evidence updated.
- `.local-db-backups/database-20260801-152104.sqlite.backup`: created locally and ignored by Git.

No source, package, lock, configuration, or documentation file in the SUT repository would be edited.

### Database to be modified

`D:/Workspace/HCMUS/Software Testing/Homework/Hcmus-Software_Testing-HW/eshop-sut/backend/database.sqlite`

The first modification is automatic when `node server.js` imports `database.js`. B2 then adds fixture records through APIs. Rollback overwrites this file from the verified backup while the backend is stopped.

### Records to be created after startup reset

| Table | Count | Records |
| --- | ---: | --- |
| `users` | 1 | One dedicated non-admin with harmless name length >=100 |
| `orders` | 7 | `PENDING_A`, `PENDING_B`, `CONFIRMED_A`, `CONFIRMED_B`, `SHIPPING_A`, `DELIVERED_CONTROL`, `CANCELED_CONTROL` |

The seed-provided admin and non-admin are verified, not recreated. If either is absent after reset, stop and revise this plan instead of improvising.

### Commands/endpoints executed or reserved for rollback

1. B1 executed: `New-Item`, `Copy-Item`, `Get-Item`, and `Get-FileHash` as shown in `database-reset-analysis.md`.
2. Gate C executed: `node server.js` in `backend`; `npm.cmd run dev` in `frontend-admin`; then read-only `Invoke-WebRequest` checks.
3. B2 executed these API calls against `BACKEND_ORIGIN`:
   - `POST /api/login` for privately supplied seeded accounts;
   - `POST /api/register` once for the long-name test user;
   - `POST /api/checkout` seven times;
   - `PUT /api/admin/orders/:id/status` to derive two confirmed, one shipping, one delivered, and one canceled state;
   - `GET /api/admin/orders` to verify IDs/statuses and compute baseline.
4. Rollback remains pending approval: stop the recorded backend PID, `Copy-Item -Force` the approved backup over `database.sqlite`, and compare both SHA-256 hashes.

No real credential or token will be written to tracked files or command output captured as evidence.

## Gate decision

Gate A, B1, Gate C availability checks, and B2 fixture creation are complete. Backend and Web Admin remain running with the seven-order fixture active.

Gate D is still blocked by this interaction boundary and by the missing Playwright-managed Chromium/version. Database rollback also remains pending explicit permission to stop the backend and restore `database.sqlite`.

Gate D remains out of scope for this interaction.
