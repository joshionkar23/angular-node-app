---
name: lint-check
description: Run lint and TypeScript checks on the Angular frontend and report errors and warnings. Use when the user asks to lint, check code style, or find anti-patterns.
---

# Lint check

Run static analysis on the Angular frontend.

## Steps

1. Check `frontend/package.json` for a `lint` script.
   - If present: `npm --prefix frontend run lint`
   - If absent: fall back to a TypeScript-only check: `npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json` and note that no ESLint config is configured.
2. Capture errors and warnings separately. For each issue, capture:
   - File path and line number
   - Rule name (if available)
   - Short message

## Output

```
Lint: <errors> errors, <warnings> warnings
Errors:
  - <file:line>  <rule>  <message>
Warnings:
  - <file:line>  <rule>  <message>
```

If clean, just say `Lint: 0 errors, 0 warnings`.

## Notes

- Do not auto-fix. The user runs this to *see* problems — fixing without asking destroys the signal.
- If neither a lint script nor `tsconfig.json` exists, stop and report that no static analysis is configured.
