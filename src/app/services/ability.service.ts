import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { clone, cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { Pet } from "../classes/pet.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { LogService } from "./log.service";

@Injectable({
    providedIn: "root"
})
export class AbilityService {

    private gameApi: GameAPI;
        private hurtEvents: AbilityEvent[] = [];
    private faintEvents: AbilityEvent[] = [];
    private summonedEvents: AbilityEvent[] = [];
    private friendFaintsEvents: AbilityEvent[] = [];
    private friendAheadAttacksEvents: AbilityEvent[]= [];
    private afterAttackEvents: AbilityEvent[]= [];
    private friendAheadFaintsEvents: AbilityEvent[]= [];
    private knockOutEvents: AbilityEvent[]= [];
    private beforeAttackEvents: AbilityEvent[]= [];
    private processedBeforeAttackPets: Set<Pet> = new Set();
    private beforeStartOfBattleEvents: AbilityEvent[]= [];
    private equipmentBeforeAttackEvents: AbilityEvent[]= []; // egg
    private friendLostPerkEvents: AbilityEvent[]= []; 
    private gainedPerkEvents: AbilityEvent[]= [];
    private friendGainedPerkEvents: AbilityEvent[]= []; // TODO refactor to work like friendGainedAilment
    private friendGainedAilmentEvents: AbilityEvent[]= [];
    private enemyGainedAilmentEvents: AbilityEvent[]= [];
    private friendlyToyBrokeEvents: AbilityEvent[]= [];
    private transformEvents: AbilityEvent[]= [];
    private enemySummonedEvents: AbilityEvent[]= [];
    private friendHurtEvents: AbilityEvent[]= [];
    private levelUpEvents: AbilityEvent[]= [];
    private enemyHurtEvents: AbilityEvent[]= [];
    private emptyFrontSpaceEvents: AbilityEvent[]= [];
    private friendAttacksEvents: AbilityEvent[]= [];
    private beforeFriendAttacksEvents: AbilityEvent[] = [];
    private friendJumpedEvents: AbilityEvent[]= [];
    private manaEvents: AbilityEvent[]= [];
    private friendGainsHealthEvents: AbilityEvent[]= [];
    private friendGainedExperienceEvents: AbilityEvent[] = [];
    private afterFaintEvents: AbilityEvent[] = [];

    // toy events
    private emptyFrontSpaceToyEvents: AbilityEvent[]= [];
    private friendSummonedToyEvents: AbilityEvent[]= [];
    private friendlyLevelUpToyEvents: AbilityEvent[]= [];
    private friendFaintsToyEvents: AbilityEvent[]= [];
    private friendJumpedToyEvents: AbilityEvent[]= [];

    // Global priority queue system
    private globalEventQueue: AbilityEvent[] = [];
    
    // Priority mapping (lower number = higher priority)
    private readonly ABILITY_PRIORITIES = {
        'levelUp': 1,
        'friendLevelUp': 2,
        'friendlyLevelUp': 2,
        'hurt': 3,
        'friendHurt': 4,
        'enemyHurt': 4,
        'gainsMana': 5,
        'summoned': 6,
        'friendSummoned': 7,
        'enemySummoned': 7,
        'friendJumped': 8,
        'faint': 9,
        'friendAheadFaints': 10,
        'afterFaint': 11,
        'friendFaints': 12,
        'enemyFaints': 12,
        'friendlyToyBroke': 12,
        'knockOut': 13,
        'transformed': 14,
        'friendGainedExperience': 15,
        'friendlyAteFood': 16,
        'eatsFood': 16,
        'abilitiesWithCounters': 17,
        'friendLostPerk': 18,
        'gainPerk': 19,
        'gainAilment': 19,
        'friendlyGainedPerk': 20,
        'enemyGainedPerk': 20,
        'friendlyGainedAilment': 20,
        'enemyGainedAilment': 20,
        'petFlung': 21,
        'manaSnipe': 22,
        'emptyFrontSpace': 23,
        'goldenRetrieverSummons': 24
    };

    constructor(private gameService: GameService) {
        
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
        
        switch (event.abilityType) {
            case 'faint':
            case 'beforeStartOfBattle':
            case 'afterFaint':
            case 'equipmentBeforeAttack':
            case 'transformed':
                // Basic callback: callback(gameApi)
                event.callback(gameApi);
                break;
            case 'hurt':
            case 'friendHurt':
            case 'knockOut':
            case 'enemyHurt':
            case 'summoned':
            case 'friendAheadFaints':
            case 'friendFaints':
            case 'friendLostPerk':
            case 'gainPerk':
            case 'friendGainedPerk':
            case 'friendGainedAilment':
            case 'enemyGainedAilment':
            case 'friendGainedExperience':
            case 'levelUp':
            case 'friendAttacks':
            case 'beforeFriendAttacks':
            case 'friendJumped':
            case 'friendGainsHealth':
                // Callback with pet: callback(gameApi, callbackPet)
                event.callback(gameApi, event.callbackPet);
                break;
                
            case 'afterAttack':
            case 'enemySummoned':
            case 'friendlyToyBroke':
            case 'gainAilment':
            case 'emptyFrontSpace':
                // Callback with boolean: callback(gameApi, callbackPet, false)
                event.callback(gameApi, event.callbackPet, false);
                break;
                
            case 'friendSummoned':
            case 'friendlyLevelUp':
            case 'friendJumpedToy':
                // Toy events: callback(gameApi, callbackPet, priority < 100, level)
                event.callback(gameApi, event.callbackPet, event.priority < 100, event.level);
                break;
                
            case 'emptyFrontSpaceToy':
                // Special toy callback: callback(gameApi, priority < 100, level, priority)
                event.callback(gameApi, event.priority < 100, event.level, event.priority);
                break;
                
            case 'gainsMana':
                // Mana events might use the old gameApi field
                event.callback();
                break;
                
            default:
                // Fallback: try basic callback
                try {
                    event.callback(gameApi);
                } catch (e) {
                    // If basic fails, try with callbackPet
                    event.callback(gameApi, event.callbackPet);
                }
                break;
        }
    }

    // Migrate all existing events from type-specific arrays to global queue
    migrateExistingEventsToQueue() {
        // Add events with their ability type
        this.hurtEvents.forEach(event => {
            event.abilityType = 'hurt';
            this.addEventToQueue(event);
        });
        this.hurtEvents = [];

        this.friendHurtEvents.forEach(event => {
            event.abilityType = 'friendHurt';
            this.addEventToQueue(event);
        });
        this.friendHurtEvents = [];

        this.enemyHurtEvents.forEach(event => {
            event.abilityType = 'enemyHurt';
            this.addEventToQueue(event);
        });
        this.enemyHurtEvents = [];

        this.faintEvents.forEach(event => {
            event.abilityType = 'faint';
            this.addEventToQueue(event);
        });
        this.faintEvents = [];

        this.friendAheadFaintsEvents.forEach(event => {
            event.abilityType = 'friendAheadFaints';
            this.addEventToQueue(event);
        });
        this.friendAheadFaintsEvents = [];

        this.knockOutEvents.forEach(event => {
            event.abilityType = 'knockOut';
            this.addEventToQueue(event);
        });
        this.knockOutEvents = [];

        this.manaEvents.forEach(event => {
            event.abilityType = 'gainsMana';
            this.addEventToQueue(event);
        });
        this.manaEvents = [];

        this.summonedEvents.forEach(event => {
            event.abilityType = 'summoned';
            this.addEventToQueue(event);
        });
        this.summonedEvents = [];

        this.enemySummonedEvents.forEach(event => {
            event.abilityType = 'enemySummoned';
            this.addEventToQueue(event);
        });
        this.enemySummonedEvents = [];

        this.friendFaintsEvents.forEach(event => {
            event.abilityType = 'friendFaints';
            this.addEventToQueue(event);
        });
        this.friendFaintsEvents = [];

        this.afterFaintEvents.forEach(event => {
            event.abilityType = 'afterFaint';
            this.addEventToQueue(event);
        });
        this.afterFaintEvents = [];

        this.emptyFrontSpaceEvents.forEach(event => {
            event.abilityType = 'emptyFrontSpace';
            this.addEventToQueue(event);
        });
        this.emptyFrontSpaceEvents = [];

        // Add toy events
        this.friendSummonedToyEvents.forEach(event => {
            event.abilityType = 'friendSummoned';
            this.addEventToQueue(event);
        });
        this.friendSummonedToyEvents = [];

        this.friendFaintsToyEvents.forEach(event => {
            event.abilityType = 'friendlyToyBroke';
            this.addEventToQueue(event);
        });
        this.friendFaintsToyEvents = [];

        // Add frequent events that were previously in executeFrequentEvents()
        this.friendLostPerkEvents.forEach(event => {
            event.abilityType = 'friendLostPerk';
            this.addEventToQueue(event);
        });
        this.friendLostPerkEvents = [];

        this.gainedPerkEvents.forEach(event => {
            event.abilityType = 'gainPerk';
            this.addEventToQueue(event);
        });
        this.gainedPerkEvents = [];

        this.friendGainedPerkEvents.forEach(event => {
            event.abilityType = 'friendGainedPerk';
            this.addEventToQueue(event);
        });
        this.friendGainedPerkEvents = [];

        this.friendGainedAilmentEvents.forEach(event => {
            event.abilityType = 'friendGainedAilment';
            this.addEventToQueue(event);
        });
        this.friendGainedAilmentEvents = [];

        this.friendlyToyBrokeEvents.forEach(event => {
            event.abilityType = 'friendlyToyBroke';
            this.addEventToQueue(event);
        });
        this.friendlyToyBrokeEvents = [];

        // Add other event types
        this.levelUpEvents.forEach(event => {
            event.abilityType = 'levelUp';
            this.addEventToQueue(event);
        });
        this.levelUpEvents = [];

        this.transformEvents.forEach(event => {
            event.abilityType = 'transformed';
            this.addEventToQueue(event);
        });
        this.transformEvents = [];

        this.friendGainedExperienceEvents.forEach(event => {
            event.abilityType = 'friendGainedExperience';
            this.addEventToQueue(event);
        });
        this.friendGainedExperienceEvents = [];

        this.friendAttacksEvents.forEach(event => {
            event.abilityType = 'friendAttacks';
            this.addEventToQueue(event);
        });
        this.friendAttacksEvents = [];

        this.beforeFriendAttacksEvents.forEach(event => {
            event.abilityType = 'beforeFriendAttacks';
            this.addEventToQueue(event);
        });
        this.beforeFriendAttacksEvents = [];

        this.friendJumpedEvents.forEach(event => {
            event.abilityType = 'friendJumped';
            this.addEventToQueue(event);
        });
        this.friendJumpedEvents = [];

        this.friendGainsHealthEvents.forEach(event => {
            event.abilityType = 'friendGainsHealth';
            this.addEventToQueue(event);
        });
        this.friendGainsHealthEvents = [];

        // Add remaining toy events
        this.emptyFrontSpaceToyEvents.forEach(event => {
            event.abilityType = 'emptyFrontSpaceToy';
            this.addEventToQueue(event);
        });
        this.emptyFrontSpaceToyEvents = [];

        this.friendlyLevelUpToyEvents.forEach(event => {
            event.abilityType = 'friendlyLevelUp';
            this.addEventToQueue(event);
        });
        this.friendlyLevelUpToyEvents = [];

        this.friendJumpedToyEvents.forEach(event => {
            event.abilityType = 'friendJumpedToy';
            this.addEventToQueue(event);
        });
        this.friendJumpedToyEvents = [];
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

    // Hurt
    setHurtEvent(event: AbilityEvent) {
        event.abilityType = 'hurt';
        this.addEventToQueue(event);
    }

    private resetHurtEvents() {
        this.hurtEvents = [];
    }

    executeHurtEvents() {
        // shuffle, so that same priority events are in random order
        this.hurtEvents = shuffle(this.hurtEvents);

        this.hurtEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.hurtEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetHurtEvents();
    }

    get hasHurtEvents() {
        return this.hurtEvents.length > 0;
    }

    // Faint
    setFaintEvent(event: AbilityEvent) {
        event.abilityType = 'faint';
        this.addEventToQueue(event);
    }

    private resetFaintEvents() {
        this.faintEvents = [];
    }

    executeFaintEvents() {
        // shuffle, so that same priority events are in random order
        this.faintEvents = shuffle(this.faintEvents);

        this.faintEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.faintEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetFaintEvents();
    }

    get hasFaintEvents() {
        return this.faintEvents.length > 0;
    }

    // Summoned
    
    triggerSummonedEvents(summonedPet: Pet) {
        this.triggerFriendSummonedToyEvents(summonedPet.parent, summonedPet);
        for (let pet of summonedPet.parent.petArray) {
            // fixes bug with mushroom
            if (pet == summonedPet) {
                continue;
            }
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendSummoned != null) {
                this.setSummonedEvent({
                    callback: pet.friendSummoned.bind(pet),
                    priority: pet.attack,
                    callbackPet: summonedPet
                })
            }
        }
    }

    setSummonedEvent(event: AbilityEvent) {
        event.abilityType = 'summoned';
        this.addEventToQueue(event);
    }

    resetSummonedEvents() {
        this.summonedEvents = [];
    }

    executeSummonedEvents() {
        // shuffle, so that same priority events are in random order
        this.summonedEvents = shuffle(this.summonedEvents);

        this.summonedEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.summonedEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetSummonedEvents();
    }

    
    get hasSummonedEvents() {
        return this.summonedEvents.length > 0;
    }

    // friend ahead attacks events
    
    setFriendAheadAttacksEvents(event: AbilityEvent) {
        this.friendAheadAttacksEvents.push(event);
    }

    resetFriendAheadAttacksEvents() {
        this.friendAheadAttacksEvents = [];
    }

    executeFriendAheadAttacksEvents() {
        // shuffle, so that same priority events are in random order
        this.friendAheadAttacksEvents = shuffle(this.friendAheadAttacksEvents);

        this.friendAheadAttacksEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendAheadAttacksEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendAheadAttacksEvents();
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

    resetFriendAheadFaintsEvents() {
        this.friendAheadFaintsEvents = [];
    }

    executeFriendAheadFaintsEvents() {
        // shuffle, so that same priority events are in random order
        this.friendAheadFaintsEvents = shuffle(this.friendAheadFaintsEvents);

        this.friendAheadFaintsEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendAheadFaintsEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendAheadFaintsEvents();
    }

    get hasFriendAheadFaintsEvents() {
        return this.friendAheadFaintsEvents.length > 0;
    }

    // knockout events
    
    setKnockOutEvent(event: AbilityEvent) {
        event.abilityType = 'knockOut';
        this.addEventToQueue(event);
    }

    resetKnockOutEvents() {
        this.knockOutEvents = [];
    }

    executeKnockOutEvents() {
        // shuffle, so that same priority events are in random order
        this.knockOutEvents = shuffle(this.knockOutEvents);

        this.knockOutEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.knockOutEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetKnockOutEvents();
    }

    get hasKnockOutEvents() {
        return this.knockOutEvents.length > 0;
    }

    // friend faints

    triggerFriendFaintsEvents(faintedPet: Pet) {
        this.triggerFriendFaintsToyEvents(faintedPet.parent, faintedPet);
        for (let pet of faintedPet.parent.petArray) {
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendFaints != null) {
                this.setFriendFaintsEvent({
                    callback: pet.friendFaints.bind(pet),
                    priority: pet.attack,
                    callbackPet: faintedPet
                })
            }
        }
    }

    setFriendFaintsEvent(event: AbilityEvent) {
        event.abilityType = 'friendFaints';
        this.addEventToQueue(event);
    }

    resetFriendFaintsEvents() {
        this.friendFaintsEvents = [];
    }

    executeFriendFaintsEvents() {
        // shuffle, so that same priority events are in random order
        this.friendFaintsEvents = shuffle(this.friendFaintsEvents);

        this.friendFaintsEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendFaintsEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetFriendFaintsEvents();
    }

    get hasFriendFaintsEvents() {
        return this.friendFaintsEvents.length > 0;
    }
    

    // before attack

    setBeforeAttackEvent(event: AbilityEvent) {
        this.beforeAttackEvents.push(event);
        
        // Mark the pet as processed to prevent duplicate events
        if (event.pet) {
            this.processedBeforeAttackPets.add(event.pet);
        }
    }

    resetBeforeAttackEvents() {
        this.beforeAttackEvents = [];
    }

    checkAndAddNewBeforeAttackEvents() {
        let gameApi = this.gameService.gameApi;
        
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
            
            // Check if new first pets now have beforeAttack abilities that need to be queued
            this.checkAndAddNewBeforeAttackEvents();
        }
        
        // Clear the set of processed pets after all events are executed
        this.processedBeforeAttackPets.clear();
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
        return this.hurtEvents.length > 0;
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
                    callbackPet: perkPet
                })
            }
        }
    }

    setFriendLostPerkEvent(event: AbilityEvent) {
        event.abilityType = 'friendLostPerk';
        this.addEventToQueue(event);
    }

    resetFriendLostPerkEvents() {
        this.friendLostPerkEvents = [];
    }

    executeFriendLostPerkEvents() {
        // shuffle, so that same priority events are in random order
        this.friendLostPerkEvents = shuffle(this.friendLostPerkEvents);

        this.friendLostPerkEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendLostPerkEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendLostPerkEvents();

        
    }

    // gained perk

    triggerGainedPerkEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            if (pet != perkPet) {
                 continue;
            }
            if (pet.GainedPerk != null) {
                this.setGainedPerkEvent({
                    callback: pet.GainedPerk.bind(pet),
                    priority: pet.attack,
                    callbackPet: perkPet
                })
            }
        }
    }

    setGainedPerkEvent(event: AbilityEvent) {
        event.abilityType = 'gainPerk';
        this.addEventToQueue(event);
    }

    resetGainedPerkEvents() {
        this.gainedPerkEvents = [];
    }

    executeGainedPerkEvents() {
        // shuffle, so that same priority events are in random order
        this.gainedPerkEvents = shuffle(this.gainedPerkEvents);

        this.gainedPerkEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.gainedPerkEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetGainedPerkEvents();

        
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
                    callbackPet: perkPet
                })
            }
        }
    }

    setFriendGainedPerkEvent(event: AbilityEvent) {
        event.abilityType = 'friendGainedPerk';
        this.addEventToQueue(event);
    }

    resetFriendGainedPerkEvents() {
        this.friendGainedPerkEvents = [];
    }

    executeFriendGainedPerkEvents() {
        // shuffle, so that same priority events are in random order
        this.friendGainedPerkEvents = shuffle(this.friendGainedPerkEvents);

        this.friendGainedPerkEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendGainedPerkEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendGainedPerkEvents();

        
    }

    // before start of battle

    triggerBeforeStartOfBattleEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.beforeStartOfBattle != null) {
                this.setBeforeStartOfBattleEvent({
                    callback: pet.beforeStartOfBattle.bind(pet),
                    priority: pet.attack,
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
                    callbackPet: perkPet
                })
            }
        }
    }

    setFriendGainedAilmentEvent(event: AbilityEvent) {
        event.abilityType = 'friendGainedAilment';
        this.addEventToQueue(event);
    }

    resetFriendGainedAilmentEvents() {
        this.friendGainedAilmentEvents = [];
    }

    executeFriendGainedAilmentEvents() {
        // shuffle, so that same priority events are in random order
        // dont shuffle, want to execute in the order they happen (frigatebird)
        // this.friendGainedAilmentEvents = shuffle(this.friendGainedAilmentEvents);

        this.friendGainedAilmentEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendGainedAilmentEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendGainedAilmentEvents();

    }

    // enemy gained ailment
    
    triggerEnemyGainedAilmentEvents(opponentPets: Pet[], perkPet: Pet) {
        for (let pet of opponentPets) {
            if (pet.enemyGainedAilment != null) {
                this.setEnemyGainedAilmentEvent({
                    callback: pet.enemyGainedAilment.bind(pet),
                    priority: pet.attack,
                    callbackPet: perkPet
                })
            }
        }
    }

    setEnemyGainedAilmentEvent(event: AbilityEvent) {
        event.abilityType = 'enemyGainedAilment';
        this.addEventToQueue(event);
    }

    resetEnemyGainedAilmentEvents() {
        this.enemyGainedAilmentEvents = [];
    }

    executeEnemyGainedAilmentEvents() {
        // shuffle, so that same priority events are in random order
        // dont shuffle, want to execute in the order they happen (frigatebird)
        // this.friendGainedAilmentEvents = shuffle(this.friendGainedAilmentEvents);

        this.enemyGainedAilmentEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.enemyGainedAilmentEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetEnemyGainedAilmentEvents();

    }

    
    // friendly toy broke
    
    triggerFriendlyToyBrokeEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.friendlyToyBroke != null) {
                this.setFriendlyToyBrokeEvent({
                    callback: pet.friendlyToyBroke.bind(pet),
                    priority: pet.attack
                })
            }
        }
    }

    setFriendlyToyBrokeEvent(event: AbilityEvent) {
        event.abilityType = 'friendlyToyBroke';
        this.addEventToQueue(event);
    }

    resetFriendlyToyBrokeEvents() {
        this.friendlyToyBrokeEvents = [];
    }

    executeFriendlyToyBrokeEvents() {
        // shuffle, so that same priority events are in random order
        this.friendlyToyBrokeEvents = shuffle(this.friendlyToyBrokeEvents);

        this.friendlyToyBrokeEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendlyToyBrokeEvents) {
            event.callback(this.gameService.gameApi, false);
        }
        
        this.resetFriendlyToyBrokeEvents();

    }

    // trnasform

    triggerTransformEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.transform != null) {
                this.setTransformEvent({
                    callback: pet.transform.bind(pet),
                    priority: pet.attack
                })
            }
        }
    }
    
    setTransformEvent(event: AbilityEvent) {
        event.abilityType = 'transformed';
        this.addEventToQueue(event);
    }

    resetTransformEvents() {
        this.transformEvents = [];
    }

    executeTransformEvents() {
        // shuffle, so that same priority events are in random order
        this.transformEvents = shuffle(this.transformEvents);

        this.transformEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.transformEvents) {
            event.callback(this.gameService.gameApi, false);
        }
        
        this.resetTransformEvents();

    }

    // enemy summoned

    triggerEnemySummonedEvents(player: Player, summonPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.enemySummoned != null) {
                this.setEnemySummonedEvent({
                    callback: pet.enemySummoned.bind(pet),
                    priority: pet.attack,
                    callbackPet: summonPet
                })
            }
        }
    }
    
    setEnemySummonedEvent(event: AbilityEvent) {
        event.abilityType = 'enemySummoned';
        this.addEventToQueue(event);
    }

    resetEnemySummonedEvents() {
        this.enemySummonedEvents = [];
    }

    executeEnemySummonedEvents() {
        // shuffle, so that same priority events are in random order
        this.enemySummonedEvents = shuffle(this.enemySummonedEvents);

        this.enemySummonedEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.enemySummonedEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetEnemySummonedEvents();

    }

    get hasEnemySummonedEvents() {
        return this.enemySummonedEvents.length > 0;
    }

    // friend hurt events

    triggerFriendHurtEvents(player: Player, hurtPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.friendHurt != null) {
                this.setFriendHurtEvent({
                    callback: pet.friendHurt.bind(pet),
                    priority: pet.attack,
                    callbackPet: hurtPet
                })
            }
        }
    }
    
    setFriendHurtEvent(event: AbilityEvent) {
        event.abilityType = 'friendHurt';
        this.addEventToQueue(event);
    }

    resetFriendHurtEvents() {
        this.friendHurtEvents = [];
    }

    executeFriendHurtEvents() {
        // shuffle, so that same priority events are in random order
        this.friendHurtEvents = shuffle(this.friendHurtEvents);

        this.friendHurtEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendHurtEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetFriendHurtEvents();

    }

    get hasFriendHurtEvents() {
        return this.friendHurtEvents.length > 0;
    }

    // levl up events

    triggerLevelUpEvents(player: Player, levelUpPet: Pet) {
        this.triggerFriendlyLevelUpToyEvents(player, levelUpPet);
        for (let pet of player.petArray) {
            if (pet.anyoneLevelUp != null) {
                this.setLevelUpEvent({
                    callback: pet.anyoneLevelUp.bind(pet),
                    priority: pet.attack,
                    callbackPet: levelUpPet
                })
            }
        }
    }
    
    setLevelUpEvent(event: AbilityEvent) {
        event.abilityType = 'levelUp';
        this.addEventToQueue(event);
    }

    resetLevelUpEvents() {
        this.levelUpEvents = [];
    }

    executeLevelUpEvents() {
        // shuffle, so that same priority events are in random order
        this.levelUpEvents = shuffle(this.levelUpEvents);

        this.levelUpEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.levelUpEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetLevelUpEvents();

    }

    // empty front space events


    triggerEmptyFrontSpaceEvents(player: Player) {
        for (let pet of player.petArray) {
            if (pet.emptyFrontSpace != null) {
                this.setEmptyFrontSpaceEvent({
                    callback: pet.emptyFrontSpace.bind(pet),
                    priority: pet.attack
                })
            }
        }
    }
    
    setEmptyFrontSpaceEvent(event: AbilityEvent) {
        event.abilityType = 'emptyFrontSpace';
        this.addEventToQueue(event);
    }

    resetEmptyFrontSpaceEvents() {
        this.emptyFrontSpaceEvents = [];
    }

    executeEmptyFrontSpaceEvents() {
        // shuffle, so that same priority events are in random order
        this.emptyFrontSpaceEvents = shuffle(this.emptyFrontSpaceEvents);

        this.emptyFrontSpaceEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.emptyFrontSpaceEvents) {
            event.callback(this.gameService.gameApi, false);
        }
        
        this.resetEmptyFrontSpaceEvents();

    }

    get hasEmptyFrontSpaceEvents() {
        return this.emptyFrontSpaceEvents.length > 0;
    }
    // enemy hurt events

    /**
     * 
     * @param player opposite player of the pet that was hurt
     * @param pet pet that was hurt
     */
    triggerEnemyHurtEvents(player: Player, hurtPet: Pet) {
        for (let pet of player.petArray) {
            if (pet.enemyHurt != null) {
                this.setEnemyHurtEvent({
                    callback: pet.enemyHurt.bind(pet),
                    priority: pet.attack,
                    callbackPet: hurtPet
                })
            }
        }
    }
    
    setEnemyHurtEvent(event: AbilityEvent) {
        event.abilityType = 'enemyHurt';
        this.addEventToQueue(event);
    }

    resetEnemyHurtEvents() {
        this.enemyHurtEvents = [];
    }

    executeEnemyHurtEvents() {
        // shuffle, so that same priority events are in random order
        this.enemyHurtEvents = shuffle(this.enemyHurtEvents);

        this.enemyHurtEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.enemyHurtEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetEnemyHurtEvents();

    }

    get hasEnemyHurtEvents() {
        return this.enemyHurtEvents.length > 0;
    }

    // friend attacks events

    triggerFriendAttacksEvents(player: Player, attacksPet: Pet) {
        for (let pet of player.petArray) {
            if (pet == attacksPet) {
                continue;
            }
            if (pet.friendAttacks != null) {
                this.setFriendAttacksEvent({
                    callback: pet.friendAttacks.bind(pet),
                    priority: pet.attack,
                })
            }
        }
    }
    
    setFriendAttacksEvent(event: AbilityEvent) {
        this.friendAttacksEvents.push(event);
    }

    resetFriendAttacksEvents() {
        this.friendAttacksEvents = [];
    }

    executeFriendAttacksEvents() {
        // shuffle, so that same priority events are in random order
        this.friendAttacksEvents = shuffle(this.friendAttacksEvents);

        this.friendAttacksEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendAttacksEvents) {
            event.callback(this.gameService.gameApi, false);
        }
        
        this.resetFriendAttacksEvents();

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
                    callbackPet: attackingPet
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
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetBeforeFriendAttacksEvents();
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
                    callbackPet: jumpPet
                })
            }
        }
    }
    
    setFriendJumpedEvent(event: AbilityEvent) {
        this.friendJumpedEvents.push(event);
    }

    resetFriendJumpedEvents() {
        this.friendJumpedEvents = [];
    }

    executeFriendJumpedEvents() {
        // shuffle, so that same priority events are in random order
        this.friendJumpedEvents = shuffle(this.friendJumpedEvents);

        this.friendJumpedEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendJumpedEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, false);
        }
        
        this.resetFriendJumpedEvents();

    }

    // mana events
    setManaEvent(event: AbilityEvent) {
        event.abilityType = 'gainsMana';
        this.addEventToQueue(event);
    }

    resetManaEvents() {
        this.manaEvents = [];
    }

    executeManaEvents() {
        // shuffle, so that same priority events are in random order
        this.manaEvents = shuffle(this.manaEvents);

        this.manaEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.manaEvents) {
            event.callback();
        }
        
        this.resetManaEvents();
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
                    callbackPet: healthPet
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
            event.callback(this.gameApi, event.callbackPet);
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
                    callbackPet: pet
                });
            }
        }
    }

    setFriendGainedExperienceEvent(event: AbilityEvent) {
        this.friendGainedExperienceEvents.push(event);
    }

    private resetFriendGainedExperienceEvents() {
        this.friendGainedExperienceEvents = [];
    }

    executeFriendGainedExperienceEvents() {
        this.friendGainedExperienceEvents = shuffle(this.friendGainedExperienceEvents);

        this.friendGainedExperienceEvents.sort((a, b) => a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0);

        for (let event of this.friendGainedExperienceEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet);
        }
        
        this.resetFriendGainedExperienceEvents();
    }

    setAfterFaintEvent(event: AbilityEvent) {
        event.abilityType = 'afterFaint';
        this.addEventToQueue(event);
    }

    resetAfterFaintEvents() {
        this.afterFaintEvents = [];
    }

    executeAfterFaintEvents() {
        this.afterFaintEvents = shuffle(this.afterFaintEvents);
        
        this.afterFaintEvents.sort((a, b) => a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0);
        
        for (let event of this.afterFaintEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetAfterFaintEvents();
    }

    get hasAfterFaintEvents() {
        return this.afterFaintEvents.length > 0;
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
                    callbackPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendSummonedToyEvent(
                    {
                        callback: player.toy.friendSummoned.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        callbackPet: pet
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
            event.callback(this.gameService.gameApi, event.callbackPet, event.priority < 100, event.level);
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
                    callbackPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendlyLevelUpToyEvent(
                    {
                        callback: player.toy.friendlyLevelUp.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        callbackPet: pet
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
            event.callback(this.gameService.gameApi, event.callbackPet, event.priority < 100, event.level);
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
                    callbackPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendFaintsToyEvent(
                    {
                        callback: player.toy.friendFaints.bind(player.toy),
                        priority: +puma.attack,
                        level: +puma.level,
                        callbackPet: pet
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
            event.callback(this.gameService.gameApi, event.callbackPet, event.priority < 100, event.level);
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
                    callbackPet: pet
                }
            );

            let pumas = player.petArray.filter(pet => pet instanceof Puma) as Puma[];
            for (let puma of pumas) {
                this.setFriendJumpedToyEvent(
                    {
                        callback: player.toy.friendJumped.bind(player.toy),
                        priority: +puma.attack,
                        level: puma.level,
                        callbackPet: pet
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
            event.callback(this.gameService.gameApi, event.callbackPet, event.priority < 100, event.level);
        }
        
        this.resetFriendJumpedToyEvents();
    }



 
}