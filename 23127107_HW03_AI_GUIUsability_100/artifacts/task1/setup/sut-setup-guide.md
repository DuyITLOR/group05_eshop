# SUT Setup Guide — Student Runbook

This runbook is derived from the current repository. It is not an execution log. None of these install/start/reset commands were run in Gate A.

## Safety precondition

The backend startup is destructive to `backend/database.sqlite`: `server.js` imports `database.js`, and that module immediately drops and recreates all tables (`backend/server.js:1-5`; `backend/database.js:13-20,117-119`). Do not start the backend until the database backup in Step 3 exists and is verified.

## 1. Install dependencies

Use Node.js `^20.19.0` or `>=22.12.0`. Although `setup_guide.md:5-8` says Node >=18, the current locked Vite requires the newer range (`frontend-admin/package-lock.json:3533-3551`).

```powershell
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'

Set-Location (Join-Path $sutRoot 'backend')
npm.cmd ci

Set-Location (Join-Path $sutRoot 'frontend-admin')
npm.cmd ci
```

`npm` is the repository-documented manager (`setup_guide.md:5-7,21-24,95-98`), and both packages have tracked npm lockfiles. Do not use the untracked pnpm files as the preparation contract.

## 2. Prepare environment values

The SUT does not read required environment variables; its origins and database path are hard-coded (`backend/server.js:7-9`; `backend/database.js:1-5`; `frontend-admin/src/App.jsx:1-5`; `frontend-admin/vite.config.js:5-10`).

For later local Playwright work, copy the safe example inside the assignment repository and fill the local copy privately:

```powershell
$assignmentRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\HW3\HW'
Copy-Item -LiteralPath (Join-Path $assignmentRoot '.env.playwright.local.example') -Destination (Join-Path $assignmentRoot '.env.playwright.local')
```

`.env.playwright.local` is Git-ignored. Never paste its password or any token into Markdown, screenshots, logs, or Git.

## 3. Back up the database

Run this only under `APPROVE TEST DATA PREPARATION` and while the backend is stopped:

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

Record the backup filename/hash in `test-data-map.md`. Do not proceed if the copy or hash command fails.

## 4. Start the backend

Run only under `APPROVE START SUT`:

```powershell
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'
Set-Location (Join-Path $sutRoot 'backend')
node server.js
```

The repository's actual start command is `node server.js` (`setup_guide.md:29-34`), and the server listens at `http://localhost:3000` (`backend/server.js:570-572`). Startup resets/seeds the SQLite database and leaves it with no orders.

From another terminal, perform the public liveness probe:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/api/products'
```

There is no dedicated health endpoint; `/api/products` is the available public read route (`backend/server.js:141-157`).

## 5. Start Web Admin

Run only under `APPROVE START SUT` in another terminal:

```powershell
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'
Set-Location (Join-Path $sutRoot 'frontend-admin')
npm.cmd run dev
```

The `dev` script is Vite (`frontend-admin/package.json:6-10`); strict port `5174` is configured at `frontend-admin/vite.config.js:5-10`.

Verify transport only:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5174/'
```

## 6. Check Admin Login boundary

1. Open `http://localhost:5174`.
2. Confirm the Admin Login form is visible before authentication.
3. Use the local `ADMIN_EMAIL` and `ADMIN_PASSWORD` values supplied privately.
4. Confirm the application reaches its default Dashboard view.
5. Do not record the password or token. The client stores the token in `localStorage` key `adminToken` (`frontend-admin/src/App.jsx:6-8,61-70`).

This is a Gate C availability check, not a GUI checklist execution and not a Passed/Failed decision.

## 7. Check Dashboard availability

1. Confirm the `Dashboard` navigation item opens the Dashboard surface.
2. Confirm the order-count and delivered-revenue cards render.
3. Do not claim their values are correct until the B2 fixture baseline has been created and independently calculated.

The count is rendered from `orders.length`; the current frontend revenue implementation is a known static discrepancy (`frontend-admin/src/App.jsx:217-220,276-290`).

## 8. Check Orders availability

1. Select `Đơn hàng`.
2. Confirm heading `Quản lý Đơn hàng` and the six-column table shell render.
3. An empty table immediately after startup is expected because the seed creates no orders.
4. Do not execute inline status actions until B2 has created and mapped disposable orders.

The table and action rendering are at `frontend-admin/src/App.jsx:777-875`.

## 9. Reset after testing

The safest reset is restore, not another seed, because the goal is to return the user's original database. Obtain permission to stop the backend and overwrite the database.

1. Stop the backend process whose PID was recorded when it was started.
2. Restore the exact B1 backup:

```powershell
$sutRoot = 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut'
$dbFile = Join-Path $sutRoot 'backend\database.sqlite'
$backupFile = '[MISSING: approved backup file path]'

Copy-Item -LiteralPath $backupFile -Destination $dbFile -Force
Get-FileHash -Algorithm SHA256 -LiteralPath $dbFile
Get-FileHash -Algorithm SHA256 -LiteralPath $backupFile
```

3. Require identical SHA-256 hashes.
4. Do not restart the backend just to inspect the restored DB; a restart would reset it again.

If restoring the user's original data is not required, the existing destructive reset is `Set-Location <SUT>\backend; node database.js` (`setup_guide.md:25-28`). Never run it without a verified backup and explicit approval.

## Gate-order note

The seven-order dataset cannot be prepared before backend start because startup deletes it. Use B1 backup → Gate C start/reset → B2 API fixture creation. This ordering change requires human approval before proceeding.
