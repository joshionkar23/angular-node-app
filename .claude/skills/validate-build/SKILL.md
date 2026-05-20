---
name: validate-build
description: Run the Angular production build and report success or failure, including bundle size and any budget violations. Use when the user asks to build, check build status, or validate deployment readiness.
---

# Validate production build

Run the Angular production build and report results.

## Steps

1. Confirm `frontend/package.json` has a `build` script.
2. Run:
   ```
   npm --prefix frontend run build -- --configuration=production
   ```
   If `--configuration=production` is rejected (script doesn't pass through args), fall back to `npm --prefix frontend run build`.
3. Capture:
   - Exit code (0 = success)
   - Final bundle size for the main initial chunk
   - Any "exceeded maximum budget" warnings or errors from the Angular CLI
   - Any TypeScript compilation errors

## Output

```
Build: SUCCESS | FAILED
Initial bundle: <size> kB
Budget: within | exceeded by <size>
Errors:
  - <file:line>  <message>
```

If `SUCCESS` with no budget issues, just say `Build: SUCCESS, initial bundle <size> kB`.

## Notes

- Never modify `angular.json` budget settings to make the build pass.
- A build that emits but exceeds budgets is still a FAILED status for the pipeline — the user needs to see the budget violation.
