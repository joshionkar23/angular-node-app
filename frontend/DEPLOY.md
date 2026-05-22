# Frontend Deployment (S3 + CloudFront)

This project includes a GitHub Actions `deploy` job that builds the Angular app and deploys the `dist/frontend` output to S3 and invalidates CloudFront.

Required GitHub repository secrets (set these in Settings → Secrets → Actions):

- `AWS_ACCESS_KEY_ID` — IAM user access key ID (or use OIDC if preferred)
- `AWS_SECRET_ACCESS_KEY` — IAM user secret access key
- `AWS_REGION` — AWS region (e.g., `us-east-1`)
- `S3_BUCKET` — Target S3 bucket name (must have static website hosting enabled)
- `CLOUDFRONT_DISTRIBUTION_ID` — CloudFront distribution ID to invalidate after deploy

How the deploy job works:

1. Runs on push to the `main` branch (for files under `frontend/**`).
2. Installs dependencies and builds the app with `npm run build` (production build).
3. Uses AWS CLI to sync the `dist/frontend` folder to the S3 bucket, excluding `index.html`.
4. Uploads `index.html` separately with `Cache-Control: no-cache` to ensure users receive the latest HTML.
5. Creates a CloudFront invalidation for `/*`.

Local test commands:

```bash
cd frontend
npm ci
npm run build -- --configuration production
# Optional dry-run
aws s3 sync ./dist/frontend s3://your-bucket --dryrun
```
