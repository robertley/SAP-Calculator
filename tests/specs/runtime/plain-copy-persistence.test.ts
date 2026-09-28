import { FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { buildSimulationConfigFromForm } from 'app/runtime/state/simulation-form-mapper';
import {
  buildExportPayload,
  parseImportPayload,
} from 'app/ui/shell/state/app.component.share';

describe('plain-copy form persistence', () => {
  it('keeps the per-pet plain-copy flag in normalized simulation inputs', () => {
    const values: Record<string, unknown> = {
      playerPack: 'Turtle',
      opponentPack: 'Turtle',
      turn: 1,
      playerPets: [{ name: 'Ant', attack: 2, health: 1, plainCopy: true }],
      opponentPets: [],
      customPacks: [],
    };
    const formGroup = {
      get: (controlName: string) => ({ value: values[controlName] }),
    } as unknown as FormGroup;

    const config = buildSimulationConfigFromForm(formGroup, 1, {
      maxLoggedBattles: 1,
    });

    expect(config.playerPets[0]?.plainCopy).toBe(true);
  });

  it('round-trips both the global control and per-pet flag in export codes', () => {
    const formGroup = {
      value: {
        plainCopies: true,
        playerPets: [{ name: 'Ant', plainCopy: true }],
        opponentPets: [],
      },
    } as unknown as FormGroup;

    const exported = buildExportPayload(formGroup);
    const imported = parseImportPayload(exported) as {
      plainCopies?: boolean;
      playerPets?: Array<{ plainCopy?: boolean }>;
    };

    expect(imported.plainCopies).toBe(true);
    expect(imported.playerPets?.[0]?.plainCopy).toBe(true);
  });
});
