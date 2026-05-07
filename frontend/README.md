# Frontend (Angular)

Angular 21 storefront app for authentication, product browsing, cart, and checkout.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm start
```

Frontend URL: `http://localhost:4200`

## Backend API Integration

Current API base URL is configured in:

- `src/environments/environment.ts`

Default value:

- `http://localhost:4000/api/v1`

If your backend runs on a different host/port, update `apiBaseUrl`.

## Scripts

- `npm start` run Angular dev server
- `npm run build` build production bundle
- `npm run test` run Angular test target
- `npm run test:jest` run Jest tests

## Notes

- Session auth data is stored in browser session storage.
- Ensure backend is running before login/cart/checkout actions.
