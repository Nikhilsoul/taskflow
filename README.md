# TaskFlow

A full-stack task manager built to practice a real CI/CD pipeline: **React + Tailwind CSS** frontend, **Express + SQLite** backend, **JWT access/refresh token authentication**, **role-based authorization** (user vs admin), and a **GitHub Actions** workflow that tests, lints, and builds on every push.

## Why this project stands out
- **Refresh token rotation** — every time the refresh endpoint is called, the old refresh token is deleted from the database and a new one is issued. A stolen, already-used token stops working.
- **httpOnly refresh cookie + in-memory access token** — the refresh token never touches JavaScript (protects against XSS), the access token never touches disk (protects against token theft via storage).
- **Automatic silent refresh on the frontend** — an axios interceptor retries any request that fails with 401 after fetching a new access token, so the user is never randomly logged out.
- **Role-based authorization** — a `/tasks/admin/all` endpoint is guarded by an `authorize('admin')` middleware, with a matching admin-only page on the frontend.
- **CI/CD** — GitHub Actions runs backend tests and a frontend lint + build on every push and PR to `main`.

## Tech stack
| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend   | Node.js, Express, better-sqlite3, jsonwebtoken, bcryptjs |
| Auth      | JWT access token (15 min) + JWT refresh token (7 days, rotated, stored server-side) |
| CI/CD     | GitHub Actions |

## Project structure
```
taskflow/
├── backend/
│   ├── src/
│   │   ├── middleware/auth.js     # authenticate + authorize(...roles)
│   │   ├── routes/auth.js         # register, login, refresh, logout, me
│   │   ├── routes/tasks.js        # task CRUD + admin-only route
│   │   ├── utils/tokens.js        # access/refresh token helpers
│   │   ├── db.js                  # SQLite schema
│   │   └── server.js
│   └── tests/auth.test.js
├── frontend/
│   └── src/
│       ├── context/AuthContext.jsx
│       ├── components/ (Navbar, ProtectedRoute)
│       ├── pages/ (Login, Register, Dashboard, Admin)
│       └── api.js                 # axios + auto token refresh
└── .github/workflows/ci-cd.yml
```

## Running locally

### 1. Backend
```bash
cd backend
cp .env.example .env   # then fill in real secrets
npm install
npm run dev
```
API runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

The first account registered with the email matching `ADMIN_EMAIL` in `.env` becomes an admin automatically.

## Running tests
```bash
cd backend && npm test
```

## CI/CD
See `.github/workflows/ci-cd.yml`. On every push/PR to `main` it:
1. Installs backend deps and runs `npm test`.
2. Installs frontend deps, runs lint, and builds the production bundle.
3. (Placeholder) deploys once both jobs pass on `main` — swap in Render/Railway/Fly.io/Vercel's action.
