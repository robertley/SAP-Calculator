import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { AbilityService } from "./ability.service";

@Injectable({
    providedIn: "root"
})
export class GameService {

    gameApi: GameAPI;

    constructor() {
    }

    init(player: Player, opponent: Player) {
        this.gameApi = {
            player: player,
            opponet: opponent
        }
    }

    setTierGroupPets(tier3Pets: string[]) {
        this.gameApi.tier3Pets = tier3Pets;
    }
}