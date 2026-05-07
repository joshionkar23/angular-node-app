# Backend (API)

Node.js + Express + TypeScript backend using MongoDB and JWT auth.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create env file:

- Windows PowerShell: Copy-Item .env.example .env
- macOS/Linux: cp .env.example .env

3. Start MongoDB (local service or Docker), then run:

```bash
npm run seed
npm run dev
```

API base URL: `http://localhost:4000/api/v1`

## Swagger API Docs

- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI JSON: `http://localhost:4000/api-docs.json`

## Scripts

- `npm run dev` start with hot reload
- `npm run build` transpile to `dist/`
- `npm run start` run production build
- `npm run seed` reset and seed DB data
- `npm run typecheck` TypeScript check
- `npm run lint` lint source
- `npm run test` run backend tests

## Environment Variables

See `.env.example` for all supported variables.

Minimum required for local development:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

## Security Notes

- Do not commit `.env` files.
- Keep secrets only in local env or secret manager.
- In production, avoid `CORS_ORIGIN=*`.
- Rotate JWT secret if it was ever exposed.
