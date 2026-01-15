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
    private startBattleEvents: AbilityEvent[] = [];
    private afterAttackEvents: AbilityEvent[] = [];
    private beforeAttackEvents: AbilityEvent[] = [];
    private processedBeforeAttackPets: Set<Pet> = new Set();
    private beforeStartOfBattleEvents: AbilityEvent[] = [];
    private equipmentBeforeAttackEvents: AbilityEvent[] = []; // egg
    private afterFriendAttackEvents: AbilityEvent[] = []; // unified friend + enemy attack events
    private beforeFriendAttacksEvents: AbilityEvent[] = [];

    // toy events
    private emptyFrontSpaceToyEvents: AbilityEvent[] = [];
    private friendSummonedToyEvents: AbilityEvent[] = [];
    private friendlyLevelUpToyEvents: AbilityEvent[] = [];
    private friendFaintsToyEvents: AbilityEvent[] = [];
    private friendJumpedToyEvents: AbilityEvent[] = [];

    // Global priority queue system
    private globalEventQueue: AbilityEvent[] = [];

    private getTeam(petOrPlayer: any): Pet[] {
        const parent = petOrPlayer?.parent ?? petOrPlayer;
        const arr = parent?.petArray;
        return Array.isArray(arr) ? arr : [];
    }

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
        //'CompositeEnemySummonedOrPushed': 7,

        // Movement events
        'EnemyPushed': 8,
        'FriendJumped': 8,
        'AnyoneJumped': 8,
        //'FriendJumpedOrTransformed': 8,

        // Death/Faint events
        'BeforeThisDies': 9,
        'KitsuneFriendDies': 9,
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

        // Numbered counter events derive from 'counter' priority.

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

        // Food counter events (numbered triggers use counter priority)
        // 'FoodBought2': 17,
        // 'FoodBought3': 17,
        // 'FoodBought4': 17,
        // 'FoodBought5': 17,

        // Attack counter events (numbered triggers use counter priority)

        // Ability counter events
        //'FriendlyAbilityActivated5': 17,

        // Transform counter events (numbered triggers use counter priority)

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

    private getTriggerModulo(trigger: AbilityTrigger): number | null {
        const match = trigger.match(/(\d+)$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    private handleNumberedCounterTriggers(
        pet: Pet,
        triggerPet: Pet | undefined,
        customParams: any,
        triggers: AbilityTrigger[]
    ): void {
        const counters = triggers
            .map((trigger) => ({
                trigger,
                modulo: this.getTriggerModulo(trigger)
            }))
            .filter((counter): counter is { trigger: AbilityTrigger; modulo: number } => counter.modulo != null);

        if (counters.length === 0) {
            return;
        }

        this.handleCounterTriggers(pet, triggerPet, customParams, counters);
    }

    private getNumberedTriggersForPet(pet: Pet, prefix: string): AbilityTrigger[] {
        const triggers = new Set<AbilityTrigger>();
        const numberedTriggerRegex = new RegExp(`^${prefix}\\d+$`);

        for (const ability of pet.getAbilities()) {
            for (const trigger of ability.triggers) {
                if (numberedTriggerRegex.test(trigger)) {
                    triggers.add(trigger);
                }
            }
        }

        return Array.from(triggers);
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
        events.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0 });

        for (const event of events) {
            executor(event);
        }

        queue.length = 0;
    }

    private getAbilityPriority(trigger: AbilityTrigger): number {
        const direct = this.ABILITY_PRIORITIES[trigger];
        if (direct != null) {
            return direct;
        }
        if (/\d+$/.test(trigger)) {
            return this.ABILITY_PRIORITIES.counter ?? 999;
        }
        return 999;
    }

    // Helper method to trigger abilities in the new system
    private triggerAbility(pet: Pet, trigger: AbilityTrigger, triggerPet?: Pet, customParams?: any): void {
        if (pet.hasTrigger(trigger)) {
            const eventCustomParams = {
                ...(customParams ?? {}),
                trigger,
                tigerSupportPet: pet.petBehind(true, true) ?? null
            };
            // Create an AbilityEvent for the global queue
            const abilityEvent: AbilityEvent = {
                callback: (trigger: AbilityTrigger, gameApi: GameAPI, triggerPet: Pet) => {pet.executeAbilities(trigger, gameApi, triggerPet, undefined, undefined, eventCustomParams)},
                priority: this.getPetEventPriority(pet), // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                pet: pet,
                triggerPet: triggerPet,
                abilityType: trigger,
                tieBreaker: Math.random(),
                customParams: eventCustomParams // Store custom parameters in the event
            };

            this.addEventToQueue(abilityEvent);
        }
    }

    private getPetEventPriority(pet: Pet): number {
        let priority = pet.attack;
        if (pet.equipment?.name === 'Churros') {
            priority += 1000;
        } else if (pet.equipment?.name === 'Macaron') {
            priority -= 1000;
        }
        return priority;
    }

    private createAbilityEvent(
        pet: Pet,
        abilityType: AbilityTrigger,
        triggerPet?: Pet,
        priority?: number,
        customParams?: any
    ): AbilityEvent {
        return {
            callback: (trigger: AbilityTrigger, gameApi: GameAPI, eventTriggerPet?: Pet) => {
                pet.executeAbilities(trigger, gameApi, eventTriggerPet, undefined, undefined, customParams);
            },
            priority: priority ?? this.getPetEventPriority(pet),
            pet,
            triggerPet,
            abilityType,
            tieBreaker: Math.random(),
            customParams
        };
    }

    private enqueueAbilityEvent(
        queue: AbilityEvent[],
        pet: Pet,
        abilityType: AbilityTrigger,
        triggerPet?: Pet,
        priority?: number,
        customParams?: any
    ): void {
        queue.push(this.createAbilityEvent(pet, abilityType, triggerPet, priority, customParams));
    }
    get hasAbilityCycleEvents() {
        // With the new priority queue system, only check the global queue
        // All events are migrated to globalEventQueue at the start of abilityCycle()
        return this.globalEventQueue.length > 0;
    }

    // Binary search insertion for maintaining sorted priority queue
    private addEventToQueue(event: AbilityEvent) {
        // Set priority based on ability type
        const abilityPriority = this.getAbilityPriority(event.abilityType);

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
            const midAbilityPriority = this.getAbilityPriority(midEvent.abilityType);

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
        return this.getAbilityPriority(abilityType as AbilityTrigger);
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
                this.enqueueAbilityEvent(this.beforeStartOfBattleEvents, pet, 'BeforeStartBattle');
            }
        }
        for (let pet of this.gameApi.opponent.petArray) {
            if (pet.hasTrigger('BeforeStartBattle')) {
                this.enqueueAbilityEvent(this.beforeStartOfBattleEvents, pet, 'BeforeStartBattle');
            }
        }
    }

    resetBeforeStartOfBattleEvents() {
        this.beforeStartOfBattleEvents = [];
    }

    executeBeforeStartOfBattleEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeStartOfBattleEvents = shuffle(this.beforeStartOfBattleEvents);

        this.beforeStartOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0 });

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
                this.enqueueAbilityEvent(this.startBattleEvents, pet, 'StartBattle');
            }
        }
        for (let pet of this.gameApi.opponent.petArray) {
            if (pet.hasTrigger('StartBattle')) {
                this.enqueueAbilityEvent(this.startBattleEvents, pet, 'StartBattle', undefined, pet.attack);
            }
        }
    }
    executeStartBattleEvents() {
        this.startBattleEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));

        while (this.startBattleEvents.length > 0) {
            let event = this.startBattleEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => { transformedPet.executeAbilities(trigger, gameApi) }
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
        const parent = AttackingPet?.parent as any;
        const friends = parent && Array.isArray(parent.petArray) ? parent.petArray : [];
        for (let pet of friends) {
            if (pet.hasTrigger('BeforeFriendlyAttack')) {
                this.enqueueAbilityEvent(this.beforeFriendAttacksEvents, pet, 'BeforeFriendlyAttack', undefined, pet.attack);
            }
            if (pet == AttackingPet) {
                if (pet.hasTrigger('BeforeThisAttacks')) {
                    this.enqueueAbilityEvent(this.beforeAttackEvents, pet, 'BeforeThisAttacks', undefined, pet.attack);
                }
                if (pet.hasTrigger('BeforeFirstAttack')) {
                    this.enqueueAbilityEvent(this.beforeAttackEvents, pet, 'BeforeFirstAttack', undefined, pet.attack);
                }
            } else {
                if (pet.hasTrigger('BeforeFriendAttacks')) {
                    this.enqueueAbilityEvent(this.beforeFriendAttacksEvents, pet, 'BeforeFriendAttacks', undefined, pet.attack);
                }
            }
            if (pet == AttackingPet.petAhead || pet == AttackingPet.petBehind()) {
                if (pet.hasTrigger('BeforeAdjacentFriendAttacked')) {
                    this.enqueueAbilityEvent(this.beforeFriendAttacksEvents, pet, 'BeforeAdjacentFriendAttacked', undefined, pet.attack);
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
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => { transformedPet.executeAbilities(trigger, gameApi) }
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }

        this.beforeFriendAttacksEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.beforeFriendAttacksEvents.length > 0) {
            let event = this.beforeFriendAttacksEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => { transformedPet.executeAbilities(trigger, gameApi) }
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }
    }
    // friend attacks events
    triggerAttacksEvents(AttackingPet: Pet) {
        if (!AttackingPet) {
            return;
        }
        // Add friendAttacks to unified system
        for (let pet of this.getTeam(AttackingPet)) {
            this.handleNumberedCounterTriggers(
                pet,
                undefined,
                undefined,
                this.getNumberedTriggersForPet(pet, 'FriendlyAttacked')
            );
            if (pet.hasTrigger('FriendlyAttacked')) {
                this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'FriendlyAttacked', undefined, pet.attack);
            }
            if (pet.hasTrigger('AnyoneAttack')) {
                this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'AnyoneAttack', AttackingPet, pet.attack);
            }
            if (pet == AttackingPet) {
                if (pet.hasTrigger('ThisAttacked')) {
                    this.enqueueAbilityEvent(this.afterAttackEvents, pet, 'ThisAttacked', undefined, pet.attack);
                }
                if (pet.hasTrigger('ThisFirstAttack')) {
                    this.enqueueAbilityEvent(this.afterAttackEvents, pet, 'ThisFirstAttack', undefined, pet.attack);
                }
            } else {
                if (pet.hasTrigger('FriendAttacked')) {
                    this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'FriendAttacked', undefined, pet.attack);
                }
                this.handleNumberedCounterTriggers(
                    pet,
                    undefined,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendAttacked')
                );
            }
            if (pet == AttackingPet.petAhead || pet == AttackingPet.petBehind()) {
                if (pet.hasTrigger('AdjacentFriendAttacked')) {
                    this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'AdjacentFriendAttacked', AttackingPet, pet.attack);
                }
            }
            if (pet == AttackingPet.petBehind(null, true)) {
                if (pet.hasTrigger('FriendAheadAttacked')) {
                    this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'FriendAheadAttacked', undefined, pet.attack);
                }
            }
        }
        const opponentTeam = this.getTeam(AttackingPet.parent?.opponent);
        if (!opponentTeam.length) {
            return;
        }
        for (let pet of opponentTeam) {
            if (pet.hasTrigger('AnyoneAttack')) {
                this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'AnyoneAttack', AttackingPet, pet.attack);
            }
            if (pet.hasTrigger('EnemyAttacked')) {
                this.enqueueAbilityEvent(this.afterFriendAttackEvents, pet, 'EnemyAttacked', undefined, pet.attack);
            }
            this.handleNumberedCounterTriggers(
                pet,
                undefined,
                undefined,
                this.getNumberedTriggersForPet(pet, 'EnemyAttacked')
            );
        }
    }
    executeAfterAttackEvents() {
        this.afterAttackEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.afterAttackEvents.length > 0) {
            let event = this.afterAttackEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => { transformedPet.executeAbilities(trigger, gameApi) }
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }

        this.afterFriendAttackEvents.sort((a, b) => (b.priority - a.priority) || (b.tieBreaker - a.tieBreaker));
        while (this.afterFriendAttackEvents.length > 0) {
            let event = this.afterFriendAttackEvents.shift();
            if (event.pet && event.pet.transformed && event.pet.transformedInto) {
                const transformedPet = event.pet.transformedInto;
                event.callback = (trigger: AbilityTrigger, gameApi: GameAPI) => { transformedPet.executeAbilities(trigger, gameApi) }
            }
            event.callback(event.abilityType, this.gameService.gameApi);
        }
    }

    // Consolidated summon events handler
    triggerSummonEvents(summonedPet: Pet) {
        const parent = summonedPet?.parent as any;
        if (!parent || !Array.isArray(parent.petArray)) {
            return;
        }

        // Trigger toy events for friend summons
        this.triggerFriendSummonedToyEvents(parent, summonedPet);

        // Check friends (if this is a friend summon)
        for (let pet of this.getTeam(parent)) {
            if (pet == summonedPet) {
                this.triggerAbility(pet, 'ThisSummoned', summonedPet);
            } else {
                this.triggerAbility(pet, 'FriendSummoned', summonedPet);
                this.handleNumberedCounterTriggers(
                    pet,
                    summonedPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendSummoned')
                );
                // Special summon types
                if (summonedPet.name === 'Bee') {
                    this.triggerAbility(pet, 'BeeSummoned', summonedPet);
                }
            }
        }

        // Check enemies (if this is an enemy summon)
        const enemyPets = parent.opponent && Array.isArray(parent.opponent.petArray) ? parent.opponent.petArray : [];
        enemyPets.forEach((pet: Pet) => this.triggerAbility(pet, 'EnemySummoned', summonedPet));
    }

    triggerFaintEvents(faintedPet: Pet) {
        // Check friends
        for (let pet of this.getTeam(faintedPet)) {
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
            if (pet == faintedPet.petBehind(null, true) || pet.petBehind(null, true) == faintedPet) {
                this.triggerAbility(pet, 'AdjacentFriendsDie', faintedPet);
            }
        }
    }
    triggerAfterFaintEvents(faintedPet: Pet) {
        // Trigger toy events for friend faints
        this.triggerFriendFaintsToyEvents(faintedPet.parent, faintedPet);

        // Check friends
        for (let pet of this.getTeam(faintedPet)) {
            this.triggerAbility(pet, 'PetDied', faintedPet);
            if (pet == faintedPet) {
                this.triggerAbility(pet, 'ThisDied', faintedPet);
            } else {
                this.triggerAbility(pet, 'FriendDied', faintedPet);
                this.handleNumberedCounterTriggers(
                    pet,
                    faintedPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendDied')
                );
            }
        }

        // Check enemies
        const enemyTeam = this.getTeam(faintedPet.parent?.opponent).filter(p => p.alive);
        for (let pet of enemyTeam) {
            this.triggerAbility(pet, 'EnemyDied', faintedPet);
            this.triggerAbility(pet, 'PetDied', faintedPet);
            this.handleNumberedCounterTriggers(
                pet,
                faintedPet,
                undefined,
                this.getNumberedTriggersForPet(pet, 'EnemyFaint')
            );
        }
    }

    //food events handler
    triggerFoodEvents(eatingPet: Pet, foodType?: string) {
        // Check friends
        for (let pet of this.getTeam(eatingPet)) {
            this.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
            this.triggerAbility(pet, 'FoodEatenByFriendly', eatingPet);
            if (pet == eatingPet) {
                this.triggerAbility(pet, 'FoodEatenByThis', eatingPet);
                // Handle specific food types for this pet
                if (foodType === 'apple') {
                    this.triggerAbility(pet, 'AppleEatenByThis', eatingPet);
                    this.handleNumberedCounterTriggers(
                        pet,
                        eatingPet,
                        undefined,
                        this.getNumberedTriggersForPet(pet, 'AppleEatenByThis')
                    );
                } else if (foodType === 'corn') {
                    this.triggerAbility(pet, 'CornEatenByThis', eatingPet);
                }
                this.handleNumberedCounterTriggers(
                    pet,
                    eatingPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'Eat')
                );
            } else {
                this.triggerAbility(pet, 'FoodEatenByFriend', eatingPet);
                // Specific food types for friends
                if (foodType === 'corn') {
                    this.triggerAbility(pet, 'CornEatenByFriend', eatingPet);
                }
            }
        }

        // Check enemies
        for (let pet of this.getTeam(eatingPet.parent?.opponent)) {
            this.triggerAbility(pet, 'FoodEatenByAny', eatingPet);
        }
    }

    // perk gain events handler
    triggerPerkGainEvents(perkPet: Pet, perkType?: string) {
        // Check friends
        for (let pet of this.getTeam(perkPet)) {
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
        for (let pet of this.getTeam(perkPet)) {
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
        for (let pet of this.getTeam(perkPet.parent?.opponent)) {
            this.triggerAbility(pet, 'PetLostPerk', perkPet);
        }
    }
    // ailment events handler
    triggerAilmentGainEvents(ailmentPet: Pet, ailmentType?: string) {
        // Check friends
        for (let pet of this.getTeam(ailmentPet)) {
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
        for (let pet of this.getTeam(ailmentPet.parent?.opponent)) {
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
        for (let pet of this.getTeam(transformedPet)) {
            if (pet == transformedPet) {
                this.triggerAbility(pet, 'ThisTransformed', transformedPet);
            } else {
                this.triggerAbility(pet, 'FriendTransformed', transformedPet);
                this.handleNumberedCounterTriggers(
                    pet,
                    transformedPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendTransformed')
                );
            }
        }
    }
    // Consolidated movement events handler
    triggerFlungEvents(movedPet: Pet) {
        // Handle friend fling events
        for (let pet of this.getTeam(movedPet)) {
            this.triggerAbility(pet, 'AnyoneFlung', movedPet);
            if (pet != movedPet) {
                this.triggerAbility(pet, 'FriendFlung', movedPet);
            }
        }

        for (let pet of this.getTeam(movedPet.parent?.opponent)) {
            this.triggerAbility(pet, 'AnyoneFlung', movedPet);
        }
    }

    triggerPushedEvents(pushedPet: Pet) {
        for (let pet of this.getTeam(pushedPet.parent?.opponent)) {
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
        for (let pet of this.getTeam(hurtedPet)) {
            this.triggerAbility(pet, 'AnyoneHurt', hurtedPet, customParams);
            if (pet == hurtedPet) {
                this.triggerAbility(pet, 'ThisHurt', hurtedPet, customParams);
                this.handleNumberedCounterTriggers(
                    pet,
                    hurtedPet,
                    customParams,
                    this.getNumberedTriggersForPet(pet, 'ThisHurt')
                );
            } else {
                this.triggerAbility(pet, 'FriendHurt', hurtedPet, customParams);
                this.handleNumberedCounterTriggers(
                    pet,
                    hurtedPet,
                    customParams,
                    this.getNumberedTriggersForPet(pet, 'FriendHurt')
                );
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
        for (let pet of this.getTeam(hurtedPet.parent?.opponent)) {
            this.triggerAbility(pet, 'EnemyHurt', hurtedPet, customParams)
            this.triggerAbility(pet, 'AnyoneHurt', hurtedPet, customParams);
            this.handleNumberedCounterTriggers(
                pet,
                hurtedPet,
                customParams,
                this.getNumberedTriggersForPet(pet, 'EnemyHurt')
            );
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
                this.handleNumberedCounterTriggers(
                    pet,
                    levelUpPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendlyLeveledUp')
                );
            }
        }

        // Check enemies
        for (let pet of levelUpPet.parent.opponent.petArray) {
            this.triggerAbility(pet, 'AnyLeveledUp', levelUpPet);
        }
    }

    triggerEmptyFrontSpaceEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.clearFrontTriggered) {
                continue;
            }
            this.triggerAbility(pet, 'ClearFront');
            pet.clearFrontTriggered = true;
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
        for (let pet of this.getTeam(jumpPet)) {
            this.triggerAbility(pet, 'AnyoneJumped', jumpPet);
            if (pet == jumpPet) {
                // No specific triggers for the jumping pet itself
            } else {
                this.triggerAbility(pet, 'FriendJumped', jumpPet);
                this.handleNumberedCounterTriggers(
                    pet,
                    jumpPet,
                    undefined,
                    this.getNumberedTriggersForPet(pet, 'FriendJumped')
                );
            }
        }

        // Check enemies
        for (let pet of this.getTeam(jumpPet.parent?.opponent)) {
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
        for (let pet of this.getTeam(ExpPet)) {
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
