# Database Reset Analysis — Gate A

## Current database behavior

- Database type: SQLite through `sqlite3` (`backend/package.json:13-19`).
- Database path: `backend/database.sqlite`, resolved relative to `backend/database.js` (`backend/database.js:1-5`).
- The schema defines `users` and `orders`, but declares no foreign keys, `NOT NULL`, or status/amount `CHECK` constraints (`backend/database.js:48-81`).
- The seed creates categories, users, products, and coupons, but no orders (`backend/database.js:83-113`).
- `initDatabase()` drops all tables and runs immediately when the module loads (`backend/database.js:13-20,117-119`). Because `server.js` imports this module (`backend/server.js:1-5`), every backend start resets the database.

No reset, seed, or database mutation was executed in Gate A. After `APPROVE TEST DATA PREPARATION`, B1 created a read-only copy of the database in the assignment repository; the SUT database itself was not changed.

## Option analysis

| Option | Existing support | Benefits | Risks / limitations | Gate A conclusion |
| --- | --- | --- | --- | --- |
| 1. Existing reset/seed command | `cd backend; node database.js` is documented at `setup_guide.md:25-28` | Recreates a known schema and seeded accounts/products | Destructive; drops all tables; creates no orders. Starting `server.js` already invokes the same reset, so a second call is redundant | Available but unsafe without backup and approval |
| 2. Backup/restore database | SQLite is one file at a fixed path | Preserves the user's current database exactly; hash can verify rollback | Backend must be stopped for a consistent copy/restore; restore writes into SUT and needs explicit permission | Required safety layer |
| 3. Transaction or disposable test database | No environment-selectable DB path or test DB configuration exists | Would give strong isolation if supported | Browser/API tests span multiple requests/connections; the current app exposes no transaction controller. A separate DB requires SUT source/config change, prohibited here | Not currently feasible without scope expansion |
| 4. API-based creation | Registration, checkout, list, and status-update endpoints exist | Exercises the real contract and avoids hand-editing SQLite | Needs a running backend; status changes are consumptive; there is no delete-all/reset endpoint. Most importantly, pre-start data is erased at startup | Recommended fixture method, but only after Gate C startup/reset |
| 5. One-time non-repeatable dataset | Can manually insert or transition records once | Lowest initial setup effort | Not repeatable; transitions consume states; poor rollback; baseline drifts | Reject for the official run |

## Safest proposal for this SUT

Use this explicit sequence, because the originally stated Gate B → Gate C order cannot retain pre-created orders:

```text
B1: backup current database (service stopped)
  -> C: start backend (automatic destructive reset) and Admin UI
  -> B2: create seven-order fixture through real APIs and read back baseline
  -> D in a separate prompt: run Playwright
  -> stop backend with permission and restore the B1 backup
```

This sequence does not require changing SUT source/configuration. It does require the user's explicit approval to adjust the B/C ordering, write fixture rows, stop the backend for rollback, and restore `database.sqlite`.

## B1 backup procedure — executed after approval

The backup was written only inside the assignment repository and is ignored by Git.

```powershell
$assignmentRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW'
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'
$dbFile = Join-Path $sutRoot 'backend\database.sqlite'
$backupDir = Join-Path $assignmentRoot '.local-db-backups'
$backupId = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupFile = Join-Path $backupDir ("database-$backupId.sqlite.backup")

New-Item -ItemType Directory -Path $backupDir -Force
Copy-Item -LiteralPath $dbFile -Destination $backupFile
Get-Item -LiteralPath $dbFile, $backupFile | Select-Object FullName, Length, LastWriteTime
Get-FileHash -Algorithm SHA256 -LiteralPath $backupFile
```

Execution evidence:

- No listener existed on TCP port 3000.
- No SUT-related Node process was running.
- Backup ID: `database-20260801-152104.sqlite.backup`.
- Source and backup length: 36,864 bytes.
- Source last-write time: `2026-08-01T14:46:37+07:00`.
- Source and backup SHA-256: `315A36C1DBD2CD4D3F773D8DEA5AE89A213A543FEB2936B9CC359A1D35C74EAF`.
- Hash/length comparison result: match.

The backup remains local and must not be committed.

## B2 API fixture procedure — executed after Gate C

After Gate C started the backend and its automatic reset finished:

1. Verify seeded admin and non-admin accounts using credentials supplied privately.
2. Register one dedicated non-admin whose harmless test name is at least 100 characters.
3. Create seven orders through `POST /api/checkout`, distributed across the seeded non-admin and long-name user.
4. Use `PUT /api/admin/orders/:id/status` to prepare two confirmed, one shipping, one delivered, and one canceled record; leave two pending.
5. Read `GET /api/admin/orders`, record only non-secret IDs/fields needed by `test-data-map.md`, and compute count/revenue independently.

Execution evidence:

- Both seeded account roles logged in successfully; no credential/token was recorded.
- One dedicated long-name non-admin was registered and used only for fixture creation.
- Seven orders were created through checkout and transitioned into exactly two pending, two confirmed, one shipping, one delivered, and one canceled state.
- Authenticated API read-back returned 7 orders owned by 2 users.
- Independent expected delivered revenue is `500000`.
- Logical IDs map to runtime order IDs 1 through 7 in `test-data-map.md`.
- One initial verification command reported an incorrect count of 1 because Windows PowerShell wrapped the JSON array as a single object. No retry mutation was performed; raw JSON was then parsed as `System.Object[]` and confirmed count 7.

Exact planned record delta after the automatic seed:

| Table | Planned rows | Purpose |
| --- | ---: | --- |
| `users` | 1 | Dedicated long-name non-admin test account — created |
| `orders` | 7 | Two pending, two confirmed, one shipping, one delivered, one canceled — created |

No admin record will be created unless the seeded admin is absent; that exception requires a revised plan and approval. No Product, Category, Coupon, or User Management test data is created beyond the one user needed to display a long order-owner name.

## Planned rollback — not executed

Rollback must occur only after browser/backend activity is stopped and with permission to overwrite the SUT database.

```powershell
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'
$dbFile = Join-Path $sutRoot 'backend\database.sqlite'
$backupFile = '[MISSING: approved backup file path]'

Copy-Item -LiteralPath $backupFile -Destination $dbFile -Force
Get-FileHash -Algorithm SHA256 -LiteralPath $dbFile
Get-FileHash -Algorithm SHA256 -LiteralPath $backupFile
```

The two hashes must match. Do not restart the current backend after restore merely to inspect it: restarting would reset the restored file again.

## Approval state

- `APPROVE TEST DATA PREPARATION`: granted; B1 and B2 complete.
- `APPROVE START SUT`: granted; both services are running.
- Adjusted `B1 -> C -> B2` sequence: granted and completed.
- Permission to stop the backend and overwrite `backend/database.sqlite` during rollback: still pending; no rollback action has run.
