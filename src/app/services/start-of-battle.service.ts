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
export class StartOfBattleService {

    private toyPetEvents: AbilityEvent[] = [];
    private nonToyPetEvents: AbilityEvent[] = [];
    private gameApi: GameAPI;
    constructor(private gameService: GameService) {

    }

    redoPriorities(pet: Pet) {
        // remove all events for this pet
        this.nonToyPetEvents = this.nonToyPetEvents.filter(event => event.pet != pet);

        for (let event of this.nonToyPetEvents) {
            event.priority = event.pet.attack;
        }
        
        this.executeNonToyPetEvents();
    }

    initStartOfBattleEvents() {
        this.gameApi = this.gameService.gameApi;
        for (let pet of this.gameApi.player.petArray) {
            if (pet.startOfBattle != null) {
                let events = this.toyPetEvents;
                if (!pet.toyPet) {
                    events = this.nonToyPetEvents;
                }
                events.push({
                    callback: pet.startOfBattle.bind(pet),
                    priority: pet.attack,
                    player: this.gameApi.player,
                    pet: pet
                })
            }
        }
        for (let pet of this.gameApi.opponet.petArray) {
            if (pet.startOfBattle != null) {
                let events = this.toyPetEvents;
                if (!pet.toyPet) {
                    events = this.nonToyPetEvents;
                }
                events.push({
                    callback: pet.startOfBattle.bind(pet),
                    priority: pet.attack,
                    player: this.gameApi.opponet,
                    pet: pet
                })
            }
        }
    }


    private resetToyPetEvents() {
        this.toyPetEvents = [];
    }

    private resetNonToyPetEvents() {
        this.nonToyPetEvents = [];
    }

    executeToyPetEvents() {
        // shuffle, so that same priority events are in random order
        this.toyPetEvents = shuffle(this.toyPetEvents);

        this.toyPetEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.toyPetEvents) {
            event.callback(this.gameApi);
        }

        this.resetToyPetEvents();
    }

    executeNonToyPetEvents() {
        // shuffle, so that same priority events are in random order
        this.nonToyPetEvents = shuffle(this.nonToyPetEvents);

        this.nonToyPetEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.nonToyPetEvents) {
            
            let reorder = event.callback(this.gameApi);

            if (reorder) {
                return this.redoPriorities(event.pet);
            }
        }
        
        this.resetNonToyPetEvents();
    }
}