# Battle engine dependency

The calculator consumes [sap-battle-engine](https://github.com/lgtyqz/sap-battle-engine) directly from Git. `package.json` uses a GitHub dependency pinned to a full commit SHA, and `package-lock.json` records the same resolved commit for reproducible installs.

The engine repository provides an npm `prepare` script, so npm builds its ESM, CommonJS, browser, and TypeScript declaration outputs during a Git install. No local archive or compatibility patch is required. The public `BattleEngine` API includes `projectLineupAfterEndTurn`, which supports the calculator's end-turn positioning option.

## Updating the dependency

`.github/workflows/update-sap-battle-engine.yml` checks the engine's `main`
branch daily and can also be run manually. When a new commit exists, it pins the
full SHA in both package files, runs the Vitest suite and production build, and
pushes a `github-actions[bot]` commit to this repository's default branch.

For a manual update:

1. Make mechanics or catalog changes in the engine repository and verify its package tests.
2. Replace the commit after `#` in the `sap-battle-engine` dependency in `package.json`.
3. Run `npm install --legacy-peer-deps` to install the Git package and update `package-lock.json`.
4. Keep `src/app/integrations/equipment/equipment-editor-defaults.json` aligned with any relevant catalog changes.
5. Run `npm run test:vitest`, `npm run lint`, and `npm run build`.

## Ownership and interfaces

- The dependency owns combat, randomness, abilities, factories, registries, and canonical pets/toys/food/perks metadata.
- Editor models hold selections and form values only. Equipment editor metadata contains names, tiers, and uses for controls, with no callbacks or combat logic.
- `CalculatorBattleEngine` converts structured events into calculator presentation logs, preserving snapshots, final boards, and random tapes. Its formatter does not alter the editor's logger or game state.
- Browser workers send serializable results directly; there is no Angular battle injector or global simulation session.
- The interactive positioning solver calls the dependency's `optimizeFight` API in a browser worker and presents its full sampled response trace. Replay positioning images retain their specialized one-sided evaluation workflow.
- Existing strength and Out Finder workflows use the dependency for battle batches. `optimizeFight` is also exported by the calculator's headless entry point.
- `runSimulation` from the calculator headless entry point retains presentation logs for existing consumers. `runHeadlessSimulation` returns the dependency's structured events when logs and battles are requested.
- The generated CLI/library bundles keep `sap-battle-engine` external; install dependencies before using them.

The engine preserves its documented upstream randomness behavior: use random draw capture/replay for exact reproduction across both seeded and shuffle streams.
