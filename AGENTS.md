# AGENTS.md

This file gives coding agents project context for `SAP-Calculator`.

## Project Overview
- App: Battle calculator for Super Auto Pets.
- Stack: Angular 21 + TypeScript, Vitest for main tests, optional Node replay server, optional headless simulation CLI.
- Node requirement: `>=20`.

## Repo Map
- `src/app/domain`: Core game entities and catalog classes (pets, equipment, toys).
- `src/app/gameplay`: Battle simulation pipeline and event resolution.
- `src/app/integrations`: Registries/factories/services wiring content and runtime.
- `src/app/runtime`: App state, persistence, and runtime utilities.
- `src/app/ui`: Angular shell and feature UI components.
- `tests`: Vitest suites (`specs`, `meta`, `generated`, `pilot`).
- `simulation`: Headless simulation library + CLI bundle.
- `server`: Optional replay API proxy backend.
- `scripts`: Generation/debug/replay/evolution utilities.
- `docs`: Architecture/process references.

## First Commands
- Install: `npm install --legacy-peer-deps`
- Configure env: `copy .env.example .env` (Windows) or `cp .env.example .env`
- Start UI: `npm start`
- Start replay server: `npm run start:server`
- Build: `npm run build`

## Testing Commands
- Full Vitest: `npm run test:vitest`
- Specs only: `npm run test:vitest:specs`
- Meta checks: `npm run test:vitest:meta`
- Pilot specs: `npm run test:vitest:specs:pilot`
- Regenerate entity tests: `npm run generate:entity-tests`
- Generated suite: `npm run test:vitest:generated`
- Legacy Angular/Karma: `npm test`

## Agent Workflow Expectations
- Keep layer boundaries intact (`domain` -> `gameplay` -> `integrations`/`runtime` -> `ui`).
- Keep root clean; place temporary files under `tmp/` (see `docs/ROOT_LAYOUT.md`).
- Prefer focused edits and targeted tests for touched areas.
- Do not use TypeScript `any`; it violates lint rules (`@typescript-eslint/no-explicit-any`).
- Do not edit generated outputs in `dist/` or dependencies in `node_modules/`.

## Source of Truth (Content Data)
- `src/assets/data/*.json` is the canonical content metadata source of truth.
- For pets, `src/assets/data/pets.json` is the source of truth for roster data and ability text (`Abilities` entries by level).
- Any content implementation change in code must keep these JSON files aligned, and any JSON content change must be wired through registries/classes so runtime behavior matches data.

## Content Change Playbook (Pets/Equipment/Toys)
When adding or changing content:
1. Update canonical content metadata in `src/assets/data/*.json` first (especially `pets.json` for pet ability definitions/text).
2. Update/create catalog class under `src/app/domain/entities/catalog/**`.
3. Wire it into the matching registry:
   - Pets: `src/app/integrations/pet/registries/*` + `pet-registry.ts`
   - Equipment: `src/app/integrations/equipment/equipment-registry.ts`
   - Toys: `src/app/integrations/toy/toy-registry.ts`
4. Run targeted Vitest coverage; include generated/meta tests when registry/catalog behavior changes.

## Replay + Simulation Notes
- UI replay calls proxy through `/api` using `config/proxy.conf.js`.
- `REPLAY_API_TARGET` in `.env` controls replay backend target.
- Headless simulation bundle/CLI is built by `npm run bundle-simulation`.
- Replay docs:
  - `docs/DEPLOY_REPLAY.md`
  - `docs/REPLAY_BOT_PARSER.md`
  - `docs/REPLAY_JSON_GENERATOR.md`

## Definition of Done for Agent Changes
- Code compiles for touched areas.
- Relevant tests pass for the scope changed.
- New behavior is wired through registries/data where applicable.
- Notes for any skipped verification are explicitly stated.
