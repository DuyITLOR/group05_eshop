# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An e-commerce system (EShop) built as a **System Under Test (SUT)** for software testing education. The codebase contains **intentional bugs** across security, business logic, and UI layers for students to discover through testing. Documentation (README.md, api_specification.md) is in Vietnamese.

## Architecture

Four independent applications sharing a single backend API:

- **backend/** — Node.js + Express + SQLite3 (CommonJS). Single-file API (`server.js`), JWT auth, in-memory cart storage. Runs on port 3000.
- **frontend-web/** — React 19 + Vite + Tailwind. Customer-facing SPA. State via React Context (AuthContext, CartContext). Port 5173.
- **frontend-admin/** — React 19 + Vite + Tailwind. Admin dashboard with tabbed CRUD. Port 5174.
- **frontend-mobile/** — React Native + Expo. Single-file app (`App.js`, 42KB).

Database: SQLite with 6 tables (users, products, categories, orders, coupons, coupon_usage). Schema defined and seeded in `backend/database.js`.

## Commands

### Backend
```bash
cd backend
npm install
node database.js    # Initialize/reset SQLite DB with seed data
node server.js      # Start API server on :3000
```

### Frontend Web
```bash
cd frontend-web
npm install
npm run dev         # Vite dev server on :5173
npm run build       # Production build
npm run lint        # ESLint
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev         # Vite dev server on :5174
npm run build
npm run lint
```

### Frontend Mobile
```bash
cd frontend-mobile
npm install
npx expo start     # Expo dev server
```

No automated test framework is configured. Tests are manual test cases in Markdown under `tests/test-cases/`, organized by feature (auth/, product/).

## Default Credentials

- **Admin**: `admin@eshop.com` / `Admin123!`
- **Test User**: `test@eshop.com` / `Test1234!`

## Key Documentation

- `README.md` — Full SRS with 24 functional requirements (FR-01–FR-24) and 7 security requirements
- `api_specification.md` — All REST endpoints with request/response examples
- `setup_guide.md` — Installation walkthrough (notes that bugs are intentional)

## Intentional Bugs (for testing exercises)

The codebase has deliberate defects including: SQL injection in product search, XSS via dangerouslySetInnerHTML, authorization bypass in profile update, login attempt counter incrementing by 2, price returned as string for even product IDs, off-by-one in coupon minimum order check, incorrect percentage discount calculation, mass-update bug in admin product editing, plaintext password storage, and hardcoded JWT secret.
