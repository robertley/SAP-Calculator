import { GameAPI } from "../interfaces/gameAPI.interface";
import { LogService } from "../services/log.servicee";
import { ToyService } from "../services/toy.service";
import { Player } from "./player.class";

export class Toy {
    name: string;
    onBreak?(gameApi?: GameAPI);
    startOfBattle?(gameApi?: GameAPI);
    parent: Player;
    level: 1 | 2 | 3
    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: 1 | 2 | 3) {
        this.parent = parent;
        this.level = level;
    }
}