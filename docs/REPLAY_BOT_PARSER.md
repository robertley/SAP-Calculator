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

## Notes

- Abomination support is handled on calc side through copied-ability owner inference.
- If Teamwood ability IDs shift, pass a fallback `abilityPetMap` override in `options`.
- For link generation, pass the returned state into `ReplayCalcParser.generateCalculatorLink(...)` in browser context.
