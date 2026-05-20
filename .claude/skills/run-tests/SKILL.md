---
name: run-tests
description: Run the Angular frontend unit test suite once (no watch mode) and report pass/fail counts. Use when the user asks to run tests, check test status, or validate test coverage for the Angular app.
---

# Run Angular tests

Run the frontend unit tests in single-run mode and report results.

## Steps

1. Confirm `frontend/package.json` has a `test` script. If not, stop and tell the user.
2. Run from the repo root:
   ```
   npm --prefix frontend test -- --watch=false
   ```
   If the project uses Jest (look for `test:jest` in `package.json`), prefer:
   ```
   npm --prefix frontend run test:jest
   ```
3. Capture the output. Extract:
   - Total tests run
   - Passed / failed counts
   - Coverage percentage if reported
   - For each failing test: the test name and the file it lives in

## Output

Report in this format:

```
Tests: <passed>/<total> passed
Coverage: <percent>%   (omit line if not reported)
Failures:
  - <test name>  (<file:line>)
```

If everything passes, just say `Tests: <total>/<total> passed` and nothing else.

## Notes

- Never modify test files to make them pass.
- If `node_modules` is missing, tell the user to run `npm install` from `frontend/` — do not run it yourself.
- Treat any non-zero exit code as failure even if the output looks green.
