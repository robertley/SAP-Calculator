import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { shuffle } from "lodash";
import { GameService } from "./game.service";

@Injectable({
    providedIn: "root"
})
export class StartOfBattleService {

    private events: AbilityEvent[] = [];
    private gameApi: GameAPI;
    constructor(private gameService: GameService) {

    }

    initStartOfBattleEvents() {
        this.gameApi = this.gameService.gameApi;
        for (let pet of this.gameApi.player.petArray) {
            if (pet.startOfBattle != null) {
                this.events.push({
                    callback: () => { pet.startOfBattle(this.gameApi) },
                    priority: pet.attack,
                    player: this.gameApi.player
                })
            }
        }
        for (let pet of this.gameApi.opponet.petArray) {
            if (pet.startOfBattle != null) {
                this.events.push({
                    callback: () => { pet.startOfBattle(this.gameApi) },
                    priority: pet.attack,
                    player: this.gameApi.opponet
                })
            }
        }

        this.executeEvents();
    }

    private setEvent(event: AbilityEvent) {
        this.events.push(event);
    }

    private reset() {
        this.events = [];
    }

    private executeEvents() {
        // shuffle, so that same priority events are in random order
        this.events = shuffle(this.events);

        this.events.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.events) {
            event.callback(this.gameApi);
        }
        
        this.reset();
    }
}