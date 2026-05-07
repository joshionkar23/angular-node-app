# ElectroCart Monorepo

Full-stack e-commerce sample with Angular frontend and Node.js/Express backend.

## Project Structure

- `frontend/` Angular 21 app (UI + auth/cart/checkout flow)
- `backend/` Express + TypeScript + MongoDB API

## Quick Start (Clone/Fork Friendly)

### 1) Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local service) OR Docker

### 2) Backend Setup

Backend setup commands:

- Windows PowerShell:
  cd backend
  npm install
  Copy-Item .env.example .env
  npm run seed
  npm run dev

- macOS/Linux:
  cd backend
  npm install
  cp .env.example .env
  npm run seed
  npm run dev

Backend runs on `http://localhost:4000`.

Swagger docs:
- UI: `http://localhost:4000/api-docs`
- JSON: `http://localhost:4000/api-docs.json`

### 3) Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

### 4) MongoDB Setup Options

Option A: Local MongoDB
- Install MongoDB Community Server
- Ensure service is running on `mongodb://127.0.0.1:27017`

Option B: Docker

```bash
docker run -d --name electrocart-mongo -p 27017:27017 mongo:7
```

## Security Checklist Before Pushing Public Repo

1. Never commit real `.env` files.
2. Keep only `.env.example` with placeholder values.
3. Rotate any secret that was ever committed (JWT secret, DB URI with credentials, API keys).
4. Use separate dev/prod databases.
5. Restrict CORS to known origins in production.
6. Use strong JWT secrets (32+ random chars).
7. Never expose MongoDB without auth/network restrictions in production.
8. Add branch protection and secret scanning on GitHub.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run seed
npm run build
```

Frontend:

```bash
cd frontend
npm start
npm run build
```

## Notes for Contributors

- This repo is configured for local-first development.
- For production deployment, use environment-specific secrets and hardened infrastructure settings.
