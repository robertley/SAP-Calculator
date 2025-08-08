# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Super Auto Pets battle calculator built with Angular 12. The application simulates battles between two teams of pets with various equipment and abilities, allowing players to calculate win rates and analyze battle outcomes.

## Key Commands

### Development
- `npm start` or `ng serve` - Start development server on http://localhost:4200/
- `ng build` - Build the project for production
- `ng build --watch --configuration development` - Build in watch mode for development
- `ng test` - Run unit tests with Karma/Jasmine
- `ng generate component component-name` - Generate new Angular component

### Architecture Overview

The application follows Angular's component-service architecture with a complex game simulation engine:

#### Core Classes
- **Player** (`src/app/classes/player.class.ts`) - Manages a team of 5 pets, handles pet positioning, summoning, and battle mechanics
- **Pet** (`src/app/classes/pet.class.ts`) - Individual pet entities with attack, health, abilities, and equipment
- **Equipment** (`src/app/classes/equipment.class.ts`) - Items that pets can equip for various effects
- **Toy** (`src/app/classes/toy.class.ts`) - Player-level items that affect the entire team

#### Services
- **GameService** - Central game state management and API coordination
- **AbilityService** - Handles complex pet ability execution and event queuing
- **PetService** - Pet creation, pack management, and pet pools by tier
- **LogService** - Battle logging and debugging information
- **LocalStorageService** - Saves/loads calculator state
- **EquipmentService** & **ToyService** - Equipment and toy management

#### Pet Packs Structure
Pets are organized in hierarchical folders by pack type and tier:
- `src/app/classes/pets/[pack]/tier-[1-6]/` - Standard pets by pack (turtle, puppy, star, golden, unicorn)
- `src/app/classes/pets/custom/tier-[1-6]/` - Custom pack pets
- `src/app/classes/pets/hidden/` - Special hidden pets

#### Equipment Structure
Equipment follows similar organization:
- `src/app/classes/equipment/[pack]/` - Equipment by pack type
- `src/app/classes/equipment/ailments/` - Negative status effects

#### Components
- **AppComponent** - Main calculator interface with battle simulation
- **PetSelectorComponent** - Pet selection and configuration UI
- **CustomPackEditorComponent** - Create custom pet packs
- Various modal components for import/export, patch notes, bug reports

#### Battle Simulation System
The core simulation runs in `AppComponent.runSimulation()`:
1. **Initialization** - Set up pets, equipment, toys, and game state
2. **Start of Battle** - Execute start-of-battle abilities and equipment effects
3. **Turn Loop** - Pets attack each other, abilities trigger, dead pets are removed
4. **Ability Cycles** - Complex event system handles hurt/faint/summon/transform events
5. **Battle Resolution** - Determine winner when one team is eliminated or max turns reached

#### Key Features
- **Battle Simulation** - Run 1000+ battles to calculate win percentages  
- **Custom Packs** - Create custom pet combinations
- **Equipment System** - Pets can equip items that modify their abilities
- **Toy System** - Player-level items that affect the entire team
- **Import/Export** - Share calculator configurations
- **Advanced Settings** - Turn number, gold spent, day/night cycle, various game modifiers
- **Drag & Drop** - Reorder pets on the battlefield
- **Battle Logs** - Detailed logs of each battle for debugging

## Development Notes

- TypeScript strict mode is disabled (`"strict": false` in tsconfig.json)
- Uses Angular Material for UI components
- Bootstrap 5 for additional styling
- Lodash for utility functions (cloning, shuffling, etc.)
- Uses Angular CDK drag-drop for pet reordering
- Test framework: Karma + Jasmine
- No linting configuration detected

## Common Patterns

- Pet abilities are implemented as methods on pet classes (e.g., `startOfBattle()`, `faint()`, `hurt()`)
- Equipment effects use callback functions stored in equipment classes
- Event system queues abilities by priority and executes them in phases
- Random number generation uses `getRandomInt()` helper function
- Battle state is logged extensively for debugging and analysis
- Form management uses Angular Reactive Forms with complex nested FormArrays

## Node.js Compatibility

**Issue:** This Angular 12 project may encounter OpenSSL errors with Node.js 17+ due to deprecated legacy cryptographic algorithms.

**Error:** `Error: error:0308010C:digital envelope routines::unsupported`

**Solution:** The package.json scripts have been updated to use the `--openssl-legacy-provider` flag which enables legacy OpenSSL support.

**Affected Commands:**
- `npm start` - Development server
- `npm run build` - Production build  
- `npm run watch` - Development build with file watching
- `npm test` - Unit tests

**Long-term:** Consider upgrading to Angular 15+ for native Node.js compatibility without the legacy provider flag.

Before Attack Perk
Reduce Health: eg. Durian / Squash
	Snipe class, attackCallBack, get target, reduce amt then reduce target pet health.
Deal Damage: eg. Tomato, Egg
	Snipe class, attackCallBack, get target, calc damage, apply damage, message, defense equipment, log, and check hurt&knockout ability triggers.

Get Target functions:
	Target: AttackedPet.pet
	LastEnemy: AttackedPet.parent.getLastPet()
	HighestHealth: AttackedPet.parent.getHighestHealthPet()
	LowestHealth: AttackedPet.parent.getLowestHealthPet()
