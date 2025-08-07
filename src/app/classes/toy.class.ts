import { GameAPI } from "../interfaces/gameAPI.interface";
import { LogService } from "../services/log.service";
import { ToyService } from "../services/toy.service";
import { Pet } from "./pet.class";
import { Player } from "./player.class";

export class Toy {
    name: string;
    onBreak?(gameApi?: GameAPI, puma?: boolean);
    startOfBattle?(gameApi?: GameAPI, puma?: boolean);
    emptyFromSpace?(gameApi?: GameAPI, puma?: boolean, level?: number, priority?: number);
    friendSummoned?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
    friendlyLevelUp?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
    friendFaints?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
    friendJumped?(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number);
    parent: Player;
    level: number;
    tier: number;
    used: boolean = false;
    triggers = 0;
    constructor(protected logService: LogService, protected toyService: ToyService, parent: Player, level: number) {
        this.parent = parent;
        this.level = level;
    }
}