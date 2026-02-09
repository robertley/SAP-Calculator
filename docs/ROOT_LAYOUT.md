# Root Layout

This repository keeps the root focused on project entry points and configuration.

## Keep at Root
- Runtime/build entry points: `src/`, `simulation/`, `server/`
- Tooling/config: `package.json`, `angular.json`, `tsconfig.json`, `eslint.config.js`, `vitest.config.ts`, `config/`
- Automation: `.github/`, `scripts/`, `tests/`

## Buckets
- `docs/`: architecture notes, contributor docs, process docs
- `tools/`: developer utilities and one-off maintenance scripts that are not runtime app code
- `tmp/`: local scratch files (already git-ignored)
- `artifacts/`: generated local outputs not meant for source control

## Notes
- Avoid adding ad-hoc loose files at repo root.
- Prefer placing temporary/debug files under `tmp/`.
