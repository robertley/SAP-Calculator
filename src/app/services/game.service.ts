import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";
import { GameAPI } from "../interfaces/gameAPI.interface";

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
}