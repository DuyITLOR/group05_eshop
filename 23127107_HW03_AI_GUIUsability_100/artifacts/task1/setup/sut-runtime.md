# SUT Runtime — Gate A Static Analysis

## Repository boundaries

| Item | Value |
| --- | --- |
| Assignment repository | `D:/Workspace/HCMUS/Software Testing/Homework/Hcmus-Software_Testing-HW/HW3/HW` |
| SUT repository | `D:/Workspace/HCMUS/Software Testing/Homework/Hcmus-Software_Testing-HW/eshop-sut` |
| Allowed writes in Gate A | Assignment repository only |
| SUT access used | Read-only static inspection |

## Runtime findings

| Property | Finding | Source evidence |
| --- | --- | --- |
| Package manager | `npm`; each in-scope package has a tracked `package-lock.json` with lockfile version 3 | `setup_guide.md:5-7,21-24,95-98`; `backend/package-lock.json:1-6`; `frontend-admin/package-lock.json:1-6` |
| Repository prerequisite | The guide says Node.js `>= 18.x` | `setup_guide.md:5-8` |
| Effective Node requirement | Use Node.js `^20.19.0` or `>=22.12.0`. The locked frontend Vite 8 dependency requires that range; the locked backend `sqlite3` requires `>=20.17.0`. The guide's `>=18.x` statement is stale for the current locks. | `frontend-admin/package-lock.json:3533-3551`; `backend/package-lock.json:1424-1438` |
| Backend install | `cd backend` then `npm.cmd ci` for a lockfile-exact install. The repository guide documents `npm install`; use it only if intentionally refreshing dependency resolution. | `setup_guide.md:16-24`; `backend/package-lock.json:1-6` |
| Admin install | `cd frontend-admin` then `npm.cmd ci` for a lockfile-exact install. The repository guide documents `npm install`. | `setup_guide.md:90-98`; `frontend-admin/package-lock.json:1-6` |
| Backend start | `cd backend` then `node server.js` | `setup_guide.md:29-34`; `backend/server.js:570-572` |
| Admin start | `cd frontend-admin` then `npm.cmd run dev` | `frontend-admin/package.json:6-10`; `setup_guide.md:99-103` |
| Backend origin | `http://localhost:3000` | `backend/server.js:7-9,570-572` |
| Admin origin | `http://localhost:5174` with strict port binding | `frontend-admin/vite.config.js:5-10` |
| Required environment variables | None found. Backend port, database path, API base URL, and admin port are source constants; no environment template exists in the SUT. | `backend/server.js:7-9`; `backend/database.js:1-5`; `frontend-admin/src/App.jsx:1-7`; `frontend-admin/vite.config.js:5-10` |
| Database | SQLite file at `backend/database.sqlite`, opened through the `sqlite3` package | `backend/database.js:1-5`; `backend/package.json:13-19` |
| Dedicated health endpoint | None found in `backend/server.js`. Use public `GET /api/products` only as a liveness/data-path probe after Gate C approval. | `backend/server.js:141-157`; route inventory from static inspection |

## Commands discovered

The following commands are documentation only and were not run in Gate A.

```powershell
# Install backend dependencies reproducibly
Set-Location 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut\backend'
npm.cmd ci

# Start backend
node server.js

# Install Web Admin dependencies reproducibly
Set-Location 'D:\Workspace\HCMUS\Software Testing\Homework\Hcmus-Software_Testing-HW\eshop-sut\frontend-admin'
npm.cmd ci

# Start Web Admin
npm.cmd run dev
```

## Future health-check procedure

Run only after `APPROVE START SUT`:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/api/products'
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5174/'
```

Expected transport-level result: both requests return an HTTP success response. This is not a GUI checklist result. The backend has no dedicated `/health` endpoint.

## Critical startup side effect

`server.js` imports `./database` (`backend/server.js:1-5`). Importing that module immediately executes `initDatabase()` (`backend/database.js:13-20,117-119`), which drops all six tables, recreates them, and seeds categories, users, products, and coupons but no orders (`backend/database.js:15-20,83-113`). Therefore:

- starting the backend is a database reset operation;
- the current `backend/database.sqlite` must be backed up before Gate C;
- any orders inserted before backend startup will be deleted;
- the original Gate B → Gate C ordering cannot preserve prepared orders. Use the proposed B1 backup → C start/reset → B2 API fixture creation sequence after explicit approval.

## Restrictions retained

- Do not install Playwright, create Playwright configuration, write tests, or run browsers in this preparation interaction.
- Do not start or stop either SUT service in Gate A.
- Do not execute `node database.js`; it is destructive.
- Do not edit SUT source, package files, configuration, or `backend/database.sqlite`.
- Do not store real credentials or tokens in the assignment repository.
