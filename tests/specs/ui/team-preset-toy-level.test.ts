import { describe, expect, it, vi } from 'vitest';
import { loadTeamPreset } from 'app/ui/shell/state/app.component.teams';

type LoadTeamPresetOptions = Parameters<typeof loadTeamPreset>[0];

class MockControl {
  value: unknown;

  constructor(value: unknown) {
    this.value = value;
  }

  setValue(value: unknown): void {
    this.value = value;
  }
}

class MockFormArray {
  controls: Array<{ get: (name: string) => MockControl | null }> = [];

  get length(): number {
    return this.controls.length;
  }

  at(index: number): { get: (name: string) => MockControl | null } {
    return this.controls[index];
  }
}

class MockFormGroup {
  private readonly controls: Record<string, unknown>;

  constructor(controls: Record<string, unknown>) {
    this.controls = controls;
  }

  get(name: string): unknown {
    return this.controls[name] ?? null;
  }
}

function makeLoadFormGroup(): MockFormGroup {
  return new MockFormGroup({
    tokenPets: new MockControl(false),
    playerToy: new MockControl(null),
    playerToyLevel: new MockControl(1),
    opponentToy: new MockControl(null),
    opponentToyLevel: new MockControl(1),
    playerHardToy: new MockControl(null),
    playerHardToyLevel: new MockControl(1),
    opponentHardToy: new MockControl(null),
    opponentHardToyLevel: new MockControl(1),
    playerPets: new MockFormArray(),
    opponentPets: new MockFormArray(),
  });
}

describe('team preset toy level resolution', () => {
  it('keeps toy level aligned with the fallback toy name source', () => {
    const formGroup = makeLoadFormGroup();
    const player = { setPet: vi.fn() };
    const opponent = { setPet: vi.fn() };
    const petService = { createPet: vi.fn() };
    const equipmentService = {
      getInstanceOfAllEquipment: vi.fn(() => new Map()),
      getInstanceOfAllAilments: vi.fn(() => new Map()),
    };

    loadTeamPreset({
      side: 'opponent',
      selectedTeamId: 'team-1',
      savedTeams: [
        {
          id: 'team-1',
          name: 'Sample',
          createdAt: 1,
          pets: [],
          playerToyName: 'Nutcracker',
          playerToyLevel: 3,
          opponentToyName: null,
          opponentToyLevel: 1,
        },
      ],
      formGroup: formGroup as unknown as LoadTeamPresetOptions['formGroup'],
      player: player as unknown as LoadTeamPresetOptions['player'],
      opponent: opponent as unknown as LoadTeamPresetOptions['opponent'],
      petService: petService as unknown as LoadTeamPresetOptions['petService'],
      equipmentService:
        equipmentService as unknown as LoadTeamPresetOptions['equipmentService'],
      initPetForms: vi.fn(),
    });

    expect((formGroup.get('opponentToy') as MockControl).value).toBe(
      'Nutcracker',
    );
    expect((formGroup.get('opponentToyLevel') as MockControl).value).toBe(3);
  });

  it('normalizes string toy levels when resolving fallback toys', () => {
    const formGroup = makeLoadFormGroup();
    const player = { setPet: vi.fn() };
    const opponent = { setPet: vi.fn() };
    const petService = { createPet: vi.fn() };
    const equipmentService = {
      getInstanceOfAllEquipment: vi.fn(() => new Map()),
      getInstanceOfAllAilments: vi.fn(() => new Map()),
    };

    loadTeamPreset({
      side: 'opponent',
      selectedTeamId: 'team-2',
      savedTeams: [
        {
          id: 'team-2',
          name: 'Sample String Level',
          createdAt: 1,
          pets: [],
          playerToyName: 'Nutcracker',
          playerToyLevel: '3' as unknown as number,
          opponentToyName: null,
          opponentToyLevel: 1,
        },
      ],
      formGroup: formGroup as unknown as LoadTeamPresetOptions['formGroup'],
      player: player as unknown as LoadTeamPresetOptions['player'],
      opponent: opponent as unknown as LoadTeamPresetOptions['opponent'],
      petService: petService as unknown as LoadTeamPresetOptions['petService'],
      equipmentService:
        equipmentService as unknown as LoadTeamPresetOptions['equipmentService'],
      initPetForms: vi.fn(),
    });

    expect((formGroup.get('opponentToy') as MockControl).value).toBe(
      'Nutcracker',
    );
    expect((formGroup.get('opponentToyLevel') as MockControl).value).toBe(3);
  });
});
