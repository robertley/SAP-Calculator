# SAP Calculator

Battle calculator for Super Auto Pets with support for official packs, custom packs, toys, replay import, detailed logs, and headless simulation.

## Requirements
- Node.js 22.12+ (recommended for the Angular 21 toolchain)
- npm

## Setup
```bash
npm install --legacy-peer-deps
cp .env.example .env
```

## Run Locally
```bash
npm start
```
This starts Angular dev server with the `/api` proxy from `config/proxy.conf.js`, reading `REPLAY_API_TARGET` from `.env`.

By default, replay requests are proxied to `https://sap-library.vercel.app`. Set `REPLAY_API_TARGET=http://127.0.0.1:3000` if you want to use a local replay backend.

Open `http://localhost:4200`.

## Build
```bash
npm run build
```

## Architecture
Battle mechanics and canonical content metadata come from [sap-battle-engine](https://github.com/lgtyqz/sap-battle-engine). The calculator contains the Angular editor, replay parsing, analysis workflows, and presentation.

- `src/app/domain`: lightweight board-editor models and interfaces.
- `src/app/integrations/simulation/battle-engine.ts`: adapts the engine's structured events for calculator logs and animation.
- `src/app/integrations`: editor catalogs, replay services, positioning/strength analysis, and log formatting.
- `src/app/runtime`: form mapping, asset presentation, persistence, and URL state.
- `src/app/ui`: Angular shell and feature components.
- `simulation/`: headless library and CLI; the engine stays an external dependency of these bundles.

See [the engine dependency guide](docs/BATTLE_ENGINE.md) for package provenance and updates.

## Typography Rollout (Lapsus Pro)
Lapsus typography is controlled in stages from `src/app/ui/shell/app.component.ts` via `lapsusTypographyStage`.

- Stage 1: item selection dialog (`app-item-selection-dialog`) uses Lapsus Pro.
- Stage 2: reserved for additional surfaces after visual/accessibility checks.
- Stage 3: reserved for full UI adoption when rollout is complete.

To advance rollout, change `lapsusTypographyStage` from `1` to `2` or `3` and apply style rules by stage-specific class (`lapsus-stage-1`, `lapsus-stage-2`, `lapsus-stage-3`).

## Simulation Flow
1. `SimulationService` builds a `SimulationConfig` from UI state.
2. The worker (or synchronous fallback) uses an isolated `sap-battle-engine` instance.
3. The engine resolves battles and returns structured events, board snapshots, outcomes, and optional random decisions/draws.
4. The calculator formats events for its existing log and animation views.

Positioning, Out Finder, and board-strength workflows remain in `src/app/integrations/simulation` and delegate every battle to the dependency.

## Content Updates
Change mechanics and canonical pets, toys, food, and perks in the battle-engine repository, then update the pinned Git revision here and keep editor equipment metadata aligned with the engine catalogs. Asset files and UI-specific categories remain in this repository.

## Testing
Primary test runner is Vitest.

```bash
npm run test:vitest
```

Useful subsets:
```bash
npm run test:vitest:meta
npm run test:vitest:specs
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

Additional CLI commands:
- `sap-calculator-sim preset-pool --pretty`
- `sap-calculator-sim evaluate --stdin`
- `sap-calculator-sim evaluate-batch --stdin`

See `docs/EVOLUTIONARY_SEARCH.md` for the PyTorch + Ray evolutionary runner that uses these built-in commands.

## Replay Backend (Optional)
`server/index.js` provides replay proxy endpoints:
- `GET /api/health`
- `GET /api/replays/:id/turns`
- `POST /api/replay-battle`

Deployment guide: `docs/DEPLOY_REPLAY.md`.
ReplayBot parser integration guide: `docs/REPLAY_BOT_PARSER.md`.

Replay JSON generation for in-game playback: `docs/REPLAY_JSON_GENERATOR.md` (`python .\\scripts\\make-team.py`).
Local replay injection scripts: `scripts/mitmproxy-plugin.py`, `scripts/start-proxy.ps1`, `scripts/start-proxy.sh`.

## Contributing
1. Keep changes scoped and aligned with layer boundaries above.
2. Run targeted Vitest suites for touched areas.
3. For new content entities, update catalog class + registry + data and regenerate/verify tests as needed.
