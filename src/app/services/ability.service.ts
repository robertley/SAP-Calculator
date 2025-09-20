import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { clone, cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { Pet } from "../classes/pet.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { LogService } from "./log.service";
import { AbilityTrigger } from "../classes/ability.class";

@Injectable({
    providedIn: "root"
})
export class AbilityService {

    public gameApi: GameAPI;
    private afterAttackEvents: AbilityEvent[]= [];
    private beforeAttackEvents: AbilityEvent[]= [];
    private processedBeforeAttackPets: Set<Pet> = new Set();
    private beforeStartOfBattleEvents: AbilityEvent[]= [];
    private equipmentBeforeAttackEvents: AbilityEvent[]= []; // egg
    private afterFriendAttackEvents: AbilityEvent[]= []; // unified friend + enemy attack events
    private beforeFriendAttacksEvents: AbilityEvent[] = [];
    private friendGainsHealthEvents: AbilityEvent[]= [];
    private friendGainedExperienceEvents: AbilityEvent[] = [];

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
        'EnemyJumped': 8,
        'AnyoneJumped': 8,
        //'FriendJumpedOrTransformed': 8,

        // Death/Faint events
        'BeforeThisDies': 9,
        //'ThisDiesForPerks': 9,
        'FriendAheadDied': 10,
        'ThisDied': 11,
        'FriendDied': 12,
        'AdjacentFriendsDie': 12,
        'EnemyDied': 12,
        'EnemyFaint': 12,
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
        'ThisKilled': 13,
        'ThisKilledEnemy': 13,

        // Transform events
        'ThisTransformed': 14,
        'FriendTransformed': 14.5,
        'FriendTransformedInBattle': 14.5,
        'BeforeFriendTransformed': 14.5,

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
        'FriendFainted5': 17,
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
        'EnemyAttacked8': 17,
        'EnemyAttacked10': 17,

        // Ability counter events
        'FriendlyAbilityActivated5': 17,

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
        'FriendlyGainedPerk': 20,
        'ThisGainedPerkOrAilment': 20,
        'FriendGainedStrawberry': 20,
        'FriendlyGainedStrawberry': 20,

        // Ailment events
        'ThisGainedAilment': 19,
        'FriendGainsAilment': 20,
        'FriendlyGainedAilment': 20,
        'EnemyGainedAilment': 20,
        'PetGainedAilment': 20,
        'AnyoneGainedAilment': 20,
        'AnyoneGainedWeak': 20,

        // Special movement
        'FriendFlung': 21,
        'AnyoneFlung': 21,

        // Mana snipe
        'manaSnipe': 22,

        // Space/positioning events
        'emptyFrontSpace': 23,

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


    // Trigger start battle events for new system
    triggerStartBattleEvents(player: Player) {
        for (let pet of player.petArray) {
            this.setStartBattleEvent({
                priority: pet.attack,
                callback: () => { pet.executeAbilities('StartBattle', this.gameApi); },
                pet: pet
            });
        }
    }

    // Helper method to trigger abilities in the new system
    private triggerNewAbilitySystem(pets: Pet[], trigger: AbilityTrigger, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const gameApi = this.gameService.gameApi;

        for (const pet of pets) {
            const matchingAbilities = pet.getAbilities(trigger);

            for (const ability of matchingAbilities) {
                if (ability.canUse(triggerPet, tiger, pteranodon)) {
                    // Create an AbilityEvent for the global queue
                    const abilityEvent: AbilityEvent = {
                        callback: () => ability.execute(gameApi, triggerPet, tiger, pteranodon),
                        priority: pet.attack, // Use pet attack for priority, rely on type-based priority from ABILITY_PRIORITIES
                        pet: pet,
                        triggerPet: triggerPet,
                        abilityType: trigger,
                        tieBreaker: Math.random()
                    };

                    this.addEventToQueue(abilityEvent);
                }
            }
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
            
            // If transformed pet has the same ability method, execute on transformed pet
            if (typeof transformedPet[event.abilityType] === 'function') {
                // Replace the callback with the transformed pet's method
                event.callback = transformedPet[event.abilityType].bind(transformedPet);
            } else {
                // Transformed pet doesn't have this ability method - skip execution
                return;
            }
        }
        
        event.callback(event.abilityType, gameApi,event.triggerPet);
    }

    // End of Turn Events

    initEndTurnEvents(player: Player) {
        let endTurnEvents: AbilityEvent[] = [];
        for (let pet of player.petArray) {
            if (pet.endTurn) {
                endTurnEvents.push({
                    callback: pet.endTurn.bind(pet),
                    priority: pet.attack,
                    player: player
                })
            }
        }

        endTurnEvents = shuffle(endTurnEvents);

        endTurnEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of endTurnEvents) {
            event.callback(this.gameService.gameApi);
        }
    }
    //counter
    setCounterEvent(event: AbilityEvent) {
        event.abilityType = 'counter';
        this.addEventToQueue(event);
    }

    // Hurt
    setHurtEvent(event: AbilityEvent) {
        event.abilityType = 'hurt';
        this.addEventToQueue(event);
    }

    // Faint
    setFaintEvent(event: AbilityEvent) {
        event.abilityType = 'faint';
        this.addEventToQueue(event);
    }

    // New trigger system event methods
    setThisDiedEvent(event: AbilityEvent) {
        event.abilityType = 'ThisDied';
        this.addEventToQueue(event);
    }


    setThisAttackedEvent(event: AbilityEvent) {
        event.abilityType = 'thisAttacked';
        this.addEventToQueue(event);
    }

    setThisHurtEvent(event: AbilityEvent) {
        event.abilityType = 'ThisHurt';
        this.addEventToQueue(event);
    }

    setStartBattleEvent(event: AbilityEvent) {
        event.abilityType = 'startBattle';
        this.addEventToQueue(event);
    }

    // Summoned
    setSummonedEvent(event: AbilityEvent) {
        event.abilityType = 'summoned';
        // Extract executing pet from callback if not already set
        this.addEventToQueue(event);
    }
    
    // Firend Summoned
    triggerFriendSummonedEvents(summonedPet: Pet) {
        this.triggerFriendSummonedToyEvents(summonedPet.parent, summonedPet);
        for (let pet of summonedPet.parent.petArray) {
            // fixes bug with mushroom
            if (pet == summonedPet) {
                continue;
            }
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendSummoned != null) {
                this.setFriendSummonedEvent({
                    callback: pet.friendSummoned.bind(pet),
                    priority: pet.attack,
                    triggerPet: summonedPet,
                    pet: pet
                })
            }
        }
    }

    setFriendSummonedEvent(event: AbilityEvent) {
        event.abilityType = 'friendSummoned';
        this.addEventToQueue(event);
    }


    // after attacks events
    
    setAfterAttackEvent(event: AbilityEvent) {
        this.afterAttackEvents.push(event);
    }

    resetAfterAttackEvents() {
        this.afterAttackEvents = [];
    }

    executeAfterAttackEvents() {
        // shuffle, so that same priority events are in random order
        this.afterAttackEvents = shuffle(this.afterAttackEvents);

        this.afterAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.afterAttackEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetAfterAttackEvents();
    }

    // friend ahead feints events
    
    setFriendAheadFaintsEvent(event: AbilityEvent) {
        event.abilityType = 'friendAheadFaints';
        this.addEventToQueue(event);
    }

    // knockout events
    
    setKnockOutEvent(event: AbilityEvent) {
        event.abilityType = 'knockOut';
        this.addEventToQueue(event);
    }

    // friend faints

    triggerFriendFaintsEvents(faintedPet: Pet) {
        this.triggerFriendFaintsToyEvents(faintedPet.parent, faintedPet);

        // Legacy system
        for (let pet of faintedPet.parent.petArray) {
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendFaints != null) {
                this.setFriendFaintsEvent({
                    callback: pet.friendFaints.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: faintedPet
                })
            }
        }

        // New ability system - check for Tiger behind each pet and pass as triggerPet
        for (let pet of faintedPet.parent.petArray) {
            const tigerBehind = pet.petBehind(true, true)?.name === 'Tiger' ? pet.petBehind(true, true) : undefined;
            this.triggerNewAbilitySystem([pet], 'FriendDied', tigerBehind || faintedPet, false, false);
        }
    }

    setFriendFaintsEvent(event: AbilityEvent) {
        event.abilityType = 'friendFaints';
        this.addEventToQueue(event);
    }
    triggerEnemyFaintsEvents(faintedPet: Pet) {
        // Legacy system
        for (let pet of faintedPet.parent.opponent.petArray.filter(p => p.alive)) {
            if (pet.enemyFaints != null) {
                this.setenemyFaintsEvent({
                    callback: pet.enemyFaints.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: faintedPet
                })
            }
        }

        // New ability system with counter triggers
        for (let pet of faintedPet.parent.opponent.petArray.filter(p => p.alive)) {
            // Increment the pet's ability counter for enemy faint events
            pet.abilityCounter++;

            // Check for Tiger behind this pet and pass as triggerPet
            const tigerBehind = pet.petBehind(true, true)?.name === 'Tiger' ? pet.petBehind(true, true) : undefined;

            // Trigger main enemyFaints event
            this.triggerNewAbilitySystem([pet], 'EnemyFaint', tigerBehind || faintedPet, false, false);

            // Trigger counter-based events based on abilityCounter
            let counterTrigger: string = '';
            switch (pet.abilityCounter) {
                case 2:
                    counterTrigger = 'enemyFaints2';
                    break;
                case 3:
                    counterTrigger = 'enemyFaints3';
                    break;
                case 4:
                    counterTrigger = 'enemyFaints4';
                    break;
                case 5:
                    counterTrigger = 'enemyFaints5';
                    break;
            }

            if (counterTrigger) {
                this.triggerNewAbilitySystem([pet], counterTrigger as any, tigerBehind || faintedPet, false, false);
            }
        }
    }
    setenemyFaintsEvent(event: AbilityEvent) {
        event.abilityType = 'enemyFaints';
        this.addEventToQueue(event);
    }

    // before attack

    setBeforeAttackEvent(event: AbilityEvent) {
        this.beforeAttackEvents.push(event);
        
        // Mark the pet as processed to prevent duplicate events
        // if (event.pet) {
        //     this.processedBeforeAttackPets.add(event.pet);
        // }
    }

    resetBeforeAttackEvents() {
        this.beforeAttackEvents = [];
    }
    //TO DO: Probably can remove this
    checkAndAddNewBeforeAttackEvents() {
        let gameApi = this.gameService.gameApi;

        // New trigger system for BeforeThisAttacks
        if (gameApi.player.pet0 && !this.processedBeforeAttackPets.has(gameApi.player.pet0)) {
            this.setBeforeAttackEvent({
                priority: gameApi.player.pet0.attack,
                callback: () => { gameApi.player.pet0.executeAbilities('BeforeThisAttacks', gameApi); },
                pet: gameApi.player.pet0
            });
        }
        if (gameApi.opponet.pet0 && !this.processedBeforeAttackPets.has(gameApi.opponet.pet0)) {
            this.setBeforeAttackEvent({
                priority: gameApi.opponet.pet0.attack,
                callback: () => { gameApi.opponet.pet0.executeAbilities('BeforeThisAttacks', gameApi); },
                pet: gameApi.opponet.pet0
            });
        }

        // Legacy system for backwards compatibility
        // Check player's first pet
        if (gameApi.player.pet0 && gameApi.player.pet0.beforeAttack && !this.processedBeforeAttackPets.has(gameApi.player.pet0)) {
            this.beforeAttackEvents.push({
                callback: gameApi.player.pet0.beforeAttack.bind(gameApi.player.pet0),
                priority: gameApi.player.pet0.attack,
                player: gameApi.player
            });
            this.processedBeforeAttackPets.add(gameApi.player.pet0);
            // Re-sort the array to maintain priority order
            this.beforeAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});
        }

        // Check opponent's first pet
        if (gameApi.opponet.pet0 && gameApi.opponet.pet0.beforeAttack && !this.processedBeforeAttackPets.has(gameApi.opponet.pet0)) {
            this.beforeAttackEvents.push({
                callback: gameApi.opponet.pet0.beforeAttack.bind(gameApi.opponet.pet0),
                priority: gameApi.opponet.pet0.attack,
                player: gameApi.opponet
            });
            this.processedBeforeAttackPets.add(gameApi.opponet.pet0);
            // Re-sort the array to maintain priority order
            this.beforeAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});
        }
    }

    executeBeforeAttackEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeAttackEvents = shuffle(this.beforeAttackEvents);

        this.beforeAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        // Use queue-based approach to handle events being added during execution
        while (this.beforeAttackEvents.length > 0) {
            let event = this.beforeAttackEvents.shift();
            event.callback(this.gameService.gameApi);
        }
        
        // Clear the set of processed pets after all events are executed
        //this.processedBeforeAttackPets.clear();
        this.resetBeforeAttackEvents();
    }

    // equipment before attack

    setEqiupmentBeforeAttackEvent(event: AbilityEvent) {
        this.equipmentBeforeAttackEvents.push(event);
    }

    resetEqiupmentBeforeAttackEvents() {
        this.equipmentBeforeAttackEvents = [];
    }

    executeEqiupmentBeforeAttackEvents() {
        // shuffle, so that same priority events are in random order
        this.equipmentBeforeAttackEvents = shuffle(this.equipmentBeforeAttackEvents);

        this.equipmentBeforeAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.equipmentBeforeAttackEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetEqiupmentBeforeAttackEvents();
    }

    
    get hasEquipmentBeforeAttackEvents() {
        return this.equipmentBeforeAttackEvents.length > 0;
    }

    // friend lost perk
    triggerFriendLostPerkEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            // if (pet == perkPet) {
            //      return;
            // }
            if (pet.friendLostPerk != null) {
                this.setFriendLostPerkEvent({
                    callback: pet.friendLostPerk.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: perkPet
                })
            }
        }
    }

    setFriendLostPerkEvent(event: AbilityEvent) {
        event.abilityType = 'friendLostPerk';
        this.addEventToQueue(event);
    }
    //eats Food

    setEatsFoodEvent(event: AbilityEvent) {
        event.abilityType = 'eatsFood';
        this.addEventToQueue(event);
    }

    //friend Ate Food
    triggerFriendAteFoodEvents(foodPet: Pet) {
        for (let pet of foodPet.parent.petArray) {
            if (pet.friendAteFood != null) {
                this.setFriendAteFoodEvent({
                    callback: pet.friendAteFood.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: foodPet
                })
            }
        }
    }

    setFriendAteFoodEvent(event: AbilityEvent) {
        event.abilityType = 'friendAteFood';
        this.addEventToQueue(event);
    }    // gained perk

    triggerGainedPerkEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            if (pet != perkPet) {
                 continue;
            }
            if (pet.gainedPerk != null) {
                this.setGainedPerkEvent({
                    callback: pet.gainedPerk.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: perkPet
                })
            }
        }
    }

    setGainedPerkEvent(event: AbilityEvent) {
        event.abilityType = 'gainPerk';
        this.addEventToQueue(event);
    }

    // friend gained perk

    triggerFriendGainedPerkEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            // if (pet == perkPet) {
            //      return;
            // }
            if (pet.friendGainedPerk != null) {
                this.setFriendGainedPerkEvent({
                    callback: pet.friendGainedPerk.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: perkPet
                })
            }
        }
    }

    setFriendGainedPerkEvent(event: AbilityEvent) {
        event.abilityType = 'friendGainedPerk';
        this.addEventToQueue(event);
    }

    // before start of battle

    triggerBeforeStartOfBattleEvents(player: Player) {
        // New trigger system
        this.triggerNewAbilitySystem(player.petArray, 'BeforeStartBattle');

        // Legacy system for backwards compatibility
        for (let pet of player.petArray) {
            if (pet.beforeStartOfBattle != null) {
                this.setBeforeStartOfBattleEvent({
                    callback: pet.beforeStartOfBattle.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    player: player
                })
            }
        }
    }

    setBeforeStartOfBattleEvent(event: AbilityEvent) {
        this.beforeStartOfBattleEvents.push(event);
    }

    resetBeforeStartOfBattleEvents() {
        this.beforeStartOfBattleEvents = [];
    }

    executeBeforeStartOfBattleEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeStartOfBattleEvents = shuffle(this.beforeStartOfBattleEvents);

        this.beforeStartOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.beforeStartOfBattleEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetBeforeStartOfBattleEvents();
    }

    // friend gained ailment
    
    triggerFriendGainedAilmentEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            if (pet.friendGainedAilment != null) {
                this.setFriendGainedAilmentEvent({
                    callback: pet.friendGainedAilment.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: perkPet
                })
            }
        }
    }

    setFriendGainedAilmentEvent(event: AbilityEvent) {
        event.abilityType = 'friendGainedAilment';
        this.addEventToQueue(event);
    }

    // enemy gained ailment
    
    triggerEnemyGainedAilmentEvents(opponentPets: Pet[], perkPet: Pet) {
        for (let pet of opponentPets) {
            if (pet.enemyGainedAilment != null) {
                this.setEnemyGainedAilmentEvent({
                    callback: pet.enemyGainedAilment.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: perkPet
                })
            }
        }
    }

    setEnemyGainedAilmentEvent(event: AbilityEvent) {
        event.abilityType = 'enemyGainedAilment';
        this.addEventToQueue(event);
    }

    
    // friendly toy broke
    
    triggerFriendlyToyBrokeEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.friendlyToyBroke != null) {
                this.setFriendlyToyBrokeEvent({
                    callback: pet.friendlyToyBroke.bind(pet),
                    priority: pet.attack,
                    pet: pet
                })
            }
        }
    }

    setFriendlyToyBrokeEvent(event: AbilityEvent) {
        event.abilityType = 'friendlyToyBroke';
        this.addEventToQueue(event);
    }

    // trnasform

    triggerTransformEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.transform != null) {
                this.setTransformEvent({
                    callback: pet.transform.bind(pet),
                    priority: pet.attack,
                    pet: pet
                })
            }
        }
    }
    
    setTransformEvent(event: AbilityEvent) {
        event.abilityType = 'transform';
        this.addEventToQueue(event);
    }

    // friend transformed
    
    triggerFriendTransformedEvents(player: Player, transformedPet: Pet) {
        for (let pet of player.petArray) {
            if (pet == transformedPet) {
                continue;
            }
            if (pet.friendTransformed != null) {
                this.setFriendTransformedEvent({
                    callback: pet.friendTransformed.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: transformedPet
                })
            }
        }
    }

    setFriendTransformedEvent(event: AbilityEvent) {
        event.abilityType = 'friendTransformed';
        this.addEventToQueue(event);
    }

    // enemy summoned

    triggerEnemySummonedEvents(player: Player, summonPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.enemySummoned != null) {
                this.setEnemySummonedEvent({
                    callback: pet.enemySummoned.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: summonPet
                })
            }
        }
    }
    
    setEnemySummonedEvent(event: AbilityEvent) {
        event.abilityType = 'enemySummoned';
        this.addEventToQueue(event);
    }

    // enemy pushed events

    triggerEnemyPushedEvents(player: Player, pushedPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.enemyPushed != null) {
                this.setEnemyPushedEvent({
                    callback: pet.enemyPushed.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: pushedPet
                })
            }
        }
    }
    
    setEnemyPushedEvent(event: AbilityEvent) {
        event.abilityType = 'enemyPushed';
        this.addEventToQueue(event);
    }

    // friend hurt events

    triggerFriendHurtEvents(player: Player, hurtPet: Pet) {
        // New trigger system
        this.triggerNewAbilitySystem(player.petArray, 'FriendHurt', hurtPet);

        // Legacy system for backwards compatibility
        for (let pet of player.petArray) {
            if (pet.friendHurt != null) {
                this.setFriendHurtEvent({
                    callback: pet.friendHurt.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: hurtPet
                })
            }
        }
    }
    
    setFriendHurtEvent(event: AbilityEvent) {
        event.abilityType = 'friendHurt';
        this.addEventToQueue(event);
    }

    // levl up events

    triggerLevelUpEvents(player: Player, levelUpPet: Pet) {
        this.triggerFriendlyLevelUpToyEvents(player, levelUpPet);
        for (let pet of player.petArray) {
            if (pet.anyoneLevelUp != null) {
                this.setLevelUpEvent({
                    callback: pet.anyoneLevelUp.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: levelUpPet
                })
            }
        }
    }
    
    setLevelUpEvent(event: AbilityEvent) {
        event.abilityType = 'levelUp';
        this.addEventToQueue(event);
    }

    // empty front space events


    triggerEmptyFrontSpaceEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.emptyFrontSpace != null) {
                this.setEmptyFrontSpaceEvent({
                    callback: pet.emptyFrontSpace.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                })
            }
        }
    }
    
    setEmptyFrontSpaceEvent(event: AbilityEvent) {
        event.abilityType = 'emptyFrontSpace';
        this.addEventToQueue(event);
    }

    // enemy hurt events

    /**
     * 
     * @param player opposite player of the pet that was hurt
     * @param pet pet that was hurt
     */
    triggerEnemyHurtEvents(player: Player, hurtPet: Pet) {
        // New trigger system
        this.triggerNewAbilitySystem(player.petArray, 'EnemyHurt', hurtPet);

        // Legacy system for backwards compatibility
        for (let pet of player.petArray) {
            if (pet.enemyHurt != null) {
                this.setEnemyHurtEvent({
                    callback: pet.enemyHurt.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: hurtPet
                })
            }
        }
    }
    
    setEnemyHurtEvent(event: AbilityEvent) {
        event.abilityType = 'enemyHurt';
        this.addEventToQueue(event);
    }

    // friend attacks events

    triggerFriendAttacksEvents(player: Player, attacksPet: Pet) {
        // Add friendAttacks to unified system
        for (let pet of player.petArray) {
            if (pet == attacksPet) {
                continue;
            }
            if (pet.friendAttacks != null) {
                this.setAfterFriendAttackEvent({
                    callback: () => pet.friendAttacks(this.gameApi, attacksPet, false),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: attacksPet,
                    abilityType: 'friendAttacks'
                })
            }
        }
        
        // Add friendAheadAttacks to unified system
        if (attacksPet.petBehind(null, true)?.friendAheadAttacks != null) {
            this.setAfterFriendAttackEvent({
                callback: attacksPet.petBehind(null, true).friendAheadAttacks.bind(attacksPet.petBehind(null, true)),
                priority: attacksPet.petBehind(null, true).attack,
                pet: attacksPet.petBehind(null, true),
                triggerPet: attacksPet,
                abilityType: 'friendAheadAttacks'
            });
        }
        
        // Add adjacentAttacked to unified system
        // Check pet ahead
        if (attacksPet.petAhead?.adjacentAttacked != null) {
            this.setAfterFriendAttackEvent({
                callback: () => attacksPet.petAhead.adjacentAttacked(this.gameApi, attacksPet),
                priority: attacksPet.petAhead.attack,
                pet: attacksPet.petAhead,
                triggerPet: attacksPet,
                abilityType: 'adjacentFriendAttacks'
            });
        }
        // Check pet behind
        if (attacksPet.petBehind(null, true)?.adjacentAttacked != null) {
            this.setAfterFriendAttackEvent({
                callback: () => attacksPet.petBehind(null, true).adjacentAttacked(this.gameApi, attacksPet),
                priority: attacksPet.petBehind(null, true).attack,
                pet: attacksPet.petBehind(null, true),
                triggerPet: attacksPet,
                abilityType: 'adjacentFriendAttacks'
            });
        }
        
        // Trigger enemy attack events for the opponent
        this.triggerEnemyAttackEvents(attacksPet.parent.opponent, attacksPet);
    }

    // before friend attacks events

    triggerBeforeFriendAttacksEvents(player: Player, attackingPet: Pet) {
        for (let pet of player.petArray) {
            if (pet === attackingPet) {
                continue;
            }
            if (pet.beforeFriendAttacks != null) {
                this.setBeforeFriendAttacksEvent({
                    callback: pet.beforeFriendAttacks.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: attackingPet
                });
            }
        }
    }
    
    setBeforeFriendAttacksEvent(event: AbilityEvent) {
        this.beforeFriendAttacksEvents.push(event);
    }
    
    private resetBeforeFriendAttacksEvents() {
        this.beforeFriendAttacksEvents = [];
    }
    
    executeBeforeFriendAttacksEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeFriendAttacksEvents = shuffle(this.beforeFriendAttacksEvents);
    
        this.beforeFriendAttacksEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});
    
        for (let event of this.beforeFriendAttacksEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, false);
        }
        
        this.resetBeforeFriendAttacksEvents();
    }

    // unified after friend attack events (combines friendAttacks, friendAheadAttacks, enemyAttacks)
    
    setAfterFriendAttackEvent(event: AbilityEvent) {
        this.afterFriendAttackEvents.push(event);
    }

    resetAfterFriendAttackEvents() {
        this.afterFriendAttackEvents = [];
    }

    executeAfterFriendAttackEvents() {
        // shuffle, so that same priority events are in random order
        this.afterFriendAttackEvents = shuffle(this.afterFriendAttackEvents);

        // Sort by pet attack priority (higher attack = higher priority)
        this.afterFriendAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.afterFriendAttackEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, false);
        }
        
        this.resetAfterFriendAttackEvents();
    }

    // enemy attack events
    
    triggerEnemyAttackEvents(player: Player, attackingEnemyPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.enemyAttack != null) {
                this.setAfterFriendAttackEvent({
                    callback: pet.enemyAttack.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: attackingEnemyPet,
                    abilityType: 'enemyAttack'
                });
            }
        }
    }

    // friend jumped events

    triggerFriendJumpedEvents(player: Player, jumpPet: Pet) {
        for (let pet of player.petArray) {
            if (pet == jumpPet) {
                continue;
            }
            if (pet.friendJumped != null) {
                this.setFriendJumpedEvent({
                    callback: pet.friendJumped.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: jumpPet
                })
            }
        }
    }
    
    setFriendJumpedEvent(event: AbilityEvent) {
        event.abilityType = 'friendJumped';
        this.addEventToQueue(event);
    }

    // enemy jumped events
    triggerEnemyJumpedEvents(player: Player, jumpPet: Pet) {
        for (let pet of player.opponent.petArray) {
            if (pet.enemyJumped != null) {
                this.setEnemyJumpedEvent({
                    callback: pet.enemyJumped.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: jumpPet
                })
            }
        }
    }
    
    setEnemyJumpedEvent(event: AbilityEvent) {
        event.abilityType = 'enemyJumped';
        this.addEventToQueue(event);
    }

    // mana events
    setManaEvent(event: AbilityEvent) {
        event.abilityType = 'manaSnipe';
        this.addEventToQueue(event);
    }

    setGainManaEvents(event: AbilityEvent) {
        event.abilityType = 'gainsMana';
        this.addEventToQueue(event);
    }

    // friend gains health events
    triggerFriendGainsHealthEvents(player: Player, healthPet: Pet) {
        for (let pet of player.petArray) {
            if (pet == healthPet) {
                continue;
            }
            if (pet.friendGainsHealth != null) {
                this.setFriendGainsHealthEvent({
                    callback: pet.friendGainsHealth.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    triggerPet: healthPet
                })
            }
        }
    }

    setFriendGainsHealthEvent(event: AbilityEvent) {
        this.friendGainsHealthEvents.push(event);
    }

    resetFriendGainsHealthEvents() {
        this.friendGainsHealthEvents = [];
    }

    executeFriendGainsHealthEvents() {
        // shuffle, so that same priority events are in random order
        this.friendGainsHealthEvents = shuffle(this.friendGainsHealthEvents);

        this.friendGainsHealthEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendGainsHealthEvents) {
            event.callback(this.gameApi, event.triggerPet);
        }

        
        this.resetFriendGainsHealthEvents();
    }

    triggerFriendGainedExperienceEvents(player: Player, pet: Pet) {
        for (let p of player.petArray) {
            if (p === pet) {
                continue;
            }
            if (p.friendGainedExperience != null) {
                this.setFriendGainedExperienceEvent({
                    callback: p.friendGainedExperience.bind(p),
                    priority: p.attack,
                    pet: p,
                    triggerPet: pet
                });
            }
        }
    }

    setFriendGainedExperienceEvent(event: AbilityEvent) {
        this.friendGainedExperienceEvents.push(event);
    }

    setAfterFaintEvents(event: AbilityEvent) {
        event.abilityType = 'afterFaint';
        this.addEventToQueue(event);
    }

    // toy events


    // empty front space events

    triggerEmptyFrontSpaceToyEvents(player: Player) {
        if (player.toy?.emptyFromSpace != null) {
            if (player.toy.used) {
                return;
            }
            this.setEmptyFrontSpaceToyEvent(
                {
                    callback: player.toy.emptyFromSpace.bind(player.toy),
                    priority: 100,
                    level: player.toy.level
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setEmptyFrontSpaceToyEvent(
                    {
                        callback: player.toy.emptyFromSpace.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level
                    }
                );
            }
        }


    }
    

    setEmptyFrontSpaceToyEvent(event: AbilityEvent) {
        this.emptyFrontSpaceToyEvents.push(event);
    }

    private resetEmptyFrontSpaceToyEvents() {
        this.emptyFrontSpaceToyEvents = [];
    }

    executeEmptyFrontSpaceToyEvents() {
        // shuffle, so that same priority events are in random order
        this.emptyFrontSpaceToyEvents = shuffle(this.emptyFrontSpaceToyEvents);

        this.emptyFrontSpaceToyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.emptyFrontSpaceToyEvents) {
            event.callback(this.gameService.gameApi, event.priority < 100, event.level, event.priority);
        }
        
        this.resetEmptyFrontSpaceToyEvents();
    }

    // Toy events


    // friend summoned toy events

    triggerFriendSummonedToyEvents(player: Player, pet: Pet) {
        if (player.toy?.friendSummoned != null) {
            this.setFriendSummonedToyEvent(
                {
                    callback: player.toy.friendSummoned.bind(player.toy),
                    priority: 100,
                    level: player.toy.level,
                    triggerPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendSummonedToyEvent(
                    {
                        callback: player.toy.friendSummoned.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        triggerPet: pet
                    }
                );
            }
        }
    }

    setFriendSummonedToyEvent(event: AbilityEvent) {
        this.friendSummonedToyEvents.push(event);
    }

    private resetFriendSummonedToyEvents() {
        this.friendSummonedToyEvents = [];
    }

    executeFriendSummonedToyEvents() {
        // shuffle, so that same priority events are in random order
        this.friendSummonedToyEvents = shuffle(this.friendSummonedToyEvents);

        this.friendSummonedToyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendSummonedToyEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        }
        
        this.resetFriendSummonedToyEvents();
    }

    // friendly level up toy events

    triggerFriendlyLevelUpToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendlyLevelUp != null) {
            this.setFriendlyLevelUpToyEvent(
                {
                    callback: player.toy.friendlyLevelUp.bind(player.toy),
                    priority: 100,
                    level: player.toy.level,
                    triggerPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendlyLevelUpToyEvent(
                    {
                        callback: player.toy.friendlyLevelUp.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        triggerPet: pet
                    }
                );
            }
        }
    }

    setFriendlyLevelUpToyEvent(event: AbilityEvent) {
        this.friendlyLevelUpToyEvents.push(event);
    }

    private resetFriendlyLevelUpToyEvents() {
        this.friendlyLevelUpToyEvents = [];
    }

    executeFriendlyLevelUpToyEvents() {
        // shuffle, so that same priority events are in random order
        this.friendlyLevelUpToyEvents = shuffle(this.friendlyLevelUpToyEvents);

        this.friendlyLevelUpToyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendlyLevelUpToyEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        }
        
        this.resetFriendlyLevelUpToyEvents();
    }

    // friend faints toy events

    triggerFriendFaintsToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendFaints != null) {
            this.setFriendFaintsToyEvent(
                {
                    callback: player.toy.friendFaints.bind(player.toy),
                    priority: 100,
                    level: player.toy.level,
                    triggerPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendFaintsToyEvent(
                    {
                        callback: player.toy.friendFaints.bind(player.toy),
                        priority: +puma.attack,
                        level: +puma.level,
                        triggerPet: pet
                    }
                );
            }
        }
    }

    setFriendFaintsToyEvent(event: AbilityEvent) {
        this.friendFaintsToyEvents.push(event);
    }

    private resetFriendFaintsToyEvents() {
        this.friendFaintsToyEvents = [];
    }

    executeFriendFaintsToyEvents() {
        // shuffle, so that same priority events are in random order
        this.friendFaintsToyEvents = shuffle(this.friendFaintsToyEvents);

        this.friendFaintsToyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendFaintsToyEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        }
        
        this.resetFriendFaintsToyEvents();
    }

    // friend jumped toy events

    triggerFriendJumpedToyEvents(player: Player, pet: Pet) {
        if (player != pet.parent) {
            return;
        }
        if (player.toy?.friendJumped != null) {
            this.setFriendJumpedToyEvent(
                {
                    callback: player.toy.friendJumped.bind(player.toy),
                    priority: 100,
                    level: player.toy.level,
                    triggerPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendJumpedToyEvent(
                    {
                        callback: player.toy.friendJumped.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        triggerPet: pet
                    }
                );
            }
        }
        
    }

    setFriendJumpedToyEvent(event: AbilityEvent) {
        this.friendJumpedToyEvents.push(event);
    }

    private resetFriendJumpedToyEvents() {
        this.friendJumpedToyEvents = [];
    }

    executeFriendJumpedToyEvents() {
        // shuffle, so that same priority events are in random order
        this.friendJumpedToyEvents = shuffle(this.friendJumpedToyEvents);

        this.friendJumpedToyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendJumpedToyEvents) {
            event.callback(this.gameService.gameApi, event.triggerPet, event.priority < 100, event.level);
        }
        
        this.resetFriendJumpedToyEvents();
    }



 
}