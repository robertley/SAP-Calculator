import { GameAPI } from "../interfaces/gameAPI.interface";
import { Pet } from "./pet.class";

export type AbilityType = 'Pet' | 'Equipment';

export type AbilityTrigger = 'None' | 'Composite' | 'StartTurn' | 'EndTurn' | 'StartBattle' | 'ShopUpgrade' | 'ThisBought' | 'ThisSold' | 'FoodBought' | 'FoodEatenByAny' | 'ThisSummoned' | 'OtherSummoned' | 'EnemySummoned' | 'FriendSummoned' | 'ThisTransformed' | 'EnemyPushed' | 'BeforeThisAttacks' | 'BeforeFriendAttacks' | 'ThisDied' | 'BeforeThisDies' | 'ThisDiesForPerks' | 'FriendDied' | 'ThisKilled' | 'ThisHurt' | 'EnemyHurt' | 'ThisLeveledUp' | 'FriendLeveledUp' | 'AnyLeveledUp' | 'ShopRolled' | 'FriendAheadDied' | 'Tier1FriendBought' | 'FoodEatenByThis' | 'FriendSold' | 'FriendAheadAttacked' | 'FriendBought' | 'FriendHurt' | 'FriendlyLeveledUp' | 'CompositeEnemySummonedOrPushed' | 'AppleEatenByThis' | 'AdjacentFriendsDie' | 'EnemyDied' | 'FriendAheadHurt' | 'SpendGold12' | 'FriendDied3' | 'TwoFriendsDied' | 'FriendSummoned2' | 'FriendSummoned3' | 'SpendGold7' | 'ThisGainedPerk' | 'ThisLostPerk' | 'ThisAttacked' | 'ClearFront' | 'AllEnemiesDied' | 'FriendAttacked' | 'FriendlyAttacked3' | 'FriendlyAttacked2' | 'FriendAttacked4' | 'FriendAttacked5' | 'BuyFromShop' | 'SpendGold8' | 'SpendGold' | 'SpendGold2' | 'SpendGold3' | 'SpendGold4' | 'SpendGold5' | 'SpendGold6' | 'SpendGold9' | 'SpendGold10' | 'SpendGold11' | 'Roll2' | 'Roll3' | 'Roll4' | 'Roll5' | 'Roll6' | 'Roll7' | 'Roll8' | 'Roll9' | 'Roll10' | 'FriendBought2' | 'FriendBought3' | 'FriendBought4' | 'FriendGainsAilment' | 'ToyBroke' | 'ToySummoned' | 'ThisBroke' | 'AfterTurns2' | 'AfterTurns3' | 'AfterTurns4' | 'ThisGainedPerkOrAilment' | 'FriendGainsPerk' | 'ThisHurtOrFaint' | 'FriendSold2' | 'FriendSold3' | 'FriendSold4' | 'FriendSold5' | 'ThisBoughtOrToyBroke' | 'StartBattleOrTurn' | 'AllFriendsFainted' | 'BeforeStartBattle' | 'FriendlyToyBroke' | 'FriendlyToySummoned' | 'EndTurn2' | 'EndTurn3' | 'EndTurn4' | 'EndTurn5' | 'FriendlyGainsPerk' | 'FoodBought2' | 'FoodBought3' | 'FoodBought4' | 'FoodBought5' | 'FriendJumped' | 'FriendJumped2' | 'FriendJumped3' | 'FriendGainedAttack' | 'FriendGainedHealth' | 'ThisGainedAttack' | 'ThisGainedHealth' | 'FriendSummoned4' | 'FriendSummoned5' | 'ShopRewardStocked' | 'ThisGainedMana' | 'EnemyGainedAilment' | 'FriendlyLeveledUp2' | 'ThisGainedAilment' | 'ThisGainedStrawberry' | 'EnemyHurtOrPushed' | 'AnyoneAttack' | 'ThisKilledEnemy' | 'BeforeSell' | 'SellFriend' | 'FriendSoldOrFaint' | 'FriendHurt2' | 'FriendHurt3' | 'FriendHurt4' | 'FriendHurt5' | 'Level3FriendSold' | 'FriendTransformed' | 'Disabled137' | 'Disabled138' | 'Disabled139' | 'Disabled140' | 'Disabled141' | 'Disabled142' | 'Disabled143' | 'Disabled144' | 'SpendAttack' | 'SpendHealth' | 'FriendSpendAttack' | 'FriendSpendHealth' | 'FriendSpendsAttackOrHealth' | 'FriendTransformed3' | 'EnemyHurt10' | 'EnemyHurt20' | 'FriendTransformed5' | 'ThisHurt5' | 'CompositeStartOfBattleOrTransformed' | 'CompositeBuyOrStartTurn' | 'FriendHurtOrFaint' | 'EnemyHurt5' | 'FriendFainted5' | 'FriendTransformedInBattle' | 'FriendLostPerk' | 'LostStrawberry' | 'FriendLostStrawberry' | 'FriendGainedStrawberry' | 'ThisHurt2' | 'ThisHurt3' | 'ThisHurt4' | 'BeeSummoned' | 'FriendFlung' | 'ThisSummonedLate' | 'AnythingBought' | 'AnyoneGainedAilment' | 'Eat2' | 'Eat3' | 'Eat4' | 'Eat5' | 'CornEatenByThis' | 'CornEatenByFriend' | 'AnyoneFlung' | 'GainExp' | 'FriendGainedExp' | 'AppleEatenByThis2' | 'BeforeRoll' | 'PleaseDontShowUpInLocalizationFiles' | 'FriendDied4' | 'FriendDied5' | 'FriendlyGainedStrawberry' | 'FoodEatenByFriend' | 'FoodEatenByFriendly' | 'AnyoneHurt' | 'FriendlyAttacked' | 'ShopFoodEatenByThis' | 'FriendlyGainedExp' | 'PetDied' | 'FriendlyAbilityActivated' | 'FriendlyAbilityActivated5' | 'EnemyAttacked8' | 'EnemyAbilityActivated' | 'FriendHurt6' | 'FriendAheadGainedHealth' | 'AdjacentFriendAttacked' | 'BeforeAdjacentFriendAttacked' | 'LostAttack' | 'EnemyAttacked2' | 'AdjacentFriendsHurt' | 'EnemyAttacked10' | 'AnyoneBehindHurt' | 'AnyoneJumped' | 'BeforeFriendTransformed' | 'EnemyAttacked' | 'FriendJumpedOrTransformed' | 'EnemyAttacked5' | 'AnyoneGainedWeak' | 'ThisFirstAttack' | 'PetSold' | 'PetGainedAilment' | 'PetLostPerk' | 'BeforeFirstAttack' | 'BeforeFriendlyAttack' | 'EnemyFaint' | 'EnemyFaint2' | 'EnemyFaint3' | 'EnemyFaint4' | 'EnemyFaint5'
| 'SpecialEndTurn' | 'manaSnipe' | 'goldenRetrieverSummons' | 'KitsuneFriendDies' | 'Removed';

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
    public triggers: AbilityTrigger[];
    public abilityType: AbilityType;
    public maxUses: number;
    public currentUses: number;
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
        this.currentUses = 0;
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
        if (this.owner.removed && !this.matchesTrigger('ThisDied') && !this.matchesTrigger('Removed')) {
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

            this.abilityFunction(context);
            if (!tiger) {
                this.currentUses++;
            }
            return true;
        } catch (error) {
            console.error(`Error executing ability ${this.name || 'unnamed'}:`, error);
            return false;
        }
    }

    // Tiger check method - matches Pet.class.ts:676-681
    tigerCheck(tiger?: boolean): boolean {
        // If ignoreRepeats is true, Tiger should not trigger this ability again
        if (this.ignoreRepeats || this.abilityType != 'Pet') {
            return false;
        }

        if ((this.owner as any).petBehind && (this.owner as any).petBehind(true, true)?.name === 'Tiger' && (tiger == null || tiger == false)) {
            return true;
        }
        return false;
    }

    // Tiger execution method for new framework
    // Subclasses should call this at the end of their ability logic
    protected triggerTigerExecution(context: AbilityContext): void {
        if (!this.tigerCheck(context.tiger)) {
            return;
        }

        // Save current ability level settings
        let originalAbilityLevel = this.abilityLevel;
        let originalIgnorePetLevel = this.alwaysIgnorePetLevel;

        // Set ability to use Tiger's level
        this.abilityLevel = (this.owner as any).petBehind(null, true).level;
        this.alwaysIgnorePetLevel = true;

        // Execute ability again with Tiger's level using updated context
        const tigerContext: AbilityContext = {
            ...context,
            tiger: true
        };
        this.abilityFunction(tigerContext);

        // Restore original settings
        this.abilityLevel = originalAbilityLevel;
        this.alwaysIgnorePetLevel = originalIgnorePetLevel;
    }

    reset(): void {
        this.currentUses = 0;
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
        return this.level == 1 ? 0 : this.level == 2 ? 2 : 5;
    }
}