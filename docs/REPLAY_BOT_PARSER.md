# ReplayBot Parser Integration

Use this when ReplayBot already has the raw Teamwood replay payload and needs calculator-ready state (including Abomination copied-pet inference).

## What to call

Import and call:

- `parseTeamwoodReplayForCalculator(replay, turnNumber, metaBoards?, options?)`

From:

- `src/app/integrations/replay/replay-calc-parser.ts`

This helper will:

1. Select the turn battle from `replay.Actions`.
2. Build ability-owner mapping from replay actions on calculator side.
3. Merge your optional `options.abilityPetMap` overrides on top.
4. Parse a full `ReplayCalculatorState` using existing calculator logic.

## Expected replay shape

Only these fields are required:

```ts
{
  Actions: Array<{
    Type?: number;      // battle actions use 0
    Turn?: number;
    Battle?: string;    // JSON string containing { UserBoard, OpponentBoard }
    Build?: string;     // optional JSON string
    Mode?: string;      // optional JSON string
  }>;
  GenesisBuildModel?: object; // optional
}
```

Also supported (ReplayBot normalized turns response):

```ts
{
  turns: Array<{
    turn?: number;
    user?: {
      stats?: {
        turn?: number;
        goldSpent?: number;
        rolls?: number;
        summons?: number;
        level3Sold?: number;
        transformed?: number;
      };
      pets?: Array<{
        slot?: number;
        id?: string | number;
        level?: number;
        experience?: number;
        perkId?: string | number;
        attack?: { permanent?: number; temporary?: number };
        health?: { permanent?: number; temporary?: number };
        mana?: number;
        abilities?: Array<{
          id?: string | number;
          level?: number;
          group?: number;
          triggersConsumed?: number;
        }>;
      }>;
    };
    opponent?: { /* same shape as user */ };
  }>;
  genesisBuildModel?: object; // optional
  abilityPetMap?: Record<string, string | number>; // optional
  replayMeta?: {
    pack?: string | number;          // optional
    opponent_pack?: string | number; // optional
  };
}
```

Notes:
- `Actions[]` format and `turns[]` format are both accepted by `parseTeamwoodReplayForCalculator(...)`.
- In `Actions[]`, `Battle`/`Build`/`Mode` can be JSON strings or already-parsed objects.

## ReplayBot example

```ts
import {
  parseTeamwoodReplayForCalculator,
} from 'src/app/integrations/replay/replay-calc-parser';

type TeamwoodReplay = {
  Actions?: Array<{
    Type?: number;
    Turn?: number;
    Battle?: string;
    Build?: string;
    Mode?: string;
  }>;
  GenesisBuildModel?: unknown;
};

export function parseReplaybotTeamwoodResponse(
  replay: TeamwoodReplay,
  turnNumber: number,
) {
  const calculatorState = parseTeamwoodReplayForCalculator(
    replay,
    turnNumber,
    undefined,
    {
      // Optional manual overrides if your bot knows extra mappings.
      // Keys are ability IDs; values are pet IDs or pet names.
      abilityPetMap: null,
    },
  );

  if (!calculatorState) {
    throw new Error(`No battle found for turn ${turnNumber}.`);
  }

  return calculatorState;
}
```

## Return value

- Returns `ReplayCalculatorState` on success.
- Returns `null` if no valid battle is found for that turn.

## Calculator-side API endpoints

If your bot should call calculator-side parsing directly, use:

### `POST /api/replay/parse-link`

Parses replay + turn with calculator logic and returns a final calculator URL.

Request body:

```json
{
  "replay": {
    "Actions": []
  },
  "turnNumber": 12,
  "abilityPetMap": {
    "379": "349"
  },
  "baseUrl": "https://sap-calculator.com/"
}
```

Response:

```json
{
  "turnNumber": 12,
  "link": "https://sap-calculator.com/?c=...",
  "calculatorState": {
    "playerPack": "Custom Pack",
    "opponentPack": "Turtle"
  }
}
```

Notes:
- `replay` can be omitted if the top-level payload itself is an `Actions[]` or `turns[]` container.
- Accepted turn keys: `turnNumber`, `turn`, or `T`.
- `abilityPetMap` is optional and merged as parser override input.

### `POST /api/replay/odds`

Parses replay + turn using the same pipeline, then runs calculator simulation odds.

Request body:

```json
{
  "replay": {
    "Actions": []
  },
  "turnNumber": 12,
  "simulationCount": 1000
}
```

Response:

```json
{
  "turnNumber": 12,
  "simulationCount": 1000,
  "parsedState": {
    "playerPack": "Custom Pack",
    "opponentPack": "Turtle"
  },
  "odds": {
    "playerWins": 617,
    "opponentWins": 335,
    "draws": 48,
    "totalBattles": 1000,
    "playerWinPercent": 61.7,
    "opponentWinPercent": 33.5,
    "drawPercent": 4.8
  }
}
```

Notes:
- `simulationCount` defaults to `1000` if omitted.
- This endpoint is intended for `!odds` parity with calculator parser behavior.

### `POST /api/replay/positioning`

Optimizes one side's board order and independently simulates the original and
selected lineups. The response is JSON so clients can render their own output.

Request body:

```json
{
  "replay": { "Actions": [] },
  "turnNumber": 8,
  "side": "player",
  "precision": "quick"
}
```

Response fields include:

```json
{
  "turnNumber": 8,
  "side": "player",
  "precision": "quick",
  "optimizedOrder": [2, 0, 1, 3, 4],
  "optimizedLineup": [],
  "simulationLineup": [],
  "baselineOdds": {
    "winPercent": 42,
    "drawPercent": 8,
    "lossPercent": 50,
    "scorePercent": 46
  },
  "optimizedOdds": {
    "winPercent": 55,
    "drawPercent": 7,
    "lossPercent": 38,
    "scorePercent": 58.5
  },
  "scoreDelta": 12.5,
  "simulationsPerformed": {
    "baseline": 100,
    "optimization": 7200,
    "optimized": 100,
    "total": 7400
  },
  "calculatorLink": "https://sap-calculator.com/?c=..."
}
```

Notes:
- `side` defaults to `player` and accepts `player` or `opponent`.
- `precision` defaults to `quick`; `standard` and `high` are also accepted.
- `simulationCount` can override the precision preset.
- `optimizedOrder` contains zero-based indexes into the original lineup.
- End-turn projection and copied Parrot memory are enabled by default. Set
  `projectEndTurnEffects` or `recomputeParrotCopies` to `false` to disable them.

### `POST /api/replay/strength`

Evaluates both replay boards against the BS1 benchmark ladder.

Request body:

```json
{
  "replay": { "Actions": [] },
  "turnNumber": 8,
  "precision": "quick"
}
```

The response includes full `player` and `opponent` `BoardStrengthResult`
objects (scores, 50% benchmarks, confidence estimates, sampled points, battle
counts, and truncation flags), plus convenient summary fields:

```json
{
  "turnNumber": 8,
  "version": "BS1",
  "precision": "quick",
  "player": { "score": 37.2, "benchmark50": 34, "totalBattles": 4200 },
  "opponent": { "score": 41.8, "benchmark50": 39, "totalBattles": 4475 },
  "benchmarks": { "player50": 34, "opponent50": 39 },
  "battleCounts": { "player": 4200, "opponent": 4475, "total": 8675 },
  "truncated": false,
  "warnings": []
}
```

`precision` defaults to `quick` and accepts `quick`, `standard`, or `high`.
When the automatic benchmark range reaches its cap, `truncated` is true and
`warnings` identifies the affected side.

## Notes

- Abomination support is handled on calc side through copied-ability owner inference.
- If Teamwood ability IDs shift, pass a fallback `abilityPetMap` override in `options`.
- For link generation, pass the returned state into `ReplayCalcParser.generateCalculatorLink(...)` in browser context.
