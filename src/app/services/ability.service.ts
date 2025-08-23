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
    
    // Priority mapping (lower number = higher priority)
    private readonly ABILITY_PRIORITIES = {
        'levelUp': 1,
        'friendLevelUp': 2, //not added
        'friendlyLevelUp': 2, //not added
        'hurt': 3,
        'friendHurt': 4,
        'enemyHurt': 4,
        'gainsMana': 5,
        'summoned': 6,
        'friendSummoned': 7,
        'enemySummoned': 7,
        'enemyPushed': 7,
        'friendJumped': 8,
        'enemyJumped': 8,
        'faint': 9,
        'friendAheadFaints': 10,
        'afterFaint': 11,
        'friendFaints': 12,
        'enemyFaints': 12, //not added
        'friendlyToyBroke': 12,
        'knockOut': 13,
        'transform': 14,
        'friendTransformed': 14.5,
        'friendGainedExperience': 15,
        'friendAteFood': 16,
        'eatsFood': 16,
        'counter': 17,
        'friendLostPerk': 18,
        'gainPerk': 19,
        'gainAilment': 19, //not added
        'friendlyGainedPerk': 20,
        'enemyGainedPerk': 20,
        'friendlyGainedAilment': 20,
        'enemyGainedAilment': 20,
        'petFlung': 21, //not added
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
        
        switch (event.abilityType) {
            case 'faint':
            case 'beforeStartOfBattle':
            case 'afterFaint':
            case 'equipmentBeforeAttack':
            case 'summoned':
            case 'transform':
                // Basic callback: callback(gameApi)
                event.callback(gameApi);
                break;
            case 'hurt':
            case 'friendHurt':
            case 'knockOut':
            case 'enemyHurt':
            case 'friendAheadFaints':
            case 'friendFaints':
            case 'eatsFood':
            case 'friendAteFood':
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
            case 'enemyJumped':
            case 'friendTransformed':
            case 'friendGainsHealth':
            case 'friendlyLevelUp':
            case 'friendSummoned':
                // Callback with pet: callback(gameApi, callbackPet)
                event.callback(gameApi, event.callbackPet);
                break;
                
            case 'afterAttack':
            case 'enemySummoned':
            case 'enemyPushed':
            case 'friendlyToyBroke':
            case 'gainAilment':
            case 'emptyFrontSpace':
                // Callback with boolean: callback(gameApi, callbackPet, false)
                event.callback(gameApi, event.callbackPet, false);
                break;
                
            case 'friendJumpedToy':
            case 'emptyFrontSpaceToy':
                // Special toy callback: callback(gameApi, priority < 100, level, priority)
                event.callback(gameApi, event.priority < 100, event.level, event.priority);
                break;
                
            case 'gainsMana':
                event.callback(null);
                break;
            case 'manaSnipe':
            case 'counter':
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
                    callbackPet: summonedPet,
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
        for (let pet of faintedPet.parent.petArray) {
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendFaints != null) {
                this.setFriendFaintsEvent({
                    callback: pet.friendFaints.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    callbackPet: faintedPet
                })
            }
        }
    }

    setFriendFaintsEvent(event: AbilityEvent) {
        event.abilityType = 'friendFaints';
        this.addEventToQueue(event);
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
            //this.checkAndAddNewBeforeAttackEvents();
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
                    callbackPet: perkPet
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
                    callbackPet: foodPet
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
                    callbackPet: perkPet
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
                    callbackPet: perkPet
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
                    callbackPet: perkPet
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
                    callbackPet: perkPet
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
            if (pet.friendTransformed != null) {
                this.setFriendTransformedEvent({
                    callback: pet.friendTransformed.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    callbackPet: transformedPet
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
                    callbackPet: summonPet
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
                    callbackPet: pushedPet
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
        for (let pet of player.petArray) {
            if (pet.friendHurt != null) {
                this.setFriendHurtEvent({
                    callback: pet.friendHurt.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    callbackPet: hurtPet
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
                    callbackPet: levelUpPet
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
        for (let pet of player.petArray) {
            if (pet.enemyHurt != null) {
                this.setEnemyHurtEvent({
                    callback: pet.enemyHurt.bind(pet),
                    priority: pet.attack,
                    pet: pet,
                    callbackPet: hurtPet
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
                    callbackPet: attacksPet,
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
                callbackPet: attacksPet,
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
                callbackPet: attacksPet,
                abilityType: 'adjacentFriendAttacks'
            });
        }
        // Check pet behind
        if (attacksPet.petBehind(null, true)?.adjacentAttacked != null) {
            this.setAfterFriendAttackEvent({
                callback: () => attacksPet.petBehind(null, true).adjacentAttacked(this.gameApi, attacksPet),
                priority: attacksPet.petBehind(null, true).attack,
                pet: attacksPet.petBehind(null, true),
                callbackPet: attacksPet,
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
            event.callback(this.gameService.gameApi, event.callbackPet, false);
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
                    callbackPet: attackingEnemyPet,
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
                    callbackPet: jumpPet
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
                    callbackPet: jumpPet
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
                    pet: p,
                    callbackPet: pet
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