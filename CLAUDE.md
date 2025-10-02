# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Super Auto Pets battle calculator built with Angular 12. The application simulates battles between two teams of pets with various equipment and abilities, allowing players to calculate win rates and analyze battle outcomes.

## Key Commands

### Development
- `npm start` - Start development server on http://localhost:4200/
- `npm run build` - Build for production (output: `dist/sap-calculator/`)
- `npm run watch` - Build in watch mode for development
- `npm test` - Run unit tests with Karma/Jasmine
- `ng generate component component-name` - Generate new Angular component

### Node.js Compatibility Note
This Angular 12 project requires the `--openssl-legacy-provider` flag for Node.js 17+ compatibility (already configured in package.json scripts). For long-term compatibility, consider upgrading to Angular 15+.

## Architecture Overview

The application follows Angular's component-service architecture with a complex game simulation engine.

### Core Classes

#### Player (`src/app/classes/player.class.ts`)
- Manages a team of 5 pets (pet0-pet4)
- Handles pet positioning, summoning, and battle mechanics
- Tracks toy items, trumpets, and battle state flags
- Methods: `alive()`, `resetPets()`, `setPet()`, `summonPet()`, `getRandomPets()`

#### Pet (`src/app/classes/pet.class.ts`)
- Individual pet entities with attack, health, abilities, and equipment
- Properties: name, tier, pack, health, attack, exp, equipment, mana
- Pet memories: swallowedPets, abominationSwallowedPet, etc.
- Methods: `givePetEquipment()`, `snipePet()`, `executeAbilities()`, `abilityValidCheck()`

#### Equipment & Toys
- **Equipment** (`src/app/classes/equipment.class.ts`) - Items that pets equip for various effects
- **Toy** (`src/app/classes/toy.class.ts`) - Player-level items affecting the entire team

### Services

- **GameService** (`src/app/services/game.service.ts`) - Central game state management, maintains GameAPI
- **AbilityService** (`src/app/services/ability.service.ts`) - Handles ability execution, event queuing, and priority-based resolution
- **PetService** (`src/app/services/pet.service.ts`) - Pet creation, pack management, pet pools by tier
- **LogService** (`src/app/services/log.service.ts`) - Battle logging and debugging
- **LocalStorageService** (`src/app/services/local-storage.service.ts`) - Saves/loads calculator state
- **EquipmentService** (`src/app/services/equipment.service.ts`) - Equipment management
- **ToyService** (`src/app/services/toy.service.ts`) - Toy management
- **InjectorService** (`src/app/services/injector.service.ts`) - Angular DI helper for dynamic class instantiation

### Directory Structure

#### Pets by Pack & Tier
Pets are organized in: `src/app/classes/pets/[pack]/tier-[1-6]/`

Packs:
- `turtle/` - Base game pack
- `puppy/` - Puppy pack expansion
- `star/` - Star pack expansion
- `golden/` - Golden pack expansion
- `unicorn/` - Unicorn pack expansion
- `danger/` - Danger pack expansion
- `custom/` - Custom pack pets
- `hidden/` - Special hidden pets (Bee, Golden Retriever, Nest, etc.)

#### Equipment & Toys
- `src/app/classes/equipment/[pack]/` - Equipment organized by pack type
- `src/app/classes/equipment/ailments/` - Negative status effects (Dazed, Silly, Icky, Crisp, Toasty, Weak)
- `src/app/classes/toys/` - Player-level toy items

#### Abilities (New Framework)
- `src/app/classes/abilities/pets/[pack]/tier-[1-6]/` - Pet-specific abilities extending Ability class
- `src/app/classes/abilities/equipment/[pack]/` - Equipment abilities
- `src/app/classes/abilities/toys/` - Toy abilities

### Components

- **AppComponent** (`src/app/app.component.ts`) - Main calculator with battle simulation in `runSimulation()`
- **PetSelectorComponent** (`src/app/components/pet-selector/`) - Pet selection and configuration UI
- **CustomPackEditorComponent** (`src/app/components/custom-pack-editor/`) - Create custom pet packs
- Modal components: `import-calculator/`, `export-calculator/`, `patch-notes/`, `report-a-bug/`, `info/`

### Key Interfaces

- **GameAPI** (`src/app/interfaces/gameAPI.interface.ts`) - Core game state object passed to all abilities
  - Contains: player, opponent, turnNumber, goldSpent, petPools, game modifiers (day/night, mana, etc.)
- **AbilityEvent** (`src/app/interfaces/ability-event.interface.ts`) - Event queue structure for AbilityService
  - Contains: priority, callback, player, pet, triggerPet, abilityType, customParams
- **Battle** (`src/app/interfaces/battle.interface.ts`) - Battle result structure
- **Log** (`src/app/interfaces/log.interface.ts`) - Log entry structure

### Utility Functions (`src/app/util/helper-functions.ts`)

- `getRandomInt(min, max)` - Random number generation (used throughout battle simulation)
- `getOpponent(gameApi, player)` - Get opponent player from GameAPI
- `createPack(customPack)` - Create FormGroup for custom packs
- `money_round(num)` - Rounding function for gold calculations

## Ability System (New Framework)

The ability system uses a flexible `Ability` class with `AbilityContext` objects.

### Ability Class Structure

**Base class**: `src/app/classes/ability.class.ts`

Key components:
- **AbilityTrigger** - 150+ trigger types (ThisHurt, FriendDied, StartBattle, etc.)
- **AbilityContext** - Parameter object containing gameApi, triggerPet, tiger, pteranodon, and custom params
- **Ability class** - Encapsulates triggers, conditions, execution logic, max uses, Tiger synergy

### Creating New Abilities

```typescript
export class MyPetAbility extends Ability {
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MyPetAbility',
            owner: owner,
            triggers: ['ThisHurt', 'FriendDied'],
            abilityType: 'Pet',
            maxUses: owner.level,
            condition: (context: AbilityContext) => {
                return this.owner.alive; // Optional validation
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger } = context;
        // Ability logic here

        // IMPORTANT: Always call at the end for Tiger synergy support
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MyPetAbility {
        return new MyPetAbility(newOwner, this.logService);
    }
}
```

### Key Ability Concepts

- **Triggers** - Extensive list of 150+ trigger types (see `AbilityTrigger` type)
- **Conditions** - Optional validation before execution
- **Max Uses** - Limit executions per battle (e.g., level-based)
- **Tiger Synergy** - Abilities auto-repeat with Tiger's level via `triggerTigerExecution()`
- **Priority System** - AbilityService executes by priority: level-up → hurt → faint → summon
- **Custom Parameters** - Pass additional data via context spread operator

See `ABILITY_CONTEXT_USAGE.md` for detailed migration guide.

## Battle Simulation Flow

The core simulation runs in `AppComponent.runSimulation()`:

1. **Initialization** - Clone pets with `cloneDeep()`, reset state, set up GameAPI with player/opponent references
2. **Start of Battle** - Execute start-of-battle abilities via `AbilityService` event queuing
3. **Turn Loop** - Pets attack in order, abilities trigger on hurt/faint/attack events
4. **Ability Cycles** - `AbilityService` processes events by priority (level-up → hurt → faint → summon)
5. **Battle Resolution** - Determine winner when one team eliminated or max turns (99) reached
6. **Statistics** - Aggregate win/loss/draw counts across multiple simulations (default 1000 battles)

## Common Patterns

- **Random number generation**: Use `getRandomInt()` from helper-functions.ts
- **Battle logging**: Use `LogService.createLog()` with type ('ability', 'attack', 'faint', etc.)
- **Deep cloning**: Use lodash `cloneDeep()` for pet/equipment state management (critical for simulation)
- **Form management**: Angular Reactive Forms with complex nested FormArrays
- **Import/Export**: Uses compressed key mapping (see REVERSE_KEY_MAP in app.component.ts:43-54)

## Technology Stack

- **Framework**: Angular 12 with TypeScript 4.3.5
- **UI Libraries**: Angular Material (indigo-pink theme), Bootstrap 5
- **Utilities**: Lodash (cloneDeep, shuffle, sum, etc.)
- **Drag & Drop**: Angular CDK drag-drop
- **Testing**: Karma + Jasmine
- **Styling**: SCSS
- **TypeScript**: Strict mode disabled (`"strict": false`)
