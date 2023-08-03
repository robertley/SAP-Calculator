import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { shuffle } from "lodash";
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
    private friendlyToyBrokeEvents: AbilityEvent[]= [];
    constructor(private gameService: GameService) {
        
    }
    

    get hasAbilityCycleEvents() {
        return this.hasFaintEvents ||
            this.hasSummonedEvents ||
            this.hasHurtEvents ||
            this.hasEquipmentBeforeAttackEvents
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
            event.callback(this.gameService.gameApi);
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
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendSummoned != null) {
                this.setSummonedEvent({
                    callback: () => { pet.friendSummoned(summonedPet) },
                    priority: pet.attack
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
            event.callback();
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
        // this.summonedEvents = shuffle(this.summonedEvents);

        // this.summonedEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.spawnEvents) {
            event.callback();
        }
        
        this.resetSpawnEvents();
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
            event.callback(this.gameService.gameApi);
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
            event.callback();
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
            event.callback();
        }
        
        this.resetFriendAheadFaintsEvents();
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
            event.callback(this.gameService.gameApi);
        }
        
        this.resetKnockOutEvents();
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
            event.callback(this.gameService.gameApi, null, event.callbackPet);
        }
        
        this.resetFriendFaintsEvents();
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
                    priority: pet.attack
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
            event.callback(this.gameService.gameApi);
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

}