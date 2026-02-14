# Evolutionary Team Search (PyTorch + Ray)

This workflow optimizes **final boards** (not shop/draft trajectories) using the built-in simulation CLI as the ground-truth oracle.

## Overview

- Oracle: `sap-calculator-sim evaluate-batch`
- Search: evolutionary algorithm (mutation + crossover + elite selection)
- Parallelism: Ray workers evaluate candidate batches
- Surrogate: PyTorch MLP ranks offspring before expensive simulator calls

## 1) Build the simulation CLI

```bash
npm run bundle-simulation
```

## 2) Install Python dependencies

Recommended Python version: `3.11`.

Create and use a local Python 3.11 environment on Windows:

```bash
py -3.11 -m venv .venv311
.venv311\Scripts\python.exe -m pip install --upgrade pip
```

```bash
.venv311\Scripts\python.exe -m pip install -r scripts/evolution/requirements.txt
```

Note: on Python 3.13, `ray` may be unavailable on Windows. The runner automatically falls back to a local thread pool and still works.

## 3) Inspect default preset pool (seed + opponent set)

```bash
node simulation/dist/cli.js preset-pool --pretty
```

## 4) Run evolutionary search

```bash
.venv311\Scripts\python.exe scripts/evolution/ray_pytorch_evolution.py \
  --generations 20 \
  --population 64 \
  --offspring 160 \
  --elite 16 \
  --opponents 20 \
  --simulations 60 \
  --output tmp/evolution-ray-pytorch-report.json
```

### Fast prototype mode (recommended for iteration)

```bash
.venv311\Scripts\python.exe scripts/evolution/ray_pytorch_evolution.py \
  --prototype \
  --focus-presets "Orca Scam,Infinite Damage" \
  --focus-share 0.75 \
  --simulations 24 \
  --simulations-min 8 \
  --output tmp/evolution-prototype.json
```

Prototype mode reduces generation/population/training budgets and supports progressive simulation ramping (`--simulations-min` → `--simulations`) for faster feedback loops.

The script prints per-generation progress and writes a final JSON report with:

- `bestFitness`
- `bestTeam`
- `generationReports`
- full run settings

## CLI payloads

### `evaluate`

`node simulation/dist/cli.js evaluate --stdin`

Input schema:

```json
{
  "candidate": { "pets": [null, null, null, null, null] },
  "opponents": [{ "pets": [null, null, null, null, null] }],
  "simulationsPerMatchup": 100,
  "baseConfig": { "mana": true, "allPets": true, "tokenPets": true },
  "seed": 1337,
  "variancePenalty": 0.1,
  "includeMatchups": false
}
```

### `evaluate-batch`

`node simulation/dist/cli.js evaluate-batch --stdin`

Input schema:

```json
{
  "candidates": [{ "pets": [null, null, null, null, null] }],
  "opponents": [{ "pets": [null, null, null, null, null] }],
  "simulationsPerMatchup": 100,
  "baseConfig": { "mana": true, "allPets": true, "tokenPets": true },
  "seed": 1337,
  "variancePenalty": 0.1,
  "includeMatchups": false
}
```

Output per candidate includes:

- `fitness = weightedWinRate - variancePenalty * stdDev`
- `meanWinRate`
- `weightedWinRate`
- `stdDev`
- `confidence95`

## Notes

- This is intentionally a **final-board optimizer**.
- `Sloths` preset is excluded from both warm-start seeds and opponent pool.
- Opponent/warm-start targeting is configurable with:
  - `--focus-presets "Orca Scam,Infinite Damage"`
  - `--focus-share 0.0..1.0` (how much of opponent pool is filled by focus presets)
- Side-level advanced fields use fixed high values for every candidate: `goldSpent`, `rollAmount`, `summonedAmount`, `level3Sold`, and `transformationAmount` are forced to `1000`, while `turn` mutates between `1000` and `1001`.
- Mana is an explicit mutation dimension and is always clamped to `[0, 50]`.
- Abomination legality is enforced in generation and normalization:
  - Swallowed levels are normalized to `{1, 3}`.
  - It may exceed `50/50` only when **any** swallowed slot includes `Behemoth`; otherwise it is clamped to `50/50` max.
- Mutation pools use full catalogs from `src/assets/data`:
  - toys mutate to **regular toys only** (`ToyType = 0`), never hard/wacky toys.
  - swallowed pets can mutate to any pet.
  - equipment can mutate to any equipment entry (excluding Present-family entries).
- Ray is installed/used on Python versions where wheels are available; otherwise the script falls back to local threaded evaluation automatically.
- If you want buildability constraints (shop economy, roll/freeze actions), model that as a full environment and switch to MCTS/RL over draft actions.
- Increase `--simulations` during final validation rounds to reduce noise.
