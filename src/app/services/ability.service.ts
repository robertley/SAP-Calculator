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
    private spawnEvents: AbilityEvent[] = [];
    private friendAheadAttacksEvents: AbilityEvent[]= [];
    private afterAttackEvents: AbilityEvent[]= [];
    private friendAheadFaintsEvents: AbilityEvent[]= [];
    constructor(private gameService: GameService) {
        
    }
    

    get hasAbilityCycleEvents() {
        return this.hasFaintEvents ||
            this.hasSummonedEvents ||
            this.hasHurtEvents
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
            event.callback();
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

}