import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { clone, cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { Pet } from "../classes/pet.class";

@Injectable({
    providedIn: "root"
})
export class AbilityService {

    private gameApi: GameAPI;
    private startOfBattleEvents: AbilityEvent[] = [];
    private hurtEvents: AbilityEvent[] = [];
    private faintEvents: AbilityEvent[] = [];
    private summonedEvents: AbilityEvent[] = [];
    private friendFaintsEvents: AbilityEvent[] = [];
    private spawnEvents: AbilityEvent[] = [];
    private friendAheadAttacksEvents: AbilityEvent[]= [];
    private afterAttackEvents: AbilityEvent[]= [];
    private friendAheadFaintsEvents: AbilityEvent[]= [];
    private knockOutEvents: AbilityEvent[]= [];
    private beforeAttackEvents: AbilityEvent[]= [];
    private equipmentBeforeAttackEvents: AbilityEvent[]= []; // egg
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
    private friendJumpedEvents: AbilityEvent[]= [];
    private manaEvents: AbilityEvent[]= [];
    constructor(private gameService: GameService) {
        
    }
    

    get hasAbilityCycleEvents() {
        return this.hasFaintEvents ||
            this.hasSummonedEvents ||
            this.hasHurtEvents ||
            this.hasEquipmentBeforeAttackEvents || 
            this.hasFriendHurtEvents ||
            this.hasEnemyHurtEvents ||
            this.hasKnockOutEvents ||
            this.hasEmptyFrontSpaceEvents ||
            this.hasFriendFaintsEvents || 
            this.hasSpawnEvents ||
            this.hasFriendAheadFaintsEvents ||
            this.hasEnemySummonedEvents
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

    // Start of Battle
    
    initStartOfBattleEvents() {
        this.gameApi = this.gameService.gameApi;
        for (let pet of this.gameApi.player.petArray) {
            if (pet.startOfBattle != null) {
                this.startOfBattleEvents.push({
                    callback: () => { pet.startOfBattle(this.gameApi) },
                    priority: pet.attack,
                    player: this.gameApi.player
                })
            }
        }
        for (let pet of this.gameApi.opponet.petArray) {
            if (pet.startOfBattle != null) {
                this.startOfBattleEvents.push({
                    callback: () => { pet.startOfBattle(this.gameApi) },
                    priority: pet.attack,
                    player: this.gameApi.opponet
                })
            }
        }

        this.executeStartOfBattleEvents();
    }

    setStartOfBattleEvent(event: AbilityEvent) {
        this.startOfBattleEvents.push(event);
    }

    private resetStartOfBattleEvents() {
        this.startOfBattleEvents = [];
    }

    private executeStartOfBattleEvents() {
        // shuffle, so that same priority events are in random order
        this.startOfBattleEvents = shuffle(this.startOfBattleEvents);

        this.startOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.startOfBattleEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetStartOfBattleEvents();
    }

    // Hurt
    setHurtEvent(event: AbilityEvent) {
        this.hurtEvents.push(event);
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
        this.faintEvents.push(event);
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
        this.summonedEvents.push(event);
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

    // spawn events
    
    setSpawnEvent(event: AbilityEvent) {
        this.spawnEvents.push(event);
    }

    resetSpawnEvents() {
        this.spawnEvents = [];
    }

    executeSpawnEvents() {
        // // shuffle, so that same priority events are in random order
        this.spawnEvents = shuffle(this.spawnEvents);

        this.spawnEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.spawnEvents) {
            event.callback();
        }
        
        this.resetSpawnEvents();
    }

    get hasSpawnEvents() {
        return this.spawnEvents.length > 0;
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
        this.friendAheadFaintsEvents.push(event);
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
        this.knockOutEvents.push(event);
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
        this.friendFaintsEvents.push(event);
    }

    resetFriendFaintsEvents() {
        this.friendFaintsEvents = [];
    }

    executeFriendFaintsEvents() {
        // shuffle, so that same priority events are in random order
        this.friendFaintsEvents = shuffle(this.friendFaintsEvents);

        this.friendFaintsEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.friendFaintsEvents) {
            event.callback(this.gameService.gameApi, event.callbackPet, null);
        }
        
        this.resetFriendFaintsEvents();
    }

    get hasFriendFaintsEvents() {
        return this.friendFaintsEvents.length > 0;
    }
    

    // before attack

    setBeforeAttackEvent(event: AbilityEvent) {
        this.beforeAttackEvents.push(event);
    }

    resetBeforeAttackEvents() {
        this.beforeAttackEvents = [];
    }

    executeBeforeAttackEvents() {
        // shuffle, so that same priority events are in random order
        this.beforeAttackEvents = shuffle(this.beforeAttackEvents);

        this.beforeAttackEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.beforeAttackEvents) {
            event.callback(this.gameService.gameApi);
        }
        
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


    // friend gained perk

    triggerFriendGainedPerkEvents(perkPet: Pet) {
        for (let pet of perkPet.parent.petArray) {
            // if (pet == perkPet) {
            //     return;
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
        this.friendGainedPerkEvents.push(event);
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
        this.friendGainedAilmentEvents.push(event);
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
        this.enemyGainedAilmentEvents.push(event);
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
        this.friendlyToyBrokeEvents.push(event);
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
        this.transformEvents.push(event);
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
        this.enemySummonedEvents.push(event);
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
        this.friendHurtEvents.push(event);
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
        this.levelUpEvents.push(event);
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
        this.emptyFrontSpaceEvents.push(event);
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
        this.enemyHurtEvents.push(event);
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
        this.manaEvents.push(event);
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
}