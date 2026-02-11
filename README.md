# SAP Calculator

Battle calculator for Super Auto Pets with support for official packs, custom packs, toys, replay import, detailed logs, and headless simulation.

## Requirements
- Node.js `>=20`
- npm

## Setup
```bash
npm install --legacy-peer-deps
```

## Run Locally
```bash
npm start
```
This starts Angular dev server with the local `/api` proxy from `config/proxy.conf.json`.

Open `http://localhost:4200`.

## Build
```bash
npm run build
```

## Architecture
The codebase is organized into explicit layers under `src/app`:

- `src/app/domain`
  - Core entities and interfaces (`Pet`, `Equipment`, `Toy`, `Player`, ability model, simulation interfaces).
  - Catalog implementation classes in `src/app/domain/entities/catalog/**` for pets/equipment/toys.
- `src/app/gameplay`
  - Pure battle execution pipeline (`SimulationRunner`, `EventProcessor`, `AbilityEngine`, randomness controls).
- `src/app/integrations`
  - Registries, factories, and orchestration services that wire content into runtime.
  - Includes `ability`, `pet`, `equipment`, `toy`, `simulation`, `replay`, and logging integrations.
- `src/app/runtime`
  - App/runtime utilities and persisted state services (`game`, URL state, local storage, calculator state).
- `src/app/ui`
  - Standalone Angular UI shell and feature components.
  - Main shell is `src/app/ui/shell/app.component.ts`, composed from small workflow/view modules.

At repo root:
- `simulation/`: Node/headless entrypoints and CLI bundle.
- `server/`: Optional replay proxy backend (`/api/health`, `/api/replay-battle`).
- `tests/`: Vitest specs, meta checks, generated coverage, and pilot suites.

## Simulation Flow
1. `SimulationService` builds `SimulationConfig` from UI state.
2. It runs via `simulation.worker.ts` (preferred) or directly in-process.
3. `SimulationRunner` initializes player state and content through services.
4. `EventProcessor` + `AbilityEngine` resolve combat events and triggers.
5. `LogService` captures battle logs (optional, configurable).

Positioning optimization is implemented in `src/app/integrations/simulation/positioning-optimizer.ts` and can also run in the worker.

## Content Wiring (Pets/Equipment/Toys)
Content classes live in `src/app/domain/entities/catalog/**` and must be registered to become usable:

- Pets: pack registries in `src/app/integrations/pet/registries/`, aggregated by `src/app/integrations/pet/pet-registry.ts`
- Equipment/Ailments: `src/app/integrations/equipment/equipment-registry.ts`
- Toys: `src/app/integrations/toy/toy-registry.ts`

Data files used by UI/selectors live in `src/assets/data` (`pets.json`, `food.json`, `toys.json`, etc.).

## Testing
Primary test runner is Vitest.

```bash
npm run test:vitest
```

Useful subsets:
```bash
npm run test:vitest:meta
npm run test:vitest:specs
npm run test:vitest:specs:pilot
```

Generated coverage utilities:
```bash
npm run generate:entity-tests
npm run test:vitest:generated
```

Legacy Angular/Karma tests are still available:
```bash
npm test
```

## Headless Simulation (Library + CLI)
Build/update Node simulation bundle:
```bash
npm run bundle-simulation
```

Library usage:
```js
const { runHeadlessSimulation } = require('sap-calculator/simulation/dist/index.js');

const result = runHeadlessSimulation(config, {
  enableLogs: false,
  includeBattles: false,
});
```

CLI usage:
```bash
sap-calculator-sim battle.json
cat battle.json | sap-calculator-sim --stdin --pretty
```

CLI flags:
- `--include-battles`
- `--logs`
- `--pretty`
- `--input <path>`

## Replay Backend (Optional)
`server/index.js` provides replay proxy endpoints:
- `GET /api/health`
- `POST /api/replay-battle`

Deployment guide: `docs/DEPLOY_REPLAY.md`.

## Contributing
1. Keep changes scoped and aligned with layer boundaries above.
2. Run targeted Vitest suites for touched areas.
3. For new content entities, update catalog class + registry + data and regenerate/verify tests as needed.
