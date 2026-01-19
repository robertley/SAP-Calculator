import { GameAPI } from "../interfaces/gameAPI.interface";
import { Pet } from "./pet.class";
import { minExpForLevel } from "../util/leveling";

export type AbilityType = 'Pet' | 'Equipment';

export type NumberedTriggerBase =
    | 'SpendGold'
    | 'FriendDied'
    | 'FriendSummoned'
    | 'FriendlyAttacked'
    | 'FriendAttacked'
    | 'Roll'
    | 'FriendBought'
    | 'FoodBought'
    | 'AfterTurns'
    | 'FriendSold'
    | 'EndTurn'
    | 'FriendJumped'
    | 'FriendlyLeveledUp'
    | 'FriendHurt'
    | 'FriendTransformed'
    | 'EnemyHurt'
    | 'ThisHurt'
    | 'EnemyAttacked'
    | 'EnemyFaint'
    | 'Eat'
    | 'AppleEatenByThis'
    | 'FriendlyAbilityActivated'
    | 'FriendFainted';

export type AbilityTriggerBase =
    | 'None'
    | 'StartTurn'
    | 'EndTurn'
    | 'StartBattle'
    | 'ShopUpgrade'
    | 'ThisBought'
    | 'ThisSold'
    | 'FoodEatenByAny'
    | 'ThisSummoned'
    | 'EnemySummoned'
    | 'FriendSummoned'
    | 'ThisTransformed'
    | 'EnemyPushed'
    | 'BeforeThisAttacks'
    | 'BeforeFriendAttacks'
    | 'ThisDied'
    | 'BeforeThisDies'
    | 'FriendDied'
    | 'ThisKilled'
    | 'ThisHurt'
    | 'EnemyHurt'
    | 'ThisLeveledUp'
    | 'FriendLeveledUp'
    | 'AnyLeveledUp'
    | 'FriendAheadDied'
    | 'Tier1FriendBought'
    | 'FoodEatenByThis'
    | 'FriendSold'
    | 'FriendAheadAttacked'
    | 'FriendBought'
    | 'FriendHurt'
    | 'FriendlyLeveledUp'
    | 'AppleEatenByThis'
    | 'AdjacentFriendsDie'
    | 'EnemyDied'
    | 'FriendAheadHurt'
    | 'ThisGainedPerk'
    | 'ThisLostPerk'
    | 'ThisAttacked'
    | 'ClearFront'
    | 'FriendAttacked'
    | 'FriendGainsAilment'
    | 'FriendGainsPerk'
    | 'BeforeStartBattle'
    | 'FriendlyToyBroke'
    | 'FriendlyGainsPerk'
    | 'FriendJumped'
    | 'ThisGainedMana'
    | 'EnemyGainedAilment'
    | 'ThisGainedAilment'
    | 'ThisGainedStrawberry'
    | 'AnyoneAttack'
    | 'ThisKilledEnemy'
    | 'FriendTransformed'
    | 'FriendLostPerk'
    | 'LostStrawberry'
    | 'FriendLostStrawberry'
    | 'FriendGainedStrawberry'
    | 'BeeSummoned'
    | 'FriendFlung'
    | 'AnyoneGainedAilment'
    | 'CornEatenByThis'
    | 'CornEatenByFriend'
    | 'AnyoneFlung'
    | 'FriendGainedExp'
    | 'FriendlyGainedStrawberry'
    | 'FoodEatenByFriend'
    | 'FoodEatenByFriendly'
    | 'AnyoneHurt'
    | 'FriendlyAttacked'
    | 'FriendlyGainedExp'
    | 'PetDied'
    | 'FriendlyAbilityActivated'
    | 'AdjacentFriendAttacked'
    | 'BeforeAdjacentFriendAttacked'
    | 'AdjacentFriendsHurt'
    | 'AnyoneBehindHurt'
    | 'AnyoneJumped'
    | 'EnemyAttacked'
    | 'AnyoneGainedWeak'
    | 'ThisFirstAttack'
    | 'PetLostPerk'
    | 'BeforeFirstAttack'
    | 'BeforeFriendlyAttack'
    | 'EnemyFaint'
    | 'SpecialEndTurn'
    | 'manaSnipe'
    | 'goldenRetrieverSummons'
    | 'KitsuneFriendDies';

export type AbilityTrigger = AbilityTriggerBase | `${NumberedTriggerBase}${number}`;

export interface AbilityContext {
    gameApi: GameAPI;
    triggerPet?: Pet;
    tiger?: boolean;
    pteranodon?: boolean;
    damageAmount?: number;
    [key: string]: any; // Allow for additional custom parameters
}

export interface AbilityCondition {
    (context: AbilityContext): boolean;
}

export interface AbilityFunction {
    (context: AbilityContext): void;
}

export class Ability {
    public name?: string;
    public owner: Pet;
    protected _triggers: AbilityTrigger[];
    public get triggers(): AbilityTrigger[] {
        return this._triggers;
    }
    public set triggers(value: AbilityTrigger[]) {
        this._triggers = value;
    }
    public abilityType: AbilityType;
    public maxUses: number;
    public currentUses: number;
    public initialCurrentUses: number;
    public abilityLevel: number;
    public condition?: AbilityCondition;
    public abilityFunction: AbilityFunction;
    public native: boolean;
    public ignoreRepeats: boolean;
    public alwaysIgnorePetLevel: boolean;

    constructor(config: {
        name?: string;
        owner: Pet;
        triggers: AbilityTrigger[];
        abilityType: AbilityType;
        maxUses?: number;
        abilitylevel?: number;
        initialCurrentUses?: number;
        condition?: AbilityCondition;
        abilityFunction: AbilityFunction;
        native?: boolean;
        ignoreRepeats?: boolean;
        alwaysIgnorePetLevel?: boolean;
    }) {
        this.name = config.name;
        this.owner = config.owner;
        this.triggers = config.triggers;
        this.abilityType = config.abilityType;
        this.maxUses = config.maxUses ?? -1; // -1 means unlimited
        const initialUses = config.initialCurrentUses ?? (config.abilityType === 'Pet' ? config.owner.triggersConsumed : 0);
        this.initialCurrentUses = initialUses;
        this.currentUses = initialUses;
        this.abilityLevel = config.abilitylevel ?? 1;
        this.condition = config.condition;
        this.abilityFunction = config.abilityFunction;
        this.native = config.native ?? true;
        this.ignoreRepeats = config.ignoreRepeats ?? false;
        this.alwaysIgnorePetLevel = config.alwaysIgnorePetLevel ?? false;
    }


    canUse(): boolean {
        // Check if ability has uses remaining
        if (this.maxUses > 0 && this.currentUses >= this.maxUses) {
            return false;
        }
        return true;
    }

    execute(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean, customParams?: any): boolean {
        //Check if pet is removed
        if (this.owner.removed && !this.matchesTrigger('ThisDied')) {
            return false;
        }
        // Check if pet is disabled (Dazed)
        if (!this.owner.abilityValidCheck()) {
            //TO DO1: Add logservice
            return false;
        }
        try {
            // Build context object with all parameters
            const context: AbilityContext = {
                gameApi,
                triggerPet,
                tiger,
                pteranodon,
                ...customParams // Spread any additional custom parameters
            };

            // Check custom condition if provided
            if (this.condition && !this.condition(context)) {
                return false;
            }
            // Always increment usage, even for Tiger (logic handled in triggerTigerExecution/calls to this)
            this.currentUses++;
            if (this.abilityType === 'Pet') {
                this.owner.triggersConsumed = Math.max(this.owner.triggersConsumed, this.currentUses);
            }
            this.abilityFunction(context);
            return true;
        } catch (error) {
            console.error(`Error executing ability ${this.name || 'unnamed'}:`, error);
            return false;
        }
    }

    // Tiger check method - matches Pet.class.ts:676-681
    tigerCheck(tiger?: boolean, tigerPetOverride?: Pet): boolean {
        // If ignoreRepeats is true, Tiger should not trigger this ability again
        if (this.ignoreRepeats || this.abilityType != 'Pet') {
            return false;
        }

        const tigerPet = tigerPetOverride ?? (this.owner).petBehind(true, true);
        if (tigerPet && tigerPet.hasTrigger(null, null, 'TigerAbility') && (tiger == null || tiger == false)) {
            return true;
        }
        return false;
    }

    // Tiger execution method for new framework
    // Subclasses should call this at the end of their ability logic
    protected triggerTigerExecution(context: AbilityContext): void {
        const tigerPet = (context as any).tigerSupportPet ?? this.owner.petBehind(true, true);
        if (!this.tigerCheck(context.tiger, tigerPet)) {
            return;
        }

        // Check usages for Tiger trigger
        if (!this.canUse()) {
            return;
        }

        // Save current ability level settings
        let originalAbilityLevel = this.abilityLevel;
        let originalIgnorePetLevel = this.alwaysIgnorePetLevel;

        // Set ability to use Tiger's level
        this.abilityLevel = tigerPet.level;
        this.alwaysIgnorePetLevel = true;

        // Execute ability again with Tiger's level using updated context
        // Extract params to pass to execute()
        const { gameApi, triggerPet, tiger, pteranodon, ...customParams } = context;

        // Pass tiger=true so it marks it as a tiger execution in valid checks if needed, 
        // but usages are now incremented regardless in execute()
        this.execute(gameApi, triggerPet, true, pteranodon, customParams);

        // Restore original settings
        this.abilityLevel = originalAbilityLevel;
        this.alwaysIgnorePetLevel = originalIgnorePetLevel;
    }

    reset(): void {
        this.currentUses = 0;
    }
    initUses(): void {
        this.currentUses = this.initialCurrentUses;
    }

    copy(newOwner: Pet): Ability {
        return null;
    }

    matchesTrigger(trigger: AbilityTrigger): boolean {
        return this.triggers.includes(trigger);
    }

    get level(): number {
        if (this.alwaysIgnorePetLevel) {
            return this.abilityLevel; // Use fixed ability level
        }
        return this.owner.level; // Use owner's current level (normal behavior)
    }

    get minExpForLevel(): number {
        return minExpForLevel(this.level);
    }
}
