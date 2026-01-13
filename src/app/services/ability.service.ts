import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { clone, cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { Pet } from "../classes/pet.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { LogService } from "./log.service";
import { AbilityTrigger, AbilityType } from "../classes/ability.class";

@Injectable({
    providedIn: "root"
})
export class AbilityService {

    public gameApi: GameAPI;
    private startBattleEvents: AbilityEvent[]= [];
    private afterAttackEvents: AbilityEvent[]= [];
    private beforeAttackEvents: AbilityEvent[]= [];
    private processedBeforeAttackPets: Set<Pet> = new Set();
    private beforeStartOfBattleEvents: AbilityEvent[]= [];
    private equipmentBeforeAttackEvents: AbilityEvent[]= []; // egg
    private afterFriendAttackEvents: AbilityEvent[]= []; // unified friend + enemy attack events
    private beforeFriendAttacksEvents: AbilityEvent[] = [];

    // toy events
    private emptyFrontSpaceToyEvents: AbilityEvent[]= [];
    private friendSummonedToyEvents: AbilityEvent[]= [];
    private friendlyLevelUpToyEvents: AbilityEvent[]= [];
    private friendFaintsToyEvents: AbilityEvent[]= [];
    private friendJumpedToyEvents: AbilityEvent[]= [];

    // Global priority queue system
    private globalEventQueue: AbilityEvent[] = [];
    
    // Priority mapping (lower number = higher priority), commmented out ones are ones currently not used
    private readonly ABILITY_PRIORITIES = {
        // Level up events
        'ThisLeveledUp': 1,
        'FriendLeveledUp': 2,
        'FriendlyLeveledUp': 2,
        'AnyLeveledUp': 2,

        // Hurt events
        'ThisHurt': 3,
        'FriendHurt': 4,
        'EnemyHurt': 4,
        'AnyoneHurt': 4,
        'FriendAheadHurt': 4,
        'AdjacentFriendsHurt': 4,
        'AnyoneBehindHurt': 4,
        // 'EnemyHurtOrPushed': 4,
        // 'FriendHurtOrFaint': 4,
        // 'ThisHurtOrFaint': 4,

        // Mana events
        'ThisGainedMana': 5,

        // Summon events
        'ThisSummoned': 6,
        //'ThisSummonedLate': 6,
        'FriendSummoned': 7,
        'EnemySummoned': 7,
        //'OtherSummoned': 7,
        'BeeSummoned': 7,
        'EnemyPushed': 7,
        //'CompositeEnemySummonedOrPushed': 7,

        // Movement events
        'FriendJumped': 8,
        'AnyoneJumped': 8,
        //'FriendJumpedOrTransformed': 8,

        // Death/Faint events
        'BeforeThisDies': 9,
        'KitsuneFriendDies' : 9,
        //'ThisDiesForPerks': 9,
        'FriendAheadDied': 10,
        'ThisDied': 11,
        'FriendDied': 12,
        'AdjacentFriendsDie': 12,
        'EnemyDied': 12,
        //'EnemyFaint': 12,
        'PetDied': 12,
        //'AllEnemiesDied': 12,
        //'AllFriendsFainted': 12,

        // Toy events
        'FriendlyToyBroke': 12,
        //'ToyBroke': 12,
        //'ThisBroke': 12,
        //'ToySummoned': 12,
        //'FriendlyToySummoned': 12,
        //'ThisBoughtOrToyBroke': 12,

        // Kill events
        'ThisKilled': 9,
        'ThisKilledEnemy': 13,

        // Transform events
        'ThisTransformed': 14,
        'FriendTransformed': 14.5,
        //'FriendTransformedInBattle': 14.5,
        //'BeforeFriendTransformed': 14.5,
        //Speical trigger for Giant Otter
        'BeforeFirstNonJumpAttack': 14,
        // Experience events
        //'FriendGainedExperience': 15,
        'FriendGainedExp': 15,
        'FriendlyGainedExp': 15,
        //'GainExp': 15,

        // Food events
        //'FriendAteFood': 16,
        'FoodEatenByThis': 16,
        'FoodEatenByAny': 16,
        'FoodEatenByFriend': 16,
        'FoodEatenByFriendly': 16,
        //'FoodBought': 16,
        'AppleEatenByThis': 16,
        'CornEatenByThis': 16,
        'CornEatenByFriend': 16,
        //'ShopFoodEatenByThis': 16,

        // COUNTER EVENTS - ALL events ending with numbers have same priority as 'counter' (17)
        'counter': 17,

        // Level up counter events
        'FriendlyLeveledUp2': 17,

        // Hurt counter events
        'ThisHurt2': 17,
        'ThisHurt3': 17,
        'ThisHurt4': 17,
        'ThisHurt5': 17,
        'FriendHurt2': 17,
        'FriendHurt3': 17,
        'FriendHurt4': 17,
        'FriendHurt5': 17,
        'FriendHurt6': 17,
        'EnemyHurt5': 17,
        'EnemyHurt10': 17,
        'EnemyHurt20': 17,

        // Jump counter events
        'FriendJumped2': 17,
        'FriendJumped3': 17,

        // Death/Faint counter events
        'TwoFriendsDied': 17,
        'FriendDied3': 17,
        'FriendDied4': 17,
        'FriendDied5': 17,
        //'FriendFainted5': 17,
        'EnemyFaint2': 17,
        'EnemyFaint3': 17,
        'EnemyFaint4': 17,
        'EnemyFaint5': 17,

        // Summon counter events
        'FriendSummoned2': 17,
        'FriendSummoned3': 17,
        'FriendSummoned4': 17,
        'FriendSummoned5': 17,

        // Gold spending counter events
        // 'SpendGold': 17,
        // 'SpendGold2': 17,
        // 'SpendGold3': 17,
        // 'SpendGold4': 17,
        // 'SpendGold5': 17,
        // 'SpendGold6': 17,
        // 'SpendGold7': 17,
        // 'SpendGold8': 17,
        // 'SpendGold9': 17,
        // 'SpendGold10': 17,
        // 'SpendGold11': 17,
        // 'SpendGold12': 17,

        // Roll counter events
        // 'Roll2': 17,
        // 'Roll3': 17,
        // 'Roll4': 17,
        // 'Roll5': 17,
        // 'Roll6': 17,
        // 'Roll7': 17,
        // 'Roll8': 17,
        // 'Roll9': 17,
        // 'Roll10': 17,

        // Buy counter events
        // 'FriendBought2': 17,
        // 'FriendBought3': 17,
        // 'FriendBought4': 17,

        // Sell counter events
        // 'FriendSold2': 17,
        // 'FriendSold3': 17,
        // 'FriendSold4': 17,
        // 'FriendSold5': 17,

        // Turn counter events
        // 'AfterTurns2': 17,
        // 'AfterTurns3': 17,
        // 'AfterTurns4': 17,
        // 'EndTurn2': 17,
        // 'EndTurn3': 17,
        // 'EndTurn4': 17,
        // 'EndTurn5': 17,

        // Food counter events
        // 'FoodBought2': 17,
        // 'FoodBought3': 17,
        // 'FoodBought4': 17,
        // 'FoodBought5': 17,
        'Eat2': 17,
        'Eat3': 17,
        'Eat4': 17,
        'Eat5': 17,
        'AppleEatenByThis2': 17,

        // Attack counter events
        'FriendlyAttacked2': 17,
        'FriendlyAttacked3': 17,
        'FriendAttacked4': 17,
        'FriendAttacked5': 17,
        'EnemyAttacked2': 17,
        'EnemyAttacked5': 17,
        'EnemyAttacked7': 17,
        'EnemyAttacked8': 17,
        'EnemyAttacked10': 17,

        // Ability counter events
        //'FriendlyAbilityActivated5': 17,

        // Transform counter events
        'FriendTransformed3': 17,
        'FriendTransformed5': 17,

        // Lost Perk events
        'ThisLostPerk': 17.5,
        'FriendLostPerk': 18,
        'PetLostPerk': 18,
        'LostStrawberry': 18,
        'FriendLostStrawberry': 18,
        //'LostAttack': 18,
        // Gained Perk events
        'ThisGainedPerk': 19,
        'ThisGainedStrawberry': 19,
        'FriendGainsPerk': 20,
        'FriendlyGainsPerk': 20,
        //'ThisGainedPerkOrAilment': 20,
        'FriendGainedStrawberry': 20,
        'FriendlyGainedStrawberry': 20,

        // Ailment events
        'ThisGainedAilment': 19,
        'FriendGainsAilment': 20,
        //'FriendlyGainedAilment': 20,
        'EnemyGainedAilment': 20,
        //'PetGainedAilment': 20,
        'AnyoneGainedAilment': 20,
        'AnyoneGainedWeak': 20,

        // Special movement
        'FriendFlung': 21,
        'AnyoneFlung': 21,

        // Mana snipe
        'manaSnipe': 22,

        // Space/positioning events
        'ClearFront': 23,

        // Special summons
        'goldenRetrieverSummons': 24,

        // // Attack events
        // 'BeforeThisAttacks': 25,
        // 'BeforeFriendAttacks': 25,
        // 'BeforeFirstAttack': 25,
        // 'BeforeFriendlyAttack': 25,
        // 'BeforeAdjacentFriendAttacked': 25,
        // 'ThisAttacked': 26,
        // 'FriendAttacked': 26,
        // 'EnemyAttacked': 26,
        // 'FriendlyAttacked': 26,
        // 'AdjacentFriendAttacked': 26,
        // 'FriendAheadAttacked': 26,
        // 'ThisFirstAttack': 26,
        // 'AnyoneAttack': 26,

        // // Battle/turn events
        // 'StartBattle': 27,
        // 'BeforeStartBattle': 27,
        // 'StartTurn': 27,
        // 'EndTurn': 27,
        // 'StartBattleOrTurn': 27,
        // 'CompositeStartOfBattleOrTransformed': 27,

        // // Shop events
        // 'ShopUpgrade': 28,
        // 'ShopRolled': 28,
        // 'BeforeRoll': 28,
        // 'ShopRewardStocked': 28,

        // // Buy/Sell events
        // 'ThisBought': 29,
        // 'FriendBought': 29,
        // 'Tier1FriendBought': 29,
        // 'BuyFromShop': 29,
        // 'AnythingBought': 29,
        // 'CompositeBuyOrStartTurn': 29,
        // 'ThisSold': 30,
        // 'FriendSold': 30,
        // 'BeforeSell': 30,
        // 'SellFriend': 30,
        // 'FriendSoldOrFaint': 30,
        // 'Level3FriendSold': 30,
        // 'PetSold': 30,

        // // Health/Attack gain events
        // 'FriendGainedHealth': 31,
        // 'FriendGainedAttack': 31,
        // 'ThisGainedAttack': 31,
        // 'ThisGainedHealth': 31,
        //'FriendAheadGainedHealth': 31,

        // Spend events
        // 'SpendAttack': 32,
        // 'SpendHealth': 32,
        // 'FriendSpendAttack': 32,
        // 'FriendSpendHealth': 32,
        // 'FriendSpendsAttackOrHealth': 32,

        // Ability events
        // 'FriendlyAbilityActivated': 33,
        // 'EnemyAbilityActivated': 33,

        // // Composite events
        // 'Composite': 99,
        // 'None': 999
    };


    constructor(private gameService: GameService) {

    }

    private handleCounterTriggers(
        pet: Pet,
        triggerPet: Pet | undefined,
        customParams: any,
        counters: Array<{ trigger: AbilityTrigger; modulo: number }>
    ): void {
        for (const counter of counters) {
            if (!pet.hasTrigger(counter.trigger)) {
                continue;
            }
            pet.abilityCounter++;
            if (pet.abilityCounter % counter.modulo === 0) {
                this.triggerAbility(pet, counter.trigger, triggerPet, customParams);
            }
        }
    }

    private enqueueToyEvents(
        queue: AbilityEvent[],
        player: Player,
        triggerPet: Pet | undefined,
        callback: (...args: any[]) => void
    ): void {
        this.addToyEvent(queue, {
            callback,
            priority: 100,
            level: player.toy.level,
            triggerPet
        });

        const pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
        for (const puma of pumas) {
            this.addToyEvent(queue, {
                callback,
                priority: +puma.attack,
                level: puma.level,
                triggerPet
            });
        }
    }

    private addToyEvent(queue: AbilityEvent[], event: AbilityEvent): void {
        queue.push(event);
    }

    private executeToyEventQueue(queue: AbilityEvent[], executor: (event: AbilityEvent) => void): void {
        const events = shuffle(queue);
        events.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (const event of events) {
            executor(event);
        }

        queue.length = 0;
    }

    // Helper method to trigger abilities in the new system
    private triggerAbility(pet: Pet, trigger: AbilityTrigger, triggerPet?: Pet, customParams?: any): void {
        if (pet.hasTrigger(trigger)) {
            const eventCustomParams = {
                ...(customParams ?? {}),
                trigger
            };
            // Create an AbilityEvent for the global queue
            const abilityEvent: AbilityEvent = {
                callback: (trigger: AbilityTrigger, gameApi: GameAPI, triggerPet: Pet) => {pet.executeAbilities(trigger, gameApi, triggerPet, undefined, undefined, eventCustomParams)},
                priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                pet: pet,
                triggerPet: triggerPet,
                abilityType: trigger,
                tieBreaker: Math.random(),
                customParams: eventCustomParams // Store custom parameters in the event
            };

            this.addEventToQueue(abilityEvent);
        }
    }    
    get hasAbilityCycleEvents() {
        // With the new priority queue system, only check the global queue
        // All events are migrated to globalEventQueue at the start of abilityCycle()
        return this.globalEventQueue.length > 0;
    }

    // Binary search insertion for maintaining sorted priority queue
    private addEventToQueue(event: AbilityEvent) {
        // Set priority based on ability type
        const abilityPriority = this.ABILITY_PRIORITIES[event.abilityType] || 999;
        
        // Assign random tie breaker if not already set
        if (event.tieBreaker === undefined) {
            event.tieBreaker = Math.random();
        }
        
        // Binary search to find insertion point
        let left = 0;
        let right = this.globalEventQueue.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            const midEvent = this.globalEventQueue[mid];
            const midAbilityPriority = this.ABILITY_PRIORITIES[midEvent.abilityType] || 999;
            
            // Compare ability type priority first
            if (abilityPriority < midAbilityPriority) {
                right = mid;
            } else if (abilityPriority > midAbilityPriority) {
                left = mid + 1;
            } else {
                // Same ability type priority, compare individual event priority (higher = first)
                if (event.priority > midEvent.priority) {
                    right = mid;
                } else if (event.priority < midEvent.priority) {
                    left = mid + 1;
                } else {
                    // Same priority - use random tie breaker (lower tieBreaker = first)
                    if (event.tieBreaker < midEvent.tieBreaker) {
                        right = mid;
                    } else {
                        left = mid + 1;
                    }
                }
            }
        }
        
        // Insert at found position
        this.globalEventQueue.splice(left, 0, event);
    }

    // Clear the global event queue
    clearGlobalEventQueue() {
        this.globalEventQueue = [];
    }

    // Check if global queue has events
    get hasGlobalEvents(): boolean {
        return this.globalEventQueue.length > 0;
    }

    // Get the next highest priority event from the queue
    getNextHighestPriorityEvent(): AbilityEvent | null {
        return this.globalEventQueue.shift() || null;
    }

    // Peek at the next highest priority event without removing it
    peekNextHighestPriorityEvent(): AbilityEvent | null {
        return this.globalEventQueue.length > 0 ? this.globalEventQueue[0] : null;
    }

    // Get numeric priority for an ability type
    getPriorityNumber(abilityType: string): number {
        return this.ABILITY_PRIORITIES[abilityType] || 999;
    }

    // Execute event callback with proper parameters based on ability type
    executeEventCallback(event: AbilityEvent) {
        const gameApi = this.gameService.gameApi;

        // Check for pet transformation and redirect ability execution if needed
        const executingPet = event.pet;

        if (executingPet && executingPet.transformed && executingPet.transformedInto && event.abilityType) {
            const transformedPet = executingPet.transformedInto;
            // Replace the callback with the transformed pet's method - pass custom params through
            event.callback = (trigger: AbilityTrigger, gameApi: GameAPI, triggerPet: Pet) => {
                transformedPet.executeAbilities(trigger, gameApi, triggerPet, undefined, undefined, event.customParams)
            }
        }
        event.callback(event.abilityType, gameApi, event.triggerPet);
    }

    // End of Turn Events

    initSpecialEndTurnAbility(player: Player) {
        for (let pet of player.petArray) {
            if (pet.hasTrigger('SpecialEndTurn')) {
                pet.executeAbilities('SpecialEndTurn', this.gameService.gameApi)
            }
        }
    }

    // before start of battle

    triggerBeforeStartOfBattleEvents() {
        // New trigger system
        //this.triggerAbility(player.petArray, 'BeforeStartBattle');
        this.gameApi = this.gameService.gameApi;
        // Legacy system for backwards compatibility
        for (let pet of this.gameApi.player.petArray) {
            if (pet.hasTrigger('BeforeStartBattle')) {
                // Create an AbilityEvent for the global queue
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'BeforeStartBattle',
                    tieBreaker: Math.random()
                };

                this.beforeStartOfBattleEvents.push(abilityEvent);
            } 
        }
        for (let pet of this.gameApi.opponent.petArray) {
            if (pet.hasTrigger('BeforeStartBattle')) {
                // Create an AbilityEvent for the global queue
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'BeforeStartBattle',
                    tieBreaker: Math.random()
                };

                this.beforeStartOfBattleEvents.push(abilityEvent);
            } 
        }
    }

    resetBeforeStartOfBattleEvents() {
        this.beforeStartOfBattleEvents = [];
    }

    executeBeforeStartOfBattleEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeStartOfBattleEvents = shuffle(this.beforeStartOfBattleEvents);

        this.beforeStartOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.beforeStartOfBattleEvents) {
            event.callback(event.abilityType, this.gameService.gameApi);
        }
        
        this.resetBeforeStartOfBattleEvents();
    }
    //counter
    setCounterEvent(event: AbilityEvent) {
        //event.abilityType = 'counter';
        this.addEventToQueue(event);
    }
    //sob events
    triggerStartBattleEvents() {
        this.gameApi = this.gameService.gameApi;
        for (let pet of this.gameApi.player.petArray) {
            if (pet.hasTrigger('StartBattle')) {
                // Create an AbilityEvent for the global queue
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'StartBattle',
                    tieBreaker: Math.random()
                };

                this.startBattleEvents.push(abilityEvent);
            }   
        }  
        for (let pet of this.gameApi.opponent.petArray) {
            if (pet.hasTrigger('StartBattle')) {
                // Create an AbilityEvent for the global queue
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'StartBattle',
                    tieBreaker: Math.random()
                };

                this.startBattleEvents.push(abilityEvent);
            }   
        } 
    }
    executeStartBattleEvents() {
        this.startBattleEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));

        while (this.startBattleEvents.length > 0) {
            let event = this.startBattleEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => {transformedPet.executeAbilities(trigger, gameApi)}
            }

            event.callback(event.abilityType, this.gameService.gameApi);
            let changed = false;
            for (let event of this.startBattleEvents) {
                if (event.pet.attack != event.priority) {
                    event.priority = event.pet.attack
                    changed = true;
                }
            }
            if (changed) {
                this.startBattleEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker)); 
            }
        }
    }
    // before attack
    triggerBeforeAttackEvent(AttackingPet: Pet) {
        for (let pet of AttackingPet.parent.petArray) {
            if (pet.hasTrigger('BeforeFriendlyAttack')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'BeforeFriendlyAttack',
                    tieBreaker: Math.random()
                };
                this.beforeFriendAttacksEvents.push(abilityEvent);
            }
            if (pet.hasTrigger('BeforeFirstNonJumpAttack')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'BeforeFirstNonJumpAttack',
                    tieBreaker: Math.random()
                };
                this.beforeFriendAttacksEvents.push(abilityEvent);
            }
            if (pet == AttackingPet) {
                if (pet.hasTrigger('BeforeThisAttacks')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'BeforeThisAttacks',
                        tieBreaker: Math.random()
                    };
                    this.beforeAttackEvents.push(abilityEvent);
                }
                if (pet.hasTrigger('BeforeFirstAttack')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'BeforeFirstAttack',
                        tieBreaker: Math.random()
                    };
                    this.beforeAttackEvents.push(abilityEvent);
                }
            } else {
                if (pet.hasTrigger('BeforeFriendAttacks')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'BeforeFriendAttacks',
                        tieBreaker: Math.random()
                    };
                    this.beforeFriendAttacksEvents.push(abilityEvent);
                }
            }
            if (pet == AttackingPet.petAhead || pet == AttackingPet.petBehind()) {
                if (pet.hasTrigger('BeforeAdjacentFriendAttacked')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'BeforeAdjacentFriendAttacked',
                        tieBreaker: Math.random()
                    };
                    this.beforeFriendAttacksEvents.push(abilityEvent);
                }
            }
        }
    }

    executeBeforeAttackEvents() {
        this.beforeAttackEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.beforeAttackEvents.length > 0) {
            let event = this.beforeAttackEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => {transformedPet.executeAbilities(trigger, gameApi)}
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }

        this.beforeFriendAttacksEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.beforeFriendAttacksEvents.length > 0) {
            let event = this.beforeFriendAttacksEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => {transformedPet.executeAbilities(trigger, gameApi)}
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }
    }
    // friend attacks events
    triggerAttacksEvents(AttackingPet: Pet) {
        // Add friendAttacks to unified system
        for (let pet of AttackingPet.parent.petArray) {
            this.handleCounterTriggers(pet, undefined, undefined, [
                { trigger: 'FriendlyAttacked2', modulo: 2 },
                { trigger: 'FriendlyAttacked3', modulo: 3 }
            ]);
            if (pet.hasTrigger('FriendlyAttacked')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'FriendlyAttacked',
                    tieBreaker: Math.random()
                };
                this.afterFriendAttackEvents.push(abilityEvent);
            }
            if (pet.hasTrigger('AnyoneAttack')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'AnyoneAttack',
                    tieBreaker: Math.random()
                };
                this.afterFriendAttackEvents.push(abilityEvent);
            }
            if (pet == AttackingPet) {
                if (pet.hasTrigger('ThisAttacked')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'ThisAttacked',
                        tieBreaker: Math.random()
                    };
                    this.afterAttackEvents.push(abilityEvent);
                }
                if (pet.hasTrigger('ThisFirstAttack')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'ThisFirstAttack',
                        tieBreaker: Math.random()
                    };
                    this.afterAttackEvents.push(abilityEvent);
                }
            } else {
                if (pet.hasTrigger('FriendAttacked')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'FriendAttacked',
                        tieBreaker: Math.random()
                    };
                    this.afterFriendAttackEvents.push(abilityEvent);
                }
                this.handleCounterTriggers(pet, undefined, undefined, [
                    { trigger: 'FriendAttacked4', modulo: 4 },
                    { trigger: 'FriendAttacked5', modulo: 5 }
                ]);
            }
            if (pet == AttackingPet.petAhead || pet == AttackingPet.petBehind()) {
                if (pet.hasTrigger('AdjacentFriendAttacked')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'AdjacentFriendAttacked',
                        tieBreaker: Math.random()
                    };
                    this.afterFriendAttackEvents.push(abilityEvent);
                }
            }
            if (pet == AttackingPet.petBehind(null, true)) {
                if (pet.hasTrigger('FriendAheadAttacked')) {
                    const abilityEvent: AbilityEvent = {
                        callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        abilityType: 'FriendAheadAttacked',
                        tieBreaker: Math.random()
                    };
                    this.afterFriendAttackEvents.push(abilityEvent);
                }
            }
        }
        for (let pet of AttackingPet.parent.opponent.petArray) {
            if (pet.hasTrigger('AnyoneAttack')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'AnyoneAttack',
                    tieBreaker: Math.random()
                };
                this.afterFriendAttackEvents.push(abilityEvent);
            }
            if (pet.hasTrigger('EnemyAttacked')) {
                const abilityEvent: AbilityEvent = {
                    callback: (trigger: AbilityTrigger, gameApi: GameAPI) => {pet.executeAbilities(trigger, gameApi)},
                    priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                    pet: pet,
                    abilityType: 'EnemyAttacked',
                    tieBreaker: Math.random()
                };
                this.afterFriendAttackEvents.push(abilityEvent);
            }
            this.handleCounterTriggers(pet, undefined, undefined, [
                { trigger: 'EnemyAttacked2', modulo: 2 },
                { trigger: 'EnemyAttacked5', modulo: 5 },
                { trigger: 'EnemyAttacked7', modulo: 7 },
                { trigger: 'EnemyAttacked8', modulo: 8 },
                { trigger: 'EnemyAttacked10', modulo: 10 }
            ]);
        }
    }
    executeAfterAttackEvents() {
        this.afterAttackEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.afterAttackEvents.length > 0) {
            let event = this.afterAttackEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => {transformedPet.executeAbilities(trigger, gameApi)}
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }

        this.afterFriendAttackEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.afterFriendAttackEvents.length > 0) {
            let event = this.afterFriendAttackEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => {transformedPet.executeAbilities(trigger, gameApi)}
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }
    }

    // Consolidated summon events handler
    triggerSummonEvents(summonedPet: Pet) {
        // Trigger toy events for friend summons
        this.triggerFriendSummonedToyEvents(summonedPet.parent, summonedPet);

        // Check friends (if this is a friend summon)
        for (let pet of summonedPet.parent.petArray) {
            if (pet == summonedPet) {
                this.triggerAbility(pet, 'ThisSummoned', summonedPet);
            } else {
                this.triggerAbility(pet, 'FriendSummoned', summonedPet);
                this.handleCounterTriggers(pet, summonedPet, undefined, [
                    { trigger: 'FriendSummoned2', modulo: 2 },
                    { trigger: 'FriendSummoned3', modulo: 3 },
                    { trigger: 'FriendSummoned4', modulo: 4 },
                    { trigger: 'FriendSummoned5', modulo: 5 }
                ]);
                // Special summon types
                if (summonedPet.name === 'Bee') {
                    this.triggerAbility(pet, 'BeeSummoned', summonedPet);
                }
            }
        }

        // Check enemies (if this is an enemy summon)
        for (let pet of summonedPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'EnemySummoned', summonedPet);
        }
    } 

    triggerFaintEvents(faintedPet: Pet) {
        // Check friends
        for (let pet of faintedPet.parent.petArray) {
            if (pet == faintedPet) {
                this.triggerAbility(pet, 'BeforeThisDies', faintedPet);
            } else {
                this.triggerAbility(pet, 'KitsuneFriendDies', faintedPet);
            }
            // Check for FriendAheadDied (pet ahead of the dying pet)
            if (pet == faintedPet.petBehind(null, true)) {
                this.triggerAbility(pet, 'FriendAheadDied', faintedPet);
            }
            // Check for AdjacentFriendsDie
            if (pet== faintedPet.petBehind(null, true) || pet.petBehind(null, true) == faintedPet) {
                this.triggerAbility(pet, 'AdjacentFriendsDie', faintedPet);
            }
        }
    }
    triggerAfterFaintEvents(faintedPet: Pet) {
        // Trigger toy events for friend faints
        this.triggerFriendFaintsToyEvents(faintedPet.parent, faintedPet);

        // Check friends
        for (let pet of faintedPet.parent.petArray) {
            this.triggerAbility(pet, 'PetDied', faintedPet);
            if (pet == faintedPet) {
                this.triggerAbility(pet, 'ThisDied', faintedPet);
            } else {
                this.triggerAbility(pet, 'FriendDied', faintedPet);
                this.handleCounterTriggers(pet, faintedPet, undefined, [
                    { trigger: 'TwoFriendsDied', modulo: 2 },
                    { trigger: 'FriendDied3', modulo: 3 },
                    { trigger: 'FriendDied4', modulo: 4 },
                    { trigger: 'FriendDied5', modulo: 5 }
                ]);
            }
        }

        // Check enemies
        for (let pet of faintedPet.parent.opponent.petArray.filter(p => p.alive)) {
            this.triggerAbility(pet, 'EnemyDied', faintedPet);
            this.triggerAbility(pet, 'PetDied', faintedPet);
            this.handleCounterTriggers(pet, faintedPet, undefined, [
                { trigger: 'EnemyFaint2', modulo: 2 },
                { trigger: 'EnemyFaint3', modulo: 3 },
                { trigger: 'EnemyFaint4', modulo: 4 },
                { trigger: 'EnemyFaint5', modulo: 5 }
            ]);
        }
    }

    //food events handler
    triggerFoodEvents(eatingPet: Pet, foodType?: string) {
        // Check friends
        for (let pet of eatingPet.parent.petArray) {
            this.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
            this.triggerAbility(pet, 'FoodEatenByFriendly', eatingPet);
            if (pet == eatingPet) {
                this.triggerAbility(pet, 'FoodEatenByThis', eatingPet);
                // Handle specific food types for this pet
                if (foodType === 'apple') {
                    this.triggerAbility(pet, 'AppleEatenByThis', eatingPet);
                    this.handleCounterTriggers(pet, eatingPet, undefined, [
                        { trigger: 'AppleEatenByThis2', modulo: 2 }
                    ]);
                } else if (foodType === 'corn') {
                    this.triggerAbility(pet, 'CornEatenByThis', eatingPet);
                }
                this.handleCounterTriggers(pet, eatingPet, undefined, [
                    { trigger: 'Eat2', modulo: 2 },
                    { trigger: 'Eat3', modulo: 3 },
                    { trigger: 'Eat4', modulo: 4 },
                    { trigger: 'Eat5', modulo: 5 }
                ]);
            } else {
                this.triggerAbility(pet, 'FoodEatenByFriend', eatingPet);
                // Specific food types for friends
                if (foodType === 'corn') {
                    this.triggerAbility(pet, 'CornEatenByFriend', eatingPet);
                }
            }
        }

        // Check enemies
        for (let pet of eatingPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
        }
    }

    // perk gain events handler
    triggerPerkGainEvents(perkPet: Pet, perkType?: string) {
        // Check friends
        for (let pet of perkPet.parent.petArray) {
            this.triggerAbility(pet, 'FriendlyGainsPerk', perkPet);
            if (perkType === 'Strawberry') {
                this.triggerAbility(pet, 'FriendlyGainedStrawberry', perkPet);
            }
            if (pet == perkPet) {
                this.triggerAbility(pet, 'ThisGainedPerk', perkPet);
                // Special perk types
                if (perkType === 'Strawberry') {
                    this.triggerAbility(pet, 'ThisGainedStrawberry', perkPet);
                }
            } else {
                this.triggerAbility(pet, 'FriendGainsPerk', perkPet);
                // Special perk types for friends
                if (perkType === 'Strawberry') {
                    this.triggerAbility(pet, 'FriendGainedStrawberry', perkPet);
                }
            }
        }
    }

    // perk loss events handler
    triggerPerkLossEvents(perkPet: Pet, perkType?: string) {
        // Check friends
        for (let pet of perkPet.parent.petArray) {
            this.triggerAbility(pet, 'PetLostPerk', perkPet);
            if (perkType === 'strawberry') {
                this.triggerAbility(pet, 'LostStrawberry', perkPet);
            }
            if (pet == perkPet) {
                this.triggerAbility(pet, 'ThisLostPerk', perkPet);
            } else {
                this.triggerAbility(pet, 'FriendLostPerk', perkPet);
                // Special perk types for friends
                if (perkType === 'strawberry') {
                    this.triggerAbility(pet, 'FriendLostStrawberry', perkPet);
                }
            }
        }

        // Check enemies
        for (let pet of perkPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'PetLostPerk', perkPet);
        }
    }
    // ailment events handler
    triggerAilmentGainEvents(ailmentPet: Pet, ailmentType?: string) {
        // Check friends
        for (let pet of ailmentPet.parent.petArray) {
            //this.triggerAbility(pet, 'PetGainedAilment', ailmentPet);
            this.triggerAbility(pet, 'AnyoneGainedAilment', ailmentPet);
            if (pet == ailmentPet) {
                this.triggerAbility(pet, 'ThisGainedAilment', ailmentPet);
            } else {
                this.triggerAbility(pet, 'FriendGainsAilment', ailmentPet);
            }
            // Special ailment types
            if (ailmentType === 'weak') {
                this.triggerAbility(pet, 'AnyoneGainedWeak', ailmentPet);
            }
        }

        // Check enemies
        for (let pet of ailmentPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'EnemyGainedAilment', ailmentPet);
            this.triggerAbility(pet, 'AnyoneGainedAilment', ailmentPet);
            // Special ailment types
            if (ailmentType === 'weak') {
                this.triggerAbility(pet, 'AnyoneGainedWeak', ailmentPet);
            }
        }
    }

    // transform events handler
    triggerTransformEvents(originalPet: Pet) {
        const transformedPet = originalPet.transformedInto;
        // Check friends
        for (let pet of transformedPet.parent.petArray) {
            if (pet == transformedPet) {
                this.triggerAbility(pet, 'ThisTransformed', transformedPet);
            } else {
                this.triggerAbility(pet, 'FriendTransformed', transformedPet);
                this.handleCounterTriggers(pet, transformedPet, undefined, [
                    { trigger: 'FriendTransformed3', modulo: 3 },
                    { trigger: 'FriendTransformed5', modulo: 5 }
                ]);
            }
        }
    }
    // Consolidated movement events handler
    triggerFlungEvents(movedPet: Pet) {
        // Handle friend fling events
        for (let pet of movedPet.parent.petArray) {
            this.triggerAbility(pet, 'AnyoneFlung', movedPet);
            if (pet != movedPet) {
                this.triggerAbility(pet, 'FriendFlung', movedPet);
            }
        }

        for (let pet of movedPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'AnyoneFlung', movedPet);
        }
    }

    // Legacy method - use triggerMovementEvents instead
    triggerPushedEvents(pushedPet: Pet) {
        for (let pet of pushedPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'EnemyPushed', pushedPet);
        }
    }

    // Consolidated kill events handler
    triggerKillEvents(killerPet: Pet, killedPet: Pet) {
        // Handle ThisKilled for the killer pet
        this.triggerAbility(killedPet, 'ThisKilled', killerPet);

        // Check if killed pet was an enemy
        if (killedPet.parent !== killerPet.parent) {
            this.triggerAbility(killerPet, 'ThisKilledEnemy', killedPet);
        }
    }

    triggerHurtEvents(hurtedPet: Pet, damageAmount?: number): void {
        // Create custom params with damage amount for hurt abilities
        const customParams = damageAmount !== undefined ? { damageAmount } : undefined;

        //check friends
        for (let pet of hurtedPet.parent.petArray){
            this.triggerAbility(pet, 'AnyoneHurt', hurtedPet, customParams);
            if (pet == hurtedPet) {
                this.triggerAbility(pet, 'ThisHurt', hurtedPet, customParams);
                this.handleCounterTriggers(pet, hurtedPet, customParams, [
                    { trigger: 'ThisHurt2', modulo: 2 },
                    { trigger: 'ThisHurt3', modulo: 3 },
                    { trigger: 'ThisHurt4', modulo: 4 },
                    { trigger: 'ThisHurt5', modulo: 5 }
                ]);
            } else {
                this.triggerAbility(pet, 'FriendHurt', hurtedPet, customParams);
                this.handleCounterTriggers(pet, hurtedPet, customParams, [
                    { trigger: 'FriendHurt2', modulo: 2 },
                    { trigger: 'FriendHurt3', modulo: 3 },
                    { trigger: 'FriendHurt4', modulo: 4 },
                    { trigger: 'FriendHurt5', modulo: 5 },
                    { trigger: 'FriendHurt6', modulo: 6 }
                ]);
            }
            if (pet == hurtedPet.petBehind(null, true)) {
                this.triggerAbility(pet, 'FriendAheadHurt', hurtedPet, customParams);
            }
            if (pet == pet.petBehind() || pet.petAhead) {
                this.triggerAbility(pet, 'AdjacentFriendsHurt', hurtedPet, customParams);
            }
            if (pet.position < hurtedPet.position) {
                this.triggerAbility(pet, 'AnyoneBehindHurt', hurtedPet, customParams)
            }
        }
        //check Enemies
        for (let pet of hurtedPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'EnemyHurt', hurtedPet, customParams)
            this.triggerAbility(pet, 'AnyoneHurt', hurtedPet, customParams);
            this.handleCounterTriggers(pet, hurtedPet, customParams, [
                { trigger: 'EnemyHurt5', modulo: 5 },
                { trigger: 'EnemyHurt10', modulo: 10 },
                { trigger: 'EnemyHurt20', modulo: 20 }
            ]);
        }
    }
    // level up events handler
    triggerLevelUpEvents(levelUpPet: Pet) {
        let player = levelUpPet.parent;
        // Trigger toy events for friendly level ups
        this.triggerFriendlyLevelUpToyEvents(player, levelUpPet);

        // Check friends
        for (let pet of player.petArray) {
            this.triggerAbility(pet, 'AnyLeveledUp', levelUpPet);
            this.triggerAbility(pet, 'FriendlyLeveledUp', levelUpPet);
            if (pet == levelUpPet) {
                this.triggerAbility(pet, 'ThisLeveledUp', levelUpPet);
            } else {
                this.triggerAbility(pet, 'FriendLeveledUp', levelUpPet);
                this.handleCounterTriggers(pet, levelUpPet, undefined, [
                    { trigger: 'FriendlyLeveledUp2', modulo: 2 }
                ]);
            }
        }

        // Check enemies
        for (let pet of levelUpPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'AnyLeveledUp', levelUpPet);
        }
    }

    triggerEmptyFrontSpaceEvents(player: Player) {
        for (let pet of player.petArray) {
            this.triggerAbility(pet, 'ClearFront');
        }
    }

    triggerToyBrokeEvents(player: Player) {
        for (let pet of player.petArray) {
            this.triggerAbility(pet, 'FriendlyToyBroke');
        }
    }

    // jump events handler
    triggerJumpEvents(jumpPet: Pet) {
        // Trigger toy events for friend jumps
        this.triggerFriendJumpedToyEvents(jumpPet.parent, jumpPet);

        // Check friends
        for (let pet of jumpPet.parent.petArray) {
            this.triggerAbility(pet, 'AnyoneJumped', jumpPet);
            if (pet == jumpPet) {
                // No specific triggers for the jumping pet itself
            } else {
                this.triggerAbility(pet, 'FriendJumped', jumpPet);
                this.handleCounterTriggers(pet, jumpPet, undefined, [
                    { trigger: 'FriendJumped2', modulo: 2 },
                    { trigger: 'FriendJumped3', modulo: 3 }
                ]);
            }
        }

        // Check enemies
        for (let pet of jumpPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'AnyoneJumped', jumpPet);
        }
    }

    // mana events handler
    triggerManaGainedEvents(manaPet: Pet) {
        // Handle ThisGainedMana for the pet gaining mana
        this.triggerAbility(manaPet, 'ThisGainedMana', manaPet);
    }

    setManaEvent(event: AbilityEvent) {
        event.abilityType = 'manaSnipe';
        this.addEventToQueue(event);
    }
    setgoldenRetrieverSummonsEvent(event: AbilityEvent) {
        event.abilityType = 'goldenRetrieverSummons'
        this.addEventToQueue(event);
    }
    // friend gains health events placeHolder
    triggerFriendGainsHealthEvents(healthPet: Pet) {

    }
    // Experience Events handler
    triggerFriendGainedExperienceEvents(ExpPet: Pet) {
        for (let pet of ExpPet.parent.petArray) {
            this.triggerAbility(pet, 'FriendlyGainedExp', ExpPet);
            if (pet === ExpPet) {
                continue;
            } else {
                this.triggerAbility(pet, 'FriendGainedExp', ExpPet);
            }
        }
    }
    // toy events


    // empty front space events

    triggerEmptyFrontSpaceToyEvents(player: Player) {
        if (player.toy?.emptyFromSpace != null) {
            if (player.toy.used) {
                return;
            }
            this.enqueueToyEvents(
                this.emptyFrontSpaceToyEvents,
                player,
                undefined,
                player.toy.emptyFromSpace.bind(player.toy)
            );
        }


    }
    
    executeEmptyFrontSpaceToyEvents() {
        this.executeToyEventQueue(this.emptyFrontSpaceToyEvents, (event) => {
            event.callback(this.gameService.gameApi, event.priority < 100, event.level, event.priority);
        });
    }

    // Toy events


    // friend summoned toy events

    triggerFriendSummonedToyEvents(player: Player, pet: Pet) {
        if (player.toy?.friendSummoned != null) {
            this.enqueueToyEvents(
                this.friendSummonedToyEvents,
                player,
                pet,
                player.toy.friendSummoned.bind(player.toy)
            );
        }
    }

    executeFriendSummonedToyEvents() {
        this.executeToyEventQueue(this.friendSummonedToyEvents, (event) => {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        });
    }

    // friendly level up toy events

    triggerFriendlyLevelUpToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendlyLevelUp != null) {
            this.enqueueToyEvents(
                this.friendlyLevelUpToyEvents,
                player,
                pet,
                player.toy.friendlyLevelUp.bind(player.toy)
            );
        }
    }

    executeFriendlyLevelUpToyEvents() {
        this.executeToyEventQueue(this.friendlyLevelUpToyEvents, (event) => {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        });
    }

    // friend faints toy events

    triggerFriendFaintsToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendFaints != null) {
            this.enqueueToyEvents(
                this.friendFaintsToyEvents,
                player,
                pet,
                player.toy.friendFaints.bind(player.toy)
            );
        }
    }

    executeFriendFaintsToyEvents() {
        this.executeToyEventQueue(this.friendFaintsToyEvents, (event) => {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        });
    }

    // friend jumped toy events

    triggerFriendJumpedToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendJumped != null) {
            this.enqueueToyEvents(
                this.friendJumpedToyEvents,
                player,
                pet,
                player.toy.friendJumped.bind(player.toy)
            );
        }
        
    }

    executeFriendJumpedToyEvents() {
        this.executeToyEventQueue(this.friendJumpedToyEvents, (event) => {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        });
    }
}
