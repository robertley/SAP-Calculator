# SAP Calculator

SAP battle calculator with support for multiple packs, custom packs, toys, replays, and detailed battle logs.

## Requirements
- Node.js (LTS recommended)
- npm

## Install
```bash
npm install --legacy-peer-deps
```

## Development
```bash
ng serve
```
Open `http://localhost:4200/`.

## Build
```bash
ng build
```

## Tests
```bash
npx vitest run <file_path>
```
Legacy:
```bash
ng test
```

## Common Features
- Import / Replay: Paste calculator JSON or replay JSON and load a battle.
- Export: Copy a clean, shareable calculator state to the clipboard.
- Share Link: Generate a URL for the current state.
- Custom Packs: Create, import, and export custom packs.

## Scripts
See `package.json` for available scripts.

## Architecture
High-level layout:
- `src/app/classes`: Core domain models for pets, equipment, abilities, toys, and battle state.
- `src/app/services`: Registries, data loaders, simulation helpers, and shared utilities.
- `src/app/engine`: Battle engine, event processor, and ability execution pipeline.
- `src/app/components`: UI components (calculator, import/export, custom packs, logs).
- `src/assets/data`: Source data (pets, toys, etc.).

Battle flow (simplified):
1. `SimulationRunner` sets up players, pets, and toys.
2. `EventProcessor` drives turn flow and attacks.
3. `AbilityService` + `AbilityQueueService` enqueue and execute triggers.
4. `LogService` decorates and aggregates battle logs for UI display.

### Ability Triggers
Ability triggers are defined in `src/app/classes/ability.class.ts` and used by pets/equipment/toys.
They are dispatched by services in `src/app/services/ability/` and executed through the global
ability queue.

Common trigger paths:
- Start of battle: `triggerBeforeStartOfBattleEvents()` and `triggerStartBattleEvents()`
- Before/after attack: `triggerBeforeAttackEvents()` and `triggerAfterAttackEvents()`
- Faint/death: `triggerFaintEvents()` and `triggerAfterFaintEvents()`
- Other events: food, perk, ailment, jump, transform, kill, etc.

Notes:
- Priority is resolved by `ABILITY_PRIORITIES` in `src/app/services/ability/ability-priorities.ts`.
- Many triggers have numbered variants (e.g., `FriendDied2`) handled via the queue service.
- If you add a new trigger, update `AbilityTrigger` types and the relevant dispatcher.

### Registries
Registries map names to classes and live under `src/app/services/*/registry`.
They are used by `PetService`, `EquipmentService`, and `ToyService` to instantiate objects.

Common registry paths:
- Pets: `src/app/services/pet/registry/`
- Equipment/Ailments: `src/app/services/equipment/`
- Toys: `src/app/services/toy/registry/`

When adding new content:
1. Create the class under `src/app/classes/...`.
2. Add the data entry under `src/assets/data/`.
3. Register the class in the appropriate registry map.
4. Ensure any new triggers or events are dispatched.

### Adding a New Pet (Example)
This is a minimal path for adding a pet with a simple ability.

1. Create the class
   - Example path: `src/app/classes/pets/danger/tier-1/my-new-pet.class.ts`
   - Include a `Pet` class and an `Ability` class.

2. Register it
   - Add the import and map entry in the registry:
     `src/app/services/pet/registry/pet-registry.danger.ts`

3. Add data
   - Add an entry in `src/assets/data/pets.json` with `Name`, `NameId`, `Tier`, etc.

4. Verify triggers
   - If you introduce a new trigger, add it to `AbilityTrigger` in
     `src/app/classes/ability.class.ts` and dispatch it in the appropriate service.

Minimal example (ability triggers at start of battle):
```ts
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';

export class MyNewPet extends Pet {
  name = 'My New Pet';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 3;

  initAbilities(): void {
    this.addAbility(new MyNewPetAbility(this, this.logService));
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}

export class MyNewPetAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MyNewPetAbility',
      owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const targetResp = owner.parent.getThis(owner);
    const target = targetResp.pet;
    if (!target) {
      return;
    }

    target.increaseAttack(1);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +1 attack`,
      type: 'ability',
      player: owner.parent,
      sourcePet: owner,
      targetPet: target,
      randomEvent: targetResp.random,
    });
  }
}
```

## Notes
- The replay importer can call a local `/api/replay-battle` endpoint if configured.
- Large simulations can be slow; consider disabling logs for speed.

## Contributing
1. Create a feature branch.
2. Make changes with focused commits.
3. Run tests as applicable (`npx vitest run <file_path>`).
4. Ensure formatting and lint are clean.
5. Open a PR with a concise summary and screenshots for UI changes.
